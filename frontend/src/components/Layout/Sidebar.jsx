import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useMenu } from '../../contexts/MenuContext';
import { useAuth } from '../../hooks/useAuth';
import LoadingSpinner from '../UI/LoadingSpinner';

/**
 * Componente de Sidebar com menu dinâmico
 * Exibe os itens de menu de acordo com o nível de acesso do usuário
 * Suporta modo expandido e recolhido (apenas ícones)
 * 
 * @version 0.52.0
 * @param {Object} props Propriedades do componente
 * @param {boolean} props.collapsed Define se o menu está recolhido (apenas ícones)
 * @param {Function} props.toggleSidebar Função para alternar estado do menu
 */
const Sidebar = ({ collapsed = false, toggleSidebar }) => {
  const { itensMenu, loading, error } = useMenu();
  const { usuario, logout } = useAuth();
  const location = useLocation();
  const [expandedItems, setExpandedItems] = useState({});

  // Expandir automaticamente o menu ativo com base na URL atual
  useEffect(() => {
    if (itensMenu.length > 0) {
      const expandedState = {};
      
      // Função recursiva para verificar itens de menu e seus filhos
      const verificarItemAtivo = (items) => {
        for (const item of items) {
          // Se o item tiver uma URL e ela for parte da URL atual, marque o pai como expandido
          if (item.url && location.pathname.startsWith(item.url)) {
            if (item.pai_id) {
              expandedState[item.pai_id] = true;
            }
          }
          
          // Verifica filhos recursivamente
          if (item.filhos && item.filhos.length > 0) {
            verificarItemAtivo(item.filhos);
          }
        }
      };
      
      verificarItemAtivo(itensMenu);
      setExpandedItems(expandedState);
    }
  }, [itensMenu, location.pathname]);

  // Alternar expansão de um item de menu
  const toggleExpand = (itemId) => {
    setExpandedItems(prev => ({
      ...prev,
      [itemId]: !prev[itemId]
    }));
  };

  // Renderiza um ícone baseado no nome ou usa um padrão
  const renderIcon = (iconName) => {
    if (!iconName) return <span className="material-icons text-lg">circle</span>;
    
    return <span className="material-icons text-lg">{iconName}</span>;
  };

  // Renderiza um item de menu e seus filhos recursivamente
  const renderMenuItem = (item) => {
    const isActive = location.pathname === item.url || location.pathname.startsWith(`${item.url}/`);
    const hasChildren = item.filhos && item.filhos.length > 0;
    const isExpanded = expandedItems[item.id];
    
    // No modo recolhido, só exibir itens raiz (sem pai) e sem filhos
    if (collapsed && (item.pai_id || hasChildren)) {
      return null;
    }
    
    return (
      <li key={item.id} className={`mb-1 ${collapsed ? 'flex justify-center' : ''}`}>
        {item.url && !hasChildren ? (
          // Item com URL e sem filhos (link direto)
          <Link
            to={item.url}
            className={`${collapsed ? 'p-2' : 'py-2 px-4'} flex items-center ${collapsed ? 'justify-center' : ''} rounded-lg transition-colors ${
              isActive 
                ? 'bg-primary-100 text-primary-800 dark:bg-primary-900 dark:text-primary-100 font-semibold' 
                : 'hover:bg-gray-100 dark:hover:bg-gray-800'
            }`}
            title={collapsed ? item.titulo : ''}
          >
            <span className={collapsed ? '' : 'mr-3'}>{renderIcon(item.icone)}</span>
            {!collapsed && <span>{item.titulo}</span>}
          </Link>
        ) : !collapsed && (
          // Item sem URL ou com filhos (dropdown) - não exibir no modo recolhido
          <>
            <button
              onClick={() => toggleExpand(item.id)}
              className={`flex items-center justify-between w-full py-2 px-4 rounded-lg transition-colors ${
                isActive 
                  ? 'bg-primary-50 text-primary-800 dark:bg-primary-900/50 dark:text-primary-100' 
                  : 'hover:bg-gray-100 dark:hover:bg-gray-800'
              }`}
            >
              <div className="flex items-center">
                <span className="mr-3">{renderIcon(item.icone)}</span>
                <span>{item.titulo}</span>
              </div>
              <span className="material-icons text-sm">
                {isExpanded ? 'expand_less' : 'expand_more'}
              </span>
            </button>
            
            {hasChildren && isExpanded && (
              <ul className="pl-4 mt-1 space-y-1 border-l border-gray-200 dark:border-gray-700 ml-5">
                {item.filhos.map(child => renderMenuItem(child))}
              </ul>
            )}
          </>
        )}
      </li>
    );
  };

  return (
    <aside className={`${collapsed ? 'w-20' : 'w-64'} h-full bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800 shadow-sm flex flex-col`}>
      {/* Header da sidebar */}
      <div className={`${collapsed ? 'py-4' : 'p-4'} border-b border-gray-200 dark:border-gray-800 flex items-center justify-center`}>
        {collapsed ? (
          <button 
            onClick={toggleSidebar} 
            className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
            title="Expandir menu"
          >
            <span className="material-icons">menu_open</span>
          </button>
        ) : (
          <h1 className="text-xl font-bold text-gray-800 dark:text-white">Controle TI</h1>
        )}
      </div>
      
      {/* Menu de navegação */}
      <nav className={`flex-1 overflow-y-auto ${collapsed ? 'py-4 px-2' : 'p-4'}`}>
        {loading ? (
          <div className="flex justify-center py-8">
            <LoadingSpinner />
          </div>
        ) : error ? (
          <div className="text-red-500 p-4 text-sm">
            {error}
          </div>
        ) : (
          <ul className="space-y-2">
            {itensMenu.map(item => renderMenuItem(item))}
          </ul>
        )}
      </nav>
      
      {/* Footer da sidebar com usuário e logout */}
      <div className={`${collapsed ? 'py-4 px-2' : 'p-4'} border-t border-gray-200 dark:border-gray-800 flex ${collapsed ? 'justify-center' : ''}`}>
        {collapsed ? (
          // Modo recolhido: apenas ícone do usuário 
          <div className="w-10 h-10 rounded-full bg-gray-300 dark:bg-gray-700 flex items-center justify-center" title={usuario?.nome || 'Usuário'}>
            <span className="text-lg font-semibold text-gray-700 dark:text-gray-300">
              {usuario?.nome?.substring(0, 1).toUpperCase() || 'U'}
            </span>
          </div>
        ) : (
          // Modo expandido: informações completas do usuário
          <div className="flex items-center mb-2 w-full">
            <div className="w-10 h-10 rounded-full bg-gray-300 dark:bg-gray-700 flex items-center justify-center mr-3">
              <span className="text-lg font-semibold text-gray-700 dark:text-gray-300">
                {usuario?.nome?.substring(0, 1).toUpperCase() || 'U'}
              </span>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-900 dark:text-white truncate max-w-[150px]">
                {usuario?.nome || 'Usuário'}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400 font-medium">
                {usuario?.nivel?.nome || 'Sem nível de acesso'}
              </p>
            </div>
          </div>
        )}
        
        <button
          onClick={logout}
          className="w-full flex items-center justify-center py-2 px-4 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/30 rounded-lg transition-colors"
        >
          <span className="material-icons text-sm mr-2">logout</span>
          <span>Sair</span>
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
