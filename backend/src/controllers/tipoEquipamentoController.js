const { PrismaClient } = require('@prisma/client');
const logger = require('../utils/logger');
const prisma = new PrismaClient();

/**
 * Controlador para operações CRUD de TipoEquipamento
 * @version 0.52.0
 */
const tipoEquipamentoController = {
  /**
   * Lista todos os tipos de equipamento
   * @param {Object} req - Express Request
   * @param {Object} res - Express Response
   */
  async listarTodos(req, res) {
    try {
      const tipos = await prisma.tipoEquipamento.findMany({
        orderBy: { nome: 'asc' },
        where: { ativo: true }
      });
      
      return res.status(200).json(tipos);
    } catch (error) {
      logger.error(`Erro ao listar tipos de equipamento: ${error.message}`);
      return res.status(500).json({ 
        message: 'Erro ao listar tipos de equipamento',
        error: error.message
      });
    }
  },

  /**
   * Busca um tipo de equipamento pelo ID
   * @param {Object} req - Express Request
   * @param {Object} res - Express Response
   */
  async buscarPorId(req, res) {
    try {
      const { id } = req.params;
      
      const tipo = await prisma.tipoEquipamento.findUnique({
        where: { id: Number(id) }
      });
      
      if (!tipo) {
        return res.status(404).json({ message: 'Tipo de equipamento não encontrado' });
      }
      
      return res.status(200).json(tipo);
    } catch (error) {
      logger.error(`Erro ao buscar tipo de equipamento: ${error.message}`);
      return res.status(500).json({ 
        message: 'Erro ao buscar tipo de equipamento',
        error: error.message 
      });
    }
  },

  /**
   * Cria um novo tipo de equipamento
   * @param {Object} req - Express Request
   * @param {Object} res - Express Response
   */
  async criar(req, res) {
    try {
      const { nome, descricao, icone, cor } = req.body;
      
      if (!nome) {
        return res.status(400).json({ message: 'Nome é obrigatório' });
      }
      
      // Verifica se já existe um tipo com o mesmo nome
      const tipoExistente = await prisma.tipoEquipamento.findFirst({
        where: { nome: { equals: nome, mode: 'insensitive' } }
      });
      
      if (tipoExistente) {
        return res.status(409).json({ message: 'Já existe um tipo de equipamento com este nome' });
      }
      
      const novoTipo = await prisma.tipoEquipamento.create({
        data: {
          nome,
          descricao: descricao || '',
          icone: icone || null,
          cor: cor || null,
          ativo: true
        }
      });
      
      logger.info(`Tipo de equipamento criado: ${novoTipo.id} - ${nome}`);
      
      return res.status(201).json(novoTipo);
    } catch (error) {
      logger.error(`Erro ao criar tipo de equipamento: ${error.message}`);
      return res.status(500).json({ 
        message: 'Erro ao criar tipo de equipamento',
        error: error.message 
      });
    }
  },

  /**
   * Atualiza um tipo de equipamento existente
   * @param {Object} req - Express Request
   * @param {Object} res - Express Response
   */
  async atualizar(req, res) {
    try {
      const { id } = req.params;
      const { nome, descricao, icone, cor, ativo } = req.body;
      
      // Verifica se o tipo existe
      const tipoExistente = await prisma.tipoEquipamento.findUnique({
        where: { id: Number(id) }
      });
      
      if (!tipoExistente) {
        return res.status(404).json({ message: 'Tipo de equipamento não encontrado' });
      }
      
      // Verifica se há outro tipo com o mesmo nome
      if (nome && nome !== tipoExistente.nome) {
        const tipoComMesmoNome = await prisma.tipoEquipamento.findFirst({
          where: { 
            nome: { equals: nome, mode: 'insensitive' },
            id: { not: Number(id) }
          }
        });
        
        if (tipoComMesmoNome) {
          return res.status(409).json({ message: 'Já existe outro tipo de equipamento com este nome' });
        }
      }
      
      const tipoAtualizado = await prisma.tipoEquipamento.update({
        where: { id: Number(id) },
        data: {
          nome: nome || tipoExistente.nome,
          descricao: descricao !== undefined ? descricao : tipoExistente.descricao,
          icone: icone !== undefined ? icone : tipoExistente.icone,
          cor: cor !== undefined ? cor : tipoExistente.cor,
          ativo: ativo !== undefined ? ativo : tipoExistente.ativo
        }
      });
      
      logger.info(`Tipo de equipamento atualizado: ${tipoAtualizado.id} - ${tipoAtualizado.nome}`);
      
      return res.status(200).json(tipoAtualizado);
    } catch (error) {
      logger.error(`Erro ao atualizar tipo de equipamento: ${error.message}`);
      return res.status(500).json({ 
        message: 'Erro ao atualizar tipo de equipamento',
        error: error.message 
      });
    }
  },

  /**
   * Remove logicamente um tipo de equipamento
   * @param {Object} req - Express Request
   * @param {Object} res - Express Response
   */
  async remover(req, res) {
    try {
      const { id } = req.params;
      
      // Verifica se o tipo existe
      const tipoExistente = await prisma.tipoEquipamento.findUnique({
        where: { id: Number(id) }
      });
      
      if (!tipoExistente) {
        return res.status(404).json({ message: 'Tipo de equipamento não encontrado' });
      }
      
      // Verifica se há equipamentos usando este tipo
      const equipamentosAssociados = await prisma.equipamento.count({
        where: { tipo_id: Number(id) }
      });
      
      if (equipamentosAssociados > 0) {
        // Em vez de excluir, apenas marca como inativo
        const tipoDesativado = await prisma.tipoEquipamento.update({
          where: { id: Number(id) },
          data: { ativo: false }
        });
        
        logger.info(`Tipo de equipamento desativado: ${id} - ${tipoExistente.nome}`);
        
        return res.status(200).json({ 
          message: `Tipo de equipamento desativado. Há ${equipamentosAssociados} equipamentos associados a ele.`,
          id: tipoDesativado.id
        });
      }
      
      // Se não houver equipamentos, exclui completamente
      await prisma.tipoEquipamento.delete({
        where: { id: Number(id) }
      });
      
      logger.info(`Tipo de equipamento removido: ${id} - ${tipoExistente.nome}`);
      
      return res.status(200).json({ 
        message: 'Tipo de equipamento removido com sucesso',
        id: Number(id) 
      });
    } catch (error) {
      logger.error(`Erro ao remover tipo de equipamento: ${error.message}`);
      return res.status(500).json({ 
        message: 'Erro ao remover tipo de equipamento',
        error: error.message 
      });
    }
  }
};

module.exports = tipoEquipamentoController;
