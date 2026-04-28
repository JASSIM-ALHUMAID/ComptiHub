import assert from 'node:assert/strict'
import { after, before, beforeEach, describe, it } from 'node:test'
import { MongoMemoryServer } from 'mongodb-memory-server'
import mongoose from 'mongoose'
import request from 'supertest'
import { createApp } from '../src/app.js'
import { Competition } from '../src/modules/competitions/competition.model.js'
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
  await mongoose.disconnect()
  await mongoServer.stop()
})

async function createAdmin() {
  const admin = await User.create({
    username: 'admin1',
    email: 'admin@example.com',
    passwordHash: 'not-used',
    systemRole: 'admin',
    activeRole: 'admin',
    accountStatus: 'active',
  })

  return {
    admin,
    token: admin.issueAccessToken(),
  }
}

describe('competition routes', () => {
  it('returns only open competitions to student-facing list requests', async () => {
    const response = await request(app).get('/api/v1/competitions')

    assert.equal(response.status, 200)
    assert.ok(response.body.data.competitions.length > 0)
    assert.ok(response.body.data.competitions.every((competition) => competition.status === 'open'))
    assert.ok(response.body.data.competitions.some((competition) => competition.id === 'comp-1'))
    assert.ok(response.body.data.competitions.every((competition) => !competition.id.startsWith('COMP-')))
  })

  it('supports search, category filtering, and deadline sorting on public competition list', async () => {
    const response = await request(app)
      .get('/api/v1/competitions')
      .query({
        search: 'ACM',
        category: 'Competitive Programming',
        sortBy: 'deadline',
        sortOrder: 'asc',
      })

    assert.equal(response.status, 200)
    assert.deepEqual(
      response.body.data.competitions.map((competition) => competition.id),
      ['comp-2'],
    )
  })

  it('returns open competition details and hides non-open competitions from the public endpoint', async () => {
    const openCompetition = await request(app).get('/api/v1/competitions/comp-1')
    assert.equal(openCompetition.status, 200)
    assert.equal(openCompetition.body.data.competition.id, 'comp-1')

    const closedCompetition = await request(app).get('/api/v1/competitions/comp-6')
    assert.equal(closedCompetition.status, 404)
  })

  it('lets admins list all competitions and filter by status', async () => {
    const { token } = await createAdmin()

    const response = await request(app)
      .get('/api/v1/admin/competitions')
      .set('Authorization', `Bearer ${token}`)
      .query({ status: 'draft' })

    assert.equal(response.status, 200)
    assert.deepEqual(
      response.body.data.competitions.map((competition) => competition.id),
      ['COMP-9155'],
    )
  })

  it('lets admins create, update, and delete competitions', async () => {
    const { admin, token } = await createAdmin()

    const createResponse = await request(app)
      .post('/api/v1/admin/competitions')
      .set('Authorization', `Bearer ${token}`)
      .send({
        title: 'Systems Challenge',
        organizer: 'Computer Engineering Club',
        category: 'Systems',
        mode: 'Onsite',
        teamSize: '2-4',
        status: 'upcoming',
        prize: 'SAR 9,000',
        description: 'Build performant systems.',
        requirements: ['Working submission', 'University student'],
        tags: ['Systems', 'Performance'],
        links: 'https://example.com/systems-challenge',
        startDate: '2026-11-10',
        endDate: '2026-11-12',
        registrationDeadline: '2026-11-01',
        participationType: 'team',
      })

    assert.equal(createResponse.status, 201)
    assert.equal(createResponse.body.data.competition.organizer, 'Computer Engineering Club')
    assert.deepEqual(createResponse.body.data.competition.links, ['https://example.com/systems-challenge'])
    assert.equal(createResponse.body.data.competition.createdBy, admin._id.toString())

    const createdId = createResponse.body.data.competition.id

    const updateResponse = await request(app)
      .patch(`/api/v1/admin/competitions/${createdId}`)
      .set('Authorization', `Bearer ${token}`)
      .send({
        status: 'open',
        prize: 'SAR 12,000',
      })

    assert.equal(updateResponse.status, 200)
    assert.equal(updateResponse.body.data.competition.status, 'open')
    assert.equal(updateResponse.body.data.competition.prize, 'SAR 12,000')

    const deleteResponse = await request(app)
      .delete(`/api/v1/admin/competitions/${createdId}`)
      .set('Authorization', `Bearer ${token}`)

    assert.equal(deleteResponse.status, 200)

    const storedCompetition = await Competition.findById(createdId)
    assert.equal(storedCompetition, null)
  })

  it('blocks non-admin users from admin competition endpoints', async () => {
    const student = await request(app).post('/api/v1/auth/signup').send({
      username: 'student1',
      email: 'student@example.com',
      password: 'Password123!',
      defaultRole: 'competitor',
    })

    const response = await request(app)
      .get('/api/v1/admin/competitions')
      .set('Authorization', `Bearer ${student.body.data.token}`)

    assert.equal(response.status, 403)
  })
})
