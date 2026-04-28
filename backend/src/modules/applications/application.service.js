import mongoose from 'mongoose'
import { ApiError, notFound } from '../../utils/apiError.js'
import { Competition } from '../competitions/competition.model.js'
import { Profile } from '../profile/profile.model.js'
import { Team } from '../teams/team.model.js'
import { Application, activeApplicationStatuses } from './application.model.js'

function toId(value) {
  if (!value) {
    return null
  }

  return (value._id || value).toString()
}

function sameId(left, right) {
  return toId(left) === toId(right)
}

function includesId(values, id) {
  return values.some((value) => sameId(value, id))
}

function maybeSession(query, session) {
  return session ? query.session(session) : query
}

function isTransactionUnsupported(error) {
  return error?.code === 20 && /transaction/i.test(error.message || '')
}

function deriveTeamStatus(team) {
  if (!['recruiting', 'full'].includes(team.status)) {
    return team.status
  }

  return team.memberIds.length >= team.totalSlots ? 'full' : 'recruiting'
}

function isPastDate(value) {
  if (!value) {
    return false
  }

  const date = value instanceof Date ? value : new Date(value)

  return !Number.isNaN(date.getTime()) && date.getTime() < Date.now()
}

async function runInTransaction(work) {
  const session = await mongoose.startSession()

  try {
    let result
    await session.withTransaction(async () => {
      result = await work(session)
    })
    return result
  } catch (error) {
    if (isTransactionUnsupported(error)) {
      return work(null)
    }

    throw error
  } finally {
    await session.endSession()
  }
}

function ensureCompetitionAcceptsApplications(competition) {
  if (competition.status !== 'open') {
    throw new ApiError(409, 'Competition registration is not open.')
  }

  if (competition.participationType === 'solo') {
    throw new ApiError(409, 'Solo competitions do not use team applications.')
  }

  const registrationDeadline = competition.registrationDeadline || competition.deadline

  if (isPastDate(registrationDeadline)) {
    throw new ApiError(409, 'Competition registration deadline has passed.')
  }
}

function ensureTeamAcceptsApplications(team) {
  if (team.status !== 'recruiting') {
    throw new ApiError(409, 'Team is not accepting applications.')
  }

  if (team.memberIds.length >= team.totalSlots) {
    throw new ApiError(409, 'Team is already full.')
  }
}

function serializeTeamSummary(team) {
  if (!team || typeof team !== 'object') {
    return null
  }

  const memberCount = Array.isArray(team.memberIds) ? team.memberIds.length : 0

  return {
    id: toId(team),
    name: team.name,
    status: team.status,
    totalSlots: team.totalSlots,
    memberCount,
    openSlots: Math.max((team.totalSlots || 0) - memberCount, 0),
  }
}

function serializeCompetitionSummary(competition) {
  if (!competition || typeof competition !== 'object') {
    return null
  }

  return {
    id: toId(competition),
    title: competition.title,
    category: competition.category,
    status: competition.status,
    participationType: competition.participationType,
    registrationDeadline: competition.registrationDeadline,
  }
}

function serializeApplication(application) {
  const team = serializeTeamSummary(application.teamId)
  const competition = serializeCompetitionSummary(application.competitionId)

  return {
    id: toId(application),
    applicantId: toId(application.applicantId),
    teamId: toId(application.teamId),
    competitionId: toId(application.competitionId),
    teamName: team?.name,
    competitionTitle: competition?.title,
    message: application.message,
    status: application.status,
    reviewedBy: toId(application.reviewedBy),
    reviewedAt: application.reviewedAt,
    appliedAt: application.createdAt,
    createdAt: application.createdAt,
    updatedAt: application.updatedAt,
    team,
    competition,
  }
}

function serializeIncomingApplication(application, profile) {
  const applicant = application.applicantId
  const team = serializeTeamSummary(application.teamId)
  const competition = serializeCompetitionSummary(application.competitionId)

  return {
    ...serializeApplication(application),
    applicant: applicant
      ? {
          id: toId(applicant),
          username: applicant.username,
          email: applicant.email,
          profileId: profile ? toId(profile) : null,
          skills: profile?.skills || [],
        }
      : null,
    applicantName: applicant?.username,
    skills: profile?.skills || [],
    team,
    competition,
  }
}

async function getApplicationForResponse(id) {
  const application = await Application.findById(id)
    .populate({ path: 'teamId', select: 'name status totalSlots memberIds' })
    .populate({ path: 'competitionId', select: 'title category status participationType registrationDeadline' })
    .lean()

  if (!application) {
    throw notFound('Application not found.')
  }

  return serializeApplication(application)
}

async function assertApplicantCanApply({ user, team, competition }) {
  ensureCompetitionAcceptsApplications(competition)
  ensureTeamAcceptsApplications(team)

  if (sameId(team.leaderId, user._id)) {
    throw new ApiError(409, 'You cannot apply to your own team.')
  }

  if (includesId(team.memberIds, user._id)) {
    throw new ApiError(409, 'You already belong to this team.')
  }

  const ledTeam = await Team.exists({
    competitionId: team.competitionId,
    leaderId: user._id.toString(),
    status: { $nin: ['dissolved', 'archived'] },
  })

  if (ledTeam) {
    throw new ApiError(409, 'You already lead a team in this competition.')
  }

  const existingMembership = await Team.exists({
    competitionId: team.competitionId,
    memberIds: user._id.toString(),
    status: { $nin: ['dissolved', 'archived'] },
  })

  if (existingMembership) {
    throw new ApiError(409, 'You already belong to a team in this competition.')
  }

  const duplicateTeamApplication = await Application.exists({
    applicantId: user._id,
    teamId: team._id,
    status: { $in: activeApplicationStatuses },
  })

  if (duplicateTeamApplication) {
    throw new ApiError(409, 'You already have an active application for this team.')
  }

  const activeCompetitionApplication = await Application.exists({
    applicantId: user._id,
    competitionId: team.competitionId,
    status: { $in: activeApplicationStatuses },
  })

  if (activeCompetitionApplication) {
    throw new ApiError(409, 'You already have an active application for this competition.')
  }
}

