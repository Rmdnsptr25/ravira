# Laporan Audit Final Sprint 1: Authentication & Role Security

**Project:** RAVIRA â€” AI Recruitment Ecosystem
**Tahap:** Sprint 1 â€” Authentication & Role Security
**Branch:** `sprint-1/auth-security`
**Tanggal Audit:** 28 Oktober 2026
**Status Audit:** **PASS** (Semua kriteria terpenuhi, siap untuk review dan commit)

---

## 1. Ringkasan Implementasi

Sprint 1 berfokus pada implementasi arsitektur keamanan autentikasi dan otorisasi berbasis peran (Role-Based Access Control / RBAC) yang ketat pada backend dan frontend RAVIRA, sesuai panduan tata kelola data PRD dan `AGENTS.md`.

Pekerjaan mencakup:
1. **Otorisasi Multi-Tenant & Verifikasi Recruiter (Backend)**:
   - Isolasi data pelamar dan lowongan kerja berbasis kepemilikan perusahaan (`companyId`).
   - Penegakan prasyarat status verifikasi perusahaan: Recruiter dari perusahaan berstatus `PENDING`, `REJECTED`, atau `SUSPENDED` secara ketat diblokir dari membaca data kandidat, mengakses skor kandidat, melihat riwayat tahapan seleksi, maupun memperbarui stage lamaran.
   - Pemisahan akses metrik evaluasi: *Candidate Score* (internal evaluasi recruiter/admin) sepenuhnya diblokir untuk role `CANDIDATE`, sedangkan *AI Match Score* kandidat tetap dapat diakses secara mandiri beserta penjelasan transparansinya.
2. **Proteksi Sesi & Navigasi Terlindungi (Frontend)**:
   - Rute terproteksi (`ProtectedRoute`) yang memvalidasi ketersediaan sesi token dan mencocokkan peran pengguna dengan hierarki izin dashboard (`/dashboard/kandidat`, `/dashboard/perusahaan`, `/dashboard/admin`).
   - Penanganan rute Pemerintah (`/dashboard/analytics/*`): Karena modul analitik instansi publik belum diimplementasikan pada MVP Sprint 1, rute dialihkan secara aman ke `/masuk/pemerintah` yang menonaktifkan form guna mencegah adanya sesi palsu (*mock session bypass*).
   - Penanganan otomatis token kedaluwarsa (*expiry timer* dan *window focus check*) serta penanganan respons `401 Unauthorized` yang langsung membersihkan state privat dan `localStorage`.
   - Banner notifikasi verifikasi perusahaan (`CompanyVerificationNotice`) yang membatasi recruiter belum terverifikasi hanya pada halaman status.
3. **Penyelarasan Dependensi UI & Standar Kualitas Kode**:
   - Kompatibilitas `react-day-picker` v10, `recharts` v3, dan `react-resizable-panels` v4.
   - Penambahan `activeKey` pada `DashboardLayoutProps`.
   - Pembersihan rute lama (`AppRouter.tsx`) dan penyesuaian ESLint / TypeScript strict mode dengan 0 error.

---

## 2. Daftar File yang Berubah

