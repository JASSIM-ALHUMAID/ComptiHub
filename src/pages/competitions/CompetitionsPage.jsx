import { useState } from 'react'
import { Link } from 'react-router-dom'
import Card from '../../components/ui/Card'
import Badge from '../../components/ui/Badge'
import FilterButton from '../../components/ui/FilterButton'
import Alert from '../../components/ui/Alert'
import Input from '../../components/ui/Input'
import { competitions } from '../../data/mocks/competitions'

const categories = ['All', 'Business', 'Competitive Programming', 'Hackathon', 'Robotics', 'Design', 'AI / ML']

export default function CompetitionsPage() {
  const [search, setSearch] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('All')
  const [statusFilter, setStatusFilter] = useState('all')

  const filtered = competitions.filter((c) => {
    const matchesSearch =
      c.title.toLowerCase().includes(search.toLowerCase()) ||
      c.organizer.toLowerCase().includes(search.toLowerCase())
    const matchesCategory = selectedCategory === 'All' || c.category === selectedCategory
    const matchesStatus = statusFilter === 'all' || c.status === statusFilter
    return matchesSearch && matchesCategory && matchesStatus
  })

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
        <Input
          type="text"
          placeholder="Search competitions or organizers…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <div className="flex flex-wrap gap-2">
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
        <div className="flex flex-wrap gap-2">
          {['all', 'open', 'closed'].map((s) => (
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

      {filtered.length === 0 ? (
        <Alert
          variant="info"
          title="No results"
          message="No competitions match your filters. Try adjusting your search."
        />
      ) : (
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
                  <span>🏆 {comp.prize}</span>
                  <span>👥 {comp.teamSize} members</span>
                  <span>📅 {comp.deadline}</span>
                </div>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </main>
  )
}