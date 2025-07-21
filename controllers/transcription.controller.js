const fs = require('fs');
const transcriptionService = require('../services/transcription.service');

/**
 * Controlador para gerenciar transcrições de áudio
 */
exports.uploadAudio = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ error: 'Nenhum arquivo de áudio foi enviado.' });
        }

        console.log('Processando áudio:', req.file.filename);
        
        const audioPath = req.file.path;
        
        try {
            // Fazer upload do áudio para AssemblyAI
            const uploadResponse = await transcriptionService.uploadAudio(audioPath);
            
            if (!uploadResponse || !uploadResponse.upload_url) {
                throw new Error('Falha ao fazer upload do áudio para o serviço de transcrição.');
            }
            
            // Solicitar transcrição
            const transcriptionResponse = await transcriptionService.requestTranscription(uploadResponse.upload_url);
            
            if (!transcriptionResponse || !transcriptionResponse.id) {
                throw new Error('Falha ao iniciar a transcrição do áudio.');
            }
            
            // Retornar o ID da transcrição para o cliente
            res.json({ 
                success: true, 
                message: 'Áudio enviado para transcrição com sucesso.',
                transcription_id: transcriptionResponse.id,
                filename: req.file.originalname
            });
            
        } catch (error) {
            console.error('Erro no processamento da transcrição:', error);
            throw error;
        }
        
    } catch (error) {
        console.error('Erro no controlador de transcrição:', error);
        
        // Limpar arquivo se existir
        if (req.file && req.file.path) {
            fs.unlink(req.file.path, (err) => {
                if (err) console.error('Erro ao deletar arquivo após erro:', err);
            });
        }
        
        res.status(500).json({ 
            error: 'Erro interno do servidor ao processar o áudio.',
            details: error.message 
        });
    }
};

/**
 * Verifica o status de uma transcrição
 */
exports.getTranscriptionStatus = async (req, res) => {
    try {
        const transcriptionId = req.params.id;
        
        if (!transcriptionId) {
            return res.status(400).json({ error: 'ID da transcrição não fornecido.' });
        }
        
        // Verificar status da transcrição
        const statusResponse = await transcriptionService.checkTranscriptionStatus(transcriptionId);
        
        if (!statusResponse) {
            throw new Error('Falha ao verificar o status da transcrição.');
        }
        
        // Retornar o status da transcrição
        res.json(statusResponse);
        
    } catch (error) {
        console.error('Erro ao verificar status da transcrição:', error);
        
        res.status(500).json({ 
            error: 'Erro interno do servidor ao verificar status da transcrição.',
            details: error.message 
        });
    }
};

