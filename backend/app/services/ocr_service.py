from google.cloud import documentai_v1 as documentai
from google.api_core.client_options import ClientOptions
from typing import Dict, Optional, List
from datetime import datetime
import os
from app.config import settings

class OCRService:
    """Servicio de OCR para escanear recibos con Google Document AI Receipt Parser"""

    def __init__(self):
        # Configurar la variable de entorno para las credenciales
        if settings.google_application_credentials:
            os.environ['GOOGLE_APPLICATION_CREDENTIALS'] = settings.google_application_credentials

        # Configurar cliente de Document AI
        opts = ClientOptions(api_endpoint=f"{settings.document_ai_location}-documentai.googleapis.com")
        self.client = documentai.DocumentProcessorServiceClient(client_options=opts)

        # Configurar el processor
        self.processor_name = self.client.processor_path(
            settings.google_project_id,
            settings.document_ai_location,
            settings.document_ai_processor_id
        )

    async def scan_receipt(self, image_path: str) -> Dict:
        """
        Escanea un recibo y extrae toda la información usando Document AI

        Args:
            image_path: Ruta a la imagen del recibo

        Returns:
            Dict con toda la información extraída estructurada
        """
        # Leer imagen
        with open(image_path, 'rb') as image_file:
            content = image_file.read()

        return await self.scan_receipt_from_bytes(content)

    async def scan_receipt_from_bytes(self, image_bytes: bytes, mime_type: str = "image/jpeg") -> Dict:
        """
        Escanea un recibo desde bytes (para uploads)

        Args:
            image_bytes: Bytes de la imagen
            mime_type: Tipo MIME (image/jpeg, image/png, application/pdf, etc.)

        Returns:
            Dict con datos estructurados del recibo + confidence scores
        """
        try:
            # Crear documento para procesar
            raw_document = documentai.RawDocument(
                content=image_bytes,
                mime_type=mime_type
            )

            # Configurar request
            request = documentai.ProcessRequest(
                name=self.processor_name,
                raw_document=raw_document
            )

            # Procesar documento
            result = self.client.process_document(request=request)
            document = result.document

            # Extraer datos estructurados del receipt parser
            extracted_data = self._extract_receipt_data(document)

            return {
                "full_text": document.text,
                "extracted_data": extracted_data,
                "success": True,
                "confidence": extracted_data.get("overall_confidence", 0.0)
            }

        except Exception as e:
            return {
                "error": f"Error al procesar recibo: {str(e)}",
                "success": False
            }

    def _extract_receipt_data(self, document: documentai.Document) -> Dict:
        """
        Extrae datos estructurados del Document AI Response
        Receipt Parser ya viene con campos pre-definidos
        """
        data = {
            "merchant_name": None,
            "total_amount": None,
            "subtotal": None,
            "tax_amount": None,
            "date": None,
            "currency": "MXN",
            "payment_method": None,
            "address": None,
            "phone": None,
            "receipt_date": None,
            "receipt_time": None,
            "line_items": [],
            "supplier_name": None,
            "supplier_address": None,
            "supplier_tax_id": None,  # RFC en México
            "overall_confidence": 0.0,
            "field_confidences": {}
        }

        # Document AI Receipt Parser devuelve entities
        # Cada entity tiene: type, mention_text, confidence
        confidences = []

        for entity in document.entities:
            entity_type = entity.type_
            mention_text = entity.mention_text
            confidence = entity.confidence if hasattr(entity, 'confidence') else 0.0

            confidences.append(confidence)
            data["field_confidences"][entity_type] = confidence

            # Mapear tipos de Document AI a nuestros campos
            if entity_type == "supplier_name":
                data["merchant_name"] = mention_text

            elif entity_type == "total_amount":
                data["total_amount"] = self._parse_amount(mention_text)

            elif entity_type == "net_amount":
                data["subtotal"] = self._parse_amount(mention_text)

            elif entity_type == "total_tax_amount":
                data["tax_amount"] = self._parse_amount(mention_text)

            elif entity_type == "receipt_date":
                data["date"] = self._parse_date(mention_text)
                data["receipt_date"] = mention_text

            elif entity_type == "receipt_time":
                data["receipt_time"] = mention_text

            elif entity_type == "currency":
                data["currency"] = mention_text

            elif entity_type == "payment_type":
                data["payment_method"] = self._normalize_payment_method(mention_text)

            elif entity_type == "supplier_address":
                data["address"] = mention_text
                data["supplier_address"] = mention_text

            elif entity_type == "supplier_phone":
                data["phone"] = mention_text

            elif entity_type == "supplier_tax_id":
                # Este es el RFC en México
                data["supplier_tax_id"] = mention_text
                data["rfc"] = mention_text

            elif entity_type == "line_item":
                # Extraer items individuales
                item = self._extract_line_item(entity)
                if item:
                    data["line_items"].append(item)

        # Calcular confidence promedio
        if confidences:
            data["overall_confidence"] = sum(confidences) / len(confidences)

        # Post-procesamiento: calcular subtotal si no existe pero tenemos total e IVA
        if data["total_amount"] and data["tax_amount"] and not data["subtotal"]:
            data["subtotal"] = round(data["total_amount"] - data["tax_amount"], 2)

        # Categorización automática basada en comercio (mismo que antes)
        if data["merchant_name"]:
            data["suggested_category"] = self._suggest_category(data["merchant_name"])

        return data

    def _extract_line_item(self, entity: documentai.Document.Entity) -> Optional[Dict]:
        """
        Extrae información de un line_item
        Document AI puede devolver: description, quantity, unit_price, amount
        """
        item = {
            "description": None,
            "quantity": None,
            "unit_price": None,
            "amount": None
        }

        # Line items tienen properties anidadas
        for prop in entity.properties:
            prop_type = prop.type_
            mention_text = prop.mention_text

            if prop_type == "line_item/description":
                item["description"] = mention_text
            elif prop_type == "line_item/quantity":
                item["quantity"] = self._parse_quantity(mention_text)
            elif prop_type == "line_item/unit_price":
                item["unit_price"] = self._parse_amount(mention_text)
            elif prop_type == "line_item/amount":
                item["amount"] = self._parse_amount(mention_text)

        # Solo retornar si tiene al menos descripción y monto
        if item["description"] and item["amount"]:
            return item

        return None

    def _parse_amount(self, text: str) -> Optional[float]:
        """Convierte string de monto a float"""
        if not text:
            return None

        try:
            # Remover símbolos de moneda y comas
            cleaned = text.replace('$', '').replace(',', '').replace(' ', '').strip()
            return round(float(cleaned), 2)
        except (ValueError, AttributeError):
            return None

    def _parse_quantity(self, text: str) -> Optional[int]:
        """Convierte string de cantidad a int"""
        if not text:
            return None

        try:
            return int(float(text))
        except (ValueError, AttributeError):
            return None

    def _parse_date(self, text: str) -> Optional[str]:
        """
        Intenta parsear fecha y retornar en formato ISO
        Document AI ya hace buen trabajo, pero validamos
        """
        if not text:
            return None

        try:
            # Intentar varios formatos comunes
            formats = [
                '%Y-%m-%d',      # 2025-01-27
                '%d/%m/%Y',      # 27/01/2025
                '%d-%m-%Y',      # 27-01-2025
                '%m/%d/%Y',      # 01/27/2025 (formato USA)
                '%Y/%m/%d',      # 2025/01/27
                '%d.%m.%Y',      # 27.01.2025
            ]

            for fmt in formats:
                try:
                    parsed = datetime.strptime(text, fmt)
                    return parsed.isoformat()
                except ValueError:
                    continue

            # Si no puede parsear, retornar el texto original
            return text

        except Exception:
            return text

    def _normalize_payment_method(self, text: str) -> str:
        """
        Normaliza método de pago a categorías estándar
        """
        if not text:
            return "NO_ESPECIFICADO"

        text_upper = text.upper()

        if any(word in text_upper for word in ['CASH', 'EFECTIVO', 'DINERO']):
            return "EFECTIVO"
        elif any(word in text_upper for word in ['CARD', 'TARJETA', 'CREDIT', 'DEBIT', 'CREDITO', 'DEBITO']):
            return "TARJETA"
        elif any(word in text_upper for word in ['TRANSFER', 'TRANSFERENCIA', 'SPEI']):
            return "TRANSFERENCIA"
        elif any(word in text_upper for word in ['DIGITAL', 'WALLET', 'PAYPAL', 'MERCADOPAGO']):
            return "DIGITAL"
        else:
            return text.upper()

    def _suggest_category(self, merchant_name: str) -> Optional[str]:
        """
        Sugiere categoría basada en el nombre del comercio
        Optimizado para comercios mexicanos
        """
        if not merchant_name:
            return None

        merchant_upper = merchant_name.upper()

        # Mapeo de comercios comunes a categorías
        merchant_categories = {
            # Alimentos y bebidas
            'OXXO': 'Comida',
            'SEVEN ELEVEN': 'Comida',
            '7-ELEVEN': 'Comida',
            'EXTRA': 'Comida',
            'CIRCLE K': 'Comida',
            'STARBUCKS': 'Comida',
            'MCDONALD': 'Comida',
            'BURGER KING': 'Comida',
            'SUBWAY': 'Comida',
            'KFC': 'Comida',
            'DOMINOS': 'Comida',
            'PIZZA HUT': 'Comida',

            # Supermercados
            'WALMART': 'Supermercado',
            'SORIANA': 'Supermercado',
            'CHEDRAUI': 'Supermercado',
            'BODEGA AURRERA': 'Supermercado',
            'LA COMER': 'Supermercado',
            'COSTCO': 'Supermercado',
            'SAMS': 'Supermercado',

            # Transporte
            'UBER': 'Transporte',
            'DIDI': 'Transporte',
            'BEAT': 'Transporte',
            'CABIFY': 'Transporte',
            'PEMEX': 'Transporte',
            'CHEVRON': 'Transporte',
            'BP': 'Transporte',

            # Entretenimiento
            'NETFLIX': 'Entretenimiento',
            'SPOTIFY': 'Entretenimiento',
            'CINEPOLIS': 'Entretenimiento',
            'CINEMEX': 'Entretenimiento',

            # Ropa
            'ZARA': 'Ropa',
            'H&M': 'Ropa',
            'LIVERPOOL': 'Ropa',
            'PALACIO': 'Ropa',
            'SUBURBIA': 'Ropa',

            # Tecnología
            'AMAZON': 'Tecnología',
            'MERCADO LIBRE': 'Tecnología',
            'BEST BUY': 'Tecnología',

            # Salud
            'FARMACIA': 'Salud',
            'BENAVIDES': 'Salud',
            'GUADALAJARA': 'Salud',
            'DEL AHORRO': 'Salud',
        }

        # Buscar match
        for merchant_key, category in merchant_categories.items():
            if merchant_key in merchant_upper:
                return category

        # Default
        return 'Otros'


# Singleton
ocr_service = OCRService()
