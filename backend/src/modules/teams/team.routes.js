import express from 'express'
import { authenticate } from '../../middlewares/auth.js'
import { sendSuccess } from '../../utils/responses.js'
import {
  createLeaveRequest,
  createTeam,
  getTeamById,
  listCompetitionTeams,
  listIncomingLeaveRequests,
  listMyTeams,
  reviewLeaveRequest,
} from './team.service.js'
import { createTeamSchema, leaveRequestStatusSchema } from './team.validation.js'

export const teamRouter = express.Router()

teamRouter.use(authenticate)

teamRouter.get('/me', async (req, res, next) => {
  try {
    const teams = await listMyTeams(req.user._id.toString())
    sendSuccess(res, { teams })
  } catch (error) {
    next(error)
  }
})

teamRouter.get('/leave-requests/incoming', async (req, res, next) => {
  try {
    const leaveRequests = await listIncomingLeaveRequests(req.user._id.toString())
    sendSuccess(res, { leaveRequests })
  } catch (error) {
    next(error)
  }
})

teamRouter.post('/', async (req, res, next) => {
  try {
    const input = createTeamSchema.parse(req.body)
    const team = await createTeam(req.user, input)
    sendSuccess(res, { team }, 201)
  } catch (error) {
    next(error)
  }
})

teamRouter.get('/:id', async (req, res, next) => {
  try {
    const team = await getTeamById(req.params.id)
    sendSuccess(res, { team })
  } catch (error) {
    next(error)
  }
})

teamRouter.post('/:id/leave-requests', async (req, res, next) => {
  try {
    const leaveRequest = await createLeaveRequest(req.user._id.toString(), req.params.id)
    sendSuccess(res, { leaveRequest }, 201)
  } catch (error) {
    next(error)
  }
})

export const competitionTeamRouter = express.Router()

competitionTeamRouter.get('/:id/teams', async (req, res, next) => {
  try {
    const teams = await listCompetitionTeams(req.params.id)
    sendSuccess(res, { teams })
  } catch (error) {
    next(error)
  }
})

export const leaveRequestRouter = express.Router()

leaveRequestRouter.use(authenticate)

leaveRequestRouter.patch('/:id/status', async (req, res, next) => {
  try {
    const { status } = leaveRequestStatusSchema.parse(req.body)
    const leaveRequest = await reviewLeaveRequest(req.user._id.toString(), req.params.id, status)
    sendSuccess(res, { leaveRequest })
  } catch (error) {
    next(error)
  }
})
