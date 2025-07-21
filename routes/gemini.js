
const express = require('express');
const router = express.Router();
const axios = require('axios');

const API_KEY = process.env.GEMINI_API_KEY || 'AIzaSyDEUctzgVPq9jiP95Jib_sFApAflnvC16Y';

const GEMINI_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${API_KEY}`;

let historico = [];

router.post('/api/chat', async (req, res) => {
  const userMessage = req.body.message;
  if (!userMessage) {
    return res.status(400).json({ error: 'Mensagem vazia' });
  }

  historico.push({ role: 'user', parts: [{ text: userMessage }] });

  try {
    const resposta = await axios.post(GEMINI_URL, {
      contents: historico
    });

    const iaResposta = resposta.data.candidates?.[0]?.content?.parts?.[0]?.text || 'Sem resposta.';
    historico.push({ role: 'model', parts: [{ text: iaResposta }] });

    res.json({ reply: iaResposta });
  } catch (error) {
    console.error('Erro Gemini:', error.response?.data || error.message);
    res.status(500).json({ error: 'Erro ao comunicar com a IA' });
  }
});

router.post('/api/reset', (req, res) => {
  historico = [];
  res.json({ message: 'Histórico limpo' });
});

module.exports = router;