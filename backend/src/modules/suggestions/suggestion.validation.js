import { z } from 'zod'
import { objectIdSchema } from '../../utils/validation.js'

export const suggestionIdParamsSchema = z.object({
  id: objectIdSchema,
})

export const listSuggestionsQuerySchema = z.object({
  status: z.enum(['pending', 'approved', 'rejected']).optional(),
})

