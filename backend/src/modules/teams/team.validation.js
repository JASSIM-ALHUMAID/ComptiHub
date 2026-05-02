import { z } from 'zod'

const teamStatusSchema = z.enum(['recruiting', 'full', 'closed', 'archived', 'dissolved'])

export const createTeamSchema = z.object({
  _id: z.string().trim().min(1).optional(),
  name: z.string().trim().min(1).max(150),
  competitionId: z.string().trim().min(1),
  leaderId: z.string().trim().min(1).optional(),
  description: z.string().trim().min(1).max(2000),
  requiredSkills: z.array(z.string()).optional(),
  totalSlots: z.number().min(1).max(50),
  status: teamStatusSchema.optional(),
})

export const updateTeamSchema = z.object({
  name: z.string().trim().min(1).max(150).optional(),
  description: z.string().trim().min(1).max(2000).optional(),
  requiredSkills: z.array(z.string()).optional(),
  totalSlots: z.number().min(1).max(50).optional(),
  status: teamStatusSchema.optional(),
})

export const teamStatusUpdateSchema = z.object({
  status: teamStatusSchema,
})

export const leaveRequestStatusSchema = z.object({
  status: z.enum(['approved', 'rejected']),
})

export const addMemberSchema = z.object({
  memberId: z.string().trim().min(1),
})

export const removeMemberSchema = z.object({
  memberId: z.string().trim().min(1),
})
