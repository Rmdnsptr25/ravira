# LAPORAN HASIL IMPLEMENTASI SPRINT 2A
## CANDIDATE PROFILE, SKILLS & CV PARSING INTEGRATION

**Project:** RAVIRA — Platform Job Matching & Recruitment Ecosystem Berbasis AI  
**Branch:** `sprint-2/frontend-api-integration`  
**Tahap:** Sprint 2A — Candidate Profile, Skills & CV Parsing  
**Tanggal:** 28 Oktober 2026  
**Status Implementasi:** **COMPLETED — ALL TESTS PASS (100%)**

---

## 1. RINGKASAN IMPLEMENTASI

Pada Sprint 2A ini, seluruh fungsionalitas inti modul kandidat telah berhasil diintegrasikan secara penuh (*two-way real API integration*) antara frontend React dan backend Node.js/Express dengan database PostgreSQL melalui Prisma ORM.

Fitur-fitur yang telah berhasil diintegrasikan:
1. **Profil Kandidat Mandiri (`CandidateSelfProfilePage`):**
   - Mengambil data profil kandidat yang sedang login secara dinamis dari `GET /api/v1/candidates/me`.
   - Menggantikan seluruh data tiruan hardcoded (*Budi Santoso*) dengan data aktual pengguna yang terdaftar di database.
   - Mengirim pembaruan data profil (nama, telepon, domisili Pulau Jawa, ringkasan pengalaman, pendidikan, ekspektasi gaji, status relokasi, dan visibilitas profil) menggunakan `PATCH /api/v1/candidates/me`.
   - Menghitung persentase kelengkapan profil secara dinamis berdasarkan kelengkapan field di database.
2. **Manajemen Keterampilan (*Skills Management*):**
   - Menampilkan daftar keahlian nyata kandidat dari `GET /api/v1/candidates/me/skills`.
   - Menambahkan skill baru ke database melalui `POST /api/v1/candidates/me/skills`.
   - Menghapus skill berdasarkan ID unik yang valid melalui `DELETE /api/v1/candidates/me/skills/:skillId`.
   - Mencegah penambahan skill duplikat baik di sisi klien maupun penanganan error `409 Conflict` (Prisma P2002) dari backend.
3. **Upload dan Parsing Dokumen CV (*CV Upload & Parsing*):**
   - Mengunggah file resume menggunakan format `multipart/form-data` dengan field name `cv` ke `POST /api/v1/candidates/me/cv`.
   - Validasi ketat format file (`.pdf` dan `.docx`) dan batas ukuran maksimal 5 MB (`5 * 1024 * 1024` byte) sebelum dan saat request.
   - Menampilkan indikator loading/progress selama proses upload dan ekstraksi CV oleh backend parser.
   - Menampilkan riwayat dokumen CV terunggah (`GET /api/v1/candidates/me/cv`) dengan status parsing (`SUCCESS`, `PENDING`, `NEED_REVIEW`, `FAILED`) dan tanggal upload asli.
   - Mengotomatiskan sinkronisasi keahlian: skill yang diekstrak oleh parser backend langsung muncul di tab Skill kandidat.
   - Menghapus dokumen CV melalui `DELETE /api/v1/candidates/me/cv/:cvId`.
4. **Onboarding Kandidat (`OnboardingCandidatePage`):**
   - Menghubungkan wizard setup profil kandidat ke backend sehingga seluruh data preferensi karier, lokasi, gaji, relokasi, dan skill awal tersimpan ke database melalui `PATCH /candidates/me` dan `POST /candidates/me/skills`.
5. **Dashboard Kandidat (`DashboardCandidatePage`):**
   - Mengganti sapaan dan inisial hardcoded dengan nama asli kandidat yang diperoleh dari sesi autentikasi pengguna.

---

## 2. DAFTAR FILE YANG BERUBAH

