import { describe, it, expect } from '../test-utils/vitest-node.js'
import { createApplicationSchema, updateApplicationStatusSchema, applicationResponseSchema } from '../../src/modules/applications/application.validation.js'
import { ZodError } from 'zod'

describe('Application Validation', () => {
  describe('createApplicationSchema', () => {
    it('should validate valid application', () => {
      const input = {
        teamId: 'team1',
        competitionId: 'comp1',
        message: 'I want to join this team',
      }

      const result = createApplicationSchema.parse(input)
      expect(result).toBeDefined()
      expect(result.teamId).toBe('team1')
      expect(result.competitionId).toBe('comp1')
    })

    it('should allow empty message', () => {
      const input = {
        teamId: 'team1',
        competitionId: 'comp1',
      }

      const result = createApplicationSchema.parse(input)
      expect(result.teamId).toBe('team1')
    })

    it('should reject teamId exceeding max length', () => {
      const input = {
        teamId: '',
        competitionId: 'comp1',
        message: 'Test',
      }

      expect(() => createApplicationSchema.parse(input)).toThrow(ZodError)
    })

    it('should reject message exceeding max length', () => {
      const input = {
        teamId: 'team1',
        competitionId: 'comp1',
        message: 'a'.repeat(1001),
      }

      expect(() => createApplicationSchema.parse(input)).toThrow(ZodError)
    })

    it('should trim whitespace from message', () => {
      const input = {
        teamId: 'team1',
        competitionId: 'comp1',
        message: '  Test message  ',
      }

      const result = createApplicationSchema.parse(input)
      expect(result.message).toBe('Test message')
    })
  })

  describe('updateApplicationStatusSchema', () => {
    it('should validate status update', () => {
      const input = { status: 'accepted' }

      const result = updateApplicationStatusSchema.parse(input)
      expect(result.status).toBe('accepted')
    })

    it('should validate all application statuses', () => {
      const statuses = ['pending', 'accepted', 'rejected']

      statuses.forEach((status) => {
        const result = updateApplicationStatusSchema.parse({ status })
        expect(result.status).toBe(status)
      })
    })

    it('should reject invalid status', () => {
      const input = { status: 'invalid' }

      expect(() => updateApplicationStatusSchema.parse(input)).toThrow(ZodError)
    })
  })

  describe('applicationResponseSchema', () => {
    it('should validate application response', () => {
      const input = {
        applicationId: 'app1',
        status: 'accepted',
      }

      const result = applicationResponseSchema.parse(input)
      expect(result).toBeDefined()
      expect(result.applicationId).toBe('app1')
      expect(result.status).toBe('accepted')
    })

    it('should reject empty applicationId', () => {
      const input = {
        applicationId: '',
        status: 'rejected',
      }

      expect(() => applicationResponseSchema.parse(input)).toThrow(ZodError)
    })
  })
})
