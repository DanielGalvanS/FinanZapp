from fastapi import APIRouter, File, UploadFile, HTTPException, Depends, Form
from typing import Dict
from uuid import UUID
from datetime import datetime
from decimal import Decimal
from app.services.ocr_service import ocr_service
from app.utils.mexico_utils import (
    validate_rfc,
    calculate_iva,
    is_deductible,
    suggest_category_from_merchant
)
from app.database import get_db
from app.services.storage_service import storage_service
from app.services.ocr_postprocessor import ocr_postprocessor
from supabase import Client
import tempfile
import os

router = APIRouter()

@router.post("/scan", response_model=Dict)
async def scan_receipt(file: UploadFile = File(...)):
    """
    Escanea un recibo y extrae toda la información

    - **file**: Imagen del recibo (JPEG, PNG)

    Returns:
        - Texto completo extraído
        - Datos estructurados (monto, fecha, RFC, etc.)
        - Categoría sugerida
        - Validación de deducibilidad
    """
    # Validar tipo de archivo
    if not file.content_type.startswith('image/'):
        raise HTTPException(status_code=400, detail="El archivo debe ser una imagen")

    try:
        # Leer bytes de la imagen
        image_bytes = await file.read()

        # Escanear con Document AI (pasando el mime_type correcto)
        ocr_result = await ocr_service.scan_receipt_from_bytes(
            image_bytes=image_bytes,
            mime_type=file.content_type or "image/jpeg"
        )

        if not ocr_result.get("success"):
            raise HTTPException(status_code=400, detail=ocr_result.get("error"))

        # Post-procesamiento INTELIGENTE (nivel enterprise)
        enhanced_data = ocr_postprocessor.process(ocr_result, ocr_result["full_text"])

        # Usar datos mejorados
        extracted = {
            **ocr_result["extracted_data"],
            'merchant_name': enhanced_data['merchant_name'],
            'rfc': enhanced_data['rfc'],
            'total_amount': enhanced_data['total_amount'],
            'date': enhanced_data['date'],
        }

        # Post-procesamiento con utilidades de México
        response = {
            "full_text": ocr_result["full_text"],
            "extracted": extracted,
            "confidence": enhanced_data['overall_confidence'],
            "confidence_breakdown": {
                "merchant": enhanced_data['merchant_confidence'],
                "rfc": enhanced_data['rfc_confidence'],
                "amount": enhanced_data['amount_confidence'],
                "date": enhanced_data['date_confidence'],
                "category": enhanced_data['category_confidence'],
            },
        }

        # Validar RFC si existe
        if extracted.get("rfc"):
            rfc_validation = validate_rfc(extracted["rfc"])
            response["rfc_validation"] = rfc_validation
        else:
            response["rfc_validation"] = {"valid": False, "error": "No se encontró RFC"}

        # Calcular IVA si hay monto total
        if extracted.get("total_amount"):
            # Intentar calcular IVA
            from decimal import Decimal
            total = Decimal(str(extracted["total_amount"]))

            if extracted.get("tax_amount"):
                # Ya tiene IVA extraído
                tax = Decimal(str(extracted["tax_amount"]))
                subtotal = total - tax
                response["tax_breakdown"] = {
                    "subtotal": float(subtotal),
                    "iva": float(tax),
                    "total": float(total)
                }
            else:
                # Calcular IVA del total
                from app.utils.mexico_utils import extract_iva_from_total
                response["tax_breakdown"] = extract_iva_from_total(total)

        # Sugerir categoría (usar el mejorado del post-processor)
        response["suggested_category"] = enhanced_data['suggested_category']
        response["category_confidence"] = enhanced_data['category_confidence']

        # Verificar si es deducible
        has_rfc = response["rfc_validation"].get("valid", False)
        category = response.get("suggested_category", "")

        deductible_check = is_deductible(
            category=category,
            has_rfc=has_rfc,
            has_invoice=False,  # No podemos saber si tiene CFDI del recibo
            merchant_type=extracted.get("merchant_name")
        )
        response["deductible_info"] = deductible_check

        return response

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error al procesar imagen: {str(e)}")

@router.post("/validate-rfc")
async def validate_rfc_endpoint(rfc: str):
    """
    Valida un RFC mexicano

    - **rfc**: RFC a validar (12-13 caracteres)
    """
    result = validate_rfc(rfc)
    return result

