import React, { useState, useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { useTheme } from '../../contexts/ThemeContext';
import { useAuth } from '../../hooks/useAuth';
import { Link } from 'react-router-dom';
import Sidebar from './Sidebar';
import { FiMenu, FiX } from 'react-icons/fi';
import { FiSun, FiMoon } from 'react-icons/fi';

/**
 * Componente de Layout principal da aplicação
 * Inclui sidebar, header e área de conteúdo
 * 
 * @version 0.52.0
 * @returns {JSX.Element}
 */
function Layout() {
  const { themeMode, toggleTheme } = useTheme();
  const { logout, usuario } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const location = useLocation();
  const [pageTitle, setPageTitle] = useState('Dashboard');
  
  // Atualiza o título da página baseado na rota atual
  useEffect(() => {
    // Mapeamento de rotas para títulos
    const routeTitles = {
      '/': 'Dashboard',
      '/dashboard': 'Dashboard',
      '/equipamentos': 'Equipamentos',
      '/tipos': 'Tipos de Equipamento',
      '/departamentos': 'Departamentos',
      '/usuarios': 'Usuários',
      '/relatorios': 'Relatórios',
      '/configuracoes': 'Configurações'
    };
    
    // Tenta encontrar o título exato primeiro
    let title = routeTitles[location.pathname];
    
    // Se não encontrou título exato, tenta encontrar por prefixo
    if (!title) {
      const matchingRoute = Object.keys(routeTitles).find(route => 
        location.pathname.startsWith(route) && route !== '/'
      );
      if (matchingRoute) {
        title = routeTitles[matchingRoute];
      }
    }
    
    // Atualiza o título (usa Dashboard como fallback)
    setPageTitle(title || 'Dashboard');
  }, [location]);
  
  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <div className="h-screen flex overflow-hidden bg-gray-100 dark:bg-gray-900">
      {/* Sidebar com menu dinâmico - passa o estado collapsed para o componente */}
      <div className={`${sidebarOpen ? 'w-64' : 'w-20'} transition-all duration-300 ease-in-out bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-700 flex-shrink-0`}>
        <Sidebar collapsed={!sidebarOpen} toggleSidebar={toggleSidebar} />
      </div>
      
      {/* Área principal de conteúdo */}
      <div className="flex flex-col flex-1 overflow-hidden">
        {/* Header com opções de configuração */}
        <header className="bg-white dark:bg-gray-800 shadow-sm p-4 flex items-center justify-between">
          <div className="flex items-center">
            {sidebarOpen && (
              <button 
                onClick={toggleSidebar}
                className="p-2 mr-2 rounded-md text-gray-500 hover:bg-gray-200 dark:hover:bg-gray-700"
                title="Recolher menu"
              >
                <FiX size={20} />
              </button>
            )}
            <h1 className="text-xl font-semibold text-gray-800 dark:text-white">
              {pageTitle}
            </h1>
          </div>
          
          <div className="flex items-center space-x-4">
            {/* Botão de tema atualizado */}
            <button 
              onClick={toggleTheme}
              className="p-2 rounded-full bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-600 dark:text-gray-300 transition-all duration-300 ease-in-out shadow-sm"
              title={themeMode === 'dark' ? 'Mudar para Modo Claro' : 'Mudar para Modo Escuro'}
              aria-label="Alternar tema"
            >
              {themeMode === 'dark' ? (
                <FiSun className="text-amber-500 text-xl" aria-label="Sol - Modo Claro" size={22} />
              ) : (
                <FiMoon className="text-blue-500 text-xl" aria-label="Lua - Modo Escuro" size={22} />
              )}
            </button>
            
            <div className="h-8 w-8 rounded-full bg-primary-600 flex items-center justify-center text-white">
              {usuario?.nome?.charAt(0) || 'U'}
            </div>
          </div>
        </header>
        
        {/* Conteúdo principal - renderizado via Outlet */}
        <main className="flex-1 overflow-auto p-6 bg-gray-100 dark:bg-gray-900">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

export default Layout;
