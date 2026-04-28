import assert from 'node:assert/strict'
import { after, before, beforeEach, describe, it } from 'node:test'
import { MongoMemoryServer } from 'mongodb-memory-server'
import mongoose from 'mongoose'
import request from 'supertest'
import { createApp } from '../src/app.js'
import { Team } from '../src/modules/teams/team.model.js'
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

describe('team routes', () => {
  it('lets active team leaders create teams in open competitions', async () => {
    const signupResponse = await signup({ defaultRole: 'teamLeader' })
    const token = signupResponse.body.data.token

    const response = await request(app)
      .post('/api/v1/teams')
      .set('Authorization', `Bearer ${token}`)
      .send({
        name: 'Algo Pulse',
        competitionId: 'comp-2',
        description: 'Looking for one more ICPC teammate.',
        requiredSkills: ['Algorithms', 'C++'],
        totalSlots: 3,
      })

    assert.equal(response.status, 201)
    assert.equal(response.body.data.team.leaderId, signupResponse.body.data.user.id)
    assert.deepEqual(response.body.data.team.memberIds, [signupResponse.body.data.user.id])
    assert.equal(response.body.data.team.status, 'recruiting')
  })

  it('rejects team creation by non-team-leader active roles', async () => {
    const signupResponse = await signup({ defaultRole: 'competitor' })
    const token = signupResponse.body.data.token

    const response = await request(app)
      .post('/api/v1/teams')
      .set('Authorization', `Bearer ${token}`)
      .send({
        name: 'Blocked Team',
        competitionId: 'comp-1',
        description: 'Should fail.',
        requiredSkills: ['React'],
        totalSlots: 3,
      })

    assert.equal(response.status, 403)
  })

  it('rejects team creation when the competition is not open or size is incompatible', async () => {
    const signupResponse = await signup({ defaultRole: 'teamLeader' })
    const token = signupResponse.body.data.token

    const closedCompetition = await request(app)
      .post('/api/v1/teams')
      .set('Authorization', `Bearer ${token}`)
      .send({
        name: 'Closed Team',
        competitionId: 'comp-6',
        description: 'Should fail.',
        requiredSkills: ['ML'],
        totalSlots: 3,
      })

    assert.equal(closedCompetition.status, 400)

    const invalidSize = await request(app)
      .post('/api/v1/teams')
      .set('Authorization', `Bearer ${token}`)
      .send({
        name: 'Oversized Team',
        competitionId: 'comp-2',
        description: 'Should fail.',
        requiredSkills: ['Algorithms'],
        totalSlots: 5,
      })

    assert.equal(invalidSize.status, 400)
  })

  it('returns the current user teams from teams me', async () => {
    const signupResponse = await signup({ defaultRole: 'teamLeader' })
    const token = signupResponse.body.data.token

    await request(app)
      .post('/api/v1/teams')
      .set('Authorization', `Bearer ${token}`)
      .send({
        name: 'Team One',
        competitionId: 'comp-1',
        description: 'My first team.',
        requiredSkills: ['React'],
        totalSlots: 2,
      })

    const response = await request(app)
      .get('/api/v1/teams/me')
      .set('Authorization', `Bearer ${token}`)

    assert.equal(response.status, 200)
    assert.equal(response.body.data.teams.length, 1)
    assert.equal(response.body.data.teams[0].leaderId, signupResponse.body.data.user.id)
  })

  it('returns recruiting teams for a competition and hides full teams', async () => {
    const response = await request(app).get('/api/v1/competitions/comp-3/teams')

    assert.equal(response.status, 200)
    assert.deepEqual(response.body.data.teams, [])

    const recruiting = await request(app).get('/api/v1/competitions/comp-2/teams')
    assert.equal(recruiting.status, 200)
    assert.deepEqual(recruiting.body.data.teams.map((team) => team.id), ['team-1'])
  })

  it('supports leave requests and removes membership after leader approval', async () => {
    const leader = await signup({ username: 'leader1', email: 'leader@example.com', defaultRole: 'teamLeader' })
    const leaderToken = leader.body.data.token
    const leaderId = leader.body.data.user.id

    const createTeamResponse = await request(app)
      .post('/api/v1/teams')
      .set('Authorization', `Bearer ${leaderToken}`)
      .send({
        name: 'Leave Test Team',
        competitionId: 'comp-1',
        description: 'Testing leave requests.',
        requiredSkills: ['React'],
        totalSlots: 3,
      })

    const teamId = createTeamResponse.body.data.team.id

    const member = await signup({ username: 'member1', email: 'member@example.com', defaultRole: 'competitor' })
    const memberId = member.body.data.user.id
    const memberToken = member.body.data.token

    await Team.updateOne({ _id: teamId }, { $push: { memberIds: memberId } })

    const leaveResponse = await request(app)
      .post(`/api/v1/teams/${teamId}/leave-requests`)
      .set('Authorization', `Bearer ${memberToken}`)

    assert.equal(leaveResponse.status, 201)
    assert.equal(leaveResponse.body.data.leaveRequest.status, 'pending')

    const incoming = await request(app)
      .get('/api/v1/teams/leave-requests/incoming')
      .set('Authorization', `Bearer ${leaderToken}`)

    assert.equal(incoming.status, 200)
    assert.equal(incoming.body.data.leaveRequests.length, 1)
    assert.equal(incoming.body.data.leaveRequests[0].requesterId, memberId)

    const review = await request(app)
      .patch(`/api/v1/leave-requests/${leaveResponse.body.data.leaveRequest.id}/status`)
      .set('Authorization', `Bearer ${leaderToken}`)
      .send({ status: 'approved' })

    assert.equal(review.status, 200)

    const updatedTeam = await Team.findById(teamId).lean()
    assert.equal(updatedTeam.leaderId, leaderId)
    assert.equal(updatedTeam.memberIds.includes(memberId), false)
  })
})
