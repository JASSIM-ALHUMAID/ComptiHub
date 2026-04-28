import express from 'express'
import { authenticate, requireSystemRole } from '../../middlewares/auth.js'
import { sendMessage, sendSuccess } from '../../utils/responses.js'
import {
  createCompetition,
  deleteCompetition,
  getPublicCompetitionById,
  listAdminCompetitions,
  listPublicCompetitions,
  updateCompetition,
} from './competition.service.js'
import { competitionCreateSchema, competitionListQuerySchema, competitionUpdateSchema } from './competition.validation.js'

export const competitionRouter = express.Router()
export const adminCompetitionRouter = express.Router()

competitionRouter.get('/', async (req, res, next) => {
  try {
    const filters = competitionListQuerySchema.parse(req.query)
    const competitions = await listPublicCompetitions(filters)
    sendSuccess(res, { competitions })
  } catch (error) {
    next(error)
  }
})

competitionRouter.get('/:id', async (req, res, next) => {
  try {
    const competition = await getPublicCompetitionById(req.params.id)
    sendSuccess(res, { competition })
  } catch (error) {
    next(error)
  }
})

adminCompetitionRouter.use(authenticate, requireSystemRole('admin'))

adminCompetitionRouter.get('/', async (req, res, next) => {
  try {
    const filters = competitionListQuerySchema.parse(req.query)
    const competitions = await listAdminCompetitions(filters)
    sendSuccess(res, { competitions })
  } catch (error) {
    next(error)
  }
})

adminCompetitionRouter.post('/', async (req, res, next) => {
  try {
    const input = competitionCreateSchema.parse(req.body)
    const competition = await createCompetition(input, req.user._id)
    sendSuccess(res, { competition }, 201)
  } catch (error) {
    next(error)
  }
})

adminCompetitionRouter.patch('/:id', async (req, res, next) => {
  try {
    const input = competitionUpdateSchema.parse(req.body)
    const competition = await updateCompetition(req.params.id, input)
    sendSuccess(res, { competition })
  } catch (error) {
    next(error)
  }
})

adminCompetitionRouter.delete('/:id', async (req, res, next) => {
  try {
    await deleteCompetition(req.params.id)
    sendMessage(res, 'Competition deleted.')
  } catch (error) {
    next(error)
  }
})
