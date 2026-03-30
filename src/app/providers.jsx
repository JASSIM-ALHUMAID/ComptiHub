import { AuthProvider } from '../features/auth/context/AuthContext'
import { StudentRoleProvider } from '../features/account/context/StudentRoleContext'

export default function AppProviders({ children }) {
  return (
    <AuthProvider>
      <StudentRoleProvider>{children}</StudentRoleProvider>
    </AuthProvider>
  )
}
