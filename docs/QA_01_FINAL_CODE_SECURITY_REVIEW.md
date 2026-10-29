# QA-01 FINAL CODE & SECURITY REVIEW — PROYEK RAVIRA
**Tanggal:** 29 Oktober 2026
**Workspace:** `D:\ProjectRavira\ravira`
**Branch:** `sprint-2/frontend-api-integration`
**Pull Request:** #2
**Base Branch:** `main`
**Auditor / Reviewer:** Senior Full-Stack Engineer, Security Auditor & QA Architect
**Lingkup Review:** Perubahan Sprint 2A–2E (`main..HEAD`)

---

## DAFTAR ISI
1. [Ringkasan Eksekutif & Keputusan Akhir](#1-ringkasan-eksekutif--keputusan-akhir)
2. [Matriks Klasifikasi Temuan](#2-matriks-klasifikasi-temuan)
3. [Rincian Temuan & Solusi Rekomendasi](#3-rincian-temuan--solusi-rekomendasi)
   - [Temuan 1 (HIGH) — TypeScript Compile Error TS2552 Memblokir Production Build](#temuan-1-high--typescript-compile-error-ts2552-memblokir-production-build)
   - [Temuan 2 (HIGH) — Risiko Replay Migration & Ketergantungan Ekstensi pada Fresh PostgreSQL](#temuan-2-high--risiko-replay-migration--ketergantungan-ekstensi-pada-fresh-postgresql)
   - [Temuan 3 (MEDIUM) — Data Mock & Aksi Lokal Masih Aktif di Halaman Sekunder Recruiter](#temuan-3-medium--data-mock--aksi-lokal-masih-aktif-di-halaman-sekunder-recruiter)
   - [Temuan 4 (MEDIUM) — Widget Overview pada Dashboard Kandidat Masih Berisi Data Statis](#temuan-4-medium--widget-overview-pada-dashboard-kandidat-masih-berisi-data-statis)
   - [Temuan 5 (LOW) — Celah Cakupan Automated Test & Transpilasi VM Loader](#temuan-5-low--celah-cakupan-automated-test--transpilasi-vm-loader)
   - [Temuan 6 (LOW) — Migrasi Sprint 2E Berstatus Unapplied di Supabase Production](#temuan-6-low--migrasi-sprint-2e-berstatus-unapplied-di-supabase-production)
4. [Evaluasi 8 Aspek Utama Review](#4-evaluasi-8-aspek-utama-review)
   - [4.1 Keamanan Autentikasi, JWT, RBAC, dan Ownership](#41-keamanan-autentikasi-jwt-rbac-dan-ownership)
   - [4.2 Akses API Candidate, Recruiter, dan Admin](#42-akses-api-candidate-recruiter-dan-admin)
   - [4.3 Potensi Kebocoran Data CandidateScore & Informasi Sensitif](#43-potensi-kebocoran-data-candidatescore--informasi-sensitif)
   - [4.4 Validasi Input dan Error Handling](#44-validasi-input-dan-error-handling)
   - [4.5 Integrasi Frontend-Backend & Potensi Bug Runtime](#45-integrasi-frontend-backend--potensi-bug-runtime)
   - [4.6 Konsistensi Prisma Schema & Perubahan Migrasi](#46-konsistensi-prisma-schema--perubahan-migrasi)
   - [4.7 Penggunaan Data Mock pada Fitur Utama](#47-penggunaan-data-mock-pada-fitur-utama)
   - [4.8 Risiko Regresi yang Belum Tercakup Automated Tests](#48-risiko-regresi-yang-belum-tercakup-automated-tests)
5. [Evaluasi Khusus Database & Supabase Production](#5-evaluasi-khusus-database--supabase-production)
6. [Keputusan Akhir (Decision)](#6-keputusan-akhir-decision)

---

## 1. Ringkasan Eksekutif & Keputusan Akhir

Audit QA-01 ini mengevaluasi seluruh rangkaian implementasi Sprint 2A hingga Sprint 2E yang menghubungkan antarmuka frontend RAVIRA (React + Vite + TypeScript) dengan backend (Node.js + Express + Prisma ORM + PostgreSQL) pada branch `sprint-2/frontend-api-integration` terhadap branch `main`.

### Status Kualitas Saat Ini:
- **Frontend Build (`npm --prefix frontend run build`):** PASS (0 errors).
- **Frontend Lint (`npm --prefix frontend run lint`):** PASS (0 errors, 0 warnings).
- **Frontend Vitest (`vitest run --root frontend`):** PASS (122/122 tests passed).
- **Backend Test Runner (`node --test tests/backend/*.test.cjs`):** PASS (73/73 tests passed).
- **Backend TypeScript Build (`npm run build`):** **FAIL (TS2552)** pada `src/modules/recruiters/recruiterCompany.validation.ts:12`.
- **Git Diff Syntax & Whitespace (`git diff --check`):** PASS (Clean, no conflict markers).

### Keputusan:
**BLOCKED FOR MERGE**

> [!WARNING]
> Penggabungan PR #2 ke `main` ditangguhkan sementara hingga **Temuan 1 (TS2552 compile error)** diperbaiki. Kesalahan pengetikan identifier `optionalTex` pada `recruiterCompany.validation.ts` menggagalkan kompilasi TypeScript produksi (`tsc`). Setelah 1 karakter 't' ditambahkan (`optionalText`), status dapat segera ditingkatkan menjadi **PASS WITH NOTES**.

---

## 2. Matriks Klasifikasi Temuan

| ID | Kategori | Tingkat Keparahan | Komponen Terkait | Status |
| :---: | :--- | :---: | :--- | :---: |
| **SEC-01** | Kompilasi TypeScript / Production Build | **HIGH** | `src/modules/recruiters/recruiterCompany.validation.ts` | **Blocking** |
| **SEC-02** | Database Migration Replay & Extensions | **HIGH** | `prisma/migrations/20261029000000_*` & `20260615110000_*` | Non-blocking |
| **SEC-03** | Data Mock & Aksi Lokal Recruiter | **MEDIUM** | `ShortlistPage`, `ATSIntegrationPage`, `CompanySettingsPage`, `RecruitmentAnalyticsPage` | Non-blocking |
| **SEC-04** | Data Statis pada Overview Dashboard Kandidat | **MEDIUM** | `frontend/src/pages/DashboardCandidatePage.tsx` | Non-blocking |
| **SEC-05** | Gap Cakupan Tes & Blindspot VM Loader | **LOW** | `tests/backend/` & `tests/backend/support/isolated-backend.cjs` | Non-blocking |
| **SEC-06** | Status Migrasi Database Production | **LOW** | Database Supabase `public._prisma_migrations` | Non-blocking |

---

## 3. Rincian Temuan & Solusi Rekomendasi

### Temuan 1 (HIGH) — TypeScript Compile Error TS2552 Memblokir Production Build
- **File:** [src/modules/recruiters/recruiterCompany.validation.ts](file:///d:/ProjectRavira/ravira/src/modules/recruiters/recruiterCompany.validation.ts#L10-L15)
- **Baris Kode:** Baris 12
  ```typescript
  export const updateRecruiterCompanySchema = z
    .object({
      name: optionalText,
      industry: optionalText,
      size: optionalText,
      location: optionalText,
      website: optionalText,
      description: optionalTex // <-- Typo: kurang huruf 't'
    })
  ```
- **Dampak:** Perintah kompilasi TypeScript produksi backend (`npm run build` / `tsc`) gagal total dengan error:
  `src/modules/recruiters/recruiterCompany.validation.ts(12,18): error TS2552: Cannot find name 'optionalTex'. Did you mean 'optionalText'?`
  Akibatnya, build pipeline CI/CD dan artefak produksi `dist/` tidak dapat dibuat.
- **Mengapa tidak terdeteksi test suite backend:** Runner `tests/backend/*.test.cjs` memuat modul backend melalui `isolated-backend.cjs` yang memanfaatkan `ts.transpileModule` tanpa semantic type checking, sehingga mengabaikan error resolusi tipe identifier.
- **Solusi yang Direkomendasikan:** Ubah baris 12 menjadi `description: optionalText`.

---

### Temuan 2 (HIGH) — Risiko Replay Migration & Ketergantungan Ekstensi pada Fresh PostgreSQL
- **File:**
  - [prisma/migrations/20260615110000_backend_demo_hardening/migration.sql](file:///d:/ProjectRavira/ravira/prisma/migrations/20260615110000_backend_demo_hardening/migration.sql#L25-L35) (Baris 27, 39, 168)
  - [prisma/migrations/20261029000000_sprint2e_saved_jobs_company_profile/migration.sql](file:///d:/ProjectRavira/ravira/prisma/migrations/20261029000000_sprint2e_saved_jobs_company_profile/migration.sql#L5-L14) (Baris 7)
- **Kode:**
  ```sql
  "id" UUID NOT NULL DEFAULT gen_random_uuid(),
  ```
- **Dampak:**
  1. Pada database PostgreSQL vanilla versi <= 12 atau image Docker minimal yang belum memiliki ekstensi UUID aktif secara global, fungsi `gen_random_uuid()` tidak tersedia secara default. Menjalankan `prisma migrate deploy` dari awal pada database kosong akan gagal dengan pesan `function gen_random_uuid() does not exist`.
  2. Migrasi Prisma tidak merekam Row-Level Security (`ENABLE ROW LEVEL SECURITY`) dan Check Constraints kustom yang terpasang di Supabase Production. Fresh database yang dibangun murni dari `prisma migrate deploy` akan kehilangan proteksi RLS dan check constraints tersebut.
  3. `prisma migrate diff` yang kosong hanya membuktikan status deklaratif saat ini cocok dengan live DB, bukan bukti bahwa riwayat 8 migrasi SQL dapat dieksekusi secara linear tanpa error pada database baru.
- **Solusi yang Direkomendasikan:**
  - Tambahkan statement `CREATE EXTENSION IF NOT EXISTS "pgcrypto";` secara idempotent pada inisialisasi database.
  - Sediakan file skrip terpisah (misal `prisma/rls_and_constraints.sql`) untuk mengaplikasikan RLS policy dan custom check constraints pada staging/fresh deployment.

---

### Temuan 3 (MEDIUM) — Data Mock & Aksi Lokal Masih Aktif di Halaman Sekunder Recruiter
- **File:**
  - [frontend/src/pages/ShortlistPage.tsx](file:///d:/ProjectRavira/ravira/frontend/src/pages/ShortlistPage.tsx#L20-L58) (Baris 21–28, 50–57)
  - [frontend/src/pages/ATSIntegrationPage.tsx](file:///d:/ProjectRavira/ravira/frontend/src/pages/ATSIntegrationPage.tsx#L20-L30) (Baris 19–25, 118–122)
  - [frontend/src/pages/CompanySettingsPage.tsx](file:///d:/ProjectRavira/ravira/frontend/src/pages/CompanySettingsPage.tsx#L70-L80) (Baris 74–78, 119–125)
  - [frontend/src/pages/RecruitmentAnalyticsPage.tsx](file:///d:/ProjectRavira/ravira/frontend/src/pages/RecruitmentAnalyticsPage.tsx#L18-L50) (Baris 19–47)
- **Dampak:**
  - `ShortlistPage.tsx` menampilkan daftar kandidat statis (`Aulia Rahman`, `Bayu Setiawan`, dll.) dan tombol "Jadwalkan Interview" hanya memunculkan `toast.success` lokal tanpa memanggil API backend.
  - `ATSIntegrationPage.tsx` menampilkan daftar ATS statis (`Greenhouse`, `Workday`, `Lever`) dengan status integrasi hardcoded.
  - `CompanySettingsPage.tsx` hanya menyimpan toggle notifikasi pada local state React.
  - `RecruitmentAnalyticsPage.tsx` menyajikan grafik metrik funnel dan KPI menggunakan data mock statis.
- **Solusi yang Direkomendasikan:** Berikan penanda visual "Fitur Pratinjau / Segera Hadir" pada halaman-halaman tersebut atau jadwalkan integrasi endpoint shortlist dan pengaturan perusahaan ke dalam roadmap Sprint 3.

---

### Temuan 4 (MEDIUM) — Widget Overview pada Dashboard Kandidat Masih Berisi Data Statis
- **File:** [frontend/src/pages/DashboardCandidatePage.tsx](file:///d:/ProjectRavira/ravira/frontend/src/pages/DashboardCandidatePage.tsx#L20-L42) (Baris 20–40)
- **Dampak:** Halaman detail rekomendasi (`/dashboard/kandidat/rekomendasi`), skill gap (`/dashboard/kandidat/skill-gap`), dan pelatihan (`/dashboard/kandidat/pelatihan`) telah 100% terhubung ke API backend. Namun, halaman ringkasan beranda (`/dashboard/kandidat`) masih merender array statis `topRecommendations`, `skillGaps`, `trainings`, dan `crossRegion`.
- **Solusi yang Direkomendasikan:** Pada Sprint 3, hubungkan widget ringkasan beranda kandidat dengan endpoint agregat atau panggil `getMyJobRecommendations()` dan `getMySkillGap()` secara asinkron dengan fallback skeleton loader.

---

### Temuan 5 (LOW) — Celah Cakupan Automated Test & Transpilasi VM Loader
- **File:** `tests/backend/support/isolated-backend.cjs` (Baris 5) dan folder `tests/backend/`
- **Dampak:**
  - Modul backend baru Sprint 2E (`candidateSavedJobs`) dan endpoint admin keputusan fraud/banding belum memiliki automated test khusus di `tests/backend/`.
  - Runner backend test menggunakan transpilasi cepat tanpa pengecekan tipe, sehingga tidak bertindak sebagai type-checker pengganti `tsc`.
- **Solusi yang Direkomendasikan:**
  - Tambahkan perintah `tsc --noEmit` sebagai prasyarat wajib pada skrip `npm test`.
  - Lengkapi integration test untuk `POST /candidates/me/saved-jobs` dan `DELETE /candidates/me/saved-jobs/:jobId`.

---

### Temuan 6 (LOW) — Migrasi Sprint 2E Berstatus Unapplied di Supabase Production
- **File:** `prisma/migrations/20261029000000_sprint2e_saved_jobs_company_profile/`
- **Dampak:** Pemeriksaan status migrasi terhadap Supabase Production menghasilkan:
  `Following migration have not yet been applied: 20261029000000_sprint2e_saved_jobs_company_profile`
  Fitur simpan lowongan kandidat dan kolom deskripsi/ukuran perusahaan belum dapat beroperasi secara nyata pada database produksi sebelum migrasi dideploy.
- **Solusi yang Direkomendasikan:** Jalankan `prisma migrate deploy` di lingkungan produksi setelah PR di-merge dan pipeline rilis disetujui.

---

## 4. Evaluasi 8 Aspek Utama Review

### 4.1 Keamanan Autentikasi, JWT, RBAC, dan Ownership
- Autentikasi berbasis JSON Web Token (JWT) divalidasi secara konsisten melalui `authMiddleware`.
- Akses route terlindungi ketat menggunakan `roleMiddleware` (`Role.CANDIDATE`, `Role.RECRUITER`, `Role.ADMIN`, `Role.SUPER_ADMIN`).
- **Ownership Verification:**
  - Kandidat hanya dapat mengakses data miliknya sendiri melalui helper `getCandidateIdByUserId(req.user.id)` pada route `/candidates/me/*`.
  - Recruiter diisolasi ke perusahaannya sendiri (`companyId`) dan dicek kepemilikan lowongannya pada query database (`where: { jobId, job: { companyId: recruiter.companyId } }`).
  - Recruiter dengan status `PENDING` atau `REJECTED` secara ketat diblokir dari data sensitif pelamar melalui fungsi `requireApprovedRecruiter()`, yang melemparkan error 403 Forbidden.

### 4.2 Akses API Candidate, Recruiter, dan Admin
- Seluruh modul API dipisahkan berdasarkan domain:
  - `/api/v1/candidates/*`
  - `/api/v1/recruiter/*`
  - `/api/v1/admin/*`
- Kandidat yang mencoba mengakses endpoint recruiter atau admin akan ditolak (403 Forbidden).
- Admin routes di `src/modules/admin/admin.routes.ts` menerapkan validasi berlapis (`authMiddleware` + `roleMiddleware(ADMIN, SUPER_ADMIN)`).

### 4.3 Potensi Kebocoran Data CandidateScore & Informasi Sensitif
- **Candidate Score:** Sesuai aturan PRD RAVIRA v1.3 dan AGENTS.md, `CandidateScore` hanya boleh diakses oleh Recruiter dan Admin.
  - Endpoint `GET /api/v1/applications/:applicationId/score` memiliki pengecekan eksplisit:
    ```typescript
    case Role.CANDIDATE:
      throw new AppError("Candidates cannot access Candidate Score.", 403);
    ```
  - Kandidat hanya diberikan akses ke `matchScore` (AI Match Score) pada rekomendasi lowongan miliknya sendiri.
- **Informasi Sensitif Kandidat:** Kolom internal anti-fraud seperti `idNumberHash`, `fraudFlags`, `manualReviewReason`, `reviewedBy`, dan status scan virus tidak diekspos pada response format profil publik/kandidat.

### 4.4 Validasi Input dan Error Handling
- Validasi skema input menggunakan pustaka Zod (`validateBody`, `validateParams`, `validateQuery`) terpasang pada seluruh rute backend.
- Param UUID divalidasi menggunakan format UUID v4 (`z.string().uuid()`), mencegah injeksi string non-standar.
- Penanganan asynchronous error dibungkus rapi menggunakan `asyncHandler` dan diproses terpusat di `errorHandler`.
- *Catatan:* Ditemukan 1 kesalahan penamaan variabel `optionalTex` pada `recruiterCompany.validation.ts` (lihat Temuan 1).

### 4.5 Integrasi Frontend-Backend & Potensi Bug Runtime
- Modul integrasi utama pada Sprint 2A–2E berfungsi secara nyata:
  - `CandidateSelfProfilePage.tsx`: Integrasi profil kandidat, pengalaman, pendidikan, dan skills.
  - `JobRecommendationsPage.tsx` & `JobDetailPage.tsx`: Rekomendasi pekerjaan berbasis AI matching.
  - `SkillGapPage.tsx` & `TrainingPage.tsx`: Analisis kesenjangan keterampilan dan rekomendasi pelatihan.
  - `MyApplicationsPage.tsx` & `ApplicationDetailPage.tsx`: Pelacakan siklus hidup lamaran.
  - `ActiveJobsPage.tsx` & `PipelinePage.tsx`: Manajemen lowongan dan recruitment pipeline recruiter.
  - `AdminVerifikasiPage.tsx`, `AdminAbuseReportPage.tsx`, `AdminAppealsPage.tsx`: Verifikasi perusahaan, peninjauan fraud, dan banding.
  - `CompanyProfilePage.tsx` & `SavedJobsPage.tsx`: Profil perusahaan recruiter dan lowongan tersimpan kandidat.
- Semua asynchronous effect dibungkus mekanisme pembatalan (`active = false` atau `AbortController`) untuk mencegah memory leak atau update unmounted component.

### 4.6 Konsistensi Prisma Schema & Perubahan Migrasi
- Skema Prisma lokal [prisma/schema.prisma](file:///d:/ProjectRavira/ravira/prisma/schema.prisma) telah direkonsiliasi penuh dan sinkron secara bidirectional dengan Supabase PostgreSQL (`-- This is an empty migration.`).
- Riwayat migrasi lokal memiliki 8 folder migrasi berurutan yang valid.

### 4.7 Penggunaan Data Mock pada Fitur Utama
- Seluruh alur utama (Core Flow) rekrutmen, onboarding, lamaran, rekomendasi pekerjaan, mitigasi fraud, dan peninjauan admin telah bersih dari data mock.
- Sisa data mock hanya ditemukan pada halaman sekunder tambahan recruiter (`ShortlistPage`, `ATSIntegrationPage`, `RecruitmentAnalyticsPage`, `CompanySettingsPage`) dan preview card di beranda kandidat.

### 4.8 Risiko Regresi yang Belum Tercakup Automated Tests
- Alur `candidateSavedJobs` belum memiliki unit test di `tests/backend/`.
- Halaman sekunder recruiter belum memiliki visual regression test atau component test di Vitest.

---

## 5. Evaluasi Khusus Database & Supabase Production

1. **Kepatuhan Lingkungan Production:**
   - Database Supabase remote tidak dimodifikasi secara destruktif selama sesi audit.
   - Tidak ada eksekusi `prisma db push`, `prisma migrate reset`, atau modifikasi tabel `_prisma_migrations`.
2. **Keterbatasan Schema Diff:**
   - Hasil `prisma migrate diff` yang kosong (`-- This is an empty migration.`) mengonfirmasi bahwa skema Prisma lokal mencerminkan struktur database remote saat ini.
   - Namun, hal tersebut tidak membuktikan bahwa proses replay migrasi dari nol (`prisma migrate deploy`) dapat berjalan lancar pada instance PostgreSQL baru tanpa dependensi fungsi `gen_random_uuid()` atau ekstensi `pgcrypto`.
3. **Kesiapan Migrasi Sprint 2E:**
   - File migrasi `20261029000000_sprint2e_saved_jobs_company_profile/migration.sql` bersifat murni aditif (`ADD COLUMN IF NOT EXISTS "description"`, `ADD COLUMN IF NOT EXISTS "size"`, dan `CREATE TABLE IF NOT EXISTS "saved_jobs"`).
   - Migrasi ini aman untuk diaplikasikan ke Supabase Production tanpa risiko kehilangan data atau downtime.

---

## 6. Keputusan Akhir (Decision)

### Status: **BLOCKED FOR MERGE**

### Prasyarat Pembukaan Blokir (Unblocking Checklist):
1. [ ] Perbaiki kesalahan ketik pada `src/modules/recruiters/recruiterCompany.validation.ts` baris 12: ganti `optionalTex` menjadi `optionalText`.
2. [ ] Jalankan verifikasi build backend `npm run build` untuk memastikan kompilasi TypeScript menghasilkan kode exit 0.
3. [ ] Jalankan automated test suite backend (`node --test tests/backend/*.test.cjs`) dan frontend (`node frontend/node_modules/vitest/vitest.mjs run --root frontend`).

Setelah ketiga langkah prasyarat di atas dipenuhi, status Pull Request #2 dapat segera dinyatakan **PASS WITH NOTES** dan siap untuk di-merge ke branch `main`.


## QA-01 Retest — SEC-01 Resolution

Tanggal: 29 Oktober 2026

Temuan SEC-01 telah diperbaiki.

File:
src/modules/recruiters/recruiterCompany.validation.ts

Perbaikan:
- Mengganti optionalTex menjadi optionalText.
- Merapikan format validasi Zod.

Hasil verifikasi:
- Backend TypeScript Build: PASS
- Backend Automated Tests: PASS
- Git Whitespace Check: PASS

Commit perbaikan:
4ea2776 — fix: resolve recruiter company validation build error

Status SEC-01: RESOLVED

Catatan:
Temuan SEC-02 sampai SEC-06 tetap dipertahankan
sebagai catatan audit dan memerlukan tindak lanjut
sesuai tingkat risikonya.

Keputusan merge:
Tetap ditahan sampai pengujian browser end-to-end,
reproduksi migrasi PostgreSQL terisolasi, dan
pemeriksaan keamanan final selesai.

