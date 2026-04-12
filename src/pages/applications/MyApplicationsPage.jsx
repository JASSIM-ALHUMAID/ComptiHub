import { ArrowRight, MessageSquareText } from 'lucide-react'
import { Link } from 'react-router-dom'
import EmptyState from '../../components/feedback/EmptyState'
import Card from '../../components/ui/Card'
import Badge from '../../components/ui/Badge'
import { useStudentRole } from '../../features/account/hooks/useStudentRole'
import { useAuth } from '../../features/auth/hooks/useAuth'
import { routes } from '../../lib/constants/routes'
import TeamRequestsPage from '../teams/TeamRequestsPage'

const statusVariants = {
  pending: 'gold',
  accepted: 'success',
  rejected: 'danger',
}

export default function MyApplicationsPage() {
  const { activeRole } = useStudentRole()
  const { applications } = useAuth()

  if (activeRole === 'teamLeader') {
    return <TeamRequestsPage />
  }

  return (
    <main className="space-y-6">
      <header className="space-y-2">
        <p className="landing-label text-[0.68rem] text-[rgba(250,204,21,0.82)]">Competitor</p>
        <h1 className="landing-title text-3xl text-(--landing-text)">My Applications</h1>
        <p className="landing-copy text-sm text-[rgba(226,226,232,0.65)]">
          Track all your team join requests and their current status.
        </p>
      </header>

      {applications.length === 0 ? (
        <EmptyState
          title="No applications yet"
          message="You have not applied to any teams yet. Browse competitions to find recruiting teams and start sending requests."
          actionLabel="Browse Competitions"
          actionTo={routes.competitions}
        />
      ) : (
        <div className="grid gap-4">
          {applications.map((app) => (
            <Card key={app.id} className="space-y-3">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h2 className="landing-title text-base text-(--landing-text)">{app.teamName}</h2>
                  <p className="mt-0.5 text-xs text-[rgba(226,226,232,0.5)]">{app.competitionTitle}</p>
                </div>
                <Badge
                  variant={statusVariants[app.status] || 'default'}
                  size="md"
                  className="shrink-0 capitalize"
                >
                  {app.status}
                </Badge>
              </div>

                <div className="rounded-2xl border border-[rgba(77,70,50,0.18)] bg-[rgba(17,19,23,0.5)] px-4 py-3">
                  <p className="landing-ui-text mb-1 inline-flex items-center gap-2 text-[0.65rem] text-[rgba(226,226,232,0.45)]">
                    <MessageSquareText aria-hidden="true" className="h-3.5 w-3.5" />
                    Your message
                  </p>
                  <p className="landing-copy text-sm text-[rgba(226,226,232,0.7)]">{app.message}</p>
                </div>

                <div className="flex items-center justify-between text-xs text-[rgba(226,226,232,0.45)]">
                  <span>Applied on {app.appliedAt}</span>
                  <Link
                    to={`/teams/${app.teamId}`}
                    className="inline-flex items-center gap-2 text-(--landing-gold) transition-colors duration-200 hover:text-(--landing-gold-soft)"
                  >
                    View team
                    <ArrowRight aria-hidden="true" className="h-3.5 w-3.5" />
                  </Link>
                </div>
              </Card>
          ))}
        </div>
      )}
    </main>
  )
}
