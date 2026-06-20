# Routing Architecture

This folder contains the frontend route layer for the ServTable app.

## Structure

- `routeConstants.ts` - canonical route names and helper path builders.
- `AppRoutes.tsx` - central route definition and application router.
- `NotFoundPage.tsx` - catch-all route handler for unknown URLs.

## Pages and Layouts

- `src/layouts/CustomerLayout.tsx` - customer-facing wrapper and outlet for customer pages.
- `src/layouts/AdminLayout.tsx` - administrator wrapper and outlet for admin pages.
- `src/pages/customer/index.ts` - re-exports customer route components.
- `src/pages/admin/index.ts` - re-exports admin route components.

## Route Contract

Customer routes:
- `/` - customer landing page
- `/dish/:id` - dish detail view
- `/plate-builder` - plate builder
- `/plate-review` - plate review and extras
- `/order-confirmation` - order confirmation

Admin routes:
- `/admin` - redirects to `/admin/dashboard`
- `/admin/dashboard` - admin dashboard
- `/admin/cardapio` - menu management
- `/admin/cardapio/form` - dish form
- `/admin/pedidos` - orders management
- `/admin/imagens` - buffet image management
- `/admin/buffet` - buffet organization

## Component Boundaries

Route-specific pages live under `src/pages/customer/` and `src/pages/admin/`.
Shared rendering components live under `src/components/customer/` and `src/components/admin/`.
