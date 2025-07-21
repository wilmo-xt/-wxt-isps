const fs = require('fs');
const ocrService = require('../services/ocr.service');

/**
 * Processa uma imagem para extrair texto usando OCR
 * @param {Object} req - Objeto de requisição Express
 * @param {Object} res - Objeto de resposta Express
 */
exports.processImage = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ error: 'Nenhuma imagem foi enviada.' });
        }

        console.log('Processando imagem:', req.file.filename);
        
        const imagePath = req.file.path;
        
        try {
            // Processar a imagem usando o serviço OCR
            const text = await ocrService.extractTextFromImage(imagePath);
            
            console.log('Texto extraído:', text);
            
            // Limpar o arquivo temporário
            fs.unlink(imagePath, (err) => {
                if (err) console.error('Erro ao deletar arquivo temporário:', err);
            });
            
            // Retornar o texto extraído
            res.json({ 
                success: true, 
                text: text.trim(),
                filename: req.file.originalname
            });
            
        } catch (error) {
            console.error('Erro no processamento OCR:', error);
            
            // Limpar arquivo se existir
            if (req.file && req.file.path) {
                fs.unlink(req.file.path, (err) => {
                    if (err) console.error('Erro ao deletar arquivo após erro:', err);
                });
            }
            
            throw error;
        }
        
    } catch (error) {
        console.error('Erro no controlador OCR:', error);
        
        res.status(500).json({ 
            error: 'Erro interno do servidor ao processar a imagem.',
            details: error.message 
        });
    }
};

