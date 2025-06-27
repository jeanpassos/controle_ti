# Changelog

Todas as alterações notáveis neste projeto serão documentadas neste arquivo.

O formato é baseado em [Keep a Changelog](https://keepachangelog.com/pt-BR/1.0.0/),
e este projeto adere ao [Versionamento Semântico](https://semver.org/lang/pt-BR/spec/v2.0.0.html).

## [Não publicado]

## [0.55.0] - 2025-06-27

### Adicionado
- Implementado suporte completo a submenus hierárquicos no menu lateral
- Desenvolvida exibição dinâmica de submenus administrativos 
- Criado comportamento de submenu flutuante para o modo recolhido
- Adicionada prevenção de navegação direta em itens com submenu
- Implementada abordagem de UI que prioriza exibição de submenu em itens com filhos

### Corrigido
- Resolvido problema crítico de clique no menu "Configurações" que navegava diretamente à página
- Solucionado problema de renderização incorreta dos submenus para itens com filhos
- Corrigida lógica de exibição condicional baseada em pai/filho no modo recolhido
- Implementada interceptação de eventos de clique para evitar navegação não-intencional
- Ajustada CSS para exibição correta de submenus flutuantes em modo recolhido

### Melhorado
- Refinada interação do usuário com menus multinível no sidebar
- Aprimorada experiência de submenu com posicionamento intuitivo
- Otimizada exibição de itens administrativos em estrutura hierárquica centralizada
- Reorganizados containers de submenu para melhor acessibilidade
- Implementado CSS responsivo para exibição consistente em diferentes estados do menu

### Investigado
- Analisado em profundidade o comportamento incorreto do menu "Configurações"
- Mapeada estrutura de dados do menu no backend e sua integração com o frontend
- Documentada relação entre MenuContext, Sidebar e renderização condicional
- Estudadas alternativas de implementação para navegação multinível
- Identificados desafios e limitações da estrutura atual do menu dinâmico

### Adicionado
- Estrutura inicial do projeto
- Especificação de tabelas e campos
- Rascunho inicial da API REST
- Planejamento da estrutura da UI

## [0.54.0] - 2025-06-26

### Adicionado
- Implementado menu recolhível com exibição apenas de ícones e animação suave
- Codificado novo componente Sidebar independente para gerenciar estado recolhido/expandido
- Adicionado ícone de usuário interativo na parte inferior da sidebar recolhida
- Integração do Material Icons via CDN para exibição correta dos ícones no menu
- Títulos de página dinâmicos no header principal do Layout (desacoplamento da UI)
- Implementado mecanismo de transformação de largura com Tailwind para animação suave
- Criado MenuContext para comunicação entre componentes Layout e Sidebar
- Adicionado serviço menuService.js para carregamento dinâmico dos itens de menu
- Integrado serviço temaService.js para personalização visual centralizada
- Criado postcss.config.js para garantir processamento correto do Tailwind CSS

### Corrigido
- Solucionado bug crítico de falta dos ícones do Material Icons no frontend
- Resolvido problema de ergonomia em telas pequenas causado pela sidebar fixa
- Corrigido comportamento inconsistente de amimacão da sidebar em estados alternados
- Solucionado problema de layout quebrado em resoluções muito pequenas (< 640px)
- Corrigida ausência de ícone de usuário no menu recolhido
- Consertado erro de CSS causando sobreposição de elementos no header
- Ajustado problema de posicionamento incorreto do botão de theme toggle
- Corrigido CSS ineficiente causando flickering durante transicão do tema

### Melhorado
- Substituição do texto "nightlight" por ícones visuais intuitivos de sol/lua
- Centralização da exibição do título das páginas no header principal
- UI significativamente mais consistente com exibição do nível de acesso do usuário na Sidebar
- Reduzido uso de espaço horizontal em telas menores com sistema de menu recolhível
- Aprimorada ergonomia de navegação com ícones de menu intuitivos e feedback visual
- Otimizada performance de renderização com memo e useCallback para componentes do menu
- Reestruturado fluxo de dados para evitar prop drilling entre Layout e componentes filhos
- Refinada experiência de usuário com transições suaves CSS durante mudanças de estado
- Reduzido overhead de CSS com classes tailwind mais eficientes
- Implementada acessibilidade ARIA para todos os elementos do menu e botões de ação

### Otimizado
- Reduzido tamanho do bundle com importações seletivas de Material Icons
- Implementado lazy loading para componentes de páginas menos acessadas
- Melhorada eficiência de renderização com uso estratégico de React.memo
- Cache optimizado para troca rápida entre estados do menu
- Removidas dependências desnecessárias no frontend
- Transicionado para uso de componentes funcionais e hooks em vez de classes

### Padronizado
- Estabelecido padrão consistente para exibição de títulos em todas as páginas
- Definida estrutura modular para novos componentes de interface
- Padronizado sistema de atalhos de teclado para navegação
- Unificada nomenclatura de variáveis CSS para maior mantenabilidade
- Estabelecido padrão para aria-labels em todos os elementos interativos

### Investigado
- Analisada causa-raiz da falta dos ícones Material no menu
- Investigados problemas de build do Vite afetando hot reload
- Pesquisadas melhores práticas de menu responsivo e recolhível
- Examinadas estratégias alternativas para gerenciamento de estado da sidebar

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
