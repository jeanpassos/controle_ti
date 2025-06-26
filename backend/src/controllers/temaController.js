const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

/**
 * Controlador para gerenciamento de temas
 */
const temaController = {
  /**
   * Lista todos os temas ativos
   */
  listar: async (req, res) => {
    try {
      const temas = await prisma.tema.findMany({
        where: {
          ativo: true,
        },
        orderBy: {
          nome: 'asc',
        },
      });
      
      return res.status(200).json(temas);
    } catch (error) {
      console.error('Erro ao listar temas:', error);
      return res.status(500).json({ 
        erro: 'Erro interno do servidor ao listar temas',
        detalhes: process.env.NODE_ENV === 'development' ? error.message : null
      });
    }
  },
  
  /**
   * Lista todos os temas (incluindo inativos) - para uso administrativo
   */
  listarAdmin: async (req, res) => {
    try {
      const temas = await prisma.tema.findMany({
        orderBy: {
          nome: 'asc',
        },
        include: {
          usuario: {
            select: {
              id: true,
              nome: true,
              email: true,
            },
          },
        },
      });
      
      return res.status(200).json(temas);
    } catch (error) {
      console.error('Erro ao listar temas para admin:', error);
      return res.status(500).json({ 
        erro: 'Erro interno do servidor ao listar temas',
        detalhes: process.env.NODE_ENV === 'development' ? error.message : null
      });
    }
  },
  
  /**
   * Busca o tema padrão do sistema
   */
  buscarPadrao: async (req, res) => {
    try {
      const temaPadrao = await prisma.tema.findFirst({
        where: {
          padrao: true,
          ativo: true,
        },
      });
      
      if (!temaPadrao) {
        // Caso não encontre tema padrão, busca o primeiro tema ativo
        const primeiroTema = await prisma.tema.findFirst({
          where: {
            ativo: true,
          },
        });
        
        if (!primeiroTema) {
          return res.status(404).json({ erro: 'Nenhum tema encontrado' });
        }
        
        return res.status(200).json(primeiroTema);
      }
      
      return res.status(200).json(temaPadrao);
    } catch (error) {
      console.error('Erro ao buscar tema padrão:', error);
      return res.status(500).json({ 
        erro: 'Erro interno do servidor ao buscar tema padrão',
        detalhes: process.env.NODE_ENV === 'development' ? error.message : null
      });
    }
  },
  
  /**
   * Busca um tema pelo ID
   */
  buscarPorId: async (req, res) => {
    const { id } = req.params;
    
    try {
      const tema = await prisma.tema.findUnique({
        where: { id: Number(id) },
        include: {
          usuario: {
            select: {
              id: true,
              nome: true,
              email: true,
            },
          },
        },
      });
      
      if (!tema) {
        return res.status(404).json({ erro: 'Tema não encontrado' });
      }
      
      return res.status(200).json(tema);
    } catch (error) {
      console.error(`Erro ao buscar tema ID ${id}:`, error);
      return res.status(500).json({ 
        erro: 'Erro interno do servidor ao buscar tema',
        detalhes: process.env.NODE_ENV === 'development' ? error.message : null
      });
    }
  },
  
  /**
   * Cria um novo tema
   */
  criar: async (req, res) => {
    const { 
      nome, descricao, cor_primaria, cor_secundaria, 
      cor_fundo_claro, cor_fundo_escuro, cor_texto_claro, 
      cor_texto_escuro, logo_url, favicon_url, fonte_principal,
      padrao, personalizado, ativo, css_custom, usuario_id 
    } = req.body;
    
    if (!nome) {
      return res.status(400).json({ erro: 'Nome é obrigatório' });
    }
    
    // Valida formato das cores (hex)
    const validarCor = (cor) => /^#[0-9A-Fa-f]{6}$/.test(cor);
    const cores = [
      { nome: 'cor_primaria', valor: cor_primaria },
      { nome: 'cor_secundaria', valor: cor_secundaria },
      { nome: 'cor_fundo_claro', valor: cor_fundo_claro },
      { nome: 'cor_fundo_escuro', valor: cor_fundo_escuro },
      { nome: 'cor_texto_claro', valor: cor_texto_claro },
      { nome: 'cor_texto_escuro', valor: cor_texto_escuro }
    ];
    
    for (const cor of cores) {
      if (cor.valor && !validarCor(cor.valor)) {
        return res.status(400).json({ 
          erro: `Formato de cor inválido para ${cor.nome}`,
          formato: 'Utilize formato hexadecimal #RRGGBB'
        });
      }
    }
    
    try {
      // Verifica se já existe tema com este nome
      const temaExistente = await prisma.tema.findUnique({
        where: { nome },
      });
      
      if (temaExistente) {
        return res.status(400).json({ erro: 'Já existe um tema com este nome' });
      }
      
      // Se for para definir como padrão, remove o padrão dos outros
      if (padrao) {
        await prisma.tema.updateMany({
          where: { padrao: true },
          data: { padrao: false },
        });
      }
      
      const novoTema = await prisma.tema.create({
        data: {
          nome,
          descricao,
          cor_primaria: cor_primaria || '#0284c7',  // Azul claro
          cor_secundaria: cor_secundaria || '#0d9488',  // Verde água
          cor_fundo_claro: cor_fundo_claro || '#f8fafc',  // Cinza muito claro
          cor_fundo_escuro: cor_fundo_escuro || '#0f172a',  // Azul escuro
          cor_texto_claro: cor_texto_claro || '#1e293b',  // Cinza escuro
          cor_texto_escuro: cor_texto_escuro || '#f1f5f9',  // Cinza claro
          logo_url,
          favicon_url,
          fonte_principal: fonte_principal || 'Inter',
          padrao: padrao || false,
          personalizado: personalizado || false,
          ativo: ativo !== undefined ? ativo : true,
          css_custom,
          usuario_id: usuario_id ? Number(usuario_id) : null,
        },
      });
      
      return res.status(201).json(novoTema);
    } catch (error) {
      console.error('Erro ao criar tema:', error);
      return res.status(500).json({ 
        erro: 'Erro interno do servidor ao criar tema',
        detalhes: process.env.NODE_ENV === 'development' ? error.message : null
      });
    }
  },
  
  /**
   * Atualiza um tema existente
   */
  atualizar: async (req, res) => {
    const { id } = req.params;
    const { 
      nome, descricao, cor_primaria, cor_secundaria, 
      cor_fundo_claro, cor_fundo_escuro, cor_texto_claro, 
      cor_texto_escuro, logo_url, favicon_url, fonte_principal,
      padrao, personalizado, ativo, css_custom, usuario_id 
    } = req.body;
    
    if (!nome) {
      return res.status(400).json({ erro: 'Nome é obrigatório' });
    }
    
    // Valida formato das cores (hex)
    const validarCor = (cor) => /^#[0-9A-Fa-f]{6}$/.test(cor);
    const cores = [
      { nome: 'cor_primaria', valor: cor_primaria },
      { nome: 'cor_secundaria', valor: cor_secundaria },
      { nome: 'cor_fundo_claro', valor: cor_fundo_claro },
      { nome: 'cor_fundo_escuro', valor: cor_fundo_escuro },
      { nome: 'cor_texto_claro', valor: cor_texto_claro },
      { nome: 'cor_texto_escuro', valor: cor_texto_escuro }
    ];
    
    for (const cor of cores) {
      if (cor.valor && !validarCor(cor.valor)) {
        return res.status(400).json({ 
          erro: `Formato de cor inválido para ${cor.nome}`,
          formato: 'Utilize formato hexadecimal #RRGGBB'
        });
      }
    }
    
    try {
      // Verifica se o tema existe
      const temaExistente = await prisma.tema.findUnique({
        where: { id: Number(id) },
      });
      
      if (!temaExistente) {
        return res.status(404).json({ erro: 'Tema não encontrado' });
      }
      
      // Verifica se já existe outro tema com o mesmo nome
      if (nome !== temaExistente.nome) {
        const temaNomeExistente = await prisma.tema.findUnique({
          where: { nome },
        });
        
        if (temaNomeExistente) {
          return res.status(400).json({ erro: 'Já existe um tema com este nome' });
        }
      }
      
      // Se for para definir como padrão, remove o padrão dos outros
      if (padrao && !temaExistente.padrao) {
        await prisma.tema.updateMany({
          where: { 
            padrao: true,
            id: { not: Number(id) }
          },
          data: { padrao: false },
        });
      }
      
      const temaAtualizado = await prisma.tema.update({
        where: { id: Number(id) },
        data: {
          nome,
          descricao,
          cor_primaria,
          cor_secundaria,
          cor_fundo_claro,
          cor_fundo_escuro,
          cor_texto_claro,
          cor_texto_escuro,
          logo_url,
          favicon_url,
          fonte_principal,
          padrao,
          personalizado,
          ativo,
          css_custom,
          usuario_id: usuario_id ? Number(usuario_id) : null,
        },
      });
      
      return res.status(200).json(temaAtualizado);
    } catch (error) {
      console.error(`Erro ao atualizar tema ID ${id}:`, error);
      return res.status(500).json({ 
        erro: 'Erro interno do servidor ao atualizar tema',
        detalhes: process.env.NODE_ENV === 'development' ? error.message : null
      });
    }
  },
  
  /**
   * Define um tema como padrão
   */
  definirPadrao: async (req, res) => {
    const { id } = req.params;
    
    try {
      // Verifica se o tema existe
      const tema = await prisma.tema.findUnique({
        where: { id: Number(id) },
      });
      
      if (!tema) {
        return res.status(404).json({ erro: 'Tema não encontrado' });
      }
      
      // Verifica se o tema está ativo
      if (!tema.ativo) {
        return res.status(400).json({ erro: 'Não é possível definir um tema inativo como padrão' });
      }
      
      // Remove o padrão de todos os temas
      await prisma.tema.updateMany({
        where: { padrao: true },
        data: { padrao: false },
      });
      
      // Define este tema como padrão
      await prisma.tema.update({
        where: { id: Number(id) },
        data: { padrao: true },
      });
      
      return res.status(200).json({ 
        mensagem: 'Tema definido como padrão com sucesso',
        tema_id: Number(id)
      });
    } catch (error) {
      console.error(`Erro ao definir tema ID ${id} como padrão:`, error);
      return res.status(500).json({ 
        erro: 'Erro interno do servidor ao definir tema como padrão',
        detalhes: process.env.NODE_ENV === 'development' ? error.message : null
      });
    }
  },
  
  /**
   * Remove um tema
   */
  remover: async (req, res) => {
    const { id } = req.params;
    
    try {
      // Verifica se o tema existe
      const tema = await prisma.tema.findUnique({
        where: { id: Number(id) },
      });
      
      if (!tema) {
        return res.status(404).json({ erro: 'Tema não encontrado' });
      }
      
      // Não permite remover o tema padrão
      if (tema.padrao) {
        return res.status(400).json({ erro: 'Não é possível remover o tema padrão' });
      }
      
      await prisma.tema.delete({
        where: { id: Number(id) },
      });
      
      return res.status(204).send();
    } catch (error) {
      console.error(`Erro ao remover tema ID ${id}:`, error);
      return res.status(500).json({ 
        erro: 'Erro interno do servidor ao remover tema',
        detalhes: process.env.NODE_ENV === 'development' ? error.message : null
      });
    }
  },
};

module.exports = temaController;
