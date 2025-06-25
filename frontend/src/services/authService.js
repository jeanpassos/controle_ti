import api from './api';
import { jwtDecode } from 'jwt-decode';

/**
 * Serviço para gerenciamento de autenticação
 */
const authService = {
  /**
   * Realiza login com email e senha
   * @param {string} email - Email do usuário
   * @param {string} senha - Senha do usuário
   * @returns {Promise<Object>} Dados do usuário e tokens
   */
  async login(email, senha) {
    try {
      const response = await api.post('/auth/login', { email, senha });
      
      const { accessToken, refreshToken, usuario } = response.data;
      
      // Armazena tokens e dados do usuário
      this.setSession(accessToken, refreshToken, usuario);
      
      return { 
        success: true, 
        user: usuario,
        accessToken,
        refreshToken
      };
    } catch (error) {
      return { 
        success: false, 
        message: error.response?.data?.message || 'Falha ao realizar login'
      };
    }
  },

  /**
   * Realiza logout
   */
  async logout() {
    try {
      const refreshToken = localStorage.getItem('refreshToken');
      if (refreshToken) {
        await api.post('/auth/logout', { refreshToken });
      }
    } catch (error) {
      console.error('Erro ao fazer logout no servidor:', error);
    } finally {
      this.clearSession();
    }

    return { success: true };
  },

  /**
   * Atualiza o token de acesso usando o refresh token
   * @returns {Promise<boolean>} Sucesso da operação
   */
  async refreshToken() {
    try {
      const refreshToken = localStorage.getItem('refreshToken');
      
      if (!refreshToken) {
        return false;
      }

      const response = await api.post('/auth/refresh', { refreshToken });
      
      const { accessToken, refreshToken: newRefreshToken } = response.data;
      
      // Atualiza os tokens na sessão
      localStorage.setItem('token', accessToken);
      localStorage.setItem('refreshToken', newRefreshToken);
      
      return true;
    } catch (error) {
      this.clearSession();
      return false;
    }
  },

  /**
   * Verifica se o token atual é válido
   * @returns {Promise<boolean>} Status da validade do token
   */
  async validateToken() {
    try {
      const token = localStorage.getItem('token');
      
      if (!token) {
        return false;
      }
      
      // Verifica se o token já expirou localmente
      const decoded = jwtDecode(token);
      const currentTime = Date.now() / 1000;
      
      if (decoded.exp < currentTime) {
        // Token expirado, tenta renovar
        return await this.refreshToken();
      }
      
      // Token ainda válido, confirma com o servidor
      await api.get('/auth/validate');
      return true;
    } catch (error) {
      if (error.response?.status === 401) {
        // Token inválido, tenta renovar
        return await this.refreshToken();
      }
      return false;
    }
  },

  /**
   * Armazena os dados da sessão no localStorage
   * @param {string} accessToken - Token JWT
   * @param {string} refreshToken - Refresh token
   * @param {Object} user - Dados do usuário
   */
  setSession(accessToken, refreshToken, user) {
    localStorage.setItem('token', accessToken);
    localStorage.setItem('refreshToken', refreshToken);
    localStorage.setItem('user', JSON.stringify(user));
    
    // Configura o token para todas as requisições da API
    api.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`;
  },

  /**
   * Limpa os dados da sessão
   */
  clearSession() {
    localStorage.removeItem('token');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('user');
  },

  /**
   * Obtém o usuário atual da sessão
   * @returns {Object|null} Dados do usuário ou null
   */
  getCurrentUser() {
    const userStr = localStorage.getItem('user');
    if (!userStr) {
      return null;
    }
    
    return JSON.parse(userStr);
  },

  /**
   * Verifica se o usuário está autenticado
   * @returns {boolean} Status de autenticação
   */
  isAuthenticated() {
    return !!localStorage.getItem('@ControleTI:token');
  }
};

export default authService;
