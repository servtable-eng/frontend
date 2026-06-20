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
  tableNumber: string;
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

export type OrderDto = {
  id: string;
};

export type Order = OrderDto;
