import { z } from 'zod'

const studentRoleSchema = z.enum(['competitor', 'teamLeader'])

export const signupSchema = z.object({
  username: z.string().trim().min(3).max(50),
  email: z.string().trim().email().toLowerCase(),
  password: z.string().min(8).max(128),
  defaultRole: studentRoleSchema,
})

export const loginSchema = z.object({
  email: z.string().trim().email().toLowerCase(),
  password: z.string().min(1),
})

export const defaultRoleSchema = z.object({
  defaultRole: studentRoleSchema,
})

export const activeRoleSchema = z.object({
  activeRole: studentRoleSchema,
})

export const basicInfoSchema = z.object({
  username: z.string().trim().min(3).max(50),
  email: z.string().trim().email().toLowerCase(),
})
