import { CheckCircle2, ChevronDown, ChevronUp, Link as LinkIcon, XCircle } from 'lucide-react'
import Button from '../../../components/ui/Button'
import { formatSubmittedDate } from './suggestionsUtils'

export default function SuggestionCard({
  suggestion,
  isExpanded,
  isDecisionPending = false,
  onToggleExpandedSuggestion,
  onDecision,
}) {
  return (
    <article
      className={[
        'overflow-hidden rounded-[1.4rem] border transition-colors duration-200',
        isExpanded
          ? 'border-[rgba(250,204,21,0.28)] bg-[rgba(30,32,36,0.82)]'
          : 'border-[rgba(77,70,50,0.16)] bg-[rgba(17,19,23,0.88)] hover:bg-[rgba(30,32,36,0.82)]',
      ].join(' ')}
    >
      <button
        aria-controls={`suggestion-panel-${suggestion.id}`}
        aria-expanded={isExpanded}
        className="flex w-full items-start justify-between gap-4 p-5 text-left sm:p-6"
        type="button"
        onClick={() => onToggleExpandedSuggestion(suggestion.id)}
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
        <div
          className="space-y-6 border-t border-[rgba(77,70,50,0.18)] px-5 py-6 sm:px-6"
          id={`suggestion-panel-${suggestion.id}`}
        >
          <div className="grid gap-6 lg:grid-cols-[minmax(0,1.5fr)_320px]">
            <div className="space-y-4">
              <div>
                <p className="app-ui-text text-[0.62rem] text-[rgba(209,198,171,0.66)]">Executive summary</p>
                <p className="mt-3 text-base leading-8 text-[rgba(226,226,232,0.9)]">{suggestion.summary}</p>
              </div>

              <div className="rounded-[1.2rem] border border-[rgba(77,70,50,0.18)] bg-[rgba(12,14,18,0.72)] p-4">
                <p className="app-ui-text text-[0.62rem] text-[rgba(209,198,171,0.66)]">Technical resources</p>
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
              <p className="app-ui-text text-[0.62rem] text-[rgba(209,198,171,0.66)]">Logistics block</p>
              <div className="mt-4 space-y-4 text-sm">
                <div>
                  <p className="text-[0.65rem] uppercase tracking-[0.14em] text-[rgba(209,198,171,0.58)]">
                    Proposed schedule
                  </p>
                  <p className="mt-1 font-semibold text-[var(--admin-text)]">{suggestion.proposedSchedule}</p>
                </div>
                <div>
                  <p className="text-[0.65rem] uppercase tracking-[0.14em] text-[rgba(209,198,171,0.58)]">
                    Hardware tier
                  </p>
                  <p className="mt-1 font-semibold text-[var(--admin-text)]">{suggestion.hardwareTier}</p>
                </div>
                <div>
                  <p className="text-[0.65rem] uppercase tracking-[0.14em] text-[rgba(209,198,171,0.58)]">
                    Budget allocation
                  </p>
                  <p className="mt-1 font-semibold text-[var(--admin-gold-soft)]">{suggestion.budget}</p>
                </div>
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-3 border-t border-[rgba(77,70,50,0.18)] pt-5 sm:flex-row">
            <Button
              className="flex-1 justify-center"
              size="nav"
              disabled={isDecisionPending}
              onClick={() => onDecision(suggestion.id, 'approved')}
            >
              <CheckCircle2 className="mr-2 h-4 w-4" />
              Approve proposal
            </Button>
            <Button
              className="sm:min-w-60 justify-center border-[rgba(255,180,171,0.24)] bg-[linear-gradient(135deg,rgba(255,180,171,0.08),rgba(255,255,255,0.02))] text-[var(--admin-danger)] shadow-none hover:bg-[rgba(255,180,171,0.12)]"
              size="nav"
              variant="secondary"
              disabled={isDecisionPending}
              onClick={() => onDecision(suggestion.id, 'rejected')}
            >
              <XCircle className="mr-2 h-4 w-4" />
              Reject proposal
            </Button>
          </div>
        </div>
      ) : null}
    </article>
  )
}
