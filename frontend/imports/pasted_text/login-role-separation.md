buat sesuai perintah di bawah ini, jangan merubah desain yang lain yang tidak disuruh.

Revisi alur login dan onboarding pada website Ravira. Jangan mengubah desain sistem yang sudah dibuat. Jangan mengubah dashboard, sidebar, AppContext, flow lamaran, flow recruiter, flow analytics, flow admin, warna, font, card, layout, landing page, atau komponen visual yang sudah benar.

Fokus hanya pada pemisahan alur login sesuai role dan koneksi tombol menuju halaman yang tepat.

## Masalah yang Harus Diperbaiki

Saat ini halaman login dibuat menjadi satu halaman dengan pilihan tab:

* Kandidat
* Perusahaan
* Pemerintah / Institusi

Jangan gunakan model login gabungan seperti itu.

Login harus dipisah sesuai role agar alur lebih jelas.

## Alur Login yang Diinginkan

Buat alur login terpisah:

1. Login Kandidat
2. Login Perusahaan / Recruiter
3. Login Pemerintah / Institusi

Setiap role harus punya halaman login sendiri atau route sendiri.

## Route Login

Gunakan route berikut:

* `/masuk/kandidat`
* `/masuk/perusahaan`
* `/masuk/pemerintah`

Jika route `/masuk` tetap dibutuhkan, jadikan hanya sebagai halaman pilihan role masuk, bukan login gabungan dengan tab.

## Halaman Pilih Role Masuk

Jika user klik tombol “Masuk” dari navbar landing page, arahkan ke halaman pilihan role masuk.

Halaman ini berisi 3 card:

### Card Kandidat

Judul:
“Masuk sebagai Kandidat”

Deskripsi:
“Akses rekomendasi pekerjaan, skill gap, pelatihan, dan status lamaran Anda.”

Tombol:
“Masuk Kandidat”

Arahkan ke:
`/masuk/kandidat`

### Card Perusahaan / Recruiter

Judul:
“Masuk sebagai Perusahaan”

Deskripsi:
“Kelola lowongan, pelamar, shortlist kandidat, dan pipeline rekrutmen.”

Tombol:
“Masuk Perusahaan”

Arahkan ke:
`/masuk/perusahaan`

### Card Pemerintah / Institusi

Judul:
“Masuk sebagai Pemerintah / Institusi”

Deskripsi:
“Akses workforce analytics, tren skill, heatmap wilayah, dan laporan agregat.”

Tombol:
“Masuk Pemerintah”

Arahkan ke:
`/masuk/pemerintah`

## Login Kandidat

Buat halaman `/masuk/kandidat`.

Isi:

* Logo Ravira
* Judul: “Masuk sebagai Kandidat”
* Subjudul: “Lanjutkan perjalanan karier Anda bersama Ravira.”
* Input email
* Input password
* Checkbox “Ingat saya”
* Link “Lupa password?”
* Tombol “Masuk”
* Link “Belum punya akun? Daftar sebagai Kandidat”
* Link “Kembali ke Pilihan Masuk”

Flow:

* Tombol “Masuk” → `/dashboard/kandidat`
* “Daftar sebagai Kandidat” → `/daftar/kandidat`
* “Kembali ke Pilihan Masuk” → `/masuk`

Jangan tampilkan tab Perusahaan atau Pemerintah di halaman ini.

## Login Perusahaan / Recruiter

Buat halaman `/masuk/perusahaan`.

Isi:

* Logo Ravira
* Judul: “Masuk sebagai Perusahaan”
* Subjudul: “Kelola proses rekrutmen dan temukan kandidat terbaik dengan Ravira.”
* Input email perusahaan
* Input password
* Checkbox “Ingat saya”
* Link “Lupa password?”
* Tombol “Masuk Perusahaan”
* Link “Belum punya akun perusahaan? Daftarkan Perusahaan”
* Link “Kembali ke Pilihan Masuk”

Flow:

