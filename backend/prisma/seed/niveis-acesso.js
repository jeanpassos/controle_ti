/**
 * Seeds para níveis de acesso
 */

const niveisAcesso = [
  {
    nome: 'Administrador',
    descricao: 'Acesso total ao sistema',
    permissoes: {
      usuarios: { criar: true, ler: true, atualizar: true, excluir: true },
      equipamentos: { criar: true, ler: true, atualizar: true, excluir: true },
      departamentos: { criar: true, ler: true, atualizar: true, excluir: true },
      empresas: { criar: true, ler: true, atualizar: true, excluir: true },
      localizacoes: { criar: true, ler: true, atualizar: true, excluir: true },
      configuracoes: { ler: true, atualizar: true },
      temas: { criar: true, ler: true, atualizar: true, excluir: true },
      menu: { criar: true, ler: true, atualizar: true, excluir: true },
      relatorios: { gerar: true, exportar: true },
      auditoria: { ler: true },
    },
  },
  {
    nome: 'Gerente',
    descricao: 'Gerenciamento de departamentos e usuários',
    permissoes: {
      usuarios: { criar: true, ler: true, atualizar: true, excluir: false },
      equipamentos: { criar: true, ler: true, atualizar: true, excluir: false },
      departamentos: { criar: false, ler: true, atualizar: true, excluir: false },
      empresas: { criar: false, ler: true, atualizar: false, excluir: false },
      localizacoes: { criar: true, ler: true, atualizar: true, excluir: false },
      configuracoes: { ler: true, atualizar: false },
      temas: { criar: false, ler: true, atualizar: false, excluir: false },
      menu: { criar: false, ler: true, atualizar: false, excluir: false },
      relatorios: { gerar: true, exportar: true },
      auditoria: { ler: true },
    },
  },
  {
    nome: 'Técnico',
    descricao: 'Operações em equipamentos e movimentações',
    permissoes: {
      usuarios: { criar: false, ler: true, atualizar: false, excluir: false },
      equipamentos: { criar: true, ler: true, atualizar: true, excluir: false },
      departamentos: { criar: false, ler: true, atualizar: false, excluir: false },
      empresas: { criar: false, ler: true, atualizar: false, excluir: false },
      localizacoes: { criar: false, ler: true, atualizar: false, excluir: false },
      configuracoes: { ler: true, atualizar: false },
      temas: { criar: false, ler: true, atualizar: false, excluir: false },
      menu: { criar: false, ler: true, atualizar: false, excluir: false },
      relatorios: { gerar: true, exportar: false },
      auditoria: { ler: false },
    },
  },
  {
    nome: 'Usuário',
    descricao: 'Visualização básica e solicitações',
    permissoes: {
      usuarios: { criar: false, ler: false, atualizar: false, excluir: false },
      equipamentos: { criar: false, ler: true, atualizar: false, excluir: false },
      departamentos: { criar: false, ler: true, atualizar: false, excluir: false },
      empresas: { criar: false, ler: true, atualizar: false, excluir: false },
      localizacoes: { criar: false, ler: true, atualizar: false, excluir: false },
      configuracoes: { ler: false, atualizar: false },
      temas: { criar: false, ler: true, atualizar: false, excluir: false },
      menu: { criar: false, ler: true, atualizar: false, excluir: false },
      relatorios: { gerar: false, exportar: false },
      auditoria: { ler: false },
    },
  },
];

async function seedNiveisAcesso(prisma) {
  console.log('Criando níveis de acesso...');
  
  for (const nivel of niveisAcesso) {
    await prisma.nivelAcesso.upsert({
      where: { nome: nivel.nome },
      update: {
        descricao: nivel.descricao,
        permissoes: nivel.permissoes,
      },
      create: {
        nome: nivel.nome,
        descricao: nivel.descricao,
        permissoes: nivel.permissoes,
      },
    });
  }
  
  console.log('Níveis de acesso criados com sucesso!');
}

module.exports = { seedNiveisAcesso };
