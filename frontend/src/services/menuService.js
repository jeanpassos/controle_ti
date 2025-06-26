import api from './api';

/**
 * Serviço para gerenciar o menu dinâmico
 */
export const menuService = {
  /**
   * Obtém todos os itens de menu ativos
   * @returns {Promise} Promise da requisição
   */
  async listar() {
    return api.get('/menu');
  },

  /**
   * Obtém todos os itens de menu (incluindo inativos) - para uso administrativo
   * @returns {Promise} Promise da requisição
   */
  async listarAdmin() {
    return api.get('/menu/admin');
  },

  /**
   * Obtém itens de menu por nível de acesso
   * @param {number} nivelId - ID do nível de acesso
   * @returns {Promise} Promise da requisição
   */
  async obterPorNivel(nivelId) {
    return api.get(`/menu/nivel/${nivelId}`);
  },

  /**
   * Obtém um item de menu por ID
   * @param {number} id - ID do item de menu
   * @returns {Promise} Promise da requisição
   */
  async obterPorId(id) {
    return api.get(`/menu/${id}`);
  },

  /**
   * Cria um novo item de menu
   * @param {Object} item - Dados do item de menu
   * @returns {Promise} Promise da requisição
   */
  async criar(item) {
    return api.post('/menu', item);
  },

  /**
   * Atualiza um item de menu existente
   * @param {number} id - ID do item de menu
   * @param {Object} item - Dados do item de menu
   * @returns {Promise} Promise da requisição
   */
  async atualizar(id, item) {
    return api.put(`/menu/${id}`, item);
  },

  /**
   * Atualiza a ordem de múltiplos itens de menu
   * @param {Array} itens - Lista de objetos com id e ordem
   * @returns {Promise} Promise da requisição
   */
  async atualizarOrdem(itens) {
    return api.put('/menu/ordem/atualizar', { itens });
  },

  /**
   * Remove um item de menu
   * @param {number} id - ID do item de menu
   * @returns {Promise} Promise da requisição
   */
  async remover(id) {
    return api.delete(`/menu/${id}`);
  }
};

export default menuService;
