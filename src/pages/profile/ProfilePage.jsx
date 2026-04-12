import { useState } from 'react'
import { Pencil, Plus, X } from 'lucide-react'
import { Link } from 'react-router-dom'
import Button from '../../components/ui/Button'
import Card from '../../components/ui/Card'
import Badge from '../../components/ui/Badge'
import Input from '../../components/ui/Input'
import Modal from '../../components/ui/Modal'
import { useAuth } from '../../features/auth/hooks/useAuth'
import { roleConfig } from '../../features/account/utils/roleConfig'
import { profiles } from '../../data/mocks/profile'
import { formatSkillLabel, getUserSkills, saveUserSkills } from '../../data/mocks/skills'
import { routes } from '../../lib/constants/routes'

export default function ProfilePage() {
  const { user } = useAuth()
  const profile = profiles[user?.id]
  const skills = getUserSkills(user?.id)
  const activeRole = user?.activeRole ?? user?.defaultRole ?? 'competitor'
  const isLeaderProfile = activeRole === 'teamLeader'
  const roleProfile = profile?.[activeRole] ?? null
  const [draftSkills, setDraftSkills] = useState(() => getUserSkills(user?.id))
  const [draftSkill, setDraftSkill] = useState('')
  const [skillsError, setSkillsError] = useState('')
  const [isSkillsDialogOpen, setIsSkillsDialogOpen] = useState(false)

  const profileHighlights = isLeaderProfile
    ? [
        { label: 'Recruiting Focus', value: roleProfile?.focus },
        { label: 'Preferred Team Setup', value: roleProfile?.preferredTeamSetup },
        { label: 'Leadership Strengths', value: roleProfile?.strengths },
        { label: 'Availability', value: roleProfile?.availability },
      ]
    : [
        { label: 'Competition Focus', value: roleProfile?.focus },
        { label: 'Preferred Role', value: roleProfile?.preferredRole },
        { label: 'Core Strengths', value: roleProfile?.strengths },
        { label: 'Availability', value: roleProfile?.availability },
      ]

  function openSkillsDialog() {
    setDraftSkills(skills)
    setDraftSkill('')
    setSkillsError('')
    setIsSkillsDialogOpen(true)
  }

  function closeSkillsDialog() {
    setDraftSkills(skills)
    setDraftSkill('')
    setSkillsError('')
    setIsSkillsDialogOpen(false)
  }

  function handleAddSkill() {
    const normalizedSkill = formatSkillLabel(draftSkill)

    if (!normalizedSkill) {
      setSkillsError('Enter a skill before adding it.')
      return
    }

    if (draftSkills.some((skill) => skill.toLowerCase() === normalizedSkill.toLowerCase())) {
      setSkillsError('That skill is already listed.')
      return
    }

    setDraftSkills((currentSkills) => [...currentSkills, normalizedSkill])
    setDraftSkill('')
    setSkillsError('')
  }

  function handleRemoveSkill(skillToRemove) {
    setDraftSkills((currentSkills) => currentSkills.filter((skill) => skill !== skillToRemove))
    setSkillsError('')
  }

  function handleSkillsSave(event) {
    event.preventDefault()

    try {
      const nextSkills = saveUserSkills(user?.id, draftSkills)
      setDraftSkills(nextSkills)
      setDraftSkill('')
      setSkillsError('')
      setIsSkillsDialogOpen(false)
    } catch {
      setSkillsError('Unable to save skills right now.')
    }
  }

  return (
    <>
      <main className="space-y-8">
        <header className="space-y-2">
          <p className="landing-label text-[0.68rem] text-[rgba(250,204,21,0.82)]">Account</p>
          <h1 className="landing-title text-3xl text-(--landing-text)">Profile</h1>
        </header>

        <Card className="grid gap-4 sm:grid-cols-2">
          <div>
            <p className="landing-ui-text text-[0.7rem] text-[rgba(226,226,232,0.55)]">Username</p>
            <p className="mt-2 text-lg font-semibold">{user?.username}</p>
          </div>

          <div>
            <p className="landing-ui-text text-[0.7rem] text-[rgba(226,226,232,0.55)]">Email</p>
            <p className="mt-2 text-lg font-semibold">{user?.email}</p>
          </div>

          <div>
            <p className="landing-ui-text text-[0.7rem] text-[rgba(226,226,232,0.55)]">Default Role</p>
            <Badge variant="gold">{roleConfig[user?.defaultRole]?.label ?? 'Competitor'}</Badge>
          </div>

          <div>
            <p className="landing-ui-text text-[0.7rem] text-[rgba(226,226,232,0.55)]">Current View</p>
            <Badge variant="gold">{roleConfig[user?.activeRole]?.label ?? 'Competitor'}</Badge>
          </div>
        </Card>

        <Card className="space-y-4">
          <p className="landing-copy max-w-2xl text-sm text-[rgba(226,226,232,0.72)] sm:text-base">
            Your default role decides how ComptiHub opens when you log in. You can still switch views anytime from the in-app role switcher.
          </p>
          <Link
            className="landing-link-accent landing-ui-text inline-flex text-[0.78rem] text-(--landing-gold)"
            to={routes.profileEdit}
          >
            Edit default role →
          </Link>
        </Card>

        {profile && roleProfile ? (
          <div className="grid gap-4 xl:grid-cols-[minmax(0,1.15fr)_minmax(280px,0.85fr)]">
            <Card className="space-y-4">
              <div>
                <p className="landing-ui-text text-[0.7rem] text-[rgba(226,226,232,0.55)]">
                  {isLeaderProfile ? 'Leadership Snapshot' : 'Competitor Snapshot'}
                </p>
                <p className="mt-2 text-lg font-semibold text-(--landing-text)">{profile.university}</p>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <p className="landing-ui-text text-[0.7rem] text-[rgba(226,226,232,0.55)]">Major</p>
                  <p className="mt-2 text-sm font-semibold text-(--landing-text)">{profile.major}</p>
                </div>
                <div>
                  <p className="landing-ui-text text-[0.7rem] text-[rgba(226,226,232,0.55)]">Year</p>
                  <p className="mt-2 text-sm font-semibold text-(--landing-text)">{profile.year}</p>
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                {profileHighlights.map((item) => (
                  <div key={item.label}>
                    <p className="landing-ui-text text-[0.7rem] text-[rgba(226,226,232,0.55)]">{item.label}</p>
                    <p className="mt-2 text-sm font-semibold text-(--landing-text)">{item.value}</p>
                  </div>
                ))}
              </div>

              <div>
                <p className="landing-ui-text text-[0.7rem] text-[rgba(226,226,232,0.55)]">Bio</p>
                <p className="landing-copy mt-2 text-sm text-[rgba(226,226,232,0.72)]">{roleProfile.bio}</p>
              </div>
            </Card>

            <Card className="space-y-4">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="landing-ui-text text-[0.7rem] text-[rgba(226,226,232,0.55)]">Skills</p>
                  <p className="landing-copy mt-2 text-sm text-[rgba(226,226,232,0.72)]">
                    Keep your profile skills current so teammates can match with you faster.
                  </p>
                </div>
                <Button className="gap-2 px-0" size="sm" variant="text-only" onClick={openSkillsDialog}>
                  <Pencil className="h-4 w-4" />
                  Edit skills
                </Button>
              </div>

              <div className="flex flex-wrap gap-2">
                {skills.length > 0 ? (
                  skills.map((skill) => (
                    <Badge key={skill} variant="default">{skill}</Badge>
                  ))
                ) : (
                  <p className="landing-copy text-sm text-[rgba(226,226,232,0.6)]">No skills added yet.</p>
                )}
              </div>
            </Card>
          </div>
        ) : null}
      </main>

      <Modal
        aria-describedby="edit-skills-description"
        aria-labelledby="edit-skills-title"
        open={isSkillsDialogOpen}
        onClose={closeSkillsDialog}
        onBackdropClick={closeSkillsDialog}
        className="bg-[rgba(12,14,18,0.76)] backdrop-blur-sm"
      >
        <div className="flex min-h-screen items-center justify-center p-4">
          <section className="w-full max-w-2xl overflow-hidden rounded-[1.6rem] border border-[rgba(77,70,50,0.24)] bg-[rgba(17,19,23,0.98)] shadow-[0_24px_80px_rgba(0,0,0,0.42)]">
            <div className="flex items-start justify-between gap-4 border-b border-[rgba(77,70,50,0.18)] p-6 sm:p-8">
              <div className="space-y-2">
                <p className="landing-label text-[0.68rem] text-[rgba(250,204,21,0.82)]">Profile setup</p>
                <h2 className="landing-title text-2xl text-(--landing-text) sm:text-3xl" id="edit-skills-title">
                  Edit skills
                </h2>
                <p className="landing-copy text-sm leading-6 text-[rgba(226,226,232,0.72)]" id="edit-skills-description">
                  Add the skills you want teammates to see on your profile card.
                </p>
              </div>
              <button
                aria-label="Close skills dialog"
                className="rounded-full border border-[rgba(77,70,50,0.24)] p-3 text-[rgba(226,226,232,0.76)] transition-colors duration-200 hover:border-(--landing-gold) hover:text-(--landing-gold-soft)"
                type="button"
                onClick={closeSkillsDialog}
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form className="space-y-6 p-6 sm:p-8" onSubmit={handleSkillsSave}>
              <div className="space-y-3">
                <label className="landing-ui-text text-[0.74rem] text-(--landing-text)" htmlFor="profile-skill-input">
                  Add a skill
                </label>
                <div className="flex flex-col gap-3 sm:flex-row">
                  <Input
                    id="profile-skill-input"
                    placeholder="React, Figma, Problem Solving..."
                    value={draftSkill}
                    onChange={(event) => setDraftSkill(event.target.value)}
                    onKeyDown={(event) => {
                      if (event.key !== 'Enter') {
                        return
                      }

                      event.preventDefault()
                      handleAddSkill()
                    }}
                  />
                  <Button className="gap-2 sm:self-start" size="md" type="button" variant="outline-gold" onClick={handleAddSkill}>
                    <Plus className="h-4 w-4" />
                    Add
                  </Button>
                </div>
                <p className="landing-copy text-sm text-[rgba(226,226,232,0.64)]">
                  Use short labels so team leaders can scan your strengths quickly.
                </p>
              </div>

              <div className="space-y-3">
                <p className="landing-ui-text text-[0.74rem] text-(--landing-text)">Current skills</p>
                <div className="flex flex-wrap gap-2">
                  {draftSkills.length > 0 ? (
                    draftSkills.map((skill) => (
                      <span
                        key={skill}
                        className="inline-flex items-center gap-2 rounded-full border border-[rgba(77,70,50,0.32)] bg-[rgba(12,14,18,0.7)] px-3 py-1.5 text-sm font-semibold text-(--landing-text)"
                      >
                        <span>{skill}</span>
                        <button
                          aria-label={`Remove ${skill}`}
                          className="rounded-full p-0.5 text-[rgba(226,226,232,0.68)] transition-colors duration-200 hover:text-(--landing-danger)"
                          type="button"
                          onClick={() => handleRemoveSkill(skill)}
                        >
                          <X className="h-4 w-4" />
                        </button>
                      </span>
                    ))
                  ) : (
                    <p className="landing-copy text-sm text-[rgba(226,226,232,0.6)]">No skills added yet.</p>
                  )}
                </div>
              </div>

              {skillsError ? (
                <p className="rounded-2xl border border-[rgba(255,180,171,0.25)] bg-[rgba(255,180,171,0.08)] px-4 py-3 text-sm text-(--landing-danger)">
                  {skillsError}
                </p>
              ) : null}

              <div className="flex flex-col gap-3 border-t border-[rgba(77,70,50,0.18)] pt-6 sm:flex-row sm:justify-end">
                <Button className="min-w-36 justify-center" size="nav" type="button" variant="secondary" onClick={closeSkillsDialog}>
                  Cancel
                </Button>
                <Button className="min-w-40 justify-center" size="nav" type="submit">
                  Save skills
                </Button>
              </div>
            </form>
          </section>
        </div>
      </Modal>
    </>
  )
}
