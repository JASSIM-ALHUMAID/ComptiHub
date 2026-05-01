import { describe, it, expect } from 'vitest'
import { createTeamSchema, updateTeamSchema, teamStatusUpdateSchema, addMemberSchema } from '../../modules/teams/team.validation.js'
import { ZodError } from 'zod'

describe('Team Validation', () => {
  describe('createTeamSchema', () => {
    it('should validate valid team creation', () => {
      const input = {
        _id: 'team1',
        name: 'Test Team',
        competitionId: 'comp1',
        leaderId: 'user1',
        description: 'Test team description',
        requiredSkills: ['JavaScript', 'Node.js'],
        totalSlots: 5,
      }

      const result = createTeamSchema.parse(input)
      expect(result).toBeDefined()
      expect(result.name).toBe('Test Team')
      expect(result.totalSlots).toBe(5)
    })

    it('should reject invalid totalSlots', () => {
      const input = {
        _id: 'team1',
        name: 'Test Team',
        competitionId: 'comp1',
        leaderId: 'user1',
        description: 'Test team',
        totalSlots: 0,
      }

      expect(() => createTeamSchema.parse(input)).toThrow(ZodError)
    })

    it('should reject totalSlots exceeding max', () => {
      const input = {
        _id: 'team1',
        name: 'Test Team',
        competitionId: 'comp1',
        leaderId: 'user1',
        description: 'Test team',
        totalSlots: 51,
      }

      expect(() => createTeamSchema.parse(input)).toThrow(ZodError)
    })

    it('should trim whitespace', () => {
      const input = {
        _id: '  team1  ',
        name: '  Test Team  ',
        competitionId: '  comp1  ',
        leaderId: '  user1  ',
        description: '  Test team  ',
        totalSlots: 5,
      }

      const result = createTeamSchema.parse(input)
      expect(result.name).toBe('Test Team')
      expect(result._id).toBe('team1')
    })

    it('should reject name exceeding max length', () => {
      const input = {
        _id: 'team1',
        name: 'a'.repeat(151),
        competitionId: 'comp1',
        leaderId: 'user1',
        description: 'Test team',
        totalSlots: 5,
      }

      expect(() => createTeamSchema.parse(input)).toThrow(ZodError)
    })
  })

  describe('updateTeamSchema', () => {
    it('should validate partial update', () => {
      const input = {
        name: 'Updated Team',
        totalSlots: 10,
      }

      const result = updateTeamSchema.parse(input)
      expect(result.name).toBe('Updated Team')
      expect(result.totalSlots).toBe(10)
    })

    it('should allow empty update', () => {
      const input = {}

      const result = updateTeamSchema.parse(input)
      expect(result).toEqual({})
    })

    it('should reject invalid status', () => {
      const input = {
        status: 'invalid',
      }

      expect(() => updateTeamSchema.parse(input)).toThrow(ZodError)
    })
  })

  describe('teamStatusUpdateSchema', () => {
    it('should validate all team statuses', () => {
      const statuses = ['recruiting', 'full', 'closed', 'archived', 'dissolved']

      statuses.forEach((status) => {
        const result = teamStatusUpdateSchema.parse({ status })
        expect(result.status).toBe(status)
      })
    })

    it('should reject invalid status', () => {
      const input = { status: 'invalid' }

      expect(() => teamStatusUpdateSchema.parse(input)).toThrow(ZodError)
    })
  })

  describe('addMemberSchema', () => {
    it('should validate member addition', () => {
      const input = { memberId: 'user123' }

      const result = addMemberSchema.parse(input)
      expect(result.memberId).toBe('user123')
    })

    it('should reject empty memberId', () => {
      const input = { memberId: '' }

      expect(() => addMemberSchema.parse(input)).toThrow(ZodError)
    })
  })
})
