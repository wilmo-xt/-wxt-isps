const yts = require('yt-search');

/**
 * Serviço para busca de vídeos do YouTube usando yt-search
 */
class YouTubeService {
  /**
   * Busca vídeos no YouTube com base em um termo de pesquisa
   * @param {string} query - Termo de busca
   * @param {number} limit - Número máximo de resultados (padrão: 10)
   * @returns {Promise<Array>} - Lista de vídeos encontrados
   */
  async searchVideos(query, limit = 10) {
    try {
      console.log(`Buscando vídeos para: "${query}" (limite: ${limit})`);
      
      // Realizar a busca usando yt-search
      const results = await yts(query);
      
      // Filtrar apenas os vídeos (ignorar playlists, canais, etc.)
      const videos = results.videos
        .slice(0, limit)
        .map(video => this.formatVideoData(video));
      
      console.log(`Encontrados ${videos.length} vídeos para: "${query}"`);
      
      return videos;
    } catch (error) {
      console.error('Erro ao buscar vídeos:', error);
      throw new Error(`Falha ao buscar vídeos tente mais tarde`);
    }
  }

  /**
   * Formata os dados do vídeo para um formato mais amigável
   * @param {Object} video - Dados brutos do vídeo
   * @returns {Object} - Dados formatados
   */
  formatVideoData(video) {
    return {
      id: video.videoId,
      title: video.title,
      description: video.description,
      url: video.url,
      thumbnail: video.thumbnail,
      timestamp: video.timestamp,
      duration: video.seconds,
      views: video.views,
      author: {
        name: video.author.name,
        url: video.author.url
      }
    };
  }

  /**
   * Busca detalhes de um vídeo específico pelo ID
   * @param {string} videoId - ID do vídeo no YouTube
   * @returns {Promise<Object>} - Detalhes do vídeo
   */
  async getVideoById(videoId) {
    try {
      console.log(`Buscando detalhes do vídeo: ${videoId}`);
      
      // Buscar detalhes do vídeo
      const video = await yts({ videoId });
      
      if (!video) {
        throw new Error('Vídeo não encontrado');
      }
      
      return this.formatVideoData(video);
    } catch (error) {
      console.error('Erro ao buscar detalhes do vídeo:', error);
      throw new Error(`Falha ao buscar detalhes do vídeo`);
    }
  }
}

module.exports = new YouTubeService();

