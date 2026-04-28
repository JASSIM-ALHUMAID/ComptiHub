import { UserPlus, Users } from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import Button from '../../components/ui/Button'
import EmptyState from '../../components/feedback/EmptyState'
import { useAuth } from '../../features/auth/hooks/useAuth'
import { useStudentRole } from '../../features/account/hooks/useStudentRole'
import { teamService } from '../../features/teams/services/teamService'
import { routes } from '../../lib/constants/routes'

export default function MyTeamsPage() {
  const { user } = useAuth()
  const { activeRole } = useStudentRole()
  const [teams, setTeams] = useState([])
  const [error, setError] = useState('')
  const isLeader = activeRole === 'teamLeader'
  const userId = user?.id

  useEffect(() => {
    let isCancelled = false

    async function loadTeams() {
      try {
        const nextTeams = await teamService.listMyTeams()

        if (!isCancelled) {
          setTeams(nextTeams)
        }
      } catch (loadError) {
        if (!isCancelled) {
          setError(loadError.message || 'Unable to load your teams.')
        }
      }
    }

    loadTeams()

    return () => {
      isCancelled = true
    }
  }, [])

  const myTeams = useMemo(() => teams.filter((team) => {
    if (isLeader) {
      return team.leaderId === userId
    }

    return team.leaderId !== userId && team.members.some((member) => member.id === userId)
  }), [isLeader, teams, userId])

  return (
    <main className="space-y-6">
      <header className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="space-y-2">
          <p className="landing-label text-[0.68rem] text-[rgba(250,204,21,0.82)]">My Teams</p>
          <h1 className="landing-title text-3xl text-(--landing-text)">Teams</h1>
          <p className="landing-copy text-sm text-[rgba(226,226,232,0.65)]">
            {isLeader ? 'Teams you lead and are a member of.' : 'Teams you are currently a member of.'}
          </p>
        </div>
        {isLeader ? (
          <Button as={Link} to={routes.teamCreate} size="nav" className="shrink-0">
            + Create Team
          </Button>
        ) : null}
      </header>

      {error ? (
        <p className="rounded-2xl border border-[rgba(255,180,171,0.25)] bg-[rgba(255,180,171,0.08)] px-4 py-3 text-sm text-(--landing-danger)">
          {error}
        </p>
      ) : null}

      {isLeader && myTeams.length > 0 ? (
        <div className="flex">
          <Link
            to={routes.teamRequests}
            className="rounded-full border border-[rgba(77,70,50,0.28)] px-5 py-2.5 text-sm font-semibold text-[rgba(226,226,232,0.72)] transition-colors duration-200 hover:border-(--landing-gold) hover:text-(--landing-gold-soft)"
          >
            View Leave Requests
          </Link>
        </div>
      ) : null}

      {myTeams.length === 0 ? (
        <EmptyState
          title={isLeader ? 'No teams created yet' : 'No team memberships yet'}
          message={
            isLeader
              ? 'Create your first team when you are ready to recruit.'
              : 'You are not part of any teams yet. Browse competitions to find teams that are actively recruiting.'
          }
          action={(
            <div className="flex flex-col items-center justify-center gap-3 sm:flex-row">
              {isLeader ? (
                <Button as={Link} to={routes.teamCreate} size="nav">
                  Create Team
                </Button>
              ) : null}
              <Button as={Link} to={routes.competitions} variant="secondary" size="nav">
                Browse Competitions
              </Button>
            </div>
          )}
        />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2">
          {myTeams.map((team) => {
            const isTeamLeader = team.leaderId === user?.id
            return (
              <Link
                key={team.id}
                to={`/teams/${team.id}`}
                className="group block rounded-[1.5rem] border border-[rgba(77,70,50,0.22)] bg-[rgba(12,14,18,0.48)] p-5 transition-all duration-200 hover:border-(--landing-gold) hover:bg-[rgba(250,204,21,0.04)]"
              >
                <div className="mb-1 flex items-start justify-between gap-3">
                  <h2 className="landing-title text-[1.1rem] text-(--landing-text) transition-colors duration-200 group-hover:text-(--landing-gold-soft)">
                    {team.name}
                  </h2>
                  <span className={[
                    'shrink-0 rounded-full border px-2.5 py-1 text-[0.65rem] font-semibold uppercase',
                    isTeamLeader
                      ? 'border-(--landing-gold) bg-[rgba(250,204,21,0.1)] text-(--landing-gold)'
                      : 'border-[rgba(113,191,255,0.3)] bg-[rgba(113,191,255,0.08)] text-[rgba(113,191,255,0.9)]',
                  ].join(' ')}>
                    {isTeamLeader ? 'Leader' : 'Member'}
                  </span>
                </div>

                <p className="landing-copy mb-3 text-xs text-[rgba(226,226,232,0.5)]">{team.competitionTitle}</p>
                <p className="landing-copy mb-4 line-clamp-2 text-sm text-[rgba(226,226,232,0.7)]">{team.description}</p>

                <div className="flex items-center justify-between text-xs text-[rgba(226,226,232,0.5)]">
                  <span className="inline-flex items-center gap-2">
                    <Users aria-hidden="true" className="h-3.5 w-3.5" />
                    {team.members.length}/{team.totalSlots} members
                  </span>
                  {team.openSlots > 0 ? (
                    <span className="inline-flex items-center gap-2 text-[rgba(226,226,232,0.4)]">
                      <UserPlus aria-hidden="true" className="h-3.5 w-3.5" />
                      {team.openSlots} slot{team.openSlots !== 1 ? 's' : ''} open
                    </span>
                  ) : null}
                </div>
              </Link>
            )
          })}
        </div>
      )}

      <div className="rounded-[1.5rem] border border-[rgba(77,70,50,0.22)] bg-[rgba(12,14,18,0.32)] p-4">
        <p className="landing-copy text-sm text-[rgba(226,226,232,0.55)]">
          Looking to join a team?{' '}
          <Link className="text-(--landing-gold) hover:text-(--landing-gold-soft) transition-colors duration-200" to={routes.competitions}>
            Browse competitions
          </Link>
          {' '}and find recruiting teams on each competition&apos;s page.
        </p>
      </div>
    </main>
  )
}
