import React, { createContext, useState, useEffect } from 'react';
import authService from '../services/authService';
import api from '../services/api';
import { toast } from 'react-toastify';
import { jwtDecode } from 'jwt-decode';

/**
 * Contexto de autenticação
 * Gerencia estado de autenticação do usuário
 * 
 * @version 0.52.0
 */
export const AuthContext = createContext({});

/**
 * Provider do contexto de autenticação
 * @param {Object} props
 * @returns {JSX.Element}
 */
export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Efeito para recuperar estado de autenticação ao iniciar a aplicação
  useEffect(() => {
    const initAuth = async () => {
      try {
        console.log('🔄 AuthContext - Iniciando inicialização da autenticação');
        setIsLoading(true);
        
        // Verifica se há um usuário armazenado
        const storedUser = authService.getCurrentUser();
        console.log('👤 AuthContext - Usuário armazenado:', storedUser ? storedUser.email : 'nenhum');
        
        if (storedUser) {
          // Primeiro tenta renovar o token se existir um refresh token
          const refreshToken = localStorage.getItem('@ControleTI:refreshToken');
          const accessToken = localStorage.getItem('@ControleTI:token');
          console.log('🔑 AuthContext - Tokens encontrados:', {
            accessToken: accessToken ? 'presente' : 'ausente',
            refreshToken: refreshToken ? 'presente' : 'ausente'
          });
          
          if (refreshToken) {
            console.log('🔄 AuthContext - Tentando renovar token...');
            const refreshSuccess = await authService.refreshToken();
            console.log('🔄 AuthContext - Resultado do refresh:', refreshSuccess ? 'sucesso' : 'falha');
            
            if (refreshSuccess) {
              // Token renovado com sucesso, usuário continua autenticado
              setUser(storedUser);
              setIsAuthenticated(true);
              console.log('✅ AuthContext - Usuário autenticado via refresh token');
            } else {
              // Falha no refresh, limpa a sessão
              console.log('❌ AuthContext - Falha no refresh, limpando sessão');
              authService.clearSession();
            }
          } else {
            console.log('🔍 AuthContext - Sem refresh token, validando access token...');
            // Sem refresh token, verifica se o access token ainda é válido
            const isValid = await authService.validateToken();
            console.log('🔍 AuthContext - Resultado da validação:', isValid ? 'válido' : 'inválido');
            
            if (isValid) {
              setUser(storedUser);
              setIsAuthenticated(true);
              console.log('✅ AuthContext - Usuário autenticado via access token válido');
            } else {
              // Token inválido e sem refresh token
              console.log('❌ AuthContext - Token inválido e sem refresh token, limpando sessão');
              authService.clearSession();
            }
          }
        } else {
          console.log('👤 AuthContext - Nenhum usuário armazenado');
        }
      } catch (error) {
        console.error('❌ AuthContext - Erro ao inicializar autenticação:', error);
        authService.clearSession();
      } finally {
        setIsLoading(false);
        console.log('🏁 AuthContext - Inicialização finalizada');
      }
    };
    
    initAuth();
  }, []);
  
  /**
   * Tenta renovar o access token usando o refresh token
   */
  const refreshAccessToken = async () => {
    try {
      return await authService.refreshToken();
    } catch (error) {
      console.error('Falha ao renovar token:', error);
      logout();
      return false;
    }
  }
  
  /**
   * Realiza login do usuário
   */
  const login = async (email, senha) => {
    try {
      setIsLoading(true);
      setError(null);
      
      const result = await authService.login(email, senha);
      
      if (result.success) {
        setUser(result.user);
        setIsAuthenticated(true);
      }
      
      return result;
    } catch (error) {
      console.error('Erro ao fazer login:', error);
      const errorMessage = error.response?.data?.message || 'Erro ao fazer login';
      setError(errorMessage);
      return { error: errorMessage };
    } finally {
      setIsLoading(false);
    }
  }
  
  /**
   * Valida código 2FA
   */
  const validate2FA = async (email, code) => {
    try {
      setIsLoading(true);
      setError(null);
      
      const result = await authService.validate2FA(email, code);
      
      if (result.success) {
        setUser(result.user);
        setIsAuthenticated(true);
      }
      
      return result;
    } catch (error) {
      console.error('Erro ao validar 2FA:', error);
      const errorMessage = error.response?.data?.message || 'Código inválido';
      setError(errorMessage);
      return { error: errorMessage };
    } finally {
      setIsLoading(false);
    }
  }
  
  /**
   * Realiza logout do usuário
   */
  const logout = async () => {
    try {
      await authService.logout();
    } catch (error) {
      console.error('Erro ao fazer logout:', error);
    } finally {
      setUser(null);
      setIsAuthenticated(false);
    }
  }
  
  return (
    <AuthContext.Provider value={{
      user,
      isAuthenticated,
      isLoading,
      error,
      login,
      logout,
      validate2FA,
      refreshAccessToken
    }}>
      {children}
    </AuthContext.Provider>
  )
}
