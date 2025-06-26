const express = require('express');
const router = express.Router();
const nivelAcessoController = require('../controllers/nivelAcessoController');
const authMiddleware = require('../middlewares/authMiddleware');

/**
 * Rotas para níveis de acesso
 * Base: /api/niveis-acesso
 */

// Listar todos os níveis de acesso - requer autenticação
router.get('/', authMiddleware, nivelAcessoController.listar);

// Buscar nível de acesso por ID - requer autenticação
router.get('/:id', authMiddleware, nivelAcessoController.buscarPorId);

// Criar novo nível de acesso - requer autenticação (admin)
router.post('/', authMiddleware, nivelAcessoController.criar);

// Atualizar nível de acesso - requer autenticação (admin)
router.put('/:id', authMiddleware, nivelAcessoController.atualizar);

// Remover nível de acesso - requer autenticação (admin)
router.delete('/:id', authMiddleware, nivelAcessoController.remover);

module.exports = router;
