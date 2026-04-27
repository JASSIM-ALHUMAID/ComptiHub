export const initialForm = {
  id: '',
  title: '',
  organizer: '',
  links: '',
  startDate: '',
  endDate: '',
  registrationDeadline: '',
  status: 'draft',
  prizePool: '',
  description: '',
}

export function formatDisplayDate(value) {
  if (!value) {
    return 'Not set'
  }

  const date = new Date(`${value}T00:00:00`)

  return new Intl.DateTimeFormat('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  }).format(date)
}

export function getStatusClasses(status) {
  if (status === 'active') {
    return 'border-[rgba(250,204,21,0.28)] bg-[rgba(250,204,21,0.08)] text-[var(--admin-gold-soft)]'
  }

  if (status === 'upcoming') {
    return 'border-[rgba(148,163,184,0.26)] bg-[rgba(148,163,184,0.08)] text-[#d6deea]'
  }

  if (status === 'ended') {
    return 'border-[rgba(255,180,171,0.22)] bg-[rgba(255,180,171,0.08)] text-[var(--admin-danger)]'
  }

  return 'border-[rgba(77,70,50,0.24)] bg-[rgba(255,255,255,0.03)] text-[rgba(209,198,171,0.78)]'
}

export function buildCompetitionFromForm(form, existingCompetition = null) {
  return {
    id: existingCompetition?.id || `COMP-${Math.floor(1000 + Math.random() * 9000)}`,
    title: form.title.trim(),
    organizer: form.organizer.trim(),
    links: form.links.trim(),
    startDate: form.startDate,
    endDate: form.endDate,
    registrationDeadline: form.registrationDeadline,
    status: form.status,
    prizePool: form.prizePool.trim() || 'TBD',
    description: form.description.trim(),
    teamCount: existingCompetition?.teamCount ?? 0,
  }
}

export function filterCompetitions(competitions, search, statusFilter) {
  const normalizedSearch = search.trim().toLowerCase()

  return competitions.filter((competition) => {
    const matchesStatus = statusFilter === 'all' || competition.status === statusFilter
    const matchesSearch =
      !normalizedSearch ||
      competition.title.toLowerCase().includes(normalizedSearch) ||
      competition.id.toLowerCase().includes(normalizedSearch) ||
      competition.organizer.toLowerCase().includes(normalizedSearch)

    return matchesStatus && matchesSearch
  })
}

export function getCompetitionStats(competitions) {
  const active = competitions.filter((competition) => competition.status === 'active').length
  const upcoming = competitions.filter((competition) => competition.status === 'upcoming').length
  const drafts = competitions.filter((competition) => competition.status === 'draft').length
  const totalPrizePool = competitions.reduce((total, competition) => {
    const numericValue = Number(String(competition.prizePool).replace(/[^0-9.]/g, ''))
    return total + (Number.isFinite(numericValue) ? numericValue : 0)
  }, 0)

  return {
    active,
    upcoming,
    drafts,
    totalPrizePool: `SAR ${totalPrizePool.toLocaleString('en-US')}`,
  }
}

export function validateCompetitionForm(form) {
  if (!form.title.trim() || !form.organizer.trim() || !form.startDate || !form.endDate) {
    return 'Title, organizer, start date, and end date are required.'
  }

  if (form.registrationDeadline && form.startDate && form.registrationDeadline > form.startDate) {
    return 'Registration deadline should be on or before the start date.'
  }

  if (form.endDate < form.startDate) {
    return 'End date must be on or after the start date.'
  }

  return ''
}
