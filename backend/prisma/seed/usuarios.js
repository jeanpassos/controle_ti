/**
 * Seeds para usuários iniciais do sistema
 */
const bcrypt = require('bcryptjs');

// Usuário administrador padrão para primeiro acesso ao sistema
const usuariosIniciais = [
  {
    nome: 'Administrador',
    email: 'admin@sistema.com',
    senha: 'admin123', // Será criptografada antes de salvar
    cargo: 'Administrador do Sistema',
    departamentoId: null, // Será vinculado ao departamento TI se existir
    ativo: true,
    nivelAcesso: 'Administrador', // Nome do nível criado em niveis-acesso.js
    avatar: null
  }
];

async function seedUsuarios(prisma) {
  console.log('Criando usuários iniciais...');
  
  // Procura o departamento de TI para vincular ao administrador
  let deptoTI;
  try {
    deptoTI = await prisma.departamento.findFirst({
      where: { 
        nome: {
          contains: 'TI',
          mode: 'insensitive'
        }
      }
    });
  } catch (error) {
    console.log('Departamento TI não encontrado. O usuário admin será criado sem vínculo com departamento.');
  }

  // Verifica se existe pelo menos um departamento, caso não, cria o departamento TI
  if (!deptoTI) {
    try {
      deptoTI = await prisma.departamento.create({
        data: {
          nome: 'TI',
          descricao: 'Departamento de Tecnologia da Informação',
          ativo: true
        }
      });
      console.log('Departamento TI criado com sucesso!');
    } catch (error) {
      console.error('Erro ao criar departamento TI:', error);
    }
  }

  // Procura o nível de acesso Administrador
  for (const usuario of usuariosIniciais) {
    // Busca o nível de acesso pelo nome
    const nivelAcesso = await prisma.nivelAcesso.findUnique({
      where: { nome: usuario.nivelAcesso }
    });

    if (!nivelAcesso) {
      console.error(`Nível de acesso ${usuario.nivelAcesso} não encontrado. Usuário não será criado.`);
      continue;
    }

    // Verifica se o usuário já existe
    const usuarioExistente = await prisma.usuario.findUnique({
      where: { email: usuario.email.toLowerCase() }
    });

    // Criptografa a senha
    const senhaCriptografada = await bcrypt.hash(usuario.senha, 10);

    if (usuarioExistente) {
      // Atualiza o usuário existente
      await prisma.usuario.update({
        where: { id: usuarioExistente.id },
        data: {
          nome: usuario.nome,
          cargo: usuario.cargo,
          ativo: usuario.ativo,
          senha: senhaCriptografada,
          departamento: deptoTI ? {
            connect: { id: deptoTI.id }
          } : undefined,
          nivel: {
            connect: { id: nivelAcesso.id }
          },
          atualizado_em: new Date()
        }
      });
      console.log(`Usuário ${usuario.email} atualizado com sucesso!`);
    } else {
      // Cria o novo usuário
      await prisma.usuario.create({
        data: {
          nome: usuario.nome,
          email: usuario.email.toLowerCase(),
          senha: senhaCriptografada,
          cargo: usuario.cargo,
          ativo: usuario.ativo,
          departamento: deptoTI ? {
            connect: { id: deptoTI.id }
          } : undefined,
          nivel: {
            connect: { id: nivelAcesso.id }
          },
          avatar: usuario.avatar
        }
      });
      console.log(`Usuário ${usuario.email} criado com sucesso!`);
    }
  }

  console.log('Seed de usuários concluído!');
}

module.exports = { seedUsuarios };
