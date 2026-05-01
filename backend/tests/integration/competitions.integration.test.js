import { describe, it, expect, beforeEach, afterEach } from 'vitest'
import { MongoMemoryServer } from 'mongodb-memory-server'
import mongoose from 'mongoose'
import request from 'supertest'
import { createApp } from '../../app.js'
import { User } from '../../modules/auth/user.model.js'
import { Competition } from '../../modules/competitions/competition.model.js'
import bcrypt from 'bcrypt'

let app
let mongoServer
let adminToken
let studentToken
let adminUser

describe('Competitions Integration Tests', () => {
  beforeEach(async () => {
    mongoServer = await MongoMemoryServer.create()
    const mongoUri = mongoServer.getUri()
    await mongoose.connect(mongoUri)
    app = createApp()

    // Create admin user
    adminUser = await User.create({
      username: 'admin',
      email: 'admin@example.com',
      passwordHash: await bcrypt.hash('Password123', 12),
      systemRole: 'admin',
      activeRole: 'admin',
      accountStatus: 'active',
    })
    adminToken = adminUser.issueAccessToken()

    // Create student user
    const studentUser = await User.create({
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

  describe('GET /competitions', () => {
    it('should list all competitions', async () => {
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

      const response = await request(app).get('/api/v1/competitions')

      expect(response.status).toBe(200)
      expect(response.body.success).toBe(true)
      expect(response.body.data.competitions).toBeDefined()
      expect(response.body.data.competitions.length).toBe(1)
    })

    it('should filter competitions by status', async () => {
      await Competition.create({
        _id: 'comp1',
        title: 'Open Competition',
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

      await Competition.create({
        _id: 'comp2',
        title: 'Closed Competition',
        organizer: 'Test Org',
        category: 'Software',
        mode: 'Online',
        teamSize: '3-5',
        deadline: '2024-12-31',
        status: 'closed',
        prize: '$1000',
        description: 'Test competition',
        startDate: '2024-01-01',
        endDate: '2024-01-15',
        registrationDeadline: '2024-12-31',
        participationType: 'team',
      })

      const response = await request(app)
        .get('/api/v1/competitions')
        .query({ status: 'open' })

      expect(response.status).toBe(200)
      expect(response.body.data.competitions.length).toBe(1)
      expect(response.body.data.competitions[0].status).toBe('open')
    })
  })

  describe('POST /admin/competitions', () => {
    it('should reject student access to create competition', async () => {
      const response = await request(app)
        .post('/api/v1/admin/competitions')
        .set('Authorization', `Bearer ${studentToken}`)
        .send({
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
        })

      expect(response.status).toBe(403)
      expect(response.body.success).toBe(false)
    })

    it('should allow admin to create competition', async () => {
      const response = await request(app)
        .post('/api/v1/admin/competitions')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
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
          createdBy: adminUser._id.toString(),
        })

      expect([200, 201]).toContain(response.status)
      expect(response.body.success).toBe(true)
    })
  })

  describe('GET /competitions/:id', () => {
    it('should return competition details', async () => {
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

      const response = await request(app).get('/api/v1/competitions/comp1')

      expect(response.status).toBe(200)
      expect(response.body.success).toBe(true)
      expect(response.body.data.competition.title).toBe('Test Competition')
    })

    it('should return 404 for nonexistent competition', async () => {
      const response = await request(app).get('/api/v1/competitions/nonexistent')

      expect(response.status).toBe(404)
    })
  })
})
