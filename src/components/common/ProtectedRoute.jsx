import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import Loader from './Loader'

const ProtectedRoute = ({ children, requireAdmin = false }) => {
  const { user, loading } = useAuth()
  const location = useLocation()

  console.log('🔒 ProtectedRoute - Current path:', location.pathname)
  console.log('🔒 ProtectedRoute - requireAdmin:', requireAdmin)
  console.log('🔒 ProtectedRoute - loading:', loading)
  console.log('🔒 ProtectedRoute - user:', user)

  if (loading) {
    console.log('🔒 ProtectedRoute - Showing loader...')
    return <Loader fullScreen />
  }

  if (!user) {
    console.log('🔒 ProtectedRoute - No user found, redirecting to login')
    if (requireAdmin) {
      return <Navigate to="/admin/login" state={{ from: location }} replace />
    }
    return <Navigate to="/login" state={{ from: location }} replace />
  }

  const isAdmin = user.isAdmin === true
  console.log('🔒 ProtectedRoute - isAdmin:', isAdmin)

  // If route requires admin but user is not admin
  if (requireAdmin && !isAdmin) {
    console.log('🔒 ProtectedRoute - Admin route but user is not admin, redirecting to candidate dashboard')
    return <Navigate to="/candidate/dashboard" replace />
  }

  // If route is for candidates but user is admin
  if (!requireAdmin && isAdmin) {
    console.log('🔒 ProtectedRoute - Candidate route but user is admin, redirecting to admin dashboard')
    return <Navigate to="/admin/dashboard" replace />
  }

  console.log('🔒 ProtectedRoute - Access granted!')
  return children
}

export default ProtectedRoute