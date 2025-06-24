/**
 * Rotas de autenticação
 * 
 * @version 0.1.0-alpha
 */

const express = require('express');
const router = express.Router();
// Esta linha será substituída pelo controlador real quando for implementado
const authController = require('../controllers/authController');

/**
 * @route POST /api/auth/login
 * @desc Autenticar usuário e retornar tokens
 * @access Public
 */
router.post('/login', authController.login);

/**
 * @route POST /api/auth/refresh
 * @desc Renovar token JWT usando refresh token
 * @access Public
 */
router.post('/refresh', authController.refreshToken);

/**
 * @route POST /api/auth/logout
 * @desc Invalidar tokens do usuário
 * @access Private
 */
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
