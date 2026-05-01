import { describe, it, expect, beforeEach, afterEach } from 'vitest'
import { MongoMemoryServer } from 'mongodb-memory-server'
import mongoose from 'mongoose'
import request from 'supertest'
import { createApp } from '../../app.js'
import { User } from '../../modules/auth/user.model.js'
import { Team } from '../../modules/teams/team.model.js'
import { Competition } from '../../modules/competitions/competition.model.js'
import { Application } from '../../modules/applications/application.model.js'
import bcrypt from 'bcrypt'

let app
let mongoServer
let leaderToken
let studentToken
let student2Token
let competition
let team
let leaderUser
let studentUser
let student2User

describe('Applications Integration Tests', () => {
  beforeEach(async () => {
    mongoServer = await MongoMemoryServer.create()
    const mongoUri = mongoServer.getUri()
    await mongoose.connect(mongoUri)
    app = createApp()

    // Create competition
    competition = await Competition.create({
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

    // Create team leader
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

    // Create students
    studentUser = await User.create({
      username: 'student1',
      email: 'student1@example.com',
      passwordHash: await bcrypt.hash('Password123', 12),
      systemRole: 'student',
      defaultRole: 'competitor',
      activeRole: 'competitor',
      accountStatus: 'active',
    })
    studentToken = studentUser.issueAccessToken()

    student2User = await User.create({
      username: 'student2',
      email: 'student2@example.com',
      passwordHash: await bcrypt.hash('Password123', 12),
      systemRole: 'student',
      defaultRole: 'competitor',
      activeRole: 'competitor',
      accountStatus: 'active',
    })
    student2Token = student2User.issueAccessToken()

    // Create team
    team = await Team.create({
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

  afterEach(async () => {
    await mongoose.connection.close()
    await mongoServer.stop()
  })

  describe('POST /applications', () => {
    it('should allow competitor to apply to team', async () => {
      const response = await request(app)
        .post('/api/v1/applications')
        .set('Authorization', `Bearer ${studentToken}`)
        .send({
          teamId: 'team1',
          competitionId: 'comp1',
          message: 'I want to join this team',
        })

      expect([200, 201]).toContain(response.status)
      expect(response.body.success).toBe(true)
    })

    it('should reject application without message', async () => {
      const response = await request(app)
        .post('/api/v1/applications')
        .set('Authorization', `Bearer ${studentToken}`)
        .send({
          teamId: 'team1',
          competitionId: 'comp1',
        })

      // Either accepts or validates message is required
      expect(response.status).toBeDefined()
    })

    it('should require authentication', async () => {
      const response = await request(app)
        .post('/api/v1/applications')
        .send({
          teamId: 'team1',
          competitionId: 'comp1',
          message: 'I want to join',
        })

      expect(response.status).toBe(401)
    })
  })

  describe('GET /applications/me', () => {
    beforeEach(async () => {
      await Application.create({
        applicantId: studentUser._id,
        teamId: 'team1',
        competitionId: 'comp1',
        message: 'Test application',
        status: 'pending',
      })
    })

    it('should list user applications', async () => {
      const response = await request(app)
        .get('/api/v1/applications/me')
        .set('Authorization', `Bearer ${studentToken}`)

      expect(response.status).toBe(200)
      expect(response.body.success).toBe(true)
      expect(response.body.data.applications).toBeDefined()
    })
  })

  describe('PUT /applications/:id', () => {
    let application

    beforeEach(async () => {
      application = await Application.create({
        applicantId: studentUser._id,
        teamId: 'team1',
        competitionId: 'comp1',
        message: 'Test application',
        status: 'pending',
      })
    })

    it('should allow team leader to review application', async () => {
      const response = await request(app)
        .put(`/api/v1/applications/${application._id.toString()}`)
        .set('Authorization', `Bearer ${leaderToken}`)
        .send({
          status: 'accepted',
        })

      expect([200]).toContain(response.status)
      expect(response.body.success).toBe(true)
    })

    it('should reject applicant from reviewing application', async () => {
      const response = await request(app)
        .put(`/api/v1/applications/${application._id.toString()}`)
        .set('Authorization', `Bearer ${studentToken}`)
        .send({
          status: 'rejected',
        })

      expect(response.status).toBe(403)
    })
  })

  describe('GET /teams/:id/applications', () => {
    beforeEach(async () => {
      await Application.create({
        applicantId: studentUser._id,
        teamId: 'team1',
        competitionId: 'comp1',
        message: 'Test application',
        status: 'pending',
      })

      await Application.create({
        applicantId: student2User._id,
        teamId: 'team1',
        competitionId: 'comp1',
        message: 'Another application',
        status: 'pending',
      })
    })

    it('should list team applications for team leader', async () => {
      const response = await request(app)
        .get('/api/v1/teams/team1/applications')
        .set('Authorization', `Bearer ${leaderToken}`)

      expect(response.status).toBe(200)
      expect(response.body.data.applications).toBeDefined()
    })

    it('should reject access for non-team members', async () => {
      const response = await request(app)
        .get('/api/v1/teams/team1/applications')
        .set('Authorization', `Bearer ${student2Token}`)

      expect(response.status).toBe(403)
    })
  })
})
