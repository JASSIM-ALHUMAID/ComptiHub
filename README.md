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
- Real-time notifications
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
- ⏳ Real-time notifications
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
