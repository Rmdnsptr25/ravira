**PRODUCT REQUIREMENTS DOCUMENT**

**Ekosistem LENTERA**

DS Recruitment Ecosystem

Platform Job Matching Berbasis Kecerdasan Artifisial\
Skill Gap Advisor \| Personalized Training \| Job-Workforce Analytics \|
Cross-Region Matching \| Recruitment Intelligence \| Candidate
Transparency \| Anti-Fraud Governance

| **Atribut** | **Nilai** |
|----|:---|
| Versi Dokumen | 1.3 - Upgraded PRD + Detailed Workflow & Governance Clarification |
| Tanggal Revisi | Kamis, 28 Mei 2026 |
| Tim | BEBAN_gaji-DS2 |
| Status | Draft untuk Review Internal |
| Sumber | PRD LENTERA v1.2, PRD LENTERA v1.1, dan BRD LENTERA v1.0 |
| Kategori | Platform SaaS / AI-Powered Recruitment |
| Perubahan Utama | Penambahan klarifikasi batas MVP, pemisahan AI Match Score dan Candidate Score, detail status seleksi, role access matrix, candidate transparency, appeal/verifikasi ulang, notification system, search/filter, audit log detail, success metrics fitur baru, serta detail API/data model/QA terkait. |

<table style="width:97%;">
<colgroup>
<col style="width: 97%" />
</colgroup>
<thead>
<tr>
<th><p><strong>Catatan Penggunaan</strong></p>
<p>Dokumen ini ditujukan sebagai referensi implementasi lintas fungsi
untuk Product, Engineering, Data Science, Design, QA, Security, dan
Business. Bagian dengan prioritas P0 menjadi baseline MVP dan launch
gate utama.</p></th>
</tr>
</thead>
<tbody>
</tbody>
</table>

# **Daftar Isi Ringkas**

1\. Ringkasan Upgrade

2\. Product Overview

3\. Problem Statement & Strategic Context

4\. Goals & Success Metrics

5\. Product Principles

6\. Target Users & Personas

7\. Scope & Release Matrix

8\. User Journey

9\. Functional Requirements

10\. Non-Functional Requirements

11\. Core Data Model

12\. AI/ML Requirements

13\. Consent, Privacy & Data Governance

14\. API Contract & Integration

15\. Analytics Instrumentation

16\. Admin & Internal Operations

17\. UX Screen Inventory

18\. Technical Architecture

19\. Timeline & Milestones

20\. Team, Ownership & RACI

21\. QA Strategy & Definition of Done

22\. Edge Cases

23\. Risk Registry

24\. Financial Plan

25\. Open Questions, Assumptions & Dependencies

26\. Appendix

# **1. Ringkasan Upgrade**

Versi 1.3 mempertahankan struktur PRD v1.2 dan memperdalam detail
operasional agar dokumen lebih siap diturunkan ke UI/UX, backend, data
model, dan backlog engineering. Fokus update berada pada pemisahan AI
Match Score dan Candidate Score, batas MVP, tahapan seleksi resmi, role
access, candidate transparency, appeal/verifikasi ulang, notification
system, search/filter, audit log detail, dan metrik keberhasilan fitur
Recruitment Intelligence.

| **Area Upgrade** | **Perubahan yang Ditambahkan** | **Dampak** |
|----|----|----|
| MVP & Release Planning | Tabel scope per fase: MVP, Beta, Launch, Post-Launch. | Mengurangi risiko semua fitur dianggap harus dibangun bersamaan. |
| Data Model | Definisi entitas inti kandidat, pekerjaan, perusahaan, aplikasi, skill, kursus, consent, dan event. | Memberi baseline bagi backend, analytics, dan data science. |
| AI/ML Plan | Input-output model, metrik evaluasi, model monitoring, retraining, bias audit, dan fallback. | Memperjelas standar kualitas model dan mitigasi kegagalan AI. |
| Privacy & Consent | Flow consent kandidat, visibilitas profil, data deletion, anonymization, dan data sharing. | Memperkuat kepatuhan UU PDP dan trust kandidat. |
| API Contract | Endpoint awal, auth, rate limit, webhook, error handling, dan versioning. | Memudahkan integrasi B2B, B2G, dan mitra eksternal. |
| Analytics Tracking | Event taxonomy untuk MAU, conversion, match accuracy, training completion, dan placement. | Membuat success metrics bisa diukur secara konsisten. |
| Admin Operations | Company verification, job moderation, audit log viewer, support, dan model monitoring. | Menutup kebutuhan operasional marketplace recruitment. |
| QA & DoD | Strategi testing, UAT, accessibility gate, security gate, dan Definition of Done. | Meningkatkan kesiapan delivery dan kualitas release. |
| Recruitment Intelligence & Anti-Fraud | Candidate scoring, leaderboard kandidat, multi-stage selection, stage control, AI pre-screening, duplicate check, risk score, security flag log, dan manual review. | Mempercepat seleksi kandidat, meningkatkan transparansi ranking, dan mengurangi risiko data duplikat atau penyalahgunaan identitas. |
| MVP Boundary Clarification | Penegasan fitur yang masuk MVP, Beta, Launch, dan Post-Launch tanpa mengubah struktur utama PRD. | Mengurangi scope creep dan membantu prioritas delivery. |
| Score Governance | Pemisahan AI Match Score untuk rekomendasi kerja dan Candidate Score untuk seleksi internal HR. | Mencegah kebingungan definisi skor dan memperjelas transparansi kandidat. |
| Candidate Transparency & Appeal | Status lamaran, notifikasi, verifikasi ulang, dan mekanisme appeal jika data/hasil AI dinilai tidak tepat. | Meningkatkan kepercayaan kandidat dan mengurangi risiko keputusan otomatis yang tidak adil. |
| Role Access & Auditability | Role access matrix, audit log detail, dan kewajiban alasan pada aksi sensitif seperti override skor dan perubahan tahap. | Memperkuat governance, security, dan kesiapan operasional. |

# **2. Product Overview**

## **2.1 Deskripsi Produk**

LENTERA adalah ekosistem rekrutmen end-to-end berbasis Kecerdasan
Artifisial yang dirancang untuk menjaring, mencocokkan, mengembangkan,
dan mempersiapkan talenta kerja di seluruh Indonesia. Produk ini
menggabungkan job matching, skill gap analysis, rekomendasi pelatihan,
analitik tenaga kerja, dan pencocokan lintas wilayah dalam satu platform
SaaS dan API-first.

## **2.2 Product Vision**

<table style="width:97%;">
<colgroup>
<col style="width: 97%" />
</colgroup>
<thead>
<tr>
<th><p><strong>Vision Statement</strong></p>
<p>Menjadi infrastruktur ketenagakerjaan digital Indonesia yang paling
inklusif - menghubungkan setiap talenta dengan peluang terbaik mereka
melalui kecerdasan buatan.</p></th>
</tr>
</thead>
<tbody>
</tbody>
</table>

## **2.3 Product Positioning**

| **Dimensi** | **LENTERA** | **Portal Lowongan Konvensional** |
|----|----|----|
| Matching | Berbasis AI multi-faktor dengan explainability. | Sebagian besar berbasis keyword dan filter manual. |
| Skill Development | Skill gap report dan rekomendasi training personal. | Biasanya tidak terintegrasi dengan pelatihan. |
| Cross-Region | Memfasilitasi peluang lintas wilayah dan info relokasi. | Terbatas pada filter lokasi. |
| Analytics | Dashboard B2B/B2G untuk pipeline dan tren tenaga kerja. | Umumnya analytics terbatas pada job posting. |
| Data Strategy | Feedback loop, model monitoring, dan bias audit. | Tidak selalu menggunakan feedback untuk pembelajaran model. |

# **3. Problem Statement & Strategic Context**

<table style="width:97%;">
<colgroup>
<col style="width: 97%" />
</colgroup>
<thead>
<tr>
<th><p><strong>Masalah Inti</strong></p>
<p>Pasar ketenagakerjaan Indonesia mengalami mismatch struktural:
kandidat sulit menemukan pekerjaan sesuai kompetensi, sementara
perusahaan mengeluarkan biaya besar untuk rekrutmen yang panjang dan
tidak selalu menghasilkan kandidat tepat.</p></th>
</tr>
</thead>
<tbody>
</tbody>
</table>

| **Sisi Kandidat** | **Sisi Perusahaan / Institusi** | **Implikasi Produk** |
|----|----|----|
| Sulit menemukan pekerjaan sesuai kompetensi dan minat. | Proses rekrutmen mahal dan panjang. | Smart Job Matching harus memprioritaskan relevansi dan speed. |
| Minim panduan karir yang konkret. | Mismatch kompetensi kandidat dengan kebutuhan posisi. | Skill Gap Advisor dan training recommendation wajib terintegrasi. |
| Akses peluang kerja terkonsentrasi di kota besar. | Kesulitan menjangkau talenta potensial dari daerah. | Cross-Region Matching perlu menjadi diferensiasi utama. |
| Tidak memahami skill yang diminta industri. | Minim data analitik untuk perencanaan workforce. | Workforce Analytics harus menyediakan insight agregat dan anonim. |

# **4. Goals & Success Metrics**

## **4.1 Product Goals**

1\. Menghasilkan rekomendasi pekerjaan yang akurat, personal, dan lintas
wilayah dengan target relevansi AI \>85%.

2\. Menyediakan analisis skill gap dan rekomendasi pelatihan adaptif
untuk peningkatan kompetensi berkelanjutan.

3\. Membangun infrastruktur analitik ketenagakerjaan untuk perusahaan,
pemerintah, dan institusi pendidikan.

4\. Memfasilitasi pemerataan distribusi kesempatan kerja melalui
cross-region matching yang inklusif.

5\. Mencapai product-market fit pada akhir fase beta dan go-live pada
bulan ke-12.

## **4.2 Key Success Metrics**

| **Metrik** | **Target** | **Cara Ukur** | **Deadline** | **Owner** |
|----|----|----|----|----|
| Akurasi Job Matching AI | \>85% relevansi | Thumbs up/down, apply conversion, recruiter shortlist acceptance. | Fase 2-Launch | Lead AI/ML |
| Monthly Active Users | 50.000 MAU pada Y1 | Internal analytics dashboard. | Bulan 12+ | PM + Growth |
| Reduksi Time-to-Hire | Turun 40% | Survei dan data ATS perusahaan mitra vs baseline. | Fase 3 | BA + Recruiter Success |
| Training Completion Rate | \>60% dalam 30 hari | Progress tracking training partner. | Fase 3 | PM + Partnership |
| Cross-Region Placement Rate | \>=20% total placement | Placement data lintas provinsi. | Fase 4 | PM + Data |
| NPS | \>50 | Survei kandidat dan perusahaan. | Go-live | PM |
| Concurrent Sessions | 10.000 launch, 100.000 scale | Monitoring load balancer dan APM. | Launch | DevOps |
| Candidate Score Explainability | 100% skor seleksi memiliki breakdown | Audit score record, model_version, dan explanation field. | Beta-Launch | PM + Lead AI/ML |
| Leaderboard-to-Shortlist Conversion | \>=50% kandidat top-20 diproses recruiter | Event leaderboard_viewed dan selection_stage_updated. | Beta-Launch | PM + Recruiter Success |
| Fraud Review False Positive Rate | \<15% high-risk case dibatalkan setelah review | Perbandingan fraud_signal_detected dan fraud_case_reviewed. | Launch | Security + Admin Ops |
| Appeal Resolution SLA | \>=90% appeal selesai \<=3 hari kerja | Ticket appeal_request_created sampai appeal_resolved. | Launch | Support + Admin Ops |
| Notification Delivery Success | \>=95% notifikasi terkirim | Delivery log email/push/in-app. | Beta-Launch | Engineering + Growth |

## **4.3 North Star Metric**

<table style="width:97%;">
<colgroup>
<col style="width: 97%" />
</colgroup>
<thead>
<tr>
<th><p><strong>North Star Metric</strong></p>
<p>Qualified Placement Rate: persentase kandidat yang berhasil melamar
atau ditempatkan pada pekerjaan dengan match score tinggi dan status
valid dari recruiter. Metrik ini menggabungkan relevansi AI, aktivitas
kandidat, dan outcome rekrutmen.</p></th>
</tr>
</thead>
<tbody>
</tbody>
</table>

# **5. Product Principles**

