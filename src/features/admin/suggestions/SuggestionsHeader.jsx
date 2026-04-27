export default function SuggestionsHeader({ totalPending, lastEntry }) {
  return (
    <header className="grid gap-6 rounded-[1.6rem] border border-[rgba(77,70,50,0.18)] bg-[linear-gradient(135deg,rgba(250,204,21,0.08),rgba(255,255,255,0.02))] p-6 xl:grid-cols-[minmax(0,1.25fr)_320px] xl:p-7">
      <div className="space-y-4">
        <p className="admin-ui-text text-[0.68rem] text-[rgba(250,204,21,0.82)]">Review queue</p>
        <div className="space-y-3">
          <h1 className="admin-display text-4xl leading-none text-[var(--admin-text)] sm:text-5xl xl:text-6xl">
            Suggestions queue
          </h1>
          <p className="max-w-3xl text-sm leading-7 text-[rgba(209,198,171,0.74)] sm:text-base">
            Review student-submitted competition proposals, inspect resource and logistics details, and approve
            or reject items from the reserved admin route group defined in the frontend plan.
          </p>
        </div>
      </div>

      <div className="grid gap-4 rounded-[1.4rem] border border-[rgba(77,70,50,0.18)] bg-[rgba(12,14,18,0.62)] p-5">
        <div>
          <p className="admin-ui-text text-[0.62rem] text-[rgba(250,204,21,0.78)]">Total pending</p>
          <p className="mt-2 text-3xl font-black tracking-tight text-[var(--admin-text)]">{totalPending}</p>
        </div>
        <div>
          <p className="admin-ui-text text-[0.62rem] text-[rgba(209,198,171,0.66)]">Last entry</p>
          <p className="mt-2 text-2xl font-black tracking-tight text-[var(--admin-text)]">{lastEntry}</p>
        </div>
      </div>
    </header>
  )
}
