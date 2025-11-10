# 🔍 Google Document AI - Capacidades del Receipt Parser

## ¿Qué extrae automáticamente?

El Receipt Parser de Document AI está pre-entrenado para extraer **campos estructurados** de recibos. No necesitas regex ni parsing manual.

### ✅ Campos Extraídos Automáticamente

#### Información del Comercio
- **supplier_name** - Nombre del comercio (OXXO, Walmart, etc.)
- **supplier_address** - Dirección completa del establecimiento
- **supplier_phone** - Teléfono del comercio
- **supplier_tax_id** - RFC en México (Registro Federal de Contribuyentes)

#### Información Financiera
- **total_amount** - Monto total a pagar
- **net_amount** - Subtotal (antes de impuestos)
- **total_tax_amount** - IVA u otros impuestos
- **currency** - Moneda (MXN, USD, etc.)
- **tip_amount** - Propina (si aplica)

#### Información Temporal
- **receipt_date** - Fecha del recibo (formato: DD/MM/YYYY o YYYY-MM-DD)
- **receipt_time** - Hora de la transacción

#### Método de Pago
- **payment_type** - Efectivo, Tarjeta, Transferencia, etc.

#### Items/Productos (Line Items)
Cada producto incluye:
- **description** - Nombre del producto
- **quantity** - Cantidad comprada
- **unit_price** - Precio unitario
- **amount** - Total del item (quantity × unit_price)

### 📊 Confidence Scores

Document AI retorna un **confidence score** (0.0 - 1.0) para cada campo extraído:

- **0.9 - 1.0**: Muy alta confianza ✅
- **0.7 - 0.9**: Alta confianza ⚠️
- **0.5 - 0.7**: Confianza media ⚠️⚠️
- **< 0.5**: Baja confianza ❌ (validar manualmente)

Puedes usar estos scores para:
- Alertar al usuario cuando la confianza es baja
- Pedir confirmación antes de guardar
- Mejorar la UI mostrando campos que necesitan revisión

## Ejemplo de Respuesta

### Recibo de entrada:
```
OXXO
AV INSURGENTES 123
RFC: OXX010101ABC

COCA COLA 2.0L    2    30.00
DORITOS           1    15.50

SUBTOTAL:        45.50
IVA 16%:          7.28
TOTAL:           52.78

EFECTIVO
27/01/2025 14:30
```

### Respuesta de Document AI:
```json
{
  "full_text": "OXXO\nAV INSURGENTES...",
  "extracted_data": {
    "merchant_name": "OXXO",
    "supplier_address": "AV INSURGENTES 123",
    "rfc": "OXX010101ABC",
    "total_amount": 52.78,
    "subtotal": 45.50,
    "tax_amount": 7.28,
    "currency": "MXN",
    "date": "2025-01-27T14:30:00",
    "payment_method": "EFECTIVO",
    "line_items": [
      {
        "description": "COCA COLA 2.0L",
        "quantity": 2,
        "unit_price": 15.00,
        "amount": 30.00
      },
      {
        "description": "DORITOS",
        "quantity": 1,
        "unit_price": 15.50,
        "amount": 15.50
      }
    ],
    "suggested_category": "Comida",
    "overall_confidence": 0.94,
    "field_confidences": {
      "supplier_name": 0.98,
      "total_amount": 0.96,
      "receipt_date": 0.92,
      "line_item": 0.89
    }
  },
  "success": true
}
```

## Ventajas sobre Vision API

| Feature | Vision API | Document AI |
|---------|-----------|-------------|
| **Extracción** | Solo texto plano | Campos estructurados |
| **Precision** | ~70% con regex | ~90% automático |
| **Line items** | Muy difícil | Automático |
| **RFC/Tax ID** | Regex manual | Detecta automáticamente |
| **Fechas** | Parsing manual | Normalizado |
| **Confidence** | No incluido | Por cada campo |
| **Recibos borrosos** | Falla fácil | Más tolerante |
| **Desarrollo** | Mucho código | Plug & play |

## Casos Especiales: Recibos Mexicanos

Document AI maneja bien:
- ✅ RFC de personas físicas (12 chars) y morales (13 chars)
- ✅ IVA 16%
- ✅ Direcciones en español
- ✅ Formatos de fecha DD/MM/YYYY
- ✅ Comercios mexicanos comunes (OXXO, Soriana, Liverpool, etc.)
- ✅ Pesos mexicanos ($)

## Limitaciones

Document AI **NO extrae automáticamente:**
- ❌ Si es deducible de impuestos (tienes que calcularlo)
- ❌ Categoría del gasto (por eso agregamos auto-categorización por comercio)
- ❌ Si tiene factura CFDI válida (requiere validación SAT)
- ❌ Tipo de gasto (recurrente, único, etc.) - esto va en ML

**Solución:** Nuestro backend agrega estas features con:
- `mexico_utils.py` - RFC validation, IVA, deducibilidad
- `ocr_service._suggest_category()` - Auto-categorización
- ML (próximamente) - Predicciones y análisis

## Costo

**Pricing de Document AI:**
- ✅ **Primeros 1000 documentos/mes: GRATIS**
- Después: $1.50 USD por 1000 documentos

Para un MVP con 100 usuarios escaneando 10 recibos/mes:
- 1000 recibos/mes → **$0 USD** (dentro del free tier)

## Mejores Prácticas

### 1. Validación en Frontend
Muestra los datos extraídos y pide confirmación:
```jsx
<ReceiptPreview
  data={extractedData}
  onConfirm={saveExpense}
  onEdit={editField}
/>
```

### 2. Alertas de Baja Confianza
```javascript
if (field.confidence < 0.7) {
  showWarning(`"${field.name}" tiene baja confianza. Por favor verifica.`);
}
```

### 3. Captura de Foto Óptima
Tips para el usuario:
- 📸 Toma la foto con buena luz
- 📏 Estira el recibo antes de escanear
- 🎯 Centra el recibo en la cámara
- 🔍 Asegúrate que el texto sea legible en preview

### 4. Fallback Manual
Siempre permite editar campos manualmente si OCR falla.

## Testing

Prueba con diferentes tipos de recibos:
- ✅ Recibos de tiendas grandes (Walmart, Soriana)
- ✅ Recibos de conveniencia (OXXO, 7-Eleven)
- ✅ Facturas simplificadas
- ✅ Recibos térmicos (OXXO, gasolineras)
- ✅ Recibos arrugados o manchados
- ✅ Tickets de restaurantes
- ✅ Recibos de Uber/DiDi

## Siguiente Paso: ML

Los datos estructurados de Document AI son **perfectos para entrenar ML**:
- XGBoost puede usar line_items para mejorar categorización
- Prophet puede predecir gastos futuros basado en patrones
- Isolation Forest detecta anomalías en montos

**Document AI + ML = App inteligente 🚀**
