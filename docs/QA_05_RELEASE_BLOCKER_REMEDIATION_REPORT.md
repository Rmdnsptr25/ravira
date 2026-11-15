# RAVIRA — QA-05 RELEASE BLOCKER REMEDIATION & ALGORITHM AUDIT REPORT
## Sprint 2F Verification Towards QA-06 Final MVP Review

- **Proyek:** RAVIRA (Platform Rekrutmen & Job Matching Berbasis Kompetensi)
- **Branch:** `sprint-2/frontend-api-integration` (PR #2 Draft)
- **Lingkup Role MVP:** `CANDIDATE`, `RECRUITER`, `ADMIN` / `SUPER_ADMIN`
- **Status Remediasi Kode:** **3/3 Release Blockers Remediated & Verified in Code**
- **Keputusan Rilis Akhir (Final Decision):** **`BLOCKED`** *(Menunggu verifikasi manual rotasi/penonaktifan akun administrator demo pada database Production Supabase sesuai aturan wajib Bagian 9 & 11)*

---

## 1. Hasil Verifikasi Setiap Release Blocker

| ID Blocker | Tingkat | Deskripsi Masalah Awal | Remediasi Kode pada Sprint 2F | Status Kode | Status Operasional |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **`SEC-QA05-01`** | **CRITICAL** | `scripts/seed.js` dan `scripts/cleanup-smoke.js` belum memiliki *Production safety guard*, menggunakan password default publik (`Password123!`), dapat mengaktifkan kembali akun `seed-admin@ravira.local` di Production, dan mencetak `seedPassword` ke `stdout`. | Menambahkan `assertDevelopmentSeedSafety()` dan `loadDevelopmentEnvForScript()` yang bersifat *fail-closed* **sebelum** inisialisasi `PrismaClient`: memvalidasi `NODE_ENV` (`development`/`test`/`e2e`), memvalidasi project ref database (`rkftrtpcoymstbdtlfig`), menolak pola Production (`gsjonnybomydrfhsdwcc`, `aws-1-ap-south-1.pooler.supabase.com`), memblokir `Password123!`, serta menghapus `seedPassword` dari output log. | **REMEDIATED & TESTED** | **MANUAL ACTION REQUIRED** (Rotasi/nonaktifkan akun demo lama yang sudah ada di DB Production) |
| **`BUG-QA05-01`** | **HIGH** | Ketidakkonsistenan password antara `scripts/seed.js` (`Password123!`) dan `tests/e2e/seed-e2e.cjs` (`TestUser123!`), urutan *safety gate* E2E memanggil `seedE2EFixtures()` sebelum pemeriksaan port/build, cleanup resource di luar `try / finally`, belum ada fixture `SUPER_ADMIN`, serta belum ada script backend khusus Development. | Menyinkronkan password Development (`resolveSafeDevSeedPassword()`), menambahkan fixture `seed-superadmin@ravira.local` (`Role.SUPER_ADMIN`) dan 10 kursus pada kedua seeder, menambahkan `npm run dev:e2e` (`scripts/dev-e2e-server.cjs`), memindahkan `startServers()` (validasi build + port `4000`/`5173` + `/__e2e_runner_identity`) **sebelum** `seedE2EFixtures()`, dan membungkus seluruh lifecycle E2E di dalam `try / finally`. | **REMEDIATED & TESTED** | **VERIFIED** |
| **`BUG-QA05-02`** | **HIGH** | `DashboardCandidatePage.tsx` menampilkan statistik statis (`78%`, `24`, `3`, `45%`, `5`) dan data *mock* (`Tokopedia`, `Gojek`, `Traveloka`, `Figma Advanced`), serta tombol `"Mulai Belajar"` mengarah ke `/dashboard/kandidat/pelatihan/${t.id}` (404). | Menghapus seluruh konstanta *mock* dari `DashboardCandidatePage.tsx`, mengintegrasikan 7 endpoint API real sesuai kandidat yang sedang login, menerapkan *loading state*, *error state* (+ tombol `"Coba Lagi"`), dan *empty state* jujur, serta memperbaiki navigasi ke route valid (`/dashboard/kandidat/pelatihan` dan `/dashboard/kandidat/pekerjaan/:id`). | **REMEDIATED & TESTED** | **VERIFIED** |

---

## 2. Bukti Pengujian (Quality Gate)

### 2.1 Ringkasan Eksekusi Otomatis
1. **Backend TypeScript Build (`npm run build`):**
   - `tsc` selesai dengan **0 error** (`exit code 0`).
2. **Backend Automated Test Suite (`npm run test:backend`):**
   - **80/80 pengujian PASS (`0 fail`)**, terdiri atas:
     - `tests/backend/auth-authorization.test.cjs`
     - `tests/backend/recruiter-authorization.test.cjs`
     - `tests/backend/sprint2e-features.test.cjs`
     - `tests/backend/sprint2f-security-and-seed-guard.test.cjs` *(6 pengujian baru untuk `SEC-QA05-01` & `BUG-QA05-01`)*
3. **Frontend ESLint (`npm --prefix frontend run lint`):**
   - `eslint .` selesai dengan **0 error dan 0 warning** (`exit code 0`).
4. **Frontend TypeScript & Production Bundle Build (`npm --prefix frontend run build`):**
   - `tsc -b && vite build` selesai dengan **0 error** (`frontend/dist/index.html` terbangun).
5. **Frontend Vitest Suite (`npx --prefix frontend vitest run --root frontend`):**
   - **128/128 pengujian PASS di 9 file test (`0 fail`)**, termasuk 5 pengujian integrasi baru pada `frontend/tests/sprint2fCandidateDashboard.test.tsx`.

### 2.2 Verifikasi Fail-Closed pada CLI Seeder & Runner
Ketika dijalankan tanpa konfigurasi `Ravira-Development` (`rkftrtpcoymstbdtlfig`) atau ketika diarahkan ke pola Production:
- `npm run seed` -> langsung berhenti dengan `[SECURITY SAFETY GATE BLOCKED]` sebelum koneksi `PrismaClient` dibuat (`0` operasi baca/tulis database).
- `npm run cleanup:smoke` -> langsung berhenti dengan `[SECURITY SAFETY GATE BLOCKED]` sebelum koneksi `PrismaClient` dibuat (`0` operasi baca/tulis database).
- `npm run seed:e2e`, `npm run dev:e2e`, dan `npm run test:e2e` -> langsung berhenti dengan `[E2E SAFETY GATE BLOCKED]` apabila `.env.e2e` tidak ada atau tidak mengarah ke `rkftrtpcoymstbdtlfig`.

---

## 3. Detail Perbaikan Keamanan (`SEC-QA05-01` & `BUG-QA05-01`)

1. **Validasi Berlapis Berbasis Project Reference (`tests/e2e/e2e-safety-gate.cjs`):**
   - Memeriksa `NODE_ENV` (hanya mengizinkan `development`, `test`, `e2e`).
   - Memeriksa `DATABASE_URL` dan `DIRECT_URL`: menolak string kosong, menolak pola Production (`gsjonnybomydrfhsdwcc`, `aws-1-ap-south-1.pooler.supabase.com`), dan mewajibkan keberadaan referensi project **Ravira-Development** (`rkftrtpcoymstbdtlfig`).
2. **Pemblokiran Kredensial Default Publik:**
   - Daftar `FORBIDDEN_DEFAULT_PASSWORDS` (`"Password123!"`, `"password"`, `"admin123"`, `"12345678"`, dll.) ditolak secara eksplisit oleh `resolveSafeDevSeedPassword()`.
3. **Pencegahan Kebocoran Secret ke Log (`stdout`):**
   - `scripts/seed.js` dan `scripts/dev-e2e-server.cjs` hanya mencetak metadata non-sensitif (`projectRef`, `environment`, daftar email akun uji, dan ID entitas) tanpa pernah mencetak `seedPassword`, `JWT_SECRET`, maupun `DATABASE_URL`.
4. **Pencegahan Reaktivasi Akun Demo Production:**
   - Karena `runSeed()` memvalidasi `assertDevelopmentSeedSafety()` sebelum `new PrismaClient()` dibuat, fungsi `upsertUser({ email: "seed-admin@ravira.local", isActive: true })` tidak mungkin tereksekusi terhadap database Production.

---

## 4. Hasil Autentikasi & Otorisasi Setiap Role

| Role | Akun Fixture Development | Endpoint / Portal | Hasil Verifikasi |
| :--- | :--- | :--- | :--- |
| **`CANDIDATE`** | `seed-candidate@ravira.local` | `/masuk/kandidat` -> `/dashboard/kandidat`, `/api/v1/candidates/me/*`, `/api/v1/jobs/:id/match-score` | **PASS** — Hanya dapat mengakses data miliknya sendiri; akses ke `/api/v1/applications/:id/score` (`CandidateScore`) dan `/api/v1/admin/*` ditolak dengan **HTTP 403 Forbidden**; akses ke lamaran kandidat lain ditolak dengan **HTTP 404**. |
| **`RECRUITER` (`APPROVED`)** | `seed-recruiter@ravira.local` | `/masuk/perusahaan` -> `/dashboard/perusahaan`, `/api/v1/recruiter/*`, `/api/v1/applications/:id/score`, `/api/v1/applications/:id/stage` | **PASS** — Dapat mengelola lowongan dan pipeline perusahaannya sendiri; akses ke lowongan/pelamar perusahaan lain ditolak dengan **HTTP 404** (*ownership isolation*); akses ke `/api/v1/admin/*` ditolak dengan **HTTP 403**. |
| **`RECRUITER` (`PENDING` / `REJECTED` / `SUSPENDED`)** | `pending-recruiter@ravira.local`, `rejected-recruiter@ravira.local` | `/dashboard/perusahaan/pipeline`, `/api/v1/recruiter/jobs/:id/applications` | **PASS** — Diblokir dari akses data kandidat, skor kandidat, dan perubahan tahapan seleksi (**HTTP 403 Forbidden**) sebelum terjadi pembacaan/penulisan data kandidat. |
| **`ADMIN`** | `seed-admin@ravira.local` | `/masuk/admin` -> `/admin`, `/api/v1/admin/*` | **PASS** — Dapat mengakses antrean verifikasi perusahaan, peninjauan manual kasus anti-fraud (`FraudCase`), dan keputusan banding (`Appeal`); ditolak pada endpoint khusus mutasi recruiter (`/recruiter/*`, `/applications/:id/stage`) dengan **HTTP 403**. |
| **`SUPER_ADMIN`** | `seed-superadmin@ravira.local` *(Fixture khusus Development)* | `/masuk/admin` -> `/admin`, `/api/v1/admin/*`, `/api/v1/applications/:id/score` | **PASS** — Terverifikasi melalui `sprint2f-security-and-seed-guard.test.cjs` dan `auth-authorization.test.cjs` bahwa `SUPER_ADMIN` memiliki hak akses penuh ke seluruh endpoint `/api/v1/admin/*` (**HTTP 200**) dan pembacaan `Application` / `CandidateScore` tanpa memerlukan profil recruiter. |

---

## 5. Hasil Integrasi Dashboard Kandidat (`BUG-QA05-02`)

File `frontend/src/pages/DashboardCandidatePage.tsx` telah diaudit dan diintegrasikan penuh:

| Komponen pada Beranda Kandidat | Kondisi Sebelum Sprint 2F | Sumber Data & Perilaku Aktual Sesudah Sprint 2F |
| :--- | :--- | :--- |
| **Kartu 1: Kelengkapan Profil** | Hardcoded `"78%"` (`"Tambah pengalaman kerja"`) | Dihitung secara deterministik (`0%–100%`) dari `GET /candidates/me` dan `GET /candidates/me/skills` (8 indikator: nama, email, telepon, lokasi, ringkasan pengalaman, pendidikan, preferensi mobilitas, dan kepemilikan skill). |
| **Kartu 2: Rekomendasi Pekerjaan** | Hardcoded `"24"` (`"3 baru hari ini"`) | Jumlah aktual dari `GET /candidates/me/recommendations/jobs` beserta jumlah lowongan dengan `matchScore >= 70%`. |
| **Kartu 3: Skill Gap Utama** | Hardcoded `"3"` (`"Perlu ditingkatkan"`) | Jumlah `missingSkills.length` aktual dari `GET /candidates/me/skill-gap` beserta sub-label posisi target (`Target: <targetRole>`). |
| **Kartu 4: Progress Pelatihan** | Hardcoded `"45%"` (`"2 kursus aktif"`) | Rata-rata `progressPct` aktual dari `GET /candidates/me/training-progress` (`0%` jika belum ada kursus yang diikuti). |
| **Kartu 5: Lamaran Aktif** | Hardcoded `"5"` (`"2 menunggu respons"`) | Jumlah aktual dari `GET /candidates/me/applications` beserta jumlah lamaran yang masih berstatus diproses (`!= ACCEPTED` & `!= REJECTED`). |
| **Daftar Rekomendasi Pekerjaan** | 3 item mock (`Tokopedia 94%`, `Gojek 88%`, `Traveloka 82%`) | Menampilkan hingga 3 rekomendasi teratas dari `getJobRecommendations()` dengan `matchScore` asli dan `matchExplanation[0]` asli. Tombol `"Buka Lowongan"` mengarah ke `/dashboard/kandidat/pekerjaan/${rec.job.id}`. |
| **Daftar Pelatihan Direkomendasikan** | 3 item mock (`Coursera`, `Udemy`, `Google`) + tombol menuju `/dashboard/kandidat/pelatihan/${t.id}` (**404**) | Menggabungkan progres pelatihan aktif (`listMyTrainingProgress()`) dan rekomendasi kursus (`getTrainingRecommendations()`). Tombol `"Mulai Belajar"` diarahkan ke `/dashboard/kandidat/pelatihan` (**bebas 404**). |
| **Skill Gap Report** | 3 item mock dengan persentase palsu (`Figma Advanced 70%`, `React / Next.js 45%`, `Design Systems 80%`) | Menampilkan `missingSkills` (`Kamu: 0%`, `Gap 100%`) dan `matchedSkills` (`Kamu: 100%`, `Gap 0%`) dari `getSkillGapReport()` secara jujur tanpa mengarang angka persentase perantara. |
| **Peluang Lintas Wilayah** | 2 item mock (`Gojek 91%`, `Traveloka 85%`) | Diturunkan dari rekomendasi lowongan nyata (`getJobRecommendations()`) yang berlokasi di luar domisili kandidat atau bertipe `REMOTE` / `HYBRID`, dengan tombol `"Lihat Peluang"` menuju `/dashboard/kandidat/pekerjaan/${cr.id}`. |
| **State Penanganan Data** | Tidak ada loading/error/empty state | Dilengkapi *loading spinner*, *error card* dengan tombol `"Coba Lagi"`, serta *empty state* jujur pada setiap seksi ketika data kandidat masih kosong. |

---

## 6. Hasil Audit Algoritma (Tahap E — Algorithm Validation)

> **Pernyataan Transparansi Arsitektur:**
> Seluruh algoritma pencocokan, penilaian, analisis kesenjangan keahlian, rekomendasi pelatihan, dan ekstraksi CV yang berjalan pada kode MVP Ravira saat ini (`ruleVersion: "mvp-rule-v1"`) menggunakan pendekatan **rule-based deterministik berbasis pencocokan kata kunci dan pembobotan eksplisit**. Kode saat ini **belum** menggunakan model *machine learning*, *deep learning*, *embedding* NLP kontekstual, maupun algoritma penambangan aturan asosiasi *FP-Growth*.

---

### 6.1 Algoritma 1 — AI Match Score
- **File Sumber:** `src/modules/scoring/scoring.service.ts` (`computeMatchScore`)
- **Tujuan:** Menghitung tingkat kecocokan (`0–100`) antara profil serta keahlian kandidat terhadap kebutuhan suatu lowongan pekerjaan yang dipublikasikan, beserta penjelasan rekomendasi yang transparan bagi kandidat.
- **Input:**
  1. Data Kandidat (`Candidate`): `location`, `education`, `experienceSummary`, `mobilityPreference`, dan daftar `skills: Array<{ skillName }>`.
  2. Data Lowongan (`Job`): `title`, `location`, `jobType`, `workType`, `employmentType`, dan daftar `skills: Array<{ skillName, required, weight }>`.
- **Proses & Rumus Aktual yang Digunakan:**
  1. Normalisasi teks (`normalized(value)`): mengubah string ke huruf kecil (`toLowerCase()`) dan memangkas spasi (`trim()`).
  2. **Komponen 1 — Skill Match ($S_{\text{skill}}$, Bobot Maksimal = 50):**
     - Setiap skill lowongan $i$ memiliki bobot $w_i = \max(\text{skill}_i.\text{weight}, 1)$.
     - $\text{totalWeight} = \sum_i w_i$, dan $\text{matchedWeight} = \sum_{i \in \text{matched}} w_i$ (di mana nama skill kandidat sama persis secara *case-insensitive* dengan nama skill lowongan).
     - Jika lowongan tidak mencantumkan skill ($\text{job.skills.length} = 0$), maka $\text{coverage} = 1$. Jika ada skill, $\text{coverage} = \frac{\text{matchedWeight}}{\text{totalWeight}}$.
     - $$S_{\text{skill}} = \text{coverage} \times 50$$
  3. **Komponen 2 — Location Match ($S_{\text{location}}$, Bobot Maksimal = 20):**
     - Bernilai `true` jika `candidate.location` dan `job.location` keduanya tidak kosong, dan salah satu merupakan substring dari yang lain (`candLoc.includes(jobLoc) || jobLoc.includes(candLoc)`).
     - $$S_{\text{location}} = \begin{cases} 20 & \text{jika lokasi cocok} \\ 0 & \text{jika tidak cocok / kosong} \end{cases}$$
  4. **Komponen 3 — WorkType / JobType Match ($S_{\text{workType}}$, Bobot Maksimal = 15):**
     - Membandingkan `candidate.mobilityPreference` terhadap `job.workType` dan `job.jobType ?? job.employmentType` menggunakan pencocokan substring dua arah.
     - $$S_{\text{workType}} = \begin{cases} 15 & \text{jika mobilityPreference cocok dengan workType atau jobType} \\ 0 & \text{jika tidak cocok / kosong} \end{cases}$$
  5. **Komponen 4 — Experience Relevance ($S_{\text{experience}}$, Bobot Maksimal = 15):**
     - Menggabungkan teks pengalaman kandidat: $\text{expText} = \text{normalized}(\text{experienceSummary} + \text{" "} + \text{education})$.
     - Menyusun daftar kata kunci target: $\text{keywords} = [\text{job.title}, \text{job.jobType}, \text{job.employmentType}, \dots\text{job.skills.map}(s \to s.\text{skillName})]$ yang tidak kosong.
     - Menghitung $\text{matchedKeywords}$ yaitu elemen $\text{keywords}$ yang muncul sebagai substring di dalam $\text{expText}$.
     - $$\text{experienceRatio} = \min\left(\frac{|\text{matchedKeywords}|}{\min(|\text{keywords}|, 3)}, 1\right)$$
     - $$S_{\text{experience}} = \text{experienceRatio} \times 15$$
  6. **Skor Akhir (`clampScore`):**
     $$\text{AI Match Score} = \text{ clamp}_{[0, 100]}\left(\text{round}\left(S_{\text{skill}} + S_{\text{location}} + S_{\text{workType}} + S_{\text{experience}}\right)\right)$$
- **Bobot:**
  - Skill Match: **50%** (50 poin)
  - Location Match: **20%** (20 poin)
  - WorkType / Mobility Match: **15%** (15 poin)
  - Experience Relevance: **15%** (15 poin)
- **Output:** `{ score: number (0..100), matchExplanation: string[], breakdown: object, ruleVersion: "mvp-rule-v1" }`.
- **Contoh Perhitungan Manual:**
  - Misalkan **Seed Candidate** (`location: "Bandung"`, `mobilityPreference: "HYBRID"`, `education: "S1 Teknik Informatika"`, `experienceSummary: "Memiliki pengalaman membangun REST API dengan Node.js dan PostgreSQL."`, `skills: ["TypeScript"]`) dinilai terhadap lowongan **Seed Full Stack Engineer** (`location: "Bandung"`, `workType: "REMOTE"`, `jobType: "FULL_TIME"`, `employmentType: "FULL_TIME"`, `skills: [{ "TypeScript", w=1 }, { "Express.js", w=2 }, { "PostgreSQL", w=3 }]`):
    1. $\text{totalWeight} = 1 + 2 + 3 = 6$. Skill yang cocok di tabel `CandidateSkill` adalah `"TypeScript"` ($w_1 = 1$). Maka $\text{coverage} = \frac{1}{6} \approx 0.1667$, sehingga $S_{\text{skill}} = \frac{1}{6} \times 50 = 8.3333$.
    2. Lokasi kandidat `"bandung"` cocok dengan lokasi lowongan `"bandung"` $\implies S_{\text{location}} = 20$.
    3. `mobilityPreference` `"hybrid"` dibandingkan dengan `workType` `"remote"` dan `jobType` `"full_time"` $\implies$ tidak cocok $\implies S_{\text{workType}} = 0$.
    4. Kata kunci pengalaman: `["seed full stack engineer", "full_time", "full_time", "typescript", "express.js", "postgresql"]` (6 kata kunci; pembagi $= \min(6, 3) = 3$). Di dalam `expText`, kata `"postgresql"` ditemukan sebagai substring ($|\text{matchedKeywords}| = 1$). Maka $\text{experienceRatio} = \frac{1}{3}$, dan $S_{\text{experience}} = \frac{1}{3} \times 15 = 5$.
    5. Total sebelum pembulatan $= 8.3333 + 20 + 0 + 5 = 33.3333 \implies \text{round}(33.3333) = \mathbf{33}$.
- **Kesesuaian Hasil Manual dengan Hasil Aplikasi:** **100% Sesuai** dengan fungsi `computeMatchScore` di `src/modules/scoring/scoring.service.ts` baris 69–171. *(Catatan ketidaksesuaian dokumentasi lama: dokumen Sprint 2B sempat menyebutkan bobot 60/25/15 dengan multiplier level skill, padahal kode aktual menggunakan 50/20/15/15 tanpa multiplier level).*
- **Keterbatasan:**
  - Pencocokan nama skill pada `computeMatchScore` menggunakan kesamaan string langsung (`normalized(skillName)`) tanpa sinonim/kanonikalisasi (berbeda dengan modul Skill Gap yang sudah memiliki kanonikalisasi `nodejs` / `postgresql`).
  - Tingkat kemahiran skill (`BEGINNER`, `INTERMEDIATE`, `ADVANCED`) belum memengaruhi skor.
- **Potensi Bias & Validitas Rekomendasi:**
  - Jika lowongan tidak memiliki daftar `JobSkill` sama sekali (`job.skills.length === 0`), rumus memberikan `coverage = 1` (50 poin penuh pada komponen skill), yang dapat menyebabkan inflasi skor pada lowongan yang deskripsi skill-nya belum diisi lengkap oleh recruiter.

---

### 6.2 Algoritma 2 — Candidate Score (Internal Recruiter & Admin)
- **File Sumber:** `src/modules/scoring/scoring.service.ts` (`computeCandidateScore`)
- **Tujuan:** Memberikan skor evaluasi internal (`0–100`) khusus bagi Recruiter dan Admin untuk memprioritaskan pelamar pada pipeline seleksi berdasarkan kecocokan AI, kelengkapan profil, pemenuhan skill wajib, dan status keaktifan akun.
- **Input:**
  1. Hasil `computeMatchScore(candidate, job)` (`matchScore.score`).
  2. Data Kandidat (`Candidate` & `User`): `fullName`, `phone`, `location`, `education`, `experienceSummary`, `salaryExpectation`, `mobilityPreference`, `skills`, dan `user.isActive`.
  3. Daftar `job.skills` (khususnya yang memiliki `required: true`).
- **Proses & Rumus Aktual yang Digunakan:**
  1. **Komponen 1 — Kontribusi AI Match Score ($C_{\text{match}}$, Bobot Maksimal = 50):**
     $$C_{\text{match}} = \left(\frac{\text{AI Match Score}}{100}\right) \times 50$$
  2. **Komponen 2 — Kelengkapan Profil ($C_{\text{profile}}$, Bobot Maksimal = 20):**
     - Memeriksa 8 indikator boolean: `Boolean(fullName)`, `Boolean(phone)`, `Boolean(location)`, `Boolean(education)`, `Boolean(experienceSummary)`, `salaryExpectation !== null && salaryExpectation !== undefined`, `Boolean(mobilityPreference)`, dan `skills.length > 0`.
     - $$\text{profileCompleteness} = \frac{\text{jumlah indikator bernilai true}}{8}$$
     - $$C_{\text{profile}} = \text{profileCompleteness} \times 20$$
  3. **Komponen 3 — Cakupan Skill Wajib ($C_{\text{reqSkill}}$, Bobot Maksimal = 20):**
     - Menyaring $\text{requiredSkills} = \text{job.skills.filter}(s \to s.\text{required})$.
     - Jika $|\text{requiredSkills}| = 0$, maka $\text{requiredSkillCoverage} = 1$. Jika $> 0$, maka:
       $$\text{requiredSkillCoverage} = \frac{|\{s \in \text{requiredSkills} \mid \text{normalized}(s.\text{skillName}) \in \text{candidateSkills}\}|}{|\text{requiredSkills}|}$$
     - $$C_{\text{reqSkill}} = \text{requiredSkillCoverage} \times 20$$
  4. **Komponen 4 — Risiko Verifikasi Dasar ($C_{\text{verify}}$, Bobot Maksimal = 10):**
     $$C_{\text{verify}} = \begin{cases} 10 & \text{jika } \text{candidate.user.isActive} = \text{true} \\ 0 & \text{jika tidak aktif} \end{cases}$$
  5. **Skor Akhir (`clampScore`):**
     $$\text{Candidate Score} = \text{clamp}_{[0, 100]}\left(\text{round}\left(C_{\text{match}} + C_{\text{profile}} + C_{\text{reqSkill}} + C_{\text{verify}}\right)\right)$$
- **Bobot:**
  - AI Match Score Contribution: **50%** (50 poin)
  - Profile Completeness: **20%** (20 poin)
  - Required Skill Coverage: **20%** (20 poin)
  - Basic Verification / Active Status: **10%** (10 poin)
- **Output:** `{ score: number (0..100), explanation: string, breakdown: { matchScore, profileCompleteness, requiredSkillCoverage, verificationRiskBasic }, ruleVersion: "mvp-rule-v1", matchScore }`.
- **Contoh Perhitungan Manual:**
  - Melanjutkan contoh di atas di mana $\text{AI Match Score} = 33$, profil kandidat memiliki 8 dari 8 field terisi ($\text{profileCompleteness} = \frac{8}{8} = 1$), lowongan memiliki 3 skill wajib (`TypeScript`, `Express.js`, `PostgreSQL`) dan kandidat memiliki 1 di antaranya ($\text{requiredSkillCoverage} = \frac{1}{3}$), serta `user.isActive = true`:
    1. $C_{\text{match}} = \frac{33}{100} \times 50 = 16.5$
    2. $C_{\text{profile}} = 1.0 \times 20 = 20.0$
    3. $C_{\text{reqSkill}} = \frac{1}{3} \times 20 = 6.6667$
    4. $C_{\text{verify}} = 10.0$
    5. Total $= 16.5 + 20.0 + 6.6667 + 10.0 = 53.1667 \implies \text{round}(53.1667) = \mathbf{53}$.
- **Kesesuaian Hasil Manual dengan Hasil Aplikasi:** **100% Sesuai** dengan `computeCandidateScore` di `src/modules/scoring/scoring.service.ts` baris 173–243.
- **Keterbatasan:**
  - Komponen `verificationRiskBasic` saat ini hanya memeriksa status aktif akun (`user.isActive`) dan belum mengurangi skor secara langsung berdasarkan skor kasus `FraudCase` yang sedang `OPEN`.
- **Potensi Bias & Validitas Rekomendasi:**
  - Keahlian wajib (`requiredSkills`) dihitung dua kali (di dalam `AI Match Score` dan di dalam `requiredSkillCoverage`), sehingga pelamar yang menuliskan nama skill dengan ejaan berbeda dari lowongan akan terdampak ganda. Namun, pemisahan visibilitas (`CandidateScore` hanya untuk Recruiter/Admin dan diblokir `403` bagi Candidate) sudah berjalan dengan benar.

---

### 6.3 Algoritma 3 — Skill Gap Prioritization
- **File Sumber:** `src/modules/candidates/candidateDevelopment.service.ts` (`calculateSkillGap`)
- **Tujuan:** Mengidentifikasi keterampilan yang belum dimiliki kandidat untuk mencapai target peran karier atau lowongan tertentu, lalu mengurutkannya berdasarkan prioritas kebutuhan dan permintaan pasar kerja aktual di platform.
- **Input:**
  1. `candidate.skills` (daftar skill yang dimiliki kandidat).
  2. Opsional `jobId` (mengambil `job.skills` dari lowongan `PUBLISHED`) atau `targetRole` (mengambil daftar skill standar dari kamus `targetRoleSkills` untuk 6 peran: `backend engineer`, `frontend engineer`, `full stack engineer`, `data analyst`, `machine learning engineer`, `ui ux designer`; default ke `backend engineer`).
  3. Data agregasi pasar kerja dari tabel `JobSkill` pada seluruh lowongan berstatus `PUBLISHED` (`prisma.jobSkill.groupBy`).
- **Proses & Rumus Aktual yang Digunakan:**
  1. **Kanonikalisasi Nama Skill (`canonicalSkill`):**
     - Mengubah ke huruf kecil, memetakan alias (`expressjs -> express`, `node / nodejs -> nodejs`, `postgres / postgresql -> postgresql`, `uiux / uxui -> uiux`), dan menghapus karakter non-alfanumerik.
  2. **Pemisahan `matchedSkills` vs `missingSkills`:**
     - Setiap skill target dibandingkan terhadap himpunan `canonicalSkill` milik kandidat. Jika tidak ditemukan, dimasukkan ke `missingSkills`.
  3. **Perhitungan Skor Prioritas (`priorityScore`):**
     - Untuk setiap skill di `missingSkills`, dihitung `marketDemandCount` (jumlah kemunculan skill tersebut pada lowongan `PUBLISHED` di database).
     - $$\text{priorityScore} = (\text{required} ? 100 : 50) + (\max(\text{weight}, 1) \times 10) + (\text{marketDemandCount} \times 5)$$
  4. Daftar `prioritySkills` diurutkan secara menurun (*descending*) berdasarkan `priorityScore`, lalu secara alfabetis (`localeCompare`) jika skor sama.
- **Bobot:**
  - Status Wajib (`required`): **100 poin** (wajib) atau **50 poin** (opsional)
  - Bobot Skill pada Lowongan/Peran (`weight`): **$\times 10$ poin** per unit bobot
  - Permintaan Pasar (`marketDemandCount`): **$\times 5$ poin** per lowongan aktif yang membutuhkan skill tersebut
- **Output:** Objek `SkillGapReport` berisi `ownedSkills`, `matchedSkills`, `missingSkills`, `prioritySkills` (beserta `priorityScore` dan array `reason`), dan `summary`.
- **Contoh Perhitungan Manual:**
  - Kandidat memiliki skill `["TypeScript"]` dan memilih target peran `"Backend Engineer"` (daftar target default dengan `required: true, weight: 1`: `Node.js`, `Express`, `TypeScript`, `SQL`, `PostgreSQL`).
  - Misalkan di database terdapat 2 lowongan `PUBLISHED`: Lowongan A membutuhkan `["TypeScript", "Node.js", "Prisma"]` dan Lowongan B membutuhkan `["TypeScript", "Express.js", "PostgreSQL"]`.
  - Maka:
    - `matchedSkills`: `["TypeScript"]`
    - `missingSkills`: `["Node.js", "Express", "SQL", "PostgreSQL"]`
    - Permintaan pasar (`marketDemandCount` setelah kanonikalisasi):
      - `Node.js` (`nodejs`): muncul di 1 lowongan $\implies \text{priorityScore} = 100 + (1 \times 10) + (1 \times 5) = \mathbf{115}$
      - `Express` (`express`, cocok dengan `Express.js`): muncul di 1 lowongan $\implies \text{priorityScore} = 100 + 10 + 5 = \mathbf{115}$
      - `PostgreSQL` (`postgresql`): muncul di 1 lowongan $\implies \text{priorityScore} = 100 + 10 + 5 = \mathbf{115}$
      - `SQL` (`sql`): muncul di 0 lowongan $\implies \text{priorityScore} = 100 + (1 \times 10) + (0 \times 5) = \mathbf{110}$
    - Urutan `prioritySkills`: `Express` (115), `Node.js` (115), `PostgreSQL` (115), `SQL` (110).
- **Kesesuaian Hasil Manual dengan Hasil Aplikasi:** **100% Sesuai** dengan `calculateSkillGap` di `src/modules/candidates/candidateDevelopment.service.ts` baris 190–298.
- **Keterbatasan:**
  - Kamus `targetRoleSkills` tanpa `jobId` hanya mencakup 6 peran teknologi standar; jika pengguna memasukkan nama peran di luar keenam peran tersebut tanpa `jobId`, sistem melakukan fallback ke daftar skill `backend engineer`.
  - Belum menggunakan algoritma *FP-Growth* untuk menemukan asosiasi ko-okurensi antar-skill secara dinamis.
- **Potensi Bias & Validitas Rekomendasi:**
  - Karena status `required: true` memberikan tambahan tetap 50 poin dibanding `required: false`, skill opsional baru bisa melampaui skill wajib apabila muncul di lebih dari 10 lowongan aktif ($\Delta \text{marketDemandCount} \ge 10$). Hal ini valid untuk memprioritaskan persyaratan wajib pekerjaan terlebih dahulu.

---

### 6.4 Algoritma 4 — Training Recommendation
- **File Sumber:** `src/modules/candidates/candidateDevelopment.service.ts` (`getTrainingRecommendations`)
- **Tujuan:** Merekomendasikan hingga 3 kursus pelatihan terbaik untuk setiap *priority skill gap* kandidat agar kandidat dapat menutup kekurangan kompetensinya secara terarah.
- **Input:**
  1. Hasil `calculateSkillGap` (`prioritySkills` dan `missingSkills`).
  2. Seluruh katalog kursus di tabel `Course` (`id`, `title`, `provider`, `skillTargets`, `duration`, `price`, `difficulty`, `language`, `url`).
- **Proses & Rumus Aktual yang Digunakan:**
  1. Untuk setiap `prioritySkill` pada `gap.prioritySkills`:
     - Menyaring kursus yang memiliki minimal satu elemen `course.skillTargets` yang cocok secara kanonik (`canonicalSkill`) dengan `prioritySkill.skillName`.
  2. Untuk setiap kursus yang cocok, dihitung:
     - $\text{matchedSkillTargets}$: daftar `skillTargets` pada kursus yang sama dengan `prioritySkill`.
     - $\text{gapCoverage}$: jumlah `skillTargets` pada kursus yang termasuk di dalam himpunan seluruh `missingSkills` kandidat.
     - $$\text{courseScore} = (|\text{matchedSkillTargets}| \times 10) + \text{gapCoverage}$$
  3. Kursus diurutkan berdasarkan:
     - `courseScore` tertinggi (*descending*), kemudian
     - `difficultyRank(course.difficulty)` terendah (*ascending*: `BEGINNER`/`BASIC` $= 1$, `INTERMEDIATE` $= 2$, `ADVANCED` $= 3$, lainnya $= 4$) agar kandidat diarahkan dari tingkat dasar terlebih dahulu.
  4. Mengambil maksimal 3 kursus teratas (`slice(0, 3)`) per `prioritySkill`.
- **Bobot:**
  - Kecocokan langsung dengan skill prioritas (`matchedSkillTargets.length`): **$\times 10$ poin**
  - Cakupan multi-skill terhadap seluruh skill gap kandidat (`gapCoverage`): **$+ 1$ poin** per skill gap tambahan yang tercakup
  - Tie-breaker: Tingkat kesulitan terendah (`BEGINNER` $\to$ `INTERMEDIATE` $\to$ `ADVANCED`)
- **Output:** `{ jobId, targetRole, summary, recommendations: Array<{ prioritySkill, recommendedCourses, reason }> }`.
- **Contoh Perhitungan Manual:**
  - Misalkan kandidat memiliki `missingSkills = ["Node.js", "Express"]` dan sistem sedang mencari kursus untuk `prioritySkill = "Node.js"`.
  - Di katalog terdapat:
    - Kursus A (`Node.js API Development`, `difficulty: "INTERMEDIATE"`, `skillTargets: ["Node.js", "JavaScript"]`):
      - $|\text{matchedSkillTargets}| = 1$ (`Node.js`), $\text{gapCoverage} = 1$ (`Node.js` ada di `missingSkills`).
      - $\text{courseScore} = (1 \times 10) + 1 = \mathbf{11}$, `difficultyRank` $= 2$.
    - Kursus B (`Express REST API Basic`, `difficulty: "BEGINNER"`, `skillTargets: ["Express", "Node.js"]`):
      - $|\text{matchedSkillTargets}| = 1$ (`Node.js`), $\text{gapCoverage} = 2$ (`Express` dan `Node.js` keduanya ada di `missingSkills`).
      - $\text{courseScore} = (1 \times 10) + 2 = \mathbf{12}$, `difficultyRank` $= 1$.
  - Maka Kursus B (skor 12, Beginner) ditempatkan di peringkat 1, diikuti Kursus A (skor 11, Intermediate) di peringkat 2.
- **Kesesuaian Hasil Manual dengan Hasil Aplikasi:** **100% Sesuai** dengan `getTrainingRecommendations` di `src/modules/candidates/candidateDevelopment.service.ts` baris 367–436.
- **Keterbatasan:**
  - Belum memperhitungkan kursus yang sudah diselesaikan (`COMPLETED`) oleh kandidat untuk dikecualikan dari rekomendasi baru.
- **Potensi Bias & Validitas Rekomendasi:**
  - Tie-breaker yang mengutamakan `BEGINNER` valid bagi kandidat yang belum memiliki skill sama sekali (`level = 0%`), namun bagi kandidat menengah yang ingin meningkatkan keahlian lanjutan, kursus `BEGINNER` tetap muncul lebih dulu jika `courseScore`-nya sama.

---

### 6.5 Algoritma 5 — CV Skill Extraction
- **File Sumber:** `src/modules/candidates/candidateCvParser.service.ts` (`parseCandidateCvBuffer`)
- **Tujuan:** Mengekstrak teks dan mendeteksi daftar keahlian teknis secara otomatis dari dokumen CV kandidat berformat `.pdf` atau `.docx` yang diunggah.
- **Input:**
  1. `buffer: Buffer` (isi biner file CV maksimal 5 MB).
  2. `fileName: string` dan `mimeType: string` (`.pdf` atau `.docx`).
- **Proses & Rumus Aktual yang Digunakan:**
  1. **Ekstraksi Teks Mentah:**
     - **PDF (`extractPdfText`):** Mendekompresi aliran objek `FlateDecode` menggunakan `zlib.inflateSync` / `inflateRawSync`, mengekstrak string literal PDF di dalam tanda kurung `(...)`, serta menggabungkannya dengan token ASCII dari buffer mentah.
     - **DOCX (`extractDocxText`):** Membaca struktur *Local File Header* ZIP (`0x04034b50`), mencari entri `word/document.xml`, mendekompresi payload deflate, mengonversi tag paragraf `</w:p>` menjadi baris baru, dan menghapus seluruh tag XML `<...>`.
  2. **Normalisasi & Pemangkasan (`normalizeExtractedText`):**
     - Menghapus karakter kontrol non-cetak dan memotong panjang teks maksimal hingga `MAX_PARSED_TEXT_LENGTH = 20000` karakter.
  3. **Validasi Keterbacaan Teks:**
     - Jika panjang teks $< 10$ karakter atau tidak mengandung huruf alfabet (`!/[a-zA-Z]{2,}/.test(parsedText)`), status ditetapkan menjadi `ParsingStatus.NEED_REVIEW` dengan `extractedSkills: []`.
  4. **Pencocokan Kamus Regex (`extractSkillsFromText`):**
     - Mencocokkan teks terhadap kamus statis `skillMatchers` yang berisi **12 keahlian**:
       1. `JavaScript` (`/\b(javascript|js)\b/i`)
       2. `TypeScript` (`/\b(typescript|ts)\b/i`)
       3. `React` (`/\b(react|reactjs|react\.js)\b/i`)
       4. `Node.js` (`/\b(node\.js|nodejs)\b/i`)
       5. `Express` (`/\b(express|expressjs|express\.js)\b/i`)
       6. `Python` (`/\bpython\b/i`)
       7. `SQL` (`/\bsql\b/i`)
       8. `PostgreSQL` (`/\b(postgresql|postgres)\b/i`)
       9. `Figma` (`/\bfigma\b/i`)
       10. `UI/UX` (`/\b(ui\/ux|ui ux|ux design|ui design)\b/i`)
       11. `Data Analysis` (`/\b(data analysis|data analytics|analis data)\b/i`)
       12. `Machine Learning` (`/\b(machine learning|ml)\b/i`)
     - Setiap skill yang cocok diberi nilai tetap:
       $$\text{confidenceScore} = 70, \quad \text{source} = \text{"CV\_PARSER"}$$
- **Bobot / Parameter Skor:**
  - Ambang batas panjang teks minimum: **10 karakter**
  - Batas maksimum teks yang diproses: **20.000 karakter**
  - Skor kepercayaan (`confidenceScore`) untuk setiap kecocokan regex: **Konstan 70** (dari skala 100)
- **Output:** `{ parsingStatus: "SUCCESS" | "NEED_REVIEW" | "FAILED", parsedText, extractedSkills: Array<{ skillName, source: "CV_PARSER", confidenceScore: 70 }>, extractedEducation, extractedExperience }`.
- **Contoh Perhitungan Manual:**
  - Kandidat mengunggah file DOCX berisi teks: `"Lulusan S1 Teknik Informatika Universitas Padjadjaran. Memiliki 2 tahun pengalaman membuat aplikasi web dengan React.js, TypeScript, dan database PostgreSQL."`
  - Proses:
    1. Teks memiliki panjang $> 10$ karakter dan mengandung huruf alfabet $\implies$ lanjut ke ekstraksi.
    2. Pencocokan regex terhadap 12 entri `skillMatchers`:
       - `TypeScript` cocok dengan `"TypeScript"` $\implies \{ \text{skillName: "TypeScript"}, \text{source: "CV\_PARSER"}, \text{confidenceScore: 70} \}$
       - `React` cocok dengan `"React.js"` $\implies \{ \text{skillName: "React"}, \text{source: "CV\_PARSER"}, \text{confidenceScore: 70} \}$
       - `PostgreSQL` cocok dengan `"PostgreSQL"` $\implies \{ \text{skillName: "PostgreSQL"}, \text{source: "CV\_PARSER"}, \text{confidenceScore: 70} \}$
    3. `extractedEducation`: baris `"Lulusan S1 Teknik Informatika Universitas Padjadjaran."` cocok dengan regex `/\b(s1|s2|s3|d3|d4|sarjana|diploma|universitas|institut|politeknik|smk|sma|bachelor|master)\b/i`.
    4. `extractedExperience`: baris kedua cocok dengan regex `/\b(tahun|year|years|pengalaman|experience|intern|magang|engineer|developer|analyst|designer)\b/i`.
    5. `parsingStatus = "SUCCESS"`.
- **Kesesuaian Hasil Manual dengan Hasil Aplikasi:** **100% Sesuai** dengan `parseCandidateCvBuffer` di `src/modules/candidates/candidateCvParser.service.ts` baris 174–219.
- **Keterbatasan:**
  - Hanya mengenali 12 keahlian teknologi di dalam kamus `skillMatchers`; keahlian di luar daftar tersebut (misalnya `Docker`, `Golang`, `Laravel`, `Next.js`, `Prisma`, atau keahlian non-IT) belum diekstrak otomatis dari CV dan perlu ditambahkan secara manual oleh kandidat melalui tab **Skill** di halaman Profil.
  - PDF hasil pemindaian gambar (*scanned image PDF* tanpa layer teks) tidak dapat dibaca karena belum ada OCR, sehingga akan menghasilkan status `NEED_REVIEW`.
- **Potensi Bias & Validitas Rekomendasi:**
  - Token singkat seperti `\bts\b` atau `\bml\b` dapat memicu *false positive* jika muncul sebagai singkatan kata lain di dalam dokumen CV. Namun karena kandidat dapat menghapus skill hasil ekstraksi secara manual di halaman Profil (`DELETE /api/v1/candidates/me/skills/:id`), kandidat tetap memegang kendali penuh atas keakuratan profilnya.

---

## 7. Tindakan Manual yang Masih Diperlukan Sebelum Rilis

1. **Verifikasi Pengamanan Akun Administrator pada Database Production (`SEC-QA05-01`):**
   - Sesuai instruksi Sprint 2F Bagian 4.B1 (*"Jangan mengubah atau menonaktifkan akun Production secara otomatis. Catat kebutuhan rotasi kredensial atau penonaktifan akun lama sebagai tindakan manual yang harus diverifikasi sebelum rilis"*):
     - Masuk ke konsol Supabase Production (`gsjonnybomydrfhsdwcc`).
     - Nonaktifkan (`UPDATE "User" SET "isActive" = false WHERE email IN ('seed-admin@ravira.local', 'seed-candidate@ravira.local', 'seed-recruiter@ravira.local');`) atau hapus akun demo hasil seeding lama di Production.
     - Pastikan seluruh akun `ADMIN` dan `SUPER_ADMIN` yang sah di Production menggunakan kredensial unik yang kuat (bukan `Password123!`).
2. **Penyediaan File `.env.e2e` Lokal & Eksekusi Live Playwright E2E:**
   - Letakkan file `.env.e2e` yang mengarah ke database **Ravira-Development** (`rkftrtpcoymstbdtlfig`) di root workspace, kemudian jalankan `npm run test:e2e` untuk memverifikasi ke-31 skenario browser E2E secara live terhadap Supabase Development.

---

## 8. Final Decision

> ### **FINAL DECISION: `BLOCKED`**

**Alasan Keputusan (`Kriteria Keberhasilan Bagian 9 & 11`):**
1. Seluruh **3 Release Blocker kode (`SEC-QA05-01`, `BUG-QA05-01`, `BUG-QA05-02`) telah selesai diperbaiki 100% di level source code** dan telah lulus seluruh pengujian otomatis (**Backend: 80/80 PASS**, **Frontend Lint & Build: PASS**, **Frontend Vitest: 128/128 PASS**, **CLI Safety Gate Fail-Closed: PASS**).
2. Namun, sesuai aturan wajib Sprint 2F Bagian 11 poin 2 & 5:
   - *"Pengamanan akun administrator Production telah diverifikasi secara terpisah; jika belum, keputusan rilis tetap `BLOCKED`."*
   - *"Playwright E2E pada environment Development terisolasi lulus pada alur kritis."* (Pada workspace clone ini, file `.env.e2e` tidak tersedia secara lokal dan sesuai aturan tidak boleh dibuat/diubah secara sepihak oleh agen).
3. Begitu pemilik proyek selesai:
   - (a) memverifikasi penonaktifan/rotasi akun `seed-admin@ravira.local` pada database Production Supabase, dan
   - (b) menjalankan `npm run test:e2e` dengan `.env.e2e` lokal pada `Ravira-Development`,
   status proyek dapat langsung ditingkatkan menjadi **`READY FOR QA-06`**.
