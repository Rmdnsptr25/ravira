Buat sesuai perintah di bawah ini, jangan merubah desain yang lain yang tidak disuruh.

Lanjutkan final QA project Ravira. Jangan mengubah desain utama, sidebar, layout, warna, font, card, dashboard, landing page, atau komponen visual yang sudah benar. Fokus hanya pada pengecekan error, aktivasi tombol, validasi route, dan koneksi antar role.

Gunakan Bahasa Indonesia untuk seluruh teks UI.

## Fokus Revisi

Sekarang halaman Lowongan Tersimpan sudah bisa dibuka dan error `jobs is not defined` sudah diperbaiki. Lanjutkan dengan mengecek semua route dan tombol penting agar tidak ada error runtime lain.

## 1. Cek Error di Semua Route Kandidat

Cek route berikut satu per satu:

* `/dashboard/kandidat`
* `/dashboard/kandidat/rekomendasi`
* `/dashboard/kandidat/tersimpan`
* `/dashboard/kandidat/detail-pekerjaan`
* `/dashboard/kandidat/skill-gap`
* `/dashboard/kandidat/pelatihan`
* `/dashboard/kandidat/detail-kursus`
* `/dashboard/kandidat/lamaran`
* `/dashboard/kandidat/detail-lamaran`
* `/dashboard/kandidat/cross-region`
* `/dashboard/kandidat/detail-cross-region`
* `/dashboard/kandidat/profil`
* `/dashboard/kandidat/privasi`

Pastikan tidak ada:

* ReferenceError
* undefined variable
* map pada data undefined
* property undefined
* route blank
* tombol yang tidak punya aksi

Jika ada error, perbaiki langsung tanpa mengubah desain.

## 2. Cek Tombol Kandidat

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

## 3. Cek Alur Kandidat ke Recruiter

Pastikan alur ini berjalan:

Kandidat klik Lamar
→ Modal Konfirmasi Lamaran
→ Kirim Lamaran
→ Modal Lamaran Berhasil
→ Lamaran masuk ke Lamaran Saya
→ Data kandidat muncul di role Recruiter sebagai Pelamar Baru

Data kandidat:

* Nama: Budi Santoso
* Posisi: Senior UX Designer
* Perusahaan: Tokopedia / Ojek / sesuai data yang sudah ada
* Domisili kandidat: Yogyakarta
* Lokasi kerja: Jakarta
* Match Score: 94%
* Status awal: Dikirim / Pelamar Baru

Jangan hardcode data baru jika data dari AppContext sudah tersedia. Gunakan data dari `applications`.

## 4. Cek Route dan Tombol Recruiter

Cek route:

* `/dashboard/perusahaan`
* `/dashboard/perusahaan/lowongan`
* `/dashboard/perusahaan/buat-lowongan`
* `/dashboard/perusahaan/shortlist`
* `/dashboard/perusahaan/pipeline`
* `/dashboard/perusahaan/detail-kandidat`
* `/dashboard/perusahaan/analitik`
* `/dashboard/perusahaan/integrasi-ats`
* `/dashboard/perusahaan/profil`
* `/dashboard/perusahaan/pengaturan`

Pastikan tombol aktif:

* Lihat Pelamar → Daftar Pelamar
* Lihat Profil → Detail Kandidat
* Klik nama kandidat → Detail Kandidat
* Klik card kandidat → Detail Kandidat
* Masukkan ke Pipeline → Pipeline Rekrutmen
* Jadwalkan Interview → Modal Jadwal Interview
* Simpan Jadwal → status kandidat menjadi Interview
* Buat Lowongan → Form Buat Lowongan
* Simpan Draft → Toast
* Publikasikan Lowongan → Lowongan Aktif
* Edit Lowongan → mode edit
* Tutup Lowongan → Modal Konfirmasi

## 5. Sinkronisasi Recruiter ke Kandidat

Jika recruiter mengubah status pipeline:

* Screening → Lamaran Saya kandidat menjadi Screening
* Interview → Lamaran Saya kandidat menjadi Interview
* Offer → Lamaran Saya kandidat menjadi Offer
* Hired → Lamaran Saya kandidat menjadi Diterima
* Rejected → Lamaran Saya kandidat menjadi Ditolak

