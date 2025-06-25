const { verifyAccessToken } = require('../utils/tokens');
const logger = require('../utils/logger');

/**
 * Middleware de autenticação
 * Verifica se o token JWT é válido e extrai as informações do usuário
 * 
 * @param {Object} req - Express Request
 * @param {Object} res - Express Response
 * @param {Function} next - Express Next
 */
function authMiddleware(req, res, next) {
  // Obtém o token do header Authorization
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Token de autenticação não fornecido' });
  }

  const token = authHeader.split(' ')[1];

  try {
    // Verifica o token e extrai o payload
    const decoded = verifyAccessToken(token);
    
    // Adiciona as informações do usuário ao objeto req
    req.user = {
      id: decoded.userId,
      email: decoded.email,
      nome: decoded.nome,
      cargo: decoded.cargo,
      permissoes: decoded.permissoes
    };

    // Segue para o próximo middleware/controlador
    next();
  } catch (error) {
    logger.warn(`Falha na autenticação: ${error.message}`);
    return res.status(401).json({ message: 'Token inválido ou expirado' });
  }
}

/**
 * Middleware que verifica se o usuário tem as permissões necessárias
 * 
 * @param {string[]} permissoesNecessarias - Lista de permissões necessárias
 * @returns {Function} Middleware Express
 */
function requirePermissions(permissoesNecessarias) {
  return (req, res, next) => {
    if (!req.user || !req.user.permissoes) {
      return res.status(401).json({ message: 'Usuário não autenticado' });
    }

    // Verifica se o usuário tem as permissões necessárias
    const permissoesUsuario = req.user.permissoes || [];
    const temPermissao = permissoesNecessarias.every(p => permissoesUsuario.includes(p));

    if (!temPermissao) {
      logger.warn(`Acesso negado para ${req.user.email}: permissões insuficientes`);
      return res.status(403).json({ 
        message: 'Sem permissão para acessar este recurso',
        required: permissoesNecessarias,
        current: permissoesUsuario
      });
    }

    next();
  };
}

module.exports = {
  authMiddleware,
  requirePermissions
};
