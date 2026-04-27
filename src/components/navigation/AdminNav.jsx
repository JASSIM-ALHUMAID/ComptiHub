import {
  Bell,
  ChevronRight,
  Gavel,
  LayoutDashboard,
  LogOut,
  Menu,
  ShieldAlert,
  Sparkles,
  Trophy,
  UserCircle2,
} from 'lucide-react'
import { createElement, useEffect, useRef, useState } from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../../features/auth/hooks/useAuth'
import { routes } from '../../lib/constants/routes'
import Button from '../ui/Button'

const links = [
  { label: 'Dashboard', to: routes.admin, icon: LayoutDashboard, end: true },
  { label: 'Competitions', to: routes.adminCompetitions, icon: Trophy },
  { label: 'Suggestions', to: routes.adminSuggestions, icon: Sparkles },
  { label: 'Moderation', to: routes.adminModeration, icon: Gavel },
]

function AdminNavLink({ end = false, label, to, icon }) {
  return (
    <NavLink
      end={end}
      to={to}
      className={({ isActive }) =>
        [
          'app-nav-link flex items-center gap-3 rounded-[1.1rem] px-4 py-3 text-sm transition-all duration-200',
          isActive
            ? 'is-active bg-[rgba(250,204,21,0.98)] text-black! shadow-[0_16px_30px_rgba(250,204,21,0.16)]'
            : 'text-[rgba(226,226,232,0.76)] hover:bg-[rgba(255,255,255,0.04)] hover:text-[var(--admin-gold-soft)]',
        ].join(' ')
      }
    >
      {createElement(icon, { className: 'h-4 w-4' })}
      <span className="app-ui-text text-[0.76rem] tracking-[0.18em]">{label}</span>
    </NavLink>
  )
}

export default function AdminNav() {
  const navigate = useNavigate()
  const { user, logout } = useAuth()
  const username = user?.username || 'SYS_ADMIN_01'
  const [isAccountMenuOpen, setIsAccountMenuOpen] = useState(false)
  const accountMenuRef = useRef(null)

  useEffect(() => {
    function handlePointerDown(event) {
      if (!accountMenuRef.current?.contains(event.target)) {
        setIsAccountMenuOpen(false)
      }
    }

    function handleEscape(event) {
      if (event.key === 'Escape') {
        setIsAccountMenuOpen(false)
      }
    }

    document.addEventListener('mousedown', handlePointerDown)
    document.addEventListener('keydown', handleEscape)

    return () => {
      document.removeEventListener('mousedown', handlePointerDown)
      document.removeEventListener('keydown', handleEscape)
    }
  }, [])

  async function handleLogout() {
    setIsAccountMenuOpen(false)
    await logout()
    navigate(routes.login, { replace: true })
  }

  return (
    <>
      <header className="sticky top-0 z-40 border-b border-[rgba(77,70,50,0.24)] bg-[rgba(12,14,18,0.92)] backdrop-blur-xl">
        <div className="flex h-[4.5rem] w-full items-center justify-between gap-4 px-4 sm:px-6 xl:px-8">
          <div className="flex items-center gap-4">
            <NavLink className="app-wordmark text-xl text-[var(--admin-gold)] sm:text-2xl" to={routes.admin}>
              ComptiHub
            </NavLink>
            <div className="hidden rounded-full border border-[rgba(77,70,50,0.2)] bg-[rgba(255,255,255,0.03)] px-3 py-1.5 text-xs text-[rgba(209,198,171,0.72)] xl:flex">
              Privileged administration workspace
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="hidden items-center gap-2 rounded-full border border-[rgba(77,70,50,0.24)] bg-[rgba(255,255,255,0.02)] px-3 py-2 text-[rgba(209,198,171,0.74)] lg:flex">
              <Menu className="h-4 w-4 text-[var(--admin-gold-soft)]" />
              <span className="app-ui-text text-[0.62rem] tracking-[0.18em]">Admin Mode</span>
            </div>
            <button
              aria-label="Open notifications"
              className="hidden h-11 w-11 items-center justify-center rounded-full border border-[rgba(77,70,50,0.24)] bg-[rgba(255,255,255,0.02)] text-[var(--admin-text)] transition-colors duration-200 hover:border-[rgba(250,204,21,0.32)] hover:text-[var(--admin-gold-soft)] sm:flex"
              type="button"
            >
              <Bell className="h-4 w-4" />
            </button>
            <Button className="min-w-0 px-4 sm:hidden" onClick={handleLogout} variant="secondary" size="nav">
              <LogOut className="mr-2 h-4 w-4" />
              Logout
            </Button>
            <div className="relative hidden sm:block" ref={accountMenuRef}>
              <button
                aria-expanded={isAccountMenuOpen}
                aria-haspopup="menu"
                className="flex items-center gap-3 rounded-full border border-[rgba(77,70,50,0.24)] bg-[rgba(255,255,255,0.03)] px-4 py-2 text-[var(--admin-text)] transition-colors duration-200 hover:border-[rgba(250,204,21,0.3)] hover:bg-[rgba(255,255,255,0.05)]"
                type="button"
                onClick={() => setIsAccountMenuOpen((open) => !open)}
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[rgba(250,204,21,0.12)] text-[var(--admin-gold)]">
                  <ShieldAlert className="h-4 w-4" />
                </div>
                <div className="min-w-0 text-left">
                  <p className="app-ui-text truncate text-[0.72rem] tracking-[0.22em]">{username}</p>
                  <p className="text-xs text-[rgba(255,224,131,0.88)]">Root access</p>
                </div>
                <ChevronRight
                  className={[
                    'h-4 w-4 text-[rgba(209,198,171,0.62)] transition-transform duration-200',
                    isAccountMenuOpen ? 'rotate-90' : '',
                  ].join(' ')}
                />
              </button>

              {isAccountMenuOpen ? (
                <div className="absolute right-0 top-[calc(100%+0.75rem)] z-50 w-72 overflow-hidden rounded-[1.2rem] border border-[rgba(77,70,50,0.22)] bg-[rgba(17,19,23,0.98)] p-2 shadow-[0_24px_60px_rgba(0,0,0,0.34)]">
                  <div className="rounded-[1rem] border border-[rgba(77,70,50,0.16)] bg-[rgba(255,255,255,0.02)] p-4">
                    <div className="flex items-start gap-3">
                      <div className="flex h-11 w-11 items-center justify-center rounded-full bg-[rgba(250,204,21,0.12)] text-[var(--admin-gold)]">
                        <UserCircle2 className="h-5 w-5" />
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm font-semibold text-[var(--admin-text)]">{username}</p>
                        <p className="truncate text-xs text-[rgba(209,198,171,0.66)]">{user?.email}</p>
                        <p className="mt-1 text-[0.68rem] uppercase tracking-[0.14em] text-[rgba(255,224,131,0.84)]">
                          Administrator account
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="mt-2 grid gap-1">
                    <button
                      className="flex items-center gap-3 rounded-[1rem] px-4 py-3 text-left text-sm text-[rgba(226,226,232,0.82)] transition-colors duration-200 hover:bg-[rgba(255,255,255,0.04)] hover:text-[var(--admin-gold-soft)]"
                      type="button"
                      onClick={handleLogout}
                    >
                      <LogOut className="h-4 w-4" />
                      <span>Logout</span>
                    </button>
                  </div>
                </div>
              ) : null}
            </div>
          </div>
        </div>
      </header>

    </>
  )
}

