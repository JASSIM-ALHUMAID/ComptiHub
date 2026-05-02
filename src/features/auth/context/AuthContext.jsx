/* eslint-disable react-refresh/only-export-components */
import { createContext, useCallback, useEffect, useMemo, useState } from 'react'
import { authService } from '../services/authService'
import { applicationService } from '../../applications/services/applicationService'

export const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => authService.getSession())
  const [applications, setApplications] = useState([])
  const [applicationsLoading, setApplicationsLoading] = useState(false)
  const [applicationsError, setApplicationsError] = useState(null)

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
    setApplications([])
  }, [])

  useEffect(() => {
    if (!user) {
      setApplications([])
      setApplicationsError(null)
      return
    }

    async function loadApplications() {
      try {
        setApplicationsLoading(true)
        setApplicationsError(null)
        const nextApplications = await applicationService.listMyApplications()
        setApplications(nextApplications)
      } catch (error) {
        setApplicationsError(error.message || 'Failed to load applications')
        setApplications([])
      } finally {
        setApplicationsLoading(false)
      }
    }

    loadApplications()
  }, [user])

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

  const updateBasicInfo = useCallback(
    async ({ username, email }) => {
      if (!user) return null
      const nextUser = await authService.updateBasicInfo(user.id, { username, email })
      setUser(nextUser)
      return nextUser
    },
    [user],
  )

  const addApplication = useCallback(
    async (teamId, teamName, competitionTitle, message) => {
      if (!user) {
        throw new Error('Must be authenticated to submit an application')
      }

      try {
        const newApp = await applicationService.submitApplication(teamId, message)
        // Add metadata that might not come from API
        const enrichedApp = {
          ...newApp,
          teamName: teamName || newApp.teamName,
          competitionTitle: competitionTitle || newApp.competitionTitle,
        }
        setApplications((prev) => [enrichedApp, ...prev])
        return enrichedApp
      } catch (error) {
        setApplications((prev) =>
          prev.filter((app) => app.teamId !== teamId)
        )
        throw error
      }
    },
    [user]
  )

  const hasApplied = useCallback(
    (teamId) => applications.some((a) => a.teamId === teamId),
    [applications]
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
      updateBasicInfo,
      applications,
      applicationsLoading,
      applicationsError,
      addApplication,
      hasApplied,
    }),
    [login, logout, signup, updateActiveRole, updateDefaultRole, updateBasicInfo, user, applications, applicationsLoading, applicationsError, addApplication, hasApplied],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
