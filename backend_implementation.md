# Backend Implementation Plan

## Purpose

This document outlines a phased backend implementation plan for `ComptiHub` using `Node.js`, `Express`, and `MongoDB`.

The main plan is based on the features that are already implemented in the current frontend codebase. Features that appear in the SRS (`devfiles/SWE363-phase3.pdf`) but are not currently represented in the frontend are intentionally excluded from the main implementation scope and moved to a special section at the end.

## Current Frontend Scope To Support

The backend should first support the flows that already exist in the UI:

1. User login, signup, session handling, and role switching.
2. Competition listing, search/filter, and competition details.
3. Recruiting team display inside competition details.
4. Team creation for team leaders.
5. My Teams view and team details view.
6. Join request submission by competitors.
7. Application tracking for competitors.
8. Join request review by team leaders.
9. Profile editing for basic info, education fields, summary, and skills.
10. Admin competition management.
11. Admin suggestion review.
12. Admin moderation actions.

## Recommended Backend Stack

## Core Technologies

1. `express` for HTTP API.
2. `mongodb` with `mongoose` for data modeling.
3. `jsonwebtoken` for access tokens.
4. `bcrypt` for password hashing.
5. `cookie-parser` if using http-only cookie refresh/session flow.
6. `zod` or `joi` for request validation.
7. `dotenv` for environment configuration.
8. `cors`, `helmet`, and rate limiting middleware.

## Suggested Project Structure

```text
backend/
  src/
    app.js
    server.js
    config/
    db/
    middlewares/
    modules/
      auth/
      users/
      profiles/
      skills/
      competitions/
      teams/
      applications/
      suggestions/
      moderation/
      admin/
    utils/
    validators/
  tests/
```

## Phase 1: Backend Foundation

## Goals

Establish the API skeleton, environment setup, database connection, and reusable infrastructure.

## Deliverables

1. Create the backend workspace and install dependencies.
2. Add environment configuration for:
   `PORT`, `MONGODB_URI`, `JWT_SECRET`, `JWT_REFRESH_SECRET`, `CLIENT_URL`.
3. Set up Express app with:
   `helmet`, `cors`, `express.json`, centralized error middleware, request logging.
4. Connect MongoDB with retry-safe startup behavior.
5. Define a standard API response/error shape.
6. Add route versioning, for example `/api/v1`.
7. Add health check endpoints:
   `/health`, `/api/v1/health`.

## Notes

Keep this phase generic and reusable. Do not start with business logic until the app bootstrap, config, and error handling are stable.

## Phase 2: Identity, Auth, and Access Control

## Goals

Replace the frontend mock auth/session logic with real backend authentication and authorization.

## Data Model

### `users`

Fields:

1. `_id`
2. `username`
3. `email`
4. `passwordHash`
5. `systemRole` (`student` or `admin`)
6. `defaultRole` (`competitor` or `teamLeader`)
7. `activeRole` (`competitor`, `teamLeader`, or `admin`)
8. `accountStatus` (`active`, `suspended`, `banned`)
9. `createdAt`
10. `updatedAt`

## Endpoints

1. `POST /auth/signup`
2. `POST /auth/login`
3. `POST /auth/logout`
4. `GET /auth/me`
5. `PATCH /auth/default-role`
6. `PATCH /auth/active-role`

## Rules

1. Hash passwords with `bcrypt`.
2. Reject duplicate username/email.
3. Prevent suspended or banned users from authenticating normally.
4. Enforce RBAC in middleware for student routes vs admin routes.

## Phase 3: Profiles and Skills

## Goals

Support the current profile page and skill editing workflow.

## Data Model

### `profiles`

Fields:

1. `userId`
2. `university`
3. `major`
4. `year`
5. `competitor.bio`
6. `teamLeader.bio`
7. `createdAt`
8. `updatedAt`

### `skills`

Two practical options:

1. Keep skills embedded directly on the profile/user document for faster implementation.
2. Use a dedicated `skills` collection only if you want centralized validation and analytics early.

For the current frontend, embedding skill tags in the profile is the simpler choice.

