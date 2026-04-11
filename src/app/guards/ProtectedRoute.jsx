import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { useAuth } from '../../features/auth/hooks/useAuth'
import { routes } from '../../lib/constants/routes'

export default function ProtectedRoute() {
  const location = useLocation()
  const { isAuthenticated, user } = useAuth()

  if (!isAuthenticated) {
    return <Navigate to={routes.login} replace state={{ from: location }} />
  }

  if (user?.accountType === 'admin') {
    return <Navigate to={routes.admin} replace />
  }

  return <Outlet />
}
