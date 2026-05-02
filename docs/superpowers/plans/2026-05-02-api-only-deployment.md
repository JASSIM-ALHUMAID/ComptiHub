# API-Only Deployment Readiness Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Make the deployed app use backend data for all authenticated flows and provide a repeatable database seed script.

**Architecture:** The backend is the source of truth. The frontend uses one API client and explicit service methods; API failures surface as UI errors instead of silently falling back to mocks. A backend seed script populates MongoDB through existing Mongoose models.

**Tech Stack:** React 19, Vite, Express, Mongoose, MongoDB, bcrypt, Node test runner, Supertest.

---

## File Map

- Modify: `backend/package.json` to add `seed` script.
- Create: `backend/scripts/seed.js` to populate MongoDB.
- Modify: `backend/src/config/env.js` if seed needs shared env values.
- Modify: `src/lib/api/endpoints.js` to add missing application/admin endpoints and auth refresh.
- Modify: `src/features/auth/services/authService.js` to store/use refresh tokens and remove authenticated mock fallback.
- Modify: `src/features/applications/services/applicationService.js` to add incoming/review methods.
- Modify: `src/features/admin/services/adminSuggestionsService.js` to use backend PATCH contract.
- Modify: `src/features/admin/services/adminModerationService.js` to use backend moderation-action contract.
- Modify: `src/pages/teams/TeamRequestsPage.jsx` to review incoming applications instead of leave requests.
- Modify: `src/pages/admin/SuggestionsPage.jsx` and `src/features/admin/suggestions/SuggestionCard.jsx` to persist approve/reject decisions.
- Modify: `src/pages/admin/ModerationPage.jsx` to persist moderation actions.
- Create: `docs/deployment.md` to document env setup, seed command, and smoke tests.

---

### Task 1: Add Database Seed Script

**Files:**
- Create: `backend/scripts/seed.js`
- Modify: `backend/package.json`

- [ ] **Step 1: Write the failing smoke command expectation**

Run before implementation:

```bash
cd backend
npm run seed
```

Expected: FAIL with `Missing script: "seed"`.

- [ ] **Step 2: Add the npm script**

In `backend/package.json`, change scripts to:

```json
"scripts": {
  "dev": "node --watch src/server.js",
  "start": "node src/server.js",
  "test": "node --import ./tests/setup-env.js --test --test-concurrency=1",
  "seed": "node scripts/seed.js"
}
```

- [ ] **Step 3: Create `backend/scripts/seed.js`**

