# DOKUMEN HASIL IMPLEMENTASI SPRINT 2D
## Admin Verification, Fraud Review & Candidate Appeals

- **Proyek:** RAVIRA — AI-Powered Job Matching & Recruitment Ecosystem
- **Repository:** `Rmdnsptr25/ravira`
- **Workspace:** `D:\ProjectRavira\ravira`
- **Branch:** `sprint-2/frontend-api-integration`
- **Tahap:** Sprint 2D — Admin Operations (Company Verification, Fraud Review & Appeals)
- **Status:** **COMPLETED & VERIFIED**
- **Tanggal:** 29 Oktober 2026

---

## 1. Executive Summary

Sprint 2D berfokus pada integrasi penuh modul operasional Administrator Internal Ravira dengan backend Node.js/Express, Prisma ORM, dan database PostgreSQL. Pada tahap ini, seluruh halaman Admin yang sebelumnya menggunakan data statis/mock telah digantikan dengan pemanggilan REST API riil, penanganan state komprehensif, validasi formulir keputusan ketat, mitigasi double-submit, kepatuhan privasi data kandidat (masking email/telepon), dan pencatatan audit trail menyeluruh.

Fitur-fitur utama yang telah diintegrasikan:
1. **Verifikasi Perusahaan (`AdminVerifikasiPage`):** Terhubung dengan `GET /api/v1/admin/companies/pending`, `POST /api/v1/admin/companies/:companyId/approve`, dan `POST /api/v1/admin/companies/:companyId/reject`. Dilengkapi modal alasan penolakan wajib dan proteksi double-submit.
2. **Review Kasus Integritas & Fraud (`AdminAbuseReportPage`):** Terhubung dengan `GET /api/v1/admin/fraud-cases` dan `POST /api/v1/admin/fraud-cases/:caseId/decision`. Mendukung filter tingkat risiko (*HIGH*, *MEDIUM*, *LOW*), filter status review, visualisasi sinyal kecurangan berantai, dan modal keputusan investigasi (*VALID*, *FALSE_POSITIVE*, *NEED_VERIFICATION*, *MERGED*, *BLOCKED*, *RESOLVED*).
3. **Manajemen Sanggahan Kandidat (`AdminAppealsPage`):** Halaman baru yang terhubung ke `GET /api/v1/admin/appeals` dan `POST /api/v1/admin/appeals/:appealId/decision`. Dilindungi route guard `ADMIN` dan `SUPER_ADMIN` untuk meninjau sanggahan kandidat atas flag fraud atau penolakan.
4. **Dashboard Admin Overview (`AdminDashboardPage`):** Mengganti metrik dummy dengan agregasi riil dari antrian verifikasi perusahaan, kasus fraud aktif, dan sanggahan kandidat yang memerlukan tindakan.
5. **Security & RBAC Protection:** Menjamin pengguna dengan role selain `ADMIN` atau `SUPER_ADMIN` (seperti `CANDIDATE` atau `RECRUITER`) ditolak dengan HTTP 403 Forbidden.

---

## 2. Berkas yang Diubah dan Dibuat

### Berkas Baru
1. `frontend/src/pages/AdminAppealsPage.tsx`: Komponen UI manajemen dan review sanggahan kandidat (*Candidate Appeals*).
2. `frontend/src/constants/adminSidebar.tsx`: Definisi terpadu dan modular untuk navigasi sidebar admin yang mencakup sanggahan kandidat.
3. `frontend/tests/adminOperations.test.tsx`: Test suite komprehensif Vitest mencakup 18 skenario uji operasional admin.
4. `docs/SPRINT_2D_ADMIN_VERIFICATION_FRAUD_APPEALS_RESULT.md`: Laporan komprehensif implementasi dan verifikasi teknis Sprint 2D.

### Berkas yang Diperbarui
1. `frontend/src/services/raviraApi.ts`:
   - Penambahan tipe: `AdminCompanyVerificationStatus`, `AdminPendingCompany`, `RejectCompanyInput`, `FraudRiskLevel`, `FraudReviewStatus`, `FraudSignal`, `FraudCase`, `FraudCaseQuery`, `FraudCaseDecisionInput`, `AppealStatus`, `AdminAppeal`, `AppealDecisionInput`.
   - Penambahan fungsi API: `listPendingCompanies()`, `approveCompany()`, `rejectCompany()`, `listFraudCases()`, `getFraudCaseById()`, `updateFraudCaseDecision()`, `listAppealsForAdmin()`, `getAppealByIdForAdmin()`, `updateAppealDecision()`.
