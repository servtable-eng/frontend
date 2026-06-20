# Tasks: Frontend Routing Architecture

**Input**: Design documents from `specs/002-routing-architecture/`

**Prerequisites**: `plan.md`, `spec.md`, `research.md`, `data-model.md`, `contracts/frontend-routing.md`

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Create the routing scaffolding and entrypoint for the frontend.

- [X] T001 [P] Create `src/routes/routeConstants.ts` with named constants for customer and admin route paths
- [X] T002 [P] Create `src/layouts/CustomerLayout.tsx` to wrap customer route pages and preserve existing UI spacing
- [X] T003 [P] Create `src/layouts/AdminLayout.tsx` to wrap admin route pages and preserve existing admin page layout
- [X] T004 Create `src/routes/AppRoutes.tsx` with `BrowserRouter`, route definitions, layout wrappers, and `NotFoundPage`
- [X] T005 Update `src/App.tsx` to remove the Component Preview Server and render `AppRoutes` inside `BrowserRouter`

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Establish route fallbacks, page structure, and documentation before user stories.

- [X] T006 [P] Create `src/routes/NotFoundPage.tsx` for unknown route handling
- [X] T007 [P] Create scaffolding in `src/pages/customer/index.ts` and `src/pages/admin/index.ts` that re-export the reused mockup page components
- [X] T008 Create `src/routes/README.md` documenting the route architecture, folder structure, and future migration path from mockups to `src/pages`

---

## Phase 3: User Story 1 - Customer navigation to buffet discovery (Priority: P1)

**Goal**: Wire the customer route flow and enable client-side navigation from home to buffet and dish details.

**Independent Test**: Verify `/`, `/buffet`, and `/dish/:id` load the existing mockup pages without a full browser reload and direct refresh works.

- [X] T009 [US1] Add customer route definitions for `/`, `/buffet`, `/dish/:id`, and `/dish/:id/v2` in `src/routes/AppRoutes.tsx`
- [X] T010 [US1] Update `src/components/mockups/serv-table/CustomerHome.tsx` to replace `href="#"` navigation with `Link` to `/buffet`
- [X] T011 [US1] Update `src/components/mockups/serv-table/CustomerBuffetHome.tsx` to replace page links with `Link` to `/dish/:id`
- [X] T012 [US1] Update `src/components/mockups/serv-table/DishDetails.tsx` to use `useParams()` and derive `dishId` from the route
- [X] T013 [US1] Verify `/dish/:id` route renders `DishDetails` and direct refresh works in the browser

---

## Phase 4: User Story 2 - Admin section routing (Priority: P1)

**Goal**: Wire admin routes and replace preview-style anchors with React Router navigation across admin pages.

**Independent Test**: Verify `/admin`, `/admin/dashboard`, `/admin/cardapio`, `/admin/pedidos`, `/admin/imagens`, and `/admin/buffet` load the existing admin mockup pages client-side.

- [X] T014 [US2] Add admin route definitions for `/admin`, `/admin/dashboard`, `/admin/cardapio`, `/admin/cardapio/novo`, `/admin/cardapio/form`, `/admin/pedidos`, `/admin/imagens`, `/admin/imagens/buffet`, `/admin/buffet`, and `/admin/buffet/dnd` in `src/routes/AppRoutes.tsx`
- [X] T015 [US2] Update `src/components/mockups/serv-table/Cardapio.tsx` to use `Link` for admin navigation items instead of `href="#"`
- [X] T016 [US2] Update `src/components/mockups/serv-table/Dashboard.tsx` to use React Router navigation for admin links
- [X] T017 [US2] Update `src/components/mockups/serv-table/Orders.tsx` and `src/components/mockups/serv-table/AtualizacaoImagens.tsx` to use `Link`/`NavLink` for admin routes
- [X] T018 [US2] Update `src/components/mockups/serv-table/OrganizacaoBuffet.tsx` and `src/components/mockups/serv-table/OrganizacaoBuffetDnD.tsx` to use React Router navigation for buffet management routes
- [X] T019 [US2] Verify direct URL access for `/admin`, `/admin/cardapio`, `/admin/pedidos`, `/admin/imagens`, and `/admin/buffet`

---

## Phase 5: User Story 3 - Scalable frontend structure for future integration (Priority: P2)

**Goal**: Establish a maintainable page and route structure that supports future API integration without redesigning existing mockup pages.

**Independent Test**: Confirm the repo contains `src/pages/`, `src/routes/`, `src/layouts/`, `src/services/`, `src/hooks/`, and `src/components/` with route-supporting scaffolding.

- [X] T020 [US3] Create `src/pages/customer/index.ts` and `src/pages/admin/index.ts` that export the reused route page components
- [X] T021 [US3] Extend `src/routes/routeConstants.ts` to expose canonical route helpers and path names for future integration
- [X] T022 [US3] Update `src/routes/README.md` to include the route contract, customer/admin page mapping, and migration guidance from mockup pages to route page files

---

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: Ensure the route architecture is complete, visually preserved, and ready for future work.

- [X] T023 [P] Remove any remaining `href="#"` route anchors from customer and admin pages in `src/components/mockups/serv-table`
- [X] T024 Validate that route refresh and direct URL entry work for all defined customer and admin routes
- [X] T025 Confirm `src/App.tsx` contains no Component Preview Server code or preview path handling
- [X] T026 Update `specs/002-routing-architecture/quickstart.md` with the final routing implementation notes and developer verification steps

---

## Dependencies & Execution Order

- Phase 1 tasks must run first to establish routing scaffolding.
- Phase 2 tasks provide fallback handling and structure documentation before individual stories.
- Phase 3 and Phase 4 can start after Phase 2 completes and are independently testable.
- Phase 5 builds the final scalability structure and does not block the core customer/admin route functionality.
- Phase 6 is final polish after all route definitions and navigation behavior are working.

## Parallel Opportunities

- `T001`, `T002`, `T003`, and `T006` are parallelizable because they create independent route/layout files.
- `T015`, `T016`, `T017`, and `T018` can be worked on in parallel across different admin page files.
- `T010` and `T011` can run in parallel because they modify separate customer mockup pages.
- `T020` and `T021` are parallelizable if the route helper contract is independent of the page exports.

## Implementation Strategy

1. Complete Phase 1 to build the routing entrypoint and remove the preview server.
2. Complete Phase 2 to add fallback behavior and folder scaffolding.
3. Deliver User Story 1 as the MVP by wiring customer routes and replacing navigation anchors.
4. Deliver User Story 2 by wiring admin routes and replacing admin page anchors.
5. Deliver User Story 3 by documenting structure and establishing future `src/pages/` support.
6. Finish with Phase 6 polish and verification.
