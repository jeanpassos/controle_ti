import { createContext, useState, useEffect } from 'react'
import jwtDecode from 'jwt-decode'
import api from '../services/api'

/**
 * Contexto para gerenciamento de autenticação
 * 
 * @version 0.1.0-alpha
 */
export const AuthContext = createContext()

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)
  
  // Verifica se há um token armazenado ao iniciar a aplicação
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const token = localStorage.getItem('token')
        const refreshToken = localStorage.getItem('refreshToken')
        
        if (!token || !refreshToken) {
          throw new Error('Tokens não encontrados')
        }
        
        // Verifica se o token está expirado
        const decodedToken = jwtDecode(token)
        const currentTime = Date.now() / 1000
        
        if (decodedToken.exp < currentTime) {
          // Token expirado, tenta renovar com refresh token
          await refreshAccessToken()
        } else {
          // Token ainda válido
          api.defaults.headers.common['Authorization'] = `Bearer ${token}`
          setUser(decodedToken)
          setIsAuthenticated(true)
        }
      } catch (error) {
        console.error('Erro de autenticação:', error)
        logout()
      } finally {
        setIsLoading(false)
      }
    }
    
    checkAuth()
  }, [])
  
  /**
   * Tenta renovar o access token usando o refresh token
   */
  const refreshAccessToken = async () => {
    try {
      const refreshToken = localStorage.getItem('refreshToken')
      
      if (!refreshToken) {
        throw new Error('Refresh token não encontrado')
      }
      
      const response = await api.post('/auth/refresh', { refreshToken })
      const { token, refreshToken: newRefreshToken } = response.data
      
      // Armazena novos tokens
      localStorage.setItem('token', token)
      localStorage.setItem('refreshToken', newRefreshToken)
      
      // Atualiza estado e headers
      api.defaults.headers.common['Authorization'] = `Bearer ${token}`
      setUser(jwtDecode(token))
      setIsAuthenticated(true)
      
      return true
    } catch (error) {
      console.error('Falha ao renovar token:', error)
      logout()
      return false
    }
  }
  
  /**
   * Realiza login do usuário
   */
  const login = async (email, senha) => {
    try {
      setIsLoading(true)
      setError(null)
      
      const response = await api.post('/auth/login', { email, senha })
      const { token, refreshToken, require2FA } = response.data
      
      // Verifica se é necessário 2FA
      if (require2FA) {
        return { require2FA: true, email }
      }
      
      // Login realizado com sucesso
      localStorage.setItem('token', token)
      localStorage.setItem('refreshToken', refreshToken)
      
      api.defaults.headers.common['Authorization'] = `Bearer ${token}`
      
      const decodedUser = jwtDecode(token)
      setUser(decodedUser)
      setIsAuthenticated(true)
      
      return { success: true }
    } catch (error) {
      console.error('Erro ao fazer login:', error)
      const errorMessage = error.response?.data?.message || 'Erro ao fazer login'
      setError(errorMessage)
      return { error: errorMessage }
    } finally {
      setIsLoading(false)
    }
  }
  
  /**
   * Valida código 2FA
   */
  const validate2FA = async (email, code) => {
    try {
      setIsLoading(true)
      setError(null)
      
      const response = await api.post('/auth/2fa/validate', { email, code })
      const { token, refreshToken } = response.data
      
      localStorage.setItem('token', token)
      localStorage.setItem('refreshToken', refreshToken)
      
      api.defaults.headers.common['Authorization'] = `Bearer ${token}`
      
      const decodedUser = jwtDecode(token)
      setUser(decodedUser)
      setIsAuthenticated(true)
      
      return { success: true }
    } catch (error) {
      console.error('Erro ao validar 2FA:', error)
      const errorMessage = error.response?.data?.message || 'Código inválido'
      setError(errorMessage)
      return { error: errorMessage }
    } finally {
      setIsLoading(false)
    }
  }
  
  /**
   * Realiza logout do usuário
   */
  const logout = async () => {
    try {
      const token = localStorage.getItem('token')
      
      if (token) {
        await api.post('/auth/logout')
      }
    } catch (error) {
      console.error('Erro ao fazer logout:', error)
    } finally {
      // Limpa dados do usuário
      localStorage.removeItem('token')
      localStorage.removeItem('refreshToken')
      
      delete api.defaults.headers.common['Authorization']
      
      setUser(null)
      setIsAuthenticated(false)
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
