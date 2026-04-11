import { storage } from '../../../lib/utils/storage'

const KEY = 'compitihub.admin.competitions'

function read() {
  const data = storage.get(KEY)
  return data ? JSON.parse(data) : []
}

function write(data) {
  storage.set(KEY, JSON.stringify(data))
}

function createId() {
  return crypto.randomUUID()
}

export const competitionAdminService = {
  getAll() {
    return read()
  },

  create(competition) {
    const list = read()

    const newCompetition = {
      id: createId(),
      ...competition,
    }

    list.push(newCompetition)
    write(list)

    return newCompetition
  },

  update(id, updated) {
    const list = read()

    const next = list.map((c) =>
      c.id === id ? { ...c, ...updated } : c
    )

    write(next)
  },

  delete(id) {
    const list = read().filter((c) => c.id !== id)
    write(list)
  },
}