const express = require('express');
const router = express.Router();
const { search } = require('aptoide-api');

// Rota GET /api/aptoide?q=nome_do_app
router.get('/api/aptoide', async (req, res) => {
  const termo = req.query.q;
  if (!termo) {
    return res.status(400).json({ error: 'Parâmetro "q" é obrigatório.' });
  }

  try {
    const resultados = await search(termo, 5);
    res.json(resultados);
    //console.log(resultados);
  } catch (error) {
    console.error('Erro ao buscar na Aptoide:', error);
    res.status(500).json({ error: 'Erro ao buscar apps.' });
  }
});

module.exports = router;