```js
import bcrypt from 'bcrypt'
import mongoose from 'mongoose'
import { env } from '../src/config/env.js'
import { connectDb } from '../src/db/connect.js'
import { User } from '../src/modules/auth/user.model.js'
import { Profile } from '../src/modules/profile/profile.model.js'
import { Competition } from '../src/modules/competitions/competition.model.js'
import { Team } from '../src/modules/teams/team.model.js'
import { LeaveRequest } from '../src/modules/teams/leave-request.model.js'
import { Application } from '../src/modules/applications/application.model.js'
import { CompetitionSuggestion } from '../src/modules/suggestions/competitionSuggestion.model.js'
import { ModerationAction } from '../src/modules/moderation/moderationAction.model.js'

const password = '123456789'

async function resetCollections() {
  await Promise.all([
    User.deleteMany({}),
    Profile.deleteMany({}),
    Competition.deleteMany({}),
    Team.deleteMany({}),
    LeaveRequest.deleteMany({}),
    Application.deleteMany({}),
    CompetitionSuggestion.deleteMany({}),
    ModerationAction.deleteMany({}),
  ])
}

async function createUser(input) {
  return User.create({
    ...input,
    passwordHash: await bcrypt.hash(password, 12),
    accountStatus: input.accountStatus ?? 'active',
  })
}

async function main() {
  await connectDb(env.mongodbUri)
  await resetCollections()

  const admin = await createUser({
    username: 'admin',
    email: 'admin@admin.com',
    systemRole: 'admin',
    activeRole: 'admin',
  })

  const competitor = await createUser({
    username: 'competitor',
    email: 'competitor@demo.com',
    systemRole: 'student',
    defaultRole: 'competitor',
    activeRole: 'competitor',
  })

  const leader = await createUser({
    username: 'leader',
    email: 'leader@demo.com',
    systemRole: 'student',
    defaultRole: 'teamLeader',
    activeRole: 'teamLeader',
  })

  await Profile.insertMany([
    { userId: competitor._id, bio: 'Frontend developer interested in AI competitions.', skills: ['React', 'Python', 'UI'] },
    { userId: leader._id, bio: 'Team leader focused on algorithms and product delivery.', skills: ['Algorithms', 'Leadership', 'C++'] },
    { userId: admin._id, bio: 'Platform administrator.', skills: ['Moderation', 'Operations'] },
  ])

  await Competition.insertMany([
    {
      _id: 'comp-ai-2027',
      title: 'AI Innovation Challenge',
      organizer: 'SWE Department',
      category: 'AI',
      mode: 'Hybrid',
      teamSize: '2-4',
      deadline: '2027-11-01',
      registrationDeadline: '2027-11-01',
      status: 'open',
      prize: 'SAR 10,000',
      description: 'Build an AI prototype that solves a real campus problem.',
      requirements: ['Prototype', 'Pitch deck', 'Demo video'],
      tags: ['AI', 'Prototype'],
      links: ['https://example.com/ai-challenge'],
      startDate: '2027-11-10',
      endDate: '2027-11-12',
      participationType: 'team',
      createdBy: admin._id,
    },
    {
      _id: 'comp-web-2027',
      title: 'Web Systems Sprint',
      organizer: 'Computing Club',
      category: 'Web',
      mode: 'Online',
      teamSize: '1-3',
      deadline: '2027-09-15',
      registrationDeadline: '2027-09-15',
      status: 'open',
      prize: 'SAR 5,000',
      description: 'Ship a full-stack app in one week.',
      requirements: ['Repository', 'Deployment URL'],
      tags: ['Web', 'Full Stack'],
      links: ['https://example.com/web-sprint'],
      startDate: '2027-09-20',
      endDate: '2027-09-27',
      participationType: 'team',
      createdBy: admin._id,
    },
  ])

  const team = await Team.create({
    _id: 'team-api-builders',
    name: 'API Builders',
    competitionId: 'comp-ai-2027',
    leaderId: leader._id.toString(),
    description: 'Looking for a frontend-focused competitor to complete our AI prototype.',
    requiredSkills: ['React', 'APIs', 'Python'],
    totalSlots: 3,
    memberIds: [leader._id.toString()],
    status: 'recruiting',
  })

  await Application.create({
    applicantId: competitor._id,
    teamId: team._id,
    competitionId: 'comp-ai-2027',
    message: 'I can build the frontend and integrate the model API.',
    status: 'pending',
  })

  await CompetitionSuggestion.create({
    submittedBy: competitor._id,
    title: 'Cyber Defense Mini League',
    summary: 'A recurring defensive security competition for students.',
    resourceLink: 'https://example.com/cyber-league',
    proposedSchedule: 'Spring 2027',
    hardwareTier: 'Standard Lab',
    budget: 'SAR 2,000',
    status: 'pending',
  })

  console.log('Seed complete')
  console.log('Admin: admin@admin.com / 123456789')
  console.log('Competitor: competitor@demo.com / 123456789')
  console.log('Leader: leader@demo.com / 123456789')
}

main()
  .catch((error) => {
    console.error(error)
    process.exitCode = 1
  })
  .finally(async () => {
    await mongoose.disconnect()
  })
```

- [ ] **Step 4: Run seed script**

Run:

```bash
cd backend
npm run seed
```

Expected: `Seed complete` and the three credential lines.

- [ ] **Step 5: Verify backend still passes**

