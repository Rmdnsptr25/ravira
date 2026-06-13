Buat sesuai perintah di bawah ini, jangan merubah desain yang lain yang tidak disuruh.

Saya sudah memiliki desain UI/UX Ravira yang terdiri dari landing page, pilih role, login kandidat, login perusahaan, login pemerintah, registrasi kandidat, registrasi perusahaan, registrasi pemerintah, onboarding kandidat tahap 1–4, dashboard kandidat, detail pekerjaan, onboarding perusahaan tahap 1–3, dashboard recruiter, lowongan aktif, lihat pelamar, halaman menunggu verifikasi pemerintah, dan dashboard workforce analytics.

Jangan membuat ulang halaman yang sudah ada. Jangan mengubah warna, layout utama, tipografi, navbar, card, sidebar, dashboard, shadow, icon style, atau komponen visual yang sudah benar. Fokus hanya pada:

1. Menghubungkan tombol yang belum bisa diklik.
2. Melengkapi prototype flow antar halaman.
3. Memperbaiki sidebar yang belum lengkap atau belum sesuai.
4. Menambahkan halaman yang belum ada agar sistem Ravira sesuai BRD/PRD.
5. Menambahkan modal, state, dan halaman pendukung yang dibutuhkan.
6. Memperbaiki teks kecil yang belum sesuai tanpa merombak desain.

Gunakan Bahasa Indonesia untuk seluruh teks UI.

## Konteks Sistem Ravira

Ravira adalah DS Recruitment Ecosystem berbasis AI yang membantu kandidat menemukan pekerjaan relevan, memahami skill gap, mendapatkan rekomendasi pelatihan personal, serta membuka peluang kerja lintas wilayah. Ravira juga membantu perusahaan mendapatkan shortlist kandidat berbasis AI dan membantu pemerintah atau institusi melihat workforce analytics berbasis data.

Fitur utama Ravira:

1. Smart Job Matching
2. Skill Gap Advisor
3. Personalized Training
4. Job-Workforce Analytics
5. Cross-Region Matching

Role utama:

1. Kandidat / Pencari Kerja
2. Perusahaan / Recruiter
3. Pemerintah / Institusi
4. Admin Internal Ravira

## A. Perbaikan Landing Page

Jangan ubah layout landing page. Perbaiki hanya bagian berikut.

### 1. Perbaiki Teks Hero

Ganti teks:

“You relax, AI will find you a Job”

Menjadi:

“Biarkan AI Ravira Menemukan Peluang Kerja Terbaik untuk Anda”

### 2. Perbaiki Impact Metrics

Ganti angka impact metrics yang masih 0 menjadi:

* 85%+ — Target Relevansi Job Matching
* 40% — Potensi Reduksi Time-to-Hire
* 20% — Target Cross-Region Placement
* 50K — Target MAU Tahun Pertama
* 60% — Target Training Completion

Jangan ubah desain card metrics. Cukup ubah angka dan teksnya.

## B. Hubungkan Tombol Landing Page

Pastikan seluruh tombol di landing page bisa diklik dan mengarah ke halaman yang sesuai.

Navbar:

* Beranda → Hero landing page
* Fitur → Core Features
* Untuk Kandidat → Section Untuk Kandidat
* Untuk Perusahaan → Section Untuk Perusahaan
* Analytics → Section Workforce Analytics
* Tentang Ravira → Section Apa Itu Ravira
* Masuk → Login
* Mulai Sekarang → Pilih Role

Hero Section:

* Cari Pekerjaan Sekarang → Registrasi Kandidat
* Lihat Demo → Section Dashboard Preview

Section Kandidat:

* Mulai Sebagai Kandidat → Registrasi Kandidat

Section Perusahaan:

* Daftarkan Perusahaan → Registrasi Perusahaan

Section Workforce Analytics:

* Lihat Solusi Analytics → Registrasi Pemerintah / Institusi

Final CTA:

* Mulai Sekarang → Pilih Role
* Hubungi Tim Ravira → Modal Kontak Tim Ravira

Footer:

