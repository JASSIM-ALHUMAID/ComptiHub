import assert from 'node:assert/strict'
import { after, before, beforeEach, describe, it } from 'node:test'
import { MongoMemoryReplSet } from 'mongodb-memory-server'
import mongoose from 'mongoose'
import request from 'supertest'
import { createApp } from '../src/app.js'
import { User } from '../src/modules/auth/user.model.js'
import { Application } from '../src/modules/applications/application.model.js'
import { Competition } from '../src/modules/competitions/competition.model.js'
import { Profile } from '../src/modules/profile/profile.model.js'
import { Team } from '../src/modules/teams/team.model.js'

const app = createApp()
let mongoServer

before(
  async () => {
    mongoServer = await MongoMemoryReplSet.create({ replSet: { count: 1 } })
    await mongoose.connect(mongoServer.getUri())
  },
  { timeout: 120000 },
)

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

async function seedApplicationFixture() {
  const competitor = await createStudent({
    username: 'sara',
    email: 'sara@example.com',
    activeRole: 'competitor',
  })
  const leader = await createStudent({
    username: 'ali',
    email: 'ali@example.com',
    defaultRole: 'teamLeader',
    activeRole: 'teamLeader',
  })
  const otherLeader = await createStudent({
    username: 'reem',
    email: 'reem@example.com',
    defaultRole: 'teamLeader',
    activeRole: 'teamLeader',
  })
  const competition = await Competition.create({
    _id: 'comp-applications',
    title: 'Regional Programming Contest',
    organizer: 'ACM',
    category: 'Competitive Programming',
    mode: 'Team',
    teamSize: '2-3',
    deadline: '2099-06-01',
    status: 'open',
    prize: 'Trophy',
    description: 'A programming contest for backend integration tests.',
    requirements: ['Student enrollment'],
    tags: ['Programming'],
    startDate: '2099-06-10',
    endDate: '2099-06-12',
    registrationDeadline: '2099-06-01',
    participationType: 'team',
  })
  const team = await Team.create({
    _id: 'team-byteforge',
    name: 'ByteForge',
    competitionId: competition._id,
    leaderId: leader._id.toString(),
    description: 'A recruiting programming team.',
    totalSlots: 2,
    memberIds: [leader._id.toString()],
    requiredSkills: ['Algorithms', 'C++'],
    status: 'recruiting',
  })

  await Profile.create({
    userId: competitor._id,
    university: 'KFUPM',
    major: 'Software Engineering',
    skills: ['React', 'Algorithms'],
  })

  return { competitor, leader, otherLeader, competition, team }
}

