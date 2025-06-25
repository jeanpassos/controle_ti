import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from 'react-query';
import { FiEdit, FiTrash2, FiPlus, FiSearch, FiFilter } from 'react-icons/fi';
import { toast } from 'react-toastify';

import tipoEquipamentoService from '../../services/tipoEquipamentoService';
import LoadingSpinner from '../../components/UI/LoadingSpinner';

/**
 * Componente para listagem de Tipos de Equipamento
 * @version 0.52.0
 */
function TiposEquipamentoList() {
  const [filtro, setFiltro] = useState('');
  const [showConfirmDelete, setShowConfirmDelete] = useState(false);
  const [tipoSelecionado, setTipoSelecionado] = useState(null);
  
  const queryClient = useQueryClient();
  
  // Carregar tipos de equipamento
  const { data: tipos, isLoading, isError } = useQuery(
    'tiposEquipamento',
    tipoEquipamentoService.listarTodos,
    {
      staleTime: 1000 * 60 * 5, // 5 minutos
      retry: 2
    }
  );
  
  // Mutation para remover tipo
  const removeMutation = useMutation(
    (id) => tipoEquipamentoService.remover(id),
    {
      onSuccess: () => {
        queryClient.invalidateQueries('tiposEquipamento');
        toast.success('Tipo de equipamento removido com sucesso!');
        setShowConfirmDelete(false);
      },
      onError: (error) => {
        toast.error(`Erro ao remover: ${error.response?.data?.message || 'Erro desconhecido'}`);
      }
    }
  );
  
  // Filtragem de tipos
  const tiposFiltrados = React.useMemo(() => {
    if (!tipos) return [];
    return tipos.filter(tipo => 
      tipo.nome.toLowerCase().includes(filtro.toLowerCase()) ||
      (tipo.descricao && tipo.descricao.toLowerCase().includes(filtro.toLowerCase()))
    );
  }, [tipos, filtro]);
  
  // Manipuladores de eventos
  const handleConfirmDelete = (tipo) => {
    setTipoSelecionado(tipo);
    setShowConfirmDelete(true);
  };
  
  const handleDelete = () => {
    if (tipoSelecionado) {
      removeMutation.mutate(tipoSelecionado.id);
    }
  };
  
  const handleFilterChange = (e) => {
    setFiltro(e.target.value);
  };
  
  if (isLoading) return <LoadingSpinner />;
  
  if (isError) return (
    <div className="p-4 text-center text-red-600">
      Erro ao carregar tipos de equipamento. Tente novamente mais tarde.
    </div>
  );
  
  return (
    <div className="container mx-auto px-4 py-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800 dark:text-white">
          Tipos de Equipamento
        </h1>
        <button
          className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-md flex items-center gap-2 transition"
          onClick={() => window.location.href = '/tipos-equipamento/novo'}
        >
          <FiPlus />
          Novo Tipo
        </button>
      </div>
      
      {/* Filtro */}
      <div className="mb-4 relative">
        <div className="flex items-center border border-gray-300 dark:border-gray-700 rounded-lg overflow-hidden">
          <div className="pl-3 pr-1 text-gray-500 dark:text-gray-400">
            <FiSearch size={18} />
          </div>
          <input
            type="text"
            placeholder="Filtrar tipos de equipamento..."
            className="py-2 px-2 w-full outline-none bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300"
            value={filtro}
            onChange={handleFilterChange}
          />
        </div>
      </div>
      
      {/* Lista */}
      {tiposFiltrados.length > 0 ? (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Nome
                </th>
                <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Descrição
                </th>
                <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Status
                </th>
                <th className="py-3 px-4 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Ações
                </th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              {tiposFiltrados.map(tipo => (
                <tr key={tipo.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                  <td className="py-3 px-4 whitespace-nowrap">
                    <div className="flex items-center">
                      {tipo.icone && (
                        <span className="mr-2" style={{ color: tipo.cor || 'currentColor' }}>
                          {tipo.icone}
                        </span>
                      )}
                      <span className="font-medium text-gray-900 dark:text-white">{tipo.nome}</span>
                    </div>
                  </td>
                  <td className="py-3 px-4 text-sm text-gray-500 dark:text-gray-400 max-w-xs truncate">
                    {tipo.descricao || '-'}
                  </td>
                  <td className="py-3 px-4">
                    {tipo.ativo ? (
                      <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-100">
                        Ativo
                      </span>
                    ) : (
                      <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-100 text-red-800 dark:bg-red-800 dark:text-red-100">
                        Inativo
                      </span>
                    )}
                  </td>
                  <td className="py-3 px-4 text-right text-sm font-medium">
                    <div className="flex justify-end space-x-2">
                      <button 
                        className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
                        onClick={() => window.location.href = `/tipos-equipamento/editar/${tipo.id}`}
                      >
                        <FiEdit size={18} />
                      </button>
                      <button 
                        className="text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300"
                        onClick={() => handleConfirmDelete(tipo)}
                      >
                        <FiTrash2 size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="text-center py-8 bg-white dark:bg-gray-800 rounded-lg shadow">
          <p className="text-gray-600 dark:text-gray-400">
            {filtro ? 'Nenhum tipo de equipamento corresponde ao filtro.' : 'Nenhum tipo de equipamento cadastrado.'}
          </p>
        </div>
      )}
      
      {/* Modal de confirmação de exclusão */}
      {showConfirmDelete && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-xl max-w-md w-full">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
              Confirmar exclusão
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              Tem certeza que deseja excluir o tipo de equipamento <strong>{tipoSelecionado?.nome}</strong>?
              {tipoSelecionado?.ativo && (
                <span className="block mt-2 text-yellow-600 dark:text-yellow-400">
                  Atenção: Caso haja equipamentos vinculados, este tipo será apenas desativado.
                </span>
              )}
            </p>
            <div className="flex justify-end space-x-3">
              <button 
                className="px-4 py-2 text-gray-700 bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600 rounded"
                onClick={() => setShowConfirmDelete(false)}
              >
                Cancelar
              </button>
              <button 
                className="px-4 py-2 bg-red-600 text-white hover:bg-red-700 rounded"
                onClick={handleDelete}
                disabled={removeMutation.isLoading}
              >
                {removeMutation.isLoading ? 'Removendo...' : 'Confirmar Exclusão'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default TiposEquipamentoList;
