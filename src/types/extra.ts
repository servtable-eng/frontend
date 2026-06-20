export type ExtraDto = {
  id: string;
  name: string;
  description: string;
  category: string;
  imageUrl: string;
  salePrice: number;
};

export type ExtraItem = ExtraDto & {
  available: boolean;
};

export type ExtraItemResponse = ExtraDto & {
  available?: boolean;
};

export type ExtraItemPayload = {
  name: string;
  description: string;
  imageUrl: string;
  salePrice: number;
  available: boolean;
};
