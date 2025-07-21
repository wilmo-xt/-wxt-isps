const translate = require('bing-translate-api');

/**
 * Serviço para tradução de textos usando bing-translate-api
 */
class TranslateService {
  /**
   * Traduz um texto de um idioma para outro
   * @param {string} text - Texto a ser traduzido
   * @param {string} from - Idioma de origem (opcional, 'auto' para detecção automática)
   * @param {string} to - Idioma de destino
   * @returns {Promise<Object>} - Objeto com a tradução e informações adicionais
   */
  async translateText(text, from = 'auto', to) {
    try {
      console.log(`Traduzindo texto de "${from}" para "${to}"`);
      
      // Limitar o tamanho do texto para evitar problemas com a API
      const limitedText = text.length > 5000 ? text.substring(0, 5000) : text;
      
      // Realizar a tradução
      const result = await translate.translate(limitedText, from, to, true);
      
      console.log(`Tradução concluída. Idioma detectado: ${result.language.from}`);
      
      return {
        translation: result.translation,
        detectedLanguage: result.language.from,
        from: from === 'auto' ? result.language.from : from,
        to: to
      };
    } catch (error) {
      console.error('Erro ao traduzir texto:', error);
      
      // Tratar erros específicos
      if (error.message.includes('language not supported')) {
        throw new Error('Idioma não suportado. Por favor, escolha outro idioma.');
      } else if (error.message.includes('rate limit')) {
        throw new Error('Limite de requisições excedido. Tente novamente mais tarde.');
      } else if (error.message.includes('network')) {
        throw new Error('Erro de conexão. Verifique sua internet e tente novamente.');
      }
      
      throw new Error(`Falha ao traduzir texto`);
    }
  }

  /**
   * Detecta o idioma de um texto
   * @param {string} text - Texto para detecção de idioma
   * @returns {Promise<Object>} - Objeto com o idioma detectado e confiança
   */
  async detectLanguage(text) {
    try {
      console.log('Detectando idioma do texto');
      
      // Limitar o tamanho do texto para evitar problemas com a API
      const limitedText = text.length > 1000 ? text.substring(0, 1000) : text;
      
      // Realizar a detecção de idioma
      const result = await translate.translate(limitedText, 'auto', 'en', true);
      
      console.log(`Idioma detectado: ${result.language.from} (confiança: ${result.language.score})`);
      
      return {
        language: result.language.from,
        score: result.language.score
      };
    } catch (error) {
      console.error('Erro ao detectar idioma:', error);
      throw new Error(`Falha ao detectar idioma`);
    }
  }

  /**
   * Obtém a lista de idiomas suportados
   * @returns {Object} - Objeto com os idiomas suportados
   */
  getSupportedLanguages() {
    // Lista de idiomas suportados pelo Bing Translate
    return {
      'auto': 'Detectar idioma',
      'af': 'Africâner',
      'ar': 'Árabe',
      'bg': 'Búlgaro',
      'ca': 'Catalão',
      'cs': 'Tcheco',
      'cy': 'Galês',
      'da': 'Dinamarquês',
      'de': 'Alemão',
      'el': 'Grego',
      'en': 'Inglês',
      'es': 'Espanhol',
      'et': 'Estoniano',
      'fa': 'Persa',
      'fi': 'Finlandês',
      'fr': 'Francês',
      'he': 'Hebraico',
      'hi': 'Hindi',
      'hr': 'Croata',
      'hu': 'Húngaro',
      'id': 'Indonésio',
      'is': 'Islandês',
      'it': 'Italiano',
      'ja': 'Japonês',
      'ko': 'Coreano',
      'lt': 'Lituano',
      'lv': 'Letão',
      'ms': 'Malaio',
      'mt': 'Maltês',
      'nl': 'Holandês',
      'no': 'Norueguês',
      'pl': 'Polonês',
      'pt': 'Português',
      'ro': 'Romeno',
      'ru': 'Russo',
      'sk': 'Eslovaco',
      'sl': 'Esloveno',
      'sv': 'Sueco',
      'th': 'Tailandês',
      'tr': 'Turco',
      'uk': 'Ucraniano',
      'ur': 'Urdu',
      'vi': 'Vietnamita',
      'zh-Hans': 'Chinês (Simplificado)',
      'zh-Hant': 'Chinês (Tradicional)'
    };
  }
}

module.exports = new TranslateService();

