const express = require('express');
const router = express.Router();
const tipoEquipamentoController = require('../controllers/tipoEquipamentoController');
const { authMiddleware } = require('../middleware/auth');

/**
 * Rotas para CRUD de Tipos de Equipamento
 * @version 0.52.0
 */

// Middleware de autenticação para todas as rotas
router.use(authMiddleware);

// Listar todos os tipos de equipamento
router.get('/', tipoEquipamentoController.listarTodos);

// Buscar tipo de equipamento por ID
router.get('/:id', tipoEquipamentoController.buscarPorId);

// Criar novo tipo de equipamento
router.post('/', tipoEquipamentoController.criar);

// Atualizar tipo de equipamento existente
router.put('/:id', tipoEquipamentoController.atualizar);

// Remover tipo de equipamento
router.delete('/:id', tipoEquipamentoController.remover);

module.exports = router;
