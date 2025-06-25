import api from './api';

/**
 * Serviço para manipulação de Tipos de Equipamento
 * @version 0.52.0
 */
const tipoEquipamentoService = {
  /**
   * Busca todos os tipos de equipamento ativos
   * @returns {Promise<Array>} Lista de tipos de equipamento
   */
  async listarTodos() {
    try {
      const response = await api.get('/tipos-equipamento');
      return response.data;
    } catch (error) {
      console.error('Erro ao listar tipos de equipamento:', error);
      throw error;
    }
  },

  /**
   * Busca um tipo de equipamento pelo ID
   * @param {number} id - ID do tipo de equipamento
   * @returns {Promise<Object>} Dados do tipo de equipamento
   */
  async buscarPorId(id) {
    try {
      const response = await api.get(`/tipos-equipamento/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Erro ao buscar tipo de equipamento ${id}:`, error);
      throw error;
    }
  },

  /**
   * Cria um novo tipo de equipamento
   * @param {Object} dados - Dados do tipo de equipamento
   * @returns {Promise<Object>} Tipo de equipamento criado
   */
  async criar(dados) {
    try {
      const response = await api.post('/tipos-equipamento', dados);
      return response.data;
    } catch (error) {
      console.error('Erro ao criar tipo de equipamento:', error);
      throw error;
    }
  },

  /**
   * Atualiza um tipo de equipamento existente
   * @param {number} id - ID do tipo de equipamento
   * @param {Object} dados - Novos dados do tipo de equipamento
   * @returns {Promise<Object>} Tipo de equipamento atualizado
   */
  async atualizar(id, dados) {
    try {
      const response = await api.put(`/tipos-equipamento/${id}`, dados);
      return response.data;
    } catch (error) {
      console.error(`Erro ao atualizar tipo de equipamento ${id}:`, error);
      throw error;
    }
  },

  /**
   * Remove um tipo de equipamento
   * @param {number} id - ID do tipo de equipamento
   * @returns {Promise<Object>} Resultado da operação
   */
  async remover(id) {
    try {
      const response = await api.delete(`/tipos-equipamento/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Erro ao remover tipo de equipamento ${id}:`, error);
      throw error;
    }
  }
};

export default tipoEquipamentoService;
