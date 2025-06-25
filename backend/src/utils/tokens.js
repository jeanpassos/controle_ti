const jwt = require('jsonwebtoken');
const { PrismaClient } = require('@prisma/client');
const logger = require('./logger');

const prisma = new PrismaClient();

/**
 * Utilitários para gerenciamento de tokens JWT
 */
const tokenUtils = {
  /**
   * Gera tokens de acesso e refresh para um usuário
   * @param {Object} usuario - Objeto do usuário
   * @returns {Object} Tokens gerados { accessToken, refreshToken }
   */
  generateTokens(usuario) {
    const payload = {
      userId: usuario.id,
      email: usuario.email,
      nome: usuario.nome,
      cargo: usuario.cargo,
      permissoes: usuario.permissoes
    };

    // Token JWT de curta duração (1 hora)
    const accessToken = jwt.sign(
      payload,
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    // Token de refresh de longa duração (7 dias)
    const refreshToken = jwt.sign(
      { userId: usuario.id, tokenId: Date.now().toString() },
      process.env.REFRESH_TOKEN_SECRET,
      { expiresIn: '7d' }
    );

    return { accessToken, refreshToken };
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
      // Verifica se o token existe no banco
      const storedToken = await prisma.refreshToken.findFirst({
        where: { token: refreshToken }
      });

      if (!storedToken) {
        throw new Error('Token não encontrado');
      }

      // Verifica se o token expirou
      if (storedToken.expiresAt < new Date()) {
        // Remove token expirado
        await prisma.refreshToken.delete({
          where: { id: storedToken.id }
        });
        throw new Error('Token expirado');
      }

      // Decodifica o token
      const decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);
      
      return { 
        userId: decoded.userId,
        tokenId: storedToken.id
      };
    } catch (error) {
      logger.warn(`Refresh token inválido: ${error.message}`);
      throw new Error('Refresh token inválido');
    }
  }
};

module.exports = tokenUtils;
