import { useEffect, useMemo, useState } from 'react'
import { useStudentRole } from '../../features/account/hooks/useStudentRole'
import EmptyState from '../../components/feedback/EmptyState'
import { routes } from '../../lib/constants/routes'
import { teamService } from '../../features/teams/services/teamService'

export default function TeamRequestsPage() {
  const { activeRole } = useStudentRole()
  const [requests, setRequests] = useState([])
  const [error, setError] = useState('')

  useEffect(() => {
    let isCancelled = false

    async function loadRequests() {
      try {
        const nextRequests = await teamService.listIncomingLeaveRequests()

        if (!isCancelled) {
          setRequests(nextRequests)
        }
      } catch (loadError) {
        if (!isCancelled) {
          setError(loadError.message || 'Unable to load leave requests.')
        }
      }
    }

    loadRequests()

    return () => {
      isCancelled = true
    }
  }, [])

  async function updateStatus(id, status) {
    try {
      await teamService.reviewLeaveRequest(id, status)
      setRequests((currentRequests) => currentRequests.map((request) => (
        request.id === id ? { ...request, status } : request
      )))
      setError('')
    } catch (reviewError) {
      setError(reviewError.message || 'Unable to review leave request.')
    }
  }

  if (activeRole !== 'teamLeader') {
    return (
      <main>
        <p className="landing-copy text-sm text-[rgba(226,226,232,0.65)]">This page is only available in Team Leader view.</p>
      </main>
    )
  }

  const pending = useMemo(() => requests.filter((request) => request.status === 'pending'), [requests])
  const reviewed = useMemo(() => requests.filter((request) => request.status !== 'pending'), [requests])

  return (
    <main className="space-y-6">
      <header className="space-y-2">
        <p className="landing-label text-[0.68rem] text-[rgba(250,204,21,0.82)]">Team Leader</p>
        <h1 className="landing-title text-3xl text-(--landing-text)">Leave Requests</h1>
        <p className="landing-copy text-sm text-[rgba(226,226,232,0.65)]">Review competitor requests to leave your teams.</p>
      </header>

      {error ? (
        <p className="rounded-2xl border border-[rgba(255,180,171,0.25)] bg-[rgba(255,180,171,0.08)] px-4 py-3 text-sm text-(--landing-danger)">
          {error}
        </p>
      ) : null}

      {pending.length === 0 && reviewed.length === 0 ? (
        <EmptyState
          title="No leave requests yet"
          message="Your team roster is stable right now. Leave requests will appear here when members submit them."
          actionLabel="Back to Teams"
          actionTo={routes.teams}
        />
      ) : null}

      {pending.length > 0 ? (
        <section className="space-y-3">
          <h2 className="landing-ui-text text-[0.78rem] text-(--landing-gold)">Pending ({pending.length})</h2>
          <div className="grid gap-4">
            {pending.map((request) => (
              <div key={request.id} className="space-y-3 rounded-[1.5rem] border border-[rgba(77,70,50,0.22)] bg-[rgba(12,14,18,0.48)] p-5">
                <div>
                  <p className="font-semibold text-(--landing-text)">{request.requesterName}</p>
                  <p className="text-xs text-[rgba(226,226,232,0.5)]">
                    Team: {request.teamName} | {request.competitionTitle}
                  </p>
                </div>
                <div className="flex gap-3 pt-1">
                  <button type="button" onClick={() => updateStatus(request.id, 'approved')} className="rounded-full border border-green-500/40 bg-green-500/10 px-5 py-2 text-sm font-semibold text-green-400 transition-colors duration-200 hover:bg-green-500/20">Approve</button>
                  <button type="button" onClick={() => updateStatus(request.id, 'rejected')} className="rounded-full border border-[rgba(255,180,171,0.3)] bg-[rgba(255,180,171,0.08)] px-5 py-2 text-sm font-semibold text-(--landing-danger) transition-colors duration-200 hover:bg-[rgba(255,180,171,0.14)]">Reject</button>
                </div>
              </div>
            ))}
          </div>
        </section>
      ) : null}

      {reviewed.length > 0 ? (
        <section className="space-y-3">
          <h2 className="landing-ui-text text-[0.78rem] text-[rgba(226,226,232,0.45)]">Reviewed</h2>
          <div className="grid gap-3">
            {reviewed.map((request) => (
              <div key={request.id} className="flex items-center justify-between rounded-[1.5rem] border border-[rgba(77,70,50,0.15)] bg-[rgba(12,14,18,0.32)] px-5 py-4">
                <div>
                  <p className="text-sm font-semibold text-[rgba(226,226,232,0.65)]">{request.requesterName}</p>
                  <p className="text-xs text-[rgba(226,226,232,0.4)]">{request.teamName}</p>
                </div>
                <span className={[
                  'rounded-full border px-3 py-1 text-xs font-semibold uppercase',
                  request.status === 'approved'
                    ? 'border-green-500/30 bg-green-500/10 text-green-400'
                    : 'border-[rgba(255,180,171,0.3)] bg-[rgba(255,180,171,0.08)] text-(--landing-danger)',
                ].join(' ')}>
                  {request.status}
                </span>
              </div>
            ))}
          </div>
        </section>
      ) : null}
    </main>
  )
}
