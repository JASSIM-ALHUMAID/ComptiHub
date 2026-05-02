import { storage } from '../../../lib/utils/storage'
import { apiClient } from '../../../lib/api/client'
import { endpoints } from '../../../lib/api/endpoints'

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

function setSession(user) {
  writeJson(SESSION_KEY, user)
}

function clearSession() {
  storage.remove(SESSION_KEY)
  storage.remove(TOKEN_KEY)
}

function getSession() {
  const session = readJson(SESSION_KEY, null)

  if (session?.source && session.source !== 'api') {
    clearSession()
    return null
  }

  return session
}

function setToken(token) {
  storage.set(TOKEN_KEY, token)
}

function getToken() {
  return storage.get(TOKEN_KEY)
}

export const authService = {
  getSession,
  getToken,

  async login({ email, password }) {
    const normalizedEmail = normalizeEmail(email)

    const data = await apiClient(endpoints.auth.login, {
      method: 'POST',
      body: { email: normalizedEmail, password: password.trim() },
    })

    const sessionUser = normalizeSessionUser(data.user, 'api')
    setSession(sessionUser)
    setToken(data.token)
    return sessionUser
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
}
