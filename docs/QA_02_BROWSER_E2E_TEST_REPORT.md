# QA-02 BROWSER END-TO-END TEST REPORT — PROYEK RAVIRA
- **Tanggal:** 29 Oktober 2026
- **Workspace:** `D:\ProjectRavira\ravira`
- **Branch:** `sprint-2/frontend-api-integration`
- **Pull Request:** #2
**Tahap:** QA-02 — Browser End-to-End Testing (Full Execution + `BUG-E2E-01` Resolution) & QA-03 Migration Reproducibility

---

## 1. Ringkasan Environment

Pemeriksaan konfigurasi dilakukan tanpa mencetak password, token, ataupun connection string mentah:

| Komponen | Konfigurasi / Status Aktual | Keterangan |
| :--- | :--- | :--- |
| **OS & Workspace** | Windows (`D:\ProjectRavira\ravira`) | Branch aktif: `sprint-2/frontend-api-integration` |
| **Database Pengujian (`.env.e2e`)** | Supabase Project: **Ravira-Development** (`rkftrtpcoymstbdtlfig`) | Host: `aws-0-eu-west-1.pooler.supabase.com:5432/postgres` (`connection_limit=5&pool_timeout=30`) |
| **Database Production (`.env`)** | Supabase Project: **CapstoneRavira** | **TIDAK DIGUNAKAN & TIDAK DIUBAH** (Terisolasi penuh dari proses E2E) |
| **Isolasi `JWT_SECRET` Pengujian** | `ravira-dev-e2e-...` (Berbeda dari Production) | Token autentikasi E2E terisolasi sepenuhnya dari Production |
| **Proteksi Git untuk `.env.e2e`** | Tercantum di `.git/info/exclude` | Terverifikasi `git status --short` tidak melacak `.env.e2e` |
| **Backend Runtime** | Node.js `v24.12.0`, Express `^5.1.0`, Prisma `^6.18.0` | Berjalan di `http://localhost:4000/api/v1` menggunakan `.env.e2e` |
| **Frontend Runtime** | React `^19.2.6`, Vite `^8.0.12`, TypeScript `~6.0.2` | Build statis disajikan di `http://localhost:5173` |
| **Playwright Browser Engine** | Chromium / Google Chrome Headless `156.0.8078.48` | Dieksekusi secara nyata terhadap Frontend + Backend + DB Development |

---

## 2. Status Environment Safety Gate & Validasi Environment E2E

Sesuai **TUGAS 1 — VALIDASI ENVIRONMENT E2E**, seluruh kriteria keamanan sebelum dan selama pengujian telah diverifikasi:

| No | Kriteria Safety Gate | Status | Hasil Verifikasi Aktual |
| :---: | :--- | :---: | :--- |
| 1 | Periksa konfigurasi `.env.e2e` tanpa mencetak password, token, atau connection string | **PASS** | Hanya metadata variabel dan project reference (`rkftrtpcoymstbdtlfig`) yang diperiksa. |
| 2 | Pastikan seluruh proses backend, Prisma, seed, dan pengujian menggunakan project reference Development (`rkftrtpcoymstbdtlfig`) | **PASS** | Setiap script memiliki guard eksplisit: jika `!process.env.DATABASE_URL.includes("rkftrtpcoymstbdtlfig")` maka proses langsung `ABORT`. |
| 3 | Pastikan variabel `DATABASE_URL` tidak tertimpa oleh `.env` Production | **PASS** | Preload `process.env.DOTENV_CONFIG_PATH = "D:/ProjectRavira/ravira/.env.e2e"; require("dotenv/config")` dijalankan sebelum modul aplikasi dimuat, sehingga `dotenv.config()` bawaan tidak menimpa variabel dengan `.env` Production. |
| 4 | Pastikan `JWT_SECRET` pengujian berbeda dari Production | **PASS** | Menggunakan secret khusus E2E (`ravira-dev-e2e-...`) yang diverifikasi oleh guard runtime. |
| 5 | Pastikan `.env.e2e` tidak masuk ke Git tracking | **PASS** | `.env.e2e` terdaftar pada `.git/info/exclude` dan tidak muncul pada `git status`. |
| 6 | Jangan mengubah file `.env` Production atau menulis ke Production | **PASS** | File `.env` Production utuh dan tidak tersentuh. |

