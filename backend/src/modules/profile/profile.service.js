import { Profile } from './profile.model.js'

function sanitizeSkills(skills = []) {
  const sanitized = []
  const seen = new Set()

  skills.forEach((skill) => {
    const normalized = skill.trim()

    if (!normalized) {
      return
    }

    const key = normalized.toLowerCase()
    if (seen.has(key)) {
      return
    }

    seen.add(key)
    sanitized.push(normalized)
  })

  return sanitized
}

function toProfileDto(profile) {
  return {
    id: profile._id.toString(),
    userId: profile.userId.toString(),
    university: profile.university,
    major: profile.major,
    year: profile.year,
    competitor: {
      focus: profile.competitor?.focus ?? '',
      preferredRole: profile.competitor?.preferredRole ?? '',
      strengths: profile.competitor?.strengths ?? '',
      availability: profile.competitor?.availability ?? '',
      bio: profile.competitor?.bio ?? '',
    },
    teamLeader: {
      focus: profile.teamLeader?.focus ?? '',
      preferredTeamSetup: profile.teamLeader?.preferredTeamSetup ?? '',
      strengths: profile.teamLeader?.strengths ?? '',
      availability: profile.teamLeader?.availability ?? '',
      bio: profile.teamLeader?.bio ?? '',
    },
    skills: sanitizeSkills(profile.skills),
    createdAt: profile.createdAt,
    updatedAt: profile.updatedAt,
  }
}

async function ensureProfile(userId) {
  return Profile.findOneAndUpdate({ userId }, { $setOnInsert: { userId } }, { new: true, upsert: true })
}

async function findProfile(userId) {
  return Profile.findOne({ userId })
}

export async function createProfileForUser(userId) {
  const profile = await ensureProfile(userId)
  return toProfileDto(profile)
}

export async function getProfileByUserId(userId) {
  const profile = await ensureProfile(userId)
  return toProfileDto(profile)
}

export async function getExistingProfileByUserId(userId) {
  const profile = await findProfile(userId)

  if (!profile) {
    return null
  }

  return toProfileDto(profile)
}

export async function updateProfileByUserId(userId, updates) {
  const profile = await ensureProfile(userId)

  if (updates.university !== undefined) profile.university = updates.university
  if (updates.major !== undefined) profile.major = updates.major
  if (updates.year !== undefined) profile.year = updates.year

  if (updates.competitor) {
    Object.assign(profile.competitor, updates.competitor)
  }

  if (updates.teamLeader) {
    Object.assign(profile.teamLeader, updates.teamLeader)
  }

  await profile.save()
  return toProfileDto(profile)
}

export async function getProfileSkillsByUserId(userId) {
  const profile = await ensureProfile(userId)
  return sanitizeSkills(profile.skills)
}

export async function replaceProfileSkillsByUserId(userId, skills) {
  const profile = await ensureProfile(userId)
  profile.skills = sanitizeSkills(skills)
  await profile.save()
  return sanitizeSkills(profile.skills)
}
