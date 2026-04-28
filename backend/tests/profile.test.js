import assert from 'node:assert/strict'
import { after, before, beforeEach, describe, it } from 'node:test'
import { MongoMemoryServer } from 'mongodb-memory-server'
import mongoose from 'mongoose'
import request from 'supertest'
import { createApp } from '../src/app.js'
import { Profile } from '../src/modules/profile/profile.model.js'

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

describe('profile routes', () => {
  it('creates an empty profile during signup and returns it from profile me', async () => {
    const signupResponse = await signup()
    const token = signupResponse.body.data.token

    const storedProfile = await Profile.findOne({ userId: signupResponse.body.data.user.id }).lean()
    assert.ok(storedProfile)

    const response = await request(app)
      .get('/api/v1/profile/me')
      .set('Authorization', `Bearer ${token}`)

    assert.equal(response.status, 200)
    assert.equal(response.body.data.profile.university, '')
    assert.deepEqual(response.body.data.profile.skills, [])
    assert.equal(response.body.data.profile.competitor.bio, '')
    assert.equal(response.body.data.profile.teamLeader.preferredTeamSetup, '')
  })

  it('updates profile fields without overwriting untouched role-specific fields', async () => {
    const signupResponse = await signup()
    const token = signupResponse.body.data.token

    const firstUpdate = await request(app)
      .patch('/api/v1/profile/me')
      .set('Authorization', `Bearer ${token}`)
      .send({
        university: 'King Saud University',
        competitor: {
          focus: 'Hackathons',
          bio: 'Frontend competitor bio',
        },
      })

    assert.equal(firstUpdate.status, 200)
    assert.equal(firstUpdate.body.data.profile.university, 'King Saud University')
    assert.equal(firstUpdate.body.data.profile.competitor.focus, 'Hackathons')
    assert.equal(firstUpdate.body.data.profile.competitor.bio, 'Frontend competitor bio')

    const secondUpdate = await request(app)
      .patch('/api/v1/profile/me')
      .set('Authorization', `Bearer ${token}`)
      .send({
        teamLeader: {
          preferredTeamSetup: 'Cross-functional team',
        },
      })

    assert.equal(secondUpdate.status, 200)
    assert.equal(secondUpdate.body.data.profile.competitor.focus, 'Hackathons')
    assert.equal(secondUpdate.body.data.profile.teamLeader.preferredTeamSetup, 'Cross-functional team')
  })

  it('replaces embedded skills and de-duplicates them case-insensitively', async () => {
    const signupResponse = await signup()
    const token = signupResponse.body.data.token

    const response = await request(app)
      .put('/api/v1/profile/me/skills')
      .set('Authorization', `Bearer ${token}`)
      .send({
        skills: ['React', ' react ', 'Node.js', 'NODE.JS', 'UI/UX'],
      })

    assert.equal(response.status, 200)
    assert.deepEqual(response.body.data.skills, ['React', 'Node.js', 'UI/UX'])

    const storedProfile = await Profile.findOne({ userId: signupResponse.body.data.user.id }).lean()
    assert.deepEqual(storedProfile.skills, ['React', 'Node.js', 'UI/UX'])

    const getSkills = await request(app)
      .get('/api/v1/profile/me/skills')
      .set('Authorization', `Bearer ${token}`)

    assert.equal(getSkills.status, 200)
    assert.deepEqual(getSkills.body.data.skills, ['React', 'Node.js', 'UI/UX'])
  })
})
