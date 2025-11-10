"""
Utilidades específicas para México
- Validación de RFC
- Cálculo de IVA
- Validación de deducibles
"""
import re
from typing import Dict, Optional
from decimal import Decimal

# IVA en México
IVA_RATE = Decimal('0.16')  # 16%

def validate_rfc(rfc: str) -> Dict:
    """
    Valida un RFC mexicano

    Args:
        rfc: RFC a validar

    Returns:
        Dict con validación y tipo
    """
    if not rfc:
        return {"valid": False, "error": "RFC vacío"}

    rfc = rfc.upper().strip()

    # Persona Física: 13 caracteres (4 letras + 6 dígitos + 3 homoclave)
    # Persona Moral: 12 caracteres (3 letras + 6 dígitos + 3 homoclave)

    # Patrón para Persona Física
    pattern_fisica = r'^[A-ZÑ&]{4}\d{6}[A-Z0-9]{3}$'
    # Patrón para Persona Moral
    pattern_moral = r'^[A-ZÑ&]{3}\d{6}[A-Z0-9]{3}$'

    if re.match(pattern_fisica, rfc):
        return {
            "valid": True,
            "type": "persona_fisica",
            "length": len(rfc)
        }
    elif re.match(pattern_moral, rfc):
        return {
            "valid": True,
            "type": "persona_moral",
            "length": len(rfc)
        }
    else:
        return {
            "valid": False,
            "error": "Formato de RFC inválido"
        }

def calculate_iva(subtotal: Decimal) -> Dict:
    """
    Calcula el IVA (16%) sobre un subtotal

    Args:
        subtotal: Monto sin IVA

    Returns:
        Dict con subtotal, IVA y total
    """
    iva = subtotal * IVA_RATE
    total = subtotal + iva

    return {
        "subtotal": float(subtotal),
        "iva": float(iva),
        "total": float(total),
        "iva_rate": float(IVA_RATE)
    }

def extract_iva_from_total(total: Decimal) -> Dict:
    """
    Extrae el IVA de un total que ya lo incluye

    Args:
        total: Monto total (con IVA incluido)

    Returns:
        Dict con subtotal, IVA y total
    """
    # Total = Subtotal * 1.16
    # Subtotal = Total / 1.16
    subtotal = total / (1 + IVA_RATE)
    iva = total - subtotal

    return {
        "subtotal": float(subtotal),
        "iva": float(iva),
        "total": float(total),
        "iva_rate": float(IVA_RATE)
    }

def is_deductible(
    category: str,
    has_rfc: bool,
    has_invoice: bool,
    merchant_type: Optional[str] = None
) -> Dict:
    """
    Determina si un gasto es deducible para SAT

    Args:
        category: Categoría del gasto
        has_rfc: Si el recibo tiene RFC válido
        has_invoice: Si tiene factura (CFDI)
        merchant_type: Tipo de comercio (opcional)

    Returns:
        Dict con resultado y razones
    """
    reasons = []
    is_deductible = True

    # Requisito básico: debe tener RFC
    if not has_rfc:
        is_deductible = False
        reasons.append("No tiene RFC válido")

    # Requisito básico: debe tener factura para ser deducible
    if not has_invoice:
        is_deductible = False
        reasons.append("No tiene factura (CFDI)")

    # Categorías típicamente deducibles
    deductible_categories = [
        'Comida',  # Si es comida de negocios
        'Transporte',  # Si es transporte de trabajo
        'Salud',  # Gastos médicos
        'Educación',  # Capacitación profesional
        'Servicios',  # Servicios profesionales
    ]

    # Categorías NO deducibles
    non_deductible_categories = [
        'Entretenimiento',  # Generalmente no deducible
        'Personal',
    ]

    if category in non_deductible_categories:
        is_deductible = False
        reasons.append(f"Categoría '{category}' no es deducible")
    elif category not in deductible_categories:
        reasons.append(f"Categoría '{category}' requiere revisión")

    # Límites y reglas especiales
    recommendations = []
    if category == 'Comida':
        recommendations.append("Máximo 8.5% de ingresos acumulables")
        recommendations.append("Debe estar relacionado con actividad empresarial")

    if category == 'Transporte':
        recommendations.append("Solo transporte relacionado con trabajo")

    return {
        "is_deductible": is_deductible and has_rfc and has_invoice,
        "reasons": reasons if reasons else ["Cumple requisitos básicos"],
        "recommendations": recommendations,
        "requirements_met": {
            "has_rfc": has_rfc,
            "has_invoice": has_invoice,
            "category_allowed": category in deductible_categories
        }
    }

def format_currency_mexico(amount: float) -> str:
    """
    Formatea cantidad en formato mexicano
    Ej: 1234.56 -> $1,234.56
    """
    return f"${amount:,.2f}"

def parse_mexican_amount(amount_str: str) -> Optional[float]:
    """
    Parsea montos en formato mexicano
    Ej: "$1,234.56" -> 1234.56
    """
    try:
        # Remover $, comas y espacios
        cleaned = amount_str.replace('$', '').replace(',', '').strip()
        return float(cleaned)
    except:
        return None

# Diccionario de comercios comunes y sus categorías sugeridas
MERCHANT_CATEGORIES = {
    # Comida
    'OXXO': 'Comida',
    'SEVEN ELEVEN': 'Comida',
    'STARBUCKS': 'Comida',
    'MCDONALD': 'Comida',
    'BURGER KING': 'Comida',
    'DOMINOS': 'Comida',
    'SUBWAY': 'Comida',

    # Supermercados
    'WALMART': 'Compras',
    'SORIANA': 'Compras',
    'CHEDRAUI': 'Compras',
    'COSTCO': 'Compras',
    'SAMS CLUB': 'Compras',

    # Transporte
    'UBER': 'Transporte',
    'DIDI': 'Transporte',
    'CABIFY': 'Transporte',

    # Entretenimiento
    'NETFLIX': 'Entretenimiento',
    'SPOTIFY': 'Entretenimiento',
    'CINEPOLIS': 'Entretenimiento',
    'CINEMEX': 'Entretenimiento',

    # Tiendas
    'LIVERPOOL': 'Compras',
    'PALACIO DE HIERRO': 'Compras',
    'SUBURBIA': 'Compras',

    # Tech/Online
    'AMAZON': 'Compras',
    'MERCADO LIBRE': 'Compras',
}

def suggest_category_from_merchant(merchant_name: str) -> Optional[str]:
    """
    Sugiere una categoría basada en el nombre del comercio
    """
    merchant_upper = merchant_name.upper()

    for key, category in MERCHANT_CATEGORIES.items():
        if key in merchant_upper:
            return category

    return None
