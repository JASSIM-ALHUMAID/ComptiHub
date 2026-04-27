# App Shell Utility Refactor Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Rename shared workspace utility classes from admin-specific names to neutral app-shell names and normalize active nav text color.

**Architecture:** Keep the existing CSS in `src/index.css` as the single source for shared shell utilities. Replace shared `admin-*` class names with `app-*` names in CSS and React, while keeping `--admin-*` CSS variables unchanged to minimize churn.

**Tech Stack:** React 19, Vite, Tailwind CSS v4 utility classes, plain CSS component utilities.

---

### Task 1: Rename Shared CSS Utilities

**Files:**
- Modify: `src/index.css`

- [ ] Rename shared selectors: `admin-theme`, `admin-wordmark`, `admin-display`, `admin-title`, `admin-ui-text`, `admin-sidebar`, `admin-main-panel`, `admin-shell`, `admin-page`, `admin-nav-link`, and `admin-mobile-nav` to matching `app-*` names.
- [ ] Keep `--admin-*` CSS variables unchanged for now.
- [ ] Preserve all existing style declarations.

### Task 2: Update React Class Usage

**Files:**
- Modify: `src/components/layout/AppLayout.jsx`
- Modify: `src/components/layout/AdminLayout.jsx`
- Modify: `src/components/navigation/Sidebar.jsx`
- Modify: `src/components/navigation/MobileNav.jsx`
- Modify: `src/components/navigation/StudentNav.jsx`
- Modify: `src/components/navigation/AdminNav.jsx`
- Modify: `src/components/navigation/AdminMobileNav.jsx`
- Modify: `src/pages/admin/AdminDashboardPage.jsx`
- Modify: `src/pages/admin/ManageCompetitionsPage.jsx`
- Modify: `src/pages/admin/ModerationPage.jsx`
- Modify: `src/pages/admin/SuggestionsPage.jsx`

- [ ] Replace renamed shared utility class references with `app-*` names.
- [ ] Change admin active sidebar/mobile nav text from `text-[var(--admin-surface-low)]` to `text-black!`.
- [ ] Leave user-facing copy such as “Admin console” unchanged.

### Task 3: Verify

**Files:**
- Read-only verification across `src`

- [ ] Run `npm run lint` and fix any lint failures caused by the refactor.
- [ ] Run `npm run build` and fix any build failures caused by the refactor.
- [ ] Search `src` for shared `admin-*` class leftovers and confirm no renamed utility class references were missed.
