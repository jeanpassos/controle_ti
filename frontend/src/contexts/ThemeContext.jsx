import React, { createContext } from 'react'

/**
 * Contexto para gerenciamento de temas da aplicação
 * Suporta alternância entre temas claro e escuro
 * 
 * @version 0.52.0
 */

// Implementação simplificada
const getThemeFromStorage = () => {
  try {
    return localStorage.getItem('theme') || 'light';
  } catch (e) {
    return 'light';
  }
};

// Valor inicial do tema
const currentTheme = getThemeFromStorage();

// Contexto com valores pré-definidos simples
export const ThemeContext = createContext({
  theme: currentTheme,
  toggleTheme: () => {
    try {
      const newTheme = currentTheme === 'light' ? 'dark' : 'light';
      document.documentElement.classList.remove('light', 'dark');
      document.documentElement.classList.add(newTheme);
      localStorage.setItem('theme', newTheme);
      window.location.reload(); // Força atualização para aplicar mudança
    } catch (e) {
      console.error('Erro ao alternar tema:', e);
    }
  },
  setThemeMode: (mode) => {
    try {
      if (mode === 'light' || mode === 'dark') {
        document.documentElement.classList.remove('light', 'dark');
        document.documentElement.classList.add(mode);
        localStorage.setItem('theme', mode);
        window.location.reload(); // Força atualização para aplicar mudança
      }
    } catch (e) {
      console.error('Erro ao definir tema:', e);
    }
  }
});

// Provider simplificado que apenas repassa os children
export const ThemeProvider = ({ children }) => {
  return (
    <ThemeContext.Provider value={ThemeContext._currentValue}>
      {children}
    </ThemeContext.Provider>
  );
};
