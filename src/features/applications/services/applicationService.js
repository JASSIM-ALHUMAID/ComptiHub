import { apiClient } from '../../../lib/api/client'
import { endpoints } from '../../../lib/api/endpoints'
import { authService } from '../../auth/services/authService'

function normalizeApplication(application) {
  return {
    ...application,
    id: application.id ?? application._id,
    _id: application._id ?? application.id,
    requesterName: application.requesterName ?? application.applicantName ?? application.applicant?.username,
  }
}

export const applicationService = {
  async listMyApplications() {
    const data = await apiClient(endpoints.applications.listMine, {
      token: authService.getToken(),
    })
    return (data.applications ?? []).map(normalizeApplication)
  },

  async listIncomingApplications(filters = {}) {
    const query = new URLSearchParams()
    if (filters.status) query.set('status', filters.status)

    const suffix = query.size > 0 ? `?${query.toString()}` : ''
    const data = await apiClient(`${endpoints.applications.incoming}${suffix}`, {
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

  async reviewApplication(applicationId, status) {
    const data = await apiClient(endpoints.applications.review(applicationId), {
      method: 'PATCH',
      body: { status },
      token: authService.getToken(),
    })
    return normalizeApplication(data.application)
  },
}
