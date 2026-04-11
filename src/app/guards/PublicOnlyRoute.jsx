import { Navigate, Outlet } from 'react-router-dom'
import { useAuth } from '../../features/auth/hooks/useAuth'
import { routes } from '../../lib/constants/routes'

export default function PublicOnlyRoute() {
  const { isAuthenticated, user } = useAuth()

  if (isAuthenticated) {
    return <Navigate to={user?.accountType === 'admin' ? routes.admin : routes.dashboard} replace />
  }

  return <Outlet />
}
