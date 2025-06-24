# Changelog

Todas as alterações notáveis neste projeto serão documentadas neste arquivo.

O formato é baseado em [Keep a Changelog](https://keepachangelog.com/pt-BR/1.0.0/),
e este projeto adere ao [Versionamento Semântico](https://semver.org/lang/pt-BR/spec/v2.0.0.html).

## [Não publicado]

### Adicionado
- Estrutura inicial do projeto
- Especificação de tabelas e campos
- Rascunho inicial da API REST
- Planejamento da estrutura da UI

## [0.52.0] - 2025-06-24

### Adicionado
- Modelo completo do banco de dados com Prisma Schema
- Arquivos de configuração do servidor Express (app.js, server.js)
- Sistema de tratamento de erros do backend
- Sistema de logging com winston
- Rota de autenticação inicial
- Frontend com React e Tailwind CSS
- Sistema de troca de tema claro/escuro
- Contexto de autenticação com JWT
- Estrutura de rotas e componentes de UI
- Arquitetura modular para facilitar manutenção e evolução

### Modificado
- Atualização do README com detalhes sobre arquitetura modular
- Versão atualizada de 0.1.0-alpha para 0.52.0

## [0.1.0-alpha] - 2025-06-24

### Adicionado

- Estrutura inicial do projeto
- README.md com documentação completa
- Definição da arquitetura de sistema
- Especificação das tabelas e campos do banco de dados
- Definição das rotas da API REST
- Esboço da árvore de componentes da UI

### Próximas Etapas Planejadas

- Configurar ambiente de desenvolvimento backend e frontend
- Implementar conexão com banco de dados MariaDB
- Criar modelos e migrações usando Prisma ORM
- Desenvolver sistema de autenticação JWT
- Implementar CRUD básico para tabelas de apoio
