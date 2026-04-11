import { useEffect, useState } from 'react'
import Button from '../../components/ui/Button'
import { storage } from '../../lib/utils/storage'

const KEY = 'compitihub.admin.users'

function read() {
  const data = storage.get(KEY)
  if (!data) return []
  try {
    return JSON.parse(data)
  } catch {
    return []
  }
}

function write(data) {
  storage.set(KEY, JSON.stringify(data))
}

export default function ModerationPage() {
  const [users, setUsers] = useState([])

  useEffect(() => {
    const existing = read()

    if (existing.length === 0) {
      const seed = [
        { id: '1', username: 'user1', email: 'user1@test.com', status: 'active' },
      ]
      write(seed)
      setUsers(seed)
    } else {
      setUsers(existing)
    }
  }, [])

  function updateStatus(id, status) {
    const next = users.map((u) =>
      u.id === id ? { ...u, status } : u
    )
    write(next)
    setUsers(next)
  }

  return (
    <main className="space-y-6">
      <h1 className="landing-title text-2xl">Moderation</h1>

      <div className="space-y-4">
        {users.map((u) => (
          <div key={u.id} className="rounded-[1.75rem] border border-[rgba(77,70,50,0.22)] bg-[rgba(12,14,18,0.48)] p-5 flex justify-between">
            <div>
              <p className="font-semibold">{u.username}</p>
              <p className="text-xs">{u.email}</p>
              <p className="text-xs">{u.status}</p>
            </div>

            <div className="flex gap-2">
              <Button size="nav" onClick={() => updateStatus(u.id, 'suspended')}>
                Suspend
              </Button>
              <Button size="nav" variant="secondary" onClick={() => updateStatus(u.id, 'banned')}>
                Ban
              </Button>
            </div>
          </div>
        ))}
      </div>
    </main>
  )
}