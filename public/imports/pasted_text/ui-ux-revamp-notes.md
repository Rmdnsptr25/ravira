buat sesuai perintah di bawah ini, jangan merubah desain yang lain yang tidak disuruh.

Lanjutkan revisi UI/UX Ravira. Jangan mengubah dashboard, sidebar, AppContext, shared state, flow kandidat, flow recruiter, flow analytics, flow admin, modal, toast, ErrorBoundary, warna, font, card, layout dashboard, atau sistem yang sudah berjalan.

Fokus hanya pada:

1. Menghapus flow masuk/daftar gabungan 3 role.
2. Menghapus tombol CTA yang berulang.
3. Memastikan setiap portal role punya tombol masuk/daftar sesuai role masing-masing.
4. Membuat active state pada navbar.
5. Memastikan navbar perusahaan dan pemerintah tetap membuka halaman masing-masing, bukan scroll section.

## 1. Hapus Flow Masuk dan Daftar Gabungan

Saat ini masih ada halaman `/masuk` yang menampilkan 3 card:

* Masuk sebagai Kandidat
* Masuk sebagai Perusahaan
* Masuk sebagai Pemerintah / Institusi

Jangan gunakan halaman seperti ini sebagai flow utama.

Perbaiki:

* `/masuk` → redirect ke `/masuk/kandidat`
* `/daftar` → redirect ke `/daftar/kandidat`

Jangan tampilkan lagi halaman pilihan 3 role untuk masuk atau daftar sebagai flow utama.

## 2. Aturan Masuk dan Daftar per Role

Beranda utama Ravira adalah portal kandidat.

Maka pada Beranda dan portal Kandidat:

* Masuk → `/masuk/kandidat`
* Daftar → `/daftar/kandidat`
* Mulai Sekarang → `/daftar/kandidat`
* Cari Lowongan → `/untuk-kandidat`

Pada portal Perusahaan:

* Masuk → `/masuk/perusahaan`
* Daftarkan Perusahaan → `/daftar/perusahaan`
* Buat Lowongan → `/daftar/perusahaan`

Pada portal Pemerintah:

* Masuk → `/masuk/pemerintah`
* Ajukan Akses → `/daftar/pemerintah`

Jangan arahkan tombol perusahaan atau pemerintah ke kandidat.

## 3. Hapus Tombol CTA yang Berulang

Jika tombol Masuk, Daftar, Ajukan Akses, atau Daftarkan Perusahaan sudah ada di navbar, jangan ulangi tombol yang sama berkali-kali di dalam halaman.

Contoh yang harus diperbaiki:

* Pada halaman pemerintah, tombol “Ajukan Akses Analytics” dan “Masuk Pemerintah / Institusi” sudah ada di navbar, jadi jangan muncul berulang di hero dan bagian bawah halaman.
* Pada halaman perusahaan, tombol “Masuk Perusahaan”, “Daftarkan Perusahaan”, dan “Buat Lowongan” sudah ada di navbar, jadi jangan muncul berulang berkali-kali di hero dan bagian bawah halaman.
* Pada Beranda, section seperti “Mulai Perjalanan Anda Bersama Ravira” atau “Siap Memulai?” jangan menampilkan pilihan role gabungan atau tombol masuk/daftar umum yang membingungkan.

Aturan:

* Jika CTA mengarah ke login atau registrasi dan sudah ada di navbar, hapus CTA duplikat dari konten.
* Jika tetap butuh tombol di dalam konten, ganti menjadi tombol informasional, bukan tombol masuk/daftar.

Contoh pengganti:

* “Pelajari Fitur” → `/fitur`
* “Lihat untuk Kandidat” → `/untuk-kandidat`
* “Lihat Solusi Perusahaan” → `/untuk-perusahaan/solusi-rekrutmen`
* “Lihat Insight Rekrutmen” → `/untuk-perusahaan/insight-rekrutmen`
* “Lihat Analytics” → `/untuk-pemerintah/analytics`
* “Lihat Tren Skill” → `/untuk-pemerintah/tren-skill`
* “Lihat Laporan” → `/untuk-pemerintah/laporan`

Jika section hanya berisi CTA masuk/daftar yang sudah ada di navbar, hapus section tersebut.

## 4. Revisi Section “Siap Memulai?” di Beranda

Jika ada section “Siap Memulai?” atau “Mulai Perjalanan Anda Bersama Ravira” yang mengarah ke pilihan role gabungan, hapus section tersebut atau ubah menjadi section informasional.

Ganti menjadi:

Judul:
“Jelajahi Ekosistem Ravira”

Isi 3 card informasional:

