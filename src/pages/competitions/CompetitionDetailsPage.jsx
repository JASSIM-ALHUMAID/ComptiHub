import { Link, useParams } from 'react-router-dom'
import Badge from '../../components/ui/Badge'
import Button from '../../components/ui/Button'
import { competitions } from '../../data/mocks/competitions'
import { teams } from '../../data/mocks/teams'
import { routes } from '../../lib/constants/routes'

export default function CompetitionDetailsPage() {
  const { competitionId } = useParams()
  const competition = competitions.find((c) => c.id === competitionId)
  const relatedTeams = teams.filter((t) => t.competitionId === competitionId && t.status === 'recruiting')

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
          <h1 className="landing-title flex-1 text-2xl text-(--landing-text) sm:text-3xl">{competition.title}</h1>
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
        <p className="landing-copy text-sm text-[rgba(226,226,232,0.55)]">Organized by {competition.organizer}</p>
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
        <p className="landing-copy text-sm leading-relaxed text-[rgba(226,226,232,0.75)]">{competition.description}</p>
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

      {relatedTeams.length > 0 && (
        <section className="space-y-3">
          <h2 className="landing-ui-text text-[0.78rem] text-(--landing-gold)">Teams Recruiting</h2>
          <div className="grid gap-3 sm:grid-cols-2">
            {relatedTeams.map((team) => (
              <Link
                key={team.id}
                to={`/teams/${team.id}`}
                className="group block rounded-[1.5rem] border border-[rgba(77,70,50,0.22)] bg-[rgba(12,14,18,0.48)] p-4 transition-all duration-200 hover:border-(--landing-gold)"
              >
                <div className="mb-2 flex items-center justify-between gap-2">
                  <h3 className="landing-title text-base text-(--landing-text) transition-colors group-hover:text-(--landing-gold-soft)">{team.name}</h3>
                  <span className="text-xs text-[rgba(226,226,232,0.55)]">{team.openSlots} slot{team.openSlots !== 1 ? 's' : ''} open</span>
                </div>
                <p className="landing-copy line-clamp-2 text-xs text-[rgba(226,226,232,0.65)]">{team.description}</p>
                <div className="mt-3 flex flex-wrap gap-1.5">
                  {team.requiredSkills.map((skill) => (
                    <span key={skill} className="rounded-full border border-[rgba(77,70,50,0.3)] bg-[rgba(12,14,18,0.6)] px-2 py-0.5 text-[0.65rem] text-[rgba(226,226,232,0.65)]">
                      {skill}
                    </span>
                  ))}
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}

      {competition.status === 'open' && (
        <div className="pt-2">
          <Button as={Link} to={routes.teams} size="nav">
            Find a Team for This Competition
          </Button>
        </div>
      )}
    </main>
  )
}