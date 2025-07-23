/*
const express = require('express');
const router = express.Router();
const { fbdown, igdl, youtube, ttdl } = require('ab-downloader');

router.post('/api/download', async (req, res) => {
  const { url } = req.body;

  if (!url) {
    return res.status(400).json({ error: 'URL não fornecida.' });
  }

  try {
    let result;

    if (url.includes('facebook.com')) {
      const data = await fbdown(url);
      result = data.HD || data.Normal_video;
    } else if (url.includes('instagram.com')) {
      const data = await igdl(url);
      result = data[0]?.url;
    } else if (url.includes('youtube.com') || url.includes('youtu.be')) {
      const data = await youtube(url);
      result = data.mp4;
    } else if (url.includes('tiktok.com')) {
      const data = await ttdl(url);
      result = data.video?.[0];
    } else {
      return res.status(400).json({ error: 'Plataforma não suportada.' });
    }

    if (result) {
      return res.json({ download: result });
    } else {
      return res.status(404).json({ error: 'Vídeo não encontrado.' });
    }
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Erro ao processar o link.' });
  }
});

module.exports = router;
*/

const express = require('express');
const router = express.Router();
const { fbdown, igdl, youtube, ttdl } = require('ab-downloader');

// Função auxiliar para extrair informações do vídeo
function extractVideoInfo(data, platform) {
  const videoInfo = {
    success: true,
    platform: platform,
    title: '',
    duration: '',
    thumbnail: '',
    preview: '',
    download: '',
    filename: ''
  };

  try {
    switch (platform) {
      case 'facebook':
        videoInfo.title = data.title || 'Vídeo do Facebook';
        videoInfo.thumbnail = data.thumbnail || '';
        videoInfo.download = data.HD || data.Normal_video || data.SD;
        videoInfo.filename = `facebook_video_${Date.now()}.mp4`;
        break;

      case 'instagram':
        if (Array.isArray(data) && data.length > 0) {
          videoInfo.title = data[0].title || 'Vídeo do Instagram';
          videoInfo.thumbnail = data[0].thumbnail || '';
          videoInfo.download = data[0].url;
          videoInfo.filename = `instagram_video_${Date.now()}.mp4`;
        }
        break;

      case 'youtube':
        videoInfo.title = data.title || 'Vídeo do YouTube';
        videoInfo.duration = data.duration || '';
        videoInfo.thumbnail = data.thumbnail || '';
        videoInfo.download = data.mp4 || data.video;
        videoInfo.filename = `youtube_${data.title ? data.title.replace(/[^a-zA-Z0-9]/g, '_') : 'video'}_${Date.now()}.mp4`;
        break;

      case 'tiktok':
        videoInfo.title = data.title || 'Vídeo do TikTok';
        videoInfo.thumbnail = data.cover || data.thumbnail || '';
        videoInfo.download = data.video?.[0] || data.nowm || data.video;
        videoInfo.filename = `tiktok_video_${Date.now()}.mp4`;
        break;

      default:
        videoInfo.title = 'Vídeo baixado';
        videoInfo.filename = `video_${Date.now()}.mp4`;
    }

    // Limitar o tamanho do título
    if (videoInfo.title.length > 100) {
      videoInfo.title = videoInfo.title.substring(0, 97) + '...';
    }

    return videoInfo;
  } catch (error) {
    console.error('Erro ao extrair informações do vídeo:', error);
    return {
      success: false,
      error: 'Erro ao processar informações do vídeo'
    };
  }
}

// Função para detectar a plataforma
function detectPlatform(url) {
  const urlLower = url.toLowerCase();
  
  if (urlLower.includes('facebook.com') || urlLower.includes('fb.watch')) {
    return 'facebook';
  } else if (urlLower.includes('instagram.com')) {
    return 'instagram';
  } else if (urlLower.includes('youtube.com') || urlLower.includes('youtu.be')) {
    return 'youtube';
  } else if (urlLower.includes('tiktok.com')) {
    return 'tiktok';
  }
  
  return null;
}

