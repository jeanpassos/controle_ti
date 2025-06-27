import { useContext } from 'react';
import { AuthContext } from '../contexts/AuthContext';

// Mapeamento de ID de nível para nome de nível
// Alinhado com a estrutura do banco de dados
const NIVEIS_ACESSO = {
  1: 'Administrador', // Maior privilégio
  2: 'Gerente',
  3: 'Técnico',
  4: 'Usuário',      // Menor privilégio
  5: 'Convidado'
};

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
  
  // Fornece um alias 'usuario' para o campo 'user' para manter compatibilidade com componentes existentes
  // Adiciona um objeto 'nivel' com 'nome' baseado no nivel_id para compatibilidade
  const user = context.user || {};
  const nivelNome = user?.nivel_id ? NIVEIS_ACESSO[user.nivel_id] || 'Sem nível' : 'Sem nível';
  
  return {
    ...context,
    usuario: {
      ...user,
      // Adiciona um objeto nivel com nome para compatibilidade com os componentes
      nivel: { nome: nivelNome }
    }
  };
}
