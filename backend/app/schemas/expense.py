from pydantic import BaseModel, Field
from datetime import datetime
from typing import Optional, List
from uuid import UUID
from decimal import Decimal

class ReceiptBase(BaseModel):
    image_url: str

class ReceiptCreate(ReceiptBase):
    pass

class ReceiptResponse(ReceiptBase):
    id: UUID
    expense_id: UUID
    thumbnail_url: Optional[str]
    ocr_text: Optional[str]
    created_at: datetime

    class Config:
        from_attributes = True

class CommentBase(BaseModel):
    text: str = Field(..., min_length=1, max_length=1000)

class CommentCreate(CommentBase):
    pass

class CommentResponse(CommentBase):
    id: UUID
    expense_id: UUID
    user_id: UUID
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True

class ExpenseBase(BaseModel):
    name: str = Field(..., min_length=1, max_length=255)
    description: Optional[str] = None
    amount: Decimal = Field(..., gt=0, decimal_places=2)
    date: datetime
    category_id: Optional[UUID] = None
    project_id: UUID

class ExpenseCreate(ExpenseBase):
    receipts: Optional[List[str]] = []  # URLs de imágenes
    # Datos OCR opcionales
    merchant_name: Optional[str] = None
    merchant_address: Optional[str] = None
    tax_amount: Optional[Decimal] = None
    payment_method: Optional[str] = None
    rfc: Optional[str] = None

class ExpenseCreateFromOCR(BaseModel):
    """
    Schema para crear expense automáticamente desde OCR
    Solo project_id es requerido
    """
    project_id: UUID
    # Campos opcionales que se llenan con OCR
    name: Optional[str] = None
    description: Optional[str] = None
    amount: Optional[Decimal] = None
    date: Optional[datetime] = None
    category_id: Optional[UUID] = None

class ExpenseUpdate(BaseModel):
    name: Optional[str] = Field(None, min_length=1, max_length=255)
    description: Optional[str] = None
    amount: Optional[Decimal] = Field(None, gt=0)
    date: Optional[datetime] = None
    category_id: Optional[UUID] = None

class ExpenseResponse(ExpenseBase):
    id: UUID
    user_id: UUID

    # Datos OCR
    merchant_name: Optional[str]
    merchant_address: Optional[str]
    tax_amount: Optional[Decimal]
    payment_method: Optional[str]
    rfc: Optional[str]

    # Datos México
    is_deductible: bool
    has_invoice: bool
    invoice_uuid: Optional[str]

    # ML predictions
    category_confidence: Optional[Decimal]
    is_recurring: bool
    is_anomaly: bool

    # Relaciones
    receipts: List[ReceiptResponse] = []
    comments: List[CommentResponse] = []

    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True

class ExpenseWithOCR(ExpenseResponse):
    """Expense con datos extraídos del OCR"""
    ocr_extracted: dict  # Datos crudos del OCR
