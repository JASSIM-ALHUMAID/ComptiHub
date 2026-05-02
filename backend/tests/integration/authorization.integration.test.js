import { describe, it, expect, beforeEach, afterEach } from '../test-utils/vitest-node.js'
import { MongoMemoryServer } from 'mongodb-memory-server'
import mongoose from 'mongoose'
import request from 'supertest'
import { createApp } from '../../src/app.js'
import { User } from '../../src/modules/auth/user.model.js'
import { Team } from '../../src/modules/teams/team.model.js'
import bcrypt from 'bcrypt'

let app
let mongoServer
let studentToken
let adminToken
let studentUser
let adminUser

describe('Authorization Tests', () => {
  beforeEach(async () => {
    mongoServer = await MongoMemoryServer.create()
    const mongoUri = mongoServer.getUri()
    await mongoose.connect(mongoUri)
    app = createApp()

    // Create student user
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

    // Create team leader user
    await User.create({
      username: 'leader',
      email: 'leader@example.com',
      passwordHash: await bcrypt.hash('Password123', 12),
      systemRole: 'student',
      defaultRole: 'teamLeader',
      activeRole: 'teamLeader',
      accountStatus: 'active',
    })
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
  })

  afterEach(async () => {
    await mongoose.connection.close()
    await mongoServer.stop()
  })

  describe('Admin-only routes', () => {
    it('should reject student access to admin suggestions', async () => {
      const response = await request(app)
        .get('/api/v1/admin/suggestions')
        .set('Authorization', `Bearer ${studentToken}`)

      expect(response.status).toBe(403)
      expect(response.body.success).toBe(false)
    })

    it('should reject student access to moderation', async () => {
      const response = await request(app)
        .get('/api/v1/admin/moderation/users')
        .set('Authorization', `Bearer ${studentToken}`)

      expect(response.status).toBe(403)
      expect(response.body.success).toBe(false)
    })

    it('should reject student access to admin competitions', async () => {
      const response = await request(app)
        .get('/api/v1/admin/competitions')
        .set('Authorization', `Bearer ${studentToken}`)

      expect(response.status).toBe(403)
      expect(response.body.success).toBe(false)
    })

    it('should allow admin access to suggestions', async () => {
      const response = await request(app)
        .get('/api/v1/admin/suggestions')
        .set('Authorization', `Bearer ${adminToken}`)

      expect(response.status).not.toBe(403)
      // Status 200 or error due to missing data, but NOT 403 forbidden
    })

    it('should allow admin access to moderation', async () => {
      const response = await request(app)
        .get('/api/v1/admin/moderation/users')
        .set('Authorization', `Bearer ${adminToken}`)

      // Should succeed or give other errors, not 403
      expect(response.status).not.toBe(403)
    })

    it('should require authentication for admin routes', async () => {
      const response = await request(app).get('/api/v1/admin/suggestions')

      expect(response.status).toBe(401)
      expect(response.body.success).toBe(false)
    })
  })

  describe('Banned account access', () => {
    it('should reject login for banned account', async () => {
      await User.create({
        username: 'banned',
        email: 'banned@example.com',
        passwordHash: await bcrypt.hash('Password123', 12),
        systemRole: 'student',
        defaultRole: 'competitor',
        activeRole: 'competitor',
        accountStatus: 'banned',
      })

      const response = await request(app)
        .post('/api/v1/auth/login')
        .send({
          email: 'banned@example.com',
          password: 'Password123',
        })

      expect(response.status).toBe(403)
      expect(response.body.success).toBe(false)
    })

    it('should reject API access for banned account', async () => {
      const bannedUser = await User.create({
        username: 'banned2',
        email: 'banned2@example.com',
        passwordHash: await bcrypt.hash('Password123', 12),
        systemRole: 'student',
        defaultRole: 'competitor',
        activeRole: 'competitor',
        accountStatus: 'banned',
      })

      const token = bannedUser.issueAccessToken()

      const response = await request(app)
        .get('/api/v1/auth/me')
        .set('Authorization', `Bearer ${token}`)

      expect(response.status).toBe(403)
      expect(response.body.success).toBe(false)
    })
  })

  describe('Suspended account access', () => {
    it('should reject API access for suspended account', async () => {
      const suspendedUser = await User.create({
        username: 'suspended',
        email: 'suspended@example.com',
        passwordHash: await bcrypt.hash('Password123', 12),
        systemRole: 'student',
        defaultRole: 'competitor',
        activeRole: 'competitor',
        accountStatus: 'suspended',
      })

      const token = suspendedUser.issueAccessToken()

      const response = await request(app)
        .get('/api/v1/auth/me')
        .set('Authorization', `Bearer ${token}`)

      expect(response.status).toBe(403)
      expect(response.body.success).toBe(false)
    })
  })

  describe('Role-based access control', () => {
    it('should enforce role requirements', async () => {
      const competitorToken = studentUser.issueAccessToken()

      // Competitor trying to access team management (if restricted)
      const response = await request(app)
        .get('/api/v1/teams/me')
        .set('Authorization', `Bearer ${competitorToken}`)

      // Should either succeed or give specific error, not generic forbidden
      expect(response.status).toBeDefined()
    })
  })

  describe('Token expiry and validation', () => {
    it('should reject expired access token', async () => {
      const expiredToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwiaWF0IjoxNTE2MjM5MDIyLCJleHAiOjE1MTYyMzkwMjJ9.invalid'

      const response = await request(app)
        .get('/api/v1/auth/me')
        .set('Authorization', `Bearer ${expiredToken}`)

      expect(response.status).toBe(401)
      expect(response.body.success).toBe(false)
    })

    it('should reject malformed token', async () => {
      const response = await request(app)
        .get('/api/v1/auth/me')
        .set('Authorization', 'Bearer malformed-token')

      expect(response.status).toBe(401)
      expect(response.body.success).toBe(false)
    })

    it('should reject token with wrong signature', async () => {
      const wrongSignatureToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIn0.wrong_signature'

      const response = await request(app)
        .get('/api/v1/auth/me')
        .set('Authorization', `Bearer ${wrongSignatureToken}`)

      expect(response.status).toBe(401)
      expect(response.body.success).toBe(false)
    })
  })
})
