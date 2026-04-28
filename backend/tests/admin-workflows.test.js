import assert from 'node:assert/strict'
import { after, before, beforeEach, describe, it } from 'node:test'
import { MongoMemoryServer } from 'mongodb-memory-server'
import mongoose from 'mongoose'
import request from 'supertest'
import { createApp } from '../src/app.js'
import { User } from '../src/modules/auth/user.model.js'
import { ModerationAction } from '../src/modules/moderation/moderationAction.model.js'
import { CompetitionSuggestion } from '../src/modules/suggestions/competitionSuggestion.model.js'

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

async function createStudent(overrides = {}) {
  return User.create({
    username: overrides.username || 'student',
    email: overrides.email || 'student@example.com',
    passwordHash: 'not-used',
    systemRole: 'student',
    defaultRole: overrides.defaultRole || 'competitor',
    activeRole: overrides.activeRole || overrides.defaultRole || 'competitor',
    accountStatus: 'active',
    ...overrides,
  })
}

async function createAdmin(overrides = {}) {
  return User.create({
    username: overrides.username || 'admin',
    email: overrides.email || 'admin@example.com',
    passwordHash: 'not-used',
    systemRole: 'admin',
    activeRole: 'admin',
    accountStatus: 'active',
    ...overrides,
  })
}

describe('admin suggestions workflow', () => {
  it('lists, approves, and rejects pending suggestions for admins only', async () => {
    const admin = await createAdmin()
    const student = await createStudent({ username: 'sara', email: 'sara@example.com' })
    const firstSuggestion = await CompetitionSuggestion.create({
      submittedBy: student._id,
      title: 'Neural Network Optimization V2',
      summary: 'Optimize model inference for edge hardware.',
      resourceLink: 'https://example.com/proposal',
      proposedSchedule: 'Oct 15 - Oct 18, 2026',
      hardwareTier: 'GPU Cluster 4',
      budget: '$2,500 USD',
    })
    const secondSuggestion = await CompetitionSuggestion.create({
      submittedBy: student._id,
      title: 'Cyber Defense Squad Gauntlet',
      summary: 'A staged defense competition proposal.',
    })

    const forbidden = await request(app)
      .get('/api/v1/admin/suggestions')
      .set('Authorization', `Bearer ${student.issueAccessToken()}`)

    assert.equal(forbidden.status, 403)

    const list = await request(app)
      .get('/api/v1/admin/suggestions')
      .set('Authorization', `Bearer ${admin.issueAccessToken()}`)

    assert.equal(list.status, 200)
    assert.equal(list.body.data.suggestions.length, 2)
    assert.equal(list.body.data.suggestions[0].student.username, 'sara')

    const approved = await request(app)
      .patch(`/api/v1/admin/suggestions/${firstSuggestion._id}/approve`)
      .set('Authorization', `Bearer ${admin.issueAccessToken()}`)

    assert.equal(approved.status, 200)
    assert.equal(approved.body.data.suggestion.status, 'approved')
    assert.equal(approved.body.data.suggestion.reviewedBy, admin._id.toString())

    const repeated = await request(app)
      .patch(`/api/v1/admin/suggestions/${firstSuggestion._id}/reject`)
      .set('Authorization', `Bearer ${admin.issueAccessToken()}`)

    assert.equal(repeated.status, 409)

    const rejected = await request(app)
      .patch(`/api/v1/admin/suggestions/${secondSuggestion._id}/reject`)
      .set('Authorization', `Bearer ${admin.issueAccessToken()}`)

    assert.equal(rejected.status, 200)
    assert.equal(rejected.body.data.suggestion.status, 'rejected')
  })
})

describe('admin moderation workflow', () => {
  it('lists users, records moderation actions, and blocks suspended users through auth', async () => {
    const admin = await createAdmin()
    const target = await createStudent({ username: 'faisal', email: 'faisal@example.com' })
    const targetToken = target.issueAccessToken()

    const users = await request(app)
      .get('/api/v1/admin/users?search=faisal')
      .set('Authorization', `Bearer ${admin.issueAccessToken()}`)

    assert.equal(users.status, 200)
    assert.equal(users.body.data.users.length, 1)
    assert.equal(users.body.data.users[0].email, 'faisal@example.com')
    assert.equal(users.body.data.users[0].passwordHash, undefined)

    const action = await request(app)
      .post(`/api/v1/admin/users/${target._id}/moderation-actions`)
      .set('Authorization', `Bearer ${admin.issueAccessToken()}`)
      .send({
        penalty: 'Suspend',
        duration: '1 Week',
        reason: 'Repeatedly submitted spam join requests.',
      })

    assert.equal(action.status, 201)
    assert.equal(action.body.data.action.penalty, 'suspend')
    assert.equal(action.body.data.user.accountStatus, 'suspended')

    const storedAction = await ModerationAction.findOne({ targetUserId: target._id }).lean()
    assert.equal(storedAction.adminUserId.toString(), admin._id.toString())
    assert.equal(storedAction.penalty, 'suspend')

    const updatedTarget = await User.findById(target._id).lean()
    assert.equal(updatedTarget.accountStatus, 'suspended')

    const blocked = await request(app).get('/api/v1/auth/me').set('Authorization', `Bearer ${targetToken}`)

    assert.equal(blocked.status, 403)
    assert.match(blocked.body.error.message, /suspended/i)

    const actions = await request(app)
      .get(`/api/v1/admin/users/${target._id}/moderation-actions`)
      .set('Authorization', `Bearer ${admin.issueAccessToken()}`)

    assert.equal(actions.status, 200)
    assert.equal(actions.body.data.actions.length, 1)
    assert.equal(actions.body.data.actions[0].reason, 'Repeatedly submitted spam join requests.')
  })

  it('prevents non-admins and self-moderation', async () => {
    const admin = await createAdmin()
    const student = await createStudent({ username: 'nora', email: 'nora@example.com' })

    const forbidden = await request(app)
      .post(`/api/v1/admin/users/${student._id}/moderation-actions`)
      .set('Authorization', `Bearer ${student.issueAccessToken()}`)
      .send({ penalty: 'ban', reason: 'Policy violation.' })

    assert.equal(forbidden.status, 403)

    const selfModeration = await request(app)
      .post(`/api/v1/admin/users/${admin._id}/moderation-actions`)
      .set('Authorization', `Bearer ${admin.issueAccessToken()}`)
      .send({ penalty: 'ban', reason: 'Testing self moderation.' })

    assert.equal(selfModeration.status, 400)
  })
})
