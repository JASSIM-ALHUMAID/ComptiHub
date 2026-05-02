import { adminSuggestions } from '../../../data/mocks/adminSuggestions'
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
    const session = authService.getSession()

    // Use mock data only for explicit non-API sessions.
    if (session?.source !== 'api') {
      return adminSuggestions.map(normalizeSuggestion)
    }

    const data = await apiClient(`${endpoints.adminSuggestions.list}?status=pending`, {
      token: authService.getToken(),
    })
    return (data.suggestions ?? []).map(normalizeSuggestion)
  },

  async decideSuggestion(suggestionId, decision, reason) {
    const session = authService.getSession()

    if (session?.source !== 'api') {
      // Mock implementation - just return success
      return { success: true }
    }

    const data = await apiClient(endpoints.adminSuggestions.decide(suggestionId), {
      method: 'PATCH',
      body: { decision, reason },
      token: authService.getToken(),
    })
    return data
  },
}

