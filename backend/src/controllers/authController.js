const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { PrismaClient } = require('@prisma/client');
const logger = require('../utils/logger');
const { generateTokens, verifyRefreshToken } = require('../utils/tokens');

const prisma = new PrismaClient();

/**
 * Controller de autenticação
 * Gerencia login, refresh token e logout
 */
const authController = {
  /**
   * Login de usuário
   * @param {Object} req - Express Request
   * @param {Object} res - Express Response
   */
  async login(req, res) {
    const { email, senha } = req.body;

    try {
      // Busca o usuário pelo email
      const usuario = await prisma.usuario.findUnique({
        where: { email: email.toLowerCase() }
      });

      // Verifica se o usuário existe
      if (!usuario) {
        logger.warn(`Tentativa de login com email não registrado: ${email}`);
        return res.status(401).json({ message: 'Credenciais inválidas' });
      }

      // Verifica se o usuário está ativo
      if (!usuario.ativo) {
        logger.warn(`Tentativa de login com conta desativada: ${email}`);
        return res.status(403).json({ message: 'Conta desativada. Entre em contato com o administrador.' });
      }

      // Verifica a senha
      const senhaCorreta = await bcrypt.compare(senha, usuario.senha);
      if (!senhaCorreta) {
        logger.warn(`Tentativa de login com senha incorreta para: ${email}`);
        return res.status(401).json({ message: 'Credenciais inválidas' });
      }

      // Gera tokens (JWT e refresh token)
      const { accessToken, refreshToken } = generateTokens(usuario);

      // Salva o refresh token no banco de dados
      await prisma.refreshToken.create({
        data: {
          token: refreshToken,
          expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 dias
          usuarioId: usuario.id
        }
      });

      // Registra o login bem-sucedido
      logger.info(`Login bem-sucedido: ${usuario.email} (ID: ${usuario.id})`);

      // Retorna os tokens e informações básicas do usuário
      res.json({
        accessToken,
        refreshToken,
        usuario: {
          id: usuario.id,
          nome: usuario.nome,
          email: usuario.email,
          cargo: usuario.cargo,
          permissoes: usuario.permissoes
        }
      });
    } catch (error) {
      logger.error(`Erro no login: ${error.message}`);
      res.status(500).json({ message: 'Erro no servidor ao processar login' });
    }
  },

  /**
   * Refresh de token JWT
   * @param {Object} req - Express Request
   * @param {Object} res - Express Response
   */
  async refreshToken(req, res) {
    const { refreshToken } = req.body;

    if (!refreshToken) {
      return res.status(400).json({ message: 'Refresh token não fornecido' });
    }

    try {
      // Verifica o refresh token e obtém dados do usuário
      const { userId, tokenId } = await verifyRefreshToken(refreshToken);

      // Busca o usuário
      const usuario = await prisma.usuario.findUnique({
        where: { id: userId }
      });

      if (!usuario || !usuario.ativo) {
        return res.status(401).json({ message: 'Token inválido ou usuário inativo' });
      }

      // Gera novos tokens
      const tokens = generateTokens(usuario);

      // Atualiza o refresh token no banco
      await prisma.refreshToken.update({
        where: { id: tokenId },
        data: {
          token: tokens.refreshToken,
          expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // 7 dias
        }
      });

      // Retorna os novos tokens
      res.json(tokens);
    } catch (error) {
      logger.error(`Erro ao atualizar token: ${error.message}`);
      res.status(401).json({ message: 'Falha ao atualizar o token de acesso' });
    }
  },

  /**
   * Logout de usuário
   * @param {Object} req - Express Request
   * @param {Object} res - Express Response
   */
  async logout(req, res) {
    const { refreshToken } = req.body;

    if (!refreshToken) {
      return res.status(400).json({ message: 'Refresh token não fornecido' });
    }

    try {
      // Invalida o refresh token
      await prisma.refreshToken.deleteMany({
        where: { token: refreshToken }
      });

      logger.info('Logout bem-sucedido');
      res.status(204).send();
    } catch (error) {
      logger.error(`Erro no logout: ${error.message}`);
      res.status(500).json({ message: 'Erro ao processar logout' });
    }
  },

  /**
   * Verifica se um token é válido
   * @param {Object} req - Express Request
   * @param {Object} res - Express Response
   */
  validateToken(req, res) {
    // Se chegou até aqui, o middleware de autenticação já validou o token
    res.status(200).json({ valid: true, usuario: req.user });
  }
};

module.exports = authController;