Run:

```bash
cd backend
npm test
```

Expected: `pass 138`, `fail 0`.

---

### Task 2: Align Frontend Endpoint Map With Backend

**Files:**
- Modify: `src/lib/api/endpoints.js`

- [ ] **Step 1: Write endpoint map changes**

Replace the relevant sections with:

```js
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
applications: {
  listMine: '/applications/me',
  incoming: '/teams/applications/incoming',
  create: (teamId) => `/teams/${teamId}/applications`,
  review: (id) => `/applications/${id}/status`,
},
adminModeration: {
  listUsers: '/admin/moderation/users',
  createAction: (userId) => `/admin/users/${userId}/moderation-actions`,
  listActions: (userId) => `/admin/users/${userId}/moderation-actions`,
},
adminSuggestions: {
  list: '/admin/suggestions',
  decide: (suggestionId) => `/admin/suggestions/${suggestionId}/decide`,
},
```

- [ ] **Step 2: Run lint**

Run:

```bash
npm run lint
```

Expected: no ESLint errors.

---

### Task 3: Make Auth API-Only For Real Users

**Files:**
- Modify: `src/features/auth/services/authService.js`

- [ ] **Step 1: Add refresh token storage**

Near token constants, add:

```js
const REFRESH_TOKEN_KEY = 'compitihub.auth.refreshToken'
```

Update `clearSession()`:

```js
function clearSession() {
  storage.remove(SESSION_KEY)
  storage.remove(TOKEN_KEY)
  storage.remove(REFRESH_TOKEN_KEY)
}
```

Add helpers:

```js
function setRefreshToken(token) {
  storage.set(REFRESH_TOKEN_KEY, token)
}

function getRefreshToken() {
  return storage.get(REFRESH_TOKEN_KEY)
}
```

- [ ] **Step 2: Store refresh token on login/signup**

In `login()` and `signup()`, after `setToken(data.token)`, add:

```js
setRefreshToken(data.refreshToken)
```

- [ ] **Step 3: Add refresh and API logout behavior**

Add methods inside exported `authService`:

```js
async refreshToken() {
  const refreshToken = getRefreshToken()
  if (!refreshToken) {
    throw new Error('No refresh token is available.')
  }

  const data = await apiClient(endpoints.auth.refresh, {
    method: 'POST',
    body: { refreshToken },
  })

  setToken(data.accessToken)
  return data.accessToken
},
```

Update `logout()` so API sessions send the refresh token:

```js
async logout() {
  const sessionUser = getSession()
  const refreshToken = getRefreshToken()

  if (sessionUser?.source === 'api' && getToken()) {
    await apiClient(endpoints.auth.logout, {
      method: 'POST',
      body: refreshToken ? { refreshToken } : {},
      token: getToken(),
    }).catch(() => null)
  }

  clearSession()
},
```

- [ ] **Step 4: Keep demo login explicit only**

Rename `loginMockUser()` to `loginDemoUser()` and only allow it when `email` ends with `@demo.com` or equals `admin@admin.com`. Real user failed API login must throw the backend error instead of falling back to mocks.

Use:

```js
const isDemoEmail = normalizedEmail.endsWith('@demo.com') || normalizedEmail === 'admin@admin.com'
if (!isDemoEmail) return null
```

- [ ] **Step 5: Verify**

Run:

```bash
npm run lint
npm run build
```

Expected: both pass.

---

### Task 4: Wire Application Review To Backend

**Files:**
- Modify: `src/features/applications/services/applicationService.js`
- Modify: `src/pages/teams/TeamRequestsPage.jsx`

- [ ] **Step 1: Add service methods**

In `applicationService`, add:

```js
async listIncomingApplications() {
  const data = await apiClient(endpoints.applications.incoming, {
    token: authService.getToken(),
  })
  return (data.applications ?? []).map(normalizeApplication)
},

async reviewApplication(applicationId, status) {
  const data = await apiClient(endpoints.applications.review(applicationId), {
    method: 'PATCH',
    body: { status },
    token: authService.getToken(),
  })
  return normalizeApplication(data.application)
},
```

