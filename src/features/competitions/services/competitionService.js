import { apiClient } from '../../../lib/api/client'
import { endpoints } from '../../../lib/api/endpoints'

function normalizeCompetition(competition) {
  return {
    ...competition,
    id: competition.id ?? competition._id,
    _id: competition._id ?? competition.id,
  }
}

export const competitionService = {
  async listCompetitions(filters = {}) {
    const query = new URLSearchParams()
    if (filters.search) query.set('search', filters.search)
    if (filters.category && filters.category !== 'All') query.set('category', filters.category)
    if (filters.status && filters.status !== 'all') query.set('status', filters.status)
    if (filters.sortBy) query.set('sortBy', filters.sortBy)
    if (filters.sortOrder) query.set('sortOrder', filters.sortOrder)

    const suffix = query.size > 0 ? `?${query.toString()}` : ''
    const data = await apiClient(`${endpoints.competitions.list}${suffix}`)
    return data.competitions.map(normalizeCompetition)
  },

  async getCompetitionById(id) {
    const data = await apiClient(endpoints.competitions.byId(id))
    return normalizeCompetition(data.competition)
  },
}
