import { useEffect, useMemo, useState } from 'react'
import Button from '../../components/ui/Button'
import Input from '../../components/ui/Input'
import { competitionAdminService } from '../../features/admin/services/competitionAdminService'

const initialForm = {
  title: '',
  organizer: '',
  category: '',
  mode: '',
  teamSize: '',
  maxTeamSize: '',
  deadline: '',
  prize: '',
  description: '',
}

export default function ManageCompetitionsPage() {
  const [competitions, setCompetitions] = useState([])
  const [editingId, setEditingId] = useState(null)
  const [form, setForm] = useState(initialForm)
  const [error, setError] = useState('')

  useEffect(() => {
    setCompetitions(competitionAdminService.getCompetitions())
  }, [])

  const submitLabel = useMemo(() => (editingId ? 'Update' : 'Create'), [editingId])

  function reload() {
    setCompetitions(competitionAdminService.getCompetitions())
  }

  function handleChange(event) {
    const { name, value } = event.target
    setForm((currentForm) => ({
      ...currentForm,
      [name]: value,
    }))
  }

  function resetForm() {
    setForm(initialForm)
    setEditingId(null)
    setError('')
  }

  function validateForm() {
    if (!form.title.trim()) {
      return 'Title is required.'
    }

    if (!form.maxTeamSize || Number(form.maxTeamSize) < 1) {
      return 'Max team size must be at least 1.'
    }

    return ''
  }

  function handleSubmit(event) {
    event.preventDefault()

    const validationError = validateForm()

    if (validationError) {
      setError(validationError)
      return
    }

    const payload = {
      ...form,
      maxTeamSize: Number(form.maxTeamSize),
      status: 'open',
    }

    if (editingId) {
      competitionAdminService.updateCompetition(editingId, payload)
    } else {
      competitionAdminService.createCompetition(payload)
    }

    reload()
    resetForm()
  }

  function handleEdit(competition) {
    setEditingId(competition.id)
    setForm({
      title: competition.title || '',
      organizer: competition.organizer || '',
      category: competition.category || '',
      mode: competition.mode || '',
      teamSize: competition.teamSize || '',
      maxTeamSize: competition.maxTeamSize || '',
      deadline: competition.deadline || '',
      prize: competition.prize || '',
      description: competition.description || '',
    })
    setError('')
  }

  function handleDelete(id) {
    competitionAdminService.deleteCompetition(id)
    reload()

    if (editingId === id) {
      resetForm()
    }
  }

  return (
    <main className="space-y-6">
      <header className="space-y-2">
        <p className="landing-label text-[0.68rem] text-[rgba(250,204,21,0.82)]">Admin</p>
        <h1 className="landing-title text-3xl text-(--landing-text)">Competitions</h1>
      </header>

      <form onSubmit={handleSubmit} className="grid gap-3 sm:grid-cols-2">
        <Input name="title" placeholder="Title" value={form.title} onChange={handleChange} />
        <Input name="organizer" placeholder="Organizer" value={form.organizer} onChange={handleChange} />
        <Input name="category" placeholder="Category" value={form.category} onChange={handleChange} />
        <Input name="mode" placeholder="Mode" value={form.mode} onChange={handleChange} />
        <Input name="teamSize" placeholder="Team Size" value={form.teamSize} onChange={handleChange} />
        <Input name="maxTeamSize" type="number" min="1" placeholder="Max Team Size" value={form.maxTeamSize} onChange={handleChange} />
        <Input name="deadline" type="date" value={form.deadline} onChange={handleChange} />
        <Input name="prize" placeholder="Prize" value={form.prize} onChange={handleChange} />

        <div className="sm:col-span-2">
          <Input name="description" placeholder="Description" value={form.description} onChange={handleChange} />
        </div>

        {error ? (
          <p className="sm:col-span-2 rounded-2xl border border-[rgba(255,180,171,0.25)] bg-[rgba(255,180,171,0.08)] px-4 py-3 text-sm text-(--landing-danger)">
            {error}
          </p>
        ) : null}

        <div className="flex gap-3 sm:col-span-2">
          <Button type="submit" size="nav">
            {submitLabel}
          </Button>

          {editingId ? (
            <Button type="button" size="nav" variant="secondary" onClick={resetForm}>
              Cancel
            </Button>
          ) : null}
        </div>
      </form>

      <div className="space-y-4">
        {competitions.map((competition) => (
          <div
            key={competition.id}
            className="rounded-[1.75rem] border border-[rgba(77,70,50,0.22)] bg-[rgba(12,14,18,0.48)] p-5"
          >
            <p className="text-lg font-semibold">{competition.title}</p>
            <p className="mt-2 text-sm text-[rgba(226,226,232,0.72)]">{competition.description}</p>

            <div className="mt-4 grid gap-2 text-xs text-[rgba(226,226,232,0.6)] sm:grid-cols-2">
              <p>Organizer: {competition.organizer}</p>
              <p>Category: {competition.category}</p>
              <p>Mode: {competition.mode}</p>
              <p>Team Size: {competition.teamSize}</p>
              <p>Max Team Size: {competition.maxTeamSize}</p>
              <p>Deadline: {competition.deadline}</p>
              <p>Prize: {competition.prize}</p>
              <p>Status: {competition.status}</p>
            </div>

            <div className="mt-4 flex gap-2">
              <Button size="nav" onClick={() => handleEdit(competition)}>
                Edit
              </Button>
              <Button size="nav" variant="secondary" onClick={() => handleDelete(competition.id)}>
                Delete
              </Button>
            </div>
          </div>
        ))}
      </div>
    </main>
  )
}