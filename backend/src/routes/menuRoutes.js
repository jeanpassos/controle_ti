const express = require('express');
const router = express.Router();
const menuController = require('../controllers/menuController');
const authMiddleware = require('../middlewares/authMiddleware');

/**
 * Rotas para menu dinâmico
 * Base: /api/menu
 */

// Listar todos os itens de menu ativos - requer autenticação
router.get('/', authMiddleware, menuController.listar);

// Listar todos os itens de menu (admin) - requer autenticação (admin)
router.get('/admin', authMiddleware, menuController.listarAdmin);

// Buscar menu por nível de acesso - requer autenticação
router.get('/nivel/:nivelId', authMiddleware, menuController.menuPorNivel);

// Buscar item de menu por ID - requer autenticação
router.get('/:id', authMiddleware, menuController.buscarPorId);

// Criar novo item de menu - requer autenticação (admin)
router.post('/', authMiddleware, menuController.criar);

// Atualizar item de menu - requer autenticação (admin)
router.put('/:id', authMiddleware, menuController.atualizar);

// Atualizar ordem de múltiplos itens - requer autenticação (admin)
router.put('/ordem/atualizar', authMiddleware, menuController.atualizarOrdem);

// Remover item de menu - requer autenticação (admin)
router.delete('/:id', authMiddleware, menuController.remover);

module.exports = router;
