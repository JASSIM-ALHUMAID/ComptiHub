import { Link } from 'react-router-dom'
import { applications } from '../../data/mocks/applications'

const statusStyles = {
  pending: 'border-[rgba(250,204,21,0.3)] bg-[rgba(250,204,21,0.08)] text-(--landing-gold)',
  accepted: 'border-green-500/30 bg-green-500/10 text-green-400',
  rejected: 'border-[rgba(255,180,171,0.3)] bg-[rgba(255,180,171,0.08)] text-(--landing-danger)',
}

export default function MyApplicationsPage() {
  return (
    <main className="space-y-6">
      <header className="space-y-2">
        <p className="landing-label text-[0.68rem] text-[rgba(250,204,21,0.82)]">Competitor</p>
        <h1 className="landing-title text-3xl text-(--landing-text)">My Applications</h1>
        <p className="landing-copy text-sm text-[rgba(226,226,232,0.65)]">Track all your team join requests and their current status.</p>
      </header>

      {applications.length === 0 ? (
        <div className="rounded-[1.5rem] border border-[rgba(77,70,50,0.22)] bg-[rgba(12,14,18,0.48)] p-8 text-center">
          <p className="landing-copy text-sm text-[rgba(226,226,232,0.55)]">
            You haven't applied to any teams yet.{' '}
            <Link className="text-(--landing-gold) hover:text-(--landing-gold-soft)" to="/teams">Browse teams</Link>.
          </p>
        </div>
      ) : (
        <div className="grid gap-4">
          {applications.map((app) => (
            <div key={app.id} className="space-y-3 rounded-[1.5rem] border border-[rgba(77,70,50,0.22)] bg-[rgba(12,14,18,0.48)] p-5">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h2 className="landing-title text-base text-(--landing-text)">{app.teamName}</h2>
                  <p className="mt-0.5 text-xs text-[rgba(226,226,232,0.5)]">{app.competitionTitle}</p>
                </div>
                <span className={['shrink-0 rounded-full border px-3 py-1 text-xs font-semibold capitalize', statusStyles[app.status]].join(' ')}>
                  {app.status}
                </span>
              </div>
              <div className="rounded-2xl border border-[rgba(77,70,50,0.18)] bg-[rgba(17,19,23,0.5)] px-4 py-3">
                <p className="landing-ui-text mb-1 text-[0.65rem] text-[rgba(226,226,232,0.45)]">Your message</p>
                <p className="landing-copy text-sm text-[rgba(226,226,232,0.7)]">{app.message}</p>
              </div>
              <div className="flex items-center justify-between text-xs text-[rgba(226,226,232,0.45)]">
                <span>Applied on {app.appliedAt}</span>
                <Link to={`/teams/${app.teamId}`} className="text-(--landing-gold) transition-colors duration-200 hover:text-(--landing-gold-soft)">View team →</Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </main>
  )
}