import { Bell, LogOut, ShieldCheck, Sparkles } from 'lucide-react'
import { Link, useNavigate } from 'react-router-dom'
import { useStudentRole } from '../../features/account/hooks/useStudentRole'
import { roleConfig } from '../../features/account/utils/roleConfig'
import { useAuth } from '../../features/auth/hooks/useAuth'
import { routes } from '../../lib/constants/routes'
import Button from '../ui/Button'

export default function StudentNav() {
  const { user, logout } = useAuth()
  const { activeRole } = useStudentRole()
  const navigate = useNavigate()
  const activeRoleLabel = roleConfig[activeRole]?.label ?? 'Competitor'

  async function handleLogout() {
    await logout()
    navigate(routes.login, { replace: true })
  }

  return (
    <header className="sticky top-0 z-40 border-b border-[rgba(77,70,50,0.24)] bg-[rgba(12,14,18,0.92)] backdrop-blur-xl">
      <div className="flex h-[4.5rem] w-full items-center justify-between gap-4 px-4 sm:px-6 xl:px-8">
        <div className="flex items-center gap-4">
          <Link className="admin-wordmark text-xl text-[var(--admin-gold)] sm:text-2xl" to={routes.dashboard}>
            ComptiHub
          </Link>
          <div className="hidden items-center gap-2 rounded-full border border-[rgba(77,70,50,0.2)] bg-[rgba(255,255,255,0.03)] px-3 py-2 text-[rgba(209,198,171,0.74)] lg:flex">
            <Sparkles className="h-4 w-4 text-[var(--admin-gold-soft)]" />
            <span className="admin-ui-text text-[0.62rem] tracking-[0.18em]">{activeRoleLabel} workspace</span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            aria-label="Workspace notifications"
            className="hidden h-11 w-11 items-center justify-center rounded-full border border-[rgba(77,70,50,0.24)] bg-[rgba(255,255,255,0.02)] text-[var(--admin-text)] transition-colors duration-200 hover:border-[rgba(250,204,21,0.32)] hover:text-[var(--admin-gold-soft)] sm:flex"
            type="button"
          >
            <Bell className="h-4 w-4" />
          </button>

          <div className="hidden min-w-0 text-right sm:block">
            <p className="admin-ui-text truncate text-[0.68rem] tracking-[0.18em] text-[var(--admin-gold-soft)]">
              {activeRoleLabel}
            </p>
            <p className="truncate text-xs text-[rgba(209,198,171,0.72)]">{user?.email}</p>
          </div>

          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[rgba(250,204,21,0.12)] text-[var(--admin-gold)]">
            <ShieldCheck className="h-4 w-4" />
          </div>

          <Button className="min-w-0 px-4 sm:px-6" onClick={handleLogout} variant="secondary" size="nav">
            <LogOut className="mr-2 h-4 w-4" />
            Logout
          </Button>
        </div>
      </div>
    </header>
  )
}

