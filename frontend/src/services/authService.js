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
      console.log(' Iniciando login para:', email);
      const response = await api.post('/auth/login', { email, senha });
      
      const { accessToken, refreshToken, usuario } = response.data;
      console.log(' Login bem-sucedido, tokens recebidos:', { 
        accessToken: accessToken ? 'presente' : 'ausente',
        refreshToken: refreshToken ? 'presente' : 'ausente',
        usuario: usuario?.email 
      });
      
      // Armazena tokens e dados do usuário
      this.setSession(accessToken, refreshToken, usuario);
      
      // Verifica se os tokens foram armazenados corretamente
      const storedToken = localStorage.getItem('@ControleTI:token');
      const storedRefreshToken = localStorage.getItem('@ControleTI:refreshToken');
      console.log(' Tokens armazenados no localStorage:', {
        accessToken: storedToken ? 'presente' : 'ausente',
        refreshToken: storedRefreshToken ? 'presente' : 'ausente'
      });
      
      return { 
        success: true, 
        user: usuario,
        accessToken,
        refreshToken
      };
    } catch (error) {
      console.error(' Erro no login:', error);
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
      const refreshToken = localStorage.getItem('@ControleTI:refreshToken');
      if (refreshToken) {
        try {
          await api.post('/auth/logout', { refreshToken });
        } catch (e) {
          console.warn('Falha ao comunicar logout ao servidor:', e);
          // Continuamos o logout mesmo se o servidor falhar
        }
      }
    } finally {
      this.clearSession();
      // Remover o header de autorização
      delete api.defaults.headers.common['Authorization'];
    }

    return { success: true };
  },

  /**
   * Atualiza o token de acesso usando o refresh token
   * @returns {Promise<boolean>} Sucesso da operação
   */
  async refreshToken() {
    try {
      const refreshToken = localStorage.getItem('@ControleTI:refreshToken');
      
      if (!refreshToken) {
        console.warn('Tentativa de refresh sem refreshToken');
        return false;
      }

      const response = await api.post('/auth/refresh', { refreshToken });
      
      const { accessToken, refreshToken: newRefreshToken } = response.data;
      
      // Atualiza os tokens na sessão
      localStorage.setItem('@ControleTI:token', accessToken);
      localStorage.setItem('@ControleTI:refreshToken', newRefreshToken);
      
      // Atualiza o header de autorização para TODAS as requisições futuras
      api.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`;
      
      return true;
    } catch (error) {
      console.error('Erro ao atualizar token:', error.response?.data || error.message);
      // Limpa a sessão em caso de erro para forçar novo login
      this.clearSession();
      delete api.defaults.headers.common['Authorization'];
      return false;
    }
  },

  /**
   * Verifica se o token atual é válido
   * @returns {Promise<boolean>} Status da validade do token
   */
  async validateToken() {
    try {
      const token = localStorage.getItem('@ControleTI:token');
      console.log(' authService.validateToken - Token encontrado:', token ? 'presente' : 'ausente');
      
      if (!token) {
        console.log(' authService.validateToken - Nenhum token encontrado');
        return false;
      }
      
      // Verifica se o token já expirou localmente
      const decoded = jwtDecode(token);
      const currentTime = Date.now() / 1000;
      console.log(' authService.validateToken - Verificando expiração:', {
        exp: decoded.exp,
        now: currentTime,
        expired: decoded.exp < currentTime
      });
      
      if (decoded.exp < currentTime) {
        console.log(' authService.validateToken - Token expirado localmente');
        return false;
      }
      
      // Valida no servidor
      console.log(' authService.validateToken - Validando no servidor...');
      await api.get('/auth/validate');
      console.log(' authService.validateToken - Token válido no servidor');
      return true;
    } catch (error) {
      console.error(' authService.validateToken - Erro na validação:', error);
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
    localStorage.setItem('@ControleTI:token', accessToken);
    localStorage.setItem('@ControleTI:refreshToken', refreshToken);
    localStorage.setItem('@ControleTI:user', JSON.stringify(user));
    
    // Configura o token para todas as requisições da API
    api.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`;
  },

  /**
   * Limpa os dados da sessão
   */
  clearSession() {
    localStorage.removeItem('@ControleTI:token');
    localStorage.removeItem('@ControleTI:refreshToken');
    localStorage.removeItem('@ControleTI:user');
  },

  /**
   * Obtém o usuário atual da sessão
   * @returns {Object|null} Dados do usuário ou null
   */
  getCurrentUser() {
    const userStr = localStorage.getItem('@ControleTI:user');
    console.log(' authService.getCurrentUser - Dados do usuário no localStorage:', userStr ? 'presente' : 'ausente');
    
    if (!userStr) {
      console.log(' authService.getCurrentUser - Nenhum usuário encontrado');
      return null;
    }
    
    try {
      const user = JSON.parse(userStr);
      console.log(' authService.getCurrentUser - Usuário recuperado:', user.email);
      return user;
    } catch (error) {
      console.error(' authService.getCurrentUser - Erro ao parsear usuário:', error);
      return null;
    }
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
