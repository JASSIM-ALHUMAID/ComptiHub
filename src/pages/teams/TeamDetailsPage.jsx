import { useEffect, useMemo, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import Badge from '../../components/ui/Badge'
import Button from '../../components/ui/Button'
import { useAuth } from '../../features/auth/hooks/useAuth'
import { teamService } from '../../features/teams/services/teamService'
import { routes } from '../../lib/constants/routes'

export default function TeamDetailsPage() {
  const { teamId } = useParams()
  const { user } = useAuth()
  const [team, setTeam] = useState(null)
  const [error, setError] = useState('')
  const [leaveFeedback, setLeaveFeedback] = useState('')

  useEffect(() => {
    let isCancelled = false

    async function loadTeam() {
      try {
        const nextTeam = await teamService.getTeamById(teamId)

        if (!isCancelled) {
          setTeam(nextTeam)
        }
      } catch (loadError) {
        if (!isCancelled) {
          setError(loadError.message || 'Team not found.')
        }
      }
    }

    loadTeam()

    return () => {
      isCancelled = true
    }
  }, [teamId])

  const memberList = useMemo(() => team?.members ?? [], [team])
  const isLeaderView = team?.leaderId === user?.id
  const isCurrentUserMember = memberList.some((member) => member.id === user?.id)
  const canRequestLeave = Boolean(team && isCurrentUserMember && !isLeaderView && team.status !== 'archived')

  async function handleLeaveRequest() {
    if (!team) {
      return
    }

    try {
      await teamService.createLeaveRequest(team.id)
      setLeaveFeedback('Leave request submitted.')
    } catch (requestError) {
      setLeaveFeedback(requestError.message || 'Unable to submit leave request.')
    }
  }

  if (!team) {
    return (
      <main className="space-y-4">
        <p className="landing-copy text-sm text-[rgba(226,226,232,0.65)]">{error || 'Team not found.'}</p>
        <Link className="text-sm text-(--landing-gold) hover:text-(--landing-gold-soft)" to={routes.teams}>
          Back to my teams
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
          <span className={[
            'rounded-full border px-3 py-1.5 text-xs font-semibold uppercase',
            team.status === 'recruiting'
              ? 'border-green-500/30 bg-green-500/10 text-green-400'
              : 'border-[rgba(77,70,50,0.3)] text-[rgba(226,226,232,0.45)]',
          ].join(' ')}>
            {team.status}
          </span>
        </div>
        <p className="landing-copy text-sm text-[rgba(226,226,232,0.55)]">
          Competing in:{' '}
          <Link className="text-(--landing-gold) hover:text-(--landing-gold-soft)" to={`/competitions/${team.competitionId}`}>
            {team.competitionTitle}
          </Link>
        </p>
      </header>

      {canRequestLeave ? (
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <Button type="button" variant="secondary" onClick={handleLeaveRequest}>
            Request to Leave Team
          </Button>
          {leaveFeedback ? <span className="text-sm text-[rgba(226,226,232,0.65)]">{leaveFeedback}</span> : null}
        </div>
      ) : leaveFeedback ? <p className="text-sm text-[rgba(226,226,232,0.65)]">{leaveFeedback}</p> : null}

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
          <span className="text-xs text-[rgba(226,226,232,0.5)]">{memberList.length}/{team.totalSlots}</span>
        </div>
        <div className="grid gap-2">
          {memberList.map((member) => (
            <div
              key={member.id}
              className={[
                'rounded-2xl border px-4 py-3 transition-colors duration-200',
                member.id === user?.id
                  ? 'border-(--landing-gold) bg-[rgba(250,204,21,0.08)]'
                  : 'border-[rgba(77,70,50,0.18)] bg-[rgba(17,19,23,0.5)]',
              ].join(' ')}
            >
              <div className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-2">
                  <span className={[
                    'text-sm font-semibold',
                    member.id === user?.id ? 'text-(--landing-gold-soft)' : 'text-(--landing-text)',
                  ].join(' ')}>
                    {member.username}
                  </span>
                  {member.id === user?.id ? (
                    <span className="rounded-full bg-[rgba(250,204,21,0.15)] px-2 py-0.5 text-[0.6rem] font-semibold text-(--landing-gold)">
                      You
                    </span>
                  ) : null}
                </div>
                <span className="text-xs text-[rgba(226,226,232,0.5)]">{member.role}</span>
              </div>

              {isLeaderView ? (
                <div className="mt-3 flex flex-wrap gap-1.5">
                  {member.skills.length > 0 ? (
                    member.skills.map((skill) => (
                      <span
                        key={`${member.id}-${skill}`}
                        className="rounded-full border border-[rgba(77,70,50,0.3)] bg-[rgba(12,14,18,0.6)] px-2 py-0.5 text-[0.65rem] text-[rgba(226,226,232,0.65)]"
                      >
                        {skill}
                      </span>
                    ))
                  ) : (
                    <span className="text-xs text-[rgba(226,226,232,0.42)]">No skills added</span>
                  )}
                </div>
              ) : null}
            </div>
          ))}
          {Array.from({ length: Math.max(0, team.totalSlots - memberList.length) }).map((_, index) => (
            <div
              key={`open-${index}`}
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
