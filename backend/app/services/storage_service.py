from supabase import Client
from typing import Optional
import uuid
from datetime import datetime

class StorageService:
    """Servicio para manejar uploads a Supabase Storage"""

    BUCKET_NAME = "receipts"

    @staticmethod
    async def upload_receipt_image(
        db: Client,
        image_bytes: bytes,
        file_extension: str = "jpg"
    ) -> Optional[str]:
        """
        Sube una imagen de recibo a Supabase Storage

        Args:
            db: Cliente de Supabase
            image_bytes: Bytes de la imagen
            file_extension: Extensión del archivo (jpg, png, etc.)

        Returns:
            URL pública de la imagen subida
        """
        try:
            # Generar nombre único para el archivo
            timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
            unique_id = str(uuid.uuid4())[:8]
            file_name = f"receipt_{timestamp}_{unique_id}.{file_extension}"

            # Subir a Supabase Storage
            result = db.storage.from_(StorageService.BUCKET_NAME).upload(
                file_name,
                image_bytes,
                file_options={"content-type": f"image/{file_extension}"}
            )

            # Obtener URL pública
            public_url = db.storage.from_(StorageService.BUCKET_NAME).get_public_url(file_name)

            return public_url

        except Exception as e:
            print(f"Error al subir imagen: {str(e)}")
            return None

storage_service = StorageService()
