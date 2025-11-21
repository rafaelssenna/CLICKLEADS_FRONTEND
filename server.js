const express = require('express');
const http = require('http');
const socketIO = require('socket.io');
const cors = require('cors');
const path = require('path');
const scraperService = require('./services/scraper');

const app = express();
const server = http.createServer(app);
const io = socketIO(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});

const PORT = process.env.PORT || 3000;

// Middlewares
app.use(cors());
app.use(express.json());
app.use(express.static('public'));

// Rota principal
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// WebSocket connection
io.on('connection', (socket) => {
  console.log('Cliente conectado:', socket.id);

  socket.on('start-extraction', async (data) => {
    const { nicho, regiao, quantidade } = data;

    console.log(`Iniciando extração: ${nicho} em ${regiao} - ${quantidade} contatos`);

    try {
      // Chama o scraper com callback para enviar dados progressivamente
      await scraperService.extractLeadsRealtime(nicho, regiao, quantidade, (lead) => {
        // Envia cada lead assim que é extraído
        socket.emit('new-lead', lead);
      }, (progress) => {
        // Envia progresso
        socket.emit('progress', progress);
      });

      // Finaliza
      socket.emit('extraction-complete', {
        success: true,
        message: 'Extração concluída!'
      });

    } catch (error) {
      console.error('Erro na extração:', error);
      socket.emit('extraction-error', {
        success: false,
        message: error.message
      });
    }
  });

  socket.on('disconnect', () => {
    console.log('Cliente desconectado:', socket.id);
  });
});

// Rota de health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'Servidor rodando!' });
});

server.listen(PORT, () => {
  console.log(`🚀 Servidor rodando em http://localhost:${PORT}`);
  console.log(`📊 API disponível em http://localhost:${PORT}/api`);
});