| File | Status | Deskripsi Perubahan |
| :--- | :---: | :--- |
| `frontend/src/services/raviraApi.ts` | Modified | Menambahkan type definition (`CandidateProfile`, `CandidateSkill`, `CandidateDocument`, `UpdateCandidateProfileInput`, `CreateCandidateSkillInput`) dan fungsi client API (`getCandidateProfile`, `updateCandidateProfile`, `listCandidateSkills`, `createCandidateSkill`, `deleteCandidateSkill`, `uploadCandidateCv`, `listCandidateCvs`, `deleteCandidateCv`). |
| `frontend/src/pages/CandidateSelfProfilePage.tsx` | Modified | Mengganti seluruh data dummy dengan integrasi nyata API, loading spinner, error state dengan tombol retry, dynamic completion score, upload CV multipart, dan CRUD skill. |
| `frontend/src/pages/OnboardingCandidatePage.tsx` | Modified | Mengintegrasikan form wizard onboarding agar menyimpan ringkasan profil, pendidikan, lokasi Pulau Jawa, ekspektasi gaji, preferensi mobilitas, visibilitas, dan skill ke backend. |
| `frontend/src/pages/DashboardCandidatePage.tsx` | Modified | Menghilangkan fallback statis "Budi Santoso", menampilkan nama dan inisial pengguna aktual dari session context. |
| `frontend/src/components/ui/chart.tsx` | Modified | Perbaikan kompatibilitas tipe TypeScript untuk `item.value` (handling `null/undefined/unknown`) tanpa mengubah layout atau visual styling. |
| `frontend/tests/candidateProfile.test.ts` | Added | Suite pengujian otomatis Vitest yang menguji 13 skenario lengkap Sprint 2A. |

---

## 3. MAPPING HALAMAN KE ENDPOINT BACKEND

| Halaman Frontend | Path Route | Aksi / Fitur | Endpoint Backend | Method | Status |
| :--- | :--- | :--- | :--- | :---: | :---: |
| `CandidateSelfProfilePage` | `/dashboard/kandidat/profil` | Ambil profil kandidat | `/api/v1/candidates/me` | GET | **REAL** |
| `CandidateSelfProfilePage` | `/dashboard/kandidat/profil` | Update data pribadi & preferensi | `/api/v1/candidates/me` | PATCH | **REAL** |
| `CandidateSelfProfilePage` | `/dashboard/kandidat/profil` | Ambil daftar keterampilan | `/api/v1/candidates/me/skills` | GET | **REAL** |
| `CandidateSelfProfilePage` | `/dashboard/kandidat/profil` | Tambah keterampilan mandiri | `/api/v1/candidates/me/skills` | POST | **REAL** |
| `CandidateSelfProfilePage` | `/dashboard/kandidat/profil` | Hapus keterampilan | `/api/v1/candidates/me/skills/:id` | DELETE | **REAL** |
| `CandidateSelfProfilePage` | `/dashboard/kandidat/profil` | Upload resume/CV multipart | `/api/v1/candidates/me/cv` | POST | **REAL** |
| `CandidateSelfProfilePage` | `/dashboard/kandidat/profil` | Ambil riwayat dokumen CV | `/api/v1/candidates/me/cv` | GET | **REAL** |
| `CandidateSelfProfilePage` | `/dashboard/kandidat/profil` | Hapus dokumen CV | `/api/v1/candidates/me/cv/:id` | DELETE | **REAL** |
| `OnboardingCandidatePage` | `/daftar/kandidat/onboarding` | Simpan profil onboarding | `/api/v1/candidates/me` | PATCH | **REAL** |
| `OnboardingCandidatePage` | `/daftar/kandidat/onboarding` | Simpan skill onboarding | `/api/v1/candidates/me/skills` | POST | **REAL** |
| `DashboardCandidatePage` | `/dashboard/kandidat` | Tampilkan nama profil aktual | `AppContext` (dari `/auth/me`) | GET | **REAL** |

---

## 4. STATUS INTEGRASI TIAP FITUR

| Fitur | Status Sebelumnya | Status Saat Ini | Keterangan |
| :--- | :---: | :---: | :--- |
| Profil Kandidat | MOCK | **REAL** | Mengambil dan menyimpan data profil nyata dari/ke database PostgreSQL. |
| Manajemen Skill | MOCK | **REAL** | Tambah dan hapus skill tersimpan di tabel `candidate_skills`. Duplikasi dicegah. |
| Upload & Parsing CV | MOCK | **REAL** | Upload multipart terverifikasi, dokumen tersimpan di disk, parser mengekstrak skill. |
| Onboarding Kandidat | MOCK | **REAL** | Wizard menyimpan profil dan kompetensi awal ke backend sebelum masuk dashboard. |
| Identitas Dashboard | MOCK | **REAL** | Nama kandidat dinamis sesuai akun yang login. |

---

## 5. BUKTI BUILD, LINT, DAN TEST

### A. Backend Build
- **Perintah:** `npm.cmd run build`
- **Hasil:** **PASS (Exit code: 0)**
```text
> ravira-backend@0.1.0 build
> tsc
```

