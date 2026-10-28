import { describe, expect, it } from 'vitest'
import { AUTH_TOKEN_KEY } from '../src/services/api'
import { login } from '../src/services/raviraApi'
import { credentials, roles, tokenFixture, userFixture } from './fixtures'
import { jsonResponse, onHttp } from './http'

describe('login role acceptance', () => {
  it.each([401, 400])('leaves no token after rejected credentials (HTTP %i)', async status => {
    onHttp('POST', '/auth/login', () => jsonResponse(null, status))

    await expect(login(credentials.email, 'wrong-password')).rejects.toMatchObject({ status })

    expect(localStorage.getItem(AUTH_TOKEN_KEY)).toBeNull()
  })

  it('rejects a success:false envelope even when HTTP is 200 and data contains a token', async () => {
    onHttp('POST', '/auth/login', () => Response.json({
      success: false, message: 'Credentials rejected', data: { token: tokenFixture(), user: userFixture() },
    }))

    await expect(login(credentials.email, credentials.password)).rejects.toMatchObject({ message: 'Credentials rejected' })

    expect(localStorage.getItem(AUTH_TOKEN_KEY)).toBeNull()
  })

  it.each(roles)('accepts a valid %s login and saves its token', async role => {
    const user = userFixture(role)
    const token = tokenFixture()
    onHttp('POST', '/auth/login', async request => {
      expect(request.headers.get('Content-Type')).toBe('application/json')
      expect(request.headers.has('Authorization')).toBe(false)
      expect(await request.json()).toEqual(credentials)
      return jsonResponse({ token, user })
    })

    await expect(login(credentials.email, credentials.password, role)).resolves.toEqual({ token, user })

    expect(localStorage.getItem(AUTH_TOKEN_KEY)).toBe(token)
  })

  it.each(roles.flatMap(expected => roles.filter(actual => actual !== expected).map(actual => ({ expected, actual }))))(
    'rejects $actual at the $expected portal without storing a token', async ({ expected, actual }) => {
      onHttp('POST', '/auth/login', () => jsonResponse({ token: tokenFixture(), user: userFixture(actual) }))

      await expect(login(credentials.email, credentials.password, expected)).rejects.toMatchObject({ status: 403 })

      expect(localStorage.getItem(AUTH_TOKEN_KEY)).toBeNull()
    },
  )

  it.each(['ADMIN', 'SUPER_ADMIN'] as const)('accepts %s through the admin role array', async role => {
    const token = tokenFixture()
    onHttp('POST', '/auth/login', () => jsonResponse({ token, user: userFixture(role) }))

    await expect(login(credentials.email, credentials.password, ['ADMIN', 'SUPER_ADMIN'])).resolves.toMatchObject({ token })

    expect(localStorage.getItem(AUTH_TOKEN_KEY)).toBe(token)
  })

  it.each([
    { label: 'inactive user', isActive: false, token: tokenFixture() },
    { label: 'missing token', isActive: true, token: '' },
  ])('rejects $label without establishing a session', async ({ isActive, token }) => {
    onHttp('POST', '/auth/login', () => jsonResponse({ token, user: { ...userFixture(), isActive } }))

    await expect(login(credentials.email, credentials.password)).rejects.toMatchObject({ status: 403 })

    expect(localStorage.getItem(AUTH_TOKEN_KEY)).toBeNull()
  })

  it('refuses to store a late successful login after its signal is aborted', async () => {
    const pending = Promise.withResolvers<Response>()
    const controller = new AbortController()
    onHttp('POST', '/auth/login', () => pending.promise)
    const result = login(credentials.email, credentials.password, 'CANDIDATE', controller.signal)

    controller.abort()
    pending.resolve(jsonResponse({ token: tokenFixture(), user: userFixture() }))

    await expect(result).rejects.toMatchObject({ name: 'AbortError' })
    expect(localStorage.getItem(AUTH_TOKEN_KEY)).toBeNull()
  })
})
