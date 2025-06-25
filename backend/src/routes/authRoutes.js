/**
 * Rotas de autenticação
 * 
 * @version 0.1.0-alpha
 */

const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { authMiddleware } = require('../middleware/auth');

/**
 * Rotas de autenticação
 * Endpoints para login, refresh, logout e validação de token
 */

// Rota para login
router.post('/login', authController.login);

// Rota para refresh token
router.post('/refresh', authController.refreshToken);

// Rota para logout
router.post('/logout', authController.logout);

/**
 * @route POST /api/auth/2fa/generate
 * @desc Gerar chave para autenticação de dois fatores
 * @access Private
 */
router.post('/2fa/generate', authController.generate2FA);

/**
 * @route POST /api/auth/2fa/validate
 * @desc Validar código de autenticação de dois fatores
 * @access Public
 */
router.post('/2fa/validate', authController.validate2FA);

module.exports = router;
