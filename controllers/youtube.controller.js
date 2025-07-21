const youtubeService = require('../services/youtube.service');

/**
 * Controlador para gerenciar requisições de busca de vídeos do YouTube
 */
exports.searchVideos = async (req, res) => {
  try {
    const { query, limit } = req.query;
    
    if (!query) {
      return res.status(400).json({ 
        error: 'Parâmetro "query" é obrigatório.' 
      });
    }

    console.log(`Buscando vídeos para: ${query}`);
    
    const videos = await youtubeService.searchVideos(query, limit ? parseInt(limit) : 10);
    
    res.json({
      success: true,
      count: videos.length,
      data: videos
    });
    
  } catch (error) {
    console.error('Erro no controlador de busca de vídeos:', error);
    
    res.status(500).json({ 
      error: error.message || 'Erro interno do servidor ao buscar vídeos.' 
    });
  }
};

