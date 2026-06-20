# Tasks: Menu Management

**Input**: Design documents from `/specs/001-menu-management/`

**Prerequisites**: plan.md, spec.md, research.md, data-model.md, contracts/

## Phase 1: Setup (Shared Infrastructure)

- [ ] T001 Install `@tanstack/react-query` and `@tanstack/react-query-devtools` in `package.json`
- [ ] T002 Configure React Query provider in `src/main.tsx` by wrapping `<App />` with `QueryClientProvider`
- [ ] T003 Create `src/services/dishes/schemas.ts` with Zod schemas for Dish, CreateDishInput, UpdateDishInput, and DishListResponse
- [ ] T004 Create `src/services/dishes/dishService.ts` with REST API stubs for `getDishes`, `getDish`, `createDish`, `updateDish`, `deleteDish`, and `uploadDishImage`
- [ ] T005 Create `src/hooks/useDishes.ts` for dish list query logic
- [ ] T006 Create `src/hooks/useCreateDish.ts` for create dish mutation logic
- [ ] T007 Create `src/hooks/useUpdateDish.ts` for update dish mutation logic
- [ ] T008 Create `src/hooks/useDeleteDish.ts` for delete dish mutation logic
- [ ] T009 Create `src/hooks/index.ts` exporting `useDishes`, `useCreateDish`, `useUpdateDish`, and `useDeleteDish`

---

## Phase 2: Foundational (Blocking Prerequisites)

- [ ] T010 Add centralized query key definitions and cache invalidation strategy in `src/hooks/useDishes.ts`
- [ ] T011 Add typed API error handling to `src/services/dishes/dishService.ts`
- [ ] T012 Add Zod parsing of backend responses in `src/services/dishes/dishService.ts`
- [ ] T013 Add `src/services/dishes/schemas.ts` validation for unique buffet position and positive prices
- [ ] T014 Verify `src/main.tsx` and `package.json` support React Query usage across all dish management screens

---

## Phase 3: User Story 1 - Create New Dish (Priority: P1)

**Goal**: Allow managers to create a new dish with required details and have it appear in the active menu list.

**Independent Test**: Submit the existing create dish form in `src/components/mockups/serv-table/CadastroPratoForm.tsx` and confirm a new dish is created via `useCreateDish` and appears in the list.

- [ ] T015 [US1] Implement `createDish` in `src/services/dishes/dishService.ts`
- [ ] T016 [US1] Implement `useCreateDish` in `src/hooks/useCreateDish.ts`
- [ ] T017 [US1] Integrate `useCreateDish` into `src/components/mockups/serv-table/CadastroPratoForm.tsx`
- [ ] T018 [US1] Add Zod-powered create form validation and submit handling in `src/components/mockups/serv-table/CadastroPratoForm.tsx`
- [ ] T019 [US1] Add error display and success feedback to `src/components/mockups/serv-table/CadastroPratoForm.tsx`

---

## Phase 4: User Story 2 - Update Existing Dish (Priority: P1)

**Goal**: Allow managers to edit existing dish details and replace an existing image without changing dish identity.

**Independent Test**: Load the existing edit dish screen in `src/components/mockups/serv-table/CadastroPrato.tsx`, change a field, save, and verify the updated dish persists.

- [ ] T020 [US2] Implement `updateDish` in `src/services/dishes/dishService.ts`
- [ ] T021 [US2] Implement `useUpdateDish` in `src/hooks/useUpdateDish.ts`
- [ ] T022 [US2] Prefill update dish fields in `src/components/mockups/serv-table/CadastroPrato.tsx` using current dish data
- [ ] T023 [US2] Integrate form submission in `src/components/mockups/serv-table/CadastroPrato.tsx` with `useUpdateDish`
- [ ] T024 [US2] Add image replacement support in `src/components/mockups/serv-table/CadastroPrato.tsx` using `dishService.uploadDishImage`

---

## Phase 5: User Story 3 - Delete Dish (Priority: P1)

**Goal**: Allow managers to remove a dish from the menu so it no longer appears in menus.

**Independent Test**: Delete a dish from `src/components/mockups/serv-table/GerenciamentoCardapio.tsx` and confirm it is removed from the list.

