import { z } from 'zod'

const applicationStatusSchema = z.enum(['pending', 'accepted', 'rejected'])

export const createApplicationSchema = z.object({
  teamId: z.string().trim().min(1),
  competitionId: z.string().trim().min(1),
  message: z.string().trim().max(1000).optional(),
})

export const updateApplicationStatusSchema = z.object({
  status: applicationStatusSchema,
})

export const applicationResponseSchema = z.object({
  applicationId: z.string().trim().min(1),
  status: applicationStatusSchema,
})