| **Prinsip** | **Penjelasan** | **Konsekuensi Produk** |
|----|----|----|
| Candidate-first | Kandidat harus memahami dan mengontrol data serta rekomendasi yang diterima. | Explainable AI, consent, profil private/semi-public/public. |
| Actionable, not only informative | Insight harus mengarah ke aksi nyata: apply, belajar, update profil, atau relokasi. | Setiap report memiliki CTA dan prioritas berikutnya. |
| Human-in-the-loop when needed | AI tidak boleh menjadi satu-satunya mekanisme pada area berisiko tinggi. | Manual review untuk bias, low confidence, dan laporan penyalahgunaan. |
| Low-data inclusion | Platform harus tetap usable untuk pengguna daerah dengan koneksi terbatas. | Mobile-first, asset ringan, caching, dan mode hemat data. |
| Privacy by design | Data pribadi hanya diproses sesuai consent dan kebutuhan fungsi. | Data minimization, anonymization, audit log, deletion flow. |
| Transparent but protected | Kandidat berhak memahami status dan alasan umum rekomendasi tanpa membuka ranking internal HR atau data kandidat lain. | Candidate status tracker, appeal flow, masked evidence, dan role-based visibility. |
| Auditable decisioning | Keputusan seleksi, override skor, review fraud, dan export data harus dapat ditelusuri. | Audit log wajib mencatat actor, role, timestamp, alasan, dan perubahan sebelum-sesudah. |

# **6. Target Users & Personas**

| **Persona** | **Kebutuhan Utama** | **Platform Utama** | **Success Signal** |
|----|----|----|----|
| Fresh Graduate & Gen Z | Panduan karir, job matching berbasis minat, rekomendasi sertifikasi. | Mobile Android/iOS | Upload CV, apply, mulai training. |
| Profesional Mid-Career | Analisis skill gap, upskilling, transisi karir. | Web + Mobile | Gap report dilihat dan training diselesaikan. |
| Talenta Daerah Non-Jabodetabek | Peluang lintas wilayah, info relokasi, akses low-data. | Mobile low-data | Klik cross-region job dan update mobility preference. |
| HR Manager & Recruiter | Shortlist tervalidasi, pipeline, ATS integration. | Web Dashboard | Shortlist diterima dan kandidat diproses. |
| Kepala Dinas Tenaga Kerja | Data agregat regional, tren skill, laporan kebijakan. | Web Dashboard B2G | Report diekspor dan digunakan untuk program pelatihan. |
| Admin LENTERA | Verifikasi perusahaan, moderasi lowongan, support, audit. | Admin Console | Lowongan palsu turun dan SLA support terpenuhi. |

# **7. Scope & Release Matrix**

## **7.1 In-Scope**

- Smart Job Matching berbasis AI multi-faktor dan job feed personal.

- Skill Gap Advisor dengan ekstraksi skill, gap report, dan roadmap
  karir.

- Personalized Training dengan rekomendasi kursus dari mitra.

- Job-Workforce Analytics untuk kandidat, perusahaan, dan pemerintah.

- Cross-Region Job Matching dengan mobility preference dan relocation
  info.

- Web app, Android, iOS, REST API, GraphQL API, dan integrasi eksternal
  prioritas.

- Admin console untuk operasi marketplace dan model governance dasar.

- Recruitment Intelligence: Candidate Scoring, Candidate Leaderboard,
  Stage Control, AI Pre-Screening, dan Anti-Fraud Check untuk proses
  seleksi internal.

## **7.2 Out-of-Scope**

- Pengembangan atau hosting LMS konten pelatihan secara mandiri.

- Layanan headhunting fisik, payroll, atau manajemen kontrak kerja.

- Ekspansi pasar luar Indonesia pada fase pertama.

- Modul psikometri mendalam atau tes kepribadian.

- Video interview AI dan assessment proctoring pada versi ini.

- Keputusan penolakan otomatis final untuk kandidat berisiko tinggi
  tanpa validasi manusia.

## **7.3 MVP Scope Matrix**

| **Feature / Capability** | **MVP** | **Beta** | **Launch** | **Post-Launch** | **Catatan** |
|----|----|----|----|----|----|
| Registrasi kandidat + onboarding | Yes | Yes | Yes | Yes | P0, harus selesai \<10 menit. |
| Upload CV + skill extraction | Yes | Yes | Yes | Yes | PDF/DOCX, fallback input manual. |
| AI Job Matching 5 kategori | Yes | Yes | Yes | Scale | MVP akurasi internal \>70%, launch \>85%. |
| Explainable match score | Yes | Yes | Yes | Improve | Minimal 3 alasan rekomendasi. |
| Salary benchmark | Limited | Yes | Yes | Improve | P1; jangan menjadi blocker MVP penuh. |
| Skill Gap Advisor v1 | Yes | Yes | Yes | Improve | Gap report \<5 detik. |
| Training recommendation v1 | Yes | Yes | Yes | Improve | Minimal 3 kursus per skill gap prioritas. |
| Progress tracking training | Partial | Yes | Yes | Improve | Bergantung API mitra. |
| Recruiter dashboard basic | Yes | Yes | Yes | Improve | Pipeline dasar dan shortlist. |
| Generic ATS export/API | Yes | Yes | Yes | Improve | CSV/export atau generic API sebagai P0. |
| Workday integration | No | Pilot | Yes | Scale | Direkomendasikan P1, bukan blocker MVP. |
| Cross-region matching | No | Yes | Yes | Improve | Beta untuk validasi demand. |
| B2G workforce analytics | No | Pilot | Yes | Scale | Data agregat dan anonim. |
| Predictive analytics 6-12 bulan | No | No | Limited | Yes | Butuh data historis memadai. |
| White-label B2G | No | No | No | Yes | Post-launch kecuali ada kontrak khusus. |
| Admin console | Yes | Yes | Yes | Improve | Verifikasi company, job moderation, support. |
| Candidate scoring system | Yes | Yes | Yes | Improve | P0; skor 0-100 dengan minimal 3 alasan utama. |
| Candidate leaderboard | Basic | Yes | Yes | Improve | P1; ranking kandidat per lowongan/program seleksi. |
| Multi-stage selection & stage control | Yes | Yes | Yes | Improve | P0; perubahan tahap wajib tercatat di audit log. |
| AI pre-screening | Limited | Yes | Yes | Improve | P0/P1; validasi syarat minimum sebelum shortlist. |
| Anti-fraud duplicate check | Basic | Yes | Yes | Improve | P1; deteksi email, WhatsApp, identitas terenkripsi, dan pola duplikasi. |
| Fraud risk score & security flag log | No | Pilot | Yes | Improve | P1; kandidat high risk masuk manual review. |
| Match Score vs Candidate Score separation | Yes | Yes | Yes | Improve | P0; definisi skor wajib konsisten di UI, API, dan data model. |
| Official selection stage status tracker | Yes | Yes | Yes | Improve | P0; status minimal Applied, Screening, Seleksi Tahap 1, Seleksi Tahap 2, Interview, Accepted, Rejected. |
| Candidate transparency view | Yes | Yes | Yes | Improve | P0; kandidat melihat status lamaran dan alasan umum rekomendasi, bukan ranking internal. |
| Notification center v1 | Partial | Yes | Yes | Improve | P1; MVP cukup in-app notification untuk status lamaran dan verifikasi. |
| Appeal / verification request flow | Partial | Yes | Yes | Improve | P1; MVP minimal form koreksi hasil CV parsing atau data profil. |
| Search & filter candidate/job | Basic | Yes | Yes | Improve | P0 untuk job search kandidat dan shortlist filter recruiter. |
| Role access matrix + audit log detail | Yes | Yes | Yes | Improve | P0 untuk role sensitif dan aksi data. |

## 7.4 Klarifikasi Batas MVP dan Batas Release

Batas MVP tidak mengubah ruang lingkup utama PRD, tetapi memperjelas
bahwa fitur yang wajib dibangun terlebih dahulu adalah fitur yang
langsung mendukung pencarian kerja kandidat, pembuatan lowongan,
shortlist HR, scoring dasar, status lamaran, consent, dan audit aksi
sensitif. Fitur seperti fraud detection lanjutan, notification
personalization, advanced analytics, dan white-label tetap dapat masuk
fase Beta/Launch/Post-Launch.

| **Kategori** | **MVP** | **Beta/Launch** |
|:---|:---|:---|
| Kandidat | Registrasi, consent, upload CV, skill review, job feed, match score, apply, status lamaran dasar. | Career roadmap interaktif, training progress lanjutan, notification personalization, cross-region enhancement. |
| HR/Recruiter | Company verification, job posting, shortlist, candidate score dasar, stage control, pipeline status. | Leaderboard filter lanjutan, scoring calibration, ATS sync, recruiter performance analytics. |
| Admin/Security | Company verification, job moderation, audit log, manual review untuk fraud high-risk. | Fraud analytics, anomaly clustering, SLA dashboard, advanced model governance. |
| AI/ML | Rule-based fallback, match explanation, score breakdown minimal, manual validation untuk low confidence. | A/B testing, drift monitoring berkala, score calibration, bias audit lebih detail. |

# **8. User Journey**

## **8.1 Kandidat**

1\. Kandidat registrasi dan memilih consent awal untuk pemrosesan
profil.

2\. Kandidat mengisi profil atau mengunggah CV.

3\. Sistem mengekstrak skill, pengalaman, pendidikan, lokasi, dan
preferensi gaji.

4\. Kandidat memvalidasi hasil ekstraksi dan mengatur visibilitas
profil.

5\. Sistem menampilkan job feed personal dengan match score dan alasan
rekomendasi.

6\. Kandidat menyimpan, menolak, atau melamar pekerjaan.

7\. Sistem memperbarui feedback signal dan rekomendasi berikutnya.

8\. Skill Gap Advisor menghasilkan gap report dan rekomendasi skill
prioritas.

9\. Personalized Training menampilkan kursus relevan dan melacak
progress.

10\. Setelah skill diperbarui, job feed dan gap report direfresh.

### 8.1.1 Klarifikasi Pengalaman Kandidat

- Kandidat melihat AI Match Score dan alasan umum rekomendasi pekerjaan,
  misalnya skill cocok, lokasi sesuai, tipe kerja relevan, atau
  pengalaman mendukung.

- Kandidat tidak melihat Candidate Score internal HR, ranking
  leaderboard, fraud evidence mentah, atau data kandidat lain.

- Setelah melamar, kandidat dapat memantau status resmi lamaran:
  Applied, Screening, Seleksi Tahap 1, Seleksi Tahap 2, Interview,
  Accepted, Rejected, atau Need Verification.

- Jika hasil ekstraksi CV, data skill, atau status verifikasi dianggap
  salah, kandidat dapat mengajukan koreksi/appeal melalui form yang
  terhubung ke support/admin.

- Kandidat menerima notifikasi in-app untuk rekomendasi penting, status
  lamaran, permintaan verifikasi, dan update training.

## **8.2 Recruiter**

1\. Recruiter membuat akun perusahaan dan melewati verifikasi company
admin.

2\. Recruiter membuat job posting dengan kriteria skill, lokasi, tipe
kerja, dan range gaji.

3\. Sistem menghasilkan shortlist kandidat yang memenuhi consent dan
visibility rule.

4\. Recruiter melihat match score, gap summary, dan profil kandidat yang
diizinkan.

5\. Recruiter memindahkan kandidat pada pipeline seleksi atau
sinkronisasi ke ATS.

6\. Feedback recruiter digunakan untuk meningkatkan model matching.

7\. Sistem menampilkan candidate leaderboard berdasarkan skor kandidat
dan kesesuaian terhadap lowongan.

8\. Recruiter memindahkan kandidat antar tahap seleksi melalui stage
control dengan audit trail.

9\. Kandidat dengan indikasi duplikasi atau risk score tinggi masuk
manual review sebelum diproses lebih lanjut.

### 8.2.1 Klarifikasi Pengalaman Recruiter/HR

- Recruiter menggunakan Candidate Score untuk membantu prioritas
  seleksi, tetapi keputusan akhir tetap berada pada manusia.

- Recruiter dapat memfilter shortlist berdasarkan skill, lokasi,
  pendidikan, status seleksi, risk level, dan score range sesuai
  permission.

- Recruiter dapat memindahkan kandidat antar tahap resmi dan wajib
  mengisi alasan untuk reject, override, atau perubahan tahap sensitif.

- Recruiter tidak dapat melihat kandidat private atau data yang tidak
  sesuai consent, meskipun kandidat memiliki skor tinggi.

- Semua perubahan stage, shortlist, export data, dan akses detail
  kandidat dicatat ke audit log.

## **8.3 Pemerintah / B2G**

1\. Admin pemerintah login melalui dashboard B2G dengan RBAC.

2\. Sistem menampilkan data agregat dan anonim per wilayah, sektor, dan
pendidikan.

3\. Pengguna memfilter supply-demand heatmap dan trend skill.

4\. Sistem menghasilkan laporan untuk program pelatihan atau kebijakan.

