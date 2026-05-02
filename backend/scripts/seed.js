import bcrypt from 'bcrypt'
import { fileURLToPath } from 'node:url'
import mongoose from 'mongoose'
import { env } from '../src/config/env.js'
import { connectDb } from '../src/db/connect.js'
import { Application } from '../src/modules/applications/application.model.js'
import { User } from '../src/modules/auth/user.model.js'
import { Competition } from '../src/modules/competitions/competition.model.js'
import { ModerationAction } from '../src/modules/moderation/moderationAction.model.js'
import { Profile } from '../src/modules/profile/profile.model.js'
import { CompetitionSuggestion } from '../src/modules/suggestions/competitionSuggestion.model.js'
import { LeaveRequest } from '../src/modules/teams/leave-request.model.js'
import { Team } from '../src/modules/teams/team.model.js'

const password = '123456789'
const passwordHash = await bcrypt.hash(password, 10)
const confirmResetValue = 'RESET_DEMO_DATA'
const demoEmails = ['admin@admin.com', 'competitor@demo.com', 'leader@demo.com']
const demoUserIds = {
  admin: new mongoose.Types.ObjectId('000000000000000000000001'),
  competitor: new mongoose.Types.ObjectId('000000000000000000000002'),
  leader: new mongoose.Types.ObjectId('000000000000000000000003'),
}
const demoCompetitionIds = ['comp-ai-2027', 'comp-web-2027']
const demoTeamId = 'team-api-builders'

const models = {
  User,
  Profile,
  Competition,
  Team,
  LeaveRequest,
  Application,
  CompetitionSuggestion,
  ModerationAction,
}

function dateString(daysFromNow) {
  const date = new Date()
  date.setUTCDate(date.getUTCDate() + daysFromNow)
  return date.toISOString().slice(0, 10)
}

function isLocalMongoUri(mongodbUri) {
  if (!mongodbUri) return false
  if (mongodbUri === 'mongodb://seed-test') return true

  try {
    const uri = new URL(mongodbUri)
    return uri.protocol === 'mongodb:' && ['127.0.0.1', 'localhost'].includes(uri.hostname)
  } catch {
    return false
  }
}

export function validateSeedSafety({
  nodeEnv = env.nodeEnv,
  mongodbUri = env.mongodbUri,
  seedConfirm = process.env.SEED_CONFIRM,
} = {}) {
  const requiresConfirmation = nodeEnv === 'production' || !isLocalMongoUri(mongodbUri)

  if (requiresConfirmation && seedConfirm !== confirmResetValue) {
    throw new Error(`Refusing to seed production without SEED_CONFIRM=${confirmResetValue}`)
  }
}

export async function cleanupDemoData({
  User,
  Profile,
  Competition,
  Team,
  LeaveRequest,
  Application,
  CompetitionSuggestion,
  ModerationAction,
}) {
  const existingDemoUsers = await User.find({
    $or: [{ email: { $in: demoEmails } }, { _id: { $in: Object.values(demoUserIds) } }],
  }).select('_id')
  const demoUserObjectIds = [...Object.values(demoUserIds), ...existingDemoUsers.map((user) => user._id)]
  const demoUserStringIds = demoUserObjectIds.map((id) => id.toString())

  await Promise.all([
    Application.deleteMany({
      $or: [
        { applicantId: { $in: demoUserObjectIds } },
        { reviewedBy: { $in: demoUserObjectIds } },
        { teamId: demoTeamId },
        { competitionId: { $in: demoCompetitionIds } },
      ],
    }),
    LeaveRequest.deleteMany({
      $or: [
        { teamId: demoTeamId },
        { competitionId: { $in: demoCompetitionIds } },
        { requesterId: { $in: demoUserStringIds } },
        { reviewedBy: { $in: demoUserStringIds } },
      ],
    }),
    CompetitionSuggestion.deleteMany({
      $or: [{ submittedBy: { $in: demoUserObjectIds } }, { reviewedBy: { $in: demoUserObjectIds } }],
    }),
    ModerationAction.deleteMany({
      $or: [{ targetUserId: { $in: demoUserObjectIds } }, { adminUserId: { $in: demoUserObjectIds } }],
    }),
    Profile.deleteMany({ userId: { $in: demoUserObjectIds } }),
    Team.deleteMany({
      $or: [{ _id: demoTeamId }, { leaderId: { $in: demoUserStringIds } }, { memberIds: { $in: demoUserStringIds } }],
    }),
    Competition.deleteMany({ _id: { $in: demoCompetitionIds } }),
    User.deleteMany({ $or: [{ email: { $in: demoEmails } }, { _id: { $in: Object.values(demoUserIds) } }] }),
  ])
}

