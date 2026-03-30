import { Outlet } from 'react-router-dom'
import AdminNav from '../navigation/AdminNav'

export default function AdminLayout() {
  return (
    <div>
      <AdminNav />
      <Outlet />
    </div>
  )
}
