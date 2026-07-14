const API_URL = import.meta.env.VITE_API_URL ?? "";
const DEFAULT_RESTAURANT_ID = "5e125073-383c-4edc-827b-372cf2c68ab7";

export class ApiError extends Error {
  public readonly status: number;
  public readonly data: unknown;

  constructor(status: number, data: unknown) {
    super(`API request failed with status ${status}`);
    this.name = "ApiError";
    this.status = status;
    this.data = data;
  }
}

type RequestOptions = Omit<RequestInit, "body"> & {
  body?: unknown;
};

export async function apiRequest<T>(path: string, options: RequestOptions = {}): Promise<T> {
  const { body, headers, ...rest } = options;
  const isFormData = body instanceof FormData;
  const response = await fetch(`${API_URL}${path}`, {
    ...rest,
    headers: {
      ...(body && !isFormData ? { "Content-Type": "application/json" } : {}),
      ...headers,
    },
    body: body ? (isFormData ? body : JSON.stringify(body)) : undefined,
  });

  const payload = await response.json().catch(() => null);

  if (!response.ok) {
    throw new ApiError(response.status, payload ?? { message: response.statusText });
  }

  return payload as T;
}

export function getConfiguredRestaurantId() {
  return (
    import.meta.env.VITE_RESTAURANT_ID ??
    new URLSearchParams(window.location.search).get("restaurantId") ??
    window.localStorage.getItem("restaurantId") ??
    DEFAULT_RESTAURANT_ID
  );
}
