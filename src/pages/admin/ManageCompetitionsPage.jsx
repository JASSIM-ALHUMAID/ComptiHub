import {
  CalendarDays,
  CirclePlus,
  ExternalLink,
  FileDown,
  Pencil,
  Search,
  Settings2,
  ShieldCheck,
  Trash2,
  Trophy,
  X,
} from 'lucide-react'
import { useMemo, useState } from 'react'
import Button from '../../components/ui/Button'
import Input from '../../components/ui/Input'
import Modal from '../../components/ui/Modal'
import Select from '../../components/ui/Select'
import { adminCompetitions as seededCompetitions } from '../../data/mocks/adminCompetitions'

const initialForm = {
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

function formatDisplayDate(value) {
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

function getStatusClasses(status) {
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

function buildCompetitionFromForm(form, existingCompetition = null) {
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

function CompetitionEditorModal({
  form,
  formError,
  isEditing,
  onChange,
  onClose,
  onSubmit,
  open,
}) {
  return (
    <Modal
      aria-describedby="competition-editor-description"
      aria-labelledby="competition-editor-title"
      open={open}
      onClose={onClose}
      onBackdropClick={onClose}
      className="bg-[rgba(12,14,18,0.74)] backdrop-blur-sm"
    >
      <div className="flex min-h-screen items-stretch justify-end">
        <section className="flex h-screen w-full max-w-3xl flex-col border-l border-[rgba(77,70,50,0.24)] bg-[rgba(17,19,23,0.98)] shadow-[0_24px_80px_rgba(0,0,0,0.42)]">
          <div className="flex items-start justify-between gap-4 border-b border-[rgba(77,70,50,0.18)] p-6 sm:p-8">
            <div className="space-y-2">
              <p className="admin-ui-text text-[0.68rem] text-[rgba(250,204,21,0.78)]">Action editor</p>
              <h2 className="admin-title text-2xl text-[var(--admin-text)] sm:text-3xl" id="competition-editor-title">
                {isEditing ? 'Edit Competition' : 'Create Competition'}
              </h2>
              <p className="text-sm leading-6 text-[rgba(209,198,171,0.72)]" id="competition-editor-description">
                Review the required fields, then publish changes from the same admin workspace.
              </p>
            </div>
            <button
              aria-label="Close competition editor"
              className="rounded-full border border-[rgba(77,70,50,0.24)] p-3 text-[rgba(209,198,171,0.76)] transition-colors duration-200 hover:border-[rgba(250,204,21,0.3)] hover:text-[var(--admin-gold-soft)]"
              type="button"
              onClick={onClose}
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          <form className="flex min-h-0 flex-1 flex-col" onSubmit={onSubmit}>
            <div className="grid flex-1 gap-6 overflow-y-auto p-6 sm:p-8">
              <label className="space-y-2">
                <span className="admin-ui-text text-[0.68rem] text-[rgba(209,198,171,0.76)]">Competition title</span>
                <Input
                  name="title"
                  placeholder="e.g. Global Cyber-Strike 2027"
                  value={form.title}
                  onChange={onChange}
                />
              </label>

              <div className="grid gap-6 md:grid-cols-2">
                <label className="space-y-2">
                  <span className="admin-ui-text text-[0.68rem] text-[rgba(209,198,171,0.76)]">Organizer</span>
                  <Input
                    name="organizer"
                    placeholder="KFUPM, ACM, Ministry, Club..."
                    value={form.organizer}
                    onChange={onChange}
                  />
                </label>

                <label className="space-y-2">
                  <span className="admin-ui-text text-[0.68rem] text-[rgba(209,198,171,0.76)]">Status</span>
                  <Select name="status" value={form.status} onChange={onChange}>
                    <option value="draft">Draft</option>
                    <option value="upcoming">Upcoming</option>
                    <option value="active">Active</option>
                    <option value="ended">Ended</option>
                  </Select>
                </label>
              </div>

              <label className="space-y-2">
                <span className="admin-ui-text text-[0.68rem] text-[rgba(209,198,171,0.76)]">External link</span>
                <Input
                  name="links"
                  placeholder="https://compitihub.local/resources"
                  type="url"
                  value={form.links}
                  onChange={onChange}
                />
              </label>

              <div className="grid gap-6 md:grid-cols-3">
                <label className="space-y-2">
                  <span className="admin-ui-text text-[0.68rem] text-[rgba(209,198,171,0.76)]">Start date</span>
                  <Input name="startDate" type="date" value={form.startDate} onChange={onChange} />
                </label>

                <label className="space-y-2">
                  <span className="admin-ui-text text-[0.68rem] text-[rgba(209,198,171,0.76)]">End date</span>
                  <Input name="endDate" type="date" value={form.endDate} onChange={onChange} />
                </label>

                <label className="space-y-2">
                  <span className="admin-ui-text text-[0.68rem] text-[rgba(209,198,171,0.76)]">Registration deadline</span>
                  <Input
                    name="registrationDeadline"
                    type="date"
                    value={form.registrationDeadline}
                    onChange={onChange}
                  />
                </label>
              </div>

              <label className="space-y-2">
                <span className="admin-ui-text text-[0.68rem] text-[rgba(209,198,171,0.76)]">Prize pool</span>
                <Input
                  name="prizePool"
                  placeholder="SAR 25,000"
                  value={form.prizePool}
                  onChange={onChange}
                />
              </label>

              <label className="space-y-2">
                <span className="admin-ui-text text-[0.68rem] text-[rgba(209,198,171,0.76)]">Description</span>
                <textarea
                  className="min-h-44 w-full rounded-[1.4rem] border border-[rgba(77,70,50,0.35)] bg-[rgba(12,14,18,0.78)] px-4 py-3 text-[var(--admin-text)] shadow-[inset_0_1px_0_rgba(255,255,255,0.04)] transition-colors duration-200 placeholder:text-[rgba(226,226,232,0.45)] focus:border-[var(--admin-gold)] focus:outline-none focus:ring-2 focus:ring-[rgba(250,204,21,0.2)]"
                  maxLength={2000}
                  name="description"
                  placeholder="Detailed competition summary, requirements, and operational notes..."
                  value={form.description}
                  onChange={onChange}
                />
                <div className="flex items-center justify-between gap-4 text-xs text-[rgba(209,198,171,0.62)]">
                  <span>{formError || 'Fill enough metadata so admins can publish or revise confidently.'}</span>
                  <span>{form.description.length} / 2000</span>
                </div>
              </label>
            </div>

            <div className="flex flex-col gap-3 border-t border-[rgba(77,70,50,0.18)] bg-[rgba(12,14,18,0.84)] p-6 sm:flex-row sm:justify-end sm:p-8">
              <Button
                className="min-w-40 justify-center"
                size="nav"
                type="button"
                variant="secondary"
                onClick={onClose}
              >
                Cancel
              </Button>
              <Button className="min-w-52 justify-center" size="nav" type="submit">
                {isEditing ? 'Publish Updates' : 'Create Competition'}
              </Button>
            </div>
          </form>
        </section>
      </div>
    </Modal>
  )
}

export default function ManageCompetitionsPage() {
  const [competitions, setCompetitions] = useState(seededCompetitions)
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [isEditorOpen, setIsEditorOpen] = useState(false)
  const [editingCompetitionId, setEditingCompetitionId] = useState(null)
  const [form, setForm] = useState(initialForm)
  const [formError, setFormError] = useState('')

  const filteredCompetitions = useMemo(() => {
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
  }, [competitions, search, statusFilter])

  const stats = useMemo(() => {
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
  }, [competitions])

  function openCreateModal() {
    setEditingCompetitionId(null)
    setForm(initialForm)
    setFormError('')
    setIsEditorOpen(true)
  }

  function openEditModal(competition) {
    setEditingCompetitionId(competition.id)
    setForm({
      id: competition.id,
      title: competition.title,
      organizer: competition.organizer,
      links: competition.links,
      startDate: competition.startDate,
      endDate: competition.endDate,
      registrationDeadline: competition.registrationDeadline,
      status: competition.status,
      prizePool: competition.prizePool,
      description: competition.description,
    })
    setFormError('')
    setIsEditorOpen(true)
  }

  function closeEditor() {
    setIsEditorOpen(false)
  }

  function handleFormChange(event) {
    const { name, value } = event.target
    setForm((currentForm) => ({ ...currentForm, [name]: value }))
    setFormError('')
  }

  function handleDeleteCompetition(competitionId) {
    setCompetitions((currentCompetitions) =>
      currentCompetitions.filter((competition) => competition.id !== competitionId),
    )

    if (editingCompetitionId === competitionId) {
      closeEditor()
    }
  }

  function handleSubmit(event) {
    event.preventDefault()

    if (!form.title.trim() || !form.organizer.trim() || !form.startDate || !form.endDate) {
      setFormError('Title, organizer, start date, and end date are required.')
      return
    }

    if (form.registrationDeadline && form.startDate && form.registrationDeadline > form.startDate) {
      setFormError('Registration deadline should be on or before the start date.')
      return
    }

    if (form.endDate < form.startDate) {
      setFormError('End date must be on or after the start date.')
      return
    }

    const existingCompetition = competitions.find((competition) => competition.id === editingCompetitionId) || null
    const nextCompetition = buildCompetitionFromForm(form, existingCompetition)

    setCompetitions((currentCompetitions) => {
      if (!existingCompetition) {
        return [nextCompetition, ...currentCompetitions]
      }

      return currentCompetitions.map((competition) =>
        competition.id === existingCompetition.id ? { ...competition, ...nextCompetition } : competition,
      )
    })

    closeEditor()
  }

  return (
    <>
      <main className="admin-page space-y-8">
        <header className="grid gap-6 rounded-[1.6rem] border border-[rgba(77,70,50,0.18)] bg-[linear-gradient(135deg,rgba(250,204,21,0.08),rgba(255,255,255,0.02))] p-6 xl:grid-cols-[minmax(0,1.3fr)_340px] xl:p-7">
          <div className="space-y-4">
            <p className="admin-ui-text text-[0.68rem] text-[rgba(250,204,21,0.82)]">System management</p>
            <div className="space-y-3">
              <h1 className="admin-display text-4xl leading-none text-[var(--admin-text)] sm:text-5xl xl:text-6xl">
                Competition dashboard
              </h1>
              <p className="max-w-3xl text-sm leading-7 text-[rgba(209,198,171,0.74)] sm:text-base">
                Manage the competition inventory from a single admin workspace with search, status filtering,
                and a dedicated create or edit drawer.
              </p>
            </div>
          </div>

          <div className="grid gap-4 rounded-[1.4rem] border border-[rgba(77,70,50,0.18)] bg-[rgba(12,14,18,0.62)] p-5">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="admin-ui-text text-[0.62rem] text-[rgba(250,204,21,0.76)]">Registry</p>
                <p className="mt-2 text-3xl font-black tracking-tight text-[var(--admin-text)]">
                  {competitions.length}
                </p>
                <p className="mt-1 text-sm text-[rgba(209,198,171,0.72)]">Competition records in the admin queue</p>
              </div>
              <div className="rounded-full bg-[rgba(250,204,21,0.08)] p-4 text-[var(--admin-gold)]">
                <Trophy className="h-6 w-6" />
              </div>
            </div>
            <Button className="w-full justify-center" size="nav" onClick={openCreateModal}>
              <CirclePlus className="mr-2 h-4 w-4" />
              Create new competition
            </Button>
          </div>
        </header>

        <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          <article className="rounded-[1.4rem] border border-[rgba(77,70,50,0.18)] bg-[rgba(17,19,23,0.9)] p-5">
            <p className="admin-ui-text text-[0.62rem] text-[rgba(209,198,171,0.66)]">Active</p>
            <p className="mt-3 text-3xl font-black text-[var(--admin-text)]">{stats.active}</p>
          </article>
          <article className="rounded-[1.4rem] border border-[rgba(77,70,50,0.18)] bg-[rgba(17,19,23,0.9)] p-5">
            <p className="admin-ui-text text-[0.62rem] text-[rgba(209,198,171,0.66)]">Upcoming</p>
            <p className="mt-3 text-3xl font-black text-[var(--admin-text)]">{stats.upcoming}</p>
          </article>
          <article className="rounded-[1.4rem] border border-[rgba(77,70,50,0.18)] bg-[rgba(17,19,23,0.9)] p-5">
            <p className="admin-ui-text text-[0.62rem] text-[rgba(209,198,171,0.66)]">Drafts</p>
            <p className="mt-3 text-3xl font-black text-[var(--admin-text)]">{stats.drafts}</p>
          </article>
          <article className="rounded-[1.4rem] border border-[rgba(77,70,50,0.18)] bg-[rgba(17,19,23,0.9)] p-5">
            <p className="admin-ui-text text-[0.62rem] text-[rgba(209,198,171,0.66)]">Prize pool</p>
            <p className="mt-3 text-2xl font-black text-[var(--admin-text)]">{stats.totalPrizePool}</p>
          </article>
        </section>

        <section className="space-y-6 rounded-[1.6rem] border border-[rgba(77,70,50,0.18)] bg-[rgba(12,14,18,0.72)] p-4 sm:p-6">
          <div className="flex flex-col gap-4 xl:flex-row xl:items-end xl:justify-between">
            <div className="space-y-2">
              <p className="admin-ui-text text-[0.68rem] text-[rgba(250,204,21,0.78)]">Registry controls</p>
              <h2 className="admin-title text-2xl text-[var(--admin-text)]">Manage competitions</h2>
            </div>

            <div className="grid gap-4 md:grid-cols-[minmax(0,320px)_220px_auto]">
              <label className="space-y-2">
                <span className="admin-ui-text text-[0.62rem] text-[rgba(209,198,171,0.7)]">Search</span>
                <div className="relative">
                  <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[rgba(209,198,171,0.52)]" />
                  <Input
                    className="pl-11"
                    placeholder="Search title, ID, organizer..."
                    value={search}
                    onChange={(event) => setSearch(event.target.value)}
                  />
                </div>
              </label>

              <label className="space-y-2">
                <span className="admin-ui-text text-[0.62rem] text-[rgba(209,198,171,0.7)]">Status filter</span>
                <Select value={statusFilter} onChange={(event) => setStatusFilter(event.target.value)}>
                  <option value="all">All statuses</option>
                  <option value="draft">Draft</option>
                  <option value="upcoming">Upcoming</option>
                  <option value="active">Active</option>
                  <option value="ended">Ended</option>
                </Select>
              </label>

              <Button className="self-end justify-center xl:min-w-44" size="nav" variant="secondary">
                <FileDown className="mr-2 h-4 w-4" />
                Export
              </Button>
            </div>
          </div>

          <div className="overflow-hidden rounded-[1.4rem] border border-[rgba(77,70,50,0.18)]">
            <div className="hidden overflow-x-auto xl:block">
              <table className="w-full min-w-[980px] border-collapse">
                <thead className="bg-[rgba(30,32,36,0.86)]">
                  <tr className="text-left">
                    <th className="px-6 py-5 text-[0.64rem] uppercase tracking-[0.18em] text-[var(--admin-gold-soft)]">
                      ID / Title
                    </th>
                    <th className="px-6 py-5 text-[0.64rem] uppercase tracking-[0.18em] text-[rgba(209,198,171,0.68)]">
                      Start / End
                    </th>
                    <th className="px-6 py-5 text-[0.64rem] uppercase tracking-[0.18em] text-[rgba(209,198,171,0.68)]">
                      Teams
                    </th>
                    <th className="px-6 py-5 text-[0.64rem] uppercase tracking-[0.18em] text-[rgba(209,198,171,0.68)]">
                      Deadline
                    </th>
                    <th className="px-6 py-5 text-[0.64rem] uppercase tracking-[0.18em] text-[rgba(209,198,171,0.68)]">
                      Status
                    </th>
                    <th className="px-6 py-5 text-right text-[0.64rem] uppercase tracking-[0.18em] text-[rgba(209,198,171,0.68)]">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[rgba(77,70,50,0.14)] bg-[rgba(17,19,23,0.9)]">
                  {filteredCompetitions.map((competition) => (
                    <tr key={competition.id} className="transition-colors duration-200 hover:bg-[rgba(255,255,255,0.03)]">
                      <td className="px-6 py-5">
                        <div className="space-y-1">
                          <p className="text-xs font-mono text-[rgba(209,198,171,0.48)]">{competition.id}</p>
                          <p className="text-sm font-bold uppercase tracking-[0.04em] text-[var(--admin-text)]">
                            {competition.title}
                          </p>
                          <p className="text-sm text-[rgba(209,198,171,0.68)]">{competition.organizer}</p>
                        </div>
                      </td>
                      <td className="px-6 py-5 text-sm text-[rgba(209,198,171,0.78)]">
                        <div className="space-y-1">
                          <p>S: {formatDisplayDate(competition.startDate)}</p>
                          <p>E: {formatDisplayDate(competition.endDate)}</p>
                        </div>
                      </td>
                      <td className="px-6 py-5">
                        <span className="inline-flex rounded-full border border-[rgba(77,70,50,0.2)] bg-[rgba(255,255,255,0.02)] px-3 py-1 text-xs font-semibold text-[var(--admin-text)]">
                          {String(competition.teamCount).padStart(2, '0')}
                        </span>
                      </td>
                      <td className="px-6 py-5 text-sm text-[rgba(209,198,171,0.78)]">
                        {formatDisplayDate(competition.registrationDeadline)}
                      </td>
                      <td className="px-6 py-5">
                        <span className={`inline-flex rounded-full border px-3 py-1 text-xs font-semibold uppercase tracking-[0.14em] ${getStatusClasses(competition.status)}`}>
                          {competition.status}
                        </span>
                      </td>
                      <td className="px-6 py-5">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            aria-label={`Edit ${competition.title}`}
                            className="rounded-full border border-[rgba(77,70,50,0.2)] p-2 text-[rgba(209,198,171,0.66)] transition-colors duration-200 hover:border-[rgba(250,204,21,0.3)] hover:text-[var(--admin-gold-soft)]"
                            type="button"
                            onClick={() => openEditModal(competition)}
                          >
                            <Pencil className="h-4 w-4" />
                          </button>
                          <button
                            aria-label={`Configure ${competition.title}`}
                            className="rounded-full border border-[rgba(77,70,50,0.2)] p-2 text-[rgba(209,198,171,0.66)] transition-colors duration-200 hover:border-[rgba(250,204,21,0.3)] hover:text-[var(--admin-gold-soft)]"
                            type="button"
                          >
                            <Settings2 className="h-4 w-4" />
                          </button>
                          <button
                            aria-label={`Delete ${competition.title}`}
                            className="rounded-full border border-[rgba(77,70,50,0.2)] p-2 text-[rgba(209,198,171,0.66)] transition-colors duration-200 hover:border-[rgba(255,180,171,0.3)] hover:text-[var(--admin-danger)]"
                            type="button"
                            onClick={() => handleDeleteCompetition(competition.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="grid gap-4 p-4 xl:hidden">
              {filteredCompetitions.map((competition) => (
                <article
                  key={competition.id}
                  className="space-y-4 rounded-[1.3rem] border border-[rgba(77,70,50,0.18)] bg-[rgba(17,19,23,0.9)] p-5"
                >
                  <div className="flex flex-wrap items-start justify-between gap-4">
                    <div>
                      <p className="text-xs font-mono text-[rgba(209,198,171,0.48)]">{competition.id}</p>
                      <h3 className="mt-1 text-lg font-bold uppercase tracking-[0.03em] text-[var(--admin-text)]">
                        {competition.title}
                      </h3>
                      <p className="mt-1 text-sm text-[rgba(209,198,171,0.68)]">{competition.organizer}</p>
                    </div>
                    <span className={`inline-flex rounded-full border px-3 py-1 text-xs font-semibold uppercase tracking-[0.14em] ${getStatusClasses(competition.status)}`}>
                      {competition.status}
                    </span>
                  </div>

                  <div className="grid gap-3 text-sm text-[rgba(209,198,171,0.76)] sm:grid-cols-2">
                    <div className="rounded-[1rem] bg-[rgba(255,255,255,0.02)] p-3">
                      <p className="admin-ui-text text-[0.62rem] text-[rgba(209,198,171,0.64)]">Duration</p>
                      
                      <p className="mt-2">{formatDisplayDate(competition.startDate)}</p>
                      <p>{formatDisplayDate(competition.endDate)}</p>
                    </div>
                    <div className="rounded-[1rem] bg-[rgba(255,255,255,0.02)] p-3">
                      <p className="admin-ui-text text-[0.62rem] text-[rgba(209,198,171,0.64)]">Registration</p>
                      <p className="mt-2">{formatDisplayDate(competition.registrationDeadline)}</p>
                      <p>{competition.teamCount} teams</p>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    <button
                      className="inline-flex items-center gap-2 rounded-full border border-[rgba(77,70,50,0.22)] px-4 py-2 text-sm text-[rgba(209,198,171,0.76)] transition-colors duration-200 hover:border-[rgba(250,204,21,0.3)] hover:text-[var(--admin-gold-soft)]"
                      type="button"
                      onClick={() => openEditModal(competition)}
                    >
                      <Pencil className="h-4 w-4" />
                      Edit
                    </button>
                    <button
                      className="inline-flex items-center gap-2 rounded-full border border-[rgba(77,70,50,0.22)] px-4 py-2 text-sm text-[rgba(209,198,171,0.76)] transition-colors duration-200 hover:border-[rgba(250,204,21,0.3)] hover:text-[var(--admin-gold-soft)]"
                      type="button"
                    >
                      <Settings2 className="h-4 w-4" />
                      Configure
                    </button>
                    <button
                      className="inline-flex items-center gap-2 rounded-full border border-[rgba(77,70,50,0.22)] px-4 py-2 text-sm text-[rgba(209,198,171,0.76)] transition-colors duration-200 hover:border-[rgba(255,180,171,0.3)] hover:text-[var(--admin-danger)]"
                      type="button"
                      onClick={() => handleDeleteCompetition(competition.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                      Delete
                    </button>
                  </div>
                </article>
              ))}
            </div>
          </div>

          <div className="grid gap-4 lg:grid-cols-[minmax(0,1.2fr)_minmax(280px,0.8fr)]">
            <article className="rounded-[1.3rem] border border-[rgba(77,70,50,0.18)] bg-[rgba(17,19,23,0.9)] p-5">
              <div className="flex items-center gap-3">
                <div className="rounded-full bg-[rgba(250,204,21,0.08)] p-3 text-[var(--admin-gold)]">
                  <ShieldCheck className="h-5 w-5" />
                </div>
                <div>
                  <p className="admin-ui-text text-[0.62rem] text-[rgba(250,204,21,0.74)]">DB sync</p>
                  <h3 className="admin-title mt-1 text-lg text-[var(--admin-text)]">Locked and verified</h3>
                </div>
              </div>
              <p className="mt-4 text-sm leading-7 text-[rgba(209,198,171,0.72)]">
                The admin page now keeps competition management and the create or edit flow together inside
                React, aligned with the frontend plan instead of relying on separate static HTML files.
              </p>
            </article>

            <article className="rounded-[1.3rem] border border-[rgba(77,70,50,0.18)] bg-[rgba(17,19,23,0.9)] p-5">
              <p className="admin-ui-text text-[0.62rem] text-[rgba(209,198,171,0.66)]">Operational snapshot</p>
              <div className="mt-4 grid gap-3 text-sm text-[rgba(209,198,171,0.76)]">
                <div className="flex items-center justify-between gap-4">
                  <span className="inline-flex items-center gap-2">
                    <CalendarDays className="h-4 w-4 text-[var(--admin-gold-soft)]" />
                    Next start date
                  </span>
                  <span>{filteredCompetitions[0] ? formatDisplayDate(filteredCompetitions[0].startDate) : 'None'}</span>
                </div>
                <div className="flex items-center justify-between gap-4">
                  <span className="inline-flex items-center gap-2">
                    <ExternalLink className="h-4 w-4 text-[var(--admin-gold-soft)]" />
                    Records shown
                  </span>
                  <span>{filteredCompetitions.length}</span>
                </div>
              </div>
            </article>
          </div>
        </section>
      </main>

      <CompetitionEditorModal
        form={form}
        formError={formError}
        isEditing={Boolean(editingCompetitionId)}
        open={isEditorOpen}
        onChange={handleFormChange}
        onClose={closeEditor}
        onSubmit={handleSubmit}
      />
    </>
  )
}
