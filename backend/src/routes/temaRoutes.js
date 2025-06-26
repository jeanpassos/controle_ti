const express = require('express');
const router = express.Router();
const temaController = require('../controllers/temaController');
const authMiddleware = require('../middlewares/authMiddleware');

/**
 * Rotas para temas
 * Base: /api/temas
 */

// Listar todos os temas ativos - requer autenticação
router.get('/', authMiddleware, temaController.listar);

// Listar todos os temas (admin) - requer autenticação (admin)
router.get('/admin', authMiddleware, temaController.listarAdmin);

// Buscar tema padrão - público
router.get('/padrao', temaController.buscarPadrao);

// Buscar tema por ID - requer autenticação
router.get('/:id', authMiddleware, temaController.buscarPorId);

// Criar novo tema - requer autenticação (admin)
router.post('/', authMiddleware, temaController.criar);

// Atualizar tema - requer autenticação (admin)
router.put('/:id', authMiddleware, temaController.atualizar);

// Definir tema como padrão - requer autenticação (admin)
router.put('/:id/padrao', authMiddleware, temaController.definirPadrao);

// Remover tema - requer autenticação (admin)
router.delete('/:id', authMiddleware, temaController.remover);

module.exports = router;
