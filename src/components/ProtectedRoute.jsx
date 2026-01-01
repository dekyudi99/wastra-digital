import { Navigate, useLocation } from 'react-router-dom'
import { useUser } from '../contexts/UserContext'

const ProtectedRoute = ({ children, requireRole = null }) => {
  const { isAuthenticated, hasRole } = useUser()
  const location = useLocation()

  // Jika belum login, redirect ke halaman onboarding (pilih role) dengan returnUrl
  if (!isAuthenticated) {
    return <Navigate to={`/onboarding?redirect=${encodeURIComponent(location.pathname + location.search)}`} replace />
  }

  // Jika memerlukan role tertentu dan user tidak memiliki role tersebut
  if (requireRole && !hasRole(requireRole)) {
    return <Navigate to="/" replace />
  }

  return children
}

export default ProtectedRoute

