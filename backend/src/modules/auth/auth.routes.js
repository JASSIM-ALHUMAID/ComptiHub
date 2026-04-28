import express from 'express'
import { authenticate } from '../../middlewares/auth.js'
import { sendMessage, sendSuccess } from '../../utils/responses.js'
import { activeRoleSchema, basicInfoSchema, defaultRoleSchema, loginSchema, signupSchema } from './auth.validation.js'
import { loginUser, signupStudent, updateActiveRole, updateBasicInfo, updateDefaultRole } from './auth.service.js'

export const authRouter = express.Router()

authRouter.post('/signup', async (req, res, next) => {
  try {
    const input = signupSchema.parse(req.body)
    const data = await signupStudent(input)
    sendSuccess(res, data, 201)
  } catch (error) {
    next(error)
  }
})

authRouter.post('/login', async (req, res, next) => {
  try {
    const input = loginSchema.parse(req.body)
    const data = await loginUser(input)
    sendSuccess(res, data)
  } catch (error) {
    next(error)
  }
})

authRouter.post('/logout', authenticate, (_req, res) => {
  sendMessage(res, 'Logged out.')
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
