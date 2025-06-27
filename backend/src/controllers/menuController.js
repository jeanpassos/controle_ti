const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

/**
 * Controlador para gerenciamento do menu dinâmico
 */
const menuController = {
  /**
   * Lista todos os itens de menu
   */
  listar: async (req, res) => {
    try {
      // Busca apenas os itens principais (sem pai)
      const menuPrincipais = await prisma.menuItem.findMany({
        where: {
          pai_id: null,
          ativo: true,
        },
        orderBy: {
          ordem: 'asc',
        },
        include: {
          filhos: {
            where: {
              ativo: true,
            },
            orderBy: {
              ordem: 'asc',
            },
          },
        },
      });
      
      return res.status(200).json(menuPrincipais);
    } catch (error) {
      console.error('Erro ao listar itens de menu:', error);
      return res.status(500).json({ 
        erro: 'Erro interno do servidor ao listar itens de menu',
        detalhes: process.env.NODE_ENV === 'development' ? error.message : null
      });
    }
  },
  
  /**
   * Lista todos os itens de menu (incluindo inativos) - para uso administrativo
   */
  listarAdmin: async (req, res) => {
    try {
      const menuCompleto = await prisma.menuItem.findMany({
        orderBy: [
          {
            pai_id: 'asc',
          },
          {
            ordem: 'asc',
          },
        ],
      });
      
      return res.status(200).json(menuCompleto);
    } catch (error) {
      console.error('Erro ao listar itens de menu para admin:', error);
      return res.status(500).json({ 
        erro: 'Erro interno do servidor ao listar itens de menu',
        detalhes: process.env.NODE_ENV === 'development' ? error.message : null
      });
    }
  },
  
  /**
   * Busca um item de menu pelo ID
   */
  buscarPorId: async (req, res) => {
    const { id } = req.params;
    
    try {
      const menuItem = await prisma.menuItem.findUnique({
        where: { id: Number(id) },
        include: {
          pai: true,
          filhos: {
            orderBy: {
              ordem: 'asc',
            },
          },
        },
      });
      
      if (!menuItem) {
        return res.status(404).json({ erro: 'Item de menu não encontrado' });
      }
      
      return res.status(200).json(menuItem);
    } catch (error) {
      console.error(`Erro ao buscar item de menu ID ${id}:`, error);
      return res.status(500).json({ 
        erro: 'Erro interno do servidor ao buscar item de menu',
        detalhes: process.env.NODE_ENV === 'development' ? error.message : null
      });
    }
  },
  
  /**
   * Retorna os itens de menu acessíveis para um determinado nível de acesso
   */
  menuPorNivel: async (req, res) => {
    const { nivelId } = req.params;
    
    try {
      const nivel = await prisma.nivelAcesso.findUnique({
        where: { id: Number(nivelId) },
      });
      
      if (!nivel) {
        return res.status(404).json({ erro: 'Nível de acesso não encontrado' });
      }
      
      // Busca itens de menu principais que sejam acessíveis para este nível
      // Como os níveis no banco são: 1=admin (maior privilégio), 4=usuário (menor privilégio)
      // Um usuário só deve ver itens com nivel_min >= seu nível
      const menuAcessivel = await prisma.menuItem.findMany({
        where: {
          pai_id: null,
          ativo: true,
          nivel_min: {
            gte: Number(nivelId)  // Nível mínimo maior ou igual ao nível do usuário
          },
        },
        orderBy: {
          ordem: 'asc',
        },
        include: {
          filhos: {
            where: {
              ativo: true,
              nivel_min: {
                gte: Number(nivelId)
              },
            },
            orderBy: {
              ordem: 'asc',
            },
          },
        },
      });
      
      return res.status(200).json(menuAcessivel);
    } catch (error) {
      console.error(`Erro ao buscar menu para nível ${nivelId}:`, error);
      return res.status(500).json({ 
        erro: 'Erro interno do servidor ao buscar menu por nível',
        detalhes: process.env.NODE_ENV === 'development' ? error.message : null
      });
    }
  },
  
  /**
   * Cria um novo item de menu
   */
  criar: async (req, res) => {
    const { 
      titulo, descricao, icone, url, componente, ordem, 
      ativo, externo, requer_auth, nivel_min, permissoes, pai_id 
    } = req.body;
    
    if (!titulo) {
      return res.status(400).json({ erro: 'Título é obrigatório' });
    }
    
    try {
      // Se tem pai_id, verifica se o pai existe
      if (pai_id) {
        const paiExiste = await prisma.menuItem.findUnique({
          where: { id: Number(pai_id) },
        });
        
        if (!paiExiste) {
          return res.status(400).json({ erro: 'Item pai não encontrado' });
        }
      }
      
      const novoMenuItem = await prisma.menuItem.create({
        data: {
          titulo,
          descricao,
          icone,
          url,
          componente,
          ordem: ordem || 0,
          ativo: ativo !== undefined ? ativo : true,
          externo: externo || false,
          requer_auth: requer_auth !== undefined ? requer_auth : true,
          nivel_min: nivel_min || 1,
          permissoes,
          pai_id: pai_id ? Number(pai_id) : null,
        },
      });
      
      return res.status(201).json(novoMenuItem);
    } catch (error) {
      console.error('Erro ao criar item de menu:', error);
      return res.status(500).json({ 
        erro: 'Erro interno do servidor ao criar item de menu',
        detalhes: process.env.NODE_ENV === 'development' ? error.message : null
      });
    }
  },
  
  /**
   * Atualiza um item de menu existente
   */
  atualizar: async (req, res) => {
    const { id } = req.params;
    const { 
      titulo, descricao, icone, url, componente, ordem, 
      ativo, externo, requer_auth, nivel_min, permissoes, pai_id 
    } = req.body;
    
    if (!titulo) {
      return res.status(400).json({ erro: 'Título é obrigatório' });
    }
    
    try {
      // Verifica se o item de menu existe
      const menuExistente = await prisma.menuItem.findUnique({
        where: { id: Number(id) },
      });
      
      if (!menuExistente) {
        return res.status(404).json({ erro: 'Item de menu não encontrado' });
      }
      
      // Se tem pai_id, verifica se o pai existe e não é o próprio item
      if (pai_id) {
        if (pai_id === Number(id)) {
          return res.status(400).json({ erro: 'Um item não pode ser seu próprio pai' });
        }
        
        const paiExiste = await prisma.menuItem.findUnique({
          where: { id: Number(pai_id) },
        });
        
        if (!paiExiste) {
          return res.status(400).json({ erro: 'Item pai não encontrado' });
        }
      }
      
      const menuAtualizado = await prisma.menuItem.update({
        where: { id: Number(id) },
        data: {
          titulo,
          descricao,
          icone,
          url,
          componente,
          ordem,
          ativo,
          externo,
          requer_auth,
          nivel_min,
          permissoes,
          pai_id: pai_id ? Number(pai_id) : null,
        },
      });
      
      return res.status(200).json(menuAtualizado);
    } catch (error) {
      console.error(`Erro ao atualizar item de menu ID ${id}:`, error);
      return res.status(500).json({ 
        erro: 'Erro interno do servidor ao atualizar item de menu',
        detalhes: process.env.NODE_ENV === 'development' ? error.message : null
      });
    }
  },
  
  /**
   * Remove um item de menu
   */
  remover: async (req, res) => {
    const { id } = req.params;
    
    try {
      // Verifica se o item de menu existe
      const menuExistente = await prisma.menuItem.findUnique({
        where: { id: Number(id) },
        include: {
          filhos: true,
        },
      });
      
      if (!menuExistente) {
        return res.status(404).json({ erro: 'Item de menu não encontrado' });
      }
      
      // Verifica se tem itens filhos
      if (menuExistente.filhos.length > 0) {
        return res.status(400).json({ 
          erro: 'Não é possível remover este item pois ele possui subitens',
          filhos: menuExistente.filhos.length
        });
      }
      
      await prisma.menuItem.delete({
        where: { id: Number(id) },
      });
      
      return res.status(204).send();
    } catch (error) {
      console.error(`Erro ao remover item de menu ID ${id}:`, error);
      return res.status(500).json({ 
        erro: 'Erro interno do servidor ao remover item de menu',
        detalhes: process.env.NODE_ENV === 'development' ? error.message : null
      });
    }
  },
  
  /**
   * Atualiza a ordem de múltiplos itens de menu
   */
  atualizarOrdem: async (req, res) => {
    const { itens } = req.body;
    
    if (!itens || !Array.isArray(itens)) {
      return res.status(400).json({ erro: 'Lista de itens inválida' });
    }
    
    try {
      // Usa uma transação para garantir que todas as atualizações sejam feitas ou nenhuma
      const resultado = await prisma.$transaction(
        itens.map(item => 
          prisma.menuItem.update({
            where: { id: Number(item.id) },
            data: { ordem: item.ordem }
          })
        )
      );
      
      return res.status(200).json({ 
        mensagem: 'Ordem atualizada com sucesso',
        itens: resultado.length
      });
    } catch (error) {
      console.error('Erro ao atualizar ordem dos itens de menu:', error);
      return res.status(500).json({ 
        erro: 'Erro interno do servidor ao atualizar ordem',
        detalhes: process.env.NODE_ENV === 'development' ? error.message : null
      });
    }
  },
};

module.exports = menuController;
