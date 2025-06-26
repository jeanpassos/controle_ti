import axios from 'axios';
import { toast } from 'react-toastify';

// Obtém a URL da API do .env ou usa um fallback
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:4020/api';

// Cria a instância do axios
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor para adicionar o token JWT às requisições
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('@ControleTI:token');
    console.log(`🚀 Fazendo requisição para ${config.url}:`, {
      token: token ? `${token.substring(0, 20)}...` : 'ausente',
      headers: config.headers.Authorization ? 'presente' : 'ausente'
    });
    
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
      console.log(`🔑 Token adicionado ao header Authorization`);
    } else {
      console.warn(`⚠️ Nenhum token encontrado no localStorage para requisição ${config.url}`);
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Variável para controle do refresh em andamento
let isRefreshing = false;
// Armazena requisições que falharam com 401 para retry após refresh bem-sucedido
let failedQueue = [];

// Processa a fila de requisições com falha
const processQueue = (error, token = null) => {
  failedQueue.forEach(prom => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

// Interceptor para lidar com erros de resposta
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response) {
      // Erro do servidor com resposta
      
      // Trata refresh token expirado ou inválido - tentativa automática de refresh
      if (error.response.status === 401 && !originalRequest._retry) {
        // Executa apenas para rotas que não são /auth/login ou /auth/refresh ou /auth/validate
        if (!originalRequest.url.includes('/auth/login') && !originalRequest.url.includes('/auth/refresh') && !originalRequest.url.includes('/auth/validate')) {
          originalRequest._retry = true;
          
          // Se já está atualizando o token, adiciona na fila
          if (isRefreshing) {
            return new Promise((resolve, reject) => {
              failedQueue.push({ resolve, reject });
            })
            .then(token => {
              originalRequest.headers['Authorization'] = `Bearer ${token}`;
              return api(originalRequest);
            })
            .catch(err => Promise.reject(err));
          }
          
          isRefreshing = true;
          
          try {
            // Tenta renovar o token
            const refreshToken = localStorage.getItem('@ControleTI:refreshToken');
            
            if (!refreshToken) {
              throw new Error('Refresh token não encontrado');
            }
            
            const { data } = await axios.post(`${API_URL}/auth/refresh`, { refreshToken });
            
            // Armazena os novos tokens
            const { accessToken, refreshToken: newRefreshToken } = data;
            localStorage.setItem('@ControleTI:token', accessToken);
            localStorage.setItem('@ControleTI:refreshToken', newRefreshToken);
            
            // Atualiza o header para requisições futuras
            api.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`;
            originalRequest.headers['Authorization'] = `Bearer ${accessToken}`;
            
            // Processa fila de requisições pendentes
            processQueue(null, accessToken);
            
            // Refaz a requisição original com o novo token
            return api(originalRequest);
          } catch (refreshError) {
            // Falha no refresh token
            processQueue(refreshError, null);
            
            // Limpa a sessão apenas em caso de erro de refresh
            if (window.location.pathname !== '/login') {
              toast.error('Sua sessão expirou. Por favor, faça login novamente.');
              localStorage.removeItem('@ControleTI:token');
              localStorage.removeItem('@ControleTI:refreshToken');
              localStorage.removeItem('@ControleTI:user');
              window.location.href = '/login';
            }
            
            return Promise.reject(refreshError);
          } finally {
            isRefreshing = false;
          }
        }
      }
      
      // Outros erros HTTP
      switch (error.response.status) {
        case 403:
          // Sem permissão
          toast.error('Você não tem permissão para acessar este recurso.');
          break;
        case 404:
          // Recurso não encontrado
          toast.error('Recurso não encontrado.');
          break;
        case 500:
          // Erro do servidor
          toast.error('Erro interno do servidor. Tente novamente mais tarde.');
          break;
        default:
          // Outros erros
          if (error.response.data && error.response.data.message) {
            toast.error(error.response.data.message);
          } else {
            toast.error('Ocorreu um erro inesperado.');
          }
      }
    } else if (error.request) {
      // Requisição feita mas sem resposta
      toast.error('Não foi possível conectar ao servidor. Verifique sua conexão.');
    } else {
      // Erro ao configurar a requisição
      toast.error('Erro ao processar a solicitação.');
    }
    return Promise.reject(error);
  }
);

export default api;
