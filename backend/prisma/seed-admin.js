/**
 * Script para executar apenas o seed do usuário administrador
 * Útil para criar o primeiro acesso ao sistema sem duplicar outros dados
 */

const { seedAdminUser } = require('./seed/admin-user');

async function main() {
  console.log('Iniciando seed do usuário administrador...');
  
  try {
    await seedAdminUser();
    console.log('Seed do usuário administrador concluído com sucesso!');
  } catch (error) {
    console.error('Erro ao executar seed do usuário administrador:', error);
    process.exit(1);
  }
}

main();
