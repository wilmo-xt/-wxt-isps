# OCR, Transcrição de Áudio, Upload de Mídias, Clima, Notícias, Vídeos e Tradução

Uma aplicação web simples e responsiva para extrair texto de imagens usando Tesseract.js, transcrever áudio usando a API da AssemblyAI, fazer upload de mídias para o Cloudinary, consultar dados climáticos, buscar notícias atualizadas, buscar vídeos do YouTube e traduzir textos entre diversos idiomas.

## Funcionalidades

### OCR (Extração de Texto de Imagens)
- Interface responsiva otimizada para dispositivos móveis
- Upload de imagens por clique ou arrastar e soltar
- Extração de texto usando Tesseract.js (OCR)
- Suporte para idioma português
- Visualização do texto extraído em tempo real

### Transcrição de Áudio
- Interface responsiva otimizada para dispositivos móveis
- Upload de arquivos de áudio por clique ou arrastar e soltar
- Transcrição de áudio usando a API da AssemblyAI
- Suporte para idioma português
- Visualização da transcrição em tempo real com status de processamento

### Upload de Mídias (Cloudinary)
- Interface responsiva otimizada para dispositivos móveis
- Upload de diversos tipos de arquivos (imagens, vídeos, áudios, documentos)
- Armazenamento em nuvem usando o Cloudinary
- Filtro por tipo de arquivo
- Preview de mídias antes do upload
- Retorno de URLs públicas para compartilhamento

### Consulta de Clima
- Interface responsiva otimizada para dispositivos móveis
- Consulta de dados climáticos em tempo real
- Visualização de temperatura, umidade, pressão, vento e mais
- Suporte para qualquer cidade do mundo
- Ícones dinâmicos baseados nas condições climáticas
- Dados fornecidos pela API OpenWeatherMap

### Consulta de Notícias
- Interface responsiva otimizada para dispositivos móveis
- Busca de notícias por termo ou assunto
- Visualização de notícias com imagens, títulos e descrições
- Acesso a múltiplas fontes de notícias
- Links para leitura completa das matérias
- Dados fornecidos pelas APIs NewsAPI e GNews

### Busca de Vídeos do YouTube
- Interface responsiva otimizada para dispositivos móveis
- Busca de vídeos por termo ou assunto
- Visualização de vídeos com thumbnails, títulos e descrições
- Exibição de informações como duração, visualizações e data de publicação
- Links diretos para assistir no YouTube
- Dados fornecidos pela biblioteca yt-search

### Tradução de Textos
- Interface responsiva otimizada para dispositivos móveis
- Tradução de textos entre diversos idiomas
- Detecção automática de idioma
- Suporte para mais de 40 idiomas
- Interface intuitiva com contagem de caracteres
- Dados fornecidos pela biblioteca bing-translate-api

## Tecnologias Utilizadas

- **Frontend**: HTML5, CSS3, JavaScript (Vanilla)
- **Backend**: Node.js, Express
- **OCR**: Tesseract.js
- **Transcrição de Áudio**: API da AssemblyAI
- **Armazenamento em Nuvem**: Cloudinary
- **Dados Climáticos**: API OpenWeatherMap
- **Notícias**: APIs NewsAPI e GNews
- **Busca de Vídeos**: yt-search
- **Tradução de Textos**: bing-translate-api
- **Upload de Arquivos**: Multer
- **Requisições HTTP**: Axios

## Como Executar Localmente

1. Clone o repositório
2. Instale as dependências:
   ```
   npm install
   ```
3. Inicie o servidor:
   ```
   npm start
   ```
4. Acesse a aplicação em seu navegador:
   ```
   http://localhost:2000
   ```

## Estrutura do Projeto

- `public/` - Arquivos estáticos (HTML, CSS, JavaScript)
  - `public/index.html` - Página de OCR
  - `public/transcription.html` - Página de transcrição de áudio
  - `public/upload.html` - Página de upload de mídias
  - `public/weather.html` - Página de consulta de clima
  - `public/news.html` - Página de consulta de notícias
  - `public/youtube.html` - Página de busca de vídeos
  - `public/translate.html` - Página de tradução de textos
- `routes/` - Rotas da aplicação
  - `routes/ocr.routes.js` - Rotas para OCR
  - `routes/transcription.routes.js` - Rotas para transcrição de áudio
  - `routes/cloudinary.routes.js` - Rotas para upload de mídias
  - `routes/weather.routes.js` - Rotas para consulta de clima
  - `routes/news.routes.js` - Rotas para consulta de notícias
  - `routes/youtube.routes.js` - Rotas para busca de vídeos
  - `routes/translate.routes.js` - Rotas para tradução de textos
- `controllers/` - Controladores para processamento de requisições
  - `controllers/ocr.controller.js` - Controlador para OCR
  - `controllers/transcription.controller.js` - Controlador para transcrição de áudio
  - `controllers/cloudinary.controller.js` - Controlador para upload de mídias
  - `controllers/weather.controller.js` - Controlador para consulta de clima
  - `controllers/news.controller.js` - Controlador para consulta de notícias
  - `controllers/youtube.controller.js` - Controlador para busca de vídeos
  - `controllers/translate.controller.js` - Controlador para tradução de textos
- `services/` - Serviços para lógica de negócio
  - `services/ocr.service.js` - Serviço para OCR
  - `services/transcription.service.js` - Serviço para transcrição de áudio
  - `services/cloudinary.service.js` - Serviço para upload de mídias
  - `services/weather.service.js` - Serviço para consulta de clima
  - `services/news.service.js` - Serviço para consulta de notícias
  - `services/youtube.service.js` - Serviço para busca de vídeos
  - `services/translate.service.js` - Serviço para tradução de textos
