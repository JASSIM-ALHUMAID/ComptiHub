import { Outlet } from 'react-router-dom'
import StudentRoleSwitcher from '../../features/account/components/StudentRoleSwitcher'
import Sidebar from '../navigation/Sidebar'
import StudentNav from '../navigation/StudentNav'
import MobileNav from '../navigation/MobileNav'
import Card from '../ui/Card'

export default function AppLayout() {
  return (
    <div className="landing-theme min-h-screen pb-24 lg:pb-0">
      <StudentNav />

      {/* Desktop Layout - Sidebar visible */}
      <div className="hidden lg:block mx-auto w-full max-w-7xl gap-6 px-8 py-6">
        <div className="grid grid-cols-[260px_1fr] gap-6">
          <Sidebar />
          <div className="space-y-6">
            <StudentRoleSwitcher />
            <Card variant="elevated" className="min-h-screen">
              <Outlet />
            </Card>
          </div>
        </div>
      </div>

      {/* Tablet & Mobile Layout - Sidebar hidden, stacked content */}
      <div className="lg:hidden mx-auto w-full px-5 py-6 sm:px-8">
        <div className="space-y-6">
          <StudentRoleSwitcher />
          <Card variant="elevated">
            <Outlet />
          </Card>
        </div>
      </div>

      {/* Mobile Bottom Navigation */}
      <MobileNav />
    </div>
  )
}
