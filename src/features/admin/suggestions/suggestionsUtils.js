export function formatSubmittedDate(value) {
  const date = new Date(value.includes('T') ? value : `${value}T00:00:00`)

  return new Intl.DateTimeFormat('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  }).format(date)
}

export function filterSuggestions(suggestions, search) {
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
}

export function getNextExpandedSuggestionId(filteredSuggestions, removedSuggestionId) {
  const remainingSuggestions = filteredSuggestions.filter((suggestion) => suggestion.id !== removedSuggestionId)
  return remainingSuggestions[0]?.id ?? null
}
