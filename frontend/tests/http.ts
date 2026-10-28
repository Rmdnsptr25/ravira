import { vi } from 'vitest'

type Handler = (request: Request) => Response | Promise<Response>
const handlers = new Map<string, Handler>()
export const unexpectedRequests: string[] = []

export const fetchMock = vi.fn<typeof fetch>(async (input, init) => {
  const request = new Request(input, init)
  const url = new URL(request.url)
  const key = `${request.method} ${url.pathname}${url.search}`
  const handler = handlers.get(key)
  if (url.origin !== 'https://ravira.test' || !handler) {
    unexpectedRequests.push(key)
    throw new Error(`Unmocked HTTP request blocked: ${key}`)
  }
  return handler(request)
})

export function onHttp(method: string, path: string, handler: Handler) {
  handlers.set(`${method} /api/v1${path}`, handler)
}

export function jsonResponse(data: unknown, status = 200) {
  return Response.json({ success: status < 400, message: `HTTP ${status}`, data }, { status })
}

export function resetHttp() {
  handlers.clear()
  unexpectedRequests.length = 0
  fetchMock.mockClear()
}
