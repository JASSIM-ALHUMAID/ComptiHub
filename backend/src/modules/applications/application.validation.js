import { z } from 'zod'
import { objectIdSchema } from '../../utils/validation.js'

const applicationStatusSchema = z.enum(['pending', 'accepted', 'rejected'])

export const applicationIdParamsSchema = z.object({
  id: objectIdSchema,
})

export const createApplicationParamsSchema = z.object({
  teamId: z.string().trim().min(1),
})

export const incomingApplicationsQuerySchema = z.object({
  status: applicationStatusSchema.optional(),
})

export const createApplicationSchema = z.object({
  teamId: z.string().trim().min(1).optional(),
  competitionId: z.string().trim().min(1).optional(),
  message: z.string().trim().max(1000).optional(),
})

export const updateApplicationStatusSchema = z.object({
  status: applicationStatusSchema,
})

export const applicationResponseSchema = z.object({
  applicationId: z.string().trim().min(1),
  status: applicationStatusSchema,
})

export const reviewApplicationSchema = updateApplicationStatusSchema
