// api/server.js
const express = require('express');
const cors = require('cors');
const routes = require('../src/routes.js');

const app = express();

// Configuração CORS - deve vir primeiro
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Origin', 'X-Requested-With', 'Content-Type', 'Accept']
}));

// Middleware para parsing JSON
app.use(express.json());

// Importar e usar rotas
app.use(routes);

// Rota de saúde para teste
app.get('/health', (req, res) => {
  res.json({ 
    status: 'healthy', 
    message: 'API Estacionamento funcionando',
    timestamp: new Date().toISOString()
  });
});

// Rota raiz
app.get('/', (req, res) => {
  res.json({
    titulo: "API Estacionamento",
    versao: "1.0.0",
    rotas: [
      { metodo: "GET", caminho: "/veiculos" },
      { metodo: "GET", caminho: "/veiculos/:placa" },
      { metodo: "POST", caminho: "/veiculos" },
      { metodo: "PATCH", caminho: "/veiculos/:placa" },
      { metodo: "DELETE", caminho: "/veiculos/:placa" },
      { metodo: "GET", caminho: "/estadias" },
      { metodo: "GET", caminho: "/estadias/:placa" },
      { metodo: "POST", caminho: "/estadias" },
      { metodo: "PATCH", caminho: "/estadias/:id" },
      { metodo: "DELETE", caminho: "/estadias/:id" }
    ]
  });
});

// Rotas simples de TESTE - coloque antes das outras rotas
app.get('/veiculos', (req, res) => {
    console.log('✅ Rota /veiculos funcionando!');
    res.json([
        { 
            placa: 'AAA0000', 
            entrada: '2024-01-24T08:00:00Z',
            saida: '2024-01-24T10:00:00Z'
        },
        { 
            placa: 'AAL2525', 
            entrada: '2024-01-24T08:00:00Z',
            saida: null // Veículo ainda estacionado
        }
    ]);
});

app.get('/estadias', (req, res) => {
    console.log('✅ Rota /estadias funcionando!');
    res.json([
        {
            placa: 'AAA0000',
            entrada: '2024-01-24T08:00:00Z',
            saida: '2024-01-24T10:00:00Z',
            valor: 20.00
        }
    ]);
});

// Export para Vercel (NÃO use app.listen!)
module.exports = app;