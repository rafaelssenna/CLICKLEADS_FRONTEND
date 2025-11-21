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
public/
├── index.html    # Página principal
├── script.js     # Lógica da aplicação
└── style.css     # Estilos
```

## Como usar

1. Conecte ao backend Socket.io
2. Preencha os campos:
   - Nicho (ex: dentista, restaurante)
   - Região (ex: São Paulo, Rio de Janeiro)
   - Quantidade (1-100)
3. Clique em "Extrair Contatos"
4. Veja os resultados aparecerem em tempo real
5. Exporte para CSV ou copie os dados

## Conexão com Backend

O frontend se conecta automaticamente ao servidor Socket.io:

```javascript
const socket = io(); // Conecta ao mesmo host
```

## Deploy

Para servir os arquivos estáticos, use qualquer servidor web ou o backend Express incluído neste projeto.
