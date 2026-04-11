import { ClipboardList, ShieldCheck, Users } from 'lucide-react'
import { Link } from 'react-router-dom'
import Card from '../../../components/ui/Card'
import { useAuth } from '../../../features/auth/hooks/useAuth'
import { teamLeaderDashboard } from '../../../data/mocks/dashboard'
import { routes } from '../../../lib/constants/routes'

export default function TeamLeaderOverview() {
  const { user } = useAuth()
  const dashboard = teamLeaderDashboard[user?.id] ?? teamLeaderDashboard.default

  return (
    <section className="space-y-6">
      <div className="space-y-3">
        <h2 className="landing-ui-text text-[0.82rem] text-(--landing-gold)">Team Leader View</h2>
        <p className="landing-copy text-sm text-[rgba(226,226,232,0.72)] sm:text-base">
          Create teams, manage openings, and review incoming competitor requests without leaving the same account.
        </p>
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        {dashboard.stats.map((stat) => (
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

          {dashboard.queue.length > 0 ? (
            <div className="grid gap-3">
              {dashboard.queue.map((item) => (
                <div key={item.id} className="rounded-[1.2rem] border border-[rgba(77,70,50,0.18)] bg-[rgba(17,19,23,0.5)] px-4 py-3">
                  <p className="text-sm font-semibold text-(--landing-text)">{item.title}</p>
                  <p className="landing-copy mt-1 text-sm text-[rgba(226,226,232,0.58)]">{item.meta}</p>
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
            {dashboard.milestones.map((item) => (
              <div key={item.id} className="rounded-[1.2rem] border border-[rgba(77,70,50,0.18)] bg-[rgba(17,19,23,0.5)] px-4 py-3">
                <p className="landing-ui-text text-[0.62rem] text-[rgba(226,226,232,0.48)]">{item.label}</p>
                <p className="mt-2 text-sm font-semibold text-(--landing-text)">{item.value}</p>
                <p className="landing-copy mt-1 text-sm text-[rgba(226,226,232,0.55)]">{item.note}</p>
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
