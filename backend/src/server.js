/**
 * Servidor principal da aplicação Gestão de Equipamentos TI
 * 
 * Este arquivo inicia o servidor Express e configura as rotas e middlewares principais
 * 
 * @version 0.1.0-alpha
 */

const app = require('./app');
const http = require('http');
const { PrismaClient } = require('@prisma/client');
const logger = require('./utils/logger');

// Inicialização do Prisma
const prisma = new PrismaClient();

// Porta da aplicação
const PORT = process.env.PORT || 4020;

// Criação do servidor HTTP
const server = http.createServer(app);

// Função para lidar com erros de inicialização do servidor
const onError = (error) => {
  if (error.syscall !== 'listen') {
    throw error;
  }

  const bind = typeof PORT === 'string' ? `Pipe ${PORT}` : `Port ${PORT}`;

  // Mensagens de erro específicas para códigos comuns
  switch (error.code) {
    case 'EACCES':
      logger.error(`${bind} requer privilégios elevados`);
      process.exit(1);
      break;
    case 'EADDRINUSE':
      logger.error(`${bind} já está em uso`);
      process.exit(1);
      break;
    default:
      throw error;
  }
};

// Quando o servidor estiver ouvindo
const onListening = () => {
  const addr = server.address();
  const bind = typeof addr === 'string' ? `pipe ${addr}` : `port ${addr.port}`;
  logger.info(`Servidor escutando em ${bind}`);
  logger.info(`Ambiente: ${process.env.NODE_ENV}`);
};

// Inicialização do servidor
server.listen(PORT);
server.on('error', onError);
server.on('listening', onListening);

// Tratamento de encerramento gracioso
const gracefulShutdown = async () => {
  logger.info('Recebido sinal de encerramento, fechando conexões...');
  
  try {
    await prisma.$disconnect();
    server.close(() => {
      logger.info('Servidor encerrado com sucesso');
      process.exit(0);
    });
  } catch (error) {
    logger.error('Erro ao encerrar o servidor:', error);
    process.exit(1);
  }
};

// Captura de sinais de encerramento
process.on('SIGTERM', gracefulShutdown);
process.on('SIGINT', gracefulShutdown);

// Captura de exceções não tratadas
process.on('uncaughtException', (error) => {
  logger.error('Exceção não tratada:', error);
  gracefulShutdown();
});

// Captura de rejeições não tratadas
process.on('unhandledRejection', (reason, promise) => {
  logger.error('Rejeição não tratada em:', promise, 'Razão:', reason);
});

module.exports = server;
