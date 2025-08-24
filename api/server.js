const express = require('express');
const cors = require('cors');

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// Dados em memória (para teste)
let veiculos = [
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
];

let estadias = [
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
];

// ⚡ ROTAS FUNCIONAIS - TESTADAS
app.get('/veiculos', (req, res) => {
    console.log('✅ /veiculos - Retornando', veiculos.length, 'veículos');
    res.json(veiculos);
});

app.get('/estadias', (req, res) => {
    console.log('✅ /estadias - Retornando', estadias.length, 'estadias');
    res.json(estadias);
});

app.post('/veiculos', (req, res) => {
    console.log('✅ POST /veiculos - Dados:', req.body);
    
    const { placa } = req.body;
    
    if (!placa) {
        return res.status(400).json({ error: 'Placa é obrigatória' });
    }

    const novoVeiculo = {
        placa: placa.toUpperCase(),
        entrada: new Date().toISOString(),
        saida: null
    };

    veiculos.push(novoVeiculo);
    
    res.status(201).json(novoVeiculo);
});

// Rota de saúde
app.get('/health', (req, res) => {
    res.json({ 
        status: 'OK', 
        message: 'API do Estacionamento funcionando!',
        timestamp: new Date().toISOString()
    });
});

// Rota raiz
app.get('/', (req, res) => {
    res.json({
        message: 'API Estacionamento ACME',
        version: '1.0.0',
        endpoints: {
            veiculos: '/veiculos',
            estadias: '/estadias',
            health: '/health'
        }
    });
});

// ⚠️ REMOVA qualquer app.listen() - o Vercel cuida disso!
module.exports = app;