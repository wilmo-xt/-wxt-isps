const express = require('express');
const router = express.Router();
const weatherController = require('../controllers/weather.controller');

// Rota para consultar clima atual
router.get('/api/weather', weatherController.getCurrentWeather);

module.exports = router;

