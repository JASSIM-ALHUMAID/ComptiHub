import { useEffect, useState } from 'react'
import { ClipboardList, ShieldCheck, Users } from 'lucide-react'
import { Link } from 'react-router-dom'
import Card from '../../../components/ui/Card'
import LoadingState from '../../../components/feedback/LoadingState'
import { teamService } from '../../../features/teams/services/teamService'
import { routes } from '../../../lib/constants/routes'

export default function TeamLeaderOverview() {
  const [teams, setTeams] = useState([])
  const [leaveRequests, setLeaveRequests] = useState([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    let isCancelled = false

    async function loadData() {
      try {
        setIsLoading(true)
        const [myTeams, incomingRequests] = await Promise.all([
          teamService.listMyTeams(),
          teamService.listIncomingLeaveRequests(),
        ])

        if (!isCancelled) {
          setTeams(myTeams)
          setLeaveRequests(incomingRequests)
        }
      } catch (error) {
        console.error('Failed to load team leader data:', error)
      } finally {
        if (!isCancelled) {
          setIsLoading(false)
        }
      }
    }

    loadData()

    return () => {
      isCancelled = true
    }
  }, [])

  const managedTeams = teams.length
  const openSlots = teams.reduce((total, team) => total + team.openSlots, 0)
  const pendingRequests = leaveRequests.filter((req) => req.status === 'pending').length

  if (isLoading) {
    return <LoadingState title="Loading team leader dashboard..." />
  }

  const stats = [
    { id: 'managed-teams', label: 'Managed Teams', value: managedTeams.toString(), note: 'Teams led by your account' },
    { id: 'open-slots', label: 'Open Slots', value: openSlots.toString(), note: 'Recruiting positions available' },
    { id: 'join-requests', label: 'Pending Requests', value: pendingRequests.toString(), note: 'Applicants awaiting review' },
  ]

  return (
    <section className="space-y-6">
      <div className="space-y-3">
        <h2 className="landing-ui-text text-[0.82rem] text-(--landing-gold)">Team Leader View</h2>
        <p className="landing-copy text-sm text-[rgba(226,226,232,0.72)] sm:text-base">
          Create teams, manage openings, and review incoming competitor requests without leaving the same account.
        </p>
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        {stats.map((stat) => (
          <Card key={stat.id} className="space-y-3">
            <p className="landing-ui-text text-[0.68rem] text-[rgba(226,226,232,0.5)]">{stat.label}</p>
            <p className="text-3xl font-black tracking-tight text-(--landing-text)">{stat.value}</p>
            <p className="landing-copy text-sm text-[rgba(226,226,232,0.62)]">{stat.note}</p>
          </Card>
        ))}
      </div>

      <div className="grid gap-4 xl:grid-cols-[minmax(0,1.2fr)_minmax(280px,0.95fr)]">
        <Card className="space-y-4">
          <div>
            <p className="landing-ui-text text-[0.68rem] text-(--landing-gold)">Review queue</p>
            <h3 className="landing-title text-xl text-(--landing-text)">Pending actions</h3>
          </div>

          {leaveRequests.filter((req) => req.status === 'pending').length > 0 ? (
            <div className="grid gap-3">
              {leaveRequests
                .filter((req) => req.status === 'pending')
                .slice(0, 2)
                .map((item) => (
                  <div key={item.id} className="rounded-[1.2rem] border border-[rgba(77,70,50,0.18)] bg-[rgba(17,19,23,0.5)] px-4 py-3">
                    <p className="text-sm font-semibold text-(--landing-text)">{item.requesterName}</p>
                    <p className="landing-copy mt-1 text-sm text-[rgba(226,226,232,0.58)]">{item.teamName}</p>
                  </div>
                ))}
            </div>
          ) : (
            <p className="landing-copy text-sm text-[rgba(226,226,232,0.55)]">
              No pending requests yet. Create a recruiting team to start receiving applicants.
            </p>
          )}

          <Link className="inline-flex items-center gap-2 text-sm font-semibold text-(--landing-gold) transition-colors duration-200 hover:text-(--landing-gold-soft)" to={routes.teamRequests}>
            <ClipboardList aria-hidden="true" className="h-4 w-4" />
            Open join requests
          </Link>
        </Card>

        <Card className="space-y-4">
          <div>
            <p className="landing-ui-text text-[0.68rem] text-(--landing-gold)">Team readiness</p>
            <h3 className="landing-title text-xl text-(--landing-text)">Milestones</h3>
          </div>

          <div className="grid gap-3">
            {teams.slice(0, 2).map((team) => (
              <div key={team.id} className="rounded-[1.2rem] border border-[rgba(77,70,50,0.18)] bg-[rgba(17,19,23,0.5)] px-4 py-3">
                <p className="landing-ui-text text-[0.62rem] text-[rgba(226,226,232,0.48)]">{team.name}</p>
                <p className="mt-2 text-sm font-semibold text-(--landing-text)">
                  {team.members.length} / {team.totalSlots} members
                </p>
                <p className="landing-copy mt-1 text-sm text-[rgba(226,226,232,0.55)]">
                  {team.openSlots === 0 ? 'Team is full' : `${team.openSlots} slot${team.openSlots === 1 ? '' : 's'} available`}
                </p>
              </div>
            ))}
          </div>

          <div className="flex flex-col gap-3 pt-1">
            <Link className="inline-flex items-center gap-2 text-sm font-semibold text-(--landing-gold) transition-colors duration-200 hover:text-(--landing-gold-soft)" to={routes.teams}>
              <Users aria-hidden="true" className="h-4 w-4" />
              Review team roster
            </Link>
            <Link className="inline-flex items-center gap-2 text-sm font-semibold text-(--landing-gold) transition-colors duration-200 hover:text-(--landing-gold-soft)" to={routes.teamCreate}>
              <ShieldCheck aria-hidden="true" className="h-4 w-4" />
              Create another team
            </Link>
          </div>
        </Card>
      </div>
    </section>
  )
}
