import { describe, it, expect, beforeEach, afterEach } from '../test-utils/vitest-node.js'
import { MongoMemoryServer } from 'mongodb-memory-server'
import mongoose from 'mongoose'
import request from 'supertest'
import { createApp } from '../../src/app.js'
import { User } from '../../src/modules/auth/user.model.js'
import { Team } from '../../src/modules/teams/team.model.js'
import { Competition } from '../../src/modules/competitions/competition.model.js'
import bcrypt from 'bcrypt'

let app
let mongoServer
let leaderToken
let studentToken
let leaderUser
let studentUser

describe('Teams Integration Tests', () => {
  beforeEach(async () => {
    mongoServer = await MongoMemoryServer.create()
    const mongoUri = mongoServer.getUri()
    await mongoose.connect(mongoUri)
    app = createApp()

    // Create competition
    await Competition.create({
      _id: 'comp1',
      title: 'Test Competition',
      organizer: 'Test Org',
      category: 'Software',
      mode: 'Online',
      teamSize: '3-5',
      deadline: '2025-12-31',
      status: 'open',
      prize: '$1000',
      description: 'Test competition',
      startDate: '2025-01-01',
      endDate: '2025-01-15',
      registrationDeadline: '2025-12-31',
      participationType: 'team',
    })

    // Create team leader user
    leaderUser = await User.create({
      username: 'leader',
      email: 'leader@example.com',
      passwordHash: await bcrypt.hash('Password123', 12),
      systemRole: 'student',
      defaultRole: 'teamLeader',
      activeRole: 'teamLeader',
      accountStatus: 'active',
    })
    leaderToken = leaderUser.issueAccessToken()

    // Create competitor user
    studentUser = await User.create({
      username: 'student',
      email: 'student@example.com',
      passwordHash: await bcrypt.hash('Password123', 12),
      systemRole: 'student',
      defaultRole: 'competitor',
      activeRole: 'competitor',
      accountStatus: 'active',
    })
    studentToken = studentUser.issueAccessToken()
  })

  afterEach(async () => {
    await mongoose.connection.close()
    await mongoServer.stop()
  })

  describe('POST /teams', () => {
    it('should allow team leader to create team', async () => {
      const response = await request(app)
        .post('/api/v1/teams')
        .set('Authorization', `Bearer ${leaderToken}`)
        .send({
          _id: 'team1',
          name: 'Test Team',
          competitionId: 'comp1',
          leaderId: leaderUser._id.toString(),
          description: 'Test team description',
          requiredSkills: ['JavaScript', 'Node.js'],
          totalSlots: 5,
          status: 'recruiting',
        })

      expect([200, 201]).toContain(response.status)
      expect(response.body.success).toBe(true)
    })

    it('should reject competitor from creating team', async () => {
      const response = await request(app)
        .post('/api/v1/teams')
        .set('Authorization', `Bearer ${studentToken}`)
        .send({
          _id: 'team1',
          name: 'Test Team',
          competitionId: 'comp1',
          leaderId: studentUser._id.toString(),
          description: 'Test team description',
          requiredSkills: ['JavaScript'],
          totalSlots: 5,
        })

      expect(response.status).toBe(403)
    })
  })

  describe('GET /teams', () => {
    beforeEach(async () => {
      await Team.create({
        _id: 'team1',
        name: 'Test Team',
        competitionId: 'comp1',
        leaderId: leaderUser._id.toString(),
        description: 'Test team',
        totalSlots: 5,
        memberIds: [],
        status: 'recruiting',
      })
    })

    it('should list teams for competition', async () => {
      const response = await request(app)
        .get('/api/v1/competitions/comp1/teams')
        .set('Authorization', `Bearer ${studentToken}`)

      expect(response.status).toBe(200)
      expect(response.body.data.teams).toBeDefined()
    })
  })

  describe('PUT /teams/:id', () => {
    beforeEach(async () => {
      await Team.create({
        _id: 'team1',
        name: 'Test Team',
        competitionId: 'comp1',
        leaderId: leaderUser._id.toString(),
        description: 'Test team',
        totalSlots: 5,
        memberIds: [],
        status: 'recruiting',
      })
    })

    it('should allow team leader to update team', async () => {
      const response = await request(app)
        .put('/api/v1/teams/team1')
        .set('Authorization', `Bearer ${leaderToken}`)
        .send({
          name: 'Updated Team Name',
          description: 'Updated description',
        })

      expect([200]).toContain(response.status)
      expect(response.body.success).toBe(true)
    })

    it('should reject other users from updating team', async () => {
      const response = await request(app)
        .put('/api/v1/teams/team1')
        .set('Authorization', `Bearer ${studentToken}`)
        .send({
          name: 'Updated Team Name',
        })

      expect(response.status).toBe(403)
    })
  })
})