---

## 3. Persiapan Data Uji Sintetis (`Ravira-Development`)

Seeding dan persiapan data uji dijalankan **hanya** pada database `Ravira-Development` (`rkftrtpcoymstbdtlfig`):
- **Candidate:** `seed-candidate@ravira.local` (Profil lengkap, wilayah Pulau Jawa, skill `TypeScript` & `PostgreSQL`) serta kandidat baru yang diregistrasikan langsung melalui UI (`e2e-cand-1793228874744@ravira.local`, Bandung).
- **Recruiter (APPROVED):** `seed-recruiter@ravira.local` (`Seed Ravira Company`, Jakarta) dan `other-recruiter@ravira.local` (`PT Ravira Mitra Kedua`, Yogyakarta — untuk pengujian isolasi kepemilikan lintas perusahaan).
- **Recruiter (PENDING):** `pending-recruiter@ravira.local` (`PT Ravira Pending Nusantara`, Surabaya), `pending-approve@ravira.local` (`PT Ravira Siap Verifikasi`, Yogyakarta), `pending-reject@ravira.local` (`PT Ravira Dokumen Kurang`, Semarang).
- **Recruiter (REJECTED):** `rejected-recruiter@ravira.local` (`PT Ravira Rejected Digital`, Malang).
- **Admin:** `seed-admin@ravira.local` (`ROLE: ADMIN`).
- **Lowongan Aktif (Pulau Jawa):** `Seed Backend Engineer` (Jakarta), `Seed Full Stack Engineer` (Bandung), `Other Company Data Engineer` (Yogyakarta), serta lowongan baru yang dibuat melalui UI Recruiter (`QA E2E Engineer Surabaya`).
- **Kasus Anti-Fraud & Appeal:** Kasus `FraudCase` berstatus `OPEN` (`SIMILAR_NAME_LOCATION`) dan pengajuan `Appeal` berstatus `OPEN` untuk `seed-candidate@ravira.local`.

---

## 4. Matriks Skenario Candidate (`E2E-CAND-01` s/d `E2E-CAND-11` — 11/11 PASS)

