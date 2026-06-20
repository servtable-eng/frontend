# Research: Menu Management Implementation

**Date**: 2026-05-31  
**Feature**: Menu Management (Epic 1)

## Overview

This document consolidates technical research and decisions for implementing the dish management system in ServTable frontend. All research areas have been resolved based on project constraints and best practices.

---

## 1. Tech Stack Validation

### Decision: React 18 + TypeScript + React Query + React Hook Form + Zod

**Rationale**:
- **React 18**: Latest stable version with concurrent rendering and Suspense support for code-splitting
- **TypeScript**: Strict mode enforced; all types explicit; no implicit `any`
- **React Query**: Industry standard for server state; handles caching, synchronization, refetching
- **React Hook Form**: Minimal re-renders; native validation integration; great Zod support
- **Zod**: Runtime schema validation; auto-generates TypeScript types; small bundle size (~10KB)

**Validation**: All specified by user; aligns with constitution requirements (Principles IV, VI)

### Decision: REST API Integration

**Rationale**:
- Backend provides REST endpoints for CRUD operations
- Simpler than GraphQL for this feature scope
- Standard HTTP methods align with conventional dish operations
- Image upload via multipart/form-data is well-supported

**Validation**: Standard practice for React frontends; no GraphQL requirements stated

---

## 2. Service Layer Architecture

### Decision: Single Service Module (`dishService.ts`)

**Rationale**:
- Centralizes all dish-related API calls
- Encapsulates URL construction, headers, auth tokens
- Enables easy mocking for tests
- Service exports query/mutation functions and Zod schemas for reuse

**Validation**: Aligns with Constitution Principle IV (Service Layer Architecture)

### Implementation Details:
- `dishService.ts`: Contains base API client methods
- `schemas.ts`: Zod validators for all dish operations
- Exported functions: `getDishes()`, `getDish(id)`, `createDish()`, `updateDish()`, `deleteDish()`, `uploadDishImage()`

---

## 3. Custom Hooks Strategy

### Decision: Specialized Hooks Wrapping React Query

**Hooks to Create**:
1. **useDishes()**: Query hook for fetching all dishes
   - Returns: `{ data: Dish[], isLoading, error }`
   - Caching: Automatic via React Query (default stale time)
   
2. **useCreateDish()**: Mutation hook for creating dish
   - Accepts: `CreateDishInput` payload
   - Returns: `{ mutate: (input) => Promise<Dish>, isLoading, error }`
   - Side effect: Invalidate dishes query after successful creation
   
3. **useUpdateDish()**: Mutation hook for updating dish
   - Accepts: `dishId` and `UpdateDishInput`
   - Returns: `{ mutate: (input) => Promise<Dish>, isLoading, error }`
   - Side effect: Invalidate dishes query after successful update
   
4. **useDeleteDish()**: Mutation hook for deleting dish
   - Accepts: `dishId`
   - Returns: `{ mutate: () => Promise<void>, isLoading, error }`
   - Side effect: Invalidate dishes query after successful deletion

**Rationale**:
- Encapsulates query/mutation logic
- Centralizes error handling
- Automatic cache invalidation on mutations
- Components remain focused on rendering

**Validation**: Aligns with Constitution Principle III (Reusable Hooks)

---

## 4. Image Upload Handling

### Decision: Multipart Form Upload + Service Wrapper

**Flow**:
1. User selects image file in form
2. Component passes file to `useUploadDishImage()` hook
3. Hook serializes file as multipart/form-data
4. Service sends to `/api/buffets/{buffetId}/dishes/{dishId}/image`
5. Backend returns image URL
6. Form updates dish with new imageUrl
7. React Query invalidates dish/dishes cache

**Rationale**:
- Separates file upload from metadata
- Multipart standard for file uploads
- Service abstracts serialization details from components
- Enables testing of upload logic independently

**Validation**: Standard practice for file uploads in React

---

## 5. Form State Management

### Decision: React Hook Form + Zod Integration

**Implementation**:
- Create `DishFormSchema` derived from `DishSchema` in `schemas.ts`
- All dish forms (Create, Update) use `useForm<DishFormSchema>`
- Zod resolver provides automatic validation
- Pre-fill form with existing dish data for updates

