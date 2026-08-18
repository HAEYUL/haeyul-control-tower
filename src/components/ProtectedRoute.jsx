import { Navigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

function ProtectedRoute({ children }) {
  const { session, isLoading } = useAuth()

  if (isLoading) return null
  if (!session) return <Navigate to="/login" replace />

  return children
}

export default ProtectedRoute