## Endpoints

1. `GET /profile/me`
2. `PATCH /profile/me`
3. `GET /profile/me/skills`
4. `PUT /profile/me/skills`

## Validation

1. Trim strings.
2. Enforce reasonable max lengths on summary fields.
3. De-duplicate skills case-insensitively.

## Phase 4: Competitions Module

## Goals

Back the student competition feed and details pages, plus admin competition management.

## Data Model

### `competitions`

Fields:

1. `_id`
2. `title`
3. `organizer`
4. `category`
5. `mode`
6. `teamSize`
7. `deadline`
8. `status`
9. `prize`
10. `description`
11. `requirements[]`
12. `tags[]`
13. `links`
14. `startDate`
15. `endDate`
16. `registrationDeadline`
17. `createdBy`
18. `createdAt`
19. `updatedAt`

## Endpoints

### Student-facing

1. `GET /competitions`
2. `GET /competitions/:id`

### Admin-facing

1. `POST /admin/competitions`
2. `PATCH /admin/competitions/:id`
3. `DELETE /admin/competitions/:id`
4. `GET /admin/competitions`

## Query Support

The list endpoint should support:

1. Search by title/organizer.
2. Filter by category.
3. Filter by status.
4. Sorting by deadline or creation date.

## Phase 5: Teams Module

## Goals

Support team creation, team listing for the current user, team details, and recruiting team display on competition pages.

## Data Model

### `teams`

Fields:

1. `_id`
2. `name`
3. `competitionId`
4. `leaderId`
5. `description`
6. `requiredSkills[]`
7. `totalSlots`
8. `memberIds[]`
9. `status` (`recruiting`, `full`, `closed`)
10. `createdAt`
11. `updatedAt`

## Endpoints

1. `POST /teams`
2. `GET /teams/me`
3. `GET /teams/:id`
4. `GET /competitions/:id/teams`

## Core Rules

1. Only team leaders can create teams.
2. Selected competition must exist and be open for registration.
3. Team must start with the creator as leader and first member.
4. `totalSlots` must be positive and compatible with the competition setup.
5. Team status should be derived from capacity where possible.

## Phase 6: Applications and Join Requests

## Goals

Implement the collaboration flow between competitors and team leaders.

## Data Model

### `applications`

Fields:

1. `_id`
2. `applicantId`
3. `teamId`
4. `competitionId`
5. `message`
6. `status` (`pending`, `accepted`, `rejected`)
7. `reviewedBy`
8. `reviewedAt`
9. `createdAt`
10. `updatedAt`

## Endpoints

### Competitor

1. `POST /teams/:teamId/applications`
2. `GET /applications/me`

### Team Leader

1. `GET /teams/applications/incoming`
2. `PATCH /applications/:id/status`

## Core Rules

1. Competitors cannot apply to the same team twice while an active application exists.
2. Team leaders can only review applications for teams they lead.
3. Accepting an application should add the user to the team inside a transaction-like flow.
4. Do not exceed team capacity.
5. When accepted, update team membership and mark the application status atomically.

## Recommended Response Enrichment

For frontend convenience, incoming applications should include:

1. Applicant basic identity.
2. Applicant skills.
3. Team summary.
4. Competition summary.

## Phase 7: Admin Suggestions Workflow

## Goals

Back the admin suggestions queue already implemented in the frontend.

## Data Model

### `competitionSuggestions`

Fields:

1. `_id`
2. `submittedBy`
3. `title`
4. `summary`
5. `resourceLink`
6. `proposedSchedule`
7. `hardwareTier`
8. `budget`
9. `status` (`pending`, `approved`, `rejected`)
10. `reviewedBy`
11. `reviewedAt`
12. `createdAt`
13. `updatedAt`

## Endpoints

1. `GET /admin/suggestions`
2. `PATCH /admin/suggestions/:id/approve`
3. `PATCH /admin/suggestions/:id/reject`

## Implementation Notes

1. Keep suggestion review separate from real competition creation at first.
2. If desired later, approval can optionally generate a draft competition record.

