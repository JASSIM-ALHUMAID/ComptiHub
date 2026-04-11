import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import Button from '../../components/ui/Button'
import Input from '../../components/ui/Input'
import Select from '../../components/ui/Select'
import { competitions } from '../../data/mocks/competitions'
import { routes } from '../../lib/constants/routes'

export default function CreateTeamPage() {
  const navigate = useNavigate()
  const [form, setForm] = useState({ name: '', competitionId: '', description: '', totalSlots: '3', requiredSkills: '' })
  const [submitted, setSubmitted] = useState(false)

  function updateField(e) {
    const { name, value } = e.target
    setForm((f) => ({ ...f, [name]: value }))
  }

  function handleSubmit(e) {
    e.preventDefault()
    setSubmitted(true)
    setTimeout(() => navigate(routes.teams), 1500)
  }

  const openComps = competitions.filter((c) => c.status === 'open')

  return (
    <main className="space-y-6">
      <header className="space-y-2">
        <p className="landing-label text-[0.68rem] text-[rgba(250,204,21,0.82)]">Team Leader</p>
        <h1 className="landing-title text-3xl text-(--landing-text)">Create Team</h1>
        <p className="landing-copy text-sm text-[rgba(226,226,232,0.65)]">Set up a new team and start recruiting the right people.</p>
      </header>

      {submitted ? (
        <div className="rounded-[1.5rem] border border-green-500/30 bg-green-500/10 p-6 text-center">
          <p className="text-sm font-semibold text-green-400">✓ Team created! Redirecting to teams…</p>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-5 rounded-[1.75rem] border border-[rgba(77,70,50,0.22)] bg-[rgba(12,14,18,0.48)] p-5">
          <div className="space-y-2">
            <label className="landing-ui-text block text-[0.74rem] text-(--landing-text)" htmlFor="name">Team Name</label>
            <Input id="name" name="name" placeholder="e.g. ByteForge" value={form.name} onChange={updateField} required />
          </div>
          <div className="space-y-2">
            <label className="landing-ui-text block text-[0.74rem] text-(--landing-text)" htmlFor="competitionId">Competition</label>
            <Select id="competitionId" name="competitionId" value={form.competitionId} onChange={updateField} required>
              <option value="">Select a competition…</option>
              {openComps.map((c) => <option key={c.id} value={c.id}>{c.title}</option>)}
            </Select>
          </div>
          <div className="space-y-2">
            <label className="landing-ui-text block text-[0.74rem] text-(--landing-text)" htmlFor="description">Description</label>
            <textarea id="description" name="description" value={form.description} onChange={updateField} required rows={4} placeholder="Describe your team and what you're looking for…" className="w-full resize-none rounded-2xl border border-[rgba(77,70,50,0.35)] bg-[rgba(12,14,18,0.78)] px-4 py-3 text-sm text-(--landing-text) placeholder:text-[rgba(226,226,232,0.4)] focus:border-(--landing-gold) focus:outline-none focus:ring-2 focus:ring-[rgba(250,204,21,0.2)]" />
          </div>
          <div className="space-y-2">
            <label className="landing-ui-text block text-[0.74rem] text-(--landing-text)" htmlFor="totalSlots">Total Team Size</label>
            <Select id="totalSlots" name="totalSlots" value={form.totalSlots} onChange={updateField}>
              {['2','3','4','5','6'].map((n) => <option key={n} value={n}>{n} members</option>)}
            </Select>
          </div>
          <div className="space-y-2">
            <label className="landing-ui-text block text-[0.74rem] text-(--landing-text)" htmlFor="requiredSkills">Required Skills</label>
            <Input id="requiredSkills" name="requiredSkills" placeholder="e.g. React, Python, UI/UX (comma separated)" value={form.requiredSkills} onChange={updateField} />
          </div>
          <div className="flex flex-col gap-3 pt-2 sm:flex-row">
            <Button type="submit" size="nav">Create Team</Button>
            <Link to={routes.teams} className="inline-flex items-center justify-center rounded-full border border-[rgba(77,70,50,0.28)] px-6 py-3 text-sm font-semibold text-[rgba(226,226,232,0.76)] transition-colors duration-200 hover:border-(--landing-gold) hover:text-(--landing-gold-soft)">Cancel</Link>
          </div>
        </form>
      )}
    </main>
  )
}