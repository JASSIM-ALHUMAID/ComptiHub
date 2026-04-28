import { z } from 'zod'

const textField = (max) => z.string().trim().max(max)

const competitorSchema = z.object({
  focus: textField(200).optional(),
  preferredRole: textField(200).optional(),
  strengths: textField(500).optional(),
  availability: textField(200).optional(),
  bio: textField(2000).optional(),
})

const teamLeaderSchema = z.object({
  focus: textField(200).optional(),
  preferredTeamSetup: textField(200).optional(),
  strengths: textField(500).optional(),
  availability: textField(200).optional(),
  bio: textField(2000).optional(),
})

export const profileUpdateSchema = z
  .object({
    university: textField(200).optional(),
    major: textField(200).optional(),
    year: textField(100).optional(),
    competitor: competitorSchema.optional(),
    teamLeader: teamLeaderSchema.optional(),
  })
  .refine((value) => Object.keys(value).length > 0, {
    message: 'At least one profile field is required.',
  })

export const profileSkillsSchema = z.object({
  skills: z.array(textField(50)).max(50),
})
