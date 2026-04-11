import { FileText, Home, Trophy, UserCircle2, Users } from 'lucide-react'
import { createElement } from 'react'
import { NavLink } from 'react-router-dom'
import { useStudentRole } from '../../features/account/hooks/useStudentRole'
import { roleConfig } from '../../features/account/utils/roleConfig'
import { useAuth } from '../../features/auth/hooks/useAuth'
import { routes } from '../../lib/constants/routes'

const links = [
  { label: 'Dashboard', to: routes.dashboard, icon: Home, end: true },
  { label: 'Competitions', to: routes.competitions, icon: Trophy },
  { label: 'Teams', to: routes.teams, icon: Users },
  { label: 'Applications', to: routes.applications, icon: FileText },
  { label: 'Profile', to: routes.profile, icon: UserCircle2 },
]

function WorkspaceNavLink({ end = false, icon, label, to }) {
  return (
    <NavLink
      end={end}
      to={to}
      className={({ isActive }) =>
        [
          'admin-nav-link flex items-center gap-3 rounded-[1.1rem] px-4 py-3 text-sm transition-all duration-200',
          isActive
            ? 'is-active bg-[rgba(250,204,21,0.98)] text-[var(--admin-surface-low)] shadow-[0_16px_30px_rgba(250,204,21,0.16)]'
            : 'text-[rgba(226,226,232,0.76)] hover:bg-[rgba(255,255,255,0.04)] hover:text-[var(--admin-gold-soft)]',
        ].join(' ')
      }
    >
      {createElement(icon, { className: 'h-4 w-4' })}
      <span className="admin-ui-text text-[0.76rem] tracking-[0.18em]">{label}</span>
    </NavLink>
  )
}

export default function Sidebar() {
  const { user } = useAuth()
  const { activeRole } = useStudentRole()
  const activeRoleLabel = roleConfig[activeRole]?.label ?? 'Competitor'

  return (
    <aside className="admin-sidebar hidden lg:block">
      <div className="flex h-full flex-col gap-6 rounded-[1.75rem] border border-[rgba(77,70,50,0.22)] bg-[rgba(17,19,23,0.92)] p-5 shadow-[0_24px_50px_rgba(0,0,0,0.24)]">
        <div className="space-y-2">
          <p className="admin-ui-text text-[0.68rem] text-[rgba(250,204,21,0.82)]">Student workspace</p>
          <div>
            <h2 className="admin-title text-[1.35rem] text-[var(--admin-text)]">Personal Control</h2>
            <p className="text-sm leading-6 text-[rgba(209,198,171,0.72)]">
              Competitions, teams, applications, and profile controls in one unified workspace.
            </p>
          </div>
        </div>

        <nav className="grid gap-2">
          {links.map((link) => (
            <WorkspaceNavLink key={link.to} {...link} />
          ))}
        </nav>

        <div className="rounded-[1.4rem] border border-[rgba(77,70,50,0.18)] bg-[rgba(255,255,255,0.02)] p-4">
          <div className="flex items-start gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[rgba(250,204,21,0.12)] text-[var(--admin-gold)]">
              <UserCircle2 className="h-5 w-5" />
            </div>
            <div className="space-y-1">
              <p className="admin-ui-text text-[0.68rem] text-[rgba(250,204,21,0.74)]">Signed in as</p>
              <p className="text-sm font-semibold text-[var(--admin-text)]">{user?.username}</p>
              <p className="text-xs leading-6 text-[rgba(209,198,171,0.72)]">{user?.email}</p>
            </div>
          </div>
        </div>

        <div className="mt-auto rounded-[1.4rem] border border-[rgba(77,70,50,0.18)] bg-[linear-gradient(180deg,rgba(250,204,21,0.08),rgba(255,255,255,0.02))] p-4">
          <p className="admin-ui-text text-[0.62rem] text-[rgba(250,204,21,0.78)]">Current mode</p>
          <p className="mt-2 text-sm font-semibold text-[var(--admin-text)]">{activeRoleLabel}</p>
          <p className="mt-1 text-xs leading-6 text-[rgba(209,198,171,0.7)]">
            Switch views from the workspace toggle to move between competitor and team leader tasks.
          </p>
        </div>
      </div>
    </aside>
  )
}
