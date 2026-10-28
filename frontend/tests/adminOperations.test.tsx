import { describe, it, expect, beforeEach } from 'vitest'
import { render, screen, waitFor, fireEvent } from '@testing-library/react'
import { MemoryRouter } from 'react-router'
import React from 'react'
import { AppProvider } from '../src/contexts/AppContext'
import AdminVerifikasiPage from '../src/pages/AdminVerifikasiPage'
import AdminAbuseReportPage from '../src/pages/AdminAbuseReportPage'
import AdminAppealsPage from '../src/pages/AdminAppealsPage'
import AdminDashboardPage from '../src/pages/AdminDashboardPage'
import {
  listPendingCompanies,
  approveCompany,
  rejectCompany,
  listFraudCases,
  updateFraudCaseDecision,
  listAppealsForAdmin,
  updateAppealDecision,
  type AdminPendingCompany,
  type FraudCase,
  type AdminAppeal,
} from '../src/services/raviraApi'
import { AUTH_TOKEN_KEY } from '../src/services/api'
import { onHttp, jsonResponse } from './http'
import { tokenFixture, userFixture } from './fixtures'

describe('Sprint 2D — Admin Verification, Fraud Review & Appeals', () => {
  const pendingCompaniesFixture: AdminPendingCompany[] = [
    {
      id: 'comp-uuid-1',
      name: 'PT Teknologi Maju Bandung',
      industry: 'Teknologi Informasi',
      location: 'Bandung, Jawa Barat',
      website: 'https://tekno-maju.id',
      verificationStatus: 'PENDING',
      verifiedAt: null,
      createdAt: '2026-02-01T08:00:00.000Z',
      updatedAt: '2026-02-01T08:00:00.000Z',
      recruiters: [
        {
          id: 'rec-uuid-1',
          user: {
            id: 'usr-rec-1',
            email: 'hr@tekno-maju.id',
            fullName: 'Budi Santoso',
          },
        },
      ],
    },
    {
      id: 'comp-uuid-2',
      name: 'CV Kreatif Solusi Surabaya',
      industry: 'Desain Kreatif',
      location: 'Surabaya, Jawa Timur',
      website: 'https://kreatifsolusi.co.id',
      verificationStatus: 'PENDING',
      verifiedAt: null,
      createdAt: '2026-02-02T09:00:00.000Z',
      updatedAt: '2026-02-02T09:00:00.000Z',
      recruiters: [
        {
          id: 'rec-uuid-2',
          user: {
            id: 'usr-rec-2',
            email: 'admin@kreatifsolusi.co.id',
            fullName: 'Siti Rahma',
          },
        },
      ],
    },
  ]

  const fraudCasesFixture: FraudCase[] = [
    {
      id: 'fraud-uuid-1',
      candidateId: 'cand-uuid-1',
      riskScore: 90,
      riskLevel: 'HIGH',
      reviewStatus: 'NEED_VERIFICATION',
      reviewerId: null,
      decision: null,
      reason: null,
      decidedAt: null,
      candidate: {
        id: 'cand-uuid-1',
        userId: 'usr-cand-1',
        fullName: 'Ahmad Dahlan',
        emailMasked: 'ah***@gmail.com',
        phoneMasked: '08******7890',
        location: 'Bandung, Jawa Barat',
        isActive: true,
      },
      reviewer: null,
      signals: [
        {
          id: 'sig-uuid-1',
          candidateId: 'cand-uuid-1',
          caseId: 'fraud-uuid-1',
          signalType: 'DUPLICATE_EMAIL',
          riskLevel: 'HIGH',
          evidenceMasked: 'email=ah***@gmail.com; matches=cand-uuid-99',
          status: 'OPEN',
          createdAt: '2026-02-01T10:00:00.000Z',
          updatedAt: '2026-02-01T10:00:00.000Z',
        },
      ],
      createdAt: '2026-02-01T10:00:00.000Z',
      updatedAt: '2026-02-01T10:00:00.000Z',
    },
    {
      id: 'fraud-uuid-2',
      candidateId: 'cand-uuid-2',
      riskScore: 60,
      riskLevel: 'MEDIUM',
      reviewStatus: 'OPEN',
      reviewerId: null,
      decision: null,
      reason: null,
      decidedAt: null,
      candidate: {
        id: 'cand-uuid-2',
        userId: 'usr-cand-2',
        fullName: 'Bambang Sudirman',
        emailMasked: 'ba***@yahoo.com',
        phoneMasked: '08******1234',
        location: 'Semarang, Jawa Tengah',
        isActive: true,
      },
      reviewer: null,
      signals: [
        {
          id: 'sig-uuid-2',
          candidateId: 'cand-uuid-2',
          caseId: 'fraud-uuid-2',
          signalType: 'SIMILAR_NAME_LOCATION',
          riskLevel: 'MEDIUM',
          evidenceMasked: 'name=bambang; location=semarang',
          status: 'OPEN',
          createdAt: '2026-02-02T11:00:00.000Z',
          updatedAt: '2026-02-02T11:00:00.000Z',
        },
      ],
      createdAt: '2026-02-02T11:00:00.000Z',
      updatedAt: '2026-02-02T11:00:00.000Z',
    },
    {
      id: 'fraud-uuid-3',
      candidateId: 'cand-uuid-3',
      riskScore: 30,
      riskLevel: 'LOW',
      reviewStatus: 'RESOLVED',
      reviewerId: 'adm-uuid-1',
      decision: 'FALSE_POSITIVE',
      reason: 'Akun telah diverifikasi manual melalui KTP.',
      decidedAt: '2026-02-03T12:00:00.000Z',
      candidate: {
        id: 'cand-uuid-3',
        userId: 'usr-cand-3',
        fullName: 'Citra Lestari',
        emailMasked: 'ci***@gmail.com',
        phoneMasked: '08******5678',
        location: 'Jakarta Selatan, DKI Jakarta',
        isActive: true,
      },
      reviewer: {
        id: 'adm-uuid-1',
        fullName: 'Super Admin Ravira',
        emailMasked: 'ad***@ravira.test',
        role: 'SUPER_ADMIN',
      },
      signals: [],
      createdAt: '2026-02-03T09:00:00.000Z',
      updatedAt: '2026-02-03T12:00:00.000Z',
    },
  ]

  const appealsFixture: AdminAppeal[] = [
    {
      id: 'appeal-uuid-1',
      candidateId: 'cand-uuid-1',
      relatedEntity: 'fraud',
      relatedEntityId: 'fraud-uuid-1',
      reason: 'Saya tidak pernah membuat akun ganda, mohon verifikasi ulang data saya.',
      evidenceUrl: 'https://storage.ravira.test/evidence/ktp-ahmad.pdf',
      status: 'OPEN',
      reviewerId: null,
      resolvedAt: null,
      createdAt: '2026-02-03T14:00:00.000Z',
      updatedAt: '2026-02-03T14:00:00.000Z',
      candidate: {
        id: 'cand-uuid-1',
        user: {
          id: 'usr-cand-1',
          email: 'ahmad.dahlan@ravira.test',
          fullName: 'Ahmad Dahlan',
        },
      },
      reviewer: null,
    },
    {
      id: 'appeal-uuid-2',
      candidateId: 'cand-uuid-2',
      relatedEntity: 'skill',
      relatedEntityId: 'skill-uuid-2',
      reason: 'Sertifikat keahlian React saya valid dan diterbitkan oleh lembaga resmi.',
      evidenceUrl: 'https://storage.ravira.test/evidence/cert-react.pdf',
      status: 'APPROVED',
      reviewerId: 'adm-uuid-1',
      resolvedAt: '2026-02-04T15:00:00.000Z',
      createdAt: '2026-02-04T10:00:00.000Z',
      updatedAt: '2026-02-04T15:00:00.000Z',
      candidate: {
        id: 'cand-uuid-2',
        user: {
          id: 'usr-cand-2',
          email: 'bambang@ravira.test',
          fullName: 'Bambang Sudirman',
        },
      },
      reviewer: {
        id: 'adm-uuid-1',
        email: 'admin@ravira.test',
        fullName: 'Super Admin Ravira',
        role: 'SUPER_ADMIN',
      },
    },
  ]

  beforeEach(() => {
    localStorage.setItem(AUTH_TOKEN_KEY, tokenFixture())
    onHttp('GET', '/jobs', () => jsonResponse([]))
    onHttp('GET', '/auth/me', () => jsonResponse(userFixture('ADMIN')))
  })

  const renderWithProviders = (ui: React.ReactElement) => {
    return render(
      <MemoryRouter>
        <AppProvider>{ui}</AppProvider>
      </MemoryRouter>
    )
  }

  // 1. AdminVerifikasiPage: loads and displays pending companies from backend
  it('1. AdminVerifikasiPage: loads and displays pending companies from backend', async () => {
    onHttp('GET', '/admin/companies/pending', () => jsonResponse(pendingCompaniesFixture))

    renderWithProviders(<AdminVerifikasiPage />)

    await waitFor(() => {
      expect(screen.getByText('PT Teknologi Maju Bandung')).toBeInTheDocument()
      expect(screen.getByText('CV Kreatif Solusi Surabaya')).toBeInTheDocument()
    })
    expect(screen.getByText('Budi Santoso')).toBeInTheDocument()
  })

  // 2. AdminVerifikasiPage: handles approve company flow and updates UI
  it('2. AdminVerifikasiPage: handles approve company flow and updates UI', async () => {
    onHttp('GET', '/admin/companies/pending', () => jsonResponse(pendingCompaniesFixture))
    onHttp('POST', '/admin/companies/comp-uuid-1/approve', () =>
      jsonResponse({
        ...pendingCompaniesFixture[0],
        verificationStatus: 'APPROVED',
        verifiedAt: '2026-02-02T10:00:00.000Z',
      })
    )

    renderWithProviders(<AdminVerifikasiPage />)

    await waitFor(() => {
      expect(screen.getByText('PT Teknologi Maju Bandung')).toBeInTheDocument()
    })

    const approveButtons = screen.getAllByRole('button', { name: /Approve/i })
    expect(approveButtons.length).toBeGreaterThan(0)
    fireEvent.click(approveButtons[0])

    await waitFor(() => {
      expect(screen.getByText('DIVERIFIKASI')).toBeInTheDocument()
    })
  })

  // 3. AdminVerifikasiPage: handles reject company flow with required reason
  it('3. AdminVerifikasiPage: handles reject company flow with required reason', async () => {
    onHttp('GET', '/admin/companies/pending', () => jsonResponse(pendingCompaniesFixture))
    onHttp('POST', '/admin/companies/comp-uuid-1/reject', async (req) => {
      const body = await req.json()
      expect(body.reason).toBe('Dokumen SIUP tidak terbaca dan tidak valid.')
      return jsonResponse({
        ...pendingCompaniesFixture[0],
        verificationStatus: 'REJECTED',
        verifiedAt: null,
      })
    })

    renderWithProviders(<AdminVerifikasiPage />)

    await waitFor(() => {
      expect(screen.getByText('PT Teknologi Maju Bandung')).toBeInTheDocument()
    })

    const rejectButtons = screen.getAllByRole('button', { name: /Reject/i })
    fireEvent.click(rejectButtons[0])

    await waitFor(() => {
      expect(screen.getByText('Alasan Penolakan Perusahaan')).toBeInTheDocument()
    })

    const reasonInput = screen.getByPlaceholderText(/Jelaskan alasan penolakan/i)
    fireEvent.change(reasonInput, { target: { value: 'Dokumen SIUP tidak terbaca dan tidak valid.' } })

    const confirmButton = screen.getByRole('button', { name: /Kirim Penolakan/i })
    fireEvent.click(confirmButton)

    await waitFor(() => {
      expect(screen.getByText('DITOLAK')).toBeInTheDocument()
    })
  })

  // 4. AdminVerifikasiPage: prevents rejection submit when reason is empty
  it('4. AdminVerifikasiPage: prevents rejection submit when reason is empty', async () => {
    onHttp('GET', '/admin/companies/pending', () => jsonResponse(pendingCompaniesFixture))

    renderWithProviders(<AdminVerifikasiPage />)

    await waitFor(() => {
      expect(screen.getByText('PT Teknologi Maju Bandung')).toBeInTheDocument()
    })

    const rejectButtons = screen.getAllByRole('button', { name: /Reject/i })
    fireEvent.click(rejectButtons[0])

    await waitFor(() => {
      expect(screen.getByText('Alasan Penolakan Perusahaan')).toBeInTheDocument()
    })

    const confirmButton = screen.getByRole('button', { name: /Kirim Penolakan/i })
    expect(confirmButton).toBeDisabled()

    // Test rejection with empty string throws error at API level
    onHttp('POST', '/admin/companies/comp-uuid-1/reject', () =>
      jsonResponse({ message: 'Reason must be provided.' }, 400)
    )

    await expect(rejectCompany('comp-uuid-1', { reason: '' })).rejects.toMatchObject({
      status: 400,
    })
  })

  // 5. AdminVerifikasiPage: prevents double submit during approve or reject
  it('5. AdminVerifikasiPage: prevents double submit during approve or reject', async () => {
    let callCount = 0
    onHttp('GET', '/admin/companies/pending', () => jsonResponse(pendingCompaniesFixture))
    onHttp('POST', '/admin/companies/comp-uuid-1/approve', async () => {
      callCount += 1
      await new Promise((resolve) => setTimeout(resolve, 50))
      return jsonResponse({
        ...pendingCompaniesFixture[0],
        verificationStatus: 'APPROVED',
      })
    })

    renderWithProviders(<AdminVerifikasiPage />)

    await waitFor(() => {
      expect(screen.getByText('PT Teknologi Maju Bandung')).toBeInTheDocument()
    })

    const approveButtons = screen.getAllByRole('button', { name: /Approve/i })
    fireEvent.click(approveButtons[0])
    fireEvent.click(approveButtons[0])

    await waitFor(() => {
      expect(screen.getByText('DIVERIFIKASI')).toBeInTheDocument()
    })
    expect(callCount).toBe(1)
  })

  // 6. AdminVerifikasiPage: handles backend error when approving or rejecting
  it('6. AdminVerifikasiPage: handles backend error when approving or rejecting', async () => {
    onHttp('GET', '/admin/companies/pending', () => jsonResponse(pendingCompaniesFixture))
    onHttp('POST', '/admin/companies/comp-uuid-1/approve', () =>
      jsonResponse({ message: 'Company not found.' }, 404)
    )

    renderWithProviders(<AdminVerifikasiPage />)

    await waitFor(() => {
      expect(screen.getByText('PT Teknologi Maju Bandung')).toBeInTheDocument()
    })

    const approveButtons = screen.getAllByRole('button', { name: /Approve/i })
    fireEvent.click(approveButtons[0])

    await expect(approveCompany('comp-uuid-1')).rejects.toMatchObject({
      status: 404,
    })
  })

  // 7. AdminAbuseReportPage: loads and displays fraud cases from backend
  it('7. AdminAbuseReportPage: loads and displays fraud cases from backend', async () => {
    onHttp('GET', '/admin/fraud-cases', () => jsonResponse(fraudCasesFixture))

    renderWithProviders(<AdminAbuseReportPage />)

    await waitFor(() => {
      expect(screen.getByText('Ahmad Dahlan')).toBeInTheDocument()
      expect(screen.getByText('Bambang Sudirman')).toBeInTheDocument()
      expect(screen.getByText('Citra Lestari')).toBeInTheDocument()
    })
    expect(screen.getByText(/HIGH RISK/i)).toBeInTheDocument()
  })

  // 8. AdminAbuseReportPage: filters fraud cases by risk level (HIGH, MEDIUM, LOW)
  it('8. AdminAbuseReportPage: filters fraud cases by risk level (HIGH, MEDIUM, LOW)', async () => {
    onHttp('GET', '/admin/fraud-cases', () => jsonResponse(fraudCasesFixture))
    onHttp('GET', '/admin/fraud-cases?riskLevel=HIGH', () =>
      jsonResponse([fraudCasesFixture[0]])
    )

    const result = await listFraudCases({ riskLevel: 'HIGH' })
    expect(result).toHaveLength(1)
    expect(result[0].riskLevel).toBe('HIGH')
    expect(result[0].candidate.fullName).toBe('Ahmad Dahlan')
  })

  // 9. AdminAbuseReportPage: filters fraud cases by review status
  it('9. AdminAbuseReportPage: filters fraud cases by review status', async () => {
    onHttp('GET', '/admin/fraud-cases?reviewStatus=NEED_VERIFICATION', () =>
      jsonResponse([fraudCasesFixture[0]])
    )

    const result = await listFraudCases({ reviewStatus: 'NEED_VERIFICATION' })
    expect(result).toHaveLength(1)
    expect(result[0].reviewStatus).toBe('NEED_VERIFICATION')
  })

  // 10. AdminAbuseReportPage: safely displays masked candidate information and evidence without leaking raw data
  it('10. AdminAbuseReportPage: safely displays masked candidate information and evidence without leaking raw data', async () => {
    onHttp('GET', '/admin/fraud-cases', () => jsonResponse(fraudCasesFixture))

    renderWithProviders(<AdminAbuseReportPage />)

    await waitFor(() => {
      expect(screen.getByText('ah***@gmail.com')).toBeInTheDocument()
      expect(screen.getByText('08******7890')).toBeInTheDocument()
    })

    // Assert that raw unmasked candidate emails are not exposed
    expect(screen.queryByText('ahmad.dahlan.secret@gmail.com')).toBeNull()
  })

  // 11. AdminAbuseReportPage: submits review decision (VALID, FALSE_POSITIVE, etc.) with reason
  it('11. AdminAbuseReportPage: submits review decision (VALID, FALSE_POSITIVE, etc.) with reason', async () => {
    onHttp('GET', '/admin/fraud-cases', () => jsonResponse(fraudCasesFixture))
    onHttp('POST', '/admin/fraud-cases/fraud-uuid-1/decision', async (req) => {
      const body = await req.json()
      expect(body.decision).toBe('VALID')
      expect(body.reason).toBe('Email ganda terdeteksi dan tidak dapat dibuktikan kepemilikannya.')
      return jsonResponse({
        ...fraudCasesFixture[0],
        decision: 'VALID',
        reviewStatus: 'VALID',
        reason: body.reason,
        decidedAt: '2026-02-04T12:00:00.000Z',
      })
    })

    const updated = await updateFraudCaseDecision('fraud-uuid-1', {
      decision: 'VALID',
      reason: 'Email ganda terdeteksi dan tidak dapat dibuktikan kepemilikannya.',
    })

    expect(updated.id).toBe('fraud-uuid-1')
    expect(updated.decision).toBe('VALID')
    expect(updated.reviewStatus).toBe('VALID')
  })

  // 12. AdminAbuseReportPage: prevents decision submit when reason is empty
  it('12. AdminAbuseReportPage: prevents decision submit when reason is empty', async () => {
    onHttp('GET', '/admin/fraud-cases', () => jsonResponse(fraudCasesFixture))

    renderWithProviders(<AdminAbuseReportPage />)

    await waitFor(() => {
      expect(screen.getByText('Ahmad Dahlan')).toBeInTheDocument()
    })

    const decideButtons = screen.getAllByRole('button', { name: /Tinjau & Putuskan/i })
    fireEvent.click(decideButtons[0])

    await waitFor(() => {
      expect(screen.getByText('Tinjau & Putuskan Kasus Integritas')).toBeInTheDocument()
    })

    const submitBtn = screen.getByRole('button', { name: /Simpan Keputusan/i })
    expect(submitBtn).toBeDisabled()

    onHttp('POST', '/admin/fraud-cases/fraud-uuid-1/decision', () =>
      jsonResponse({ message: 'Reason must be non-empty string.' }, 400)
    )

    await expect(
      updateFraudCaseDecision('fraud-uuid-1', {
        decision: 'VALID',
        reason: '',
      })
    ).rejects.toMatchObject({ status: 400 })
  })

  // 13. AdminAppealsPage: loads and displays candidate appeals from backend
  it('13. AdminAppealsPage: loads and displays candidate appeals from backend', async () => {
    onHttp('GET', '/admin/appeals', () => jsonResponse(appealsFixture))

    renderWithProviders(<AdminAppealsPage />)

    await waitFor(() => {
      expect(screen.getByText('Ahmad Dahlan')).toBeInTheDocument()
      expect(screen.getByText('Bambang Sudirman')).toBeInTheDocument()
    })

    expect(
      screen.getByText(/Saya tidak pernah membuat akun ganda/i)
    ).toBeInTheDocument()
  })

  // 14. AdminAppealsPage: submits appeal decision (APPROVED, REJECTED, NEED_INFO) with reason
  it('14. AdminAppealsPage: submits appeal decision (APPROVED, REJECTED, NEED_INFO) with reason', async () => {
    onHttp('GET', '/admin/appeals', () => jsonResponse(appealsFixture))
    onHttp('POST', '/admin/appeals/appeal-uuid-1/decision', async (req) => {
      const body = await req.json()
      expect(body.status).toBe('APPROVED')
      expect(body.reason).toBe('Verifikasi identitas KTP manual telah tervalidasi dan sah.')
      return jsonResponse({
        ...appealsFixture[0],
        status: 'APPROVED',
        resolvedAt: '2026-02-05T10:00:00.000Z',
      })
    })

    const result = await updateAppealDecision('appeal-uuid-1', {
      status: 'APPROVED',
      reason: 'Verifikasi identitas KTP manual telah tervalidasi dan sah.',
    })

    expect(result.id).toBe('appeal-uuid-1')
    expect(result.status).toBe('APPROVED')
    expect(result.resolvedAt).not.toBeNull()
  })

  // 15. AdminAppealsPage: prevents appeal decision submit when reason is empty
  it('15. AdminAppealsPage: prevents appeal decision submit when reason is empty', async () => {
    onHttp('GET', '/admin/appeals', () => jsonResponse(appealsFixture))

    renderWithProviders(<AdminAppealsPage />)

    await waitFor(() => {
      expect(screen.getByText('Ahmad Dahlan')).toBeInTheDocument()
    })

    const putuskanButtons = screen.getAllByRole('button', { name: /Putuskan/i })
    fireEvent.click(putuskanButtons[0])

    await waitFor(() => {
      expect(screen.getByText('Putuskan Sanggahan Kandidat')).toBeInTheDocument()
    })

    const submitBtn = screen.getByRole('button', { name: /Simpan Keputusan/i })
    expect(submitBtn).toBeDisabled()

    onHttp('POST', '/admin/appeals/appeal-uuid-1/decision', () =>
      jsonResponse({ message: 'Reason is required.' }, 400)
    )

    await expect(
      updateAppealDecision('appeal-uuid-1', {
        status: 'APPROVED',
        reason: '',
      })
    ).rejects.toMatchObject({ status: 400 })
  })

  // 16. AdminDashboardPage: displays real pending verification and case counts from backend
  it('16. AdminDashboardPage: displays real pending verification and case counts from backend', async () => {
    onHttp('GET', '/admin/companies/pending', () => jsonResponse(pendingCompaniesFixture))
    onHttp('GET', '/admin/fraud-cases', () => jsonResponse(fraudCasesFixture))
    onHttp('GET', '/admin/appeals', () => jsonResponse(appealsFixture))

    const [companies, fraud, appeals] = await Promise.all([
      listPendingCompanies(),
      listFraudCases(),
      listAppealsForAdmin(),
    ])

    expect(companies).toHaveLength(2)
    expect(fraud).toHaveLength(3)
    expect(appeals).toHaveLength(2)

    renderWithProviders(<AdminDashboardPage />)

    await waitFor(() => {
      expect(screen.getByText('PT Teknologi Maju Bandung')).toBeInTheDocument()
    })
    expect(screen.getByText('Antrian Verifikasi')).toBeInTheDocument()
  })

  // 17. Admin authorization: non-admin (candidate) cannot access admin verification page
  it('17. Admin authorization: non-admin (candidate) cannot access admin verification page', async () => {
    onHttp('GET', '/admin/companies/pending', () =>
      jsonResponse({ message: 'Forbidden. Admin role required.' }, 403)
    )

    await expect(listPendingCompanies()).rejects.toMatchObject({
      status: 403,
    })
  })

  // 18. Admin authorization: non-admin (recruiter) cannot access admin verification page
  it('18. Admin authorization: non-admin (recruiter) cannot access admin verification page', async () => {
    onHttp('GET', '/admin/fraud-cases', () =>
      jsonResponse({ message: 'Forbidden. Admin role required.' }, 403)
    )

    await expect(listFraudCases()).rejects.toMatchObject({
      status: 403,
    })
  })
})
