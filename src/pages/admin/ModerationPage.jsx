import { useEffect, useState } from 'react'
import Button from '../../components/ui/Button'
import { users as mockUsers } from '../../data/mocks/user'

export default function ModerationPage() {
  const [users, setUsers] = useState([])

  useEffect(() => {
    setUsers(mockUsers.filter((user) => user.accountType !== 'admin'))
  }, [])

  function updateStatus(id, status) {
    setUsers((currentUsers) =>
      currentUsers.map((user) =>
        user.id === id
          ? {
              ...user,
              status,
            }
          : user,
      ),
    )
  }

  return (
    <main className="space-y-6">
      <header className="space-y-2">
        <p className="landing-label text-[0.68rem] text-[rgba(250,204,21,0.82)]">Admin</p>
        <h1 className="landing-title text-3xl text-(--landing-text)">Moderation</h1>
      </header>

      <div className="space-y-4">
        {users.map((user) => {
          const status = user.status || 'active'

          return (
            <div
              key={user.id}
              className="rounded-[1.75rem] border border-[rgba(77,70,50,0.22)] bg-[rgba(12,14,18,0.48)] p-5 flex justify-between"
            >
              <div>
                <p className="font-semibold">{user.username}</p>
                <p className="text-xs text-[rgba(226,226,232,0.6)]">{user.email}</p>
                <p className="text-xs">{user.accountType}</p>
                <p className="text-xs">Status: {status}</p>
              </div>

              <div className="flex gap-2">
                {status !== 'active' ? (
                  <Button size="nav" onClick={() => updateStatus(user.id, 'active')}>
                    Activate
                  </Button>
                ) : null}

                {status !== 'suspended' ? (
                  <Button size="nav" onClick={() => updateStatus(user.id, 'suspended')}>
                    Suspend
                  </Button>
                ) : null}

                {status !== 'banned' ? (
                  <Button size="nav" variant="secondary" onClick={() => updateStatus(user.id, 'banned')}>
                    Ban
                  </Button>
                ) : null}
              </div>
            </div>
          )
        })}
      </div>
    </main>
  )
}