* Smart Job Matching → Core Features bagian Smart Job Matching
* Skill Gap Advisor → Core Features bagian Skill Gap Advisor
* Personalized Training → Core Features bagian Personalized Training
* Workforce Analytics → Section Workforce Analytics
* Cross-Region Matching → Core Features bagian Cross-Region Matching
* Kebijakan Privasi → Halaman Kebijakan Privasi
* Syarat & Ketentuan → Halaman Syarat & Ketentuan
* Kebijakan Cookie → Halaman Kebijakan Cookie

## C. Hubungkan Halaman Auth yang Sudah Ada

Halaman login sudah ada. Jangan buat ulang. Hubungkan tombol dan role login berikut:

* Login Kandidat → Dashboard Kandidat
* Login Perusahaan → Dashboard Recruiter / Kandidat Pipeline
* Login Pemerintah → Dashboard Workforce Analytics
* Link “Daftar sekarang” → Pilih Role
* Link “Lupa password?” → Modal Lupa Password

Halaman Pilih Role sudah ada. Jangan buat ulang. Hubungkan:

* Card Kandidat / tombol “Daftar sebagai Kandidat” → Registrasi Kandidat
* Card Perusahaan / tombol “Daftarkan Perusahaan” → Registrasi Perusahaan
* Card Pemerintah / tombol “Daftar untuk Analytics” → Registrasi Pemerintah
* Link “Sudah punya akun? Masuk” → Login

## D. Perbaikan dan Kelengkapan Sidebar

Perbaiki seluruh sidebar agar sesuai role pengguna. Jangan tampilkan nama icon sebagai teks, misalnya jangan tampilkan “grid Dashboard”, “users Kandidat Pipeline”, “briefcase Lowongan Aktif”, “bar-chart Analitik Rekrutmen”, atau “settings Pengaturan”. Tampilkan hanya icon dan label menu yang rapi.

Aturan umum sidebar:

* Gunakan style yang sama dengan desain Ravira yang sudah ada.
* Gunakan sidebar dark navy.
* Gunakan icon modern yang konsisten.
* Tambahkan active state pada menu yang sedang dibuka.
* Tambahkan hover state.
* Semua menu sidebar harus bisa diklik.
* Tambahkan tombol logout di bagian bawah.
* Tambahkan profil singkat user jika sesuai dengan desain existing.
* Untuk mobile, sidebar menjadi drawer atau menu hamburger.

### Sidebar Kandidat

Menu kandidat harus berisi:

1. Beranda
2. Rekomendasi Pekerjaan
3. Skill Gap
4. Pelatihan
5. Lamaran Saya
6. Peluang Lintas Wilayah
7. Profil Saya
8. Pengaturan Privasi
9. Logout

Prototype link:

* Beranda → Dashboard Kandidat
* Rekomendasi Pekerjaan → Halaman Rekomendasi Pekerjaan
* Skill Gap → Halaman Skill Gap Report Detail
* Pelatihan → Halaman Rekomendasi Pelatihan
* Lamaran Saya → Halaman Lamaran Saya
* Peluang Lintas Wilayah → Halaman Peluang Lintas Wilayah
* Profil Saya → Halaman Profil Saya
* Pengaturan Privasi → Halaman Pengaturan Privasi & Consent
* Logout → Halaman Login

### Sidebar Perusahaan / Recruiter

Menu recruiter harus berisi:

1. Dashboard
2. Kandidat Pipeline
3. Lowongan Aktif
4. Buat Lowongan
5. Shortlist Kandidat
6. Analitik Rekrutmen
7. Integrasi ATS
8. Profil Perusahaan
9. Pengaturan
10. Logout

Prototype link:

* Dashboard → Dashboard Perusahaan / Recruiter
* Kandidat Pipeline → Pipeline Rekrutmen
* Lowongan Aktif → Lowongan Aktif
* Buat Lowongan → Form Buat Lowongan Baru
* Shortlist Kandidat → Halaman Shortlist Kandidat
* Analitik Rekrutmen → Halaman Analitik Rekrutmen
* Integrasi ATS → Halaman Integrasi ATS
* Profil Perusahaan → Halaman Profil Perusahaan
* Pengaturan → Pengaturan Perusahaan
* Logout → Halaman Login

### Sidebar Pemerintah / Institusi

Menu pemerintah / institusi harus berisi:

