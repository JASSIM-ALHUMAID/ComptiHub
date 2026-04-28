import { useEffect, useState } from 'react'
import { Pencil } from 'lucide-react'
import Button from '../../components/ui/Button'
import { useAuth } from '../../features/auth/hooks/useAuth'
import { roleConfig } from '../../features/account/utils/roleConfig'
import ProfileSummaryCard from '../../features/profile/components/ProfileSummaryCard'
import ProfileBioCard from '../../features/profile/components/ProfileBioCard'
import ProfileSkillsCard from '../../features/profile/components/ProfileSkillsCard'
import EditProfileModal from '../../features/profile/components/EditProfileModal'
import { profileService } from '../../features/profile/services/profileService'
import {
  addSkillToForm,
  createProfileForm,
  editableRoles,
  removeSkillFromForm,
} from '../../features/profile/utils/profileForm'

function renderProfileValue(value, { emptyLabel = 'Not added yet', filledClassName, emptyClassName } = {}) {
  if (value) {
    return <p className={filledClassName}>{value}</p>
  }

  return <p className={emptyClassName ?? 'mt-2 text-sm italic text-[rgba(226,226,232,0.58)]'}>{emptyLabel}</p>
}

export default function ProfilePage() {
  const { user, updateDefaultRole, updateBasicInfo } = useAuth()
  const activeRole = user?.activeRole ?? user?.defaultRole ?? 'competitor'

  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState('')
  const [profile, setProfile] = useState({
    university: '',
    major: '',
    year: '',
    competitor: {
      focus: '',
      preferredRole: '',
      strengths: '',
      availability: '',
      bio: '',
    },
    teamLeader: {
      focus: '',
      preferredTeamSetup: '',
      strengths: '',
      availability: '',
      bio: '',
    },
  })
  const [skills, setSkills] = useState([])
  const [form, setForm] = useState(() => createProfileForm({ user, profile: {}, roleProfile: null, skills: [] }))
  const [draftSkill, setDraftSkill] = useState('')
  const [skillsError, setSkillsError] = useState('')
  const isStudentProfileView = activeRole === 'competitor' || activeRole === 'teamLeader'
  const isLeaderProfile = activeRole === 'teamLeader'
  const roleProfile = isStudentProfileView ? profile[activeRole] : null

  useEffect(() => {
    let isCancelled = false

    async function loadProfile() {
      if (!user?.id) {
        setIsLoading(false)
        return
      }

      setIsLoading(true)
      setError('')

      try {
        const [nextProfile, nextSkills] = await Promise.all([
          profileService.getProfile(user.id),
          profileService.getSkills(user.id),
        ])

        if (isCancelled) {
          return
        }

        setProfile(nextProfile)
        setSkills(nextSkills)
        setForm(createProfileForm({
          user,
          profile: nextProfile,
          roleProfile: nextProfile[activeRole] ?? null,
          skills: nextSkills,
        }))
      } catch (err) {
        if (!isCancelled) {
          setError(err.message || 'Unable to load your profile.')
        }
      } finally {
        if (!isCancelled) {
          setIsLoading(false)
        }
      }
    }

    loadProfile()

    return () => {
      isCancelled = true
    }
  }, [activeRole, user])

  function openEditModal() {
    setForm(createProfileForm({ user, profile, roleProfile, skills }))
    setDraftSkill('')
    setSkillsError('')
    setError('')
    setIsEditModalOpen(true)
  }

  function closeEditModal() {
    setIsEditModalOpen(false)
  }

  function handleFormChange(field, value) {
    setForm((prev) => ({ ...prev, [field]: value }))
  }

  function handleAddSkill() {
    const result = addSkillToForm(form, draftSkill, profileService.formatSkillLabel)

    setForm(result.form)
    setSkillsError(result.error)

    if (!result.error) {
      setDraftSkill('')
    }
  }

  function handleRemoveSkill(skillToRemove) {
    setForm((prev) => removeSkillFromForm(prev, skillToRemove))
  }

  async function handleSave(event) {
    event.preventDefault()
    setIsSubmitting(true)
    setError('')

    try {
      await updateBasicInfo({ username: form.username, email: form.email })
      await updateDefaultRole(form.defaultRole)

      const nextProfile = await profileService.saveProfile(user?.id, {
        ...profile,
        university: form.university,
        major: form.major,
        year: form.year,
        [activeRole]: {
          ...profile[activeRole],
          focus: form.focus,
          preferredRole: form.preferredRole,
          preferredTeamSetup: form.preferredTeamSetup,
          strengths: form.strengths,
          availability: form.availability,
          bio: form.bio,
        },
      })

      const nextSkills = await profileService.saveSkills(user?.id, form.skills)
      setProfile(nextProfile)
      setSkills(nextSkills)
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
          {error && !isEditModalOpen ? (
            <p className="rounded-xl border border-[rgba(255,180,171,0.25)] bg-[rgba(255,180,171,0.08)] px-4 py-3 text-sm text-(--landing-danger)">
              {error}
            </p>
          ) : null}

          <ProfileSummaryCard
            user={user}
            profile={profile}
            roleConfig={roleConfig}
            renderProfileValue={renderProfileValue}
          />

          <div className="grid gap-6 xl:grid-cols-[minmax(0,1.2fr)_minmax(300px,0.8fr)]">
            <ProfileBioCard
              isLeaderProfile={isLeaderProfile}
              roleProfile={roleProfile}
              renderProfileValue={renderProfileValue}
            />
            <ProfileSkillsCard skills={isLoading ? [] : skills} />
          </div>
        </section>
      </main>

      <EditProfileModal
        activeRole={activeRole}
        draftSkill={draftSkill}
        editableRoles={editableRoles}
        error={error}
        form={form}
        isSubmitting={isSubmitting}
        onAddSkill={handleAddSkill}
        onChange={handleFormChange}
        onClose={closeEditModal}
        onDraftSkillChange={setDraftSkill}
        onRemoveSkill={handleRemoveSkill}
        onSubmit={handleSave}
        open={isEditModalOpen}
        roleConfig={roleConfig}
        skillsError={skillsError}
      />
    </>
  )
}
