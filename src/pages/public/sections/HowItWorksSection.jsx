import { AlertTriangle, CheckCircle2 } from 'lucide-react'
import { cn } from '../../../lib/utils/cn'
import { useInViewOnce } from '../../../lib/utils/useInViewOnce'

const columns = [
  {
    id: '01',
    title: 'THE PROBLEM',
    accentClass: 'text-(--landing-danger)',
    Icon: AlertTriangle,
    items: [
      {
        heading: 'FRAGMENTED COMMUNICATION',
        copy: 'Critical competition details lost in thousand-message WhatsApp threads and buried emails.',
      },
      {
        heading: 'INEFFICIENT SOURCING',
        copy: "Relying on immediate friend circles rather than finding the best technical talent for your specific needs.",
      },
    ],
  },
  {
    id: '02',
    title: 'THE SOLUTION',
    accentClass: 'text-(--landing-gold)',
    Icon: CheckCircle2,
    items: [
      {
        heading: 'CENTRALIZED HUB',
        copy: 'Every competition, rulebook, and deadline in one high-precision dashboard.',
      },
      {
        heading: 'SKILL VERIFICATION',
        copy: "Validated portfolios and peer reviews ensure you know exactly who you're recruiting.",
      },
    ],
  },
]

export default function HowItWorksSection() {
  const [sectionRef, isSectionVisible] = useInViewOnce()

  return (
    <section ref={sectionRef} id="how-it-works" className="relative px-5 py-24 sm:px-8 sm:py-32 lg:px-16 lg:py-40 xl:py-48">
      <div className="mx-auto flex max-w-[1600px] flex-col gap-16 lg:flex-row lg:gap-20 xl:gap-24">
        {columns.map((column, columnIndex) => {
          const headingOrder = columnIndex * 3

          return (
            <div key={column.title} className="flex-1 space-y-10 lg:space-y-14">
              <h2
                className={cn(
                  'landing-section-title landing-inview-display flex items-center gap-4 text-3xl text-(--landing-text) sm:text-4xl lg:text-5xl xl:text-6xl',
                  isSectionVisible && 'is-visible',
                )}
                style={{ '--reveal-order': headingOrder }}
              >
              <span className="landing-label border-b-2 border-(--landing-gold) pb-1 text-sm text-(--landing-gold) sm:text-base">
                {column.id}
              </span>
              {column.title}
              </h2>

              <div className="space-y-10 lg:space-y-14">
                {column.items.map((item, itemIndex) => (
                  <article
                    key={item.heading}
                    className={cn('landing-inview group flex gap-5 sm:gap-7', isSectionVisible && 'is-visible')}
                    style={{ '--reveal-order': headingOrder + itemIndex + 1 }}
                  >
                    <span
                      className="flex h-10 w-10 items-center justify-center rounded-full border border-[rgba(250,204,21,0.18)] bg-[rgba(250,204,21,0.08)] transition-all duration-300 group-hover:-translate-y-0.5 group-hover:border-[rgba(250,204,21,0.36)] sm:h-12 sm:w-12"
                      aria-hidden="true"
                    >
                      <column.Icon className={cn(column.accentClass, 'h-5 w-5 sm:h-6 sm:w-6')} strokeWidth={2.1} />
                    </span>
                    <div className="max-w-xl">
                      <h3 className="landing-title text-lg text-(--landing-text) sm:text-xl lg:text-2xl">
                        {item.heading}
                      </h3>
                      <p className="landing-copy mt-4 text-sm text-(--landing-text-muted) sm:text-base lg:text-lg">
                        {item.copy}
                      </p>
                    </div>
                  </article>
                ))}
              </div>
            </div>
          )
        })}
      </div>
    </section>
  )
}
