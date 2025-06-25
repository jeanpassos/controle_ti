import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FiChevronLeft, FiSave } from 'react-icons/fi';

/**
 * Componente de formulário de Equipamento (placeholder)
 * @version 0.52.0
 */
function EquipamentoForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditMode = Boolean(id);
  
  const handleSubmit = (e) => {
    e.preventDefault();
    // Implementação futura
    alert('Funcionalidade em desenvolvimento');
  };
  
  return (
    <div className="container mx-auto px-4 py-6">
      <div className="flex items-center mb-6">
        <button
          className="mr-4 flex items-center text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
          onClick={() => navigate('/equipamentos')}
        >
          <FiChevronLeft size={20} className="mr-1" />
          Voltar
        </button>
        <h1 className="text-2xl font-bold text-gray-800 dark:text-white">
          {isEditMode ? 'Editar' : 'Novo'} Equipamento
        </h1>
      </div>
      
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          <p className="text-gray-600 dark:text-gray-400">
            Formulário de {isEditMode ? 'edição' : 'cadastro'} de equipamento em desenvolvimento.
          </p>
          
          {/* Botões */}
          <div className="flex justify-end space-x-3 pt-4">
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white hover:bg-blue-700 rounded-md shadow-sm flex items-center"
            >
              <FiSave className="mr-1" size={16} />
              Salvar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default EquipamentoForm;
