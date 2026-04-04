import { storage } from '../../../lib/utils/storage'

const USERS_KEY = 'compitihub.auth.users'
const SESSION_KEY = 'compitihub.auth.session'

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

function sanitizeUser(user, activeRole = user.defaultRole) {
  return {
    id: user.id,
    username: user.username,
    email: user.email,
    accountType: user.accountType,
    defaultRole: user.defaultRole,
    activeRole,
  }
}

function getStoredUsers() {
  return readJson(USERS_KEY, [])
}

function setStoredUsers(users) {
  writeJson(USERS_KEY, users)
}

function setSession(user) {
  writeJson(SESSION_KEY, user)
}

function getSession() {
  return readJson(SESSION_KEY, null)
}

function createId() {
  if (globalThis.crypto?.randomUUID) {
    return globalThis.crypto.randomUUID()
  }

  return String(Date.now())
}

export const authService = {
  getSession,

  async login({ email, password }) {
    const normalizedEmail = normalizeEmail(email)
    const normalizedPassword = password.trim()

    if (!normalizedEmail || !normalizedPassword) {
      throw new Error('Email and password are required.')
    }

    const user = getStoredUsers().find(
      (storedUser) => storedUser.email === normalizedEmail && storedUser.password === normalizedPassword,
    )

    if (!user) {
      throw new Error('Invalid email or password.')
    }

    const sessionUser = sanitizeUser(user, user.defaultRole)
    setSession(sessionUser)
    return sessionUser
  },

  async signup({ username, email, password, defaultRole }) {
    const users = getStoredUsers()
    const normalizedEmail = normalizeEmail(email)
    const normalizedUsername = username.trim()
    const normalizedPassword = password.trim()

    if (!normalizedUsername || !normalizedEmail || !normalizedPassword) {
      throw new Error('Username, email, and password are required.')
    }

    if (users.some((user) => user.email === normalizedEmail)) {
      throw new Error('An account with that email already exists.')
    }

    const newUser = {
      id: createId(),
      username: normalizedUsername,
      email: normalizedEmail,
      password: normalizedPassword,
      accountType: 'student',
      defaultRole,
    }

    users.push(newUser)
    setStoredUsers(users)

    const sessionUser = sanitizeUser(newUser)
    setSession(sessionUser)
    return sessionUser
  },

  async updateDefaultRole(userId, defaultRole) {
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

    const sessionUser = getSession()

    if (!sessionUser || sessionUser.id !== userId) {
      return sanitizeUser(users[userIndex])
    }

    const nextSession = {
      ...sessionUser,
      defaultRole,
    }

    setSession(nextSession)
    return nextSession
  },

  async updateActiveRole(userId, activeRole) {
    const sessionUser = getSession()

    if (!sessionUser || sessionUser.id !== userId) {
      throw new Error('Unable to update the active role.')
    }

    const nextSession = {
      ...sessionUser,
      activeRole,
    }

    setSession(nextSession)
    return nextSession
  },

  async logout() {
    storage.remove(SESSION_KEY)
  },
}
