import api from './api';

/**
 * Serviço para gerenciar temas personalizados
 */
export const temaService = {
  /**
   * Obtém todos os temas ativos
   * @returns {Promise} Promise da requisição
   */
  async listar() {
    return api.get('/temas');
  },

  /**
   * Obtém todos os temas (incluindo inativos) - para uso administrativo
   * @returns {Promise} Promise da requisição
   */
  async listarAdmin() {
    return api.get('/temas/admin');
  },

  /**
   * Obtém o tema padrão do sistema
   * @returns {Promise} Promise da requisição
   */
  async obterTemaPadrao() {
    return api.get('/temas/padrao');
  },

  /**
   * Obtém um tema por ID
   * @param {number} id - ID do tema
   * @returns {Promise} Promise da requisição
   */
  async obterPorId(id) {
    return api.get(`/temas/${id}`);
  },

  /**
   * Cria um novo tema
   * @param {Object} tema - Dados do tema
   * @returns {Promise} Promise da requisição
   */
  async criar(tema) {
    return api.post('/temas', tema);
  },

  /**
   * Atualiza um tema existente
   * @param {number} id - ID do tema
   * @param {Object} tema - Dados do tema
   * @returns {Promise} Promise da requisição
   */
  async atualizar(id, tema) {
    return api.put(`/temas/${id}`, tema);
  },

  /**
   * Define um tema como padrão
   * @param {number} id - ID do tema
   * @returns {Promise} Promise da requisição
   */
  async definirComoPadrao(id) {
    return api.put(`/temas/${id}/padrao`);
  },

  /**
   * Remove um tema
   * @param {number} id - ID do tema
   * @returns {Promise} Promise da requisição
   */
  async remover(id) {
    return api.delete(`/temas/${id}`);
  }
};

export default temaService;
