# ComptiHub Frontend Plan

## Product Direction

ComptiHub is a web app for university competitions and team recruitment.

The frontend should support:
- a public landing page for all visitors
- login and sign-up before entering the main app
- one normal student account per user
- the ability for the same student to use the app as both `competitor` and `teamLeader`
- switching between `competitor` and `teamLeader` roles without logging out
- a reserved admin area that will be built later

## Account and Access Model

### Platform roles

The product should recognize these roles in the user experience:

- `competitor`
- `teamLeader`
- `admin`

Visitors who are not logged in are just unauthenticated users viewing the landing page, not a formal app role.

### Account model

The account itself is still logical and should stay simple:

- student users sign in with one student account
- that same student account can operate as both `competitor` and `teamLeader`
- `admin` remains a separate elevated account type

Important rule:
- `competitor` and `teamLeader` should not require separate student accounts
- they represent the student's current active role inside the app

### Intended behavior

- the landing page is public
- login/sign-up allows the student to choose which role they want to enter first
- after authentication, the same student account enters the app in that selected role
- once inside the app, the student can switch roles at any time without logging out

Recommended data model idea:

- `accountType: student | admin`
- `activeRole: competitor | teamLeader`

Not recommended:

- separate student accounts for `competitor` and `teamLeader`

## Auth Flow Decision

The app should allow role choice during auth entry for better UX.

### Sign-up

- create a normal student account
- let the user choose an initial role (`competitor` or `teamLeader`)
- redirect them into the app using that role

### Login

- log into the same student account
- let the user choose which role to enter with
- redirect accordingly

### In-app

- always show a visible role switcher so the student can move between `competitor` and `teamLeader`

## Router Decision

Use `react-router-dom`.

Recommended approach:
- use `createBrowserRouter`

Reason:
- the app has clear route groups: public, auth, student app, and later admin
- nested layouts and route guards will be cleaner
- it scales better than a simple single-file routing setup

### Route groups to support

- public pages
- auth pages
- protected student pages
- reserved admin pages

Detailed route tree can be finalized later.

## Frontend Folder Structure

```txt
src/
  main.jsx
  index.css

  app/
    App.jsx
    router.jsx
    providers.jsx
    guards/
      ProtectedRoute.jsx
      PublicOnlyRoute.jsx
      AdminRoute.jsx
      StudentRoleRoute.jsx

  pages/
    public/
      LandingPage.jsx
      sections/
        HeroSection.jsx
        FeaturesSection.jsx
        HowItWorksSection.jsx

    auth/
      LoginPage.jsx
      SignupPage.jsx

    dashboard/
      DashboardPage.jsx
      components/
        CompetitorOverview.jsx
        TeamLeaderOverview.jsx

    competitions/
      CompetitionsPage.jsx
      CompetitionDetailsPage.jsx

    teams/
      MyTeamsPage.jsx
      CreateTeamPage.jsx
      TeamDetailsPage.jsx
      TeamRequestsPage.jsx

    applications/
      MyApplicationsPage.jsx

    profile/
      ProfilePage.jsx
      EditProfilePage.jsx

    admin/
      AdminDashboardPage.jsx
      ManageCompetitionsPage.jsx
      SuggestionsPage.jsx
      ModerationPage.jsx

  features/
    auth/
      components/
        AuthForm.jsx
        StudentRoleSelector.jsx
      context/
        AuthContext.jsx
      hooks/
        useAuth.js
      services/
        authService.js

    account/
      components/
        StudentRoleSwitcher.jsx
      context/
        StudentRoleContext.jsx
      hooks/
        useStudentRole.js
      utils/
        roleConfig.js

    competitions/
      components/
      hooks/
      services/

    teams/
      components/
      hooks/
      services/

    applications/
      components/
      hooks/
      services/

    profile/
      components/
      hooks/
      services/

    skills/
      components/
      services/

    admin/
      components/
      hooks/
      services/

  components/
    ui/
      Button.jsx
      Input.jsx
      Select.jsx
      Modal.jsx
      Card.jsx
      Badge.jsx

    layout/
      PublicLayout.jsx
      AuthLayout.jsx
      AppLayout.jsx
      AdminLayout.jsx

    navigation/
      Navbar.jsx
      Sidebar.jsx
      StudentNav.jsx
      AdminNav.jsx

    feedback/
      EmptyState.jsx
      LoadingState.jsx
      ErrorState.jsx

  lib/
    api/
      client.js
      endpoints.js
    constants/
      routes.js
      accountTypes.js
      roles.js
    utils/
      cn.js
      formatDate.js
      storage.js

  data/
    mocks/
      competitions.js
      teams.js
      applications.js
      profile.js
      skills.js
      user.js

  assets/
    brand/
      logo.svg
    illustrations/
      landing-hero.png
```

## Folder Responsibilities

### `pages/`

Contains route-level screens.

Examples:
- landing page
- login page
- sign-up page
- dashboard
- competitions pages
- team pages
- profile pages
- reserved admin pages

### `features/`

Contains domain-specific business logic and feature UI.

Examples:
- auth logic
- student role switching
- competitions data and components
- teams logic and request handling
- applications tracking
- profile management
- reserved admin functionality

### `components/`

Contains shared reusable UI and layout pieces.

Examples:
- buttons, inputs, cards, badges
- layouts
- nav bars and sidebars
- loading, empty, and error states

### `lib/`

Contains shared technical utilities.

Examples:
- API client
- constants
- helper functions
- storage utilities

### `data/mocks/`

Contains temporary mock data while backend APIs are not ready.

## UI and Navigation Rules

### Public access

- the landing page must be accessible to everyone

### Auth access

- login and sign-up remain public-only
- authenticated users should not stay on auth pages

### Student app access

- all main app pages require authentication
- the app should adapt based on `activeRole`

### Role behavior

In the `competitor` role, emphasize:
- browsing competitions
- exploring teams
- submitting join requests
- tracking application status

In the `teamLeader` role, emphasize:
- creating teams
- managing team details
- reviewing join requests
- managing rosters

### Admin

- keep admin folders and guards reserved now
- implement admin screens later

## Naming Conventions

- use `PascalCase.jsx` for components and pages
- use `camelCase.js` for hooks, services, constants, and utilities
- keep route screens in `pages/`
- keep reusable domain-specific pieces in `features/`
- keep generic reusable UI in `components/ui/`

## Implementation Notes

- do not split the entire app into separate top-level `competitor/` and `teamLeader/` apps
- build around shared student pages plus role-aware UI
- treat the auth page role choice as the user's starting experience, not a different account type
- keep a visible in-app role switcher available after login
- reserve admin structure now, but postpone building admin features

## Current Planning Decisions Locked In

- use `pages/`, `features/`, and shared `components/`
- keep a public landing page
- require login/sign-up for the main app
- create only a normal student account for student users
- let students enter as `competitor` or `teamLeader`
- let students switch between roles without logging out
- reserve admin structure for later
- use `react-router-dom`
- prefer `createBrowserRouter`

## Deferred for Later

- exact route tree
- exact redirect rules
- backend auth implementation details
- admin feature implementation
- API integration details
- final visual design system
