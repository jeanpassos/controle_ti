import React from 'react';

/**
 * Componente de indicador de carregamento
 * @param {Object} props
 * @param {boolean} props.fullscreen - Se verdadeiro, ocupa toda a tela
 * @param {string} props.size - Tamanho do spinner: 'sm', 'md', 'lg'
 * @param {string} props.color - Cor do spinner
 * @returns {JSX.Element}
 */
function LoadingSpinner({ 
  fullscreen = false, 
  size = 'md', 
  color = 'primary' 
}) {
  // Definir tamanhos com base no prop size
  const sizeClasses = {
    sm: 'w-5 h-5',
    md: 'w-8 h-8',
    lg: 'w-12 h-12'
  };
  
  // Definir cores com base no prop color
  const colorClasses = {
    primary: 'text-primary-600',
    secondary: 'text-secondary-600',
    white: 'text-white'
  };

  const spinnerSize = sizeClasses[size] || sizeClasses.md;
  const spinnerColor = colorClasses[color] || colorClasses.primary;

  const spinner = (
    <div className="relative">
      <svg 
        className={`${spinnerSize} ${spinnerColor} animate-spin`} 
        xmlns="http://www.w3.org/2000/svg" 
        fill="none" 
        viewBox="0 0 24 24"
      >
        <circle 
          className="opacity-25" 
          cx="12" 
          cy="12" 
          r="10" 
          stroke="currentColor" 
          strokeWidth="4"
        />
        <path 
          className="opacity-75" 
          fill="currentColor" 
          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
        />
      </svg>
    </div>
  );

  if (fullscreen) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-white/75 dark:bg-gray-900/75 z-50">
        {spinner}
      </div>
    );
  }

  return spinner;
}

export default LoadingSpinner;
