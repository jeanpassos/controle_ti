const { PrismaClient } = require('@prisma/client');
const { seedNiveisAcesso } = require('./seed/niveis-acesso');
const { seedMenuItems } = require('./seed/menu-items');
const { seedTemas } = require('./seed/temas');
const { seedUsuarios } = require('./seed/usuarios');
const { seedConfiguracoes } = require('./seed/configuracoes');

const prisma = new PrismaClient();

async function main() {
  console.log('Iniciando seeds do banco de dados...');
  
  try {
    // Níveis de acesso - devem ser os primeiros pois outros seeds dependem deles
    await seedNiveisAcesso(prisma);
    
    // Menu dinâmico
    await seedMenuItems(prisma);
    
    // Temas
    await seedTemas(prisma);
    
    // Configurações do sistema
    await seedConfiguracoes(prisma);
    
    // Usuários iniciais
    await seedUsuarios(prisma);
    
    console.log('Seeds aplicados com sucesso!');
  } catch (error) {
    console.error('Erro ao aplicar seeds:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

main();
