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
          className="landing-link-accent landing-wordmark text-xl font-black text-(--landing-gold) transition-colors duration-200 hover:text-(--landing-gold-soft) focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-(--landing-gold) sm:text-2xl"
          style={{ '--link-underline-offset': '-0.35rem' }}
        >
          COMPTIHUB
        </a>

        <div className="hidden items-center gap-8 md:flex lg:gap-12">
          {navItems.map((item, index) => (
            <a
              key={item.label}
              href={item.href}
              className="landing-link-accent landing-nav-link landing-ui-text text-[0.78rem] text-(--landing-text) transition-colors duration-200 hover:text-(--landing-gold) focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-(--landing-gold)"
              style={{ '--nav-index': index }}
            >
              {item.label}
            </a>
          ))}
        </div>

        <div className="hidden items-center gap-3 md:flex">
          <Button as={Link} to={routes.login} variant="secondary" size="nav">
            LOGIN
          </Button>
          <Button as={Link} to={routes.signup} size="nav">
            GET STARTED
          </Button>
        </div>

        <button
          type="button"
          onClick={() => setIsOpen((open) => !open)}
          className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-[rgba(77,70,50,0.28)] text-(--landing-text) transition-all duration-300 hover:-translate-y-0.5 hover:border-(--landing-gold) hover:text-(--landing-gold) focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-(--landing-gold) md:hidden"
          aria-expanded={isOpen}
          aria-label={isOpen ? 'Close navigation menu' : 'Open navigation menu'}
        >
          {isOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {isOpen ? (
        <div className="landing-nav-panel max-h-[calc(100vh-5.5rem)] overflow-y-auto border-t border-[rgba(77,70,50,0.16)] bg-[rgba(12,14,18,0.96)] px-5 py-5 md:hidden">
          <div className="flex flex-col gap-4">
            {navItems.map((item, index) => (
              <a
                key={item.label}
                href={item.href}
                onClick={() => setIsOpen(false)}
                className="landing-link-accent landing-nav-link landing-ui-text w-fit text-[0.82rem] text-(--landing-text) transition-colors duration-200 hover:text-(--landing-gold)"
                style={{ '--nav-index': index }}
              >
                {item.label}
              </a>
            ))}
            <Button
              as={Link}
              to={routes.login}
              onClick={() => setIsOpen(false)}
              variant="secondary"
              size="nav"
              className="w-full justify-center"
            >
              LOGIN
            </Button>
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
