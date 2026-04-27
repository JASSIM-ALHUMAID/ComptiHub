import jwt from 'jsonwebtoken'
import { env } from '../config/env.js'
import { ApiError } from '../utils/apiError.js'
import { User } from '../modules/auth/user.model.js'

function getBearerToken(req) {
  const header = req.get('authorization') || ''
  const [scheme, token] = header.split(' ')
  return scheme?.toLowerCase() === 'bearer' ? token : null
}

export async function authenticate(req, _res, next) {
  try {
    const token = getBearerToken(req)

    if (!token) {
      throw new ApiError(401, 'Authentication required.')
    }

    const payload = jwt.verify(token, env.jwtSecret)
    const user = await User.findById(payload.sub)

    if (!user) {
      throw new ApiError(401, 'Authentication required.')
    }

    if (user.accountStatus !== 'active') {
      throw new ApiError(403, `Account is ${user.accountStatus}.`)
    }

    req.user = user
    next()
  } catch (error) {
    if (error instanceof ApiError) {
      next(error)
      return
    }

    next(new ApiError(401, 'Authentication required.'))
  }
}

export function requireSystemRole(...allowedRoles) {
  return (req, _res, next) => {
    if (!req.user || !allowedRoles.includes(req.user.systemRole)) {
      next(new ApiError(403, 'You do not have access to this resource.'))
      return
    }

    next()
  }
}

export function requireActiveRole(...allowedRoles) {
  return (req, _res, next) => {
    if (!req.user || !allowedRoles.includes(req.user.activeRole)) {
      next(new ApiError(403, 'Your active role cannot access this resource.'))
      return
    }

    next()
  }
}
