const cloudinary = require('cloudinary').v2;
const fs = require('fs');
const path = require('path');

// Configuração do Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME || 'dyqjrhofx',
  api_key: process.env.CLOUDINARY_API_KEY || '821489784785338',
  api_secret: process.env.CLOUDINARY_API_SECRET || 'O0BlKrzbyotWTdxb5tgHx1qAG9A'
});

/**
 * Serviço para upload de mídias usando o Cloudinary
 */
class CloudinaryService {
  /**
   * Faz upload de um arquivo para o Cloudinary
   * @param {string} filePath - Caminho para o arquivo a ser enviado
   * @param {string} resourceType - Tipo de recurso (image, video, raw, auto)
   * @param {Object} options - Opções adicionais para o upload
   * @returns {Promise<Object>} - Resposta do Cloudinary com informações do upload
   */
  async uploadMedia(filePath, resourceType = 'auto', options = {}) {
    try {
      // Verificar se o arquivo existe
      if (!fs.existsSync(filePath)) {
        throw new Error(`Arquivo não encontrado: ${filePath}`);
      }

      // Definir pasta no Cloudinary com base no tipo de recurso
      const folder = this.getFolderByResourceType(resourceType);
      
      // Configurar opções padrão
      const defaultOptions = {
        folder,
        resource_type: resourceType,
        use_filename: true,
        unique_filename: true,
      };

      // Mesclar opções padrão com opções fornecidas
      const uploadOptions = { ...defaultOptions, ...options };

      // Fazer upload para o Cloudinary
      const result = await cloudinary.uploader.upload(filePath, uploadOptions);
      
      return {
        success: true,
        url: result.secure_url,
        public_id: result.public_id,
        resource_type: result.resource_type,
        format: result.format,
        original_filename: result.original_filename,
        bytes: result.bytes,
        created_at: result.created_at,
        width: result.width,
        height: result.height,
        duration: result.duration,
      };
    } catch (error) {
      console.error('Erro ao fazer upload para o Cloudinary:', error);
      throw new Error(`Falha ao fazer upload para o Cloudinary: ${error.message}`);
    }
  }

  /**
   * Determina a pasta no Cloudinary com base no tipo de recurso
   * @param {string} resourceType - Tipo de recurso
   * @returns {string} - Nome da pasta
   */
  getFolderByResourceType(resourceType) {
    switch (resourceType) {
      case 'image':
        return 'ocr-app/images';
      case 'video':
        return 'ocr-app/videos';
      case 'audio':
        return 'ocr-app/audios';
      case 'raw':
        return 'ocr-app/documents';
      default:
        return 'ocr-app/uploads';
    }
  }

  /**
   * Determina o tipo de recurso com base no MIME type do arquivo
   * @param {string} mimeType - MIME type do arquivo
   * @returns {string} - Tipo de recurso para o Cloudinary
   */
  getResourceTypeByMimeType(mimeType) {
    if (mimeType.startsWith('image/')) {
      return 'image';
    } else if (mimeType.startsWith('video/')) {
      return 'video';
    } else if (mimeType.startsWith('audio/')) {
      return 'video'; // Cloudinary trata áudio como video
    } else {
      return 'raw'; // Para documentos e outros tipos
    }
  }

  /**
   * Gera uma URL de transformação para uma mídia no Cloudinary
   * @param {string} publicId - ID público da mídia no Cloudinary
   * @param {string} resourceType - Tipo de recurso
   * @param {Object} transformations - Transformações a serem aplicadas
   * @returns {string} - URL com transformações
   */
  generateUrl(publicId, resourceType = 'image', transformations = {}) {
    try {
      return cloudinary.url(publicId, {
        resource_type: resourceType,
        ...transformations,
      });
    } catch (error) {
      console.error('Erro ao gerar URL do Cloudinary:', error);
      throw new Error(`Falha ao gerar URL do Cloudinary: ${error.message}`);
    }
  }
}

module.exports = new CloudinaryService();

