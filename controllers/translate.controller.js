const translateService = require('../services/translate.service');

/**
 * Controlador para gerenciar requisições de tradução de textos
 */
exports.translateText = async (req, res) => {
  try {
    const { text, from, to } = req.body;
    
    if (!text) {
      return res.status(400).json({ 
        error: 'O texto para tradução é obrigatório.' 
      });
    }
    
    if (!to) {
      return res.status(400).json({ 
        error: 'O idioma de destino é obrigatório.' 
      });
    }
    
    console.log(`Traduzindo texto de "${from || 'auto'}" para "${to}"`);
    
    const result = await translateService.translateText(text, from, to);
    
    res.json({
      success: true,
      translation: result.translation,
      detectedLanguage: result.detectedLanguage,
      from: result.from,
      to: result.to
    });
    
  } catch (error) {
    console.error('Erro no controlador de tradução:', error);
    
    res.status(500).json({ 
      error: error.message || 'Erro interno do servidor ao traduzir texto.' 
    });
  }
};

/**
 * Controlador para detectar idioma de um texto
 */
exports.detectLanguage = async (req, res) => {
  try {
    const { text } = req.body;
    
    if (!text) {
      return res.status(400).json({ 
        error: 'O texto para detecção de idioma é obrigatório.' 
      });
    }
    
    console.log(`Detectando idioma do texto`);
    
    const result = await translateService.detectLanguage(text);
    
    res.json({
      success: true,
      detectedLanguage: result.language,
      confidence: result.score
    });
    
  } catch (error) {
    console.error('Erro no controlador de detecção de idioma:', error);
    
    res.status(500).json({ 
      error: error.message || 'Erro interno do servidor ao detectar idioma.' 
    });
  }
};

