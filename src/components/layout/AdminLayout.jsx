import { Outlet } from 'react-router-dom'
import AdminNav from '../navigation/AdminNav'

export default function AdminLayout() {
  return (
    <div className="min-h-screen bg-black text-white">
      <AdminNav />

      <div className="mx-auto max-w-7xl p-6">
        <div className="rounded-2xl border border-red-500 bg-[rgba(20,20,20,0.9)] p-6">
          <Outlet />
        </div>
      </div>
    </div>
  )
}