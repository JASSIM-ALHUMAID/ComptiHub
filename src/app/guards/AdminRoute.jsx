import { Navigate, Outlet } from 'react-router-dom'
import { useAuth } from '../../features/auth/hooks/useAuth'
import { routes } from '../../lib/constants/routes'

export default function AdminRoute() {
  const { user, isAuthenticated } = useAuth()

  // not logged in
  if (!isAuthenticated) {
    return <Navigate to={routes.login} replace />
  }

  // not admin
  if (user?.accountType !== 'admin') {
    return <Navigate to={routes.dashboard} replace />
  }

  return <Outlet />
}