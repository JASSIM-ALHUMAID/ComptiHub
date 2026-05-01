import { describe, it, expect } from 'vitest'
import { createCompetitionSchema, updateCompetitionSchema, competitionStatusUpdateSchema } from '../../modules/competitions/competition.validation.js'
import { ZodError } from 'zod'

describe('Competition Validation', () => {
  describe('createCompetitionSchema', () => {
    it('should validate valid competition creation', () => {
      const input = {
        _id: 'comp1',
        title: 'Test Competition',
        organizer: 'Test Org',
        category: 'Software',
        mode: 'Online',
        teamSize: '3-5',
        deadline: '2025-12-31',
        status: 'draft',
        prize: '$1000',
        description: 'Test competition',
        startDate: '2025-01-01',
        endDate: '2025-01-15',
        registrationDeadline: '2025-12-31',
        participationType: 'team',
      }

      const result = createCompetitionSchema.parse(input)
      expect(result).toBeDefined()
      expect(result.title).toBe('Test Competition')
    })

    it('should reject invalid status', () => {
      const input = {
        _id: 'comp1',
        title: 'Test Competition',
        organizer: 'Test Org',
        category: 'Software',
        mode: 'Online',
        teamSize: '3-5',
        deadline: '2025-12-31',
        status: 'invalid',
        prize: '$1000',
        description: 'Test competition',
        startDate: '2025-01-01',
        endDate: '2025-01-15',
        registrationDeadline: '2025-12-31',
        participationType: 'team',
      }

      expect(() => createCompetitionSchema.parse(input)).toThrow(ZodError)
    })

    it('should reject invalid participation type', () => {
      const input = {
        _id: 'comp1',
        title: 'Test Competition',
        organizer: 'Test Org',
        category: 'Software',
        mode: 'Online',
        teamSize: '3-5',
        deadline: '2025-12-31',
        status: 'draft',
        prize: '$1000',
        description: 'Test competition',
        startDate: '2025-01-01',
        endDate: '2025-01-15',
        registrationDeadline: '2025-12-31',
        participationType: 'invalid',
      }

      expect(() => createCompetitionSchema.parse(input)).toThrow(ZodError)
    })

    it('should trim whitespace from strings', () => {
      const input = {
        _id: '  comp1  ',
        title: '  Test Competition  ',
        organizer: '  Test Org  ',
        category: '  Software  ',
        mode: '  Online  ',
        teamSize: '  3-5  ',
        deadline: '  2025-12-31  ',
        status: 'draft',
        prize: '  $1000  ',
        description: '  Test competition  ',
        startDate: '  2025-01-01  ',
        endDate: '  2025-01-15  ',
        registrationDeadline: '  2025-12-31  ',
        participationType: 'team',
      }

      const result = createCompetitionSchema.parse(input)
      expect(result.title).toBe('Test Competition')
      expect(result._id).toBe('comp1')
    })

    it('should reject title exceeding max length', () => {
      const input = {
        _id: 'comp1',
        title: 'a'.repeat(201),
        organizer: 'Test Org',
        category: 'Software',
        mode: 'Online',
        teamSize: '3-5',
        deadline: '2025-12-31',
        status: 'draft',
        prize: '$1000',
        description: 'Test competition',
        startDate: '2025-01-01',
        endDate: '2025-01-15',
        registrationDeadline: '2025-12-31',
        participationType: 'team',
      }

      expect(() => createCompetitionSchema.parse(input)).toThrow(ZodError)
    })
  })

  describe('updateCompetitionSchema', () => {
    it('should validate valid update', () => {
      const input = {
        title: 'Updated Title',
        status: 'open',
      }

      const result = updateCompetitionSchema.parse(input)
      expect(result.title).toBe('Updated Title')
    })

    it('should allow partial updates', () => {
      const input = {
        prize: '$2000',
      }

      const result = updateCompetitionSchema.parse(input)
      expect(result.prize).toBe('$2000')
    })

    it('should allow empty update', () => {
      const input = {}

      const result = updateCompetitionSchema.parse(input)
      expect(result).toEqual({})
    })
  })

  describe('competitionStatusUpdateSchema', () => {
    it('should validate status update', () => {
      const input = { status: 'open' }

      const result = competitionStatusUpdateSchema.parse(input)
      expect(result.status).toBe('open')
    })

    it('should reject invalid status', () => {
      const input = { status: 'invalid' }

      expect(() => competitionStatusUpdateSchema.parse(input)).toThrow(ZodError)
    })

    it('should validate all status types', () => {
      const statuses = ['open', 'closed', 'draft', 'upcoming', 'active', 'ended']

      statuses.forEach((status) => {
        const result = competitionStatusUpdateSchema.parse({ status })
        expect(result.status).toBe(status)
      })
    })
  })
})
