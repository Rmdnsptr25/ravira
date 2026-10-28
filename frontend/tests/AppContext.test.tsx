import { act, renderHook, waitFor } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import { AppProvider, useAppContext } from '../src/contexts/AppContext'
import { apiRequest, AUTH_TOKEN_KEY } from '../src/services/api'
import { applicationFixture, credentials, mockSession, savedJobFixture, tokenFixture, userFixture } from './fixtures'
import { fetchMock, jsonResponse, onHttp } from './http'

describe('AppProvider session lifecycle', () => {
  it('becomes ready anonymously without calling auth/me', async () => {
    onHttp('GET', '/jobs', () => jsonResponse([]))

    const { result } = renderHook(useAppContext, { wrapper: AppProvider })

    await waitFor(() => expect(result.current.authReady).toBe(true))
    expect(result.current.user).toBeNull()
    expect(fetchMock).toHaveBeenCalledTimes(1)
  })

  it('restores a valid stored session and candidate applications after remount', async () => {
    const token = tokenFixture()
    localStorage.setItem(AUTH_TOKEN_KEY, token)
    mockSession()
    const first = renderHook(useAppContext, { wrapper: AppProvider })
    await waitFor(() => expect(first.result.current.applications).toHaveLength(1))
    first.unmount()

    const { result } = renderHook(useAppContext, { wrapper: AppProvider })

    await waitFor(() => expect(result.current.applications).toHaveLength(1))
    expect(result.current.user).toEqual(userFixture())
    expect(result.current.authReady).toBe(true)
    expect(result.current.authError).toBeNull()
    expect(localStorage.getItem(AUTH_TOKEN_KEY)).toBe(token)
  })

  it('rejects a role mismatch and clears the previous user and private data', async () => {
    localStorage.setItem(AUTH_TOKEN_KEY, tokenFixture())
    mockSession()
    const { result } = renderHook(useAppContext, { wrapper: AppProvider })
    await waitFor(() => expect(result.current.applications).toHaveLength(1))
    act(() => result.current.saveJob(savedJobFixture))
    onHttp('POST', '/auth/login', () => jsonResponse({ token: tokenFixture(), user: userFixture('RECRUITER') }))

    await act(async () => {
      await expect(result.current.login(credentials.email, credentials.password, 'CANDIDATE')).rejects.toMatchObject({ status: 403 })
    })

    expect(result.current.user).toBeNull()
    expect(result.current.applications).toEqual([])
    expect(result.current.savedJobs).toEqual([])
    expect(localStorage.getItem(AUTH_TOKEN_KEY)).toBeNull()
  })

  it('establishes user state after a valid login', async () => {
    mockSession()
    const token = tokenFixture()
    onHttp('POST', '/auth/login', () => jsonResponse({ token, user: userFixture() }))
    const { result } = renderHook(useAppContext, { wrapper: AppProvider })
    await waitFor(() => expect(result.current.authReady).toBe(true))

    await act(async () => { await result.current.login(credentials.email, credentials.password) })

    await waitFor(() => expect(result.current.applications).toHaveLength(1))
    expect(result.current.user).toEqual(userFixture())
    expect(localStorage.getItem(AUTH_TOKEN_KEY)).toBe(token)
  })

  it('clears token and private state when an authenticated request returns 401', async () => {
    localStorage.setItem(AUTH_TOKEN_KEY, tokenFixture())
    mockSession()
    const { result } = renderHook(useAppContext, { wrapper: AppProvider })
    await waitFor(() => expect(result.current.applications).toHaveLength(1))
    act(() => result.current.saveJob(savedJobFixture))
    onHttp('GET', '/private', () => jsonResponse(null, 401))

    await act(async () => { await expect(apiRequest('/private')).rejects.toMatchObject({ status: 401 }) })

    expect(result.current.user).toBeNull()
    expect(result.current.applications).toEqual([])
    expect(result.current.savedJobs).toEqual([])
    expect(result.current.authReady).toBe(true)
    expect(localStorage.getItem(AUTH_TOKEN_KEY)).toBeNull()
  })

  it('ends an invalid saved session on initial auth/me 401', async () => {
    localStorage.setItem(AUTH_TOKEN_KEY, tokenFixture())
    mockSession()
    onHttp('GET', '/auth/me', () => jsonResponse(null, 401))

    const { result } = renderHook(useAppContext, { wrapper: AppProvider })

    await waitFor(() => expect(result.current.authReady).toBe(true))
    expect(result.current.user).toBeNull()
    expect(result.current.authError).toBeNull()
    expect(localStorage.getItem(AUTH_TOKEN_KEY)).toBeNull()
  })

  it.each(['forbidden', 'offline'] as const)('retains the token on %s and restores session when retried', async failure => {
    const token = tokenFixture()
    localStorage.setItem(AUTH_TOKEN_KEY, token)
    mockSession()
    onHttp('GET', '/auth/me', () => {
      if (failure === 'offline') throw new TypeError('Network offline')
      return jsonResponse(null, 403)
    })
    const { result } = renderHook(useAppContext, { wrapper: AppProvider })
    await waitFor(() => expect(result.current.authReady).toBe(true))
    expect(result.current.authError).toEqual(expect.any(String))
    expect(result.current.user).toBeNull()
    expect(localStorage.getItem(AUTH_TOKEN_KEY)).toBe(token)
    onHttp('GET', '/auth/me', () => jsonResponse(userFixture()))

    await act(async () => { await result.current.retrySession() })

    await waitFor(() => expect(result.current.applications).toHaveLength(1))
    expect(result.current.user).toEqual(userFixture())
    expect(result.current.authError).toBeNull()
    expect(localStorage.getItem(AUTH_TOKEN_KEY)).toBe(token)
  })

  it('clears private state on logout and ignores late application responses', async () => {
    localStorage.setItem(AUTH_TOKEN_KEY, tokenFixture())
    mockSession()
    const { result } = renderHook(useAppContext, { wrapper: AppProvider })
    await waitFor(() => expect(result.current.applications).toHaveLength(1))
    act(() => result.current.saveJob(savedJobFixture))
    const pending = Promise.withResolvers<Response>()
    onHttp('GET', '/candidates/me/applications', () => pending.promise)
    const refresh = result.current.refreshApplications()

    act(() => result.current.logout())
    await act(async () => { pending.resolve(jsonResponse([applicationFixture])); await refresh })

    expect(result.current.user).toBeNull()
    expect(result.current.applications).toEqual([])
    expect(result.current.savedJobs).toEqual([])
    expect(localStorage.getItem(AUTH_TOKEN_KEY)).toBeNull()
  })

  it('cancels in-flight login on logout even if HTTP later succeeds', async () => {
    mockSession()
    const pending = Promise.withResolvers<Response>()
    onHttp('POST', '/auth/login', () => pending.promise)
    const { result } = renderHook(useAppContext, { wrapper: AppProvider })
    await waitFor(() => expect(result.current.authReady).toBe(true))
    let loginResult: Promise<unknown> = Promise.resolve()
    act(() => { loginResult = result.current.login(credentials.email, credentials.password) })

    act(() => result.current.logout())
    await act(async () => {
      pending.resolve(jsonResponse({ token: tokenFixture(), user: userFixture() }))
      await expect(loginResult).rejects.toMatchObject({ name: 'AbortError' })
    })

    expect(result.current.user).toBeNull()
    expect(localStorage.getItem(AUTH_TOKEN_KEY)).toBeNull()
  })

  it('logs out when the synthetic JWT expires', async () => {
    mockSession()
    localStorage.setItem(AUTH_TOKEN_KEY, tokenFixture(Math.floor(Date.now() / 1000) + 2))
    const { result } = renderHook(useAppContext, { wrapper: AppProvider })
    await waitFor(() => expect(result.current.applications).toHaveLength(1))
    vi.useFakeTimers()

    act(() => { vi.setSystemTime(Date.now() + 3000); window.dispatchEvent(new Event('focus')) })

    expect(result.current.user).toBeNull()
    expect(result.current.applications).toEqual([])
    expect(localStorage.getItem(AUTH_TOKEN_KEY)).toBeNull()
  })
})
