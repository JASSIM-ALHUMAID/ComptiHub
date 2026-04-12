import { storage } from '../../lib/utils/storage'

const USER_SKILLS_KEY = 'compitihub.profile.skills'

export const userSkills = {
  'user-2': ['Competitive Programming', 'Figma', 'React', 'Team Collaboration'],
  'user-leader-1': ['Algorithms', 'C++', 'Team Leadership', 'Contest Strategy'],
}

function sanitizeSkills(skills) {
  return Array.from(
    new Set(
      skills
        .map((skill) => skill.trim())
        .filter(Boolean),
    ),
  )
}

function readStoredSkills() {
  const storedSkills = storage.get(USER_SKILLS_KEY)

  if (!storedSkills) {
    return {}
  }

  try {
    return JSON.parse(storedSkills)
  } catch {
    return {}
  }
}

function writeStoredSkills(skills) {
  storage.set(USER_SKILLS_KEY, JSON.stringify(skills))
}

export function getUserSkills(userId) {
  if (!userId) {
    return []
  }

  const storedSkills = readStoredSkills()
  return sanitizeSkills(storedSkills[userId] ?? userSkills[userId] ?? [])
}

export function saveUserSkills(userId, skills) {
  if (!userId) {
    return []
  }

  const nextSkills = sanitizeSkills(skills)
  const storedSkills = readStoredSkills()

  writeStoredSkills({
    ...storedSkills,
    [userId]: nextSkills,
  })

  return nextSkills
}
