# Deployment

## Backend Environment

Set these environment variables for the backend service:

```env
PORT=5000
MONGODB_URI=<mongodb connection string>
JWT_SECRET=<long random secret>
CLIENT_URL=<frontend origin>
NODE_ENV=production
```

`CLIENT_URL` must match the deployed frontend origin so the backend can allow browser requests from the frontend.

## Frontend Environment

Set this environment variable for the frontend build:

```env
VITE_API_BASE_URL=<backend origin>/api/v1
```

For local development, the default API base URL is `http://localhost:5000/api/v1`.

## Install

Install dependencies in both project locations:

```powershell
npm install
Set-Location backend
npm install
```

This repository has two `package.json` files: one at the repo root for the frontend and one in `backend/` for the API server.

## Seed Database

Seed the database from the backend directory:

```powershell
Set-Location backend
npm run seed
```

Local databases can seed directly with `npm run seed`. For a non-local or production-like database, require explicit confirmation before resetting demo data:

```powershell
$env:SEED_CONFIRM="RESET_DEMO_DATA"
npm run seed
```

The seed creates these demo accounts:

| Role | Email | Password |
| --- | --- | --- |
| Admin | `admin@admin.com` | `123456789` |
| Competitor | `competitor@demo.com` | `123456789` |
| Team leader | `leader@demo.com` | `123456789` |

## Verification

Run these checks before deploying:

```powershell
npm run lint
npm run build
Set-Location backend
npm test
```

## Manual Smoke Test

1. Start the backend dev server from `backend/` with `npm run dev`.
2. Start the frontend dev server from the repo root with `npm run dev`.
3. Log in as the competitor and submit a team application.
4. Log in as the team leader and review the application.
5. Log in as the admin and approve or reject a suggestion.
6. Perform an admin moderation action.
7. Reload the app and confirm the submitted and reviewed data persists.
