# Modern Dashboard Architecture

## Executive Summary

This document outlines the architecture for building a scalable, maintainable admin dashboard for Cartpanda's funnels and checkout platform. The approach prioritizes developer velocity, code consistency, and long-term maintainability while avoiding common pitfalls that lead to "big rewrite" scenarios.

## 1. Architecture Overview

### High-Level Structure

```
dashboard/
├── app/                    # Next.js app directory (or React Router)
│   ├── (auth)/            # Route groups
│   ├── funnels/           # Feature modules
│   ├── orders/            # Feature modules
│   ├── customers/         # Feature modules
│   └── settings/          # Feature modules
├── features/              # Feature-based modules
│   ├── funnels/
│   │   ├── components/    # Feature-specific components
│   │   ├── hooks/        # Feature-specific hooks
│   │   ├── api/          # Feature API calls
│   │   └── types/        # Feature types
│   ├── orders/
│   └── customers/
├── shared/                # Shared across features
│   ├── components/        # Reusable UI components
│   ├── hooks/            # Shared hooks
│   ├── utils/            # Utility functions
│   └── lib/              # Third-party integrations
└── infrastructure/        # App-level concerns
    ├── api/              # API client setup
    ├── auth/             # Authentication
    └── monitoring/       # Error tracking, analytics
```

### Core Principles

1. **Feature Modules**: Each feature (funnels, orders, customers) owns its routes, components, queries, and types
2. **Shared Layer**: Common UI and utilities live in `shared/`, not duplicated
3. **Infrastructure Layer**: Cross-cutting concerns (auth, API, monitoring) isolated
4. **Clear Boundaries**: Features don't import from other features directly

## 2. Design System

### Component Library Strategy

**Decision**: Build a custom component library on top of a base library (e.g., Radix UI, Headless UI)

**Rationale**:
- **Buy**: Full-featured libraries (Material-UI, Ant Design) are heavy and opinionated
- **Build**: Too time-consuming, reinvents the wheel
- **Hybrid**: Use headless components for accessibility, build our own design language

**Implementation**:
```typescript
// shared/components/ui/Button.tsx
import { Button as RadixButton } from '@radix-ui/react-button';
import { cn } from '@/shared/utils/cn'; // className utility

export const Button = ({ variant, size, ...props }) => {
  return (
    <RadixButton
      className={cn(
        'base-button-styles',
        variants[variant],
        sizes[size]
      )}
      {...props}
    />
  );
};
```

### Design Tokens

**Structure**:
```typescript
// shared/design-tokens/index.ts
export const tokens = {
  colors: {
    primary: { 50: '#...', 500: '#...', 900: '#...' },
    semantic: { success: '#...', error: '#...', warning: '#...' }
  },
  spacing: { xs: '4px', sm: '8px', md: '16px', lg: '24px' },
  typography: { fontFamily: {...}, fontSize: {...}, lineHeight: {...} },
  breakpoints: { sm: '640px', md: '768px', lg: '1024px' }
};
```

**Enforcement**:
- Tailwind CSS with custom theme (tokens as source of truth)
- TypeScript types for autocomplete
- ESLint rule to prevent hardcoded colors/spacing
- Storybook for visual regression testing

### Consistency Mechanisms

1. **Component Guidelines**: Documented in Storybook with examples
2. **Design Review**: PR template requires design system compliance check
3. **Linting**: ESLint rules catch common violations
4. **Type Safety**: TypeScript prevents invalid prop combinations

## 3. Data Fetching & State Management

### Server State: TanStack Query (React Query)

**Why TanStack Query**:
- Automatic caching, background refetching, optimistic updates
- Built-in loading/error states
- Reduces boilerplate significantly
- Works great with TypeScript

**Structure**:
```typescript
// features/funnels/api/queries.ts
export const funnelQueries = {
  all: ['funnels'] as const,
  lists: () => [...funnelQueries.all, 'list'] as const,
  list: (filters: FunnelFilters) => [...funnelQueries.lists(), filters] as const,
  details: () => [...funnelQueries.all, 'detail'] as const,
  detail: (id: string) => [...funnelQueries.details(), id] as const,
};

export const useFunnels = (filters: FunnelFilters) => {
  return useQuery({
    queryKey: funnelQueries.list(filters),
    queryFn: () => fetchFunnels(filters),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};
```

### Client State: React Context + useReducer (or Zustand for complex)

**Simple State**: React Context (theme, user preferences)
**Complex State**: Zustand (filters, UI state that needs persistence)

