export const editableRoles = ['competitor', 'teamLeader']

export function createProfileForm({ user, profile, roleProfile, skills }) {
  return {
    username: user?.username ?? '',
    email: user?.email ?? '',
    defaultRole: user?.defaultRole ?? 'competitor',
    university: profile.university ?? '',
    major: profile.major ?? '',
    year: profile.year ?? '',
    bio: roleProfile?.bio ?? '',
    skills: [...skills],
  }
}

export function addSkillToForm(form, rawSkill, formatSkillLabel) {
  const normalizedSkill = formatSkillLabel(rawSkill)

  if (!normalizedSkill) {
    return { form, error: 'Enter a skill before adding it.' }
  }

  if (form.skills.some((skill) => skill.toLowerCase() === normalizedSkill.toLowerCase())) {
    return { form, error: 'That skill is already listed.' }
  }

  return {
    form: { ...form, skills: [...form.skills, normalizedSkill] },
    error: '',
  }
}

export function removeSkillFromForm(form, skillToRemove) {
  return {
    ...form,
    skills: form.skills.filter((skill) => skill !== skillToRemove),
  }
}