// Função para validar URL
function isValidUrl(string) {
  try {
    new URL(string);
    return true;
  } catch (_) {
    return false;
  }
}

router.post('/api/download', async (req, res) => {
  const { url } = req.body;

  // Validação de entrada
  if (!url) {
    return res.status(400).json({ 
      success: false,
      error: 'URL não fornecida. Por favor, insira um link válido.' 
    });
  }

  if (!isValidUrl(url)) {
    return res.status(400).json({ 
      success: false,
      error: 'URL inválida. Verifique se o link está correto.' 
    });
  }

  const platform = detectPlatform(url);
  
  if (!platform) {
    return res.status(400).json({ 
      success: false,
      error: 'Plataforma não suportada. Suportamos YouTube, TikTok, Instagram e Facebook.' 
    });
  }

  try {
    let data;
    let videoInfo;

    // Log para debugging
    console.log(`Processando URL: ${url} (Plataforma: ${platform})`);

    switch (platform) {
      case 'facebook':
        try {
          data = await fbdown(url);
          videoInfo = extractVideoInfo(data, 'facebook');
        } catch (error) {
          console.error('Erro no Facebook:', error);
          throw new Error('Erro ao processar vídeo do Facebook. Verifique se o vídeo é público.');
        }
        break;

      case 'instagram':
        try {
          data = await igdl(url);
          videoInfo = extractVideoInfo(data, 'instagram');
        } catch (error) {
          console.error('Erro no Instagram:', error);
          throw new Error('Erro ao processar vídeo do Instagram. Verifique se o post é público.');
        }
        break;

      case 'youtube':
        try {
          data = await youtube(url);
          videoInfo = extractVideoInfo(data, 'youtube');
        } catch (error) {
          console.error('Erro no YouTube:', error);
          throw new Error('Erro ao processar vídeo do YouTube. Verifique se o vídeo está disponível.');
        }
        break;

      case 'tiktok':
        try {
          data = await ttdl(url);
          videoInfo = extractVideoInfo(data, 'tiktok');
        } catch (error) {
          console.error('Erro no TikTok:', error);
          throw new Error('Erro ao processar vídeo do TikTok. Verifique se o vídeo está disponível.');
        }
        break;
    }

    // Verificar se o download foi bem-sucedido
    if (!videoInfo.success || !videoInfo.download) {
      return res.status(404).json({ 
        success: false,
        error: 'Não foi possível encontrar o vídeo. Verifique se o link está correto e se o vídeo está disponível publicamente.' 
      });
    }

    // Log de sucesso
    console.log(`Vídeo processado com sucesso: ${videoInfo.title}`);

    // Resposta com informações completas
    return res.json({
      success: true,
      platform: videoInfo.platform,
      title: videoInfo.title,
      duration: videoInfo.duration,
      thumbnail: videoInfo.thumbnail,
      preview: videoInfo.preview,
      download: videoInfo.download,
      filename: videoInfo.filename,
      message: 'Vídeo processado com sucesso!'
    });

  } catch (error) {
    console.error('Erro geral:', error);
    
    // Resposta de erro mais específica
    let errorMessage = 'Erro ao processar o vídeo.';
    
    if (error.message) {
      errorMessage = error.message;
    } else if (error.code === 'ENOTFOUND') {
      errorMessage = 'Erro de conexão. Verifique sua internet.';
    } else if (error.code === 'ETIMEDOUT') {
      errorMessage = 'Timeout na requisição. Tente novamente.';
    }

    return res.status(500).json({ 
      success: false,
      error: errorMessage,
      platform: platform || 'desconhecida'
    });
  }
});

// Rota para informações da API
router.get('/api/info', (req, res) => {
  res.json({
    name: 'Video Downloader API',
    version: '2.0.0',
    supported_platforms: ['YouTube', 'TikTok', 'Instagram', 'Facebook'],
    features: ['Video Download', 'Thumbnail Preview', 'Video Information'],
    status: 'active'
  });
});

// Rota para verificar saúde da API
router.get('/api/health', (req, res) => {
  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});

module.exports = router;
