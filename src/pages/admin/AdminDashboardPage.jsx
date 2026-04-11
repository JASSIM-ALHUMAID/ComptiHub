export default function AdminDashboardPage() {
  return (
    <main className="space-y-8">
      <header className="space-y-2">
        <p className="landing-label text-[0.68rem] text-[rgba(250,204,21,0.82)]">Admin</p>
        <h1 className="landing-title text-3xl text-(--landing-text)">Dashboard</h1>
      </header>

      <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <div className="rounded-[1.75rem] border p-5">
          Manage Competitions
        </div>
        <div className="rounded-[1.75rem] border p-5">
          Review Suggestions
        </div>
        <div className="rounded-[1.75rem] border p-5">
          Moderate Users
        </div>
      </section>
    </main>
  )
}