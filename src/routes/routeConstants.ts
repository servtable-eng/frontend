export const ROUTES = {
  CUSTOMER_HOME: '/',
  CUSTOMER_BUFFET: '/buffet',
  CUSTOMER_DISH_DETAILS: '/dish/:id',
  CUSTOMER_PLATE_BUILDER: '/plate-builder',
  CUSTOMER_PLATE_REVIEW: '/plate-review',
  CUSTOMER_CART: '/cart',
  CUSTOMER_ORDER_CONFIRMATION: '/order-confirmation',
  CUSTOMER_RECENT_ORDERS: '/orders',
  CUSTOMER_ORDER_TRACKING: '/orders/:orderId',
  ADMIN_ROOT: '/admin',
  ADMIN_DASHBOARD: '/admin/dashboard',
  ADMIN_MENU: '/admin/menu',
  ADMIN_EXTRAS: '/admin/extras',
  ADMIN_ORDERS: '/admin/orders',
  ADMIN_SETTINGS: '/admin/settings',
  // Legacy routes kept for backwards compatibility.
  ADMIN_CARDAPIO: '/admin/cardapio',
  ADMIN_CARDAPIO_FORM: '/admin/cardapio/form',
  ADMIN_CARDAPIO_EDIT_FORM: '/admin/cardapio/form/:dishId',
  ADMIN_ORDERS_LEGACY: '/admin/pedidos',
  ADMIN_IMAGES: '/admin/imagens',
  ADMIN_BUFFET: '/admin/buffet',
  ADMIN_SETTINGS_LEGACY: '/admin/configuracoes',
};

export function customerDishPath(id: string) {
  return `/dish/${encodeURIComponent(id)}`;
}

export function customerOrderPath(orderId: string) {
  return `/orders/${encodeURIComponent(orderId)}`;
}

export function adminDishFormPath(dishId: string) {
  return `/admin/cardapio/form/${encodeURIComponent(dishId)}`;
}
