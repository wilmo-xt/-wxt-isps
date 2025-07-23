const express = require('express');
const router = express.Router();
const axios = require('axios');
require('dotenv').config();

const modelos = [
  'stabilityai/stable-diffusion-2-1',
  'stabilityai/stable-diffusion-2',
  'stabilityai/sdxl'
];

router.post('/api/imagegen', async (req, res) => {
  const { prompt } = req.body;
  if (!prompt) return res.status(400).json({ error: 'Prompt é obrigatório.' });

  for (const modelo of modelos) {
    try {
      const response = await axios.post(
        `https://api-inference.huggingface.co/models/${modelo}`,
        { inputs: prompt },
        {
          headers: {
            Authorization: `Bearer ${process.env.HUGGINGFACE_TOKEN}`,
            Accept: 'application/json',
          },
          responseType: 'arraybuffer',
          timeout: 60000 // 60s timeout para evitar travar muito
        }
      );

      res.set('Content-Type', 'image/png');
      return res.send(Buffer.from(response.data));
    } catch (error) {
      console.warn(`Modelo ${modelo} falhou:`, error.response?.data || error.message);
      // tenta o próximo modelo
    }
  }

  res.status(500).json({ error: 'Falha ao gerar imagem com todos os modelos disponíveis.' });
});

module.exports = router;