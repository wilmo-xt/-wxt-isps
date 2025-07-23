const express = require('express');
const cors = require('cors');
const path = require('path');
const multer = require('multer');

// Importar rotas
const ocrRoutes = require('./routes/ocr.routes');
const transcriptionRoutes = require('./routes/transcription.routes');
const cloudinaryRoutes = require('./routes/cloudinary.routes');
const weatherRoutes = require('./routes/weather.routes');
const newsRoutes = require('./routes/news.routes');
const youtubeRoutes = require('./routes/youtube.routes');
const translateRoutes = require('./routes/translate.routes');
const geminiRoute = require('./routes/gemini');
const imageGenRoute = require('./routes/imagegen.routes');
const downloadRoutes = require('./routes/download.routes');

const app = express();
const PORT = process.env.PORT || 3020;

// Configurar CORS para permitir requisições de qualquer origem
app.use(cors({
    origin: '*',
    methods: ['GET', 'POST'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

// Middleware para parsing JSON
app.use(express.json());

// Criar diretórios necessários se não estiver no Vercel
if (!process.env.VERCEL) {
    const fs = require('fs');
    const uploadDirs = ['uploads', 'uploads/audio', 'uploads/cloudinary'];
    uploadDirs.forEach(dir => {
        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir, { recursive: true });
        }
    });
}

// Servir arquivos estáticos da pasta public
app.use(express.static(path.join(__dirname, 'public')));

// Registrar rotas
app.use(ocrRoutes);
app.use(transcriptionRoutes);
app.use(cloudinaryRoutes);
app.use(weatherRoutes);
app.use(newsRoutes);
app.use(youtubeRoutes);
app.use(translateRoutes);
app.use(geminiRoute);
app.use(imageGenRoute);
app.use(downloadRoutes);


// Rota principal - servir a tela inicial
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'initial-screen.html'));
});

// Rota para a página principal do app
app.get('/main.html', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'main.html'));
});

// Rota para página do criador
app.get('/creator.html', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'creator.html'));
});

// Rota para política de privacidade
app.get('/privacy-policy.html', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'privacy-policy.html'));
});

// Rota para página de OCR
app.get('/ocr.html', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'ocr.html'));
});

// Rota para página de transcrição de áudio
app.get('/transcription.html', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'transcription.html'));
});

// Rota para página de upload de mídias
app.get('/upload.html', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'upload.html'));
});

// Rota para página de clima
app.get('/weather.html', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'weather.html'));
});

// Rota para página de notícias
app.get('/news.html', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'news.html'));
});

// Rota para página de busca de vídeos
app.get('/youtube.html', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'youtube.html'));
});

// Rota para página de tradução
app.get('/translate.html', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'translate.html'));
});


app.use(express.json());
app.use('/api', geminiRoute); // agora acessa via POST /api/chat

// Rota para página de chat com a IA Gemini
app.get('/chat.html', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'chat.html'));
});

// Rota para página de busca de parcerias 
app.get('/parcerias.html', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'parcerias.html'));
});

// Rota para página de conversas
app.get('/conversas.html', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'conversas.html'));
});

// Rota para página de anúncios 
app.get('/anuncios.html', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'anuncios.html'));
});

// Rota para página de geração de imagens
app.get('/imagegen.html', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'imagegen.html'));
});

// Rota para página de download 
app.get('/download.html', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'download.html'));
});

// Middleware de tratamento de erros do multer
app.use((error, req, res, next) => {
    if (error instanceof multer.MulterError) {
        if (error.code === 'LIMIT_FILE_SIZE') {
            return res.status(400).json({ 
                error: 'Arquivo muito grande. Limite máximo: 10MB para imagens, 25MB para áudios.' 
            });
        }
    }
    
    if (error.message && error.message.includes('Apenas arquivos')) {
        return res.status(400).json({ error: error.message });
    }
    
    console.error('Erro não tratado:', error);
    res.status(500).json({ error: 'Erro interno do servidor.' });
});

// Rota 404
app.use((req, res) => {
    res.status(404).sendFile(path.join(__dirname, 'public', '404.html'));
});

// Iniciar servidor
app.listen(PORT, '0.0.0.0', () => {
    console.log(`🚀 Servidor rodando em http://localhost:${PORT}`);
});

// Tratamento de erros não capturados
process.on('uncaughtException', (error) => {
    console.error('Erro não capturado:', error);
});

process.on('unhandledRejection', (reason, promise) => {
    console.error('Promise rejeitada não tratada:', reason);
});