1. Ringkasan
2. Analitik Workforce
3. Heatmap Regional
4. Tren Skill
5. Proyeksi Kompetensi
6. Rekomendasi Program Pelatihan
7. Laporan & Ekspor
8. Pengaturan
9. Logout

Prototype link:

* Ringkasan → Dashboard Workforce Analytics
* Analitik Workforce → Halaman Analitik Workforce
* Heatmap Regional → Detail Wilayah Analytics
* Tren Skill → Halaman Tren Skill
* Proyeksi Kompetensi → Halaman Proyeksi Kompetensi
* Rekomendasi Program Pelatihan → Form Rekomendasi Program Pelatihan
* Laporan & Ekspor → Halaman Laporan & Ekspor
* Pengaturan → Pengaturan Akun Instansi
* Logout → Halaman Login

Tambahkan catatan kecil pada dashboard pemerintah:

“Data yang ditampilkan bersifat agregat dan anonim.”

### Sidebar Admin Internal Ravira

Buat sidebar admin internal dengan menu:

1. Overview
2. Verifikasi Perusahaan
3. Moderasi Lowongan
4. Laporan Abuse
5. Monitoring Integrasi
6. Audit Log
7. Model AI Performance
8. User Management
9. Pengaturan Sistem
10. Logout

Prototype link:

* Overview → Admin Overview
* Verifikasi Perusahaan → Halaman Verifikasi Perusahaan
* Moderasi Lowongan → Halaman Moderasi Lowongan
* Laporan Abuse → Halaman Laporan Abuse
* Monitoring Integrasi → Halaman Monitoring Integrasi
* Audit Log → Halaman Audit Log
* Model AI Performance → Halaman Model AI Performance
* User Management → Halaman User Management
* Pengaturan Sistem → Halaman Pengaturan Sistem
* Logout → Halaman Login

## E. Hubungkan Alur Kandidat yang Sudah Ada

Registrasi kandidat sudah ada. Hubungkan:

* Tombol “Buat Akun Kandidat” → Onboarding Kandidat Tahap 1

Onboarding kandidat tahap 1–4 sudah ada. Hubungkan:

* Tahap 1 → Tahap 2
* Tahap 2 → Tahap 3
* Tahap 3 → Tahap 4
* Tombol “Selesai dan Lihat Rekomendasi” → Dashboard Kandidat

Dashboard kandidat sudah ada. Hubungkan tombol berikut:

* Tombol “Lihat Detail” pada job card → Detail Pekerjaan yang sudah ada
* Tombol “Lamar” → Modal Konfirmasi Lamaran
* Tombol “Lihat Skill Gap” → Skill Gap Report Detail
* Tombol “Mulai Belajar” → Detail Kursus
* Tombol “Lihat Peluang” → Detail Peluang Lintas Wilayah

## F. Tambahkan Halaman Kandidat yang Belum Ada

Buat halaman baru dengan style yang sama seperti dashboard kandidat.

### 1. Rekomendasi Pekerjaan

Isi halaman:

* Search bar
* Filter lokasi
* Filter tipe kerja
* Filter range gaji
* Filter industri
* Sort by match score
* Job card berisi posisi, perusahaan, lokasi, tipe kerja, range gaji, match score, alasan rekomendasi, skill cocok, skill kurang
* Tombol “Lihat Detail”
* Tombol “Lamar”

Prototype:

* Lihat Detail → Detail Pekerjaan
* Lamar → Modal Konfirmasi Lamaran

### 2. Skill Gap Report Detail

Isi halaman:

* Target posisi
* Readiness score
* Grafik skill match
* Skill yang sudah dikuasai
* Skill yang perlu ditingkatkan
* Prioritas belajar
* Roadmap karier
* Tombol “Lihat Rekomendasi Pelatihan”

Prototype:

* Lihat Rekomendasi Pelatihan → Halaman Rekomendasi Pelatihan

### 3. Rekomendasi Pelatihan

Isi halaman:

* Course card
* Nama kursus
* Platform penyedia
* Durasi
* Level
* Harga
* Skill yang ditingkatkan
* Dampak terhadap match score
* Progress belajar
* Tombol “Lihat Detail”
* Tombol “Mulai Belajar”

Prototype:

* Lihat Detail → Detail Kursus
* Mulai Belajar → Detail Kursus

