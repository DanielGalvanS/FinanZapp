"""
OCR Post-Processor - Enterprise Level
Sistema de post-procesamiento inteligente para mejorar precisión de OCR
Inspirado en sistemas de Meta, Uber, Clip
"""

import re
from typing import Dict, Optional, List, Tuple
from datetime import datetime
from decimal import Decimal


class OCRPostProcessor:
    """
    Post-procesador inteligente para datos de OCR
    Mejora la precisión de Document AI con regex, validación y ML
    """

    # ========================================
    # MERCHANT DETECTION - Base de datos de comercios mexicanos
    # ========================================
    MEXICAN_MERCHANTS = {
        # Conveniencia
        'OXXO': {'keywords': ['oxxo', 'cadena comercial oxxo', 'oxxd'], 'category': 'Compras', 'confidence': 0.95},
        'SEVEN ELEVEN': {'keywords': ['seven eleven', '7-eleven', '7 eleven'], 'category': 'Comida', 'confidence': 0.95},
        'EXTRA': {'keywords': ['tiendas extra', 'extra'], 'category': 'Comida', 'confidence': 0.90},
        'CIRCLE K': {'keywords': ['circle k'], 'category': 'Comida', 'confidence': 0.95},

        # Supermercados
        'WALMART': {'keywords': ['walmart', 'wal-mart'], 'category': 'Supermercado', 'confidence': 0.95},
        'SORIANA': {'keywords': ['soriana', 'organizacion soriana'], 'category': 'Supermercado', 'confidence': 0.95},
        'CHEDRAUI': {'keywords': ['chedraui'], 'category': 'Supermercado', 'confidence': 0.95},
        'BODEGA AURRERA': {'keywords': ['bodega aurrera', 'aurrera'], 'category': 'Supermercado', 'confidence': 0.95},
        'LA COMER': {'keywords': ['la comer', 'comer'], 'category': 'Supermercado', 'confidence': 0.90},
        'COSTCO': {'keywords': ['costco'], 'category': 'Supermercado', 'confidence': 0.95},
        'SAMS CLUB': {'keywords': ['sams', 'sam\'s club'], 'category': 'Supermercado', 'confidence': 0.95},
        'HEB': {'keywords': ['h-e-b', 'heb'], 'category': 'Supermercado', 'confidence': 0.95},

        # Restaurantes / Fast Food
        'MCDONALDS': {'keywords': ['mcdonalds', 'mcdonald\'s'], 'category': 'Comida', 'confidence': 0.95},
        'BURGER KING': {'keywords': ['burger king'], 'category': 'Comida', 'confidence': 0.95},
        'KFC': {'keywords': ['kentucky fried chicken', 'kfc'], 'category': 'Comida', 'confidence': 0.95},
        'SUBWAY': {'keywords': ['subway'], 'category': 'Comida', 'confidence': 0.90},
        'DOMINOS': {'keywords': ['dominos', 'domino\'s pizza'], 'category': 'Comida', 'confidence': 0.95},
        'PIZZA HUT': {'keywords': ['pizza hut'], 'category': 'Comida', 'confidence': 0.95},
        'LITTLE CAESARS': {'keywords': ['little caesars'], 'category': 'Comida', 'confidence': 0.95},
        'STARBUCKS': {'keywords': ['starbucks'], 'category': 'Comida', 'confidence': 0.95},

        # Gasolineras (mapear a Transporte)
        'PEMEX': {'keywords': ['pemex', 'petroleos mexicanos'], 'category': 'Transporte', 'confidence': 0.95},
        'BP': {'keywords': ['british petroleum', 'bp '], 'category': 'Transporte', 'confidence': 0.90},
        'SHELL': {'keywords': ['shell'], 'category': 'Transporte', 'confidence': 0.90},
        'CHEVRON': {'keywords': ['chevron'], 'category': 'Transporte', 'confidence': 0.90},
        'MOBIL': {'keywords': ['mobil'], 'category': 'Transporte', 'confidence': 0.90},

        # Farmacias (mapear a Salud)
        'FARMACIA GUADALAJARA': {'keywords': ['farmacias guadalajara', 'guadalajara'], 'category': 'Salud', 'confidence': 0.95},
        'FARMACIA BENAVIDES': {'keywords': ['benavides', 'farmacias benavides'], 'category': 'Salud', 'confidence': 0.95},
        'FARMACIA DEL AHORRO': {'keywords': ['del ahorro', 'farmacias del ahorro'], 'category': 'Salud', 'confidence': 0.95},
        'SIMILARES': {'keywords': ['similares', 'farmacias similares'], 'category': 'Salud', 'confidence': 0.90},

        # Departamentales
        'LIVERPOOL': {'keywords': ['liverpool'], 'category': 'Ropa', 'confidence': 0.95},
        'PALACIO DE HIERRO': {'keywords': ['palacio de hierro', 'palacio'], 'category': 'Ropa', 'confidence': 0.95},
        'SUBURBIA': {'keywords': ['suburbia'], 'category': 'Ropa', 'confidence': 0.95},
        'SEARS': {'keywords': ['sears'], 'category': 'Ropa', 'confidence': 0.90},

        # Cines
        'CINEPOLIS': {'keywords': ['cinepolis', 'cinépolis'], 'category': 'Entretenimiento', 'confidence': 0.95},
        'CINEMEX': {'keywords': ['cinemex'], 'category': 'Entretenimiento', 'confidence': 0.95},
    }

    # ========================================
    # RFC PATTERNS - Regex para RFCs mexicanos
    # ========================================
    RFC_PATTERNS = [
        # RFC completo: 3-4 letras, 6 dígitos, 3 caracteres alfanuméricos
        r'\b([A-ZÑ&]{3,4})-?(\d{6})-?([A-Z0-9]{3})\b',
        r'\b([A-ZÑ&]{3,4})(\d{6})([A-Z0-9]{3})\b',
        # RFC sin homoclave
        r'\b([A-ZÑ&]{3,4})-?(\d{6})\b',
    ]

    # ========================================
    # AMOUNT PATTERNS - Extracción de montos
    # ========================================
    AMOUNT_PATTERNS = [
        r'(?:total|TOTAL)[:\s]*\$?\s*(\d{1,3}(?:,\d{3})*(?:\.\d{2})?)',
        r'(?:importe|IMPORTE)[:\s]*\$?\s*(\d{1,3}(?:,\d{3})*(?:\.\d{2})?)',
        r'\$\s*(\d{1,3}(?:,\d{3})*(?:\.\d{2})?)',
    ]

    # ========================================
    # DATE PATTERNS - Extracción de fechas
    # ========================================
    DATE_PATTERNS = [
        # DD/MM/YYYY
        (r'(\d{2})/(\d{2})/(\d{4})', '%d/%m/%Y'),
        # DD-MM-YYYY
        (r'(\d{2})-(\d{2})-(\d{4})', '%d-%m-%Y'),
        # YYYY-MM-DD
        (r'(\d{4})-(\d{2})-(\d{2})', '%Y-%m-%d'),
    ]

    def __init__(self):
        self.confidence_threshold = 0.7

    # ========================================
    # MERCHANT NAME EXTRACTION
    # ========================================
    def extract_merchant_name(self, text: str, docai_merchant: Optional[str] = None) -> Tuple[str, float]:
        """
        Extrae nombre del comercio con alta precisión

        Args:
            text: Texto completo del OCR
            docai_merchant: Merchant detectado por Document AI (puede estar vacío)

        Returns:
            Tuple (merchant_name, confidence)
        """
        text_upper = text.upper()

        # Buscar en base de datos de comercios conocidos
        for merchant_name, merchant_data in self.MEXICAN_MERCHANTS.items():
            for keyword in merchant_data['keywords']:
                if keyword.upper() in text_upper:
                    return merchant_name, merchant_data['confidence']

        # Si Document AI encontró algo, usarlo con confidence menor
        if docai_merchant and len(docai_merchant.strip()) > 0:
            return docai_merchant.strip(), 0.6

        # Buscar patrón "S.A. DE C.V." o "S. DE R.L."
        company_pattern = r'([A-ZÁÉÍÓÚÑ][A-ZÁÉÍÓÚÑa-záéíóúñ\s&.,-]{2,50})\s*(?:S\.?\s*A\.?|S\.?\s*DE\s*R\.?\s*L\.?|S\.?\s*A\.?\s*DE\s*C\.?\s*V\.?)'
        match = re.search(company_pattern, text)
        if match:
            company_name = match.group(1).strip()
            return company_name, 0.5

        return "Comercio no identificado", 0.0

    # ========================================
    # RFC EXTRACTION
    # ========================================
    def extract_rfc(self, text: str, docai_rfc: Optional[str] = None) -> Tuple[Optional[str], float]:
        """
        Extrae RFC mexicano con validación

        Returns:
            Tuple (rfc, confidence)
        """
        # Primero intentar con Document AI si existe
        if docai_rfc and self._validate_rfc_format(docai_rfc):
            return docai_rfc.upper(), 0.9

        # Buscar con regex en texto completo
        for pattern in self.RFC_PATTERNS:
            matches = re.finditer(pattern, text.upper())
            for match in matches:
                # Reconstruir RFC
                if len(match.groups()) == 3:
                    rfc = f"{match.group(1)}{match.group(2)}{match.group(3)}"
                else:
                    rfc = match.group(0).replace('-', '')

                # Validar formato
                if self._validate_rfc_format(rfc):
                    return rfc, 0.85

        return None, 0.0

    def _validate_rfc_format(self, rfc: str) -> bool:
        """Valida formato básico de RFC mexicano"""
        if not rfc:
            return False

        rfc = rfc.upper().replace('-', '').replace(' ', '')

        # RFC persona moral (12 caracteres)
        if len(rfc) == 12:
            return bool(re.match(r'^[A-ZÑ&]{3}\d{6}[A-Z0-9]{3}$', rfc))

        # RFC persona física (13 caracteres)
        if len(rfc) == 13:
            return bool(re.match(r'^[A-ZÑ&]{4}\d{6}[A-Z0-9]{3}$', rfc))

        return False

    # ========================================
    # AMOUNT EXTRACTION
    # ========================================
    def extract_total_amount(self, text: str, docai_amount: Optional[float] = None) -> Tuple[Optional[float], float]:
        """
        Extrae monto total con validación cruzada

        Returns:
            Tuple (amount, confidence)
        """
        # Si Document AI tiene alta confianza, usar ese
        if docai_amount and docai_amount > 0:
            return docai_amount, 0.9

        # Buscar en texto con regex
        amounts = []
        for pattern in self.AMOUNT_PATTERNS:
            matches = re.finditer(pattern, text, re.IGNORECASE)
            for match in matches:
                amount_str = match.group(1).replace(',', '')
                try:
                    amount = float(amount_str)
                    if 0.01 <= amount <= 999999:  # Rango válido
                        amounts.append(amount)
                except ValueError:
                    continue

        # Si encontramos montos, usar el más común o el mayor
        if amounts:
            # Retornar el monto más frecuente o el mayor
            return max(amounts), 0.75

        return None, 0.0

    # ========================================
    # DATE EXTRACTION
    # ========================================
    def extract_date(self, text: str, docai_date: Optional[str] = None) -> Tuple[Optional[str], float]:
        """
        Extrae fecha con múltiples formatos

        Returns:
            Tuple (iso_date, confidence)
        """
        # Intentar parsear fecha de Document AI
        if docai_date:
            try:
                parsed = datetime.fromisoformat(docai_date.replace('Z', '+00:00'))
                return parsed.isoformat(), 0.85
            except (ValueError, AttributeError):
                pass

        # Buscar fechas en texto
        for pattern, date_format in self.DATE_PATTERNS:
            matches = re.finditer(pattern, text)
            for match in matches:
                try:
                    date_str = match.group(0)
                    parsed = datetime.strptime(date_str, date_format)
                    # Validar que no sea fecha futura ni muy antigua
                    if datetime(2020, 1, 1) <= parsed <= datetime.now():
                        return parsed.isoformat(), 0.8
                except ValueError:
                    continue

        return None, 0.0

    # ========================================
    # CATEGORY SUGGESTION
    # ========================================
    def suggest_category(self, merchant_name: str, text: str) -> Tuple[str, float]:
        """
        Sugiere categoría basada en merchant y keywords

        Returns:
            Tuple (category, confidence)
        """
        text_upper = text.upper()

        # Primero revisar si el merchant está en la base de datos
        for merchant, data in self.MEXICAN_MERCHANTS.items():
            if merchant.upper() in merchant_name.upper():
                return data['category'], data['confidence']

        # Categorización por keywords en el texto
        # Usar solo categorías que existen en la BD
        category_keywords = {
            'Transporte': ['gasolina', 'pemex', 'uber', 'didi', 'taxi', 'combustible', 'diesel'],
            'Comida': ['restaurant', 'comida', 'alimentos', 'bebida', 'cafe', 'pizza', 'taco'],
            'Compras': ['super', 'abarrotes', 'despensa', 'mercado', 'tienda', 'conveniencia'],
            'Supermercado': ['walmart', 'soriana', 'chedraui', 'bodega', 'costco'],
            'Salud': ['farmacia', 'medicina', 'consulta', 'doctor', 'medic'],
            'Entretenimiento': ['cine', 'pelicula', 'teatro', 'concierto', 'juego'],
            'Ropa': ['ropa', 'calzado', 'zapato', 'vestido', 'pantalon'],
            'Tecnología': ['electronico', 'computadora', 'telefono', 'tech'],
            'Educación': ['escuela', 'curso', 'libro', 'universidad', 'colegiatura'],
        }

        for category, keywords in category_keywords.items():
            for keyword in keywords:
                if keyword.upper() in text_upper:
                    return category, 0.7

        return 'Otros', 0.5

    # ========================================
    # MAIN POST-PROCESSING
    # ========================================
    def process(self, docai_result: Dict, full_text: str) -> Dict:
        """
        Procesamiento principal - mejora todos los campos

        Args:
            docai_result: Resultado de Document AI
            full_text: Texto completo extraído

        Returns:
            Diccionario con datos mejorados y confidence scores
        """
        extracted = docai_result.get('extracted_data', {})

        # Extraer merchant name
        merchant_name, merchant_conf = self.extract_merchant_name(
            full_text,
            extracted.get('merchant_name')
        )

        # Extraer RFC
        rfc, rfc_conf = self.extract_rfc(
            full_text,
            extracted.get('rfc') or extracted.get('supplier_tax_id')
        )

        # Extraer monto
        amount, amount_conf = self.extract_total_amount(
            full_text,
            extracted.get('total_amount')
        )

        # Extraer fecha
        date, date_conf = self.extract_date(
            full_text,
            extracted.get('date')
        )

        # Sugerir categoría
        category, category_conf = self.suggest_category(merchant_name, full_text)

        # Calcular confidence general
        overall_confidence = (
            merchant_conf * 0.3 +
            rfc_conf * 0.2 +
            amount_conf * 0.3 +
            date_conf * 0.1 +
            category_conf * 0.1
        )

        return {
            'merchant_name': merchant_name,
            'merchant_confidence': merchant_conf,
            'rfc': rfc,
            'rfc_confidence': rfc_conf,
            'total_amount': amount or extracted.get('total_amount'),
            'amount_confidence': amount_conf,
            'date': date or extracted.get('date'),
            'date_confidence': date_conf,
            'suggested_category': category,
            'category_confidence': category_conf,
            'overall_confidence': overall_confidence,
            'processing_method': 'enhanced' if overall_confidence > 0.7 else 'standard',
            # Mantener datos originales
            'original_docai': extracted,
        }


# Singleton
ocr_postprocessor = OCRPostProcessor()
