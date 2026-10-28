import { describe, expect, it, vi } from 'vitest'
import { apiRequest, AUTH_TOKEN_KEY, SESSION_INVALIDATED } from '../src/services/api'
import { jsonResponse, onHttp } from './http'
import { tokenFixture } from './fixtures'

describe('HTTP session boundary', () => {
  it('clears the active token and emits invalidation on authenticated 401', async () => {
    localStorage.setItem(AUTH_TOKEN_KEY, tokenFixture())
    const invalidated = vi.fn()
    window.addEventListener(SESSION_INVALIDATED, invalidated, { once: true })
    onHttp('GET', '/auth/me', () => jsonResponse(null, 401))

    await expect(apiRequest('/auth/me')).rejects.toMatchObject({ status: 401 })

    expect(localStorage.getItem(AUTH_TOKEN_KEY)).toBeNull()
    expect(invalidated).toHaveBeenCalledTimes(1)
  })

  it.each([403, 500, 503])('retains the token and emits no invalidation on HTTP %i', async status => {
    const token = tokenFixture()
    localStorage.setItem(AUTH_TOKEN_KEY, token)
    const dispatch = vi.spyOn(window, 'dispatchEvent')
    onHttp('GET', '/auth/me', () => jsonResponse(null, status))

    await expect(apiRequest('/auth/me')).rejects.toMatchObject({ status })

    expect(localStorage.getItem(AUTH_TOKEN_KEY)).toBe(token)
    expect(dispatch).not.toHaveBeenCalled()
  })

  it('retains the token through a network failure and uses it on recovery', async () => {
    const token = tokenFixture()
    localStorage.setItem(AUTH_TOKEN_KEY, token)
    onHttp('GET', '/auth/me', () => { throw new TypeError('Network offline') })
    await expect(apiRequest('/auth/me')).rejects.toThrow('Network offline')
    expect(localStorage.getItem(AUTH_TOKEN_KEY)).toBe(token)
    onHttp('GET', '/auth/me', request => {
      expect(request.headers.get('Authorization')).toBe(`Bearer ${token}`)
      return jsonResponse({ id: 'recovered' })
    })

    await expect(apiRequest('/auth/me')).resolves.toEqual({ id: 'recovered' })
  })

  it('does not invalidate an existing session for a public login 401', async () => {
    const token = tokenFixture()
    localStorage.setItem(AUTH_TOKEN_KEY, token)
    const dispatch = vi.spyOn(window, 'dispatchEvent')
    onHttp('POST', '/auth/login', request => {
      expect(request.headers.has('Authorization')).toBe(false)
      return jsonResponse(null, 401)
    })

    await expect(apiRequest('/auth/login', { method: 'POST', auth: false })).rejects.toMatchObject({ status: 401 })

    expect(localStorage.getItem(AUTH_TOKEN_KEY)).toBe(token)
    expect(dispatch).not.toHaveBeenCalled()
  })

  it('does not clear a newer token when an older request returns 401', async () => {
    localStorage.setItem(AUTH_TOKEN_KEY, tokenFixture())
    const pending = Promise.withResolvers<Response>()
    onHttp('GET', '/auth/me', () => pending.promise)
    const request = apiRequest('/auth/me')
    const newerToken = tokenFixture(Math.floor(Date.now() / 1000) + 7200)
    localStorage.setItem(AUTH_TOKEN_KEY, newerToken)

    pending.resolve(jsonResponse(null, 401))
    await expect(request).rejects.toMatchObject({ status: 401 })

    expect(localStorage.getItem(AUTH_TOKEN_KEY)).toBe(newerToken)
  })
})
