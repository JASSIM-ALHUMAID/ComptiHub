import { storage } from '../../../lib/utils/storage'
import { demoUsers } from '../../../data/mocks/user'
import { ApiClientError, apiClient } from '../../../lib/api/client'
import { endpoints } from '../../../lib/api/endpoints'

const USERS_KEY = 'compitihub.auth.users'
const SESSION_KEY = 'compitihub.auth.session'
const TOKEN_KEY = 'compitihub.auth.token'

function readJson(key, fallback) {
  const value = storage.get(key)

  if (!value) {
    return fallback
  }

  try {
    return JSON.parse(value)
  } catch {
    return fallback
  }
}

function writeJson(key, value) {
  storage.set(key, JSON.stringify(value))
}

function normalizeEmail(email) {
  return email.trim().toLowerCase()
}

function normalizeSessionUser(user, source = 'api') {
  return {
    id: user.id,
    username: user.username,
    email: user.email,
    accountType: user.accountType ?? user.systemRole,
    defaultRole: user.defaultRole,
    activeRole: user.activeRole,
    source,
  }
}

function getStoredUsers() {
  const storedUsers = readJson(USERS_KEY, [])
  const mergedUsers = [...demoUsers]

  storedUsers.forEach((storedUser) => {
    if (mergedUsers.some((demoUser) => demoUser.email === storedUser.email)) {
      return
    }

    mergedUsers.push(storedUser)
  })

  return mergedUsers
}

function setStoredUsers(users) {
  writeJson(USERS_KEY, users)
}

function setSession(user) {
  writeJson(SESSION_KEY, user)
}

function clearSession() {
  storage.remove(SESSION_KEY)
  storage.remove(TOKEN_KEY)
}

function getSession() {
  return readJson(SESSION_KEY, null)
}

function setToken(token) {
  storage.set(TOKEN_KEY, token)
}

function getToken() {
  return storage.get(TOKEN_KEY)
}

function createId() {
  if (globalThis.crypto?.randomUUID) {
    return globalThis.crypto.randomUUID()
  }

  return String(Date.now())
}

function loginDemoUser({ normalizedEmail, password }) {
  const normalizedPassword = password.trim()

  if (!normalizedEmail || !normalizedPassword) {
    throw new Error('Email and password are required.')
  }

  const user = getStoredUsers().find(
    (storedUser) => storedUser.email === normalizedEmail && storedUser.password === normalizedPassword,
  )

  if (!user) {
    return null
  }

  const sessionUser = normalizeSessionUser(
    {
      id: user.id,
      username: user.username,
      email: user.email,
      accountType: user.accountType,
      defaultRole: user.defaultRole,
      activeRole: user.defaultRole,
    },
    'mock',
  )

  clearSession()
  setSession(sessionUser)
  return sessionUser
}

function canUseMockLogin(normalizedEmail) {
  return normalizedEmail.endsWith('@demo.com') || normalizedEmail === 'admin@admin.com'
}

function isBackendUnavailable(error) {
  return !(error instanceof ApiClientError) || error.status >= 500
}

export const authService = {
  getSession,
  getToken,

  async login({ email, password }) {
    const normalizedEmail = normalizeEmail(email)

    try {
      const data = await apiClient(endpoints.auth.login, {
        method: 'POST',
        body: { email: normalizedEmail, password: password.trim() },
      })

      const sessionUser = normalizeSessionUser(data.user, 'api')
      setSession(sessionUser)
      setToken(data.token)
      return sessionUser
    } catch (error) {
      if (!canUseMockLogin(normalizedEmail) || !isBackendUnavailable(error)) {
        throw error
      }

      const demoSession = loginDemoUser({ normalizedEmail, password })
      if (demoSession) {
        return demoSession
      }

      throw new Error('Invalid email or password.')
    }
  },

  async signup({ username, email, password, defaultRole }) {
    const data = await apiClient(endpoints.auth.signup, {
      method: 'POST',
      body: {
        username: username.trim(),
        email: normalizeEmail(email),
        password: password.trim(),
        defaultRole,
      },
    })

    const sessionUser = normalizeSessionUser(data.user, 'api')
    setSession(sessionUser)
    setToken(data.token)
    return sessionUser
  },

  async updateDefaultRole(userId, defaultRole) {
    const sessionUser = getSession()

    if (!sessionUser || sessionUser.id !== userId) {
      throw new Error('Unable to update the account preference.')
    }

    if (sessionUser.source === 'mock') {
      const users = getStoredUsers()
      const userIndex = users.findIndex((user) => user.id === userId)

      if (userIndex === -1) {
        throw new Error('Unable to update the account preference.')
      }

      users[userIndex] = {
        ...users[userIndex],
        defaultRole,
      }

      setStoredUsers(users)

      const nextSession = {
        ...sessionUser,
        defaultRole,
      }

      setSession(nextSession)
      return nextSession
    }

    const data = await apiClient(endpoints.auth.defaultRole, {
      method: 'PATCH',
      body: { defaultRole },
      token: getToken(),
    })

    const nextSession = normalizeSessionUser(data.user, 'api')
    setSession(nextSession)
    return nextSession
  },

  async updateActiveRole(userId, activeRole) {
    const sessionUser = getSession()

    if (!sessionUser || sessionUser.id !== userId) {
      throw new Error('Unable to update the active role.')
    }

    if (sessionUser.source === 'mock') {
      const nextSession = {
        ...sessionUser,
        activeRole,
      }
      setSession(nextSession)
      return nextSession
    }

    const data = await apiClient(endpoints.auth.activeRole, {
      method: 'PATCH',
      body: { activeRole },
      token: getToken(),
    })

    const nextSession = normalizeSessionUser(data.user, 'api')
    setSession(nextSession)
    return nextSession
  },

  async updateBasicInfo(userId, { username, email }) {
    const sessionUser = getSession()

    if (!sessionUser || sessionUser.id !== userId) {
      throw new Error('Unable to update the account information.')
    }

    const normalizedEmail = normalizeEmail(email)
    const normalizedUsername = username.trim()

    if (sessionUser.source === 'mock') {
      const users = getStoredUsers()
      const userIndex = users.findIndex((user) => user.id === userId)

      if (userIndex === -1) {
        throw new Error('Unable to update the account information.')
      }

      if (users.some((user) => user.email === normalizedEmail && user.id !== userId)) {
        throw new Error('An account with that email already exists.')
      }

      users[userIndex] = {
        ...users[userIndex],
        username: normalizedUsername,
        email: normalizedEmail,
      }

      setStoredUsers(users)

      const nextSession = {
        ...sessionUser,
        username: normalizedUsername,
        email: normalizedEmail,
      }

      setSession(nextSession)
      return nextSession
    }

    const data = await apiClient(endpoints.auth.basicInfo, {
      method: 'PATCH',
      body: {
        username: normalizedUsername,
        email: normalizedEmail,
      },
      token: getToken(),
    })

    const nextSession = normalizeSessionUser(data.user, 'api')
    setSession(nextSession)
    return nextSession
  },

  async logout() {
    const sessionUser = getSession()
    const token = getToken()

    clearSession()

    if (sessionUser?.source === 'api' && token) {
      try {
        await apiClient(endpoints.auth.logout, {
          method: 'POST',
          token,
        })
      } catch {
        // Best-effort logout; always clear local session state.
      }
    }
  },

  async createLocalDemoUser(user) {
    const users = getStoredUsers()
    users.push({
      id: createId(),
      ...user,
    })
    setStoredUsers(users)
  },
}
