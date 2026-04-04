/* eslint-disable react-refresh/only-export-components */
import { createContext, useMemo } from 'react'
import { useAuth } from '../../auth/hooks/useAuth'

export const StudentRoleContext = createContext(null)

export function StudentRoleProvider({ children }) {
  const { user, updateActiveRole } = useAuth()

  const value = useMemo(
    () => ({
      activeRole: user?.activeRole ?? user?.defaultRole ?? 'competitor',
      setActiveRole: updateActiveRole,
    }),
    [updateActiveRole, user],
  )

  return (
    <StudentRoleContext.Provider value={value}>{children}</StudentRoleContext.Provider>
  )
}