5\. Data dapat diekspor sesuai hak akses dan kebijakan data sharing.

## 8.4 Anti-Fraud Review Flow

1\. Sistem memeriksa data kandidat yang consent-safe dan
terenkripsi/ter-hash untuk mendeteksi indikasi duplikasi atau anomali.

2\. Jika ditemukan indikasi, sistem membuat FraudSignal dan
mengelompokkan kasus menjadi Low, Medium, atau High Risk.

3\. Low/Medium Risk dapat tetap diproses dengan label internal,
sedangkan High Risk masuk manual review oleh Admin/Security.

4\. Admin membuka detail kasus, melihat evidence yang sudah tersamarkan,
lalu memilih keputusan: valid, perlu verifikasi ulang, merge duplicate,
suspend, atau reject case.

5\. Jika perlu verifikasi ulang, kandidat menerima notifikasi dan dapat
mengunggah koreksi atau penjelasan.

6\. Semua keputusan fraud review menyimpan reviewer, timestamp, alasan,
dan perubahan status untuk audit.

# **9. Functional Requirements**

## 9.0 Klarifikasi Konsep Skor

LENTERA menggunakan dua jenis skor yang harus dipisahkan secara
konsisten di UI, API, database, analytics, dan dokumentasi.

| **Jenis Skor** | **Pengguna Utama** | **Tujuan** | **Visibilitas** | **Contoh Output** |
|:---|:---|:---|:---|:---|
| AI Match Score | Kandidat dan HR/Recruiter | Mengukur kecocokan kandidat dengan lowongan tertentu berdasarkan profil, skill, pengalaman, lokasi, preferensi, dan constraint pekerjaan. | Dapat dilihat kandidat dengan explanation umum; dapat dilihat recruiter sesuai consent. | 87/100 - cocok karena Python, SQL, pengalaman proyek data, dan tipe kerja remote. |
| Candidate Score | HR/Recruiter dan Admin berizin | Membantu prioritas seleksi internal setelah apply/shortlist dengan tambahan faktor kelengkapan profil, hasil pre-screening, status dokumen, stage history, dan feedback recruiter. | Tidak ditampilkan sebagai ranking internal kepada kandidat; hanya status lamaran dan alasan umum yang relevan. | 91/100 - profil lengkap, lolos pre-screening, match score tinggi, dan tidak ada flag high risk. |

## **9.1 Prioritas Requirement**

| **Level** | **Definisi** | **Implikasi** |
|----|----|----|
| P0 | Harus ada untuk MVP/launch gate. Tanpa ini produk tidak dapat dirilis. | Blocking release. |
| P1 | Penting untuk experience dan target bisnis, tetapi dapat dipilot atau dirilis bertahap. | Tidak selalu blocking MVP. |
| P2 | Nice-to-have atau fitur diferensiasi lanjutan. | Masuk backlog post-MVP/post-launch. |

## **9.2 Smart Job Matching**

| **ID** | **Requirement** | **Priority** | **Acceptance Criteria** |
|----|----|----|----|
| FR-JM-01 | Sistem memproses profil kandidat dan menghasilkan minimal 10 rekomendasi pekerjaan relevan. | P0 | Response \<2 detik p95 pada normal load; rekomendasi tampil setelah profil minimum lengkap. |
| FR-JM-02 | Algoritma menggabungkan NLP semantic matching, rule-based constraints, dan collaborative filtering berbasis perilaku. | P0 | Ranking mempertimbangkan skill, pengalaman, lokasi, preferensi gaji, tipe kerja, dan interaction signals. |
| FR-JM-03 | Model memperbarui feed berdasarkan klik, apply, save, skip, reject, dan thumbs up/down. | P0 | Perubahan preferensi terlihat pada feed session berikutnya atau refresh berikutnya. |
| FR-JM-04 | Setiap rekomendasi menampilkan match score dan minimal 3 alasan utama. | P0 | Alasan dapat dipahami kandidat non-teknis dan tidak membuka informasi sensitif. |
| FR-JM-05 | Salary benchmark per posisi, industri, dan lokasi ditampilkan jika data tersedia. | P1 | Jika data tidak cukup, tampilkan "data belum cukup" tanpa membuat angka palsu. |
| FR-JM-06 | Company culture fit scoring dihitung dari profil perusahaan dan preferensi kandidat. | P2 | Ditandai experimental hingga data valid cukup. |

## **9.3 Skill Gap Advisor**

| **ID** | **Requirement** | **Priority** | **Acceptance Criteria** |
|----|----|----|----|
| FR-SG-01 | Ekstraksi hard skill dan soft skill dari CV, profil, portofolio, dan pengalaman. | P0 | Confidence score tersimpan; kandidat dapat edit hasil ekstraksi. |
| FR-SG-02 | Membandingkan skill kandidat dengan kebutuhan posisi target dan data pasar kerja aktual. | P0 | Report menunjukkan skill dimiliki, gap, dan priority score. |
| FR-SG-03 | Personalized Gap Report divisualisasikan sebagai chart interaktif. | P0 | Report selesai \<5 detik p95 untuk profil lengkap. |
| FR-SG-04 | Roadmap karir interaktif dengan milestone kompetensi. | P1 | Kandidat dapat mengubah target role dan milestone ikut berubah. |
| FR-SG-05 | Gap report diperbarui saat kandidat menyelesaikan training atau update profil. | P1 | Job feed refresh otomatis setelah skill profile berubah. |
| FR-SG-06 | API skill gap untuk institusi pendidikan mitra. | P2 | Hanya data agregat/consented sesuai kontrak data sharing. |

## **9.4 Personalized Training**

| **ID** | **Requirement** | **Priority** | **Acceptance Criteria** |
|----|----|----|----|
| FR-PT-01 | Rekomendasi jalur belajar dari katalog mitra berdasarkan skill gap. | P0 | Minimal 3 rekomendasi kursus per skill prioritas; tampil \<1 detik setelah gap dihitung. |
| FR-PT-02 | Konten micro-learning 15-30 menit diprioritaskan. | P1 | Jika mitra tidak menyediakan durasi, tampilkan durasi estimasi atau unknown. |
| FR-PT-03 | Progress belajar kandidat ditrack dan divisualisasikan. | P1 | Progress tersinkronisasi dari API mitra atau input manual. |
| FR-PT-04 | Gamifikasi berupa poin, badge, dan streak. | P2 | Tidak menjadi blocker untuk MVP. |
| FR-PT-05 | Skill profile diperbarui setelah kursus selesai. | P1 | Kandidat diminta konfirmasi/validasi sertifikat jika API mitra tidak tersedia. |
| FR-PT-06 | Plugin architecture untuk mitra konten baru. | P2 | Connector baru dapat ditambahkan tanpa perubahan core recommender. |

## **9.5 Job-Workforce Analytics**

| **ID** | **Requirement** | **Priority** | **Acceptance Criteria** |
|----|----|----|----|
| FR-WA-01 | Dashboard kandidat menampilkan progress karir, skill, lamaran, dan status aplikasi. | P0 | Data refresh real-time atau near-real-time sesuai sumber data. |
| FR-WA-02 | Dashboard perusahaan menampilkan pipeline, kualitas kandidat, dan performa posting. | P0 | Recruiter melihat kandidat sesuai consent dan akses perusahaan. |
| FR-WA-03 | Dashboard B2G menampilkan tren regional, heatmap supply-demand, dan skill demand. | P1 | Data agregat dan anonim; tidak menampilkan data individu. |
| FR-WA-04 | Supply-demand heatmap berbasis peta Indonesia interaktif. | P1 | Filter wilayah, sektor, periode, pendidikan, dan skill. |
| FR-WA-05 | Predictive analytics kebutuhan kompetensi 6-12 bulan. | P2 | Hanya diluncurkan ketika data historis memenuhi minimum kualitas. |
| FR-WA-06 | Export data CSV, Excel, dan PDF. | P1 | Export mengikuti RBAC dan audit log. |
| FR-WA-07 | White-label dashboard untuk B2G. | P2 | Post-launch kecuali ada kontrak khusus. |

## **9.6 Cross-Region Job Matching**

| **ID** | **Requirement** | **Priority** | **Acceptance Criteria** |
|----|----|----|----|
| FR-CR-01 | Sistem mengumpulkan preferensi mobilitas saat onboarding. | P0 | Pilihan: local only, remote, hybrid, willing to relocate, specific city preference. |
| FR-CR-02 | Kandidat menerima peluang lintas wilayah sesuai profil dan preferensi. | P1 | Notifikasi dapat dikendalikan agar tidak spam. |
| FR-CR-03 | Peluang lintas wilayah dilengkapi biaya hidup, fasilitas, dan komunitas pendukung jika tersedia. | P1 | Jika data belum tersedia, sistem menampilkan placeholder yang jelas. |
| FR-CR-04 | Cross-region placement rate dilaporkan pada analytics dashboard. | P1 | Definisi placement harus konsisten dan tervalidasi. |
| FR-CR-05 | Matching mempertimbangkan logistik relokasi dan tipe kerja. | P2 | Faktor relokasi tidak boleh mendiskriminasi secara tidak adil. |

## **9.7 Account, Onboarding & Recruiter Management**

| **ID** | **Requirement** | **Priority** | **Acceptance Criteria** |
|----|----|----|----|
| FR-ACC-01 | Kandidat menyelesaikan onboarding awal \<10 menit. | P0 | Onboarding memiliki progress indicator dan opsi skip untuk field non-wajib. |
| FR-ACC-02 | Login email/password, Google OAuth, dan LinkedIn OAuth. | P0 | MFA wajib untuk role sensitif. |
| FR-ACC-03 | Upload CV PDF/DOCX dengan ekstraksi otomatis. | P0 | Jika parsing gagal, kandidat dapat input manual. |
| FR-ACC-04 | Kandidat mengatur visibilitas profil. | P0 | Public, semi-public, private, dan per-company consent. |
| FR-ACC-05 | Recruiter mengelola job posting dan pipeline. | P0 | Status seleksi dapat diubah dan diaudit. |
| FR-ACC-06 | Company verification sebelum recruiter melihat kandidat. | P0 | Admin approval atau automated verification wajib. |

## 9.8 Candidate Scoring & Selection Intelligence

Fitur ini menambahkan sistem skoring, leaderboard, dan kontrol tahapan
seleksi agar proses rekrutmen lebih objektif, cepat, dan tetap dapat
diaudit oleh manusia.

| **ID** | **Requirement** | **Priority** | **Acceptance Criteria** |
|----|----|----|----|
| FR-SC-01 | Sistem menghitung skor kandidat berdasarkan skill match, pengalaman, pendidikan/sertifikasi, lokasi, mobility preference, salary expectation, kelengkapan profil, dan sinyal interaksi. | P0 | Skor tampil dalam format 0-100; skor memiliki model_version dan minimal 3 alasan utama yang mudah dipahami. |
| FR-SC-02 | Sistem menampilkan candidate leaderboard per lowongan, program seleksi, atau tahap rekrutmen. | P1 | Recruiter/admin dapat filter berdasarkan tahap, skill, institusi, lokasi, status aplikasi, dan risk level. |
| FR-SC-03 | Sistem mendukung Seleksi Tahap 1, Seleksi Tahap 2, interview, accepted, rejected, dan custom stage sesuai konfigurasi admin. | P0 | Perubahan stage tercatat di audit log dengan user, timestamp, alasan, dan previous_status. |
| FR-SC-04 | Sistem menyediakan score breakdown untuk menjelaskan komponen skor kandidat. | P1 | Breakdown menampilkan komponen skor tanpa membuka data sensitif yang tidak sesuai consent. |
| FR-SC-05 | Admin/recruiter dengan izin khusus dapat melakukan manual override terhadap skor atau status kandidat. | P1 | Override wajib menyimpan alasan, approver, timestamp, dan dapat ditinjau kembali. |
| FR-SC-06 | AI Pre-Screening memvalidasi syarat minimum kandidat sebelum masuk shortlist atau leaderboard. | P0/P1 | Jika confidence rendah, kandidat tidak ditolak otomatis dan dikirim ke manual review. |
| FR-SC-07 | Sistem membedakan AI Match Score dan Candidate Score di seluruh UI, API, data model, dan analytics. | P0 | Tidak ada screen kandidat yang menampilkan ranking internal HR; field score_type wajib tersimpan. |
| FR-SC-08 | Sistem menggunakan status seleksi resmi untuk application pipeline. | P0 | Status minimal: Applied, Screening, Seleksi Tahap 1, Seleksi Tahap 2, Interview, Accepted, Rejected, Need Verification. |
| FR-SC-09 | Kandidat dapat melihat status lamaran dan alasan umum perubahan status yang aman ditampilkan. | P0 | Status berubah tampil maksimal 1 menit setelah update; alasan sensitif tetap disembunyikan. |
| FR-SC-10 | Recruiter wajib memberikan alasan saat melakukan reject, manual override, atau perubahan tahap sensitif. | P1 | Alasan tersimpan pada audit log dan tidak dapat dihapus oleh recruiter biasa. |
| FR-SC-11 | Leaderboard mendukung filter dan sort dasar. | P1 | Filter minimal: stage, skill, lokasi, score range, status apply, dan risk level sesuai permission. |

