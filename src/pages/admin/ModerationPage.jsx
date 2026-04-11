import {
  AlertTriangle,
  Gavel,
  Search,
  Settings2,
  ShieldAlert,
  ShieldCheck,
  X,
} from 'lucide-react'
import { useMemo, useState } from 'react'
import Button from '../../components/ui/Button'
import Input from '../../components/ui/Input'
import Modal from '../../components/ui/Modal'
import Select from '../../components/ui/Select'
import { adminModerationUsers as seededUsers } from '../../data/mocks/adminModeration'

const initialActionForm = {
  penalty: 'Suspend',
  duration: '1 Week',
  reason: '',
  confirmed: false,
}

function getStatusClasses(status) {
  if (status === 'Flagged') {
    return 'border-[rgba(255,180,171,0.22)] bg-[rgba(255,180,171,0.08)] text-[var(--admin-danger)]'
  }

  if (status === 'Monitored') {
    return 'border-[rgba(250,204,21,0.24)] bg-[rgba(250,204,21,0.08)] text-[var(--admin-gold-soft)]'
  }

  return 'border-[rgba(74,222,128,0.24)] bg-[rgba(74,222,128,0.08)] text-[#7bf1a2]'
}

function ModerationModal({ form, open, targetUser, onChange, onClose, onSubmit }) {
  return (
    <Modal open={open} onBackdropClick={onClose} className="bg-[rgba(12,14,18,0.76)] backdrop-blur-sm">
      <div className="flex min-h-screen items-center justify-center p-4">
        <div className="w-full max-w-2xl overflow-hidden rounded-[1.6rem] border border-[rgba(77,70,50,0.24)] bg-[rgba(17,19,23,0.98)] shadow-[0_24px_80px_rgba(0,0,0,0.42)]">
          <div className="flex items-start justify-between gap-4 border-b border-[rgba(77,70,50,0.18)] p-6 sm:p-8">
            <div className="space-y-2">
              <p className="admin-ui-text inline-flex items-center gap-2 text-[0.66rem] text-[var(--admin-danger)]">
                <AlertTriangle className="h-4 w-4" />
                Disciplinary action
              </p>
              <h2 className="admin-title text-2xl text-[var(--admin-text)] sm:text-3xl">Moderation protocol</h2>
            </div>
            <button
              aria-label="Close moderation modal"
              className="rounded-full border border-[rgba(77,70,50,0.24)] p-3 text-[rgba(209,198,171,0.76)] transition-colors duration-200 hover:border-[rgba(250,204,21,0.3)] hover:text-[var(--admin-gold-soft)]"
              type="button"
              onClick={onClose}
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {targetUser ? (
            <form className="space-y-6 p-6 sm:p-8" onSubmit={onSubmit}>
              <div className="flex items-center gap-4 rounded-[1.3rem] border border-[rgba(77,70,50,0.18)] bg-[rgba(12,14,18,0.64)] p-4">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-[rgba(250,204,21,0.08)] text-[var(--admin-gold)]">
                  <ShieldAlert className="h-7 w-7" />
                </div>
                <div className="space-y-1">
                  <p className="admin-ui-text text-[0.62rem] text-[rgba(209,198,171,0.66)]">Target subject</p>
                  <h3 className="text-xl font-bold text-[var(--admin-text)]">{targetUser.name}</h3>
                  <div className="flex flex-wrap gap-2 text-xs">
                    <span className="rounded-full bg-[rgba(250,204,21,0.12)] px-3 py-1 text-[var(--admin-gold-soft)]">
                      {targetUser.role}
                    </span>
                    <span className="rounded-full border border-[rgba(77,70,50,0.24)] px-3 py-1 text-[rgba(209,198,171,0.72)]">
                      ID: {targetUser.id}
                    </span>
                  </div>
                </div>
              </div>

              <div className="grid gap-6 md:grid-cols-2">
                <label className="space-y-2">
                  <span className="admin-ui-text text-[0.66rem] text-[rgba(209,198,171,0.76)]">Penalty classification</span>
                  <Select name="penalty" value={form.penalty} onChange={onChange}>
                    <option>Suspend</option>
                    <option>Ban</option>
                    <option>Formal Warning</option>
                  </Select>
                </label>
                <label className="space-y-2">
                  <span className="admin-ui-text text-[0.66rem] text-[rgba(209,198,171,0.76)]">Restriction duration</span>
                  <Select name="duration" value={form.duration} onChange={onChange}>
                    <option>1 Day</option>
                    <option>1 Week</option>
                    <option>1 Month</option>
                    <option>Permanent</option>
                  </Select>
                </label>
              </div>

              <label className="space-y-2">
                <span className="admin-ui-text text-[0.66rem] text-[rgba(209,198,171,0.76)]">Justification / reason</span>
                <textarea
                  className="min-h-36 w-full rounded-[1.3rem] border border-[rgba(77,70,50,0.35)] bg-[rgba(12,14,18,0.78)] px-4 py-3 text-[var(--admin-text)] shadow-[inset_0_1px_0_rgba(255,255,255,0.04)] transition-colors duration-200 placeholder:text-[rgba(226,226,232,0.45)] focus:border-[var(--admin-gold)] focus:outline-none focus:ring-2 focus:ring-[rgba(250,204,21,0.2)]"
                  name="reason"
                  placeholder="Detail the specific policy violations and evidence..."
                  value={form.reason}
                  onChange={onChange}
                />
              </label>

              <label className="flex items-start gap-3 rounded-[1.2rem] border border-[rgba(77,70,50,0.18)] bg-[rgba(255,255,255,0.02)] p-4">
                <input
                  checked={form.confirmed}
                  className="mt-1"
                  name="confirmed"
                  type="checkbox"
                  onChange={onChange}
                />
                <span className="text-sm leading-6 text-[rgba(209,198,171,0.74)]">
                  I confirm this action adheres to system governance policy and the supporting evidence has
                  been reviewed before execution.
                </span>
              </label>

              <div className="flex flex-col gap-3 border-t border-[rgba(77,70,50,0.18)] pt-6 sm:flex-row sm:justify-end">
                <Button className="min-w-36 justify-center" size="nav" type="button" variant="secondary" onClick={onClose}>
                  Cancel
                </Button>
                <Button className="min-w-48 justify-center" size="nav" type="submit">
                  <Gavel className="mr-2 h-4 w-4" />
                  Apply penalty
                </Button>
              </div>
            </form>
          ) : null}
        </div>
      </div>
    </Modal>
  )
}

