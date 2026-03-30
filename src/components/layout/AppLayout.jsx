import { Outlet } from 'react-router-dom'
import StudentRoleSwitcher from '../../features/account/components/StudentRoleSwitcher'
import Sidebar from '../navigation/Sidebar'
import StudentNav from '../navigation/StudentNav'

export default function AppLayout() {
  return (
    <div>
      <StudentNav />
      <StudentRoleSwitcher />
      <Sidebar />
      <Outlet />
    </div>
  )
}
