import '@testing-library/jest-dom/vitest'
import { cleanup } from '@testing-library/react'
import { afterEach, beforeEach, expect, vi } from 'vitest'
import { fetchMock, resetHttp, unexpectedRequests } from './http'

class BlockedTransport {
  constructor() {
    unexpectedRequests.push('Unmocked browser transport')
    throw new Error('Real network access is disabled in frontend tests')
  }
}

vi.stubGlobal('fetch', fetchMock)
vi.stubGlobal('XMLHttpRequest', BlockedTransport)
vi.stubGlobal('WebSocket', BlockedTransport)

beforeEach(() => {
  resetHttp()
  localStorage.clear()
  sessionStorage.clear()
})

afterEach(() => {
  cleanup()
  vi.useRealTimers()
  expect(unexpectedRequests, 'Every HTTP request must have an explicit mock').toEqual([])
})
