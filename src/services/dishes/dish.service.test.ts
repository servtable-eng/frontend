import { afterEach, describe, expect, it, vi } from 'vitest';
import { buildDishFormData, updateDish } from './dish.service';
import type { DishPayload } from '../../types/dish';

const payload: DishPayload = {
  name: 'Prato',
  description: 'Descrição',
  ingredients: ['Ingrediente'],
  category: 'PRATO_PRINCIPAL',
  costPerKg: 42,
  recommendedWeightInGrams: 250,
  available: true,
  availableQuantityInGrams: 1000,
  lowStockThresholdInGrams: 200,
};

afterEach(() => {
  vi.unstubAllGlobals();
});

function mockSuccessfulRequest() {
  const fetchMock = vi.fn().mockResolvedValue({
    ok: true,
    headers: new Headers({ 'content-type': 'application/json' }),
    json: vi.fn().mockResolvedValue({}),
    text: vi.fn().mockResolvedValue(''),
  });
  vi.stubGlobal('fetch', fetchMock);
  return fetchMock;
}

describe('updateDish', () => {
  it('sends the dish JSON as a multipart blob without defining Content-Type', async () => {
    const fetchMock = mockSuccessfulRequest();

    await updateDish('dish-1', payload);

    const [, request] = fetchMock.mock.calls[0] as [string, RequestInit];
    const formData = request.body as FormData;

    expect(request.method).toBe('PUT');
    expect(new Headers(request.headers).has('Content-Type')).toBe(false);
    expect(formData).toBeInstanceOf(FormData);
    expect(formData.has('image')).toBe(false);

    const dishPart = formData.get('dish') as Blob;
    expect(dishPart.type).toBe('application/json');
    expect(JSON.parse(await dishPart.text())).toEqual(payload);
  });

  it('appends the original GIF file without converting it', async () => {
    const fetchMock = mockSuccessfulRequest();
    const gif = new File(['GIF89a'], 'animado.gif', { type: 'image/gif' });

    await updateDish('dish-1', payload, gif);

    const [, request] = fetchMock.mock.calls[0] as [string, RequestInit];
    const formData = request.body as FormData;

    expect(formData.get('image')).toBe(gif);
  });
});

describe('buildDishFormData', () => {
  it('keeps the GIF instance, MIME type, name, and dish JSON blob', async () => {
    const gif = new File(['GIF89a'], 'animado.gif', { type: 'image/gif' });
    const formData = buildDishFormData(payload, gif);
    const dishPart = formData.get('dish') as Blob;
    const imagePart = formData.get('image') as File;

    expect(imagePart).toBe(gif);
    expect(imagePart.type).toBe('image/gif');
    expect(imagePart.name).toBe('animado.gif');
    expect(dishPart.type).toBe('application/json');
    expect(JSON.parse(await dishPart.text())).toEqual(payload);
  });

  it('omits the image when no replacement was selected', () => {
    const formData = buildDishFormData(payload);

    expect(formData.has('dish')).toBe(true);
    expect(formData.has('image')).toBe(false);
  });
});
