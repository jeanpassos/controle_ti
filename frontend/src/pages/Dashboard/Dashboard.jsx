import React from 'react';
import { useTheme } from '../../hooks/useTheme';
import { useAuth } from '../../hooks/useAuth';

/**
 * Página de Dashboard
 * Mostra estatísticas e resumo dos equipamentos
 * 
 * @version 0.52.0
 */
function Dashboard() {
  const { theme } = useTheme(); // Removendo toggleTheme pois já existe no Layout principal
  const { user } = useAuth();

  // Dados fictícios para o placeholder
  const stats = {
    totalEquipamentos: 245,
    emManutencao: 12,
    disponiveis: 47,
    emUso: 186,
    porCategoria: {
      Notebooks: 120,
      Desktops: 55,
      Impressoras: 25,
      Servidores: 8,
      Outros: 37
    }
  };

  return (
    <div className="container-app py-6">
      {/* Título removido - agora exibido dinamicamente no header do Layout principal */}
      <div className="mt-4 mb-8"></div>

      {/* Cards de estatísticas */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="card">
          <h3 className="text-lg font-semibold mb-2">Total de Equipamentos</h3>
          <p className="text-4xl font-bold text-primary-600">{stats.totalEquipamentos}</p>
        </div>
        
        <div className="card">
          <h3 className="text-lg font-semibold mb-2">Em Uso</h3>
          <p className="text-4xl font-bold text-green-600">{stats.emUso}</p>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            {Math.round((stats.emUso / stats.totalEquipamentos) * 100)}% do total
          </p>
        </div>
        
        <div className="card">
          <h3 className="text-lg font-semibold mb-2">Em Manutenção</h3>
          <p className="text-4xl font-bold text-amber-600">{stats.emManutencao}</p>
        </div>
        
        <div className="card">
          <h3 className="text-lg font-semibold mb-2">Disponíveis</h3>
          <p className="text-4xl font-bold text-blue-600">{stats.disponiveis}</p>
        </div>
      </div>
      
      {/* Distribuição por categorias */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <div className="card">
          <h2 className="text-xl font-bold mb-4">Distribuição por Categoria</h2>
          <div className="space-y-3">
            {Object.entries(stats.porCategoria).map(([categoria, quantidade]) => (
              <div key={categoria}>
                <div className="flex justify-between items-center mb-1">
                  <span>{categoria}</span>
                  <span className="text-sm font-medium">{quantidade}</span>
                </div>
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
                  <div 
                    className="bg-primary-600 h-2.5 rounded-full" 
                    style={{ width: `${Math.round((quantidade / stats.totalEquipamentos) * 100)}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>
        
        <div className="card">
          <h2 className="text-xl font-bold mb-4">Equipamentos Recentes</h2>
          <div className="space-y-4">
            {[
              { id: '001', nome: 'Notebook Dell XPS', status: 'Em uso', usuario: 'Maria Silva', data: '22/06/2025' },
              { id: '002', nome: 'iMac 27"', status: 'Disponível', usuario: '-', data: '20/06/2025' },
              { id: '003', nome: 'Impressora HP LaserJet', status: 'Em manutenção', usuario: '-', data: '18/06/2025' },
              { id: '004', nome: 'Monitor LG Ultrawide', status: 'Em uso', usuario: 'João Santos', data: '15/06/2025' },
            ].map((item) => (
              <div key={item.id} className="flex items-center justify-between p-2 border-b dark:border-gray-700">
                <div>
                  <h4 className="font-medium">{item.nome}</h4>
                  <p className="text-sm text-gray-500 dark:text-gray-400">#{item.id} • {item.usuario}</p>
                </div>
                <div className="text-right">
                  <span className={`badge ${
                    item.status === 'Em uso' ? 'badge-success' : 
                    item.status === 'Em manutenção' ? 'badge-warning' : 'badge-info'
                  }`}>
                    {item.status}
                  </span>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{item.data}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      
      <div className="card">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Versão Preliminar</h2>
          <span className="badge badge-info">v0.52.0</span>
        </div>
        <p className="text-gray-700 dark:text-gray-300 mb-4">
          Esta é uma visualização preliminar do Dashboard. Os dados apresentados são fictícios para fins de demonstração.
        </p>
        <div className="flex space-x-4">
          <button className="btn btn-primary">Explorar Equipamentos</button>
          <button className="btn btn-outline">Gerar Relatório</button>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