## 9.9 Anti-Fraud & Candidate Integrity Check

Fitur ini mendeteksi indikasi duplikasi dan anomali identitas kandidat
berdasarkan data yang diizinkan, terenkripsi, dan ditampilkan secara
tersamarkan.

| **ID** | **Requirement** | **Priority** | **Acceptance Criteria** |
|----|----|----|----|
| FR-AF-01 | Sistem mendeteksi duplikasi kandidat berdasarkan email, nomor WhatsApp, identitas terenkripsi, nama, dan pola profil yang mencurigakan. | P1 | Duplikasi tampil sebagai security flag dengan tipe indikasi, jumlah data terkait, dan tingkat risiko. |
| FR-AF-02 | Sistem menghitung fraud risk score untuk kandidat atau grup data mencurigakan. | P1 | Risk score diklasifikasikan sebagai Low, Medium, atau High dengan alasan yang dapat diaudit. |
| FR-AF-03 | Sistem menyediakan Security Flag Log untuk admin/security. | P1 | Admin dapat melihat daftar anomali, kandidat terkait, risk level, status review, dan tombol detail. |
| FR-AF-04 | Kandidat high risk masuk proses manual review. | P0/P1 | Sistem tidak mengambil keputusan penolakan final tanpa validasi manusia. |
| FR-AF-05 | Admin dapat menandai flag sebagai valid, false positive, perlu verifikasi ulang, merge duplicate, atau block account. | P1 | Setiap keputusan menyimpan alasan, reviewer, timestamp, dan audit trail. |
| FR-AF-06 | PII sensitif seperti NIK, email, dan nomor WhatsApp ditampilkan dalam bentuk tersamarkan. | P0 | UI tidak menampilkan data mentah kecuali user berwenang dan alasan akses dicatat. |
| FR-AF-07 | Kandidat dapat diminta verifikasi ulang jika data terdeteksi tidak konsisten. | P1 | Status Need Verification muncul pada application/profile; kandidat menerima notifikasi dan instruksi. |
| FR-AF-08 | Sistem menyediakan appeal flow untuk koreksi hasil parsing, skill, atau fraud flag yang salah. | P1 | Appeal memiliki status Open, In Review, Need Info, Approved, Rejected, Resolved. |
| FR-AF-09 | Fraud evidence yang ditampilkan ke admin harus tersamarkan. | P0 | NIK/nomor identitas, nomor telepon, dan email tidak tampil penuh; raw value tidak tersimpan di analytics. |
| FR-AF-10 | High risk fraud flag tidak boleh otomatis menjadi penolakan final. | P0 | Keputusan final hanya dapat dilakukan melalui manual review dengan alasan dan audit trail. |

## 9.10 Notification, Search, Filtering & Appeal Support

Fitur ini memperkuat pengalaman kandidat dan recruiter tanpa mengubah
struktur modul utama. Notification digunakan untuk status penting,
search/filter untuk mempercepat navigasi, dan appeal untuk koreksi data
atau hasil sistem.

| **ID** | **Requirement** | **Priority** | **Acceptance Criteria** |
|:---|:---|:---|:---|
| FR-NT-01 | Sistem menyediakan notification center untuk kandidat. | P1 | Kandidat menerima notifikasi status lamaran, rekomendasi penting, training, dan permintaan verifikasi. |
| FR-NT-02 | Sistem mengirim notifikasi recruiter untuk kandidat prioritas dan perubahan status review. | P1 | Recruiter dapat melihat notifikasi shortlist baru, high-score candidate, dan fraud review result. |
| FR-NT-03 | Kandidat dapat mengatur preferensi notifikasi. | P2 | Channel minimal in-app untuk MVP; email/push dapat bertahap pada Beta. |
| FR-NT-04 | Job search kandidat mendukung filter dasar. | P0 | Filter minimal: lokasi, remote/hybrid/on-site, salary range, skill, pengalaman, dan tipe pekerjaan. |
| FR-NT-05 | Candidate shortlist recruiter mendukung filter dan sorting. | P0 | Filter minimal: stage, match score, candidate score, skill, lokasi, pendidikan, dan risk level sesuai role. |
| FR-NT-06 | Appeal request dapat dibuat kandidat untuk koreksi data atau status verifikasi. | P1 | Kandidat dapat mengirim alasan, bukti, dan melihat status penyelesaian appeal. |

## 9.11 Role Access Matrix

Role access matrix digunakan sebagai dasar RBAC agar setiap fitur hanya
dapat diakses oleh pihak yang berwenang.

| **Fitur/Aksi** | **Kandidat** | **HR/Recruiter** | **Admin LENTERA** | **Super Admin/Security** |
|:---|:---|:---|:---|:---|
| Lihat AI Match Score | Ya, untuk lowongan yang direkomendasikan | Ya, untuk kandidat yang consented | Ya, untuk audit/support terbatas | Ya |
| Lihat Candidate Score | Tidak | Ya, untuk lowongan perusahaan sendiri | Ya, jika diperlukan untuk support/audit | Ya |
| Lihat Leaderboard | Tidak | Ya, untuk job milik perusahaan sendiri | Ya, untuk monitoring | Ya |
| Ubah Stage Seleksi | Tidak | Ya, sesuai permission | Ya, untuk override terbatas | Ya |
| Ajukan Appeal/Koreksi | Ya | Tidak | Dapat membuat ticket atas nama user jika support case | Ya |
| Review Fraud Case | Tidak | Tidak untuk evidence sensitif; hanya status umum | Ya, jika diberi role admin/security | Ya |
| Export Data | Data pribadi sendiri | Data kandidat consented dan job sendiri | Sesuai RBAC | Ya dengan audit wajib |
| Ubah Score Rule | Tidak | Tidak | Tidak, kecuali role model ops | Ya dengan approval |

# **10. Non-Functional Requirements**

## **10.1 Performance**

| **Layanan** | **Target SLA** | **Kondisi** |
|----|----|----|
| Job Matching API | \<2 detik p95; \<3 detik p99 | Normal load dan peak load. |
| Skill Gap Analysis | \<5 detik p95 | Full profile processing. |
| Training Recommendation | \<1 detik p95 | Setelah skill gap dihitung. |
| Analytics Dashboard Render | \<3 detik p95 | Dataset hingga 500.000 record. |
| Full-Text Job Search | \<500ms p95 | Elasticsearch query. |
| Push Notification Delivery | \<30 detik | End-to-end trigger ke penerimaan. |
| API Gateway Throughput | \>=30.000 request/menit | Total seluruh endpoint. |
| Job Matching Throughput | 5.000 request/menit launch; 50.000 full scale | Auto-scaled. |
| Candidate Scoring API | \<2 detik p95 | Perhitungan skor untuk shortlist normal per lowongan. |
| Leaderboard Render | \<3 detik p95 | Daftar hingga 1.000 kandidat dengan pagination dan filter dasar. |
| Notification Delivery | \<30 detik | In-app notification untuk status lamaran dan verifikasi. |
| Appeal Submission | \<1 detik p95 | Submit form appeal tanpa attachment besar. |
| Search & Filter Candidate | \<700ms p95 | Query recruiter dengan index dan permission filter. |

## **10.2 Availability & Reliability**

- Uptime SLA 99.9% untuk layanan kritikal: Auth, Job Matching, API
  Gateway, Job Search.

- Disaster Recovery: RTO \<4 jam dan RPO \<1 jam untuk layanan kritikal.

- Backup otomatis setiap 6 jam dengan retensi minimal 30 hari.

- Health check dan auto-healing menggunakan Kubernetes
  liveness/readiness probe.

- Incident severity P1-P4 dengan jalur eskalasi dan post-mortem wajib
  untuk P1/P2.

## **10.3 Security, Accessibility & Localization**

| **Kategori** | **Requirement** |
|----|----|
| Security | AES-256 at-rest, TLS 1.3 in-transit, RBAC, MFA, API key scoped, audit log tamper-evident, pentest tahunan, vulnerability scan per sprint. |
| Privacy | Consent management, right to access/delete, privacy-by-design, PII anonymization untuk training data. |
| Accessibility | WCAG 2.1 Level AA untuk flow utama kandidat, recruiter, dan admin. |
| Localization | Bahasa Indonesia sebagai default; copywriting harus mudah dipahami pengguna non-teknis. |
| Low-data mode | Asset ringan, lazy loading, caching, dan fallback konten saat koneksi tidak stabil. |
| Role Access | RBAC harus membedakan Candidate, Recruiter, Admin, Security, Model Ops, dan Super Admin; permission dicek di API dan UI. |
| Auditability Detail | Aksi stage update, score override, fraud review, export, role change, dan consent change wajib mencatat actor, role, timestamp, reason, before/after value, dan correlation_id. |
| Candidate Transparency | Kandidat hanya melihat informasi yang aman: status lamaran, alasan umum rekomendasi, dan permintaan verifikasi; ranking internal dan evidence sensitif tidak ditampilkan. |

# **11. Core Data Model**

Data model berikut menjadi baseline konseptual untuk backend schema,
analytics warehouse, dan fitur AI. Detail tipe data final akan
didefinisikan pada technical design document.

| **Entity** | **Field Utama** | **Relasi / Catatan** |
|----|----|----|
| Candidate | candidate_id, name, email, location, education, experience, skills, salary_expectation, mobility_preference, visibility_status | Memiliki banyak Application, SkillProfile, Consent, Event. PII terenkripsi. |
| Company | company_id, name, industry, location, verification_status, culture_tags, recruiter_users | Hanya company verified dapat melihat kandidat sesuai consent. |
| Recruiter | recruiter_id, company_id, role, permissions, mfa_status | RBAC untuk job posting, shortlist, analytics, export. |
| Job | job_id, company_id, title, description, skills_required, location, salary_range, job_type, status, expires_at | Sumber internal atau job board eksternal. |
| Application | application_id, candidate_id, job_id, status, source, timestamps | Status pipeline; sinkronisasi ATS jika tersedia. |
| Skill | skill_id, name, category, taxonomy_source, aliases | Taxonomy digunakan untuk matching dan gap analysis. |
| SkillProfile | candidate_id, skill_id, proficiency_level, evidence_source, confidence_score, updated_at | Dapat berasal dari CV, self-input, training, atau sertifikasi. |
| Course | course_id, provider_id, title, skill_targets, duration, price, difficulty, language, url | Data dari mitra pelatihan. |
| TrainingProgress | candidate_id, course_id, status, progress_pct, completed_at, certificate_url | Sinkronisasi API mitra atau input manual. |
| Consent | consent_id, candidate_id, data_scope, granted_to, purpose, status, expiry_date, revoked_at | Wajib untuk data sharing kandidat. |
| Recommendation | recommendation_id, candidate_id, job_id/course_id, score, explanation, model_version, created_at | Untuk audit model dan explainability. |
| Event | event_id, user_id, event_name, entity_id, timestamp, metadata | Basis analytics instrumentation. |
| CandidateScore | candidate_id, job_id, total_score, score_breakdown, explanation, model_version, created_at | Menyimpan hasil skoring kandidat dan alasan ranking untuk audit explainability. |
| SelectionStage | application_id, current_stage, previous_stage, changed_by, reason, updated_at | Menyimpan perpindahan tahapan seleksi dan audit trail. |
| StageConfig | stage_id, company_id, stage_name, order_index, is_locked, active_status | Konfigurasi tahapan seleksi per perusahaan/program. |
| FraudSignal | signal_id, candidate_id, signal_type, risk_level, evidence_hash, status, created_at | Menyimpan indikasi duplikasi atau anomali berbasis data tersamarkan/terenkripsi. |
| FraudCase | case_id, candidate_id, risk_score, review_status, reviewer_id, decision, decided_at | Menyimpan proses manual review untuk kasus high risk. |
| ScoreRule | rule_id, weight, description, active_status, version, updated_by | Menyimpan bobot dan aturan skoring agar dapat dikontrol dan diaudit. |
| ApplicationStatusHistory | history_id, application_id, old_status, new_status, actor_id, actor_role, reason, created_at | Menyimpan riwayat perubahan stage resmi dan alasan perubahan status. |
| Notification | notification_id, user_id, channel, type, title, body_safe, status, read_at, created_at | Digunakan untuk notifikasi status lamaran, rekomendasi, training, dan verifikasi. |
| AppealRequest | appeal_id, candidate_id, related_entity, reason, evidence_url, status, reviewer_id, resolved_at | Menyimpan koreksi/appeal kandidat untuk parsing, skill, status verifikasi, atau fraud flag. |
| RolePermission | role_id, permission_key, scope, active_status, updated_by, updated_at | Baseline RBAC untuk recruiter, admin, security, model ops, dan super admin. |
| AuditLog | audit_id, actor_id, actor_role, action, entity_type, entity_id, before_value, after_value, reason, correlation_id, timestamp | Mencatat aksi sensitif dan mendukung compliance/security review. |

