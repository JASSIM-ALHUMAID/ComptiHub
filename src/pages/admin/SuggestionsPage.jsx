import { useState } from 'react'
import Button from '../../components/ui/Button'

export default function SuggestionsPage() {
  const [suggestions, setSuggestions] = useState([
    {
      id: 'sug-1',
      title: 'AI in Education Hackathon',
      organizer: 'KFUPM',
      category: 'Hackathon',
      mode: 'Team',
      teamSize: '3–5',
      deadline: '2025-08-01',
      prize: 'SAR 20,000',
      description: 'AI solutions for education.',
      status: 'pending',
    },
  ])

  function updateStatus(id, status) {
    setSuggestions((prev) =>
      prev.map((s) => (s.id === id ? { ...s, status } : s))
    )
  }

  return (
    <main className="space-y-6">
      <h1 className="landing-title text-2xl">Suggestions</h1>

      <div className="space-y-4">
        {suggestions.map((s) => (
          <div key={s.id} className="rounded-[1.75rem] border border-[rgba(77,70,50,0.22)] bg-[rgba(12,14,18,0.48)] p-5">
            <p className="font-semibold">{s.title}</p>
            <p className="text-sm">{s.description}</p>

            <div className="text-xs mt-2 space-y-1">
              <p>Organizer: {s.organizer}</p>
              <p>Category: {s.category}</p>
              <p>Mode: {s.mode}</p>
              <p>Team Size: {s.teamSize}</p>
              <p>Deadline: {s.deadline}</p>
              <p>Prize: {s.prize}</p>
              <p>Status: {s.status}</p>
            </div>

            {s.status === 'pending' && (
              <div className="flex gap-2 mt-3">
                <Button size="nav" onClick={() => updateStatus(s.id, 'approved')}>
                  Approve
                </Button>
                <Button size="nav" variant="secondary" onClick={() => updateStatus(s.id, 'rejected')}>
                  Reject
                </Button>
              </div>
            )}
          </div>
        ))}
      </div>
    </main>
  )
}