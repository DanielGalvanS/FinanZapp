import apiService from './apiService';

/**
 * Servicio para funcionalidad de OCR y escaneo de recibos
 */
class OcrService {
  /**
   * Escanea un recibo y crea un expense automáticamente
   *
   * @param {string} imageUri - URI de la imagen del recibo
   * @param {string} projectId - UUID del proyecto
   * @returns {Promise<Object>} - Expense creado con datos OCR
   */
  async scanAndCreateExpense(imageUri, projectId) {
    try {
      const formData = new FormData();

      // Agregar imagen
      const filename = imageUri.split('/').pop();
      const match = /\.(\w+)$/.exec(filename);
      const type = match ? `image/${match[1]}` : 'image/jpeg';

      formData.append('file', {
        uri: imageUri,
        name: filename,
        type: type,
      });

      // Agregar project_id
      formData.append('project_id', projectId);

      console.log('[OCR] Enviando recibo para escanear...');
      console.log('[OCR] Project ID:', projectId);
      console.log('[OCR] Image URI:', imageUri);

      const response = await apiService.postFormData(
        '/api/ocr/scan-and-create-expense',
        formData
      );

      console.log('[OCR] Respuesta recibida:', response);

      return response;
    } catch (error) {
      console.error('[OCR] Error al escanear recibo:', error);
      throw new Error(error.message || 'Error al escanear el recibo');
    }
  }

  /**
   * Solo escanea el recibo sin crear expense (útil para preview)
   *
   * @param {string} imageUri - URI de la imagen del recibo
   * @returns {Promise<Object>} - Datos extraídos del OCR
   */
  async scanReceiptOnly(imageUri) {
    try {
      const formData = new FormData();

      const filename = imageUri.split('/').pop();
      const match = /\.(\w+)$/.exec(filename);
      const type = match ? `image/${match[1]}` : 'image/jpeg';

      formData.append('file', {
        uri: imageUri,
        name: filename,
        type: type,
      });

      console.log('[OCR] Escaneando recibo (solo lectura)...');

      const response = await apiService.postFormData(
        '/api/ocr/scan',
        formData
      );

      return response;
    } catch (error) {
      console.error('[OCR] Error al escanear recibo:', error);
      throw new Error(error.message || 'Error al escanear el recibo');
    }
  }

  /**
   * Valida un RFC mexicano
   */
  async validateRFC(rfc) {
    try {
      const response = await apiService.post('/api/ocr/validate-rfc', { rfc });
      return response;
    } catch (error) {
      console.error('[OCR] Error al validar RFC:', error);
      throw error;
    }
  }

  /**
   * Calcula IVA de un subtotal
   */
  async calculateTax(subtotal) {
    try {
      const response = await apiService.post('/api/ocr/calculate-tax', { subtotal });
      return response;
    } catch (error) {
      console.error('[OCR] Error al calcular IVA:', error);
      throw error;
    }
  }
}

export default new OcrService();
