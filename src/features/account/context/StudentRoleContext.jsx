/* eslint-disable react-refresh/only-export-components */
import { createContext, useMemo, useState } from 'react'

export const StudentRoleContext = createContext(null)

export function StudentRoleProvider({ children }) {
  const [activeRole, setActiveRole] = useState('competitor')

  const value = useMemo(
    () => ({
      activeRole,
      setActiveRole,
    }),
    [activeRole],
  )

  return (
    <StudentRoleContext.Provider value={value}>{children}</StudentRoleContext.Provider>
  )
}