### B. Frontend Build
- **Perintah:** `npm.cmd --prefix frontend run build`
- **Hasil:** **PASS (Exit code: 0, 0 error)**
```text
> ravira-frontend@0.0.0 build
> tsc -b && vite build

vite v8.0.14 building client environment for production...
transforming...✓ 2403 modules transformed.
rendering chunks...
computing gzip size...
dist/index.html                                                        0.57 kB │ gzip:   0.34 kB
dist/assets/WhatsApp_Image_2026-05-28_at_19.43.24-2-CZ5ZVxyE.jpeg    235.24 kB
dist/assets/index-Ds_acgvr.css                                        16.31 kB │ gzip:   4.21 kB
dist/assets/index-BpnzJaBn.js                                      1,441.83 kB │ gzip: 330.29 kB
✓ built in 1.42s
```

### C. Frontend Lint
- **Perintah:** `npm.cmd --prefix frontend run lint`
- **Hasil:** **PASS (0 errors, 0 warnings)**
```text
> ravira-frontend@0.0.0 lint
> eslint .
```

### D. Backend Native Test Suite (Node.js Test Runner)
- **Perintah:** `node --test tests/backend/*.test.cjs`
- **Hasil:** **PASS (68/68 tests passed, 0 failed)**
```text
ℹ tests 68
ℹ suites 0
ℹ pass 68
ℹ fail 0
ℹ cancelled 0
ℹ skipped 0
ℹ todo 0
ℹ duration_ms 1830.3443
```

### E. Frontend Test Suite (Vitest)
- **Perintah:** `node frontend/node_modules/vitest/vitest.mjs run --root frontend`
- **Hasil:** **PASS (55/55 tests passed, 0 failed)**
```text
 RUN  v5.0.5 D:/ProjectRavira/ravira/frontend

 ✓ tests/api.test.ts (7 tests) 29ms
 ✓ tests/candidateProfile.test.ts (13 tests) 30ms
 ✓ tests/raviraApi.test.ts (24 tests) 38ms
 ✓ tests/AppContext.test.tsx (11 tests) 1095ms

 Test Files  4 passed (4)
      Tests  55 passed (55)
   Start at  22:39:00
   Duration  3.68s
```

### F. Pengujian Integrasi Database Nyata (*Live PostgreSQL & Server Verification*)
Pengujian end-to-end langsung pada server aktif (`http://localhost:4000`) dan database PostgreSQL:
1. Registrasi kandidat baru `candidate.sprint2a.*@example.com` $\to$ **HTTP 201 Created**, Token diterima.
2. `GET /candidates/me` $\to$ **HTTP 200 OK**, Profil terbaca: `Bambang Sudirman`, `Semarang, Jawa Tengah`.
3. `PATCH /candidates/me` $\to$ **HTTP 200 OK**, Gaji `16000000`, Visibilitas `PUBLIC` tersimpan di database.
4. `POST /candidates/me/skills` $\to$ **HTTP 201 Created**, Skill `React` berhasil ditambahkan dengan UUID valid.
5. `POST /candidates/me/skills` (duplikat) $\to$ **HTTP 409 Conflict**, P2002 tertangani secara benar.
6. `DELETE /candidates/me/skills/:id` $\to$ **HTTP 200 OK**, Skill berhasil terhapus dari database.
7. `POST /candidates/me/cv` $\to$ **HTTP 201 Created**, File PDF terunggah, disk storage tersimpan, parsing status `SUCCESS`.

---

## 6. HASIL PEMERIKSAAN KEAMANAN & INTEGRITAS DATA

1. **Pencegahan Kebocoran Candidate Score:**
   - Kandidat tetap terisolasi dan tidak memiliki akses ke endpoint evaluasi internal recruiter (`/applications/:id/score` mengembalikan `403 Forbidden`).
2. **Isolasi Akun & Pembersihan State:**
   - Saat logout, token `ravira.auth.token` dihapus dari `localStorage` dan event `SESSION_INVALIDATED` dipicu untuk mereset seluruh state privat aplikasi.
   - Tidak ada data profil atau skill dari sesi sebelumnya yang tertinggal atau bocor ke akun pengguna lain.
3. **Validasi File Multipart:**
   - Batasan 5 MB ditegakkan di sisi frontend sebelum pengiriman data dan divalidasi ulang oleh middleware multer backend.
   - Ekstensi file di luar `.pdf` dan `.docx` ditolak sebelum request dikirim.
   - Content-Type multipart tidak diset manual (dibiarkan di-generate otomatis oleh browser dengan boundary valid).
4. **Perlindungan Data Sensitif:**
   - Tidak ada token autentikasi atau isi file CV yang dicetak ke `console.log`.
