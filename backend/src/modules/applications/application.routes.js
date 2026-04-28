import express from 'express'
import { authenticate, requireActiveRole, requireSystemRole } from '../../middlewares/auth.js'
import { sendSuccess } from '../../utils/responses.js'
import {
  applicationIdParamsSchema,
  createApplicationParamsSchema,
  createApplicationSchema,
  incomingApplicationsQuerySchema,
  reviewApplicationSchema,
} from './application.validation.js'
import {
  createApplication,
  listIncomingApplications,
  listMyApplications,
  reviewApplication,
} from './application.service.js'

export const applicationRouter = express.Router()

const studentOnly = [authenticate, requireSystemRole('student')]

applicationRouter.get('/applications/me', studentOnly, async (req, res, next) => {
  try {
    const applications = await listMyApplications(req.user)
    sendSuccess(res, { applications })
  } catch (error) {
    next(error)
  }
})

applicationRouter.get(
  '/teams/applications/incoming',
  studentOnly,
  requireActiveRole('teamLeader'),
  async (req, res, next) => {
    try {
      const filters = incomingApplicationsQuerySchema.parse(req.query)
      const applications = await listIncomingApplications(req.user, filters)
      sendSuccess(res, { applications })
    } catch (error) {
      next(error)
    }
  },
)

applicationRouter.post(
  '/teams/:teamId/applications',
  studentOnly,
  requireActiveRole('competitor'),
  async (req, res, next) => {
    try {
      const { teamId } = createApplicationParamsSchema.parse(req.params)
      const input = createApplicationSchema.parse(req.body)
      const application = await createApplication(req.user, teamId, input)
      sendSuccess(res, { application }, 201)
    } catch (error) {
      next(error)
    }
  },
)

applicationRouter.patch(
  '/applications/:id/status',
  studentOnly,
  requireActiveRole('teamLeader'),
  async (req, res, next) => {
    try {
      const { id } = applicationIdParamsSchema.parse(req.params)
      const { status } = reviewApplicationSchema.parse(req.body)
      const application = await reviewApplication(req.user, id, status)
      sendSuccess(res, { application })
    } catch (error) {
      next(error)
    }
  },
)
