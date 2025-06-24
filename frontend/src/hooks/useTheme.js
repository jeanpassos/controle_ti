import { useContext } from 'react'
import { ThemeContext } from '../contexts/ThemeContext'

/**
 * Hook personalizado para acessar o contexto de tema
 * @returns {Object} Objeto contendo o tema atual e funções para alterá-lo
 */
export const useTheme = () => {
  const context = useContext(ThemeContext)
  
  if (!context) {
    throw new Error('useTheme deve ser usado dentro de um ThemeProvider')
  }
  
  return context
}