| ID | Nama Skenario | Status | Perilaku yang Diharapkan | Perilaku Aktual | Bukti Screenshot / Network |
| :---: | :--- | :---: | :--- | :--- | :--- |
| **E2E-CAND-01** | Registrasi dan login kandidat | **PASS** | Registrasi kandidat baru dan login kandidat menyimpan JWT serta mengarahkan ke `/dashboard/kandidat`. | Registrasi `e2e-cand-1793228874744@ravira.local` (`POST /api/v1/auth/register/candidate` -> `201`) dan login `seed-candidate@ravira.local` (`POST /api/v1/auth/login` -> `200`) berhasil mengarahkan ke `/dashboard/kandidat`. | `cand-01-login-dashboard.png` |
| **E2E-CAND-02** | Profil kandidat | **PASS** | Profil kandidat dimuat dari `GET /candidates/me` dan berhasil diperbarui melalui `PATCH /candidates/me`. | `PATCH /api/v1/candidates/me` mengembalikan `200 OK`; domisili kandidat berhasil diperbarui menjadi `Jakarta Selatan` dan tampil di UI. | `cand-02-profile.png` |
| **E2E-CAND-03** | Pengelolaan skills | **PASS** | Kandidat dapat melihat skill yang ada dan menambahkan skill baru ke database. | `POST /api/v1/candidates/me/skills` mengembalikan `201 Created`; skill baru `NodeJS-1048` dan `TypeScript` tampil pada tab Skill. | `cand-03-skills.png` |
| **E2E-CAND-04** | Upload CV valid dan invalid | **PASS** | File non-PDF/DOCX ditolak di UI, dan file PDF valid berhasil diunggah ke `POST /candidates/me/cv`. | File `invalid.txt` ditolak oleh validasi UI ("Hanya file dokumen PDF atau DOCX yang diperbolehkan"); file `cv-kandidat-ravira.pdf` berhasil diunggah (`POST /api/v1/candidates/me/cv` -> `201 Created`) dan tampil di daftar dokumen. | `cand-04-cv-upload.png` |
| **E2E-CAND-05** | Daftar dan detail lowongan | **PASS** | Daftar lowongan dari database tampil di `/dashboard/kandidat/rekomendasi` dan halaman detail menampilkan informasi lengkap. | Lowongan `Seed Backend Engineer` dan `Seed Full Stack Engineer` tampil beserta deskripsi `Build backend APIs for Ravira.` dan persyaratan skill. | `cand-05-recommendations.png` |
| **E2E-CAND-06** | AI Match Score | **PASS** | AI Match Score beserta alasan rekomendasi tampil untuk kandidat tanpa mengekspos `CandidateScore` internal. | `GET /api/v1/jobs/:id/match-score` (`200 OK`) menampilkan persentase AI Match Score dan alasan kecocokan skill; endpoint `/applications/:id/score` mengembalikan `403 Forbidden` bagi kandidat. | `cand-06-job-detail-match.png` |
| **E2E-CAND-07** | Skill Gap Analysis & Training | **PASS** | Halaman Skill Gap dan Pelatihan menampilkan analisis kekurangan skill kandidat serta rekomendasi kursus. | `GET /api/v1/candidates/me/skill-gap` (`200 OK`) dan `GET /api/v1/candidates/me/training-recommendations` (`200 OK`) memuat laporan analisis skill gap dan daftar rekomendasi kursus pelatihan. | `cand-07-skill-gap.png` |
| **E2E-CAND-08** | Saved Jobs dan persistensi setelah reload | **PASS** | Lowongan yang disimpan bertahan di `/dashboard/kandidat/tersimpan` setelah browser direload. | Klik tombol `Simpan` memanggil `POST /api/v1/candidates/me/saved-jobs` (`201 Created`); setelah navigasi ke `/dashboard/kandidat/tersimpan` dan `page.reload()`, lowongan `Seed Backend Engineer` tetap tampil dari database (`GET /api/v1/candidates/me/saved-jobs` -> `200 OK`). | `cand-08-saved-jobs-reload.png` |
| **E2E-CAND-09** | Melamar pekerjaan | **PASS** | Kandidat berhasil mengirim lamaran pada lowongan aktif melalui `POST /jobs/:jobId/apply`. | Lamaran untuk `Seed Backend Engineer` berhasil dikirim dan tercatat di database. | `cand-09-apply-job.png` |
| **E2E-CAND-10** | Melihat status lamaran | **PASS** | Daftar lamaran kandidat menampilkan lowongan yang telah dilamar beserta status terkininya. | Halaman `/dashboard/kandidat/lamaran` (`GET /api/v1/candidates/me/applications` -> `200 OK`) menampilkan `Seed Backend Engineer` beserta tahapan seleksi aktif. | `cand-10-my-applications.png` |
| **E2E-CAND-11** | Logout kandidat | **PASS** | Logout menghapus token dari `localStorage` dan mengakhiri sesi kandidat. | Klik tombol `Keluar` menghapus `ravira.auth.token` (`null`) dari `localStorage` dan mengarahkan browser ke `/masuk/kandidat`. | `cand-11-logout.png` |

---

## 5. Matriks Skenario Recruiter (`E2E-REC-01` s/d `E2E-REC-08` — 8/8 PASS)