describe('application routes', () => {
  it('creates one active application per competition and rejects duplicates', async () => {
    const { competitor, otherLeader, competition, team } = await seedApplicationFixture()
    const secondTeam = await Team.create({
      _id: 'team-novabuild',
      name: 'NovaBuild',
      competitionId: competition._id,
      leaderId: otherLeader._id.toString(),
      description: 'A second recruiting team.',
      totalSlots: 3,
      memberIds: [otherLeader._id.toString()],
      status: 'recruiting',
    })
    const token = competitor.issueAccessToken()

    const response = await request(app)
      .post(`/api/v1/teams/${team._id}/applications`)
      .set('Authorization', `Bearer ${token}`)
      .send({ message: 'I can cover graph algorithms and implementation.' })

    assert.equal(response.status, 201)
    assert.equal(response.body.data.application.status, 'pending')
    assert.equal(response.body.data.application.teamName, 'ByteForge')

    const duplicateTeam = await request(app)
      .post(`/api/v1/teams/${team._id}/applications`)
      .set('Authorization', `Bearer ${token}`)
      .send({ message: 'Second try.' })

    assert.equal(duplicateTeam.status, 409)
    assert.match(duplicateTeam.body.error.message, /active application for this team/i)

    const duplicateCompetition = await request(app)
      .post(`/api/v1/teams/${secondTeam._id}/applications`)
      .set('Authorization', `Bearer ${token}`)
      .send({ message: 'Trying another team.' })

    assert.equal(duplicateCompetition.status, 409)
    assert.match(duplicateCompetition.body.error.message, /active application for this competition/i)
  })

  it('enriches incoming applications and lets the team leader accept exactly once', async () => {
    const { competitor, leader, team } = await seedApplicationFixture()

    const created = await request(app)
      .post(`/api/v1/teams/${team._id}/applications`)
      .set('Authorization', `Bearer ${competitor.issueAccessToken()}`)
      .send({ message: 'I have solved 400+ contest problems.' })

    assert.equal(created.status, 201)

    const incoming = await request(app)
      .get('/api/v1/teams/applications/incoming')
      .set('Authorization', `Bearer ${leader.issueAccessToken()}`)

    assert.equal(incoming.status, 200)
    assert.equal(incoming.body.data.applications.length, 1)
    assert.equal(incoming.body.data.applications[0].applicant.username, 'sara')
    assert.deepEqual(incoming.body.data.applications[0].applicant.skills, ['React', 'Algorithms'])

    const applicationId = created.body.data.application.id
    const accepted = await request(app)
      .patch(`/api/v1/applications/${applicationId}/status`)
      .set('Authorization', `Bearer ${leader.issueAccessToken()}`)
      .send({ status: 'accepted' })

    assert.equal(accepted.status, 200)
    assert.equal(accepted.body.data.application.status, 'accepted')
    assert.equal(accepted.body.data.application.team.status, 'full')

    const updatedTeam = await Team.findById(team._id).lean()
    assert.equal(updatedTeam.memberIds.length, 2)
    assert.ok(updatedTeam.memberIds.includes(competitor._id.toString()))
    assert.equal(updatedTeam.status, 'full')

    const secondReview = await request(app)
      .patch(`/api/v1/applications/${applicationId}/status`)
      .set('Authorization', `Bearer ${leader.issueAccessToken()}`)
      .send({ status: 'rejected' })

    assert.equal(secondReview.status, 409)

    const myApplications = await request(app)
      .get('/api/v1/applications/me')
      .set('Authorization', `Bearer ${competitor.issueAccessToken()}`)

    assert.equal(myApplications.status, 200)
    assert.equal(myApplications.body.data.applications[0].status, 'accepted')
  })

  it('blocks non-leaders from reviewing applications and blocks full teams', async () => {
    const { competitor, leader, otherLeader, competition, team } = await seedApplicationFixture()
    const fullTeam = await Team.create({
      _id: 'team-pixelflow',
      name: 'PixelFlow',
      competitionId: competition._id,
      leaderId: otherLeader._id.toString(),
      description: 'A full team.',
      totalSlots: 1,
      memberIds: [otherLeader._id.toString()],
      status: 'recruiting',
    })

    const fullResponse = await request(app)
      .post(`/api/v1/teams/${fullTeam._id}/applications`)
      .set('Authorization', `Bearer ${competitor.issueAccessToken()}`)
      .send({ message: 'I would like to join.' })

    assert.equal(fullResponse.status, 409)
    assert.match(fullResponse.body.error.message, /already full/i)

    const application = await Application.create({
      applicantId: competitor._id,
      teamId: team._id,
      competitionId: competition._id,
      message: 'Please consider me.',
      status: 'pending',
    })

    const unauthorized = await request(app)
      .patch(`/api/v1/applications/${application._id}/status`)
      .set('Authorization', `Bearer ${otherLeader.issueAccessToken()}`)
      .send({ status: 'accepted' })

    assert.equal(unauthorized.status, 403)

    const reviewed = await request(app)
      .patch(`/api/v1/applications/${application._id}/status`)
      .set('Authorization', `Bearer ${leader.issueAccessToken()}`)
      .send({ status: 'rejected' })

    assert.equal(reviewed.status, 200)
    assert.equal(reviewed.body.data.application.status, 'rejected')
  })
})
