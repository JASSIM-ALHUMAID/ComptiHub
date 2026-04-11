import { useState } from 'react'
import Button from '../../components/ui/Button'
import { competitionAdminService } from '../../features/admin/services/competitionAdminService'

export default function SuggestionsPage() {
  const [suggestions, setSuggestions] = useState(() => competitionAdminService.getSuggestions())

  function handleApprove(id) {
    const result = competitionAdminService.approveSuggestion(id)
    setSuggestions(result.suggestions)
  }

  function handleReject(id) {
    const result = competitionAdminService.rejectSuggestion(id)
    setSuggestions(result.suggestions)
  }

  return (
    <main className="space-y-6">
      <header className="space-y-2">
        <p className="landing-label text-[0.68rem] text-[rgba(250,204,21,0.82)]">Admin</p>
        <h1 className="landing-title text-3xl text-(--landing-text)">Suggestions</h1>
      </header>

      <p className="landing-copy text-sm text-[rgba(226,226,232,0.72)] sm:text-base">
        Review student-submitted competition suggestions and approve only the ones that should become official competitions.
      </p>

      <div className="space-y-4">
        {suggestions.map((suggestion) => (
          <div
            key={suggestion.id}
            className="rounded-[1.75rem] border border-[rgba(77,70,50,0.22)] bg-[rgba(12,14,18,0.48)] p-5"
          >
            <p className="text-lg font-semibold">{suggestion.title}</p>
            <p className="mt-2 text-sm text-[rgba(226,226,232,0.72)]">{suggestion.description}</p>

            <div className="mt-4 grid gap-2 text-xs text-[rgba(226,226,232,0.6)] sm:grid-cols-2">
              <p>Submitted By: {suggestion.submittedBy}</p>
              <p>Organizer: {suggestion.organizer}</p>
              <p>Category: {suggestion.category}</p>
              <p>Mode: {suggestion.mode}</p>
              <p>Team Size: {suggestion.teamSize}</p>
              <p>Max Team Size: {suggestion.maxTeamSize}</p>
              <p>Deadline: {suggestion.deadline}</p>
              <p>Prize: {suggestion.prize}</p>
              <p>Status: {suggestion.status}</p>
            </div>

            {suggestion.requirements?.length ? (
              <div className="mt-4">
                <p className="text-xs font-semibold text-[rgba(250,204,21,0.82)]">Requirements</p>
                <div className="mt-2 flex flex-wrap gap-2">
                  {suggestion.requirements.map((requirement) => (
                    <span
                      key={requirement}
                      className="rounded-full border border-[rgba(77,70,50,0.22)] bg-[rgba(17,19,23,0.82)] px-3 py-1 text-xs text-[rgba(226,226,232,0.72)]"
                    >
                      {requirement}
                    </span>
                  ))}
                </div>
              </div>
            ) : null}

            {suggestion.tags?.length ? (
              <div className="mt-4">
                <p className="text-xs font-semibold text-[rgba(250,204,21,0.82)]">Tags</p>
                <div className="mt-2 flex flex-wrap gap-2">
                  {suggestion.tags.map((tag) => (
                    <span
                      key={tag}
                      className="rounded-full border border-[rgba(77,70,50,0.22)] bg-[rgba(17,19,23,0.82)] px-3 py-1 text-xs text-[rgba(226,226,232,0.72)]"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            ) : null}

            <div className="mt-4 flex gap-2">
              <Button size="nav" onClick={() => handleApprove(suggestion.id)}>
                Approve
              </Button>
              <Button size="nav" variant="secondary" onClick={() => handleReject(suggestion.id)}>
                Reject
              </Button>
            </div>
          </div>
        ))}
      </div>
    </main>
  )
}