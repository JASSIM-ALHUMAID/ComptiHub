import { Link } from 'react-router-dom'
import Badge from '../../components/ui/Badge'
import { useAuth } from '../../features/auth/hooks/useAuth'
import { roleConfig } from '../../features/account/utils/roleConfig'
import { routes } from '../../lib/constants/routes'

export default function ProfilePage() {
  const { user } = useAuth()

  return (
    <main className="space-y-8">
      <header className="space-y-2">
        <p className="landing-label text-[0.68rem] text-[rgba(250,204,21,0.82)]">Account</p>
        <h1 className="landing-title text-3xl text-(--landing-text)">Profile</h1>
      </header>

      <section className="grid gap-4 rounded-[1.75rem] border border-[rgba(77,70,50,0.22)] bg-[rgba(12,14,18,0.48)] p-5 sm:grid-cols-2">
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
          <Badge>{roleConfig[user?.defaultRole]?.label ?? 'Competitor'}</Badge>
        </div>

        <div>
          <p className="landing-ui-text text-[0.7rem] text-[rgba(226,226,232,0.55)]">Current View</p>
          <Badge>{roleConfig[user?.activeRole]?.label ?? 'Competitor'}</Badge>
        </div>
      </section>

      <section className="rounded-[1.75rem] border border-[rgba(77,70,50,0.22)] bg-[rgba(12,14,18,0.48)] p-5">
        <p className="landing-copy max-w-2xl text-sm text-[rgba(226,226,232,0.72)] sm:text-base">
          Your default role decides how ComptiHub opens when you log in. You can still switch views anytime from the in-app role switcher.
        </p>
        <Link
          className="landing-link-accent landing-ui-text mt-4 inline-flex text-[0.78rem] text-(--landing-gold)"
          to={routes.profileEdit}
        >
          Edit default role
        </Link>
      </section>
    </main>
  )
}