export default function ModerationPage() {
  const [users, setUsers] = useState(seededUsers)
  const [search, setSearch] = useState('')
  const [selectedUserId, setSelectedUserId] = useState(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [actionForm, setActionForm] = useState(initialActionForm)

  const filteredUsers = useMemo(() => {
    const normalizedSearch = search.trim().toLowerCase()

    return users.filter((user) => {
      if (!normalizedSearch) {
        return true
      }

      return (
        user.name.toLowerCase().includes(normalizedSearch) ||
        user.email.toLowerCase().includes(normalizedSearch) ||
        user.id.toLowerCase().includes(normalizedSearch)
      )
    })
  }, [search, users])

  const selectedUser = users.find((user) => user.id === selectedUserId) || null
  const flaggedCount = users.filter((user) => user.status === 'Flagged').length

  function openModerationModal(user) {
    setSelectedUserId(user.id)
    setActionForm(initialActionForm)
    setIsModalOpen(true)
  }

  function closeModerationModal() {
    setIsModalOpen(false)
  }

  function handleActionChange(event) {
    const { name, type, value, checked } = event.target
    setActionForm((currentForm) => ({
      ...currentForm,
      [name]: type === 'checkbox' ? checked : value,
    }))
  }

  function handleModerationSubmit(event) {
    event.preventDefault()

    if (!selectedUser || !actionForm.reason.trim() || !actionForm.confirmed) {
      return
    }

    setUsers((currentUsers) =>
      currentUsers.map((user) =>
        user.id === selectedUser.id
          ? {
              ...user,
              status: actionForm.penalty === 'Formal Warning' ? 'Monitored' : 'Flagged',
              lastActive: 'Action applied just now',
            }
          : user,
      ),
    )

    closeModerationModal()
  }

  return (
    <>
      <main className="admin-page space-y-8">
        <header className="grid gap-6 rounded-[1.6rem] border border-[rgba(77,70,50,0.18)] bg-[linear-gradient(135deg,rgba(255,180,171,0.08),rgba(255,255,255,0.02))] p-6 xl:grid-cols-[minmax(0,1.3fr)_320px] xl:p-7">
          <div className="space-y-4">
            <p className="admin-ui-text text-[0.68rem] text-[var(--admin-danger)]">Access control</p>
            <div className="space-y-3">
              <h1 className="admin-display text-4xl leading-none text-[var(--admin-text)] sm:text-5xl xl:text-6xl">
                Moderation desk
              </h1>
              <p className="max-w-3xl text-sm leading-7 text-[rgba(209,198,171,0.74)] sm:text-base">
                Review flagged accounts, open a formal moderation protocol, and apply privileged actions from
                the reserved admin area defined in the frontend plan.
              </p>
            </div>
          </div>

          <div className="grid gap-4 rounded-[1.4rem] border border-[rgba(77,70,50,0.18)] bg-[rgba(12,14,18,0.62)] p-5">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="admin-ui-text text-[0.62rem] text-[var(--admin-danger)]">Flagged accounts</p>
                <p className="mt-2 text-3xl font-black tracking-tight text-[var(--admin-text)]">{flaggedCount}</p>
                <p className="mt-1 text-sm text-[rgba(209,198,171,0.72)]">Records that may require intervention</p>
              </div>
              <div className="rounded-full bg-[rgba(255,180,171,0.08)] p-4 text-[var(--admin-danger)]">
                <ShieldAlert className="h-6 w-6" />
              </div>
            </div>
          </div>
        </header>

        <section className="space-y-6 rounded-[1.6rem] border border-[rgba(77,70,50,0.18)] bg-[rgba(12,14,18,0.72)] p-4 sm:p-6">
          <div className="flex flex-col gap-4 xl:flex-row xl:items-end xl:justify-between">
            <div className="space-y-2">
              <p className="admin-ui-text text-[0.68rem] text-[rgba(250,204,21,0.78)]">Directory</p>
              <h2 className="admin-title text-2xl text-[var(--admin-text)]">User management</h2>
            </div>

            <label className="space-y-2 xl:w-[22rem]">
              <span className="admin-ui-text text-[0.62rem] text-[rgba(209,198,171,0.7)]">Search system</span>
              <div className="relative">
                <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[rgba(209,198,171,0.52)]" />
                <Input
                  className="pl-11"
                  placeholder="Search user, email, ID..."
                  value={search}
                  onChange={(event) => setSearch(event.target.value)}
                />
              </div>
            </label>
          </div>

          <div className="overflow-hidden rounded-[1.4rem] border border-[rgba(77,70,50,0.18)]">
            <div className="hidden overflow-x-auto lg:block">
              <table className="w-full min-w-[920px] border-collapse">
                <thead className="bg-[rgba(30,32,36,0.86)]">
                  <tr className="text-left">
                    <th className="px-6 py-5 text-[0.64rem] uppercase tracking-[0.18em] text-[var(--admin-gold-soft)]">User identifier</th>
                    <th className="px-6 py-5 text-[0.64rem] uppercase tracking-[0.18em] text-[rgba(209,198,171,0.68)]">Role status</th>
                    <th className="px-6 py-5 text-[0.64rem] uppercase tracking-[0.18em] text-[rgba(209,198,171,0.68)]">Engagement</th>
                    <th className="px-6 py-5 text-[0.64rem] uppercase tracking-[0.18em] text-[rgba(209,198,171,0.68)]">Last active</th>
                    <th className="px-6 py-5 text-right text-[0.64rem] uppercase tracking-[0.18em] text-[rgba(209,198,171,0.68)]">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[rgba(77,70,50,0.14)] bg-[rgba(17,19,23,0.9)]">
                  {filteredUsers.map((user) => (
                    <tr key={user.id} className="transition-colors duration-200 hover:bg-[rgba(255,255,255,0.03)]">
                      <td className="px-6 py-5">
                        <div className="flex items-center gap-4">
                          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[rgba(250,204,21,0.08)] font-bold text-[var(--admin-gold)]">
                            {user.name
                              .split(' ')
                              .map((part) => part[0])
                              .join('')
                              .slice(0, 2)}
                          </div>
                          <div className="space-y-1">
                            <p className="text-sm font-semibold text-[var(--admin-text)]">{user.name}</p>
                            <p className="text-xs uppercase tracking-[0.08em] text-[rgba(209,198,171,0.58)]">{user.email}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-5">
                        <div className="space-y-2">
                          <p className="text-sm text-[var(--admin-text)]">{user.role}</p>
                          <span className={`inline-flex rounded-full border px-3 py-1 text-xs font-semibold uppercase tracking-[0.14em] ${getStatusClasses(user.status)}`}>
                            {user.status}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-5 text-sm text-[rgba(209,198,171,0.78)]">{user.engagement}</td>
                      <td className="px-6 py-5 text-sm text-[rgba(209,198,171,0.78)]">{user.lastActive}</td>
                      <td className="px-6 py-5">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            className="rounded-full border border-[rgba(77,70,50,0.2)] p-2 text-[rgba(209,198,171,0.66)] transition-colors duration-200 hover:border-[rgba(250,204,21,0.3)] hover:text-[var(--admin-gold-soft)]"
                            type="button"
                            onClick={() => openModerationModal(user)}
                          >
                            <Gavel className="h-4 w-4" />
                          </button>
                          <button
                            className="rounded-full border border-[rgba(77,70,50,0.2)] p-2 text-[rgba(209,198,171,0.66)] transition-colors duration-200 hover:border-[rgba(250,204,21,0.3)] hover:text-[var(--admin-gold-soft)]"
                            type="button"
                          >
                            <Settings2 className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="grid gap-4 p-4 lg:hidden">
              {filteredUsers.map((user) => (
                <article
                  key={user.id}
                  className="space-y-4 rounded-[1.3rem] border border-[rgba(77,70,50,0.18)] bg-[rgba(17,19,23,0.9)] p-5"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="text-lg font-semibold text-[var(--admin-text)]">{user.name}</p>
                      <p className="mt-1 text-sm text-[rgba(209,198,171,0.68)]">{user.email}</p>
                    </div>
                    <span className={`inline-flex rounded-full border px-3 py-1 text-xs font-semibold uppercase tracking-[0.14em] ${getStatusClasses(user.status)}`}>
                      {user.status}
                    </span>
                  </div>
                  <div className="grid gap-2 text-sm text-[rgba(209,198,171,0.78)]">
                    <p>Role: {user.role}</p>
                    <p>Engagement: {user.engagement}</p>
                    <p>Last active: {user.lastActive}</p>
                  </div>
                  <button
                    className="inline-flex items-center gap-2 rounded-full border border-[rgba(77,70,50,0.22)] px-4 py-2 text-sm text-[rgba(209,198,171,0.76)] transition-colors duration-200 hover:border-[rgba(250,204,21,0.3)] hover:text-[var(--admin-gold-soft)]"
                    type="button"
                    onClick={() => openModerationModal(user)}
                  >
                    <Gavel className="h-4 w-4" />
                    Open moderation
                  </button>
                </article>
              ))}
            </div>
          </div>

          <div className="grid gap-4 lg:grid-cols-2">
            <article className="rounded-[1.3rem] border border-[rgba(77,70,50,0.18)] bg-[rgba(17,19,23,0.9)] p-5">
              <div className="flex items-center gap-3">
                <div className="rounded-full bg-[rgba(250,204,21,0.08)] p-3 text-[var(--admin-gold)]">
                  <ShieldCheck className="h-5 w-5" />
                </div>
                <div>
                  <p className="admin-ui-text text-[0.62rem] text-[rgba(250,204,21,0.74)]">Compliance</p>
                  <h3 className="admin-title mt-1 text-lg text-[var(--admin-text)]">Audit trail ready</h3>
                </div>
              </div>
              <p className="mt-4 text-sm leading-7 text-[rgba(209,198,171,0.72)]">
                Moderation actions are kept inside the admin route group and exposed through a route-level
                page, consistent with the frontend plan.
              </p>
            </article>

            <article className="rounded-[1.3rem] border border-[rgba(77,70,50,0.18)] bg-[rgba(17,19,23,0.9)] p-5">
              <p className="admin-ui-text text-[0.62rem] text-[rgba(209,198,171,0.66)]">Review queue</p>
              <div className="mt-4 grid gap-3 text-sm text-[rgba(209,198,171,0.76)]">
                <div className="flex items-center justify-between gap-4">
                  <span>Flagged users</span>
                  <span>{flaggedCount}</span>
                </div>
                <div className="flex items-center justify-between gap-4">
                  <span>Records visible</span>
                  <span>{filteredUsers.length}</span>
                </div>
              </div>
            </article>
          </div>
        </section>
      </main>

      <ModerationModal
        form={actionForm}
        open={isModalOpen}
        targetUser={selectedUser}
        onChange={handleActionChange}
        onClose={closeModerationModal}
        onSubmit={handleModerationSubmit}
      />
    </>
  )
}
