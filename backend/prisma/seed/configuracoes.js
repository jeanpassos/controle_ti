/**
 * Seed de configurações padrão do sistema
 */

const configuracoesIniciais = [
  // Grupo: Sistema
  {
    chave: 'sistema.nome',
    valor: 'Sistema de Controle de TI',
    grupo: 'Sistema',
    descricao: 'Nome do sistema exibido no topo das páginas',
    tipo: 'text',
    visivel: true,
    restrito: false,
    ordem: 1
  },
  {
    chave: 'sistema.versao',
    valor: '0.52',
    grupo: 'Sistema',
    descricao: 'Versão atual do sistema',
    tipo: 'text',
    visivel: true,
    restrito: true,
    ordem: 2
  },
  {
    chave: 'sistema.modo_debug',
    valor: 'false',
    grupo: 'Sistema',
    descricao: 'Ativa o modo de depuração com logs detalhados',
    tipo: 'boolean',
    visivel: true,
    restrito: true,
    ordem: 3
  },
  
  // Grupo: Alertas
  {
    chave: 'alertas.dias_garantia',
    valor: '30',
    grupo: 'Alertas',
    descricao: 'Dias antes do vencimento da garantia para exibir alertas',
    tipo: 'number',
    visivel: true,
    restrito: false,
    ordem: 1
  },
  {
    chave: 'alertas.ativo',
    valor: 'true',
    grupo: 'Alertas',
    descricao: 'Ativa/desativa o sistema de alertas',
    tipo: 'boolean',
    visivel: true,
    restrito: false,
    ordem: 2
  },
  
  // Grupo: Email
  {
    chave: 'email.envio_ativo',
    valor: 'false',
    grupo: 'Email',
    descricao: 'Ativa/desativa o envio de emails pelo sistema',
    tipo: 'boolean',
    visivel: true,
    restrito: false,
    ordem: 1
  },
  {
    chave: 'email.servidor',
    valor: 'smtp.exemplo.com.br',
    grupo: 'Email',
    descricao: 'Servidor SMTP para envio de emails',
    tipo: 'text',
    visivel: true,
    restrito: false,
    ordem: 2
  },
  {
    chave: 'email.porta',
    valor: '587',
    grupo: 'Email',
    descricao: 'Porta para conexão com servidor SMTP',
    tipo: 'number',
    visivel: true,
    restrito: false,
    ordem: 3
  },
  {
    chave: 'email.usuario',
    valor: 'notificacao@exemplo.com.br',
    grupo: 'Email',
    descricao: 'Usuário para autenticação no servidor SMTP',
    tipo: 'text',
    visivel: true,
    restrito: true,
    ordem: 4
  },
  {
    chave: 'email.senha',
    valor: 'senha_email_aqui',
    grupo: 'Email',
    descricao: 'Senha para autenticação no servidor SMTP',
    tipo: 'text',
    visivel: true,
    restrito: true,
    ordem: 5
  },
  {
    chave: 'email.remetente',
    valor: 'Controle de TI <notificacao@exemplo.com.br>',
    grupo: 'Email',
    descricao: 'Nome e email que aparecerá como remetente',
    tipo: 'text',
    visivel: true,
    restrito: false,
    ordem: 6
  },
  
  // Grupo: Interface
  {
    chave: 'interface.sidebar_colapsada',
    valor: 'false',
    grupo: 'Interface',
    descricao: 'Define se o menu lateral inicia colapsado',
    tipo: 'boolean',
    visivel: true,
    restrito: false,
    ordem: 1
  },
  {
    chave: 'interface.itens_por_pagina',
    valor: '10',
    grupo: 'Interface',
    descricao: 'Quantidade padrão de itens por página em listagens',
    tipo: 'number',
    visivel: true,
    restrito: false,
    ordem: 2
  },
  {
    chave: 'interface.tema_padrao_forcar',
    valor: 'false',
    grupo: 'Interface',
    descricao: 'Força o uso do tema padrão para todos os usuários',
    tipo: 'boolean',
    visivel: true,
    restrito: true,
    ordem: 3
  }
];

const seedConfiguracoes = async (prisma) => {
  console.log('🔧 Inserindo configurações padrão...');
  
  for (const config of configuracoesIniciais) {
    // Verifica se a configuração já existe
    const configExistente = await prisma.configuracao.findUnique({
      where: {
        chave: config.chave,
      },
    });
    
    if (!configExistente) {
      await prisma.configuracao.create({
        data: {
          ...config,
          atualizado_em: new Date(),
        },
      });
    }
  }
  
  console.log(`✅ ${configuracoesIniciais.length} configurações verificadas/inseridas!`);
};

module.exports = { seedConfiguracoes };
