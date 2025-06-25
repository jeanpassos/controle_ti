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
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Interceptor para lidar com erros de resposta
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      // Erro do servidor com resposta
      switch (error.response.status) {
        case 401:
          // Token inválido ou expirado
          if (window.location.pathname !== '/login') {
            toast.error('Sua sessão expirou. Por favor, faça login novamente.');
            localStorage.removeItem('@ControleTI:token');
            localStorage.removeItem('@ControleTI:refreshToken');
            localStorage.removeItem('@ControleTI:user');
            window.location.href = '/login';
          }
          break;
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
