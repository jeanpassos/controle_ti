import { createContext, useState, useEffect } from 'react'

/**
 * Contexto para gerenciamento de temas da aplicação
 * Suporta alternância entre temas claro e escuro
 * 
 * @version 0.1.0-alpha
 */
export const ThemeContext = createContext()

export const ThemeProvider = ({ children }) => {
  // Estado para armazenar o tema atual
  const [theme, setTheme] = useState(() => {
    // Verificar se há preferência salva no localStorage
    const savedTheme = localStorage.getItem('theme')
    
    // Verificar preferência do sistema se não houver tema salvo
    if (!savedTheme) {
      return window.matchMedia('(prefers-color-scheme: dark)').matches 
        ? 'dark' 
        : (import.meta.env.VITE_DEFAULT_THEME || 'light')
    }
    
    return savedTheme
  })

  // Efeito para aplicar o tema ao documento
  useEffect(() => {
    // Remover ambas as classes para garantir consistência
    document.documentElement.classList.remove('light', 'dark')
    // Adicionar a classe do tema atual
    document.documentElement.classList.add(theme)
    // Salvar no localStorage
    localStorage.setItem('theme', theme)
  }, [theme])

  // Função para alternar entre os temas
  const toggleTheme = () => {
    setTheme(prevTheme => (prevTheme === 'light' ? 'dark' : 'light'))
  }

  // Função para definir um tema específico
  const setThemeMode = (mode) => {
    if (mode === 'light' || mode === 'dark') {
      setTheme(mode)
    }
  }

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme, setThemeMode }}>
      {children}
    </ThemeContext.Provider>
  )
}
