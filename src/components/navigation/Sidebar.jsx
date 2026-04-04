import { Link } from 'react-router-dom'
import { routes } from '../../lib/constants/routes'

const links = [
  { label: 'Dashboard', to: routes.dashboard },
  { label: 'Competitions', to: routes.competitions },
  { label: 'Teams', to: routes.teams },
  { label: 'Applications', to: routes.applications },
  { label: 'Profile', to: routes.profile },
]

export default function Sidebar() {
  return (
    <aside className="rounded-[1.75rem] border border-[rgba(77,70,50,0.22)] bg-[rgba(17,19,23,0.82)] p-4 text-(--landing-text) shadow-[0_18px_40px_rgba(0,0,0,0.2)] lg:sticky lg:top-6">
      <p className="landing-ui-text mb-4 text-[0.72rem] text-[rgba(250,204,21,0.82)]">Navigate</p>
      <div className="grid gap-2">
        {links.map((link) => (
          <Link
            key={link.to}
            className="rounded-2xl px-3 py-2 text-sm text-[rgba(226,226,232,0.72)] transition-colors duration-200 hover:bg-[rgba(250,204,21,0.08)] hover:text-(--landing-gold-soft)"
            to={link.to}
          >
            {link.label}
          </Link>
        ))}
      </div>
    </aside>
  )
}
