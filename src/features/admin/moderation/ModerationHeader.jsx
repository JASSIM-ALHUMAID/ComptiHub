import { ShieldAlert } from 'lucide-react'

export default function ModerationHeader({ flaggedCount }) {
  return (
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
  )
}
