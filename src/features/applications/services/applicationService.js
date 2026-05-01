import { apiClient } from '../../../lib/api/client'
import { endpoints } from '../../../lib/api/endpoints'
import { authService } from '../../auth/services/authService'

function normalizeApplication(application) {
  return {
    ...application,
    id: application.id ?? application._id,
    _id: application._id ?? application.id,
  }
}

export const applicationService = {
  async listMyApplications() {
    const data = await apiClient(endpoints.applications.listMine, {
      token: authService.getToken(),
    })
    return (data.applications ?? []).map(normalizeApplication)
  },

  async submitApplication(teamId, message) {
    const data = await apiClient(endpoints.applications.create(teamId), {
      method: 'POST',
      body: { message: message.trim() },
      token: authService.getToken(),
    })
    return normalizeApplication(data.application)
  },
}
