from fastapi import APIRouter, HTTPException, Depends
from typing import List, Optional
from uuid import UUID
from app.schemas.expense import ExpenseCreate, ExpenseUpdate, ExpenseResponse
from app.database import get_db
from supabase import Client

router = APIRouter()

@router.post("/", response_model=dict, status_code=201)
async def create_expense(
    expense: ExpenseCreate,
    db: Client = Depends(get_db)
):
    """
    Crear un nuevo gasto

    **Por ahora sin auth - en producción validar usuario**
    """
    try:
        # TODO: Obtener user_id del token JWT
        # Por ahora usamos un user_id temporal
        temp_user_id = "00000000-0000-0000-0000-000000000000"

        # Preparar datos para insertar
        expense_data = {
            "user_id": temp_user_id,
            "project_id": str(expense.project_id),
            "category_id": str(expense.category_id) if expense.category_id else None,
            "name": expense.name,
            "description": expense.description,
            "amount": str(expense.amount),
            "date": expense.date.isoformat(),
        }

        # Insertar en Supabase
        result = db.table("expenses").insert(expense_data).execute()

        if not result.data:
            raise HTTPException(status_code=400, detail="Error al crear gasto")

        expense_id = result.data[0]["id"]

        # Agregar recibos si hay
        if expense.receipts:
            for receipt_url in expense.receipts:
                receipt_data = {
                    "expense_id": expense_id,
                    "image_url": receipt_url
                }
                db.table("receipts").insert(receipt_data).execute()

        return {
            "success": True,
            "message": "Gasto creado exitosamente",
            "expense_id": expense_id,
            "data": result.data[0]
        }

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error al crear gasto: {str(e)}")

@router.get("/", response_model=dict)
async def get_expenses(
    project_id: Optional[UUID] = None,
    category_id: Optional[UUID] = None,
    limit: int = 50,
    offset: int = 0,
    db: Client = Depends(get_db)
):
    """
    Obtener lista de gastos con filtros opcionales
    """
    try:
        # TODO: Filtrar por user_id del token
        query = db.table("expenses").select("*, receipts(*), comments(*)")

        # Aplicar filtros
        if project_id:
            query = query.eq("project_id", str(project_id))

        if category_id:
            query = query.eq("category_id", str(category_id))

        # Ordenar por fecha descendente
        query = query.order("date", desc=True)

        # Paginación
        query = query.range(offset, offset + limit - 1)

        result = query.execute()

        return {
            "success": True,
            "count": len(result.data),
            "data": result.data
        }

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error al obtener gastos: {str(e)}")

@router.get("/{expense_id}", response_model=dict)
async def get_expense(
    expense_id: UUID,
    db: Client = Depends(get_db)
):
    """
    Obtener un gasto por ID
    """
    try:
        result = db.table("expenses")\
            .select("*, receipts(*), comments(*, user:users(id, full_name, avatar_url))")\
            .eq("id", str(expense_id))\
            .single()\
            .execute()

        if not result.data:
            raise HTTPException(status_code=404, detail="Gasto no encontrado")

        return {
            "success": True,
            "data": result.data
        }

    except Exception as e:
        if "not found" in str(e).lower():
            raise HTTPException(status_code=404, detail="Gasto no encontrado")
        raise HTTPException(status_code=500, detail=f"Error al obtener gasto: {str(e)}")

@router.put("/{expense_id}", response_model=dict)
async def update_expense(
    expense_id: UUID,
    expense: ExpenseUpdate,
    db: Client = Depends(get_db)
):
    """
    Actualizar un gasto
    """
    try:
        # Preparar datos para actualizar (solo campos no None)
        update_data = {}

        if expense.name is not None:
            update_data["name"] = expense.name
        if expense.description is not None:
            update_data["description"] = expense.description
        if expense.amount is not None:
            update_data["amount"] = str(expense.amount)
        if expense.date is not None:
            update_data["date"] = expense.date.isoformat()
        if expense.category_id is not None:
            update_data["category_id"] = str(expense.category_id)

        if not update_data:
            raise HTTPException(status_code=400, detail="No hay datos para actualizar")

        # Actualizar en Supabase
        result = db.table("expenses")\
            .update(update_data)\
            .eq("id", str(expense_id))\
            .execute()

        if not result.data:
            raise HTTPException(status_code=404, detail="Gasto no encontrado")

        return {
            "success": True,
            "message": "Gasto actualizado exitosamente",
            "data": result.data[0]
        }

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error al actualizar gasto: {str(e)}")

@router.delete("/{expense_id}", response_model=dict)
async def delete_expense(
    expense_id: UUID,
    db: Client = Depends(get_db)
):
    """
    Eliminar un gasto
    """
    try:
        # TODO: Validar que el usuario sea dueño del gasto

        result = db.table("expenses")\
            .delete()\
            .eq("id", str(expense_id))\
            .execute()

        if not result.data:
            raise HTTPException(status_code=404, detail="Gasto no encontrado")

        return {
            "success": True,
            "message": "Gasto eliminado exitosamente"
        }

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error al eliminar gasto: {str(e)}")

@router.post("/{expense_id}/comments", response_model=dict)
async def add_comment(
    expense_id: UUID,
    text: str,
    db: Client = Depends(get_db)
):
    """
    Agregar un comentario a un gasto
    """
    try:
        # TODO: Obtener user_id del token
        temp_user_id = "00000000-0000-0000-0000-000000000000"

        comment_data = {
            "expense_id": str(expense_id),
            "user_id": temp_user_id,
            "text": text
        }

        result = db.table("comments").insert(comment_data).execute()

        if not result.data:
            raise HTTPException(status_code=400, detail="Error al agregar comentario")

        return {
            "success": True,
            "message": "Comentario agregado",
            "data": result.data[0]
        }

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error al agregar comentario: {str(e)}")

@router.delete("/comments/{comment_id}", response_model=dict)
async def delete_comment(
    comment_id: UUID,
    db: Client = Depends(get_db)
):
    """
    Eliminar un comentario
    """
    try:
        # TODO: Validar que el usuario sea dueño del comentario

        result = db.table("comments")\
            .delete()\
            .eq("id", str(comment_id))\
            .execute()

        if not result.data:
            raise HTTPException(status_code=404, detail="Comentario no encontrado")

        return {
            "success": True,
            "message": "Comentario eliminado"
        }

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error al eliminar comentario: {str(e)}")