# **12. AI/ML Requirements**

## **12.1 Model Inventory**

| **Model / Service** | **Input** | **Output** | **Primary Metrics** | **Fallback** |
|----|----|----|----|----|
| CV Parser & Skill Extractor | CV PDF/DOCX, profil manual, portofolio. | Skill list, proficiency estimate, confidence score. | Extraction F1, precision per skill category, manual correction rate. | Manual profile form dan candidate validation. |
| Job Matching Ranker | Candidate profile, job description, interaction history, constraints. | Ranked job list, match score, explanation. | Precision@10, Recall@10, NDCG@10, apply conversion. | Rule-based matching + popularity/location filters. |
| Skill Gap Analyzer | Skill profile, target role, market skill demand. | Gap report, priority skills, roadmap. | Gap relevance rating, training click-through, post-training improvement. | Static taxonomy-based gap calculation. |
| Training Recommender | Skill gaps, course catalog, candidate preference. | Ranked course list. | CTR, completion rate, rating, skill improvement signal. | Provider/category rules. |
| Workforce Forecasting | Historical jobs, applications, region, sector. | Skill demand forecast 6-12 bulan. | MAPE, trend accuracy, confidence interval. | Descriptive analytics only. |
| Candidate Scoring Engine | Candidate profile, job requirement, skill profile, interaction signals, stage history. | Total score, score breakdown, leaderboard rank, explanation. | Precision@K, shortlist acceptance, recruiter override rate, fairness gap. | Rule-based weighted scoring + manual review. |
| Fraud Signal Detector | Email/phone hash, identity hash, profile similarity, device/session metadata jika consent-safe. | Risk score, security flag, duplicate cluster, review recommendation. | Precision, false positive rate, review resolution rate. | Deterministic duplicate rules + manual security review. |
| Score Calibration Monitor | Match score, candidate score, stage outcome, recruiter feedback, apply/shortlist result. | Calibration report, score drift alert, override trend. | Calibration error, override rate, fairness gap, conversion by score bucket. | Freeze model version dan gunakan previous stable rule. |
| Notification Relevance Ranker | User preference, application status, recommendation urgency, event history. | Priority notification list. | Open rate, action rate, unsubscribe/mute rate. | Rule-based notification priority. |

## **12.2 Evaluation & Monitoring Plan**

| **Area** | **Requirement** |
|----|----|
| Offline evaluation | Setiap model memiliki test set dan validation set; metric minimum dicatat per release model. |
| Online evaluation | A/B testing untuk ranking, explanation, dan notification strategy. |
| Model drift | Monitoring distribusi skill, lokasi, job category, conversion rate, dan score calibration mingguan. |
| Retraining cadence | MVP: manual/on-demand; Beta: mingguan untuk ranker; Launch: terjadwal dengan approval MLOps. |
| Model registry | Setiap model memiliki model_version, training data snapshot, metrics, owner, dan rollback plan. |
| Bias audit | Kuartalan untuk gender, wilayah, pendidikan, usia secara anonim dan agregat; hasil masuk AI Ethics review. |
| Explainability | Setiap rekomendasi harus menyertakan faktor positif dan gap utama tanpa membuka informasi sensitif. |
| Low confidence handling | Jika confidence score di bawah threshold, sistem meminta validasi manual atau memakai fallback rule-based. |
| Scoring calibration | Distribusi skor, ranking stability, recruiter acceptance, dan override rate dipantau per model_version. |
| Fraud false positive monitoring | Kasus false positive wajib ditandai dan digunakan untuk memperbaiki aturan deteksi. |
| Human-in-the-loop governance | Skor rendah atau risk tinggi tidak menjadi keputusan final otomatis pada area berdampak tinggi. |
| Score separation validation | Setiap release wajib menguji bahwa AI Match Score dan Candidate Score tidak tertukar pada UI, API, analytics, dan report. |
| Appeal feedback loop | Appeal yang approved menjadi data koreksi untuk memperbaiki parser, skill taxonomy, scoring rule, dan fraud signal rule. |
| Human review threshold | Threshold low confidence dan high risk harus dapat dikonfigurasi oleh admin/model ops dengan approval dan audit trail. |

## **12.3 AI Ethics Guardrails**

- Model tidak boleh menggunakan atribut sensitif sebagai fitur
  diskriminatif untuk ranking kandidat.

- Data lokasi boleh digunakan untuk preferensi dan logistik, tetapi
  harus diaudit agar tidak menutup peluang lintas wilayah secara tidak
  adil.

- Recruiter tidak boleh melihat data kandidat tanpa consent dan
  verification status yang valid.

- Sistem harus menyediakan mekanisme appeal/report jika kandidat menilai
  rekomendasi tidak adil.

- Model card wajib tersedia untuk model yang memengaruhi ranking, skill
  gap, dan forecasting.

- Candidate scoring dan fraud risk score wajib menyediakan alasan, audit
  trail, dan mekanisme manual review untuk mencegah keputusan otomatis
  yang tidak adil.

# **13. Consent, Privacy & Data Governance**

## **13.1 Consent Flow**

1\. Kandidat membuat akun dan menerima penjelasan singkat tentang data
yang diproses.

2\. Sebelum upload CV, kandidat memberi consent untuk parsing CV dan
ekstraksi profil.

3\. Setelah ekstraksi, kandidat dapat mengedit skill, pengalaman,
pendidikan, dan preferensi.

4\. Kandidat memilih visibility: private, semi-public, public, atau
share only when applying.

5\. Recruiter hanya dapat melihat data kandidat jika company verified
dan kandidat memberi izin sesuai scope.

6\. Kandidat dapat mencabut consent, mengubah visibility, atau menghapus
profil kapan saja.

7\. Data untuk B2G/institusi hanya dalam bentuk agregat dan anonim,
kecuali ada consent spesifik dan dasar hukum yang valid.

## 13.1.1 Candidate Transparency & Appeal Rules

- Kandidat berhak melihat status lamaran dan alasan umum rekomendasi
  yang tidak membuka informasi internal perusahaan atau kandidat lain.

- Kandidat dapat meminta koreksi jika hasil parsing CV, skill profile,
  data profil, atau status verifikasi tidak sesuai.

- Appeal tidak menjamin perubahan keputusan seleksi, tetapi wajib
  diproses sesuai SLA dan dicatat pada audit log.

- Informasi fraud evidence yang bersifat sensitif hanya boleh dilihat
  oleh role admin/security yang berwenang dalam bentuk tersamarkan.

- Data yang digunakan untuk ranking internal tidak boleh ditampilkan
  sebagai leaderboard publik kandidat.

## **13.2 Data Governance Rules**

| **Area** | **Rule** |
|----|----|
| Data minimization | Sistem hanya menyimpan data yang dibutuhkan untuk matching, skill gap, training, analytics, atau compliance. |
| PII encryption | Email, nomor telepon, CV, riwayat lamaran, dan identitas personal disimpan terenkripsi. |
| Data retention | Data kandidat aktif disimpan selama akun aktif; akun terhapus diproses sesuai kebijakan retention dan legal hold. |
| Anonymization | Data untuk training model dan B2G analytics wajib dihapus PII dan diagregasi. |
| Auditability | Akses recruiter, export data, perubahan role, dan privilege action dicatat di audit log. |
| Data subject rights | Kandidat dapat meminta akses, koreksi, portabilitas, dan penghapusan data. |
| Appeal handling | Permintaan koreksi/appeal harus menyimpan alasan, bukti, status review, reviewer, keputusan, dan waktu penyelesaian. |
| Masked evidence | Evidence untuk fraud dan duplicate check wajib ditampilkan dalam bentuk tersamarkan serta tidak masuk analytics raw. |
| Score visibility | AI Match Score dapat ditampilkan kepada kandidat; Candidate Score dan leaderboard internal hanya untuk role perusahaan/admin berizin. |

# **14. API Contract & Integration**

## **14.1 API Principles**

- API menggunakan versioning eksplisit: /api/v1/... dan tidak melakukan
  breaking change tanpa versi baru.

- Auth memakai OAuth 2.0 untuk user/session dan API key scoped untuk
  klien B2B/B2G.

- Semua endpoint menulis audit log untuk aksi sensitif seperti export,
  visibility, dan status lamaran.

- Rate limit diterapkan per client_id, role, dan endpoint sensitivity.

- Webhook mendukung retry, signature verification, dan idempotency key.

## **14.2 Initial Endpoint Catalog**

| **Method** | **Endpoint** | **Purpose** | **Auth** | **Priority** |
|----|----|----|----|----|
| POST | /api/v1/auth/login | Login user dan session token. | User Auth | P0 |
| POST | /api/v1/candidates | Membuat profil kandidat. | User Auth | P0 |
| POST | /api/v1/candidates/{id}/cv | Upload CV dan trigger parsing. | User Auth | P0 |
| GET | /api/v1/candidates/{id}/recommendations/jobs | Mengambil job recommendation. | User Auth | P0 |
| POST | /api/v1/recommendations/{id}/feedback | Submit thumbs up/down, save, skip. | User Auth | P0 |
| GET | /api/v1/candidates/{id}/skill-gap | Menghasilkan/mengambil gap report. | User Auth | P0 |
| GET | /api/v1/candidates/{id}/training-recommendations | Mengambil rekomendasi training. | User Auth | P0 |
| POST | /api/v1/jobs | Membuat job posting. | Recruiter Auth | P0 |
| GET | /api/v1/jobs/search | Full-text job search. | User Auth/API Key | P0 |
| POST | /api/v1/applications | Kandidat melamar pekerjaan. | User Auth | P0 |
| GET | /api/v1/recruiters/jobs/{id}/shortlist | Mengambil shortlist kandidat. | Recruiter Auth | P0 |
| GET | /api/v1/analytics/workforce | Dashboard workforce agregat. | B2G/API Key | P1 |
| POST | /api/v1/webhooks/ats/status | Menerima status dari ATS. | Signed Webhook | P1 |
| GET | /api/v1/jobs/{id}/candidate-scores | Mengambil daftar skor dan leaderboard kandidat untuk lowongan. | Recruiter Auth | P1 |
| GET | /api/v1/applications/{id}/score | Mengambil score breakdown dan explanation kandidat. | Recruiter/Auth Scoped | P1 |
| POST | /api/v1/applications/{id}/stage | Mengubah tahap seleksi kandidat. | Recruiter Auth | P0 |
| GET | /api/v1/admin/fraud-cases | Mengambil daftar kasus fraud dan security flag. | Admin/Security Auth | P1 |
| POST | /api/v1/admin/fraud-cases/{id}/decision | Menyimpan keputusan manual review fraud. | Admin/Security Auth | P1 |
| GET | /api/v1/admin/scoring-rules | Mengambil konfigurasi bobot skoring. | Admin Auth | P1 |
| GET | /api/v1/applications/{id}/status-history | Mengambil riwayat status lamaran yang aman untuk kandidat. | User Auth Scoped | P0 |
| GET | /api/v1/notifications | Mengambil daftar notifikasi user. | User Auth | P1 |
| PATCH | /api/v1/notifications/{id}/read | Menandai notifikasi sebagai sudah dibaca. | User Auth | P1 |
| POST | /api/v1/appeals | Membuat appeal/koreksi data kandidat. | User Auth | P1 |
| GET | /api/v1/admin/appeals | Mengambil daftar appeal untuk review admin/support. | Admin/Support Auth | P1 |
| POST | /api/v1/admin/appeals/{id}/decision | Menyimpan keputusan appeal. | Admin/Support Auth | P1 |
| GET | /api/v1/audit-logs | Mengambil audit log sesuai permission dan filter. | Admin/Security Auth | P0 |
| GET | /api/v1/recruiters/jobs/{id}/candidates/search | Search/filter kandidat pada shortlist lowongan. | Recruiter Auth | P0 |

## **14.3 Error Handling & Rate Limit**

