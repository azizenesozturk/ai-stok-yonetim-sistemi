import { Navigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

function ProtectedRoute({ children }) {
  const { user, token, loading } = useAuth()

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p className="text-white/40">Yükleniyor...</p>
      </div>
    )
  }

  if (!token || !user) {
    return <Navigate to="/login" replace />
  }

  return children
}

export default ProtectedRoute