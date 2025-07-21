const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const cloudinaryController = require('../controllers/cloudinary.controller');

// Configurar diretório para uploads
const uploadDir = process.env.VERCEL ? '/tmp' : path.join(__dirname, '..', 'uploads', 'cloudinary');
// Criar diretório se não existir
const fs = require('fs');
if (!fs.existsSync(uploadDir) && !process.env.VERCEL) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Configurar multer para upload de arquivos
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
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
    fileSize: 50 * 1024 * 1024 // Limite de 50MB
  },
  fileFilter: (req, file, cb) => {
    // Aceitar todos os tipos de arquivo
    cb(null, true);
  }
});

// Rota para upload de mídia
router.post('/api/upload', upload.single('media'), cloudinaryController.uploadMedia);

module.exports = router;

