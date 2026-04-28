import { notFound } from '../../utils/apiError.js'
import { Competition } from './competition.model.js'
import { seededCompetitions } from './competition.seeds.js'

function normalizeLinks(links) {
  if (Array.isArray(links)) {
    return links.map((link) => link.trim()).filter(Boolean)
  }

  if (typeof links === 'string') {
    return links
      .split(/[\n,]/)
      .map((link) => link.trim())
      .filter(Boolean)
  }

  return []
}

function normalizeStringList(items = []) {
  const unique = []
  const seen = new Set()

  items.forEach((item) => {
    const value = item.trim()
    if (!value) return
    const key = value.toLowerCase()
    if (seen.has(key)) return
    seen.add(key)
    unique.push(value)
  })

  return unique
}

function normalizeCompetitionInput(input, createdBy = undefined) {
  const registrationDeadline = input.registrationDeadline ?? input.deadline

  return {
    ...(input.title !== undefined ? { title: input.title.trim() } : {}),
    ...(input.organizer !== undefined ? { organizer: input.organizer.trim() } : {}),
    ...(input.category !== undefined ? { category: input.category.trim() } : {}),
    ...(input.mode !== undefined ? { mode: input.mode.trim() } : {}),
    ...(input.teamSize !== undefined ? { teamSize: input.teamSize.trim() } : {}),
    ...(registrationDeadline !== undefined ? { registrationDeadline: registrationDeadline.trim() } : {}),
    ...(registrationDeadline !== undefined ? { deadline: registrationDeadline.trim() } : {}),
    ...(input.status !== undefined ? { status: input.status } : {}),
    ...(input.prize !== undefined ? { prize: input.prize.trim() } : {}),
    ...(input.description !== undefined ? { description: input.description.trim() } : {}),
    ...(input.requirements !== undefined ? { requirements: normalizeStringList(input.requirements) } : {}),
    ...(input.tags !== undefined ? { tags: normalizeStringList(input.tags) } : {}),
    ...(input.links !== undefined ? { links: normalizeLinks(input.links) } : {}),
    ...(input.startDate !== undefined ? { startDate: input.startDate.trim() } : {}),
    ...(input.endDate !== undefined ? { endDate: input.endDate.trim() } : {}),
    ...(input.participationType !== undefined ? { participationType: input.participationType } : {}),
    ...(createdBy !== undefined ? { createdBy } : {}),
  }
}

function toCompetitionDto(competition) {
  return {
    id: competition._id,
    _id: competition._id,
    title: competition.title,
    organizer: competition.organizer,
    category: competition.category,
    mode: competition.mode,
    teamSize: competition.teamSize,
    deadline: competition.deadline,
    status: competition.status,
    prize: competition.prize,
    description: competition.description,
    requirements: competition.requirements,
    tags: competition.tags,
    links: competition.links,
    startDate: competition.startDate,
    endDate: competition.endDate,
    registrationDeadline: competition.registrationDeadline,
    participationType: competition.participationType,
    createdBy: competition.createdBy ? competition.createdBy.toString() : null,
    createdAt: competition.createdAt,
    updatedAt: competition.updatedAt,
  }
}

async function ensureSeedCompetitions() {
  const count = await Competition.countDocuments()
  if (count > 0) {
    return
  }

  await Competition.insertMany(seededCompetitions)
}

function buildCompetitionQuery({ scope = 'public', search, category, status }) {
  const query = {}

  if (scope === 'public') {
    query.status = 'open'
    if (status && status !== 'open') {
      return { impossible: true }
    }
  } else if (status) {
    query.status = status
  }

  if (category) {
    query.category = category
  }

  if (search) {
    query.$or = [
      { title: { $regex: search, $options: 'i' } },
      { organizer: { $regex: search, $options: 'i' } },
    ]
  }

  return query
}

function buildSort({ sortBy, sortOrder }, scope = 'public') {
  const direction = sortOrder === 'desc' ? -1 : 1

  if (sortBy === 'createdAt') {
    return { createdAt: direction, _id: 1 }
  }

  if (sortBy === 'deadline') {
    return { deadline: direction, _id: 1 }
  }

  return scope === 'public' ? { deadline: 1, _id: 1 } : { createdAt: -1, _id: 1 }
}

function generateCompetitionId() {
  return `COMP-${Math.floor(1000 + Math.random() * 9000)}`
}

export async function listPublicCompetitions(filters) {
  await ensureSeedCompetitions()
  const query = buildCompetitionQuery({ scope: 'public', ...filters })

  if (query.impossible) {
    return []
  }

  const competitions = await Competition.find(query).sort(buildSort(filters, 'public'))
  return competitions.map(toCompetitionDto)
}

export async function getPublicCompetitionById(id) {
  await ensureSeedCompetitions()
  const competition = await Competition.findOne({ _id: id, status: 'open' })

  if (!competition) {
    throw notFound('Competition not found.')
  }

  return toCompetitionDto(competition)
}

export async function listAdminCompetitions(filters) {
  await ensureSeedCompetitions()
  const query = buildCompetitionQuery({ scope: 'admin', ...filters })
  const competitions = await Competition.find(query).sort(buildSort(filters, 'admin'))
  return competitions.map(toCompetitionDto)
}

export async function createCompetition(input, createdBy) {
  await ensureSeedCompetitions()
  const competition = await Competition.create({
    _id: generateCompetitionId(),
    ...normalizeCompetitionInput(input, createdBy),
  })

  return toCompetitionDto(competition)
}

export async function updateCompetition(id, input) {
  await ensureSeedCompetitions()
  const updates = normalizeCompetitionInput(input)
  const competition = await Competition.findByIdAndUpdate(id, updates, { new: true, runValidators: true })

  if (!competition) {
    throw notFound('Competition not found.')
  }

  return toCompetitionDto(competition)
}

export async function deleteCompetition(id) {
  await ensureSeedCompetitions()
  const competition = await Competition.findByIdAndDelete(id)

  if (!competition) {
    throw notFound('Competition not found.')
  }
}