| **Code** | **Meaning** | **Expected Behavior** |
|----|----|----|
| 400 | Bad Request | Tampilkan pesan validasi field. |
| 401 | Unauthorized | Minta login ulang atau refresh token. |
| 403 | Forbidden | User tidak memiliki akses atau consent tidak valid. |
| 404 | Not Found | Resource tidak tersedia atau sudah expired. |
| 409 | Conflict | Idempotency conflict atau duplicate application. |
| 422 | Unprocessable Entity | CV tidak dapat diparse atau data tidak memenuhi rule. |
| 429 | Too Many Requests | Terapkan retry-after dan UI cooldown. |
| 500 | Server Error | Log correlation_id dan tampilkan fallback message. |
| 423 | Locked / Under Review | Data kandidat atau aplikasi sedang dalam manual review sehingga aksi tertentu ditahan sementara. |
| 451 | Unavailable for Legal/Policy Reason | Data tidak dapat ditampilkan karena consent, policy, legal hold, atau privacy restriction. |

# **15. Analytics Instrumentation**

Event tracking wajib agar OKR dapat diukur konsisten. Semua event harus
memiliki timestamp, user_id anonim/pseudonymous, role, platform,
session_id, app_version, dan consent-safe metadata.

| **Event Name** | **Trigger** | **Key Properties** | **Metric Impact** |
|----|----|----|----|
| signup_started | User membuka registrasi. | platform, source_campaign | Activation funnel. |
| signup_completed | Akun berhasil dibuat. | role, auth_method | Activation. |
| profile_completed | Profil minimum selesai. | completion_pct, duration_sec | Onboarding success. |
| cv_uploaded | CV berhasil diunggah. | file_type, file_size, parse_status | CV funnel. |
| skill_extracted | Skill extraction selesai. | skill_count, avg_confidence | Model quality. |
| job_recommendation_viewed | Rekomendasi tampil. | recommendation_id, model_version | Recommendation reach. |
| job_feedback_submitted | Thumbs up/down, save, skip. | feedback_type, job_id, score | Model feedback. |
| job_applied | Kandidat apply. | job_id, match_score, source | Conversion. |
| skill_gap_report_viewed | Gap report dibuka. | target_role, gap_count | Skill gap adoption. |
| training_started | Kursus dimulai. | provider, course_id, skill_target | Training adoption. |
| training_completed | Kursus selesai. | provider, course_id, duration_days | Completion rate. |
| cross_region_job_clicked | Kandidat klik peluang lintas wilayah. | origin, destination, job_id | Cross-region interest. |
| recruiter_shortlist_generated | Shortlist dibuat. | job_id, candidate_count | Recruiter value. |
| candidate_status_updated | Status pipeline berubah. | old_status, new_status, source | Time-to-hire. |
| report_exported | Dashboard diekspor. | format, role, data_scope | B2B/B2G adoption + audit. |
| candidate_score_generated | Skor kandidat berhasil dihitung. | job_id, model_version, total_score_bucket | Scoring quality + audit. |
| leaderboard_viewed | Recruiter/admin membuka leaderboard. | job_id, filter_used, candidate_count | Recruiter adoption. |
| selection_stage_updated | Status/tahap kandidat berubah. | old_stage, new_stage, actor_role | Pipeline velocity + audit. |
| fraud_signal_detected | Sistem menemukan indikasi duplikasi/anomali. | signal_type, risk_level, evidence_count | Security monitoring. |
| fraud_case_reviewed | Admin/security menyelesaikan review kasus. | decision, risk_level, review_duration | Fraud review SLA. |
| notification_sent | Sistem mengirim notifikasi. | channel, notification_type, delivery_status | Notification delivery success. |
| notification_opened | User membuka notifikasi. | notification_type, channel, user_role | Engagement. |
| appeal_request_created | Kandidat membuat appeal/koreksi. | related_entity, reason_category | Trust + support load. |
| appeal_resolved | Admin menyelesaikan appeal. | decision, resolution_time, reason_category | Appeal SLA + model feedback. |
| candidate_filter_used | Recruiter menggunakan filter shortlist. | filter_type, job_id, result_count | Recruiter productivity. |
| job_filter_used | Kandidat menggunakan filter job search. | filter_type, result_count | Search relevance. |
| audit_sensitive_action_logged | Aksi sensitif berhasil dicatat. | action, actor_role, entity_type | Compliance monitoring. |

## **15.1 Privacy Rules for Analytics**

- Analytics tidak boleh menyimpan CV raw, alamat lengkap, nomor
  identitas, atau isi pesan pribadi.

- Metadata event harus dipseudonymize dan mengikuti consent pengguna.

- Event export untuk B2G harus agregat, anonim, dan melalui permission
  gate.

- Event terkait rekomendasi harus menyimpan model_version untuk audit
  dan rollback.

# **16. Admin & Internal Operations**

| **Capability** | **User** | **Requirement** | **Priority** |
|----|----|----|----|
| Company Verification | Admin | Admin memverifikasi legalitas perusahaan sebelum recruiter dapat mengakses shortlist kandidat. | P0 |
| Job Moderation | Admin | Admin dapat menandai, menolak, atau menghapus lowongan palsu/berisiko. | P0 |
| User Support Console | Support | Support dapat melihat status akun, ticket, dan issue tanpa membuka data sensitif berlebihan. | P1 |
| Audit Log Viewer | Security/Admin | Admin dapat meninjau akses data, export, role change, dan privilege action. | P0 |
| Integration Monitoring | Ops/Engineer | Dashboard status API job board, ATS, training provider, webhook retry. | P1 |
| Model Performance Dashboard | Data Science | Monitoring precision, conversion, drift, feedback, dan bias indicators. | P1 |
| Manual Override | Admin/PM | Mekanisme human curation untuk kategori pekerjaan jika akurasi model rendah. | P1 |
| Content Partner Approval | Partnership/Admin | Workflow untuk mengaktifkan provider training dan mapping skill target. | P2 |
| Abuse Reporting | Candidate/Recruiter/Admin | User dapat melaporkan scam, diskriminasi, atau lowongan mencurigakan. | P0 |
| Stage Control | Recruiter/Admin | Mengatur perpindahan kandidat antar tahap seleksi dan mengunci tahap tertentu jika dibutuhkan. | P0/P1 |
| Candidate Scoring Rule Management | Admin/PM | Mengatur bobot komponen skor, versi aturan, dan status aktif rule. | P1 |
| Anti-Fraud Review Console | Security/Admin | Meninjau fraud case, security flag, evidence tersamarkan, dan keputusan review. | P1 |
| Security Flag Log | Security/Admin | Melihat riwayat flag, status review, false positive, dan tindakan admin. | P1 |
| Appeal Review Console | Support/Admin | Support/admin dapat meninjau appeal kandidat, meminta bukti tambahan, dan menyimpan keputusan. | P1 |
| Role & Permission Management | Super Admin/Security | Super admin mengelola permission sensitif seperti export, fraud review, score rule, dan audit log access. | P0 |
| Audit Log Detail Viewer | Security/Admin | Admin dapat memfilter audit log berdasarkan actor, role, action, entity, waktu, dan correlation_id. | P0 |
| Notification Operations | Admin/Growth | Admin dapat memantau delivery status, template aman, dan kategori notifikasi. | P1 |

# **17. UX Screen Inventory**

| **Role** | **Screen / Flow** | **Purpose** | **MVP Priority** |
|----|----|----|----|
| Kandidat | Onboarding & Consent | Registrasi, consent, profil minimum, mobility preference. | P0 |
| Kandidat | Upload CV & Skill Review | Upload CV, lihat hasil ekstraksi, edit skill. | P0 |
| Kandidat | Job Feed | Rekomendasi personal, filter, save, skip, apply. | P0 |
| Kandidat | Job Detail | Match score, explanation, salary range, company info. | P0 |
| Kandidat | Skill Gap Report | Gap chart, priority skills, roadmap. | P0 |
| Kandidat | Training Recommendation | Kursus rekomendasi, durasi, provider, harga, progress. | P0/P1 |
| Kandidat | Application Tracker | Status lamaran dan notifikasi. | P1 |
| Recruiter | Company Dashboard | Overview pipeline dan posting. | P0 |
| Recruiter | Job Posting Form | Buat dan kelola lowongan. | P0 |
| Recruiter | Candidate Shortlist | Daftar kandidat, score, status, consent gate. | P0 |
| Recruiter | Pipeline Board | Kanban/status seleksi. | P1 |
| B2G | Regional Dashboard | Heatmap dan trend agregat. | P1 |
| B2G | Report Export | Export PDF/Excel/CSV. | P1 |
| Admin | Company Verification | Review perusahaan dan recruiter. | P0 |
| Admin | Job Moderation | Moderasi lowongan dan laporan abuse. | P0 |
| Admin | Audit & Monitoring | Audit log, API health, model health. | P1 |
| Recruiter | Candidate Leaderboard | Ranking kandidat berdasarkan skor, filter, dan alasan rekomendasi. | P1 |
| Recruiter | Stage Control | Memindahkan kandidat antar Seleksi Tahap 1, Seleksi Tahap 2, interview, accepted, rejected. | P0/P1 |
| Recruiter | Score Breakdown View | Melihat komponen skor kandidat secara explainable dan consent-safe. | P1 |
| Admin | Anti-Fraud Dashboard | Ringkasan kasus duplikasi, total risk score, filter risk level, dan manual review. | P1 |
| Admin | Security Flag Log | Daftar anomali identitas, evidence tersamarkan, status review, dan detail kasus. | P1 |
| Admin | Scoring Rule Configuration | Mengatur bobot skor, versi rule, status aktif, dan audit perubahan. | P1 |
| Kandidat | Notification Center | Melihat notifikasi status lamaran, rekomendasi, training, dan verifikasi. | P1 |
| Kandidat | Application Status Timeline | Melihat timeline status Applied sampai Accepted/Rejected/Need Verification. | P0 |
| Kandidat | Appeal / Data Correction Form | Mengajukan koreksi CV parsing, skill, profil, atau status verifikasi. | P1 |
| Kandidat | Job Search & Filter | Filter lowongan berdasarkan lokasi, skill, salary, tipe kerja, dan pengalaman. | P0 |
| Recruiter | Candidate Search & Filter | Filter shortlist berdasarkan score, stage, skill, lokasi, pendidikan, dan risk level. | P0 |
| Recruiter | Score Breakdown Panel | Melihat perbedaan match score dan candidate score serta alasan utama. | P1 |
| Admin/Security | Role Access Management | Mengatur permission sensitif dan role internal. | P0 |
| Support/Admin | Appeal Review Screen | Menyelesaikan request koreksi kandidat dan mencatat keputusan. | P1 |

## **17.1 UX Acceptance Rules**

- Semua flow P0 harus memiliki empty state, error state, loading state,
  dan success state.

- Setiap rekomendasi AI harus memiliki explanation yang ringkas dan
  dapat dimengerti.

- Mobile kandidat harus mendukung low-data mode dan responsif di
  smartphone low-end.

- Admin dan recruiter screen harus memprioritaskan auditability dan
  permission clarity.

- Semua screen utama harus diuji dengan accessibility checklist WCAG 2.1
  AA.

- Screen kandidat wajib membedakan antara status yang dapat dilihat
  kandidat dan informasi internal recruiter/admin.

- Score UI wajib memberi label jelas: AI Match Score untuk kecocokan
  lowongan, Candidate Score untuk seleksi internal HR.

- Form appeal harus memiliki status tracker, pesan validasi, dan
  notifikasi penyelesaian.

- Filter shortlist recruiter harus tetap menghormati consent dan role
  permission.

# **18. Technical Architecture**

## **18.1 Infrastructure Stack**

| **Layer** | **Teknologi** | **Catatan** |
|----|----|----|
| Cloud Provider | GCP / AWS Hybrid | Primary workload cloud; opsi on-premise untuk data sovereignty B2G. |
| Containerization | Docker + Kubernetes | Microservices, HPA, rolling/canary deployment. |
| Model Serving | vLLM / TensorRT-LLM + FastAPI | NLP inference dan recommender serving. |
| API Gateway | Kong / AWS API Gateway | Routing, auth, rate limit, versioning. |
| Message Queue | Apache Kafka | Async processing, notification, analytics, integration sync. |
| Search Engine | Elasticsearch | Full-text search dan aggregation. |
| CDN | Cloudflare / CloudFront | Static asset distribution dan edge caching. |
| CI/CD | GitHub Actions | Automated build, test, deploy. |
| Monitoring | Prometheus + Grafana + ELK | Metrics, logs, alerting, debugging. |

## **18.2 Database Stack**

