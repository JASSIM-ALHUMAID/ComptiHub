import { Link } from 'react-router-dom'
import Button from '../../components/ui/Button'
import { useAuth } from '../../features/auth/hooks/useAuth'
import { useStudentRole } from '../../features/account/hooks/useStudentRole'
import { teams } from '../../data/mocks/teams'
import { routes } from '../../lib/constants/routes'

export default function MyTeamsPage() {
  const { user } = useAuth()
  const { activeRole } = useStudentRole()
  const isLeader = activeRole === 'teamLeader'

  // Show teams where the current user is a member OR leader
  // Since we're using mock data, we show all teams but in real app this would filter by user id
  const myTeams = teams.filter((team) =>
    team.members.some((m) => m.id === user?.id) || team.leaderId === user?.id
  )

  // Fallback: show all teams if none match (mock data has hardcoded ids)
  const displayTeams = myTeams.length > 0 ? myTeams : teams.slice(0, 2)

  return (
    <main className="space-y-6">
      <header className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="space-y-2">
          <p className="landing-label text-[0.68rem] text-[rgba(250,204,21,0.82)]">My Teams</p>
          <h1 className="landing-title text-3xl text-(--landing-text)">Teams</h1>
          <p className="landing-copy text-sm text-[rgba(226,226,232,0.65)]">
            {isLeader
              ? 'Teams you lead and are a member of.'
              : 'Teams you are currently a member of.'}
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

      {displayTeams.length === 0 ? (
        <div className="rounded-[1.5rem] border border-[rgba(77,70,50,0.22)] bg-[rgba(12,14,18,0.48)] p-8 text-center space-y-3">
          <p className="landing-copy text-sm text-[rgba(226,226,232,0.55)]">
            You are not in any teams yet.
          </p>
          <Link
            className="inline-block text-sm text-(--landing-gold) hover:text-(--landing-gold-soft) transition-colors duration-200"
            to={routes.competitions}
          >
            Browse competitions to find a team →
          </Link>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2">
          {displayTeams.map((team) => (
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

              <div className="mt-1 mb-3 inline-flex rounded-full border border-[rgba(77,70,50,0.28)] px-2.5 py-1 text-[0.65rem] text-[rgba(226,226,232,0.55)]">
                {team.leaderId === user?.id ? 'You are the leader' : 'Member'}
              </div>

              <p className="landing-copy mb-4 line-clamp-2 text-sm text-[rgba(226,226,232,0.7)]">
                {team.description}
              </p>

              <div className="flex items-center justify-between text-xs text-[rgba(226,226,232,0.5)]">
                <span>👥 {team.members.length}/{team.totalSlots} members</span>
                {team.openSlots > 0 && (
                  <span className="text-green-400">{team.openSlots} open slot{team.openSlots !== 1 ? 's' : ''}</span>
                )}
              </div>
            </Link>
          ))}
        </div>
      )}

      <div className="rounded-[1.5rem] border border-[rgba(77,70,50,0.22)] bg-[rgba(12,14,18,0.32)] p-4">
        <p className="landing-copy text-sm text-[rgba(226,226,232,0.55)]">
          Looking to join a team?{' '}
          <Link
            className="text-(--landing-gold) hover:text-(--landing-gold-soft) transition-colors duration-200"
            to={routes.competitions}
          >
            Browse competitions
          </Link>
          {' '}and find recruiting teams on each competition's page.
        </p>
      </div>
    </main>
  )
}