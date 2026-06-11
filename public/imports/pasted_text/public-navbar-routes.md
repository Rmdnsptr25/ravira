buat sesuai perintah di bawah ini, jangan merubah desain yang lain yang tidak disuruh.

Revisi navbar publik website Ravira. Jangan mengubah desain sistem yang sudah dibuat, jangan mengubah dashboard, sidebar, AppContext, shared state, flow kandidat, flow recruiter, flow analytics, flow admin, modal, toast, warna, font, card, atau layout yang sudah benar.

Fokus hanya pada navbar publik dan halaman informasi publik yang dibuka dari navbar.

## Tujuan Revisi

Ubah konsep navbar Ravira agar setiap menu navbar membuka halaman publik sendiri, bukan hanya scroll ke section dalam satu landing page.

Gunakan konsep seperti website LMS modern: setiap menu navbar punya halaman sendiri dengan informasi masing-masing.

## Jangan Diubah

Jangan mengubah:

* Dashboard Kandidat
* Dashboard Perusahaan / Recruiter
* Dashboard Analytics
* Dashboard Admin
* Sidebar semua role
* AppContext
* State lamaran
* State lowongan tersimpan
* Flow kandidat melamar
* Flow recruiter melihat kandidat
* Flow pipeline recruiter
* Flow pemerintah analytics
* Flow admin
* ErrorBoundary
* Modal dan toast yang sudah berjalan
* Data dummy/filter Pulau Jawa
* Desain visual utama yang sudah benar

## Navbar Publik Ravira

Navbar publik harus berisi:

1. Beranda
2. Fitur
3. Untuk Kandidat
4. Untuk Perusahaan
5. Analytics
6. Tentang Ravira
7. Kontak
8. Masuk
9. Daftar

## Route Halaman Publik

Buat atau hubungkan route berikut:

* Beranda → `/`
* Fitur → `/fitur`
* Untuk Kandidat → `/untuk-kandidat`
* Untuk Perusahaan → `/untuk-perusahaan`
* Analytics → `/analytics`
* Tentang Ravira → `/tentang`
* Kontak → `/kontak`
* Masuk → `/masuk`
* Daftar → `/daftar`

Catatan:
Route `/analytics` ini adalah halaman publik informasi analytics, bukan dashboard pemerintah. Dashboard pemerintah tetap memakai route `/dashboard/analytics`.

## Halaman Beranda

Halaman `/` tetap menjadi landing page utama Ravira.

Isi tetap menggunakan desain yang sudah ada:

* Hero Ravira
* Penjelasan singkat
* CTA utama
* Preview fitur
* Preview role
* Footer

Jangan redesign ulang halaman beranda. Cukup pastikan navbar mengarah ke halaman publik masing-masing.

## Halaman Fitur

Buat halaman `/fitur`.

Isi halaman:

* Judul: “Fitur Utama Ravira”
* Deskripsi singkat Ravira sebagai platform rekrutmen berbasis AI
* Card fitur:

  * Smart Job Matching
  * Skill Gap Advisor
  * Personalized Training
  * Cross-Region Matching
  * Workforce Analytics
* Setiap card punya deskripsi singkat
* CTA: “Mulai Sekarang” → `/daftar`

Gunakan style visual yang sama dengan landing page Ravira.

## Halaman Untuk Kandidat

Buat halaman `/untuk-kandidat`.

Isi halaman:

* Judul: “Ravira untuk Kandidat”
* Deskripsi: Ravira membantu kandidat menemukan pekerjaan relevan, memahami skill gap, mengikuti pelatihan, dan memantau lamaran.
* Section:

  * Rekomendasi pekerjaan berbasis AI
  * Skill Gap Report
  * Pelatihan personal
  * Lowongan tersimpan
  * Lamaran Saya
  * Peluang lintas wilayah
* CTA:

  * “Daftar sebagai Kandidat” → `/daftar/kandidat`
  * “Masuk Kandidat” → `/masuk/kandidat`

## Halaman Untuk Perusahaan

Buat halaman `/untuk-perusahaan`.

Isi halaman:

