/**
 * Configuração de logging da aplicação
 * 
 * @version 0.1.0-alpha
 */

const winston = require('winston');
const path = require('path');
const fs = require('fs');

// Garantir que o diretório de logs existe
const logDir = path.join(process.cwd(), 'logs');
if (!fs.existsSync(logDir)) {
  fs.mkdirSync(logDir, { recursive: true });
}

// Configuração do formato dos logs
const logFormat = winston.format.combine(
  winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
  winston.format.errors({ stack: true }),
  winston.format.splat(),
  winston.format.json()
);

// Configuração de níveis do log
const logLevels = {
  error: 0,
  warn: 1,
  info: 2,
  http: 3,
  debug: 4,
};

// Criar instância do logger
const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || 'info',
  levels: logLevels,
  format: logFormat,
  defaultMeta: { service: 'controle-ti-api' },
  transports: [
    // Log de erros em arquivo separado
    new winston.transports.File({ 
      filename: path.join(logDir, 'error.log'), 
      level: 'error' 
    }),
    // Log completo
    new winston.transports.File({ 
      filename: path.join(logDir, 'combined.log') 
    }),
  ],
  // Não finalizar em exceções não tratadas
  exitOnError: false,
});

// Em desenvolvimento, também exibir no console
if (process.env.NODE_ENV !== 'production') {
  logger.add(new winston.transports.Console({
    format: winston.format.combine(
      winston.format.colorize(),
      winston.format.simple(),
      winston.format.printf(info => {
        const { timestamp, level, message, ...rest } = info;
        return `${timestamp} ${level}: ${message} ${
          Object.keys(rest).length ? JSON.stringify(rest, null, 2) : ''
        }`;
      })
    )
  }));
}

// Wrapper de stream para integração com Morgan
logger.stream = {
  write: (message) => logger.http(message.trim()),
};

module.exports = logger;
