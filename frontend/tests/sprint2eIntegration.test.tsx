import { describe, it, expect, beforeEach } from 'vitest'
import { render, screen, waitFor, fireEvent } from '@testing-library/react'
import { MemoryRouter } from 'react-router'
import React from 'react'
import { AppProvider } from '../src/contexts/AppContext'
import CompanyProfilePage from '../src/pages/CompanyProfilePage'
import CompanySettingsPage from '../src/pages/CompanySettingsPage'
import ATSIntegrationPage from '../src/pages/ATSIntegrationPage'
import {
  listCandidateSavedJobs,
  saveJobForCandidate,
  removeSavedJobForCandidate,
  getRecruiterCompanyProfile,
  updateRecruiterCompanyProfile,
  type SavedJobItem,
  type RecruiterCompanyProfile,
} from '../src/services/raviraApi'
import { AUTH_TOKEN_KEY } from '../src/services/api'
import { onHttp, jsonResponse } from './http'
import { tokenFixture, userFixture } from './fixtures'

describe('Sprint 2E — Saved Jobs, Company Profile & Mock Cleanup', () => {
  const savedJobItemFixture: SavedJobItem = {
    id: 'saved-uuid-1',
    jobId: 'job-uuid-101',
    savedAt: '2026-03-01T10:00:00.000Z',
    job: {
      id: 'job-uuid-101',
      title: 'Full Stack Engineer',
      description: 'Membangun platform ekosistem karir masa depan.',
      location: 'Bandung, Jawa Barat',
      jobType: 'Full-time',
      workType: 'Hybrid',
      employmentType: 'Permanent',
      salaryMin: 12000000,
      salaryMax: 18000000,
      status: 'PUBLISHED',
      createdAt: '2026-02-15T08:00:00.000Z',
      company: {
        id: 'comp-uuid-1',
        name: 'PT Inovasi Digital Nusantara',
        location: 'Bandung',
        industry: 'Teknologi Informasi',
        verificationStatus: 'APPROVED',
      },
      skills: [
        { id: 'sk-1', skillName: 'React', required: true, weight: 3 },
        { id: 'sk-2', skillName: 'Node.js', required: true, weight: 3 },
      ],
    },
  }

  const companyProfileFixture: RecruiterCompanyProfile = {
    id: 'comp-uuid-99',
    name: 'PT Sinergi Data Nusantara',
    industry: 'Teknologi Informasi',
    size: '51-200 karyawan',
    location: 'Jakarta Selatan, DKI Jakarta',
    website: 'https://sinergidata.co.id',
    description: 'Perusahaan analitik data dan AI terdepan di Indonesia.',
    verificationStatus: 'APPROVED',
    verifiedAt: '2026-02-10T12:00:00.000Z',
    createdAt: '2026-01-10T08:00:00.000Z',
    updatedAt: '2026-02-10T12:00:00.000Z',
  }

  beforeEach(() => {
    localStorage.clear()
    localStorage.setItem(AUTH_TOKEN_KEY, tokenFixture())
  })

  describe('1. Candidate Saved Jobs API Client', () => {
    it('listCandidateSavedJobs retrieves saved jobs from backend', async () => {
      onHttp('GET', '/candidates/me/saved-jobs', () => jsonResponse([savedJobItemFixture]))

      const result = await listCandidateSavedJobs()
      expect(result).toHaveLength(1)
      expect(result[0].jobId).toBe('job-uuid-101')
      expect(result[0].job.title).toBe('Full Stack Engineer')
      expect(result[0].job.company?.name).toBe('PT Inovasi Digital Nusantara')
    })

    it('saveJobForCandidate sends POST with jobId', async () => {
      let capturedBody: unknown = null
      onHttp('POST', '/candidates/me/saved-jobs', async (req) => {
        capturedBody = await req.json()
        return jsonResponse({
          id: 'saved-uuid-2',
          jobId: 'job-uuid-101',
          savedAt: new Date().toISOString(),
          job: { id: 'job-uuid-101', title: 'Full Stack Engineer' },
        }, 201)
      })

      const result = await saveJobForCandidate('job-uuid-101')
      expect(capturedBody).toEqual({ jobId: 'job-uuid-101' })
      expect(result.jobId).toBe('job-uuid-101')
    })

    it('removeSavedJobForCandidate sends DELETE by jobId', async () => {
      onHttp('DELETE', '/candidates/me/saved-jobs/job-uuid-101', () =>
        jsonResponse({ jobId: 'job-uuid-101', removed: true })
      )

      const result = await removeSavedJobForCandidate('job-uuid-101')
      expect(result.jobId).toBe('job-uuid-101')
      expect(result.removed).toBe(true)
    })
  })

  describe('2. Recruiter Company Profile API Client', () => {
    it('getRecruiterCompanyProfile retrieves company profile', async () => {
      onHttp('GET', '/recruiter/company', () => jsonResponse(companyProfileFixture))

      const result = await getRecruiterCompanyProfile()
      expect(result.id).toBe('comp-uuid-99')
      expect(result.name).toBe('PT Sinergi Data Nusantara')
      expect(result.verificationStatus).toBe('APPROVED')
    })

    it('updateRecruiterCompanyProfile sends PATCH with company data', async () => {
      let capturedBody: unknown = null
      onHttp('PATCH', '/recruiter/company', async (req) => {
        capturedBody = await req.json()
        return jsonResponse({
          ...companyProfileFixture,
          name: 'PT Sinergi Data Nusantara Baru',
          location: 'Surabaya, Jawa Timur',
        })
      })

      const updated = await updateRecruiterCompanyProfile({
        name: 'PT Sinergi Data Nusantara Baru',
        location: 'Surabaya, Jawa Timur',
      })

      expect(capturedBody).toEqual({
        name: 'PT Sinergi Data Nusantara Baru',
        location: 'Surabaya, Jawa Timur',
      })
      expect(updated.name).toBe('PT Sinergi Data Nusantara Baru')
      expect(updated.location).toBe('Surabaya, Jawa Timur')
    })
  })

  describe('3. CompanyProfilePage UI Integration', () => {
    it('loads and displays company profile with APPROVED status badge', async () => {
      const recruiterUser = userFixture('RECRUITER')
      recruiterUser.fullName = 'Budi Wicaksono'

      onHttp('GET', '/jobs', () => jsonResponse([]))
      onHttp('GET', '/auth/me', () => jsonResponse(recruiterUser))
      onHttp('GET', '/recruiter/company', () => jsonResponse(companyProfileFixture))

      render(
        <MemoryRouter>
          <AppProvider>
            <CompanyProfilePage />
          </AppProvider>
        </MemoryRouter>
      )

      await waitFor(() => {
        expect(screen.getByDisplayValue('PT Sinergi Data Nusantara')).toBeInTheDocument()
      })

      expect(screen.getByDisplayValue('Teknologi Informasi')).toBeInTheDocument()
      expect(screen.getByDisplayValue('https://sinergidata.co.id')).toBeInTheDocument()
      expect(screen.getByText('Terverifikasi')).toBeInTheDocument()
      expect(screen.getByText(/Perusahaan Anda telah diverifikasi oleh tim Ravira/i)).toBeInTheDocument()
      expect(screen.getAllByText('Budi Wicaksono').length).toBeGreaterThan(0)
    })

    it('displays PENDING verification status badge when company is pending', async () => {
      const pendingCompany: RecruiterCompanyProfile = {
        ...companyProfileFixture,
        verificationStatus: 'PENDING',
        verifiedAt: null,
      }

      const recruiterUser = userFixture('RECRUITER')
      onHttp('GET', '/jobs', () => jsonResponse([]))
      onHttp('GET', '/auth/me', () => jsonResponse(recruiterUser))
      onHttp('GET', '/recruiter/company', () => jsonResponse(pendingCompany))

      render(
        <MemoryRouter>
          <AppProvider>
            <CompanyProfilePage />
          </AppProvider>
        </MemoryRouter>
      )

      await waitFor(() => {
        expect(screen.getByText('Menunggu Verifikasi')).toBeInTheDocument()
      })
      expect(screen.getByText(/Pendaftaran sedang ditinjau oleh tim Admin Ravira/i)).toBeInTheDocument()
    })

    it('submits updated company profile and updates UI', async () => {
      const recruiterUser = userFixture('RECRUITER')
      onHttp('GET', '/jobs', () => jsonResponse([]))
      onHttp('GET', '/auth/me', () => jsonResponse(recruiterUser))
      onHttp('GET', '/recruiter/company', () => jsonResponse(companyProfileFixture))

      let updateCalled = false
      onHttp('PATCH', '/recruiter/company', async () => {
        updateCalled = true
        return jsonResponse({
          ...companyProfileFixture,
          name: 'PT Sinergi Berjaya',
        })
      })

      render(
        <MemoryRouter>
          <AppProvider>
            <CompanyProfilePage />
          </AppProvider>
        </MemoryRouter>
      )

      await waitFor(() => {
        expect(screen.getByDisplayValue('PT Sinergi Data Nusantara')).toBeInTheDocument()
      })

      const nameInput = screen.getByDisplayValue('PT Sinergi Data Nusantara')
      fireEvent.change(nameInput, { target: { value: 'PT Sinergi Berjaya' } })

      const submitButton = screen.getByRole('button', { name: /Simpan Perubahan/i })
      fireEvent.click(submitButton)

      await waitFor(() => {
        expect(updateCalled).toBe(true)
      })
    })

    it('omits empty website when initially null and sends null when clearing previously saved website', async () => {
      const recruiterUser = userFixture('RECRUITER')
      const initialWithoutWebsite: RecruiterCompanyProfile = {
        ...companyProfileFixture,
        website: null,
      }

      onHttp('GET', '/jobs', () => jsonResponse([]))
      onHttp('GET', '/auth/me', () => jsonResponse(recruiterUser))
      onHttp('GET', '/recruiter/company', () => jsonResponse(initialWithoutWebsite))

      const capturedPayloads: Array<Record<string, unknown>> = []
      onHttp('PATCH', '/recruiter/company', async (req) => {
        const body = (await req.json()) as Record<string, unknown>
        capturedPayloads.push(body)
        return jsonResponse({
          ...initialWithoutWebsite,
          description: (body.description as string) ?? initialWithoutWebsite.description,
          website: body.website === undefined ? initialWithoutWebsite.website : (body.website as string | null),
        })
      })

      render(
        <MemoryRouter>
          <AppProvider>
            <CompanyProfilePage />
          </AppProvider>
        </MemoryRouter>
      )

      await waitFor(() => {
        expect(screen.getByDisplayValue('PT Sinergi Data Nusantara')).toBeInTheDocument()
      })

      // 1. Submit while website is still empty (initially null) -> website should NOT be sent in payload
      const submitButton = screen.getByRole('button', { name: /Simpan Perubahan/i })
      fireEvent.click(submitButton)

      await waitFor(() => {
        expect(capturedPayloads).toHaveLength(1)
      })
      expect('website' in capturedPayloads[0]).toBe(false)

      // 2. Fill valid website -> website should be sent
      const websiteInput = screen.getByPlaceholderText(/https:\/\/example\.com/i)
      fireEvent.change(websiteInput, { target: { value: 'https://ravira.co.id' } })
      fireEvent.click(submitButton)

      await waitFor(() => {
        expect(capturedPayloads).toHaveLength(2)
      })
      expect(capturedPayloads[1].website).toBe('https://ravira.co.id')

      // 3. Clear previously saved website -> website: null should be sent to clear it in DB
      fireEvent.change(websiteInput, { target: { value: '' } })
      fireEvent.click(submitButton)

      await waitFor(() => {
        expect(capturedPayloads).toHaveLength(3)
      })
      expect(capturedPayloads[2].website).toBeNull()
    })
  })

  describe('4. Mock Cleanup & Dynamic Recruiter User Context', () => {
    it('CompanySettingsPage uses dynamic user name and role instead of hardcoded Siti Rahayu', async () => {
      const recruiterUser = userFixture('RECRUITER')
      recruiterUser.fullName = 'Dewi Anggraini'
      if (recruiterUser.recruiter) {
        recruiterUser.recruiter.company.name = 'PT Kreasi Solusi Global'
      }

      onHttp('GET', '/jobs', () => jsonResponse([]))
      onHttp('GET', '/auth/me', () => jsonResponse(recruiterUser))

      render(
        <MemoryRouter>
          <AppProvider>
            <CompanySettingsPage />
          </AppProvider>
        </MemoryRouter>
      )

      await waitFor(() => {
        expect(screen.getAllByText('Dewi Anggraini').length).toBeGreaterThan(0)
      })
      expect(screen.queryByText('Siti Rahayu')).not.toBeInTheDocument()
    })

    it('ATSIntegrationPage uses dynamic company name in webhook URL', async () => {
      const recruiterUser = userFixture('RECRUITER')
      recruiterUser.fullName = 'Bambang Pamungkas'
      if (recruiterUser.recruiter) {
        recruiterUser.recruiter.company.name = 'PT Nusantara Maju'
      }

      onHttp('GET', '/jobs', () => jsonResponse([]))
      onHttp('GET', '/auth/me', () => jsonResponse(recruiterUser))

      render(
        <MemoryRouter>
          <AppProvider>
            <ATSIntegrationPage />
          </AppProvider>
        </MemoryRouter>
      )

      await waitFor(() => {
        expect(screen.getAllByText('Bambang Pamungkas').length).toBeGreaterThan(0)
      })
      expect(screen.queryByText('Siti Rahayu')).not.toBeInTheDocument()
      expect(screen.getByText(/pt-nusantara-maju/)).toBeInTheDocument()
      expect(screen.queryByText(/tokopedia\/abc123xyz/)).not.toBeInTheDocument()
    })
  })
})
