import { Link, useParams } from 'react-router-dom'
import Badge from '../../components/ui/Badge'
import { teams } from '../../data/mocks/teams'
import { routes } from '../../lib/constants/routes'

export default function TeamDetailsPage() {
  const { teamId } = useParams()
  const team = teams.find((t) => t.id === teamId)

  if (!team) {
    return (
      <main className="space-y-4">
        <p className="landing-copy text-sm text-[rgba(226,226,232,0.65)]">Team not found.</p>
        <Link className="text-sm text-(--landing-gold) hover:text-(--landing-gold-soft)" to={routes.teams}>
          ← Back to my teams
        </Link>
      </main>
    )
  }

  return (
    <main className="space-y-6">
      <div className="flex items-center gap-2">
        <Link
          className="landing-ui-text text-[0.72rem] text-[rgba(226,226,232,0.55)] transition-colors duration-200 hover:text-(--landing-gold)"
          to={routes.teams}
        >
          My Teams
        </Link>
        <span className="text-[rgba(226,226,232,0.3)]">/</span>
        <span className="landing-ui-text text-[0.72rem] text-(--landing-gold-soft)">{team.name}</span>
      </div>

      <header className="space-y-2">
        <div className="flex flex-wrap items-center gap-3">
          <h1 className="landing-title text-2xl text-(--landing-text) sm:text-3xl">{team.name}</h1>
          <span
            className={[
              'rounded-full border px-3 py-1.5 text-xs font-semibold uppercase',
              team.status === 'recruiting'
                ? 'border-green-500/30 bg-green-500/10 text-green-400'
                : 'border-[rgba(77,70,50,0.3)] text-[rgba(226,226,232,0.45)]',
            ].join(' ')}
          >
            {team.status}
          </span>
        </div>
        <p className="landing-copy text-sm text-[rgba(226,226,232,0.55)]">
          Competing in:{' '}
          <Link
            className="text-(--landing-gold) hover:text-(--landing-gold-soft)"
            to={`/competitions/${team.competitionId}`}
          >
            {team.competitionTitle}
          </Link>
        </p>
      </header>

      <section className="space-y-2 rounded-[1.5rem] border border-[rgba(77,70,50,0.22)] bg-[rgba(12,14,18,0.48)] p-5">
        <h2 className="landing-ui-text text-[0.78rem] text-(--landing-gold)">About</h2>
        <p className="landing-copy text-sm leading-relaxed text-[rgba(226,226,232,0.75)]">{team.description}</p>
      </section>

      <section className="space-y-3 rounded-[1.5rem] border border-[rgba(77,70,50,0.22)] bg-[rgba(12,14,18,0.48)] p-5">
        <h2 className="landing-ui-text text-[0.78rem] text-(--landing-gold)">Skills</h2>
        <div className="flex flex-wrap gap-2">
          {team.requiredSkills.map((skill) => (
            <Badge key={skill} className="text-[0.72rem]">{skill}</Badge>
          ))}
        </div>
      </section>

      <section className="space-y-3 rounded-[1.5rem] border border-[rgba(77,70,50,0.22)] bg-[rgba(12,14,18,0.48)] p-5">
        <div className="flex items-center justify-between">
          <h2 className="landing-ui-text text-[0.78rem] text-(--landing-gold)">Members</h2>
          <span className="text-xs text-[rgba(226,226,232,0.5)]">{team.members.length}/{team.totalSlots}</span>
        </div>
        <div className="grid gap-2">
          {team.members.map((member) => (
            <div
              key={member.id}
              className="flex items-center justify-between rounded-2xl border border-[rgba(77,70,50,0.18)] bg-[rgba(17,19,23,0.5)] px-4 py-3"
            >
              <span className="text-sm font-semibold text-(--landing-text)">{member.username}</span>
              <span className="text-xs text-[rgba(226,226,232,0.5)]">{member.role}</span>
            </div>
          ))}
          {Array.from({ length: team.openSlots }).map((_, i) => (
            <div
              key={`open-${i}`}
              className="flex items-center rounded-2xl border border-dashed border-[rgba(77,70,50,0.3)] px-4 py-3"
            >
              <span className="text-sm text-[rgba(226,226,232,0.35)]">Open slot</span>
            </div>
          ))}
        </div>
      </section>
    </main>
  )
}