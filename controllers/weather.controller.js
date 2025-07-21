const weatherService = require('../services/weather.service');

/**
 * Controlador para gerenciar requisições de clima
 */
exports.getCurrentWeather = async (req, res) => {
  try {
    const { city } = req.query;
    
    if (!city) {
      return res.status(400).json({ 
        error: 'Parâmetro "city" é obrigatório.' 
      });
    }

    console.log(`Consultando clima para: ${city}`);
    
    const weatherData = await weatherService.getCurrentWeather(city);
    
    res.json({
      success: true,
      data: weatherData
    });
    
  } catch (error) {
    console.error('Erro no controlador de clima:', error);
    
    const statusCode = error.message.includes('não encontrada') ? 404 : 500;
    
    res.status(statusCode).json({ 
      error: error.message || 'Erro interno do servidor ao consultar clima.' 
    });
  }
};

