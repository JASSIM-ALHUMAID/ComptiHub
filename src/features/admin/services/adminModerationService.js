import { apiClient } from '../../../lib/api/client'
import { endpoints } from '../../../lib/api/endpoints'
import { authService } from '../../auth/services/authService'

function formatRole(user) {
  const role = user.role ?? user.defaultRole ?? user.systemRole

  if (role === 'teamLeader') {
    return 'Team Leader'
  }

  if (role === 'competitor') {
    return 'Competitor'
  }

  if (role === 'admin') {
    return 'Admin'
  }

  return role ?? 'User'
}

function formatStatus(user) {
  const status = user.status ?? user.accountStatus

  if (status === 'active') {
    return 'Clear'
  }

  if (status === 'suspended' || status === 'banned') {
    return 'Flagged'
  }

  return status ?? 'Clear'
}

function normalizeUser(user) {
  return {
    ...user,
    id: user.id ?? user._id,
    _id: user._id ?? user.id,
    name: user.name ?? user.username ?? user.email ?? 'Unknown user',
    role: formatRole(user),
    status: formatStatus(user),
    engagement: user.engagement ?? 'Not available',
    lastActive: user.lastActive ?? 'Not available',
  }
}

export const adminModerationService = {
  async listUsers() {
    const data = await apiClient(endpoints.adminModeration.listUsers, {
      token: authService.getToken(),
    })
    return (data.users ?? []).map(normalizeUser)
  },

  async createModerationAction(userId, { penalty, duration, reason }) {
    const data = await apiClient(endpoints.adminModeration.createAction(userId), {
      method: 'POST',
      body: { penalty, duration, reason },
      token: authService.getToken(),
    })
    return data
  },
}

