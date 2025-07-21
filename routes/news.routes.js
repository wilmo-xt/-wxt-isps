const express = require('express');
const router = express.Router();
const newsController = require('../controllers/news.controller');

// Rota para consultar notícias
router.get('/api/news', newsController.getNews);

module.exports = router;

