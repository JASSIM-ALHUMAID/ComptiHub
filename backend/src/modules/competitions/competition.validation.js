import { z } from 'zod'

const trimmedText = (max) => z.string().trim().min(1).max(max)
const optionalTrimmedText = (max) => z.string().trim().max(max)

const stringList = (maxItems, maxLength) =>
  z.array(z.string().trim().min(1).max(maxLength)).max(maxItems)

const linksSchema = z.union([
  z.string().trim().max(2000),
  z.array(z.string().trim().min(1).max(2000)).max(10),
])

const statusSchema = z.enum(['open', 'closed', 'draft', 'upcoming', 'active', 'ended'])

export const competitionCreateSchema = z.object({
  title: trimmedText(200),
  organizer: trimmedText(200),
  category: trimmedText(100),
  mode: trimmedText(100),
  teamSize: trimmedText(50),
  deadline: trimmedText(20).optional(),
  status: statusSchema,
  prize: trimmedText(200),
  description: trimmedText(4000),
  requirements: stringList(20, 200).default([]),
  tags: stringList(20, 50).default([]),
  links: linksSchema.default([]),
  startDate: trimmedText(20),
  endDate: trimmedText(20),
  registrationDeadline: trimmedText(20),
  participationType: z.enum(['team', 'solo']),
})

export const competitionUpdateSchema = competitionCreateSchema.partial().refine((value) => Object.keys(value).length > 0, {
  message: 'At least one competition field is required.',
})

export const competitionListQuerySchema = z.object({
  search: optionalTrimmedText(200).optional(),
  category: optionalTrimmedText(100).optional(),
  status: optionalTrimmedText(50).optional(),
  sortBy: z.enum(['deadline', 'createdAt']).optional(),
  sortOrder: z.enum(['asc', 'desc']).optional(),
})
