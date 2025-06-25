import React from 'react';
import { Link } from 'react-router-dom';
import { FiHome } from 'react-icons/fi';

/**
 * Componente de página não encontrada (404)
 * @version 0.52.0
 */
function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900 px-4">
      <div className="text-center">
        <h1 className="text-6xl font-bold text-blue-600 dark:text-blue-500">404</h1>
        <h2 className="mt-3 text-2xl font-semibold text-gray-800 dark:text-white">Página não encontrada</h2>
        <p className="mt-4 text-gray-600 dark:text-gray-400">
          A página que você está procurando não existe ou foi removida.
        </p>
        <div className="mt-6">
          <Link
            to="/"
            className="inline-flex items-center px-4 py-2 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            <FiHome className="mr-2" />
            Voltar ao início
          </Link>
        </div>
      </div>
    </div>
  );
}

export default NotFound;