- [ ] **Step 2: Update `TeamRequestsPage.jsx` imports**

Replace:

```js
import { teamService } from '../../features/teams/services/teamService'
```

with:

```js
import { applicationService } from '../../features/applications/services/applicationService'
```

- [ ] **Step 3: Load incoming applications**

Replace `teamService.listIncomingLeaveRequests()` with:

```js
applicationService.listIncomingApplications()
```

Use error text:

```js
setError(loadError.message || 'Unable to load team applications.')
```

- [ ] **Step 4: Review applications**

Replace `teamService.reviewLeaveRequest(id, status)` with:

```js
const nextApplication = await applicationService.reviewApplication(id, status === 'approved' ? 'accepted' : 'rejected')
```

Then update state:

```js
setRequests((currentRequests) => currentRequests.map((request) => (
  request.id === id ? { ...request, ...nextApplication } : request
)))
```

- [ ] **Step 5: Update labels**

Change page title from `Leave Requests` to `Team Applications` and copy from leave requests to join applications.

- [ ] **Step 6: Verify**

Run:

```bash
npm run lint
npm run build
```

Expected: both pass.

---

### Task 5: Wire Admin Suggestions To Backend

**Files:**
- Modify: `src/features/admin/services/adminSuggestionsService.js`
- Modify: `src/pages/admin/SuggestionsPage.jsx`
- Modify: `src/features/admin/suggestions/SuggestionCard.jsx`

- [ ] **Step 1: Remove API error mock fallback for API admins**

In `listSuggestions()`, delete the `try/catch` fallback. Use:

```js
const data = await apiClient(endpoints.adminSuggestions.list, {
  token: authService.getToken(),
})
return (data.suggestions ?? []).map(normalizeSuggestion)
```

- [ ] **Step 2: Use PATCH decision route**

In `decideSuggestion()`, change method to `PATCH`:

```js
const data = await apiClient(endpoints.adminSuggestions.decide(suggestionId), {
  method: 'PATCH',
  body: { decision, reason },
  token: authService.getToken(),
})
```

- [ ] **Step 3: Ensure buttons pass decisions**

`SuggestionCard.jsx` must call:

```js
onDecision(suggestion.id, 'approved')
onDecision(suggestion.id, 'rejected')
```

- [ ] **Step 4: Ensure page passes API function**

`SuggestionsPage.jsx` must pass:

```jsx
onDecision={decideSuggestion}
```

- [ ] **Step 5: Verify**

Run:

```bash
npm run lint
npm run build
```

Expected: both pass.

---

### Task 6: Wire Admin Moderation To Backend

**Files:**
- Modify: `src/features/admin/services/adminModerationService.js`
- Modify: `src/pages/admin/ModerationPage.jsx`

- [ ] **Step 1: Replace service update method**

Rename `updateUserStatus` to `createModerationAction` and implement:

```js
async createModerationAction(userId, { penalty, duration, reason }) {
  const session = authService.getSession()

  if (session?.source !== 'api' || session.accountType !== 'admin') {
    return { success: true }
  }

  const data = await apiClient(endpoints.adminModeration.createAction(userId), {
    method: 'POST',
    body: { penalty, duration, reason },
    token: authService.getToken(),
  })
  return data
},
```

- [ ] **Step 2: Remove list fallback for API admins**

In `listUsers()`, delete the `try/catch` fallback for API sessions. Keep mock return only for non-API sessions.

- [ ] **Step 3: Make moderation submit async**

In `ModerationPage.jsx`, change:

```js
function handleModerationSubmit(event) {
```

to:

```js
async function handleModerationSubmit(event) {
```

- [ ] **Step 4: Persist before local state update**

Inside `handleModerationSubmit`, before `setUsers(...)`, add:

