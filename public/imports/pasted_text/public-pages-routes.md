buat sesuai perintah di bawah ini, jangan merubah desain yang lain yang tidak disuruh.

Revisi hanya bagian halaman publik, navbar publik, dan alur masuk/daftar per role pada Ravira. Jangan mengubah dashboard, sidebar, AppContext, shared state, flow lamaran, flow recruiter, flow analytics, flow admin, modal, toast, ErrorBoundary, warna, font, card, layout dashboard, atau sistem yang sudah berjalan.

## Tujuan

Buat Ravira memiliki 3 portal publik sesuai role:

1. Portal Kandidat / Beranda utama
2. Portal Perusahaan / Recruiter
3. Portal Pemerintah / Institusi

Setiap portal punya navbar dan tombol masuk/daftar sesuai role masing-masing. Jangan gabungkan login atau daftar dalam satu halaman pilihan 3 role sebagai flow utama.

## 1. Portal Kandidat / Beranda Utama

Route:
`/`

Beranda adalah portal utama untuk kandidat / pencari kerja.

Navbar Beranda berisi:

* Beranda
* Fitur
* Untuk Kandidat
* Untuk Perusahaan
* Untuk Pemerintah
* Tentang Ravira
* Kontak
* Masuk
* Daftar

Link navbar:

* Beranda → `/`
* Fitur → `/fitur`
* Untuk Kandidat → `/untuk-kandidat`
* Untuk Perusahaan → `/untuk-perusahaan`
* Untuk Pemerintah → `/untuk-pemerintah`
* Tentang Ravira → `/tentang`
* Kontak → `/kontak`
* Masuk → `/masuk/kandidat`
* Daftar → `/daftar/kandidat`

CTA di Beranda:

* Mulai Sekarang → `/daftar/kandidat`
* Masuk → `/masuk/kandidat`
* Cari Lowongan → `/untuk-kandidat`

Catatan:
Jangan buat section besar “Apa itu Ravira” di Beranda. Penjelasan lengkap “Apa itu Ravira” masuk ke halaman `/tentang`.

Beranda cukup berisi ringkasan:

* Hero utama
* Ravira untuk siapa
* Preview fitur utama
* Alur kerja singkat
* Mengapa Ravira berbeda
* CTA akhir
* Footer

## 2. Portal Perusahaan

Route:
`/untuk-perusahaan`

Halaman ini khusus untuk perusahaan / recruiter. Buat navbar khusus perusahaan, seperti portal employer.

Navbar perusahaan berisi:

* Beranda Perusahaan
* Lowongan
* Produk
* Solusi Rekrutmen
* Insight Rekrutmen
* Masuk
* Daftarkan Perusahaan
* Buat Lowongan

Link navbar perusahaan:

* Beranda Perusahaan → `/untuk-perusahaan`
* Lowongan → section lowongan perusahaan
* Produk → section fitur perusahaan
* Solusi Rekrutmen → section solusi recruiter
* Insight Rekrutmen → section analitik rekrutmen
* Masuk → `/masuk/perusahaan`
* Daftarkan Perusahaan → `/daftar/perusahaan`
* Buat Lowongan → `/daftar/perusahaan`

Isi halaman perusahaan:

* Judul: “Rekrut Kandidat Lebih Tepat dengan Ravira”
* Deskripsi singkat manfaat Ravira untuk recruiter
* Form awal:

  * Input posisi yang direkrut
  * Input lokasi kerja
  * Tombol “Buat Lowongan”
* Fitur:

  * Buat lowongan
  * Shortlist kandidat berbasis AI
  * Match score kandidat
  * Profil kandidat berbasis consent
  * Pipeline rekrutmen
  * Jadwal interview
  * Analitik rekrutmen
  * Integrasi ATS / HRIS

CTA:

* Masuk Perusahaan → `/masuk/perusahaan`
* Daftarkan Perusahaan → `/daftar/perusahaan`
* Buat Lowongan → `/daftar/perusahaan`

Jangan arahkan tombol perusahaan ke kandidat.

## 3. Portal Pemerintah / Institusi

Route:
`/untuk-pemerintah`

Halaman ini khusus untuk pemerintah, kampus, lembaga pelatihan, atau institusi.

Navbar pemerintah berisi:

