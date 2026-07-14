export const DISH_IMAGE_ACCEPT = '.jpg,.jpeg,.png,.webp,.gif,image/jpeg,image/png,image/webp,image/gif';
export const MAX_DISH_IMAGE_SIZE = 5 * 1024 * 1024;

const ALLOWED_DISH_IMAGE_TYPES = new Set([
  'image/png',
  'image/jpeg',
  'image/jpg',
  'image/webp',
  'image/gif',
]);

export function isAllowedDishImage(file: File) {
  const extension = file.name.toLowerCase().split('.').pop();
  return ALLOWED_DISH_IMAGE_TYPES.has(file.type.toLowerCase())
    && ['jpg', 'jpeg', 'png', 'webp', 'gif'].includes(extension ?? '');
}

export function validateDishImage(file: File) {
  if (!isAllowedDishImage(file)) return 'Formato inválido. Selecione uma imagem JPG, JPEG, PNG, WEBP ou GIF.';
  if (file.size > MAX_DISH_IMAGE_SIZE) return 'A imagem deve ter no máximo 5 MB.';
  return null;
}