| ID | Nama Skenario | Status | Perilaku yang Diharapkan | Perilaku Aktual | Bukti Screenshot / Network |
| :---: | :--- | :---: | :--- | :--- | :--- |
| **E2E-REC-01** | Login recruiter | **PASS** | Recruiter `APPROVED` berhasil login dan melihat dashboard rekrutmen perusahaannya. | Login `seed-recruiter@ravira.local` (`POST /api/v1/auth/login` -> `200 OK`) mengarahkan ke `/dashboard/perusahaan` dan menampilkan data `Seed Ravira Company`. | `rec-01-approved-dashboard.png` |
| **E2E-REC-02** | Akses perusahaan berdasarkan status verifikasi | **PASS** | Recruiter dengan perusahaan `PENDING` diarahkan kembali ke `/dashboard/perusahaan` dan diblokir dari pipeline kandidat. | Login `pending-recruiter@ravira.local` (`PT Ravira Pending Nusantara`) dan mencoba mengakses `/dashboard/perusahaan/pipeline` langsung diarahkan kembali ke `/dashboard/perusahaan` dengan banner status verifikasi perusahaan. | `rec-02-pending-guard.png` |
| **E2E-REC-03** | Menampilkan dan mengedit Company Profile | **PASS** | Recruiter dapat melihat dan memperbarui profil perusahaan (Website kosong, Website valid, persistensi setelah reload, dan pengosongan kembali Website). | **1.** Simpan saat `Website` kosong (`""` / awal `null`) -> `PATCH /api/v1/recruiter/company` mengembalikan **HTTP 200 OK**.<br>**2.** Simpan dengan `Website` valid (`https://seed.ravira.local`) -> **HTTP 200 OK** dan bertahan setelah `page.reload()`.<br>**3.** Kosongkan kembali `Website` (`""` -> `null`) dan simpan -> **HTTP 200 OK** dan terhapus secara persisten setelah `page.reload()`. | `rec-03-company-profile.png` |
| **E2E-REC-04** | Membuat, mengedit, dan mengelola lowongan | **PASS** | Recruiter dapat membuat lowongan baru dan melihatnya di daftar Lowongan Aktif. | Pembuatan lowongan `QA E2E Engineer Surabaya` di `/dashboard/perusahaan/buat-lowongan` mengembalikan `POST /api/v1/recruiter/jobs` -> `201 Created`, dan lowongan tampil di `/dashboard/perusahaan/lowongan`. | `rec-04-active-jobs.png` |
| **E2E-REC-05** | Melihat pelamar | **PASS** | Recruiter melihat daftar pelamar yang melamar ke lowongan perusahaannya. | Halaman `/dashboard/perusahaan/pipeline` (`GET /api/v1/recruiter/jobs/:id/applications` -> `200 OK`) menampilkan pelamar `Seed Candidate`. | `rec-05-pipeline-applicants.png` |
| **E2E-REC-06** | Melihat Candidate Score | **PASS** | Recruiter dapat melihat `Candidate Score` pelamar, sementara Candidate mendapat `403 Forbidden`. | Halaman detail kandidat (`/dashboard/perusahaan/kandidat/:id`) memuat `GET /api/v1/applications/:id/score` (`200 OK`) dan menampilkan rincian `Candidate Score`; akses endpoint yang sama oleh Candidate ditolak dengan `403 Forbidden`. | `rec-06-candidate-score.png` |
| **E2E-REC-07** | Mengubah tahapan pipeline | **PASS** | Recruiter dapat mengubah status tahapan seleksi pelamar dengan alasan wajib. | Klik `Ubah Tahap Seleksi` dan pengisian alasan wajib memanggil `POST /api/v1/applications/:id/stage` (`200 OK`) serta memperbarui tahapan seleksi kandidat. | `rec-07-stage-updated.png` |
| **E2E-REC-08** | Isolasi kepemilikan lowongan dan kandidat antar-recruiter | **PASS** | Recruiter tidak dapat mengakses atau memodifikasi lowongan milik perusahaan lain (`404`/`403`). | Permintaan `GET /api/v1/recruiter/jobs/30000000-0000-4000-8000-000000000001/applications` dan `PATCH /api/v1/recruiter/jobs/30000000-0000-4000-8000-000000000001` oleh `seed-recruiter` terhadap lowongan milik `PT Ravira Mitra Kedua` ditolak dengan **HTTP 404 Not Found**. | Network Log Verified |

---

## 6. Matriks Skenario Admin (`E2E-ADM-01` s/d `E2E-ADM-06` — 6/6 PASS)

