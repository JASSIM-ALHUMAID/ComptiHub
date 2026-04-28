import { ApiError, notFound } from '../../utils/apiError.js'
import { User } from '../auth/user.model.js'
import { ModerationAction } from './moderationAction.model.js'

function toId(value) {
  if (!value) {
    return null
  }

  return (value._id || value).toString()
}

function serializeAdminUser(user) {
  return {
    id: toId(user),
    username: user.username,
    email: user.email,
    systemRole: user.systemRole,
    defaultRole: user.defaultRole,
    activeRole: user.activeRole,
    accountStatus: user.accountStatus,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt,
  }
}

function serializeModerationAction(action) {
  return {
    id: toId(action),
    targetUserId: toId(action.targetUserId),
    adminUserId: toId(action.adminUserId),
    penalty: action.penalty,
    duration: action.duration,
    reason: action.reason,
    createdAt: action.createdAt,
  }
}

function nextAccountStatusForPenalty(currentStatus, penalty) {
  if (penalty === 'suspend') {
    return 'suspended'
  }

  if (penalty === 'ban') {
    return 'banned'
  }

  return currentStatus
}

function escapeRegex(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}

export async function listAdminUsers(filters = {}) {
  const query = {}

  if (filters.accountStatus) {
    query.accountStatus = filters.accountStatus
  }

  if (filters.systemRole) {
    query.systemRole = filters.systemRole
  }

  if (filters.search) {
    const search = escapeRegex(filters.search)

    query.$or = [
      { username: { $regex: search, $options: 'i' } },
      { email: { $regex: search, $options: 'i' } },
    ]
  }

  const users = await User.find(query).sort({ createdAt: -1 }).lean()
  return users.map(serializeAdminUser)
}

export async function createModerationAction(adminUser, targetUserId, input) {
  if (toId(adminUser) === targetUserId) {
    throw new ApiError(400, 'Admins cannot moderate their own account.')
  }

  const targetUser = await User.findById(targetUserId)

  if (!targetUser) {
    throw notFound('User not found.')
  }

  const action = await ModerationAction.create({
    targetUserId: targetUser._id,
    adminUserId: adminUser._id,
    penalty: input.penalty,
    duration: input.duration,
    reason: input.reason,
  })

  targetUser.accountStatus = nextAccountStatusForPenalty(targetUser.accountStatus, input.penalty)
  await targetUser.save()

  return {
    action: serializeModerationAction(action),
    user: serializeAdminUser(targetUser),
  }
}

export async function listModerationActions(targetUserId) {
  const targetUser = await User.findById(targetUserId).lean()

  if (!targetUser) {
    throw notFound('User not found.')
  }

  const actions = await ModerationAction.find({ targetUserId }).sort({ createdAt: -1 }).lean()
  return actions.map(serializeModerationAction)
}
