/**
 * Middleware para verificar se o usuário tem nível de acesso de administrador
 * Deve ser utilizado após o authMiddleware
 */
const adminMiddleware = (req, res, next) => {
  try {
    // Verifica se o usuário foi autenticado e carregado pelo authMiddleware
    if (!req.usuario) {
      return res.status(401).json({
        erro: 'Autenticação necessária antes da verificação de administrador'
      });
    }
    
    // Verifica se o usuário tem nível de acesso de administrador (nível >= 3)
    if (!req.usuario.nivel || req.usuario.nivel < 3) {
      return res.status(403).json({
        erro: 'Acesso negado. Nível de administrador necessário para esta operação'
      });
    }
    
    // Se o usuário é administrador, prossegue para o próximo middleware/controller
    next();
  } catch (error) {
    console.error('Erro no middleware de administrador:', error);
    return res.status(500).json({
      erro: 'Erro ao verificar permissões de administrador',
      detalhes: process.env.NODE_ENV === 'development' ? error.message : null
    });
  }
};

module.exports = adminMiddleware;
