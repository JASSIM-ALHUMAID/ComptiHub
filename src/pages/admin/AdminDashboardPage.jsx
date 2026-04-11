export default function AdminDashboardPage() {
  return (
    <main className="space-y-8">
      <header className="space-y-2">
        <p className="landing-label text-[0.68rem] text-[rgba(250,204,21,0.82)]">Admin</p>
        <h1 className="landing-title text-3xl text-(--landing-text)">Dashboard</h1>
      </header>

      <p className="landing-copy text-sm text-[rgba(226,226,232,0.72)] sm:text-base">
        Manage competitions, review student-submitted suggestions, and moderate user activity from a centralized admin control panel.
      </p>
    </main>
  )
}