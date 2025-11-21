# Smart Leads - Frontend

Interface web moderna para extração de leads do Google Maps em tempo real.

## Tecnologias

- HTML5
- CSS3 (Design moderno com gradientes)
- JavaScript (Vanilla)
- Socket.io Client (Comunicação em tempo real)

## Funcionalidades

- Formulário intuitivo para busca de leads
- Barra de progresso em tempo real
- Tabela dinâmica com resultados instantâneos
- Exportação para CSV
- Copiar dados para área de transferência
- Design responsivo
- Animações suaves

## Estrutura

```
frontend/
├── index.html    # Página principal
├── script.js     # Lógica da aplicação
├── style.css     # Estilos
├── config.js     # Configuração da URL do backend
└── README.md     # Documentação
```

## ⚙️ Configuração

### 1. Configure a URL do Backend

**IMPORTANTE:** Edite o arquivo `config.js` e altere a URL para apontar para seu backend:

```javascript
window.BACKEND_URL = 'https://seu-backend.railway.app';
```

Exemplos de URLs:
- Railway: `https://seu-app.railway.app`
- Render: `https://seu-app.onrender.com`
- Heroku: `https://seu-app.herokuapp.com`
- Local: `http://localhost:3000`

### 2. Deploy

Este é um site estático (HTML, CSS, JS). Pode ser hospedado em:

- **Vercel**: `npm i -g vercel && vercel`
- **Netlify**: Arraste a pasta para netlify.com/drop
- **GitHub Pages**: Configure nas settings do repositório
- **Cloudflare Pages**: Conecte o repositório

## Como usar

1. Preencha os campos:
   - Nicho (ex: dentista, restaurante)
   - Região (ex: São Paulo, Rio de Janeiro)
   - Quantidade (1-100)
2. Clique em "Extrair Contatos"
3. Veja os resultados aparecerem em tempo real
4. Exporte para CSV ou copie os dados

## Desenvolvimento Local

Para testar localmente com live-server:

```bash
npx live-server
```

Ou use qualquer servidor HTTP:

```bash
python -m http.server 8000
# ou
php -S localhost:8000
```

## Conexão com Backend

O frontend conecta ao backend via WebSocket usando Socket.io. A URL é configurável no arquivo `config.js`.

## IMPORTANTE

Antes de fazer deploy, **sempre** configure a URL do backend no arquivo `config.js`!

## Repositório do Backend

O backend está em: https://github.com/rafaelssenna/Back-Smart-Leads