* Beranda Pemerintah
* Analytics
* Tren Skill
* Heatmap Wilayah
* Laporan
* Masuk
* Ajukan Akses

Link navbar pemerintah:

* Beranda Pemerintah → `/untuk-pemerintah`
* Analytics → section analytics
* Tren Skill → section tren skill
* Heatmap Wilayah → section heatmap
* Laporan → section laporan
* Masuk → `/masuk/pemerintah`
* Ajukan Akses → `/daftar/pemerintah`

Isi halaman pemerintah:

* Judul: “Workforce Analytics untuk Pemerintah dan Institusi”
* Deskripsi singkat manfaat Ravira untuk membaca tren tenaga kerja
* Fitur:

  * Supply-demand tenaga kerja
  * Tren skill
  * Heatmap wilayah
  * Proyeksi kompetensi
  * Rekomendasi program pelatihan
  * Laporan dan ekspor data
  * Insight mobilitas talenta

Tambahkan catatan:
“Data yang ditampilkan bersifat agregat dan anonim.”

CTA:

* Masuk Pemerintah / Institusi → `/masuk/pemerintah`
* Ajukan Akses Analytics → `/daftar/pemerintah`

Jangan arahkan tombol pemerintah ke kandidat atau perusahaan.

## 4. Login dan Daftar

Jangan gunakan halaman login gabungan dengan 3 card role sebagai flow utama.

Gunakan login terpisah:

* `/masuk/kandidat`
* `/masuk/perusahaan`
* `/masuk/pemerintah`

Flow login:

* Login Kandidat → `/dashboard/kandidat`
* Login Perusahaan → `/dashboard/perusahaan` atau onboarding perusahaan jika belum selesai
* Login Pemerintah → `/dashboard/analytics` atau verifikasi jika belum aktif

Gunakan daftar terpisah:

* `/daftar/kandidat`
* `/daftar/perusahaan`
* `/daftar/pemerintah`

Flow daftar:

* Daftar Kandidat → onboarding kandidat → `/dashboard/kandidat`
* Daftar Perusahaan → onboarding perusahaan → `/dashboard/perusahaan`
* Daftar Pemerintah → verifikasi / onboarding pemerintah → `/dashboard/analytics`

Jika route `/masuk` dan `/daftar` masih ada, jadikan fallback saja. Jangan jadikan flow utama.

## 5. Halaman Publik Tambahan

Pastikan route ini tetap ada:

* `/fitur`
* `/tentang`
* `/kontak`

Isi `/fitur`:

* Smart Job Matching
* Explainable Match Score
* Skill Gap Advisor
* Personalized Training
* Cross-Region Matching
* Workforce Analytics
* Consent & Privacy Control
* Recruiter Pipeline

Isi `/tentang`:

* Apa itu Ravira
* Visi Ravira
* Misi Ravira
* Cara Ravira menghubungkan kandidat, perusahaan, dan institusi
* Komitmen privasi dan consent kandidat

Isi `/kontak`:

* Form nama
* Email
* Nomor WhatsApp
* Kategori
* Pesan
* Tombol Kirim Pesan
* Toast: “Pesan berhasil dikirim. Tim Ravira akan menghubungi Anda.”

## 6. Data Testing Wilayah

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

## 7. Jangan Diubah

Jangan mengubah:

* Dashboard kandidat
* Dashboard perusahaan
* Dashboard analytics
* Dashboard admin
* Sidebar semua role
* AppContext
* State applications
* State savedJobs
* Flow kandidat melamar
* Flow recruiter melihat pelamar
* Flow pipeline recruiter
* Flow analytics pemerintah
* Flow admin
* ErrorBoundary
* Modal dan toast yang sudah berjalan
* Desain dashboard yang sudah benar

## 8. Laporan Setelah Selesai

Setelah selesai, buat laporan singkat:

1. Portal publik apa saja yang dibuat atau diperbaiki.
2. Navbar kandidat, perusahaan, dan pemerintah berisi apa saja.
3. Tombol Masuk dan Daftar tiap portal mengarah ke mana.
4. Route login role apa saja yang aktif.
5. Route daftar role apa saja yang aktif.
6. Bagian sistem apa saja yang tidak diubah.
7. Apakah dashboard, sidebar, AppContext, shared state, ErrorBoundary, dan flow antar role tetap aman.
8. Masalah yang masih tersisa jika ada.
