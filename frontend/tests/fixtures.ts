import type { CandidateApplication, RaviraRole, RaviraUser } from '../src/services/raviraApi'
import type { SavedJob } from '../src/contexts/AppContext'
import { jsonResponse, onHttp } from './http'

export const roles = ['CANDIDATE', 'RECRUITER', 'ADMIN', 'SUPER_ADMIN'] as const
export const credentials = { email: 'person@example.test', password: 'synthetic-test-password' } as const

// These unsigned tokens are fixtures for client expiry checks, never server credentials.
export function tokenFixture(exp = Math.floor(Date.now() / 1000) + 3600) {
  return `${btoa(JSON.stringify({ alg: 'none', typ: 'JWT' }))}.${btoa(JSON.stringify({ sub: 'test-user', exp }))}.test-only`
}

export function userFixture(role: RaviraRole = 'CANDIDATE'): RaviraUser {
  return {
    id: `test-${role}`, email: credentials.email, fullName: 'Test Person', role, isActive: true,
    candidate: role === 'CANDIDATE' ? { id: 'candidate-test' } : null,
    recruiter: role === 'RECRUITER' ? {
      id: 'recruiter-test', company: { id: 'company-test', name: 'Test Company', verificationStatus: 'APPROVED' },
    } : null,
  }
}

export const applicationFixture: CandidateApplication = {
  id: 'application-test', status: 'SCREENING', createdAt: '2026-01-01T00:00:00Z', updatedAt: '2026-01-01T00:00:00Z',
  job: { id: 'job-test', title: 'Engineer', location: 'Jakarta', jobType: 'FULL_TIME', workType: 'REMOTE',
    company: { id: 'company-test', name: 'Test Company', industry: 'Technology' } },
}

export const savedJobFixture: SavedJob = {
  id: 'job-test', title: 'Engineer', company: 'Test Company', location: 'Jakarta',
  type: 'FULL_TIME', salary: 'Test salary', match: 80, matchedSkills: ['TypeScript'],
}

export function mockSession(user = userFixture()) {
  onHttp('GET', '/jobs', () => jsonResponse([]))
  onHttp('GET', '/auth/me', () => jsonResponse(user))
  onHttp('GET', '/candidates/me/applications', () => jsonResponse([applicationFixture]))
}