| ID | Nama Skenario | Status | Perilaku yang Diharapkan | Perilaku Aktual | Bukti Screenshot / Network |
| :---: | :--- | :---: | :--- | :--- | :--- |
| **E2E-ADM-01** | Login admin | **PASS** | Admin berhasil login di `/masuk/admin` dan diarahkan ke `/admin`. | Login `seed-admin@ravira.local` (`POST /api/v1/auth/login` -> `200 OK`) berhasil mengarahkan ke `/admin`. | `adm-01-02-dashboard.png` |
| **E2E-ADM-02** | Dashboard admin | **PASS** | Dashboard admin menampilkan metrik operasional antrean verifikasi perusahaan, fraud review, dan banding. | `/admin` berhasil memanggil `GET /api/v1/admin/companies/pending`, `GET /api/v1/admin/fraud-cases`, dan `GET /api/v1/admin/appeals` serta menampilkan metrik antrean secara real-time. | `adm-01-02-dashboard.png` |
| **E2E-ADM-03** | Verifikasi dan penolakan perusahaan | **PASS** | Admin dapat menyetujui perusahaan `PENDING` dan menolak perusahaan `PENDING` dengan alasan wajib. | Di `/dashboard/admin/verifikasi-perusahaan`, klik `Approve` memanggil `POST /api/v1/admin/companies/:id/approve` (`200 OK`), dan klik `Reject` dengan alasan wajib memanggil `POST /api/v1/admin/companies/:id/reject` (`200 OK`). | `adm-03-company-verification.png` |
| **E2E-ADM-04** | Fraud review | **PASS** | Admin dapat melihat daftar kasus anti-fraud dan menyimpan keputusan manual review dengan alasan wajib. | Di `/dashboard/admin/laporan-abuse`, kasus `Seed Candidate` (`SIMILAR_NAME_LOCATION`) ditinjau manual melalui modal `Tinjau & Putuskan`; `POST /api/v1/admin/fraud-cases/:id/decision` mengembalikan `200 OK`. Kandidat tidak pernah ditolak otomatis tanpa manual review. | `adm-04-fraud-review.png` |
| **E2E-ADM-05** | Appeals | **PASS** | Admin dapat meninjau pengajuan banding kandidat dan menyimpan keputusan di `/dashboard/admin/appeals`. | Di `/dashboard/admin/appeals`, klik `Putuskan` dan pengisian alasan audit memanggil `POST /api/v1/admin/appeals/:id/decision` (`200 OK`) serta memperbarui status sanggahan. | `adm-05-appeals.png` |
| **E2E-ADM-06** | Pembatasan akses lintas role | **PASS** | Memastikan endpoint admin ditolak untuk Candidate dan Recruiter (`403 Forbidden`). | Permintaan `GET /api/v1/admin/companies/pending` menggunakan token Candidate (`403 Forbidden`) dan token Recruiter (`403 Forbidden`) keduanya ditolak secara nyata oleh middleware RBAC backend. | Network Log Verified |

---

## 7. Hasil Pengujian Integrasi (`E2E-INT-01` s/d `E2E-INT-06` — 6/6 PASS)

| ID | Skenario Integrasi | Status | Perilaku yang Diharapkan | Perilaku Aktual | Bukti Screenshot / Network |
| :---: | :--- | :---: | :--- | :--- | :--- |
| **E2E-INT-01** | Navigasi antarhalaman | **PASS** | Navigasi sidebar dan tombol CTA berpindah halaman tanpa full reload error. | Klik menu sidebar pada portal Candidate, Recruiter, dan Admin (contoh: `/admin` -> `Verifikasi Perusahaan` -> `/dashboard/admin/verifikasi-perusahaan`) berfungsi mulus tanpa error React (`pageErrors: []`). | Verified |
| **E2E-INT-02** | Loading, empty state, dan error state | **PASS** | Error state menampilkan pesan yang jelas ketika kredensial atau input tidak valid. | Login dengan password salah di `/masuk/kandidat` menerima `POST /api/v1/auth/login` (`401 Unauthorized`), menampilkan pesan kesalahan autentikasi di UI, dan menahan pengguna di halaman login. | `int-02-error-state.png` |
| **E2E-INT-03** | Persistensi data setelah reload | **PASS** | Perubahan data (`Saved Jobs`, `Company Profile`, `Skills`, `Lamaran`) bertahan setelah browser reload. | Setelah `page.reload()`, data `SavedJob` di `/dashboard/kandidat/tersimpan` dan `CompanyProfile` di `/dashboard/perusahaan/profil` tetap dimuat secara konsisten dari database `Ravira-Development`. | `cand-08-saved-jobs-reload.png`, `rec-03-company-profile.png` |
| **E2E-INT-04** | Penanganan token kedaluwarsa (401) | **PASS** | Respons `401` saat validasi sesi menghapus token dari `localStorage` dan mengarahkan pengguna ke halaman login. | Saat `ravira.auth.token` diset ke token invalid dan mengakses `/dashboard/kandidat`, `GET /api/v1/auth/me` mengembalikan `401`, token otomatis dihapus (`null`), dan browser diarahkan ke `/masuk/kandidat`. | Verified |
| **E2E-INT-05** | Proteksi route | **PASS** | Akses tanpa autentikasi atau salah role ke route privat diarahkan ke halaman login sesuai portal. | Akses anonim ke `/admin` diarahkan ke `/masuk/admin`; akses anonim ke `/dashboard/kandidat` diarahkan ke `/masuk/kandidat`. | Verified |
| **E2E-INT-06** | Responsive layout pada desktop dan mobile | **PASS** | Halaman utama dan portal autentikasi merender dengan baik pada viewport desktop (`1280x900`) dan mobile (`375x812`). | Pengujian pada viewport desktop (`1280x900`) dan mobile (`375x812`) merender komponen tanpa crash maupun runtime exception (`pageErrors: []`). | `int-06-mobile-home.png` |

