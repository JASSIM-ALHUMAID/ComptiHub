import { competitions as mockCompetitions } from '../../../data/mocks/competitions'
import { apiClient } from '../../../lib/api/client'
import { endpoints } from '../../../lib/api/endpoints'
import { authService } from '../../auth/services/authService'

function getSessionSource() {
  return authService.getSession()?.source ?? 'mock'
}

function normalizeCompetition(competition) {
  return {
    ...competition,
    id: competition.id ?? competition._id,
    _id: competition._id ?? competition.id,
  }
}

export const competitionService = {
  async listCompetitions(filters = {}) {
    if (getSessionSource() === 'mock') {
      const normalizedSearch = filters.search?.trim().toLowerCase() ?? ''
      const status = filters.status ?? 'all'
      const category = filters.category ?? 'All'

      return mockCompetitions
        .filter((competition) => {
          const matchesSearch =
            !normalizedSearch ||
            competition.title.toLowerCase().includes(normalizedSearch) ||
            competition.organizer.toLowerCase().includes(normalizedSearch)
          const matchesCategory = category === 'All' || competition.category === category
          const matchesStatus = status === 'all' || competition.status === status
          return matchesSearch && matchesCategory && matchesStatus
        })
        .map(normalizeCompetition)
    }

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
    if (getSessionSource() === 'mock') {
      const competition = mockCompetitions.find((item) => item.id === id)
      return competition ? normalizeCompetition(competition) : null
    }

    const data = await apiClient(endpoints.competitions.byId(id))
    return normalizeCompetition(data.competition)
  },
}
