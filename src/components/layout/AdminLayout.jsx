import { Outlet } from 'react-router-dom'
import AdminNav from '../navigation/AdminNav'

export default function AdminLayout() {
  return (
    <div className="landing-theme min-h-screen">
      <AdminNav />
      <div className="mx-auto grid w-full max-w-7xl gap-6 px-5 py-6 lg:grid-cols-[260px_1fr] lg:px-8">
        <aside className="rounded-[1.75rem] border border-[rgba(77,70,50,0.22)] bg-[rgba(17,19,23,0.82)] p-4 text-(--landing-text) shadow-[0_18px_40px_rgba(0,0,0,0.2)]">
          <p className="landing-ui-text mb-4 text-[0.72rem] text-[rgba(250,204,21,0.82)]">Admin Panel</p>
          <div className="grid gap-2">
            <a href="/admin" className="rounded-2xl px-3 py-2 text-sm hover:bg-[rgba(250,204,21,0.08)]">Dashboard</a>
            <a href="/admin/competitions" className="rounded-2xl px-3 py-2 text-sm hover:bg-[rgba(250,204,21,0.08)]">Competitions</a>
            <a href="/admin/suggestions" className="rounded-2xl px-3 py-2 text-sm hover:bg-[rgba(250,204,21,0.08)]">Suggestions</a>
            <a href="/admin/moderation" className="rounded-2xl px-3 py-2 text-sm hover:bg-[rgba(250,204,21,0.08)]">Moderation</a>
          </div>
        </aside>

        <div className="space-y-6">
          <div className="rounded-[2rem] border border-[rgba(77,70,50,0.22)] bg-[rgba(17,19,23,0.78)] p-5 text-(--landing-text) shadow-[0_20px_50px_rgba(0,0,0,0.22)] sm:p-6">
            <Outlet />
          </div>
        </div>
      </div>
    </div>
  )
}