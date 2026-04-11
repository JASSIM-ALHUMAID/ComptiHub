import { useState } from 'react'
import { Link } from 'react-router-dom'
import Badge from '../../components/ui/Badge'
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

      <div className="space-y-3 rounded-[1.5rem] border border-[rgba(77,70,50,0.22)] bg-[rgba(12,14,18,0.48)] p-4">
        <input
          type="text"
          placeholder="Search competitions or organizers…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full rounded-2xl border border-[rgba(77,70,50,0.35)] bg-[rgba(12,14,18,0.78)] px-4 py-3 text-sm text-(--landing-text) placeholder:text-[rgba(226,226,232,0.4)] focus:border-(--landing-gold) focus:outline-none focus:ring-2 focus:ring-[rgba(250,204,21,0.2)]"
        />
        <div className="flex flex-wrap gap-2">
          {categories.map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setSelectedCategory(cat)}
              className={[
                'rounded-full border px-3 py-1.5 text-xs font-semibold transition-colors duration-200',
                selectedCategory === cat
                  ? 'border-(--landing-gold) bg-[rgba(250,204,21,0.12)] text-(--landing-gold-soft)'
                  : 'border-[rgba(77,70,50,0.3)] text-[rgba(226,226,232,0.6)] hover:border-(--landing-gold) hover:text-(--landing-gold-soft)',
              ].join(' ')}
            >
              {cat}
            </button>
          ))}
        </div>
        <div className="flex gap-2">
          {['all', 'open', 'closed'].map((s) => (
            <button
              key={s}
              type="button"
              onClick={() => setStatusFilter(s)}
              className={[
                'rounded-full border px-3 py-1.5 text-xs font-semibold capitalize transition-colors duration-200',
                statusFilter === s
                  ? 'border-(--landing-gold) bg-[rgba(250,204,21,0.12)] text-(--landing-gold-soft)'
                  : 'border-[rgba(77,70,50,0.3)] text-[rgba(226,226,232,0.6)] hover:border-(--landing-gold) hover:text-(--landing-gold-soft)',
              ].join(' ')}
            >
              {s === 'all' ? 'All Statuses' : s}
            </button>
          ))}
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="rounded-[1.5rem] border border-[rgba(77,70,50,0.22)] bg-[rgba(12,14,18,0.48)] p-8 text-center">
          <p className="landing-copy text-sm text-[rgba(226,226,232,0.55)]">No competitions match your filters.</p>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2">
          {filtered.map((comp) => (
            <Link
              key={comp.id}
              to={`/competitions/${comp.id}`}
              className="group block rounded-[1.5rem] border border-[rgba(77,70,50,0.22)] bg-[rgba(12,14,18,0.48)] p-5 transition-all duration-200 hover:border-(--landing-gold) hover:bg-[rgba(250,204,21,0.04)]"
            >
              <div className="mb-3 flex items-start justify-between gap-3">
                <h2 className="landing-title text-[1.1rem] leading-tight text-(--landing-text) transition-colors duration-200 group-hover:text-(--landing-gold-soft)">
                  {comp.title}
                </h2>
                <span
                  className={[
                    'shrink-0 rounded-full border px-2.5 py-1 text-[0.68rem] font-semibold uppercase',
                    comp.status === 'open'
                      ? 'border-green-500/30 bg-green-500/10 text-green-400'
                      : 'border-[rgba(255,180,171,0.3)] bg-[rgba(255,180,171,0.08)] text-(--landing-danger)',
                  ].join(' ')}
                >
                  {comp.status}
                </span>
              </div>
              <p className="landing-copy mb-3 text-xs text-[rgba(226,226,232,0.55)]">by {comp.organizer}</p>
              <p className="landing-copy mb-4 line-clamp-2 text-sm text-[rgba(226,226,232,0.7)]">{comp.description}</p>
              <div className="mb-3 flex flex-wrap gap-2">
                {comp.tags.map((tag) => (
                  <Badge key={tag} className="text-[0.68rem]">{tag}</Badge>
                ))}
              </div>
              <div className="flex flex-wrap items-center gap-4 text-xs text-[rgba(226,226,232,0.55)]">
                <span>🏆 {comp.prize}</span>
                <span>👥 {comp.teamSize} members</span>
                <span>📅 {comp.deadline}</span>
              </div>
            </Link>
          ))}
        </div>
      )}
    </main>
  )
}