- [ ] T025 [US3] Implement `deleteDish` in `src/services/dishes/dishService.ts`
- [ ] T026 [US3] Implement `useDeleteDish` in `src/hooks/useDeleteDish.ts`
- [ ] T027 [US3] Replace local delete state in `src/components/mockups/serv-table/GerenciamentoCardapio.tsx` with `useDeleteDish`
- [ ] T028 [US3] Add deletion confirmation and error handling in `src/components/mockups/serv-table/GerenciamentoCardapio.tsx`

---

## Phase 6: User Story 4 - Manage Dish Availability (Priority: P1)

**Goal**: Allow managers to toggle dish availability without deleting the dish, keeping unavailable items visible.

**Independent Test**: Use the availability toggle in `src/components/mockups/serv-table/GerenciamentoCardapio.tsx` and verify the status persists.

- [ ] T029 [US4] Use `useUpdateDish` in `src/components/mockups/serv-table/GerenciamentoCardapio.tsx` to mutate availability status
- [ ] T030 [US4] Keep unavailable dishes visible and clearly labeled in `src/components/mockups/serv-table/GerenciamentoCardapio.tsx`
- [ ] T031 [US4] Add optimistic UI or loading state for availability toggles in `src/components/mockups/serv-table/GerenciamentoCardapio.tsx`

---

## Phase 7: User Story 5 - List/View All Dishes (Priority: P1)

**Goal**: Fetch and display the full dish list in the management screen ordered by buffet position.

**Independent Test**: Load `src/components/mockups/serv-table/GerenciamentoCardapio.tsx` and verify dishes come from the backend and are ordered by buffet position.

- [ ] T032 [US5] Implement `getDishes` in `src/services/dishes/dishService.ts`
- [ ] T033 [US5] Implement `useDishes` in `src/hooks/useDishes.ts`
- [ ] T034 [US5] Replace hardcoded mock data with `useDishes` data in `src/components/mockups/serv-table/GerenciamentoCardapio.tsx`
- [ ] T035 [US5] Order display by `buffetPosition` in `src/components/mockups/serv-table/GerenciamentoCardapio.tsx`
- [ ] T036 [US5] Add loading and error states in `src/components/mockups/serv-table/GerenciamentoCardapio.tsx`

---

## Phase 8: User Story 6 - Upload and Manage Dish Images (Priority: P2)

**Goal**: Upload dish images and allow replacing existing images, with the new image overwriting the old one.

**Independent Test**: Upload or replace an image from `src/components/mockups/serv-table/CadastroPratoForm.tsx` and verify the new URL is stored.

- [ ] T037 [US6] Implement `uploadDishImage` in `src/services/dishes/dishService.ts`
- [ ] T038 [US6] Add image upload handling to `src/components/mockups/serv-table/CadastroPratoForm.tsx`
- [ ] T039 [US6] Add image validation for format and file size in `src/components/mockups/serv-table/CadastroPratoForm.tsx`
- [ ] T040 [US6] Ensure replacing an image overwrites the previous image in `src/components/mockups/serv-table/CadastroPrato.tsx`

---

## Phase 9: User Story 7 - Organize Dishes by Buffet Position (Priority: P2)

**Goal**: Validate and persist unique buffet position values and reflect position order in the dish list.

**Independent Test**: Save dishes with unique positions and attempt a duplicate position save to verify error handling.

- [ ] T041 [US7] Add unique buffet position validation to `src/services/dishes/schemas.ts`
- [ ] T042 [US7] Add duplicate position conflict handling in `src/services/dishes/dishService.ts`
- [ ] T043 [US7] Add buffet position editing support in `src/components/mockups/serv-table/CadastroPrato.tsx`
- [ ] T044 [US7] Add buffet position ordering and display in `src/components/mockups/serv-table/GerenciamentoCardapio.tsx`
- [ ] T045 [US7] Surface position validation errors in the create/update UI screens

---

## Phase 10: Polish & Cross-Cutting Concerns

- [ ] T046 [P] Export shared dish types from `src/services/dishes/schemas.ts` for reuse in hooks and components
- [ ] T047 [P] Add comments to `src/services/dishes/dishService.ts` and `src/hooks/*` explaining query invalidation and mutation behavior
- [ ] T048 [ ] Verify all new dish service and hook files are referenced from `src/hooks/index.ts`
- [ ] T049 [ ] Confirm the new dish management integration reuses existing UI files only and does not redesign screens
- [ ] T050 [ ] Update `specs/001-menu-management/tasks.md` if implementation details change during development
