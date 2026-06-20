# Data Model: Frontend Routing Architecture

## Route Model
The routing architecture is centered on route definitions that map URL paths to existing page components.

### Route
- **path**: string
- **component**: React component
- **layout**: optional layout wrapper (`CustomerLayout` or `AdminLayout`)
- **segment**: `customer` or `admin`
- **params**: optional route parameters such as `id`
- **title**: display label or page title

### Route Parameters
- **dishId**: string — captures the route parameter for `/dish/:id` and may be passed into the dish details page.

## Page Model
Identifies the existing mockup page screens that will be reused as route pages.

### Customer Pages
- **CustomerHome**: root landing page `/`
- **CustomerBuffetHome**: buffet discovery `/buffet`
- **DishDetails**: dish details page `/dish/:id`
- **DishDetailsV2**: alternative dish details page `/dish/:id/v2`

### Admin Pages
- **Dashboard**: admin landing `/admin` and `/admin/dashboard`
- **GerenciamentoCardapio**: primary cardápio management `/admin/cardapio`
- **CadastroPrato**: create dish flow `/admin/cardapio/novo`
- **CadastroPratoForm**: dish form `/admin/cardapio/form`
- **Orders**: orders management `/admin/pedidos`
- **AtualizacaoImagens**: image update `/admin/imagens`
- **GestaoImagensBuffet**: buffet image management `/admin/imagens/buffet`
- **OrganizacaoBuffet**: buffet organization `/admin/buffet`
- **OrganizacaoBuffetDnD**: drag-and-drop buffet organization `/admin/buffet/dnd`

## Domain Concepts
### Dish
- **id**: string or number
- **name**: string
- **category**: string
- **position**: string
- **available**: boolean
- **image**: string

### Buffet
- **name**: string
- **items**: Dish[]
- **layout**: string
- **images**: string[]

## Validation Rules
- Route parameter `:id` must be present for dish detail routes.
- Admin routes must use client-side navigation and preserve the existing UI structure.
- No backend data persistence is required for this phase; routing is the primary model.
