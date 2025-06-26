const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

/**
 * Controlador para gerenciamento de níveis de acesso
 */
const nivelAcessoController = {
  /**
   * Lista todos os níveis de acesso
   */
  listar: async (req, res) => {
    try {
      const niveisAcesso = await prisma.nivelAcesso.findMany({
        orderBy: {
          id: 'asc',
        },
      });
      
      return res.status(200).json(niveisAcesso);
    } catch (error) {
      console.error('Erro ao listar níveis de acesso:', error);
      return res.status(500).json({ 
        erro: 'Erro interno do servidor ao listar níveis de acesso',
        detalhes: process.env.NODE_ENV === 'development' ? error.message : null
      });
    }
  },
  
  /**
   * Busca um nível de acesso pelo ID
   */
  buscarPorId: async (req, res) => {
    const { id } = req.params;
    
    try {
      const nivelAcesso = await prisma.nivelAcesso.findUnique({
        where: { id: Number(id) },
      });
      
      if (!nivelAcesso) {
        return res.status(404).json({ erro: 'Nível de acesso não encontrado' });
      }
      
      return res.status(200).json(nivelAcesso);
    } catch (error) {
      console.error(`Erro ao buscar nível de acesso ID ${id}:`, error);
      return res.status(500).json({ 
        erro: 'Erro interno do servidor ao buscar nível de acesso',
        detalhes: process.env.NODE_ENV === 'development' ? error.message : null
      });
    }
  },
  
  /**
   * Cria um novo nível de acesso
   */
  criar: async (req, res) => {
    const { nome, descricao, permissoes } = req.body;
    
    if (!nome) {
      return res.status(400).json({ erro: 'Nome é obrigatório' });
    }
    
    try {
      // Verifica se já existe nível de acesso com este nome
      const nivelExistente = await prisma.nivelAcesso.findUnique({
        where: { nome },
      });
      
      if (nivelExistente) {
        return res.status(400).json({ erro: 'Já existe um nível de acesso com este nome' });
      }
      
      const novoNivelAcesso = await prisma.nivelAcesso.create({
        data: {
          nome,
          descricao,
          permissoes,
        },
      });
      
      return res.status(201).json(novoNivelAcesso);
    } catch (error) {
      console.error('Erro ao criar nível de acesso:', error);
      return res.status(500).json({ 
        erro: 'Erro interno do servidor ao criar nível de acesso',
        detalhes: process.env.NODE_ENV === 'development' ? error.message : null
      });
    }
  },
  
  /**
   * Atualiza um nível de acesso existente
   */
  atualizar: async (req, res) => {
    const { id } = req.params;
    const { nome, descricao, permissoes } = req.body;
    
    if (!nome) {
      return res.status(400).json({ erro: 'Nome é obrigatório' });
    }
    
    try {
      // Verifica se o nível de acesso existe
      const nivelExistente = await prisma.nivelAcesso.findUnique({
        where: { id: Number(id) },
      });
      
      if (!nivelExistente) {
        return res.status(404).json({ erro: 'Nível de acesso não encontrado' });
      }
      
      // Verifica se já existe outro nível com o mesmo nome
      if (nome !== nivelExistente.nome) {
        const nivelNomeExistente = await prisma.nivelAcesso.findUnique({
          where: { nome },
        });
        
        if (nivelNomeExistente) {
          return res.status(400).json({ erro: 'Já existe um nível de acesso com este nome' });
        }
      }
      
      const nivelAtualizado = await prisma.nivelAcesso.update({
        where: { id: Number(id) },
        data: {
          nome,
          descricao,
          permissoes,
        },
      });
      
      return res.status(200).json(nivelAtualizado);
    } catch (error) {
      console.error(`Erro ao atualizar nível de acesso ID ${id}:`, error);
      return res.status(500).json({ 
        erro: 'Erro interno do servidor ao atualizar nível de acesso',
        detalhes: process.env.NODE_ENV === 'development' ? error.message : null
      });
    }
  },
  
  /**
   * Remove um nível de acesso
   */
  remover: async (req, res) => {
    const { id } = req.params;
    
    try {
      // Verifica se o nível de acesso existe
      const nivelExistente = await prisma.nivelAcesso.findUnique({
        where: { id: Number(id) },
      });
      
      if (!nivelExistente) {
        return res.status(404).json({ erro: 'Nível de acesso não encontrado' });
      }
      
      // Verifica se há usuários com este nível de acesso
      const usuariosComNivel = await prisma.usuario.count({
        where: { nivel_id: Number(id) },
      });
      
      if (usuariosComNivel > 0) {
        return res.status(400).json({ 
          erro: 'Não é possível remover este nível de acesso pois existem usuários associados a ele',
          usuarios: usuariosComNivel
        });
      }
      
      await prisma.nivelAcesso.delete({
        where: { id: Number(id) },
      });
      
      return res.status(204).send();
    } catch (error) {
      console.error(`Erro ao remover nível de acesso ID ${id}:`, error);
      return res.status(500).json({ 
        erro: 'Erro interno do servidor ao remover nível de acesso',
        detalhes: process.env.NODE_ENV === 'development' ? error.message : null
      });
    }
  },
};

module.exports = nivelAcessoController;
