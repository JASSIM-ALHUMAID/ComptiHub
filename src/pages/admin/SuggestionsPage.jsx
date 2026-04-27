import { useMemo, useState } from 'react'
import { adminSuggestionsService } from '../../features/admin/services/adminSuggestionsService'
import SuggestionCard from '../../features/admin/suggestions/SuggestionCard'
import SuggestionsControls from '../../features/admin/suggestions/SuggestionsControls'
import SuggestionsHeader from '../../features/admin/suggestions/SuggestionsHeader'
import SuggestionsPagination from '../../features/admin/suggestions/SuggestionsPagination'
import {
  filterSuggestions,
  formatSubmittedDate,
  getNextExpandedSuggestionId,
} from '../../features/admin/suggestions/suggestionsUtils'

const seededSuggestions = adminSuggestionsService.listSuggestions()

export default function SuggestionsPage() {
  const [suggestions, setSuggestions] = useState(seededSuggestions)
  const [search, setSearch] = useState('')
  const [expandedSuggestionId, setExpandedSuggestionId] = useState(seededSuggestions[0]?.id ?? null)
  const [currentPage, setCurrentPage] = useState(1)

  const filteredSuggestions = useMemo(() => filterSuggestions(suggestions, search), [search, suggestions])

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
      setExpandedSuggestionId(getNextExpandedSuggestionId(filteredSuggestions, suggestionId))
    }
  }

  function handlePreviousPage() {
    setCurrentPage((page) => Math.max(1, page - 1))
  }

  function handleNextPage() {
    setCurrentPage((page) => page + 1)
  }

  return (
    <main className="admin-page space-y-8">
      <SuggestionsHeader totalPending={totalPending} lastEntry={lastEntry} />

      <section className="space-y-6 rounded-[1.6rem] border border-[rgba(77,70,50,0.18)] bg-[rgba(12,14,18,0.72)] p-4 sm:p-6">
        <SuggestionsControls search={search} onSearchChange={(event) => setSearch(event.target.value)} />

        <div className="space-y-4">
          {filteredSuggestions.map((suggestion) => (
            <SuggestionCard
              key={suggestion.id}
              suggestion={suggestion}
              isExpanded={expandedSuggestionId === suggestion.id}
              onToggleExpandedSuggestion={toggleExpandedSuggestion}
              onDecision={handleDecision}
            />
          ))}
        </div>

        <SuggestionsPagination
          currentPage={currentPage}
          onPreviousPage={handlePreviousPage}
          onNextPage={handleNextPage}
        />
      </section>
    </main>
  )
}
