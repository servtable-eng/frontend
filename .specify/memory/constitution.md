# ServTable Constitution

## Core Principles

### I. Separation of Concerns (Business Logic ↔ UI)
Business logic MUST be isolated from React components. All API communication, data transformation, and
business rules belong in service layers or custom hooks, never directly in components. Components are
presentation only—they receive data and callbacks via props. Service layers provide a clear contract
between backend and frontend; business logic never changes component structure.

### II. Type Safety (Strict TypeScript)
Every variable, function parameter, and return value MUST have explicit type annotations. No implicit
`any` types. Request/response data MUST be validated with Zod at service boundaries. Type safety is
non-negotiable and enables safe refactoring. TypeScript configuration enforces strict mode on all files.

### III. Reusable Components & Hooks
Components MUST be small, focused, and single-purpose. Extract reusable hooks for stateful logic
(queries, forms, state). Existing UI components MUST be reused; do not redesign screens or create
duplicate components. All new features leverage the established component library and existing styles
(Tailwind). This maximizes consistency and minimizes maintenance burden.

### IV. Service Layer Architecture
All API calls MUST be implemented through dedicated service layers, never directly in components or
hooks. Each domain (dishes, orders, buffets, etc.) has its own service module. Services are testable
in isolation and can be mocked. Data fetching logic in services is managed by React Query for
caching, synchronization, and background updates. Validation happens in service layers before
returning to components.

### V. Maintainability Over Quick Solutions
Prefer clear, well-structured code over shortcuts. Implement features with the expectation that they
will be maintained for months. Avoid inline logic; extract named functions and hooks. Use React Hook
Form for all form state management (no useState for forms). Use Zod for schema validation and
normalize data at service boundaries. Document complex logic. Small, focused components enable easier
testing and refactoring.

### VI. Tooling & Standards
- **State Management**: React Query for server state, React Hook Form for form state
- **Validation**: Zod schemas at all API boundaries
- **Styling**: Tailwind CSS with existing token system
- **Build**: Vite for fast development and production builds
- **Forms**: React Hook Form for type-safe, maintainable form handling

## Architecture Patterns

### Service Layer Pattern
```
services/
  dishes/
    dishService.ts       # API calls, data transformation
  orders/
    orderService.ts
  buffets/
    buffetService.ts
```

Every service exports:
- Query functions (for React Query)
- Mutation functions (for React Query)
- Zod schemas for validation
- TypeScript interfaces derived from schemas

### Component Structure
- Components receive data and callbacks via props
- Use custom hooks for complex state (useQuery, useForm, custom logic)
- Components focus on rendering only; no API logic or business rules
- Reuse existing UI components from `src/components/ui/`

## Governance

All changes to ServTable MUST comply with these six principles. During code review:
- Verify business logic is in services, not components
- Confirm all types are explicit (no implicit `any`)
- Check that new components follow reusability guidelines
- Ensure API calls use service layers + React Query
- Validate forms use React Hook Form + Zod
- Confirm code prioritizes maintainability

Constitution supersedes convenience. When a choice conflicts with these principles, the principle wins.
Amendments require documented rationale and update to this file.

**Version**: 1.0.0 | **Ratified**: 2026-05-31 | **Last Amended**: 2026-05-31
