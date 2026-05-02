import assert from 'node:assert/strict'
import { test } from 'node:test'
import { cleanupDemoData, runSeedCli, seed, validateSeedSafety } from '../../scripts/seed.js'

function createModelRecorder(name, extra = {}) {
  const calls = []
  return {
    name,
    calls,
    model: {
      deleteMany: async (filter) => {
        calls.push({ method: 'deleteMany', filter })
      },
      create: async (payload) => {
        calls.push({ method: 'create', payload })
        return payload
      },
      ...extra,
    },
  }
}

test('production seed refuses to run without explicit confirmation', () => {
  assert.throws(
    () => validateSeedSafety({ nodeEnv: 'production', mongodbUri: 'mongodb://127.0.0.1:27017/compitihub' }),
    /SEED_CONFIRM=RESET_DEMO_DATA/,
  )
  assert.doesNotThrow(() =>
    validateSeedSafety({
      nodeEnv: 'production',
      mongodbUri: 'mongodb://127.0.0.1:27017/compitihub',
      seedConfirm: 'RESET_DEMO_DATA',
    }),
  )
  assert.doesNotThrow(() => validateSeedSafety({ nodeEnv: 'development', mongodbUri: 'mongodb://127.0.0.1:27017/compitihub' }))
})

test('non-local database seed refuses to run without explicit confirmation', () => {
  assert.throws(
    () => validateSeedSafety({ nodeEnv: 'development', mongodbUri: 'mongodb+srv://cluster.example.com/compitihub' }),
    /SEED_CONFIRM=RESET_DEMO_DATA/,
  )
  assert.throws(
    () => validateSeedSafety({ mongodbUri: 'mongodb://mongo.example.com:27017/compitihub' }),
    /SEED_CONFIRM=RESET_DEMO_DATA/,
  )
  assert.doesNotThrow(() =>
    validateSeedSafety({
      nodeEnv: 'development',
      mongodbUri: 'mongodb+srv://cluster.example.com/compitihub',
      seedConfirm: 'RESET_DEMO_DATA',
    }),
  )
})

test('local and test database seed can run without confirmation', () => {
  assert.doesNotThrow(() => validateSeedSafety({ mongodbUri: 'mongodb://127.0.0.1:27017/compitihub' }))
  assert.doesNotThrow(() => validateSeedSafety({ mongodbUri: 'mongodb://localhost:27017/compitihub' }))
  assert.doesNotThrow(() => validateSeedSafety({ mongodbUri: 'mongodb://127.0.0.1:45678/test' }))
  assert.doesNotThrow(() => validateSeedSafety({ mongodbUri: 'mongodb://seed-test' }))
})

test('cleanup deletes only scoped demo records', async () => {
  const existingUserId = 'existing-demo-user-id'
  const users = createModelRecorder('User', {
    find: () => ({ select: async () => [{ _id: existingUserId }] }),
  })
  const profiles = createModelRecorder('Profile')
  const competitions = createModelRecorder('Competition')
  const teams = createModelRecorder('Team')
  const leaveRequests = createModelRecorder('LeaveRequest')
  const applications = createModelRecorder('Application')
  const suggestions = createModelRecorder('CompetitionSuggestion')
  const moderationActions = createModelRecorder('ModerationAction')

  await cleanupDemoData({
    User: users.model,
    Profile: profiles.model,
    Competition: competitions.model,
    Team: teams.model,
    LeaveRequest: leaveRequests.model,
    Application: applications.model,
    CompetitionSuggestion: suggestions.model,
    ModerationAction: moderationActions.model,
  })

  const allDeleteCalls = [
    users,
    profiles,
    competitions,
    teams,
    leaveRequests,
    applications,
    suggestions,
    moderationActions,
  ].flatMap((recorder) => recorder.calls)

  assert.equal(allDeleteCalls.length, 8)
  assert.ok(allDeleteCalls.every((call) => Object.keys(call.filter).length > 0))
  assert.deepEqual(competitions.calls[0].filter, { _id: { $in: ['comp-ai-2027', 'comp-web-2027'] } })
  assert.equal(teams.calls[0].filter.$or[0]._id, 'team-api-builders')
  assert.deepEqual(users.calls[0].filter.$or[0].email.$in, ['admin@admin.com', 'competitor@demo.com', 'leader@demo.com'])
  assert.ok(applications.calls[0].filter.$or.some((filter) => filter.teamId === 'team-api-builders'))
  assert.ok(leaveRequests.calls[0].filter.$or.some((filter) => filter.competitionId?.$in?.includes('comp-ai-2027')))
  assert.ok(suggestions.calls[0].filter.$or.some((filter) => filter.submittedBy))
  assert.ok(moderationActions.calls[0].filter.$or.some((filter) => filter.targetUserId))
})

