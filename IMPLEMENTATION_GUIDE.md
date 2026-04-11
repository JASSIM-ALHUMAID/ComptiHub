# UI/UX Improvement Implementation Guide

## Phase 1: Foundation (Before refactoring pages)

### Step 1.1: Extended Button Component
Update the Button component to include new variants for secondary buttons and outline styles.

**File**: `src/components/ui/Button.jsx`

```jsx
import { cn } from '../../lib/utils/cn'

const variantClasses = {
  primary: 'landing-button-primary',
  secondary: 'landing-button-secondary',
  outline: 'border border-[rgba(77,70,50,0.28)] text-[rgba(226,226,232,0.72)] hover:border-(--landing-gold) hover:text-(--landing-gold-soft) bg-transparent',
  'outline-gold': 'border border-[rgba(250,204,21,0.3)] bg-[rgba(250,204,21,0.06)] text-(--landing-gold) hover:border-(--landing-gold) hover:bg-[rgba(250,204,21,0.12)]',
  'text-only': 'border-0 bg-transparent text-(--landing-gold) hover:text-(--landing-gold-soft)',
}

const sizeClasses = {
  nav: 'min-h-11 px-6 text-[0.78rem] sm:min-h-12 sm:px-8 sm:text-[0.84rem]',
  hero: 'min-h-14 px-8 text-[0.84rem] sm:min-h-16 sm:px-10 sm:text-[0.9rem]',
  sm: 'min-h-9 px-4 text-[0.75rem]',
  md: 'min-h-10 px-5 py-2.5 text-sm',
}

export default function Button({
  children,
  as: Component = 'button',
  type = 'button',
  className,
  variant = 'primary',
  size = 'hero',
  fullWidth = false,
  ...props
}) {
  const componentProps = Component === 'button' ? { type } : {}

  return (
    <Component
      className={cn(
        'landing-button inline-flex items-center justify-center whitespace-nowrap border transition-all duration-300 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-(--landing-gold)',
        variantClasses[variant],
        sizeClasses[size],
        fullWidth && 'w-full',
        className,
      )}
      {...componentProps}
      {...props}
    >
      {children}
    </Component>
  )
}
```

---

## Phase 2: Competitions Page Refactor

### Before:
```jsx
// src/pages/competitions/CompetitionsPage.jsx (Original - 121 lines)
export default function CompetitionsPage() {
  const [search, setSearch] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('All')
  const [statusFilter, setStatusFilter] = useState('all')

  const filtered = competitions.filter(...)

  return (
    <main className="space-y-6">
      <header className="space-y-2">
        <p className="landing-label text-[0.68rem] text-[rgba(250,204,21,0.82)]">Browse</p>
        <h1 className="landing-title text-3xl text-(--landing-text)">Competitions</h1>
        <p className="landing-copy text-sm text-[rgba(226,226,232,0.65)]">
          Discover active competitions...
        </p>
      </header>

      <div className="space-y-3 rounded-[1.5rem] border border-[rgba(77,70,50,0.22)] bg-[rgba(12,14,18,0.48)] p-4">
        <input
          type="text"
          placeholder="Search competitions or organizers…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full rounded-2xl border border-[rgba(77,70,50,0.35)] bg-[rgba(12,14,18,0.78)] px-4 py-3 text-sm text-(--landing-text) placeholder:text-[rgba(226,226,232,0.4)] focus:border-(--landing-gold) focus:outline-none focus:ring-2 focus:ring-[rgba(250,204,21,0.2)]"
        />
        {/* Multiple category buttons with inline styles */}
        {/* Multiple status buttons with inline styles */}
      </div>

      {filtered.length === 0 ? (
        <div className="rounded-[1.5rem] border border-[rgba(77,70,50,0.22)] bg-[rgba(12,14,18,0.48)] p-8 text-center">
          <p className="landing-copy text-sm text-[rgba(226,226,232,0.55)]">No competitions match your filters.</p>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2">
          {/* Competition cards with inline styles */}
        </div>
      )}
    </main>
  )
}
```

