const express = require('express');
const router = express.Router();
const configuracoesController = require('../controllers/configuracoesController');
const authMiddleware = require('../middlewares/authMiddleware');
const adminMiddleware = require('../middlewares/adminMiddleware');

/**
 * Rotas para configurações do sistema
 * Base: /api/configuracoes
 */

// Listar todas as configurações visíveis - requer autenticação
router.get('/', authMiddleware, configuracoesController.listar);

// Listar todas as configurações (admin) - requer autenticação (admin)
router.get('/admin', authMiddleware, adminMiddleware, configuracoesController.listarAdmin);

// Buscar configurações por grupo - requer autenticação
router.get('/grupo/:grupo', authMiddleware, configuracoesController.buscarPorGrupo);

// Buscar configuração por chave - requer autenticação
router.get('/chave/:chave', authMiddleware, configuracoesController.buscarPorChave);

// Criar nova configuração - requer autenticação (admin)
router.post('/', authMiddleware, adminMiddleware, configuracoesController.criar);

// Atualizar configuração - requer autenticação
router.put('/:id', authMiddleware, configuracoesController.atualizar);

// Remover configuração - requer autenticação (admin)
router.delete('/:id', authMiddleware, adminMiddleware, configuracoesController.remover);

module.exports = router;
