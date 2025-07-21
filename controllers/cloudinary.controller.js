const fs = require('fs');
const cloudinaryService = require('../services/cloudinary.service');

/**
 * Controlador para gerenciar uploads para o Cloudinary
 */
exports.uploadMedia = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'Nenhum arquivo foi enviado.' });
    }

    console.log('Processando upload para Cloudinary:', req.file.filename);
    
    const filePath = req.file.path;
    const mimeType = req.file.mimetype;
    
    try {
      // Determinar o tipo de recurso com base no MIME type
      const resourceType = cloudinaryService.getResourceTypeByMimeType(mimeType);
      
      // Fazer upload para o Cloudinary
      const uploadResult = await cloudinaryService.uploadMedia(filePath, resourceType);
      
      // Limpar o arquivo temporário
      fs.unlink(filePath, (err) => {
        if (err) console.error('Erro ao deletar arquivo temporário:', err);
      });
      
      // Retornar o resultado do upload
      res.json({ 
        success: true, 
        message: 'Arquivo enviado com sucesso para o Cloudinary.',
        file: {
          url: uploadResult.url,
          public_id: uploadResult.public_id,
          resource_type: uploadResult.resource_type,
          format: uploadResult.format,
          original_filename: req.file.originalname,
          size: uploadResult.bytes,
          mime_type: mimeType
        }
      });
      
    } catch (error) {
      console.error('Erro no upload para Cloudinary:', error);
      
      // Limpar arquivo se existir
      if (req.file && req.file.path) {
        fs.unlink(req.file.path, (err) => {
          if (err) console.error('Erro ao deletar arquivo após erro:', err);
        });
      }
      
      throw error;
    }
    
  } catch (error) {
    console.error('Erro no controlador de upload:', error);
    
    res.status(500).json({ 
      error: 'Erro interno do servidor ao processar o upload.',
      details: error.message 
    });
  }
};

