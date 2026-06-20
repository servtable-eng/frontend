# Developer Quickstart: Frontend Routing Architecture

## Install and start

1. Run `npm install` in the repo root.
2. Run `npm run dev` to start the Vite development server.
3. Open the app in the browser and verify that the current preview server behavior has been replaced by route navigation.

## Implementation Steps

1. Remove the Component Preview Server logic from `src/App.tsx`.
2. Add `BrowserRouter` and route definitions from `react-router-dom` in `src/App.tsx` or `src/routes/AppRoutes.tsx`.
3. Create a route configuration for the customer pages:
   - `/` → `CustomerHome`
   - `/buffet` → `CustomerBuffetHome`
   - `/dish/:id` → `DishDetails`
   - `/dish/:id/v2` → `DishDetailsV2` (preserve the alternative mockup page)
4. Create a route configuration for the admin pages:
   - `/admin` and `/admin/dashboard` → `Dashboard`
   - `/admin/cardapio` → `GerenciamentoCardapio`
   - `/admin/cardapio/novo` → `CadastroPrato`
   - `/admin/cardapio/form` → `CadastroPratoForm`
   - `/admin/pedidos` → `Orders`
   - `/admin/imagens` → `AtualizacaoImagens`
   - `/admin/imagens/buffet` → `GestaoImagensBuffet`
   - `/admin/buffet` → `OrganizacaoBuffet`
   - `/admin/buffet/dnd` → `OrganizacaoBuffetDnD`
5. Replace any local `href="#"` anchors in the mockup pages with `Link` or `NavLink` from `react-router-dom`.
6. Create or migrate reusable route scaffolding into `src/routes/`, `src/pages/`, and `src/layouts/` as needed.
7. Keep the existing UI design intact while wiring the pages to client-side navigation.

## Notes

- The routing implementation should preserve the existing visuals from `src/components/mockups/serv-table`.- Route definitions are now centralized under `src/routes/AppRoutes.tsx` and route constants are available in `src/routes/routeConstants.ts`.- This phase prepares the frontend for future API integration without introducing backend behavior.
- Validate browser refresh behavior for direct route URLs.