test('CLI seed prints credentials and disconnects in finally', async () => {
  const logs = []
  let disconnected = false

  await runSeedCli({
    seed: async () => {},
    disconnect: async () => {
      disconnected = true
    },
    logger: { log: (message) => logs.push(message) },
  })

  assert.deepEqual(logs, [
    'Seed complete',
    'admin: admin@admin.com / 123456789',
    'competitor: competitor@demo.com / 123456789',
    'leader: leader@demo.com / 123456789',
  ])
  assert.equal(disconnected, true)
})

test('seed creates all required demo records', async () => {
  const users = createModelRecorder('User', {
    find: () => ({ select: async () => [] }),
  })
  const profiles = createModelRecorder('Profile')
  const competitions = createModelRecorder('Competition')
  const teams = createModelRecorder('Team')
  const leaveRequests = createModelRecorder('LeaveRequest')
  const applications = createModelRecorder('Application')
  const suggestions = createModelRecorder('CompetitionSuggestion')
  const moderationActions = createModelRecorder('ModerationAction')
  const modelRegistry = {
    User: users.model,
    Profile: profiles.model,
    Competition: competitions.model,
    Team: teams.model,
    LeaveRequest: leaveRequests.model,
    Application: applications.model,
    CompetitionSuggestion: suggestions.model,
    ModerationAction: moderationActions.model,
  }
  const connectedUris = []

  await seed({
    environment: { nodeEnv: 'development', mongodbUri: 'mongodb://seed-test' },
    modelRegistry,
    connect: async (uri) => connectedUris.push(uri),
  })

  assert.deepEqual(connectedUris, ['mongodb://seed-test'])
  assert.equal(users.calls.find((call) => call.method === 'create').payload.length, 3)
  assert.equal(profiles.calls.find((call) => call.method === 'create').payload.length, 3)
  assert.equal(competitions.calls.find((call) => call.method === 'create').payload.length, 2)
  assert.equal(teams.calls.find((call) => call.method === 'create').payload._id, 'team-api-builders')

  const application = applications.calls.find((call) => call.method === 'create').payload
  assert.equal(application.teamId, 'team-api-builders')
  assert.equal(application.competitionId, 'comp-ai-2027')
  assert.equal(application.status, 'pending')

  const leaveRequest = leaveRequests.calls.find((call) => call.method === 'create').payload
  assert.equal(leaveRequest._id, 'leave-team-api-builders-competitor')
  assert.equal(leaveRequest.teamId, 'team-api-builders')
  assert.equal(leaveRequest.competitionId, 'comp-ai-2027')
  assert.equal(leaveRequest.status, 'pending')

  const suggestion = suggestions.calls.find((call) => call.method === 'create').payload
  assert.equal(suggestion.status, 'pending')

  const moderationAction = moderationActions.calls.find((call) => call.method === 'create').payload
  assert.equal(moderationAction.penalty, 'warning')
  assert.match(moderationAction.reason, /demo/i)
})

test('CLI seed disconnects after seed failure', async () => {
  let disconnected = false

  await assert.rejects(
    runSeedCli({
      seed: async () => {
        throw new Error('seed failed')
      },
      disconnect: async () => {
        disconnected = true
      },
      logger: { log: () => {} },
    }),
    /seed failed/,
  )

  assert.equal(disconnected, true)
})
