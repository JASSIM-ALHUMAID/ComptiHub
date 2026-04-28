import { CalendarDays, Trophy, Users } from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import Card from '../../components/ui/Card'
import Badge from '../../components/ui/Badge'
import FilterButton from '../../components/ui/FilterButton'
import Alert from '../../components/ui/Alert'
import Input from '../../components/ui/Input'
import { competitionService } from '../../features/competitions/services/competitionService'

const categories = ['All', 'Business', 'Competitive Programming', 'Hackathon', 'Robotics', 'Design', 'AI / ML']

export default function CompetitionsPage() {
  const [competitions, setCompetitions] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')
  const [search, setSearch] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('All')
  const [statusFilter, setStatusFilter] = useState('all')

  useEffect(() => {
    let isCancelled = false

    async function loadCompetitions() {
      setIsLoading(true)
      setError('')

      try {
        const nextCompetitions = await competitionService.listCompetitions({
          search,
          category: selectedCategory,
          status: statusFilter,
          sortBy: 'deadline',
          sortOrder: 'asc',
        })

        if (!isCancelled) {
          setCompetitions(nextCompetitions)
        }
      } catch (loadError) {
        if (!isCancelled) {
          setError(loadError.message || 'Unable to load competitions.')
        }
      } finally {
        if (!isCancelled) {
          setIsLoading(false)
        }
      }
    }

    loadCompetitions()

    return () => {
      isCancelled = true
    }
  }, [search, selectedCategory, statusFilter])

  const filtered = useMemo(() => competitions, [competitions])

  return (
    <main className="space-y-6">
      <header className="space-y-2">
        <p className="landing-label text-[0.68rem] text-[rgba(250,204,21,0.82)]">Browse</p>
        <h1 className="landing-title text-3xl text-(--landing-text)">Competitions</h1>
        <p className="landing-copy text-sm text-[rgba(226,226,232,0.65)]">
          Discover active competitions and find the right challenge for your skills.
        </p>
      </header>

      <Card className="space-y-3">
        <label className="space-y-2" htmlFor="competition-search">
          <span className="landing-ui-text block text-[0.7rem] text-[rgba(226,226,232,0.55)]">Search competitions</span>
          <Input
            id="competition-search"
            type="text"
            placeholder="Search competitions or organizers…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </label>
        <div aria-label="Filter by category" className="flex flex-wrap gap-2" role="group">
          {categories.map((cat) => (
            <FilterButton
              key={cat}
              isActive={selectedCategory === cat}
              onClick={() => setSelectedCategory(cat)}
            >
              {cat}
            </FilterButton>
          ))}
        </div>
        <div aria-label="Filter by competition status" className="flex flex-wrap gap-2" role="group">
          {['all', 'open'].map((s) => (
            <FilterButton
              key={s}
              isActive={statusFilter === s}
              onClick={() => setStatusFilter(s)}
            >
              {s === 'all' ? 'All Statuses' : s}
            </FilterButton>
          ))}
        </div>
      </Card>

      {error ? (
        <Alert
          variant="error"
          title="Unable to load competitions"
          message={error}
        />
      ) : null}

      {isLoading ? (
        <Alert
          variant="info"
          title="Loading competitions"
          message="Fetching the latest open competitions for you."
        />
      ) : null}

      {!isLoading && filtered.length === 0 ? (
        <Alert
          variant="info"
          title="No results"
          message="No competitions match your filters. Try adjusting your search."
        />
      ) : !isLoading ? (
        <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
          {filtered.map((comp) => (
            <Link
              key={comp.id}
              to={`/competitions/${comp.id}`}
              className="group block"
            >
              <Card variant="interactive" className="h-full">
                <div className="mb-3 flex items-start justify-between gap-3">
                  <h2 className="landing-title text-[1.1rem] leading-tight text-(--landing-text) transition-colors duration-200 group-hover:text-(--landing-gold-soft)">
                    {comp.title}
                  </h2>
                  <Badge
                    variant={comp.status === 'open' ? 'success' : 'danger'}
                    size="md"
                    className="shrink-0"
                  >
                    {comp.status}
                  </Badge>
                </div>
                <p className="landing-copy mb-3 text-xs text-[rgba(226,226,232,0.55)]">by {comp.organizer}</p>
                <p className="landing-copy mb-4 line-clamp-2 text-sm text-[rgba(226,226,232,0.7)]">{comp.description}</p>
                <div className="mb-3 flex flex-wrap gap-2">
                  {comp.tags.map((tag) => (
                    <Badge key={tag} variant="default" size="sm">
                      {tag}
                    </Badge>
                  ))}
                </div>
                <div className="flex flex-wrap items-center gap-4 text-xs text-[rgba(226,226,232,0.55)]">
                  <span className="inline-flex items-center gap-2">
                    <Trophy aria-hidden="true" className="h-3.5 w-3.5 text-(--landing-gold)" />
                    {comp.prize}
                  </span>
                  <span className="inline-flex items-center gap-2">
                    <Users aria-hidden="true" className="h-3.5 w-3.5 text-[rgba(226,226,232,0.72)]" />
                    {comp.teamSize} members
                  </span>
                  <span className="inline-flex items-center gap-2">
                    <CalendarDays aria-hidden="true" className="h-3.5 w-3.5 text-[rgba(226,226,232,0.72)]" />
                    {comp.deadline}
                  </span>
                </div>
              </Card>
            </Link>
          ))}
        </div>
      ) : null}
    </main>
  )
}
