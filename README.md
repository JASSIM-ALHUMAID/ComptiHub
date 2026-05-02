# ComptiHub

A modern web application for university competitions and team recruitment, enabling students to discover competitions, form teams, and connect with peers seamlessly.

## Overview

ComptiHub streamlines the competition and team formation experience for university students. Whether you're looking to compete individually or lead a team, ComptiHub provides an intuitive platform to browse competitions, manage teams, and track applications—all in one place.

## Key Features

### For Competitors
- Browse and discover upcoming competitions
- Submit applications to join competitions
- Track application status
- Explore teams and request to join
- View competition details and requirements

### For Team Leaders
- Create and manage teams
- Review and accept/reject join requests
- Manage team rosters
- Organize team participation in competitions
- Monitor team performance

### For Admins
- Manage competitions on the platform
- Monitor platform activity
- Handle moderation and user management
- View platform suggestions and feedback

### For All Users
- Seamless role switching between Competitor and Team Leader
- Manage personal profile and skills
- Responsive design for desktop and mobile

## Tech Stack

- **Frontend Framework**: [React 19](https://react.dev) - Modern JavaScript UI library
- **Build Tool**: [Vite 8](https://vitejs.dev) - Next-generation frontend tooling
- **Styling**: [Tailwind CSS 4](https://tailwindcss.com) - Utility-first CSS framework
- **Routing**: [React Router DOM 7](https://reactrouter.com) - Client-side routing
- **Backend**: [Express](https://expressjs.com) and [Node.js](https://nodejs.org) - REST API server
- **Database**: [MongoDB](https://www.mongodb.com) with [Mongoose](https://mongoosejs.com)
- **Authentication**: JWT-based API authentication
- **Icons**: [Lucide React](https://lucide.dev) - Beautiful, consistent icon library
- **Code Quality**: [ESLint 9](https://eslint.org) - JavaScript linting

## Installation

### Prerequisites
- Node.js 20.0 or higher
- npm or yarn package manager
- MongoDB connection string, either local MongoDB or MongoDB Atlas

### Setup Steps

1. **Clone the repository**
   ```bash
   git clone https://github.com/JASSIM-ALHUMAID/SWE363-project.git
   cd SWE363-project
   ```

2. **Install frontend dependencies**
   ```bash
   npm install
   ```

3. **Install backend dependencies**
   ```bash
   cd backend
   npm install
   ```

4. **Configure backend environment**

   Create `backend/.env`:

   ```env
   PORT=5000
   MONGODB_URI=mongodb://127.0.0.1:27017/compitihub
   JWT_SECRET=replace-with-a-long-random-secret
   CLIENT_URL=http://localhost:5173
   NODE_ENV=development
   ```

   Use your MongoDB Atlas URI for `MONGODB_URI` if you want to use a hosted database.

5. **Seed the database**

   From `backend/`, seed local MongoDB with:

   ```bash
   npm run seed
   ```

   For MongoDB Atlas or any non-local database, explicitly confirm the reset of demo records:

   ```powershell
   $env:SEED_CONFIRM="RESET_DEMO_DATA"; npm run seed
   ```

6. **Start the backend API**

   From `backend/`:

   ```bash
   npm run dev
   ```

7. **Start the frontend development server**

   From the repository root:

   ```bash
   npm run dev
   ```

   The frontend will be available at `http://localhost:5173` or the next available Vite port. The frontend calls the backend at `http://localhost:5000/api/v1` by default.

## Demo Accounts

Use these seeded database accounts after running `npm run seed`:

| Role | Email | Password |
|------|-------|----------|
| **Competitor Demo** | `competitor@demo.com` | `123456789` |
| **Team Leader Demo** | `leader@demo.com` | `123456789` |
| **Admin Demo** | `admin@admin.com` | `123456789` |

These accounts are stored in MongoDB and use the same backend API as newly registered users.

## Available Scripts

### Frontend

- **`npm run dev`** - Start the development server with hot module replacement
- **`npm run build`** - Build the project for production
- **`npm run preview`** - Preview the production build locally
- **`npm run lint`** - Run ESLint to check code quality

### Backend

Run these from `backend/`:

- **`npm run dev`** - Start the API server with file watching
- **`npm start`** - Start the API server
- **`npm run seed`** - Seed demo data into MongoDB
- **`npm test`** - Run backend tests

## Backend Setup

The backend is an Express API server in `backend/`. It connects to MongoDB, signs JWTs, and exposes all app data through `/api/v1` routes.

### Environment Variables

Create `backend/.env` for local development:

```env
PORT=5000
MONGODB_URI=mongodb://127.0.0.1:27017/compitihub
JWT_SECRET=replace-with-a-long-random-secret
CLIENT_URL=http://localhost:5173
NODE_ENV=development
```

Required variables:

| Variable | Purpose |
| --- | --- |
| `MONGODB_URI` | MongoDB connection string for local MongoDB or MongoDB Atlas. |
| `JWT_SECRET` | Secret used to sign access and refresh tokens. Use a long random value. |
| `CLIENT_URL` | Frontend origin allowed by CORS, for example `http://localhost:5173` or a Vercel URL. |
| `NODE_ENV` | Use `development` locally and `production` in deployment. |
| `PORT` | Optional locally; defaults to `5000`. Render supplies this automatically in production. |

### Install And Run

From the repository root:

```bash
cd backend
npm install
npm run dev
```

The API will be available at:

```text
http://localhost:5000/api/v1
```

Health check:

```bash
curl http://localhost:5000/api/v1/health
```

Expected response:

```json
{
  "success": true,
  "data": {
    "status": "ok"
  }
}
```

### Seed Data

Run the seed from `backend/`:

```bash
npm run seed
```

For MongoDB Atlas or any non-local database, explicitly confirm the reset of seeded demo records:

```powershell
$env:SEED_CONFIRM="RESET_DEMO_DATA"; npm run seed
```

Seeded accounts:

| Role | Email | Password |
| --- | --- | --- |
| Admin | `admin@admin.com` | `123456789` |
| Competitor | `competitor@demo.com` | `123456789` |
| Team leader | `leader@demo.com` | `123456789` |

### Backend Tests

Run backend tests from `backend/`:

```bash
npm test
```

## API Documentation

Base URL:

```text
http://localhost:5000/api/v1
```

Deployed frontends should use the deployed backend base URL, for example:

```text
https://swe363-project-if7d.onrender.com/api/v1
```

All responses use this envelope:

```json
{
  "success": true,
  "data": {}
}
```

Error responses use this envelope:

```json
{
  "success": false,
  "error": {
    "message": "Validation failed.",
    "details": [
      { "path": "email", "message": "Invalid email" }
    ]
  }
}
```

Authenticated endpoints require this header:

```http
Authorization: Bearer <access-token>
```

### Auth

#### `POST /auth/signup`

Creates a student account and returns a session.

Request:

```bash
curl -X POST http://localhost:5000/api/v1/auth/signup \
  -H "Content-Type: application/json" \
  -d '{
    "username": "newstudent",
    "email": "newstudent@edu.com",
    "password": "123456789",
    "defaultRole": "competitor"
  }'
```

Response `201`:

```json
{
  "success": true,
  "data": {
    "user": {
      "id": "665f1a2b3c4d5e6f78901234",
      "username": "newstudent",
      "email": "newstudent@edu.com",
      "systemRole": "student",
      "defaultRole": "competitor",
      "activeRole": "competitor",
      "accountStatus": "active"
    },
    "token": "<access-token>",
    "refreshToken": "<refresh-token>"
  }
}
```

#### `POST /auth/login`

Logs in an existing user.

Request:

```bash
curl -X POST http://localhost:5000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "competitor@demo.com",
    "password": "123456789"
  }'
```

Response `200`:

```json
{
  "success": true,
  "data": {
    "user": {
      "id": "665f1a2b3c4d5e6f78901234",
      "username": "Demo Competitor",
      "email": "competitor@demo.com",
      "systemRole": "student",
      "defaultRole": "competitor",
      "activeRole": "competitor",
      "accountStatus": "active"
    },
    "token": "<access-token>",
    "refreshToken": "<refresh-token>"
  }
}
```

#### Other Auth Endpoints

| Method | Endpoint | Auth | Description |
| --- | --- | --- | --- |
| `POST` | `/auth/refresh` | No | Accepts `{ "refreshToken": "..." }` and returns a new access token. |
| `POST` | `/auth/logout` | Yes | Revokes a supplied refresh token when provided. |
| `GET` | `/auth/me` | Yes | Returns the current authenticated user. |
| `PATCH` | `/auth/me` | Yes | Updates `{ "username", "email" }`. |
| `PATCH` | `/auth/default-role` | Yes | Updates `{ "defaultRole": "competitor" | "teamLeader" }`. |
| `PATCH` | `/auth/active-role` | Yes | Updates `{ "activeRole": "competitor" | "teamLeader" }`. |

### Competitions

#### `GET /competitions`

Lists public open competitions. Supports optional query params: `search`, `category`, `status`, `sortBy`, `sortOrder`.

Request:

```bash
curl "http://localhost:5000/api/v1/competitions?search=hackathon&sortBy=deadline&sortOrder=asc"
```

Response `200`:

```json
{
  "success": true,
  "data": {
    "competitions": [
      {
        "id": "665f1a2b3c4d5e6f78900001",
        "title": "AI Innovation Challenge",
        "organizer": "Computer Science Club",
        "category": "AI",
        "status": "open",
        "participationType": "team",
        "registrationDeadline": "2026-06-01"
      }
    ]
  }
}
```

#### Competition Endpoints

| Method | Endpoint | Auth | Description |
| --- | --- | --- | --- |
| `GET` | `/competitions` | No | List public competitions. |
| `GET` | `/competitions/:id` | No | Get one public competition. |
| `GET` | `/admin/competitions` | Admin | List all competitions. |
| `POST` | `/admin/competitions` | Admin | Create a competition. |
| `PATCH` | `/admin/competitions/:id` | Admin | Update a competition. |
| `DELETE` | `/admin/competitions/:id` | Admin | Delete a competition. |

Example admin create request:

```bash
curl -X POST http://localhost:5000/api/v1/admin/competitions \
  -H "Authorization: Bearer <admin-token>" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Robotics Sprint",
    "organizer": "Engineering Club",
    "category": "Robotics",
    "mode": "Hybrid",
    "teamSize": "2-4",
    "status": "open",
    "prize": "1000 SAR",
    "description": "Build an autonomous robot prototype.",
    "requirements": ["Student ID", "Prototype demo"],
    "tags": ["robotics", "hardware"],
    "links": "https://example.com",
    "startDate": "2026-06-10",
    "endDate": "2026-06-12",
    "registrationDeadline": "2026-06-01",
    "participationType": "team"
  }'
```

### Teams And Applications

Team and application routes require a student token unless marked public.

| Method | Endpoint | Role | Description |
| --- | --- | --- | --- |
| `GET` | `/competitions/:id/teams` | Public | List recruiting teams for a competition. |
| `GET` | `/teams/me` | Student | List teams for the current user. |
| `POST` | `/teams` | Team leader | Create a team. |
| `GET` | `/teams/:id` | Student | Get a team by ID. |
| `PUT` | `/teams/:id` | Team leader | Update a team led by the current user. |
| `POST` | `/teams/:id/leave-requests` | Student | Request to leave a team. |
| `GET` | `/teams/leave-requests/incoming` | Team leader | List incoming leave requests. |
| `PATCH` | `/leave-requests/:id/status` | Team leader | Approve or reject a leave request. |
| `GET` | `/applications/me` | Student | List current user's applications. |
| `POST` | `/teams/:teamId/applications` | Competitor | Apply to join a team. |
| `GET` | `/teams/applications/incoming` | Team leader | List incoming team applications. |
| `PATCH` | `/applications/:id/status` | Team leader | Accept or reject an application. |

Example create team request:

```bash
curl -X POST http://localhost:5000/api/v1/teams \
  -H "Authorization: Bearer <team-leader-token>" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Code Falcons",
    "competitionId": "665f1a2b3c4d5e6f78900001",
    "description": "Looking for frontend and ML teammates.",
    "requiredSkills": ["React", "Python"],
    "totalSlots": 4
  }'
```

Example apply to team request:

```bash
curl -X POST http://localhost:5000/api/v1/teams/665f1a2b3c4d5e6f78900002/applications \
  -H "Authorization: Bearer <competitor-token>" \
  -H "Content-Type: application/json" \
  -d '{
    "message": "I can help with React and data visualization."
  }'
```

Example review application request:

```bash
curl -X PATCH http://localhost:5000/api/v1/applications/665f1a2b3c4d5e6f78900003/status \
  -H "Authorization: Bearer <team-leader-token>" \
  -H "Content-Type: application/json" \
  -d '{ "status": "accepted" }'
```

### Profile

Profile routes require authentication.

| Method | Endpoint | Description |
| --- | --- | --- |
| `GET` | `/profile/me` | Get the current user's profile. |
| `PATCH` | `/profile/me` | Update profile fields. |
| `GET` | `/profile/me/skills` | Get current user's skills. |
| `PUT` | `/profile/me/skills` | Replace current user's skills. |
| `GET` | `/profile/:userId` | Get another user's profile. |

Example update profile request:

```bash
curl -X PATCH http://localhost:5000/api/v1/profile/me \
  -H "Authorization: Bearer <access-token>" \
  -H "Content-Type: application/json" \
  -d '{
    "university": "King Saud University",
    "major": "Software Engineering",
    "year": "Junior"
  }'
```

Example replace skills request:

```bash
curl -X PUT http://localhost:5000/api/v1/profile/me/skills \
  -H "Authorization: Bearer <access-token>" \
  -H "Content-Type: application/json" \
  -d '{ "skills": ["React", "Node.js", "MongoDB"] }'
```

### Admin Suggestions

Suggestion routes require an admin token.

| Method | Endpoint | Description |
| --- | --- | --- |
| `GET` | `/admin/suggestions?status=pending` | List competition suggestions. |
| `PATCH` | `/admin/suggestions/:id/decide` | Approve or reject a suggestion using `{ "decision": "approved" | "rejected" }`. |
| `PATCH` | `/admin/suggestions/:id/approve` | Approve a suggestion. |
| `PATCH` | `/admin/suggestions/:id/reject` | Reject a suggestion. |

Example:

```bash
curl -X PATCH http://localhost:5000/api/v1/admin/suggestions/665f1a2b3c4d5e6f78900004/decide \
  -H "Authorization: Bearer <admin-token>" \
  -H "Content-Type: application/json" \
  -d '{ "decision": "approved" }'
```

### Admin Moderation

Moderation routes require an admin token.

| Method | Endpoint | Description |
| --- | --- | --- |
| `GET` | `/admin/moderation/users` | List users. Supports `search`, `accountStatus`, and `systemRole`. |
| `POST` | `/admin/moderation/users/:userId/moderation-actions` | Create a warning, suspension, or ban action. |
| `GET` | `/admin/moderation/users/:userId/moderation-actions` | List moderation actions for a user. |
| `PATCH` | `/admin/moderation/users/:userId/status` | Compatibility route that creates a moderation action. |

Example moderation action request:

```bash
curl -X POST http://localhost:5000/api/v1/admin/moderation/users/665f1a2b3c4d5e6f78900005/moderation-actions \
  -H "Authorization: Bearer <admin-token>" \
  -H "Content-Type: application/json" \
  -d '{
    "penalty": "suspend",
    "duration": "7 days",
    "reason": "Repeatedly submitted inappropriate applications."
  }'
```

## Project Structure

```
src/
├── app/                    # Application configuration and routing
│   ├── App.jsx
│   ├── router.jsx          # Route definitions
│   ├── providers.jsx       # Context providers
│   └── guards/             # Route protection components
├── pages/                  # Route-level page components
│   ├── public/             # Public pages (landing page)
│   ├── auth/               # Authentication pages (login, signup)
│   ├── dashboard/          # User dashboard
│   ├── competitions/       # Competition browsing and details
│   ├── teams/              # Team management
│   ├── applications/       # Application tracking
│   ├── profile/            # User profile management
│   └── admin/              # Admin panel
├── features/               # Domain-specific features
│   ├── auth/               # Authentication logic
│   ├── account/            # Account and role management
│   ├── competitions/       # Competition feature logic
│   ├── teams/              # Team management logic
│   ├── applications/       # Application handling
│   ├── profile/            # Profile management
│   ├── skills/             # Skills management
│   └── admin/              # Admin functionality
├── components/             # Shared reusable components
│   ├── ui/                 # UI primitives (Button, Card, Modal, etc.)
│   ├── layout/             # Layout components
│   ├── navigation/         # Navigation components
│   └── feedback/           # Feedback components (Loading, Empty, Error)
├── lib/                    # Utilities and helpers
│   ├── api/                # API client configuration
│   ├── constants/          # App constants
│   └── utils/              # Helper functions
├── assets/                 # Static assets
│   ├── brand/              # Logo and branding
│   └── illustrations/      # Illustrations and images
├── main.jsx                # Application entry point
└── index.css               # Global styles

```

## Authentication Flow

### Sign Up
1. User navigates to the sign-up page
2. Creates a new student account
3. Selects initial role (Competitor or Team Leader)
4. Enters the app with the selected role

### Log In
1. User logs in with credentials
2. Enters the app with the account's active role
3. Can switch student role from the UI when applicable

### Role Switching
- Once logged in, users can switch between Competitor and Team Leader roles without logging out
- The UI adapts based on the active role

## User Roles

| Role | Access Level | Key Features |
|------|--------------|--------------|
| **Competitor** | Student | Browse competitions, apply to competitions, join teams |
| **Team Leader** | Student | Create/manage teams, accept/reject join requests |
| **Admin** | Elevated | Manage competitions, moderation, user management |

**Note**: One student account can act as both Competitor and Team Leader by switching roles in-app.

## Development

### Code Style
- Components and pages: `PascalCase.jsx`
- Hooks, services, utilities: `camelCase.js`
- Follow ESLint configuration for code quality

### Component Organization
- **Page Components** (`pages/`) - Route-level screens
- **Feature Components** (`features/`) - Domain-specific business logic
- **Shared Components** (`components/`) - Generic reusable UI

### State Management
- Context API for global state (Authentication, Role)
- Local state for component-specific data

## Getting Started as a Developer

1. **Start the backend API**
   ```bash
   cd backend
   npm run dev
   ```

2. **Start the frontend dev server in a second terminal from the repository root**
   ```bash
   npm run dev
   ```

3. **Create a new feature**
   - Add pages in `src/pages/`
   - Add feature logic in `src/features/`
   - Use shared components from `src/components/`

4. **Add routing**
   - Update `src/app/router.jsx` with new routes
   - Use appropriate route guards (ProtectedRoute, AdminRoute, etc.)

5. **Style with Tailwind**
   - Use Tailwind utility classes for styling
   - Avoid inline styles
   - Create reusable component variants if needed

## Build for Production

```bash
npm run build
```

The optimized build will be in the `dist/` directory.

## Code Quality

Run frontend checks from the repository root:

```bash
npm run lint
npm run build
```

Run backend tests from `backend/`:

```bash
npm test
```

Address any linting, build, or test errors before committing changes.

## Current Status

- ✅ Frontend structure and routing set up
- ✅ Authentication pages (login/signup)
- ✅ Public landing page
- ✅ Competitor dashboard and features
- ✅ Team leader dashboard and features
- ✅ Backend API integration
- ✅ MongoDB seed data
- ✅ Admin panel implementation
- ✅ Deployment guide

## Contributing

Contributions are welcome! To contribute:

1. Create a feature branch (`git checkout -b feature/AmazingFeature`)
2. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
3. Push to the branch (`git push origin feature/AmazingFeature`)
4. Open a Pull Request

## Support

For questions or issues, please [open an issue](https://github.com/JASSIM-ALHUMAID/SWE363-project/issues) on GitHub.

## License

This project is part of the SWE363 course. All rights reserved.

---

**Made with ❤️ for university students and competitions**
