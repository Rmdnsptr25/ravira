Buat sesuai perintah di bawah ini, jangan merubah desain yang lain yang tidak disuruh.

Saya sudah memiliki desain UI/UX website Ravira dari Figma AI. Desain yang sudah dibuat mencakup landing page, halaman daftar, login, registrasi kandidat, registrasi perusahaan, registrasi pemerintah, onboarding perusahaan, dashboard perusahaan, profil kandidat untuk recruiter, halaman pending verifikasi pemerintah, dashboard workforce analytics, privacy settings, dan admin dashboard.

Jangan membuat ulang halaman yang sudah ada. Jangan mengubah warna, layout utama, tipografi, card, sidebar, dashboard, icon style, shadow, atau komponen visual yang sudah benar. Fokus hanya pada:

1. Mengecek halaman yang sudah ada.
2. Menghubungkan semua tombol agar bisa diklik.
3. Melengkapi halaman turunan yang belum ada.
4. Menambahkan sidebar role yang belum lengkap.
5. Menambahkan modal dan state yang dibutuhkan.
6. Menyesuaikan alur agar sesuai BRD/PRD Ravira.

Gunakan Bahasa Indonesia untuk semua teks UI.

## Konteks Sistem Ravira

Ravira adalah DS Recruitment Ecosystem berbasis AI dengan fitur utama:

1. Smart Job Matching
2. Skill Gap Advisor
3. Personalized Training
4. Job-Workforce Analytics
5. Cross-Region Matching

Role utama sistem:

1. Kandidat / Pencari Kerja
2. Perusahaan / Recruiter
3. Pemerintah / Institusi
4. Admin Internal Ravira

Pastikan semua role memiliki alur yang jelas, dashboard yang sesuai, tombol yang aktif, dan sidebar sesuai kebutuhan masing-masing.

## A. Audit Halaman yang Sudah Ada

Cek halaman yang sudah dibuat:

1. Landing Page
2. Login / Masuk
3. Pilih Role / Daftar
4. Registrasi Kandidat
5. Registrasi Perusahaan
6. Registrasi Pemerintah
7. Onboarding Perusahaan
8. Dashboard Perusahaan
9. Candidate Profile untuk Recruiter
10. Pending Verifikasi Pemerintah
11. Dashboard Workforce Analytics
12. Privacy Settings
13. Admin Dashboard

Jangan ubah halaman tersebut kecuali untuk:

* memperbaiki tombol yang belum aktif,
* menambahkan sidebar,
* menambahkan route/prototype link,
* menambahkan halaman tujuan jika tombol belum punya tujuan,
* memperbaiki teks yang masih belum sesuai.

## B. Perbaiki Navigasi Landing Page

Pastikan tombol berikut aktif:

* “Masuk” → Halaman Login / Masuk
* “Mulai Sekarang” → Halaman Pilih Role / Daftar
* “Cari Pekerjaan Sekarang” → Registrasi Kandidat
* “Mulai Sebagai Kandidat” → Registrasi Kandidat
* “Daftarkan Perusahaan” → Registrasi Perusahaan
* “Lihat Solusi Analytics” → Registrasi Pemerintah
* “Hubungi Tim Ravira” → Modal Kontak Tim Ravira
* “Lihat Demo” → Section Dashboard Preview

Pastikan menu navbar aktif:

* Beranda → Section Hero
* Fitur → Section Core Features
* Untuk Kandidat → Section Untuk Kandidat
* Untuk Perusahaan → Section Untuk Perusahaan
* Analytics → Section Workforce Analytics
* Tentang Ravira → Section Apa Itu Ravira

## C. Lengkapi Role Kandidat

Pastikan alur kandidat lengkap:

Landing Page → Registrasi Kandidat → Onboarding Kandidat → Dashboard Kandidat

Jika halaman kandidat berikut belum ada, buat dengan style yang sama:

### 1. Onboarding Kandidat

Buat onboarding kandidat 4 tahap:

1. Profil Dasar
2. Preferensi Karier
3. Preferensi Mobilitas
4. Visibilitas & Consent

Tombol akhir:
“Selesai dan Lihat Rekomendasi” → Dashboard Kandidat

### 2. Dashboard Kandidat

Pastikan dashboard kandidat memiliki sidebar lengkap:

* Beranda
* Rekomendasi Pekerjaan
* Skill Gap
* Pelatihan
* Lamaran Saya
* Peluang Lintas Wilayah
* Profil Saya
* Pengaturan Privasi
* Logout

