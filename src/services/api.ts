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

export function getApiErrorMessage(error: unknown, fallback: string) {
  if (!(error instanceof ApiError) || !error.data || typeof error.data !== "object") {
    return fallback;
  }

  const data = error.data as Record<string, unknown>;
  return typeof data.message === "string" && data.message.trim()
    ? data.message
    : fallback;
}

type RequestOptions = Omit<RequestInit, "body"> & {
  body?: unknown;
};

export async function apiRequest<T>(path: string, options: RequestOptions = {}): Promise<T> {
  const { body, headers: providedHeaders, ...requestOptions } = options;
  const isFormData = typeof FormData !== "undefined" && body instanceof FormData;
  const requestHeaders = new Headers(providedHeaders);

  if (isFormData) {
    requestHeaders.delete("Content-Type");
  } else if (body !== undefined && body !== null && !requestHeaders.has("Content-Type")) {
    requestHeaders.set("Content-Type", "application/json");
  }

  const requestBody = body === undefined || body === null
    ? undefined
    : isFormData
      ? body
      : JSON.stringify(body);

  const response = await fetch(`${API_URL}${path}`, {
    ...requestOptions,
    headers: requestHeaders,
    body: requestBody,
  });

  const contentType = response.headers.get("content-type");
  const payload = contentType?.includes("application/json")
    ? await response.json().catch(() => null)
    : await response.text().catch(() => null);

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
