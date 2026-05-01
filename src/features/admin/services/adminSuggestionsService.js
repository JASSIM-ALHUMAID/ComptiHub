import { adminSuggestions } from '../../../data/mocks/adminSuggestions'
import { apiClient } from '../../../lib/api/client'
import { endpoints } from '../../../lib/api/endpoints'
import { authService } from '../../auth/services/authService'

function normalizeSuggestion(suggestion) {
  return {
    ...suggestion,
    id: suggestion.id ?? suggestion._id,
    _id: suggestion._id ?? suggestion.id,
  }
}

export const adminSuggestionsService = {
  async listSuggestions() {
    const session = authService.getSession()

    // Fallback to mock for non-API sessions
    if (session?.source !== 'api' || session.accountType !== 'admin') {
      return adminSuggestions.map(normalizeSuggestion)
    }

    try {
      const data = await apiClient(endpoints.adminSuggestions.list, {
        token: authService.getToken(),
      })
      return (data.suggestions ?? []).map(normalizeSuggestion)
    } catch {
      // Fallback to mock on API error
      return adminSuggestions.map(normalizeSuggestion)
    }
  },

  async decideSuggestion(suggestionId, decision, reason) {
    const session = authService.getSession()

    if (session?.source !== 'api' || session.accountType !== 'admin') {
      // Mock implementation - just return success
      return { success: true }
    }

    const data = await apiClient(endpoints.adminSuggestions.decide(suggestionId), {
      method: 'POST',
      body: { decision, reason },
      token: authService.getToken(),
    })
    return data
  },
}

