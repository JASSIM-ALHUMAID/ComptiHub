import { Outlet } from 'react-router-dom'
import StudentRoleSwitcher from '../../features/account/components/StudentRoleSwitcher'
import Sidebar from '../navigation/Sidebar'
import StudentNav from '../navigation/StudentNav'

export default function AppLayout() {
  return (
    <div className="landing-theme min-h-screen">
      <StudentNav />
      <div className="mx-auto grid w-full max-w-7xl gap-6 px-5 py-6 lg:grid-cols-[260px_1fr] lg:px-8">
        <Sidebar />
        <div className="space-y-6">
          <StudentRoleSwitcher />
          <div className="rounded-[2rem] border border-[rgba(77,70,50,0.22)] bg-[rgba(17,19,23,0.78)] p-5 text-(--landing-text) shadow-[0_20px_50px_rgba(0,0,0,0.22)] sm:p-6">
            <Outlet />
          </div>
        </div>
      </div>
    </div>
  )
}