Perubahan harus tampil di:

* Pipeline Recruiter
* Lamaran Saya kandidat
* Detail Status Lamaran kandidat
* Profil Kandidat untuk Recruiter

Jika belum sinkron, perbaiki melalui AppContext atau shared state yang sudah ada.

## 6. Cek Route Pemerintah / Institusi

Cek route:

* `/dashboard/analytics`
* `/dashboard/analytics/workforce`
* `/dashboard/analytics/heatmap`
* `/dashboard/analytics/detail-wilayah`
* `/dashboard/analytics/tren-skill`
* `/dashboard/analytics/proyeksi`
* `/dashboard/analytics/rekomendasi-program`
* `/dashboard/analytics/laporan`
* `/dashboard/analytics/pengaturan`

Pastikan tombol aktif:

* Export Laporan → Modal Export
* Download PDF → Toast
* Download Excel → Toast
* Download CSV → Toast
* Klik wilayah heatmap → Detail Wilayah
* Filter wilayah → dropdown
* Filter kota → dropdown
* Filter sektor → dropdown
* Filter periode → dropdown
* Buat Rekomendasi Program Pelatihan → Form Rekomendasi Program

Catatan:
Pulau Jawa hanya untuk data dummy dan filter testing. Jangan ubah branding utama Ravira menjadi khusus Pulau Jawa.

Gunakan filter dummy:

* DKI Jakarta
* Banten
* Jawa Barat
* Jawa Tengah
* DI Yogyakarta
* Jawa Timur

Kota dummy:

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

## 7. Cek Route Admin

Cek route:

* `/dashboard/admin`
* `/dashboard/admin/verifikasi-perusahaan`
* `/dashboard/admin/moderasi-lowongan`
* `/dashboard/admin/laporan-abuse`
* `/dashboard/admin/monitoring-integrasi`
* `/dashboard/admin/audit-log`
* `/dashboard/admin/model-ai`
* `/dashboard/admin/user-management`
* `/dashboard/admin/pengaturan`

Pastikan tombol aktif:

* Review → Detail Review
* Approve → Toast “Data berhasil disetujui”
* Reject → Modal Alasan Penolakan
* Approve Lowongan → Toast “Lowongan disetujui”
* Reject Lowongan → Modal Alasan Penolakan
* Retry Sync → Toast “Sinkronisasi diulang”
* Lihat Audit Detail → Detail Audit
* Suspend User → Modal Konfirmasi
* Reset Password → Toast
* Lihat Detail Model → Detail Model AI

## 8. Tambahkan Error Boundary Sederhana

Jika belum ada, tambahkan error boundary sederhana agar user tidak melihat halaman error teknis mentah.

Jika terjadi error, tampilkan UI ramah:

Judul:
“Terjadi Kendala”

Isi:
“Halaman gagal dimuat. Silakan kembali ke dashboard atau coba lagi.”

Tombol:

* Kembali ke Dashboard
* Muat Ulang

Jangan mengubah desain besar. Gunakan style Ravira yang sudah ada.

## 9. Jangan Ubah Desain

Jangan mengubah:

* Sidebar yang sudah tampil
* Layout dashboard
* Landing page
* Warna
* Font
* Card
* Navbar
* Komponen visual yang sudah benar

Hanya perbaiki:

* error runtime
* tombol yang belum aktif
* route yang belum terhubung
* modal
* toast
* state
* sinkronisasi antar role
* data dummy/filter Pulau Jawa untuk testing

## 10. Setelah Selesai, Wajib Buat Laporan

Setelah menjalankan QA ini, buat laporan:

1. Route apa saja yang sudah dicek.
2. Error apa saja yang ditemukan dan diperbaiki.
3. Tombol kandidat apa saja yang sudah aktif.
4. Tombol recruiter apa saja yang sudah aktif.
5. Tombol pemerintah/institusi apa saja yang sudah aktif.
6. Tombol admin apa saja yang sudah aktif.
7. Alur Kandidat → Recruiter apa saja yang sudah berjalan.
8. Alur Recruiter → Kandidat apa saja yang sudah sinkron.
9. Data dummy/filter Pulau Jawa apa saja yang dicek.
10. Masalah yang masih tersisa jika ada.
