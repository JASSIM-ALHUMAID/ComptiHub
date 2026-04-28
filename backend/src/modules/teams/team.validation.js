import { z } from 'zod'

const trimmedText = (max) => z.string().trim().min(1).max(max)

export const createTeamSchema = z.object({
  name: trimmedText(150),
  competitionId: trimmedText(100),
  description: trimmedText(2000),
  requiredSkills: z.array(z.string().trim().min(1).max(50)).max(20).default([]),
  totalSlots: z.coerce.number().int().positive().max(50),
})

export const leaveRequestStatusSchema = z.object({
  status: z.enum(['approved', 'rejected']),
})
