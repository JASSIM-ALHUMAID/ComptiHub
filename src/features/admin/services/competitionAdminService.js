import { competitions as mockCompetitions } from '../../../data/mocks/competitions'
import { storage } from '../../../lib/utils/storage'

const COMPETITIONS_KEY = 'compitihub.admin.competitions'
const SUGGESTIONS_KEY = 'compitihub.admin.suggestions'

function readJson(key, fallback) {
  const value = storage.get(key)

  if (!value) {
    return fallback
  }

  try {
    return JSON.parse(value)
  } catch {
    return fallback
  }
}

function writeJson(key, value) {
  storage.set(key, JSON.stringify(value))
}

function createId() {
  if (globalThis.crypto?.randomUUID) {
    return globalThis.crypto.randomUUID()
  }

  return String(Date.now())
}

function extractMaxTeamSize(teamSize) {
  if (!teamSize) {
    return ''
  }

  const matches = String(teamSize).match(/\d+/g)

  if (!matches?.length) {
    return ''
  }

  return Number(matches[matches.length - 1])
}

function normalizeCompetition(competition) {
  return {
    ...competition,
    deadline: competition.deadline ?? '',
    maxTeamSize: competition.maxTeamSize ?? extractMaxTeamSize(competition.teamSize),
  }
}

function seedCompetitions() {
  const existing = readJson(COMPETITIONS_KEY, null)

  if (Array.isArray(existing)) {
    return existing.map(normalizeCompetition)
  }

  const seeded = mockCompetitions.map(normalizeCompetition)
  writeJson(COMPETITIONS_KEY, seeded)
  return seeded
}

function seedSuggestions() {
  const existing = readJson(SUGGESTIONS_KEY, null)

  if (Array.isArray(existing)) {
    return existing
  }

  const seeded = [
    {
      id: 'sug-1',
      title: 'Cybersecurity CTF',
      organizer: 'SDAIA',
      category: 'Cybersecurity',
      mode: 'Team',
      teamSize: '3–4',
      maxTeamSize: 4,
      deadline: '2025-08-10',
      prize: 'SAR 25,000',
      description: 'CTF competition.',
      requirements: ['Team of 3–4'],
      tags: ['Security'],
      submittedBy: 'Student',
      status: 'pending',
    },
  ]

  writeJson(SUGGESTIONS_KEY, seeded)
  return seeded
}

export const competitionAdminService = {
  getCompetitions() {
    return seedCompetitions()
  },

  getSuggestions() {
    return seedSuggestions()
  },

  createCompetition(data) {
    const list = seedCompetitions()

    const next = [
      ...list,
      normalizeCompetition({
        id: `comp-${createId()}`,
        status: 'open',
        requirements: data.requirements ?? [],
        tags: data.tags ?? [],
        ...data,
      }),
    ]

    writeJson(COMPETITIONS_KEY, next)
    return next
  },

  updateCompetition(id, updates) {
    const list = seedCompetitions()

    const next = list.map((competition) =>
      competition.id === id
        ? normalizeCompetition({
            ...competition,
            ...updates,
          })
        : competition,
    )

    writeJson(COMPETITIONS_KEY, next)
    return next
  },

  deleteCompetition(id) {
    const list = seedCompetitions()
    const next = list.filter((competition) => competition.id !== id)
    writeJson(COMPETITIONS_KEY, next)
    return next
  },

  approveSuggestion(id) {
    const suggestions = seedSuggestions()
    const suggestion = suggestions.find((item) => item.id === id)

    if (!suggestion) {
      return {
        suggestions,
        competitions: seedCompetitions(),
      }
    }

    const nextSuggestions = suggestions.filter((item) => item.id !== id)
    const competitions = seedCompetitions()

    const nextCompetitions = [
      ...competitions,
      normalizeCompetition({
        id: `comp-${createId()}`,
        title: suggestion.title,
        organizer: suggestion.organizer,
        category: suggestion.category,
        mode: suggestion.mode,
        teamSize: suggestion.teamSize,
        maxTeamSize: suggestion.maxTeamSize,
        deadline: suggestion.deadline,
        prize: suggestion.prize,
        description: suggestion.description,
        requirements: suggestion.requirements ?? [],
        tags: suggestion.tags ?? [],
        status: 'open',
      }),
    ]

    writeJson(SUGGESTIONS_KEY, nextSuggestions)
    writeJson(COMPETITIONS_KEY, nextCompetitions)

    return {
      suggestions: nextSuggestions,
      competitions: nextCompetitions,
    }
  },

  rejectSuggestion(id) {
    const suggestions = seedSuggestions()
    const nextSuggestions = suggestions.filter((item) => item.id !== id)

    writeJson(SUGGESTIONS_KEY, nextSuggestions)

    return {
      suggestions: nextSuggestions,
      competitions: seedCompetitions(),
    }
  },
}