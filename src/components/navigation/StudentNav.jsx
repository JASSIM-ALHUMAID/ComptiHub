import { Link } from 'react-router-dom'
import Button from '../ui/Button'
import { useAuth } from '../../features/auth/hooks/useAuth'
import { routes } from '../../lib/constants/routes'

const navLinks = [
  { label: 'Dashboard', to: routes.dashboard },
  { label: 'Competitions', to: routes.competitions },
  { label: 'Profile', to: routes.profile },
]

export default function StudentNav() {
  const { user, logout } = useAuth()

  return (
    <nav className="border-b border-[rgba(77,70,50,0.22)] bg-[rgba(17,19,23,0.9)] px-5 py-4 text-(--landing-text) backdrop-blur sm:px-8">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex flex-col gap-2 lg:flex-row lg:items-center lg:gap-8">
          <Link className="landing-wordmark text-lg text-(--landing-gold)" to={routes.dashboard}>
            COMPTIHUB
          </Link>

          <div className="flex flex-wrap items-center gap-3 text-sm">
            {navLinks.map((link) => (
              <Link
                key={link.to}
                className="rounded-full px-3 py-2 text-[rgba(226,226,232,0.74)] transition-colors duration-200 hover:bg-[rgba(250,204,21,0.08)] hover:text-(--landing-gold-soft)"
                to={link.to}
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>

        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <div className="min-w-0">
            <p className="truncate text-sm font-semibold">{user?.username}</p>
            <p className="truncate text-xs text-[rgba(226,226,232,0.58)]">{user?.email}</p>
          </div>

          <Button onClick={logout} variant="secondary" size="nav">
            Logout
          </Button>
        </div>
      </div>
    </nav>
  )
}
