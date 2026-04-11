import { NavLink } from 'react-router-dom'
import { Home, Zap, Users, FileText, User } from 'lucide-react'
import { routes } from '../../lib/constants/routes'

const navItems = [
  { label: 'Dashboard', to: routes.dashboard, icon: Home },
  { label: 'Competitions', to: routes.competitions, icon: Zap },
  { label: 'Teams', to: routes.teams, icon: Users },
  { label: 'Applications', to: routes.applications, icon: FileText },
  { label: 'Profile', to: routes.profile, icon: User },
]

export default function MobileNav() {
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 lg:hidden border-t border-[rgba(77,70,50,0.16)] bg-[rgba(17,19,23,0.95)] backdrop-blur-md">
      <div className="mx-auto flex max-w-[1920px] justify-around px-2 py-3">
        {navItems.map((item) => {
          const Icon = item.icon
          return (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                `flex flex-col items-center justify-center gap-1 px-2 py-2 rounded-lg transition-colors duration-200 ${
                  isActive
                    ? 'text-(--landing-gold-soft)'
                    : 'text-[rgba(226,226,232,0.65)] hover:text-(--landing-gold)'
                }`
              }
            >
              <Icon size={20} />
              <span className="text-[0.65rem] font-semibold uppercase">{item.label}</span>
            </NavLink>
          )
        })}
      </div>
    </nav>
  )
}