5. **Cakupan Wilayah Geografis:**
   - Pilihan lokasi pengujian dan input domisili difokuskan pada kota-kota di wilayah **Pulau Jawa** (Jakarta, Bandung, Semarang, Yogyakarta, Surabaya, dsb).

---

## 7. GAP YANG MASIH TERSISA

1. **Penyimpanan Portofolio Interaktif:**
   - Prisma schema saat ini belum memiliki tabel mandiri `candidate_portfolios`. Portofolio kandidat saat ini diekstrak melalui dokumen resume CV dan dicantumkan dalam ringkasan pengalaman.
2. **Unggah Foto Profil Biner Mandiri:**
   - Model `User`/`Candidate` belum memiliki field `avatarUrl`. Avatar pada frontend saat ini me-render inisial kandidat bergradien dinamis berdasarkan huruf pertama nama lengkap pengguna.
3. **Katalog Pelatihan Terkustomisasi (Sprint 2B):**
   - Integrasi kursus penutup skill gap dan AI Match Score akan dilanjutkan pada Sprint 2B.

---

## 8. ACCEPTANCE CRITERIA SPRINT 2A

| # | Kriteria Keberhasilan | Status | Bukti Pengujian |
| :---: | :--- | :---: | :--- |
| 1 | Load profil berhasil dari API | **PASS** | `candidateProfile.test.ts` (Test 1) & Live DB check |
| 2 | Update profil berhasil dengan verifikasi respons | **PASS** | `candidateProfile.test.ts` (Test 2) & Live DB check |
| 3 | Update profil gagal ditangani dengan error 400 | **PASS** | `candidateProfile.test.ts` (Test 3) |
| 4 | Tambah skill berhasil tersimpan di DB | **PASS** | `candidateProfile.test.ts` (Test 4) & Live DB check |
| 5 | Hapus skill berhasil berdasarkan ID valid | **PASS** | `candidateProfile.test.ts` (Test 5) & Live DB check |
| 6 | Penolakan skill duplikat (409 Conflict) | **PASS** | `candidateProfile.test.ts` (Test 6) & Live DB check |
| 7 | Upload CV valid (PDF/DOCX) dan hasil parsing tampil | **PASS** | `candidateProfile.test.ts` (Test 7) & Live DB check |
| 8 | Upload file tidak valid ditolak (error 400) | **PASS** | `candidateProfile.test.ts` (Test 8) |
| 9 | Upload melebihi batas 5MB ditolak (error 400) | **PASS** | `candidateProfile.test.ts` (Test 9) |
| 10 | Token tidak valid/kedaluwarsa memicu pembersihan sesi | **PASS** | `candidateProfile.test.ts` (Test 10) |
| 11 | Logout membersihkan token dan mengisolasi akun | **PASS** | `candidateProfile.test.ts` (Test 11) |
| 12 | Persistensi data setelah reload halaman | **PASS** | `candidateProfile.test.ts` (Test 12) |
| 13 | Onboarding kandidat menyimpan data dan skill ke backend | **PASS** | Verifikasi implementasi form wizard `OnboardingCandidatePage` |

---

## 9. RISIKO REGRESI & MITIGASI

1. **Risiko:** Ekstraksi skill dari CV berpotensi menghasilkan nama skill yang sudah pernah ditambahkan oleh kandidat.
   - **Mitigasi:** Backend `candidateCv.service.ts` telah menggunakan `skipDuplicates: true` pada `createMany`, dan frontend memuat ulang daftar skill tanpa memicu error UI.
2. **Risiko:** Gagal koneksi saat upload file besar.
   - **Mitigasi:** Frontend membatasi ukuran file di 5 MB sebelum transmisi dan menyediakan notifikasi error informatif tanpa menyebabkan aplikasi crash.

---

## 10. REKOMENDASI SEBELUM COMMIT

1. Seluruh perubahan aman untuk di-commit:
   - `frontend/src/services/raviraApi.ts`
   - `frontend/src/pages/CandidateSelfProfilePage.tsx`
   - `frontend/src/pages/OnboardingCandidatePage.tsx`
   - `frontend/src/pages/DashboardCandidatePage.tsx`
   - `frontend/src/components/ui/chart.tsx`
   - `frontend/tests/candidateProfile.test.ts`
   - `docs/SPRINT_2A_CANDIDATE_INTEGRATION_RESULT.md`
2. Menjaga file artefak pengujian/temporary tetap di luar git tracking (sudah ada di `.gitignore` atau scratch folder).

---
*Laporan implementasi Sprint 2A selesai. Sesuai instruksi, pekerjaan dihentikan pada tahap ini dan tidak dilanjutkan ke Sprint 2B sebelum konfirmasi berikutnya.*

