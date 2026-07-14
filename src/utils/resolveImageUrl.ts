export const PLACEHOLDER_IMAGE_URL = 'data:image/svg+xml;charset=UTF-8,%3Csvg xmlns="http://www.w3.org/2000/svg" width="800" height="600" viewBox="0 0 800 600"%3E%3Crect width="800" height="600" fill="%23F0EDE9"/%3E%3Cpath d="M295 390l68-82 48 58 38-44 76 92H275z" fill="%23D1C4BB"/%3E%3Ccircle cx="330" cy="245" r="34" fill="%23D1C4BB"/%3E%3C/svg%3E';

const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL ?? import.meta.env.VITE_API_URL ?? '').replace(/\/+$/, '');

export function resolveImageUrl(imageUrl?: string | null): string {
  const url = imageUrl?.trim();

  if (!url) return PLACEHOLDER_IMAGE_URL;
  if (/^https?:\/\//i.test(url)) return url;
  if (/^(blob:|data:)/i.test(url)) return url;
  if (!API_BASE_URL) return url;

  return `${API_BASE_URL}/${url.replace(/^\/+/, '')}`;
}