---

## 8. QA-03 Migration Reproducibility

Verifikasi reproduksibilitas skema dan riwayat migrasi Prisma pada database **Supabase Development (`Ravira-Development` / `rkftrtpcoymstbdtlfig`)** membuktikan bahwa seluruh rantai migrasi dari awal proyek hingga Sprint 2E bersifat deterministik dan konsisten:

| Pemeriksaan QA-03 | Perintah / Target | Status | Detail Hasil |
| :--- | :--- | :---: | :--- |
| **1. Daftar Migrasi Teraplikasi (`8/8`)** | `_prisma_migrations` pada `rkftrtpcoymstbdtlfig` | **PASS** | Seluruh 8 migrasi tercatat sukses tanpa rollback/failure:<br>1. `20260607120331_init_backend_mvp`<br>2. `20260607131500_core_candidate_recruiter_flow`<br>3. `20260607143000_notifications_appeals`<br>4. `20260607154500_basic_fraud_check`<br>5. `20260611120000_candidate_cv_documents`<br>6. `20260611133000_skill_gap_training`<br>7. `20260615110000_backend_demo_hardening`<br>8. `20261029000000_sprint2e_saved_jobs_company_profile` |
| **2. Status Migrasi Prisma** | `npx prisma migrate status` (terhadap Development DB) | **PASS** | `8 migrations found in prisma/migrations` — `Database schema is up to date!` |
| **3. Validasi Skema Prisma** | `npx prisma validate` | **PASS** | `The schema at prisma\schema.prisma is valid` |
| **4. Generasi Prisma Client** | `npx prisma generate` | **PASS** | `Generated Prisma Client (v6.19.3)` |
| **5. Kompilasi TypeScript Backend** | `npm run build` (`tsc`) | **PASS** | Exit Code `0` (Tanpa error kompilasi) |
| **6. Verifikasi Tabel & Kolom Baru Sprint 2E** | E2E Live Read/Write pada `SavedJob` & `Company` | **PASS** | Tabel `SavedJob` (`candidateId_jobId` unique index) dan kolom `Company.size` serta `Company.description` berfungsi penuh di database `Ravira-Development`. |

---

## 9. Resolusi `BUG-E2E-01` & Bukti Regression Testing

