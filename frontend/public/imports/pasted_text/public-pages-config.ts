buat sesuai perintah di bawah ini, jangan merubah desain yang lain yang tidak disuruh.

Revisi struktur halaman publik dan alur login Ravira agar lebih rapi seperti pola portal rekrutmen modern. Jangan mengubah sistem yang sudah dibuat, jangan mengubah dashboard, sidebar, AppContext, shared state, flow lamaran, flow recruiter, flow analytics, flow admin, modal, toast, warna, font, card, atau layout dashboard yang sudah benar.

Fokus hanya pada halaman publik untuk masing-masing role dan koneksi login/daftar sesuai role.

## Tujuan Revisi

Pisahkan halaman informasi publik berdasarkan role, seperti konsep JobStreet:

* Halaman kandidat untuk pencari kerja
* Halaman perusahaan untuk recruiter/perusahaan
* Halaman pemerintah/institusi untuk analytics
* Login dan daftar tidak digabung dalam satu form tab

Jangan jadikan semua informasi role hanya sebagai section dalam satu landing page. Setiap role harus punya halaman publik sendiri.

## Struktur Halaman Publik Ravira

Buat atau rapikan route publik berikut:

1. `/` → Beranda utama / kandidat
2. `/untuk-kandidat` → halaman informasi khusus kandidat
3. `/untuk-perusahaan` → halaman informasi khusus perusahaan / recruiter
4. `/untuk-pemerintah` → halaman informasi khusus pemerintah / institusi
5. `/fitur` → halaman fitur utama Ravira
6. `/tentang` → halaman tentang Ravira
7. `/kontak` → halaman kontak
8. `/masuk` → halaman pilih role masuk
9. `/daftar` → halaman pilih role daftar

Catatan:
Route dashboard jangan diubah.

* `/dashboard/kandidat` tetap dashboard kandidat
* `/dashboard/perusahaan` tetap dashboard perusahaan
* `/dashboard/analytics` tetap dashboard pemerintah/institusi
* `/dashboard/admin` tetap dashboard admin

## Navbar Publik

Navbar publik Ravira berisi:

1. Beranda
2. Fitur
3. Untuk Kandidat
4. Untuk Perusahaan
5. Untuk Pemerintah
6. Tentang Ravira
7. Kontak
8. Masuk
9. Daftar

Koneksi navbar:

* Beranda → `/`
* Fitur → `/fitur`
* Untuk Kandidat → `/untuk-kandidat`
* Untuk Perusahaan → `/untuk-perusahaan`
* Untuk Pemerintah → `/untuk-pemerintah`
* Tentang Ravira → `/tentang`
* Kontak → `/kontak`
* Masuk → `/masuk`
* Daftar → `/daftar`

Navbar harus tampil di seluruh halaman publik, tetapi jangan tampil di dashboard role yang sudah punya sidebar.

## Halaman Beranda Utama

Halaman `/` tetap menjadi halaman utama Ravira.

Isi beranda boleh tetap memakai desain yang sudah ada:

* Hero Ravira
* CTA utama
* Ringkasan fitur
* Ringkasan manfaat kandidat
* Ringkasan manfaat perusahaan
* Ringkasan workforce analytics
* Footer

Jangan redesign total halaman beranda. Cukup pastikan navbar mengarah ke halaman publik masing-masing role.

## Halaman Untuk Kandidat

Buat atau rapikan `/untuk-kandidat`.

Isi halaman:

* Judul: “Temukan Pekerjaan yang Lebih Relevan dengan Ravira”
* Deskripsi: Ravira membantu kandidat menemukan pekerjaan, memahami skill gap, mengikuti pelatihan, menyimpan lowongan, dan memantau status lamaran.
* Search lowongan sederhana:

  * Input posisi / kata kunci
  * Input lokasi
  * Tombol “Cari Lowongan”
* Section fitur kandidat:

  * Rekomendasi pekerjaan berbasis AI
  * Match score
  * Skill Gap Report
  * Rekomendasi pelatihan
  * Lowongan tersimpan
  * Lamaran Saya
  * Peluang lintas wilayah
* CTA:

  * “Daftar sebagai Kandidat” → `/daftar/kandidat`
  * “Masuk Kandidat” → `/masuk/kandidat`

## Halaman Untuk Perusahaan

Buat atau rapikan `/untuk-perusahaan`.

Halaman ini harus terasa seperti portal perusahaan/recruiter, bukan halaman kandidat.

Isi halaman:

* Judul: “Rekrut Lebih Mudah dengan Ravira”
* Deskripsi: Ravira membantu perusahaan menemukan kandidat yang relevan, mengelola lowongan, melihat match score, shortlist kandidat, dan pipeline rekrutmen.
* Form awal sederhana seperti employer landing:

  * Input posisi yang direkrut
  * Input lokasi kerja
  * Tombol “Buat Lowongan”
