import { apiClient } from '../../../lib/api/client'
import { endpoints } from '../../../lib/api/endpoints'
import { authService } from '../../auth/services/authService'

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
    const data = await apiClient(endpoints.adminCompetitions.list, {
      method: 'POST',
      body: buildPayload(form),
      token: authService.getToken(),
    })

    return normalizeCompetition(data.competition)
  },

  async updateCompetition(id, form) {
    const data = await apiClient(endpoints.adminCompetitions.byId(id), {
      method: 'PATCH',
      body: buildPayload(form),
      token: authService.getToken(),
    })

    return normalizeCompetition(data.competition)
  },

  async deleteCompetition(id) {
    await apiClient(endpoints.adminCompetitions.byId(id), {
      method: 'DELETE',
      token: authService.getToken(),
    })
  },
}