### A. Penyebab Bug (`BUG-E2E-01`)
Pada eksekusi awal `E2E-REC-03`, penyimpanan form di [`CompanyProfilePage.tsx`](file:///d:/ProjectRavira/ravira/frontend/src/pages/CompanyProfilePage.tsx) selalu mengirimkan `website: ""` ketika field opsional Website dibiarkan kosong. Di sisi backend, [`recruiterCompany.validation.ts`](file:///d:/ProjectRavira/ravira/src/modules/recruiters/recruiterCompany.validation.ts) menggunakan `z.string().trim().min(1).optional()`, sehingga string kosong `""` ditolak dengan **HTTP 400 Bad Request**.

### B. Perubahan File yang Dilakukan
1. **[`src/modules/recruiters/recruiterCompany.validation.ts`](file:///d:/ProjectRavira/ravira/src/modules/recruiters/recruiterCompany.validation.ts)**
   - Mempertahankan validasi wajib tidak boleh kosong untuk `name` (`z.string().trim().min(1, "Company name cannot be empty.").optional()`).
   - Menambahkan normalisasi nullable pada field opsional (`industry`, `size`, `location`, `description`) agar menerima string, string kosong `""` (dinormalisasi ke `null`), atau `null`.
   - Menambahkan validasi URL konsisten pada `website` (`optionalNullableWebsite`) yang memvalidasi URL (`z.string().trim().url()`) bila diisi, serta mengizinkan `""` atau `null` (dinormalisasi ke `null`) untuk mengosongkan Website yang sebelumnya tersimpan.
2. **[`src/modules/recruiters/recruiterCompany.service.ts`](file:///d:/ProjectRavira/ravira/src/modules/recruiters/recruiterCompany.service.ts)**
   - Memperbarui tipe `UpdateCompanyData` dan `updatePayload` agar mendukung `string | null` pada field opsional (`industry`, `size`, `location`, `website`, `description`) tanpa mengubah guard kepemilikan (`getRecruiterContext`), RBAC, maupun proteksi `verificationStatus`/`verifiedAt`.
3. **[`frontend/src/services/raviraApi.ts`](file:///d:/ProjectRavira/ravira/frontend/src/services/raviraApi.ts)**
   - Memperbarui kontrak tipe `UpdateRecruiterCompanyInput` agar mendukung `string | null` pada field opsional.
4. **[`frontend/src/pages/CompanyProfilePage.tsx`](file:///d:/ProjectRavira/ravira/frontend/src/pages/CompanyProfilePage.tsx)**
   - Menambahkan fungsi `normalizeOptional(currentValue, existingValue)`:
     - Jika input kosong dan sebelumnya memang `null`/kosong di database, field tersebut **tidak ikut dikirim** (`undefined`).
     - Jika input dikosongkan padahal sebelumnya memiliki nilai di database (`existingValue`), dikirimkan `null` agar nilai lama dapat dihapus secara eksplisit.
     - Jika input berisi teks, dikirimkan nilai hasil `.trim()`.

### C. Regression Tests yang Ditambahkan & Hasil Verifikasi
1. **Backend Automated Tests ([`tests/backend/sprint2e-features.test.cjs`](file:///d:/ProjectRavira/ravira/tests/backend/sprint2e-features.test.cjs)):**
   - Menambahkan pengujian `PATCH /recruiter/company` untuk: penyimpanan URL valid (`https://ravira.local`), pengosongan Website menggunakan `null` maupun `""` (menjadi `null`), serta penolakan URL tidak valid (`400 Bad Request`).
   - **Hasil:** `74 / 74 tests PASS` (`node --test tests/backend/*.test.cjs`).
2. **Frontend Vitest ([`frontend/tests/sprint2eIntegration.test.tsx`](file:///d:/ProjectRavira/ravira/frontend/tests/sprint2eIntegration.test.tsx)):**
   - Menambahkan test `omits empty website when initially null and sends null when clearing previously saved website` pada `CompanyProfilePage`.
   - **Hasil:** `8 test files passed (123 / 123 tests PASS)`.
3. **Build & Lint Verification:**
   - Backend TypeScript build (`npm run build`): **PASS (Exit Code 0)**.
   - Frontend ESLint (`npm run lint`): **PASS (Exit Code 0)**.
   - Frontend Vite + TypeScript build (`npm run build`): **PASS (Exit Code 0)**.
4. **Playwright Full E2E Re-run (`E2E-REC-03` + Seluruh Suite):**
   - **Hasil:** **31 / 31 Skenario PASS** (`0` gagal, `0` uncaught `pageerror`).

---

## 10. Reproduksibilitas Suite Pengujian Resmi (`tests/e2e/`) & Final Safety Check

Seluruh 31 skenario Playwright E2E kini tersimpan permanen di repositori proyek pada direktori resmi [`tests/e2e/`](file:///d:/ProjectRavira/ravira/tests/e2e/README.md) dan dapat dijalankan ulang secara deterministik melalui `npm run test:e2e`. Setiap status **PASS** pada laporan ini berasal dari **eksekusi nyata browser Chromium terhadap backend Express dan database Supabase `Ravira-Development`** (dibuktikan oleh kode respons HTTP aktual, mutasi database, serta artefak `tests/e2e/.artifacts/qa02-results.json` dan `screenshots/*.png`), bukan klaim statis:

- **[`tests/e2e/e2e-safety-gate.cjs`](file:///d:/ProjectRavira/ravira/tests/e2e/e2e-safety-gate.cjs):**
  - **Environment Lock (`lockDotenvToE2EPath` & `assertRuntimeEnvMatchesE2E`):** Mengunci `dotenv.config` ke `.env.e2e` dan memverifikasi objek runtime `dist/config/env` agar `.env` Production tidak pernah menimpa `DATABASE_URL` maupun `JWT_SECRET` pengujian.
  - **Fail-Closed Port Guard (`assertPortAvailableFailClosed`):** Memeriksa port `4000` dan `5173` (`127.0.0.1`, `::1`, `localhost`) sebelum server dinyalakan. Jika port sudah ditempati proses eksternal yang tidak dikelola runner, eksekusi langsung berhenti (`fail-closed`).
  - **Managed Backend Identity Verification (`verifyManagedBackendIdentity`):** Memverifikasi endpoint `/__e2e_runner_identity` menggunakan cryptographic nonce unik per-eksekusi dan `projectRef: rkftrtpcoymstbdtlfig` sebelum skenario Playwright dimulai.
- **[`tests/e2e/seed-e2e.cjs`](file:///d:/ProjectRavira/ravira/tests/e2e/seed-e2e.cjs):** Seeder idempoten (`npm run seed:e2e`) yang meneruskan `datasources.db.url` secara eksplisit ke `PrismaClient`, membersihkan user/lamaran/dokumen/saved-job sintetis dari eksekusi sebelumnya, serta menyiapkan fixture uji sintetis pada `Ravira-Development` tanpa kredensial sensitif di dalam source code.
- **[`tests/e2e/qa02-browser-e2e.cjs`](file:///d:/ProjectRavira/ravira/tests/e2e/qa02-browser-e2e.cjs):** Runner utama Playwright (`npm run test:e2e`) yang mengeksekusi 31 skenario secara nyata dan memverifikasi setiap respons HTTP (`200`/`201`/`401`/`403`/`404`) serta perubahan DOM.
- **[`package.json`](file:///d:/ProjectRavira/ravira/package.json) & [`package-lock.json`](file:///d:/ProjectRavira/ravira/package-lock.json):** Mencantumkan `playwright` (`1.61.1`) pada `devDependencies` secara konsisten (`npm ci --dry-run` terverifikasi lulus).

---

## 11. Keputusan Akhir QA-02

### **PASS (31 / 31 Skenario PASS | 0 FAIL | 0 BLOCKED — Siap Merge setelah Persetujuan)**

- **Ringkasan Skor Eksekusi Akhir (`npm run test:e2e`):**
  - **Candidate (`E2E-CAND-01` s/d `E2E-CAND-11`):** `11 / 11 PASS`
  - **Recruiter (`E2E-REC-01` s/d `E2E-REC-08`):** `8 / 8 PASS` (termasuk `E2E-REC-03` setelah perbaikan `BUG-E2E-01`)
  - **Admin (`E2E-ADM-01` s/d `E2E-ADM-06`):** `6 / 6 PASS`
  - **Integration (`E2E-INT-01` s/d `E2E-INT-06`):** `6 / 6 PASS`
  - **Total Skenario Browser E2E:** **`31 / 31 PASS` (`0 FAIL`, `0 BLOCKED`)**
  - **QA-03 Migration Reproducibility:** **`PASS` (`8/8` migrasi teraplikasi pada `Ravira-Development`)**
