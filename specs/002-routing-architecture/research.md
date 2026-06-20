# Research & Decisions: Routing Architecture

## Decision
Use `BrowserRouter` from `react-router-dom` as the root router for the frontend, with explicit route definitions for customer and admin pages.

## Rationale
- The existing `App.tsx` currently implements a Component Preview Server, which is not a user-facing application flow.
- The feature request explicitly requires `BrowserRouter` and route definitions for both customer and admin sections.
- Existing mockup pages under `src/components/mockups/serv-table` are complete application screens and should be reused as route pages without redesign.
- React Router is already a dependency in `package.json`, so this is a coherent architecture change rather than a new dependency addition.

## Alternatives Considered
- **Keep the Component Preview Server**: This would preserve the current generated setup, but it does not satisfy the requirement for a real application routing architecture.
- **Use `HashRouter`**: Rejected because the specification explicitly requires `BrowserRouter`.
- **Load mockup pages through a custom preview path resolver**: Rejected because it maintains the preview-server mental model and slows migration to a real SPA.
- **Move all mockup pages into `src/pages` immediately**: Rejected for initial scope, since the existing pages are already valid app screens and can be reused in place. A gradual migration to `src/pages` is safer.

## Decision Outcome
- Route definitions will be established for the required customer and admin paths.
- Navigation inside the app will be replaced with React Router navigation links instead of `href="#"` anchors.
- The preview server implementation in `App.tsx` will be removed.
- Existing mockup pages will remain available and accessible through routes, with a migration path toward a cleaner `src/pages` and `src/routes` structure.
