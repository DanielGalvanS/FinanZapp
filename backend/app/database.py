from supabase import create_client, Client
from app.config import settings

# Cliente de Supabase (singleton)
supabase: Client = create_client(
    settings.supabase_url,
    settings.supabase_key
)

# Cliente con service key para operaciones admin
supabase_admin: Client = create_client(
    settings.supabase_url,
    settings.supabase_service_key
)

def get_db():
    """Dependency para obtener cliente de Supabase"""
    return supabase