export async function createApplication(user, teamId, input) {
  const team = await Team.findById(teamId)

  if (!team) {
    throw notFound('Team not found.')
  }

  const competition = await Competition.findById(team.competitionId)

  if (!competition) {
    throw notFound('Competition not found.')
  }

  await assertApplicantCanApply({ user, team, competition })

  const application = await Application.create({
    applicantId: user._id,
    teamId: team._id,
    competitionId: team.competitionId,
    message: input.message,
    status: 'pending',
  })

  return getApplicationForResponse(application._id)
}

export async function listMyApplications(user) {
  const applications = await Application.find({ applicantId: user._id })
    .sort({ createdAt: -1 })
    .populate({ path: 'teamId', select: 'name status totalSlots memberIds' })
    .populate({ path: 'competitionId', select: 'title category status participationType registrationDeadline' })
    .lean()

  return applications.map(serializeApplication)
}

export async function listIncomingApplications(user, filters = {}) {
  const teams = await Team.find({ leaderId: user._id.toString() }).select('_id').lean()
  const teamIds = teams.map((team) => team._id)

  if (teamIds.length === 0) {
    return []
  }

  const query = {
    teamId: { $in: teamIds },
    status: filters.status || 'pending',
  }

  const applications = await Application.find(query)
    .sort({ createdAt: -1 })
    .populate({ path: 'applicantId', select: 'username email systemRole defaultRole activeRole accountStatus' })
    .populate({ path: 'teamId', select: 'name status totalSlots memberIds' })
    .populate({ path: 'competitionId', select: 'title category status participationType registrationDeadline' })
    .lean()

  const applicantIds = applications.map((application) => toId(application.applicantId)).filter(Boolean)
  const profiles = await Profile.find({ userId: { $in: applicantIds } }).lean()
  const profileByUserId = new Map(profiles.map((profile) => [toId(profile.userId), profile]))

  return applications.map((application) =>
    serializeIncomingApplication(application, profileByUserId.get(toId(application.applicantId))),
  )
}

async function acceptApplication({ applicationId, reviewerId, session }) {
  const application = await maybeSession(Application.findById(applicationId), session)

  if (!application) {
    throw notFound('Application not found.')
  }

  if (application.status !== 'pending') {
    throw new ApiError(409, 'Application has already been reviewed.')
  }

  const team = await maybeSession(Team.findById(application.teamId), session)

  if (!team) {
    throw notFound('Team not found.')
  }

  if (!sameId(team.leaderId, reviewerId)) {
    throw new ApiError(403, 'You can only review applications for teams you lead.')
  }

  const competition = await maybeSession(Competition.findById(application.competitionId), session)

  if (!competition) {
    throw notFound('Competition not found.')
  }

  ensureCompetitionAcceptsApplications(competition)
  ensureTeamAcceptsApplications(team)

  if (includesId(team.memberIds, application.applicantId)) {
    throw new ApiError(409, 'Applicant already belongs to this team.')
  }

  const conflictingMembership = await maybeSession(
    Team.exists({
      _id: { $ne: team._id },
      competitionId: team.competitionId,
      memberIds: application.applicantId.toString(),
      status: { $nin: ['dissolved', 'archived'] },
    }),
    session,
  )

  if (conflictingMembership) {
    throw new ApiError(409, 'Applicant already belongs to another team in this competition.')
  }

  const applicantLedTeam = await maybeSession(
    Team.exists({
      competitionId: team.competitionId,
      leaderId: application.applicantId.toString(),
      status: { $nin: ['dissolved', 'archived'] },
    }),
    session,
  )

  if (applicantLedTeam) {
    throw new ApiError(409, 'Applicant already leads a team in this competition.')
  }

  team.memberIds.push(application.applicantId.toString())
  team.status = deriveTeamStatus(team)
  application.status = 'accepted'
  application.reviewedBy = reviewerId
  application.reviewedAt = new Date()

  await team.save({ session })
  await application.save({ session })

  return application._id
}

async function rejectApplication({ applicationId, reviewerId, session }) {
  const application = await maybeSession(Application.findById(applicationId), session)

  if (!application) {
    throw notFound('Application not found.')
  }

  if (application.status !== 'pending') {
    throw new ApiError(409, 'Application has already been reviewed.')
  }

  const team = await maybeSession(Team.findById(application.teamId), session)

  if (!team) {
    throw notFound('Team not found.')
  }

  if (!sameId(team.leaderId, reviewerId)) {
    throw new ApiError(403, 'You can only review applications for teams you lead.')
  }

  application.status = 'rejected'
  application.reviewedBy = reviewerId
  application.reviewedAt = new Date()
  await application.save({ session })

  return application._id
}

export async function reviewApplication(user, applicationId, status) {
  const reviewedApplicationId = await runInTransaction((session) => {
    if (status === 'accepted') {
      return acceptApplication({ applicationId, reviewerId: user._id, session })
    }

    return rejectApplication({ applicationId, reviewerId: user._id, session })
  })

  return getApplicationForResponse(reviewedApplicationId)
}

