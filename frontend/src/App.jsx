import React, { Suspense, lazy } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import { useAuth } from './hooks/useAuth'
import Layout from './components/Layout/Layout'
import LoadingSpinner from './components/UI/LoadingSpinner'

// Lazy loading de páginas para melhor performance
const Login = lazy(() => import('./pages/Auth/Login'))
const Dashboard = lazy(() => import('./pages/Dashboard/Dashboard'))
const Equipamentos = lazy(() => import('./pages/Equipamentos/Equipamentos'))
const EquipamentoDetalhes = lazy(() => import('./pages/Equipamentos/EquipamentoDetalhes'))
const EquipamentoForm = lazy(() => import('./pages/Equipamentos/EquipamentoForm'))
const TiposEquipamentoList = lazy(() => import('./pages/TiposEquipamento/TiposEquipamentoList'))
const TipoEquipamentoForm = lazy(() => import('./pages/TiposEquipamento/TipoEquipamentoForm'))
const Configuracoes = lazy(() => import('./pages/Configuracoes/Configuracoes'))
const NotFound = lazy(() => import('./pages/NotFound'))

/**
 * Componente principal da aplicação
 * Gerencia rotas e proteção de autenticação
 * 
 * @version 0.1.0-alpha
 */
function App() {
  const { isAuthenticated, isLoading } = useAuth()

  // Rota protegida que requer autenticação
  const ProtectedRoute = ({ children }) => {
    if (isLoading) {
      return <LoadingSpinner fullscreen />
    }
    
    if (!isAuthenticated) {
      return <Navigate to="/login" replace />
    }

    return children
  }

  return (
    <Suspense fallback={<LoadingSpinner fullscreen />}>
      <Routes>
        {/* Rotas públicas */}
        <Route path="/login" element={<Login />} />
        
        {/* Rotas protegidas */}
        <Route path="/" element={<ProtectedRoute><Layout /></ProtectedRoute>}>
          <Route index element={<Dashboard />} />
          
          <Route path="equipamentos">
            <Route index element={<Equipamentos />} />
            <Route path="novo" element={<EquipamentoForm />} />
            <Route path=":id" element={<EquipamentoDetalhes />} />
            <Route path=":id/editar" element={<EquipamentoForm />} />
          </Route>
          
          <Route path="tipos-equipamento">
            <Route index element={<TiposEquipamentoList />} />
            <Route path="novo" element={<TipoEquipamentoForm />} />
            <Route path="editar/:id" element={<TipoEquipamentoForm />} />
          </Route>
          
          <Route path="configuracoes" element={<Configuracoes />} />
          
          {/* Adicionar outras rotas conforme necessário */}
        </Route>
        
        {/* Rota 404 */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Suspense>
  )
}

export default App
