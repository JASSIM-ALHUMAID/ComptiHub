import { useState } from 'react'
import { Pencil, Plus, X } from 'lucide-react'
import Button from '../../components/ui/Button'
import Card from '../../components/ui/Card'
import Badge from '../../components/ui/Badge'
import Input from '../../components/ui/Input'
import Modal from '../../components/ui/Modal'
import Select from '../../components/ui/Select'
import Textarea from '../../components/ui/Textarea'
import { useAuth } from '../../features/auth/hooks/useAuth'
import { roleConfig } from '../../features/account/utils/roleConfig'
import { getUserProfile, saveUserProfile } from '../../data/mocks/profile'
import { formatSkillLabel, getUserSkills, saveUserSkills } from '../../data/mocks/skills'

function renderProfileValue(value, { emptyLabel = 'Not added yet', filledClassName, emptyClassName } = {}) {
  if (value) {
    return <p className={filledClassName}>{value}</p>
  }

  return <p className={emptyClassName ?? 'mt-2 text-sm italic text-[rgba(226,226,232,0.58)]'}>{emptyLabel}</p>
}

const editableRoles = ['competitor', 'teamLeader']

export default function ProfilePage() {
  const { user, updateDefaultRole, updateBasicInfo } = useAuth()
  const profile = getUserProfile(user?.id)
  const skills = getUserSkills(user?.id)
  const activeRole = user?.activeRole ?? user?.defaultRole ?? 'competitor'
  const isStudentProfileView = activeRole === 'competitor' || activeRole === 'teamLeader'
  const isLeaderProfile = activeRole === 'teamLeader'
  const roleProfile = isStudentProfileView ? profile[activeRole] : null

  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState('')

  // Modal form state
  const [form, setForm] = useState({
    username: user?.username ?? '',
    email: user?.email ?? '',
    defaultRole: user?.defaultRole ?? 'competitor',
    university: profile.university ?? '',
    major: profile.major ?? '',
    year: profile.year ?? '',
    bio: roleProfile?.bio ?? '',
    skills: skills,
  })

  // Skill draft state (internal to modal)
  const [draftSkill, setDraftSkill] = useState('')
  const [skillsError, setSkillsError] = useState('')

  function openEditModal() {
    setForm({
      username: user?.username ?? '',
      email: user?.email ?? '',
      defaultRole: user?.defaultRole ?? 'competitor',
      university: profile.university ?? '',
      major: profile.major ?? '',
      year: profile.year ?? '',
      bio: roleProfile?.bio ?? '',
      skills: [...skills],
    })
    setDraftSkill('')
    setSkillsError('')
    setError('')
    setIsEditModalOpen(true)
  }

  function closeEditModal() {
    setIsEditModalOpen(false)
  }

  function handleAddSkill() {
    const normalizedSkill = formatSkillLabel(draftSkill)

    if (!normalizedSkill) {
      setSkillsError('Enter a skill before adding it.')
      return
    }

    if (form.skills.some((skill) => skill.toLowerCase() === normalizedSkill.toLowerCase())) {
      setSkillsError('That skill is already listed.')
      return
    }

    setForm((prev) => ({
      ...prev,
      skills: [...prev.skills, normalizedSkill],
    }))
    setDraftSkill('')
    setSkillsError('')
  }

  function handleRemoveSkill(skillToRemove) {
    setForm((prev) => ({
      ...prev,
      skills: prev.skills.filter((skill) => skill !== skillToRemove),
    }))
  }

  async function handleSave(event) {
    event.preventDefault()
    setIsSubmitting(true)
    setError('')

    try {
      // 1. Update basic info (username/email)
      await updateBasicInfo({ username: form.username, email: form.email })

      // 2. Update default role
      await updateDefaultRole(form.defaultRole)

      // 3. Save profile metadata (university, major, year, bio)
      // Note: We update the bio for the current active role
      saveUserProfile(user?.id, {
        ...profile,
        university: form.university,
        major: form.major,
        year: form.year,
        [activeRole]: {
          ...profile[activeRole],
          bio: form.bio,
        },
      })

      // 4. Save skills
      saveUserSkills(user?.id, form.skills)

      setIsEditModalOpen(false)
    } catch (err) {
      setError(err.message || 'Unable to save profile changes.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <>
      <main className="space-y-8">
        <header className="flex items-end justify-between gap-4">
          <div className="space-y-2">
            <p className="landing-label text-[0.68rem] text-[rgba(250,204,21,0.82)]">Account</p>
            <h1 className="landing-title text-3xl text-(--landing-text)">Profile</h1>
          </div>
          <Button className="gap-2" onClick={openEditModal}>
            <Pencil className="h-4 w-4" />
            Edit Profile
          </Button>
        </header>

        <section className="grid gap-6">
          {/* Identity & Education Card */}
          <Card className="grid gap-8 md:grid-cols-2">
            <div className="space-y-6">
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <p className="landing-ui-text text-[0.7rem] text-[rgba(226,226,232,0.55)]">Username</p>
                  <p className="mt-1 text-lg font-semibold">{user?.username}</p>
                </div>
                <div>
                  <p className="landing-ui-text text-[0.7rem] text-[rgba(226,226,232,0.55)]">Email</p>
                  <p className="mt-1 text-lg font-semibold">{user?.email}</p>
                </div>
              </div>

              <div className="flex flex-wrap gap-4">
                <div>
                  <p className="landing-ui-text text-[0.7rem] text-[rgba(226,226,232,0.55)]">Default Role</p>
                  <Badge className="mt-1" variant="gold">{roleConfig[user?.defaultRole]?.label ?? 'Competitor'}</Badge>
                </div>
                <div>
                  <p className="landing-ui-text text-[0.7rem] text-[rgba(226,226,232,0.55)]">Current View</p>
                  <Badge className="mt-1" variant="gold">{roleConfig[user?.activeRole]?.label ?? 'Competitor'}</Badge>
                </div>
              </div>
            </div>

            <div className="space-y-6 border-t border-[rgba(226,226,232,0.1)] pt-6 md:border-l md:border-t-0 md:pl-8 md:pt-0">
              <div>
                <p className="landing-ui-text text-[0.7rem] text-[rgba(250,204,21,0.82)]">Education</p>
                <div className="mt-2 space-y-4">
                  <div>
                    <p className="landing-ui-text text-[0.6rem] uppercase tracking-wider text-[rgba(226,226,232,0.4)]">University</p>
                    {renderProfileValue(profile.university, {
                      filledClassName: 'mt-1 text-base font-medium text-(--landing-text)',
                    })}
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="landing-ui-text text-[0.6rem] uppercase tracking-wider text-[rgba(226,226,232,0.4)]">Major</p>
                      {renderProfileValue(profile.major, {
                        filledClassName: 'mt-1 text-base font-medium text-(--landing-text)',
                      })}
                    </div>
                    <div>
                      <p className="landing-ui-text text-[0.6rem] uppercase tracking-wider text-[rgba(226,226,232,0.4)]">Year</p>
                      {renderProfileValue(profile.year, {
                        filledClassName: 'mt-1 text-base font-medium text-(--landing-text)',
                      })}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </Card>

          {/* Summary & Skills Section */}
          <div className="grid gap-6 xl:grid-cols-[minmax(0,1.2fr)_minmax(300px,0.8fr)]">
            <Card className="space-y-6">
              <div>
                <p className="landing-ui-text text-[0.7rem] text-[rgba(250,204,21,0.82)]">Summary / Objective</p>
                <div className="mt-3">
                  {renderProfileValue(roleProfile?.bio, {
                    emptyLabel: 'No summary added yet. Add one to help teams understand your goals.',
                    filledClassName: 'landing-copy text-sm leading-relaxed text-[rgba(226,226,232,0.85)] sm:text-base',
                  })}
                </div>
              </div>

              {/* Snapshot fields from previous version */}
              <div className="grid gap-4 border-t border-[rgba(226,226,232,0.1)] pt-6 sm:grid-cols-2">
                <div>
                  <p className="landing-ui-text text-[0.65rem] text-[rgba(226,226,232,0.55)]">
                    {isLeaderProfile ? 'Recruiting Focus' : 'Competition Focus'}
                  </p>
                  {renderProfileValue(roleProfile?.focus, {
                    filledClassName: 'mt-1 text-sm font-medium text-(--landing-text)',
                  })}
                </div>
                <div>
                  <p className="landing-ui-text text-[0.65rem] text-[rgba(226,226,232,0.55)]">
                    {isLeaderProfile ? 'Team Setup' : 'Preferred Role'}
                  </p>
                  {renderProfileValue(isLeaderProfile ? roleProfile?.preferredTeamSetup : roleProfile?.preferredRole, {
                    filledClassName: 'mt-1 text-sm font-medium text-(--landing-text)',
                  })}
                </div>
              </div>
            </Card>

            <Card className="space-y-4">
              <div>
                <p className="landing-ui-text text-[0.7rem] text-[rgba(250,204,21,0.82)]">Skills</p>
                <p className="landing-copy mt-2 text-xs text-[rgba(226,226,232,0.6)]">
                  These tags help teammates find you based on technical strengths.
                </p>
              </div>
              <div className="flex flex-wrap gap-2">
                {skills.length > 0 ? (
                  skills.map((skill) => (
                    <Badge key={skill} variant="default">{skill}</Badge>
                  ))
                ) : (
                  <p className="landing-copy text-sm italic text-[rgba(226,226,232,0.4)]">No skills listed yet.</p>
                )}
              </div>
            </Card>
          </div>
        </section>
      </main>

      <Modal
        aria-describedby="edit-profile-description"
        aria-labelledby="edit-profile-title"
        open={isEditModalOpen}
        onClose={closeEditModal}
        className="bg-[rgba(12,14,18,0.76)] backdrop-blur-sm"
      >
        <div className="flex min-h-full items-center justify-center p-4 sm:p-6">
          <section className="max-h-[calc(100dvh-2rem)] w-full max-w-3xl overflow-y-auto rounded-[1.6rem] border border-[rgba(77,70,50,0.24)] bg-[rgba(17,19,23,0.98)] shadow-[0_24px_80px_rgba(0,0,0,0.42)] sm:max-h-[calc(100dvh-3rem)]">
            <div className="sticky top-0 z-10 flex items-start justify-between gap-4 border-b border-[rgba(77,70,50,0.18)] bg-[rgba(17,19,23,0.95)] p-6 backdrop-blur-md sm:p-8">
              <div className="space-y-2">
                <p className="landing-label text-[0.68rem] text-[rgba(250,204,21,0.82)]">Account setup</p>
                <h2 className="landing-title text-2xl text-(--landing-text) sm:text-3xl" id="edit-profile-title">
                  Edit Profile
                </h2>
                <p className="landing-copy text-sm leading-6 text-[rgba(226,226,232,0.72)]" id="edit-profile-description">
                  Update your identity, education, and professional snapshot.
                </p>
              </div>
              <button
                aria-label="Close dialog"
                className="rounded-full border border-[rgba(77,70,50,0.24)] p-3 text-[rgba(226,226,232,0.76)] transition-colors duration-200 hover:border-(--landing-gold) hover:text-(--landing-gold-soft)"
                type="button"
                onClick={closeEditModal}
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form className="space-y-8 p-6 sm:p-8" onSubmit={handleSave}>
              {/* Basic & Account Section */}
              <div className="space-y-6">
                <div>
                  <h3 className="landing-ui-text text-[0.7rem] font-bold uppercase tracking-wider text-(--landing-gold-soft)">Basic Information</h3>
                  <div className="mt-4 grid gap-4 sm:grid-cols-2">
                    <label className="space-y-2">
                      <span className="landing-ui-text text-[0.74rem] text-(--landing-text)">Username</span>
                      <Input
                        value={form.username}
                        onChange={(e) => setForm({ ...form, username: e.target.value })}
                        disabled={isSubmitting}
                        placeholder="Your username"
                        required
                      />
                    </label>
                    <label className="space-y-2">
                      <span className="landing-ui-text text-[0.74rem] text-(--landing-text)">Email Address</span>
                      <Input
                        type="email"
                        value={form.email}
                        onChange={(e) => setForm({ ...form, email: e.target.value })}
                        disabled={isSubmitting}
                        placeholder="your@email.com"
                        required
                      />
                    </label>
                  </div>
                </div>

                <div className="grid gap-4 sm:grid-cols-3">
                  <label className="space-y-2">
                    <span className="landing-ui-text text-[0.74rem] text-(--landing-text)">University</span>
                    <Input
                      value={form.university}
                      onChange={(e) => setForm({ ...form, university: e.target.value })}
                      disabled={isSubmitting}
                      placeholder="e.g. King Saud University"
                    />
                  </label>
                  <label className="space-y-2">
                    <span className="landing-ui-text text-[0.74rem] text-(--landing-text)">Major</span>
                    <Input
                      value={form.major}
                      onChange={(e) => setForm({ ...form, major: e.target.value })}
                      disabled={isSubmitting}
                      placeholder="e.g. Computer Science"
                    />
                  </label>
                  <label className="space-y-2">
                    <span className="landing-ui-text text-[0.74rem] text-(--landing-text)">Year</span>
                    <Input
                      value={form.year}
                      onChange={(e) => setForm({ ...form, year: e.target.value })}
                      disabled={isSubmitting}
                      placeholder="e.g. 3rd Year"
                    />
                  </label>
                </div>
              </div>

              {/* Summary Section */}
              <div className="space-y-4">
                <h3 className="landing-ui-text text-[0.7rem] font-bold uppercase tracking-wider text-(--landing-gold-soft)">Professional Snapshot</h3>
                <label className="block space-y-2">
                  <span className="landing-ui-text text-[0.74rem] text-(--landing-text)">Summary / Objective</span>
                  <Textarea
                    rows={4}
                    value={form.bio}
                    onChange={(e) => setForm({ ...form, bio: e.target.value })}
                    disabled={isSubmitting}
                    placeholder="Tell teams about your goals and how you contribute..."
                  />
                  <p className="landing-copy text-xs text-[rgba(226,226,232,0.6)]">
                    This will appear on your profile card when teams search for participants.
                  </p>
                </label>
              </div>

              {/* Skills Section */}
              <div className="space-y-4">
                <h3 className="landing-ui-text text-[0.7rem] font-bold uppercase tracking-wider text-(--landing-gold-soft)">Skills & Expertise</h3>
                <div className="space-y-3">
                  <div className="flex flex-col gap-3 sm:flex-row">
                    <Input
                      className="flex-1"
                      placeholder="Add a skill (e.g. Python, UX Design...)"
                      value={draftSkill}
                      onChange={(e) => setDraftSkill(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault()
                          handleAddSkill()
                        }
                      }}
                      disabled={isSubmitting}
                    />
                    <Button type="button" variant="outline-gold" onClick={handleAddSkill} disabled={isSubmitting}>
                      <Plus className="h-4 w-4 mr-2" />
                      Add
                    </Button>
                  </div>
                  {skillsError && <p className="text-xs text-(--landing-danger)">{skillsError}</p>}

                  <div className="flex flex-wrap gap-2 pt-2">
                    {form.skills.map((skill) => (
                      <span
                        key={skill}
                        className="inline-flex items-center gap-2 rounded-full border border-[rgba(77,70,50,0.32)] bg-[rgba(12,14,18,0.7)] px-3 py-1.5 text-sm font-semibold text-(--landing-text)"
                      >
                        {skill}
                        <button
                          type="button"
                          className="hover:text-(--landing-danger) transition-colors"
                          onClick={() => handleRemoveSkill(skill)}
                          disabled={isSubmitting}
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </span>
                    ))}
                    {form.skills.length === 0 && (
                      <p className="text-sm italic text-[rgba(226,226,232,0.4)]">No skills added yet.</p>
                    )}
                  </div>
                </div>
              </div>

              {/* Account Settings */}
              <div className="space-y-4 rounded-2xl border border-[rgba(77,70,50,0.15)] bg-[rgba(255,255,255,0.02)] p-6">
                <h3 className="landing-ui-text text-[0.7rem] font-bold uppercase tracking-wider text-(--landing-gold-soft)">Account Settings</h3>
                <label className="block space-y-2">
                  <span className="landing-ui-text text-[0.74rem] text-(--landing-text)">Default Role</span>
                  <Select
                    value={form.defaultRole}
                    onChange={(e) => setForm({ ...form, defaultRole: e.target.value })}
                    disabled={isSubmitting}
                  >
                    {editableRoles.map((role) => (
                      <option key={role} value={role}>{roleConfig[role].label}</option>
                    ))}
                  </Select>
                  <p className="landing-copy text-xs text-[rgba(226,226,232,0.6)]">
                    Determines which view opens automatically when you sign in.
                  </p>
                </label>
              </div>

              {error && (
                <p className="rounded-xl border border-[rgba(255,180,171,0.25)] bg-[rgba(255,180,171,0.08)] px-4 py-3 text-sm text-(--landing-danger)">
                  {error}
                </p>
              )}

              <div className="sticky bottom-0 z-10 flex flex-col gap-3 border-t border-[rgba(77,70,50,0.18)] bg-[rgba(17,19,23,0.98)] pt-6 sm:flex-row sm:justify-end">
                <Button className="min-w-32" variant="secondary" onClick={closeEditModal} disabled={isSubmitting}>
                  Cancel
                </Button>
                <Button className="min-w-40" type="submit" disabled={isSubmitting}>
                  {isSubmitting ? 'Saving...' : 'Save Changes'}
                </Button>
              </div>
            </form>
          </section>
        </div>
      </Modal>
    </>
  )
}
