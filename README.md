# Smart Leads - Backend

API para extração de contatos do Google Maps (Google Local) em tempo real com paginação automática.

## Funcionalidades

- Extração automática de leads do Google Local (LCL)
- **Paginação automática** - busca em múltiplas páginas até atingir a quantidade
- Comunicação em tempo real via WebSocket (Socket.io)
- Remoção automática de duplicatas
- Progress tracking em tempo real
- API REST com Express

## Tecnologias

- Node.js
- Express.js
- Socket.io (WebSocket)
- Puppeteer (Web Scraping)
- CORS habilitado

## Instalação

### Pré-requisitos

- Node.js (versão 14 ou superior)
- npm ou yarn

### Passos

1. Instale as dependências:
```bash
npm install
```

2. Inicie o servidor:
```bash
npm start
```

3. Acesse no navegador:
```
http://localhost:3000
```

## Como funciona

1. Cliente conecta via WebSocket
2. Envia evento `start-extraction` com parâmetros (nicho, região, quantidade)
3. Backend usa Puppeteer para:
   - Acessar Google Local Search (tbm=lcl)
   - **Buscar em múltiplas páginas** até atingir quantidade solicitada
   - Extrair nome e telefone de cada estabelecimento
4. Envia dados progressivamente via WebSocket
5. Remove duplicatas automaticamente

## Paginação

O sistema busca automaticamente em várias páginas:
- Máximo: 10 páginas
- Para quando atinge a quantidade solicitada
- Para se não encontrar mais resultados
- Remove duplicatas entre páginas

Exemplo: Ao solicitar 50 leads, o sistema pode buscar 3-5 páginas do Google para coletar os resultados.

## Exemplo de Uso

**Input:**
- Nicho: Dentista
- Região: Belo Horizonte
- Quantidade: 30

O sistema irá:
1. Pesquisar "Dentista em Belo Horizonte" no Google Maps
2. Extrair informações de 30 estabelecimentos
3. Retornar: nome, telefone e endereço de cada um

## API WebSocket

### Eventos do Cliente

**start-extraction**
```javascript
socket.emit('start-extraction', {
  nicho: 'dentista',
  regiao: 'são paulo',
  quantidade: 50
});
```

### Eventos do Servidor

**progress**
```javascript
{
  status: 'Buscando página 1...',
  percent: 10
}
```

**new-lead**
```javascript
{
  nome: 'Clínica Exemplo',
  telefone: '(11) 98765-4321',
  endereco: 'Não disponível',
  index: 1
}
```

**extraction-complete**
```javascript
{
  success: true,
  message: 'Extração concluída!'
}
```

**extraction-error**
```javascript
{
  success: false,
  message: 'Erro: Nenhum resultado encontrado'
}
```

## API REST

### GET /api/health

Verifica status do servidor.

```json
{
  "status": "OK",
  "message": "Servidor rodando!"
}
```

## Estrutura do Projeto

```
Smart Leads 2/
├── public/
│   ├── index.html      # Interface web
│   ├── style.css       # Estilos
│   └── script.js       # Lógica frontend
├── services/
│   └── scraper.js      # Serviço de scraping
├── server.js           # Servidor Express
├── package.json        # Dependências
└── README.md           # Documentação
```

## Desenvolvimento

Para desenvolvimento com auto-reload:

```bash
npm run dev
```

## Observações Importantes

- O scraping pode levar alguns minutos dependendo da quantidade solicitada
- O Google Maps pode ter limitações de taxa (rate limiting)
- Alguns estabelecimentos podem não ter telefone público disponível
- Recomenda-se usar com moderação para evitar bloqueios

## Limitações

- Máximo de 100 contatos por extração
- Depende da estrutura HTML do Google Maps (pode quebrar se o Google mudar o layout)
- Alguns dados podem aparecer como "Não disponível" se não estiverem públicos

## Melhorias Futuras

- [ ] Sistema de filas para múltiplas extrações
- [ ] Cache de resultados
- [ ] Filtros avançados (rating, horário, etc)
- [ ] Exportação em outros formatos (Excel, JSON)
- [ ] Histórico de extrações
- [ ] Autenticação de usuários

## Licença

Este projeto é apenas para fins educacionais. Use com responsabilidade e respeite os Termos de Serviço do Google.

## Suporte

Para dúvidas ou problemas, abra uma issue no repositório.