2. `frontend/src/pages/AdminVerifikasiPage.tsx`:
   - Mengganti array dummy statis dengan integrasi `listPendingCompanies()`.
   - Implementasi aksi `approveCompany()` dengan konfirmasi dan pembaruan badge instan.
   - Implementasi modal penolakan perusahaan dengan validasi alasan wajib non-kosong.
   - Proteksi double-submission dan state loading/error/empty.
3. `frontend/src/pages/AdminAbuseReportPage.tsx`:
   - Mengganti mock laporan statis dengan integrasi `listFraudCases()`.
   - Filter dinamis berdasarkan tingkat risiko (*HIGH*, *MEDIUM*, *LOW*) dan status review.
   - Modal keputusan investigasi fraud dengan alasan wajib dan peringatan blokir akun kandidat.
   - Tampilan aman informasi kandidat (email dan telepon tersensor/masked).
4. `frontend/src/pages/AdminDashboardPage.tsx`:
   - Mengambil data riil via `Promise.allSettled` dari endpoint perusahaan pending, kasus fraud, dan sanggahan.
   - Menampilkan antrian verifikasi riil (5 perusahaan teratas).
5. `frontend/src/routes.ts`:
   - Mendaftarkan rute `/dashboard/admin/sanggahan` dan `/dashboard/admin/appeals` yang dilindungi oleh `ProtectedRoute`.

---

## 3. Matriks Kontrak API Backend yang Diimplementasikan

| Modul | Method | Endpoint Backend | Request Body / Query | Otorisasi RBAC | Deskripsi Fungsi |
|---|---|---|---|---|---|
| Perusahaan | `GET` | `/api/v1/admin/companies/pending` | - | `ADMIN`, `SUPER_ADMIN` | Menampilkan seluruh perusahaan dengan status `PENDING` |
| Perusahaan | `POST` | `/api/v1/admin/companies/:companyId/approve` | - | `ADMIN`, `SUPER_ADMIN` | Menyetujui pendaftaran perusahaan, audit log `COMPANY_APPROVED` |
| Perusahaan | `POST` | `/api/v1/admin/companies/:companyId/reject` | `{ reason: string }` | `ADMIN`, `SUPER_ADMIN` | Menolak pendaftaran perusahaan, audit log `COMPANY_REJECTED` |
| Fraud | `GET` | `/api/v1/admin/fraud-cases` | `?riskLevel=&reviewStatus=&candidateId=` | `ADMIN`, `SUPER_ADMIN` | Menampilkan kasus kecurangan dengan filter risiko & status |
| Fraud | `GET` | `/api/v1/admin/fraud-cases/:caseId` | - | `ADMIN`, `SUPER_ADMIN` | Mengambil detail kasus fraud dan histori sinyal kecurangan |
| Fraud | `POST` | `/api/v1/admin/fraud-cases/:caseId/decision` | `{ decision: enum, reason: string }` | `ADMIN`, `SUPER_ADMIN` | Menyimpan keputusan review kasus fraud dan memperbarui status sinyal |
| Appeals | `GET` | `/api/v1/admin/appeals` | - | `ADMIN`, `SUPER_ADMIN` | Mengambil daftar seluruh permohonan sanggahan kandidat |
| Appeals | `GET` | `/api/v1/admin/appeals/:appealId` | - | `ADMIN`, `SUPER_ADMIN` | Mengambil detail spesifik sanggahan kandidat |
| Appeals | `POST` | `/api/v1/admin/appeals/:appealId/decision` | `{ status: enum, reason: string }` | `ADMIN`, `SUPER_ADMIN` | Menyimpan keputusan sanggahan, audit log `APPEAL_DECISION_UPDATED` |

---

## 4. Rincian Modul Verifikasi Perusahaan (`AdminVerifikasiPage`)

### Alur Bisnis
1. Saat komponen dimuat, sistem memanggil `listPendingCompanies()`.
2. Antarmuka menampilkan tabel perusahaan dengan informasi: Nama Perusahaan, Website, Industri, Lokasi (Pulau Jawa), Tanggal Pendaftaran, PIC Recruiter, Status Verifikasi, dan Tombol Aksi.
3. **Persetujuan (Approve):**
   - Menekan tombol `Approve` memanggil `approveCompany(company.id)`.
   - Selama permintaan berlangsung, tombol masuk ke status `isSubmitting` untuk mencegah double-click.
   - Setelah sukses, status lokal diperbarui menjadi `APPROVED` dan menampilkan notifikasi sukses via Sonner Toast.
