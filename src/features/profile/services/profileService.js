import { getUserProfile, saveUserProfile } from '../../../data/mocks/profile'
import { formatSkillLabel, getUserSkills, saveUserSkills } from '../../../data/mocks/skills'

export const profileService = {
  getProfile: getUserProfile,
  saveProfile: saveUserProfile,
  getSkills: getUserSkills,
  saveSkills: saveUserSkills,
  formatSkillLabel,
}
