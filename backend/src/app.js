/**
 * Configuração principal da aplicação Express
 * 
 * @version 0.1.0-alpha
 */

// Carrega as variáveis de ambiente
require('dotenv').config();

const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const { errorHandler } = require('./middlewares/errorHandler');
const logger = require('./utils/logger');

// Inicializa o app Express
const app = express();

// Configurações básicas
app.set('trust proxy', 1);
app.disable('x-powered-by');

// Middlewares de segurança e utilidades
app.use(helmet()); // Segurança de cabeçalhos HTTP
app.use(cors({
  origin: process.env.NODE_ENV === 'production' 
    ? [process.env.FRONTEND_URL] 
    : '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Limite de taxa de requisições
const limiter = rateLimit({
  windowMs: (process.env.RATE_LIMIT_WINDOW || 15) * 60 * 1000, // padrão: 15 minutos
  max: process.env.RATE_LIMIT_MAX || 100, // padrão: 100 requisições
  message: 'Muitas requisições deste IP, tente novamente mais tarde'
});
app.use('/api/', limiter);

// Logging de requisições
if (process.env.NODE_ENV !== 'test') {
  app.use(morgan('dev', {
    stream: {
      write: (message) => logger.info(message.trim())
    }
  }));
}

// Parsers para requisições
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Rotas de API
app.use('/api/auth', require('./routes/authRoutes'));

// Rotas de tabelas de suporte
app.use('/api/tipos-equipamento', require('./routes/tipoEquipamentoRoutes'));

/* Rotas a serem implementadas conforme o desenvolvimento avança
app.use('/api/usuarios', require('./routes/usuarioRoutes'));
app.use('/api/equipamentos', require('./routes/equipamentoRoutes'));
app.use('/api/fabricantes', require('./routes/fabricanteRoutes'));
app.use('/api/status-equipamento', require('./routes/statusEquipamentoRoutes'));
app.use('/api/departamentos', require('./routes/departamentoRoutes'));
app.use('/api/empresas', require('./routes/empresaRoutes'));
app.use('/api/localizacoes', require('./routes/localizacaoRoutes'));
app.use('/api/estados', require('./routes/estadoRoutes'));
app.use('/api/cidades', require('./routes/cidadeRoutes'));
app.use('/api/niveis-acesso', require('./routes/nivelAcessoRoutes'));
app.use('/api/movimentacoes', require('./routes/movimentacaoRoutes'));
app.use('/api/configuracoes', require('./routes/configuracaoRoutes'));
app.use('/api/logs-auditoria', require('./routes/logAuditoriaRoutes'));
app.use('/api/dashboard', require('./routes/dashboardRoutes'));
app.use('/api/relatorios', require('./routes/relatorioRoutes'));
*/

// Rota de status da API
app.get('/api/status', (req, res) => {
  res.status(200).json({
    status: 'online',
    timestamp: new Date(),
    version: process.env.npm_package_version || '0.1.0-alpha',
    environment: process.env.NODE_ENV
  });
});

// Tratamento para rotas não encontradas
app.use('*', (req, res) => {
  res.status(404).json({ 
    status: 'error',
    message: `Rota não encontrada: ${req.originalUrl}` 
  });
});

// Middleware de tratamento de erros
app.use(errorHandler);

module.exports = app;
