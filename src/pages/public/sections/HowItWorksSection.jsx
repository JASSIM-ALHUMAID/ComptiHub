const columns = [
  {
    id: '01',
    title: 'THE PROBLEM',
    accentClass: 'text-[var(--landing-danger)]',
    marker: '/',
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
    accentClass: 'text-[var(--landing-gold)]',
    marker: '✓',
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
  return (
    <section id="how-it-works" className="relative px-5 py-24 sm:px-8 sm:py-32 lg:px-16 lg:py-40 xl:py-48">
      <div className="mx-auto flex max-w-[1600px] flex-col gap-16 lg:flex-row lg:gap-20 xl:gap-24">
        {columns.map((column) => (
          <div key={column.title} className="flex-1 space-y-10 lg:space-y-14">
            <h2 className="flex items-center gap-4 text-3xl font-black uppercase tracking-tight text-[var(--landing-text)] sm:text-4xl lg:text-5xl xl:text-6xl">
              <span className="border-b-2 border-[var(--landing-gold)] pb-1 text-sm tracking-[0.4em] text-[var(--landing-gold)] sm:text-base">
                {column.id}
              </span>
              {column.title}
            </h2>

            <div className="space-y-10 lg:space-y-14">
              {column.items.map((item) => (
                <article key={item.heading} className="group flex gap-5 sm:gap-7">
                  <span
                    className={`${column.accentClass} pt-0.5 text-xl font-bold transition-transform duration-300 group-hover:scale-125 sm:text-2xl lg:text-3xl`}
                    aria-hidden="true"
                  >
                    {column.marker}
                  </span>
                  <div className="max-w-xl">
                    <h3 className="text-lg font-black uppercase tracking-tight text-[var(--landing-text)] sm:text-xl lg:text-2xl">
                      {item.heading}
                    </h3>
                    <p className="mt-4 text-sm leading-7 text-[var(--landing-text-muted)] sm:text-base lg:text-lg lg:leading-8">
                      {item.copy}
                    </p>
                  </div>
                </article>
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