```js
try {
  await adminModerationService.createModerationAction(selectedUser.id, actionForm)
  setUsers((currentUsers) => applyModerationAction(currentUsers, selectedUser, actionForm))
  closeModerationModal()
} catch (submitError) {
  setError(submitError.message || 'Failed to apply moderation action.')
}
```

Remove the old immediate `setUsers(...)` and `closeModerationModal()` lines.

- [ ] **Step 5: Verify**

Run:

```bash
npm run lint
npm run build
```

Expected: both pass.

---

### Task 7: Remove Silent Mock Fallbacks From API Sessions

**Files:**
- Modify service files under `src/features/**/services/*.js`

- [ ] **Step 1: Search for fallback comments**

Run:

```bash
npm run lint
```

Also search in editor or with ripgrep:

```bash
rg "Fallback to mock|Fallback to mock on API error|source !== 'api'" src/features src/pages
```

- [ ] **Step 2: Keep non-API demo behavior only where explicit**

For each service, use this pattern:

```js
const session = authService.getSession()
if (session?.source !== 'api') {
  return mockData.map(normalizeItem)
}

const data = await apiClient(endpoint, { token: authService.getToken() })
return data.items.map(normalizeItem)
```

Do not catch API errors and replace them with mocks.

- [ ] **Step 3: Verify**

Run:

```bash
npm run lint
npm run build
```

Expected: both pass.

---

### Task 8: Add Deployment Documentation

**Files:**
- Create: `docs/deployment.md`

- [ ] **Step 1: Create deployment doc**

```md
# Deployment Guide

## Backend Environment

Set these variables for backend deployment:

- `PORT=5000`
- `MONGODB_URI=<mongodb connection string>`
- `JWT_SECRET=<long random secret>`
- `CLIENT_URL=<frontend origin>`
- `NODE_ENV=production`

## Frontend Environment

Set this variable for frontend deployment:

- `VITE_API_BASE_URL=<backend origin>/api/v1`

For local development, the frontend defaults to `http://localhost:5000/api/v1`.

## Install

Run installs separately because the frontend and backend have separate `package.json` files:

```bash
npm install
cd backend
npm install
```

## Seed Database

Run:

```bash
cd backend
npm run seed
```

Seeded accounts:

- Admin: `admin@admin.com` / `123456789`
- Competitor: `competitor@demo.com` / `123456789`
- Team leader: `leader@demo.com` / `123456789`

## Verification

Run:

```bash
npm run lint
npm run build
cd backend
npm test
```

Expected:

- Lint passes with no errors.
- Frontend build completes.
- Backend tests show `pass 138` and `fail 0`.

## Manual Smoke Test

1. Start backend: `cd backend && npm run dev`.
2. Start frontend: `npm run dev`.
3. Login as `competitor@demo.com` and confirm competitions, applications, and profile load.
4. Login as `leader@demo.com` and confirm team applications are visible and reviewable.
5. Login as `admin@admin.com` and confirm suggestions and moderation actions persist after reload.
```

- [ ] **Step 2: Verify docs do not mention mock fallback as production behavior**

Read `docs/deployment.md` and ensure all authenticated smoke tests use backend accounts seeded into MongoDB.

---

### Task 9: Final Verification

**Files:**
- No new files.

- [ ] **Step 1: Run frontend checks**

```bash
npm run lint
npm run build
```

Expected: both pass.

- [ ] **Step 2: Run backend tests**

```bash
cd backend
npm test
```

Expected: `pass 138`, `fail 0`.

- [ ] **Step 3: Run seed script**

```bash
cd backend
npm run seed
```

Expected: `Seed complete` and seeded credentials.

- [ ] **Step 4: Manual smoke test**

Run backend and frontend, then verify these browser flows:

- Login as competitor and submit a team application.
- Login as leader and accept or reject that application.
- Login as admin and approve or reject a suggestion.
- Login as admin and apply a moderation action.
- Reload each page and confirm data persists.
