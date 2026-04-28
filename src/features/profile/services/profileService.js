import { apiClient } from '../../../lib/api/client'
import { endpoints } from '../../../lib/api/endpoints'
import { authService } from '../../auth/services/authService'
import { getUserProfile, saveUserProfile } from '../../../data/mocks/profile'
import { formatSkillLabel, getUserSkills, saveUserSkills } from '../../../data/mocks/skills'

function getSessionSource() {
  return authService.getSession()?.source ?? 'mock'
}

export const profileService = {
  formatSkillLabel,

  async getProfile(userId) {
    if (getSessionSource() === 'mock') {
      return getUserProfile(userId)
    }

    const data = await apiClient(endpoints.profile.me, {
      token: authService.getToken(),
    })
    return data.profile
  },

  async saveProfile(userId, profile) {
    if (getSessionSource() === 'mock') {
      return saveUserProfile(userId, profile)
    }

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
    if (getSessionSource() === 'mock') {
      return getUserSkills(userId)
    }

    const data = await apiClient(endpoints.profile.skills, {
      token: authService.getToken(),
    })
    return data.skills
  },

  async saveSkills(userId, skills) {
    if (getSessionSource() === 'mock') {
      return saveUserSkills(userId, skills)
    }

    const data = await apiClient(endpoints.profile.skills, {
      method: 'PUT',
      body: { skills },
      token: authService.getToken(),
    })
    return data.skills
  },
}
