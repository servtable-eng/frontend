import { afterEach, describe, expect, it, vi } from 'vitest';
import { ApiError, apiRequest } from './api';

afterEach(() => {
  vi.unstubAllGlobals();
});

function mockResponse({
  ok = true,
  status = 200,
  statusText = 'OK',
  payload = {},
  contentType = 'application/json',
}: {
  ok?: boolean;
  status?: number;
  statusText?: string;
  payload?: unknown;
  contentType?: string;
} = {}) {
  const fetchMock = vi.fn().mockResolvedValue({
    ok,
    status,
    statusText,
    headers: new Headers({ 'content-type': contentType }),
    json: vi.fn().mockResolvedValue(payload),
    text: vi.fn().mockResolvedValue(typeof payload === 'string' ? payload : JSON.stringify(payload)),
  });
  vi.stubGlobal('fetch', fetchMock);
  return fetchMock;
}

function getRequest(fetchMock: ReturnType<typeof vi.fn>) {
  return fetchMock.mock.calls[0][1] as RequestInit;
}

describe('apiRequest', () => {
  it('serializes JSON and adds its content type', async () => {
    const fetchMock = mockResponse();
    const payload = { name: 'Prato' };

    await apiRequest('/dishes', { method: 'POST', body: payload });

    const request = getRequest(fetchMock);
    expect(request.body).toBe(JSON.stringify(payload));
    expect(new Headers(request.headers).get('Content-Type')).toBe('application/json');
  });

  it('passes the original FormData without a content type', async () => {
    const fetchMock = mockResponse();
    const formData = new FormData();
    formData.append('dish', 'value');

    await apiRequest('/dishes/1', { method: 'PUT', body: formData });

    const request = getRequest(fetchMock);
    expect(request.body).toBe(formData);
    expect(new Headers(request.headers).has('Content-Type')).toBe(false);
  });

  it('removes a caller-provided JSON content type from FormData', async () => {
    const fetchMock = mockResponse();
    const originalHeaders = { 'Content-Type': 'application/json' };

    await apiRequest('/dishes/1', {
      method: 'PUT',
      headers: originalHeaders,
      body: new FormData(),
    });

    expect(new Headers(getRequest(fetchMock).headers).has('Content-Type')).toBe(false);
    expect(originalHeaders).toEqual({ 'Content-Type': 'application/json' });
  });

  it('preserves unrelated FormData headers', async () => {
    const fetchMock = mockResponse();

    await apiRequest('/dishes/1', {
      method: 'PUT',
      headers: { Authorization: 'Bearer token', 'Content-Type': 'multipart/form-data' },
      body: new FormData(),
    });

    const headers = new Headers(getRequest(fetchMock).headers);
    expect(headers.get('Authorization')).toBe('Bearer token');
    expect(headers.has('Content-Type')).toBe(false);
  });

  it('does not add a content type when there is no body', async () => {
    const fetchMock = mockResponse();

    await apiRequest('/dishes');

    expect(getRequest(fetchMock).body).toBeUndefined();
    expect(new Headers(getRequest(fetchMock).headers).has('Content-Type')).toBe(false);
  });

  it('keeps the status and parsed payload on API errors', async () => {
    mockResponse({
      ok: false,
      status: 415,
      statusText: 'Unsupported Media Type',
      payload: { message: 'Tipo de mídia inválido.' },
    });

    let error: unknown;
    try {
      await apiRequest('/dishes/1');
    } catch (caught) {
      error = caught;
    }

    expect(error).toBeInstanceOf(ApiError);
    if (!(error instanceof ApiError)) throw new Error('Expected ApiError');
    expect(error.status).toBe(415);
    expect(error.data).toEqual({ message: 'Tipo de mídia inválido.' });
  });
});
