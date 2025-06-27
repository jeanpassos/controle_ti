-- Script para reestruturar o menu dinâmico conforme nova estrutura centralizada
-- Menu principal: Dashboard, Equipamentos, Relatórios, Documentos e Configurações
-- Submenus de Configurações: todas as páginas administrativas

-- 1. Primeiro, limpamos os itens do menu atual para evitar conflitos de chave
DELETE FROM menu_items;

-- 2. Criamos os itens do menu principal
INSERT INTO menu_items (id, titulo, descricao, icone, url, componente, ordem, ativo, externo, requer_auth, nivel_min, permissoes, pai_id, criado_em, atualizado_em)
VALUES
-- Menu principal
(1, 'Dashboard', 'Página inicial do sistema', 'dashboard', '/dashboard', 'Dashboard', 1, true, false, true, 4, NULL, NULL, NOW(), NOW()),
(2, 'Equipamentos', 'Gerenciamento de equipamentos', 'computer', '/equipamentos', 'Equipamentos', 2, true, false, true, 4, NULL, NULL, NOW(), NOW()),
(3, 'Relatórios', 'Relatórios gerenciais', 'bar_chart', '/relatorios', 'Relatorios', 3, true, false, true, 3, NULL, NULL, NOW(), NOW()),
(4, 'Documentos', 'Documentação e manuais', 'description', '/documentos', 'Documentos', 4, true, false, true, 4, NULL, NULL, NOW(), NOW()),
(5, 'Configurações', 'Configurações do sistema', 'settings', '/configuracoes', 'Configuracoes', 5, true, false, true, 1, NULL, NULL, NOW(), NOW());

-- 3. Criamos os submenus de Configurações
INSERT INTO menu_items (id, titulo, descricao, icone, url, componente, ordem, ativo, externo, requer_auth, nivel_min, permissoes, pai_id, criado_em, atualizado_em)
VALUES
-- Submenus de Configurações (pai_id = 5)
(6, 'Usuários', 'Gerenciamento de usuários', 'people', '/configuracoes/usuarios', 'ConfiguracoesUsuarios', 1, true, false, true, 1, NULL, 5, NOW(), NOW()),
(7, 'Níveis de Acesso', 'Configuração de níveis de acesso', 'security', '/configuracoes/niveis-acesso', 'ConfiguracoesNiveisAcesso', 2, true, false, true, 1, NULL, 5, NOW(), NOW()),
(8, 'Personalização', 'Personalização visual do sistema', 'palette', '/configuracoes/tema', 'ConfiguracoesTema', 3, true, false, true, 1, NULL, 5, NOW(), NOW()),
(9, 'Empresa', 'Configurações da empresa', 'business', '/configuracoes/empresa', 'ConfiguracoesEmpresa', 4, true, false, true, 1, NULL, 5, NOW(), NOW()),
(10, 'Fornecedores', 'Gerenciamento de fornecedores', 'store', '/configuracoes/fornecedores', 'ConfiguracoesFornecedores', 5, true, false, true, 1, NULL, 5, NOW(), NOW()),
(11, 'Status', 'Configuração de status de equipamentos', 'check_circle', '/configuracoes/status', 'ConfiguracoesStatus', 6, true, false, true, 1, NULL, 5, NOW(), NOW()),
(12, 'Categorias', 'Gerenciamento de categorias', 'category', '/configuracoes/categorias', 'ConfiguracoesCategorias', 7, true, false, true, 1, NULL, 5, NOW(), NOW()),
(13, 'Marcas', 'Gerenciamento de marcas', 'branding_watermark', '/configuracoes/marcas', 'ConfiguracoesMarcas', 8, true, false, true, 1, NULL, 5, NOW(), NOW()),
(14, 'Fabricantes', 'Gerenciamento de fabricantes', 'factory', '/configuracoes/fabricantes', 'ConfiguracoesFabricantes', 9, true, false, true, 1, NULL, 5, NOW(), NOW()),
(15, 'Cidades', 'Gerenciamento de cidades', 'location_city', '/configuracoes/cidades', 'ConfiguracoesCidades', 10, true, false, true, 1, NULL, 5, NOW(), NOW()),
(16, 'Estados', 'Gerenciamento de estados', 'explore', '/configuracoes/estados', 'ConfiguracoesEstados', 11, true, false, true, 1, NULL, 5, NOW(), NOW()),
(17, 'Setores', 'Gerenciamento de setores', 'domain', '/configuracoes/setores', 'ConfiguracoesSetores', 12, true, false, true, 1, NULL, 5, NOW(), NOW()),
(18, 'Parâmetros do Sistema', 'Configurações gerais do sistema', 'tune', '/configuracoes/sistema', 'ConfiguracoesSistema', 13, true, false, true, 1, NULL, 5, NOW(), NOW());
