/**
 * Middleware de autenticação JWT
 * Verifica se o token de acesso é válido e adiciona os dados do usuário ao objeto de requisição
 */

const jwt = require('jsonwebtoken');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

/**
 * Middleware para verificar autenticação via JWT
 */
const authMiddleware = async (req, res, next) => {
  console.log('🚨 MIDDLEWARE EXECUTADO - authMiddleware chamado para:', req.method, req.originalUrl);
  console.log('🔐 authMiddleware - Iniciando verificação de autenticação');
  console.log('🔐 authMiddleware - URL:', req.method, req.originalUrl);
  
  // Verifica se o header de autorização existe
  const authHeader = req.headers.authorization;
  console.log('🔐 authMiddleware - Header Authorization:', authHeader ? 'presente' : 'ausente');
  
  if (!authHeader) {
    console.log('❌ authMiddleware - Token não fornecido');
    return res.status(401).json({ 
      erro: 'Token não fornecido',
      codigo: 'token_ausente' 
    });
  }

  // Extrai o token do header (Bearer token)
  const parts = authHeader.split(' ');
  console.log('🔐 authMiddleware - Partes do header:', parts.length);
  
  if (parts.length !== 2) {
    console.log('❌ authMiddleware - Formato de token inválido - partes:', parts.length);
    return res.status(401).json({ 
      erro: 'Formato de token inválido',
      codigo: 'token_formato_invalido'
    });
  }

  const [scheme, token] = parts;
  console.log('🔐 authMiddleware - Scheme:', scheme);
  console.log('🔐 authMiddleware - Token presente:', token ? 'sim' : 'não');
  console.log('🔐 authMiddleware - Token recebido (primeiros 50 chars):', token ? token.substring(0, 50) + '...' : 'nenhum');

  // Verifica se o token começa com Bearer
  if (!/^Bearer$/i.test(scheme)) {
    console.log('❌ authMiddleware - Scheme inválido:', scheme);
    return res.status(401).json({ 
      erro: 'Formato de token inválido',
      codigo: 'token_formato_invalido'
    });
  }

  try {
    console.log('🔐 authMiddleware - Verificando token JWT...');
    console.log('🔐 authMiddleware - Tamanho do token:', token.length);
    console.log('🔐 authMiddleware - Token completo:', token);
    
    // Verifica se o token é válido
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log('🔐 authMiddleware - Token decodificado:', {
      userId: decoded.userId,
      email: decoded.email,
      exp: decoded.exp,
      iat: decoded.iat
    });

    console.log('🔐 authMiddleware - Buscando usuário no banco...');
    // Verifica se o usuário existe (usando userId do payload)
    const usuario = await prisma.usuario.findUnique({
      where: { id: decoded.userId }, // Corrigido de decoded.id para decoded.userId
      include: { 
        nivel: true 
      },
    });

    console.log('🔐 authMiddleware - Usuário encontrado:', usuario ? usuario.email : 'não encontrado');

    if (!usuario) {
      console.log('❌ authMiddleware - Usuário não encontrado no banco');
      return res.status(401).json({ 
        erro: 'Usuário não encontrado',
        codigo: 'usuario_nao_encontrado'
      });
    }

    if (!usuario.ativo) {
      console.log('❌ authMiddleware - Usuário inativo');
      return res.status(401).json({ 
        erro: 'Usuário inativo',
        codigo: 'usuario_inativo'
      });
    }

    console.log('✅ authMiddleware - Usuário autenticado:', {
      id: usuario.id,
      email: usuario.email,
      nivel_id: usuario.nivel_id,
      ativo: usuario.ativo
    });

    // Adiciona o usuário e nível de acesso ao objeto de requisição
    req.usuario = {
      id: usuario.id,
      nome: usuario.nome,
      email: usuario.email,
      nivel_id: usuario.nivel_id,
      nivel: usuario.nivel?.nome || 'Não definido',
      permissoes: usuario.nivel?.permissoes || null,
    };

    console.log('✅ authMiddleware - Autenticação bem-sucedida, prosseguindo...');
    return next();
  } catch (error) {
    console.error('❌ authMiddleware - Erro na verificação do token:', error);
    
    if (error.name === 'TokenExpiredError') {
      console.log('❌ authMiddleware - Token expirado');
      return res.status(401).json({ 
        erro: 'Token expirado',
        codigo: 'token_expirado'
      });
    }

    if (error.name === 'JsonWebTokenError') {
      console.log('❌ authMiddleware - Token JWT inválido:', error.message);
      return res.status(401).json({ 
        erro: 'Token inválido',
        codigo: 'token_invalido'
      });
    }

    console.log('❌ authMiddleware - Erro desconhecido:', error.message);
    return res.status(401).json({ 
      erro: 'Token inválido',
      codigo: 'token_invalido'
    });
  }
};

/**
 * Middleware para verificar se o usuário tem nível de acesso suficiente
 * @param {number} nivelMinimo - Nível mínimo de acesso necessário
 */
const verificarNivel = (nivelMinimo) => {
  return (req, res, next) => {
    // Verifica se o middleware de autenticação já foi executado
    if (!req.usuario) {
      return res.status(500).json({ 
        erro: 'Middleware de autenticação deve ser executado antes',
        codigo: 'erro_middleware'
      });
    }

    // Obtém o nível de acesso do usuário
    const nivelUsuario = req.usuario.nivel_id;

    if (nivelUsuario < nivelMinimo) {
      return res.status(403).json({ 
        erro: 'Nível de acesso insuficiente',
        codigo: 'acesso_insuficiente',
        nivelRequerido: nivelMinimo,
        nivelAtual: nivelUsuario
      });
    }

    return next();
  };
};

/**
 * Middleware para verificar permissões específicas
 * @param {string} permissao - Permissão necessária (ex: 'usuarios.criar')
 */
const verificarPermissao = (permissao) => {
  return (req, res, next) => {
    // Verifica se o middleware de autenticação já foi executado
    if (!req.usuario) {
      return res.status(500).json({ 
        erro: 'Middleware de autenticação deve ser executado antes',
        codigo: 'erro_middleware'
      });
    }

    // Se o usuário for nível máximo (admin), sempre permite
    if (req.usuario.nivel_id === 4) {
      return next();
    }

    // Verifica se o usuário tem a permissão específica
    const permissoes = req.usuario.permissoes;
    if (!permissoes) {
      return res.status(403).json({ 
        erro: 'Sem permissões definidas',
        codigo: 'sem_permissoes'
      });
    }

    // Verifica se a permissão existe na lista de permissões do usuário
    const temPermissao = permissoes.includes(permissao);
    if (!temPermissao) {
      return res.status(403).json({ 
        erro: `Permissão '${permissao}' necessária`,
        codigo: 'permissao_negada'
      });
    }

    return next();
  };
};

module.exports = authMiddleware;
module.exports.verificarNivel = verificarNivel;
module.exports.verificarPermissao = verificarPermissao;
