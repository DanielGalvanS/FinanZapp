# 🚀 Guía de Setup - Backend

## ✅ Lo que ya tenemos implementado:

- ✅ **OCR con Google Vision** - Escaneo completo de recibos
- ✅ **CRUD de Gastos** - APIs funcionales
- ✅ **Utilidades México** - RFC, IVA, deducibles
- ✅ **Schema de Base de Datos** - Diseñado para Supabase

**Pendiente:** ML (auto-categorización y predicciones) - lo haremos después

---

## 📋 Prerequisitos

1. **Python 3.9+** instalado
2. **Cuenta en Supabase** (gratis)
3. **Cuenta en Google Cloud** (para Vision API)

---

## 🔧 Paso 1: Configurar Supabase

### 1.1 Crear Proyecto

1. Ir a [supabase.com](https://supabase.com)
2. Crear cuenta / Login
3. Click en "New Project"
4. Llenar datos:
   - **Name**: FinanceApp
   - **Database Password**: (guárdala bien)
   - **Region**: Elegir la más cercana
   - Click "Create new project"

### 1.2 Ejecutar Schema de Base de Datos

1. En el panel de Supabase, ir a **SQL Editor** (ícono de base de datos)
2. Click en "New Query"
3. Copiar todo el contenido de `database_schema.sql`
4. Pegar en el editor
5. Click en "Run" (▶️)
6. Verificar que se ejecutó sin errores

### 1.3 Obtener Credenciales

1. Ir a **Settings** > **API**
2. Copiar estos valores:

```
Project URL: https://tu-proyecto.supabase.co
anon/public key: eyJhbGc...
service_role key: eyJhbGc... (⚠️ Esta es secreta!)
```

---

## 🔑 Paso 2: Configurar Google Cloud Document AI

### 2.1 Crear Proyecto en Google Cloud

1. Ir a [console.cloud.google.com](https://console.cloud.google.com)
2. Crear nuevo proyecto: "FinanceApp"
3. Seleccionar el proyecto
4. **Copiar el Project ID** (lo necesitarás después)

### 2.2 Activar Document AI API

1. En el menú, ir a **APIs & Services** > **Library**
2. Buscar "Cloud Document AI API"
3. Click en "Cloud Document AI API"
4. Click "ENABLE"

### 2.3 Crear Receipt Processor

1. En el menú, ir a **Document AI** > **Processors**
2. Click **"CREATE PROCESSOR"**
3. Seleccionar **"Receipt Parser"**
4. Llenar:
   - **Processor name:** `receipt-processor`
   - **Region:** `us` (o el más cercano)
5. Click **"CREATE"**
6. **Copiar el Processor ID** (aparece en la URL o en los detalles)
   - Se ve así: `abc123def456`

### 2.4 Crear Service Account

1. Ir a **APIs & Services** > **Credentials**
2. Click "CREATE CREDENTIALS" > "Service Account"
3. Llenar:
   - **Name**: financeapp-ocr
   - **Role**: "Document AI API User"
4. Click "Done"

### 2.5 Descargar Credenciales JSON

1. En la lista de Service Accounts, click en el que creaste
2. Ir a tab "KEYS"
3. Click "ADD KEY" > "Create new key"
4. Seleccionar **JSON**
5. Click "CREATE"
6. Se descarga un archivo JSON
7. **Renombrar** el archivo a `google-credentials.json`
8. **Mover** el archivo a la carpeta `backend/`

```bash
mv ~/Downloads/financeapp-*.json backend/google-credentials.json
```

---

## 💻 Paso 3: Instalar y Configurar Backend

### 3.1 Crear Entorno Virtual

```bash
cd backend
python -m venv venv

# Activar
# MacOS/Linux:
source venv/bin/activate

# Windows:
venv\Scripts\activate
```

### 3.2 Instalar Dependencias

```bash
pip install -r requirements.txt
```

**Nota:** Puede tardar unos minutos, especialmente Prophet y scikit-learn.

### 3.3 Configurar Variables de Entorno

```bash
cp .env.example .env
```

Editar `.env` con tus credenciales:

```env
# Supabase (copiar del paso 1.3)
SUPABASE_URL=https://tu-proyecto.supabase.co
SUPABASE_KEY=eyJhbGc... (anon key)
SUPABASE_SERVICE_KEY=eyJhbGc... (service_role key)

# JWT (generar un secreto seguro)
SECRET_KEY=tu-secreto-super-seguro-aqui-12345
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=10080

# Google Cloud - Document AI (copiar del paso 2)
GOOGLE_APPLICATION_CREDENTIALS=./google-credentials.json
GOOGLE_PROJECT_ID=tu-proyecto-id
DOCUMENT_AI_LOCATION=us
DOCUMENT_AI_PROCESSOR_ID=abc123def456

# App
ENVIRONMENT=development
DEBUG=True
```

Para generar un SECRET_KEY seguro:
```bash
python -c "import secrets; print(secrets.token_urlsafe(32))"
```

---

## 🚀 Paso 4: Ejecutar el Backend

```bash
python main.py
```

Deberías ver:

```
INFO:     Uvicorn running on http://0.0.0.0:8000
INFO:     Application startup complete.
```

---

## 🧪 Paso 5: Probar que Funciona

### 5.1 Verificar Status

Abrir en el navegador:
```
http://localhost:8000
```

Deberías ver:
```json
{
  "message": "FinanceApp API funcionando",
  "version": "1.0.0",
  "status": "active"
}
```

### 5.2 Ver Documentación Interactiva

```
http://localhost:8000/docs
```

Aquí puedes probar todos los endpoints interactivamente.

### 5.3 Probar OCR

1. Ir a `http://localhost:8000/docs`
2. Expandir `POST /api/ocr/scan`
3. Click "Try it out"
4. Subir una foto de un recibo
5. Click "Execute"

Debería retornar:
```json
{
  "full_text": "OXXO\nTOTAL: $45.50...",
  "extracted": {
    "merchant_name": "OXXO",
    "total_amount": 45.50,
    "date": "2025-01-27",
    ...
  },
  "rfc_validation": {...},
  "suggested_category": "Comida",
  "deductible_info": {...}
}
```

### 5.4 Probar CRUD de Gastos

En `/docs`, probar:

**1. Crear gasto:**
```
POST /api/expenses/
```

Body:
```json
{
  "name": "Uber a la oficina",
  "description": "Viaje matutino",
  "amount": 120.50,
  "date": "2025-01-27T14:30:00",
  "project_id": "00000000-0000-0000-0000-000000000001",
  "category_id": "00000000-0000-0000-0000-000000000002"
}
```

**2. Listar gastos:**
```
GET /api/expenses/
```

**3. Validar RFC:**
```
POST /api/ocr/validate-rfc
```
Body: `XAXX010101000`

---

## 🐛 Troubleshooting

### Error: "Could not find google-credentials.json"

**Solución:**
```bash
# Verificar que el archivo existe
ls backend/google-credentials.json

# Si no existe, revisar paso 2.4
```

### Error: "Invalid Supabase credentials"

**Solución:**
1. Verificar que `.env` tiene las credenciales correctas
2. Verificar que el proyecto de Supabase está activo
3. Revisar que el schema se ejecutó correctamente

### Error: "Module not found"

**Solución:**
```bash
# Asegúrate de que el venv está activado
source venv/bin/activate

# Reinstalar dependencias
pip install -r requirements.txt
```

### Document AI API retorna error de permisos

**Solución:**
1. Verificar que Document AI API está habilitada en Google Cloud
2. Verificar que el Service Account tiene el rol "Document AI API User"
3. Verificar que `google-credentials.json` está en la carpeta correcta
4. Verificar que GOOGLE_PROJECT_ID y DOCUMENT_AI_PROCESSOR_ID están correctos en `.env`

### Error: "Processor not found"

**Solución:**
1. Verificar que creaste el Receipt Processor en Document AI
2. Verificar que el DOCUMENT_AI_PROCESSOR_ID en `.env` es correcto
3. Verificar que la región (DOCUMENT_AI_LOCATION) coincide con donde creaste el processor

---

## 📊 Próximos Pasos

Una vez que todo funcione:

1. ✅ Backend corriendo en `localhost:8000`
2. ✅ OCR funcionando con Google Vision
3. ✅ CRUD de gastos funcionando
4. ✅ Validación de RFC funcional

**Siguiente:**
- [ ] Integrar frontend React Native con backend
- [ ] Implementar ML para auto-categorización
- [ ] Implementar predicciones con Prophet
- [ ] Agregar autenticación JWT

---

## 🔐 Notas de Seguridad

- ⚠️ **NUNCA** compartir `SUPABASE_SERVICE_KEY` públicamente
- ⚠️ **NUNCA** subir `google-credentials.json` a Git
- ⚠️ **NUNCA** compartir el `.env`

Ya están en `.gitignore`:
```
.env
google-credentials.json
venv/
```

---

## 📞 ¿Problemas?

Si algo no funciona:

1. Verificar que Python 3.9+ esté instalado: `python --version`
2. Verificar que el venv esté activado
3. Verificar que todas las credenciales están correctas
4. Revisar los logs del servidor

Si necesitas ayuda, guarda el error completo y consúltame.
