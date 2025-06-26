import React, { createContext, useEffect, useState, useCallback } from 'react';
import temaService from '../services/temaService';
import { useAuth } from '../hooks/useAuth';

/**
 * Contexto para gerenciamento de temas da aplicação
 * Suporta temas personalizáveis com cores, fontes e outros atributos
 * Integra com o backend para obter temas disponíveis
 * 
 * @version 0.52.0
 */

// Obtém modo de tema e ID de tema do storage
const getThemeConfigFromStorage = () => {
  try {
    return {
      mode: localStorage.getItem('themeMode') || 'light',
      temaId: parseInt(localStorage.getItem('temaId')) || null,
      temaCustomizado: JSON.parse(localStorage.getItem('temaCustomizado')) || null
    };
  } catch (e) {
    console.error('Erro ao recuperar configurações de tema:', e);
    return { mode: 'light', temaId: null, temaCustomizado: null };
  }
};

// Cores padrão caso não consiga carregar do backend
const defaultTheme = {
  nome: 'Tema Padrão',
  cor_primaria: '#0284c7',      // Azul claro
  cor_secundaria: '#0d9488',    // Verde água
  cor_fundo_claro: '#f8fafc',   // Cinza muito claro
  cor_fundo_escuro: '#0f172a',  // Azul escuro
  cor_texto_claro: '#1e293b',   // Cinza escuro
  cor_texto_escuro: '#f1f5f9',  // Cinza claro
  fonte_principal: 'Inter'
};

// Cria o contexto
export const ThemeContext = createContext({});

/**
 * Provider para o contexto de tema
 */
export const ThemeProvider = ({ children }) => {
  const { isAuthenticated } = useAuth();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [temas, setTemas] = useState([]);
  const [temaAtual, setTemaAtual] = useState(null);
  const { mode: initialMode, temaId: initialTemaId, temaCustomizado } = getThemeConfigFromStorage();
  const [themeMode, setThemeMode] = useState(initialMode);
  
  // Define ou obtém o tema atual do sistema
  const carregarTemas = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Se não estiver autenticado, tenta buscar apenas o tema padrão público
      const response = isAuthenticated 
        ? await temaService.listar()
        : await temaService.obterTemaPadrao();
      
      if (isAuthenticated) {
        setTemas(response.data);
        
        // Se tiver um temaId salvo, procura ele na lista
        if (initialTemaId) {
          const temaSalvo = response.data.find(t => t.id === initialTemaId);
          if (temaSalvo) {
            setTemaAtual(temaSalvo);
            aplicarTema(temaSalvo, themeMode);
            return;
          }
        }
        
        // Caso contrário, usa o tema padrão da lista
        const temaPadrao = response.data.find(t => t.padrao) || response.data[0];
        if (temaPadrao) {
          setTemaAtual(temaPadrao);
          aplicarTema(temaPadrao, themeMode);
          localStorage.setItem('temaId', temaPadrao.id.toString());
        } else {
          // Fallback para tema default se não encontrou nenhum
          aplicarTema(defaultTheme, themeMode);
        }
      } else {
        // Não está autenticado, usa apenas o tema padrão
        const temaPadrao = response.data;
        setTemaAtual(temaPadrao);
        setTemas([temaPadrao]);
        aplicarTema(temaPadrao, themeMode);
        localStorage.setItem('temaId', temaPadrao.id.toString());
      }
    } catch (err) {
      console.error('Erro ao carregar temas:', err);
      setError('Não foi possível carregar os temas. Usando tema padrão.');
      // Fallback para o tema default
      aplicarTema(defaultTheme, themeMode);
      
      // Se tiver um tema customizado salvo, tenta usar ele
      if (temaCustomizado) {
        aplicarTema(temaCustomizado, themeMode);
      }
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated, initialTemaId, themeMode]);

  // Efeito para carregar temas ao inicializar ou quando autenticação mudar
  useEffect(() => {
    carregarTemas();
  }, [carregarTemas]);

  // Alterna entre temas claro e escuro
  const toggleTheme = useCallback(() => {
    const newMode = themeMode === 'light' ? 'dark' : 'light';
    setThemeMode(newMode);
    localStorage.setItem('themeMode', newMode);
    
    // Reaplica o tema atual com o novo modo
    if (temaAtual) {
      aplicarTema(temaAtual, newMode);
    }
  }, [themeMode, temaAtual]);

  // Mudar para um tema específico
  const mudarTema = useCallback((temaId) => {
    if (!temaId || !temas.length) return;
    
    const tema = temas.find(t => t.id === temaId);
    if (tema) {
      setTemaAtual(tema);
      aplicarTema(tema, themeMode);
      localStorage.setItem('temaId', temaId.toString());
    }
  }, [temas, themeMode]);

  // Definir tema personalizado (usado na página de personalização)
  const definirTemaPersonalizado = useCallback((tema) => {
    if (!tema) return;
    
    setTemaAtual(tema);
    aplicarTema(tema, themeMode);
    localStorage.setItem('temaCustomizado', JSON.stringify(tema));
  }, [themeMode]);

  // Função para aplicar o tema na página
  const aplicarTema = (tema, modo) => {
    if (!tema) return;

    // Remove todas as classes de tema
    document.documentElement.classList.remove('light', 'dark');
    // Adiciona a classe do modo atual
    document.documentElement.classList.add(modo);

    // Define as variáveis CSS para as cores do tema
    document.documentElement.style.setProperty('--cor-primaria', tema.cor_primaria);
    document.documentElement.style.setProperty('--cor-secundaria', tema.cor_secundaria);
    document.documentElement.style.setProperty('--cor-fundo-claro', tema.cor_fundo_claro);
    document.documentElement.style.setProperty('--cor-fundo-escuro', tema.cor_fundo_escuro);
    document.documentElement.style.setProperty('--cor-texto-claro', tema.cor_texto_claro);
    document.documentElement.style.setProperty('--cor-texto-escuro', tema.cor_texto_escuro);
    document.documentElement.style.setProperty('--fonte-principal', tema.fonte_principal || 'Inter');
    
    // Se existir CSS personalizado, aplica ele também
    if (tema.css_custom) {
      // Criar ou atualizar a tag de estilo
      let styleElement = document.getElementById('tema-customizado');
      if (!styleElement) {
        styleElement = document.createElement('style');
        styleElement.id = 'tema-customizado';
        document.head.appendChild(styleElement);
      }
      styleElement.textContent = tema.css_custom;
    } else {
      // Remove a tag de estilo personalizado se existir
      const styleElement = document.getElementById('tema-customizado');
      if (styleElement) {
        styleElement.remove();
      }
    }
    
    // Se tiver logo, atualiza o favicon
    if (tema.favicon_url) {
      const favicon = document.querySelector('link[rel="icon"]');
      if (favicon) {
        favicon.href = tema.favicon_url;
      }
    }
  };

  // Valor do contexto
  const contextValue = {
    themeMode,
    toggleTheme,
    setThemeMode: (mode) => {
      if (mode === 'light' || mode === 'dark') {
        setThemeMode(mode);
        localStorage.setItem('themeMode', mode);
        if (temaAtual) {
          aplicarTema(temaAtual, mode);
        }
      }
    },
    temas,
    temaAtual,
    mudarTema,
    carregarTemas,
    definirTemaPersonalizado,
    loading,
    error
  };

  return (
    <ThemeContext.Provider value={contextValue}>
      {children}
    </ThemeContext.Provider>
  );
};

// Hook personalizado para usar o contexto de tema
export const useTheme = () => {
  const context = React.useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme deve ser usado dentro de um ThemeProvider');
  }
  return context;
};
