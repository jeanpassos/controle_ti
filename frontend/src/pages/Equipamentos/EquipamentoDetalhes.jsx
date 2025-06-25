import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { FiChevronLeft, FiEdit } from 'react-icons/fi';

/**
 * Componente de detalhes do Equipamento (placeholder)
 * @version 0.52.0
 */
function EquipamentoDetalhes() {
  const { id } = useParams();
  
  return (
    <div className="container mx-auto px-4 py-6">
      <div className="flex items-center mb-6">
        <Link 
          to="/equipamentos" 
          className="mr-4 flex items-center text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
        >
          <FiChevronLeft size={20} className="mr-1" />
          Voltar
        </Link>
        <h1 className="text-2xl font-bold text-gray-800 dark:text-white">
          Detalhes do Equipamento
        </h1>
      </div>
      
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-gray-800 dark:text-white">
            Equipamento #{id}
          </h2>
          <Link 
            to={`/equipamentos/${id}/editar`}
            className="flex items-center text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
          >
            <FiEdit size={18} className="mr-1" />
            Editar
          </Link>
        </div>
        
        <p className="text-gray-600 dark:text-gray-400 mb-4">
          Página em desenvolvimento. Detalhes do equipamento {id} serão exibidos aqui.
        </p>
      </div>
    </div>
  );
}

export default EquipamentoDetalhes;
