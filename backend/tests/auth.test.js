import assert from 'node:assert/strict'
import { after, before, beforeEach, describe, it } from 'node:test'
import { MongoMemoryServer } from 'mongodb-memory-server'
import mongoose from 'mongoose'
import express from 'express'
import request from 'supertest'
import { createApp } from '../src/app.js'
import { authenticate, requireSystemRole } from '../src/middlewares/auth.js'
import { errorHandler } from '../src/middlewares/errorHandler.js'
import { User } from '../src/modules/auth/user.model.js'

const app = createApp()
let mongoServer

before(async () => {
  mongoServer = await MongoMemoryServer.create()
  await mongoose.connect(mongoServer.getUri())
})

beforeEach(async () => {
  await mongoose.connection.db.dropDatabase()
})

after(async () => {
  if (mongoose.connection.readyState !== 0) {
    await mongoose.disconnect()
  }
  if (mongoServer) {
    await mongoServer.stop()
  }
})

async function signup(overrides = {}) {
  return request(app)
    .post('/api/v1/auth/signup')
    .send({
      username: 'student1',
      email: 'student@example.com',
      password: 'Password123!',
      defaultRole: 'competitor',
      ...overrides,
    })
}

describe('auth routes', () => {
  it('creates a student account with a hashed password and session data', async () => {
    const response = await signup()

    assert.equal(response.status, 201)
    assert.equal(response.body.success, true)
    assert.equal(response.body.data.user.email, 'student@example.com')
    assert.equal(response.body.data.user.systemRole, 'student')
    assert.equal(response.body.data.user.defaultRole, 'competitor')
    assert.equal(response.body.data.user.activeRole, 'competitor')
    assert.ok(response.body.data.token)
    assert.equal(response.body.data.user.passwordHash, undefined)

    const user = await User.findOne({ email: 'student@example.com' }).select('+passwordHash').lean()
    assert.ok(user.passwordHash)
    assert.notEqual(user.passwordHash, 'Password123!')
  })

  it('rejects duplicate username and email values', async () => {
    await signup()

    const duplicateEmail = await signup({ username: 'student2' })
    assert.equal(duplicateEmail.status, 409)
    assert.match(duplicateEmail.body.error.message, /email/i)

    const duplicateUsername = await signup({ email: 'other@example.com' })
    assert.equal(duplicateUsername.status, 409)
    assert.match(duplicateUsername.body.error.message, /username/i)
  })

  it('logs in active users and uses defaultRole for activeRole', async () => {
    await signup({ defaultRole: 'teamLeader' })

    const response = await request(app).post('/api/v1/auth/login').send({
      email: 'student@example.com',
      password: 'Password123!',
    })

    assert.equal(response.status, 200)
    assert.equal(response.body.data.user.defaultRole, 'teamLeader')
    assert.equal(response.body.data.user.activeRole, 'teamLeader')
    assert.ok(response.body.data.token)
  })

  it('prevents suspended and banned users from logging in', async () => {
    await signup()
    await User.updateOne({ email: 'student@example.com' }, { accountStatus: 'suspended' })

    const suspended = await request(app).post('/api/v1/auth/login').send({
      email: 'student@example.com',
      password: 'Password123!',
    })

    assert.equal(suspended.status, 403)
    assert.match(suspended.body.error.message, /suspended/i)

    await User.updateOne({ email: 'student@example.com' }, { accountStatus: 'banned' })
    const banned = await request(app).post('/api/v1/auth/login').send({
      email: 'student@example.com',
      password: 'Password123!',
    })

    assert.equal(banned.status, 403)
    assert.match(banned.body.error.message, /banned/i)
  })

  it('returns the authenticated user from auth me', async () => {
    const signupResponse = await signup()

    const response = await request(app)
      .get('/api/v1/auth/me')
      .set('Authorization', `Bearer ${signupResponse.body.data.token}`)

    assert.equal(response.status, 200)
    assert.equal(response.body.data.user.email, 'student@example.com')
  })

  it('updates defaultRole and activeRole for student users', async () => {
    const signupResponse = await signup()
    const token = signupResponse.body.data.token

    const defaultRole = await request(app)
      .patch('/api/v1/auth/default-role')
      .set('Authorization', `Bearer ${token}`)
      .send({ defaultRole: 'teamLeader' })

    assert.equal(defaultRole.status, 200)
    assert.equal(defaultRole.body.data.user.defaultRole, 'teamLeader')

    const activeRole = await request(app)
      .patch('/api/v1/auth/active-role')
      .set('Authorization', `Bearer ${token}`)
      .send({ activeRole: 'competitor' })

    assert.equal(activeRole.status, 200)
    assert.equal(activeRole.body.data.user.activeRole, 'competitor')
  })

  it('updates username and email for the authenticated user', async () => {
    const signupResponse = await signup()
    const token = signupResponse.body.data.token

    const response = await request(app)
      .patch('/api/v1/auth/me')
      .set('Authorization', `Bearer ${token}`)
      .send({
        username: 'student-updated',
        email: 'updated@example.com',
      })

    assert.equal(response.status, 200)
    assert.equal(response.body.data.user.username, 'student-updated')
    assert.equal(response.body.data.user.email, 'updated@example.com')
  })

  it('prevents admins from switching to student roles', async () => {
    const admin = await User.create({
      username: 'admin1',
      email: 'admin@example.com',
      passwordHash: 'not-used',
      systemRole: 'admin',
      activeRole: 'admin',
      accountStatus: 'active',
    })
    const token = admin.issueAccessToken()

    const response = await request(app)
      .patch('/api/v1/auth/active-role')
      .set('Authorization', `Bearer ${token}`)
      .send({ activeRole: 'competitor' })

    assert.equal(response.status, 403)
  })

  it('supports logout as an authenticated no-op', async () => {
    const signupResponse = await signup()

    const response = await request(app)
      .post('/api/v1/auth/logout')
      .set('Authorization', `Bearer ${signupResponse.body.data.token}`)

    assert.equal(response.status, 200)
    assert.equal(response.body.success, true)
  })
})

describe('RBAC middleware', () => {
  it('allows student-only routes for students and admin-only routes for admins', async () => {
    const signupResponse = await signup()
    const studentToken = signupResponse.body.data.token

    const admin = await User.create({
      username: 'admin1',
      email: 'admin@example.com',
      passwordHash: 'not-used',
      systemRole: 'admin',
      activeRole: 'admin',
      accountStatus: 'active',
    })
    const adminToken = admin.issueAccessToken()
    const rbacApp = express()
    rbacApp.get('/student', authenticate, requireSystemRole('student'), (_req, res) => res.sendStatus(200))
    rbacApp.get('/admin', authenticate, requireSystemRole('admin'), (_req, res) => res.sendStatus(200))
    rbacApp.use(errorHandler)

    assert.equal(
      (await request(rbacApp).get('/student').set('Authorization', `Bearer ${studentToken}`)).status,
      200,
    )
    assert.equal(
      (await request(rbacApp).get('/admin').set('Authorization', `Bearer ${adminToken}`)).status,
      200,
    )
    assert.equal(
      (await request(rbacApp).get('/admin').set('Authorization', `Bearer ${studentToken}`)).status,
      403,
    )
    assert.equal(
      (await request(rbacApp).get('/student').set('Authorization', `Bearer ${adminToken}`)).status,
      403,
    )
  })
})
