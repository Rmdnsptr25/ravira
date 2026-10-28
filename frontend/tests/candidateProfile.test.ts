import { describe, it, expect, beforeEach } from 'vitest'
import {
  getCandidateProfile,
  updateCandidateProfile,
  listCandidateSkills,
  createCandidateSkill,
  deleteCandidateSkill,
  uploadCandidateCv,
  listCandidateCvs,
  deleteCandidateCv,
  logout,
  type CandidateProfile,
  type CandidateSkill,
  type CandidateDocument,
} from '../src/services/raviraApi'
import { AUTH_TOKEN_KEY } from '../src/services/api'
import { onHttp, jsonResponse, resetHttp } from './http'
import { tokenFixture } from './fixtures'

describe('Candidate Profile, Skills & CV API Integration (Sprint 2A)', () => {
  const profileFixture: CandidateProfile = {
    id: 'candidate-uuid-1',
    userId: 'user-uuid-1',
    email: 'kandidat@test.id',
    fullName: 'Ahmad Dahlan',
    phone: '081234567890',
    location: 'Bandung, Jawa Barat',
    education: 'S1 Teknik Informatika, ITB',
    experienceSummary: '3 tahun frontend developer dengan spesialisasi React dan TypeScript',
    salaryExpectation: 15000000,
    mobilityPreference: 'Bersedia relokasi di Pulau Jawa',
    visibilityStatus: 'PUBLIC',
    createdAt: '2026-01-01T00:00:00.000Z',
    updatedAt: '2026-01-02T00:00:00.000Z',
  }

  const skillFixture: CandidateSkill = {
    id: 'skill-uuid-1',
    skillName: 'TypeScript',
    level: 'Mahir',
    source: 'CANDIDATE',
    confidenceScore: 90,
    createdAt: '2026-01-01T00:00:00.000Z',
    updatedAt: '2026-01-01T00:00:00.000Z',
  }

  const cvDocumentFixture: CandidateDocument = {
    id: 'cv-uuid-1',
    candidateId: 'candidate-uuid-1',
    fileName: 'resume-ahmad.pdf',
    fileType: 'application/pdf',
    fileSize: 102400,
    parsingStatus: 'SUCCESS',
    parsedText: 'Ahmad Dahlan - Frontend Developer',
    extractedSkills: [{ skillName: 'TypeScript', source: 'CV', confidenceScore: 95 }],
    extractedEducation: null,
    extractedExperience: null,
    uploadedAt: '2026-01-01T00:00:00.000Z',
    parsedAt: '2026-01-01T00:00:05.000Z',
    createdAt: '2026-01-01T00:00:00.000Z',
    updatedAt: '2026-01-01T00:00:05.000Z',
  }

  beforeEach(() => {
    resetHttp()
    localStorage.setItem(AUTH_TOKEN_KEY, tokenFixture())
  })

  // 1. Load profil berhasil
  it('1. loads candidate profile successfully', async () => {
    onHttp('GET', '/candidates/me', () => jsonResponse(profileFixture))

    const result = await getCandidateProfile()
    expect(result.id).toBe('candidate-uuid-1')
    expect(result.fullName).toBe('Ahmad Dahlan')
    expect(result.location).toBe('Bandung, Jawa Barat')
    expect(result.salaryExpectation).toBe(15000000)
    expect(result.visibilityStatus).toBe('PUBLIC')
  })

  // 2. Update profil berhasil
  it('2. updates candidate profile successfully with verified changes', async () => {
    const updated = { ...profileFixture, location: 'Surabaya, Jawa Timur', salaryExpectation: 18000000 }
    onHttp('PATCH', '/candidates/me', async (req) => {
      const body = await req.json()
      expect(body.location).toBe('Surabaya, Jawa Timur')
      expect(body.salaryExpectation).toBe(18000000)
      return jsonResponse(updated)
    })

    const result = await updateCandidateProfile({
      location: 'Surabaya, Jawa Timur',
      salaryExpectation: 18000000,
    })
    expect(result.location).toBe('Surabaya, Jawa Timur')
    expect(result.salaryExpectation).toBe(18000000)
  })

  // 3. Update profil gagal (validation error 400)
  it('3. rejects invalid profile update with 400 error', async () => {
    onHttp('PATCH', '/candidates/me', () => jsonResponse({ message: 'At least one profile field is required.' }, 400))

    await expect(updateCandidateProfile({})).rejects.toMatchObject({
      status: 400,
    })
  })

  // 4. Tambah skill berhasil
  it('4. adds a new skill successfully', async () => {
    onHttp('POST', '/candidates/me/skills', async (req) => {
      const body = await req.json()
      expect(body.skillName).toBe('React')
      expect(body.level).toBe('Mahir')
      return jsonResponse({ ...skillFixture, id: 'skill-uuid-2', skillName: 'React' }, 201)
    })

    const result = await createCandidateSkill({ skillName: 'React', level: 'Mahir' })
    expect(result.skillName).toBe('React')
    expect(result.id).toBe('skill-uuid-2')
  })

  // 5. Hapus skill berhasil
  it('5. deletes a candidate skill successfully by valid ID', async () => {
    onHttp('DELETE', '/candidates/me/skills/skill-uuid-1', () => jsonResponse({ id: 'skill-uuid-1' }))

    const result = await deleteCandidateSkill('skill-uuid-1')
    expect(result.id).toBe('skill-uuid-1')
  })

  // 6. Penolakan skill duplikat (409 Conflict)
  it('6. rejects duplicate skill creation with 409 conflict error', async () => {
    onHttp('POST', '/candidates/me/skills', () =>
      jsonResponse({ message: 'A record with the same unique field already exists.' }, 409),
    )

    await expect(createCandidateSkill({ skillName: 'TypeScript' })).rejects.toMatchObject({
      status: 409,
    })
  })

  // 7. Upload CV valid (PDF/DOCX)
  it('7. uploads a valid CV file and returns parsed candidate document', async () => {
    onHttp('POST', '/candidates/me/cv', () => {
      return jsonResponse(cvDocumentFixture, 201)
    })

    const file = new File(['%PDF-1.4 dummy pdf content'], 'resume.pdf', { type: 'application/pdf' })
    const result = await uploadCandidateCv(file)
    expect(result.fileName).toBe('resume-ahmad.pdf')
    expect(result.parsingStatus).toBe('SUCCESS')
    expect(result.extractedSkills?.length).toBe(1)
  })

  // 8. Upload file tidak valid (MIME/extension error 400)
  it('8. rejects non-PDF/DOCX file upload with 400 error', async () => {
    onHttp('POST', '/candidates/me/cv', () =>
      jsonResponse({ message: 'Only PDF or DOCX CV files are allowed.' }, 400),
    )

    const invalidFile = new File(['malicious script'], 'hack.exe', { type: 'application/x-msdownload' })
    await expect(uploadCandidateCv(invalidFile)).rejects.toMatchObject({
      status: 400,
    })
  })

  // 9. Upload melebihi batas ukuran (5MB error 400)
  it('9. rejects CV exceeding 5MB size limit with 400 error', async () => {
    onHttp('POST', '/candidates/me/cv', () =>
      jsonResponse({ message: 'CV file size must not exceed 5MB.' }, 400),
    )

    const bigFile = new File(['large content'], 'huge-resume.pdf', { type: 'application/pdf' })
    await expect(uploadCandidateCv(bigFile)).rejects.toMatchObject({
      status: 400,
    })
  })

  // 10. Token tidak valid atau kedaluwarsa (401 Unauthorized)
  it('10. handles expired or invalid token with 401 error and clears auth token', async () => {
    onHttp('GET', '/candidates/me', () => jsonResponse({ message: 'Invalid or expired token.' }, 401))

    await expect(getCandidateProfile()).rejects.toMatchObject({
      status: 401,
    })
    expect(localStorage.getItem(AUTH_TOKEN_KEY)).toBeNull()
  })

  // 11. Logout dan pergantian akun (membersihkan token dan state)
  it('11. clears token and isolates session state on logout', () => {
    expect(localStorage.getItem(AUTH_TOKEN_KEY)).not.toBeNull()
    logout()
    expect(localStorage.getItem(AUTH_TOKEN_KEY)).toBeNull()
  })

  // 12. Persistensi data setelah refresh (ambil data yang baru diperbarui)
  it('12. verifies profile and skills persistence on reload', async () => {
    const updatedProfile = { ...profileFixture, experienceSummary: 'Senior Frontend Engineer' }
    const skillsList = [skillFixture, { ...skillFixture, id: 'skill-uuid-2', skillName: 'React' }]

    onHttp('GET', '/candidates/me', () => jsonResponse(updatedProfile))
    onHttp('GET', '/candidates/me/skills', () => jsonResponse(skillsList))
    onHttp('GET', '/candidates/me/cv', () => jsonResponse([cvDocumentFixture]))

    const [loadedProfile, loadedSkills, loadedCvs] = await Promise.all([
      getCandidateProfile(),
      listCandidateSkills(),
      listCandidateCvs(),
    ])

    expect(loadedProfile.fullName).toBe('Ahmad Dahlan')
    expect(loadedSkills.length).toBe(2)
    expect(loadedCvs.length).toBe(1)
    expect(loadedCvs[0].fileName).toBe('resume-ahmad.pdf')
  })

  // Extra: Delete CV
  it('13. deletes a candidate CV document successfully', async () => {
    onHttp('DELETE', '/candidates/me/cv/cv-uuid-1', () => jsonResponse({ id: 'cv-uuid-1' }))

    const result = await deleteCandidateCv('cv-uuid-1')
    expect(result.id).toBe('cv-uuid-1')
  })
})
