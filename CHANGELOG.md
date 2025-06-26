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

## [0.54.0] - 2025-06-26

### Adicionado
- Implementado menu recolhível com exibição apenas de ícones e animação suave
- Adicionado ícone de usuário na parte inferior da sidebar recolhida
- Integração do Material Icons via CDN para exibição dos ícones no menu
- Títulos de página dinâmicos no header principal do Layout

### Melhorado
- Substituição do botão de tema por ícones visuais de sol/lua
- Centralização da exibição do título das páginas no header
- UI mais consistente com exibição do nível de acesso do usuário na Sidebar
- Reduzido uso de espaço horizontal em telas menores com menu recolhível
- Melhorada ergonomia de navegação com ícones de menu intuitivos

## [0.53.0] - 2025-06-25

### Corrigido
- Correções críticas no ThemeProvider para garantir funcionamento estável
- Adicionado import explícito do React no App.jsx
- Resolvidos problemas com favicon.svg faltante
- Corrigidos erros 504 (Outdated Optimize Dep) no carregamento de dependências
- Implementada solução robusta para gerenciamento de tema claro/escuro
- Padronizados os nomes das chaves de tokens no localStorage

### Melhorado
- Processo de desenvolvimento com limpeza de cache do Vite para evitar erros de bundle
- Reorganizado fluxo de renderização para evitar dependências circulares

### Validado
- Frontend carregando corretamente com página de login funcional
- Sistema completo de autenticação JWT integrado entre frontend e backend
- Integração das tabelas de apoio como TipoEquipamento

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
