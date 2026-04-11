export const adminDashboardMetrics = [
  {
    id: 'active-competitions',
    label: 'Active competitions',
    value: '24',
    note: '+3 from yesterday',
    status: 'Live',
    tone: 'success',
  },
  {
    id: 'pending-suggestions',
    label: 'Pending suggestions',
    value: '142',
    note: 'Average response: 4h',
    status: 'Urgent',
    tone: 'warning',
  },
  {
    id: 'registered-users',
    label: 'Total registered users',
    value: '12.5k',
    note: '15% MoM growth',
    status: null,
    tone: 'neutral',
  },
  {
    id: 'banned-accounts',
    label: 'Banned accounts',
    value: '31',
    note: 'Security violations identified',
    status: null,
    tone: 'danger',
  },
]

export const adminRecentActivity = [
  {
    id: 1,
    time: '14:22:01',
    actor: '@AlphaTeam',
    action: 'created a new competition entry',
    subject: 'Global Cyber Defense 2024',
    category: 'Competition creation',
    region: 'Dhahran, SA',
  },
  {
    id: 2,
    time: '14:18:45',
    actor: 'user_4592',
    action: 'successfully registered via EDU portal',
    subject: null,
    category: 'User registration',
    region: 'Riyadh, SA',
  },
  {
    id: 3,
    time: '13:55:12',
    actor: '@CodeWizards',
    action: 'updated a team roster',
    subject: '2 new members added',
    category: 'Team update',
    region: 'Jeddah, SA',
  },
  {
    id: 4,
    time: '13:34:50',
    actor: 'system',
    action: 'completed scheduled moderation review',
    subject: '12 queued reports processed',
    category: 'Moderation',
    region: 'Internal job',
  },
]

export const adminPriorityQueue = [
  {
    id: 882,
    title: 'Machine Learning Ethics Bowl',
    proposer: 'Sarah Jenkins',
    university: 'MIT',
    priority: 'High priority',
    accent: 'primary',
  },
  {
    id: 881,
    title: 'Green Tech Startup Pitch',
    proposer: 'David Chen',
    university: 'Stanford',
    priority: 'Needs review',
    accent: 'muted',
  },
  {
    id: 879,
    title: 'Blockchain Security CTF',
    proposer: 'Amara Okafor',
    university: 'Oxford',
    priority: 'Needs review',
    accent: 'muted',
  },
]

export const adminSystemHealth = [
  {
    id: 'server-load',
    label: 'Server load',
    value: '42%',
    width: '42%',
    tone: 'warning',
  },
  {
    id: 'database-latency',
    label: 'Database latency',
    value: '12ms',
    width: '15%',
    tone: 'success',
  },
]
