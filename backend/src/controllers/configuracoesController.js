const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

/**
 * Controlador para gerenciamento de configurações do sistema
 */
const configuracoesController = {
  /**
   * Lista todas as configurações visíveis
   */
  listar: async (req, res) => {
    try {
      const configuracoes = await prisma.configuracao.findMany({
        where: {
          visivel: true,
        },
        orderBy: [
          { grupo: 'asc' },
          { ordem: 'asc' },
          { chave: 'asc' },
        ],
      });
      
      // Agrupa as configurações por grupo para facilitar o uso no frontend
      const configuracoesPorGrupo = configuracoes.reduce((grupos, config) => {
        if (!grupos[config.grupo]) {
          grupos[config.grupo] = [];
        }
        grupos[config.grupo].push(config);
        return grupos;
      }, {});
      
      return res.status(200).json(configuracoesPorGrupo);
    } catch (error) {
      console.error('Erro ao listar configurações:', error);
      return res.status(500).json({ 
        erro: 'Erro interno do servidor ao listar configurações',
        detalhes: process.env.NODE_ENV === 'development' ? error.message : null
      });
    }
  },
  
  /**
   * Lista todas as configurações (incluindo não visíveis) - para uso administrativo
   */
  listarAdmin: async (req, res) => {
    try {
      const configuracoes = await prisma.configuracao.findMany({
        orderBy: [
          { grupo: 'asc' },
          { ordem: 'asc' },
          { chave: 'asc' },
        ],
        include: {
          atualizado_por: {
            select: {
              id: true,
              nome: true,
              email: true,
            },
          },
        },
      });
      
      // Agrupa as configurações por grupo para facilitar o uso no frontend
      const configuracoesPorGrupo = configuracoes.reduce((grupos, config) => {
        if (!grupos[config.grupo]) {
          grupos[config.grupo] = [];
        }
        grupos[config.grupo].push(config);
        return grupos;
      }, {});
      
      return res.status(200).json(configuracoesPorGrupo);
    } catch (error) {
      console.error('Erro ao listar configurações administrativas:', error);
      return res.status(500).json({ 
        erro: 'Erro interno do servidor ao listar configurações administrativas',
        detalhes: process.env.NODE_ENV === 'development' ? error.message : null
      });
    }
  },
  
  /**
   * Busca configuração por chave
   */
  buscarPorChave: async (req, res) => {
    try {
      const { chave } = req.params;
      
      if (!chave) {
        return res.status(400).json({ erro: 'Chave não especificada' });
      }
      
      const configuracao = await prisma.configuracao.findUnique({
        where: {
          chave,
        },
      });
      
      if (!configuracao) {
        return res.status(404).json({ erro: 'Configuração não encontrada' });
      }
      
      // Verifica se a configuração é restrita e o usuário não é admin
      if (configuracao.restrito && req.usuario.nivel < 3) {
        return res.status(403).json({ erro: 'Acesso negado a esta configuração' });
      }
      
      return res.status(200).json(configuracao);
    } catch (error) {
      console.error(`Erro ao buscar configuração por chave ${req.params.chave}:`, error);
      return res.status(500).json({ 
        erro: 'Erro interno do servidor ao buscar configuração',
        detalhes: process.env.NODE_ENV === 'development' ? error.message : null
      });
    }
  },
  
  /**
   * Busca configurações por grupo
   */
  buscarPorGrupo: async (req, res) => {
    try {
      const { grupo } = req.params;
      
      if (!grupo) {
        return res.status(400).json({ erro: 'Grupo não especificado' });
      }
      
      const configuracoes = await prisma.configuracao.findMany({
        where: {
          grupo,
          visivel: true,
        },
        orderBy: [
          { ordem: 'asc' },
          { chave: 'asc' },
        ],
      });
      
      // Filtra configurações restritas se o usuário não for admin
      const configuracoesPermitidas = req.usuario.nivel >= 3 
        ? configuracoes 
        : configuracoes.filter(config => !config.restrito);
      
      return res.status(200).json(configuracoesPermitidas);
    } catch (error) {
      console.error(`Erro ao buscar configurações do grupo ${req.params.grupo}:`, error);
      return res.status(500).json({ 
        erro: 'Erro interno do servidor ao buscar configurações por grupo',
        detalhes: process.env.NODE_ENV === 'development' ? error.message : null
      });
    }
  },
  
  /**
   * Atualiza uma configuração existente
   */
  atualizar: async (req, res) => {
    try {
      const { id } = req.params;
      const { valor, descricao, visivel, ordem } = req.body;
      
      // Valida entrada
      if (!id) {
        return res.status(400).json({ erro: 'ID não especificado' });
      }
      
      const idNum = parseInt(id);
      if (isNaN(idNum)) {
        return res.status(400).json({ erro: 'ID inválido' });
      }
      
      // Verifica se a configuração existe
      const configuracaoExistente = await prisma.configuracao.findUnique({
        where: { id: idNum },
      });
      
      if (!configuracaoExistente) {
        return res.status(404).json({ erro: 'Configuração não encontrada' });
      }
      
      // Verifica se o usuário tem permissão para editar configurações restritas
      if (configuracaoExistente.restrito && req.usuario.nivel < 3) {
        return res.status(403).json({ erro: 'Acesso negado para editar esta configuração' });
      }
      
      // Prepara os dados para atualização
      const dadosAtualizacao = {
        usuario_id: req.usuario.id, // Registra quem fez a alteração
        atualizado_em: new Date(), // Atualiza o timestamp
      };
      
      // Adiciona apenas campos fornecidos na requisição
      if (valor !== undefined) dadosAtualizacao.valor = valor;
      if (descricao !== undefined) dadosAtualizacao.descricao = descricao;
      if (visivel !== undefined && req.usuario.nivel >= 3) dadosAtualizacao.visivel = visivel;
      if (ordem !== undefined && req.usuario.nivel >= 3) dadosAtualizacao.ordem = ordem;
      
      // Atualiza a configuração
      const configuracaoAtualizada = await prisma.configuracao.update({
        where: { id: idNum },
        data: dadosAtualizacao,
      });
      
      return res.status(200).json(configuracaoAtualizada);
    } catch (error) {
      console.error(`Erro ao atualizar configuração ${req.params.id}:`, error);
      return res.status(500).json({ 
        erro: 'Erro interno do servidor ao atualizar configuração',
        detalhes: process.env.NODE_ENV === 'development' ? error.message : null
      });
    }
  },
  
  /**
   * Cria uma nova configuração (apenas admin)
   */
  criar: async (req, res) => {
    try {
      const { chave, valor, grupo, descricao, tipo, visivel, restrito, ordem } = req.body;
      
      // Valida entradas obrigatórias
      if (!chave || !valor || !grupo || !tipo) {
        return res.status(400).json({ 
          erro: 'Dados incompletos', 
          detalhes: 'Campos obrigatórios: chave, valor, grupo e tipo' 
        });
      }
      
      // Verifica se já existe configuração com a mesma chave
      const configuracaoExistente = await prisma.configuracao.findUnique({
        where: { chave },
      });
      
      if (configuracaoExistente) {
        return res.status(409).json({ erro: 'Já existe uma configuração com esta chave' });
      }
      
      // Cria nova configuração
      const novaConfiguracao = await prisma.configuracao.create({
        data: {
          chave,
          valor,
          grupo,
          descricao: descricao || null,
          tipo,
          visivel: visivel !== undefined ? visivel : true,
          restrito: restrito !== undefined ? restrito : false,
          ordem: ordem !== undefined ? ordem : 0,
          usuario_id: req.usuario.id,
        },
      });
      
      return res.status(201).json(novaConfiguracao);
    } catch (error) {
      console.error('Erro ao criar configuração:', error);
      return res.status(500).json({ 
        erro: 'Erro interno do servidor ao criar configuração',
        detalhes: process.env.NODE_ENV === 'development' ? error.message : null
      });
    }
  },
  
  /**
   * Remove uma configuração (apenas admin)
   */
  remover: async (req, res) => {
    try {
      const { id } = req.params;
      
      if (!id) {
        return res.status(400).json({ erro: 'ID não especificado' });
      }
      
      const idNum = parseInt(id);
      if (isNaN(idNum)) {
        return res.status(400).json({ erro: 'ID inválido' });
      }
      
      // Verifica se a configuração existe
      const configuracaoExistente = await prisma.configuracao.findUnique({
        where: { id: idNum },
      });
      
      if (!configuracaoExistente) {
        return res.status(404).json({ erro: 'Configuração não encontrada' });
      }
      
      // Remove a configuração
      await prisma.configuracao.delete({
        where: { id: idNum },
      });
      
      return res.status(200).json({ mensagem: 'Configuração removida com sucesso' });
    } catch (error) {
      console.error(`Erro ao remover configuração ${req.params.id}:`, error);
      return res.status(500).json({ 
        erro: 'Erro interno do servidor ao remover configuração',
        detalhes: process.env.NODE_ENV === 'development' ? error.message : null
      });
    }
  },
};

module.exports = configuracoesController;
