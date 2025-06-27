/**
 * Script para atualizar o nível de acesso de um usuário existente
 * Uso: node scripts/atualizar-usuario.js email@exemplo.com
 */

const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function atualizarNivelUsuario() {
  try {
    // Pega o email do parâmetro da linha de comando
    const email = process.argv[2];
    
    if (!email) {
      console.error('❌ Email do usuário não fornecido.');
      console.log('Uso: node scripts/atualizar-usuario.js email@exemplo.com');
      process.exit(1);
    }

    // Verifica se o usuário existe
    const usuario = await prisma.usuario.findUnique({
      where: { email },
      include: { nivel: true }
    });

    if (!usuario) {
      console.error(`❌ Usuário com email ${email} não encontrado.`);
      process.exit(1);
    }

    console.log(`✅ Usuário encontrado: ${usuario.nome} (${usuario.email})`);
    console.log(`   Nível atual: ${usuario.nivel?.nome || 'Sem nível'}`);

    // Busca o nível Administrador
    const nivelAdmin = await prisma.nivelAcesso.findFirst({
      where: { nome: 'Administrador' }
    });

    if (!nivelAdmin) {
      console.error('❌ Nível Administrador não encontrado no banco de dados.');
      process.exit(1);
    }

    // Atualiza o nível do usuário
    await prisma.usuario.update({
      where: { id: usuario.id },
      data: {
        nivel: {
          connect: { id: nivelAdmin.id }
        }
      }
    });

    console.log(`✅ Usuário ${usuario.nome} atualizado para nível Administrador com sucesso!`);
    console.log('   Por favor reinicie o frontend e faça login novamente.');

  } catch (error) {
    console.error('❌ Erro ao atualizar usuário:', error);
  } finally {
    await prisma.$disconnect();
  }
}

atualizarNivelUsuario();