**Rationale**: Avoid Redux for most cases - too much boilerplate for dashboard needs.

### Loading/Error/Empty States

**Pattern**: Consistent components in `shared/components/states/`

```typescript
// shared/components/states/DataState.tsx
export const DataState = ({ 
  isLoading, 
  error, 
  isEmpty, 
  emptyMessage,
  children 
}) => {
  if (isLoading) return <LoadingSpinner />;
  if (error) return <ErrorState error={error} />;
  if (isEmpty) return <EmptyState message={emptyMessage} />;
  return children;
};
```

### Filters/Sorts/Pagination

**Pattern**: URL-based state (Next.js searchParams or React Router)

**Benefits**:
- Shareable URLs
- Browser back/forward works
- Refresh preserves state
- SEO-friendly (if public)

**Implementation**:
```typescript
// features/orders/hooks/useOrderFilters.ts
export const useOrderFilters = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  
  const filters = {
    status: searchParams.get('status') || 'all',
    dateRange: searchParams.get('dateRange') || '30d',
    page: parseInt(searchParams.get('page') || '1'),
  };
  
  const updateFilters = (newFilters: Partial<Filters>) => {
    setSearchParams({ ...filters, ...newFilters });
  };
  
  return { filters, updateFilters };
};
```

## 4. Performance

### Bundle Splitting

**Strategy**: Route-based code splitting + feature-based splitting

```typescript
// app/funnels/page.tsx
import { lazy } from 'react';
const FunnelList = lazy(() => import('@/features/funnels/components/FunnelList'));

export default function FunnelsPage() {
  return <Suspense fallback={<Loading />}><FunnelList /></Suspense>;
}
```

**Tools**: 
- Vite/Next.js automatic code splitting
- Dynamic imports for heavy components
- Preload critical routes

### Virtualization

**For Large Lists**: Use `@tanstack/react-virtual` or `react-window`

```typescript
// Only render visible rows
const virtualizer = useVirtualizer({
  count: items.length,
  getScrollElement: () => parentRef.current,
  estimateSize: () => 50,
});
```

### Memoization Strategy

1. **React.memo**: For expensive components that re-render frequently
2. **useMemo**: For expensive computations
3. **useCallback**: For functions passed to memoized children
4. **Don't over-memoize**: Profile first, optimize second

### Avoiding Rerenders

**Pattern**: Colocate state, use composition

```typescript
// ❌ Bad: State in parent causes all children to re-render
<Parent>
  <ExpensiveChild1 />
  <ExpensiveChild2 />
</Parent>

// ✅ Good: State colocated or lifted appropriately
<Parent>
  <ExpensiveChild1WithState />
  <ExpensiveChild2 />
</Parent>
```

### Instrumentation

**Metrics to Track**:
- Time to Interactive (TTI)
- First Contentful Paint (FCP)
- Largest Contentful Paint (LCP)
- Bundle size per route
- API response times

**Tools**:
- Web Vitals API
- Custom performance marks
- Sentry Performance Monitoring
- Lighthouse CI in CI/CD

## 5. Developer Experience & Scaling

### Onboarding

**New Engineer Checklist**:
1. Read architecture docs (this document)
2. Review component guidelines in Storybook
3. Clone example feature module
4. Pair with senior engineer on first PR
5. Complete TypeScript/React training if needed

### Conventions & Enforcement

**Linting**:
- ESLint with strict rules
- Prettier for formatting
- Husky pre-commit hooks
- CI fails on lint errors

**PR Template**:
```markdown
## Changes
- [ ] Feature module follows structure
- [ ] Components use design system
- [ ] Types are properly defined
- [ ] Tests added/updated
- [ ] Accessibility checked
- [ ] Performance considered
```

**Component Guidelines** (enforced via linting):
- Components in PascalCase
- Hooks prefixed with `use`
- One component per file
- Props interface exported
- JSDoc comments for complex logic

### Preventing One-Off UI

**Mechanisms**:
1. **Design System First**: New components must use design tokens
2. **Component Review**: PR reviewers check for design system usage
3. **Storybook**: All components documented with examples
4. **Linting**: ESLint rules prevent inline styles, hardcoded values

**Example Rule**:
```javascript
// .eslintrc.js
rules: {
  'no-restricted-syntax': [
    'error',
    {
      selector: 'JSXAttribute[name.name="style"]',
      message: 'Use design tokens and Tailwind classes instead of inline styles',
    },
  ],
}
```

## 6. Testing Strategy

### Unit Tests

