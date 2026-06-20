import { apiRequest } from "../api";

export type BuffetOrganizationCategory = "ENTRADA" | "PRATO_PRINCIPAL" | "SOBREMESA";

export type BuffetOrganizationItem = {
  id: string;
  imageUrl: string;
  name: string;
  category: BuffetOrganizationCategory | string;
  buffetPosition: number;
};

export type UpdateBuffetOrganizationPayload = {
  items: Array<{
    dishId: string;
    buffetPosition: number;
  }>;
};

export function getBuffetOrganization(restaurantId: string) {
  return apiRequest<BuffetOrganizationItem[]>(`/restaurants/${restaurantId}/buffet-organization`);
}

export function updateBuffetOrganization(
  restaurantId: string,
  payload: UpdateBuffetOrganizationPayload,
) {
  return apiRequest<void>(`/restaurants/${restaurantId}/buffet-organization`, {
    method: "PUT",
    body: payload,
  });
}