**Rationale**:
- React Hook Form has native `zodResolver` integration
- Single source of truth for validation logic
- Minimal re-renders (only changed fields)
- Type-safe form submission

**Validation**: Industry standard pattern; aligns with Constitution Principle V (Maintainability)

---

## 6. Type Safety Strategy

### Decision: Zod Schemas → TypeScript Types

**Pattern**:
```typescript
// In schemas.ts
export const DishSchema = z.object({
  id: z.string(),
  name: z.string().min(1),
  // ... other fields
});

// Automatically generate type
export type Dish = z.infer<typeof DishSchema>;
```

**Rationale**:
- Single source of truth for runtime validation + types
- Catches API response mismatches at runtime
- Automatic type inference prevents drift
- No duplicate type/schema definitions

**Validation**: Best practice for TypeScript + Zod projects

---

## 7. Component Reuse Strategy

### Decision: Leverage Existing UI Component Library

**Components to Reuse**:
- `Button`: For create, update, delete actions
- `Card`: For dish cards in list view
- `Dialog`: For confirmation dialogs (delete)
- `Input`: For text fields (name, description)
- `Form`: For form wrapper and field handling
- `Table`: For admin dish list (if applicable)
- `Badge`: For availability status indicator
- `Select`: For buffet position selection

**Rationale**:
- Existing components already styled with Tailwind
- Consistent UX across the app
- Reduced development time
- Easier maintenance (centralized component updates)

**Validation**: Constitution Principle III (Reusable Components & Hooks); user requirement: "visual frontend already implemented and must be reused"

---

## 8. State Invalidation Strategy

### Decision: React Query Query Key Factory + Invalidation

**Pattern**:
```typescript
// Define query keys
export const dishQueryKeys = {
  all: ['dishes'] as const,
  lists: () => [...dishQueryKeys.all, 'list'] as const,
  list: (buffetId: string) => [...dishQueryKeys.lists(), buffetId] as const,
  detail: (dishId: string) => [...dishQueryKeys.all, 'detail', dishId] as const,
};

// On mutation success, invalidate
queryClient.invalidateQueries({ queryKey: dishQueryKeys.lists() });
```

**Rationale**:
- Centralized query key management
- Automatic cache invalidation triggers re-fetching
- Prevents stale UI after mutations
- Scalable pattern for complex queries

**Validation**: React Query best practice

---

## 9. Error Handling

### Decision: Centralized Error Handling in Hooks

**Implementation**:
- Service throws typed errors: `ApiError` with `code`, `message`, `statusCode`
- Hooks catch errors and return normalized `error` object
- Components display user-friendly error messages
- Log errors for debugging (console in dev, monitoring service in prod)

**Rationale**:
- Separates API errors from component rendering
- Components don't need error-handling logic
- Consistent error messages across the app

**Validation**: Aligns with Constitution Principle I (Separation of Concerns)

---

## 10. Testing Strategy

### Decision: Unit + Integration Tests; Manual UI Testing

**Test Coverage**:
- **Service layer**: Unit tests for API calls, schema validation
- **Hooks**: Integration tests with React Query TestUtils
- **Components**: Manual testing against existing UI (no new components)
- **E2E**: Manual testing of full workflows (create → list → update → delete)

**Rationale**:
- Services testable in isolation (mock fetch)
- Hooks testable with React Query test utilities
- No new components require testing (reusing existing)
- Manual UI testing verifies integration with existing screens

**Validation**: Pragmatic approach balancing test coverage and implementation speed

---

## Resolved NEEDS CLARIFICATION Items

✅ **All clarifications resolved through specification and user constraints**

- Tech stack: React + TypeScript + React Query + React Hook Form + Zod
- API pattern: REST with multipart image upload
- Services to create: `dishService`, hooks: `useDishes`, `useCreateDish`, `useUpdateDish`, `useDeleteDish`
- Component reuse: Existing UI components from `src/components/ui/`
- State management: React Query for server state, React Hook Form for forms
