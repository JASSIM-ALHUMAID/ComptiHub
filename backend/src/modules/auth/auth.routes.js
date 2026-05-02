import express from 'express'
import jwt from 'jsonwebtoken'
import { authenticate } from '../../middlewares/auth.js'
import { authLimiter } from '../../middlewares/rateLimit.js'
import { env } from '../../config/env.js'
import { sendMessage, sendSuccess } from '../../utils/responses.js'
import { ApiError } from '../../utils/apiError.js'
import { activeRoleSchema, basicInfoSchema, defaultRoleSchema, loginSchema, signupSchema } from './auth.validation.js'
import { loginUser, signupStudent, updateActiveRole, updateBasicInfo, updateDefaultRole } from './auth.service.js'

export const authRouter = express.Router()

authRouter.post('/signup', authLimiter, async (req, res, next) => {
  try {
    const input = signupSchema.parse(req.body)
    const data = await signupStudent(input)
    sendSuccess(res, data, 201)
  } catch (error) {
    next(error)
  }
})

authRouter.post('/login', authLimiter, async (req, res, next) => {
  try {
    const input = loginSchema.parse(req.body)
    const data = await loginUser(input)
    sendSuccess(res, data)
  } catch (error) {
    next(error)
  }
})

authRouter.post('/refresh', async (req, res, next) => {
  try {
    const { refreshToken } = req.body

    if (!refreshToken || typeof refreshToken !== 'string') {
      throw new ApiError(400, 'Refresh token is required.')
    }

    const payload = jwt.verify(refreshToken, env.jwtSecret)

    if (payload.type !== 'refresh') {
      throw new ApiError(400, 'Invalid token type.')
    }

    const { User } = await import('./user.model.js')
    const user = await User.findById(payload.sub).select('+refreshTokens')

    if (!user || !user.verifyRefreshToken(refreshToken)) {
      throw new ApiError(401, 'Invalid or expired refresh token.')
    }

    if (user.accountStatus !== 'active') {
      throw new ApiError(403, `Account is ${user.accountStatus}.`)
    }

    const accessToken = user.issueAccessToken()
    sendSuccess(res, { accessToken })
  } catch (error) {
    if (error instanceof jwt.JsonWebTokenError) {
      next(new ApiError(401, 'Invalid or expired refresh token.'))
      return
    }

    next(error)
  }
})

authRouter.post('/logout', authenticate, async (req, res, next) => {
  try {
    const { refreshToken } = req.body

    if (refreshToken) {
      req.user.revokeRefreshToken(refreshToken)
      await req.user.save()
    }

    sendMessage(res, 'Logged out.')
  } catch (error) {
    next(error)
  }
})

authRouter.get('/me', authenticate, (req, res) => {
  sendSuccess(res, { user: req.user.toSessionUser() })
})

authRouter.patch('/me', authenticate, async (req, res, next) => {
  try {
    const input = basicInfoSchema.parse(req.body)
    const user = await updateBasicInfo(req.user, input)
    sendSuccess(res, { user })
  } catch (error) {
    next(error)
  }
})

authRouter.patch('/default-role', authenticate, async (req, res, next) => {
  try {
    const { defaultRole } = defaultRoleSchema.parse(req.body)
    const user = await updateDefaultRole(req.user, defaultRole)
    sendSuccess(res, { user })
  } catch (error) {
    next(error)
  }
})

authRouter.patch('/active-role', authenticate, async (req, res, next) => {
  try {
    const { activeRole } = activeRoleSchema.parse(req.body)
    const user = await updateActiveRole(req.user, activeRole)
    sendSuccess(res, { user })
  } catch (error) {
    next(error)
  }
})
