/**
 * Seeds para temas
 */

const temas = [
  {
    nome: 'Tema Claro Padrão',
    descricao: 'Tema claro padrão do sistema',
    cor_primaria: '#0284c7',     // Azul claro
    cor_secundaria: '#0d9488',   // Verde água
    cor_fundo_claro: '#f8fafc',  // Cinza muito claro
    cor_fundo_escuro: '#0f172a', // Azul escuro
    cor_texto_claro: '#1e293b',  // Cinza escuro
    cor_texto_escuro: '#f1f5f9', // Cinza claro
    fonte_principal: 'Inter',
    padrao: true,
    personalizado: false,
    ativo: true,
  },
  {
    nome: 'Tema Escuro Padrão',
    descricao: 'Tema escuro padrão do sistema',
    cor_primaria: '#38bdf8',     // Azul claro
    cor_secundaria: '#2dd4bf',   // Verde água claro
    cor_fundo_claro: '#f8fafc',  // Cinza muito claro
    cor_fundo_escuro: '#0f172a', // Azul escuro
    cor_texto_claro: '#1e293b',  // Cinza escuro
    cor_texto_escuro: '#f1f5f9', // Cinza claro
    fonte_principal: 'Inter',
    padrao: false,
    personalizado: false,
    ativo: true,
  },
  {
    nome: 'Tema Verde',
    descricao: 'Tema verde inspirado no WhatsApp',
    cor_primaria: '#10b981',     // Verde médio
    cor_secundaria: '#059669',   // Verde escuro
    cor_fundo_claro: '#f8fafc',  // Cinza muito claro
    cor_fundo_escuro: '#134e4a', // Verde escuro
    cor_texto_claro: '#1e293b',  // Cinza escuro
    cor_texto_escuro: '#f1f5f9', // Cinza claro
    fonte_principal: 'Inter',
    padrao: false,
    personalizado: false,
    ativo: true,
  }
];

async function seedTemas(prisma) {
  console.log('Criando temas padrão...');
  
  for (const tema of temas) {
    await prisma.tema.upsert({
      where: { nome: tema.nome },
      update: {
        descricao: tema.descricao,
        cor_primaria: tema.cor_primaria,
        cor_secundaria: tema.cor_secundaria,
        cor_fundo_claro: tema.cor_fundo_claro,
        cor_fundo_escuro: tema.cor_fundo_escuro,
        cor_texto_claro: tema.cor_texto_claro,
        cor_texto_escuro: tema.cor_texto_escuro,
        fonte_principal: tema.fonte_principal,
        padrao: tema.padrao,
        personalizado: tema.personalizado,
        ativo: tema.ativo,
      },
      create: {
        nome: tema.nome,
        descricao: tema.descricao,
        cor_primaria: tema.cor_primaria,
        cor_secundaria: tema.cor_secundaria,
        cor_fundo_claro: tema.cor_fundo_claro,
        cor_fundo_escuro: tema.cor_fundo_escuro,
        cor_texto_claro: tema.cor_texto_claro,
        cor_texto_escuro: tema.cor_texto_escuro,
        fonte_principal: tema.fonte_principal,
        padrao: tema.padrao,
        personalizado: tema.personalizado,
        ativo: tema.ativo,
      },
    });
  }
  
  console.log('Temas padrão criados com sucesso!');
}

module.exports = { seedTemas };