* Section fitur perusahaan:

  * Buat lowongan
  * Shortlist kandidat berbasis AI
  * Match score kandidat
  * Profil kandidat berbasis consent
  * Pipeline rekrutmen
  * Jadwal interview
  * Analitik rekrutmen
* CTA:

  * “Daftarkan Perusahaan” → `/daftar/perusahaan`
  * “Masuk Perusahaan” → `/masuk/perusahaan`
  * “Buat Lowongan” → `/daftar/perusahaan`

## Halaman Untuk Pemerintah / Institusi

Buat atau rapikan `/untuk-pemerintah`.

Halaman ini khusus informasi untuk pemerintah, kampus, lembaga pelatihan, atau institusi yang membutuhkan workforce analytics.

Isi halaman:

* Judul: “Workforce Analytics untuk Pemerintah dan Institusi”
* Deskripsi: Ravira membantu institusi melihat data tenaga kerja secara agregat dan anonim untuk memahami kebutuhan skill, tren pekerjaan, dan rekomendasi program pelatihan.
* Section fitur:

  * Supply-demand tenaga kerja
  * Tren skill
  * Heatmap wilayah
  * Proyeksi kompetensi
  * Rekomendasi program pelatihan
  * Laporan dan ekspor data
* Catatan wajib:
  “Data yang ditampilkan bersifat agregat dan anonim.”
* CTA:

  * “Ajukan Akses Analytics” → `/daftar/pemerintah`
  * “Masuk Pemerintah / Institusi” → `/masuk/pemerintah`

## Halaman Masuk

Jangan gunakan lagi satu halaman login gabungan dengan tab Kandidat / Perusahaan / Pemerintah.

Route `/masuk` hanya menjadi halaman pilih role masuk.

Isi `/masuk`:

* Card “Masuk sebagai Kandidat” → `/masuk/kandidat`
* Card “Masuk sebagai Perusahaan” → `/masuk/perusahaan`
* Card “Masuk sebagai Pemerintah / Institusi” → `/masuk/pemerintah`

Buat login role terpisah:

* `/masuk/kandidat`
* `/masuk/perusahaan`
* `/masuk/pemerintah`

Flow:

* `/masuk/kandidat` → setelah login ke `/dashboard/kandidat`
* `/masuk/perusahaan` → jika belum onboarding ke `/daftar/perusahaan/onboarding`, jika sudah ke `/dashboard/perusahaan`
* `/masuk/pemerintah` → jika belum verifikasi ke `/daftar/pemerintah/verifikasi`, jika sudah aktif ke `/dashboard/analytics`

## Halaman Daftar

Route `/daftar` menjadi halaman pilih role daftar.

Isi `/daftar`:

* Card Kandidat → `/daftar/kandidat`
* Card Perusahaan → `/daftar/perusahaan`
* Card Pemerintah / Institusi → `/daftar/pemerintah`

Flow daftar:

* Kandidat → onboarding kandidat → dashboard kandidat
* Perusahaan → onboarding perusahaan → dashboard perusahaan
* Pemerintah → verifikasi / onboarding pemerintah → dashboard analytics

## Fitur dan Tentang

Buat atau rapikan:

### `/fitur`

Isi:

* Smart Job Matching
* Skill Gap Advisor
* Personalized Training
* Cross-Region Matching
* Workforce Analytics
* Consent & Privacy Control

### `/tentang`

Isi:

* Tentang Ravira
* Visi dan misi
* Cara Ravira menghubungkan kandidat, perusahaan, dan institusi
* Komitmen privasi dan consent kandidat

### `/kontak`

Isi:

* Form kontak
* Nama
* Email
* Nomor WhatsApp
* Kategori
* Pesan
* Tombol “Kirim Pesan”
* Toast “Pesan berhasil dikirim. Tim Ravira akan menghubungi Anda.”

## Data Testing Wilayah

Jangan ubah branding utama menjadi khusus Pulau Jawa.

Pulau Jawa hanya untuk data dummy dan filter testing di input lokasi, lowongan, analytics, dan contoh data.

Gunakan contoh:

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

Jangan ubah copy utama yang sudah menyebut Ravira sebagai platform umum.

## Jangan Diubah

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

## Setelah Selesai, Wajib Buat Laporan

Setelah revisi selesai, buat list:

1. Halaman publik apa saja yang dibuat atau diperbaiki.
2. Route publik apa saja yang aktif.
3. Menu navbar apa saja yang terhubung.
4. Halaman login role apa saja yang dibuat.
5. Halaman daftar role apa saja yang terhubung.
6. CTA pada halaman kandidat, perusahaan, dan pemerintah mengarah ke mana.
7. Bagian sistem apa saja yang tidak diubah.
8. Apakah dashboard, sidebar, AppContext, shared state, ErrorBoundary, dan flow antar role tetap aman.
9. Masalah yang masih tersisa jika ada.
