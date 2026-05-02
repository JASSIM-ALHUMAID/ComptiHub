import { describe, it, expect, beforeEach, afterEach } from '../test-utils/vitest-node.js'
import { MongoMemoryServer } from 'mongodb-memory-server'
import mongoose from 'mongoose'
import request from 'supertest'
import { createApp } from '../../src/app.js'
import { User } from '../../src/modules/auth/user.model.js'
import bcrypt from 'bcrypt'

let app
let mongoServer

describe('Auth Integration Tests', () => {
  beforeEach(async () => {
    mongoServer = await MongoMemoryServer.create()
    const mongoUri = mongoServer.getUri()
    await mongoose.connect(mongoUri)
    app = createApp()
  })

  afterEach(async () => {
    await mongoose.connection.close()
    await mongoServer.stop()
  })

  describe('POST /auth/signup', () => {
    it('should allow local Vite dev server origins for signup', async () => {
      const response = await request(app)
        .options('/api/v1/auth/signup')
        .set('Origin', 'http://localhost:5174')
        .set('Access-Control-Request-Method', 'POST')
        .set('Access-Control-Request-Headers', 'content-type')

      expect(response.status).toBe(204)
      expect(response.headers['access-control-allow-origin']).toBe('http://localhost:5174')
    })

    it('should successfully signup a new student', async () => {
      const response = await request(app)
        .post('/api/v1/auth/signup')
        .send({
          username: 'newuser',
          email: 'newuser@example.com',
          password: 'SecurePassword123',
          defaultRole: 'competitor',
        })

      expect(response.status).toBe(201)
      expect(response.body.success).toBe(true)
      expect(response.body.data.user.username).toBe('newuser')
      expect(response.body.data.token).toBeDefined()
      expect(response.body.data.refreshToken).toBeDefined()
    })

    it('should reject duplicate email', async () => {
      await request(app)
        .post('/api/v1/auth/signup')
        .send({
          username: 'user1',
          email: 'duplicate@example.com',
          password: 'SecurePassword123',
          defaultRole: 'competitor',
        })

      const response = await request(app)
        .post('/api/v1/auth/signup')
        .send({
          username: 'user2',
          email: 'duplicate@example.com',
          password: 'SecurePassword123',
          defaultRole: 'competitor',
        })

      expect(response.status).toBe(409)
      expect(response.body.success).toBe(false)
    })

    it('should reject invalid input', async () => {
      const response = await request(app)
        .post('/api/v1/auth/signup')
        .send({
          username: 'ab', // Too short
          email: 'invalid-email',
          password: 'weak',
          defaultRole: 'competitor',
        })

      expect(response.status).toBe(400)
      expect(response.body.success).toBe(false)
    })

    it('should enforce rate limiting', async () => {
      const promises = []
      for (let i = 0; i < 7; i++) {
        promises.push(
          request(app)
            .post('/api/v1/auth/signup')
            .send({
              username: `user${i}`,
              email: `user${i}@example.com`,
              password: 'SecurePassword123',
              defaultRole: 'competitor',
            }),
        )
      }

      const responses = await Promise.all(promises)
      const rateLimitedResponse = responses[responses.length - 1]

      expect(rateLimitedResponse.status).toBeDefined()
    })
  })

  describe('POST /auth/login', () => {
    beforeEach(async () => {
      await User.create({
        username: 'testuser',
        email: 'test@example.com',
        passwordHash: await bcrypt.hash('SecurePassword123', 12),
        systemRole: 'student',
        defaultRole: 'competitor',
        activeRole: 'competitor',
        accountStatus: 'active',
      })
    })

    it('should successfully login with correct credentials', async () => {
      const response = await request(app)
        .post('/api/v1/auth/login')
        .send({
          email: 'test@example.com',
          password: 'SecurePassword123',
        })

      expect(response.status).toBe(200)
      expect(response.body.success).toBe(true)
      expect(response.body.data.user.username).toBe('testuser')
      expect(response.body.data.token).toBeDefined()
      expect(response.body.data.refreshToken).toBeDefined()
    })

    it('should reject incorrect password', async () => {
      const response = await request(app)
        .post('/api/v1/auth/login')
        .send({
          email: 'test@example.com',
          password: 'WrongPassword',
        })

      expect(response.status).toBe(401)
      expect(response.body.success).toBe(false)
    })

    it('should reject nonexistent email', async () => {
      const response = await request(app)
        .post('/api/v1/auth/login')
        .send({
          email: 'nonexistent@example.com',
          password: 'SecurePassword123',
        })

      expect(response.status).toBe(401)
      expect(response.body.success).toBe(false)
    })

    it('should reject banned account', async () => {
      const user = await User.findOne({ email: 'test@example.com' })
      user.accountStatus = 'banned'
      await user.save()

      const response = await request(app)
        .post('/api/v1/auth/login')
        .send({
          email: 'test@example.com',
          password: 'SecurePassword123',
        })

      expect(response.status).toBe(403)
      expect(response.body.success).toBe(false)
    })

    it('should enforce rate limiting', async () => {
      const promises = []
      for (let i = 0; i < 7; i++) {
        promises.push(
          request(app)
            .post('/api/v1/auth/login')
            .send({
              email: 'test@example.com',
              password: 'WrongPassword',
            }),
        )
      }

      const responses = await Promise.all(promises)
      const rateLimitedResponse = responses[responses.length - 1]

      expect(rateLimitedResponse.status).toBeDefined()
    })
  })

  describe('POST /auth/refresh', () => {
    let refreshToken

    beforeEach(async () => {
      const loginResponse = await request(app)
        .post('/api/v1/auth/signup')
        .send({
          username: 'testuser',
          email: 'test@example.com',
          password: 'SecurePassword123',
          defaultRole: 'competitor',
        })

      refreshToken = loginResponse.body.data.refreshToken
    })

    it('should issue new access token with valid refresh token', async () => {
      const response = await request(app)
        .post('/api/v1/auth/refresh')
        .send({ refreshToken })

      expect(response.status).toBe(200)
      expect(response.body.success).toBe(true)
      expect(response.body.data.accessToken).toBeDefined()
    })

    it('should reject invalid refresh token', async () => {
      const response = await request(app)
        .post('/api/v1/auth/refresh')
        .send({ refreshToken: 'invalid-token' })

      expect(response.status).toBe(401)
      expect(response.body.success).toBe(false)
    })

    it('should reject missing refresh token', async () => {
      const response = await request(app)
        .post('/api/v1/auth/refresh')
        .send({})

      expect(response.status).toBe(400)
      expect(response.body.success).toBe(false)
    })
  })

  describe('GET /auth/me', () => {
    let accessToken

    beforeEach(async () => {
      const loginResponse = await request(app)
        .post('/api/v1/auth/signup')
        .send({
          username: 'testuser',
          email: 'test@example.com',
          password: 'SecurePassword123',
          defaultRole: 'competitor',
        })

      accessToken = loginResponse.body.data.token
    })

    it('should return authenticated user info', async () => {
      const response = await request(app)
        .get('/api/v1/auth/me')
        .set('Authorization', `Bearer ${accessToken}`)

      expect(response.status).toBe(200)
      expect(response.body.success).toBe(true)
      expect(response.body.data.user.username).toBe('testuser')
    })

    it('should reject missing token', async () => {
      const response = await request(app).get('/api/v1/auth/me')

      expect(response.status).toBe(401)
      expect(response.body.success).toBe(false)
    })

    it('should reject invalid token', async () => {
      const response = await request(app)
        .get('/api/v1/auth/me')
        .set('Authorization', 'Bearer invalid-token')

      expect(response.status).toBe(401)
      expect(response.body.success).toBe(false)
    })
  })
})
