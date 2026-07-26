import { describe, expect, it } from 'vitest';
import { validateImageFile } from './imageUpload';

const MB = 1024 * 1024;

function imageFile(size: number, name: string, type: string) {
  return new File([new Uint8Array(size)], name, { type });
}

describe('validateImageFile', () => {
  it('accepts a 6 MB GIF', () => {
    expect(validateImageFile(imageFile(6 * MB, 'animado.gif', 'image/gif'))).toEqual({ valid: true });
  });

  it('accepts a GIF at exactly 10 MB', () => {
    expect(validateImageFile(imageFile(10 * MB, 'animado.gif', 'image/gif'))).toEqual({ valid: true });
  });

  it('rejects a GIF above 10 MB with the GIF-specific message', () => {
    expect(validateImageFile(imageFile(10 * MB + 1, 'animado.gif', 'image/gif'))).toEqual({
      valid: false,
      message: 'O GIF deve ter no máximo 10 MB.',
    });
  });

  it('rejects a PNG above 5 MB with the static-image message', () => {
    expect(validateImageFile(imageFile(5 * MB + 1, 'imagem.png', 'image/png'))).toEqual({
      valid: false,
      message: 'A imagem deve ter no máximo 5 MB.',
    });
  });

  it('accepts a JPEG below 5 MB', () => {
    expect(validateImageFile(imageFile(5 * MB - 1, 'imagem.jpg', 'image/jpeg'))).toEqual({ valid: true });
  });

  it('rejects an empty image', () => {
    const emptyGif = new File([], 'vazio.gif', { type: 'image/gif' });

    expect(validateImageFile(emptyGif)).toEqual({
      valid: false,
      message: 'Selecione uma imagem válida.',
    });
  });

  it('rejects an unsupported MIME type with the supported-format message', () => {
    expect(validateImageFile(imageFile(1, 'imagem.bmp', 'image/bmp'))).toEqual({
      valid: false,
      message: 'Formato de imagem não suportado. Use JPG, PNG, WebP ou GIF.',
    });
  });
});
