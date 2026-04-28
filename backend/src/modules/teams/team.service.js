import mongoose from 'mongoose'
import { ApiError, notFound } from '../../utils/apiError.js'
import { Competition } from '../competitions/competition.model.js'
import { seededCompetitions } from '../competitions/competition.seeds.js'
import { User } from '../auth/user.model.js'
import { LeaveRequest } from './leave-request.model.js'
import { seededTeams, seedMemberDirectory } from './team.seeds.js'
import { Team } from './team.model.js'

function normalizeStringList(items = []) {
  const unique = []
  const seen = new Set()

  items.forEach((item) => {
    const value = item.trim()
    if (!value) return
    const key = value.toLowerCase()
    if (seen.has(key)) return
    seen.add(key)
    unique.push(value)
  })

  return unique
}

function parseTeamSize(teamSize) {
  const normalized = teamSize.trim()
  if (normalized.includes('-')) {
    const [minRaw, maxRaw] = normalized.split('-')
    return {
      min: Number(minRaw),
      max: Number(maxRaw),
    }
  }

  const exact = Number(normalized)
  return { min: exact, max: exact }
}

function isCompetitionActiveForTeams(competition) {
  return ['open', 'active', 'upcoming'].includes(competition.status)
}

function deriveEffectiveStatus(team, competition) {
  if (team.status === 'dissolved') {
    return 'dissolved'
  }

  if (competition && ['closed', 'ended'].includes(competition.status)) {
    return 'archived'
  }

  if (team.status === 'archived' || team.status === 'closed') {
    return team.status
  }

  return team.memberIds.length >= team.totalSlots ? 'full' : 'recruiting'
}

function canCountForMembershipRules(team, competition) {
  const effectiveStatus = deriveEffectiveStatus(team, competition)
  return !['dissolved', 'archived'].includes(effectiveStatus)
}

async function ensureSeedTeams() {
  const count = await Team.countDocuments()
  if (count > 0) {
    return
  }

  if ((await Competition.countDocuments()) === 0) {
    await Competition.insertMany(seededCompetitions)
  }

  await Team.insertMany(seededTeams)
}

async function getCompetitionMap() {
  const competitions = await Competition.find().lean()
  return new Map(competitions.map((competition) => [competition._id, competition]))
}

async function buildMemberSummaries(memberIds, leaderId) {
  const databaseMemberIds = memberIds.filter((memberId) => mongoose.isValidObjectId(memberId))
  const users = databaseMemberIds.length > 0 ? await User.find({ _id: { $in: databaseMemberIds } }).lean() : []
  const userMap = new Map(users.map((user) => [user._id.toString(), user]))

  return memberIds.map((memberId) => {
    const user = userMap.get(memberId)
    const seedUser = seedMemberDirectory[memberId]
    return {
      id: memberId,
      username: user?.username ?? seedUser?.username ?? 'Unknown User',
      role: memberId === leaderId ? 'Team Leader' : seedUser?.role ?? 'Member',
    }
  })
}

async function toTeamDto(team, competitionMap) {
  const competition = competitionMap.get(team.competitionId) ?? null
  const members = await buildMemberSummaries(team.memberIds, team.leaderId)
  const leader = members.find((member) => member.id === team.leaderId)
  const status = deriveEffectiveStatus(team, competition)

  return {
    id: team._id,
    _id: team._id,
    name: team.name,
    competitionId: team.competitionId,
    competitionTitle: competition?.title ?? 'Unknown Competition',
    leaderId: team.leaderId,
    leaderName: leader?.username ?? 'Unknown Leader',
    description: team.description,
    requiredSkills: team.requiredSkills,
    totalSlots: team.totalSlots,
    memberIds: [...team.memberIds],
    members,
    openSlots: Math.max(0, team.totalSlots - team.memberIds.length),
    status,
    createdAt: team.createdAt,
    updatedAt: team.updatedAt,
  }
}

async function findTeamOrThrow(id) {
  const team = await Team.findById(id)
  if (!team) {
    throw notFound('Team not found.')
  }

  return team
}

async function validateCompetitionForCreation(competitionId, totalSlots) {
  const competition = await Competition.findById(competitionId)

  if (!competition) {
    throw new ApiError(400, 'Selected competition does not exist.')
  }

  if (competition.status !== 'open') {
    throw new ApiError(400, 'Selected competition is not open for registration.')
  }

  if (competition.participationType === 'solo') {
    return { competition, totalSlots: 1 }
  }

  const { min, max } = parseTeamSize(competition.teamSize)
  if (Number.isFinite(min) && totalSlots < min) {
    throw new ApiError(400, `Team size must be at least ${min} for this competition.`)
  }

  if (Number.isFinite(max) && totalSlots > max) {
    throw new ApiError(400, `Team size must be at most ${max} for this competition.`)
  }

  return { competition, totalSlots }
}

async function assertUserCanCreateTeam(user) {
  if (user.systemRole !== 'student' || user.activeRole !== 'teamLeader') {
    throw new ApiError(403, 'Only team leaders can create teams.')
  }
}

async function assertUserCanOwnTeamInCompetition(userId, competitionId) {
  const competitionMap = await getCompetitionMap()
  const teams = await Team.find({ competitionId })

  const conflicting = teams.find((team) => {
    const competition = competitionMap.get(team.competitionId)
    return canCountForMembershipRules(team, competition) && team.memberIds.includes(userId)
  })

  if (conflicting) {
    throw new ApiError(409, 'You already belong to a team in this competition.')
  }
}

function generateTeamId() {
  return `team-${Date.now()}`
}

function generateLeaveRequestId() {
  return `leave-${Date.now()}`
}