| **Database** | **Kegunaan** | **Catatan** |
|----|----|----|
| Supabase Database | Data transaksional inti. | Source of truth untuk kandidat, lowongan, aplikasi, consent, audit log, dan RBAC; gunakan Row Level Security, migration SQL, backup, read replica/branching sesuai kebutuhan scale. |
| Supabase JSONB | Profil fleksibel kandidat. | Menyimpan atribut profil yang bervariasi di kolom JSONB Supabase agar MVP tetap terkonsolidasi; field sensitif tetap mengikuti RLS, masking, dan audit akses. |
| Redis | Caching dan session. | Hot data untuk response cepat. |
| Supabase pgvector / Pinecone / Weaviate | Vector database. | MVP dapat memakai pgvector di Supabase untuk semantic matching; Pinecone/Weaviate menjadi opsi scale-out jika volume embedding dan latency melebihi kapasitas Supabase. |
| Elasticsearch | Search index dan agregasi. | Full-text job search dan analytics. |
| Supabase Storage | CV dan aset pengguna. | Private bucket, signed URL, policy berbasis RLS, encryption, dan audit akses untuk data kandidat sensitif. |

## **18.3 Infrastructure Assumption Update**

<table style="width:97%;">
<colgroup>
<col style="width: 97%" />
</colgroup>
<thead>
<tr>
<th><p><strong>Rekomendasi Revisi Infrastruktur</strong></p>
<p>GPU 4x NVIDIA A100 dapat menjadi target full-scale, tetapi untuk MVP
disarankan memakai pendekatan bertahap: managed inference, vector
search, model distillation, dan autoscaling berbasis demand. Ini
menurunkan risiko biaya sebelum product-market fit.</p></th>
</tr>
</thead>
<tbody>
</tbody>
</table>

# **19. Timeline & Milestones**

| **Fase** | **Periode** | **Deliverables Utama** | **Gate Condition** |
|----|----|----|----|
| Fase 0: Foundation | Bulan 1-2 | Cloud setup, API design, data awal, team readiness, security baseline. | GPU/compute plan siap; API design selesai; MoU job board prioritas diproses. |
| Fase 1: MVP Job Matching | Bulan 3-5 | Matching engine 5 kategori, integrasi 2 job board, profile kandidat, admin basic. | Akurasi internal \>70%; response \<2 detik; P0 onboarding selesai. |
| Fase 2: Skill Gap & Training | Bulan 5-7 | Skill Gap Advisor v1, training recommendation, candidate dashboard. | Gap report relevan \>80%; tracking training tersedia. |
| Fase 3: Integration & Cross-Region | Bulan 7-9 | Cross-region beta, recruiter dashboard, generic ATS, B2B pilot. | 5 perusahaan pilot; shortlist flow berjalan; cross-region interest tracked. |
| Fase 4: Beta & Refinement | Bulan 9-11 | Beta 5.000 user, model refinement, B2G pilot, notification. | Audit keamanan lulus; NPS beta \>40; MAU beta 5.000. |
| Fase 5: Launch & Scale | Bulan 12 | Go-live, SLA enforcement, 10.000 concurrent users. | Semua P0 done & tested; no critical security issue; runbook live. |

# **20. Team, Ownership & RACI**

## **20.1 Team Allocation**

| **Role** | **Jumlah** | **Tanggung Jawab Utama** | **Fase** |
|----|----|----|----|
| Lead AI/ML Engineer | 1 | Model architecture, matching algorithm, NLP pipeline, evaluation. | 0-5 |
| Data Scientists | 2 | Skill gap modeling, predictive analytics, bias testing. | 1-5 |
| Backend Engineers | 2 | API, microservices, integrations, database. | 0-5 |
| Frontend/Mobile Developers | 2 | Web app, mobile app, dashboards, UI components. | 1-5 |
| Data Engineer | 1 | ETL, data quality, labeling, warehouse. | 0-5 |
| DevOps/MLOps Engineer | 1 | CI/CD, Kubernetes, model deployment, monitoring. | 0-5 |
| UI/UX Designer | 1 | Research, design system, usability testing. | 0-4 |
| Business Analyst | 1 | Market requirements, B2B/B2G liaison, pricing inputs. | 0-5 |
| Project Manager | 1 | Timeline, stakeholder management, risk monitoring. | 0-5 |

## **20.2 RACI Ringkas**

| **Workstream** | **Responsible** | **Accountable** | **Consulted** | **Informed** |
|----|----|----|----|----|
| Product Scope & Prioritization | PM | PM | BA, Engineering Lead, Design | Stakeholders |
| AI Model Development | Lead AI/ML, Data Scientists | Lead AI/ML | PM, Data Engineer, Legal | Engineering Team |
| Backend & API | Backend Engineers | Engineering Lead | DevOps, PM | QA, Design |
| UX/UI | UI/UX Designer | PM | Candidates, Recruiters, BA | Engineering |
| Security & Compliance | DevOps/Security Owner | PM + Legal | Engineering, Data Science | Leadership |
| B2B/B2G Partnerships | BA | PM | Legal, Engineering | Leadership |
| QA & Release | QA Owner/Engineering | PM | All workstream leads | Stakeholders |

# **21. QA Strategy & Definition of Done**

## **21.1 Test Strategy**

| **Test Type** | **Scope** | **Owner** | **Exit Criteria** |
|----|----|----|----|
| Unit Test | Backend service, utilities, model helper functions. | Engineering | Coverage minimum sesuai standar tim; critical paths covered. |
| Integration Test | Job board, ATS, training provider, auth, webhook. | Engineering + QA | Happy path dan failure path pass. |
| Model Evaluation | Matching, extraction, skill gap, recommendation. | Data Science | Metric minimum per release terpenuhi dan tercatat. |
| Performance Test | Matching API, search, dashboard, notification. | DevOps + QA | SLA p95/p99 terpenuhi pada simulated load. |
| Security Test | Auth, RBAC, API key, OWASP, data access. | Security/DevOps | No critical/high vulnerability sebelum release. |
| Accessibility Test | Flow utama kandidat, recruiter, admin. | Design + QA | WCAG 2.1 AA untuk screen utama. |
| UAT | Candidate, recruiter, B2G pilot user. | PM + BA | Sign-off stakeholder untuk scenario prioritas. |
| Scoring & ranking tests | Validasi konsistensi skor, leaderboard sorting, score breakdown, dan fallback rule-based. | QA + Data Science | Skor deterministik untuk test case, tidak ada data sensitif bocor, dan explanation tampil. |
| Anti-fraud tests | Validasi duplicate detection, risk level, false positive handling, dan manual review workflow. | QA + Security | Security flag akurat pada data uji, high risk masuk manual review, dan audit trail lengkap. |
| Stage control tests | Validasi perubahan tahap, RBAC, lock stage, dan audit log. | QA + Backend | Status berubah sesuai role, konflik terdeteksi, dan audit log tercatat. |
| RBAC Test | Permission matrix kandidat, recruiter, admin, security, super admin. | QA + Security | User tidak dapat mengakses data/aksi di luar role dan consent. |
| Score Separation Test | AI Match Score vs Candidate Score di UI, API, analytics, dan report. | QA + Data Science | Tidak ada leakage ranking internal ke kandidat. |
| Appeal Flow Test | Create appeal, review admin, need info, approve/reject, notification. | QA + Support | Semua status dan notifikasi berjalan sesuai SLA. |
| Notification Test | Delivery, read status, template safe content, retry handling. | QA + Engineering | Notifikasi penting terkirim dan tidak memuat data sensitif. |
| Search/Filter Test | Job filter kandidat dan candidate filter recruiter. | QA + Engineering | Filter akurat, cepat, dan menerapkan permission filter. |

## **21.2 Definition of Done**

| **Kategori** | **Definition of Done** |
|----|----|
| Functional | Semua acceptance criteria untuk requirement terkait pass. |
| Code Quality | Code review selesai; lint dan test otomatis pass. |
| Security | Tidak ada vulnerability critical/high; RBAC dan audit log berjalan untuk aksi sensitif. |
| Performance | Memenuhi SLA p95/p99 yang relevan. |
| Analytics | Event tracking aktif, tervalidasi, dan masuk dashboard analytics. |
| Accessibility | Screen terkait memenuhi checklist WCAG 2.1 AA atau memiliki exception yang disetujui. |
| Documentation | API docs, release notes, runbook, dan user guide internal tersedia. |
| Model Governance | Model version, metrics, model card, dan rollback plan tersedia untuk fitur AI. |
| UAT | PM, QA, dan stakeholder terkait memberi approval. |
| Governance | Fitur scoring, stage control, fraud review, appeal, dan export memiliki audit log lengkap. |
| Transparency | Kandidat dapat melihat status lamaran dan alasan umum tanpa membuka ranking internal atau data sensitif. |
| RBAC | Semua endpoint dan screen sensitif memiliki permission check dan test negatif. |
| Notification | Template notifikasi telah direview agar tidak membocorkan PII atau alasan internal seleksi. |

# **22. Edge Cases & Failure Handling**

| **Scenario** | **Expected Behavior** | **Owner** |
|----|----|----|
| CV gagal dibaca | Tampilkan alasan umum, minta upload ulang atau input manual; log parse_error. | Backend + UX |
| Skill extraction confidence rendah | Tandai skill perlu validasi; kandidat dapat approve/edit/delete. | AI/ML + UX |
| Tidak ada job cocok | Tampilkan saved search, training recommendation, dan opsi memperluas lokasi/kategori. | PM + Backend |
| Lowongan expired | Sembunyikan dari feed dan beri pesan jika kandidat membuka link lama. | Backend |
| Kandidat tidak memberi consent | Recruiter tidak dapat melihat profil; data hanya diproses sesuai scope minimal. | Backend + Legal |
| Recruiter belum verified | Akses shortlist dikunci sampai company verification selesai. | Admin + Backend |
| ATS sync gagal | Retry dengan exponential backoff; tampilkan status sync error dan manual export fallback. | Backend + DevOps |
| Training provider API down | Gunakan cache katalog terakhir; progress sync ditandai pending. | Backend |
| Dashboard dataset terlalu besar | Gunakan pagination, pre-aggregated metrics, dan async export. | Data + Backend |
| Model service unavailable | Fallback rule-based matching dan incident alert ke on-call. | MLOps |
| Koneksi internet lambat | Aktifkan low-data mode, skeleton loading, dan retry ringan. | Mobile/Web |
| User request deletion | Mulai workflow deletion, masking/anonymization sesuai retention policy, dan kirim konfirmasi. | Privacy Ops |
| Kandidat memiliki email atau WhatsApp yang sama dengan kandidat lain. | Sistem membuat security flag, menampilkan data tersamarkan, dan mengirim kasus ke manual review jika risk medium/high. | Security/Admin |
| Skor kandidat sangat tinggi tetapi fraud risk juga tinggi. | Kandidat tetap muncul dengan warning internal dan tidak dapat diproses final sebelum manual review selesai. | Recruiter Success + Security |
| Recruiter mencoba mengubah tahap kandidat tanpa izin. | Sistem menolak aksi dengan 403, menampilkan pesan akses, dan mencatat percobaan di audit log. | Backend + Security |
| AI pre-screening confidence rendah. | Sistem memakai fallback rule-based atau meminta validasi manusia, bukan menolak kandidat otomatis. | Data Science + PM |
| Bobot score rule diubah saat seleksi sedang berjalan. | Sistem menyimpan versioning score rule dan tidak menghapus skor historis. | PM + Backend |
| Kandidat tidak setuju dengan hasil parsing CV | Tampilkan opsi edit manual dan appeal; status skill ditandai user-corrected. | UX + Backend |
| Candidate Score tinggi tetapi ada fraud high risk | Tahan stage otomatis; tampilkan Need Verification/manual review sebelum recruiter memproses lebih lanjut. | Admin + Security |
| Recruiter mencoba melihat kandidat tanpa consent | API mengembalikan 403; UI menampilkan consent restriction. | Backend + Security |
| Notification gagal terkirim | Retry sesuai policy; fallback in-app notification; log delivery_failed. | Engineering |
| Appeal melewati SLA | Escalate ke support/admin lead dan tampilkan status pending ke kandidat. | Support Ops |
| Score rule berubah saat seleksi berjalan | Simpan model_version/rule_version lama pada skor yang sudah dihitung; recalculation harus eksplisit. | Data Science + Backend |
| Filter recruiter menghasilkan kandidat kosong | Tampilkan empty state dan saran melonggarkan filter. | UX |

# **23. Risk Registry & Mitigation**

