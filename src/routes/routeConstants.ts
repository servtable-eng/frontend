export const ROUTES = {
  CUSTOMER_HOME: '/',
  CUSTOMER_BUFFET: '/buffet',
  CUSTOMER_DISH_DETAILS: '/dish/:id',
  CUSTOMER_PLATE_BUILDER: '/plate-builder',
  CUSTOMER_PLATE_REVIEW: '/plate-review',
  CUSTOMER_CART: '/cart',
  CUSTOMER_ORDER_CONFIRMATION: '/order-confirmation',
  ADMIN_ROOT: '/admin',
  ADMIN_DASHBOARD: '/admin/dashboard',
  ADMIN_CARDAPIO: '/admin/cardapio',
  ADMIN_CARDAPIO_FORM: '/admin/cardapio/form',
  ADMIN_ORDERS: '/admin/pedidos',
  ADMIN_IMAGES: '/admin/imagens',
  ADMIN_BUFFET: '/admin/buffet',
};

export function customerDishPath(id: string) {
  return `/dish/${encodeURIComponent(id)}`;
}
