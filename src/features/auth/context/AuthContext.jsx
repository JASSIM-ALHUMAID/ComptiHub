/* eslint-disable react-refresh/only-export-components */
import { createContext, useCallback, useMemo, useState } from 'react'
import { authService } from '../services/authService'
import { applications as mockApplications } from '../../../data/mocks/applications'

export const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => authService.getSession())
  const [applications, setApplications] = useState(mockApplications)

  const login = useCallback(async (credentials) => {
    const sessionUser = await authService.login(credentials)
    setUser(sessionUser)
    return sessionUser
  }, [])

  const signup = useCallback(async (account) => {
    const sessionUser = await authService.signup(account)
    setUser(sessionUser)
    return sessionUser
  }, [])

  const logout = useCallback(async () => {
    await authService.logout()
    setUser(null)
  }, [])

  const updateDefaultRole = useCallback(
    async (defaultRole) => {
      if (!user) return null
      const nextUser = await authService.updateDefaultRole(user.id, defaultRole)
      setUser(nextUser)
      return nextUser
    },
    [user],
  )

  const updateActiveRole = useCallback(
    async (activeRole) => {
      if (!user) return null
      const nextUser = await authService.updateActiveRole(user.id, activeRole)
      setUser(nextUser)
      return nextUser
    },
    [user],
  )

  const addApplication = useCallback((teamId, teamName, competitionTitle, message) => {
    const newApp = {
      id: `app-${Date.now()}`,
      teamId,
      teamName,
      competitionTitle,
      appliedAt: new Date().toISOString().slice(0, 10),
      status: 'pending',
      message,
    }
    setApplications((prev) => [...prev, newApp])
  }, [])

  const hasApplied = useCallback(
    (teamId) => applications.some((a) => a.teamId === teamId),
    [applications],
  )

  const value = useMemo(
    () => ({
      user,
      isAuthenticated: Boolean(user),
      login,
      signup,
      logout,
      updateDefaultRole,
      updateActiveRole,
      applications,
      addApplication,
      hasApplied,
    }),
    [login, logout, signup, updateActiveRole, updateDefaultRole, user, applications, addApplication, hasApplied],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}