export async function createTeam(user, input) {
  await ensureSeedTeams()
  await assertUserCanCreateTeam(user)
  const validatedCompetition = await validateCompetitionForCreation(input.competitionId, input.totalSlots)
  await assertUserCanOwnTeamInCompetition(user._id.toString(), validatedCompetition.competition._id)

  const team = await Team.create({
    _id: generateTeamId(),
    name: input.name.trim(),
    competitionId: validatedCompetition.competition._id,
    leaderId: user._id.toString(),
    description: input.description.trim(),
    requiredSkills: normalizeStringList(input.requiredSkills),
    totalSlots: validatedCompetition.totalSlots,
    memberIds: [user._id.toString()],
    status: validatedCompetition.totalSlots === 1 ? 'full' : 'recruiting',
  })

  const competitionMap = await getCompetitionMap()
  return toTeamDto(team, competitionMap)
}

export async function listMyTeams(userId) {
  await ensureSeedTeams()
  const competitionMap = await getCompetitionMap()
  const teams = await Team.find({ memberIds: userId })
  const dto = await Promise.all(teams.map((team) => toTeamDto(team, competitionMap)))
  return dto
}

export async function getTeamById(id) {
  await ensureSeedTeams()
  const team = await findTeamOrThrow(id)
  const competitionMap = await getCompetitionMap()
  return toTeamDto(team, competitionMap)
}

export async function listCompetitionTeams(competitionId) {
  await ensureSeedTeams()
  const competitionMap = await getCompetitionMap()
  const teams = await Team.find({ competitionId })
  const dto = await Promise.all(teams.map((team) => toTeamDto(team, competitionMap)))
  return dto.filter((team) => team.status === 'recruiting')
}

async function assertTeamAllowsLeaveRequest(team, competition) {
  const effectiveStatus = deriveEffectiveStatus(team, competition)

  if (['archived', 'dissolved'].includes(effectiveStatus)) {
    throw new ApiError(400, 'Archived or dissolved teams cannot accept leave requests.')
  }
}

export async function createLeaveRequest(userId, teamId) {
  await ensureSeedTeams()
  const team = await findTeamOrThrow(teamId)
  const competition = await Competition.findById(team.competitionId)
  await assertTeamAllowsLeaveRequest(team, competition)

  if (!team.memberIds.includes(userId)) {
    throw new ApiError(403, 'Only team members can request to leave.')
  }

  if (team.leaderId === userId) {
    throw new ApiError(400, 'Team leaders cannot create leave requests for their own team.')
  }

  const existingPending = await LeaveRequest.findOne({
    teamId,
    requesterId: userId,
    status: 'pending',
  })

  if (existingPending) {
    throw new ApiError(409, 'A leave request is already pending for this member.')
  }

  const request = await LeaveRequest.create({
    _id: generateLeaveRequestId(),
    teamId,
    competitionId: team.competitionId,
    requesterId: userId,
    status: 'pending',
  })

  return {
    id: request._id,
    _id: request._id,
    teamId: request.teamId,
    competitionId: request.competitionId,
    requesterId: request.requesterId,
    status: request.status,
    reviewedBy: request.reviewedBy,
    reviewedAt: request.reviewedAt,
    createdAt: request.createdAt,
    updatedAt: request.updatedAt,
  }
}

export async function listIncomingLeaveRequests(leaderId) {
  await ensureSeedTeams()
  const teams = await Team.find({ leaderId }).lean()
  const teamMap = new Map(teams.map((team) => [team._id, team]))
  const requests = await LeaveRequest.find({ teamId: { $in: teams.map((team) => team._id) } }).sort({ createdAt: -1 })
  const competitionMap = await getCompetitionMap()

  const requesterIds = [...new Set(requests.map((request) => request.requesterId))]
  const users = await User.find({ _id: { $in: requesterIds } }).lean()
  const userMap = new Map(users.map((user) => [user._id.toString(), user]))

  return requests.map((request) => {
    const team = teamMap.get(request.teamId)
    const competition = competitionMap.get(request.competitionId)
    const seedUser = seedMemberDirectory[request.requesterId]
    return {
      id: request._id,
      _id: request._id,
      teamId: request.teamId,
      teamName: team?.name ?? 'Unknown Team',
      competitionId: request.competitionId,
      competitionTitle: competition?.title ?? 'Unknown Competition',
      requesterId: request.requesterId,
      requesterName: userMap.get(request.requesterId)?.username ?? seedUser?.username ?? 'Unknown User',
      status: request.status,
      reviewedBy: request.reviewedBy,
      reviewedAt: request.reviewedAt,
      createdAt: request.createdAt,
      updatedAt: request.updatedAt,
    }
  })
}

export async function reviewLeaveRequest(leaderId, requestId, status) {
  await ensureSeedTeams()
  const request = await LeaveRequest.findById(requestId)
  if (!request) {
    throw notFound('Leave request not found.')
  }

  const team = await findTeamOrThrow(request.teamId)
  if (team.leaderId !== leaderId) {
    throw new ApiError(403, 'Only the team leader can review this leave request.')
  }

  if (request.status !== 'pending') {
    throw new ApiError(400, 'This leave request has already been reviewed.')
  }

  request.status = status
  request.reviewedBy = leaderId
  request.reviewedAt = new Date()
  await request.save()

  if (status === 'approved') {
    team.memberIds = team.memberIds.filter((memberId) => memberId !== request.requesterId)
    team.status = deriveEffectiveStatus(team, await Competition.findById(team.competitionId))
    await team.save()
  }

  return {
    id: request._id,
    _id: request._id,
    teamId: request.teamId,
    competitionId: request.competitionId,
    requesterId: request.requesterId,
    status: request.status,
    reviewedBy: request.reviewedBy,
    reviewedAt: request.reviewedAt,
    createdAt: request.createdAt,
    updatedAt: request.updatedAt,
  }
}