### A. File Baru (Untracked)
- [`src/modules/recruiters/recruiterAccess.service.ts`](file:///D:/ProjectRavira/ravira/src/modules/recruiters/recruiterAccess.service.ts): Service utilitas validasi status approval perusahaan recruiter.
- [`frontend/src/components/ProtectedRoute.tsx`](file:///D:/ProjectRavira/ravira/frontend/src/components/ProtectedRoute.tsx): Route guard berbasis peran dan status verifikasi.
- [`frontend/src/components/CompanyVerificationNotice.tsx`](file:///D:/ProjectRavira/ravira/frontend/src/components/CompanyVerificationNotice.tsx): Banner status peninjauan akun recruiter.
- [`frontend/src/pages/LoginAdminPage.tsx`](file:///D:/ProjectRavira/ravira/frontend/src/pages/LoginAdminPage.tsx): Entry point login khusus internal admin.
- [`frontend/vitest.config.ts`](file:///D:/ProjectRavira/ravira/frontend/vitest.config.ts): Konfigurasi test runner frontend Vitest (jsdom).
- [`frontend/tsconfig.test.json`](file:///D:/ProjectRavira/ravira/frontend/tsconfig.test.json): Konfigurasi kompilasi pengujian frontend.
- [`frontend/tests/`](file:///D:/ProjectRavira/ravira/frontend/tests/): Suite pengujian frontend (`api.test.ts`, `AppContext.test.tsx`, `raviraApi.test.ts`, `fixtures.ts`, `http.ts`, `setup.ts`).
- [`tests/backend/`](file:///D:/ProjectRavira/ravira/tests/backend/): Suite pengujian backend native Node.js (`auth-authorization.test.cjs`, `recruiter-authorization.test.cjs`, dan support fixtures).

### B. File yang Dimodifikasi
- **Backend**:
  - [`src/modules/applications/applications.service.ts`](file:///D:/ProjectRavira/ravira/src/modules/applications/applications.service.ts): Penegakan isolasi query `companyId` dan validasi approved recruiter pada aplikasi dan history.
  - [`src/modules/recruiters/recruiterJobs.service.ts`](file:///D:/ProjectRavira/ravira/src/modules/recruiters/recruiterJobs.service.ts): Pemeriksaan approval sebelum pembuatan lowongan dan pembacaan pelamar.
  - [`src/modules/scoring/scoring.service.ts`](file:///D:/ProjectRavira/ravira/src/modules/scoring/scoring.service.ts): Pencegahan akses candidate score oleh kandidat dan recruiter unapproved.
- **Frontend Services & State**:
  - [`frontend/src/contexts/AppContext.tsx`](file:///D:/ProjectRavira/ravira/frontend/src/contexts/AppContext.tsx): Manajemen sesi, timer kedaluwarsa JWT, isolasi token multi-tab, dan pembersihan state privat saat logout/401.
  - [`frontend/src/services/api.ts`](file:///D:/ProjectRavira/ravira/frontend/src/services/api.ts): Event dispatch `SESSION_INVALIDATED` pada 401 dan injeksi header Authorization.
  - [`frontend/src/services/raviraApi.ts`](file:///D:/ProjectRavira/ravira/frontend/src/services/raviraApi.ts): Validasi kesesuaian role yang diharapkan saat login portal.
  - [`frontend/src/routes.ts`](file:///D:/ProjectRavira/ravira/frontend/src/routes.ts): Pembungkusan rute privat (`/admin`, `/dashboard/*`, `*/onboarding`) ke dalam `ProtectedRoute`.
- **Frontend Components & Pages**:
  - [`frontend/src/components/DashboardLayout.tsx`](file:///D:/ProjectRavira/ravira/frontend/src/components/DashboardLayout.tsx): Penambahan prop `activeKey?: string`, penanganan logout terarah ke portal login masing-masing role, dan render guard untuk recruiter unapproved.
  - [`frontend/src/components/ui/calendar.tsx`](file:///D:/ProjectRavira/ravira/frontend/src/components/ui/calendar.tsx): Kompatibilitas `react-day-picker` v10 (`month_caption`, `Chevron`, `button_previous`, `button_next`).
  - [`frontend/src/components/ui/chart.tsx`](file:///D:/ProjectRavira/ravira/frontend/src/components/ui/chart.tsx): Standarisasi tipe data payload Recharts v3 tanpa penggunaan `any`.
  - [`frontend/src/components/ui/resizable.tsx`](file:///D:/ProjectRavira/ravira/frontend/src/components/ui/resizable.tsx): Pemetaan ke `Group` dan `Separator` (`react-resizable-panels` v4).
  - [`frontend/src/components/ui/sidebar.tsx`](file:///D:/ProjectRavira/ravira/frontend/src/components/ui/sidebar.tsx): Type-only import `VariantProps` dan perbaikan fungsi pure skeleton width.
  - [`frontend/src/components/ui/sonner.tsx`](file:///D:/ProjectRavira/ravira/frontend/src/components/ui/sonner.tsx): Type-only import `ToasterProps`.
  - [`frontend/src/components/ui/use-mobile.ts`](file:///D:/ProjectRavira/ravira/frontend/src/components/ui/use-mobile.ts): Migrasi ke `useSyncExternalStore` menghindari cascading render.
  - [`frontend/src/components/ui/carousel.tsx`](file:///D:/ProjectRavira/ravira/frontend/src/components/ui/carousel.tsx): Penjadwalan callback `onSelect` via microtask.
  - [`frontend/src/router/AppRouter.tsx`](file:///D:/ProjectRavira/ravira/frontend/src/router/AppRouter.tsx): Koreksi resolusi modul halaman.
  - [`frontend/eslint.config.js`](file:///D:/ProjectRavira/ravira/frontend/eslint.config.js): Konfigurasi linting file `src/` dan pengecualian direktori non-kode/dokumentasi.
  - Halaman login & registrasi role terpisah (`LoginKandidatPage.tsx`, `LoginPerusahaanPage.tsx`, `LoginPemerintahPage.tsx`, `RegisterCompanyPage.tsx`, `RegisterGovernmentPage.tsx`, `VerificationPendingPage.tsx`).
  - Pembersihan unused imports/variables pada 15 file halaman dashboard untuk mematuhi strict mode TypeScript.

---

## 3. Hasil Pengujian Beserta Bukti

### A. Backend Test Suite (Node.js Test Runner)
- **Perintah**: `node --test tests/backend/*.test.cjs`
- **Hasil**: **68 PASS, 0 FAIL** (Durasi: ~2.8s)
- **Rincian**:
  - `auth-authorization.test.cjs`: 29 test lulus.
    - Menolak token kosong, malformed, atau expired.
    - Menolak user non-aktif (`isActive: false`).
    - Menolak akses kandidat ke rute khusus recruiter atau admin.
    - Menjamin kandidat hanya dapat membaca lamarannya sendiri.
    - Menolak akses kandidat ke *Candidate Score* internal.
    - Menjamin *AI Match Score* beserta rekomendasi transparan tetap dapat diakses kandidat.
    - Mencegah manipulasi role dan ownership pada payload registrasi.
  - `recruiter-authorization.test.cjs`: 39 test lulus.
    - Memblokir recruiter berstatus `PENDING`, `REJECTED`, dan `SUSPENDED` dari endpoint pelamar, skor kandidat, detail lamaran, riwayat status, dan pengubahan stage.
    - Mengizinkan pembacaan hanya untuk recruiter `APPROVED` dan hanya untuk lowongan yang dimiliki perusahaannya sendiri.
    - Mencegah *cross-tenant data leakage* saat recruiter mencoba mengakses `jobId` milik perusahaan lain.
    - Memastikan audit log dan notifikasi tercipta saat pengubahan status lamaran.

### B. Frontend Test Suite (Vitest + Testing Library)
- **Perintah**: `node frontend/node_modules/vitest/vitest.mjs run --root frontend`
- **Hasil**: **42 PASS, 0 FAIL** (Durasi: ~4.6s)
- **Rincian**:
  - `tests/api.test.ts` (7 tests): Pembersihan token dan dispatch event invalidasi pada HTTP 401; retensi token pada HTTP 403, 500, dan offline.
  - `tests/raviraApi.test.ts` (24 tests): Penolakan login jika server mengembalikan role yang tidak sesuai dengan portal login yang dimasuki (misal akun Recruiter ditolak di portal Kandidat); penolakan user non-aktif; pembatalan penyimpanan token jika request dibatalkan (*aborted*).
  - `tests/AppContext.test.tsx` (11 tests): Siklus sesi aplikasi, restorasi sesi tersimpan, isolasi multi-tab, dan pembersihan state privat saat logout.

### C. Kompilasi & Linting (Strict Mode)
- **Backend Build**: `npm run build` (`tsc`) $\to$ **PASS** (Exit code 0).
- **Frontend Build**: `npm --prefix frontend run build` (`tsc -b && vite build`) $\to$ **PASS** (Exit code 0, bundle production sebesar 1,426 kB berhasil di-generate).
- **Frontend Lint**: `npm --prefix frontend run lint` (`eslint .`) $\to$ **PASS** (Exit code 0, 0 error, 0 warning).

### D. Smoke Test Browser Riil (Playwright Headless Edge)
- **Metode**: Pengujian interaksi browser otomatis secara *end-to-end* menggunakan Microsoft Edge headless pada server aktif `http://localhost:5173` yang terhubung langsung ke backend port `4000`.
- **Hasil**: **16 PASS, 0 FAIL**
- **Log Eksekusi Nyata**:
```
[PASS] Unauthenticated /dashboard/kandidat redirects to login: http://localhost:5173/masuk/kandidat
[PASS] Unauthenticated /dashboard/perusahaan redirects to login: http://localhost:5173/masuk/perusahaan
[PASS] Unauthenticated /dashboard/admin redirects to login: http://localhost:5173/masuk/admin
[PASS] Unauthenticated /dashboard/analytics redirects to login: http://localhost:5173/masuk/pemerintah
[PASS] Candidate Login and token persistence: url=http://localhost:5173/dashboard/kandidat, has_token=True
[PASS] Candidate blocked from /dashboard/perusahaan: http://localhost:5173/dashboard/kandidat
[PASS] Candidate blocked from /dashboard/admin: http://localhost:5173/dashboard/kandidat
[PASS] Candidate blocked from /dashboard/analytics: http://localhost:5173/masuk/pemerintah
[PASS] Candidate Logout clears token and redirects: token=None
[PASS] Candidate rejected at Recruiter login portal: url=http://localhost:5173/masuk/perusahaan
[PASS] Recruiter Login and token persistence: url=http://localhost:5173/dashboard/perusahaan
[PASS] Recruiter blocked from /dashboard/kandidat: http://localhost:5173/dashboard/perusahaan
[PASS] Recruiter Logout clears session: http://localhost:5173/masuk/perusahaan
[PASS] Admin Login and token persistence: url=http://localhost:5173/admin
[PASS] Admin blocked from /dashboard/kandidat: http://localhost:5173/dashboard/admin
[PASS] Admin Logout clears session: http://localhost:5173/masuk/admin

All 16 browser smoke tests PASSED!
```

---

## 4. Temuan Keamanan & Analisis Risiko

### A. Verifikasi Acceptance Criteria

| Kriteria Penerimaan (Acceptance Criteria) | Status | Bukti / Mekanisme Verifikasi |
| :--- | :---: | :--- |
| **AC-01**: Autentikasi terpisah untuk Kandidat, Recruiter, dan Admin | **PASS** | Validasi portal login di `raviraApi.ts` menolak role yang tidak cocok sebelum menyimpan token. Diverifikasi via unit test dan smoke test browser. |
| **AC-02**: Pencegahan akses silang antar role (Cross-Role Dashboard Block) | **PASS** | `ProtectedRoute.tsx` mendeteksi rute dan mencocokkan `user.role`. Akses tidak sah dialihkan seketika ke home dashboard masing-masing. |
| **AC-03**: Logout menghapus seluruh sesi dan token privat | **PASS** | `logout()` di `AppContext.tsx` menghapus `ravira.auth.token`, mengosongkan state lamaran, membatalkan request in-flight, dan memicu event sinkronisasi multi-tab. |
| **AC-04**: Penanganan token kedaluwarsa & respons 401 | **PASS** | Timer berbasis decoding JWT `exp` melakukan logout otomatis saat kedaluwarsa; interseptor `api.ts` menangani 401 dengan menghapus token dan mereset sesi. |
| **AC-05**: Recruiter `PENDING` diblokir dari data sensitif kandidat | **PASS** | `requireApprovedRecruiter` di backend melempar error HTTP 403. Frontend menampilkan `CompanyVerificationNotice` dan membatasi akses sub-rute. |
| **AC-06**: Recruiter `APPROVED` hanya dapat mengakses data perusahaannya sendiri | **PASS** | Service backend memfilter seluruh query lamaran dan lowongan dengan klausul kepemilikan `where.job = { companyId }`. |
| **AC-07**: Kandidat diblokir dari Candidate Score, AI Match Score tetap ada | **PASS** | Endpoint `/applications/:id/score` menolak role `CANDIDATE` dengan 403; endpoint `/scoring/jobs/:jobId/match-score` tetap terbuka untuk kandidat. |
| **AC-08**: Halaman Pemerintah tidak membuka sesi palsu | **PASS** | Rute `/dashboard/analytics/*` dialihkan oleh `ProtectedRoute` ke `/masuk/pemerintah`. Form dinonaktifkan dengan status eksplisit belum tersedia. |
| **AC-09**: Kompatibilitas komponen UI tanpa regresi visual | **PASS** | Komponen shadcn UI (`calendar`, `chart`, `resizable`, `sidebar`) telah disesuaikan dengan API library versi terbaru tanpa mengubah stylesheet atau desain. |
| **AC-10**: Strict mode TypeScript & ESLint dipertahankan | **PASS** | `noUnusedLocals`, `verbatimModuleSyntax`, dan lint rules lulus tanpa error (`0 errors, 0 warnings`). |

### B. Temuan Keamanan & Perbedaan Masalah Lama vs Regresi Sprint 1

1. **Bukan Regresi (Masalah Lama / Mock Data Prototype)**:
   - Beberapa halaman internal dashboard (misal `CandidateProfilePage`, `PipelinePage`, `ActiveJobsPage`, `AdminVerifikasiPage`) masih memiliki array mock data statis yang ditulis saat fase desain antarmuka awal. Data ini tidak terhubung ke API backend karena endpoint manajemen pelamar dan pipeline dijadwalkan pada Sprint 2.
   - Karena rute dashboard kini berada di balik `ProtectedRoute`, data prototype tersebut tidak dapat dilihat oleh publik atau role yang tidak berhak.
2. **CORS Origin Port**:
   - Konfigurasi default `.env` backend memiliki `CORS_ORIGIN: http://localhost:5173`. Saat frontend dijalankan pada port preview alternatif (seperti port 4173), request diblokir oleh CORS policy. Frontend dev server standar pada port 5173 berjalan dengan lancar.

---

## 5. Pemeriksaan File Sensitif & Artefak Sementara

Hasil pemeriksaan working directory menunjukkan beberapa artefak pengujian dan lokal yang **tidak boleh di-stage / di-commit**:
- `frontend-lint-sprint1.log`: Log residu linting sebelumnya.
- `.claude/`: Konfigurasi tool local Claude.
- `.qa/`: Folder artefak pengujian lokal.
- `.env`: File konfigurasi kredensial lokal (sudah terdaftar di `.gitignore`).

> [!IMPORTANT]
> **Rekomendasi Sebelum Commit**:
> Tambahkan file log dan direktori pengujian lokal ke `.gitignore` atau pastikan staging hanya menambahkan file kode sumber project:
> ```gitignore
> frontend-lint-sprint1.log
> .qa/
> .claude/
> ```

---

## 6. Kesimpulan Kesiapan Commit & Rekomendasi Tindak Lanjut

### Kesimpulan
Sprint 1 â€” Authentication & Role Security telah mencapai target secara tuntas:
- **Backend Build & Test**: PASS (68/68 test)
- **Frontend Build & Test**: PASS (42/42 test + 16/16 browser smoke test)
- **Frontend Lint**: PASS (0 errors, 0 warnings)
- **UI & Layout Integrity**: Terpelihara 100% tanpa regresi desain.

### Rekomendasi Langkah Selanjutnya
1. Lakukan `git add` secara selektif untuk file kode sumber, tes, dan konfigurasi yang relevan (hindari memasukkan file `.log` atau direktori tool internal).
2. Lakukan commit pada branch `sprint-1/auth-security` dengan pesan commit deskriptif (misal: `feat(auth): complete sprint 1 authentication, RBAC, and dependency alignment`).
3. Buat Pull Request ke branch `main` untuk direview tim.
4. Lanjutkan ke cakupan Sprint 2 (Job Management & Pipeline Lifecycle) sesuai rencana pengembangan PRD.
