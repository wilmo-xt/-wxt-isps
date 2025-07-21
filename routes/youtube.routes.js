const express = require('express');
const router = express.Router();
const youtubeController = require('../controllers/youtube.controller');

// Rota para buscar vídeos do YouTube
router.get('/api/youtube', youtubeController.searchVideos);

module.exports = router;

