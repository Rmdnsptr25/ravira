buat sesuai perintah di bawah ini, jangan merubah desain yang lain yang tidak disuruh.

Revisi hanya bagian portal publik Perusahaan, portal publik Pemerintah, aktivasi tombol, dan koneksi alur antar role pada Ravira. Jangan mengubah desain sistem yang sudah berjalan. Jangan mengubah dashboard, sidebar, AppContext, shared state, flow lamaran, flow recruiter, flow analytics, flow admin, modal, toast, ErrorBoundary, warna, font, card, atau layout utama yang sudah benar.

## Tujuan

1. Portal Perusahaan punya halaman navbar sendiri-sendiri.
2. Portal Pemerintah punya halaman navbar sendiri-sendiri.
3. Portal Kandidat jangan dirombak.
4. Aktifkan tombol yang memang harus bisa diklik.
5. Hubungkan alur sistem antar role Kandidat, Perusahaan, Pemerintah, dan Admin.
6. Setelah selesai, wajib buat laporan hasil pekerjaan.

## 1. Jangan Ubah Portal Kandidat

Jangan ubah desain dan struktur utama:

* Beranda utama kandidat
* `/untuk-kandidat`
* `/masuk/kandidat`
* `/daftar/kandidat`
* Dashboard kandidat
* Sidebar kandidat
* Flow kandidat yang sudah aktif

Jika ada tombol kandidat yang belum aktif, cukup aktifkan tombolnya tanpa merombak desain.

## 2. Portal Perusahaan

Route utama portal perusahaan:

* `/untuk-perusahaan`

Navbar perusahaan harus berisi:

* Beranda Perusahaan
* Lowongan
* Produk
* Solusi Rekrutmen
* Insight Rekrutmen
* Masuk
* Daftarkan Perusahaan
* Buat Lowongan

Setiap menu harus membuka halaman sendiri, bukan scroll section:

* Beranda Perusahaan → `/untuk-perusahaan`
* Lowongan → `/untuk-perusahaan/lowongan`
* Produk → `/untuk-perusahaan/produk`
* Solusi Rekrutmen → `/untuk-perusahaan/solusi-rekrutmen`
* Insight Rekrutmen → `/untuk-perusahaan/insight-rekrutmen`
* Masuk → `/masuk/perusahaan`
* Daftarkan Perusahaan → `/daftar/perusahaan`
* Buat Lowongan → `/daftar/perusahaan`

Jangan gunakan anchor seperti `#lowongan`, `#produk`, `#solusi`, atau scroll section untuk menu perusahaan.

## 3. Halaman Publik Perusahaan

Buat halaman berikut jika belum ada:

### `/untuk-perusahaan`

Isi:

* Hero portal perusahaan
* Judul: “Rekrut Kandidat Lebih Tepat dengan Ravira”
* Deskripsi singkat
* CTA:

  * “Daftarkan Perusahaan” → `/daftar/perusahaan`
  * “Masuk Perusahaan” → `/masuk/perusahaan`
  * “Buat Lowongan” → `/daftar/perusahaan`

### `/untuk-perusahaan/lowongan`

Isi:

* Penjelasan fitur buat dan kelola lowongan
* Form awal:

  * Posisi yang direkrut
  * Lokasi kerja
  * Tombol “Buat Lowongan”
* Tombol “Buat Lowongan” → `/daftar/perusahaan`

### `/untuk-perusahaan/produk`

Isi:

* Buat lowongan
* Shortlist kandidat berbasis AI
* Match score kandidat
* Profil kandidat berbasis consent
* Integrasi ATS / HRIS

### `/untuk-perusahaan/solusi-rekrutmen`

Isi:

* Pipeline rekrutmen
* Jadwal interview
* Screening kandidat
* Manajemen status kandidat
* Kolaborasi tim recruiter

### `/untuk-perusahaan/insight-rekrutmen`

Isi:

* Rata-rata match score
* Skill yang sering cocok
* Skill gap kandidat
* Source kandidat
* Time-to-hire
* Pipeline conversion

## 4. Portal Pemerintah

Route utama portal pemerintah:

* `/untuk-pemerintah`

Navbar pemerintah harus berisi:

* Beranda Pemerintah
* Analytics
* Tren Skill
* Heatmap Wilayah
* Laporan
* Masuk
* Ajukan Akses

Setiap menu harus membuka halaman sendiri, bukan scroll section:

* Beranda Pemerintah → `/untuk-pemerintah`
* Analytics → `/untuk-pemerintah/analytics`
* Tren Skill → `/untuk-pemerintah/tren-skill`
* Heatmap Wilayah → `/untuk-pemerintah/heatmap`
* Laporan → `/untuk-pemerintah/laporan`
* Masuk → `/masuk/pemerintah`
* Ajukan Akses → `/daftar/pemerintah`