* Judul: “Ravira untuk Perusahaan”
* Deskripsi: Ravira membantu recruiter menemukan kandidat relevan, mengelola lowongan, shortlist, dan pipeline rekrutmen.
* Section:

  * Buat lowongan
  * Shortlist kandidat berbasis AI
  * Match score kandidat
  * Pipeline rekrutmen
  * Jadwal interview
  * Analitik rekrutmen
* CTA:

  * “Daftarkan Perusahaan” → `/daftar/perusahaan`
  * “Masuk Perusahaan” → `/masuk/perusahaan`

## Halaman Analytics

Buat halaman publik `/analytics`.

Isi halaman:

* Judul: “Workforce Analytics Ravira”
* Deskripsi: Ravira menyediakan insight tenaga kerja berbasis data agregat dan anonim.
* Section:

  * Supply-demand tenaga kerja
  * Tren skill
  * Heatmap wilayah
  * Proyeksi kompetensi
  * Rekomendasi program pelatihan
  * Laporan dan ekspor data
* Tambahkan catatan:
  “Data analytics ditampilkan secara agregat dan anonim.”
* CTA:

  * “Ajukan Akses Analytics” → `/daftar/pemerintah`
  * “Masuk Pemerintah / Institusi” → `/masuk/pemerintah`

Catatan:
Pulau Jawa hanya digunakan untuk data dummy dan filter testing di dashboard, jangan ubah copy branding utama halaman publik menjadi khusus Pulau Jawa.

## Halaman Tentang Ravira

Buat halaman `/tentang`.

Isi halaman:

* Judul: “Tentang Ravira”
* Deskripsi Ravira sebagai ekosistem rekrutmen berbasis AI
* Visi: membantu talenta menemukan peluang yang lebih relevan
* Misi:

  * Menghubungkan kandidat dan perusahaan
  * Membantu kandidat memahami skill gap
  * Mendukung peningkatan kompetensi
  * Memberikan insight workforce berbasis data
* Section singkat tentang keamanan data dan consent kandidat

## Halaman Kontak

Buat halaman `/kontak`.

Isi halaman:

* Judul: “Hubungi Tim Ravira”
* Deskripsi singkat
* Form kontak:

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
* Setelah klik, tampilkan toast:
  “Pesan berhasil dikirim. Tim Ravira akan menghubungi Anda.”

## Login dan Daftar

Navbar:

* Tombol “Masuk” → `/masuk`
* Tombol “Daftar” → `/daftar`

Halaman `/masuk` adalah halaman pilih role masuk, bukan login gabungan tab.

Halaman `/daftar` adalah halaman pilih role daftar.

Jangan gunakan lagi halaman login dengan tab Kandidat / Perusahaan / Pemerintah dalam satu form.

## Style Navbar

Gunakan style Ravira yang sudah ada:

* Logo Ravira di kiri
* Menu navbar horizontal di desktop
* Tombol “Masuk” sebagai tombol outline/text
* Tombol “Daftar” sebagai CTA utama
* Active state pada menu yang sedang dibuka
* Mobile navbar menggunakan hamburger menu
* Saat hamburger diklik, tampilkan drawer menu
* Semua menu tetap bisa diklik

## Catatan Penting

* Jangan mengubah dashboard.
* Jangan mengubah sidebar dashboard.
* Jangan mengubah flow yang sudah aktif.
* Jangan mengubah AppContext.
* Jangan merusak route dashboard yang sudah ada.
* Jangan mengubah sistem login role yang sudah dibuat kecuali link navbar menuju halaman pilih role masuk.
* Fokus hanya pada navbar publik dan halaman publik informasional.

## Setelah Selesai, Wajib Buat Laporan

Setelah selesai, buat list:

1. Halaman publik apa saja yang dibuat.
2. Route publik apa saja yang aktif.
3. Menu navbar apa saja yang sudah terhubung.
4. CTA pada masing-masing halaman mengarah ke mana.
5. Bagian sistem apa saja yang tidak diubah.
6. Apakah dashboard, sidebar, AppContext, dan flow antar role tetap aman.
7. Jika ada masalah tersisa, jelaskan dengan jelas.
