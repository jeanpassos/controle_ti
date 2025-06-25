import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { useTheme } from '../../hooks/useTheme';
import { useAuth } from '../../hooks/useAuth';
import { Link } from 'react-router-dom';
import { FiMenu, FiX, FiLogOut, FiSettings, FiHome, FiMonitor, FiUsers, FiPrinter, FiServer, FiPieChart } from 'react-icons/fi';

/**
 * Componente de Layout principal da aplicação
 * Inclui sidebar, header e área de conteúdo
 * 
 * @version 0.52.0
 * @returns {JSX.Element}
 */
function Layout() {
  const { theme, toggleTheme } = useTheme();
  const { logout, user } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  
  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <div className="h-screen flex overflow-hidden bg-gray-100 dark:bg-gray-900">
      {/* Sidebar para navegação principal */}
      <div 
        className={`
          ${sidebarOpen ? 'w-64' : 'w-20'} 
          transition-all duration-300 ease-in-out
          bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700
          flex flex-col
        `}
      >
        {/* Logo e toggle do menu */}
        <div className="p-4 flex items-center justify-between border-b border-gray-200 dark:border-gray-700">
          {sidebarOpen ? (
            <Link to="/" className="text-xl font-bold text-primary-600">
              Controle TI
            </Link>
          ) : (
            <Link to="/" className="text-xl font-bold text-primary-600">
              CTI
            </Link>
          )}
          <button 
            onClick={toggleSidebar}
            className="p-2 rounded-md text-gray-500 hover:bg-gray-200 dark:hover:bg-gray-700"
          >
            {sidebarOpen ? <FiX size={20} /> : <FiMenu size={20} />}
          </button>
        </div>
        
        {/* Links de navegação */}
        <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
          <Link to="/" className="nav-link">
            <FiHome size={20} />
            {sidebarOpen && <span>Dashboard</span>}
          </Link>
          
          <Link to="/equipamentos" className="nav-link">
            <FiMonitor size={20} />
            {sidebarOpen && <span>Equipamentos</span>}
          </Link>
          
          <Link to="/usuarios" className="nav-link">
            <FiUsers size={20} />
            {sidebarOpen && <span>Usuários</span>}
          </Link>
          
          <Link to="/departamentos" className="nav-link">
            <FiServer size={20} />
            {sidebarOpen && <span>Departamentos</span>}
          </Link>
          
          <Link to="/relatorios" className="nav-link">
            <FiPieChart size={20} />
            {sidebarOpen && <span>Relatórios</span>}
          </Link>
          
          {/* Separador */}
          <div className="border-t border-gray-200 dark:border-gray-700 my-4"></div>
          
          <Link to="/config" className="nav-link">
            <FiSettings size={20} />
            {sidebarOpen && <span>Configurações</span>}
          </Link>
        </nav>
        
        {/* Footer com opções de usuário */}
        <div className="p-4 border-t border-gray-200 dark:border-gray-700">
          {sidebarOpen ? (
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-sm">{user?.nome || 'Usuário'}</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">{user?.email || 'admin@exemplo.com'}</p>
              </div>
              <button 
                onClick={logout}
                className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-500"
                title="Logout"
              >
                <FiLogOut size={18} />
              </button>
            </div>
          ) : (
            <div className="flex flex-col items-center space-y-4">
              <button 
                onClick={logout}
                className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-500"
                title="Logout"
              >
                <FiLogOut size={18} />
              </button>
            </div>
          )}
        </div>
      </div>
      
      {/* Área principal de conteúdo */}
      <div className="flex flex-col flex-1 overflow-hidden">
        {/* Header com opções de configuração */}
        <header className="bg-white dark:bg-gray-800 shadow-sm p-4 flex items-center justify-between">
          <h1 className="text-xl font-semibold text-gray-800 dark:text-white">
            Gestão de Equipamentos TI
          </h1>
          
          <div className="flex items-center space-x-4">
            <button 
              onClick={toggleTheme}
              className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-300"
              title={theme === 'dark' ? 'Modo Claro' : 'Modo Escuro'}
            >
              {theme === 'dark' ? '☀️' : '🌙'}
            </button>
            
            <div className="h-8 w-8 rounded-full bg-primary-600 flex items-center justify-center text-white">
              {user?.nome?.charAt(0) || 'U'}
            </div>
          </div>
        </header>
        
        {/* Conteúdo principal - renderizado via Outlet */}
        <main className="flex-1 overflow-auto bg-gray-100 dark:bg-gray-900">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

export default Layout;
