import { useContext } from 'react';
import { AuthContext } from '../contexts/AuthContext';

/**
 * Hook personalizado para acessar o contexto de autenticação
 * Facilita o acesso aos valores e métodos do AuthContext
 * 
 * @version 0.52.0
 * @returns {Object} Valores e métodos do contexto de autenticação
 */
export function useAuth() {
  const context = useContext(AuthContext);
  
  if (!context) {
    throw new Error('useAuth deve ser usado dentro de um AuthProvider');
  }
  
  return context;
}
