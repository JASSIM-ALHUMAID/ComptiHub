import { apiClient } from '../../../lib/api/client'
import { endpoints } from '../../../lib/api/endpoints'
import { authService } from '../../auth/services/authService'

function formatSkillLabel(skill) {
  return skill
    .split('-')
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(' ')
}

export const profileService = {
  formatSkillLabel,

  async getProfile(userId) {
    void userId

    const data = await apiClient(endpoints.profile.me, {
      token: authService.getToken(),
    })
    return data.profile
  },

  async saveProfile(userId, profile) {
    void userId

    const data = await apiClient(endpoints.profile.me, {
      method: 'PATCH',
      body: {
        university: profile.university,
        major: profile.major,
        year: profile.year,
        competitor: profile.competitor,
        teamLeader: profile.teamLeader,
      },
      token: authService.getToken(),
    })

    return data.profile
  },

  async getSkills(userId) {
    void userId

    const data = await apiClient(endpoints.profile.skills, {
      token: authService.getToken(),
    })
    return data.skills
  },

  async saveSkills(userId, skills) {
    void userId

    const data = await apiClient(endpoints.profile.skills, {
      method: 'PUT',
      body: { skills },
      token: authService.getToken(),
    })
    return data.skills
  },
}
