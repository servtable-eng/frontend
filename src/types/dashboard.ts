import type { OrderStatus } from './order';

export type DashboardRecentOrder = {
  id: string;
  shortId?: string | null;
  tableNumber: string;
  status: OrderStatus;
  createdAt: string;
  total: number;
};

export type RestaurantDashboard = {
  date: string;
  ordersToday: number;
  preparingOrders: number;
  readyOrders: number;
  deliveredOrders: number;
  recentOrders: DashboardRecentOrder[];
};
