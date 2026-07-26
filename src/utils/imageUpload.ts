export const DISH_IMAGE_ACCEPT = 'image/jpeg,image/png,image/webp,image/gif';
const MB = 1024 * 1024;

export const MAX_IMAGE_SIZE_BY_TYPE: Readonly<Record<string, number>> = {
  'image/jpeg': 5 * MB,
  'image/png': 5 * MB,
  'image/webp': 5 * MB,
  'image/gif': 10 * MB,
};

const ALLOWED_DISH_IMAGE_TYPES = new Set(Object.keys(MAX_IMAGE_SIZE_BY_TYPE));
const ALLOWED_EXTENSIONS_BY_TYPE: Readonly<Record<string, readonly string[]>> = {
  'image/jpeg': ['jpg', 'jpeg'],
  'image/png': ['png'],
  'image/webp': ['webp'],
  'image/gif': ['gif'],
};

export type ImageValidationResult =
  | { valid: true }
  | { valid: false; message: string };

export function isAllowedDishImage(file: File) {
  const extension = file.name.toLowerCase().split('.').pop();
  const mimeType = file.type.toLowerCase();
  return ALLOWED_DISH_IMAGE_TYPES.has(mimeType)
    && ALLOWED_EXTENSIONS_BY_TYPE[mimeType]?.includes(extension ?? '') === true;
}

export function validateImageFile(file: File): ImageValidationResult {
  if (file.size === 0) {
    return { valid: false, message: 'Selecione uma imagem válida.' };
  }

  if (!isAllowedDishImage(file)) {
    return { valid: false, message: 'Formato de imagem não suportado. Use JPG, PNG, WebP ou GIF.' };
  }

  const mimeType = file.type.toLowerCase();
  if (file.size > MAX_IMAGE_SIZE_BY_TYPE[mimeType]) {
    return {
      valid: false,
      message: mimeType === 'image/gif'
        ? 'O GIF deve ter no máximo 10 MB.'
        : 'A imagem deve ter no máximo 5 MB.',
    };
  }

  return { valid: true };
}

export function validateDishImage(file: File) {
  const result = validateImageFile(file);
  return result.valid ? null : result.message;
}
