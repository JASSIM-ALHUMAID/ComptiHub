import { apiClient } from '../../../lib/api/client'
import { endpoints } from '../../../lib/api/endpoints'
import { authService } from '../../auth/services/authService'

function normalizeSuggestion(suggestion) {
  const student = suggestion.student

  return {
    ...suggestion,
    id: suggestion.id ?? suggestion._id,
    _id: suggestion._id ?? suggestion.id,
    student: typeof student === 'object' && student !== null ? student.username ?? student.email ?? 'Unknown student' : student ?? 'Unknown student',
  }
}

export const adminSuggestionsService = {
  async listSuggestions() {
    const data = await apiClient(`${endpoints.adminSuggestions.list}?status=pending`, {
      token: authService.getToken(),
    })
    return (data.suggestions ?? []).map(normalizeSuggestion)
  },

  async decideSuggestion(suggestionId, decision, reason) {
    const data = await apiClient(endpoints.adminSuggestions.decide(suggestionId), {
      method: 'PATCH',
      body: { decision, reason },
      token: authService.getToken(),
    })
    return data
  },
}

