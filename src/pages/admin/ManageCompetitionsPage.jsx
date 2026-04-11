import { useState } from 'react'
import Button from '../../components/ui/Button'
import Input from '../../components/ui/Input'
import { competitions as initialCompetitions } from '../../data/mocks/competitions'

export default function ManageCompetitionsPage() {
  const [competitions, setCompetitions] = useState(initialCompetitions)

  const [form, setForm] = useState({
    title: '',
    organizer: '',
    category: '',
    mode: '',
    teamSize: '',
    deadline: '',
    prize: '',
    description: '',
  })

  function handleChange(e) {
    const { name, value } = e.target
    setForm((f) => ({ ...f, [name]: value }))
  }

  function handleCreate(e) {
    e.preventDefault()
    if (!form.title) return

    const newComp = {
      id: `comp-${Date.now()}`,
      status: 'open',
      tags: [],
      requirements: [],
      ...form,
    }

    setCompetitions((prev) => [...prev, newComp])

    setForm({
      title: '',
      organizer: '',
      category: '',
      mode: '',
      teamSize: '',
      deadline: '',
      prize: '',
      description: '',
    })
  }

  function handleDelete(id) {
    setCompetitions((prev) => prev.filter((c) => c.id !== id))
  }

  return (
    <main className="space-y-6">
      <h1 className="landing-title text-2xl">Competitions</h1>

      <form onSubmit={handleCreate} className="space-y-3">
        <Input name="title" placeholder="Title" value={form.title} onChange={handleChange} />
        <Input name="organizer" placeholder="Organizer" value={form.organizer} onChange={handleChange} />
        <Input name="category" placeholder="Category" value={form.category} onChange={handleChange} />
        <Input name="mode" placeholder="Mode" value={form.mode} onChange={handleChange} />
        <Input name="teamSize" placeholder="Team Size" value={form.teamSize} onChange={handleChange} />
        <Input name="deadline" type="date" value={form.deadline} onChange={handleChange} />
        <Input name="prize" placeholder="Prize" value={form.prize} onChange={handleChange} />
        <Input name="description" placeholder="Description" value={form.description} onChange={handleChange} />

        <Button type="submit" size="nav">Create</Button>
      </form>

      <div className="space-y-4">
        {competitions.map((c) => (
          <div key={c.id} className="rounded-[1.75rem] border border-[rgba(77,70,50,0.22)] bg-[rgba(12,14,18,0.48)] p-5">
            <p className="font-semibold">{c.title}</p>
            <p className="text-sm">{c.description}</p>

            <div className="text-xs text-[rgba(226,226,232,0.6)] mt-2 space-y-1">
              <p>Organizer: {c.organizer}</p>
              <p>Category: {c.category}</p>
              <p>Mode: {c.mode}</p>
              <p>Team Size: {c.teamSize}</p>
              <p>Deadline: {c.deadline}</p>
              <p>Prize: {c.prize}</p>
              <p>Status: {c.status}</p>
            </div>

            <Button size="nav" variant="secondary" onClick={() => handleDelete(c.id)}>
              Delete
            </Button>
          </div>
        ))}
      </div>
    </main>
  )
}