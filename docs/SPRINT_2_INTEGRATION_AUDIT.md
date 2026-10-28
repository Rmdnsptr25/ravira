# AUDIT INTEGRASI API FRONTEND & BACKEND — SPRINT 2
**Project:** RAVIRA (Platform Job Matching & Recruitment Ecosystem Berbasis AI)  
**Branch:** `sprint-2/frontend-api-integration`  
**Tanggal:** 28 Oktober 2026  
**Auditor:** Senior Full-Stack Engineer, Software Architect & QA Auditor  
**Status Audit:** COMPLETED — READY FOR PHASED IMPLEMENTATION  

---

## DAFTAR ISI
1. [Executive Summary](#1-executive-summary)
2. [Inventarisasi Frontend dan Backend](#2-inventarisasi-frontend-dan-backend)
   - [2.1 Arsitektur dan Routing Frontend](#21-arsitektur-dan-routing-frontend)
   - [2.2 Arsitektur dan Endpoint Backend yang Tersedia](#22-arsitektur-dan-endpoint-backend-yang-tersedia)
   - [2.3 Inventarisasi Model Database (Prisma)](#23-inventarisasi-model-database-prisma)
3. [Matriks Integrasi Lengkap](#3-matriks-integrasi-lengkap)
4. [Analisis Mock Data dan Fake Actions](#4-analisis-mock-data-dan-fake-actions)
   - [4.1 Modul Kandidat (Candidate)](#41-modul-kandidat-candidate)
   - [4.2 Modul Perusahaan (Recruiter)](#42-modul-perusahaan-recruiter)
   - [4.3 Modul Admin Internal](#43-modul-admin-internal)
   - [4.4 Modul Pemerintah (Government)](#44-modul-pemerintah-government)
5. [Temuan Keamanan dan Integritas Data](#5-temuan-keamanan-dan-integritas-data)
   - [5.1 Pencegahan Kebocoran Candidate Score](#51-pencegahan-kebocoran-candidate-score)
   - [5.2 Penegakan Otorisasi Recruiter (Company Scoping)](#52-penegakan-otorisasi-recruiter-company-scoping)
   - [5.3 Risiko State Leakage Antar Akun](#53-risiko-state-leakage-antar-akun)
   - [5.4 Audit Loading, Error Handling, dan Empty State](#54-audit-loading-error-handling-dan-empty-state)
   - [5.5 Batasan Geografis Wilayah Pengujian (Pulau Jawa)](#55-batasan-geografis-wilayah-pengujian-pulau-jawa)
6. [Gap Endpoint Backend](#6-gap-endpoint-backend)
7. [Roadmap Implementasi Sprint 2A – 2E](#7-roadmap-implementasi-sprint-2a--2e)
   - [Sprint 2A: Candidate Profile, Skills & CV Parsing](#sprint-2a-candidate-profile-skills--cv-parsing)
   - [Sprint 2B: Jobs, AI Recommendations, Match Score & Skill Gap](#sprint-2b-jobs-ai-recommendations-match-score--skill-gap)
   - [Sprint 2C: Recruiter Job Posting, Applicant Pipeline & Stage Transitions](#sprint-2c-recruiter-job-posting-applicant-pipeline--stage-transitions)
   - [Sprint 2D: Admin Verification & Fraud Review](#sprint-2d-admin-verification--fraud-review)
   - [Sprint 2E: Integration Testing & Mock Data Cleanup](#sprint-2e-integration-testing--mock-data-cleanup)
8. [Acceptance Criteria Per Tahap](#8-acceptance-criteria-per-tahap)
9. [Rekomendasi Urutan Pengerjaan & Tindak Lanjut](#9-rekomendasi-urutan-pengerjaan--tindak-lanjut)

---

## 1. EXECUTIVE SUMMARY

Sprint 1 (*Authentication & Role Security*) telah sukses di-merge ke branch `main`, mengamankan mekanisme autentikasi JWT, sistem otorisasi Role-Based Access Control (RBAC), pencegahan bypass route pada frontend (`ProtectedRoute`), serta validasi hak akses recruiter berbasis status verifikasi perusahaan (`PENDING` vs `APPROVED`).

Namun, audit menyeluruh terhadap fungsionalitas bisnis pasca-login mengungkap bahwa **hampir seluruh halaman operasional frontend (91.4%) masih berjalan di atas data tiruan (*mock data*), state lokal (*React useState*), atau aksi semu (*fake action* yang hanya menampilkan toast tanpa mengirim request HTTP ke backend)**.

### Ringkasan Status Halaman Aplikasi Private (35 Halaman):
| Status Integrasi | Jumlah Halaman | Persentase | Definisi |
| :--- | :---: | :---: | :--- |
| **REAL** | 0 | 0.0% | Terhubung penuh ke endpoint backend resmi dan data tersimpan di DB. |
| **PARTIAL** | 2 | 5.7% | Terhubung ke sebagian API, tetapi masih mengandalkan fallback mock untuk fitur utama. |
| **MOCK** | 26 | 74.3% | Halaman aktif dengan UI lengkap, namun menggunakan data statis/hardcoded dan aksi semu (toast). |
| **MISSING** | 7 | 20.0% | Fitur dibutuhkan oleh UI namun endpoint backend belum diimplementasikan. |
| **TOTAL** | **35** | **100%** | Seluruh halaman dashboard/private (Kandidat, Recruiter, Admin). |

*(Catatan: Modul Pemerintah mencakup 11 halaman tambahan yang saat ini dinonaktifkan secara aman sesuai cakupan PRD v1.3 dan tidak dihitung dalam target rilis Sprint 2).*

### Temuan Masalah Kritis (P0):
1. **Aksi Semu Tanpa Persistensi (Fake Actions via Toast):**
   - Halaman `CandidateSelfProfilePage` menampilkan toast sukses saat edit profil dan upload CV tanpa mengirim request ke backend `PATCH /candidates/me` atau `POST /candidates/me/cv`.
   - Halaman `CreateJobPage` menampilkan toast "Lowongan berhasil dipublikasikan!" dan berpindah halaman tanpa memanggil `POST /recruiter/jobs`.
   - Halaman `PipelinePage` memindahkan kartu pelamar antar kolom hanya di memori browser, tanpa memanggil `POST /applications/:id/stage`.
   - Halaman `AdminVerifikasiPage` mengklaim perusahaan diverifikasi/ditolak hanya lewat toast tanpa memanggil `POST /admin/companies/:id/approve`.
2. **Hardcoded Match Score & Rekomendasi:**
   - Halaman `JobRecommendationsPage` menyematkan nilai match score statis `80%` untuk setiap lowongan nyata yang diambil dari backend, mengabaikan kalkulasi AI Match Score dari endpoint `GET /jobs/:id/match-score`.
3. **Resiko State Leakage Antar Akun di Frontend:**
   - Halaman `CandidatesListPage` dan `PipelinePage` mengambil data pelamar dari `AppContext.applications` (yang merupakan data lamaran kandidat pengguna saat ini) dan menggabungkannya ke dalam tampilan recruiter, menyebabkan data kandidat tertukar/bocor jika berganti sesi dalam satu browser.
4. **Pencegahan Kebocoran Candidate Score:**
   - Endpoint `GET /applications/:id/score` sudah dikunci dengan benar di backend (hanya untuk recruiter & admin), namun frontend recruiter masih menampilkan nilai mock statis dan belum menangani respons backend secara konsisten.

---

## 2. INVENTARISASI FRONTEND DAN BACKEND

### 2.1 Arsitektur dan Routing Frontend
Frontend dibangun dengan **React 18 + TypeScript + Vite**, menggunakan **React Router v7** (`createBrowserRouter`), dan didukung oleh **Lucide Icons**, **Tailwind CSS / Inline Styles**, serta **Sonner** untuk notifikasi toast.

#### Struktur Routing Aktif (`frontend/src/routes.ts`):
- **Total Route Terdaftar:** 70 path routing.
- **Rute Publik & Edukasi:** 16 rute (Landing page, fitur, tentang, kontak, dsb).
- **Rute Autentikasi:** 8 rute (`/masuk`, `/masuk/kandidat`, `/masuk/perusahaan`, `/masuk/admin`, `/masuk/pemerintah`, `/daftar`, `/daftar/kandidat`, `/daftar/perusahaan`, `/daftar/pemerintah`).
- **Rute Private Kandidat:** 14 rute (`/daftar/kandidat/onboarding`, `/dashboard/kandidat/*`).
- **Rute Private Perusahaan/Recruiter:** 12 rute (`/daftar/perusahaan/onboarding`, `/dashboard/perusahaan/*`).
- **Rute Private Admin Internal:** 9 rute (`/admin`, `/dashboard/admin/*`).
- **Rute Terencana Pemerintah:** 11 rute (`/dashboard/analytics/*`) — dilindungi oleh `ProtectedRoute` dengan redirect ke `/masuk/pemerintah`.

#### Layanan API Frontend (`frontend/src/services/`):
- `api.ts`: Mengatur `fetch` wrapper, base URL (`http://localhost:4000/api/v1`), inject Bearer token, dan penanganan error 401 (`SESSION_INVALIDATED`).
- `raviraApi.ts`:
  - **Fungsi Tersedia Saat Ini:** `login`, `registerCandidate`, `registerRecruiter`, `getCurrentUser`, `listPublishedJobs`, `searchPublishedJobs`, `getJobMatchScore`, `applyToJob`, `listMyApplications`.
  - **Fungsi Belum Ada di raviraApi.ts:** Candidate profile/CV/skills/skill-gap/training, Recruiter job management/pipeline/candidate-score, Admin company verification/fraud/appeals.

---

### 2.2 Arsitektur dan Endpoint Backend yang Tersedia
Backend dibangun dengan **Node.js + Express + TypeScript**, menggunakan **Prisma ORM** yang terhubung ke **PostgreSQL**.

Struktur Endpoint yang **Telah Diimplementasikan dan Teruji di Backend** (32 Endpoint):

| Modul | Method | Path Endpoint | Middleware Otorisasi | Deskripsi Fungsional |
| :--- | :---: | :--- | :--- | :--- |
| **Auth** | POST | `/api/v1/auth/register/candidate` | Publik | Registrasi kandidat + buat user & consent |
| | POST | `/api/v1/auth/register/recruiter` | Publik | Registrasi recruiter + perusahaan status PENDING |
| | POST | `/api/v1/auth/login` | Publik | Login multi-role + terbitkan JWT |
| | GET | `/api/v1/auth/me` | `requireAuth` | Ambil data profil sesi user yang login |
| **Candidates** | GET | `/api/v1/candidates/me` | `requireCandidate` | Profil kandidat lengkap + skills & resume |
| | PATCH | `/api/v1/candidates/me` | `requireCandidate` | Update profil, bio, domisili, visibilitas |
| | POST | `/api/v1/candidates/me/cv` | `requireCandidate` | Upload file CV (multipart/form-data) & auto-parsing |
| | GET | `/api/v1/candidates/me/cv` | `requireCandidate` | Ambil riwayat dokumen CV & hasil ekstraksi skill |
| | GET | `/api/v1/candidates/me/cv/:cvId` | `requireCandidate` | Detail CV tertentu |
| | DELETE | `/api/v1/candidates/me/cv/:cvId` | `requireCandidate` | Hapus dokumen CV |
| | GET | `/api/v1/candidates/me/skills` | `requireCandidate` | Daftar skill kandidat |
| | POST | `/api/v1/candidates/me/skills` | `requireCandidate` | Tambah skill mandiri |
| | PATCH | `/api/v1/candidates/me/skills/:id` | `requireCandidate` | Update level skill |
| | DELETE | `/api/v1/candidates/me/skills/:id` | `requireCandidate` | Hapus skill |
| | GET | `/api/v1/candidates/me/recommendations/jobs` | `requireCandidate` | Rekomendasi lowongan berbasis AI Match Score |
| | GET | `/api/v1/candidates/me/skill-gap` | `requireCandidate` | Laporan analisa gap skill kandidat |
| | POST | `/api/v1/candidates/me/skill-gap` | `requireCandidate` | Minta analisa gap skill untuk target role tertentu |
| | GET | `/api/v1/candidates/me/training-recommendations`| `requireCandidate` | Rekomendasi pelatihan untuk menutup gap |
| | GET | `/api/v1/candidates/me/training-progress` | `requireCandidate` | Daftar progress pelatihan yang diambil |
| | POST | `/api/v1/candidates/me/training-progress` | `requireCandidate` | Ambil/daftarkan kursus baru |
| | PATCH | `/api/v1/candidates/me/training-progress/:id` | `requireCandidate` | Update persentase/status progress pelatihan |
| | GET | `/api/v1/candidates/me/applications` | `requireCandidate` | Daftar lamaran yang pernah diajukan |
| | GET | `/api/v1/candidates/me/appeals` | `requireCandidate` | Riwayat sanggahan/banding kandidat |
| | GET | `/api/v1/candidates/me/appeals/:id` | `requireCandidate` | Detail sanggahan |
| **Jobs** | GET | `/api/v1/jobs` | Publik | Daftar seluruh lowongan berstatus PUBLISHED |
| | GET | `/api/v1/jobs/search` | Publik | Pencarian lowongan (keyword, lokasi, tipe, skill) |
| | GET | `/api/v1/jobs/:jobId` | Publik | Detail lengkap spesifikasi lowongan |
| | GET | `/api/v1/jobs/:jobId/match-score` | `requireCandidate` | AI Match Score kandidat terhadap lowongan ini |
| | POST | `/api/v1/jobs/:jobId/apply` | `requireCandidate` | Lamar lowongan dengan cover letter & CV aktif |
| **Applications**| GET | `/api/v1/applications/:id` | `requireAuth` | Detail lamaran (scoped to owner/recruiter) |
| | GET | `/api/v1/applications/:id/status-history`| `requireAuth` | Timeline riwayat transisi status lamaran |
| | GET | `/api/v1/applications/:id/score` | `requireRecruiter/Admin` | Candidate Score internal (**DILARANG** untuk kandidat) |
| | POST | `/api/v1/applications/:id/stage` | `requireApprovedRecruiter`| Update tahap seleksi (Screening, Interview, etc) |
| **Recruiter** | POST | `/api/v1/recruiter/jobs` | `requireApprovedRecruiter`| Buat lowongan baru beserta requirement skill |
| | GET | `/api/v1/recruiter/jobs` | `requireApprovedRecruiter`| Daftar lowongan yang dibuat perusahaan saat ini |
| | GET | `/api/v1/recruiter/jobs/:jobId` | `requireApprovedRecruiter`| Detail lowongan milik perusahaan sendiri |
| | PATCH | `/api/v1/recruiter/jobs/:jobId` | `requireApprovedRecruiter`| Update lowongan / ubah status (PUBLISHED/CLOSED) |
| | DELETE | `/api/v1/recruiter/jobs/:jobId` | `requireApprovedRecruiter`| Hapus/arsipkan lowongan |
| | GET | `/api/v1/recruiter/jobs/:jobId/applications` | `requireApprovedRecruiter`| Daftar pelamar pada lowongan tertentu |
| | GET | `/api/v1/recruiter/jobs/:jobId/candidate-scores` | `requireApprovedRecruiter`| Leaderboard nilai kandidat pada lowongan |
| **Admin** | GET | `/api/v1/admin/companies/pending`| `requireAdmin` | Daftar perusahaan yang menunggu verifikasi |
| | POST | `/api/v1/admin/companies/:id/approve` | `requireAdmin` | Setujui pendaftaran perusahaan |
| | POST | `/api/v1/admin/companies/:id/reject` | `requireAdmin` | Tolak pendaftaran perusahaan |
| | GET | `/api/v1/admin/fraud-cases` | `requireAdmin` | Daftar kasus kecurangan anti-fraud |
| | GET | `/api/v1/admin/fraud-cases/:id` | `requireAdmin` | Detail kasus kecurangan dan bukti |
| | POST | `/api/v1/admin/fraud-cases/:id/decision`| `requireAdmin` | Keputusan manual review fraud (Anti-fraud rule) |
| | GET | `/api/v1/admin/appeals` | `requireAdmin` | Daftar sanggahan keputusan kandidat |
| | GET | `/api/v1/admin/appeals/:id` | `requireAdmin` | Detail sanggahan kandidat |
| | POST | `/api/v1/admin/appeals/:id/decision` | `requireAdmin` | Keputusan atas sanggahan kandidat |
| **Notifications**| GET | `/api/v1/notifications` | `requireAuth` | Notifikasi in-app pengguna |
| | PATCH | `/api/v1/notifications/:id/read` | `requireAuth` | Tandai notifikasi telah dibaca |
| **Appeals** | POST | `/api/v1/appeals` | `requireCandidate` | Ajukan sanggahan baru |

---

### 2.3 Inventarisasi Model Database (Prisma)
Prisma schema (`prisma/schema.prisma`) memiliki **21 Model Relasional** yang telah terkonfigurasi dengan integritas cascade/restrict yang ketat:
1. `User` (Kredensial, email, peran, status aktif)
2. `Candidate` (Headline, bio, domisili, ekspektasi gaji, preferensi mobilitas, visibilitas profil)
3. `CandidateDocument` (Penyimpanan CV, status parsing, teks ter-ekstrak, skills/pendidikan ter-ekstrak)
4. `CandidateSkill` (Skill kandidat, tingkat keahlian, confidence score AI, status verifikasi)
5. `SkillGapReport` (Hasil analisis kesenjangan skill, skill yang kurang, skill prioritas)
6. `Course` (Katalog pelatihan, penyedia, target skill, durasi, harga, tingkat kesulitan)
7. `TrainingProgress` (Status pelatihan kandidat: NOT_STARTED, IN_PROGRESS, COMPLETED)
8. `Company` (Nama perusahaan, industri, lokasi, website, status verifikasi: PENDING, APPROVED, REJECTED, SUSPENDED)
9. `Recruiter` (Relasi user ke perusahaan, jabatan)
10. `Job` (Spesifikasi lowongan, gaji min/max, status: DRAFT, PUBLISHED, CLOSED, ARCHIVED)
11. `JobSkill` (Skill wajib/opsional dan bobot untuk lowongan)
12. `Application` (Lamaran kerja kandidat ke lowongan, status: APPLIED, SCREENING, SELEKSI_TAHAP_1, SELEKSI_TAHAP_2, INTERVIEW, ACCEPTED, REJECTED, NEED_VERIFICATION)
13. `ApplicationStatusHistory` (Audit trail perubahan tahap lamaran oleh recruiter)
14. `MatchScore` (Skor kecocokan kandidat terhadap lowongan + penjelasan AI untuk kandidat)
15. `CandidateScore` (Skor kandidat internal untuk recruiter + breakdown komprehensif)
16. `Consent` (Audit persetujuan kandidat terkait pemrosesan profil, CV, AI matching)
17. `Notification` (Notifikasi status lamaran, sistem, sanggahan)
18. `Appeal` (Mekanisme banding/sanggahan kandidat jika merasa dirugikan algoritma)
19. `FraudSignal` (Indikator kecurangan, duplikasi identitas, manipulasi CV)
20. `FraudCase` (Kasus fraud agregat yang wajib di-review manual oleh Admin)
21. `AuditLog` (Pencatatan aktivitas sistem, audit trail keamanan)

---

## 3. MATRIKS INTEGRASI LENGKAP

Berikut adalah matriks integrasi komprehensif untuk 35 halaman private aktif di RAVIRA:

| # | Role | Halaman Frontend | Path Frontend | Fitur / Aksi Utama | Endpoint Backend Dibutuhkan | Endpoint Tersedia di Backend | Status | Masalah / Risiko Utama | Prioritas |
| :---: | :--- | :--- | :--- | :--- | :--- | :--- | :---: | :--- | :---: |
| 1 | Candidate | Onboarding | `/daftar/kandidat/onboarding` | Wizard kelengkapan profil & skill awal | `PATCH /candidates/me`<br>`POST /candidates/me/skills` | Ada (`PATCH /candidates/me`, `POST /candidates/me/skills`) | **MOCK** | Tombol "Selesai" hanya `navigate()` tanpa menyimpan data form ke backend. | **P0** |
| 2 | Candidate | Dashboard | `/dashboard/kandidat` | Ringkasan stats, rekomendasi, skill gap | `GET /candidates/me`<br>`GET /candidates/me/recommendations/jobs`<br>`GET /candidates/me/skill-gap`<br>`GET /candidates/me/training-progress` | Ada seluruhnya | **MOCK** | Menampilkan nama hardcoded "Budi Santoso", persentase kelengkapan 78% statis, dan rekomendasi palsu. | **P0** |
| 3 | Candidate | Rekomendasi Pekerjaan | `/dashboard/kandidat/rekomendasi` | Daftar lowongan rekomendasi AI + Match Score | `GET /candidates/me/recommendations/jobs`<br>`GET /jobs/:id/match-score` | Ada (`GET /jobs`, `GET /jobs/:id/match-score`, `GET /candidates/me/recommendations/jobs`) | **PARTIAL** | Mengambil list job dari backend jika ada, tetapi fallback ke hardcoded `allJobs`, match score dipatok 80% statis. | **P0** |
| 4 | Candidate | Detail Lowongan | `/dashboard/kandidat/pekerjaan/:id` | Detail kualifikasi lowongan & skor AI | `GET /jobs/:id`<br>`GET /jobs/:id/match-score` | Ada seluruhnya | **MOCK** | Mengabaikan route param `:id`, data job di-hardcode ke "job-detail-001" (Tokopedia). | **P0** |
| 5 | Candidate | Lowongan Tersimpan | `/dashboard/kandidat/tersimpan` | Bookmark lowongan | `GET/POST/DELETE /candidates/me/saved-jobs` | **TIDAK ADA** | **MISSING** | Menggunakan array lokal di `AppContext`. Begitu refresh atau ganti browser, data hilang. Model DB belum ada. | **P1** |
| 6 | Candidate | Skill Gap | `/dashboard/kandidat/skill-gap` | Analisa kesenjangan skill terhadap target peran | `GET /candidates/me/skill-gap`<br>`POST /candidates/me/skill-gap` | Ada seluruhnya | **MOCK** | Menampilkan skill mock statis (Figma 70%, React 45%), tidak mengambil kalkulasi backend. | **P0** |
| 7 | Candidate | Pelatihan | `/dashboard/kandidat/pelatihan` | Rekomendasi kursus penutup skill gap | `GET /candidates/me/training-recommendations`<br>`GET /candidates/me/training-progress` | Ada seluruhnya | **MOCK** | Menggunakan 6 kursus statis hardcoded, tombol "Mulai Belajar" tidak mengubah status di DB. | **P1** |
| 8 | Candidate | Detail Kursus | `/dashboard/kandidat/detail-kursus` | Silabus kursus dan enrollment | `GET /courses/:id`<br>`POST /candidates/me/training-progress` | Ada di Prisma & route `training-progress` | **MOCK** | Halaman statis, tidak terhubung ke model `Course` database. | **P1** |
| 9 | Candidate | Lamaran Saya | `/dashboard/kandidat/lamaran` | Pelacakan status lamaran aktif | `GET /candidates/me/applications` | Ada (`GET /candidates/me/applications`) | **PARTIAL** | List lamaran sudah ditarik via `AppContext`, tetapi tab filter dan interaksi detail masih menggunakan mock. | **P1** |
| 10 | Candidate | Detail Lamaran | `/dashboard/kandidat/lamaran/:id` | Timeline status proses rekrutmen & jadwal wawancara | `GET /applications/:id`<br>`GET /applications/:id/status-history` | Ada seluruhnya | **PARTIAL** | Jika id lamaran tidak ditemukan di array mock `mockApplications`, timeline proses fallback ke data statis. | **P1** |
| 11 | Candidate | Peluang Lintas Wilayah | `/dashboard/kandidat/cross-region` | Peluang kerja di luar domisili (Pulau Jawa) | `GET /candidates/me/recommendations/jobs?crossRegion=true` | Ada via query param search/recommendation | **MOCK** | Menggunakan 4 kartu peluang kerja palsu (Yogyakarta, Bandung, Semarang). | **P2** |
| 12 | Candidate | Detail Cross Region | `/dashboard/kandidat/detail-cross-region` | Analisis biaya hidup & relokasi | `GET /jobs/:id` | Ada (`GET /jobs/:id`) | **MOCK** | Data komparasi biaya hidup merupakan data statis edukatif. | **P2** |
| 13 | Candidate | Profil Saya | `/dashboard/kandidat/profil` | Edit profil, upload/parse CV, kelola skill | `GET /candidates/me`<br>`PATCH /candidates/me`<br>`POST /candidates/me/cv`<br>`GET/POST/DELETE /candidates/me/skills` | Ada seluruhnya di backend | **MOCK** | **Kritis:** Form edit dan upload CV hanya menampilkan toast sukses tanpa network request. Data Budi Santoso hardcoded. | **P0** |
| 14 | Candidate | Pengaturan Privasi | `/dashboard/kandidat/privasi` | Visibilitas profil dan penarikan consent | `GET /candidates/me`<br>`PATCH /candidates/me` (profileVisibility)<br>`POST /candidates/me/consents/revoke` | Ada sebagian (`PATCH /candidates/me` dukung `profileVisibility`) | **MOCK** | Toggle switch dan tombol simpan hanya mengupdate state komponen, tidak tersimpan ke DB. | **P1** |
| 15 | Recruiter | Onboarding Perusahaan | `/daftar/perusahaan/onboarding` | Setup profil instansi awal pasca registrasi | `PATCH /recruiter/company` | **TIDAK ADA** | **MOCK** | Hanya wizard navigasi client-side, tidak menyimpan profil recruiter ke DB. | **P1** |
| 16 | Recruiter | Dashboard Perusahaan | `/dashboard/perusahaan` | Overview pelamar, lowongan aktif, funnel rekrutmen | `GET /recruiter/jobs`<br>`GET /recruiter/jobs/:id/applications` | Ada seluruhnya | **MOCK** | Statistik 248 kandidat, funnel pipeline, dan lowongan aktif 100% hardcoded di frontend. | **P0** |
| 17 | Recruiter | Pipeline Pelamar | `/dashboard/perusahaan/pipeline` | Kanban board pelamar & perubahan stage seleksi | `GET /recruiter/jobs/:id/applications`<br>`POST /applications/:id/stage` | Ada seluruhnya | **MOCK** | **Kritis:** Drag/drop kandidat hanya mengubah state lokal. Tidak memanggil endpoint transisi stage. Bocor state `AppContext`. | **P0** |
| 18 | Recruiter | Lowongan Aktif | `/dashboard/perusahaan/lowongan` | CRUD lowongan dan penutupan lowongan | `GET /recruiter/jobs`<br>`PATCH /recruiter/jobs/:id`<br>`DELETE /recruiter/jobs/:id` | Ada seluruhnya | **MOCK** | Menggunakan array `initialJobs`, aksi tutup lowongan hanya update state array lokal. | **P0** |
| 19 | Recruiter | Buat Lowongan | `/dashboard/perusahaan/buat-lowongan` | Publikasi lowongan baru + spesifikasi skill | `POST /recruiter/jobs` | Ada (`POST /recruiter/jobs`) | **MOCK** | **Kritis:** Form submit hanya menampilkan toast sukses lalu redirect tanpa memanggil backend API. | **P0** |
| 20 | Recruiter | Shortlist Kandidat | `/dashboard/perusahaan/shortlist` | Daftar kandidat unggulan yang disimpan | `GET /recruiter/shortlists` | Belum ada spesifik (dapat query application status) | **MOCK** | Data kandidat shortlist statis di komponen. | **P1** |
| 21 | Recruiter | Analitik Rekrutmen | `/dashboard/perusahaan/analitik` | Metrik time-to-hire, funnel conversion | `GET /recruiter/analytics` | Belum ada endpoint agregat analytics | **MOCK** | Grafik Recharts menggunakan mock visual data. | **P2** |
| 22 | Recruiter | Integrasi ATS | `/dashboard/perusahaan/integrasi-ats` | Konfigurasi webhook / API key integrasi ATS | `GET/POST /recruiter/integrations` | Belum ada model/endpoint ATS eksternal | **MOCK** | Tampilan dummy generator API Key. | **P2** |
| 23 | Recruiter | Profil Perusahaan | `/dashboard/perusahaan/profil` | Edit deskripsi perusahaan, logo, website | `GET /recruiter/company`<br>`PATCH /recruiter/company` | **TIDAK ADA** (ada di model DB tapi rute belum ada) | **MISSING** | Form hardcoded "Tokopedia", tombol simpan aksi semu. | **P1** |
| 24 | Recruiter | Pengaturan | `/dashboard/perusahaan/pengaturan` | Pengaturan notifikasi & akun recruiter | `PATCH /recruiter/settings` | **TIDAK ADA** | **MISSING** | Tampilan statis tanpa persistensi. | **P2** |
| 25 | Recruiter | Daftar Kandidat | `/dashboard/perusahaan/kandidat` | Pencarian & filter seluruh kandidat pelamar | `GET /recruiter/jobs/:id/applications`<br>`GET /recruiter/jobs/:id/candidate-scores` | Ada seluruhnya | **MOCK** | Daftar kandidat mock, mencampurkan data `applications` milik kandidat yang login. | **P0** |
| 26 | Recruiter | Profil Kandidat | `/dashboard/perusahaan/kandidat/:id` | Evaluasi CV, Candidate Score, jadwalkan wawancara | `GET /applications/:id`<br>`GET /applications/:id/score`<br>`POST /applications/:id/stage` | Ada seluruhnya | **MOCK** | `:id` di params diabaikan (`useParams` dikomentari), data Budi Santoso hardcoded. | **P0** |
| 27 | Admin | Dashboard Admin | `/admin` | Metrik sistem, volume fraud, verifikasi pending | `GET /admin/dashboard/stats` | Belum ada agregat dashboard admin | **MOCK** | Kartu metrik 48.924 user dan grafik server uptime statis. | **P1** |
| 28 | Admin | Verifikasi Perusahaan | `/dashboard/admin/verifikasi-perusahaan` | Review dokumen legalitas & approve/reject | `GET /admin/companies/pending`<br>`POST /admin/companies/:id/approve`<br>`POST /admin/companies/:id/reject` | Ada seluruhnya | **MOCK** | **Kritis:** Tombol Approve & Reject hanya memicu toast sukses tanpa HTTP dispatch. | **P0** |
| 29 | Admin | Moderasi Lowongan | `/dashboard/admin/moderasi-lowongan` | Review lowongan mencurigakan / melanggar | `GET/PATCH /admin/jobs/moderation` | **TIDAK ADA** | **MISSING** | Menggunakan 6 data lowongan palsu. | **P1** |
| 30 | Admin | Laporan Abuse & Fraud | `/dashboard/admin/laporan-abuse` | Review kasus fraud indikasi pemalsuan data/sindikat | `GET /admin/fraud-cases`<br>`POST /admin/fraud-cases/:id/decision`<br>`GET /admin/appeals`<br>`POST /admin/appeals/:id/decision` | Ada seluruhnya | **MOCK** | Tabel laporan abuse hardcoded, padahal backend memiliki sistem Anti-Fraud lengkap. | **P0** |
| 31 | Admin | Monitoring Integrasi | `/dashboard/admin/monitoring-integrasi` | Health check service & latency | `GET /admin/health` / metrics | Belum ada | **MOCK** | Uptime 99.98% visual mock. | **P2** |
| 32 | Admin | Audit Log | `/dashboard/admin/audit-log` | Audit trail akses dan perubahan data sensitif | `GET /admin/audit-logs` | **TIDAK ADA** (Model Prisma `AuditLog` ada) | **MISSING** | Menggunakan array statis 15 log tiruan. | **P1** |
| 33 | Admin | Performa AI Model | `/dashboard/admin/model-ai` | Monitoring akurasi dan drift algoritma matching | `GET /admin/ai-metrics` | Belum ada | **MISSING** | Menampilkan metrik akurasi 91.4% statis. | **P2** |
| 34 | Admin | Manajemen User | `/dashboard/admin/user-management` | Suspend/activate akun kandidat/recruiter | `GET /admin/users`<br>`PATCH /admin/users/:id/status` | **TIDAK ADA** (Model Prisma `User` ada) | **MISSING** | Tabel user dan aksi suspend hanya simulasi toast. | **P1** |
| 35 | Admin | Pengaturan Sistem | `/dashboard/admin/pengaturan` | Maintenance mode, rate limit config | `GET/PATCH /admin/system-settings` | Belum ada | **MOCK** | Form konfigurasi sistem mock. | **P2** |

---

## 4. ANALISIS MOCK DATA DAN FAKE ACTIONS

Audit ini memisahkan secara tegas antara **Data Mock Visual/Dekoratif** (dapat ditoleransi untuk estetika chart) dengan **Data Pengguna Palsu & Aksi Semu (Fake Actions)** yang menyesatkan pengguna atau menghalangi alur kerja operasional.

### 4.1 Modul Kandidat (Candidate)
1. **Profil & CV (`CandidateSelfProfilePage.tsx`):**
   - **Karakteristik Mock:** Menampilkan data identitas `Budi Santoso`, email `budi.santoso@email.com`, domisili Jakarta, riwayat kerja PT Teknologi Nusantara, dan 8 skill statis.
   - **Fake Action:** Fungsi `handleEditSave` hanya mengeksekusi `toast.success("Profil berhasil diperbarui!")` dan menutup modal. Fungsi `handleCvFileChange` hanya mengeksekusi `setTimeout` selama 600ms lalu menampilkan `toast.success("CV berhasil diunggah!")` tanpa mengirim file `FormData` ke backend.
   - **Dampak:** Kandidat tidak pernah bisa memperbarui data diri atau mengunggah resume asli ke database.
2. **Dashboard (`DashboardCandidatePage.tsx`):**
   - Menampilkan angka kelengkapan profil `78%`, rekomendasi `24`, skill gap `3`, dan pelatihan `45%` secara hardcoded. Menyematkan lowongan rekomendasi statis dari Tokopedia dan Gojek.
3. **Pekerjaan & Rekomendasi (`JobRecommendationsPage.tsx` & `JobDetailPage.tsx`):**
   - Memiliki dependensi ke backend `jobs`, tetapi jika jobs kosong langsung me-render 6 lowongan mock statis.
   - Untuk setiap lowongan asli backend, skor kecocokan diset statis `match: 80%` dan `missingSkills: []`, alih-alih mengonsumsi endpoint `/jobs/:id/match-score`.
   - `JobDetailPage.tsx` bahkan tidak menggunakan `useParams()` untuk membaca ID dari URL, melainkan mematok ID dummy `"job-detail-001"`.
4. **Skill Gap & Pelatihan (`SkillGapPage.tsx`, `TrainingPage.tsx`):**
   - Memiliki data tiruan statis 8 skill dan 3 kursus. Backend sudah memiliki endpoint `GET /candidates/me/skill-gap` dan `GET /candidates/me/training-recommendations`, namun halaman ini sama sekali belum mengonsumsinya.

### 4.2 Modul Perusahaan (Recruiter)
1. **Buat Lowongan (`CreateJobPage.tsx`):**
   - **Fake Action Parah:** Tombol "Publikasikan Lowongan" langsung memicu:
     ```tsx
     onClick={() => {
       toast.success("Lowongan berhasil dipublikasikan!");
       navigate("/dashboard/perusahaan/lowongan");
     }}
     ```
     Tidak ada request `POST` yang dikirim ke `/api/v1/recruiter/jobs`. Lowongan tidak pernah tersimpan di tabel `jobs`.
2. **Pipeline Pelamar (`PipelinePage.tsx`):**
   - **Fake Action & In-Memory State:** Menggunakan 6 kolom Kanban (`initialColumns`) yang diisi nama-nama kandidat statis (Kartika Dewi, Oki Rahmad, dsb).
   - Fungsi `moveCandidate` hanya memindahkan elemen dalam state array React. Perubahan status stage tidak tersimpan ke tabel `applications` dan tidak mencatat riwayat di `application_status_histories`.
3. **Lowongan Aktif (`ActiveJobsPage.tsx`):**
   - Menggunakan 5 lowongan kerja statis. Aksi menutup lowongan hanya mengubah string status di array memori browser.
4. **Detail Pelamar & Evaluasi (`CandidateProfilePage.tsx`):**
   - Menampilkan profil `Budi Santoso` secara permanen. Kode `const { id } = useParams()` dinonaktifkan dengan komentar, sehingga recruiter tidak dapat melihat profil pelamar nyata yang melamar ke perusahaannya.

### 4.3 Modul Admin Internal
1. **Verifikasi Perusahaan (`AdminVerifikasiPage.tsx`):**
   - **Fake Action:** Tombol "Approve" hanya mengeksekusi `onClick={() => toast.success("Data berhasil disetujui")}`. Tombol "Reject" hanya memunculkan modal dan toast merah.
   - Backend sudah memiliki `POST /admin/companies/:id/approve` dan `POST /admin/companies/:id/reject` yang mengubah status perusahaan di database dari `PENDING` menjadi `APPROVED` atau `REJECTED`, namun tidak pernah dipanggil oleh frontend.
2. **Review Kasus Fraud (`AdminAbuseReportPage.tsx`):**
   - Menampilkan 8 baris laporan penyalahgunaan statis. Endpoint backend `/api/v1/admin/fraud-cases` dan `/api/v1/admin/appeals` yang telah siap tidak terpakai.

### 4.4 Modul Pemerintah (Government)
- **Status Sesuai Desain:** Form login pada `LoginPemerintahPage.tsx` dinonaktifkan dengan pesan resmi bahwa modul analitik pemerintah sedang dalam tahap pengujian institusional terbatas.
- **Keamanan:** Seluruh route `/dashboard/analytics/*` ditolak oleh `ProtectedRoute` dan dialihkan kembali ke login pemerintah. Tidak ada mock login atau bypass autentikasi yang dibiarkan aktif.

---

## 5. TEMUAN KEAMANAN DAN INTEGRITAS DATA

### 5.1 Pencegahan Kebocoran Candidate Score
- **Aturan PRD:** RAVIRA membedakan secara mutlak antara **AI Match Score** (skor kecocokan objektif berbasis aturan dan gap skill untuk konsumsi kandidat) dengan **Candidate Score** (skor evaluasi internal kandidat, risiko fraud, dan peringkat kelayakan yang hanya boleh diakses oleh Recruiter dan Admin).
- **Hasil Audit:**
  - Backend telah mengamankan rute `/api/v1/applications/:id/score` dengan middleware `requireRecruiterOrAdmin`. Percobaan akses oleh kandidat akan menghasilkan `403 Forbidden`.
  - Frontend kandidat (`JobRecommendationsPage`, `JobDetailPage`, `MyApplicationsPage`) tidak memanggil endpoint `/score`.
  - **Tindakan yang Diperlukan:** Saat mengintegrasikan halaman Recruiter (`CandidateProfilePage`, `CandidatesListPage`), pastikan komponen frontend yang menampilkan `CandidateScore` hanya aktif dalam konteks otentikasi recruiter/admin dan tidak pernah diekspos ke konteks kandidat.

### 5.2 Penegakan Otorisasi Recruiter (Company Scoping)
- **Aturan PRD & Keamanan:**
  - Recruiter yang berstatus `PENDING` tidak boleh melihat data personal/sensitif kandidat atau mempublikasikan lowongan.
  - Recruiter yang berstatus `APPROVED` hanya boleh mengakses lowongan, lamaran, dan profil kandidat yang melamar ke perusahaannya sendiri (`companyId` scoping).
- **Hasil Audit:**
  - Backend telah mengimplementasikan middleware `requireApprovedRecruiter` dan memfilter query Prisma berdasarkan `where: { job: { companyId: req.user.recruiter.companyId } }`.
  - Frontend saat ini belum menangani status `403 Forbidden` jika recruiter `PENDING` mencoba membuka halaman pipeline atau lowongan. Halaman masih menampilkan data mock seolah-olah akun recruiter aktif dan telah disetujui.
  - **Tindakan:** Frontend wajib membaca status `user.recruiter.company.verificationStatus`. Jika status masih `PENDING`, tampilkan banner peringatan dan disable tombol aksi penambahan lowongan/akses data kandidat.

### 5.3 Risiko State Leakage Antar Akun di Frontend
- **Temuan Kritis di `AppContext.tsx`:**
  - Pada halaman `CandidatesListPage.tsx` dan `PipelinePage.tsx`, ditemukan kode berikut:
    ```tsx
    const budiApp = applications.find(a => a.perusahaan === "Tokopedia" || a.posisi === "Senior UX Designer");
    ```
    Data `applications` di `AppContext` adalah state yang diisi oleh lamaran kandidat pengguna saat ini melalui `listMyApplications()`.
  - Jika pengguna login sebagai kandidat, lalu logout dan login sebagai recruiter dalam sesi browser yang sama, terjadi risiko data lamaran kandidat sebelumnya muncul di Kanban Pipeline recruiter jika state context tidak dibersihkan dengan sempurna.
  - **Tindakan:** Pisahkan state kandidat dengan state recruiter di context/store, dan pastikan setiap perpindahan role memicu reset state store secara menyeluruh.

### 5.4 Audit Loading, Error Handling, dan Empty State
- **Loading State:** Hampir 80% halaman frontend saat ini tidak memiliki komponen Skeleton Loader atau spinner. Komponen langsung me-render konten atau memicu layar putih (*white screen flicker*) sebelum data tiba.
- **Error Handling:** Tidak ada Error Boundary pada level halaman dashboard. Jika response backend mengembalikan error 500 atau payload JSON tidak sesuai kontrak TypeScript, aplikasi berisiko *crash* tanpa pesan pemulihan bagi pengguna.
- **Empty State:** Halaman seperti `MyApplicationsPage`, `ActiveJobsPage`, dan `JobRecommendationsPage` belum memiliki desain *empty state* yang informatif (misal: "Belum ada lowongan yang dibuat" dengan tombol CTA "Buat Lowongan Pertama").

### 5.5 Batasan Geografis Wilayah Pengujian (Pulau Jawa)
- **Aturan Project:** Seluruh data uji, dummy seed, dan filter pencarian wilayah wajib difokuskan pada wilayah **Pulau Jawa** (DKI Jakarta, Jawa Barat, Jawa Tengah, DI Yogyakarta, Jawa Timur, dan Banten).
- **Hasil Audit:**
  - Daftar lokasi di dropdown frontend (`JobRecommendationsPage`, `SavedJobsPage`, `OnboardingCompanyPage`) sudah memuat kota-kota di Pulau Jawa (Jakarta, Bogor, Depok, Tangerang, Bekasi, Bandung, Cimahi, Semarang, Solo, Yogyakarta, Surabaya, Malang, Sidoarjo).
  - Namun pada `AdminVerifikasiPage.tsx`, masih terdapat data mock di luar Jawa seperti `"Disnaker Kaltim"`. Data ini harus diganti dengan entitas berbasis Pulau Jawa (misal: "Disnakertrans Provinsi Jawa Barat" atau "Disnaker Kota Semarang").

---

## 6. GAP ENDPOINT BACKEND

Berdasarkan audit komparasi kebutuhan UI frontend terhadap endpoint backend yang tersedia, ditemukan **6 kelompok endpoint** yang dibutuhkan oleh frontend namun belum tersedia di backend:

| # | Modul | Endpoint yang Dibutuhkan Frontend | Alasan Kebutuhan di Frontend | Rekomendasi Solusi Sprint 2 |
| :---: | :--- | :--- | :--- | :--- |
| 1 | **Candidate** | `GET /api/v1/candidates/me/saved-jobs`<br>`POST /api/v1/candidates/me/saved-jobs/:jobId`<br>`DELETE /api/v1/candidates/me/saved-jobs/:jobId` | Halaman `SavedJobsPage.tsx` membutuhkan penyimpanan bookmark lowongan secara persisten di database. | Tambahkan model relasi `SavedJob` pada Prisma atau gunakan entitas ringan tanpa migrasi destruktif. |
| 2 | **Recruiter** | `GET /api/v1/recruiter/company`<br>`PATCH /api/v1/recruiter/company` | Halaman `CompanyProfilePage.tsx` dan `CompanySettingsPage.tsx` perlu menampilkan dan mengupdate profil perusahaan (nama, industri, website, lokasi, deskripsi). | Buat controller dan route untuk memfasilitasi update model `Company` oleh recruiter terkait. |
| 3 | **Admin** | `GET /api/v1/admin/users`<br>`PATCH /api/v1/admin/users/:userId/status` | Halaman `AdminUserManagementPage.tsx` membutuhkan daftar user terdaftar dan kemampuan suspend/activate akun. | Buat endpoint query model `User` dengan pagination, filtering role, dan toggle `isActive`. |
| 4 | **Admin** | `GET /api/v1/admin/audit-logs` | Halaman `AdminAuditLogPage.tsx` memerlukan audit trail aktivitas sistem. Model `AuditLog` sudah ada di Prisma dan service sudah mencatat log, namun belum ada endpoint API untuk membacanya. | Tambahkan endpoint `GET /api/v1/admin/audit-logs` dengan filter berdasarkan action, actor, dan rentang tanggal. |
| 5 | **Admin** | `GET /api/v1/admin/jobs/moderation`<br>`PATCH /api/v1/admin/jobs/:jobId/status` | Halaman `AdminModerasiPage.tsx` membutuhkan kemampuan admin untuk mereview dan mengubah status lowongan yang melanggar ketentuan. | Tambahkan endpoint moderasi job di modul admin. |
| 6 | **Candidate** | `GET /api/v1/candidates/me/consents`<br>`POST /api/v1/candidates/me/consents/revoke` | Halaman `PrivacySettingsPage.tsx` mengelola consent pemrosesan profil, CV, dan rekomendasi AI. Model `Consent` sudah ada di database. | Tambahkan endpoint baca dan cabut consent di controller candidate. |

---

## 7. ROADMAP IMPLEMENTASI SPRINT 2A – 2E

Implementasi integrasi API frontend-backend dibagi menjadi 5 sub-tahap modular (Sprint 2A sampai Sprint 2E) untuk menjaga stabilitas arsitektur dan meminimalkan regresi.

```
┌────────────────────────────────────────────────────────────────────────┐
│                      ROADMAP SPRINT 2 INTEGRASI API                    │
├──────────────┬──────────────┬──────────────┬──────────────┬────────────┤
│  SPRINT 2A   │  SPRINT 2B   │  SPRINT 2C   │  SPRINT 2D   │ SPRINT 2E  │
│  Candidate   │  Jobs, Recs, │  Recruiter   │  Admin Verif │ Integration│
│  Profile, CV │  Match Score │  Jobs & ATS  │  & Fraud     │ Testing &  │
│  & Skills    │  & Skill Gap │  Pipeline    │  Review      │ Cleanup    │
└──────────────┴──────────────┴──────────────┴──────────────┴────────────┘
```

---

### Sprint 2A: Candidate Profile, Skills & CV Parsing
- **Fokus Scope:**
  - Integrasi penuh data profil kandidat pada `CandidateSelfProfilePage` dan `OnboardingCandidatePage`.
  - Integrasi upload dokumen resume/CV dengan form data multipart ke `POST /candidates/me/cv`.
  - Integrasi CRUD skill kandidat (`GET/POST/DELETE /candidates/me/skills`).
  - Integrasi pembaruan preferensi mobilitas dan visibilitas profil.
- **File Target:**
  - Frontend: `frontend/src/services/raviraApi.ts`, `frontend/src/pages/CandidateSelfProfilePage.tsx`, `frontend/src/pages/OnboardingCandidatePage.tsx`, `frontend/src/contexts/AppContext.tsx`.
- **Endpoint Backend yang Digunakan:**
  - `GET /api/v1/candidates/me`
  - `PATCH /api/v1/candidates/me`
  - `POST /api/v1/candidates/me/cv`
  - `GET /api/v1/candidates/me/cv`
  - `DELETE /api/v1/candidates/me/cv/:cvId`
  - `GET /api/v1/candidates/me/skills`
  - `POST /api/v1/candidates/me/skills`
  - `DELETE /api/v1/candidates/me/skills/:skillId`
- **Dependensi:** Autentikasi token JWT Candidate dari Sprint 1.
- **Acceptance Criteria:**
  1. Halaman profil menampilkan nama, email, bio, dan skill kandidat asli dari database.
  2. Tombol simpan pada form edit profil mengirimkan `PATCH /candidates/me` dan memperbarui tampilan secara reaktif.
  3. Upload file CV (PDF/DOCX) mengirimkan payload multipart asli dan menampilkan status parsing/skill terekstraksi.
  4. Penambahan dan penghapusan skill tercatat di tabel `candidate_skills`.
  5. Status loading dan pesan error jaringan tertangani dengan baik.
- **Test Wajib:**
  - Unit test fungsi API client di `raviraApi.test.ts`.
  - Integration test upload CV dan parsing response.
  - Manual verification flow edit profil dan refresh halaman (data tetap persisten).
- **Risiko & Mitigasi:**
  - *Risiko:* Format multipart file upload berpotensi memicu CORS atau ukuran file terlalu besar.
  - *Mitigasi:* Validasi ukuran file (<5MB) dan ekstensi di sisi klien sebelum request dikirim.
- **Estimasi Kompleksitas:** Sedang (5 Story Points).

---

### Sprint 2B: Jobs, AI Recommendations, Match Score & Skill Gap
- **Fokus Scope:**
  - Integrasi daftar rekomendasi lowongan berbasis AI Match Score (`GET /candidates/me/recommendations/jobs`).
  - Mengganti skor statis 80% pada `JobRecommendationsPage` dengan kalkulasi nyata dari `GET /jobs/:id/match-score`.
  - Integrasi `JobDetailPage` untuk membaca parameter `:id` dinamis dan menampilkan breakdown kecocokan serta skill gap.
  - Integrasi laporan skill gap pada `SkillGapPage` dan rekomendasi pelatihan pada `TrainingPage`.
  - Integrasi aksi lamar pekerjaan via `POST /jobs/:id/apply` dan pembaruan riwayat pada `MyApplicationsPage` & `ApplicationDetailPage`.
- **File Target:**
  - Frontend: `frontend/src/pages/JobRecommendationsPage.tsx`, `frontend/src/pages/JobDetailPage.tsx`, `frontend/src/pages/SkillGapPage.tsx`, `frontend/src/pages/TrainingPage.tsx`, `frontend/src/pages/ApplicationDetailPage.tsx`, `frontend/src/services/raviraApi.ts`.
- **Endpoint Backend yang Digunakan:**
  - `GET /api/v1/candidates/me/recommendations/jobs`
  - `GET /api/v1/jobs` & `GET /api/v1/jobs/search`
  - `GET /api/v1/jobs/:jobId`
  - `GET /api/v1/jobs/:jobId/match-score`
  - `POST /api/v1/jobs/:jobId/apply`
  - `GET /api/v1/candidates/me/skill-gap`
  - `GET /api/v1/candidates/me/training-recommendations`
  - `GET /api/v1/applications/:id/status-history`
- **Dependensi:** Sprint 2A (Kandidat harus memiliki profil & skill tersimpan agar AI Match Score dan Skill Gap dapat dihitung).
- **Acceptance Criteria:**
  1. Halaman rekomendasi menampilkan daftar lowongan nyata dengan AI Match Score dinamis beserta alasan rekomendasi.
  2. Buka detail lowongan berdasarkan ID URL menampilkan data kualifikasi asli dari database.
  3. Mengklik tombol "Lamar Sekarang" mengirim request ke `/jobs/:id/apply` dan menambahkan riwayat ke `MyApplicationsPage`.
  4. Halaman Skill Gap menampilkan kesenjangan skill kandidat terhadap posisi yang dituju secara akurat.
  5. Kandidat tidak dapat melihat Candidate Score internal milik recruiter.
- **Test Wajib:**
  - Test kalkulasi AI Match Score pada frontend.
  - Test alur pelamaran kerja: Apply -> Update Context -> Status History.
- **Risiko & Mitigasi:**
  - *Risiko:* Kandidat baru belum memiliki skill sehingga rekomendasi lowongan kosong.
  - *Mitigasi:* Tampilkan empty state yang mengarahkan kandidat untuk melengkapi skill di profil terlebih dahulu.
- **Estimasi Kompleksitas:** Tinggi (8 Story Points).

---

### Sprint 2C: Recruiter Job Posting, Applicant Pipeline & Stage Transitions
- **Fokus Scope:**
  - Integrasi pembuatan lowongan kerja pada `CreateJobPage` ke `POST /api/v1/recruiter/jobs`.
  - Integrasi pengelolaan lowongan pada `ActiveJobsPage` (baca lowongan, tutup lowongan via `PATCH`).
  - Integrasi Kanban Board pada `PipelinePage` dengan daftar pelamar nyata dari `GET /recruiter/jobs/:id/applications`.
  - Integrasi transisi stage pelamar via drag/drop atau tombol ke `POST /applications/:id/stage`.
  - Integrasi evaluasi pelamar pada `CandidateProfilePage` dengan pembacaan profil pelamar dan Candidate Score.
  - Menghilangkan kebocoran state antar role di `CandidatesListPage`.
- **File Target:**
  - Frontend: `frontend/src/pages/CreateJobPage.tsx`, `frontend/src/pages/ActiveJobsPage.tsx`, `frontend/src/pages/PipelinePage.tsx`, `frontend/src/pages/CandidatesListPage.tsx`, `frontend/src/pages/CandidateProfilePage.tsx`, `frontend/src/services/raviraApi.ts`.
- **Endpoint Backend yang Digunakan:**
  - `POST /api/v1/recruiter/jobs`
  - `GET /api/v1/recruiter/jobs`
  - `GET /api/v1/recruiter/jobs/:jobId`
  - `PATCH /api/v1/recruiter/jobs/:jobId`
  - `DELETE /api/v1/recruiter/jobs/:jobId`
  - `GET /api/v1/recruiter/jobs/:jobId/applications`
  - `GET /api/v1/recruiter/jobs/:jobId/candidate-scores`
  - `GET /api/v1/applications/:applicationId`
  - `GET /api/v1/applications/:applicationId/score`
  - `POST /api/v1/applications/:applicationId/stage`
- **Dependensi:** Sprint 2B (Perlu adanya lowongan dan lamaran kandidat aktif).
- **Acceptance Criteria:**
  1. Recruiter yang berstatus `APPROVED` dapat membuat lowongan baru dan lowongan tersebut langsung muncul di halaman pencarian publik & kandidat.
  2. Recruiter `PENDING` dibatasi hak aksesnya dengan banner verifikasi yang jelas.
  3. Memindahkan pelamar antar kolom di Pipeline mengirimkan request ke `/applications/:id/stage` dan tercatat di riwayat status.
  4. Halaman `CandidateProfilePage` menampilkan data pelamar nyata berdasarkan ID URL beserta rincian Candidate Score internal.
  5. State `AppContext.applications` tidak bocor ke tampilan recruiter.
- **Test Wajib:**
  - Test pembuatan lowongan dengan payload validasi lengkap.
  - Test transisi status pelamar (APPLIED -> SCREENING -> INTERVIEW -> ACCEPTED/REJECTED).
  - Test otorisasi: pastikan recruiter A tidak bisa melihat pelamar milik perusahaan B.
- **Risiko & Mitigasi:**
  - *Risiko:* Perubahan stage gagal di backend namun UI sudah berpindah (optimistic UI failure).
  - *Mitigasi:* Gunakan penanganan rollback state jika request API stage mengembalikan error.
- **Estimasi Kompleksitas:** Tinggi (8 Story Points).

---

### Sprint 2D: Admin Verification & Fraud Review
- **Fokus Scope:**
  - Integrasi halaman verifikasi perusahaan `AdminVerifikasiPage` dengan `GET /admin/companies/pending`.
  - Mengubah aksi tombol "Approve" dan "Reject" menjadi pemanggilan nyata ke `POST /admin/companies/:id/approve` dan `reject`.
  - Integrasi review kasus kecurangan pada `AdminAbuseReportPage` dengan `GET /admin/fraud-cases` dan `POST /admin/fraud-cases/:id/decision`.
  - Integrasi penanganan sanggahan kandidat (`GET /admin/appeals` dan `POST /admin/appeals/:id/decision`).
  - Penyesuaian data pengujian agar seluruh entitas berada dalam lingkup wilayah Pulau Jawa.
- **File Target:**
  - Frontend: `frontend/src/pages/AdminVerifikasiPage.tsx`, `frontend/src/pages/AdminAbuseReportPage.tsx`, `frontend/src/services/raviraApi.ts`.
- **Endpoint Backend yang Digunakan:**
  - `GET /api/v1/admin/companies/pending`
  - `POST /api/v1/admin/companies/:companyId/approve`
  - `POST /api/v1/admin/companies/:companyId/reject`
  - `GET /api/v1/admin/fraud-cases`
  - `GET /api/v1/admin/fraud-cases/:caseId`
  - `POST /api/v1/admin/fraud-cases/:caseId/decision`
  - `GET /api/v1/admin/appeals`
  - `GET /api/v1/admin/appeals/:appealId`
  - `POST /api/v1/admin/appeals/:appealId/decision`
- **Dependensi:** Autentikasi Admin dari Sprint 1.
- **Acceptance Criteria:**
  1. Halaman verifikasi admin menampilkan daftar perusahaan yang mendaftar secara nyata dengan status `PENDING`.
  2. Mengklik "Approve" mengubah status perusahaan menjadi `APPROVED` di DB, membuka akses recruiter terkait secara instan.
  3. Mengklik "Reject" mengubah status perusahaan menjadi `REJECTED` dengan alasan penolakan yang tercatat.
  4. Kasus fraud dari anti-fraud engine dapat ditinjau dan diputuskan secara manual (tidak ada auto-reject kandidat).
  5. Sanggahan kandidat dapat disetujui atau ditolak oleh admin dengan catatan audit trail.
- **Test Wajib:**
  - Test flow approval perusahaan: Recruiter Register -> Admin Approve -> Recruiter Login & Akses Fitur Terbuka.
  - Test keputusan manual review fraud.
- **Risiko & Mitigasi:**
  - *Risiko:* Perusahaan yang ditolak mencoba login kembali.
  - *Mitigasi:* Pastikan middleware auth backend dan protected route frontend memblokir akses recruiter yang ditolak.
- **Estimasi Kompleksitas:** Sedang (5 Story Points).

---

### Sprint 2E: Integration Testing & Mock Data Cleanup
- **Fokus Scope:**
  - Pembersihan menyeluruh seluruh konstanta mock data yang tidak lagi digunakan pada halaman utama.
  - Implementasi komponen Loading Skeleton dan Error Boundary di seluruh modul dashboard.
  - Penambahan Empty State yang informatif dan ramah pengguna.
  - Pengujian End-to-End (E2E) siklus lengkap rekrutmen di lingkungan lokal.
  - Penanganan endpoint gap prioritas tinggi (Saved Jobs & Company Profile).
- **File Target:**
  - Frontend: Seluruh halaman di `frontend/src/pages/`, `frontend/src/components/`, `frontend/src/contexts/`.
  - Backend: `src/routes/`, `src/controllers/` (untuk gap endpoint yang disepakati).
- **Dependensi:** Sprint 2A, 2B, 2C, 2D selesai.
- **Acceptance Criteria:**
  1. Tidak ada lagi data hardcoded "Budi Santoso", angka statis 78%, atau mock jobs pada halaman operasional.
  2. Seluruh alur rekrutmen end-to-end berjalan mulus dari registrasi hingga penawaran kerja.
  3. Tidak ada error TypeScript, lint, atau console warning yang tidak tertangani.
  4. Siklus build frontend dan backend PASS 100%.
  5. Semua automated test (unit, integration, e2e) lulus tanpa *flaky test*.
- **Estimasi Kompleksitas:** Sedang (5 Story Points).

---

## 8. ACCEPTANCE CRITERIA PER TAHAP

| Tahap | Kriteria Keberhasilan Utama | Metrik Verifikasi | Status Target |
| :--- | :--- | :--- | :---: |
| **Sprint 2A** | - Profil kandidat tersimpan di DB & ter-render di UI.<br>- File CV terunggah ke storage & parsing terekstrak.<br>- Skill mandiri dapat ditambah dan dihapus. | - HTTP 200 pada `GET/PATCH /candidates/me`.<br>- Data tersimpan di tabel `candidates` & `candidate_skills`. | **READY** |
| **Sprint 2B** | - Lowongan yang tampil merupakan data asli backend.<br>- AI Match Score dinamis sesuai kecocokan skill.<br>- Kandidat dapat melamar pekerjaan via API.<br>- Riwayat lamaran muncul di dashboard kandidat. | - HTTP 200 pada `/jobs/:id/match-score`.<br>- Record baru di tabel `applications`.<br>- Nilai match score tidak statis 80%. | **READY** |
| **Sprint 2C** | - Recruiter dapat mempublikasikan lowongan ke DB.<br>- Pelamar muncul di Kanban Pipeline lowongan.<br>- Transisi stage pelamar tercatat di DB history.<br>- Recruiter dapat melihat Candidate Score internal.<br>- Kandidat TIDAK dapat melihat Candidate Score. | - Record baru di tabel `jobs`.<br>- Transisi status di `application_status_histories`.<br>- 403 Forbidden jika kandidat akses `/score`. | **READY** |
| **Sprint 2D** | - Perusahaan pending tampil di tabel admin.<br>- Aksi Approve membuka hak akses recruiter.<br>- Aksi Reject mengunci akun recruiter.<br>- Kasus fraud dapat diputuskan secara manual.<br>- Seluruh data uji berfokus di Pulau Jawa. | - Status `CompanyVerificationStatus` berubah di DB.<br>- Audit log tercatat di tabel `audit_logs`.<br>- Tidak ada auto-reject tanpa manual review. | **READY** |
| **Sprint 2E** | - Seluruh mock data pengguna tiruan dihapus.<br>- Skeleton loader dan error handling terpasang.<br>- Backend & frontend build PASS tanpa error.<br>- Test suite backend & frontend lulus 100%. | - 0 TypeScript error.<br>- 0 ESLint error.<br>- 100% test pass. | **READY** |

---

## 9. REKOMENDASI URUTAN PENGERJAAN & TINDAK LANJUT

### Urutan Pengerjaan yang Direkomendasikan:
1. **Langkah 1 (Segera): Implementasikan Sprint 2A — Candidate Profile, Skills & CV**
   - **Alasan:** Profil dan skill kandidat adalah fondasi (*data source*) utama bagi seluruh algoritma pencocokan AI (Match Score, Skill Gap, dan Rekomendasi). Tanpa data profil nyata di database, pengujian Sprint 2B dan 2C tidak dapat menghasilkan nilai kecocokan yang valid.
2. **Langkah 2: Implementasikan Sprint 2B — Jobs, AI Recommendations, Match Score & Apply**
   - Menghubungkan lowongan nyata, kalkulasi match score dinamis, dan fungsi lamaran kerja kandidat.
3. **Langkah 3: Implementasikan Sprint 2C — Recruiter Jobs & Recruitment Pipeline**
   - Menghubungkan recruiter ke lowongan yang telah dibuat, me-review pelamar yang melamar pada Sprint 2B, dan memproses status lamaran di pipeline Kanban.
4. **Langkah 4: Implementasikan Sprint 2D — Admin Verification & Fraud Review**
   - Mengintegrasikan persetujuan perusahaan dan review keamanan anti-fraud.
5. **Langkah 5: Implementasikan Sprint 2E — Pengujian Integrasi Menyeluruh & Pembersihan Mock Data**
   - Finalisasi ketahanan UI (loading/error/empty state) dan verifikasi end-to-end.

---
*Laporan audit ini disusun berdasarkan pemeriksaan kode aktual pada commit `e48405c` (branch `sprint-2/frontend-api-integration`). Implementasi kode akan dimulai setelah instruksi konfirmasi diberikan.*

