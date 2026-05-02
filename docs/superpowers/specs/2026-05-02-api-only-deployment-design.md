# API-Only Deployment Readiness Design

## Goal

Connect authenticated frontend behavior entirely to the backend API, remove silent mock fallbacks from logged-in flows, and provide a repeatable database seed script for deployment/demo data.

## Scope

The app will keep public/static frontend presentation as-is, but every authenticated user flow must use backend data. Mock data may remain in the repository for reference or non-authenticated UI examples, but it must not mask backend API failures after login/signup.

## Architecture

The backend remains the source of truth for users, profiles, competitions, teams, applications, suggestions, moderation actions, and session authorization. The frontend will use `src/lib/api/client.js` and `src/lib/api/endpoints.js` for all authenticated requests. Seed data will be inserted by a backend script that uses the existing Mongoose models and can safely reset/repopulate a local or deployment database on demand.

## Data Seeding

Add a backend script at `backend/scripts/seed.js` and an npm script `npm run seed`. The script will connect using `MONGODB_URI`, clear app collections, create demo users with hashed passwords, create profiles, competitions, teams, applications, suggestions, leave requests, and moderation records. The seed data will include known credentials for admin, competitor, and team leader accounts.

## Frontend Integration

Auth, profile, competitions, teams, applications, admin suggestions, and admin moderation services will stop falling back to mock data for API sessions. Missing methods will be added for incoming applications, reviewing applications, deciding suggestions, and creating moderation actions. UI pages will call those services and show errors instead of replacing failed API calls with mock data.

## Environment

Frontend deployment must set `VITE_API_BASE_URL` to the backend `/api/v1` URL. Backend deployment must set `MONGODB_URI`, `JWT_SECRET`, `CLIENT_URL`, and `NODE_ENV`. Local defaults can remain for development, but deployment documentation must make required values explicit.

## Verification

Deployment readiness is verified by `npm run lint`, `npm run build`, `cd backend && npm test`, `cd backend && npm run seed`, and manual smoke tests against the seeded accounts. Smoke tests cover login, profile loading, competition listing, team creation, application submission, application review, admin suggestion decisions, and admin moderation actions.
