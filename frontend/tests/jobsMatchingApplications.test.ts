import { describe, it, expect, beforeEach } from 'vitest'
import {
  listPublishedJobs,
  getJobById,
  searchPublishedJobs,
  getJobRecommendations,
  getJobMatchScore,
  applyToJob,
  listMyApplications,
  getApplicationById,
  getApplicationStatusHistory,
  getSkillGapReport,
  createSkillGapReport,
  getTrainingRecommendations,
  listMyTrainingProgress,
  createTrainingProgress,
  updateTrainingProgress,
  logout,
  type PublicJob,
  type JobRecommendation,
  type JobMatchScore,
  type CandidateApplication,
  type ApplicationDetail,
  type ApplicationStatusHistoryItem,
  type SkillGapReport,
  type TrainingRecommendationsResult,
  type TrainingProgressItem,
} from '../src/services/raviraApi'
import { AUTH_TOKEN_KEY } from '../src/services/api'
import { onHttp, jsonResponse, resetHttp } from './http'
import { tokenFixture } from './fixtures'

describe('Sprint 2B — Jobs, AI Match Score, Skill Gap, Training & Applications', () => {
  const publishedJobFixture: PublicJob = {
    id: '550e8400-e29b-41d4-a716-446655440001',
    title: 'Senior Frontend Engineer',
    description: 'Membangun antarmuka web modern dengan React dan TypeScript.',
    location: 'Bandung, Jawa Barat',
    jobType: 'Full-time',
    workType: 'Hybrid',
    employmentType: 'Permanent',
    salaryMin: 15000000,
    salaryMax: 22000000,
    status: 'PUBLISHED',
    company: {
      id: 'company-uuid-1',
      name: 'PT Teknologi Nusantara',
      industry: 'Teknologi Informasi',
      location: 'Bandung, Jawa Barat',
    },
    skills: [
      { id: 'js-1', skillName: 'React', required: true, weight: 3 },
      { id: 'js-2', skillName: 'TypeScript', required: true, weight: 3 },
      { id: 'js-3', skillName: 'Tailwind CSS', required: false, weight: 1 },
    ],
    createdAt: '2026-02-01T08:00:00.000Z',
    updatedAt: '2026-02-01T08:00:00.000Z',
  }

  const jobRecommendationFixture: JobRecommendation = {
    job: {
      id: publishedJobFixture.id,
      title: publishedJobFixture.title,
      location: publishedJobFixture.location,
      jobType: publishedJobFixture.jobType,
      workType: publishedJobFixture.workType,
    },
    company: publishedJobFixture.company,
    matchScore: 85,
    matchExplanation: [
      'Skill cocok: React, TypeScript.',
      'Lokasi kandidat relevan dengan lokasi lowongan.',
    ],
    breakdown: {
      skillMatch: {
        weight: 50,
        score: 45,
        coverage: 0.85,
        matchedSkills: ['React', 'TypeScript'],
        missingRequiredSkills: [],
      },
      locationMatch: {
        weight: 20,
        score: 20,
        matched: true,
      },
    },
    ruleVersion: 'mvp-rule-v1',
  }

  const jobMatchScoreFixture: JobMatchScore = {
    jobId: publishedJobFixture.id,
    matchScore: 85,
    matchExplanation: ['Skill cocok: React, TypeScript.'],
    breakdown: {
      skillMatch: {
        weight: 50,
        score: 45,
        coverage: 0.85,
        matchedSkills: ['React', 'TypeScript'],
        missingRequiredSkills: [],
      },
    },
    ruleVersion: 'mvp-rule-v1',
  }

  const applicationFixture: CandidateApplication = {
    id: 'app-uuid-1',
    status: 'APPLIED',
    coverLetter: 'Saya antusias melamar posisi Senior Frontend Engineer.',
    createdAt: '2026-02-02T10:00:00.000Z',
    updatedAt: '2026-02-02T10:00:00.000Z',
    job: {
      id: publishedJobFixture.id,
      title: publishedJobFixture.title,
      location: publishedJobFixture.location,
      jobType: publishedJobFixture.jobType,
      workType: publishedJobFixture.workType,
      company: {
        id: publishedJobFixture.company.id,
        name: publishedJobFixture.company.name,
        industry: publishedJobFixture.company.industry,
      },
    },
  }

  const applicationDetailFixture: ApplicationDetail = {
    ...applicationFixture,
    candidate: {
      id: 'candidate-uuid-1',
      location: 'Bandung, Jawa Barat',
      education: 'S1 Teknik Informatika',
      experienceSummary: '3 tahun frontend engineer',
      user: {
        id: 'user-uuid-1',
        email: 'ahmad@example.com',
        fullName: 'Ahmad Dahlan',
        phone: '081234567890',
      },
    },
  }

  const statusHistoryFixture: ApplicationStatusHistoryItem[] = [
    {
      id: 'hist-uuid-1',
      fromStatus: null,
      toStatus: 'APPLIED',
      reason: 'Candidate applied to job.',
      changedBy: {
        id: 'user-uuid-1',
        email: 'ahmad@example.com',
        fullName: 'Ahmad Dahlan',
        role: 'CANDIDATE',
      },
      createdAt: '2026-02-02T10:00:00.000Z',
    },
    {
      id: 'hist-uuid-2',
      fromStatus: 'APPLIED',
      toStatus: 'SCREENING',
      reason: 'Kualifikasi awal sesuai profil tim.',
      changedBy: {
        id: 'recruiter-uuid-1',
        email: 'hr@nusantara.id',
        fullName: 'Budi Recruiter',
        role: 'RECRUITER',
      },
      createdAt: '2026-02-03T14:00:00.000Z',
    },
  ]

  const skillGapFixture: SkillGapReport = {
    id: 'sg-uuid-1',
    candidateId: 'candidate-uuid-1',
    jobId: null,
    targetRole: 'Frontend Engineer',
    ownedSkills: [
      { skillName: 'React', level: 'Mahir', source: 'CANDIDATE', confidenceScore: 90 },
      { skillName: 'TypeScript', level: 'Menengah', source: 'CANDIDATE', confidenceScore: 80 },
    ],
    missingSkills: [
      { skillName: 'Next.js', required: true, weight: 2, marketDemandCount: 5 },
    ],
    matchedSkills: [
      { skillName: 'React', required: true, weight: 3, matchedCandidateSkill: 'React' },
      { skillName: 'TypeScript', required: true, weight: 3, matchedCandidateSkill: 'TypeScript' },
    ],
    prioritySkills: [
      {
        skillName: 'Next.js',
        required: true,
        weight: 2,
        marketDemandCount: 5,
        priorityScore: 8,
        reason: ['Skill ini sering muncul pada lowongan frontend di Jawa.'],
      },
    ],
    summary: 'Ditemukan 2 skill cocok dan 1 skill gap untuk target Frontend Engineer.',
    recommendationReason: 'Skill prioritas dihitung berdasarkan frekuensi lowongan published.',
    createdAt: '2026-02-01T08:00:00.000Z',
    updatedAt: '2026-02-01T08:00:00.000Z',
  }

  const trainingRecommendationsFixture: TrainingRecommendationsResult = {
    jobId: null,
    targetRole: 'Frontend Engineer',
    summary: 'Rekomendasi kursus untuk menutup gap Next.js.',
    recommendations: [
      {
        prioritySkill: 'Next.js',
        recommendedCourses: [
          {
            id: 'course-uuid-1',
            title: 'Next.js 14 Complete Guide',
            provider: 'Dicoding Indonesia',
            skillTargets: ['Next.js', 'React'],
            duration: '4 minggu',
            price: 500000,
            difficulty: 'INTERMEDIATE',
            language: 'id',
            url: 'https://example.com/course/nextjs',
            createdAt: '2026-01-01T00:00:00.000Z',
            updatedAt: '2026-01-01T00:00:00.000Z',
          },
        ],
        reason: 'Course direkomendasikan karena target skill sesuai dengan skill gap prioritas.',
      },
    ],
  }

  const trainingProgressFixture: TrainingProgressItem = {
    id: 'tp-uuid-1',
    candidateId: 'candidate-uuid-1',
    courseId: 'course-uuid-1',
    status: 'IN_PROGRESS',
    progressPct: 25,
    completedAt: null,
    course: trainingRecommendationsFixture.recommendations[0].recommendedCourses[0],
    createdAt: '2026-02-02T08:00:00.000Z',
    updatedAt: '2026-02-02T08:00:00.000Z',
  }

  beforeEach(() => {
    resetHttp()
    localStorage.clear()
    localStorage.setItem(AUTH_TOKEN_KEY, tokenFixture())
  })

  // 1. Daftar Lowongan Berhasil
  it('1. dapat memuat daftar lowongan terpublikasi dengan sukses', async () => {
    onHttp('GET', '/jobs', () => jsonResponse([publishedJobFixture]))

    const result = await listPublishedJobs()
    expect(result).toHaveLength(1)
    expect(result[0].id).toBe(publishedJobFixture.id)
    expect(result[0].title).toBe('Senior Frontend Engineer')
    expect(result[0].status).toBe('PUBLISHED')
  })

  // 2. Daftar Lowongan Kosong
  it('2. menangani daftar lowongan kosong tanpa error', async () => {
    onHttp('GET', '/jobs', () => jsonResponse([]))

    const result = await listPublishedJobs()
    expect(result).toEqual([])
  })

  // 3. API Lowongan Gagal
  it('3. menangani kegagalan API lowongan (error 500)', async () => {
    onHttp('GET', '/jobs', () => jsonResponse({ message: 'Internal Server Error' }, 500))

    await expect(listPublishedJobs()).rejects.toMatchObject({ status: 500 })
  })

  // 4. Detail Lowongan Berdasarkan ID
  it('4. dapat memuat detail lowongan berdasarkan ID valid', async () => {
    onHttp('GET', `/jobs/${publishedJobFixture.id}`, () => jsonResponse(publishedJobFixture))

    const result = await getJobById(publishedJobFixture.id)
    expect(result.id).toBe(publishedJobFixture.id)
    expect(result.company.name).toBe('PT Teknologi Nusantara')
    expect(result.skills).toHaveLength(3)
  })

  // 5. Lowongan Tidak Ditemukan
  it('5. menangani lowongan yang tidak ditemukan (error 404)', async () => {
    const invalidId = '550e8400-e29b-41d4-a716-446655449999'
    onHttp('GET', `/jobs/${invalidId}`, () => jsonResponse({ message: 'Published job not found.' }, 404))

    await expect(getJobById(invalidId)).rejects.toMatchObject({ status: 404 })
  })

  // 6. Pencarian Lowongan Terfilter
  it('6. dapat melakukan pencarian lowongan dengan query params', async () => {
    onHttp('GET', '/jobs/search?keyword=Frontend&location=Bandung', () => jsonResponse([publishedJobFixture]))

    const result = await searchPublishedJobs({ keyword: 'Frontend', location: 'Bandung' })
    expect(result).toHaveLength(1)
    expect(result[0].title).toContain('Frontend')
  })

  // 7. AI Match Score Dinamis
  it('7. menghitung AI Match Score dinamis kandidat terhadap lowongan', async () => {
    onHttp('GET', `/jobs/${publishedJobFixture.id}/match-score`, (req) => {
      expect(req.headers.get('Authorization')).toBe(`Bearer ${tokenFixture()}`)
      return jsonResponse(jobMatchScoreFixture)
    })

    const result = await getJobMatchScore(publishedJobFixture.id)
    expect(result.jobId).toBe(publishedJobFixture.id)
    expect(result.matchScore).toBe(85)
    expect(result.matchExplanation).toContain('Skill cocok: React, TypeScript.')
    expect(result.breakdown?.skillMatch?.matchedSkills).toEqual(['React', 'TypeScript'])
  })

  // 8. Rekomendasi Lowongan Berbasis AI Match Score
  it('8. memuat rekomendasi lowongan kandidat terurut dari backend', async () => {
    onHttp('GET', '/candidates/me/recommendations/jobs', () => jsonResponse([jobRecommendationFixture]))

    const result = await getJobRecommendations()
    expect(result).toHaveLength(1)
    expect(result[0].job.id).toBe(publishedJobFixture.id)
    expect(result[0].matchScore).toBe(85)
    expect(result[0].ruleVersion).toBe('mvp-rule-v1')
  })

  // 9. Skill Gap Analysis
  it('9. memuat laporan skill gap kandidat berbasis kebutuhan industri nyata', async () => {
    onHttp('GET', '/candidates/me/skill-gap?targetRole=Frontend+Engineer', () => jsonResponse(skillGapFixture))

    const result = await getSkillGapReport({ targetRole: 'Frontend Engineer' })
    expect(result.targetRole).toBe('Frontend Engineer')
    expect(result.matchedSkills).toHaveLength(2)
    expect(result.missingSkills).toHaveLength(1)
    expect(result.missingSkills[0].skillName).toBe('Next.js')
  })

  // 10. Update Target Posisi Skill Gap
  it('10. dapat memperbarui target posisi karier skill gap', async () => {
    onHttp('POST', '/candidates/me/skill-gap', () => jsonResponse(skillGapFixture, 201))

    const result = await createSkillGapReport({ targetRole: 'Frontend Engineer' })
    expect(result.id).toBe('sg-uuid-1')
    expect(result.targetRole).toBe('Frontend Engineer')
  })

  // 11. Rekomendasi Pelatihan
  it('11. memuat rekomendasi kursus pelatihan penutup gap', async () => {
    onHttp('GET', '/candidates/me/training-recommendations', () => jsonResponse(trainingRecommendationsFixture))

    const result = await getTrainingRecommendations()
    expect(result.recommendations).toHaveLength(1)
    expect(result.recommendations[0].prioritySkill).toBe('Next.js')
    expect(result.recommendations[0].recommendedCourses[0].provider).toBe('Dicoding Indonesia')
  })

  // 12. Manajemen Progres Pelatihan
  it('12. dapat mendaftar kursus dan mencatat progres belajar kandidat', async () => {
    onHttp('POST', '/candidates/me/training-progress', () => jsonResponse(trainingProgressFixture, 201))
    onHttp('GET', '/candidates/me/training-progress', () => jsonResponse([trainingProgressFixture]))

    const created = await createTrainingProgress({
      courseId: 'course-uuid-1',
      status: 'IN_PROGRESS',
      progressPct: 25,
    })
    expect(created.id).toBe('tp-uuid-1')
    expect(created.progressPct).toBe(25)

    const list = await listMyTrainingProgress()
    expect(list).toHaveLength(1)
    expect(list[0].status).toBe('IN_PROGRESS')
  })

  // 13. Update Progres Pelatihan
  it('13. dapat memperbarui persentase progres pelatihan', async () => {
    const updatedFixture = { ...trainingProgressFixture, progressPct: 75 }
    onHttp('PATCH', '/candidates/me/training-progress/tp-uuid-1', () => jsonResponse(updatedFixture))

    const updated = await updateTrainingProgress('tp-uuid-1', { progressPct: 75 })
    expect(updated.progressPct).toBe(75)
  })

  // 14. Pengiriman Lamaran Berhasil
  it('14. kandidat dapat melamar pekerjaan dan tersimpan di database', async () => {
    onHttp('POST', `/jobs/${publishedJobFixture.id}/apply`, () => jsonResponse(applicationFixture, 201))

    const applied = await applyToJob(publishedJobFixture.id, 'Saya antusias melamar posisi Senior Frontend Engineer.')
    expect(applied.id).toBe('app-uuid-1')
    expect(applied.status).toBe('APPLIED')
    expect(applied.job.id).toBe(publishedJobFixture.id)
  })

  // 15. Penolakan Lamaran Duplikat (409 Conflict)
  it('15. menolak pengiriman lamaran duplikat dengan error 409 Conflict', async () => {
    onHttp('POST', `/jobs/${publishedJobFixture.id}/apply`, () => jsonResponse({ message: 'Candidate has already applied to this job.' }, 409))

    await expect(applyToJob(publishedJobFixture.id)).rejects.toMatchObject({ status: 409 })
  })

  // 16. Daftar Riwayat Lamaran Saya
  it('16. dapat memuat daftar lamaran yang pernah diajukan kandidat', async () => {
    onHttp('GET', '/candidates/me/applications', () => jsonResponse([applicationFixture]))

    const applications = await listMyApplications()
    expect(applications).toHaveLength(1)
    expect(applications[0].job.title).toBe('Senior Frontend Engineer')
  })

  // 17. Detail Lamaran Berdasarkan ID
  it('17. dapat memuat detail lengkap lamaran kandidat', async () => {
    onHttp('GET', '/applications/app-uuid-1', () => jsonResponse(applicationDetailFixture))

    const detail = await getApplicationById('app-uuid-1')
    expect(detail.id).toBe('app-uuid-1')
    expect(detail.candidate.user.fullName).toBe('Ahmad Dahlan')
    expect(detail.job.company.name).toBe('PT Teknologi Nusantara')
  })

  // 18. Riwayat Transisi Status Lamaran (Audit Trail)
  it('18. memuat timeline perubahan status seleksi lamaran', async () => {
    onHttp('GET', '/applications/app-uuid-1/status-history', () => jsonResponse(statusHistoryFixture))

    const history = await getApplicationStatusHistory('app-uuid-1')
    expect(history).toHaveLength(2)
    expect(history[0].toStatus).toBe('APPLIED')
    expect(history[1].toStatus).toBe('SCREENING')
    expect(history[1].reason).toBe('Kualifikasi awal sesuai profil tim.')
  })

  // 19. Akses Data Lamaran Pengguna Lain Ditolak (403 Forbidden)
  it('19. menolak akses detail lamaran milik kandidat lain (error 403/404)', async () => {
    onHttp('GET', '/applications/other-candidate-app-id', () => jsonResponse({ message: 'Application not found.' }, 404))

    await expect(getApplicationById('other-candidate-app-id')).rejects.toMatchObject({ status: 404 })
  })

  // 20. Token Kedaluwarsa / 401 Mengosongkan Sesi
  it('20. token kedaluwarsa atau 401 memicu pembersihan token', async () => {
    onHttp('GET', '/candidates/me/applications', () => jsonResponse({ message: 'Token has expired.' }, 401))

    await expect(listMyApplications()).rejects.toMatchObject({ status: 401 })
    expect(localStorage.getItem(AUTH_TOKEN_KEY)).toBeNull()
  })

  // 21. Isolasi Akun Saat Logout
  it('21. fungsi logout membersihkan token dan mengisolasi akun', () => {
    expect(localStorage.getItem(AUTH_TOKEN_KEY)).toBe(tokenFixture())
    logout()
    expect(localStorage.getItem(AUTH_TOKEN_KEY)).toBeNull()
  })
})
