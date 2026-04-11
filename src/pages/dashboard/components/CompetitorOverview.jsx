import { ArrowRight, FolderOpen, Rocket, Users } from 'lucide-react'
import { Link } from 'react-router-dom'
import Card from '../../../components/ui/Card'
import { useAuth } from '../../../features/auth/hooks/useAuth'
import { competitorDashboard } from '../../../data/mocks/dashboard'
import { routes } from '../../../lib/constants/routes'

export default function CompetitorOverview() {
  const { user, applications } = useAuth()
  const dashboard = competitorDashboard[user?.id] ?? competitorDashboard.default

  return (
    <section className="space-y-6">
      <div className="space-y-3">
        <h2 className="landing-ui-text text-[0.82rem] text-(--landing-gold)">Competitor View</h2>
        <p className="landing-copy text-sm text-[rgba(226,226,232,0.72)] sm:text-base">
          Browse competitions, discover teams, and track every application from one student dashboard.
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

      <div className="grid gap-4 xl:grid-cols-[minmax(0,1.3fr)_minmax(280px,0.9fr)]">
        <Card className="space-y-4">
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="landing-ui-text text-[0.68rem] text-(--landing-gold)">Recent activity</p>
              <h3 className="landing-title text-xl text-(--landing-text)">Application timeline</h3>
            </div>
            <span className="inline-flex items-center gap-2 text-xs text-[rgba(226,226,232,0.5)]">
              <FolderOpen aria-hidden="true" className="h-3.5 w-3.5" />
              {applications.length} tracked requests
            </span>
          </div>

          {dashboard.recentActivity.length > 0 ? (
            <div className="grid gap-3">
              {dashboard.recentActivity.map((item) => (
                <div key={item.id} className="rounded-[1.2rem] border border-[rgba(77,70,50,0.18)] bg-[rgba(17,19,23,0.5)] px-4 py-3">
                  <p className="text-sm font-semibold text-(--landing-text)">{item.title}</p>
                  <p className="landing-copy mt-1 text-sm text-[rgba(226,226,232,0.58)]">{item.meta}</p>
                </div>
              ))}
            </div>
          ) : (
            <p className="landing-copy text-sm text-[rgba(226,226,232,0.55)]">
              No application activity yet. Start by browsing open competitions.
            </p>
          )}
        </Card>

        <Card className="space-y-4">
          <div>
            <p className="landing-ui-text text-[0.68rem] text-(--landing-gold)">Focus next</p>
            <h3 className="landing-title text-xl text-(--landing-text)">Quick wins</h3>
          </div>

          <div className="grid gap-3">
            {dashboard.highlights.map((item) => (
              <div key={item.id} className="rounded-[1.2rem] border border-[rgba(77,70,50,0.18)] bg-[rgba(17,19,23,0.5)] px-4 py-3">
                <p className="landing-ui-text text-[0.62rem] text-[rgba(226,226,232,0.48)]">{item.label}</p>
                <p className="mt-2 text-sm font-semibold text-(--landing-text)">{item.value}</p>
                <p className="landing-copy mt-1 text-sm text-[rgba(226,226,232,0.55)]">{item.note}</p>
              </div>
            ))}
          </div>

          <div className="flex flex-col gap-3 pt-1">
            <Link className="inline-flex items-center gap-2 text-sm font-semibold text-(--landing-gold) transition-colors duration-200 hover:text-(--landing-gold-soft)" to={routes.competitions}>
              <Rocket aria-hidden="true" className="h-4 w-4" />
              Explore competitions
            </Link>
            <Link className="inline-flex items-center gap-2 text-sm font-semibold text-(--landing-gold) transition-colors duration-200 hover:text-(--landing-gold-soft)" to={routes.teams}>
              <Users aria-hidden="true" className="h-4 w-4" />
              Review team openings
              <ArrowRight aria-hidden="true" className="h-4 w-4" />
            </Link>
          </div>
        </Card>
      </div>
    </section>
  )
}
