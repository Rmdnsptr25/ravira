import { describe, it, expect, beforeEach } from 'vitest'
import {
  listRecruiterJobs,
  getRecruiterJob,
  createRecruiterJob,
  updateRecruiterJob,
  deleteRecruiterJob,
  listApplicationsForRecruiterJob,
  getRecruiterJobCandidateScores,
  getApplicationCandidateScore,
  updateApplicationStage,
  getApplicationById,
  getApplicationStatusHistory,
  logout,
  type RecruiterJob,
  type RecruiterJobApplication,
  type RecruiterCandidateScore,
  type ApplicationCandidateScore,
  type ApplicationDetail,
  type ApplicationStatusHistoryItem,
} from '../src/services/raviraApi'
import { AUTH_TOKEN_KEY } from '../src/services/api'
import { onHttp, jsonResponse, resetHttp } from './http'
import { tokenFixture } from './fixtures'

describe('Sprint 2C — Recruiter Jobs, Candidate Score & Recruitment Pipeline', () => {
  const jobIdFixture = '10000000-0000-4000-8000-000000000001'
  const applicationIdFixture = '20000000-0000-4000-8000-000000000001'
  const otherCompanyJobId = '10000000-0000-4000-8000-000000000099'
  const otherCompanyAppId = '20000000-0000-4000-8000-000000000099'

  const recruiterJobFixture: RecruiterJob = {
    id: jobIdFixture,
    title: 'Senior Frontend Engineer',
    description: 'Membangun dashboard recruitment berbasis React dan TypeScript.',
    location: 'Bandung, Jawa Barat',
    jobType: 'Full-time',
    workType: 'Hybrid',
    employmentType: 'Full-time',
    salaryMin: 15000000,
    salaryMax: 25000000,
    status: 'PUBLISHED',
    companyId: 'company-uuid-1',
    createdByRecruiterId: 'recruiter-uuid-1',
    skills: [
      { id: 'jskill-1', skillName: 'React', required: true, weight: 3 },
      { id: 'jskill-2', skillName: 'TypeScript', required: true, weight: 3 },
    ],
    createdAt: '2026-02-01T08:00:00.000Z',
    updatedAt: '2026-02-01T08:00:00.000Z',
  }

  const jobApplicationFixture: RecruiterJobApplication = {
    id: applicationIdFixture,
    status: 'APPLIED',
    coverLetter: 'Saya antusias bergabung sebagai Frontend Engineer.',
    createdAt: '2026-02-02T10:00:00.000Z',
    updatedAt: '2026-02-02T10:00:00.000Z',
    candidate: {
      id: 'candidate-uuid-1',
      location: 'Bandung, Jawa Barat',
      education: 'S1 Teknik Informatika, ITB',
      experienceSummary: '3 tahun frontend engineer dengan React & TypeScript.',
      user: {
        id: 'user-cand-1',
        email: 'ahmad@ravira.test',
        fullName: 'Ahmad Dahlan',
        phone: '081234567890',
      },
      skills: [
        {
          id: 'cskill-1',
          skillName: 'React',
          level: 'Mahir',
          source: 'CANDIDATE',
          confidenceScore: 90,
        },
        {
          id: 'cskill-2',
          skillName: 'TypeScript',
          level: 'Mahir',
          source: 'CV',
          confidenceScore: 95,
        },
      ],
    },
  }

  const recruiterCandidateScoreFixture: RecruiterCandidateScore = {
    applicationId: applicationIdFixture,
    applicationStatus: 'APPLIED',
    candidate: {
      id: 'candidate-uuid-1',
      fullName: 'Ahmad Dahlan',
      email: 'ahmad@ravira.test',
      phone: '081234567890',
      location: 'Bandung, Jawa Barat',
      education: 'S1 Teknik Informatika, ITB',
      experienceSummary: '3 tahun frontend engineer.',
    },
    matchScore: 88,
    matchExplanation: 'Keahlian React dan TypeScript sangat sesuai kebutuhan lowongan.',
    candidateScore: 85,
    candidateScoreBreakdown: {
      skillScore: 90,
      experienceScore: 80,
      educationScore: 85,
    },
    explanation: 'Kandidat memiliki fondasi kuat dan pengalaman industri terbukti.',
    ruleVersion: 'v1.0-recruiter-rule',
  }

  const applicationCandidateScoreDetailFixture: ApplicationCandidateScore = {
    applicationId: applicationIdFixture,
    applicationStatus: 'APPLIED',
    job: {
      id: jobIdFixture,
      title: 'Senior Frontend Engineer',
    },
    candidate: {
      id: 'candidate-uuid-1',
      fullName: 'Ahmad Dahlan',
      email: 'ahmad@ravira.test',
      phone: '081234567890',
      location: 'Bandung, Jawa Barat',
      education: 'S1 Teknik Informatika, ITB',
      experienceSummary: '3 tahun frontend engineer.',
    },
    matchScore: 88,
    matchExplanation: 'Keahlian React dan TypeScript sangat sesuai kebutuhan lowongan.',
    candidateScore: 85,
    candidateScoreBreakdown: {
      skillScore: 90,
      experienceScore: 80,
      educationScore: 85,
    },
    explanation: 'Kandidat memiliki fondasi kuat dan pengalaman industri terbukti.',
    ruleVersion: 'v1.0-recruiter-rule',
  }

  const applicationDetailFixture: ApplicationDetail = {
    id: applicationIdFixture,
    candidateId: 'candidate-uuid-1',
    jobId: jobIdFixture,
    status: 'APPLIED',
    coverLetter: 'Saya antusias bergabung sebagai Frontend Engineer.',
    resumeUrl: null,
    createdAt: '2026-02-02T10:00:00.000Z',
    updatedAt: '2026-02-02T10:00:00.000Z',
    job: {
      id: jobIdFixture,
      title: 'Senior Frontend Engineer',
      location: 'Bandung, Jawa Barat',
      jobType: 'Full-time',
      workType: 'Hybrid',
      status: 'PUBLISHED',
      companyId: 'company-uuid-1',
      company: {
        id: 'company-uuid-1',
        name: 'PT Teknologi Nusantara',
        industry: 'Teknologi Informasi',
      },
    },
    candidate: {
      id: 'candidate-uuid-1',
      location: 'Bandung, Jawa Barat',
      education: 'S1 Teknik Informatika, ITB',
      experienceSummary: '3 tahun frontend engineer dengan React & TypeScript.',
      user: {
        id: 'user-cand-1',
        email: 'ahmad@ravira.test',
        fullName: 'Ahmad Dahlan',
        phone: '081234567890',
      },
      skills: [
        {
          id: 'cskill-1',
          skillName: 'React',
          level: 'Mahir',
          source: 'CANDIDATE',
          confidenceScore: 90,
        },
      ],
    },
  }

  const statusHistoryFixture: ApplicationStatusHistoryItem[] = [
    {
      id: 'history-1',
      fromStatus: null,
      toStatus: 'APPLIED',
      reason: 'Lamaran diajukan oleh kandidat.',
      changedBy: {
        id: 'user-cand-1',
        email: 'ahmad@ravira.test',
        fullName: 'Ahmad Dahlan',
        role: 'CANDIDATE',
      },
      createdAt: '2026-02-02T10:00:00.000Z',
    },
    {
      id: 'history-2',
      fromStatus: 'APPLIED',
      toStatus: 'SCREENING',
      reason: 'Kualifikasi awal memenuhi kriteria tim engineering.',
      changedBy: {
        id: 'user-rec-1',
        email: 'recruiter@tech.test',
        fullName: 'Bambang HR',
        role: 'RECRUITER',
      },
      createdAt: '2026-02-02T11:00:00.000Z',
    },
  ]

  beforeEach(() => {
    resetHttp()
    localStorage.clear()
    localStorage.setItem(AUTH_TOKEN_KEY, tokenFixture())
  })

  // 1. Load Daftar Lowongan Recruiter
  it('1. dapat memuat daftar lowongan milik perusahaan recruiter', async () => {
    onHttp('GET', '/recruiter/jobs', () => jsonResponse([recruiterJobFixture]))

    const jobs = await listRecruiterJobs()
    expect(jobs).toHaveLength(1)
    expect(jobs[0].id).toBe(jobIdFixture)
    expect(jobs[0].title).toBe('Senior Frontend Engineer')
    expect(jobs[0].status).toBe('PUBLISHED')
  })

  // 2. Daftar Lowongan Kosong
  it('2. menangani daftar lowongan perusahaan kosong tanpa error', async () => {
    onHttp('GET', '/recruiter/jobs', () => jsonResponse([]))

    const jobs = await listRecruiterJobs()
    expect(jobs).toEqual([])
  })

  // 3. Detail Lowongan Berdasarkan ID
  it('3. dapat memuat detail lowongan recruiter berdasarkan ID', async () => {
    onHttp('GET', `/recruiter/jobs/${jobIdFixture}`, () => jsonResponse(recruiterJobFixture))

    const job = await getRecruiterJob(jobIdFixture)
    expect(job.id).toBe(jobIdFixture)
    expect(job.title).toBe('Senior Frontend Engineer')
    expect(job.skills).toHaveLength(2)
  })

  // 4. Buat Lowongan Baru Berhasil (POST /recruiter/jobs)
  it('4. recruiter dapat membuat lowongan baru yang tersimpan persisten', async () => {
    onHttp('POST', '/recruiter/jobs', async (req) => {
      const body = await req.json()
      expect(body.title).toBe('Backend Engineer')
      expect(body.description).toContain('Node.js & PostgreSQL')
      expect(body.status).toBe('PUBLISHED')
      expect(body.jobSkills).toHaveLength(2)

      const created: RecruiterJob = {
        ...recruiterJobFixture,
        id: '10000000-0000-4000-8000-000000000002',
        title: 'Backend Engineer',
        status: 'PUBLISHED',
      }
      return jsonResponse(created, 201)
    })

    const result = await createRecruiterJob({
      title: 'Backend Engineer',
      description: 'Membangun microservice dengan Node.js & PostgreSQL.',
      location: 'Jakarta',
      jobType: 'Full-time',
      salaryMin: 12000000,
      salaryMax: 20000000,
      status: 'PUBLISHED',
      jobSkills: [
        { skillName: 'Node.js', required: true, weight: 3 },
        { skillName: 'PostgreSQL', required: true, weight: 2 },
      ],
    })

    expect(result.id).toBe('10000000-0000-4000-8000-000000000002')
    expect(result.title).toBe('Backend Engineer')
  })

  // 5. Buat Lowongan Ditolak karena Gaji Max < Gaji Min (Validation Error 400)
  it('5. menolak pembuatan lowongan jika salaryMax < salaryMin (error 400)', async () => {
    onHttp('POST', '/recruiter/jobs', () =>
      jsonResponse({ message: 'salaryMax must be greater than or equal to salaryMin.' }, 400)
    )

    await expect(
      createRecruiterJob({
        title: 'Junior QA',
        description: 'Testing aplikasi.',
        salaryMin: 15000000,
        salaryMax: 8000000,
      })
    ).rejects.toMatchObject({ status: 400 })
  })

  // 6. Update Lowongan (PATCH /recruiter/jobs/:jobId)
  it('6. recruiter dapat memperbarui informasi atau status lowongan', async () => {
    const updatedJob: RecruiterJob = {
      ...recruiterJobFixture,
      status: 'CLOSED',
    }

    onHttp('PATCH', `/recruiter/jobs/${jobIdFixture}`, async (req) => {
      const body = await req.json()
      expect(body.status).toBe('CLOSED')
      return jsonResponse(updatedJob)
    })

    const result = await updateRecruiterJob(jobIdFixture, { status: 'CLOSED' })
    expect(result.status).toBe('CLOSED')
  })

  // 7. Delete / Archive Lowongan (DELETE /recruiter/jobs/:jobId)
  it('7. menghapus/mengarsipkan lowongan sesuai semantik DELETE backend', async () => {
    const archivedJob: RecruiterJob = {
      ...recruiterJobFixture,
      status: 'ARCHIVED',
    }

    onHttp('DELETE', `/recruiter/jobs/${jobIdFixture}`, () => jsonResponse(archivedJob))

    const result = await deleteRecruiterJob(jobIdFixture)
    expect(result.status).toBe('ARCHIVED')
  })

  // 8. Recruiter PENDING Ditolak untuk Operasi Sensitif (403 Forbidden)
  it('8. recruiter dengan status PENDING ditolak mengakses pelamar (error 403)', async () => {
    onHttp('GET', `/recruiter/jobs/${jobIdFixture}/applications`, () =>
      jsonResponse({ message: 'Company approval is required to access this resource.' }, 403)
    )

    await expect(listApplicationsForRecruiterJob(jobIdFixture)).rejects.toMatchObject({
      status: 403,
    })
  })

  // 9. Load Daftar Pelamar untuk Lowongan Tertentu
  it('9. dapat memuat daftar pelamar nyata untuk lowongan recruiter', async () => {
    onHttp('GET', `/recruiter/jobs/${jobIdFixture}/applications`, () =>
      jsonResponse([jobApplicationFixture])
    )

    const applicants = await listApplicationsForRecruiterJob(jobIdFixture)
    expect(applicants).toHaveLength(1)
    expect(applicants[0].id).toBe(applicationIdFixture)
    expect(applicants[0].candidate.user.fullName).toBe('Ahmad Dahlan')
    expect(applicants[0].candidate.skills).toHaveLength(2)
  })

  // 10. Load Candidate Scores untuk Lowongan Recruiter
  it('10. dapat memuat kumpulan Candidate Score untuk lowongan perusahaan', async () => {
    onHttp('GET', `/recruiter/jobs/${jobIdFixture}/candidate-scores`, () =>
      jsonResponse([recruiterCandidateScoreFixture])
    )

    const scores = await getRecruiterJobCandidateScores(jobIdFixture)
    expect(scores).toHaveLength(1)
    expect(scores[0].applicationId).toBe(applicationIdFixture)
    expect(scores[0].candidateScore).toBe(85)
    expect(scores[0].matchScore).toBe(88)
    expect(scores[0].candidateScoreBreakdown?.skillScore).toBe(90)
  })

  // 11. Load Detail Lamaran Berdasarkan ID
  it('11. dapat memuat detail lengkap lamaran pelamar', async () => {
    onHttp('GET', `/applications/${applicationIdFixture}`, () =>
      jsonResponse(applicationDetailFixture)
    )

    const detail = await getApplicationById(applicationIdFixture)
    expect(detail.id).toBe(applicationIdFixture)
    expect(detail.candidate.user.fullName).toBe('Ahmad Dahlan')
    expect(detail.job.title).toBe('Senior Frontend Engineer')
  })

  // 12. Load Candidate Score Internal untuk Detail Lamaran
  it('12. recruiter dapat memuat Candidate Score internal pelamar', async () => {
    onHttp('GET', `/applications/${applicationIdFixture}/score`, () =>
      jsonResponse(applicationCandidateScoreDetailFixture)
    )

    const score = await getApplicationCandidateScore(applicationIdFixture)
    expect(score.applicationId).toBe(applicationIdFixture)
    expect(score.candidateScore).toBe(85)
    expect(score.matchScore).toBe(88)
    expect(score.explanation).toContain('fondasi kuat')
  })

  // 13. Akses Candidate Score Ditolak jika Tanpa Otorisasi (403 Forbidden)
  it('13. akses Candidate Score ditolak untuk peran kandidat (error 403)', async () => {
    onHttp('GET', `/applications/${applicationIdFixture}/score`, () =>
      jsonResponse({ message: 'Candidates cannot access Candidate Score.' }, 403)
    )

    await expect(getApplicationCandidateScore(applicationIdFixture)).rejects.toMatchObject({
      status: 403,
    })
  })

  // 14. Akses Lamaran Perusahaan Lain Ditolak (Tenant Isolation 404/403)
  it('14. recruiter tidak dapat mengakses lamaran milik perusahaan lain', async () => {
    onHttp('GET', `/recruiter/jobs/${otherCompanyJobId}/applications`, () =>
      jsonResponse({ message: 'Job not found.' }, 404)
    )
    onHttp('GET', `/applications/${otherCompanyAppId}`, () =>
      jsonResponse({ message: 'Application not found.' }, 404)
    )

    await expect(listApplicationsForRecruiterJob(otherCompanyJobId)).rejects.toMatchObject({
      status: 404,
    })
    await expect(getApplicationById(otherCompanyAppId)).rejects.toMatchObject({
      status: 404,
    })
  })

  // 15. Perpindahan Tahap Seleksi Berhasil (POST /applications/:id/stage)
  it('15. recruiter dapat memindahkan tahap seleksi kandidat secara persisten', async () => {
    const updatedApp: ApplicationDetail = {
      ...applicationDetailFixture,
      status: 'INTERVIEW',
    }

    onHttp('POST', `/applications/${applicationIdFixture}/stage`, async (req) => {
      const body = await req.json()
      expect(body.newStatus).toBe('INTERVIEW')
      expect(body.reason).toBe('Kualifikasi memenuhi kriteria, dijadwalkan wawancara.')
      return jsonResponse(updatedApp)
    })

    const result = await updateApplicationStage(applicationIdFixture, {
      newStatus: 'INTERVIEW',
      reason: 'Kualifikasi memenuhi kriteria, dijadwalkan wawancara.',
    })

    expect(result.id).toBe(applicationIdFixture)
    expect(result.status).toBe('INTERVIEW')
  })

  // 16. Perpindahan Tahap Gagal jika Reason Kosong (400 Bad Request)
  it('16. perpindahan tahap seleksi ditolak jika alasan kosong (error 400)', async () => {
    onHttp('POST', `/applications/${applicationIdFixture}/stage`, () =>
      jsonResponse({ message: 'Reason is required.' }, 400)
    )

    await expect(
      updateApplicationStage(applicationIdFixture, {
        newStatus: 'INTERVIEW',
        reason: '',
      })
    ).rejects.toMatchObject({ status: 400 })
  })

  // 17. Timeline Riwayat Status Seleksi Tersedia
  it('17. dapat membaca riwayat tahapan seleksi (audit trail)', async () => {
    onHttp('GET', `/applications/${applicationIdFixture}/status-history`, () =>
      jsonResponse(statusHistoryFixture)
    )

    const history = await getApplicationStatusHistory(applicationIdFixture)
    expect(history).toHaveLength(2)
    expect(history[0].toStatus).toBe('APPLIED')
    expect(history[1].toStatus).toBe('SCREENING')
    expect(history[1].reason).toContain('Kualifikasi awal memenuhi kriteria')
  })

  // 18. Logout Membersihkan Sesi dan Token Recruiter
  it('18. logout membersihkan token dan mengisolasi sesi recruiter', () => {
    expect(localStorage.getItem(AUTH_TOKEN_KEY)).toBe(tokenFixture())
    logout()
    expect(localStorage.getItem(AUTH_TOKEN_KEY)).toBeNull()
  })
})

