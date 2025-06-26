/**
 * Seed específico para criar apenas o usuário administrador inicial
 * Sem dependências de outros seeds para facilitar testes isolados
 */
const bcrypt = require('bcryptjs');
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function seedAdminUser() {
  console.log('Iniciando criação do usuário administrador...');
  
  try {
    // Verifica se o nível de acesso Administrador existe
    let nivelAdmin = await prisma.nivelAcesso.findUnique({
      where: { nome: 'Administrador' }
    });
    
    if (!nivelAdmin) {
      console.log('Nível de acesso Administrador não encontrado. Criando...');
      nivelAdmin = await prisma.nivelAcesso.create({
        data: {
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
          }
        }
      });
      console.log('Nível de acesso Administrador criado com sucesso!');
    }
    
    // Verifica se já existe um departamento TI
    let deptoTI = await prisma.departamento.findFirst({
      where: { 
        nome: 'TI'
      }
    });
    
    if (!deptoTI) {
      console.log('Departamento TI não encontrado. Criando...');
      deptoTI = await prisma.departamento.create({
        data: {
          nome: 'TI',
          descricao: 'Departamento de Tecnologia da Informação',
          ativo: true
        }
      });
      console.log('Departamento TI criado com sucesso!');
    }
    
    // Criptografa a senha
    const senha = 'admin123';
    const senhaCriptografada = await bcrypt.hash(senha, 10);
    
    // Verifica se o usuário admin já existe
    const adminExistente = await prisma.usuario.findUnique({
      where: { email: 'admin@sistema.com' }
    });
    
    if (adminExistente) {
      // Atualiza o usuário existente
      await prisma.usuario.update({
        where: { id: adminExistente.id },
        data: {
          nome: 'Administrador',
          senha: senhaCriptografada,
          ativo: true,
          departamento: {
            connect: { id: deptoTI.id }
          },
          nivel: {
            connect: { id: nivelAdmin.id }
          },
          atualizado_em: new Date()
        }
      });
      console.log('Usuário administrador atualizado com sucesso!');
    } else {
      // Cria o novo usuário administrador
      await prisma.usuario.create({
        data: {
          nome: 'Administrador',
          email: 'admin@sistema.com',
          senha: senhaCriptografada,
          ativo: true,
          departamento: {
            connect: { id: deptoTI.id }
          },
          nivel: {
            connect: { id: nivelAdmin.id }
          }
        }
      });
      console.log('Usuário administrador criado com sucesso!');
    }
    
    console.log('Credenciais de acesso:');
    console.log('Email: admin@sistema.com');
    console.log('Senha: admin123');
    
  } catch (error) {
    console.error('Erro ao criar usuário administrador:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

// Executa diretamente se chamado como script principal
if (require.main === module) {
  seedAdminUser()
    .catch(e => {
      console.error('Erro na execução do seed de admin:', e);
      process.exit(1);
    });
} else {
  // Exporta para uso em outros scripts
  module.exports = { seedAdminUser };
}
