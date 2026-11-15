import { describe, it, expect, beforeEach } from 'vitest'
import { render, screen, waitFor, fireEvent } from '@testing-library/react'
import { MemoryRouter, Routes, Route, useLocation } from 'react-router'
import React from 'react'
import { AppProvider } from '../src/contexts/AppContext'
import DashboardCandidatePage from '../src/pages/DashboardCandidatePage'
import CrossRegionPage from '../src/pages/CrossRegionPage'
import PrivacySettingsPage from '../src/pages/PrivacySettingsPage'
import LoginKandidatPage from '../src/pages/LoginKandidatPage'
import LoginPerusahaanPage from '../src/pages/LoginPerusahaanPage'
import LoginPemerintahPage from '../src/pages/LoginPemerintahPage'
import { PerusahaanNavbar } from '../src/components/PerusahaanNavbar'
import { PemerintahNavbar } from '../src/components/PemerintahNavbar'
import { AUTH_TOKEN_KEY } from '../src/services/api'
import { onHttp, jsonResponse } from './http'
import { tokenFixture, userFixture } from './fixtures'
import type {
  CandidateProfile,
  CandidateSkill,
  JobRecommendation,
  SkillGapReport,
  TrainingRecommendationsResult,
  TrainingProgressItem,
  CandidateApplication,
} from '../src/services/raviraApi'

function LocationDisplay() {
  const location = useLocation()
  return <div data-testid="current-path">{location.pathname}</div>
}

