import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import Input from '../../components/ui/Input'
import AuthForm from '../../features/auth/components/AuthForm'
import StudentRoleSelector from '../../features/auth/components/StudentRoleSelector'
import { roleConfig } from '../../features/account/utils/roleConfig'
import { useAuth } from '../../features/auth/hooks/useAuth'
import { routes } from '../../lib/constants/routes'

const initialForm = {
  username: '',
  email: '',
  password: '',
  defaultRole: 'competitor',
}

const roleDetails = {
  competitor: {
    eyebrow: 'Competitor Path',
    title: 'Apply faster and show teams what you bring.',
    body:
      'Choose competitor if you want your account to open into the student side focused on competitions, team discovery, and application tracking.',
    points: ['Browse competitions', 'Track your applications', 'Join teams that match your skills'],
  },
  teamLeader: {
    eyebrow: 'Team Leader Path',
    title: 'Build the right team and manage requests clearly.',
    body:
      'Choose team leader if you want your account to open into the management side focused on creating teams, reviewing requests, and organizing rosters.',
    points: ['Create and manage teams', 'Review incoming requests', 'Keep recruiting organized'],
  },
}

export default function SignupPage() {
  const navigate = useNavigate()
  const { signup } = useAuth()
  const [form, setForm] = useState(initialForm)
  const [error, setError] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const selectedRoleDetails = roleDetails[form.defaultRole]

  function updateField(event) {
    const { name, value } = event.target
    setForm((currentForm) => ({
      ...currentForm,
      [name]: value,
    }))
  }

  async function handleSubmit(event) {
    event.preventDefault()

    setError('')
    setIsSubmitting(true)

    try {
      await signup(form)
      navigate(routes.dashboard, { replace: true })
    } catch (submissionError) {
      setError(submissionError.message)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="grid items-center gap-8 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1fr)] lg:items-start">
      <div className="order-1 flex w-full justify-center lg:order-2 lg:justify-start">
        <AuthForm
          title="Create Account"
          description="Set up one student account with a default role. You can switch that preference later from your profile."
          onSubmit={handleSubmit}
          submitLabel="Create Account"
          isSubmitting={isSubmitting}
          error={error}
          footer={(
            <>
              Already have an account?{' '}
              <Link className="text-(--landing-gold) hover:text-(--landing-gold-soft)" to={routes.login}>
                Login
              </Link>
              .
            </>
          )}
        >
          <label className="block space-y-2">
            <span className="landing-ui-text text-[0.74rem] text-(--landing-text)">Username</span>
            <Input
              name="username"
              autoComplete="username"
              placeholder="How your teammates will know you"
              value={form.username}
              onChange={updateField}
              required
            />
          </label>

          <label className="block space-y-2">
            <span className="landing-ui-text text-[0.74rem] text-(--landing-text)">Email</span>
            <Input
              name="email"
              type="email"
              autoComplete="email"
              placeholder="student@university.edu"
              value={form.email}
              onChange={updateField}
              required
            />
          </label>

          <label className="block space-y-2">
            <span className="landing-ui-text text-[0.74rem] text-(--landing-text)">Password</span>
            <Input
              name="password"
              type="password"
              autoComplete="new-password"
              placeholder="Create a password"
              value={form.password}
              onChange={updateField}
              required
            />
          </label>

          <StudentRoleSelector
            value={form.defaultRole}
            onChange={(defaultRole) => setForm((currentForm) => ({ ...currentForm, defaultRole }))}
            disabled={isSubmitting}
          />
        </AuthForm>
      </div>

      <div className="order-2 flex w-full justify-center lg:order-1 lg:justify-start ">
        <section className="w-full max-w-xl rounded-4xl border border-[rgba(77,70,50,0.22)] bg-[rgba(17,19,23,0.72)] p-5 text-(--landing-text) shadow-[0_28px_70px_rgba(0,0,0,0.28)] backdrop-blur sm:p-6 xl:p-8 lg:max-w-none">
          <p className="landing-label text-[0.68rem] text-[rgba(250,204,21,0.82)]">
            {selectedRoleDetails.eyebrow}
          </p>
          <h2 className="landing-title mt-3 text-2xl sm:mt-4 sm:text-4xl">{selectedRoleDetails.title}</h2>
          <p className="landing-copy mt-4 text-sm text-[rgba(226,226,232,0.72)] sm:text-base">
            {selectedRoleDetails.body}
          </p>

          <div className="mt-5 flex flex-wrap items-center gap-2 sm:mt-6">
            <span className="landing-ui-text text-[0.72rem] text-[rgba(226,226,232,0.56)]">Default view:</span>
            <span className="rounded-full border border-[rgba(250,204,21,0.22)] bg-[rgba(250,204,21,0.08)] px-3 py-1 text-sm font-semibold text-(--landing-gold-soft)">
              {roleConfig[form.defaultRole].label}
            </span>
          </div>

          <ul className="mt-5 grid gap-2 sm:mt-6 sm:gap-3">
            {selectedRoleDetails.points.map((point, index) => (
              <li
                key={point}
                className={[
                  'landing-copy rounded-2xl border border-[rgba(77,70,50,0.18)] bg-[rgba(12,14,18,0.44)] px-4 py-2.5 text-sm text-[rgba(226,226,232,0.74)] sm:py-3',
                  index === 2 ? 'hidden sm:block' : '',
                ].join(' ')}
              >
                {point}
              </li>
            ))}
          </ul>
        </section>
      </div>
    </div>
  )
}
