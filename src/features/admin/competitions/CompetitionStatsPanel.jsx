export default function CompetitionStatsPanel({ stats }) {
  return (
    <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
      <article className="rounded-[1.4rem] border border-[rgba(77,70,50,0.18)] bg-[rgba(17,19,23,0.9)] p-5">
        <p className="app-ui-text text-[0.62rem] text-[rgba(209,198,171,0.66)]">Active</p>
        <p className="mt-3 text-3xl font-black text-[var(--admin-text)]">{stats.active}</p>
      </article>
      <article className="rounded-[1.4rem] border border-[rgba(77,70,50,0.18)] bg-[rgba(17,19,23,0.9)] p-5">
        <p className="app-ui-text text-[0.62rem] text-[rgba(209,198,171,0.66)]">Upcoming</p>
        <p className="mt-3 text-3xl font-black text-[var(--admin-text)]">{stats.upcoming}</p>
      </article>
      <article className="rounded-[1.4rem] border border-[rgba(77,70,50,0.18)] bg-[rgba(17,19,23,0.9)] p-5">
        <p className="app-ui-text text-[0.62rem] text-[rgba(209,198,171,0.66)]">Drafts</p>
        <p className="mt-3 text-3xl font-black text-[var(--admin-text)]">{stats.drafts}</p>
      </article>
      <article className="rounded-[1.4rem] border border-[rgba(77,70,50,0.18)] bg-[rgba(17,19,23,0.9)] p-5">
        <p className="app-ui-text text-[0.62rem] text-[rgba(209,198,171,0.66)]">Prize pool</p>
        <p className="mt-3 text-2xl font-black text-[var(--admin-text)]">{stats.totalPrizePool}</p>
      </article>
    </section>
  )
}
