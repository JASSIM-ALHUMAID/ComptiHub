import { useState } from 'react'
import { Link, NavLink } from 'react-router-dom'
import { Menu, X } from 'lucide-react'
import Button from '../ui/Button'
import { useAuth } from '../../features/auth/hooks/useAuth'
import { routes } from '../../lib/constants/routes'

const navItems = [
  { label: 'Dashboard', to: routes.dashboard },
  { label: 'Competitions', to: routes.competitions },
  { label: 'Teams', to: routes.teams },
  { label: 'Applications', to: routes.applications },
  { label: 'Profile', to: routes.profile },
]

export default function StudentNav() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const { user, logout } = useAuth()

  return (
    <nav className="relative z-50 border-b border-[rgba(77,70,50,0.22)] bg-[rgba(17,19,23,0.9)] px-5 py-4 text-(--landing-text) backdrop-blur sm:px-8">
      <div className="mx-auto flex w-full max-w-7xl items-center justify-between">
        <Link
          className="landing-wordmark text-lg text-(--landing-gold) transition-colors duration-200 hover:text-(--landing-gold-soft)"
          to={routes.landing}
        >
          COMPTIHUB
        </Link>

        <div className="flex items-center gap-3">
          <div className="hidden min-w-0 text-right sm:block">
            <p className="truncate text-sm font-semibold">{user?.username}</p>
            <p className="truncate text-xs text-[rgba(226,226,232,0.58)]">{user?.email}</p>
          </div>
          <Button onClick={logout} variant="secondary" size="nav" className="hidden sm:inline-flex">
            Logout
          </Button>
          <button
            type="button"
            onClick={() => setIsMobileMenuOpen((open) => !open)}
            className="btn-icon sm:hidden"
            aria-expanded={isMobileMenuOpen}
            aria-controls="student-mobile-menu"
            aria-label={isMobileMenuOpen ? 'Close student menu' : 'Open student menu'}
          >
            {isMobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {isMobileMenuOpen ? (
        <div
          id="student-mobile-menu"
          className="student-mobile-menu absolute inset-x-0 top-full border-t border-[rgba(77,70,50,0.16)] bg-[rgba(12,14,18,0.98)] px-5 py-5 sm:hidden"
        >
          <div className="mx-auto flex w-full max-w-7xl flex-col gap-5">
            <div className="min-w-0 rounded-[1.25rem] border border-[rgba(77,70,50,0.22)] bg-[rgba(17,19,23,0.72)] px-4 py-3">
              <p className="truncate text-sm font-semibold">{user?.username}</p>
              <p className="truncate text-xs text-[rgba(226,226,232,0.58)]">{user?.email}</p>
            </div>

            <div className="grid gap-2">
              {navItems.map((item) => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={({ isActive }) =>
                    [
                      'rounded-2xl border px-4 py-3 text-sm transition-colors duration-200',
                      isActive
                        ? 'border-[rgba(250,204,21,0.28)] bg-[rgba(250,204,21,0.12)] font-semibold text-(--landing-gold-soft)'
                        : 'border-[rgba(77,70,50,0.22)] text-[rgba(226,226,232,0.72)] hover:border-(--landing-gold) hover:text-(--landing-gold-soft)',
                    ].join(' ')
                  }
                >
                  {item.label}
                </NavLink>
              ))}
            </div>

            <Button
              onClick={logout}
              variant="secondary"
              size="nav"
              className="w-full justify-center"
            >
              Logout
            </Button>
          </div>
        </div>
      ) : null}
    </nav>
  )
}