export function AdminSidebar() {
  const { user } = useAuth()
  const username = user?.username || 'SYS_ADMIN_01'

  return (
    <aside className="app-sidebar hidden lg:block">
      <div className="flex h-full flex-col gap-6 rounded-[1.75rem] border border-[rgba(77,70,50,0.22)] bg-[rgba(17,19,23,0.92)] p-5 shadow-[0_24px_50px_rgba(0,0,0,0.24)]">
        <div className="space-y-2">
          <p className="app-ui-text text-[0.68rem] text-[rgba(250,204,21,0.82)]">Admin console</p>
          <div>
            <h2 className="app-title text-[1.35rem] text-[var(--admin-text)]">System Control</h2>
            <p className="text-sm leading-6 text-[rgba(209,198,171,0.72)]">
              Competitions, suggestion triage, and moderation operations in one workspace.
            </p>
          </div>
        </div>

        <nav className="grid gap-2">
          {links.map((link) => (
            <AdminNavLink key={link.to} {...link} />
          ))}
        </nav>

        <div className="rounded-[1.4rem] border border-[rgba(77,70,50,0.18)] bg-[rgba(255,255,255,0.02)] p-4">
          <div className="flex items-start gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[rgba(250,204,21,0.12)] text-[var(--admin-gold)]">
              <ShieldAlert className="h-5 w-5" />
            </div>
            <div className="space-y-1">
              <p className="app-ui-text text-[0.68rem] text-[rgba(250,204,21,0.74)]">Administrator</p>
              <p className="text-sm font-semibold text-[var(--admin-text)]">{username}</p>
              <p className="text-xs leading-6 text-[rgba(209,198,171,0.72)]">
                Elevated access for competitions, suggestions, and moderation decisions.
              </p>
            </div>
          </div>
        </div>

        <div className="mt-auto rounded-[1.4rem] border border-[rgba(77,70,50,0.18)] bg-[linear-gradient(180deg,rgba(250,204,21,0.08),rgba(255,255,255,0.02))] p-4">
          <p className="app-ui-text text-[0.62rem] text-[rgba(250,204,21,0.78)]">Status</p>
          <p className="mt-2 text-sm font-semibold text-[var(--admin-text)]">Platform stable</p>
          <p className="mt-1 text-xs leading-6 text-[rgba(209,198,171,0.7)]">
            Use the dashboard for overview, then move into suggestions or moderation for action.
          </p>
        </div>
      </div>
    </aside>
  )
}
