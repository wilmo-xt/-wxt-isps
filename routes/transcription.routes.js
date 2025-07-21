const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const transcriptionController = require('../controllers/transcription.controller');

// Configurar multer para upload de arquivos de áudio
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const uploadDir = process.env.VERCEL ? '/tmp' : 'uploads/audio/';
        cb(null, uploadDir);
    },
    filename: (req, file, cb) => {
        // Gerar nome único para o arquivo
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
    }
});

const upload = multer({
    storage: storage,
    limits: {
        fileSize: 25 * 1024 * 1024 // Limite de 25MB
    },
    fileFilter: (req, file, cb) => {
        // Verificar se é um arquivo de áudio
        const allowedMimeTypes = ['audio/mpeg', 'audio/mp3', 'audio/wav', 'audio/ogg', 'audio/webm'];
        if (allowedMimeTypes.includes(file.mimetype)) {
            cb(null, true);
        } else {
            cb(new Error('Apenas arquivos de áudio são permitidos (MP3, WAV, OGG, WebM)!'), false);
        }
    }
});

// Rota para upload de áudio
router.post('/api/transcription/upload', upload.single('audio'), transcriptionController.uploadAudio);

// Rota para verificar status da transcrição
router.get('/api/transcription/status/:id', transcriptionController.getTranscriptionStatus);

module.exports = router;

