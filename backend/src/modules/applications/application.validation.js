import { z } from 'zod'
import { objectIdSchema } from '../../utils/validation.js'

export const createApplicationParamsSchema = z.object({
  teamId: z.string().trim().min(1).max(120),
})

export const createApplicationSchema = z.object({
  message: z.string().trim().max(1000).optional().default(''),
})

export const applicationIdParamsSchema = z.object({
  id: objectIdSchema,
})

export const reviewApplicationSchema = z.object({
  status: z.enum(['accepted', 'rejected']),
})

export const incomingApplicationsQuerySchema = z.object({
  status: z.enum(['pending', 'accepted', 'rejected']).optional(),
})

