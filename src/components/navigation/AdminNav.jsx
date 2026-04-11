import { Link } from 'react-router-dom'

export default function AdminNav() {
  return (
    <nav className="bg-red-600 px-6 py-4">
      <div className="flex gap-6 text-sm font-bold">
        <Link to="/admin">Dashboard</Link>
        <Link to="/admin/competitions">Competitions</Link>
        <Link to="/admin/suggestions">Suggestions</Link>
        <Link to="/admin/moderation">Moderation</Link>
      </div>
    </nav>
  )
}