4. **Penolakan (Reject):**
   - Menekan tombol `Reject` membuka modal alasan penolakan.
   - Admin wajib mengisi alasan (teks tidak boleh kosong setelah di-trim).
   - Tombol "Kirim Penolakan" dinonaktifkan jika textarea kosong.
   - Mengirimkan alasan via `rejectCompany(company.id, { reason })`. Status diperbarui menjadi `REJECTED`.
5. **Statistik Riil:** Tab filter dan kartu metrik secara otomatis menghitung jumlah perusahaan berdasarkan status (`Total`, `Menunggu`, `Diverifikasi`, `Ditolak`).

---

## 5. Rincian Modul Review Fraud (`AdminAbuseReportPage`)

### Alur Bisnis & Perlindungan Privasi
1. Mengambil data kasus fraud aktual melalui `listFraudCases(query)`.
2. Mendukung penyaringan langsung berdasarkan:
   - **Tingkat Risiko:** Semua Level, Tinggi (*HIGH*), Sedang (*MEDIUM*), Rendah (*LOW*).
   - **Status Review:** *OPEN*, *IN_REVIEW*, *NEED_VERIFICATION*, *VALID*, *FALSE_POSITIVE*, *MERGED*, *BLOCKED*, *RESOLVED*.
3. **Data Masking & Keamanan Kandidat:**
   - Email kandidat ditampilkan dalam format tersensor (misal: `ah***@gmail.com`).
   - Nomor telepon kandidat disensor (misal: `08******7890`).
   - Sinyal bukti (*evidence*) disensor secara terstruktur (misal: `email=ah***@gmail.com; matches=...`).
   - Tidak ada jalur file mentah atau data sensitif yang bocor ke DOM.
4. **Modal Keputusan Admin:**
   - Admin dapat memilih opsi keputusan:
     - `VALID`: Kasus terbukti kecurangan (fraud sah).
     - `FALSE_POSITIVE`: Kesalahan deteksi, profil dinyatakan aman.
     - `NEED_VERIFICATION`: Mengirimkan notifikasi ke kandidat untuk verifikasi identitas lanjutan.
     - `MERGED`: Menggabungkan akun duplikat.
     - `BLOCKED`: Memblokir akun kandidat (mengubah `user.isActive: false`). Ditampilkan peringatan visual khusus.
     - `RESOLVED`: Kasus ditutup/selesai.
   - Formulir mewajibkan pengisian `reason` non-kosong untuk catatan audit log.

---

## 6. Rincian Modul Sanggahan Kandidat (`AdminAppealsPage`)

### Alur Bisnis
1. Halaman baru yang melayani permohonan sanggahan/keberatan dari kandidat terhadap deteksi fraud atau verifikasi profil.
2. Menampilkan informasi kandidat, entitas terkait (`fraud`, `skill`, `profile`, `application`), alasan sanggahan dari kandidat, tautan dokumen bukti (*evidence URL*), status, dan peninjau sebelumnya.
3. Admin dapat membuka modal "Putuskan Sanggahan":
   - Memilih status keputusan: `IN_REVIEW`, `NEED_INFO`, `APPROVED`, `REJECTED`, atau `RESOLVED`.
   - Mengisi alasan keputusan admin yang akan dicatat pada audit log dan dikirimkan sebagai notifikasi ke kandidat.
   - Tombol simpan dinonaktifkan jika alasan kosong.
4. Terintegrasi penuh dengan rute `/dashboard/admin/sanggahan` dan navigasi sidebar admin.

---

## 7. Rincian Penyesuaian Admin Dashboard Overview (`AdminDashboardPage`)

1. Mengganti angka hardcoded/palsu dengan data riil:
   - **Pending Verifikasi Perusahaan:** Menampilkan jumlah riil antrian verifikasi dari backend.
   - **Kasus Integritas & Fraud:** Menampilkan total kasus fraud aktif dan jumlah kasus risiko tinggi.
   - **Sanggahan Kandidat:** Menampilkan total permohonan sanggahan kandidat yang menunggu review.
2. **Antrian Verifikasi Cepat:** Menampilkan hingga 5 perusahaan terbaru dari antrian verifikasi backend lengkap dengan nama, industri, tanggal pendaftaran, dan tombol review langsung.
3. Penanganan state kosong yang informatif saat tidak ada antrian perusahaan.

---

## 8. Verifikasi Pengujian Otomatis

Pengujian komprehensif dilakukan pada kedua sisi sistem (Frontend Vitest & Backend Node Test Runner).

