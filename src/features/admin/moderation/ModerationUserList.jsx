import { Gavel, Search, Settings2, ShieldCheck } from 'lucide-react'
import Input from '../../../components/ui/Input'
import { getStatusClasses } from './moderationForm'

export default function ModerationUserList({ filteredUsers, flaggedCount, search, onOpenModerationModal, onSearchChange }) {
  return (
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
              onChange={onSearchChange}
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
                        aria-label={`Open moderation for ${user.name}`}
                        className="rounded-full border border-[rgba(77,70,50,0.2)] p-2 text-[rgba(209,198,171,0.66)] transition-colors duration-200 hover:border-[rgba(250,204,21,0.3)] hover:text-[var(--admin-gold-soft)]"
                        type="button"
                        onClick={() => onOpenModerationModal(user)}
                      >
                        <Gavel className="h-4 w-4" />
                      </button>
                      <button
                        aria-label={`Open settings for ${user.name}`}
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
                onClick={() => onOpenModerationModal(user)}
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
  )
}
