const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:4000/api/v1'

type ApiRequestOptions = {
  method?: 'GET' | 'POST' | 'PATCH' | 'PUT' | 'DELETE'
  body?: unknown
  headers?: HeadersInit
  signal?: AbortSignal
  auth?: boolean
}

type ApiEnvelope<TData> = {
  success: boolean
  message: string
  data: TData
}

const AUTH_TOKEN_KEY = 'ravira.auth.token'

export function getAuthToken() {
  return window.localStorage.getItem(AUTH_TOKEN_KEY)
}

export function setAuthToken(token: string) {
  window.localStorage.setItem(AUTH_TOKEN_KEY, token)
}

export function clearAuthToken() {
  window.localStorage.removeItem(AUTH_TOKEN_KEY)
}

export class ApiError extends Error {
  status: number

  constructor(message: string, status: number) {
    super(message)
    this.name = 'ApiError'
    this.status = status
  }
}

export async function apiRequest<TResponse>(
  path: string,
  options: ApiRequestOptions = {},
): Promise<TResponse> {
  const headers = new Headers(options.headers)
  const isFormData = options.body instanceof FormData

  if (!isFormData && options.body !== undefined) {
    headers.set('Content-Type', 'application/json')
  }

  if (options.auth !== false) {
    const token = getAuthToken()
    if (token) headers.set('Authorization', `Bearer ${token}`)
  }

  const response = await fetch(`${API_BASE_URL}${path}`, {
    method: options.method ?? 'GET',
    headers,
    body: options.body
      ? isFormData
        ? options.body as FormData
        : JSON.stringify(options.body)
      : undefined,
    signal: options.signal,
  })

  if (!response.ok) {
    let message = `Request failed with status ${response.status}`
    try {
      const errorBody = (await response.json()) as Partial<ApiEnvelope<null>>
      if (errorBody.message) message = errorBody.message
    } catch {
      // Keep the generic status message when the backend does not return JSON.
    }
    throw new ApiError(message, response.status)
  }

  if (response.status === 204) {
    return undefined as TResponse
  }

  const envelope = (await response.json()) as ApiEnvelope<TResponse>
  return envelope.data
}

export const api = {
  get: <TResponse>(path: string, signal?: AbortSignal) =>
    apiRequest<TResponse>(path, { signal }),
  post: <TResponse>(path: string, body: unknown, signal?: AbortSignal) =>
    apiRequest<TResponse>(path, { body, method: 'POST', signal }),
  patch: <TResponse>(path: string, body: unknown, signal?: AbortSignal) =>
    apiRequest<TResponse>(path, { body, method: 'PATCH', signal }),
  delete: <TResponse>(path: string, signal?: AbortSignal) =>
    apiRequest<TResponse>(path, { method: 'DELETE', signal }),
}
