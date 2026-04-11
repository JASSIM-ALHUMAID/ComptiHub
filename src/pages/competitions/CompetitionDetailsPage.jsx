import { useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import Badge from '../../components/ui/Badge'
import Button from '../../components/ui/Button'
import { competitions } from '../../data/mocks/competitions'
import { teams } from '../../data/mocks/teams'
import { useAuth } from '../../features/auth/hooks/useAuth'
import { routes } from '../../lib/constants/routes'

function TeamCard({ team, competitionTitle }) {
  const { addApplication, hasApplied } = useAuth()
  const alreadyApplied = hasApplied(team.id)
  const [showForm, setShowForm] = useState(false)
  const [message, setMessage] = useState('')

  function handleApply(e) {
    e.preventDefault()
    addApplication(team.id, team.name, competitionTitle, message)
    setShowForm(false)
  }

  return (
    <div className="rounded-[1.5rem] border border-[rgba(77,70,50,0.22)] bg-[rgba(12,14,18,0.48)] p-5 space-y-3 transition-all duration-200 hover:border-[rgba(77,70,50,0.4)]">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h3 className="landing-title text-base text-(--landing-text)">{team.name}</h3>
          <p className="text-xs text-[rgba(226,226,232,0.45)] mt-0.5">Led by {team.leaderName}</p>
        </div>
        <span className="shrink-0 text-xs text-green-400">
          {team.openSlots} slot{team.openSlots !== 1 ? 's' : ''} open
        </span>
      </div>

      <p className="landing-copy text-sm text-[rgba(226,226,232,0.7)]">{team.description}</p>

      <div className="flex flex-wrap gap-1.5">
        {team.requiredSkills.map((skill) => (
          <span
            key={skill}
            className="rounded-full border border-[rgba(77,70,50,0.3)] bg-[rgba(12,14,18,0.6)] px-2 py-0.5 text-[0.65rem] text-[rgba(226,226,232,0.65)]"
          >
            {skill}
          </span>
        ))}
      </div>

      <div className="text-xs text-[rgba(226,226,232,0.45)]">
        👥 {team.members.length}/{team.totalSlots} members
      </div>

      {alreadyApplied ? (
        <div className="rounded-2xl border border-green-500/30 bg-green-500/10 px-4 py-3">
          <p className="text-sm font-semibold text-green-400">✓ Application submitted!</p>
        </div>
      ) : showForm ? (
        <form onSubmit={handleApply} className="space-y-3 pt-1">
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            required
            rows={3}
            placeholder="Tell the team why you'd be a great fit…"
            className="w-full resize-none rounded-2xl border border-[rgba(77,70,50,0.35)] bg-[rgba(12,14,18,0.78)] px-4 py-3 text-sm text-(--landing-text) placeholder:text-[rgba(226,226,232,0.4)] focus:border-(--landing-gold) focus:outline-none focus:ring-2 focus:ring-[rgba(250,204,21,0.2)]"
          />
          <div className="flex gap-3">
            <Button type="submit" size="nav">Submit</Button>
            <button
              type="button"
              onClick={() => setShowForm(false)}
              className="rounded-full border border-[rgba(77,70,50,0.28)] px-5 py-2.5 text-sm text-[rgba(226,226,232,0.7)] transition-colors duration-200 hover:border-(--landing-gold) hover:text-(--landing-gold-soft)"
            >
              Cancel
            </button>
          </div>
        </form>
      ) : (
        <button
          type="button"
          onClick={() => setShowForm(true)}
          className="rounded-full border border-[rgba(250,204,21,0.3)] bg-[rgba(250,204,21,0.06)] px-5 py-2.5 text-sm font-semibold text-(--landing-gold) transition-colors duration-200 hover:border-(--landing-gold) hover:bg-[rgba(250,204,21,0.12)]"
        >
          Apply to Join
        </button>
      )}
    </div>
  )
}

export default function CompetitionDetailsPage() {
  const { competitionId } = useParams()
  const competition = competitions.find((c) => c.id === competitionId)
  const recruitingTeams = teams.filter(
    (t) => t.competitionId === competitionId && t.status === 'recruiting'
  )

  if (!competition) {
    return (
      <main className="space-y-4">
        <p className="landing-copy text-sm text-[rgba(226,226,232,0.65)]">Competition not found.</p>
        <Link className="text-sm text-(--landing-gold) hover:text-(--landing-gold-soft)" to={routes.competitions}>
          ← Back to competitions
        </Link>
      </main>
    )
  }

  return (
    <main className="space-y-6">
      <div className="flex items-center gap-2">
        <Link
          className="landing-ui-text text-[0.72rem] text-[rgba(226,226,232,0.55)] transition-colors duration-200 hover:text-(--landing-gold)"
          to={routes.competitions}
        >
          Competitions
        </Link>
        <span className="text-[rgba(226,226,232,0.3)]">/</span>
        <span className="landing-ui-text text-[0.72rem] text-(--landing-gold-soft)">{competition.title}</span>
      </div>

      <header className="space-y-3">
        <div className="flex flex-wrap items-start gap-3">
          <h1 className="landing-title flex-1 text-2xl text-(--landing-text) sm:text-3xl">
            {competition.title}
          </h1>
          <span
            className={[
              'rounded-full border px-3 py-1.5 text-xs font-semibold uppercase',
              competition.status === 'open'
                ? 'border-green-500/30 bg-green-500/10 text-green-400'
                : 'border-[rgba(255,180,171,0.3)] bg-[rgba(255,180,171,0.08)] text-(--landing-danger)',
            ].join(' ')}
          >
            {competition.status}
          </span>
        </div>
        <p className="landing-copy text-sm text-[rgba(226,226,232,0.55)]">
          Organized by {competition.organizer}
        </p>
        <div className="flex flex-wrap gap-2">
          {competition.tags.map((tag) => (
            <Badge key={tag} className="text-[0.68rem]">{tag}</Badge>
          ))}
        </div>
      </header>

      <div className="grid grid-cols-2 gap-3 rounded-[1.5rem] border border-[rgba(77,70,50,0.22)] bg-[rgba(12,14,18,0.48)] p-4 sm:grid-cols-4">
        {[
          { label: 'Prize', value: competition.prize },
          { label: 'Team Size', value: competition.teamSize + ' members' },
          { label: 'Mode', value: competition.mode },
          { label: 'Deadline', value: competition.deadline },
        ].map((item) => (
          <div key={item.label}>
            <p className="landing-ui-text text-[0.65rem] text-[rgba(226,226,232,0.45)]">{item.label}</p>
            <p className="mt-1 text-sm font-semibold text-(--landing-text)">{item.value}</p>
          </div>
        ))}
      </div>

      <section className="space-y-3 rounded-[1.5rem] border border-[rgba(77,70,50,0.22)] bg-[rgba(12,14,18,0.48)] p-5">
        <h2 className="landing-ui-text text-[0.78rem] text-(--landing-gold)">About</h2>
        <p className="landing-copy text-sm leading-relaxed text-[rgba(226,226,232,0.75)]">
          {competition.description}
        </p>
      </section>

      <section className="space-y-3 rounded-[1.5rem] border border-[rgba(77,70,50,0.22)] bg-[rgba(12,14,18,0.48)] p-5">
        <h2 className="landing-ui-text text-[0.78rem] text-(--landing-gold)">Requirements</h2>
        <ul className="space-y-2">
          {competition.requirements.map((req) => (
            <li key={req} className="flex items-center gap-2 text-sm text-[rgba(226,226,232,0.72)]">
              <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-(--landing-gold)" />
              {req}
            </li>
          ))}
        </ul>
      </section>

      {competition.status === 'open' && (
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="landing-ui-text text-[0.78rem] text-(--landing-gold)">Teams Recruiting</h2>
            <span className="text-xs text-[rgba(226,226,232,0.45)]">
              {recruitingTeams.length} team{recruitingTeams.length !== 1 ? 's' : ''} looking for members
            </span>
          </div>

          {recruitingTeams.length === 0 ? (
            <div className="rounded-[1.5rem] border border-[rgba(77,70,50,0.22)] bg-[rgba(12,14,18,0.48)] p-6 text-center">
              <p className="landing-copy text-sm text-[rgba(226,226,232,0.55)]">
                No teams are recruiting for this competition yet.
              </p>
            </div>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2">
              {recruitingTeams.map((team) => (
                <TeamCard key={team.id} team={team} competitionTitle={competition.title} />
              ))}
            </div>
          )}
        </section>
      )}
    </main>
  )
}