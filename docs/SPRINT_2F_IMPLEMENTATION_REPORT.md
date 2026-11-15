# RAVIRA — SPRINT 2F IMPLEMENTATION REPORT
## Functional Improvement, Release Blocker Remediation & MVP Stabilization

- **Proyek:** RAVIRA (Platform Rekrutmen & Job Matching Berbasis Kompetensi)
- **Branch Kerja:** `sprint-2/frontend-api-integration` (PR #2 Draft)
- **Lingkup Role MVP:** `CANDIDATE`, `RECRUITER`, `ADMIN` / `SUPER_ADMIN`
- **Status Implementasi Kode:** **SELESAI (100% Code Remediation Verified)**

---

## 1. Tujuan Sprint 2F

Sprint 2F bertujuan untuk:
1. Memperbaiki tiga **Release Blocker** yang teridentifikasi pada evaluasi kesiapan MVP sebelumnya (`QA-05`):
   - **`SEC-QA05-01` (CRITICAL):** Pengamanan script seeding (`scripts/seed.js`) dan pembersihan smoke (`scripts/cleanup-smoke.js`) dengan mekanisme *fail-closed* terhadap database Production, pemblokiran kredensial default publik (`Password123!`), serta penghapusan pencetakan kredensial ke output log (`stdout`).
   - **`BUG-QA05-01` (HIGH):** Sinkronisasi akun dan password antara seeder Development (`scripts/seed.js`) dan seeder E2E (`tests/e2e/seed-e2e.cjs`), penambahan fixture khusus Development untuk role `SUPER_ADMIN`, penyediaan mekanisme backend khusus Development (`npm run dev:e2e`), perbaikan urutan eksekusi *safety gate* pada runner Playwright E2E (`tests/e2e/qa02-browser-e2e.cjs`) agar pemeriksaan port dan artefak build selesai sebelum proses seeding mengubah database, serta jaminan pembersihan resource (`try / finally`).
   - **`BUG-QA05-02` (HIGH):** Penghapusan seluruh data dan statistik *mock* statis pada beranda kandidat (`frontend/src/pages/DashboardCandidatePage.tsx`), penyambungan penuh ke API backend berdasarkan kandidat yang sedang login, serta perbaikan tombol navigasi yang sebelumnya mengarah ke halaman 404 (`/dashboard/kandidat/pelatihan/:id`).
2. Melakukan peninjauan regresi integrasi fungsional lintas role (`CANDIDATE`, `RECRUITER`, `ADMIN`, `SUPER_ADMIN`).
3. Mengaudit dan mendokumentasikan secara jujur kelima algoritma inti yang benar-benar berjalan di kode (`mvp-rule-v1`).
4. Menyiapkan artefak verifikasi menuju **QA-06 Final MVP Review** tanpa mengubah desain visual, warna, tipografi, maupun tata letak UI Ravira.

---

## 2. Kondisi Sebelum Perubahan & Baseline Audit (Tahap A)

### 2.1 Status Git & Working Tree Awal
- Branch aktif diselaraskan ke `sprint-2/frontend-api-integration` (`HEAD: aec2cf4`).
- Perubahan lokal yang belum di-commit pada working tree (`frontend/package-lock.json`, `frontend/src/components/ui/chart.tsx`, `.agents/`, dan `skills-lock.json`) dipertahankan secara utuh sesuai instruksi.

### 2.2 Evidence Gaps yang Ditemukan
Berdasarkan pemeriksaan direktori `docs/` dan root workspace:
1. Dokumen yang tersedia di repositori: `PRD_LENTERA_v1.3.md`, `SPRINT_1_AUTH_SECURITY_RESULT.md`, `SPRINT_2_INTEGRATION_AUDIT.md`, `SPRINT_2A` s.d. `SPRINT_2E`, `QA_01_FINAL_CODE_SECURITY_REVIEW.md`, `QA_02_BROWSER_E2E_TEST_REPORT.md`, dan `backend-setup.md`.
2. **Evidence Gap Dokumen Lokal:** File laporan `QA-04` dan `QA-05` belum tersimpan sebagai file terpisah di dalam folder `docs/` pada repositori yang di-clone (ringkasan temuan QA-04 dan QA-05 diterima melalui spesifikasi tugas Sprint 2F). Sesuai aturan audit, tidak dibuat laporan QA-04/QA-05 palsu untuk menggantikannya.
3. **Evidence Gap Environment Lokal:** File `.env` dan `.env.e2e` tidak ada di dalam repositori karena diabaikan oleh `.gitignore`. Sesuai larangan tegas Sprint 2F (*"Jangan mengubah file `.env` dan `.env.e2e`"*), file tersebut tidak dibuat atau dimodifikasi secara sepihak.

### 2.3 Peta Integrasi Fitur Sebelum Sprint 2F
| Modul / Halaman | Status Sebelum Sprint 2F | Temuan Audit Kode |
| :--- | :--- | :--- |
| `scripts/seed.js` | **RENTAN (`SEC-QA05-01`)** | Memuat `.env` secara langsung tanpa validasi `NODE_ENV` maupun project reference database, memakai fallback `Password123!`, meng-upsert `seed-admin@ravira.local` (`isActive: true`), dan mencetak `seedPassword` ke `stdout`. |
| `scripts/cleanup-smoke.js` | **RENTAN (`SEC-QA05-01`)** | Memuat `.env` tanpa *safety gate* sebelum menjalankan transaksi penghapusan masal (`deleteMany`). |
| `tests/e2e/seed-e2e.cjs` | **TIDAK SINKRON (`BUG-QA05-01`)** | Menggunakan password sintetis berbeda (`TestUser123!`) dibanding `scripts/seed.js` (`Password123!`), hanya menyemai 3 dari 10 kursus, dan belum memiliki fixture `SUPER_ADMIN`. |
| `tests/e2e/qa02-browser-e2e.cjs` | **URUTAN GATE SALAH (`BUG-QA05-01`)** | Memanggil `seedE2EFixtures()` pada baris 105 **sebelum** `startServers()` memeriksa ketersediaan port `4000`/`5173` dan keberadaan `frontend/dist/index.html`, serta meletakkan inisialisasi server/browser di luar blok `try / finally`. |
| `DashboardCandidatePage.tsx` | **100% MOCK (`BUG-QA05-02`)** | Menampilkan angka statis (`78%`, `24`, `3`, `45%`, `5`), daftar lowongan palsu (`Tokopedia`, `Gojek`, `Traveloka`), skill gap palsu (`Figma Advanced 70%`), pelatihan palsu (`Coursera`, `Udemy`), serta tombol `"Mulai Belajar"` yang mengarah ke `/dashboard/kandidat/pelatihan/${t.id}` (404). |
| `CrossRegionPage.tsx`, `PrivacySettingsPage.tsx`, `CourseDetailPage.tsx`, `CrossRegionDetailPage.tsx` | **IDENTITAS STATIS** | Prop `userName` pada `DashboardLayout` masih bernilai statis `"Budi Santoso"` alih-alih menggunakan nama kandidat yang sedang login dari `AppContext`. |
| Fitur Inti Candidate, Recruiter, dan Admin lainnya | **TERINTEGRASI DB** | Profil Kandidat, Skills, Upload & Parsing CV, Rekomendasi & Pencarian Lowongan, Saved Jobs, Lamaran, Skill Gap Page, Training Page, Recruiter Company Profile, Recruiter Jobs CRUD, Pipeline & Stage Update, Candidate Score, serta Admin Verification/Fraud/Appeals telah terhubung ke database melalui `/api/v1/*`. |

---

## 3. Ringkasan Temuan Ketidaksesuaian Dokumen vs Kode Aktual

Selain ketiga release blocker di atas, audit kode menemukan ketidaksesuaian dokumentasi historis dengan implementasi aktual yang berjalan di backend (`mvp-rule-v1`):
1. **Bobot AI Match Score (`src/modules/scoring/scoring.service.ts`):**
   - Laporan `SPRINT_2B_JOBS_MATCHING_APPLICATIONS_RESULT.md` menyebutkan bobot `60% Skill (dengan multiplier level Beginner 0.6 / Intermediate 0.8 / Advanced 1.0) + 25% Pengalaman + 15% Preferensi`.
   - **Kode Aktual:** Menggunakan rumus berbasis aturan deterministik `50 poin Skill Coverage (tanpa multiplier level) + 20 poin Location Match + 15 poin WorkType/Mobility Match + 15 poin Experience Keyword Relevance`.
2. **Komponen Candidate Score (`src/modules/scoring/scoring.service.ts` & `frontend/src/services/raviraApi.ts`):**
   - Laporan `SPRINT_2C_RECRUITER_PIPELINE_RESULT.md` dan tipe lama di `raviraApi.ts` mencantumkan properti breakdown `skillScore`, `experienceScore`, `educationScore`.
   - **Kode Aktual:** Mengembalikan `matchScore` (bobot 50), `profileCompleteness` (bobot 20), `requiredSkillCoverage` (bobot 20), dan `verificationRiskBasic` (bobot 10). Tipe TypeScript pada `raviraApi.ts` telah diselaraskan pada Sprint 2F.
3. **Algoritma Rekomendasi & Ekstraksi CV:**
   - Seluruh 5 algoritma di backend bersifat **rule-based deterministik (`mvp-rule-v1`)**. Belum ada model *machine learning*, *deep learning*, NLP kontekstual, maupun algoritma *FP-Growth* yang dijalankan di kode produksi saat ini. Detail rumus dan perhitungan manual didokumentasikan secara transparan pada laporan QA-05 Remediation.

---

## 4. Daftar File yang Diubah / Ditambahkan

| File | Jenis Perubahan | Ringkasan |
| :--- | :--- | :--- |
| `tests/e2e/e2e-safety-gate.cjs` | Diubah | Menambahkan `assertDevelopmentSeedSafety()`, `loadDevelopmentEnvForScript()`, `resolveSafeDevSeedPassword()`, daftar `FORBIDDEN_DEFAULT_PASSWORDS` (termasuk `"Password123!"`), dan konstanta password pengembangan tersinkronisasi (`DEV_SYNTHETIC_PASSWORD`). |
| `scripts/seed.js` | Diubah | Menambahkan *fail-closed Production safety guard* sebelum inisialisasi `PrismaClient`, menghapus fallback `"Password123!"`, menghapus pencetakan `seedPassword` ke `stdout`, menyinkronkan password dan profil kandidat dengan E2E, serta menambahkan fixture `seed-superadmin@ravira.local` (`Role.SUPER_ADMIN`). |
| `scripts/cleanup-smoke.js` | Diubah | Menambahkan *fail-closed Production safety guard* (`assertDevelopmentSeedSafety` / `loadDevelopmentEnvForScript`) sebelum inisialisasi `PrismaClient` dan eksekusi transaksi penghapusan smoke data. |
| `scripts/dev-e2e-server.cjs` | Baru | Menambahkan runner backend khusus Development (`npm run dev:e2e`) yang memuat `.env.e2e`, memvalidasi safety gate & port `4000` secara *fail-closed*, serta menangani *graceful shutdown*. |
| `package.json` | Diubah | Menambahkan script `"dev:e2e": "node scripts/dev-e2e-server.cjs"`. |
| `tests/e2e/seed-e2e.cjs` | Diubah | Menyinkronkan password dan daftar 10 kursus dengan `scripts/seed.js`, serta menambahkan fixture `seed-superadmin@ravira.local` (`Role.SUPER_ADMIN`). |
| `tests/e2e/qa02-browser-e2e.cjs` | Diubah | Memperbaiki urutan safety gate (`startServers()` memvalidasi `frontend/dist/index.html`, port `4000` & `5173`, dan `/__e2e_runner_identity` **sebelum** `seedE2EFixtures()`), membungkus seluruh lifecycle di dalam `try / finally`, serta memverifikasi bebas-mock pada dashboard kandidat dan login API `SUPER_ADMIN`. |
| `frontend/src/pages/DashboardCandidatePage.tsx` | Diubah | Mengganti seluruh statistik dan daftar mock dengan pemanggilan API real (`getCandidateProfile`, `listCandidateSkills`, `getJobRecommendations`, `getSkillGapReport`, `getTrainingRecommendations`, `listMyTrainingProgress`, `listMyApplications`), menambahkan loading/error/empty state, dan memperbaiki navigasi tombol ke route yang valid. |
| `frontend/src/pages/CrossRegionPage.tsx` | Diubah | Menggunakan nama dan inisial kandidat yang sedang login dari `useAppContext()` pada `DashboardLayout`. |
| `frontend/src/pages/PrivacySettingsPage.tsx` | Diubah | Menggunakan nama dan inisial kandidat yang sedang login dari `useAppContext()` pada `DashboardLayout`. |
| `frontend/src/pages/CourseDetailPage.tsx` | Diubah | Menggunakan nama dan inisial kandidat yang sedang login dari `useAppContext()` pada `DashboardLayout`. |
| `frontend/src/pages/CrossRegionDetailPage.tsx` | Diubah | Menggunakan nama dan inisial kandidat yang sedang login dari `useAppContext()` pada `DashboardLayout`. |
| `frontend/src/services/raviraApi.ts` | Diubah | Menyelaraskan tipe `candidateScoreBreakdown` dengan struktur objek yang dikembalikan backend (`matchScore`, `profileCompleteness`, `requiredSkillCoverage`, `verificationRiskBasic`). |
| `docs/backend-setup.md` | Diubah | Memperbarui dokumentasi akun seed pengembangan, safety gate fail-closed, dan perintah `npm run dev:e2e`. |
| `tests/e2e/README.md` | Diubah | Memperbarui dokumentasi struktur safety gate, sinkronisasi seed, dan urutan eksekusi E2E. |
| `tests/backend/sprint2f-security-and-seed-guard.test.cjs` | Baru | Pengujian otomatis keamanan seeder, penolakan Production sebelum DB write (`calls.length === 0`), pemblokiran `Password123!`, pencegahan kebocoran secret di output, dan otorisasi `ADMIN` vs `SUPER_ADMIN`. |
| `frontend/tests/sprint2fCandidateDashboard.test.tsx` | Baru | Pengujian otomatis Vitest untuk `DashboardCandidatePage` (integrasi API real, ketiadaan mock data, navigasi bebas 404, empty state, error/retry state, dan identitas dinamis kandidat). |

---

## 5. Penjelasan Perbaikan & Dampak terhadap Fitur

### 5.1 Perbaikan Keamanan Seeder & Isolasi Environment (`SEC-QA05-01` & `BUG-QA05-01`)
- **Fail-Closed Before DB Connection:** `scripts/seed.js` dan `scripts/cleanup-smoke.js` kini memanggil `assertDevelopmentSeedSafety()` sebelum `new PrismaClient()` dibuat. Eksekusi langsung dihentikan (`throw Error`) apabila:
  1. `NODE_ENV` bukan `development`, `test`, atau `e2e` (misalnya `production` atau `staging`).
  2. `DATABASE_URL` kosong, mengandung pola Production (`gsjonnybomydrfhsdwcc` atau `aws-1-ap-south-1.pooler.supabase.com`), atau tidak mengandung referensi project **Ravira-Development** (`rkftrtpcoymstbdtlfig`).
  3. `DIRECT_URL` (jika disetel) mengarah ke luar `rkftrtpcoymstbdtlfig` atau mengandung pola Production.
  4. `SEED_PASSWORD` menggunakan password default lama yang telah terekspos (`Password123!`, `password`, `admin123`, dll.) atau kurang dari 8 karakter.
- **Zero Secret Leakage:** Field `seedPassword` dihapus sepenuhnya dari output JSON `scripts/seed.js`.
- **Sinkronisasi Kredensial & Akun Development:** Baik `npm run seed` maupun `npm run seed:e2e` kini menggunakan fungsi `resolveSafeDevSeedPassword()` yang sama dan menyemai 4 akun inti (`seed-candidate@ravira.local`, `seed-recruiter@ravira.local`, `seed-admin@ravira.local`, dan `seed-superadmin@ravira.local`).
- **Urutan Safety Gate E2E & Resource Cleanup:** Pada `tests/e2e/qa02-browser-e2e.cjs`, `startServers()` dijalankan terlebih dahulu untuk memastikan `frontend/dist/index.html` tersedia, port `4000` dan `5173` bebas dari proses liar, serta server terkelola merespons `/__e2e_runner_identity` dengan nonce kriptografis yang sah **sebelum** `seedE2EFixtures()` menyentuh database. Seluruh resource (`browser`, `frontendServer`, `backendServer`, `prisma.$disconnect()`) ditutup di dalam blok `finally`.

### 5.2 Perbaikan Beranda Kandidat (`BUG-QA05-02`)
- **Data Real Berbasis Akun Login:** `DashboardCandidatePage.tsx` memuat data secara paralel menggunakan `Promise.allSettled` dan `AbortController` dari 7 fungsi layanan (`getCandidateProfile`, `listCandidateSkills`, `getJobRecommendations`, `getSkillGapReport`, `getTrainingRecommendations`, `listMyTrainingProgress`, `listMyApplications`).
- **Perhitungan Statistik Jujur:**
  - *Kelengkapan Profil:* Dihitung secara deterministik (0–100%) dari kelengkapan 8 komponen profil & keahlian kandidat.
  - *Rekomendasi Pekerjaan:* Menampilkan jumlah rekomendasi nyata dari backend beserta jumlah lowongan dengan kecocokan tinggi (`>= 70%`).
  - *Skill Gap Utama:* Menampilkan jumlah `missingSkills` aktual dari laporan Skill Gap kandidat (`0%` dimiliki / `Gap 100%` untuk skill yang belum dimiliki, dan `100%` dimiliki / `Gap 0%` untuk skill yang cocok — tanpa persentase rekayasa).
  - *Progress Pelatihan:* Menghitung rata-rata `progressPct` dari kursus yang diikuti kandidat (`0%` jika belum mengikuti kursus).
  - *Lamaran Aktif:* Menampilkan total lamaran kandidat dan jumlah lamaran yang masih dalam tahap proses seleksi.
- **Perbaikan Navigasi 404:**
  - Tombol `"Mulai Belajar"` pada kartu pelatihan kini mengarah ke `/dashboard/kandidat/pelatihan` (route valid di `routes.ts`), menggantikan `/dashboard/kandidat/pelatihan/${t.id}` yang sebelumnya menghasilkan 404.
  - Tombol `"Buka Lowongan"` dan `"Lihat Peluang"` mengarah langsung ke halaman detail lowongan `/dashboard/kandidat/pekerjaan/${jobId}`.
- **Preservasi Desain UI:** Seluruh struktur grid, palet warna (`#0A1B3D`, `#1677FF`, `#4DB8FF`, `#10d98e`, `#ff9a3c`), tipografi (`Poppins`, `Inter`, `JetBrains Mono`), *border-radius*, dan bayangan kartu dipertahankan 100% tanpa perubahan desain.

---

## 6. Hasil Pengujian (Tahap F — Quality Gate)

| Pemeriksaan | Perintah | Hasil Aktual |
| :--- | :--- | :--- |
| **Prisma Client Generation** | `npm run prisma:generate` | **PASS** (Generated Prisma Client v6.19.3) |
| **Backend TypeScript Build** | `npm run build` | **PASS** (0 error TypeScript) |
| **Backend Automated Tests** | `npm run test:backend` | **PASS — 80/80 tests** (termasuk 6 pengujian baru keamanan seeder & otorisasi `SUPER_ADMIN` di `sprint2f-security-and-seed-guard.test.cjs`) |
| **Frontend ESLint** | `npm --prefix frontend run lint` | **PASS** (0 error, 0 warning) |
| **Frontend TypeScript & Vite Build** | `npm --prefix frontend run build` | **PASS** (`tsc -b && vite build` berhasil membangun `frontend/dist`) |
| **Frontend Vitest Suite** | `npx --prefix frontend vitest run --root frontend` | **PASS — 128/128 tests** di 11 file test (termasuk 5 pengujian integrasi baru di `sprint2fCandidateDashboard.test.tsx`) |
| **Fail-Closed CLI Verification** | `npm run seed`, `npm run cleanup:smoke`, `npm run seed:e2e`, `npm run test:e2e`, `npm run dev:e2e` | **PASS (Fail-Closed Verified)** — Menolak eksekusi secara instan dengan `[SECURITY SAFETY GATE BLOCKED]` / `[E2E SAFETY GATE BLOCKED]` ketika `.env.e2e` belum tersedia atau target bukan `Ravira-Development` (`rkftrtpcoymstbdtlfig`). |
| **Secret Scanning** | Pemeriksaan `git diff` | **PASS** — Tidak ada password, `JWT_SECRET`, atau `DATABASE_URL` yang bocor pada kode maupun log. |

---

## 7. Risiko Tersisa & Tindakan Manual Pra-Rilis

1. **Rotasi / Penonaktifan Manual Akun Demo Admin di Database Production (`SEC-QA05-01`):**
   - Kode `scripts/seed.js` telah diamankan agar tidak dapat dijalankan lagi terhadap Production. Namun, sesuai prinsip keamanan operasional, kode seeder **tidak boleh** mengubah atau menonaktifkan data Production secara otomatis.
   - Administrator infrastruktur wajib memverifikasi secara manual pada database Supabase Production (`gsjonnybomydrfhsdwcc`) bahwa akun `seed-admin@ravira.local` (serta `seed-candidate@ravira.local` dan `seed-recruiter@ravira.local` bila pernah ter-seed di Production) telah dinonaktifkan (`isActive = false`) atau dihapus, dan password admin Production telah dirotasi.
2. **Eksekusi Live Playwright E2E dengan `.env.e2e` Lokal:**
   - Pada workspace hasil clone bersih ini, file `.env.e2e` (yang berisi kredensial koneksi ke Supabase `Ravira-Development` `rkftrtpcoymstbdtlfig`) tidak disertakan di Git dan tidak boleh dimodifikasi oleh agen. Setelah pemilik proyek meletakkan `.env.e2e` lokal, jalankan `npm run test:e2e` untuk meregenerasi artefak tangkapan layar terbaru pada `tests/e2e/.artifacts/`.
