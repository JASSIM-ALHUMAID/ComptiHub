import { Link } from 'react-router-dom'
import Button from '../../components/ui/Button'
import { useStudentRole } from '../../features/account/hooks/useStudentRole'
import { teams } from '../../data/mocks/teams'
import { routes } from '../../lib/constants/routes'

export default function MyTeamsPage() {
  const { activeRole } = useStudentRole()
  const isLeader = activeRole === 'teamLeader'

  return (
    <main className="space-y-6">
      <header className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="space-y-2">
          <p className="landing-label text-[0.68rem] text-[rgba(250,204,21,0.82)]">
            {isLeader ? 'Manage' : 'Discover'}
          </p>
          <h1 className="landing-title text-3xl text-(--landing-text)">Teams</h1>
          <p className="landing-copy text-sm text-[rgba(226,226,232,0.65)]">
            {isLeader
              ? 'Create and manage your teams. Review incoming join requests.'
              : 'Browse teams that are recruiting and apply to join.'}
          </p>
        </div>
        {isLeader && (
          <Button as={Link} to={routes.teamCreate} size="nav" className="shrink-0">
            + Create Team
          </Button>
        )}
      </header>

      {isLeader && (
        <div className="flex">
          <Link
            to={routes.teamRequests}
            className="rounded-full border border-[rgba(77,70,50,0.28)] px-5 py-2.5 text-sm font-semibold text-[rgba(226,226,232,0.72)] transition-colors duration-200 hover:border-(--landing-gold) hover:text-(--landing-gold-soft)"
          >
            View Join Requests →
          </Link>
        </div>
      )}

      <div className="grid gap-4 sm:grid-cols-2">
        {teams.map((team) => (
          <Link
            key={team.id}
            to={`/teams/${team.id}`}
            className="group block rounded-[1.5rem] border border-[rgba(77,70,50,0.22)] bg-[rgba(12,14,18,0.48)] p-5 transition-all duration-200 hover:border-(--landing-gold) hover:bg-[rgba(250,204,21,0.04)]"
          >
            <div className="mb-1 flex items-start justify-between gap-3">
              <h2 className="landing-title text-[1.1rem] text-(--landing-text) transition-colors duration-200 group-hover:text-(--landing-gold-soft)">
                {team.name}
              </h2>
              <span
                className={[
                  'shrink-0 rounded-full border px-2.5 py-1 text-[0.65rem] font-semibold uppercase',
                  team.status === 'recruiting'
                    ? 'border-green-500/30 bg-green-500/10 text-green-400'
                    : 'border-[rgba(77,70,50,0.3)] text-[rgba(226,226,232,0.45)]',
                ].join(' ')}
              >
                {team.status}
              </span>
            </div>
            <p className="landing-copy mb-1 text-xs text-[rgba(226,226,232,0.5)]">{team.competitionTitle}</p>
            <p className="landing-copy mb-1 text-xs text-[rgba(226,226,232,0.45)]">Led by {team.leaderName}</p>
            <p className="landing-copy mb-4 mt-2 line-clamp-2 text-sm text-[rgba(226,226,232,0.7)]">{team.description}</p>
            <div className="mb-3 flex flex-wrap gap-1.5">
              {team.requiredSkills.map((skill) => (
                <span key={skill} className="rounded-full border border-[rgba(77,70,50,0.3)] bg-[rgba(12,14,18,0.6)] px-2 py-0.5 text-[0.65rem] text-[rgba(226,226,232,0.65)]">
                  {skill}
                </span>
              ))}
            </div>
            <div className="flex items-center justify-between text-xs text-[rgba(226,226,232,0.5)]">
              <span>👥 {team.members.length}/{team.totalSlots} members</span>
              {team.openSlots > 0 && (
                <span className="text-green-400">{team.openSlots} open slot{team.openSlots !== 1 ? 's' : ''}</span>
              )}
            </div>
          </Link>
        ))}
      </div>
    </main>
  )
}