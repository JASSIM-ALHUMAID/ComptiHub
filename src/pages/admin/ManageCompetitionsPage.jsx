import { CalendarDays, CirclePlus, ExternalLink, ShieldCheck, Trophy } from 'lucide-react'
import { useMemo, useState } from 'react'
import Button from '../../components/ui/Button'
import CompetitionEditorModal from '../../features/admin/competitions/CompetitionEditorModal'
import CompetitionFilters from '../../features/admin/competitions/CompetitionFilters'
import CompetitionList from '../../features/admin/competitions/CompetitionList'
import CompetitionStatsPanel from '../../features/admin/competitions/CompetitionStatsPanel'
import {
  buildCompetitionFromForm,
  filterCompetitions,
  formatDisplayDate,
  getCompetitionStats,
  getStatusClasses,
  initialForm,
  validateCompetitionForm,
} from '../../features/admin/competitions/competitionForm'
import { adminCompetitionsService } from '../../features/admin/services/adminCompetitionsService'

export default function ManageCompetitionsPage() {
  const [competitions, setCompetitions] = useState(adminCompetitionsService.listCompetitions())
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [isEditorOpen, setIsEditorOpen] = useState(false)
  const [editingCompetitionId, setEditingCompetitionId] = useState(null)
  const [form, setForm] = useState(initialForm)
  const [formError, setFormError] = useState('')

  const filteredCompetitions = useMemo(
    () => filterCompetitions(competitions, search, statusFilter),
    [competitions, search, statusFilter],
  )

  const stats = useMemo(() => getCompetitionStats(competitions), [competitions])

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

    const validationError = validateCompetitionForm(form)

    if (validationError) {
      setFormError(validationError)
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
      <main className="app-page space-y-8">
        <header className="grid gap-6 rounded-[1.6rem] border border-[rgba(77,70,50,0.18)] bg-[linear-gradient(135deg,rgba(250,204,21,0.08),rgba(255,255,255,0.02))] p-6 xl:grid-cols-[minmax(0,1.3fr)_340px] xl:p-7">
          <div className="space-y-4">
            <p className="app-ui-text text-[0.68rem] text-[rgba(250,204,21,0.82)]">System management</p>
            <div className="space-y-3">
              <h1 className="app-display text-4xl leading-none text-[var(--admin-text)] sm:text-5xl xl:text-6xl">
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
                <p className="app-ui-text text-[0.62rem] text-[rgba(250,204,21,0.76)]">Registry</p>
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

        <CompetitionStatsPanel stats={stats} />

        <section className="space-y-6 rounded-[1.6rem] border border-[rgba(77,70,50,0.18)] bg-[rgba(12,14,18,0.72)] p-4 sm:p-6">
          <CompetitionFilters
            search={search}
            statusFilter={statusFilter}
            onSearchChange={(event) => setSearch(event.target.value)}
            onStatusFilterChange={(event) => setStatusFilter(event.target.value)}
          />

          <CompetitionList
            competitions={filteredCompetitions}
            formatDisplayDate={formatDisplayDate}
            getStatusClasses={getStatusClasses}
            onDelete={handleDeleteCompetition}
            onEdit={openEditModal}
          />

          <div className="grid gap-4 lg:grid-cols-[minmax(0,1.2fr)_minmax(280px,0.8fr)]">
            <article className="rounded-[1.3rem] border border-[rgba(77,70,50,0.18)] bg-[rgba(17,19,23,0.9)] p-5">
              <div className="flex items-center gap-3">
                <div className="rounded-full bg-[rgba(250,204,21,0.08)] p-3 text-[var(--admin-gold)]">
                  <ShieldCheck className="h-5 w-5" />
                </div>
                <div>
                  <p className="app-ui-text text-[0.62rem] text-[rgba(250,204,21,0.74)]">DB sync</p>
                  <h3 className="app-title mt-1 text-lg text-[var(--admin-text)]">Locked and verified</h3>
                </div>
              </div>
              <p className="mt-4 text-sm leading-7 text-[rgba(209,198,171,0.72)]">
                The admin page now keeps competition management and the create or edit flow together inside
                React, aligned with the frontend plan instead of relying on separate static HTML files.
              </p>
            </article>

            <article className="rounded-[1.3rem] border border-[rgba(77,70,50,0.18)] bg-[rgba(17,19,23,0.9)] p-5">
              <p className="app-ui-text text-[0.62rem] text-[rgba(209,198,171,0.66)]">Operational snapshot</p>
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
