import CompetitorOverview from './components/CompetitorOverview'
import TeamLeaderOverview from './components/TeamLeaderOverview'
import { useStudentRole } from '../../features/account/hooks/useStudentRole'

export default function DashboardPage() {
  const { activeRole } = useStudentRole()

  return (
    <main>
      <header className="mb-8 space-y-2">
        <p className="landing-label text-[0.68rem] text-[rgba(250,204,21,0.82)]">Overview</p>
        <h1 className="landing-title text-3xl text-(--landing-text)">Dashboard</h1>
      </header>

      {activeRole === 'teamLeader' ? <TeamLeaderOverview /> : <CompetitorOverview />}
    </main>
  )
}
