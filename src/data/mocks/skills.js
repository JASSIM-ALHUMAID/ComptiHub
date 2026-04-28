import { getUserProfile, saveUserProfile } from './profile'

const skillLabelOverrides = {
  ai: 'AI',
  api: 'API',
  aws: 'AWS',
  'c#': 'C#',
  'c++': 'C++',
  'ci/cd': 'CI/CD',
  css: 'CSS',
  html: 'HTML',
  icpc: 'ICPC',
  ios: 'iOS',
  javascript: 'JavaScript',
  ml: 'ML',
  'node.js': 'Node.js',
  nlp: 'NLP',
  qa: 'QA',
  ros: 'ROS',
  sql: 'SQL',
  typescript: 'TypeScript',
  'ui/ux': 'UI/UX',
  ui: 'UI',
  ux: 'UX',
}

function formatSkillToken(token) {
  const normalizedToken = token.trim().toLowerCase()

  if (!normalizedToken) {
    return ''
  }

  if (skillLabelOverrides[normalizedToken]) {
    return skillLabelOverrides[normalizedToken]
  }

  return normalizedToken.charAt(0).toUpperCase() + normalizedToken.slice(1)
}

function titleizeSkill(skill) {
  return skill
    .trim()
    .split(/([\s-/]+)/)
    .map((part) => {
      if (/^[\s-/]+$/.test(part)) {
        return part
      }

      return formatSkillToken(part)
    })
    .join('')
}

export function formatSkillLabel(skill) {
  if (typeof skill !== 'string') {
    return ''
  }

  const normalizedSkill = skill.trim().toLowerCase()

  if (!normalizedSkill) {
    return ''
  }

  if (skillLabelOverrides[normalizedSkill]) {
    return skillLabelOverrides[normalizedSkill]
  }

  return titleizeSkill(skill)
}

function sanitizeSkills(skills) {
  const sanitizedSkills = []
  const seenSkills = new Set()

  skills.forEach((skill) => {
    const formattedSkill = formatSkillLabel(skill)

    if (!formattedSkill) {
      return
    }

    const skillKey = formattedSkill.toLowerCase()

    if (seenSkills.has(skillKey)) {
      return
    }

    seenSkills.add(skillKey)
    sanitizedSkills.push(formattedSkill)
  })

  return sanitizedSkills
}

export function getUserSkills(userId) {
  if (!userId) {
    return []
  }

  return sanitizeSkills(getUserProfile(userId).skills ?? [])
}

export function saveUserSkills(userId, skills) {
  if (!userId) {
    return []
  }

  const nextSkills = sanitizeSkills(skills)
  const profile = getUserProfile(userId)
  saveUserProfile(userId, {
    ...profile,
    skills: nextSkills,
  })

  return nextSkills
}
