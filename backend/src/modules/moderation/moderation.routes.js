import express from 'express'
import { authenticate, requireSystemRole } from '../../middlewares/auth.js'
import { sendSuccess } from '../../utils/responses.js'
import {
  adminUserParamsSchema,
  createModerationActionSchema,
  listAdminUsersQuerySchema,
} from './moderation.validation.js'
import {
  createModerationAction,
  listAdminUsers,
  listModerationActions,
} from './moderation.service.js'

export const adminUsersRouter = express.Router()

adminUsersRouter.use(authenticate)
adminUsersRouter.use(requireSystemRole('admin'))

adminUsersRouter.get('/users', async (req, res, next) => {
  try {
    const filters = listAdminUsersQuerySchema.parse(req.query)
    const users = await listAdminUsers(filters)
    sendSuccess(res, { users })
  } catch (error) {
    next(error)
  }
})

adminUsersRouter.patch('/users/:userId/status', async (req, res, next) => {
  try {
    const { id: userId } = adminUserParamsSchema.parse({ id: req.params.userId })
    const input = createModerationActionSchema.parse(req.body)
    const data = await createModerationAction(req.user, userId, input)
    sendSuccess(res, data)
  } catch (error) {
    next(error)
  }
})

adminUsersRouter.post('/users/:userId/moderation-actions', async (req, res, next) => {
  try {
    const { id: userId } = adminUserParamsSchema.parse({ id: req.params.userId })
    const input = createModerationActionSchema.parse(req.body)
    const data = await createModerationAction(req.user, userId, input)
    sendSuccess(res, data, 201)
  } catch (error) {
    next(error)
  }
})

adminUsersRouter.get('/users/:userId/moderation-actions', async (req, res, next) => {
  try {
    const { id: userId } = adminUserParamsSchema.parse({ id: req.params.userId })
    const actions = await listModerationActions(userId)
    sendSuccess(res, { actions })
  } catch (error) {
    next(error)
  }
})

