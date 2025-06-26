import React, { createContext, useState, useEffect, useCallback } from 'react';
import menuService from '../services/menuService';
import { useAuth } from '../hooks/useAuth';

/**
 * Contexto para gerenciamento de menu dinâmico
 * Integra com o backend para obter os itens de menu disponíveis
 * com base no nível de acesso do usuário
 * 
 * @version 0.52.0
 */

// Cria o contexto
export const MenuContext = createContext({});

/**
 * Provider para o contexto de menu
 */
export const MenuProvider = ({ children }) => {
  const { isAuthenticated, isLoading, user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [itensMenu, setItensMenu] = useState([]);
  
  // Carrega os itens de menu do servidor
  const carregarMenu = useCallback(async () => {
    console.log('🍔 MenuContext - carregarMenu chamado:', {
      isLoading,
      isAuthenticated,
      usuario: user?.email,
      nivel_id: user?.nivel_id
    });
    
    // Aguarda o AuthContext terminar de carregar antes de fazer requisições
    if (isLoading || !isAuthenticated) {
      console.log('⏳ MenuContext - Aguardando autenticação ou ainda carregando');
      setItensMenu([]);
      setLoading(false);
      return;
    }

    try {
      console.log('🔄 MenuContext - Iniciando carregamento do menu');
      setLoading(true);
      setError(null);
      
      // Verifica se há token no localStorage
      const token = localStorage.getItem('@ControleTI:token');
      console.log('🔍 MenuContext - Token no localStorage:', token ? 'presente' : 'ausente');
      
      if (!token) {
        console.log('❌ MenuContext - Token não encontrado');
        setError('Token de autenticação não encontrado');
        return;
      }
      
      // Se tiver o nível do usuário, busca menu específico para o nível
      let response;
      if (user?.nivel_id) {
        console.log('📋 MenuContext - Buscando menu por nível:', user.nivel_id);
        response = await menuService.obterPorNivel(user.nivel_id);
      } else {
        console.log('📋 MenuContext - Buscando menu padrão');
        response = await menuService.listar();
      }
      
      // Organiza menu em hierarquia pai/filho
      const menuItems = response.data;
      const menusOrganizados = organizarMenuHierarquico(menuItems);
      setItensMenu(menusOrganizados);
      console.log('✅ MenuContext - Menu carregado com sucesso:', menusOrganizados.length, 'itens');
    } catch (err) {
      console.error('❌ MenuContext - Erro ao carregar itens de menu:', err);
      setError('Não foi possível carregar o menu. Usando configuração básica.');
      setItensMenu(getMenuBasico()); // Menu básico de fallback
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated, isLoading, user?.nivel_id]);

  // Efeto para carregar o menu quando autenticação ou nível do usuário mudar
  useEffect(() => {
    carregarMenu();
  }, [carregarMenu]);

  /**
   * Organiza os itens de menu em uma hierarquia
   * @param {Array} itens - Lista de itens de menu
   * @returns {Array} - Lista hierárquica de itens de menu
   */
  const organizarMenuHierarquico = (itens) => {
    // Primeiro, organiza por itens sem pai (raiz)
    const raiz = itens.filter(item => !item.pai_id);
    
    // Depois, para cada item raiz, adiciona os filhos
    const adicionarFilhos = (item) => {
      const filhos = itens.filter(filho => filho.pai_id === item.id)
        .sort((a, b) => a.ordem - b.ordem);
      
      // Adiciona filhos de forma recursiva
      if (filhos.length > 0) {
        return { 
          ...item, 
          filhos: filhos.map(filho => adicionarFilhos(filho)) 
        };
      }
      
      return { ...item, filhos: [] };
    };
    
    // Retorna a estrutura hierárquica ordenada
    return raiz
      .map(item => adicionarFilhos(item))
      .sort((a, b) => a.ordem - b.ordem);
  };
  
  /**
   * Menu básico de fallback para quando há erro ao obter menu do backend
   * @returns {Array} - Menu básico para fallback
   */
  const getMenuBasico = () => {
    return [
      {
        id: 1,
        titulo: 'Dashboard',
        icone: 'dashboard',
        url: '/dashboard',
        ordem: 1,
        filhos: []
      },
      {
        id: 2,
        titulo: 'Equipamentos',
        icone: 'computer',
        url: '/equipamentos',
        ordem: 2,
        filhos: []
      },
      {
        id: 3,
        titulo: 'Usuários',
        icone: 'people',
        url: '/usuarios',
        ordem: 3,
        filhos: []
      },
      {
        id: 4,
        titulo: 'Configurações',
        icone: 'settings',
        url: '/configuracoes',
        ordem: 4,
        filhos: []
      }
    ];
  };

  // Valor do contexto
  const contextValue = {
    itensMenu,
    carregarMenu,
    loading,
    error
  };

  return (
    <MenuContext.Provider value={contextValue}>
      {children}
    </MenuContext.Provider>
  );
};

// Hook personalizado para usar o contexto de menu
export const useMenu = () => {
  const context = React.useContext(MenuContext);
  if (context === undefined) {
    throw new Error('useMenu deve ser usado dentro de um MenuProvider');
  }
  return context;
};
