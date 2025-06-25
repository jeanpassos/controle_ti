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
        setIsLoading(true);
        
        // Verifica se há um usuário armazenado
        const storedUser = authService.getCurrentUser();
        if (storedUser) {
          // Verifica se o token armazenado ainda é válido
          const isValid = await authService.validateToken();
          
          if (isValid) {
            setUser(storedUser);
            setIsAuthenticated(true);
          } else {
            // Token inválido ou expirado e não foi possível renovar
            authService.clearSession();
          }
        }
      } catch (error) {
        console.error('Erro ao inicializar autenticação:', error);
        authService.clearSession();
      } finally {
        setIsLoading(false);
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
