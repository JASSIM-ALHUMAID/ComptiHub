import { Navigate, Outlet } from 'react-router-dom'
import { useAuth } from '../../features/auth/hooks/useAuth'
import { routes } from '../../lib/constants/routes'

export default function AdminRoute() {
  const { user } = useAuth()

  if (!user) {
    return <Navigate to={routes.login} replace />
  }

  if (user.accountType !== 'admin') {
    return <Navigate to={routes.dashboard} replace />
  }

  return <Outlet />
}
