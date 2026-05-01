import express from 'express'
import { authenticate, requireSystemRole } from '../../middlewares/auth.js'
import { sendSuccess } from '../../utils/responses.js'
import { listSuggestions, reviewSuggestion } from './suggestion.service.js'
import { listSuggestionsQuerySchema, suggestionIdParamsSchema } from './suggestion.validation.js'

export const adminSuggestionsRouter = express.Router()

adminSuggestionsRouter.use(authenticate)
adminSuggestionsRouter.use(requireSystemRole('admin'))

adminSuggestionsRouter.get('/', async (req, res, next) => {
  try {
    const filters = listSuggestionsQuerySchema.parse(req.query)
    const suggestions = await listSuggestions(filters)
    sendSuccess(res, { suggestions })
  } catch (error) {
    next(error)
  }
})

adminSuggestionsRouter.patch('/:id/decide', async (req, res, next) => {
  try {
    const { id } = suggestionIdParamsSchema.parse(req.params)
    const { decision } = req.body
    const suggestion = await reviewSuggestion(req.user, id, decision)
    sendSuccess(res, { suggestion })
  } catch (error) {
    next(error)
  }
})

