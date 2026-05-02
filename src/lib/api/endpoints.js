export const endpoints = {
  auth: {
    signup: '/auth/signup',
    login: '/auth/login',
    refresh: '/auth/refresh',
    logout: '/auth/logout',
    me: '/auth/me',
    basicInfo: '/auth/me',
    defaultRole: '/auth/default-role',
    activeRole: '/auth/active-role',
  },
  profile: {
    me: '/profile/me',
    skills: '/profile/me/skills',
  },
  competitions: {
    list: '/competitions',
    byId: (id) => `/competitions/${id}`,
    teamsById: (id) => `/competitions/${id}/teams`,
  },
  adminCompetitions: {
    list: '/admin/competitions',
    byId: (id) => `/admin/competitions/${id}`,
  },
  teams: {
    listMine: '/teams/me',
    create: '/teams',
    byId: (id) => `/teams/${id}`,
    leaveRequests: (id) => `/teams/${id}/leave-requests`,
    incomingLeaveRequests: '/teams/leave-requests/incoming',
  },
  leaveRequests: {
    review: (id) => `/leave-requests/${id}/status`,
  },
  applications: {
    listMine: '/applications/me',
    incoming: '/teams/applications/incoming',
    create: (teamId) => `/teams/${teamId}/applications`,
    review: (id) => `/applications/${id}/status`,
  },
  adminModeration: {
    listUsers: '/admin/moderation/users',
    createAction: (userId) => `/admin/moderation/users/${userId}/moderation-actions`,
    listActions: (userId) => `/admin/moderation/users/${userId}/moderation-actions`,
    updateUserStatus: (userId) => `/admin/moderation/users/${userId}/status`,
  },
  adminSuggestions: {
    list: '/admin/suggestions',
    decide: (suggestionId) => `/admin/suggestions/${suggestionId}/decide`,
  },
}
