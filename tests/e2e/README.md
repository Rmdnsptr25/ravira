# RAVIRA — E2E Browser Test Suite (QA-02)

Direktori `tests/e2e/` berisi suite pengujian **End-to-End (E2E) Browser Playwright** resmi untuk platform **RAVIRA** yang mencakup **31 skenario** (`Candidate: 11`, `Recruiter: 8`, `Admin: 6`, `Integration: 6`).

---

## 1. Struktur File

| File | Deskripsi |
| :--- | :--- |
| `tests/e2e/e2e-safety-gate.cjs` | **Environment Safety Gate** yang memvalidasi `.env.e2e`, mengunci `dotenv.config` ke `.env.e2e`, memastikan koneksi database mengarah eksklusif ke project reference Development (`rkftrtpcoymstbdtlfig`), memblokir pola host/ref Production, memverifikasi isolasi `JWT_SECRET` (`ravira-dev-e2e-...`), serta menerapkan **fail-closed port check** pada port `4000` dan `5173`. |
| `tests/e2e/seed-e2e.cjs` | Script penyiapan & reset idempoten data sintetis E2E pada database `Ravira-Development` (akun Candidate, Recruiter `APPROVED`/`PENDING`/`REJECTED`, Admin, lowongan Pulau Jawa, kursus pelatihan, kasus `FraudCase`, dan `Appeal`). |
| `tests/e2e/qa02-browser-e2e.cjs` | Runner Playwright Chromium Headless yang memverifikasi port `4000` & `5173` bebas dari proses eksternal (fail-closed), menyalakan backend & frontend terkelola dengan verifikasi identitas nonce (`/__e2e_runner_identity`), menjalankan seluruh **31 skenario E2E**, dan menyimpan laporan JSON serta bukti tangkapan layar ke `tests/e2e/.artifacts/`. |

---

## 2. Prasyarat & Konfigurasi `.env.e2e`

1. Buat file `.env.e2e` di root proyek (`D:\ProjectRavira\ravira\.env.e2e`). File ini **diabaikan oleh Git** (`.gitignore` & `.git/info/exclude`) dan **tidak boleh** di-commit.
2. Isi `.env.e2e` dengan konfigurasi yang mengarah **hanya** ke database Supabase **Ravira-Development** (`rkftrtpcoymstbdtlfig`):

```env
NODE_ENV=development
PORT=4000
DATABASE_URL="<ISI_CONNECTION_STRING_SUPABASE_RAVIRA_DEVELOPMENT_rkftrtpcoymstbdtlfig>"
JWT_SECRET="ravira-dev-e2e-<ISI_SECRET_UNIK_KHUSUS_E2E>"
JWT_EXPIRES_IN="1d"
BCRYPT_SALT_ROUNDS=8
CORS_ORIGIN="*"
```

> **Mekanisme Keamanan Berlapis (Safety Gate & Fail-Closed):**
> 1. **Isolasi Database & JWT:** Jika `DATABASE_URL` (atau `DIRECT_URL`) tidak mengandung `rkftrtpcoymstbdtlfig`, mengandung referensi Production, atau `JWT_SECRET` sama dengan `.env` Production / tidak diawali `ravira-dev-e2e-`, maka `e2e-safety-gate.cjs` otomatis menghentikan eksekusi (`THROW / ABORT`) sebelum koneksi Prisma dibuat.
> 2. **Proteksi Override `.env` Production:** `e2e-safety-gate.cjs` mengunci `dotenv.config` ke `.env.e2e` dan memvalidasi objek runtime `dist/config/env` (`assertRuntimeEnvMatchesE2E`) agar `.env` Production tidak pernah menimpa environment pengujian.
> 3. **Fail-Closed Port Check (`:4000` & `:5173`):** Jika port `4000` atau `5173` sedang ditempati oleh proses eksternal yang tidak dikelola oleh runner, pengujian langsung berhenti (`fail-closed`). Setelah server dinyalakan oleh runner, endpoint `/__e2e_runner_identity` diverifikasi menggunakan cryptographic nonce unik per-eksekusi.

---

## 3. Cara Menjalankan Pengujian

Pastikan build backend dan frontend sudah mutakhir, lalu jalankan perintah E2E:

```powershell
# 1. Build backend TypeScript
npm run build

# 2. Build frontend bundle
cd frontend && npm run build && cd ..

# 3. (Opsional) Jalankan seed E2E secara mandiri
npm run seed:e2e

# 4. Jalankan seluruh 31 skenario Browser E2E (otomatis menjalankan Safety Gate + Seed E2E)
npm run test:e2e
```