| **ID** | **Risiko** | **Dampak** | **Prob.** | **Mitigasi** | **Contingency** |
|----|----|----|----|----|----|
| R1 | Akurasi model job matching rendah. | Tinggi | Sedang | A/B testing, feedback loop, model iteration per sprint. | Human-curation layer untuk kategori populer. |
| R2 | Bias algoritma rekrutmen. | Sangat Tinggi | Sedang | Bias audit kuartalan, anonymization fitur sensitif, AI Ethics review. | Pause model pada kategori bermasalah dan manual review. |
| R3 | Adopsi perusahaan rendah. | Tinggi | Sedang | Freemium UKM, pilot sejak awal, early-adopter pricing. | Pivot B2C premium sementara. |
| R4 | Kualitas data pasar kerja buruk. | Tinggi | Rendah | Normalisasi, deduplication, verifikasi sumber primer. | Batasi kategori matching ke data tervalidasi. |
| R5 | Persaingan platform global. | Sedang | Tinggi | Diferensiasi hyper-local, cross-region, B2G analytics. | Percepat kemitraan lokal dan moat data. |
| R6 | Pelanggaran keamanan/privasi. | Sangat Tinggi | Rendah | Defense-in-depth, SIEM, encryption, pentest. | Aktivasi IRP dan notifikasi \<=72 jam. |
| R7 | Biaya komputasi melebihi anggaran. | Sedang | Sedang | Caching, distillation, quantization, spot instances. | Model compression dan partial on-premise. |
| R8 | Integrasi mitra terlambat. | Sedang | Sedang | Contract dependency tracking dan fallback provider. | CSV/manual import sementara. |
| R9 | Lowongan palsu/scam. | Tinggi | Sedang | Company verification, job moderation, abuse reporting. | Suspend company dan notification to affected candidates. |
| R-10 | Skor kandidat dianggap tidak adil atau sulit dipahami. | Tinggi | Medium | Explainability, score breakdown, bias audit, dan human-in-the-loop review. | Fallback ke rule-based scoring dan manual shortlist. |
| R-11 | Anti-fraud menghasilkan false positive pada kandidat valid. | Tinggi | Medium | Risk threshold konservatif, review manual, mekanisme appeal, dan audit false positive. | Kembalikan status kandidat dan update aturan deteksi. |
| R-12 | Leaderboard mendorong recruiter terlalu bergantung pada ranking. | Medium | Medium | Tampilkan skor sebagai decision support, bukan keputusan final; wajibkan alasan manual pada reject massal. | Batasi bulk action dan tambah review gate. |
| R13 | Kandidat salah paham antara Match Score dan Candidate Score. | Sedang | Sedang | Label UI jelas, tooltip, glossary, dan copywriting non-teknis. | Sembunyikan Candidate Score dari kandidat dan tampilkan hanya status lamaran. |
| R14 | Fraud detection false positive merugikan kandidat valid. | Tinggi | Sedang | Manual review, appeal flow, masked evidence, threshold konservatif. | Rollback rule/model dan audit kasus terdampak. |
| R15 | Recruiter menyalahgunakan leaderboard sebagai keputusan otomatis. | Tinggi | Sedang | Human-in-the-loop policy, warning UI, alasan keputusan wajib. | Audit review dan pembatasan permission recruiter. |
| R16 | Notification membocorkan alasan internal seleksi. | Tinggi | Rendah | Template safe content dan review privacy sebelum release. | Disable template bermasalah dan kirim koreksi komunikasi. |
| R17 | RBAC salah konfigurasi membuka data sensitif. | Kritis | Rendah | Permission test, security review, least privilege, audit alert. | Revoke access, incident response, rotate credentials jika diperlukan. |

# **24. Financial Plan**

## **24.1 Estimasi Anggaran 12 Bulan**

| **Kategori** | **Estimasi (IDR)** | **% Total** | **Catatan** |
|----|----|----|----|
| SDM 12 posisi | Rp 2.880.000.000 | 55% | Engineer, data scientist, product, design, ops. |
| Infrastruktur Cloud & GPU | Rp 840.000.000 | 16% | Training + inferensi; optimasi spot/managed services. |
| Lisensi Software & API | Rp 180.000.000 | 3.4% | Job board API, training partner, SaaS tools. |
| Riset & Data Acquisition | Rp 180.000.000 | 3.4% | Dataset, anotasi, UX research. |
| Keamanan & Compliance | Rp 150.000.000 | 2.9% | Audit, pentest, legal/compliance UU PDP. |
| Marketing & Go-to-Market | Rp 350.000.000 | 6.7% | Kampanye digital, event, partnership. |
| Contingency Buffer | Rp 657.000.000 | 12.6% | 15% buffer, approval steering committee. |
| TOTAL | Rp 5.237.000.000 | 100% | Estimasi 12 bulan pengembangan penuh. |

## **24.2 Revenue Projection**

| **Segmen** | **Model Revenue** | **Proyeksi ARR** | **Asumsi** |
|----|----|----|----|
| LENTERA for Business B2B SaaS | Enterprise subscription tahunan | Rp 1.800.000.000 | 12 klien enterprise; ACV rata-rata Rp150 juta/tahun. |
| LENTERA Premium B2C Kandidat | Subscription bulanan kandidat | Rp 1.500.000.000 | 2.500 subscriber @ Rp50.000/bulan pada akhir Y2. |
| Analytics API B2G Pemerintah | Project-based + API subscription | Rp 1.000.000.000 | 2 proyek B2G/tahun @ Rp500 juta + subscription daerah. |
| TOTAL ARR TARGET | \- | Rp 4.300.000.000 | Break-even proyeksi bulan 18-24 post go-live. |

# **25. Open Questions, Assumptions & Dependencies**

## **25.1 Open Questions**

| **ID** | **Pertanyaan** | **Owner** | **Deadline** |
|----|----|----|----|
| OQ-01 | Apakah SISNAKER menyediakan API read/write atau hanya data dump berkala? | BA + Lead Engineer | Fase 0 |
| OQ-02 | Apakah recommendation engine dibangun sendiri dari awal atau memakai foundation model/fine-tuned LLM? | Lead AI/ML | Fase 0 |
| OQ-03 | Bagaimana pricing B2B UKM vs enterprise dan batas tier freemium? | BA + PM | Fase 1 |
| OQ-04 | Apakah B2G membutuhkan on-premise penuh atau data localization cukup? | Lead Engineer + Legal | Fase 0 |
| OQ-05 | Apakah B2C kandidat gratis penuh atau premium sejak awal? | PM + BA | Fase 1 |
| OQ-06 | Apa definisi formal placement untuk cross-region placement rate? | PM + Data | Fase 2 |
| OQ-07 | Apakah Workday tetap P0 atau diganti generic ATS connector/CSV export untuk MVP? | PM + Engineering | Fase 0 |
| OQ-08 | Data apa saja yang dapat dipakai untuk salary benchmark tanpa risiko misleading? | BA + Legal + Data | Fase 1 |
| OQ-09 | Apakah Candidate Score perlu ditampilkan sebagian kepada perusahaan atau hanya score breakdown internal? | PM + Legal + Design | Fase 1 |
| OQ-10 | Channel notifikasi apa yang diprioritaskan untuk MVP: in-app saja atau in-app + email? | PM + Engineering | Fase 1 |
| OQ-11 | SLA appeal kandidat ditetapkan 3 hari kerja atau mengikuti SLA support umum? | Support Ops + PM | Fase 1 |
| OQ-12 | Siapa yang berwenang mengubah score rule dan threshold fraud di production? | Security + MLOps | Fase 0 |

## **25.2 Assumptions**

- Kemitraan dengan minimal 2 job board eksternal dapat diselesaikan
  sebelum akhir Fase 0.

- Tim pengembang tersedia full-time sesuai alokasi sejak Fase 0.

- MVP dapat menggunakan compute bertahap tanpa harus langsung memakai
  full GPU cluster 4x A100.

- Data lowongan cukup representatif untuk mencapai akurasi matching
  \>85% sebelum launch.

- Regulasi UU PDP tidak mengalami perubahan signifikan selama 12 bulan
  pengembangan.

- Training partner menyediakan minimal katalog kursus; progress tracking
  dapat menjadi P1 jika API belum siap.

## **25.3 Critical Dependencies**

| **Dependency** | **Impact jika Terlambat** | **Mitigasi** |
|----|----|----|
| MoU/API job board | Data matching tidak cukup untuk MVP. | Gunakan dataset publik/mitra alternatif dan manual ingestion sementara. |
| Cloud/compute readiness | Pelatihan dan inferensi model tertunda. | Managed inference atau smaller model sementara. |
| Training provider integration | Personalized Training tidak dapat tracking progress. | Katalog statis + manual completion. |
| Company pilot | Time-to-hire dan shortlist value sulit divalidasi. | Gunakan simulated data dan recruiter advisory panel. |
| Security audit | Go-live tertahan. | Shift-left security dan vulnerability scan sejak sprint awal. |
| Notification provider | Notifikasi status lamaran dan verifikasi terlambat. | Gunakan in-app notification internal sebagai baseline MVP. |
| Support/appeal SOP | Appeal tidak konsisten dan berisiko menurunkan trust kandidat. | Buat SOP review, template keputusan, dan SLA sederhana sebelum Beta. |
| RBAC policy approval | Role sensitif tidak jelas dan memperbesar risiko data leakage. | Tetapkan role permission matrix sebagai launch gate security. |

# **26. Appendix**

## **26.1 Daftar Singkatan**

| **Singkatan** | **Kepanjangan** |
|----|----|
| AI | Artificial Intelligence / Kecerdasan Artifisial |
| API | Application Programming Interface |
| ATS | Applicant Tracking System |
| B2B | Business-to-Business |
| B2C | Business-to-Consumer |
| B2G | Business-to-Government |
| CV | Curriculum Vitae |
| HRIS | Human Resource Information System |
| LLM | Large Language Model |
| MAU | Monthly Active Users |
| MFA | Multi-Factor Authentication |
| MLOps | Machine Learning Operations |
| NDCG | Normalized Discounted Cumulative Gain |
| NLP | Natural Language Processing |
| NPS | Net Promoter Score |
| P95/P99 | 95th/99th percentile latency |
| PSE | Penyelenggara Sistem Elektronik |
| RBAC | Role-Based Access Control |
| RPO | Recovery Point Objective |
| RTO | Recovery Time Objective |
| SaaS | Software as a Service |
| SISNAKER | Sistem Informasi Ketenagakerjaan Kemnaker |
| SLA | Service Level Agreement |
| SSO | Single Sign-On |
| UU PDP | Undang-Undang Perlindungan Data Pribadi No. 27/2022 |
| WCAG | Web Content Accessibility Guidelines |
| AI Match Score | Skor kecocokan kandidat terhadap lowongan tertentu yang dapat ditampilkan kepada kandidat dengan explanation aman. |
| Candidate Score | Skor seleksi internal yang digunakan HR/recruiter untuk memprioritaskan kandidat dalam pipeline. |
| RBAC | Role-Based Access Control. |
| Appeal | Permintaan koreksi atau tinjauan ulang dari kandidat terhadap data/status tertentu. |
| Audit Log | Catatan sistem atas aksi sensitif yang memuat actor, role, waktu, alasan, dan perubahan data. |

## **26.2 Referensi Dokumen**

- PRD LENTERA v1.0 - Ekosistem LENTERA \| DS Recruitment Ecosystem \|
  BEBAN_gaji-DS2.

- BRD Ekosistem LENTERA v1.0 - DS Recruitment Ecosystem \|
  BEBAN_gaji-DS2.

- UU Perlindungan Data Pribadi No. 27 Tahun 2022.

- UU Ketenagakerjaan No. 13 Tahun 2003.

- WCAG 2.1 - Web Content Accessibility Guidelines.

- OpenAPI Specification 3.0 - API Documentation Standard.

- OWASP Top 10 2023 - Security Requirements Reference.

## **26.3 Revision History**

| **Versi** | **Tanggal** | **Author** | **Perubahan** |
|----|----|----|----|
| 1.0 | 7 Maret 2026 | BEBAN_gaji-DS2 | Dokumen PRD awal berdasarkan BRD v1.0. |
| 1.1 | 24 Mei 2026 | ChatGPT + BEBAN_gaji-DS2 | Upgrade PRD: MVP matrix, data model, AI/ML plan, consent flow, API, analytics, admin ops, UX inventory, QA, DoD, dan edge cases. |
| 1.2 | 28 Mei 2026 | BEBAN_gaji-DS2 + ChatGPT | Menambahkan Recruitment Intelligence: candidate scoring, leaderboard, stage control, AI pre-screening, anti-fraud check, risk scoring, security flag log, endpoint API, data model, analytics event, QA, edge case, dan risk registry. |
| 1.3 | 28 Mei 2026 | BEBAN_gaji-DS2 + Review AI | Menambahkan detail batas MVP, score separation, role access matrix, candidate transparency, appeal/verifikasi ulang, notification system, search/filter, audit log detail, metrics, API, data model, QA, edge cases, dan risk registry tanpa mengubah struktur top-level PRD. |
