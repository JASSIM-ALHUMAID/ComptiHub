import { useEffect, useMemo, useRef, useState } from 'react'
import Alert from '../../components/ui/Alert'
import LoadingState from '../../components/feedback/LoadingState'
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

export default function SuggestionsPage() {
  const [suggestions, setSuggestions] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)
  const [decisionError, setDecisionError] = useState(null)
  const [pendingDecisionId, setPendingDecisionId] = useState(null)
  const [search, setSearch] = useState('')
  const [expandedSuggestionId, setExpandedSuggestionId] = useState(null)
  const [currentPage, setCurrentPage] = useState(1)
  const pendingDecisionRef = useRef(null)
  const searchRef = useRef(search)

  searchRef.current = search

  useEffect(() => {
    let isCancelled = false

    async function loadSuggestions() {
      try {
        setIsLoading(true)
        setError(null)
        setDecisionError(null)
        setPendingDecisionId(null)
        pendingDecisionRef.current = null
        const nextSuggestions = await adminSuggestionsService.listSuggestions()
        if (!isCancelled) {
          setSuggestions(nextSuggestions)
          setExpandedSuggestionId(nextSuggestions[0]?.id ?? null)
        }
      } catch (loadError) {
        if (!isCancelled) {
          setError(loadError.message || 'Failed to load suggestions.')
        }
      } finally {
        if (!isCancelled) {
          setIsLoading(false)
        }
      }
    }

    loadSuggestions()

    return () => {
      isCancelled = true
    }
  }, [])

  const filteredSuggestions = useMemo(() => filterSuggestions(suggestions, search), [search, suggestions])

  const totalPending = suggestions.length
  const lastEntry = suggestions[0] ? formatSubmittedDate(suggestions[0].submittedAt) : 'None'

  function toggleExpandedSuggestion(suggestionId) {
    setExpandedSuggestionId((currentId) => (currentId === suggestionId ? null : suggestionId))
  }

  function removeDecidedSuggestion(suggestionId) {
    setSuggestions((currentSuggestions) => {
      const currentFilteredSuggestions = filterSuggestions(currentSuggestions, searchRef.current)

      setExpandedSuggestionId((currentId) =>
        currentId === suggestionId ? getNextExpandedSuggestionId(currentFilteredSuggestions, suggestionId) : currentId,
      )

      return currentSuggestions.filter((suggestion) => suggestion.id !== suggestionId)
    })
  }

  async function decideSuggestion(suggestionId, decision) {
    if (pendingDecisionRef.current !== null) {
      return
    }

    pendingDecisionRef.current = suggestionId
    setPendingDecisionId(suggestionId)

    try {
      setDecisionError(null)
      await adminSuggestionsService.decideSuggestion(suggestionId, decision, '')
      removeDecidedSuggestion(suggestionId)
    } catch (decisionError) {
      setDecisionError(decisionError.message || 'Failed to update suggestion decision.')
    } finally {
      pendingDecisionRef.current = null
      setPendingDecisionId(null)
    }
  }

  function handlePreviousPage() {
    setCurrentPage((page) => Math.max(1, page - 1))
  }

  function handleNextPage() {
    setCurrentPage((page) => page + 1)
  }

  return (
    <main className="app-page space-y-8">
      {isLoading && <LoadingState title="Loading suggestions..." />}

      {error && (
        <Alert
          variant="error"
          title="Failed to load suggestions"
          message={error}
        />
      )}

      {!isLoading && !error && (
        <>
          <SuggestionsHeader totalPending={totalPending} lastEntry={lastEntry} />

          <section className="space-y-6 rounded-[1.6rem] border border-[rgba(77,70,50,0.18)] bg-[rgba(12,14,18,0.72)] p-4 sm:p-6">
            <SuggestionsControls search={search} onSearchChange={(event) => setSearch(event.target.value)} />

            {decisionError && (
              <Alert
                variant="error"
                title="Failed to update suggestion"
                message={decisionError}
              />
            )}

            {filteredSuggestions.length === 0 ? (
              <Alert
                variant="info"
                title="No suggestions"
                message={search ? 'No suggestions match your search.' : 'No suggestions to review.'}
                showIcon={false}
              />
            ) : (
              <>
                <div className="space-y-4">
                  {filteredSuggestions.map((suggestion) => (
                    <SuggestionCard
                      key={suggestion.id}
                      suggestion={suggestion}
                      isExpanded={expandedSuggestionId === suggestion.id}
                      isDecisionPending={pendingDecisionId !== null}
                      onToggleExpandedSuggestion={toggleExpandedSuggestion}
                      onDecision={decideSuggestion}
                    />
                  ))}
                </div>

                <SuggestionsPagination
                  currentPage={currentPage}
                  onPreviousPage={handlePreviousPage}
                  onNextPage={handleNextPage}
                />
              </>
            )}
          </section>
        </>
      )}
    </main>
  )
}
