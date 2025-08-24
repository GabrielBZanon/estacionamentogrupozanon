const express = require('express');
const cors = require('cors');

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// ⚡ Dados em memória - DEVE ser let, não const
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

// ⚡ ROTAS FUNCIONAIS
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

    // Verificar se placa já existe
    const veiculoExistente = veiculos.find(v => v.placa === placa.toUpperCase());
    if (veiculoExistente) {
        return res.status(400).json({ error: 'Veículo já está no estacionamento' });
    }

    const novoVeiculo = {
        placa: placa.toUpperCase(),
        entrada: new Date().toISOString(),
        saida: null
    };

    veiculos.push(novoVeiculo);
    
    // ⚡ ADICIONAR TAMBÉM À ESTADIA
    const novaEstadia = {
        id: estadias.length + 1,
        placa: placa.toUpperCase(),
        entrada: new Date().toISOString(),
        saida: null,
        valor: 0.00
    };
    
    estadias.push(novaEstadia);
    
    console.log('✅ Veículo cadastrado - Total:', veiculos.length);
    console.log('✅ Estadia criada - Total:', estadias.length);
    
    res.status(201).json(novoVeiculo);
});

// Rota para finalizar estadia
app.patch('/veiculos/:placa/saida', (req, res) => {
    const { placa } = req.params;
    
    const veiculoIndex = veiculos.findIndex(v => v.placa === placa.toUpperCase());
    if (veiculoIndex === -1) {
        return res.status(404).json({ error: 'Veículo não encontrado' });
    }
    
    const saida = new Date().toISOString();
    veiculos[veiculoIndex].saida = saida;
    
    // Atualizar também a estadia
    const estadiaIndex = estadias.findIndex(e => e.placa === placa.toUpperCase() && e.saida === null);
    if (estadiaIndex !== -1) {
        estadias[estadiaIndex].saida = saida;
        
        // Calcular valor
        const entrada = new Date(estadias[estadiaIndex].entrada);
        const saidaDate = new Date(saida);
        const horas = (saidaDate - entrada) / (1000 * 60 * 60);
        estadias[estadiaIndex].valor = horas * 10;
    }
    
    res.json(veiculos[veiculoIndex]);
});

// Rotas de saúde
app.get('/health', (req, res) => {
    res.json({ 
        status: 'OK', 
        message: 'API funcionando!',
        veiculos: veiculos.length,
        estadias: estadias.length
    });
});

app.get('/', (req, res) => {
    res.json({
        message: 'API Estacionamento ACME',
        version: '1.0.0',
        estatisticas: {
            total_veiculos: veiculos.length,
            veiculos_estacionados: veiculos.filter(v => v.saida === null).length,
            total_estadias: estadias.length
        }
    });
});

module.exports = app;