export const endpoints = {
  auth: {
    signup: '/auth/signup',
    login: '/auth/login',
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
  },
  adminCompetitions: {
    list: '/admin/competitions',
    byId: (id) => `/admin/competitions/${id}`,
  },
}
