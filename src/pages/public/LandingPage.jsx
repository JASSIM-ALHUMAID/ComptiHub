import Navbar from '../../components/navigation/Navbar'
import { cn } from '../../lib/utils/cn'
import { useInViewOnce } from '../../lib/utils/useInViewOnce'
import HeroSection from './sections/HeroSection'
import FeaturesSection from './sections/FeaturesSection'
import HowItWorksSection from './sections/HowItWorksSection'

const footerLinks = [
  { label: 'PRIVACY', href: '#' },
  { label: 'TERMS', href: '#' },
  { label: 'CONTACT', href: '#' },
  { label: 'DOCUMENTATION', href: '#' },
]

export default function LandingPage() {
  const [footerRef, isFooterVisible] = useInViewOnce({ threshold: 0.12 })

  return (
    <div className="landing-theme landing-shell min-h-screen">
      <div className="landing-grid-overlay pointer-events-none absolute inset-0 opacity-70" />
      <Navbar />

      <main>
        <HeroSection />
        <HowItWorksSection />
        <FeaturesSection />
      </main>

      <footer
        ref={footerRef}
        className="border-t border-[rgba(77,70,50,0.1)] bg-(--landing-surface-low) py-12 sm:py-16 lg:py-20"
      >
        <div className="mx-auto flex max-w-[1920px] flex-col items-center justify-between gap-10 px-5 text-center sm:px-8 md:flex-row md:text-left lg:px-24">
          <a
            href="#hero"
            className={cn(
              'landing-link-accent landing-wordmark landing-inview-display text-2xl font-black text-(--landing-gold) transition-colors duration-200 hover:text-(--landing-gold-soft) focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-(--landing-gold)',
              isFooterVisible && 'is-visible',
            )}
            style={{ '--link-underline-offset': '-0.35rem', '--reveal-order': 0 }}
          >
            COMPTIHUB
          </a>

          <div className="landing-ui-text flex flex-wrap justify-center gap-6 text-[0.72rem] text-(--landing-text-muted) sm:gap-10 md:justify-start">
            {footerLinks.map((link, index) => (
              <a
                key={link.label}
                href={link.href}
                className={cn(
                  'landing-link-accent landing-inview transition-colors duration-200 hover:text-(--landing-gold)',
                  isFooterVisible && 'is-visible',
                )}
                style={{ '--reveal-order': index + 1 }}
              >
                {link.label}
              </a>
            ))}
          </div>

          <p
            className={cn(
              'landing-ui-text landing-inview text-[0.68rem] text-[rgba(209,198,171,0.6)] sm:text-[0.72rem]',
              isFooterVisible && 'is-visible',
            )}
            style={{ '--reveal-order': footerLinks.length + 1 }}
          >
            © 2024 COMPTIHUB. ARCHITECTURAL PRECISION.
          </p>
        </div>
      </footer>
    </div>
  )
}
