# Frontend Routing Contract

## Contract Overview
This contract defines the route interface for the ServTable frontend application. It captures the customer-facing and admin-facing navigation surface that the React Router implementation must expose.

## Customer Routes
| Path | Component | Description |
|------|-----------|-------------|
| `/` | `CustomerHome` | Landing page for customers |
| `/buffet` | `CustomerBuffetHome` | Buffet discovery page |
| `/dish/:id` | `DishDetails` | Dish details page for a specific dish |
| `/dish/:id/v2` | `DishDetailsV2` | Alternate dish details mockup page |

### Route Parameters
- `:id` — Dish identifier consumed by dish detail pages.

## Admin Routes
| Path | Component | Description |
|------|-----------|-------------|
| `/admin` | `Dashboard` | Admin landing/dashboard page |
| `/admin/dashboard` | `Dashboard` | Explicit admin dashboard path |
| `/admin/cardapio` | `GerenciamentoCardapio` | Menu management overview |
| `/admin/cardapio/novo` | `CadastroPrato` | Create dish flow |
| `/admin/cardapio/form` | `CadastroPratoForm` | Dish form page |
| `/admin/pedidos` | `Orders` | Order management page |
| `/admin/imagens` | `AtualizacaoImagens` | Image update page |
| `/admin/imagens/buffet` | `GestaoImagensBuffet` | Buffet image management page |
| `/admin/buffet` | `OrganizacaoBuffet` | Buffet organization page |
| `/admin/buffet/dnd` | `OrganizacaoBuffetDnD` | Drag-and-drop buffet organization page |

## Navigation Rules
- All internal navigation must use React Router `Link` or `NavLink`.
- No `href="#"` anchors remain for route navigation.
- Route changes must not trigger a full browser reload.

## Preservation Guarantee
- Existing mockup pages under `src/components/mockups/serv-table` remain unchanged visually.
- Pages are reused directly as route targets, preserving current design.
