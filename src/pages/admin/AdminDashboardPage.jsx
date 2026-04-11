export default function AdminDashboardPage() {
  return (
    <main className="space-y-4">
      <h1 className="text-2xl font-bold text-red-400">Admin Dashboard</h1>

      <p>Welcome Admin. Manage the platform here.</p>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <div className="p-4 border border-red-400 rounded-xl">
          Competitions Management
        </div>

        <div className="p-4 border border-red-400 rounded-xl">
          Suggestions Review
        </div>

        <div className="p-4 border border-red-400 rounded-xl">
          User Moderation
        </div>
      </div>
    </main>
  )
}