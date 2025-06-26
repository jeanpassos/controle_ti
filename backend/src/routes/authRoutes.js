/**
 * Rotas de autenticação
 * 
 * @version 0.1.0-alpha
 */

const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const authMiddleware = require('../middlewares/authMiddleware');

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

// Rota para validar token
router.get('/validate', authMiddleware, authController.validateToken);

/**
 * @route POST /api/auth/2fa/generate
 * @desc Gerar chave para autenticação de dois fatores
 * @access Private
 * @todo Implementar esta funcionalidade
 */
// router.post('/2fa/generate', authController.generate2FA);

/**
 * @route POST /api/auth/2fa/validate
 * @desc Validar código de autenticação de dois fatores
 * @access Public
 * @todo Implementar esta funcionalidade
 */
// router.post('/2fa/validate', authController.validate2FA);

module.exports = router;
