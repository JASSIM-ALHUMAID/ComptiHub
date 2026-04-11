import { Outlet } from 'react-router-dom'
import StudentRoleSwitcher from '../../features/account/components/StudentRoleSwitcher'
import Sidebar from '../navigation/Sidebar'
import StudentNav from '../navigation/StudentNav'
import MobileNav from '../navigation/MobileNav'
import Card from '../ui/Card'

export default function AppLayout() {
  return (
    <div className="landing-theme flex min-h-screen flex-col pb-24 lg:pb-8">
      <StudentNav />

      {/* Desktop Layout - Sidebar visible */}
      <div className="hidden w-full flex-1 lg:block lg:px-8 lg:py-6">
        <div className="grid w-full grid-cols-[280px_minmax(0,1fr)] gap-6">
          <Sidebar />
          <div className="min-w-0 space-y-6">
            <StudentRoleSwitcher />
            <Card variant="elevated" className="min-h-[calc(100vh-11.5rem)]">
              <Outlet />
            </Card>
          </div>
        </div>
      </div>

      {/* Tablet & Mobile Layout - Sidebar hidden, stacked content */}
      <div className="w-full px-5 py-6 sm:px-8 lg:hidden">
        <div className="space-y-6">
          <StudentRoleSwitcher />
          <Card variant="elevated" className="min-h-[calc(100vh-14rem)]">
            <Outlet />
          </Card>
        </div>
      </div>

      {/* Mobile Bottom Navigation */}
      <MobileNav />
    </div>
  )
}
