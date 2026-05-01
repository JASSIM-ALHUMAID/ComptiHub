import { describe, it, expect } from 'vitest'
import mongoose from 'mongoose'
import { signupSchema, loginSchema, basicInfoSchema, activeRoleSchema, defaultRoleSchema } from '../../modules/auth/auth.validation.js'
import { ZodError } from 'zod'

describe('Auth Validation', () => {
  describe('signupSchema', () => {
    it('should validate valid signup input', () => {
      const input = {
        username: 'testuser',
        email: 'test@example.com',
        password: 'SecurePassword123',
        defaultRole: 'competitor',
      }

      const result = signupSchema.parse(input)
      expect(result).toEqual(input)
    })

    it('should reject invalid email', () => {
      const input = {
        username: 'testuser',
        email: 'invalid-email',
        password: 'SecurePassword123',
        defaultRole: 'competitor',
      }

      expect(() => signupSchema.parse(input)).toThrow(ZodError)
    })

    it('should reject weak password', () => {
      const input = {
        username: 'testuser',
        email: 'test@example.com',
        password: 'weak',
        defaultRole: 'competitor',
      }

      expect(() => signupSchema.parse(input)).toThrow(ZodError)
    })

    it('should reject invalid defaultRole', () => {
      const input = {
        username: 'testuser',
        email: 'test@example.com',
        password: 'SecurePassword123',
        defaultRole: 'admin',
      }

      expect(() => signupSchema.parse(input)).toThrow(ZodError)
    })

    it('should trim whitespace from username and email', () => {
      const input = {
        username: '  testuser  ',
        email: '  test@example.com  ',
        password: 'SecurePassword123',
        defaultRole: 'competitor',
      }

      const result = signupSchema.parse(input)
      expect(result.username).toBe('testuser')
      expect(result.email).toBe('test@example.com')
    })
  })

  describe('loginSchema', () => {
    it('should validate valid login input', () => {
      const input = {
        email: 'test@example.com',
        password: 'SecurePassword123',
      }

      const result = loginSchema.parse(input)
      expect(result).toEqual(input)
    })

    it('should reject invalid email', () => {
      const input = {
        email: 'invalid-email',
        password: 'SecurePassword123',
      }

      expect(() => loginSchema.parse(input)).toThrow(ZodError)
    })

    it('should lowercase email', () => {
      const input = {
        email: 'TEST@EXAMPLE.COM',
        password: 'SecurePassword123',
      }

      const result = loginSchema.parse(input)
      expect(result.email).toBe('test@example.com')
    })
  })

  describe('basicInfoSchema', () => {
    it('should validate valid basic info', () => {
      const input = {
        username: 'newusername',
        email: 'new@example.com',
      }

      const result = basicInfoSchema.parse(input)
      expect(result).toEqual(input)
    })

    it('should reject short username', () => {
      const input = {
        username: 'ab',
        email: 'test@example.com',
      }

      expect(() => basicInfoSchema.parse(input)).toThrow(ZodError)
    })
  })

  describe('activeRoleSchema', () => {
    it('should validate valid active role', () => {
      const input = { activeRole: 'competitor' }
      const result = activeRoleSchema.parse(input)
      expect(result).toEqual(input)
    })

    it('should reject invalid active role', () => {
      const input = { activeRole: 'invalidRole' }
      expect(() => activeRoleSchema.parse(input)).toThrow(ZodError)
    })
  })

  describe('defaultRoleSchema', () => {
    it('should validate valid default role', () => {
      const input = { defaultRole: 'teamLeader' }
      const result = defaultRoleSchema.parse(input)
      expect(result).toEqual(input)
    })

    it('should reject invalid default role', () => {
      const input = { defaultRole: 'admin' }
      expect(() => defaultRoleSchema.parse(input)).toThrow(ZodError)
    })
  })
})
