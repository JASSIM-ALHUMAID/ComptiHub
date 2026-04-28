import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import Alert from '../../components/ui/Alert'
import Button from '../../components/ui/Button'
import Input from '../../components/ui/Input'
import Select from '../../components/ui/Select'
import { competitionService } from '../../features/competitions/services/competitionService'
import { teamService } from '../../features/teams/services/teamService'
import { routes } from '../../lib/constants/routes'

const initialForm = {
  name: '',
  competitionId: '',
  description: '',
  totalSlots: '3',
  requiredSkills: '',
}

export default function CreateTeamPage() {
  const navigate = useNavigate()
  const [competitions, setCompetitions] = useState([])
  const [form, setForm] = useState(initialForm)
  const [submissionState, setSubmissionState] = useState('idle')
  const [error, setError] = useState('')

  useEffect(() => {
    let isCancelled = false

    async function loadCompetitions() {
      try {
        const nextCompetitions = await competitionService.listCompetitions({
          status: 'open',
          sortBy: 'deadline',
          sortOrder: 'asc',
        })

        if (!isCancelled) {
          setCompetitions(nextCompetitions)
        }
      } catch (loadError) {
        if (!isCancelled) {
          setError(loadError.message || 'Unable to load open competitions.')
        }
      }
    }

    loadCompetitions()

    return () => {
      isCancelled = true
    }
  }, [])

  function updateField(event) {
    const { name, value } = event.target
    setForm((currentForm) => ({ ...currentForm, [name]: value }))
  }

  async function handleSubmit(event) {
    event.preventDefault()
    setError('')

    try {
      await teamService.createTeam(form)
      setSubmissionState('submitted')
    } catch (submissionError) {
      setError(submissionError.message || 'Unable to create team.')
    }
  }

  function resetForm() {
    setForm(initialForm)
    setSubmissionState('idle')
    setError('')
  }

  const openComps = competitions.filter((competition) => competition.status === 'open')
  const selectedCompetition = openComps.find((competition) => competition.id === form.competitionId)

  return (
    <main className="space-y-6">
      <header className="space-y-2">
        <p className="landing-label text-[0.68rem] text-[rgba(250,204,21,0.82)]">Team Leader</p>
        <h1 className="landing-title text-3xl text-(--landing-text)">Create Team</h1>
        <p className="landing-copy text-sm text-[rgba(226,226,232,0.65)]">Set up a new team and start recruiting the right people.</p>
      </header>

      {submissionState === 'submitted' ? (
        <div className="space-y-5 rounded-[1.75rem] border border-[rgba(77,70,50,0.22)] bg-[rgba(12,14,18,0.48)] p-5 sm:p-6">
          <Alert
            variant="info"
            title="Team created"
            message="Your team is now active and available from My Teams."
          />

          <div className="grid gap-4 rounded-[1.5rem] border border-[rgba(77,70,50,0.18)] bg-[rgba(17,19,23,0.5)] p-4 sm:grid-cols-2">
            <div>
              <p className="landing-ui-text text-[0.68rem] text-[rgba(226,226,232,0.45)]">Team name</p>
              <p className="mt-2 text-sm font-semibold text-(--landing-text)">{form.name}</p>
            </div>
            <div>
              <p className="landing-ui-text text-[0.68rem] text-[rgba(226,226,232,0.45)]">Competition</p>
              <p className="mt-2 text-sm font-semibold text-(--landing-text)">{selectedCompetition?.title ?? 'Not selected'}</p>
            </div>
          </div>

          <div className="flex flex-col gap-3 pt-1 sm:flex-row">
            <Button type="button" size="nav" onClick={() => navigate(routes.teams)}>
              Back to My Teams
            </Button>
            <Button type="button" variant="secondary" size="nav" onClick={resetForm}>
              Create Another Team
            </Button>
          </div>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-5 rounded-[1.75rem] border border-[rgba(77,70,50,0.22)] bg-[rgba(12,14,18,0.48)] p-5">
          {error ? <Alert variant="error" title="Unable to create team" message={error} /> : null}

          <div className="space-y-2">
            <label className="landing-ui-text block text-[0.74rem] text-(--landing-text)" htmlFor="name">Team Name</label>
            <Input id="name" name="name" placeholder="e.g. ByteForge" value={form.name} onChange={updateField} required />
          </div>
          <div className="space-y-2">
            <label className="landing-ui-text block text-[0.74rem] text-(--landing-text)" htmlFor="competitionId">Competition</label>
            <Select id="competitionId" name="competitionId" value={form.competitionId} onChange={updateField} required>
              <option value="">Select a competition...</option>
              {openComps.map((competition) => <option key={competition.id} value={competition.id}>{competition.title}</option>)}
            </Select>
          </div>
          <div className="space-y-2">
            <label className="landing-ui-text block text-[0.74rem] text-(--landing-text)" htmlFor="description">Description</label>
            <textarea
              id="description"
              name="description"
              value={form.description}
              onChange={updateField}
              required
              rows={4}
              placeholder="Describe your team and what you're looking for..."
              className="w-full resize-none rounded-2xl border border-[rgba(77,70,50,0.35)] bg-[rgba(12,14,18,0.78)] px-4 py-3 text-sm text-(--landing-text) placeholder:text-[rgba(226,226,232,0.4)] focus:border-(--landing-gold) focus:outline-none focus:ring-2 focus:ring-[rgba(250,204,21,0.2)]"
            />
          </div>
          <div className="space-y-2">
            <label className="landing-ui-text block text-[0.74rem] text-(--landing-text)" htmlFor="totalSlots">Total Team Size</label>
            <Select id="totalSlots" name="totalSlots" value={form.totalSlots} onChange={updateField}>
              {['1', '2', '3', '4', '5', '6'].map((size) => <option key={size} value={size}>{size} members</option>)}
            </Select>
          </div>
          <div className="space-y-2">
            <label className="landing-ui-text block text-[0.74rem] text-(--landing-text)" htmlFor="requiredSkills">Required Skills</label>
            <Input id="requiredSkills" name="requiredSkills" placeholder="e.g. React, Python, UI/UX (comma separated)" value={form.requiredSkills} onChange={updateField} />
          </div>
          <div className="flex flex-col gap-3 pt-2 sm:flex-row">
            <Button type="submit" size="nav">Create Team</Button>
            <Button as={Link} to={routes.teams} variant="secondary" size="nav">
              Cancel
            </Button>
          </div>
        </form>
      )}
    </main>
  )
}