**What to Test**:
- Utility functions
- Custom hooks
- Pure components (no side effects)

**Tools**: Vitest or Jest + React Testing Library

**Coverage Target**: 80% for utils/hooks, 60% for components

### Integration Tests

**What to Test**:
- Feature flows (e.g., "create funnel → add upsell → connect")
- API integration (mocked)
- Form submissions

**Tools**: React Testing Library + MSW (Mock Service Worker)

### E2E Tests

**What to Test**:
- Critical user journeys
- Payment flows (if applicable)
- Authentication flows

**Tools**: Playwright or Cypress

**Coverage Target**: 10-15 critical flows, not everything

### Minimum Testing Before Moving Fast

**Required**:
- Unit tests for business logic (hooks, utils)
- Integration test for new feature flow
- Manual QA checklist completed

**Nice to Have**:
- E2E test for critical path
- Visual regression tests (if design-heavy)

## 7. Release & Quality

### Feature Flags

**Strategy**: Use feature flags for gradual rollouts

**Tools**: LaunchDarkly, Flagsmith, or custom solution

**Pattern**:
```typescript
// infrastructure/feature-flags/index.ts
export const useFeatureFlag = (flag: string) => {
  const { data } = useQuery(['featureFlags', flag], fetchFlag);
  return data?.enabled ?? false;
};

// Usage
const showNewDashboard = useFeatureFlag('new-dashboard');
```

### Staged Rollouts

**Process**:
1. Internal team (10%)
2. Beta users (25%)
3. Gradual increase (50% → 100%)
4. Monitor error rates, performance metrics

**Tools**: Feature flags + analytics

### Error Monitoring

**Tool**: Sentry (or similar)

**Setup**:
- Error boundaries at route level
- API error tracking
- User context (user ID, route, actions)
- Source maps for production

**Response**:
- Alerts for error rate spikes
- Weekly error review
- P0 errors fixed immediately

### Ship Fast But Safe

**Principles**:
1. **Small PRs**: Easier to review, less risk
2. **Feature Flags**: Can disable quickly
3. **Monitoring**: Know immediately if something breaks
4. **Rollback Plan**: Can revert deploy in < 5 minutes
5. **Testing**: Automated tests catch most issues

**Process**:
- PR → Review → Merge → Deploy to staging → E2E tests → Deploy to production (with feature flag) → Monitor → Enable for all users

## 8. Accessibility (WCAG Compliance)

### Implementation

1. **Semantic HTML**: Use proper elements (`<nav>`, `<main>`, `<aside>`)
2. **ARIA Labels**: For interactive elements without visible labels
3. **Keyboard Navigation**: All features accessible via keyboard
4. **Focus Management**: Visible focus indicators, logical tab order
5. **Screen Reader Support**: Test with NVDA/JAWS
6. **Color Contrast**: WCAG AA minimum (4.5:1 for text)

### Testing

- Automated: axe-core in CI
- Manual: Keyboard navigation, screen reader testing
- Regular audits: Quarterly accessibility reviews

## 9. Tradeoffs & Decisions

### What We're Optimizing For

1. **Developer Velocity**: Fast iteration, clear patterns
2. **Consistency**: Design system prevents UI drift
3. **Maintainability**: Feature modules, clear boundaries
4. **Performance**: Good enough, not perfect (optimize when needed)

### What We're Trading Off

1. **Bundle Size**: Accepting larger initial bundle for developer experience
2. **Complexity**: Some abstraction for consistency
3. **Perfect Performance**: Optimize when metrics show issues, not preemptively
4. **100% Test Coverage**: Focus on critical paths, not everything

### Avoiding "Big Rewrite" Traps

**Principles**:
1. **Incremental Migration**: Migrate features one at a time
2. **Backward Compatibility**: Don't break existing features
3. **Feature Flags**: Can test new architecture alongside old
4. **Clear Migration Path**: Document how to migrate features

**Example**: Migrating from Redux to TanStack Query
- Keep Redux for existing features
- New features use TanStack Query
- Migrate one feature at a time
- Remove Redux when all features migrated

## 10. Conclusion

This architecture prioritizes:
- **Scalability**: Feature modules allow parallel development
- **Consistency**: Design system prevents UI drift
- **Velocity**: Clear patterns, good tooling
- **Quality**: Testing, monitoring, gradual rollouts

The key is starting simple, enforcing patterns early, and evolving the architecture as the team and product grow.

---

**Questions or suggestions?** This is a living document - update as we learn and grow.