export async function seed({ environment = env, modelRegistry = models, connect = connectDb } = {}) {
  validateSeedSafety({ nodeEnv: environment.nodeEnv, mongodbUri: environment.mongodbUri, seedConfirm: process.env.SEED_CONFIRM })

  await connect(environment.mongodbUri)
  await cleanupDemoData(modelRegistry)

  const [admin, competitor, leader] = await modelRegistry.User.create([
    {
      _id: demoUserIds.admin,
      username: 'Demo Admin',
      email: 'admin@admin.com',
      passwordHash,
      systemRole: 'admin',
      activeRole: 'admin',
      accountStatus: 'active',
    },
    {
      _id: demoUserIds.competitor,
      username: 'Demo Competitor',
      email: 'competitor@demo.com',
      passwordHash,
      systemRole: 'student',
      defaultRole: 'competitor',
      activeRole: 'competitor',
      accountStatus: 'active',
    },
    {
      _id: demoUserIds.leader,
      username: 'Demo Leader',
      email: 'leader@demo.com',
      passwordHash,
      systemRole: 'student',
      defaultRole: 'teamLeader',
      activeRole: 'teamLeader',
      accountStatus: 'active',
    },
  ])

  await modelRegistry.Profile.create([
    {
      userId: admin._id,
      university: 'CompitiHub University',
      major: 'Administration',
      year: 'Staff',
      skills: ['Moderation', 'Operations'],
    },
    {
      userId: competitor._id,
      university: 'CompitiHub University',
      major: 'Computer Science',
      year: 'Junior',
      competitor: {
        focus: 'Hackathons',
        preferredRole: 'Frontend Developer',
        strengths: 'React, UI implementation, testing',
        availability: 'Weekends',
        bio: 'Demo competitor looking for active teams.',
      },
      skills: ['React', 'JavaScript', 'UI/UX'],
    },
    {
      userId: leader._id,
      university: 'CompitiHub University',
      major: 'Software Engineering',
      year: 'Senior',
      teamLeader: {
        focus: 'AI and product competitions',
        preferredTeamSetup: 'Small cross-functional team',
        strengths: 'Planning, backend, mentoring',
        availability: 'Evenings',
        bio: 'Demo leader recruiting motivated teammates.',
      },
      skills: ['Node.js', 'Leadership', 'Machine Learning'],
    },
  ])

  const [aiCompetition] = await modelRegistry.Competition.create([
    {
      _id: 'comp-ai-2027',
      title: 'API AI Innovation Challenge 2027',
      organizer: 'CompitiHub Labs',
      category: 'AI / ML',
      mode: 'Hybrid',
      teamSize: '2-4',
      deadline: dateString(45),
      status: 'open',
      prize: 'SAR 20,000',
      description: 'Build an applied AI prototype that solves a real student problem.',
      requirements: ['Prototype', 'Pitch deck', 'Demo video'],
      tags: ['AI', 'Prototype', 'Student'],
      links: ['https://compitihub.local/comp-ai-2027'],
      startDate: dateString(60),
      endDate: dateString(75),
      registrationDeadline: dateString(45),
      participationType: 'team',
      createdBy: admin._id,
    },
    {
      _id: 'comp-web-2027',
      title: 'API Web Builders Sprint 2027',
      organizer: 'CompitiHub Security Club',
      category: 'Web Development',
      mode: 'Online',
      teamSize: '3-5',
      deadline: dateString(30),
      status: 'open',
      prize: 'SAR 12,000',
      description: 'Build a reliable student-facing web experience in a team sprint.',
      requirements: ['Student team', 'Working web app', 'Final presentation'],
      tags: ['Web', 'React', 'Team'],
      links: ['https://compitihub.local/comp-web-2027'],
      startDate: dateString(40),
      endDate: dateString(42),
      registrationDeadline: dateString(30),
      participationType: 'team',
      createdBy: admin._id,
    },
  ])

  const team = await modelRegistry.Team.create({
    _id: 'team-api-builders',
    name: 'API Builders',
    competitionId: aiCompetition._id,
    leaderId: leader._id.toString(),
    description: 'Recruiting a frontend-focused teammate to help build and present the AI prototype.',
    requiredSkills: ['React', 'Product thinking', 'Presentation'],
    totalSlots: 4,
    memberIds: [leader._id.toString()],
    status: 'recruiting',
  })

  await modelRegistry.Application.create({
    applicantId: competitor._id,
    teamId: team._id,
    competitionId: aiCompetition._id,
    message: 'I can help with the frontend demo and product pitch.',
    status: 'pending',
  })

  await modelRegistry.LeaveRequest.create({
    _id: 'leave-team-api-builders-competitor',
    teamId: team._id,
    competitionId: aiCompetition._id,
    requesterId: competitor._id.toString(),
    status: 'pending',
  })

  await modelRegistry.CompetitionSuggestion.create({
    submittedBy: competitor._id,
    title: 'Sustainable Campus Apps Challenge',
    summary: 'A student competition for apps that reduce waste and improve campus sustainability.',
    resourceLink: 'https://compitihub.local/suggestions/sustainable-campus',
    proposedSchedule: `${dateString(90)} to ${dateString(100)}`,
    hardwareTier: 'Standard laptops',
    budget: 'SAR 8,000',
    status: 'pending',
  })

  await modelRegistry.ModerationAction.create({
    targetUserId: competitor._id,
    adminUserId: admin._id,
    penalty: 'warning',
    duration: 'Demo record',
    reason: 'Demo moderation action for seeded data.',
  })
}

export async function runSeedCli({ seed: seedFn = seed, disconnect = mongoose.disconnect, logger = console } = {}) {
  try {
    await seedFn()
    logger.log('Seed complete')
    logger.log(`admin: admin@admin.com / ${password}`)
    logger.log(`competitor: competitor@demo.com / ${password}`)
    logger.log(`leader: leader@demo.com / ${password}`)
  } finally {
    await disconnect()
  }
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  await runSeedCli()
}