## Phase 8: Admin Moderation

## Goals

Support the moderation desk for suspension, banning, and warning actions.

## Data Model

### `moderationActions`

Fields:

1. `_id`
2. `targetUserId`
3. `adminUserId`
4. `penalty` (`warning`, `suspend`, `ban`)
5. `duration`
6. `reason`
7. `createdAt`

## Endpoints

1. `GET /admin/users`
2. `POST /admin/users/:id/moderation-actions`
3. `GET /admin/users/:id/moderation-actions`

## Core Rules

1. Admin-only access.
2. A moderation action should also update `users.accountStatus`.
3. Suspended/banned users should be blocked by auth middleware.

## Phase 9: API Integration and Frontend Migration

## Goals

Replace all frontend mock data and local state persistence with real API calls.

## Work Items

1. Connect auth context to backend auth endpoints.
2. Replace mock competition reads with API queries.
3. Replace team creation with `POST /teams`.
4. Replace application submission and listing with backend endpoints.
5. Replace profile reads/writes with backend profile endpoints.
6. Replace admin pages with backend-backed CRUD and moderation requests.
7. Add loading, empty, and error handling per page.

## Phase 10: Validation, Security, and Operational Hardening

## Validation

1. Central request validation on all write endpoints.
2. ObjectId validation in route params.
3. Consistent sanitization and string trimming.

## Security

1. `helmet`.
2. CORS restricted to frontend origin.
3. Password hashing.
4. JWT expiry and refresh strategy.
5. RBAC middleware.
6. Rate limiting on auth routes.

## Database Quality

1. Unique indexes on `email` and possibly `username`.
2. Useful indexes on:
   `competitions.status`, `competitions.category`, `teams.competitionId`, `applications.applicantId`, `applications.teamId`, `competitionSuggestions.status`.

## Testing

1. Unit tests for validation and service logic.
2. Integration tests for auth, competitions, teams, and applications.
3. Authorization tests for admin-only and leader-only routes.

## Suggested Implementation Order

1. Phase 1: foundation.
2. Phase 2: auth and RBAC.
3. Phase 3: profiles and skills.
4. Phase 4: competitions.
5. Phase 5: teams.
6. Phase 6: applications.
7. Phase 7: suggestions.
8. Phase 8: moderation.
9. Phase 9: frontend integration.
10. Phase 10: hardening and tests.

## Minimum Viable Backend Milestone

If you want the first working backend milestone quickly, implement this slice first:

1. Auth.
2. Profile read/update.
3. Competitions list/details.
4. Team creation and my teams.
5. Application submission and review.

That will unlock the main student and team leader flows before admin tooling is fully completed.

## Special Section: Features Missing From The Current Frontend

These items appear in the SRS but are not fully represented in the current implemented frontend, so they should not drive the initial backend scope. They should be tracked as a separate backlog after the backend supports the existing UI.

## Team Leader Gaps

1. Edit existing team metadata after creation.
2. Define open roles separately from generic `requiredSkills`.
3. Assign skills to each open role instead of only storing a flat skill list.
4. Remove members from a team roster.
5. View a richer applicant profile modal from the requests queue.

## Competitor Gaps

1. Profile GPA field.
2. Portfolio/external profile links such as GitHub.
3. Public/private profile visibility toggle.
4. Team filtering by required skills or vacant roles on the competition team board.
5. Withdraw pending application.
6. Predefined skill library and autocomplete behavior instead of free-text skill entry.

## Admin Gaps

1. Explicit competition constraint management for `max team size` as a first-class setting.
2. Deletion dependency checks and stronger workflow handling around competitions with linked teams.
3. Suggestion outcome notification flow.
4. Immediate token revocation/session invalidation for suspended or banned users.

## Recommended Handling For Missing Features

When those UI features are implemented later, extend the backend with:

1. `teamRoles` subdocuments or a dedicated collection.
2. richer `profile` fields and visibility controls.
3. application withdrawal endpoint.
4. skill catalog endpoints.
5. notification and audit log modules.