Pastikan tombol aktif:

* Lihat Semua → Rekomendasi Pekerjaan
* Lihat Detail → Detail Pekerjaan
* Lamar → Modal Konfirmasi Lamaran
* Skill Gap → Skill Gap Report Detail
* Pelatihan → Rekomendasi Pelatihan
* Lamaran Aktif → Lamaran Saya
* Peluang Lintas Wilayah → Peluang Lintas Wilayah

### 3. Rekomendasi Pekerjaan

Buat halaman list pekerjaan dengan:

* Search bar
* Filter lokasi
* Filter tipe kerja
* Filter range gaji
* Filter industri
* Sort by match score
* Job card
* Match score
* Alasan rekomendasi AI
* Skill yang cocok
* Skill yang kurang
* Tombol “Lihat Detail”
* Tombol “Lamar”

### 4. Skill Gap Report Detail

Buat halaman:

* Target posisi
* Readiness score
* Grafik skill match
* Skill yang sudah dikuasai
* Skill yang perlu ditingkatkan
* Prioritas belajar
* Roadmap karier
* Tombol “Lihat Rekomendasi Pelatihan”

### 5. Rekomendasi Pelatihan

Buat halaman:

* Daftar kursus rekomendasi
* Platform penyedia
* Durasi
* Level
* Harga
* Skill yang ditingkatkan
* Dampak terhadap match score
* Progress belajar
* Tombol “Lihat Detail”
* Tombol “Mulai Belajar”

### 6. Detail Kursus

Buat halaman:

* Nama kursus
* Platform penyedia
* Deskripsi
* Modul pembelajaran
* Durasi
* Level
* Harga
* Skill yang ditingkatkan
* Progress belajar
* Tombol “Mulai / Lanjutkan Kursus”

Tambahkan teks:
“Setelah menyelesaikan kursus ini, skill profile Anda akan diperbarui otomatis.”

### 7. Lamaran Saya

Buat halaman:

* Tab Semua
* Dikirim
* Screening
* Interview
* Offer
* Ditolak
* Application card
* Timeline status lamaran
* Tombol “Lihat Status”

### 8. Peluang Lintas Wilayah

Buat halaman:

* Filter kota tujuan
* Filter provinsi
* Filter remote / hybrid / on-site
* Estimasi biaya hidup
* Job lintas wilayah
* Match score
* Label Relokasi / Remote / Hybrid
* Tombol “Lihat Peluang”
* Tombol “Tandai Tertarik”

### 9. Detail Peluang Lintas Wilayah

Buat halaman:

* Detail pekerjaan
* Kota tujuan
* Estimasi biaya hidup
* Estimasi gaji
* Fasilitas umum
* Komunitas daerah
* Checklist kesiapan relokasi
* Tombol “Lamar Sekarang”
* Tombol “Tandai Tertarik”

### 10. Profil Saya

Buat halaman:

* Foto profil
* Nama
* Domisili
* Ringkasan diri
* Pendidikan
* Pengalaman kerja
* Skill utama
* CV yang diunggah
* Preferensi karier
* Preferensi mobilitas
* Tombol “Edit Profil”
* Tombol “Upload CV Baru”

### 11. Pengaturan Privasi & Consent

Jika privacy settings sudah ada, pastikan cocok untuk kandidat.

Isi wajib:

* Visibilitas profil
* Consent rekomendasi AI
* Consent analisis CV
* Consent analytics agregat anonim
* Daftar perusahaan yang dapat melihat profil
* Tombol “Cabut Izin”
* Tombol “Download Data Saya”
* Tombol “Hapus Akun”

Tambahkan teks:
“Profil Anda tidak akan dibagikan ke perusahaan tanpa izin eksplisit dari Anda.”

## D. Lengkapi Role Perusahaan / Recruiter

Pastikan alur perusahaan lengkap:

Landing Page → Registrasi Perusahaan → Onboarding Perusahaan → Dashboard Perusahaan

Dashboard perusahaan sudah ada. Jangan buat ulang, cukup lengkapi halaman turunan dan koneksi tombol.

Sidebar perusahaan harus berisi:

* Dashboard
* Kandidat Pipeline
* Lowongan Aktif
* Buat Lowongan
* Shortlist Kandidat
* Analitik Rekrutmen
* Integrasi ATS
* Profil Perusahaan
* Pengaturan
* Logout

Pastikan tombol aktif:

* Buat Lowongan → Form Buat Lowongan Baru
* Lihat Pelamar → Halaman Pelamar / Candidate Profile
* Lihat Profil → Candidate Profile
* Masukkan Pipeline → Pipeline Rekrutmen
* Jadwalkan Interview → Modal Jadwal Interview
* Integrasi → Integrasi ATS

Tambahkan halaman jika belum ada:

### 1. Form Buat Lowongan Baru

Isi:

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

### 2. Shortlist Kandidat

Isi:

* Filter match score
* Filter lokasi
* Filter pengalaman
* Filter skill
* Candidate card
* Match score
* Skill cocok
* Skill gap ringkas
* Status relokasi
* Tombol “Lihat Profil”
* Tombol “Masukkan Pipeline”

### 3. Pipeline Rekrutmen

Buat kanban board:

* Applied
* Screening
* Interview
* Offer
* Hired
* Rejected

Card kandidat berisi:

* Nama kandidat
* Posisi
* Match score
* Status terakhir
* Jadwal interview

### 4. Analitik Rekrutmen

Isi:

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

Isi:

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

Isi:

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

Isi:

* Data PIC recruiter
* Pengaturan notifikasi
* Pengaturan akses anggota tim
* Pengaturan consent kandidat
* Keamanan akun
* Tombol “Simpan Perubahan”

## E. Lengkapi Role Pemerintah / Institusi

Pastikan alur pemerintah lengkap:

Landing Page → Registrasi Pemerintah → Menunggu Verifikasi → Dashboard Workforce Analytics

Dashboard workforce analytics sudah ada. Jangan buat ulang, cukup lengkapi halaman turunan dan koneksi tombol.

Sidebar pemerintah harus berisi:

* Ringkasan
* Analitik Workforce
* Heatmap Regional
* Tren Skill
* Proyeksi Kompetensi
* Rekomendasi Program Pelatihan
* Laporan & Ekspor
* Pengaturan
* Logout

Pastikan tombol aktif:

* Export Laporan → Modal Export Laporan
* Buat Rekomendasi Program Pelatihan → Form Rekomendasi Program Pelatihan
* Klik wilayah / heatmap → Detail Wilayah Analytics
* Tren Skill → Halaman Tren Skill
* Laporan & Ekspor → Halaman Laporan & Ekspor

Tambahkan halaman jika belum ada:

### 1. Analitik Workforce

Isi:

* Ringkasan data tenaga kerja
* Demand pekerjaan per sektor
* Supply kandidat per wilayah
* Gap kompetensi utama
* Grafik tren permintaan tenaga kerja
* Filter wilayah, sektor, periode, dan tingkat pendidikan

Tambahkan catatan:
“Data yang ditampilkan bersifat agregat dan anonim.”

### 2. Detail Wilayah Analytics

Isi:

* Nama wilayah
* Jumlah kandidat agregat
* Lowongan terbuka
* Sektor dengan demand tertinggi
* Skill paling dibutuhkan
* Skill paling tersedia
* Gap kompetensi
* Rekomendasi program pelatihan
* Proyeksi 6–12 bulan

### 3. Tren Skill

Isi:

* Filter wilayah
* Filter sektor
* Filter periode
* Tabel skill trending
* Grafik pertumbuhan demand skill
* Kategori skill: Kritis, Tinggi, Moderat
* Insight AI

### 4. Proyeksi Kompetensi

Isi:

* Proyeksi kebutuhan skill 6–12 bulan
* Grafik prediksi demand
* Sektor dengan pertumbuhan tertinggi
* Wilayah dengan gap tertinggi
* Rekomendasi intervensi pelatihan

### 5. Laporan & Ekspor

Isi:

* Daftar laporan tersimpan
* Tombol “Buat Laporan Baru”
* Filter wilayah, sektor, periode
* Format export: PDF, Excel, CSV
* Riwayat export
* Status laporan: Selesai, Diproses, Gagal

### 6. Form Rekomendasi Program Pelatihan

Isi:

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

## F. Lengkapi Admin Internal Ravira

Admin Dashboard sudah ada, tetapi pastikan halaman turunannya lengkap.

Sidebar admin harus berisi:

* Overview
* Verifikasi Perusahaan
* Moderasi Lowongan
* Laporan Abuse
* Monitoring Integrasi
* Audit Log
* Model AI Performance
* User Management
* Pengaturan Sistem
* Logout

Tambahkan halaman jika belum ada:

### 1. Verifikasi Perusahaan

Isi:

* Daftar perusahaan menunggu verifikasi
* Nama perusahaan
* Industri
* Dokumen verifikasi
* PIC
* Status
* Tombol Review
* Tombol Approve
* Tombol Reject

### 2. Moderasi Lowongan

Isi:

* Lowongan menunggu review
* Judul pekerjaan
* Perusahaan
* Risiko spam
* Tanggal posting
* Tombol Approve
* Tombol Reject
* Tombol Minta Revisi

### 3. Laporan Abuse

Isi:

* Pelapor
* Jenis laporan
* Target laporan
* Deskripsi
* Status penanganan
* Tombol Review
* Tombol Tandai Selesai

### 4. Monitoring Integrasi

Isi:

* Status API Jobstreet
* Status API Karir.com
* Status WhatsApp Business API
* Status ATS
* Status platform pelatihan
* Last sync
* Error log
* Tombol Retry Sync

### 5. Audit Log

Isi:

* Waktu aktivitas
* User
* Role
* Aksi
* Data yang diakses
* IP address
* Status
* Filter role dan tanggal

### 6. Model AI Performance

Isi:

* Akurasi job matching
* Feedback thumbs up/down
* Latency inference
* Model drift
* Bias monitoring
* Rekomendasi yang sering ditolak
* Tombol “Lihat Detail Model”

### 7. User Management

Isi:

* Daftar user
* Role user
* Status akun
* Tanggal daftar
* Tombol Suspend
* Tombol Reset Password
* Tombol Lihat Detail

## G. Modal dan State Wajib

Tambahkan modal dan state berikut:

1. Modal Konfirmasi Lamaran
2. Modal Lamaran Berhasil
3. Modal Jadwal Interview
4. Modal Export Laporan
5. Modal Kontak Tim Ravira
6. Modal Lupa Password
7. Toast sukses
8. Loading state
9. Empty state
10. Error state
11. Access denied state jika recruiter mencoba melihat data kandidat tanpa consent

## H. Prototype Connection Wajib

Pastikan seluruh tombol utama bisa diklik.

Kandidat:

* Dashboard Kandidat → Rekomendasi Pekerjaan
* Rekomendasi Pekerjaan → Detail Pekerjaan
* Detail Pekerjaan → Konfirmasi Lamaran
* Konfirmasi Lamaran → Lamaran Berhasil
* Lamaran Berhasil → Lamaran Saya
* Dashboard Kandidat → Skill Gap Report
* Skill Gap Report → Rekomendasi Pelatihan
* Rekomendasi Pelatihan → Detail Kursus
* Dashboard Kandidat → Peluang Lintas Wilayah
* Peluang Lintas Wilayah → Detail Peluang Lintas Wilayah
* Dashboard Kandidat → Pengaturan Privasi

Perusahaan:

* Dashboard Perusahaan → Buat Lowongan
* Dashboard Perusahaan → Lowongan Aktif
* Dashboard Perusahaan → Shortlist Kandidat
* Shortlist Kandidat → Candidate Profile
* Candidate Profile → Jadwalkan Interview
* Dashboard Perusahaan → Analitik Rekrutmen
* Dashboard Perusahaan → Integrasi ATS

Pemerintah:

* Dashboard Workforce Analytics → Detail Wilayah
* Dashboard Workforce Analytics → Tren Skill
* Dashboard Workforce Analytics → Laporan & Ekspor
* Dashboard Workforce Analytics → Form Rekomendasi Program Pelatihan
* Export Laporan → Modal Export

Admin:

* Admin Dashboard → Verifikasi Perusahaan
* Admin Dashboard → Moderasi Lowongan
* Admin Dashboard → Monitoring Integrasi
* Admin Dashboard → Audit Log
* Admin Dashboard → Model AI Performance
* Admin Dashboard → User Management

## I. Catatan Penting

* Jangan membuat ulang halaman yang sudah ada.
* Jangan mengubah desain yang sudah benar.
* Jangan mengganti warna utama Ravira.
* Jangan mengubah komponen visual utama.
* Jangan menghapus frame existing.
* Fokus hanya pada melengkapi halaman, sidebar, tombol, prototype connection, modal, dan state.
* Semua halaman harus tetap konsisten dengan desain Ravira yang sudah ada.
* Semua teks harus menggunakan Bahasa Indonesia.
* Semua alur harus sesuai dengan BRD/PRD Ravira.