Untuk menjalankan unit/integration test non-E2E:
```powershell
# Backend automated tests (74 tests)
npm run test:backend

# Frontend Vitest suite (123 tests)
cd frontend && npx vitest run
```

---

## 4. Cakupan 31 Skenario QA-02

### Candidate (11 Skenario)
- `E2E-CAND-01`: Registrasi kandidat baru & login kandidat (`seed-candidate@ravira.local`)
- `E2E-CAND-02`: Menampilkan & memperbarui profil kandidat (`GET` & `PATCH /api/v1/candidates/me`)
- `E2E-CAND-03`: Pengelolaan skills kandidat (`GET` & `POST /api/v1/candidates/me/skills`)
- `E2E-CAND-04`: Upload CV valid (`.pdf`) & penolakan file invalid (`.txt`)
- `E2E-CAND-05`: Daftar rekomendasi lowongan & halaman detail lowongan
- `E2E-CAND-06`: AI Match Score & alasan rekomendasi (tanpa mengekspos `CandidateScore` internal)
- `E2E-CAND-07`: Skill Gap Analysis & rekomendasi pelatihan
- `E2E-CAND-08`: Menyimpan lowongan (`Saved Jobs`) & persistensi setelah `page.reload()`
- `E2E-CAND-09`: Melamar pekerjaan (`POST /api/v1/jobs/:jobId/apply`)
- `E2E-CAND-10`: Melihat daftar & status lamaran saya
- `E2E-CAND-11`: Logout kandidat & pembersihan token sesi

### Recruiter (8 Skenario)
- `E2E-REC-01`: Login recruiter dengan perusahaan `APPROVED`
- `E2E-REC-02`: Pembatasan akses pipeline bagi perusahaan berstatus `PENDING`
- `E2E-REC-03`: Menampilkan & mengedit Company Profile (Website kosong, Website valid, persistensi reload, dan pengosongan kembali Website)
- `E2E-REC-04`: Membuat & mempublikasikan lowongan baru (`POST /api/v1/recruiter/jobs`)
- `E2E-REC-05`: Melihat daftar pelamar di pipeline perusahaan
- `E2E-REC-06`: Melihat `Candidate Score` (serta verifikasi `403 Forbidden` bagi role Candidate)
- `E2E-REC-07`: Mengubah tahapan seleksi pipeline dengan alasan audit wajib (`POST /api/v1/applications/:id/stage`)
- `E2E-REC-08`: Isolasi kepemilikan lowongan & pelamar antar-perusahaan (`404 Not Found` untuk akses lintas perusahaan)

### Admin (6 Skenario)
- `E2E-ADM-01`: Login admin (`/masuk/admin` -> `/admin`)
- `E2E-ADM-02`: Dashboard operasional admin (ringkasan antrean verifikasi, fraud, & appeals)
- `E2E-ADM-03`: Persetujuan (`Approve`) & penolakan (`Reject` dengan alasan wajib) verifikasi perusahaan
- `E2E-ADM-04`: Peninjauan manual kasus anti-fraud (`FraudCase` decision dengan alasan wajib)
- `E2E-ADM-05`: Peninjauan & keputusan sanggahan kandidat (`Appeal` decision)
- `E2E-ADM-06`: Penolakan akses endpoint `/api/v1/admin/*` untuk non-admin (`403 Forbidden`)

### Integration (6 Skenario)
- `E2E-INT-01`: Navigasi antarhalaman melalui sidebar tanpa full reload error
- `E2E-INT-02`: Penanganan loading, empty state, & error state autentikasi (`401`)
- `E2E-INT-03`: Persistensi data setelah browser reload (`Saved Jobs` & `Company Profile`)
- `E2E-INT-04`: Penanganan token kedaluwarsa/invalid (`401` -> hapus token & redirect login)
- `E2E-INT-05`: Proteksi route privat terhadap akses anonim
- `E2E-INT-06`: Render responsive layout pada viewport desktop (`1280x900`) & mobile (`375x812`)

---

## 5. Output & Bukti Eksekusi

Setiap kali `npm run test:e2e` dijalankan, artefak bukti pengujian otomatis diperbarui pada:
- `tests/e2e/.artifacts/qa02-results.json` (Ringkasan terstruktur status 31 skenario, waktu eksekusi, dan log console/page error)
- `tests/e2e/.artifacts/screenshots/*.png` (Tangkapan layar setiap skenario)