@router.post("/calculate-tax")
async def calculate_tax(subtotal: float):
    """
    Calcula el IVA (16%) sobre un subtotal

    - **subtotal**: Monto sin IVA
    """
    from decimal import Decimal
    result = calculate_iva(Decimal(str(subtotal)))
    return result

@router.post("/check-deductible")
async def check_deductible(
    category: str,
    has_rfc: bool,
    has_invoice: bool,
    merchant_name: str = None
):
    """
    Verifica si un gasto es deducible

    - **category**: Categoría del gasto
    - **has_rfc**: Si tiene RFC válido
    - **has_invoice**: Si tiene factura (CFDI)
    - **merchant_name**: Nombre del comercio (opcional)
    """
    result = is_deductible(
        category=category,
        has_rfc=has_rfc,
        has_invoice=has_invoice,
        merchant_type=merchant_name
    )
    return result

@router.post("/scan-and-create-expense", response_model=Dict)
async def scan_and_create_expense(
    file: UploadFile = File(...),
    project_id: str = Form(...),
    db: Client = Depends(get_db)
):
    """
    **ENDPOINT PRINCIPAL: Escanear recibo y crear expense automáticamente**

    Este es el flujo completo de automatización:
    1. Escanea el recibo con Document AI
    2. Extrae todos los datos (monto, fecha, comercio, RFC, IVA, etc.)
    3. Valida RFC y calcula deducibilidad
    4. Sugiere categoría basada en el comercio
    5. Crea el expense automáticamente en la BD
    6. Retorna el expense creado con todos los datos OCR

    - **file**: Imagen del recibo (JPEG, PNG)
    - **project_id**: UUID del proyecto donde crear el expense

    Returns:
        - Expense creado con ID
        - Todos los datos extraídos del OCR
        - Validaciones y sugerencias
    """
    # Validar tipo de archivo
    if not file.content_type.startswith('image/'):
        raise HTTPException(status_code=400, detail="El archivo debe ser una imagen")

    try:
        # PASO 1: Escanear recibo con Document AI
        image_bytes = await file.read()
        ocr_result = await ocr_service.scan_receipt_from_bytes(
            image_bytes=image_bytes,
            mime_type=file.content_type or "image/jpeg"
        )

        if not ocr_result.get("success"):
            raise HTTPException(status_code=400, detail=ocr_result.get("error"))

        # PASO 2: Post-procesamiento INTELIGENTE (nivel enterprise)
        enhanced_data = ocr_postprocessor.process(ocr_result, ocr_result["full_text"])

        # Usar datos mejorados en lugar de los originales
        extracted = {
            **ocr_result["extracted_data"],
            'merchant_name': enhanced_data['merchant_name'],
            'rfc': enhanced_data['rfc'],
            'total_amount': enhanced_data['total_amount'],
            'date': enhanced_data['date'],
        }

        # PASO 3: Post-procesamiento adicional con utilidades de México
        # Validar RFC si existe
        rfc_validation = {"valid": False, "error": "No se encontró RFC"}
        if extracted.get("rfc"):
            rfc_validation = validate_rfc(extracted["rfc"])

        # Calcular/validar IVA
        tax_breakdown = None
        if extracted.get("total_amount"):
            total = Decimal(str(extracted["total_amount"]))
            if extracted.get("tax_amount"):
                tax = Decimal(str(extracted["tax_amount"]))
                subtotal = total - tax
                tax_breakdown = {
                    "subtotal": float(subtotal),
                    "iva": float(tax),
                    "total": float(total)
                }
            else:
                from app.utils.mexico_utils import extract_iva_from_total
                tax_breakdown = extract_iva_from_total(total)

        # Sugerir categoría (usar el mejorado del post-processor)
        suggested_category = enhanced_data['suggested_category']
        category_confidence = enhanced_data['category_confidence']

        # Verificar deducibilidad
        has_rfc = rfc_validation.get("valid", False)
        deductible_info = is_deductible(
            category=suggested_category,
            has_rfc=has_rfc,
            has_invoice=False,
            merchant_type=extracted.get("merchant_name")
        )

        # PASO 3: Preparar datos para crear expense
        # TODO: Obtener user_id del token JWT
        temp_user_id = "00000000-0000-0000-0000-000000000000"

        # Usar datos extraídos o valores por defecto
        expense_name = extracted.get("merchant_name") or "Gasto sin nombre"
        expense_amount = extracted.get("total_amount") if extracted.get("total_amount") else 0.01  # Mínimo 0.01

        # NUEVO: Mapear categoría sugerida a category_id en la BD
        category_id = None
        if suggested_category and suggested_category != "Sin categoría" and suggested_category != "Otros":
            try:
                # Buscar categoría en la BD por nombre
                category_result = db.table("categories")\
                    .select("id")\
                    .eq("name", suggested_category)\
                    .eq("is_system", True)\
                    .limit(1)\
                    .execute()

                if category_result.data and len(category_result.data) > 0:
                    category_id = category_result.data[0]["id"]
            except Exception as e:
                print(f"Error al buscar categoría: {e}")
                # Si falla, dejamos category_id como None

        # Validar y limpiar fecha
        expense_date = None
        raw_date = extracted.get("date")
        if raw_date:
            try:
                # Intentar parsear la fecha para validar que sea válida
                if isinstance(raw_date, str):
                    # Verificar que sea un formato ISO válido o convertible
                    parsed_date = datetime.fromisoformat(raw_date.replace('Z', '+00:00'))
                    expense_date = parsed_date.isoformat()
                else:
                    expense_date = datetime.now().isoformat()
            except (ValueError, AttributeError):
                # Si la fecha es inválida, usar fecha actual
                expense_date = datetime.now().isoformat()
        else:
            expense_date = datetime.now().isoformat()

        # Preparar datos del expense
        expense_data = {
            "user_id": temp_user_id,
            "project_id": project_id,
            "category_id": category_id,  # Ya está mapeado arriba
            "name": expense_name,
            "description": f"Escaneado automáticamente - {extracted.get('merchant_address', '')}".strip(),
            "amount": str(expense_amount),
            "date": expense_date,
            # Datos OCR adicionales
            "merchant_name": extracted.get("merchant_name"),
            "merchant_address": extracted.get("merchant_address"),
            "tax_amount": str(extracted.get("tax_amount")) if extracted.get("tax_amount") else None,
            "payment_method": extracted.get("payment_method"),
            "rfc": extracted.get("rfc"),
            "is_deductible": deductible_info.get("deductible", False),
            "has_invoice": False,
        }

        # PASO 4: Subir imagen del recibo a Storage
        file_extension = file.content_type.split('/')[-1] if file.content_type else 'jpg'
        receipt_url = await storage_service.upload_receipt_image(
            db=db,
            image_bytes=image_bytes,
            file_extension=file_extension
        )

        # PASO 5: Insertar expense en Supabase
        result = db.table("expenses").insert(expense_data).execute()

        if not result.data:
            raise HTTPException(status_code=400, detail="Error al crear gasto desde OCR")

        expense_id = result.data[0]["id"]

        # PASO 6: Guardar imagen del recibo en tabla receipts
        if receipt_url:
            receipt_data = {
                "expense_id": expense_id,
                "image_url": receipt_url,
                "ocr_text": ocr_result["full_text"],
                "ocr_data": extracted  # Guardar datos estructurados como JSONB
            }
            db.table("receipts").insert(receipt_data).execute()

        # PASO 7: Retornar respuesta completa con datos mejorados
        return {
            "success": True,
            "message": "Expense creado automáticamente desde recibo",
            "expense_id": expense_id,
            "expense": result.data[0],
            "receipt_url": receipt_url,
            "ocr_data": {
                "extracted": extracted,
                "full_text": ocr_result["full_text"],
                "confidence": enhanced_data['overall_confidence'],  # Confidence mejorado
                "rfc_validation": rfc_validation,
                "tax_breakdown": tax_breakdown,
                "suggested_category": suggested_category,
                "category_confidence": category_confidence,
                "deductible_info": deductible_info,
                # Confidence scores detallados
                "confidence_breakdown": {
                    "merchant": enhanced_data['merchant_confidence'],
                    "rfc": enhanced_data['rfc_confidence'],
                    "amount": enhanced_data['amount_confidence'],
                    "date": enhanced_data['date_confidence'],
                    "category": enhanced_data['category_confidence'],
                    "overall": enhanced_data['overall_confidence'],
                },
                "processing_method": enhanced_data['processing_method']
            }
        }

    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error al procesar recibo y crear expense: {str(e)}")
