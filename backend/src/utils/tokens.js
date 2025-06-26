const jwt = require('jsonwebtoken');
const { PrismaClient } = require('@prisma/client');
const logger = require('./logger');
const { v4: uuidv4 } = require('uuid');

const prisma = new PrismaClient();

/**
 * Utilitários para gerenciamento de tokens JWT
 */
const tokenUtils = {
  /**
   * Gera tokens de acesso e refresh para um usuário
   * @param {Object} usuario - Objeto do usuário
   * @returns {Object} Tokens gerados { accessToken, refreshToken, tokenId }
   */
  generateTokens(usuario) {
    console.log('🔑 generateTokens - Gerando tokens para usuário:', usuario.email);
    console.log('🔑 generateTokens - JWT_SECRET disponível:', process.env.JWT_SECRET ? 'SIM' : 'NÃO');
    
    const payload = {
      userId: usuario.id,
      email: usuario.email,
      nome: usuario.nome,
      nivel_id: usuario.nivel_id
    };

    console.log('🔑 generateTokens - Payload do token:', payload);

    // Token JWT de curta duração (1 hora)
    const accessToken = jwt.sign(
      payload,
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    console.log('🔑 generateTokens - Access token gerado:', accessToken.substring(0, 50) + '...');

    // Gera um ID curto para o token - removendo hífens e usando apenas caracteres alfanuméricos
    const tokenId = uuidv4().replace(/-/g, '').substring(0, 12);
    
    // Token de refresh de longa duração (7 dias)
    const refreshToken = jwt.sign(
      { userId: usuario.id, tokenId },
      process.env.REFRESH_TOKEN_SECRET,
      { expiresIn: '7d' }
    );

    console.log('🔑 generateTokens - Refresh token gerado:', refreshToken.substring(0, 50) + '...');
    console.log('🔑 generateTokens - Token ID gerado:', tokenId);

    return {
      accessToken,
      refreshToken,
      tokenId
    };
  },

  /**
   * Verifica e decodifica um token de acesso JWT
   * @param {string} token - Token JWT a verificar
   * @returns {Object} Payload decodificado
   * @throws {Error} Erro se o token for inválido
   */
  verifyAccessToken(token) {
    try {
      return jwt.verify(token, process.env.JWT_SECRET);
    } catch (error) {
      logger.warn(`Token JWT inválido: ${error.message}`);
      throw new Error('Token inválido');
    }
  },

  /**
   * Verifica um refresh token e retorna dados do usuário
   * @param {string} refreshToken - Refresh token a verificar
   * @returns {Object} Dados do usuário { userId, tokenId }
   * @throws {Error} Erro se o token for inválido
   */
  async verifyRefreshToken(refreshToken) {
    try {
      // Primeiro decodifica o token para obter o tokenId
      const decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);
      const { userId, tokenId } = decoded;
      
      logger.info(`Verificando refresh token para usuário ${userId} com tokenId ${tokenId}`);
      
      // Verifica se o token existe no banco usando o tokenId curto
      const storedToken = await prisma.refreshToken.findFirst({
        where: { token: tokenId, usuarioId: userId }
      });

      if (!storedToken) {
        // Tenta encontrar tokens do usuário para depuração
        const tokensDoUsuario = await prisma.refreshToken.findMany({
          where: { usuarioId: userId },
          select: { token: true }
        });
        
        logger.warn(`Token não encontrado. TokenId da requisição: ${tokenId}. Tokens do usuário no banco: ${JSON.stringify(tokensDoUsuario.map(t => t.token))}`);
        throw new Error('Token não encontrado');
      }
      
      logger.info(`Token encontrado no banco: ${storedToken.token}`);

      // Verifica se o token expirou
      if (storedToken.expiresAt < new Date()) {
        // Remove token expirado
        await prisma.refreshToken.delete({
          where: { id: storedToken.id }
        });
        throw new Error('Token expirado');
      }
      
      return { 
        userId: userId,
        tokenId: storedToken.id
      };
    } catch (error) {
      logger.warn(`Refresh token inválido: ${error.message}`);
      throw new Error('Refresh token inválido');
    }
  }
};

module.exports = tokenUtils;
