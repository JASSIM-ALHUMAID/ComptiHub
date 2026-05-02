import { useEffect, useMemo, useRef, useState } from 'react'
import { useStudentRole } from '../../features/account/hooks/useStudentRole'
import { useAuth } from '../../features/auth/hooks/useAuth'
import EmptyState from '../../components/feedback/EmptyState'
import { routes } from '../../lib/constants/routes'
import { applicationService } from '../../features/applications/services/applicationService'

export default function TeamRequestsPage() {
  const { activeRole } = useStudentRole()
  const { user } = useAuth()
  const [requests, setRequests] = useState([])
  const [error, setError] = useState('')
  const [reviewingIds, setReviewingIds] = useState(new Set())
  const reviewingIdsRef = useRef(new Set())

  useEffect(() => {
    let isCancelled = false

    if (activeRole !== 'teamLeader' || !user) {
      setRequests([])
      setError('')
      return () => {
        isCancelled = true
      }
    }

    async function loadRequests() {
      try {
        const [pendingRequests, acceptedRequests, rejectedRequests] = await Promise.all([
          applicationService.listIncomingApplications({ status: 'pending' }),
          applicationService.listIncomingApplications({ status: 'accepted' }),
          applicationService.listIncomingApplications({ status: 'rejected' }),
        ])

        if (!isCancelled) {
          setRequests([...pendingRequests, ...acceptedRequests, ...rejectedRequests])
          setError('')
        }
      } catch (loadError) {
        if (!isCancelled) {
          setError(loadError.message || 'Unable to load team applications.')
        }
      }
    }

    loadRequests()

    return () => {
      isCancelled = true
    }
  }, [activeRole, user])

  async function updateStatus(id, status) {
    if (!user) {
      return
    }

    if (reviewingIdsRef.current.has(id)) {
      return
    }

    reviewingIdsRef.current = new Set(reviewingIdsRef.current).add(id)
    setReviewingIds(reviewingIdsRef.current)

    try {
      const reviewedApplication = await applicationService.reviewApplication(id, status)
      setRequests((currentRequests) => currentRequests.map((request) => (
        request.id === id
          ? {
            ...request,
            ...reviewedApplication,
            requesterName: reviewedApplication.requesterName ?? request.requesterName,
            applicant: reviewedApplication.applicant ?? request.applicant,
            skills: reviewedApplication.skills ?? request.skills,
          }
          : request
      )))
      setError('')
    } catch (reviewError) {
      setError(reviewError.message || 'Unable to review team application.')
    } finally {
      const nextReviewingIds = new Set(reviewingIdsRef.current)
      nextReviewingIds.delete(id)
      reviewingIdsRef.current = nextReviewingIds
      setReviewingIds(nextReviewingIds)
    }
  }

  const pending = useMemo(() => requests.filter((request) => request.status === 'pending'), [requests])
  const reviewed = useMemo(() => requests.filter((request) => request.status !== 'pending'), [requests])

  if (activeRole !== 'teamLeader') {
    return (
      <main>
        <p className="landing-copy text-sm text-[rgba(226,226,232,0.65)]">This page is only available in Team Leader view.</p>
      </main>
    )
  }

  return (
    <main className="space-y-6">
      <header className="space-y-2">
        <p className="landing-label text-[0.68rem] text-[rgba(250,204,21,0.82)]">Team Leader</p>
        <h1 className="landing-title text-3xl text-(--landing-text)">Team Applications</h1>
        <p className="landing-copy text-sm text-[rgba(226,226,232,0.65)]">Review competitor join applications for your teams.</p>
      </header>

      {error ? (
        <p className="rounded-2xl border border-[rgba(255,180,171,0.25)] bg-[rgba(255,180,171,0.08)] px-4 py-3 text-sm text-(--landing-danger)">
          {error}
        </p>
      ) : null}

      {pending.length === 0 && reviewed.length === 0 ? (
        <EmptyState
          title="No team applications yet"
          message="Join applications will appear here when competitors apply to your teams."
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
                  <button type="button" disabled={reviewingIds.has(request.id)} onClick={() => updateStatus(request.id, 'accepted')} className="rounded-full border border-green-500/40 bg-green-500/10 px-5 py-2 text-sm font-semibold text-green-400 transition-colors duration-200 hover:bg-green-500/20 disabled:cursor-not-allowed disabled:opacity-50">Approve</button>
                  <button type="button" disabled={reviewingIds.has(request.id)} onClick={() => updateStatus(request.id, 'rejected')} className="rounded-full border border-[rgba(255,180,171,0.3)] bg-[rgba(255,180,171,0.08)] px-5 py-2 text-sm font-semibold text-(--landing-danger) transition-colors duration-200 hover:bg-[rgba(255,180,171,0.14)] disabled:cursor-not-allowed disabled:opacity-50">Reject</button>
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
                  request.status === 'accepted'
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
