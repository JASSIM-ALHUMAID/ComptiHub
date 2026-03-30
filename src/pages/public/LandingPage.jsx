import Navbar from '../../components/navigation/Navbar'
import HeroSection from './sections/HeroSection'
import FeaturesSection from './sections/FeaturesSection'
import HowItWorksSection from './sections/HowItWorksSection'

export default function LandingPage() {
  return (
    <div className="landing-theme landing-shell min-h-screen">
      <div className="landing-grid-overlay pointer-events-none absolute inset-0 opacity-70" />
      <Navbar />

      <main>
        <HeroSection />
        <HowItWorksSection />
        <FeaturesSection />
      </main>

      <footer className="border-t border-[rgba(77,70,50,0.1)] bg-[var(--landing-surface-low)] py-12 sm:py-16 lg:py-20">
        <div className="mx-auto flex max-w-[1920px] flex-col items-center justify-between gap-10 px-5 text-center sm:px-8 md:flex-row md:text-left lg:px-24">
          <a
            href="#hero"
            className="landing-wordmark text-2xl font-black text-[var(--landing-gold)] transition-colors duration-200 hover:text-[var(--landing-gold-soft)] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--landing-gold)]"
          >
            COMPTIHUB
          </a>

          <div className="flex flex-wrap justify-center gap-6 text-[0.72rem] font-bold tracking-[0.18em] text-[var(--landing-text-muted)] sm:gap-10 md:justify-start">
            <a href="#" className="transition-colors duration-200 hover:text-[var(--landing-gold)]">
              PRIVACY
            </a>
            <a href="#" className="transition-colors duration-200 hover:text-[var(--landing-gold)]">
              TERMS
            </a>
            <a href="#" className="transition-colors duration-200 hover:text-[var(--landing-gold)]">
              CONTACT
            </a>
            <a href="#" className="transition-colors duration-200 hover:text-[var(--landing-gold)]">
              DOCUMENTATION
            </a>
          </div>

          <p className="text-[0.68rem] tracking-[0.16em] text-[rgba(209,198,171,0.6)] sm:text-[0.72rem]">
            © 2024 COMPTIHUB. ARCHITECTURAL PRECISION.
          </p>
        </div>
      </footer>
    </div>
  )
}
