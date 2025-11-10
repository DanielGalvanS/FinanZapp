from pydantic_settings import BaseSettings
from functools import lru_cache

class Settings(BaseSettings):
    """Configuración de la aplicación"""

    # App
    app_name: str = "FinanceApp API"
    environment: str = "development"
    debug: bool = True

    # Supabase
    supabase_url: str
    supabase_key: str
    supabase_service_key: str

    # JWT
    secret_key: str
    algorithm: str = "HS256"
    access_token_expire_minutes: int = 10080  # 7 días

    # Google Cloud - Document AI
    google_application_credentials: str
    google_project_id: str
    document_ai_location: str = "us"  # us, eu, asia
    document_ai_processor_id: str

    class Config:
        env_file = ".env"
        case_sensitive = False

@lru_cache()
def get_settings():
    """Obtener settings (cached)"""
    return Settings()

settings = get_settings()
