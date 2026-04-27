import { Gavel, LayoutDashboard, Sparkles, Trophy } from 'lucide-react'
import { NavLink } from 'react-router-dom'
import { routes } from '../../lib/constants/routes'

const navItems = [
  { label: 'Home', ariaLabel: 'Admin dashboard', to: routes.admin, icon: LayoutDashboard, end: true },
  { label: 'Comps', ariaLabel: 'Admin competitions', to: routes.adminCompetitions, icon: Trophy },
  { label: 'Ideas', ariaLabel: 'Admin suggestions', to: routes.adminSuggestions, icon: Sparkles },
  { label: 'Mods', ariaLabel: 'Admin moderation', to: routes.adminModeration, icon: Gavel },
]

export default function AdminMobileNav() {
  return (
    <nav className="app-mobile-nav lg:hidden" style={{ '--ui-mobile-nav-columns': navItems.length }}>
      <div className="contents">
        {navItems.map((item) => {
          const Icon = item.icon

          return (
            <NavLink
              aria-label={item.ariaLabel ?? item.label}
              end={item.end}
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                [
                  'flex min-h-11 flex-col items-center justify-center gap-1 rounded-[1rem] px-2 py-2 text-center transition-colors duration-200 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-(--landing-gold)',
                  isActive
                    ? 'bg-[rgba(250,204,21,0.98)] text-black! shadow-[0_16px_30px_rgba(250,204,21,0.16)]'
                    : 'text-[rgba(209,198,171,0.78)] hover:bg-[rgba(255,255,255,0.04)] hover:text-[var(--admin-gold-soft)]',
                ].join(' ')
              }
            >
              <Icon aria-hidden="true" size={20} />
              <span className="app-ui-text text-[0.58rem] tracking-[0.14em]">{item.label}</span>
            </NavLink>
          )
        })}
      </div>
    </nav>
  )
}