1. Kandidat → `/untuk-kandidat`
2. Perusahaan → `/untuk-perusahaan`
3. Pemerintah / Institusi → `/untuk-pemerintah`

Jangan pakai tombol:

* Masuk ke Akun
* Mulai Sekarang
* Daftar umum
* Pilih role masuk
* Pilih role daftar

Tujuannya hanya membantu user memilih portal informasi, bukan membuka halaman login/daftar gabungan.

## 5. Active State Navbar

Tambahkan active state pada semua navbar publik.

Jika user sedang berada di halaman tertentu, menu navbar tersebut harus berubah warna atau diberi highlight.

Gunakan warna highlight sesuai style Ravira, misalnya:

* biru terang,
* cyan,
* atau background navy lebih terang.

Contoh:

Pada portal kandidat / publik utama:

* `/` → Beranda aktif
* `/fitur` → Fitur aktif
* `/untuk-kandidat` → Untuk Kandidat aktif
* `/untuk-perusahaan` → Untuk Perusahaan aktif
* `/untuk-pemerintah` → Untuk Pemerintah aktif
* `/tentang` → Tentang Ravira aktif
* `/kontak` → Kontak aktif

Pada portal perusahaan:

* `/untuk-perusahaan` → Beranda Perusahaan aktif
* `/untuk-perusahaan/lowongan` → Lowongan aktif
* `/untuk-perusahaan/produk` → Produk aktif
* `/untuk-perusahaan/solusi-rekrutmen` → Solusi Rekrutmen aktif
* `/untuk-perusahaan/insight-rekrutmen` → Insight Rekrutmen aktif

Pada portal pemerintah:

* `/untuk-pemerintah` → Beranda Pemerintah aktif
* `/untuk-pemerintah/analytics` → Analytics aktif
* `/untuk-pemerintah/tren-skill` → Tren Skill aktif
* `/untuk-pemerintah/heatmap` → Heatmap Wilayah aktif
* `/untuk-pemerintah/laporan` → Laporan aktif

## 6. Navbar Perusahaan Tetap Route-Based

Pastikan navbar perusahaan tetap membuka halaman sendiri, bukan scroll section.

Route:

* Beranda Perusahaan → `/untuk-perusahaan`
* Lowongan → `/untuk-perusahaan/lowongan`
* Produk → `/untuk-perusahaan/produk`
* Solusi Rekrutmen → `/untuk-perusahaan/solusi-rekrutmen`
* Insight Rekrutmen → `/untuk-perusahaan/insight-rekrutmen`
* Masuk → `/masuk/perusahaan`
* Daftarkan Perusahaan → `/daftar/perusahaan`
* Buat Lowongan → `/daftar/perusahaan`

Jangan gunakan anchor seperti `#lowongan`, `#produk`, atau `#solusi`.

## 7. Navbar Pemerintah Tetap Route-Based

Pastikan navbar pemerintah tetap membuka halaman sendiri, bukan scroll section.

Route:

* Beranda Pemerintah → `/untuk-pemerintah`
* Analytics → `/untuk-pemerintah/analytics`
* Tren Skill → `/untuk-pemerintah/tren-skill`
* Heatmap Wilayah → `/untuk-pemerintah/heatmap`
* Laporan → `/untuk-pemerintah/laporan`
* Masuk → `/masuk/pemerintah`
* Ajukan Akses → `/daftar/pemerintah`

Jangan gunakan anchor seperti `#analytics`, `#tren-skill`, atau `#heatmap`.

## 8. Jangan Ubah Bagian Ini

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
* Data dummy/filter Pulau Jawa
* Struktur portal kandidat yang sudah benar

## 9. Setelah Selesai, Wajib Buat Laporan

Setelah revisi selesai, buat laporan:

1. Apakah `/masuk` sudah tidak menampilkan 3 card role.
2. Apakah `/daftar` sudah tidak menampilkan 3 card role.
3. `/masuk` sekarang diarahkan ke mana.
4. `/daftar` sekarang diarahkan ke mana.
5. Tombol Masuk dan Daftar pada Beranda mengarah ke mana.
6. Tombol Masuk/Daftar pada portal Perusahaan mengarah ke mana.
7. Tombol Masuk/Ajukan Akses pada portal Pemerintah mengarah ke mana.
8. Section CTA duplikat apa saja yang dihapus atau diganti.
9. Active state navbar sudah diterapkan di halaman apa saja.
10. Konfirmasi navbar perusahaan dan pemerintah sudah route-based.
11. Konfirmasi dashboard, sidebar, AppContext, shared state, ErrorBoundary, dan flow utama tidak diubah.
12. Masalah yang masih tersisa jika ada.
