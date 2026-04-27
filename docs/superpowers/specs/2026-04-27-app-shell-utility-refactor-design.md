# App Shell Utility Refactor Design

## Goal

Rename shared workspace utility classes so they describe the app shell instead of implying they are admin-only, and normalize active navigation text color across admin and student workspaces.

## Scope

- Rename shared `admin-*` shell/navigation/typography classes to `app-*` equivalents.
- Update all React usages that depend on those renamed classes.
- Preserve route names, role names, user-facing labels, and backend behavior.
- Normalize active workspace navigation links to black text on gold backgrounds.

## Design

The existing `admin-theme` is used by both the admin layout and the student layout. It will become `app-theme`, and shared shell utilities such as sidebar, main panel, mobile nav, wordmark, title, display, and UI text will move to the same `app-*` naming. Existing CSS variables can stay as `--admin-*` for this focused pass because they are internal theme tokens and changing them would create unnecessary churn.

## Verification

- Run `npm run lint`.
- Run `npm run build`.
- Search for leftover shared `admin-*` class usages and confirm any remaining `admin` text is route, data, copy, or variable naming rather than shared utility class naming.
