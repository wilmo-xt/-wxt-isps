const express = require('express');
const router = express.Router();
const translateController = require('../controllers/translate.controller');

// Rota para traduzir texto
router.post('/api/translate', translateController.translateText);

// Rota para detectar idioma
router.post('/api/translate/detect', translateController.detectLanguage);

module.exports = router;