Jangan gunakan anchor seperti `#analytics`, `#tren-skill`, `#heatmap`, atau scroll section untuk menu pemerintah.

## 5. Halaman Publik Pemerintah

Buat halaman berikut jika belum ada:

### `/untuk-pemerintah`

Isi:

* Hero portal pemerintah
* Judul: “Workforce Analytics untuk Pemerintah dan Institusi”
* Deskripsi singkat
* CTA:

  * “Ajukan Akses Analytics” → `/daftar/pemerintah`
  * “Masuk Pemerintah / Institusi” → `/masuk/pemerintah`

### `/untuk-pemerintah/analytics`

Isi:

* Supply-demand tenaga kerja
* Insight kebutuhan tenaga kerja
* Data agregat dan anonim
* CTA → `/daftar/pemerintah`

### `/untuk-pemerintah/tren-skill`

Isi:

* Tren skill yang berkembang
* Skill dengan demand tinggi
* Skill gap yang perlu diintervensi
* Rekomendasi program pelatihan

### `/untuk-pemerintah/heatmap`

Isi:

* Penjelasan heatmap wilayah
* Distribusi kandidat dan kebutuhan tenaga kerja
* Insight mobilitas talenta
* Data tetap agregat dan anonim

### `/untuk-pemerintah/laporan`

Isi:

* Laporan workforce analytics
* Preview export PDF, Excel, CSV
* Riwayat laporan sebagai preview
* CTA → `/daftar/pemerintah`

Tambahkan catatan pada semua halaman pemerintah:
“Data yang ditampilkan bersifat agregat dan anonim.”

## 6. Aktifkan Tombol Role Kandidat

Jika ada tombol kandidat yang belum aktif, aktifkan tanpa mengubah desain.

Pastikan tombol berikut aktif:

* Lihat Detail → Detail Pekerjaan
* Simpan → Toast “Lowongan berhasil disimpan”
* Tersimpan → Lowongan Tersimpan
* Hapus dari Tersimpan → Toast “Lowongan dihapus dari daftar tersimpan”
* Lamar / Lamar Sekarang → Modal Konfirmasi Lamaran
* Kirim Lamaran → Modal Lamaran Berhasil
* Lihat Lamaran Saya → Lamaran Saya
* Lihat Status → Detail Status Lamaran
* Tarik Lamaran → Modal Konfirmasi Tarik Lamaran
* Hubungi Recruiter → Modal Hubungi Recruiter
* Mulai Belajar / Lanjut Belajar → Detail Kursus
* Tandai Tertarik → Toast “Peluang berhasil ditandai”
* Edit Profil → mode edit / modal edit
* Upload CV Baru → state upload CV
* Cabut Izin → Modal Konfirmasi Cabut Izin
* Download Data Saya → Toast “Data Anda sedang disiapkan”
* Hapus Akun → Modal Konfirmasi Hapus Akun

## 7. Aktifkan Tombol Role Perusahaan / Recruiter

Pastikan tombol berikut aktif:

* Lihat Pelamar → Daftar Pelamar
* Lihat Profil → Detail Kandidat
* Klik nama kandidat → Detail Kandidat
* Klik card kandidat → Detail Kandidat
* Masukkan ke Pipeline → Pipeline Rekrutmen
* Jadwalkan Interview → Modal Jadwal Interview
* Simpan Jadwal → status kandidat menjadi Interview
* Buat Lowongan → Form Buat Lowongan
* Simpan Draft → Toast “Lowongan disimpan sebagai draft”
* Publikasikan Lowongan → Lowongan Aktif
* Edit Lowongan → mode edit
* Tutup Lowongan → Modal Konfirmasi Tutup Lowongan
* Ubah status pipeline → update status kandidat

## 8. Aktifkan Tombol Role Pemerintah / Institusi

Pastikan tombol berikut aktif:

* Export Laporan → Modal Export
* Download PDF → Toast “Laporan PDF sedang disiapkan”
* Download Excel → Toast “Laporan Excel sedang disiapkan”
* Download CSV → Toast “Laporan CSV sedang disiapkan”
* Klik wilayah heatmap → Detail Wilayah
* Filter wilayah → dropdown
* Filter kota → dropdown
* Filter sektor → dropdown
* Filter periode → dropdown
* Buat Rekomendasi Program Pelatihan → Form Rekomendasi Program
* Simpan Rekomendasi Program → Toast “Rekomendasi program berhasil dibuat”

## 9. Aktifkan Tombol Role Admin

Pastikan tombol berikut aktif:

* Review → Detail Review
* Approve → Toast “Data berhasil disetujui”
* Reject → Modal Alasan Penolakan
* Approve Lowongan → Toast “Lowongan disetujui”
* Reject Lowongan → Modal Alasan Penolakan
* Retry Sync → Toast “Sinkronisasi diulang”
* Lihat Audit Detail → Detail Audit
* Suspend User → Modal Konfirmasi Suspend
* Reset Password → Toast “Link reset password dikirim”
* Lihat Detail Model → Detail Model AI

## 10. Hubungkan Alur Antar Role

Pastikan alur antar role berjalan:

### Kandidat → Perusahaan

Kandidat klik Lamar
→ Modal Konfirmasi Lamaran
→ Kirim Lamaran
→ Modal Lamaran Berhasil
→ Lamaran masuk ke Lamaran Saya kandidat
→ Lamaran muncul di recruiter sebagai Pelamar Baru
→ Recruiter bisa membuka Profil Kandidat

### Perusahaan → Kandidat

Recruiter mengubah status pipeline:

* Screening → status kandidat menjadi Screening
* Interview → status kandidat menjadi Interview
* Offer → status kandidat menjadi Offer
* Hired → status kandidat menjadi Diterima
* Rejected → status kandidat menjadi Ditolak

Perubahan status harus terlihat di:

* Pipeline Recruiter
* Lamaran Saya kandidat
* Detail Status Lamaran kandidat
* Profil Kandidat untuk Recruiter

### Recruiter Jadwalkan Interview

Recruiter klik Jadwalkan Interview
→ isi modal jadwal
→ Simpan Jadwal
→ Toast sukses
→ status menjadi Interview
→ jadwal muncul di Detail Status Lamaran kandidat

### Kandidat / Perusahaan → Pemerintah

Pemerintah hanya melihat data agregat dan anonim.

Tampilkan insight agregat seperti:

* jumlah kandidat per wilayah
* tren skill
* skill gap
* supply-demand tenaga kerja
* minat mobilitas talenta
* laporan workforce analytics

Jangan tampilkan data pribadi kandidat seperti nama, email, nomor telepon, atau CV.

### Admin → Sistem

Admin dapat:

* verifikasi perusahaan
* moderasi lowongan
* monitoring integrasi
* melihat audit log
* melihat performa AI
* mengelola user

Semua aksi penting admin harus memiliki toast, modal, atau detail page yang jelas.

## 11. Data Testing Wilayah

Jangan ubah branding utama Ravira menjadi khusus Pulau Jawa.

Pulau Jawa hanya untuk data dummy dan filter testing.

Gunakan contoh kota:

* Jakarta
* Bandung
* Semarang
* Yogyakarta
* Surabaya
* Malang
* Bekasi
* Tangerang
* Depok
* Solo

## 12. Jangan Diubah

Jangan mengubah:

* Portal Kandidat yang sudah benar
* Beranda utama kandidat
* Dashboard kandidat
* Dashboard perusahaan
* Dashboard analytics
* Dashboard admin
* Sidebar semua role
* AppContext
* State applications
* State savedJobs
* Flow kandidat melamar yang sudah berjalan
* Flow recruiter yang sudah berjalan
* Flow analytics yang sudah berjalan
* Flow admin yang sudah berjalan
* ErrorBoundary
* Modal dan toast yang sudah berjalan
* Desain dashboard yang sudah benar

## 13. Setelah Selesai, Wajib Buat Laporan

Setelah revisi selesai, buat list:

1. Halaman publik perusahaan apa saja yang dibuat.
2. Halaman publik pemerintah apa saja yang dibuat.
3. Route perusahaan apa saja yang aktif.
4. Route pemerintah apa saja yang aktif.
5. Menu navbar perusahaan mengarah ke mana saja.
6. Menu navbar pemerintah mengarah ke mana saja.
7. Tombol kandidat apa saja yang aktif.
8. Tombol perusahaan/recruiter apa saja yang aktif.
9. Tombol pemerintah/institusi apa saja yang aktif.
10. Tombol admin apa saja yang aktif.
11. Alur Kandidat → Perusahaan yang sudah terhubung.
12. Alur Perusahaan → Kandidat yang sudah tersinkron.
13. Alur Kandidat/Perusahaan → Pemerintah secara agregat yang sudah berjalan.
14. Alur Admin → Sistem yang sudah aktif.
15. Konfirmasi bahwa portal kandidat tidak diubah.
16. Konfirmasi bahwa dashboard, sidebar, AppContext, shared state, ErrorBoundary, dan flow utama tidak dirusak.
17. Masalah yang masih tersisa jika ada.
