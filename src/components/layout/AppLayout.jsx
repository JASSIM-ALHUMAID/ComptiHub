import { Outlet } from 'react-router-dom'
import StudentRoleSwitcher from '../../features/account/components/StudentRoleSwitcher'
import MobileNav from '../navigation/MobileNav'
import Sidebar from '../navigation/Sidebar'
import StudentNav from '../navigation/StudentNav'

export default function AppLayout() {
  return (
    <div className="admin-theme min-h-screen pb-24 lg:pb-8">
      <StudentNav />

      <div className="admin-shell grid gap-6 px-4 py-4 sm:px-6 lg:grid-cols-[300px_minmax(0,1fr)] lg:px-8 lg:py-6">
        <Sidebar />
        <div className="admin-main-panel rounded-[1.75rem] border border-[rgba(77,70,50,0.22)] bg-[rgba(17,19,23,0.88)] text-[var(--admin-text)] shadow-[0_24px_60px_rgba(0,0,0,0.24)]">
          <div className="grid gap-6 p-5 sm:p-6 xl:p-8">
            <StudentRoleSwitcher />
            <Outlet />
          </div>
        </div>
      </div>

      <MobileNav />
    </div>
  )
}
