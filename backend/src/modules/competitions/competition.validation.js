import { z } from 'zod'

const competitionStatusSchema = z.enum(['open', 'closed', 'draft', 'upcoming', 'active', 'ended'])
const participationTypeSchema = z.enum(['team', 'solo'])

export const createCompetitionSchema = z.object({
  _id: z.string().trim().min(1),
  title: z.string().trim().min(1).max(200),
  organizer: z.string().trim().min(1).max(200),
  category: z.string().trim().min(1).max(100),
  mode: z.string().trim().min(1).max(100),
  teamSize: z.string().trim().min(1).max(50),
  deadline: z.string().trim().min(1),
  status: competitionStatusSchema,
  prize: z.string().trim().min(1).max(200),
  description: z.string().trim().min(1).max(4000),
  requirements: z.array(z.string()).optional(),
  tags: z.array(z.string()).optional(),
  links: z.array(z.string()).optional(),
  startDate: z.string().trim().min(1),
  endDate: z.string().trim().min(1),
  registrationDeadline: z.string().trim().min(1),
  participationType: participationTypeSchema,
  createdBy: z.string().optional(),
})

export const updateCompetitionSchema = z.object({
  title: z.string().trim().min(1).max(200).optional(),
  organizer: z.string().trim().min(1).max(200).optional(),
  category: z.string().trim().min(1).max(100).optional(),
  mode: z.string().trim().min(1).max(100).optional(),
  teamSize: z.string().trim().min(1).max(50).optional(),
  deadline: z.string().trim().min(1).optional(),
  status: competitionStatusSchema.optional(),
  prize: z.string().trim().min(1).max(200).optional(),
  description: z.string().trim().min(1).max(4000).optional(),
  requirements: z.array(z.string()).optional(),
  tags: z.array(z.string()).optional(),
  links: z.array(z.string()).optional(),
  startDate: z.string().trim().min(1).optional(),
  endDate: z.string().trim().min(1).optional(),
  registrationDeadline: z.string().trim().min(1).optional(),
  participationType: participationTypeSchema.optional(),
})

export const competitionStatusUpdateSchema = z.object({
  status: competitionStatusSchema,
})