* Jika akun perusahaan belum onboarding → arahkan ke `/daftar/perusahaan/onboarding`
* Jika akun perusahaan sudah onboarding → arahkan ke `/dashboard/perusahaan`
* “Daftarkan Perusahaan” → `/daftar/perusahaan`
* “Kembali ke Pilihan Masuk” → `/masuk`

Jangan tampilkan tab Kandidat atau Pemerintah di halaman ini.

## Login Pemerintah / Institusi

Buat halaman `/masuk/pemerintah`.

Isi:

* Logo Ravira
* Judul: “Masuk sebagai Pemerintah / Institusi”
* Subjudul: “Akses data workforce analytics dan insight tenaga kerja secara agregat.”
* Input email resmi
* Input password
* Checkbox “Ingat saya”
* Link “Lupa password?”
* Tombol “Masuk Pemerintah”
* Link “Belum punya akses? Ajukan Akses Analytics”
* Link “Kembali ke Pilihan Masuk”

Flow:

* Jika akun pemerintah belum diverifikasi → arahkan ke `/daftar/pemerintah/verifikasi`
* Jika akun pemerintah sudah diverifikasi tetapi belum onboarding → arahkan ke `/daftar/pemerintah/onboarding`
* Jika akun pemerintah sudah aktif → arahkan ke `/dashboard/analytics`
* “Ajukan Akses Analytics” → `/daftar/pemerintah`
* “Kembali ke Pilihan Masuk” → `/masuk`

Jangan tampilkan tab Kandidat atau Perusahaan di halaman ini.

## Revisi Navbar Landing Page

Pada landing page:

* Tombol “Masuk” → `/masuk`
* Tombol “Daftar” → `/daftar`

Jika ada menu “Untuk Perusahaan”:

* Tombol “Masuk Perusahaan” jika ada → `/masuk/perusahaan`
* Tombol “Daftarkan Perusahaan” → `/daftar/perusahaan`

Jika ada menu “Analytics”:

* Tombol “Masuk Pemerintah” jika ada → `/masuk/pemerintah`
* Tombol “Ajukan Akses Analytics” → `/daftar/pemerintah`

## Revisi Halaman Daftar

Pastikan alur daftar tetap seperti ini:

* `/daftar` → halaman pilih role daftar
* `/daftar/kandidat` → registrasi kandidat
* `/daftar/perusahaan` → registrasi perusahaan
* `/daftar/pemerintah` → registrasi pemerintah / institusi

Setelah daftar:

* Kandidat → onboarding kandidat → dashboard kandidat
* Perusahaan → onboarding perusahaan → dashboard perusahaan
* Pemerintah → verifikasi / onboarding pemerintah → dashboard analytics

## Jangan Diubah

Jangan mengubah:

* Dashboard Kandidat
* Dashboard Perusahaan
* Dashboard Analytics
* Dashboard Admin
* Sidebar semua role
* AppContext
* Shared state lamaran
* Shared state lowongan tersimpan
* Flow kandidat melamar
* Flow recruiter melihat pelamar
* Flow pipeline recruiter
* Flow pemerintah analytics
* Flow admin
* Modal dan toast yang sudah berjalan
* Data dummy/filter Pulau Jawa
* Landing page selain tombol navbar yang berkaitan dengan Masuk dan Daftar

## Tujuan Akhir

Setelah revisi, tidak boleh ada lagi satu halaman login gabungan dengan tab Kandidat / Perusahaan / Pemerintah.

Setiap role harus punya alur login masing-masing:

* Kandidat login sendiri
* Perusahaan login sendiri
* Pemerintah login sendiri

## Setelah Selesai, Wajib Buat Laporan

Setelah menjalankan revisi ini, buat list:

1. Halaman login apa saja yang dibuat atau diperbaiki.
2. Route login apa saja yang aktif.
3. Tombol navbar apa saja yang dihubungkan.
4. Flow login kandidat diarahkan ke mana.
5. Flow login perusahaan diarahkan ke mana.
6. Flow login pemerintah diarahkan ke mana.
7. Halaman atau sistem apa saja yang tidak diubah.
8. Jika ada masalah tersisa, jelaskan dengan jelas.