### A. Frontend Vitest Test Suite (`frontend/tests/adminOperations.test.tsx`)
Sebanyak 18 skenario uji operasional admin telah diimplementasikan dan diverifikasi **100% LULUS (PASS)**:

```
 RUN  v5.0.5 D:/ProjectRavira/ravira/frontend

 ✓ tests/adminOperations.test.tsx (18 tests) 3554ms
   ✓ Sprint 2D — Admin Verification, Fraud Review & Appeals (18)
     ✓ 1. AdminVerifikasiPage: loads and displays pending companies from backend
     ✓ 2. AdminVerifikasiPage: handles approve company flow and updates UI
     ✓ 3. AdminVerifikasiPage: handles reject company flow with required reason
     ✓ 4. AdminVerifikasiPage: prevents rejection submit when reason is empty
     ✓ 5. AdminVerifikasiPage: prevents double submit during approve or reject
     ✓ 6. AdminVerifikasiPage: handles backend error when approving or rejecting
     ✓ 7. AdminAbuseReportPage: loads and displays fraud cases from backend
     ✓ 8. AdminAbuseReportPage: filters fraud cases by risk level (HIGH, MEDIUM, LOW)
     ✓ 9. AdminAbuseReportPage: filters fraud cases by review status
     ✓ 10. AdminAbuseReportPage: safely displays masked candidate information and evidence without leaking raw data
     ✓ 11. AdminAbuseReportPage: submits review decision (VALID, FALSE_POSITIVE, etc.) with reason
     ✓ 12. AdminAbuseReportPage: prevents decision submit when reason is empty
     ✓ 13. AdminAppealsPage: loads and displays candidate appeals from backend
     ✓ 14. AdminAppealsPage: submits appeal decision (APPROVED, REJECTED, NEED_INFO) with reason
     ✓ 15. AdminAppealsPage: prevents appeal decision submit when reason is empty
     ✓ 16. AdminDashboardPage: displays real pending verification and case counts from backend
     ✓ 17. Admin authorization: non-admin (candidate) cannot access admin verification page
     ✓ 18. Admin authorization: non-admin (recruiter) cannot access admin verification page

 Test Files  1 passed (1)
      Tests  18 passed (18)
```

### B. Keseluruhan Frontend Vitest Test Suites
Seluruh 7 berkas pengujian frontend (Sprint 1, 2A, 2B, 2C, 2D) berhasil dijalankan secara serempak tanpa kegagalan:

```
 Test Files  7 passed (7)
      Tests  112 passed (112)
   - tests/jobsMatchingApplications.test.ts (21 tests) PASS
   - tests/raviraApi.test.ts (24 tests) PASS
   - tests/api.test.ts (7 tests) PASS
   - tests/candidateProfile.test.ts (13 tests) PASS
   - tests/recruiterPipeline.test.ts (18 tests) PASS
   - tests/AppContext.test.tsx (11 tests) PASS
   - tests/adminOperations.test.tsx (18 tests) PASS
```

### C. Backend Test Suite (`tests/backend/*.test.cjs`)
Seluruh 68 backend integration & authorization tests tetap **100% LULUS (PASS)**:

```
ℹ tests 68
ℹ suites 0
ℹ pass 68
ℹ fail 0
ℹ duration_ms 9542.9259
```

---

## 9. Hasil Verifikasi Build & Linting

1. **Frontend TypeScript & Vite Build:**
   - Perintah: `npm.cmd --prefix frontend run build`
   - Hasil: **PASS** (Exit code 0, 0 TypeScript errors).
2. **Frontend ESLint Check:**
   - Perintah: `npm.cmd --prefix frontend run lint`
   - Hasil: **PASS** (Exit code 0, 0 errors, 0 warnings).
3. **Backend TypeScript Build:**
   - Perintah: `npm.cmd run build`
   - Hasil: **PASS** (Exit code 0, 0 errors).

---

## 10. Batasan & Ruang Lingkup Selanjutnya

- **Sprint 2D Selesai:** Seluruh pekerjaan Admin Verification, Fraud Review, dan Appeals telah tuntas.
- **Sprint 2E (Mendatang):** Modul Government / Public Analytics dan pelaporan agregat ketenagakerjaan. Sesuai instruksi batas pengerjaan, modul ini belum disentuh dan akan dikerjakan pada tahap berikutnya setelah konfirmasi pengguna.
- **Status Git:** Tidak ada commit atau push otomatis yang dilakukan. Seluruh perubahan tersimpan rapi pada working tree lokal branch `sprint-2/frontend-api-integration`.
