# Gestão de Equipamentos TI

*Versão: 0.54.0* | *Última atualização: 2025-06-26*

Sistema de gerenciamento completo para inventário, movimentação e controle de equipamentos de TI empresariais.

## Visão Geral

Esta aplicação web foi projetada para ser uma solução abrangente para empresas que precisam gerenciar seus ativos de TI. O sistema permite rastrear equipamentos completos (notebooks, desktops, servidores, etc.), gerenciar sua localização, status, manutenções e movimentações entre departamentos.

## Versão Atual

![Versão](https://img.shields.io/badge/Versão-0.54.0-blue)

**Estado**: Em desenvolvimento

## Funcionalidades Principais

- Cadastro completo de equipamentos com informações detalhadas
- Dashboard interativo com KPIs e estatísticas em tempo real
- Gerenciamento de movimentação e histórico de equipamentos
- Relatórios customizáveis em múltiplos formatos (CSV, PDF)
- Gestão de usuários com diferentes níveis de acesso
- Auditoria completa de todas as operações
- Configuração personalizada do sistema
- Interface responsiva com temas claro/escuro

## Requisitos Técnicos

### Front-end

- Node.js 18+
- React 18+
- Tailwind CSS
- Porta: 5020

### Back-end

- Node.js 18+
- Express
- ORM: Prisma
- Porta: 4020

### Banco de Dados

- MariaDB 10.5+

## Arquitetura

O sistema é construído em uma arquitetura modular de 3 camadas:

1. **Frontend**: Aplicação React com Tailwind CSS
2. **Backend**: API RESTful em Node.js/Express
3. **Banco de Dados**: MariaDB

A comunicação entre o frontend e backend é feita via API REST com autenticação JWT.

### Princípios de Modularidade

O sistema foi projetado com um alto grau de modularidade para facilitar a manutenção e evolução:

- **Componentes Isolados**: Cada componente possui responsabilidade única e interfaces bem definidas
- **Desacoplamento**: Baixo acoplamento entre módulos para permitir substituição e evolução independente
- **Estrutura de Pastas Clara**: Organização lógica para facilitar navegação e desenvolvimento
- **Injeção de Dependências**: Gerenciamento centralizado de dependências para facilitar testes e substituição de implementações
- **Separação de Preocupações**: Backend com camadas claras (controllers, services, repositories)
- **Extensibilidade**: Arquitetura preparada para adição de novos recursos sem impactar os existentes

Esta abordagem modular traz benefícios significativos:

- Manutenção simplificada e focada
- Escalabilidade horizontal e vertical facilitada
- Testabilidade aprimorada com componentes isolados
- Possibilidade de substituição ou modernização de partes específicas sem afetar todo o sistema
- Colaboração em equipe mais eficiente, com desenvolvedores trabalhando em módulos diferentes simultaneamente

## Instalação

### Pré-requisitos

- Node.js 18+
- npm 8+ ou yarn 1.22+
- MariaDB 10.5+

### Backend

```bash
cd backend
npm install
cp .env.example .env
# Edite o arquivo .env com suas configurações
npm run migrate
npm run seed
npm run dev
```

### Frontend

```bash
cd frontend
npm install
cp .env.example .env
# Edite o arquivo .env com suas configurações
npm run dev
```

## Configuração

As configurações do sistema são mantidas em arquivos `.env` nas pastas do backend e frontend. Nunca compartilhe estes arquivos ou faça commit deles em repositórios públicos.

### Variáveis de Ambiente do Backend

```
# Servidor
PORT=4020
NODE_ENV=development

# Banco de Dados
DATABASE_URL=mysql://root:Imp3r@tr1z@192.168.1.65:3306/controle_ti

# JWT
JWT_SECRET=sua_chave_secreta_aqui
JWT_EXPIRES_IN=1h
REFRESH_TOKEN_EXPIRES_IN=7d

# Logs
LOG_LEVEL=info
```

### Variáveis de Ambiente do Frontend

```
VITE_API_URL=http://localhost:4020/api
VITE_APP_NAME=Gestão de Equipamentos TI
```

## Estrutura de Diretórios

```
controle_ti/
├── backend/
│   ├── src/
│   │   ├── controllers/
│   │   ├── middlewares/
│   │   ├── models/
│   │   ├── routes/
│   │   ├── services/
│   │   ├── utils/
│   │   └── app.js
│   ├── prisma/
│   │   ├── schema.prisma
│   │   ├── migrations/
│   │   └── seed.js
│   ├── tests/
│   ├── .env.example
│   └── package.json
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   ├── contexts/
│   │   ├── hooks/
│   │   ├── pages/
│   │   ├── services/
│   │   ├── styles/
│   │   ├── utils/
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── .env.example
│   └── package.json
├── docs/
│   ├── arquitetura.md
│   ├── api.md
│   └── er-diagram.md
├── CHANGELOG.md
└── README.md
```

## Autenticação

O sistema utiliza autenticação baseada em tokens JWT com refresh tokens. As senhas são armazenadas usando hashing seguro.

## Relatórios de Bugs

Por favor, relate bugs e problemas no [sistema de issues](https://github.com/jeanpassos/controle_ti/issues) do GitHub.

## Contribuição

1. Faça um fork do projeto
2. Crie sua branch de feature (`git checkout -b feature/amazing-feature`)
3. Commit suas mudanças (`git commit -m 'Add some amazing feature'`)
4. Push para a branch (`git push origin feature/amazing-feature`)
5. Abra um Pull Request

## Licença

Este projeto é licenciado sob a licença MIT - veja o arquivo LICENSE para detalhes.

## Contato

Jean Passos - [GitHub](https://github.com/jeanpassos)

## Agradecimentos

- Equipe de desenvolvimento
- Stakeholders envolvidos
- Comunidade open-source
