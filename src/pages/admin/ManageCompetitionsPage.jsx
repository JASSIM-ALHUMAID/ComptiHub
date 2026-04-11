import { useEffect, useState } from 'react'
import Button from '../../components/ui/Button'
import Input from '../../components/ui/Input'
import { competitionAdminService } from '../../features/admin/services/competitionAdminService'

export default function ManageCompetitionsPage() {
  const [competitions, setCompetitions] = useState([])
  const [form, setForm] = useState({
    title: '',
    description: '',
  })

  function load() {
    setCompetitions(competitionAdminService.getAll())
  }

  useEffect(() => {
    load()
  }, [])

  function handleChange(e) {
    const { name, value } = e.target
    setForm((f) => ({ ...f, [name]: value }))
  }

  function handleCreate(e) {
    e.preventDefault()

    if (!form.title) return

    competitionAdminService.create(form)
    setForm({ title: '', description: '' })
    load()
  }

  function handleDelete(id) {
    competitionAdminService.delete(id)
    load()
  }

  return (
    <main className="space-y-6">
      <h1 className="text-2xl">Manage Competitions</h1>

      {/* CREATE */}
      <form onSubmit={handleCreate} className="space-y-3">
        <Input
          name="title"
          placeholder="Competition Title"
          value={form.title}
          onChange={handleChange}
        />
        <Input
          name="description"
          placeholder="Description"
          value={form.description}
          onChange={handleChange}
        />
        <Button type="submit" size="nav">
          Create
        </Button>
      </form>

      {/* LIST */}
      <div className="space-y-3">
        {competitions.map((c) => (
          <div
            key={c.id}
            className="border p-4 rounded-xl flex justify-between"
          >
            <div>
              <p className="font-bold">{c.title}</p>
              <p className="text-sm">{c.description}</p>
            </div>

            <Button
              variant="secondary"
              size="nav"
              onClick={() => handleDelete(c.id)}
            >
              Delete
            </Button>
          </div>
        ))}
      </div>
    </main>
  )
}