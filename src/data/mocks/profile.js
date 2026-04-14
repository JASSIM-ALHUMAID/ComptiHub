import { storage } from '../../lib/utils/storage'

const USER_PROFILE_KEY = 'compitihub.profile.info'

export const profiles = {
  'user-2': {
    university: 'King Saud University',
    major: 'Computer Science',
    year: '3rd Year',
    competitor: {
      focus: 'Competitive programming and product design collaboration',
      preferredRole: 'Frontend builder and design systems contributor',
      strengths: 'Rapid prototyping, design systems thinking, and cross-team collaboration',
      availability: 'Weekday evenings and most competition weekends',
      bio: 'Interested in fast-moving hackathons, algorithm contests, and teams that need a mix of technical execution and visual thinking.',
    },
    teamLeader: {
      focus: 'Small hackathon squads with strong product execution and clear delivery milestones',
      preferredTeamSetup: 'Cross-functional teams that pair fast prototyping with clean presentation quality',
      strengths: 'Coordinating delivery, translating ideas into tasks, and keeping design and frontend aligned',
      availability: 'Available for planning most evenings and active during weekend competition sprints',
      bio: 'I enjoy leading compact teams that need structure, rapid iteration, and a strong final polish before submission.',
    },
  },
  'user-leader-1': {
    university: 'KFUPM',
    major: 'Software Engineering',
    year: '4th Year',
    competitor: {
      focus: 'Algorithm contests, systems challenges, and teams that value disciplined preparation',
      preferredRole: 'Problem setter, debugging partner, and contest operations contributor',
      strengths: 'Fast debugging, structured problem solving, and staying calm in time-boxed rounds',
      availability: 'Can train on weekday evenings and fully commit during major competition weekends',
      bio: 'As a competitor, I like joining serious teams that prepare well, communicate clearly, and stay composed under pressure.',
    },
    teamLeader: {
      focus: 'Team leadership and algorithm-heavy competition prep',
      preferredTeamSetup: 'Small contest teams with clear problem ownership and a fast feedback loop',
      strengths: 'Recruiting balanced rosters, contest strategy, and keeping teams calm under pressure',
      availability: 'Available for planning during weekdays and full-day competition support on weekends',
      bio: 'I lead small technical teams, organize training plans, and focus on building reliable rosters for high-pressure university competitions.',
    },
  },
}

function readStoredProfiles() {
  const stored = storage.get(USER_PROFILE_KEY)
  if (!stored) return {}
  try {
    return JSON.parse(stored)
  } catch {
    return {}
  }
}

function writeStoredProfiles(data) {
  storage.set(USER_PROFILE_KEY, JSON.stringify(data))
}

const emptyRoleProfile = {
  focus: '',
  preferredRole: '',
  preferredTeamSetup: '',
  strengths: '',
  availability: '',
  bio: '',
}

const emptyProfile = {
  university: '',
  major: '',
  year: '',
  competitor: { ...emptyRoleProfile },
  teamLeader: { ...emptyRoleProfile },
}

export function getUserProfile(userId) {
  if (!userId) return { ...emptyProfile }
  const stored = readStoredProfiles()
  const seed = profiles[userId] ?? emptyProfile
  return stored[userId] ?? seed
}

export function saveUserProfile(userId, profileData) {
  if (!userId) return profileData
  const stored = readStoredProfiles()
  writeStoredProfiles({ ...stored, [userId]: profileData })
  return profileData
}