### 4. Detail Kursus

Isi halaman:

* Nama kursus
* Platform penyedia
* Durasi
* Level
* Harga
* Deskripsi
* Skill yang ditingkatkan
* Dampak terhadap skill gap
* Modul pembelajaran
* Progress
* Tombol “Mulai / Lanjutkan Kursus”

Tambahkan informasi:

“Setelah menyelesaikan kursus ini, skill profile Anda akan diperbarui otomatis.”

### 5. Lamaran Saya

Isi halaman:

* Tabs: Semua, Dikirim, Screening, Interview, Offer, Ditolak
* Application card
* Nama posisi
* Perusahaan
* Tanggal melamar
* Status terbaru
* Timeline status
* Tombol “Lihat Status”

Prototype:

* Lihat Status → Detail Status Lamaran

### 6. Detail Status Lamaran

Isi halaman:

* Nama posisi
* Nama perusahaan
* Status lamaran
* Tanggal melamar
* Timeline proses seleksi
* Catatan recruiter jika ada
* Jadwal interview jika ada
* Dokumen yang dikirim
* Tombol “Tarik Lamaran”
* Tombol “Hubungi Recruiter”

### 7. Peluang Lintas Wilayah

Isi halaman:

* Filter kota tujuan
* Filter provinsi
* Filter tipe kerja
* Filter remote / hybrid / on-site
* Estimasi biaya hidup
* Job lintas wilayah
* Match score
* Label Relokasi / Remote / Hybrid
* Tombol “Lihat Peluang”
* Tombol “Tandai Tertarik”

Prototype:

* Lihat Peluang → Detail Peluang Lintas Wilayah
* Tandai Tertarik → Toast “Peluang berhasil ditandai”

### 8. Detail Peluang Lintas Wilayah

Isi halaman:

* Detail pekerjaan
* Kota tujuan
* Estimasi biaya hidup
* Estimasi gaji
* Fasilitas umum
* Komunitas daerah
* Risiko dan pertimbangan relokasi
* Match score
* Skill yang cocok
* Checklist kesiapan relokasi
* Tombol “Lamar Sekarang”
* Tombol “Tandai Tertarik”

Prototype:

* Lamar Sekarang → Modal Konfirmasi Lamaran

### 9. Profil Saya

Isi halaman:

* Foto profil
* Nama
* Domisili
* Ringkasan diri
* Pendidikan
* Pengalaman kerja
* Skill utama
* Portfolio / LinkedIn
* CV yang diunggah
* Preferensi karier
* Preferensi mobilitas
* Kelengkapan profil
* Tombol “Edit Profil”
* Tombol “Upload CV Baru”

### 10. Pengaturan Privasi & Consent

Isi halaman:

* Status visibilitas profil
* Consent rekomendasi AI
* Consent analisis CV
* Consent analytics agregat anonim
* Daftar perusahaan yang dapat melihat profil
* Tombol “Cabut Izin”
* Tombol “Download Data Saya”
* Tombol “Hapus Akun”

Tambahkan teks:

“Profil Anda tidak akan dibagikan ke perusahaan tanpa izin eksplisit dari Anda.”

## G. Modal Kandidat

Tambahkan modal berikut:

### 1. Modal Konfirmasi Lamaran

Judul:

“Kirim Lamaran?”

Isi:

“Profil dan CV Anda akan dikirim ke perusahaan sesuai consent yang Anda berikan.”

Tombol:

* Batal
* Kirim Lamaran

Prototype:

* Batal → kembali ke Detail Pekerjaan
* Kirim Lamaran → Modal Lamaran Berhasil

### 2. Modal Lamaran Berhasil

Judul:

“Lamaran Berhasil Dikirim”

Isi:

“Anda dapat memantau status lamaran melalui menu Lamaran Saya.”

Tombol:

* Lihat Lamaran Saya

Prototype:

* Lihat Lamaran Saya → Lamaran Saya

## H. Hubungkan Alur Perusahaan yang Sudah Ada

Registrasi perusahaan sudah ada. Hubungkan:

* Tombol “Buat Akun Perusahaan” → Onboarding Perusahaan Tahap 1

Onboarding perusahaan tahap 1–3 sudah ada. Hubungkan:

* Tahap 1 → Tahap 2
* Tahap 2 → Tahap 3
* Tombol “Selesai dan Lihat Shortlist” → Dashboard Recruiter / Kandidat Pipeline

Dashboard recruiter, Lowongan Aktif, dan Lihat Pelamar sudah ada. Jangan buat ulang. Hubungkan:

* Dashboard → Dashboard Recruiter
* Kandidat Pipeline → Pipeline Rekrutmen
* Lowongan Aktif → Lowongan Aktif
* Lihat Pelamar → Lihat Pelamar yang sudah ada
* Tombol “Lihat Profil” → Lihat Pelamar / Profil Kandidat
* Tombol “Masukkan Pipeline” → Pipeline Rekrutmen
* Tombol “Jadwalkan Interview” → Modal Jadwal Interview

## I. Tambahkan Halaman Recruiter yang Belum Ada

### 1. Form Buat Lowongan Baru

Isi halaman:

* Judul pekerjaan
* Departemen
* Deskripsi pekerjaan
* Skill wajib
* Skill tambahan
* Lokasi kerja
* Tipe kerja
* Range gaji
* Level pengalaman
* Pendidikan minimal
* Deadline lamaran
* Bersedia menerima kandidat lintas wilayah
* Bobot prioritas matching
* Tombol “Simpan Draft”
* Tombol “Publikasikan Lowongan”

Prototype:

* Simpan Draft → Toast “Lowongan disimpan sebagai draft”
* Publikasikan Lowongan → Lowongan Aktif

### 2. Shortlist Kandidat

Isi halaman:

* Filter match score
* Filter lokasi
* Filter pengalaman
* Filter skill
* Sort by match score
* Candidate card berisi nama kandidat, lokasi, pendidikan, pengalaman, skill utama, match score, skill cocok, skill gap ringkas, status relokasi
* Tombol “Lihat Profil”
* Tombol “Masukkan Pipeline”

Prototype:

* Lihat Profil → Profil Kandidat untuk Recruiter
* Masukkan Pipeline → Pipeline Rekrutmen

### 3. Pipeline Rekrutmen

Isi halaman:

* Kanban board
* Kolom: Applied, Screening, Interview, Offer, Hired, Rejected
* Card kandidat berisi nama, posisi, match score, status terakhir, jadwal interview
* Filter berdasarkan job posting
* Search kandidat

### 4. Analitik Rekrutmen

Isi halaman:

* Total kandidat
* Total shortlist
* Rata-rata match score
* Rata-rata waktu rekrutmen
* Source kandidat
* Grafik pipeline conversion
* Grafik time-to-hire
* Skill yang paling sering cocok
* Skill yang paling sering kurang

### 5. Integrasi ATS

Isi halaman:

* Status integrasi ATS
* Workday
* SAP SuccessFactors
* Taleo
* Generic REST API
* CSV Export
* API key status
* Sinkronisasi terakhir
* Log sinkronisasi
* Tombol “Hubungkan ATS”
* Tombol “Generate API Key”

### 6. Profil Perusahaan

Isi halaman:

* Logo perusahaan
* Nama perusahaan
* Deskripsi perusahaan
* Industri
* Lokasi kantor
* Website
* Budaya kerja
* Dokumen verifikasi
* Status verifikasi
* Tombol “Edit Profil”

### 7. Pengaturan Perusahaan

Isi halaman:

* Data PIC recruiter
* Pengaturan notifikasi
* Pengaturan akses anggota tim
* Pengaturan consent kandidat
* Keamanan akun
* Tombol “Simpan Perubahan”

### 8. Modal Jadwal Interview

Isi modal:

* Nama kandidat
* Posisi
* Tanggal interview
* Jam interview
* Metode: Online / Offline
* Link meeting
* Catatan recruiter
* Tombol “Simpan Jadwal”

Prototype:

* Simpan Jadwal → Toast “Jadwal interview berhasil dibuat”

## J. Hubungkan Alur Pemerintah / Institusi yang Sudah Ada

Registrasi pemerintah, menunggu verifikasi, dan dashboard workforce analytics sudah ada. Jangan buat ulang.

Hubungkan:

* Tombol “Ajukan Akses Analytics” → Menunggu Verifikasi
* Menunggu Verifikasi tombol “Kembali ke Beranda” → Landing Page
* Menunggu Verifikasi tombol “Hubungi Tim Ravira” → Modal Kontak
* Jika disetujui → Dashboard Workforce Analytics

Dashboard workforce analytics:

* Ringkasan → Dashboard Workforce Analytics
* Analitik Workforce → Halaman Analitik Workforce
* Heatmap Regional → Detail Wilayah Analytics
* Tren Skill → Halaman Tren Skill
* Proyeksi Kompetensi → Halaman Proyeksi Kompetensi
* Rekomendasi Program Pelatihan → Form Rekomendasi Program Pelatihan
* Laporan & Ekspor → Halaman Laporan & Ekspor
* Pengaturan → Pengaturan Akun Instansi
* Tombol “Export Laporan” → Modal Export Laporan
* Tombol “Buat Rekomendasi Program Pelatihan” → Form Rekomendasi Program Pelatihan
* Klik heatmap / wilayah → Detail Wilayah Analytics

## K. Tambahkan Halaman Pemerintah yang Belum Ada

### 1. Analitik Workforce

Isi halaman:

* Ringkasan data tenaga kerja
* Demand pekerjaan per sektor
* Supply kandidat per wilayah
* Gap kompetensi utama
* Grafik tren permintaan tenaga kerja
* Filter wilayah, sektor, periode, dan tingkat pendidikan

Tambahkan catatan:

“Data yang ditampilkan bersifat agregat dan anonim.”

### 2. Detail Wilayah Analytics

Isi halaman:

* Nama wilayah
* Jumlah kandidat agregat
* Lowongan terbuka
* Sektor dengan demand tertinggi
* Skill paling dibutuhkan
* Skill paling tersedia
* Gap kompetensi
* Rekomendasi program pelatihan
* Proyeksi 6–12 bulan
* Catatan “Data bersifat agregat dan anonim.”

### 3. Tren Skill

Isi halaman:

* Filter wilayah
* Filter sektor
* Filter periode
* Tabel skill trending
* Grafik pertumbuhan demand skill
* Kategori skill: Kritis, Tinggi, Moderat
* Insight AI

### 4. Proyeksi Kompetensi

Isi halaman:

* Proyeksi kebutuhan skill 6–12 bulan
* Grafik prediksi demand
* Sektor dengan pertumbuhan tertinggi
* Wilayah dengan gap tertinggi
* Rekomendasi intervensi pelatihan

### 5. Laporan & Ekspor

Isi halaman:

* Daftar laporan tersimpan
* Tombol “Buat Laporan Baru”
* Filter wilayah, sektor, dan periode
* Format export: PDF, Excel, CSV
* Riwayat export
* Status: Selesai, Diproses, Gagal

### 6. Form Rekomendasi Program Pelatihan

Isi halaman:

* Wilayah target
* Sektor industri
* Skill prioritas
* Target peserta
* Durasi program
* Partner pelatihan
* Output yang diharapkan
* Estimasi kebutuhan tenaga kerja
* Catatan kebijakan
* Tombol “Buat Rekomendasi Program”

### 7. Modal Export Laporan

Isi modal:

* Pilih wilayah
* Pilih periode
* Pilih format: PDF, Excel, CSV
* Tombol “Export”

### 8. Pengaturan Akun Instansi

Isi halaman:

* Nama instansi
* Jenis instansi
* PIC
* Email resmi
* Wilayah kerja
* Hak akses anggota tim
* Pengaturan export laporan
* Tombol “Simpan Perubahan”

## L. Tambahkan Admin Internal Dashboard

Buat halaman baru Admin Internal Ravira karena belum ada.

### 1. Admin Overview

Isi halaman:

* Total pengguna
* Total kandidat
* Total perusahaan
* Total instansi
* Lowongan aktif
* Perusahaan menunggu verifikasi
* Lowongan menunggu moderasi
* Error integrasi
* Akurasi model AI
* Aktivitas sensitif terbaru

### 2. Verifikasi Perusahaan

Isi halaman:

* Daftar perusahaan menunggu verifikasi
* Nama perusahaan
* Industri
* Dokumen verifikasi
* PIC
* Status
* Tombol Review
* Tombol Approve
* Tombol Reject

