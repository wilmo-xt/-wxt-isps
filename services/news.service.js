const axios = require('axios');

/**
 * Serviço para consulta de notícias usando as APIs NewsAPI e GNews
 */
class NewsService {
  constructor() {
    this.NEWSAPI_KEY = process.env.NEWSAPI_KEY;
    this.GNEWS_KEY = process.env.GNEWS_KEY;
    this.NEWSAPI_URL = 'https://newsapi.org/v2/everything';
    this.GNEWS_URL = 'https://gnews.io/api/v4/search';
  }

  /**
   * Consulta notícias usando a NewsAPI
   * @param {string} query - Termo de busca
   * @param {number} pageSize - Número de resultados por página
   * @returns {Promise<Array>} - Lista de notícias
   */
  async getNewsFromNewsAPI(query, pageSize = 10) {
    try {
      const url = `${this.NEWSAPI_URL}?q=${encodeURIComponent(query)}&language=pt&pageSize=${pageSize}&apiKey=${this.NEWSAPI_KEY}`;
      
      const response = await axios.get(url);
      
      if (response.status !== 200) {
        throw new Error(`Erro ao consultar NewsAPI: ${response.statusText}`);
      }
      
      return this.formatNewsAPIData(response.data.articles);
    } catch (error) {
      console.error('Erro ao consultar NewsAPI:', error);
      return [];
    }
  }

  /**
   * Consulta notícias usando a GNews
   * @param {string} query - Termo de busca
   * @param {number} max - Número máximo de resultados
   * @returns {Promise<Array>} - Lista de notícias
   */
  async getNewsFromGNews(query, max = 10) {
    try {
      const url = `${this.GNEWS_URL}?q=${encodeURIComponent(query)}&lang=pt&max=${max}&token=${this.GNEWS_KEY}`;
      
      const response = await axios.get(url);
      
      if (response.status !== 200) {
        throw new Error(`Erro tente mais tarde ou reporte si possível`);
      }
      
      return this.formatGNewsData(response.data.articles);
    } catch (error) {
      console.error('Erro ao consultar GNews:', error);
      return [];
    }
  }

  /**
   * Consulta notícias de ambas as APIs e combina os resultados
   * @param {string} query - Termo de busca
   * @param {number} limit - Limite de resultados
   * @returns {Promise<Array>} - Lista combinada de notícias
   */
  async getNews(query, limit = 20) {
    try {
      // Consultar ambas as APIs em paralelo
      const [newsAPIResults, gNewsResults] = await Promise.all([
        this.getNewsFromNewsAPI(query, Math.ceil(limit / 2)),
        this.getNewsFromGNews(query, Math.ceil(limit / 2))
      ]);
      
      // Combinar resultados
      const combinedResults = [...newsAPIResults, ...gNewsResults];
      
      // Remover duplicatas (baseado na URL)
      const uniqueResults = this.removeDuplicates(combinedResults, 'url');
      
      // Ordenar por data (mais recentes primeiro)
      const sortedResults = this.sortByDate(uniqueResults);
      
      // Limitar ao número solicitado
      return sortedResults.slice(0, limit);
    } catch (error) {
      console.error('Erro ao consultar notícias:', error);
      throw new Error(`Falha ao cnsultar notícias tente mais tarde`);
    }
  }

  /**
   * Formata os dados recebidos da NewsAPI
   * @param {Array} articles - Artigos da NewsAPI
   * @returns {Array} - Artigos formatados
   */
  formatNewsAPIData(articles) {
    return articles.map(article => ({
      title: article.title,
      description: article.description,
      content: article.content,
      url: article.url,
      image: article.urlToImage,
      publishedAt: article.publishedAt,
      source: {
        name: article.source.name,
        api: 'NewsAPI'
      }
    }));
  }

  /**
   * Formata os dados recebidos da GNews
   * @param {Array} articles - Artigos da GNews
   * @returns {Array} - Artigos formatados
   */
  formatGNewsData(articles) {
    return articles.map(article => ({
      title: article.title,
      description: article.description,
      content: article.content,
      url: article.url,
      image: article.image,
      publishedAt: article.publishedAt,
      source: {
        name: article.source.name,
        api: 'GNews'
      }
    }));
  }

  /**
   * Remove artigos duplicados da lista
   * @param {Array} array - Lista de artigos
   * @param {string} key - Chave para comparação
   * @returns {Array} - Lista sem duplicatas
   */
  removeDuplicates(array, key) {
    return Array.from(new Map(array.map(item => [item[key], item])).values());
  }

  /**
   * Ordena artigos por data
   * @param {Array} array - Lista de artigos
   * @returns {Array} - Lista ordenada
   */
  sortByDate(array) {
    return array.sort((a, b) => new Date(b.publishedAt) - new Date(a.publishedAt));
  }
}

module.exports = new NewsService();

