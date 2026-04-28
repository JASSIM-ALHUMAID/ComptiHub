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

adminUsersRouter.get('/', async (req, res, next) => {
  try {
    const filters = listAdminUsersQuerySchema.parse(req.query)
    const users = await listAdminUsers(filters)
    sendSuccess(res, { users })
  } catch (error) {
    next(error)
  }
})

adminUsersRouter.post('/:id/moderation-actions', async (req, res, next) => {
  try {
    const { id } = adminUserParamsSchema.parse(req.params)
    const input = createModerationActionSchema.parse(req.body)
    const data = await createModerationAction(req.user, id, input)
    sendSuccess(res, data, 201)
  } catch (error) {
    next(error)
  }
})

adminUsersRouter.get('/:id/moderation-actions', async (req, res, next) => {
  try {
    const { id } = adminUserParamsSchema.parse(req.params)
    const actions = await listModerationActions(id)
    sendSuccess(res, { actions })
  } catch (error) {
    next(error)
  }
})

