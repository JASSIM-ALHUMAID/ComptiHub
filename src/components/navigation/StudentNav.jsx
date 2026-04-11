import { Link } from 'react-router-dom'
import Button from '../ui/Button'
import { useAuth } from '../../features/auth/hooks/useAuth'
import { routes } from '../../lib/constants/routes'

export default function StudentNav() {
  const { user, logout } = useAuth()

  return (
    <nav className="border-b border-[rgba(77,70,50,0.22)] bg-[rgba(17,19,23,0.9)] px-5 py-4 text-(--landing-text) backdrop-blur sm:px-8">
      <div className="mx-auto flex w-full max-w-7xl items-center justify-between">
        <Link
          className="landing-wordmark text-lg text-(--landing-gold) transition-colors duration-200 hover:text-(--landing-gold-soft)"
          to={routes.landing}
        >
          COMPTIHUB
        </Link>

        <div className="flex items-center gap-4">
          <div className="hidden min-w-0 text-right sm:block">
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