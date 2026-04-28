import { ApiError, notFound } from '../../utils/apiError.js'
import { CompetitionSuggestion } from './competitionSuggestion.model.js'

function toId(value) {
  if (!value) {
    return null
  }

  return (value._id || value).toString()
}

function serializeSuggestion(suggestion) {
  const submittedBy = suggestion.submittedBy

  return {
    id: toId(suggestion),
    submittedBy: toId(submittedBy),
    student: submittedBy?.username
      ? {
          id: toId(submittedBy),
          username: submittedBy.username,
          email: submittedBy.email,
        }
      : null,
    title: suggestion.title,
    summary: suggestion.summary,
    resourceLink: suggestion.resourceLink,
    proposedSchedule: suggestion.proposedSchedule,
    hardwareTier: suggestion.hardwareTier,
    budget: suggestion.budget,
    status: suggestion.status,
    reviewedBy: toId(suggestion.reviewedBy),
    reviewedAt: suggestion.reviewedAt,
    submittedAt: suggestion.createdAt,
    createdAt: suggestion.createdAt,
    updatedAt: suggestion.updatedAt,
  }
}

export async function listSuggestions(filters = {}) {
  const query = {}

  if (filters.status) {
    query.status = filters.status
  }

  const suggestions = await CompetitionSuggestion.find(query)
    .sort({ createdAt: -1 })
    .populate({ path: 'submittedBy', select: 'username email' })
    .lean()

  return suggestions.map(serializeSuggestion)
}

export async function reviewSuggestion(adminUser, suggestionId, status) {
  const suggestion = await CompetitionSuggestion.findOneAndUpdate(
    { _id: suggestionId, status: 'pending' },
    {
      status,
      reviewedBy: adminUser._id,
      reviewedAt: new Date(),
    },
    { new: true },
  )
    .populate({ path: 'submittedBy', select: 'username email' })
    .lean()

  if (!suggestion) {
    const existing = await CompetitionSuggestion.findById(suggestionId).lean()

    if (!existing) {
      throw notFound('Suggestion not found.')
    }

    throw new ApiError(409, 'Suggestion has already been reviewed.')
  }

  return serializeSuggestion(suggestion)
}
