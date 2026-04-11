import { Navigate, Outlet } from 'react-router-dom'
import { useAuth } from '../../features/auth/hooks/useAuth'
import { routes } from '../../lib/constants/routes'

export default function StudentRoleRoute() {
  const { user } = useAuth()

  if (user?.accountType === 'admin') {
    return <Navigate to={routes.admin} replace />
  }

  return <Outlet />
}