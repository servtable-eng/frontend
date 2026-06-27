export type PortionSize = 'SMALL' | 'MEDIUM' | 'LARGE';

export type PlateReviewItem = {
  dishId: string;
  dishName: string;
  imageUrl: string;
  portion: PortionSize;
  observation: string;
};

export type PlateReviewState = {
  items?: PlateReviewItem[];
  cartPlateId?: string;
  extraQuantities?: Record<string, number>;
};

export type CreateOrderPayload = {
  restaurantId: string;
  customerName: string;
  tableNumber: number;
  customerPhone: string;
  plateItems: {
    dishId: string;
    portionSize: PortionSize;
    observation: string;
  }[];
  extraItems: {
    extraItemId: string;
    quantity: number;
  }[];
};

export type OrderStatus = 'PENDING' | 'RECEIVED' | 'PREPARING' | 'READY' | 'DELIVERED' | 'CANCELED';

export type OrderPlateItem = {
  id?: string;
  dishId: string;
  dishName: string;
  portionSize: PortionSize;
  observation: string;
  unitPrice?: number;
  subtotal?: number;
};

export type OrderExtraItem = {
  extraItemId: string;
  name: string;
  quantity: number;
  unitPrice: number;
  subtotal: number;
};

export type OrderSummary = {
  id: string;
  restaurantId: string;
  customerName: string;
  tableNumber: number;
  customerPhone: string;
  status: OrderStatus;
  total: number;
  createdAt: string;
  estimatedDeliveryMinutes: number;
  estimatedDeliveryAt: string;
  plateItemsCount?: number;
  extraItemsCount?: number;
  hasObservations?: boolean;
};

export type OrderDetails = OrderSummary & {
  plateItems: OrderPlateItem[];
  extraItems: OrderExtraItem[];
  buffetSubtotal?: number;
  extrasSubtotal?: number;
};

export type OrderDto = {
  id: string;
};

export type Order = OrderDto;
