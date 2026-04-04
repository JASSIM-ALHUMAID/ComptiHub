import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import Button from '../../components/ui/Button'
import Select from '../../components/ui/Select'
import { useAuth } from '../../features/auth/hooks/useAuth'
import { roleConfig } from '../../features/account/utils/roleConfig'
import { routes } from '../../lib/constants/routes'

const editableRoles = ['competitor', 'teamLeader']

export default function EditProfilePage() {
  const navigate = useNavigate()
  const { user, updateDefaultRole } = useAuth()
  const [defaultRole, setDefaultRole] = useState(user?.defaultRole ?? 'competitor')
  const [error, setError] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  async function handleSubmit(event) {
    event.preventDefault()

    setError('')
    setIsSubmitting(true)

    try {
      await updateDefaultRole(defaultRole)
      navigate(routes.profile, { replace: true })
    } catch (submissionError) {
      setError(submissionError.message)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <main className="space-y-8">
      <header className="space-y-2">
        <p className="landing-label text-[0.68rem] text-[rgba(250,204,21,0.82)]">Account</p>
        <h1 className="landing-title text-3xl text-(--landing-text)">Edit Profile</h1>
      </header>

      <form
        className="space-y-5 rounded-[1.75rem] border border-[rgba(77,70,50,0.22)] bg-[rgba(12,14,18,0.48)] p-5"
        onSubmit={handleSubmit}
      >
        <div className="space-y-2">
          <label className="landing-ui-text text-[0.74rem] text-(--landing-text)" htmlFor="defaultRole">
            Default Role
          </label>
          <Select
            id="defaultRole"
            value={defaultRole}
            onChange={(event) => setDefaultRole(event.target.value)}
            disabled={isSubmitting}
          >
            {editableRoles.map((role) => (
              <option key={role} value={role}>
                {roleConfig[role].label}
              </option>
            ))}
          </Select>
          <p className="landing-copy text-sm text-[rgba(226,226,232,0.72)]">
            This changes how ComptiHub opens the next time you sign in. Your current in-app view stays controlled by the role switcher.
          </p>
        </div>

        {error ? (
          <p className="rounded-2xl border border-[rgba(255,180,171,0.25)] bg-[rgba(255,180,171,0.08)] px-4 py-3 text-sm text-(--landing-danger)">
            {error}
          </p>
        ) : null}

        <div className="flex flex-col gap-3 sm:flex-row">
          <Button type="submit" size="nav" disabled={isSubmitting}>
            {isSubmitting ? 'Saving' : 'Save changes'}
          </Button>
          <Link
            className="inline-flex items-center justify-center rounded-full border border-[rgba(77,70,50,0.28)] px-6 py-3 text-sm font-semibold text-[rgba(226,226,232,0.76)] transition-colors duration-200 hover:border-(--landing-gold) hover:text-(--landing-gold-soft)"
            to={routes.profile}
          >
            Cancel
          </Link>
        </div>
      </form>
    </main>
  )
}
