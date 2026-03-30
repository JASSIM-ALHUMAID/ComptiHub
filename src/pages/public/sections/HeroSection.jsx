import { Link } from 'react-router-dom'
import Button from '../../../components/ui/Button'
import { routes } from '../../../lib/constants/routes'

export default function HeroSection() {
  return (
    <section id="hero" className="relative flex min-h-screen flex-col justify-center overflow-hidden px-5 pb-16 pt-28 sm:px-8 sm:pt-32 lg:px-24 lg:pb-24 lg:pt-36">
      <div className="mx-auto grid w-full max-w-[1920px] grid-cols-1 items-center gap-10 py-16 sm:py-20 lg:py-24">
        <div className="mx-auto flex max-w-5xl flex-col items-center text-center">
          <span className="landing-label mb-6 inline-block border border-[rgba(250,204,21,0.2)] bg-[rgba(250,204,21,0.05)] px-3 py-2 text-[0.62rem] font-bold text-[rgba(250,204,21,0.85)] sm:px-4 sm:text-[0.72rem]">
            UNIVERSITY COMPETITION PLATFORM — SWE 363
          </span>

          <h1 className="landing-display text-[clamp(3.8rem,14vw,10rem)] font-black uppercase text-[var(--landing-text)] [text-shadow:1px_0_0_rgba(113,191,255,0.45)]">
            FIND YOUR{' '}
            <span className="block text-[var(--landing-gold)] [text-shadow:0_0_18px_rgba(250,204,21,0.22),0_0_42px_rgba(250,204,21,0.18),1px_0_0_rgba(255,163,26,0.35)]">
              WINNING
            </span>{' '}
            TEAM
          </h1>

          <p className="mt-8 max-w-3xl text-base leading-7 text-[rgba(226,226,232,0.82)] sm:text-lg sm:leading-8 lg:text-xl">
            Stop drowning in chaotic WhatsApp groups. ComptiHub provides an architectural approach to team formation, skill-matching, and competition management for students who mean business.
          </p>

          <div className="mt-10 flex w-full flex-col justify-center gap-4 sm:mt-12 sm:w-auto sm:flex-row sm:gap-6">
            <Button as="a" href="#features" className="w-full sm:w-auto">
              EXPLORE FEATURES
            </Button>
            <Button as={Link} to={routes.signup} variant="secondary" className="w-full sm:w-auto">
              LEARN MORE
            </Button>
          </div>
        </div>
      </div>
    </section>
  )
}