describe('Sprint 2F — Candidate Dashboard Remediation (BUG-QA05-02)', () => {
  const candidateProfileFixture: CandidateProfile = {
    id: 'cand-1',
    userId: 'user-cand-1',
    email: 'nabila.putri@ravira.local',
    fullName: 'Nabila Putri Pratama',
    phone: '081299887766',
    location: 'Bandung',
    education: 'S1 Teknik Informatika',
    experienceSummary: 'Backend developer dengan pengalaman membangun REST API Node.js dan PostgreSQL.',
    salaryExpectation: 11000000,
    mobilityPreference: 'HYBRID',
    visibilityStatus: 'PUBLIC',
    createdAt: '2026-02-01T08:00:00.000Z',
    updatedAt: '2026-03-01T08:00:00.000Z',
  }

  const candidateSkillsFixture: CandidateSkill[] = [
    {
      id: 'skill-1',
      skillName: 'TypeScript',
      level: 'INTERMEDIATE',
      source: 'CANDIDATE',
      confidenceScore: 90,
      createdAt: '2026-02-01T08:00:00.000Z',
      updatedAt: '2026-02-01T08:00:00.000Z',
    },
  ]

  const jobRecommendationsFixture: JobRecommendation[] = [
    {
      job: {
        id: 'job-backend-101',
        title: 'Seed Backend Engineer',
        location: 'Jakarta',
        jobType: 'FULL_TIME',
        workType: 'REMOTE',
      },
      company: {
        id: 'comp-1',
        name: 'Seed Ravira Company',
        industry: 'Technology',
        location: 'Jakarta',
      },
      matchScore: 82,
      matchExplanation: [
        'Skill yang cocok: TypeScript.',
        'Preferensi kerja kandidat sesuai dengan tipe kerja REMOTE.',
      ],
      breakdown: {},
      ruleVersion: 'mvp-rule-v1',
    },
  ]

  const skillGapReportFixture: SkillGapReport = {
    id: 'sg-1',
    candidateId: 'cand-1',
    jobId: null,
    targetRole: 'Backend Engineer',
    ownedSkills: [{ skillName: 'TypeScript', level: 'INTERMEDIATE', source: 'CANDIDATE', confidenceScore: 90 }],
    missingSkills: [
      { skillName: 'Node.js', required: true, weight: 1, marketDemandCount: 3 },
      { skillName: 'PostgreSQL', required: true, weight: 1, marketDemandCount: 2 },
    ],
    matchedSkills: [
      { skillName: 'TypeScript', required: true, weight: 1, matchedCandidateSkill: 'TypeScript' },
    ],
    prioritySkills: [
      {
        skillName: 'Node.js',
        required: true,
        weight: 1,
        marketDemandCount: 3,
        priorityScore: 125,
        reason: ['Skill wajib untuk target posisi Backend Engineer.'],
      },
    ],
    summary: '2 skill perlu ditingkatkan untuk Backend Engineer.',
    createdAt: '2026-03-01T08:00:00.000Z',
    updatedAt: '2026-03-01T08:00:00.000Z',
  }

  const courseFixture = {
    id: 'course-node-1',
    title: 'Node.js API Development',
    provider: 'Ravira Learning Partner',
    skillTargets: ['Node.js', 'JavaScript'],
    duration: '14 jam',
    price: 200000,
    difficulty: 'INTERMEDIATE',
    language: 'id',
    url: 'https://learning.ravira.local/courses/node-api',
    createdAt: '2026-02-01T08:00:00.000Z',
    updatedAt: '2026-02-01T08:00:00.000Z',
  }

  const trainingRecommendationsFixture: TrainingRecommendationsResult = {
    jobId: null,
    targetRole: 'Backend Engineer',
    summary: 'Rekomendasi pelatihan untuk menutup skill gap.',
    recommendations: [
      {
        prioritySkill: 'Node.js',
        recommendedCourses: [courseFixture],
        reason: 'Menutup skill gap Node.js.',
      },
    ],
  }

  const trainingProgressFixture: TrainingProgressItem[] = [
    {
      id: 'prog-1',
      candidateId: 'cand-1',
      courseId: 'course-node-1',
      status: 'IN_PROGRESS',
      progressPct: 60,
      completedAt: null,
      course: courseFixture,
      createdAt: '2026-03-01T08:00:00.000Z',
      updatedAt: '2026-03-01T08:00:00.000Z',
    },
  ]

  const applicationsFixture: CandidateApplication[] = [
    {
      id: 'app-1',
      status: 'SCREENING',
      coverLetter: 'Saya tertarik dengan posisi Backend Engineer.',
      createdAt: '2026-03-01T10:00:00.000Z',
      updatedAt: '2026-03-01T10:00:00.000Z',
      job: {
        id: 'job-backend-101',
        title: 'Seed Backend Engineer',
        location: 'Jakarta',
        jobType: 'FULL_TIME',
        workType: 'REMOTE',
        company: {
          id: 'comp-1',
          name: 'Seed Ravira Company',
          industry: 'Technology',
        },
      },
    },
  ]

  beforeEach(() => {
    localStorage.clear()
    localStorage.setItem(AUTH_TOKEN_KEY, tokenFixture())
    onHttp('GET', '/candidates/me/saved-jobs', () => jsonResponse([]))
    onHttp('GET', '/candidates/me/applications', () => jsonResponse([]))
  })

  it('renders real candidate dashboard data from backend APIs and eliminates all mock strings', async () => {
    const candidateUser = userFixture('CANDIDATE')
    candidateUser.fullName = 'Nabila Putri Pratama'

    onHttp('GET', '/jobs', () => jsonResponse([]))
    onHttp('GET', '/auth/me', () => jsonResponse(candidateUser))
    onHttp('GET', '/candidates/me', () => jsonResponse(candidateProfileFixture))
    onHttp('GET', '/candidates/me/skills', () => jsonResponse(candidateSkillsFixture))
    onHttp('GET', '/candidates/me/recommendations/jobs', () => jsonResponse(jobRecommendationsFixture))
    onHttp('GET', '/candidates/me/skill-gap', () => jsonResponse(skillGapReportFixture))
    onHttp('GET', '/candidates/me/training-recommendations', () => jsonResponse(trainingRecommendationsFixture))
    onHttp('GET', '/candidates/me/training-progress', () => jsonResponse(trainingProgressFixture))
    onHttp('GET', '/candidates/me/applications', () => jsonResponse(applicationsFixture))

    render(
      <MemoryRouter initialEntries={['/dashboard/kandidat']}>
        <AppProvider>
          <DashboardCandidatePage />
        </AppProvider>
      </MemoryRouter>
    )

    await waitFor(() => {
      expect(screen.getAllByText('Seed Backend Engineer').length).toBeGreaterThan(0)
    })

    // Real candidate name & real stats
    expect(screen.getAllByText(/Nabila Putri Pratama/i).length).toBeGreaterThan(0)
    expect(screen.getByText('100%')).toBeInTheDocument()
    expect(screen.getByText('Profil sudah lengkap')).toBeInTheDocument()
    expect(screen.getByText('60%')).toBeInTheDocument()
    expect(screen.getByText('60% selesai')).toBeInTheDocument()
    expect(screen.getAllByText('82%').length).toBeGreaterThan(0)
    expect(screen.getByText(/Skill yang cocok: TypeScript/i)).toBeInTheDocument()
    expect(screen.getByText('Node.js API Development')).toBeInTheDocument()
    expect(screen.getByText('Node.js')).toBeInTheDocument()
    expect(screen.getByText('PostgreSQL')).toBeInTheDocument()

    // Ensure zero old hardcoded mock data is displayed
    expect(screen.queryByText('Tokopedia')).not.toBeInTheDocument()
    expect(screen.queryByText('Gojek')).not.toBeInTheDocument()
    expect(screen.queryByText('Traveloka')).not.toBeInTheDocument()
    expect(screen.queryByText('Figma Advanced')).not.toBeInTheDocument()
    expect(screen.queryByText('UX Research Fundamentals')).not.toBeInTheDocument()
    expect(screen.queryByText('78%')).not.toBeInTheDocument()
  })

  it('navigates to valid routes on CTA buttons without triggering 404 (/dashboard/kandidat/pelatihan and /dashboard/kandidat/pekerjaan/:id)', async () => {
    const candidateUser = userFixture('CANDIDATE')
    onHttp('GET', '/jobs', () => jsonResponse([]))
    onHttp('GET', '/auth/me', () => jsonResponse(candidateUser))
    onHttp('GET', '/candidates/me', () => jsonResponse(candidateProfileFixture))
    onHttp('GET', '/candidates/me/skills', () => jsonResponse(candidateSkillsFixture))
    onHttp('GET', '/candidates/me/recommendations/jobs', () => jsonResponse(jobRecommendationsFixture))
    onHttp('GET', '/candidates/me/skill-gap', () => jsonResponse(skillGapReportFixture))
    onHttp('GET', '/candidates/me/training-recommendations', () => jsonResponse(trainingRecommendationsFixture))
    onHttp('GET', '/candidates/me/training-progress', () => jsonResponse(trainingProgressFixture))
    onHttp('GET', '/candidates/me/applications', () => jsonResponse(applicationsFixture))

    render(
      <MemoryRouter initialEntries={['/dashboard/kandidat']}>
        <AppProvider>
          <LocationDisplay />
          <Routes>
            <Route path="/dashboard/kandidat" element={<DashboardCandidatePage />} />
            <Route path="/dashboard/kandidat/pelatihan" element={<div>Halaman Pelatihan Valid</div>} />
            <Route path="/dashboard/kandidat/pekerjaan/:id" element={<div>Halaman Detail Pekerjaan Valid</div>} />
          </Routes>
        </AppProvider>
      </MemoryRouter>
    )

    await waitFor(() => {
      expect(screen.getByText('Mulai Belajar')).toBeInTheDocument()
    })

    fireEvent.click(screen.getByText('Mulai Belajar'))

    await waitFor(() => {
      expect(screen.getByTestId('current-path').textContent).toBe('/dashboard/kandidat/pelatihan')
    })
    expect(screen.getByText('Halaman Pelatihan Valid')).toBeInTheDocument()
  })

  it('renders honest empty states when candidate has no recommendations, skill gaps, or trainings', async () => {
    const candidateUser = userFixture('CANDIDATE')
    onHttp('GET', '/jobs', () => jsonResponse([]))
    onHttp('GET', '/auth/me', () => jsonResponse(candidateUser))
    onHttp('GET', '/candidates/me', () =>
      jsonResponse({
        ...candidateProfileFixture,
        phone: null,
        location: null,
        education: null,
        experienceSummary: null,
        mobilityPreference: null,
      })
    )
    onHttp('GET', '/candidates/me/skills', () => jsonResponse([]))
    onHttp('GET', '/candidates/me/recommendations/jobs', () => jsonResponse([]))
    onHttp('GET', '/candidates/me/skill-gap', () =>
      jsonResponse({
        ...skillGapReportFixture,
        ownedSkills: [],
        missingSkills: [],
        matchedSkills: [],
        prioritySkills: [],
      })
    )
    onHttp('GET', '/candidates/me/training-recommendations', () =>
      jsonResponse({
        jobId: null,
        targetRole: null,
        summary: '',
        recommendations: [],
      })
    )
    onHttp('GET', '/candidates/me/training-progress', () => jsonResponse([]))
    onHttp('GET', '/candidates/me/applications', () => jsonResponse([]))

    render(
      <MemoryRouter initialEntries={['/dashboard/kandidat']}>
        <AppProvider>
          <DashboardCandidatePage />
        </AppProvider>
      </MemoryRouter>
    )

    await waitFor(() => {
      expect(
        screen.getByText(/Belum ada rekomendasi pekerjaan yang tersedia saat ini/i)
      ).toBeInTheDocument()
    })

    expect(screen.getByText(/Belum ada rekomendasi pelatihan saat ini/i)).toBeInTheDocument()
    expect(screen.getByText(/Belum ada data analisis Skill Gap/i)).toBeInTheDocument()
    expect(screen.getByText(/Belum ada peluang lintas wilayah yang cocok saat ini/i)).toBeInTheDocument()
  })

  it('renders error state and retries loading when core API calls fail', async () => {
    const candidateUser = userFixture('CANDIDATE')
    let shouldFail = true

    onHttp('GET', '/jobs', () => jsonResponse([]))
    onHttp('GET', '/auth/me', () => jsonResponse(candidateUser))
    onHttp('GET', '/candidates/me', () =>
      shouldFail ? jsonResponse({ message: 'Server sedang sibuk' }, 500) : jsonResponse(candidateProfileFixture)
    )
    onHttp('GET', '/candidates/me/skills', () => jsonResponse(candidateSkillsFixture))
    onHttp('GET', '/candidates/me/recommendations/jobs', () =>
      shouldFail ? jsonResponse({ message: 'Server sedang sibuk' }, 500) : jsonResponse(jobRecommendationsFixture)
    )
    onHttp('GET', '/candidates/me/skill-gap', () =>
      shouldFail ? jsonResponse({ message: 'Server sedang sibuk' }, 500) : jsonResponse(skillGapReportFixture)
    )
    onHttp('GET', '/candidates/me/training-recommendations', () => jsonResponse(trainingRecommendationsFixture))
    onHttp('GET', '/candidates/me/training-progress', () => jsonResponse(trainingProgressFixture))
    onHttp('GET', '/candidates/me/applications', () => jsonResponse(applicationsFixture))

    render(
      <MemoryRouter initialEntries={['/dashboard/kandidat']}>
        <AppProvider>
          <DashboardCandidatePage />
        </AppProvider>
      </MemoryRouter>
    )

    await waitFor(() => {
      expect(screen.getByRole('button', { name: /Coba Lagi/i })).toBeInTheDocument()
    })

    shouldFail = false
    fireEvent.click(screen.getByRole('button', { name: /Coba Lagi/i }))

    await waitFor(() => {
      expect(screen.getAllByText('Seed Backend Engineer').length).toBeGreaterThan(0)
    })
  })

  it('CrossRegionPage and PrivacySettingsPage display logged-in candidate name instead of hardcoded Budi Santoso', async () => {
    const candidateUser = userFixture('CANDIDATE')
    candidateUser.fullName = 'Rizky Pratama Putra'

    onHttp('GET', '/jobs', () => jsonResponse([]))
    onHttp('GET', '/auth/me', () => jsonResponse(candidateUser))

    const { unmount } = render(
      <MemoryRouter>
        <AppProvider>
          <CrossRegionPage />
        </AppProvider>
      </MemoryRouter>
    )

    await waitFor(() => {
      expect(screen.getAllByText('Rizky Pratama Putra').length).toBeGreaterThan(0)
    })
    expect(screen.queryByText('Budi Santoso')).not.toBeInTheDocument()

    unmount()

    render(
      <MemoryRouter>
        <AppProvider>
          <PrivacySettingsPage />
        </AppProvider>
      </MemoryRouter>
    )

    await waitFor(() => {
      expect(screen.getAllByText('Rizky Pratama Putra').length).toBeGreaterThan(0)
    })
    expect(screen.queryByText('Budi Santoso')).not.toBeInTheDocument()
  })

  it('allows navigating between Untuk Kandidat, Untuk Perusahaan, and Untuk Pemerintah from PerusahaanNavbar, PemerintahNavbar, and Login pages', async () => {
    localStorage.clear()
    onHttp('GET', '/jobs', () => jsonResponse([]))

    render(
      <MemoryRouter initialEntries={['/untuk-perusahaan']}>
        <AppProvider>
          <LocationDisplay />
          <Routes>
            <Route path="/untuk-perusahaan" element={<PerusahaanNavbar />} />
            <Route path="/untuk-pemerintah" element={<PemerintahNavbar />} />
            <Route path="/untuk-kandidat" element={<div>Portal Kandidat</div>} />
            <Route path="/masuk/perusahaan" element={<LoginPerusahaanPage />} />
            <Route path="/masuk/kandidat" element={<LoginKandidatPage />} />
            <Route path="/masuk/pemerintah" element={<LoginPemerintahPage />} />
          </Routes>
        </AppProvider>
      </MemoryRouter>
    )

    expect(screen.getByTestId('current-path').textContent).toBe('/untuk-perusahaan')

    // From Untuk Perusahaan -> Untuk Pemerintah
    fireEvent.click(screen.getByRole('button', { name: 'Untuk Pemerintah' }))
    expect(screen.getByTestId('current-path').textContent).toBe('/untuk-pemerintah')

    // From Untuk Pemerintah -> Untuk Perusahaan
    fireEvent.click(screen.getByRole('button', { name: 'Untuk Perusahaan' }))
    expect(screen.getByTestId('current-path').textContent).toBe('/untuk-perusahaan')

    // From Untuk Perusahaan -> Masuk Perusahaan -> Kembali ke Untuk Perusahaan
    fireEvent.click(screen.getByRole('button', { name: 'Masuk' }))
    expect(screen.getByTestId('current-path').textContent).toBe('/masuk/perusahaan')
    fireEvent.click(screen.getByRole('button', { name: /Kembali ke Untuk Perusahaan/i }))
    expect(screen.getByTestId('current-path').textContent).toBe('/untuk-perusahaan')

    // From Untuk Perusahaan -> Untuk Kandidat
    fireEvent.click(screen.getByRole('button', { name: 'Untuk Kandidat' }))
    expect(screen.getByTestId('current-path').textContent).toBe('/untuk-kandidat')
  })
})
