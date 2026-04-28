import { z } from 'zod'
import { objectIdSchema } from '../../utils/validation.js'

function normalizePenalty(value) {
  const normalized = String(value).trim().toLowerCase().replace(/[\s_-]+/g, '')

  if (normalized === 'warning' || normalized === 'formalwarning') {
    return 'warning'
  }

  if (normalized === 'suspend' || normalized === 'suspended') {
    return 'suspend'
  }

  if (normalized === 'ban' || normalized === 'banned') {
    return 'ban'
  }

  return value
}

export const adminUserParamsSchema = z.object({
  id: objectIdSchema,
})

export const listAdminUsersQuerySchema = z.object({
  search: z.string().trim().max(120).optional(),
  accountStatus: z.enum(['active', 'suspended', 'banned']).optional(),
  systemRole: z.enum(['student', 'admin']).optional(),
})

export const createModerationActionSchema = z.object({
  penalty: z.preprocess(normalizePenalty, z.enum(['warning', 'suspend', 'ban'])),
  duration: z.string().trim().max(120).optional().default(''),
  reason: z.string().trim().min(3).max(1000),
})

