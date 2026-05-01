import { adminModerationUsers } from '../../../data/mocks/adminModeration'
import { apiClient } from '../../../lib/api/client'
import { endpoints } from '../../../lib/api/endpoints'
import { authService } from '../../auth/services/authService'

function normalizeUser(user) {
  return {
    ...user,
    id: user.id ?? user._id,
    _id: user._id ?? user.id,
  }
}

export const adminModerationService = {
  async listUsers() {
    const session = authService.getSession()

    // Fallback to mock for non-API sessions
    if (session?.source !== 'api' || session.accountType !== 'admin') {
      return adminModerationUsers.map(normalizeUser)
    }

    try {
      const data = await apiClient(endpoints.adminModeration.listUsers, {
        token: authService.getToken(),
      })
      return (data.users ?? []).map(normalizeUser)
    } catch {
      // Fallback to mock on API error
      return adminModerationUsers.map(normalizeUser)
    }
  },

  async updateUserStatus(userId, status, reason) {
    const session = authService.getSession()

    if (session?.source !== 'api' || session.accountType !== 'admin') {
      // Mock implementation - just return success
      return { success: true }
    }

    const data = await apiClient(endpoints.adminModeration.updateUserStatus(userId), {
      method: 'PATCH',
      body: { status, reason },
      token: authService.getToken(),
    })
    return data
  },
}

