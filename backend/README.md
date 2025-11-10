# FinanceApp Backend

Backend en Python con FastAPI + Supabase + ML para app de finanzas.

## 🚀 Stack Tecnológico

- **FastAPI**: Framework web moderno y rápido
- **Supabase**: Base de datos PostgreSQL + Auth
- **Google Document AI**: OCR especializado para recibos (Receipt Parser)
- **XGBoost**: Auto-categorización de gastos
- **Prophet**: Predicciones de gastos futuros
- **Scikit-learn**: Detección de anomalías

## 📁 Estructura del Proyecto

```
backend/
├── app/
│   ├── routers/          # Endpoints de la API
│   │   ├── auth.py       # Login, register, JWT
│   │   ├── expenses.py   # CRUD de gastos
│   │   ├── ocr.py        # Escaneo de recibos
│   │   └── ml.py         # Predicciones y análisis
│   ├── schemas/          # Validación con Pydantic
│   ├── services/         # Lógica de negocio
│   ├── ml/               # Modelos de ML
│   ├── utils/            # Utilidades
│   ├── config.py         # Configuración
│   └── database.py       # Cliente de Supabase
├── main.py               # Entry point
├── requirements.txt      # Dependencias
└── database_schema.sql   # Schema de DB
```

## 🛠️ Setup

### 1. Crear Proyecto en Supabase

1. Ir a [supabase.com](https://supabase.com)
2. Crear nuevo proyecto
3. Copiar URL y Keys
4. Ejecutar el schema: `database_schema.sql` en SQL Editor

### 2. Configurar Google Cloud Document AI

1. Crear proyecto en [Google Cloud Console](https://console.cloud.google.com)
2. Activar Document AI API
3. Crear Receipt Processor
4. Crear Service Account con rol "Document AI API User"
5. Descargar JSON de credenciales
6. Guardar en `google-credentials.json`

**Ver guía detallada en:** `SETUP_GUIDE.md`

### 3. Instalar Dependencias

```bash
cd backend
python -m venv venv
source venv/bin/activate  # En Windows: venv\Scripts\activate
pip install -r requirements.txt
```

### 4. Configurar Variables de Entorno

```bash
cp .env.example .env
```

Editar `.env` con tus credenciales:

```env
SUPABASE_URL=https://tu-proyecto.supabase.co
SUPABASE_KEY=tu-key
SUPABASE_SERVICE_KEY=tu-service-key
SECRET_KEY=genera-secreto-seguro
GOOGLE_APPLICATION_CREDENTIALS=./google-credentials.json
```

### 5. Ejecutar Servidor

```bash
python main.py
```

Servidor corriendo en: `http://localhost:8000`

API Docs: `http://localhost:8000/docs`

## 📡 API Endpoints

### Autenticación

```
POST /api/auth/register    # Registrar usuario
POST /api/auth/login       # Login
GET  /api/auth/me          # Obtener usuario actual
```

### Gastos

```
GET    /api/expenses              # Listar gastos
POST   /api/expenses              # Crear gasto
GET    /api/expenses/{id}         # Obtener gasto
PUT    /api/expenses/{id}         # Actualizar gasto
DELETE /api/expenses/{id}         # Eliminar gasto
POST   /api/expenses/{id}/comment # Agregar comentario
```

### OCR

```
POST /api/ocr/scan                # Escanear recibo
POST /api/ocr/extract-data        # Extraer datos estructurados
```

### ML

```
POST /api/ml/categorize           # Auto-categorizar gasto
POST /api/ml/predict              # Predecir gastos futuros
GET  /api/ml/insights             # Obtener insights
POST /api/ml/detect-anomaly       # Detectar gastos anormales
```

## 🧠 Features de ML

### 1. Auto-Categorización (XGBoost)

```python
# Input
{
  "merchant": "Oxxo",
  "amount": 45.50,
  "time": "08:30"
}

# Output
{
  "category": "Comida",
  "confidence": 0.87
}
```

### 2. Predicción de Gastos (Prophet)

```python
# Input
{
  "user_id": "uuid",
  "period": "month"
}

# Output
{
  "predicted_amount": 15230.50,
  "confidence_interval": [14000, 16500],
  "trend": "increasing"
}
```

### 3. Detección de Anomalías (Isolation Forest)

```python
# Input
{
  "amount": 5000,
  "category": "Comida"
}

# Output
{
  "is_anomaly": true,
  "anomaly_score": 0.92,
  "reason": "Monto muy superior al promedio"
}
```

## 🇲🇽 Features Específicas de México

### Validación de RFC

```python
POST /api/utils/validate-rfc
{
  "rfc": "XAXX010101000"
}

Response:
{
  "valid": true,
  "type": "persona_moral"
}
```

### Cálculo de IVA

```python
POST /api/utils/calculate-tax
{
  "subtotal": 1000
}

Response:
{
  "subtotal": 1000,
  "iva": 160,
  "total": 1160
}
```

### Clasificación Deducible

```python
POST /api/ml/check-deductible
{
  "merchant": "Walmart",
  "category": "Comida",
  "has_rfc": true,
  "has_invoice": true
}

Response:
{
  "is_deductible": true,
  "confidence": 0.94,
  "requirements_met": ["rfc", "invoice"]
}
```

## 🧪 Testing

```bash
# Ejecutar tests
pytest

# Con coverage
pytest --cov=app
```

## 📦 Deploy

### Opción 1: Railway

```bash
# Instalar Railway CLI
npm install -g @railway/cli

# Deploy
railway login
railway init
railway up
```

### Opción 2: Render

1. Conectar repo de GitHub
2. Configurar variables de entorno
3. Deploy automático

### Opción 3: Google Cloud Run

```bash
gcloud run deploy financeapp-api \
  --source . \
  --region us-central1
```

## 🔐 Seguridad

- JWT con expiración de 7 días
- Passwords hasheados con bcrypt
- Row Level Security en Supabase
- Rate limiting (TODO)
- CORS configurado
- HTTPS en producción

## 📈 Roadmap

- [x] Estructura base
- [x] Schema de base de datos
- [ ] Autenticación JWT
- [ ] CRUD de gastos
- [ ] OCR con Google Vision
- [ ] Auto-categorización con XGBoost
- [ ] Predicciones con Prophet
- [ ] Detección de anomalías
- [ ] Features específicas de México
- [ ] Integración con SAT (futuro)
- [ ] Chatbot con NLP (futuro)

## 📝 Notas

- Modelos de ML se entrenarán con datos de producción
- Por ahora usar modelos pre-entrenados básicos
- OCR funciona mejor con recibos claros y bien iluminados
- Para producción: agregar rate limiting y caching
