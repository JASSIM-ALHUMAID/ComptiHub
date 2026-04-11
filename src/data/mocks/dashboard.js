export const competitorDashboard = {
  'user-2': {
    stats: [
      { id: 'open-competitions', label: 'Open Competitions', value: '5', note: 'Deadlines within the next 90 days' },
      { id: 'team-memberships', label: 'Active Teams', value: '2', note: 'Current memberships across active student teams' },
      { id: 'applications', label: 'Applications', value: '2', note: 'Requests waiting for responses' },
    ],
    highlights: [
      { id: 'next-deadline', label: 'Next deadline', value: 'Apr 28', note: 'Saudi Hackathon: Smart Cities' },
      { id: 'accepted-team', label: 'Accepted team', value: 'NovaBuild', note: 'Smart Cities team now visible in your roster' },
    ],
    recentActivity: [
      { id: 'activity-1', title: 'NovaBuild accepted your request', meta: 'Saudi Hackathon: Smart Cities' },
      { id: 'activity-2', title: 'ByteForge is still reviewing your request', meta: 'ACM ICPC Regional 2025' },
    ],
  },
  default: {
    stats: [
      { id: 'open-competitions', label: 'Open Competitions', value: '5', note: 'Browse current calls and deadlines' },
      { id: 'team-memberships', label: 'Active Teams', value: '0', note: 'Join or create a team to get started' },
      { id: 'applications', label: 'Applications', value: '0', note: 'No requests submitted yet' },
    ],
    highlights: [
      { id: 'next-deadline', label: 'Next deadline', value: 'Apr 28', note: 'Saudi Hackathon: Smart Cities' },
      { id: 'suggestion', label: 'Suggested action', value: 'Browse teams', note: 'Find a team that matches your skills' },
    ],
    recentActivity: [],
  },
}

export const teamLeaderDashboard = {
  'user-leader-1': {
    stats: [
      { id: 'managed-teams', label: 'Managed Teams', value: '1', note: 'Primary team currently led by your account' },
      { id: 'open-slots', label: 'Open Slots', value: '1', note: 'Recruiting position still available' },
      { id: 'join-requests', label: 'Pending Requests', value: '2', note: 'Applicants waiting for review in your leader queue' },
    ],
    queue: [
      { id: 'queue-1', title: 'Review Dana Mirza', meta: 'Applied to ByteForge on Apr 03' },
      { id: 'queue-2', title: 'Review Yousef Al-Salem', meta: 'Applied to ByteForge on Apr 02' },
    ],
    milestones: [
      { id: 'milestone-1', label: 'Team readiness', value: '2 / 3 members', note: 'One more competitive programmer needed' },
      { id: 'milestone-2', label: 'Second membership', value: 'SteelBot', note: 'Accepted robotics collaboration remains visible in Teams' },
    ],
  },
  default: {
    stats: [
      { id: 'managed-teams', label: 'Managed Teams', value: '0', note: 'No teams created yet' },
      { id: 'open-slots', label: 'Open Slots', value: '0', note: 'Create a team to start recruiting' },
      { id: 'join-requests', label: 'Pending Requests', value: '0', note: 'Requests will appear once your team is live' },
    ],
    queue: [],
    milestones: [
      { id: 'milestone-1', label: 'Suggested next step', value: 'Create your first team', note: 'Define the competition and required skills' },
    ],
  },
}
