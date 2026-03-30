import { createBrowserRouter } from 'react-router-dom'
import AdminRoute from './guards/AdminRoute'
import ProtectedRoute from './guards/ProtectedRoute'
import PublicOnlyRoute from './guards/PublicOnlyRoute'
import StudentRoleRoute from './guards/StudentRoleRoute'
import AdminLayout from '../components/layout/AdminLayout'
import AppLayout from '../components/layout/AppLayout'
import AuthLayout from '../components/layout/AuthLayout'
import PublicLayout from '../components/layout/PublicLayout'
import AdminDashboardPage from '../pages/admin/AdminDashboardPage'
import ManageCompetitionsPage from '../pages/admin/ManageCompetitionsPage'
import ModerationPage from '../pages/admin/ModerationPage'
import SuggestionsPage from '../pages/admin/SuggestionsPage'
import MyApplicationsPage from '../pages/applications/MyApplicationsPage'
import LoginPage from '../pages/auth/LoginPage'
import SignupPage from '../pages/auth/SignupPage'
import CompetitionDetailsPage from '../pages/competitions/CompetitionDetailsPage'
import CompetitionsPage from '../pages/competitions/CompetitionsPage'
import DashboardPage from '../pages/dashboard/DashboardPage'
import EditProfilePage from '../pages/profile/EditProfilePage'
import ProfilePage from '../pages/profile/ProfilePage'
import LandingPage from '../pages/public/LandingPage'
import CreateTeamPage from '../pages/teams/CreateTeamPage'
import MyTeamsPage from '../pages/teams/MyTeamsPage'
import TeamDetailsPage from '../pages/teams/TeamDetailsPage'
import TeamRequestsPage from '../pages/teams/TeamRequestsPage'

export const router = createBrowserRouter([
  {
    path: '/',
    element: <PublicLayout />,
    children: [{ index: true, element: <LandingPage /> }],
  },
  {
    element: <PublicOnlyRoute />,
    children: [
      {
        element: <AuthLayout />,
        children: [
          { path: '/login', element: <LoginPage /> },
          { path: '/signup', element: <SignupPage /> },
        ],
      },
    ],
  },
  {
    element: <ProtectedRoute />,
    children: [
      {
        element: <AppLayout />,
        children: [
          { path: '/dashboard', element: <DashboardPage /> },
          { path: '/competitions', element: <CompetitionsPage /> },
          { path: '/competitions/:competitionId', element: <CompetitionDetailsPage /> },
          { path: '/teams', element: <StudentRoleRoute />,
            children: [
              { index: true, element: <MyTeamsPage /> },
              { path: 'create', element: <CreateTeamPage /> },
              { path: ':teamId', element: <TeamDetailsPage /> },
              { path: 'requests', element: <TeamRequestsPage /> },
            ],
          },
          { path: '/applications', element: <MyApplicationsPage /> },
          { path: '/profile', element: <ProfilePage /> },
          { path: '/profile/edit', element: <EditProfilePage /> },
        ],
      },
    ],
  },
  {
    element: <AdminRoute />,
    children: [
      {
        element: <AdminLayout />,
        children: [
          { path: '/admin', element: <AdminDashboardPage /> },
          { path: '/admin/competitions', element: <ManageCompetitionsPage /> },
          { path: '/admin/suggestions', element: <SuggestionsPage /> },
          { path: '/admin/moderation', element: <ModerationPage /> },
        ],
      },
    ],
  },
])