### After (Refactored):
```jsx
// src/pages/competitions/CompetitionsPage.jsx (Refactored - 95 lines)
import { useState } from 'react'
import { Link } from 'react-router-dom'
import Card from '../../components/ui/Card'
import Input from '../../components/ui/Input'
import Badge from '../../components/ui/Badge'
import FilterButton from '../../components/ui/FilterButton'
import Alert from '../../components/ui/Alert'
import { competitions } from '../../data/mocks/competitions'

const categories = ['All', 'Business', 'Competitive Programming', 'Hackathon', 'Robotics', 'Design', 'AI / ML']

export default function CompetitionsPage() {
  const [search, setSearch] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('All')
  const [statusFilter, setStatusFilter] = useState('all')

  const filtered = competitions.filter((c) => {
    const matchesSearch = c.title.toLowerCase().includes(search.toLowerCase()) ||
                         c.organizer.toLowerCase().includes(search.toLowerCase())
    const matchesCategory = selectedCategory === 'All' || c.category === selectedCategory
    const matchesStatus = statusFilter === 'all' || c.status === statusFilter
    return matchesSearch && matchesCategory && matchesStatus
  })

  return (
    <main className="space-y-6">
      <header className="section-header">
        <p className="landing-label text-[0.68rem] text-[rgba(250,204,21,0.82)]">Browse</p>
        <h1 className="landing-title text-3xl text-(--landing-text)">Competitions</h1>
        <p className="landing-copy text-sm text-muted">
          Discover active competitions and find the right challenge for your skills.
        </p>
      </header>

      <Card className="space-y-3">
        <Input
          type="text"
          placeholder="Search competitions or organizers…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <div className="flex flex-wrap gap-2">
          {categories.map((cat) => (
            <FilterButton
              key={cat}
              isActive={selectedCategory === cat}
              onClick={() => setSelectedCategory(cat)}
            >
              {cat}
            </FilterButton>
          ))}
        </div>

        <div className="flex flex-wrap gap-2">
          {['all', 'open', 'closed'].map((s) => (
            <FilterButton
              key={s}
              isActive={statusFilter === s}
              onClick={() => setStatusFilter(s)}
            >
              {s === 'all' ? 'All Statuses' : s}
            </FilterButton>
          ))}
        </div>
      </Card>

      {filtered.length === 0 ? (
        <Alert
          variant="info"
          title="No results"
          message="No competitions match your filters."
        />
      ) : (
        <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
          {filtered.map((comp) => (
            <Link
              key={comp.id}
              to={`/competitions/${comp.id}`}
              className="group block"
            >
              <Card variant="interactive" className="h-full">
                <div className="mb-3 flex items-start justify-between gap-3">
                  <h2 className="landing-title text-[1.1rem] leading-tight text-(--landing-text) transition-colors duration-200 group-hover:text-(--landing-gold-soft)">
                    {comp.title}
                  </h2>
                  <Badge
                    variant={comp.status === 'open' ? 'success' : 'danger'}
                    size="md"
                    className="shrink-0"
                  >
                    {comp.status}
                  </Badge>
                </div>

                <p className="landing-copy mb-3 text-xs text-muted-soft">by {comp.organizer}</p>
                <p className="landing-copy mb-4 line-clamp-2 text-sm text-muted">
                  {comp.description}
                </p>

                <div className="mb-3 flex flex-wrap gap-2">
                  {comp.tags.map((tag) => (
                    <Badge key={tag} variant="default" size="sm">
                      {tag}
                    </Badge>
                  ))}
                </div>

                <div className="flex flex-wrap items-center gap-4 text-xs text-muted-lighter">
                  <span>🏆 {comp.prize}</span>
                  <span>👥 {comp.teamSize} members</span>
                  <span>📅 {comp.deadline}</span>
                </div>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </main>
  )
}
```

**Improvements:**
- ✅ Removed 28 lines of inline styling
- ✅ Reusable FilterButton component
- ✅ Consistent spacing with `.section-header`
- ✅ Better color semantics with `.text-muted` utilities
- ✅ Alert component for empty state
- ✅ Responsive grid: `grid-cols-1 md:grid-cols-2 lg:grid-cols-3`
- ✅ Card variant system for different card types

---

## Phase 3: Competition Details Refactor

### Before (Key Issues):
```jsx
// Line 80 - Apply button (duplicated inline style)
<button className="rounded-full border border-[rgba(250,204,21,0.3)] bg-[rgba(250,204,21,0.06)] px-5 py-2.5 text-sm font-semibold text-(--landing-gold) transition-colors duration-200 hover:border-(--landing-gold) hover:bg-[rgba(250,204,21,0.12)]">
  Apply to Join
</button>

// Line 70 - Cancel button (duplicated inline style)
<button className="rounded-full border border-[rgba(77,70,50,0.28)] px-5 py-2.5 text-sm text-[rgba(226,226,232,0.7)] transition-colors duration-200 hover:border-(--landing-gold) hover:text-(--landing-gold-soft)">
  Cancel
</button>

// Line 92-101 - Status badge (duplicated inline style)
<span className={[
  'shrink-0 rounded-full border px-2.5 py-1 text-[0.68rem] font-semibold uppercase',
  competition.status === 'open'
    ? 'border-green-500/30 bg-green-500/10 text-green-400'
    : 'border-[rgba(255,180,171,0.3)] bg-[rgba(255,180,171,0.08)] text-(--landing-danger)',
].join(' ')}
>
  {competition.status}
</span>
```

### After (Refactored):
```jsx
// Apply button
<Button variant="outline-gold" size="md">
  Apply to Join
</Button>

// Cancel button
<Button variant="outline" size="md">
  Cancel
</Button>

// Status badge
<Badge
  variant={competition.status === 'open' ? 'success' : 'danger'}
  size="md"
>
  {competition.status}
</Badge>
```

---

## Phase 4: My Teams Page Refactor

### Key Refactoring Points:

**Before (Line 65-107)**:
```jsx
<div className="grid gap-4 sm:grid-cols-2">
  {/* Many duplicate card and badge styles */}
</div>
```

