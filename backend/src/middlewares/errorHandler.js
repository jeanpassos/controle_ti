/**
 * Middleware de tratamento de erros
 * 
 * @version 0.1.0-alpha
 */

const logger = require('../utils/logger');

/**
 * Formata e normaliza erros para uma resposta consistente da API
 */
const errorHandler = (err, req, res, next) => {
  // Log do erro para análise e depuração
  logger.error(`${err.name || 'Error'}: ${err.message}`, {
    stack: err.stack,
    path: req.path,
    method: req.method,
    ip: req.ip
  });

  // Determinar o status HTTP com base no tipo de erro
  let statusCode = err.statusCode || 500;
  let message = err.message || 'Erro interno do servidor';
  let errorCode = err.errorCode || 'INTERNAL_SERVER_ERROR';
  
  // Tratamento para erros específicos
  if (err.name === 'ValidationError') {
    statusCode = 400;
    errorCode = 'VALIDATION_ERROR';
  } else if (err.name === 'UnauthorizedError' || err.name === 'JsonWebTokenError') {
    statusCode = 401;
    message = 'Não autorizado';
    errorCode = 'UNAUTHORIZED';
  } else if (err.name === 'ForbiddenError') {
    statusCode = 403;
    message = 'Acesso negado';
    errorCode = 'FORBIDDEN';
  } else if (err.name === 'NotFoundError') {
    statusCode = 404;
    errorCode = 'NOT_FOUND';
  }

  // Em ambiente de produção, ocultar detalhes técnicos do erro
  const response = {
    status: 'error',
    message,
    errorCode
  };
  
  // Em ambiente de desenvolvimento, incluir detalhes adicionais
  if (process.env.NODE_ENV !== 'production') {
    response.stack = err.stack;
    if (err.errors) {
      response.errors = err.errors;
    }
  }

  // Enviar resposta formatada
  res.status(statusCode).json(response);
};

// Classe de erro customizada para erros da aplicação
class AppError extends Error {
  constructor(message, statusCode = 500, errorCode = null) {
    super(message);
    this.statusCode = statusCode;
    this.errorCode = errorCode;
    this.name = this.constructor.name;
    Error.captureStackTrace(this, this.constructor);
  }
}

// Erros específicos da aplicação
class ValidationError extends AppError {
  constructor(message, errors = null) {
    super(message || 'Dados de entrada inválidos', 400, 'VALIDATION_ERROR');
    this.errors = errors;
  }
}

class UnauthorizedError extends AppError {
  constructor(message = 'Não autorizado') {
    super(message, 401, 'UNAUTHORIZED');
  }
}

class ForbiddenError extends AppError {
  constructor(message = 'Acesso negado') {
    super(message, 403, 'FORBIDDEN');
  }
}

class NotFoundError extends AppError {
  constructor(resource = 'Recurso') {
    super(`${resource} não encontrado`, 404, 'NOT_FOUND');
  }
}

// Exportando o middleware e as classes de erro
module.exports = {
  errorHandler,
  AppError,
  ValidationError,
  UnauthorizedError,
  ForbiddenError,
  NotFoundError
};
