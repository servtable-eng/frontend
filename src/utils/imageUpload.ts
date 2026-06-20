export const DISH_IMAGE_ACCEPT = 'image/png,image/jpeg,image/jpg,image/webp,image/gif,.gif';

const ALLOWED_DISH_IMAGE_TYPES = new Set([
  'image/png',
  'image/jpeg',
  'image/jpg',
  'image/webp',
  'image/gif',
]);

export function isAllowedDishImage(file: File) {
  const extension = file.name.toLowerCase().split('.').pop();
  return ALLOWED_DISH_IMAGE_TYPES.has(file.type.toLowerCase()) || extension === 'gif';
}
