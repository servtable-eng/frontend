# Frontend Routing Architecture

**Feature Branch**: pending (before_specify hook)

**Created**: 2026-06-01

**Status**: Draft

**Input**: Update the existing frontend specification to replace the Component Preview Server in `App.tsx` with React Router, preserve existing mockup pages, and create a scalable route/pages/layout structure for customer and admin navigation.

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Customer navigation to buffet discovery (Priority: P1)

A customer opens the application and navigates between the home page, buffet page, and dish details pages without triggering a full browser reload.

**Why this priority**: This is the core public-facing experience and verifies that the app routing has replaced the preview server while preserving existing UI pages.

**Independent Test**: Load the app, visit `/`, click or navigate to `/buffet`, then open `/dish/1` or `/dish/2` and confirm the correct existing page renders without a full page reload.

**Acceptance Scenarios**:

1. **Given** the user is on the home page, **When** they navigate to `/buffet`, **Then** the buffet discovery page is displayed using the existing `CustomerBuffetHome` page.
2. **Given** the user is on the buffet page, **When** they navigate to `/dish/1`, **Then** the dish details page is displayed using an existing dish details page without a full browser reload.

---

### User Story 2 - Admin section routing (Priority: P1)

An admin accesses the administration area and visits the dashboard, cardápio, orders, images, and buffet management pages through client-side navigation.

**Why this priority**: Admin workflows must work through the same routing architecture so the application structure is consistent and future features can plug into the same router.

**Independent Test**: Load the app and directly visit `/admin`, `/admin/dashboard`, `/admin/cardapio`, `/admin/pedidos`, `/admin/imagens`, and `/admin/buffet` to confirm the corresponding existing mockup pages render as route pages.

**Acceptance Scenarios**:

1. **Given** the admin enters `/admin`, **When** the route resolves, **Then** the admin dashboard page is displayed and navigation remains client-side.
2. **Given** the admin clicks a navigation item inside the admin area, **When** the route changes, **Then** the correct admin page is displayed without a page reload.

---

### User Story 3 - Scalable frontend structure for future integration (Priority: P2)

A developer inspects the frontend structure and sees a scalable layout for pages, routes, hooks, services, and layouts that can support future API integration.

**Why this priority**: Preparing the codebase structure now avoids fragile routing and folder layouts later when backend integration is added.

**Independent Test**: Confirm the repository contains the required top-level folders or a clear migration plan for `src/pages`, `src/routes`, `src/layouts`, `src/services`, `src/hooks`, and `src/components`.

**Acceptance Scenarios**:

1. **Given** the codebase is open, **When** a developer inspects `src/`, **Then** the application is organized to support routing and page reuse without redesigning existing mockup pages.

---

### Edge Cases

- What happens if a user opens an unknown route like `/preview/...` or a non-existent path? The system should not preserve the Component Preview Server behavior and should use the new React Router structure.
- How does navigation behave when a page route is refreshed in the browser? The router should load the correct route page without requiring the preview server.
- What happens when an admin route is accessed directly by URL? The route should render the corresponding page and not fall back to the preview experience.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: The frontend MUST use `BrowserRouter` at the root of the application to manage client-side navigation.
- **FR-002**: The application MUST define explicit routes for customer pages: `/`, `/buffet`, and `/dish/:id`.
- **FR-003**: The application MUST define explicit routes for admin pages: `/admin`, `/admin/dashboard`, `/admin/cardapio`, `/admin/pedidos`, `/admin/imagens`, and `/admin/buffet`.
- **FR-004**: The existing mockup pages in `src/components/mockups/serv-table` MUST be reused as route pages, without redesigning their UI.
- **FR-005**: Navigation links and buttons in the application MUST use React Router navigation instead of `href="#"` anchors.
- **FR-006**: `App.tsx` MUST no longer include the Component Preview Server implementation or preview path resolution logic.
- **FR-007**: The frontend structure MUST be prepared for future expansion with organized folders such as `src/pages`, `src/routes`, `src/layouts`, `src/services`, `src/hooks`, and `src/components`.
- **FR-008**: The updated routing architecture MUST preserve the existing visual design and mockup page presentation.

### Key Entities

- **Route definition**: the mapping between a URL path and an existing mockup page component.
- **Customer page**: a reusable route page for public-facing views like home, buffet discovery, and dish details.
- **Admin page**: a reusable route page for administrative workflows like dashboard, cardápio, orders, and image management.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: The application starts through `BrowserRouter` and renders a route page on initial load.
- **SC-002**: All defined customer and admin routes are accessible and render the corresponding existing mockup pages.
- **SC-003**: Navigation between routes works without a full browser reload.
- **SC-004**: `App.tsx` contains no Component Preview Server behavior and no `/preview/*` route handling.
- **SC-005**: Existing UI appearance is preserved when pages are rendered through React Router.
- **SC-006**: The codebase structure includes or plans for the required route/page/layout folders to support future API integration.

## Assumptions

- Backend implementation is out of scope for this feature; the routing architecture is limited to frontend page composition.
- The existing mockup pages under `src/components/mockups/serv-table` are considered complete route pages and should be reused as-is.
- The navigation system will preserve current page layouts and visual design rather than redesign the user interface.
- The new router structure may initially reference mockup page components directly and can be refactored into `src/pages` over time.
- A simple route fallback or redirect can be added later if needed, but the initial scope focuses on the defined customer and admin routes.
