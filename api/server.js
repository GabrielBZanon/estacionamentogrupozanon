// api/server.js
const express = require('express');
const cors = require('cors');
const routes = require('../src/routes.js');

const app = express();
app.use(cors());
app.use(express.json());

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

// ⚡ ROTAS SIMPLES DE TESTE - COLE NO SEU server.js
// Adicione estas rotas ANTES de qualquer outra coisa:

// Rota de teste para veículos
app.get('/veiculos', (req, res) => {
    console.log('✅ Rota /veiculos foi chamada!');
    res.json([
        {
            placa: "AAA0000",
            entrada: "2024-01-24T08:00:00.000Z",
            saida: "2024-01-24T10:00:00.000Z"
        },
        {
            placa: "AAL2525", 
            entrada: "2024-01-24T08:00:00.000Z",
            saida: null
        },
        {
            placa: "AAA1358",
            entrada: "2024-01-24T08:00:00.000Z",
            saida: "2024-01-24T10:00:00.000Z"
        }
    ]);
});

// Rota de teste para estadias
app.get('/estadias', (req, res) => {
    console.log('✅ Rota /estadias foi chamada!');
    res.json([
        {
            id: 1,
            placa: "AAA0000",
            entrada: "2024-01-24T08:00:00.000Z",
            saida: "2024-01-24T10:00:00.000Z",
            valor: 20.00
        },
        {
            id: 2,
            placa: "AAL2525",
            entrada: "2024-01-24T08:00:00.000Z",
            saida: null,
            valor: 0.00
        }
    ]);
});

// Rota de saúde para testar
app.get('/health', (req, res) => {
    res.json({ status: 'OK', message: 'API funcionando!' });
});
module.exports = app;