# Deploy no Vercel - WXT Tools

## Resumo das Modificações Realizadas

Este projeto foi completamente analisado e otimizado para hospedagem no Vercel. Todas as modificações necessárias foram implementadas para garantir um deploy sem erros.

### Arquivos Criados/Modificados:

#### 1. **vercel.json** (NOVO)
Arquivo de configuração principal do Vercel:
```json
{
  "version": 2,
  "builds": [
    {
      "src": "server.js",
      "use": "@vercel/node"
    }
  ],
  "routes": [
    {
      "src": "/(.*)",
      "dest": "/server.js"
    }
  ]
}
```

#### 2. **.vercelignore** (NOVO)
Arquivo para ignorar diretórios desnecessários no deploy:
```
uploads/
node_modules/
.env
*.log
.DS_Store
```

#### 3. **.env.example** (NOVO)
Template para variáveis de ambiente:
```
PORT=3020
CLOUDINARY_CLOUD_NAME=dyqjrhofx
CLOUDINARY_API_KEY=821489784785338
CLOUDINARY_API_SECRET=O0BlKrzbyotWTdxb5tgHx1qAG9A
GEMINI_API_KEY=AIzaSyDEUctzgVPq9jiP95Jib_sFApAflnvC16Y
```

#### 4. **package.json** (MODIFICADO)
- Corrigido o campo `main` de `index.js` para `server.js`
- Adicionado script `build` para compatibilidade com Vercel

#### 5. **server.js** (MODIFICADO)
- Porta configurada para usar `process.env.PORT || 3020`
- Adicionado middleware para criar diretórios apenas quando não estiver no Vercel
- Otimizado para ambiente serverless

#### 6. **Rotas de Upload** (MODIFICADAS)
Todos os arquivos de rota que usam multer foram modificados:
- `routes/ocr.routes.js`
- `routes/cloudinary.routes.js`
- `routes/transcription.routes.js`

Modificação aplicada: uso do diretório `/tmp` quando em ambiente Vercel:
```javascript
const uploadDir = process.env.VERCEL ? '/tmp' : 'uploads/';
```

#### 7. **Serviços** (MODIFICADOS)
- `services/cloudinary.service.js`: Configuração usando variáveis de ambiente
- `routes/gemini.js`: API key usando variável de ambiente

## Instruções para Deploy no Vercel

### 1. Preparação
1. Faça upload do projeto para um repositório Git (GitHub, GitLab, Bitbucket)
2. Certifique-se de que todos os arquivos estão commitados

### 2. Deploy via Vercel Dashboard
1. Acesse [vercel.com](https://vercel.com)
2. Faça login com sua conta
3. Clique em "New Project"
4. Conecte seu repositório Git
5. Selecione o projeto WXT Tools
6. Configure as variáveis de ambiente (opcional, pois já há valores padrão)

### 3. Variáveis de Ambiente (Opcional)
No painel do Vercel, configure estas variáveis se desejar usar valores diferentes:
- `CLOUDINARY_CLOUD_NAME`
- `CLOUDINARY_API_KEY`
- `CLOUDINARY_API_SECRET`
- `GEMINI_API_KEY`
- `NEWSAPI_KEY`
- `GNEWS_KEY`
- `OPENWEATHER_API_KEY`
- `ASSEMBLYAI_API_KEY`

### 4. Deploy
1. Clique em "Deploy"
2. Aguarde o processo de build e deploy
3. Seu projeto estará disponível na URL fornecida pelo Vercel

## Funcionalidades Testadas

✅ **Página Inicial**: Carregamento correto da tela de boas-vindas
✅ **Dashboard Principal**: Todas as ferramentas acessíveis
✅ **OCR**: Interface funcionando corretamente
✅ **Navegação**: Transições entre páginas funcionando
✅ **Responsividade**: Layout adaptável para diferentes dispositivos

## Estrutura de Arquivos Otimizada

```
SITE_WXT_TOOLS/
├── controllers/          # Controladores das funcionalidades
├── public/              # Arquivos estáticos (HTML, CSS, JS)
├── routes/              # Rotas da API
├── services/            # Serviços (Cloudinary, OCR, etc.)
├── uploads/             # Diretório de uploads (ignorado no Vercel)
├── .env.example         # Template de variáveis de ambiente
├── .vercelignore        # Arquivos ignorados no deploy
├── package.json         # Dependências e scripts
├── server.js            # Servidor principal
└── vercel.json          # Configuração do Vercel
```

## Observações Importantes

1. **Uploads**: No Vercel, os uploads são salvos em `/tmp` (temporário)
2. **Persistência**: Para persistência de arquivos, use serviços como Cloudinary (já configurado)
3. **Variáveis de Ambiente**: Valores padrão estão configurados, mas recomenda-se usar variáveis próprias
4. **Logs**: Logs do servidor podem ser visualizados no dashboard do Vercel

## Suporte

O projeto está totalmente preparado para deploy no Vercel. Todas as dependências estão corretas e as configurações foram otimizadas para ambiente serverless.

