const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// Arquivo para persistência
const dataFile = path.join(__dirname, 'data.json');

// Carregar dados do arquivo ou usar padrão
let veiculos = [];
let estadias = [];

// Tentar carregar dados salvos
try {
    if (fs.existsSync(dataFile)) {
        const data = JSON.parse(fs.readFileSync(dataFile, 'utf8'));
        veiculos = data.veiculos || [];
        estadias = data.estadias || [];
        console.log('📁 Dados carregados do arquivo');
    }
} catch (error) {
    console.log('📁 Criando novos dados');
}

// Se não houver dados, usar os iniciais
if (veiculos.length === 0) {
    veiculos = [
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
}

if (estadias.length === 0) {
    estadias = [
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
}

// Função para salvar dados
function salvarDados() {
    try {
        const data = { veiculos, estadias };
        fs.writeFileSync(dataFile, JSON.stringify(data, null, 2));
        console.log('💾 Dados salvos');
    } catch (error) {
        console.error('❌ Erro ao salvar dados:', error);
    }
}

// ⚡ ROTAS
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

    // Verificar se placa já existe (estacionada)
    const veiculoEstacionado = veiculos.find(v => v.placa === placa.toUpperCase() && v.saida === null);
    if (veiculoEstacionado) {
        return res.status(400).json({ error: 'Veículo já está estacionado' });
    }

    const novoVeiculo = {
        placa: placa.toUpperCase(),
        entrada: new Date().toISOString(),
        saida: null
    };

    veiculos.push(novoVeiculo);
    
    // Criar nova estadia
    const novaEstadia = {
        id: estadias.length > 0 ? Math.max(...estadias.map(e => e.id)) + 1 : 1,
        placa: placa.toUpperCase(),
        entrada: new Date().toISOString(),
        saida: null,
        valor: 0.00
    };
    
    estadias.push(novaEstadia);
    
    console.log('✅ Veículo cadastrado - Total:', veiculos.length);
    console.log('✅ Estadia criada - Total:', estadias.length);
    
    // Salvar dados persistentes
    salvarDados();
    
    res.status(201).json(novoVeiculo);
});

// Saúde com dados atuais
app.get('/health', (req, res) => {
    res.json({ 
        status: 'OK', 
        veiculos: veiculos.length,
        estadias: estadias.length,
        estacionados: veiculos.filter(v => v.saida === null).length
    });
});

app.get('/', (req, res) => {
    res.json({
        message: 'API Estacionamento ACME - Funcionando!',
        version: '1.0.0',
        endpoints: {
            veiculos: '/veiculos',
            estadias: '/estadias', 
            health: '/health',
            estacionados: '/veiculos/estacionados'
        },
        documentation: 'Acesse /health para status do sistema'
    });
});

module.exports = app;