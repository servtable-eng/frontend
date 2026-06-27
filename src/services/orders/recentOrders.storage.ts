export const RECENT_ORDERS_STORAGE_KEY = 'servtable_recent_orders';

export type RecentOrder = {
  orderId: string;
  customerName: string;
  tableNumber: string;
  createdAt: string;
};

const MAX_RECENT_ORDERS = 5;

const canUseStorage = () => typeof window !== 'undefined' && Boolean(window.localStorage);

const isRecentOrder = (value: unknown): value is RecentOrder => {
  if (!value || typeof value !== 'object') return false;

  const item = value as Partial<RecentOrder>;
  return (
    typeof item.orderId === 'string' &&
    typeof item.customerName === 'string' &&
    typeof item.tableNumber === 'string' &&
    typeof item.createdAt === 'string'
  );
};

export function getRecentOrders(): RecentOrder[] {
  if (!canUseStorage()) return [];

  try {
    const rawOrders = window.localStorage.getItem(RECENT_ORDERS_STORAGE_KEY);
    if (!rawOrders) return [];

    const parsed = JSON.parse(rawOrders);
    if (!Array.isArray(parsed)) return [];

    return parsed.filter(isRecentOrder).slice(0, MAX_RECENT_ORDERS);
  } catch {
    return [];
  }
}

export function saveRecentOrders(orders: RecentOrder[]) {
  if (!canUseStorage()) return;

  const normalizedOrders = orders
    .filter(isRecentOrder)
    .filter((order, index, list) => (
      list.findIndex(item => item.orderId === order.orderId) === index
    ))
    .slice(0, MAX_RECENT_ORDERS);

  window.localStorage.setItem(RECENT_ORDERS_STORAGE_KEY, JSON.stringify(normalizedOrders));
}

export function addRecentOrder(order: RecentOrder) {
  const nextOrders = [
    order,
    ...getRecentOrders().filter(item => item.orderId !== order.orderId),
  ].slice(0, MAX_RECENT_ORDERS);

  saveRecentOrders(nextOrders);
  return nextOrders;
}

export function removeRecentOrder(orderId: string) {
  const nextOrders = getRecentOrders().filter(order => order.orderId !== orderId);
  saveRecentOrders(nextOrders);
  return nextOrders;
}

export function clearRecentOrders() {
  if (!canUseStorage()) return;

  window.localStorage.removeItem(RECENT_ORDERS_STORAGE_KEY);
}