- `uploads/` - Diretório temporário para uploads de arquivos
  - `uploads/audio/` - Diretório para uploads de áudio
  - `uploads/cloudinary/` - Diretório para uploads de mídias

## Como Usar

### OCR (Extração de Texto de Imagens)
1. Acesse a página OCR (link na navegação)
2. Clique na área de upload ou arraste uma imagem
3. Clique no botão "Extrair Texto da Imagem"
4. Aguarde o processamento
5. Visualize o texto extraído da imagem

### Transcrição de Áudio
1. Acesse a página Transcrição (link na navegação)
2. Clique na área de upload ou arraste um arquivo de áudio
3. Clique no botão "Transcrever Áudio"
4. Aguarde o processamento (pode levar alguns minutos)
5. Visualize a transcrição do áudio

### Upload de Mídias (Cloudinary)
1. Acesse a página Upload (link na navegação)
2. Selecione o tipo de arquivo desejado (Todos, Imagens, Vídeos, Áudios, Documentos)
3. Clique na área de upload ou arraste um arquivo
4. Clique no botão "Enviar Arquivo para Cloudinary"
5. Aguarde o processamento
6. Visualize a URL pública do arquivo e copie para compartilhamento

### Consulta de Clima
1. Acesse a página Clima (link na navegação)
2. Digite o nome da cidade desejada
3. Clique no botão "Consultar Clima"
4. Aguarde o processamento
5. Visualize os dados climáticos atuais da cidade

### Consulta de Notícias
1. Acesse a página Notícias (link na navegação)
2. Digite um termo ou assunto para buscar
3. Clique no botão "Buscar Notícias"
4. Aguarde o processamento
5. Visualize as notícias encontradas
6. Clique em "Ler matéria completa" para acessar a fonte original

### Busca de Vídeos do YouTube
1. Acesse a página Vídeos (link na navegação)
2. Digite um termo ou assunto para buscar
3. Clique no botão "Buscar Vídeos"
4. Aguarde o processamento
5. Visualize os vídeos encontrados com thumbnails e informações
6. Clique em "Assistir no YouTube" para ver o vídeo completo

### Tradução de Textos
1. Acesse a página Tradução (link na navegação)
2. Selecione o idioma de origem (ou use detecção automática)
3. Selecione o idioma de destino
4. Digite ou cole o texto a ser traduzido
5. Clique no botão "Traduzir"
6. Aguarde o processamento
7. Visualize a tradução do texto

## Limitações

### OCR
- Suporta apenas arquivos de imagem (JPG, PNG, GIF, etc.)
- Tamanho máximo de arquivo: 10MB
- A precisão da extração depende da qualidade da imagem

### Transcrição de Áudio
- Suporta arquivos de áudio comuns (MP3, WAV, OGG, WebM)
- Tamanho máximo de arquivo: 25MB
- Requer conexão com a internet para acessar a API da AssemblyAI
- O tempo de processamento depende do tamanho do arquivo de áudio

### Upload de Mídias (Cloudinary)
- Tamanho máximo de arquivo: 50MB
- Requer conexão com a internet para acessar o Cloudinary
- Tipos de arquivo suportados: imagens, vídeos, áudios, documentos

### Consulta de Clima
- Requer conexão com a internet para acessar a API OpenWeatherMap
- Limitado a 60 consultas por minuto (plano gratuito)
- Algumas cidades pequenas podem não estar disponíveis

### Consulta de Notícias
- Requer conexão com a internet para acessar as APIs NewsAPI e GNews
- Limitado a 100 consultas por dia (plano gratuito)
- Algumas fontes de notícias podem estar bloqueadas

### Busca de Vídeos do YouTube
- Requer conexão com a internet para acessar o YouTube
- Limitado a resultados mais relevantes (máximo de 10 vídeos por busca)
- Não suporta filtros avançados como data, duração, etc.

### Tradução de Textos
- Requer conexão com a internet para acessar o serviço de tradução
- Limitado a 5000 caracteres por tradução
- A precisão da tradução pode variar dependendo do idioma e complexidade do texto

## APIs Externas

### API da AssemblyAI
Esta aplicação utiliza a API da AssemblyAI para transcrição de áudio. A API é gratuita para uso limitado, mas requer uma chave de API válida. A chave de API está configurada no arquivo `services/transcription.service.js`.

### Cloudinary
Esta aplicação utiliza o Cloudinary para armazenamento de mídias em nuvem. O Cloudinary é gratuito para uso limitado, mas requer credenciais válidas. As credenciais estão configuradas no arquivo `services/cloudinary.service.js`.

### OpenWeatherMap
Esta aplicação utiliza a API OpenWeatherMap para consulta de dados climáticos. A API é gratuita para uso limitado, mas requer uma chave de API válida. A chave de API está configurada no arquivo `services/weather.service.js`.

### NewsAPI e GNews
Esta aplicação utiliza as APIs NewsAPI e GNews para consulta de notícias. As APIs são gratuitas para uso limitado, mas requerem chaves de API válidas. As chaves de API estão configuradas no arquivo `services/news.service.js`.

### yt-search
Esta aplicação utiliza a biblioteca yt-search para busca de vídeos do YouTube. A biblioteca é gratuita e não requer chave de API.

### bing-translate-api
Esta aplicação utiliza a biblioteca bing-translate-api para tradução de textos. A biblioteca é gratuita e não requer chave de API.

## Licença

ISC

