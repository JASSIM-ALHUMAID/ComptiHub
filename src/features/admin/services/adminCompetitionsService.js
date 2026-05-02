import { adminCompetitions as mockAdminCompetitions } from '../../../data/mocks/adminCompetitions'
import { apiClient } from '../../../lib/api/client'
import { endpoints } from '../../../lib/api/endpoints'
import { authService } from '../../auth/services/authService'

function getSession() {
  return authService.getSession()
}

function normalizeLinksToText(links) {
  if (Array.isArray(links)) {
    return links.join(', ')
  }

  return links ?? ''
}

function normalizeCompetition(competition) {
  return {
    id: competition.id ?? competition._id,
    _id: competition._id ?? competition.id,
    title: competition.title,
    organizer: competition.organizer,
    category: competition.category ?? 'General',
    mode: competition.mode ?? 'Hybrid',
    teamSize: competition.teamSize ?? 'TBD',
    deadline: competition.deadline ?? competition.registrationDeadline,
    status: competition.status,
    prize: competition.prize ?? competition.prizePool ?? 'TBD',
    prizePool: competition.prize ?? competition.prizePool ?? 'TBD',
    description: competition.description,
    requirements: competition.requirements ?? [],
    tags: competition.tags ?? [],
    links: normalizeLinksToText(competition.links),
    startDate: competition.startDate,
    endDate: competition.endDate,
    registrationDeadline: competition.registrationDeadline,
    participationType: competition.participationType ?? 'team',
    teamCount: competition.teamCount ?? 0,
    createdAt: competition.createdAt,
    updatedAt: competition.updatedAt,
  }
}

function createMockCollection() {
  return mockAdminCompetitions.map(normalizeCompetition)
}

let mockCollection = createMockCollection()

function matchesCompetitionFilter(competition, search, statusFilter, categoryFilter) {
  const normalizedSearch = search.trim().toLowerCase()

  const matchesStatus = statusFilter === 'all' || competition.status === statusFilter
  const matchesCategory = categoryFilter === 'all' || competition.category === categoryFilter
  const matchesSearch =
    !normalizedSearch ||
    competition.title.toLowerCase().includes(normalizedSearch) ||
    competition.id.toLowerCase().includes(normalizedSearch) ||
    competition.organizer.toLowerCase().includes(normalizedSearch)

  return matchesStatus && matchesCategory && matchesSearch
}

function buildPayload(form) {
  return {
    title: form.title.trim(),
    organizer: form.organizer.trim(),
    category: form.category.trim(),
    mode: form.mode.trim(),
    teamSize: form.teamSize.trim(),
    status: form.status,
    prize: form.prizePool.trim() || 'TBD',
    description: form.description.trim(),
    requirements: form.requirements
      .split('\n')
      .map((item) => item.trim())
      .filter(Boolean),
    tags: form.tags
      .split(',')
      .map((item) => item.trim())
      .filter(Boolean),
    links: form.links,
    startDate: form.startDate,
    endDate: form.endDate,
    registrationDeadline: form.registrationDeadline,
    participationType: form.participationType,
  }
}

export const adminCompetitionsService = {
  async listCompetitions({ search = '', statusFilter = 'all', categoryFilter = 'all' } = {}) {
    const session = getSession()

    if (session?.source !== 'api') {
      return mockCollection.filter((competition) =>
        matchesCompetitionFilter(competition, search, statusFilter, categoryFilter),
      )
    }

    const query = new URLSearchParams()
    if (search) query.set('search', search)
    if (statusFilter !== 'all') query.set('status', statusFilter)
    if (categoryFilter !== 'all') query.set('category', categoryFilter)
    const suffix = query.size > 0 ? `?${query.toString()}` : ''

    const data = await apiClient(`${endpoints.adminCompetitions.list}${suffix}`, {
      token: authService.getToken(),
    })

    return data.competitions.map(normalizeCompetition)
  },

  async createCompetition(form) {
    const session = getSession()

    if (session?.source !== 'api') {
      const nextCompetition = normalizeCompetition({
        ...buildPayload(form),
        id: `COMP-${Math.floor(1000 + Math.random() * 9000)}`,
        prizePool: form.prizePool.trim() || 'TBD',
      })
      mockCollection = [nextCompetition, ...mockCollection]
      return nextCompetition
    }

    const data = await apiClient(endpoints.adminCompetitions.list, {
      method: 'POST',
      body: buildPayload(form),
      token: authService.getToken(),
    })

    return normalizeCompetition(data.competition)
  },

  async updateCompetition(id, form) {
    const session = getSession()

    if (session?.source !== 'api') {
      const nextCompetition = normalizeCompetition({
        ...buildPayload(form),
        id,
        prizePool: form.prizePool.trim() || 'TBD',
      })
      mockCollection = mockCollection.map((competition) => (competition.id === id ? nextCompetition : competition))
      return nextCompetition
    }

    const data = await apiClient(endpoints.adminCompetitions.byId(id), {
      method: 'PATCH',
      body: buildPayload(form),
      token: authService.getToken(),
    })

    return normalizeCompetition(data.competition)
  },

  async deleteCompetition(id) {
    const session = getSession()

    if (session?.source !== 'api') {
      mockCollection = mockCollection.filter((competition) => competition.id !== id)
      return
    }

    await apiClient(endpoints.adminCompetitions.byId(id), {
      method: 'DELETE',
      token: authService.getToken(),
    })
  },
}
