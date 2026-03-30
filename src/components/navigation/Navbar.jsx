import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Menu, X } from 'lucide-react'
import Button from '../ui/Button'
import { routes } from '../../lib/constants/routes'

const navItems = [
  { label: 'PROBLEM', href: '#how-it-works' },
  { label: 'FEATURES', href: '#features' },
  { label: 'HOW IT WORKS', href: '#how-it-works' },
]

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <nav className="landing-nav-blur fixed inset-x-0 top-0 z-50 border-b border-[rgba(77,70,50,0.1)]">
      <div className="mx-auto flex max-w-[1920px] items-center justify-between px-5 py-5 sm:px-8 lg:px-16">
        <a
          href="#hero"
          className="landing-wordmark text-xl font-black text-[var(--landing-gold)] transition-colors duration-200 hover:text-[var(--landing-gold-soft)] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--landing-gold)] sm:text-2xl"
        >
          COMPTIHUB
        </a>

        <div className="hidden items-center gap-8 md:flex lg:gap-12">
          {navItems.map((item) => (
            <a
              key={item.label}
              href={item.href}
              className="text-[0.72rem] font-bold tracking-[0.22em] text-[var(--landing-text)] transition-colors duration-200 hover:text-[var(--landing-gold)] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--landing-gold)]"
            >
              {item.label}
            </a>
          ))}
        </div>

        <div className="hidden md:block">
          <Button as={Link} to={routes.signup} size="nav">
            GET STARTED
          </Button>
        </div>

        <button
          type="button"
          onClick={() => setIsOpen((open) => !open)}
          className="inline-flex h-11 w-11 items-center justify-center border border-[rgba(77,70,50,0.28)] text-[var(--landing-text)] transition-colors duration-200 hover:border-[var(--landing-gold)] hover:text-[var(--landing-gold)] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--landing-gold)] md:hidden"
          aria-expanded={isOpen}
          aria-label={isOpen ? 'Close navigation menu' : 'Open navigation menu'}
        >
          {isOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {isOpen ? (
        <div className="border-t border-[rgba(77,70,50,0.16)] bg-[rgba(12,14,18,0.96)] px-5 py-5 md:hidden">
          <div className="flex flex-col gap-4">
            {navItems.map((item) => (
              <a
                key={item.label}
                href={item.href}
                onClick={() => setIsOpen(false)}
                className="text-xs font-bold tracking-[0.22em] text-[var(--landing-text)] transition-colors duration-200 hover:text-[var(--landing-gold)]"
              >
                {item.label}
              </a>
            ))}
            <Button
              as={Link}
              to={routes.signup}
              onClick={() => setIsOpen(false)}
              size="nav"
              className="w-full justify-center"
            >
              GET STARTED
            </Button>
          </div>
        </div>
      ) : null}
    </nav>
  )
}
