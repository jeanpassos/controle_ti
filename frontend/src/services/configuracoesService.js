import api from './api';

/**
 * Serviço para gerenciar configurações do sistema
 */
const configuracoesService = {
  /**
   * Obtém todas as configurações visíveis do sistema agrupadas por grupo
   * @returns {Promise} Promise da requisição
   */
  async listar() {
    return api.get('/configuracoes');
  },

  /**
   * Obtém todas as configurações do sistema (incluindo não visíveis) - para uso administrativo
   * @returns {Promise} Promise da requisição
   */
  async listarAdmin() {
    return api.get('/configuracoes/admin');
  },

  /**
   * Obtém configurações por grupo
   * @param {string} grupo - Nome do grupo de configurações
   * @returns {Promise} Promise da requisição
   */
  async obterPorGrupo(grupo) {
    return api.get(`/configuracoes/grupo/${encodeURIComponent(grupo)}`);
  },

  /**
   * Obtém uma configuração por chave
   * @param {string} chave - Chave da configuração
   * @returns {Promise} Promise da requisição
   */
  async obterPorChave(chave) {
    return api.get(`/configuracoes/chave/${encodeURIComponent(chave)}`);
  },

  /**
   * Cria uma nova configuração
   * @param {Object} configuracao - Dados da configuração
   * @returns {Promise} Promise da requisição
   */
  async criar(configuracao) {
    return api.post('/configuracoes', configuracao);
  },

  /**
   * Atualiza uma configuração existente
   * @param {number} id - ID da configuração
   * @param {Object} dados - Dados a serem atualizados
   * @returns {Promise} Promise da requisição
   */
  async atualizar(id, dados) {
    return api.put(`/configuracoes/${id}`, dados);
  },

  /**
   * Remove uma configuração
   * @param {number} id - ID da configuração
   * @returns {Promise} Promise da requisição
   */
  async remover(id) {
    return api.delete(`/configuracoes/${id}`);
  }
};

export default configuracoesService;