### 3. Moderasi Lowongan

Isi halaman:

* Lowongan menunggu review
* Judul pekerjaan
* Perusahaan
* Risiko spam
* Tanggal posting
* Tombol Approve
* Tombol Reject
* Tombol Minta Revisi

### 4. Laporan Abuse

Isi halaman:

* Pelapor
* Jenis laporan
* Target laporan
* Deskripsi
* Status penanganan
* Tombol Review
* Tombol Tandai Selesai

### 5. Monitoring Integrasi

Isi halaman:

* Status API Jobstreet
* Status API Karir.com
* Status WhatsApp Business API
* Status ATS
* Status platform pelatihan
* Last sync
* Error log
* Tombol Retry Sync

### 6. Audit Log

Isi halaman:

* Waktu aktivitas
* User
* Role
* Aksi
* Data yang diakses
* IP address
* Status
* Filter role dan tanggal

### 7. Model AI Performance

Isi halaman:

* Akurasi job matching
* Feedback thumbs up/down
* Latency inference
* Model drift
* Bias monitoring
* Rekomendasi yang sering ditolak
* Tombol “Lihat Detail Model”

### 8. User Management

Isi halaman:

* Daftar user
* Role user
* Status akun
* Tanggal daftar
* Tombol Suspend
* Tombol Reset Password
* Tombol Lihat Detail

### 9. Pengaturan Sistem

Isi halaman:

* Pengaturan role dan permission
* Pengaturan API key
* Pengaturan notifikasi sistem
* Pengaturan keamanan
* Tombol “Simpan Perubahan”

## M. Modal dan State Tambahan

Tambahkan state berikut sesuai kebutuhan:

1. Loading state
2. Empty state
3. Error state
4. Success toast
5. Confirmation modal
6. Access denied state jika recruiter mencoba melihat data kandidat tanpa consent
7. Modal Lupa Password
8. Modal Kontak Tim Ravira
9. Modal alasan penolakan untuk admin
10. Toast sukses setelah approve/reject/retry/export

### Modal Kontak Tim Ravira

Isi:

* Nama lengkap
* Email
* Nomor WhatsApp
* Kategori:

  * Kandidat
  * Perusahaan
  * Pemerintah / Institusi
  * Partnership
  * Lainnya
* Pesan
* Tombol “Kirim Pesan”

Prototype:

* Kirim Pesan → State sukses
* Close → Kembali ke halaman asal

### Modal Lupa Password

Isi:

* Email
* Tombol “Kirim Link Reset”
* State sukses: “Link reset password telah dikirim ke email Anda.”

## N. Legal Pages

Buat halaman sederhana dengan style Ravira:

1. Kebijakan Privasi
2. Syarat & Ketentuan
3. Kebijakan Cookie

Prototype:

* Link footer menuju halaman sesuai label
* Tombol kembali → Landing Page

## O. Mobile Behavior

Untuk versi mobile:

* Navbar landing page menjadi hamburger menu.
* Sidebar dashboard menjadi drawer.
* Tombol hamburger membuka sidebar.
* Tombol close menutup sidebar.
* Menu sidebar tetap sama sesuai role.
* Konten dashboard tetap mudah dibaca.
* Card berubah menjadi satu kolom.
* Form tetap nyaman diisi di layar kecil.

## P. Catatan Penting

* Jangan membuat ulang halaman yang sudah ada.
* Jangan mengubah desain utama yang sudah ada.
* Jangan menghapus frame existing.
* Jangan mengganti warna, font, komponen, layout, atau style Ravira.
* Jangan menambahkan desain yang tidak relevan dengan BRD/PRD Ravira.
* Fokus pada prototype connection, tombol yang belum aktif, sidebar yang belum lengkap, halaman yang belum ada, modal, dan state.
* Semua tombol utama harus bisa diklik dan diarahkan ke halaman sesuai alur.
* Semua sidebar harus lengkap sesuai role.
* Semua halaman harus tetap simple, rapi, profesional, dan konsisten dengan desain Ravira yang sudah ada.
* Semua alur harus mendukung sistem Ravira sebagai AI recruitment ecosystem.
