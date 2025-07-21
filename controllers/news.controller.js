const newsService = require('../services/news.service');

/**
 * Controlador para gerenciar requisições de notícias
 */
exports.getNews = async (req, res) => {
  try {
    const { query, limit } = req.query;
    
    if (!query) {
      return res.status(400).json({ 
        error: 'Parâmetro "query" é obrigatório.' 
      });
    }

    console.log(`Consultando notícias para: ${query}`);
    
    const newsData = await newsService.getNews(query, limit ? parseInt(limit) : 20);
    
    res.json({
      success: true,
      count: newsData.length,
      data: newsData
    });
    
  } catch (error) {
    console.error('Erro no controlador de notícias:', error);
    
    res.status(500).json({ 
      error: error.message || 'Erro interno do servidor ao consultar notícias.' 
    });
  }
};

