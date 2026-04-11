import {
  CheckCircle2,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  ChevronUp,
  Clock3,
  Download,
  FileJson,
  Link as LinkIcon,
  Search,
  XCircle,
} from 'lucide-react'
import { useMemo, useState } from 'react'
import Button from '../../components/ui/Button'
import Input from '../../components/ui/Input'
import { adminSuggestions as seededSuggestions } from '../../data/mocks/adminSuggestions'

function formatSubmittedDate(value) {
  const date = new Date(`${value}T00:00:00`)

  return new Intl.DateTimeFormat('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  }).format(date)
}

export default function SuggestionsPage() {
  const [suggestions, setSuggestions] = useState(seededSuggestions)
  const [search, setSearch] = useState('')
  const [expandedSuggestionId, setExpandedSuggestionId] = useState(seededSuggestions[0]?.id ?? null)
  const [currentPage, setCurrentPage] = useState(1)

  const filteredSuggestions = useMemo(() => {
    const normalizedSearch = search.trim().toLowerCase()

    return suggestions.filter((suggestion) => {
      if (!normalizedSearch) {
        return true
      }

      return (
        suggestion.title.toLowerCase().includes(normalizedSearch) ||
        suggestion.student.toLowerCase().includes(normalizedSearch) ||
        suggestion.id.toLowerCase().includes(normalizedSearch)
      )
    })
  }, [search, suggestions])

  const totalPending = suggestions.length
  const lastEntry = suggestions[0] ? formatSubmittedDate(suggestions[0].submittedAt) : 'None'

  function toggleExpandedSuggestion(suggestionId) {
    setExpandedSuggestionId((currentId) => (currentId === suggestionId ? null : suggestionId))
  }

  function handleDecision(suggestionId) {
    setSuggestions((currentSuggestions) =>
      currentSuggestions.filter((suggestion) => suggestion.id !== suggestionId),
    )

    if (expandedSuggestionId === suggestionId) {
      const remainingSuggestions = filteredSuggestions.filter((suggestion) => suggestion.id !== suggestionId)
      setExpandedSuggestionId(remainingSuggestions[0]?.id ?? null)
    }
  }

  return (
    <main className="admin-page space-y-8">
      <header className="grid gap-6 rounded-[1.6rem] border border-[rgba(77,70,50,0.18)] bg-[linear-gradient(135deg,rgba(250,204,21,0.08),rgba(255,255,255,0.02))] p-6 xl:grid-cols-[minmax(0,1.25fr)_320px] xl:p-7">
        <div className="space-y-4">
          <p className="admin-ui-text text-[0.68rem] text-[rgba(250,204,21,0.82)]">Review queue</p>
          <div className="space-y-3">
            <h1 className="admin-display text-4xl leading-none text-[var(--admin-text)] sm:text-5xl xl:text-6xl">
              Suggestions queue
            </h1>
            <p className="max-w-3xl text-sm leading-7 text-[rgba(209,198,171,0.74)] sm:text-base">
              Review student-submitted competition proposals, inspect resource and logistics details, and
              approve or reject items from the reserved admin route group defined in the frontend plan.
            </p>
          </div>
        </div>

          <div className="grid gap-4 rounded-[1.4rem] border border-[rgba(77,70,50,0.18)] bg-[rgba(12,14,18,0.62)] p-5">
          <div>
            <p className="admin-ui-text text-[0.62rem] text-[rgba(250,204,21,0.78)]">Total pending</p>
            <p className="mt-2 text-3xl font-black tracking-tight text-[var(--admin-text)]">{totalPending}</p>
          </div>
          <div>
            <p className="admin-ui-text text-[0.62rem] text-[rgba(209,198,171,0.66)]">Last entry</p>
            <p className="mt-2 text-2xl font-black tracking-tight text-[var(--admin-text)]">{lastEntry}</p>
          </div>
        </div>
      </header>

      <section className="space-y-6 rounded-[1.6rem] border border-[rgba(77,70,50,0.18)] bg-[rgba(12,14,18,0.72)] p-4 sm:p-6">
        <div className="flex flex-col gap-4 xl:flex-row xl:items-end xl:justify-between">
          <div className="space-y-2">
            <p className="admin-ui-text text-[0.68rem] text-[rgba(250,204,21,0.78)]">Queue controls</p>
            <h2 className="admin-title text-2xl text-[var(--admin-text)]">Pending approval</h2>
          </div>

          <div className="grid gap-4 md:grid-cols-[minmax(0,320px)_auto_auto]">
            <label className="space-y-2">
              <span className="admin-ui-text text-[0.62rem] text-[rgba(209,198,171,0.7)]">Search queue</span>
              <div className="relative">
                <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[rgba(209,198,171,0.52)]" />
                <Input
                  className="pl-11"
                  placeholder="Search title, student, ID..."
                  value={search}
                  onChange={(event) => setSearch(event.target.value)}
                />
              </div>
            </label>

            <Button className="self-end justify-center md:min-w-40" size="nav" variant="secondary">
              <Clock3 className="mr-2 h-4 w-4" />
              View archive
            </Button>

            <Button className="self-end justify-center md:min-w-40" size="nav" variant="secondary">
              <FileJson className="mr-2 h-4 w-4" />
              Export JSON
            </Button>
          </div>
        </div>

        <div className="space-y-4">
          {filteredSuggestions.map((suggestion) => {
            const isExpanded = expandedSuggestionId === suggestion.id

            return (
              <article
                key={suggestion.id}
                className={[
                  'overflow-hidden rounded-[1.4rem] border transition-colors duration-200',
                  isExpanded
                    ? 'border-[rgba(250,204,21,0.28)] bg-[rgba(30,32,36,0.82)]'
                    : 'border-[rgba(77,70,50,0.16)] bg-[rgba(17,19,23,0.88)] hover:bg-[rgba(30,32,36,0.82)]',
                ].join(' ')}
              >
                <button
                  className="flex w-full items-start justify-between gap-4 p-5 text-left sm:p-6"
                  type="button"
                  onClick={() => toggleExpandedSuggestion(suggestion.id)}
                >
                  <div className="flex items-start gap-4">
                    <div className="mt-2 h-2.5 w-2.5 shrink-0 rounded-full bg-[var(--admin-gold)]" />
                    <div className="space-y-2">
                      <h3 className="text-lg font-black uppercase tracking-[0.03em] text-[var(--admin-text)]">
                        {suggestion.title}
                      </h3>
                      <div className="flex flex-wrap items-center gap-3 text-[0.7rem] uppercase tracking-[0.12em] text-[rgba(209,198,171,0.66)]">
                        <span>Student: {suggestion.student}</span>
                        <span className="h-1 w-1 rounded-full bg-[rgba(77,70,50,0.8)]" />
                        <span>Date: {formatSubmittedDate(suggestion.submittedAt)}</span>
                        <span className="h-1 w-1 rounded-full bg-[rgba(77,70,50,0.8)]" />
                        <span>{suggestion.id}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    <span className="rounded-full border border-[rgba(250,204,21,0.2)] bg-[rgba(250,204,21,0.08)] px-3 py-1 text-[0.65rem] font-semibold uppercase tracking-[0.14em] text-[var(--admin-gold-soft)]">
                      {suggestion.status}
                    </span>
                    {isExpanded ? (
                      <ChevronUp className="h-5 w-5 text-[var(--admin-gold)]" />
                    ) : (
                      <ChevronDown className="h-5 w-5 text-[rgba(209,198,171,0.62)]" />
                    )}
                  </div>
                </button>

                {isExpanded ? (
                  <div className="space-y-6 border-t border-[rgba(77,70,50,0.18)] px-5 py-6 sm:px-6">
                    <div className="grid gap-6 lg:grid-cols-[minmax(0,1.5fr)_320px]">
                      <div className="space-y-4">
                        <div>
                          <p className="admin-ui-text text-[0.62rem] text-[rgba(209,198,171,0.66)]">Executive summary</p>
                          <p className="mt-3 text-base leading-8 text-[rgba(226,226,232,0.9)]">{suggestion.summary}</p>
                        </div>

                        <div className="rounded-[1.2rem] border border-[rgba(77,70,50,0.18)] bg-[rgba(12,14,18,0.72)] p-4">
                          <p className="admin-ui-text text-[0.62rem] text-[rgba(209,198,171,0.66)]">Technical resources</p>
                          <a
                            className="mt-3 inline-flex items-center gap-2 break-all text-sm font-semibold text-[var(--admin-gold-soft)] hover:text-[var(--admin-gold)]"
                            href={suggestion.resourceLink}
                            target="_blank"
                            rel="noreferrer"
                          >
                            <LinkIcon className="h-4 w-4" />
                            {suggestion.resourceLink}
                          </a>
                        </div>
                      </div>

                      <div className="rounded-[1.2rem] border border-[rgba(77,70,50,0.18)] bg-[rgba(12,14,18,0.72)] p-5">
                        <p className="admin-ui-text text-[0.62rem] text-[rgba(209,198,171,0.66)]">Logistics block</p>
                        <div className="mt-4 space-y-4 text-sm">
                          <div>
                            <p className="text-[0.65rem] uppercase tracking-[0.14em] text-[rgba(209,198,171,0.58)]">Proposed schedule</p>
                            <p className="mt-1 font-semibold text-[var(--admin-text)]">{suggestion.proposedSchedule}</p>
                          </div>
                          <div>
                            <p className="text-[0.65rem] uppercase tracking-[0.14em] text-[rgba(209,198,171,0.58)]">Hardware tier</p>
                            <p className="mt-1 font-semibold text-[var(--admin-text)]">{suggestion.hardwareTier}</p>
                          </div>
                          <div>
                            <p className="text-[0.65rem] uppercase tracking-[0.14em] text-[rgba(209,198,171,0.58)]">Budget allocation</p>
                            <p className="mt-1 font-semibold text-[var(--admin-gold-soft)]">{suggestion.budget}</p>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-col gap-3 border-t border-[rgba(77,70,50,0.18)] pt-5 sm:flex-row">
                      <Button className="flex-1 justify-center" size="nav" onClick={() => handleDecision(suggestion.id)}>
                        <CheckCircle2 className="mr-2 h-4 w-4" />
                        Approve proposal
                      </Button>
                      <Button
                        className="sm:min-w-60 justify-center border-[rgba(255,180,171,0.24)] bg-[linear-gradient(135deg,rgba(255,180,171,0.08),rgba(255,255,255,0.02))] text-[var(--admin-danger)] shadow-none hover:bg-[rgba(255,180,171,0.12)]"
                        size="nav"
                        variant="secondary"
                        onClick={() => handleDecision(suggestion.id)}
                      >
                        <XCircle className="mr-2 h-4 w-4" />
                        Reject proposal
                      </Button>
                    </div>
                  </div>
                ) : null}
              </article>
            )
          })}
        </div>

        <footer className="flex flex-col gap-6 border-t border-[rgba(77,70,50,0.18)] pt-6 md:flex-row md:items-center md:justify-between">
          <div className="flex items-center gap-2">
            <button
              className="rounded-full border border-[rgba(77,70,50,0.22)] p-3 text-[rgba(209,198,171,0.74)] transition-colors duration-200 hover:border-[rgba(250,204,21,0.3)] hover:text-[var(--admin-gold-soft)]"
              type="button"
              onClick={() => setCurrentPage((page) => Math.max(1, page - 1))}
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <span className="flex h-10 w-10 items-center justify-center rounded-full bg-[var(--admin-gold)] text-sm font-black text-[var(--admin-surface-low)]">
              {String(currentPage).padStart(2, '0')}
            </span>
            <button
              className="rounded-full border border-[rgba(77,70,50,0.22)] p-3 text-[rgba(209,198,171,0.74)] transition-colors duration-200 hover:border-[rgba(250,204,21,0.3)] hover:text-[var(--admin-gold-soft)]"
              type="button"
              onClick={() => setCurrentPage((page) => page + 1)}
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>

          <div className="flex flex-wrap gap-4">
            <Button className="justify-center md:min-w-44" size="nav" variant="secondary">
              <Clock3 className="mr-2 h-4 w-4" />
              View archive
            </Button>
            <Button className="justify-center md:min-w-44" size="nav" variant="secondary">
              <Download className="mr-2 h-4 w-4" />
              Export JSON
            </Button>
          </div>
        </footer>
      </section>
    </main>
  )
}
