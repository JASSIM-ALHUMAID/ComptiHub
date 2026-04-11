import { useState } from 'react'
import { useStudentRole } from '../../features/account/hooks/useStudentRole'

const mockRequests = [
  {
    id: 'req-1',
    teamName: 'ByteForge',
    applicantName: 'Yousef Al-Salem',
    message: 'I have strong experience in competitive programming and have solved 400+ problems on Codeforces.',
    skills: ['C++', 'Algorithms', 'Graph Theory'],
    appliedAt: '2025-04-02',
    status: 'pending',
  },
  {
    id: 'req-2',
    teamName: 'NovaBuild',
    applicantName: 'Dana Mirza',
    message: 'I am a UI/UX designer with 2 years of Figma experience and a strong portfolio.',
    skills: ['Figma', 'UI/UX', 'React'],
    appliedAt: '2025-04-03',
    status: 'pending',
  },
]

export default function TeamRequestsPage() {
  const { activeRole } = useStudentRole()
  const [requests, setRequests] = useState(mockRequests)

  function updateStatus(id, status) {
    setRequests((prev) => prev.map((r) => (r.id === id ? { ...r, status } : r)))
  }

  if (activeRole !== 'teamLeader') {
    return (
      <main>
        <p className="landing-copy text-sm text-[rgba(226,226,232,0.65)]">This page is only available in Team Leader view.</p>
      </main>
    )
  }

  const pending = requests.filter((r) => r.status === 'pending')
  const reviewed = requests.filter((r) => r.status !== 'pending')

  return (
    <main className="space-y-6">
      <header className="space-y-2">
        <p className="landing-label text-[0.68rem] text-[rgba(250,204,21,0.82)]">Team Leader</p>
        <h1 className="landing-title text-3xl text-(--landing-text)">Join Requests</h1>
        <p className="landing-copy text-sm text-[rgba(226,226,232,0.65)]">Review and respond to competitors who want to join your teams.</p>
      </header>

      {pending.length === 0 && reviewed.length === 0 && (
        <div className="rounded-[1.5rem] border border-[rgba(77,70,50,0.22)] bg-[rgba(12,14,18,0.48)] p-8 text-center">
          <p className="landing-copy text-sm text-[rgba(226,226,232,0.55)]">No requests yet.</p>
        </div>
      )}

      {pending.length > 0 && (
        <section className="space-y-3">
          <h2 className="landing-ui-text text-[0.78rem] text-(--landing-gold)">Pending ({pending.length})</h2>
          <div className="grid gap-4">
            {pending.map((req) => (
              <div key={req.id} className="space-y-3 rounded-[1.5rem] border border-[rgba(77,70,50,0.22)] bg-[rgba(12,14,18,0.48)] p-5">
                <div>
                  <p className="font-semibold text-(--landing-text)">{req.applicantName}</p>
                  <p className="text-xs text-[rgba(226,226,232,0.5)]">For team: {req.teamName} · {req.appliedAt}</p>
                </div>
                <p className="landing-copy text-sm text-[rgba(226,226,232,0.72)]">{req.message}</p>
                <div className="flex flex-wrap gap-1.5">
                  {req.skills.map((skill) => (
                    <span key={skill} className="rounded-full border border-[rgba(77,70,50,0.3)] bg-[rgba(12,14,18,0.6)] px-2 py-0.5 text-[0.65rem] text-[rgba(226,226,232,0.65)]">{skill}</span>
                  ))}
                </div>
                <div className="flex gap-3 pt-1">
                  <button type="button" onClick={() => updateStatus(req.id, 'accepted')} className="rounded-full border border-green-500/40 bg-green-500/10 px-5 py-2 text-sm font-semibold text-green-400 transition-colors duration-200 hover:bg-green-500/20">Accept</button>
                  <button type="button" onClick={() => updateStatus(req.id, 'rejected')} className="rounded-full border border-[rgba(255,180,171,0.3)] bg-[rgba(255,180,171,0.08)] px-5 py-2 text-sm font-semibold text-(--landing-danger) transition-colors duration-200 hover:bg-[rgba(255,180,171,0.14)]">Decline</button>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {reviewed.length > 0 && (
        <section className="space-y-3">
          <h2 className="landing-ui-text text-[0.78rem] text-[rgba(226,226,232,0.45)]">Reviewed</h2>
          <div className="grid gap-3">
            {reviewed.map((req) => (
              <div key={req.id} className="flex items-center justify-between rounded-[1.5rem] border border-[rgba(77,70,50,0.15)] bg-[rgba(12,14,18,0.32)] px-5 py-4">
                <div>
                  <p className="text-sm font-semibold text-[rgba(226,226,232,0.65)]">{req.applicantName}</p>
                  <p className="text-xs text-[rgba(226,226,232,0.4)]">{req.teamName}</p>
                </div>
                <span className={['rounded-full border px-3 py-1 text-xs font-semibold uppercase', req.status === 'accepted' ? 'border-green-500/30 bg-green-500/10 text-green-400' : 'border-[rgba(255,180,171,0.3)] bg-[rgba(255,180,171,0.08)] text-(--landing-danger)'].join(' ')}>
                  {req.status}
                </span>
              </div>
            ))}
          </div>
        </section>
      )}
    </main>
  )
}