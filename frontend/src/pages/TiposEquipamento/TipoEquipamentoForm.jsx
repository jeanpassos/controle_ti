import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from 'react-query';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { toast } from 'react-toastify';
import { FiSave, FiX, FiChevronLeft } from 'react-icons/fi';

import tipoEquipamentoService from '../../services/tipoEquipamentoService';
import LoadingSpinner from '../../components/UI/LoadingSpinner';

/**
 * Esquema de validação do formulário com Yup
 */
const validationSchema = Yup.object().shape({
  nome: Yup.string()
    .required('Nome é obrigatório')
    .max(100, 'Nome não pode ter mais que 100 caracteres'),
  descricao: Yup.string()
    .max(255, 'Descrição não pode ter mais que 255 caracteres'),
  icone: Yup.string()
    .nullable()
    .max(50, 'Ícone não pode ter mais que 50 caracteres'),
  cor: Yup.string()
    .nullable()
    .max(20, 'Cor não pode ter mais que 20 caracteres'),
  ativo: Yup.boolean()
});

/**
 * Componente para criação/edição de Tipo de Equipamento
 * @version 0.52.0
 */
function TipoEquipamentoForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const isEditMode = Boolean(id);
  
  // Buscar dados do tipo de equipamento para edição
  const { data: tipoEquipamento, isLoading, isError } = useQuery(
    ['tipoEquipamento', id],
    () => tipoEquipamentoService.buscarPorId(id),
    {
      enabled: isEditMode,
      onError: (error) => {
        toast.error(`Erro ao buscar tipo de equipamento: ${error.response?.data?.message || 'Erro desconhecido'}`);
        navigate('/tipos-equipamento');
      }
    }
  );
  
  // Valores iniciais para o formulário
  const initialValues = isEditMode && tipoEquipamento
    ? {
        nome: tipoEquipamento.nome || '',
        descricao: tipoEquipamento.descricao || '',
        icone: tipoEquipamento.icone || '',
        cor: tipoEquipamento.cor || '',
        ativo: tipoEquipamento.ativo ?? true
      }
    : {
        nome: '',
        descricao: '',
        icone: '',
        cor: '',
        ativo: true
      };
  
  // Mutação para criar/atualizar tipo de equipamento
  const mutation = useMutation(
    (values) => isEditMode
      ? tipoEquipamentoService.atualizar(id, values)
      : tipoEquipamentoService.criar(values),
    {
      onSuccess: () => {
        toast.success(`Tipo de equipamento ${isEditMode ? 'atualizado' : 'criado'} com sucesso!`);
        queryClient.invalidateQueries('tiposEquipamento');
        navigate('/tipos-equipamento');
      },
      onError: (error) => {
        toast.error(`Erro ao ${isEditMode ? 'atualizar' : 'criar'} tipo de equipamento: ${error.response?.data?.message || 'Erro desconhecido'}`);
      }
    }
  );
  
  // Manipulador de envio do formulário
  const handleSubmit = (values, { setSubmitting }) => {
    mutation.mutate(values);
    setSubmitting(false);
  };
  
  // Carregando dados para edição
  if (isEditMode && isLoading) {
    return <LoadingSpinner />;
  }
  
  // Erro ao carregar dados para edição
  if (isEditMode && isError) {
    return (
      <div className="p-4 text-center text-red-600">
        Erro ao carregar dados do tipo de equipamento. Tente novamente mais tarde.
      </div>
    );
  }
  
  return (
    <div className="container mx-auto px-4 py-6">
      <div className="flex items-center mb-6">
        <button
          className="mr-4 flex items-center text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
          onClick={() => navigate('/tipos-equipamento')}
        >
          <FiChevronLeft size={20} className="mr-1" />
          Voltar
        </button>
        <h1 className="text-2xl font-bold text-gray-800 dark:text-white">
          {isEditMode ? 'Editar' : 'Novo'} Tipo de Equipamento
        </h1>
      </div>
      
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
          enableReinitialize
        >
          {({ isSubmitting, dirty, isValid, resetForm }) => (
            <Form className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Nome */}
                <div>
                  <label htmlFor="nome" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Nome *
                  </label>
                  <Field
                    type="text"
                    name="nome"
                    id="nome"
                    autoComplete="off"
                    className="w-full rounded-md border-gray-300 dark:border-gray-700 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                  />
                  <ErrorMessage name="nome" component="div" className="mt-1 text-sm text-red-600 dark:text-red-400" />
                </div>
                
                {/* Status */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Status
                  </label>
                  <div className="flex items-center space-x-2">
                    <Field
                      type="checkbox"
                      name="ativo"
                      id="ativo"
                      className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <label htmlFor="ativo" className="text-sm text-gray-700 dark:text-gray-300">
                      Ativo
                    </label>
                  </div>
                </div>
                
                {/* Descrição */}
                <div className="md:col-span-2">
                  <label htmlFor="descricao" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Descrição
                  </label>
                  <Field
                    as="textarea"
                    name="descricao"
                    id="descricao"
                    rows={3}
                    className="w-full rounded-md border-gray-300 dark:border-gray-700 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                  />
                  <ErrorMessage name="descricao" component="div" className="mt-1 text-sm text-red-600 dark:text-red-400" />
                </div>
                
                {/* Ícone */}
                <div>
                  <label htmlFor="icone" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Ícone (classe CSS)
                  </label>
                  <Field
                    type="text"
                    name="icone"
                    id="icone"
                    placeholder="Ex: fa-laptop"
                    className="w-full rounded-md border-gray-300 dark:border-gray-700 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                  />
                  <ErrorMessage name="icone" component="div" className="mt-1 text-sm text-red-600 dark:text-red-400" />
                </div>
                
                {/* Cor */}
                <div>
                  <label htmlFor="cor" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Cor (código hex)
                  </label>
                  <div className="flex">
                    <Field
                      type="text"
                      name="cor"
                      id="cor"
                      placeholder="Ex: #007bff"
                      className="w-full rounded-l-md border-gray-300 dark:border-gray-700 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                    />
                    <Field name="cor">
                      {({ field }) => (
                        <div 
                          className="w-10 h-10 border border-gray-300 dark:border-gray-700 rounded-r-md" 
                          style={{ backgroundColor: field.value || '#FFFFFF' }}
                        />
                      )}
                    </Field>
                  </div>
                  <ErrorMessage name="cor" component="div" className="mt-1 text-sm text-red-600 dark:text-red-400" />
                </div>
              </div>
              
              {/* Botões */}
              <div className="flex justify-end space-x-3 pt-4">
                <button
                  type="button"
                  className="px-4 py-2 border border-gray-300 text-gray-700 bg-white hover:bg-gray-100 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600 dark:border-gray-600 rounded-md shadow-sm"
                  onClick={() => resetForm()}
                  disabled={isSubmitting || !dirty}
                >
                  <FiX className="inline mr-1" size={16} /> 
                  Limpar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white hover:bg-blue-700 rounded-md shadow-sm flex items-center"
                  disabled={isSubmitting || !isValid || !dirty}
                >
                  <FiSave className="mr-1" size={16} />
                  {isSubmitting ? 'Salvando...' : 'Salvar'}
                </button>
              </div>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
}

export default TipoEquipamentoForm;
