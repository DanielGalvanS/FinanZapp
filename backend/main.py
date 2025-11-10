from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv
import os

# Cargar variables de entorno
load_dotenv()

# Crear app
app = FastAPI(
    title="FinanceApp API",
    description="Backend para app de finanzas con ML y OCR",
    version="1.0.0"
)

# CORS - permitir que React Native se conecte
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # En producción, especifica los dominios permitidos
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Rutas básicas
@app.get("/")
async def root():
    return {
        "message": "FinanceApp API funcionando",
        "version": "1.0.0",
        "status": "active"
    }

@app.get("/health")
async def health_check():
    return {
        "status": "healthy",
        "environment": os.getenv("ENVIRONMENT", "development")
    }

# Importar routers
from app.routers import ocr, expenses
# from app.routers import ml  # Próximamente

# Registrar routers
app.include_router(ocr.router, prefix="/api/ocr", tags=["OCR"])
app.include_router(expenses.router, prefix="/api/expenses", tags=["Expenses"])

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(
        "main:app",
        host="0.0.0.0",
        port=8000,
        reload=True  # Auto-reload en desarrollo
    )