**After**:
```jsx
<div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
  {displayTeams.map((team) => (
    <Link key={team.id} to={`/teams/${team.id}`}>
      <Card variant="interactive" className="h-full">
        <div className="mb-1 flex items-start justify-between gap-3">
          <h2 className="landing-title text-[1.1rem]">
            {team.name}
          </h2>
          <Badge
            variant={team.status === 'recruiting' ? 'success' : 'default'}
            size="md"
          >
            {team.status}
          </Badge>
        </div>
        {/* Rest of team card */}
      </Card>
    </Link>
  ))}
</div>
```

---

## Phase 5: AppLayout Mobile Fix

### Before:
```jsx
export default function AppLayout() {
  return (
    <div className="landing-theme min-h-screen">
      <StudentNav />
      <div className="mx-auto grid w-full max-w-7xl gap-6 px-5 py-6 lg:grid-cols-[260px_1fr] lg:px-8">
        <Sidebar />
        {/* Content */}
      </div>
    </div>
  )
}
```

### After:
```jsx
import MobileNav from '../navigation/MobileNav'

export default function AppLayout() {
  return (
    <div className="landing-theme min-h-screen pb-24 lg:pb-0">
      <StudentNav />

      {/* Desktop Layout */}
      <div className="hidden lg:block mx-auto w-full max-w-7xl gap-6 px-8 py-6">
        <div className="grid grid-cols-[260px_1fr] gap-6">
          <Sidebar />
          <div className="space-y-6">
            <StudentRoleSwitcher />
            <Card variant="elevated">
              <Outlet />
            </Card>
          </div>
        </div>
      </div>

      {/* Mobile Layout */}
      <div className="lg:hidden mx-auto w-full px-5 py-6 sm:px-8">
        <div className="space-y-6">
          <StudentRoleSwitcher />
          <Card variant="elevated">
            <Outlet />
          </Card>
        </div>
      </div>

      {/* Mobile Bottom Navigation */}
      <MobileNav />
    </div>
  )
}
```

---

## Implementation Checklist

### Week 1: Foundation
- [ ] Update `Button.jsx` with new variants
- [ ] Update `Card.jsx` with variants
- [ ] Create `Alert.jsx`
- [ ] Create `FilterButton.jsx`
- [ ] Create `Textarea.jsx`
- [ ] Create `MobileNav.jsx`
- [ ] Update `index.css` with theme utilities
- [ ] Test all new components

### Week 2: Refactor Pages
- [ ] Refactor `CompetitionsPage.jsx`
- [ ] Refactor `CompetitionDetailsPage.jsx`
- [ ] Refactor `MyTeamsPage.jsx`
- [ ] Refactor `DashboardPage.jsx`
- [ ] Test mobile responsiveness

### Week 3: Refactor Layout
- [ ] Update `AppLayout.jsx` with mobile support
- [ ] Update `AppLayout.jsx` to use new Card
- [ ] Verify sidebar sticks on first scroll on desktop
- [ ] Test mobile nav functionality

### Week 4: Polish & Testing
- [ ] Verify all pages on mobile (320px, 375px, 768px)
- [ ] Verify all pages on desktop (1024px+)
- [ ] Run ESLint
- [ ] Test keyboard navigation
- [ ] Test color contrast (accessibility)

---

## Testing Checklist

### Mobile (320px - 640px)
- [ ] All buttons are min-height: 40px (touch-friendly)
- [ ] Cards stack vertically
- [ ] No horizontal scroll
- [ ] Navigation is accessible at bottom

### Tablet (641px - 1023px)
- [ ] 2-column grid layouts display properly
- [ ] Padding is consistent
- [ ] Sidebar is hidden

### Desktop (1024px+)
- [ ] Sidebar visible and sticky
- [ ] 3-column grids when appropriate
- [ ] All spacing matches design system

### Accessibility
- [ ] All interactive elements have proper focus states
- [ ] Color contrast meets WCAG AA standards
- [ ] Keyboard navigation works throughout

---

## Files Created/Modified

### New Files
- `src/components/ui/Alert.jsx`
- `src/components/ui/FilterButton.jsx`
- `src/components/ui/Textarea.jsx`
- `src/components/navigation/MobileNav.jsx`

### Modified Files
- `src/components/ui/Button.jsx` - Added variants
- `src/components/ui/Card.jsx` - Added variants
- `src/index.css` - Added theme utilities

### To Be Refactored
- `src/pages/competitions/CompetitionsPage.jsx`
- `src/pages/competitions/CompetitionDetailsPage.jsx`
- `src/pages/teams/MyTeamsPage.jsx`
- `src/components/layout/AppLayout.jsx`

---

## Performance Notes

- Card component uses `forwardRef` for potential ref forwarding needs
- FilterButton uses `type="button"` to prevent form submission
- Mobile nav uses fixed positioning (sticky element at bottom)
- Theme utilities reduce CSS bundle size when consolidated

---

## Next Steps

1. Review the full audit report in `UI_UX_AUDIT.md`
2. Start with Phase 1 implementation
3. Test each phase before moving to the next
4. Use this guide for each page refactor
