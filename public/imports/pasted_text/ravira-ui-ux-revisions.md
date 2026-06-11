Buat sesuai perintah di bawah ini, jangan merubah desain yang lain yang tidak disuruh.

Lanjutkan revisi UI/UX Ravira yang sudah dibuat. Sidebar kandidat sudah tampil dan desain utama sudah benar. Jangan mengubah sidebar, layout, warna, font, card, dashboard, atau komponen visual yang sudah ada. Fokus hanya pada mengaktifkan tombol, memperbaiki alur lamaran, dan menghubungkan data kandidat ke recruiter.

Gunakan Bahasa Indonesia untuk semua teks UI.

## Fokus Revisi

Perbaiki bagian berikut:

1. Alur tombol Lamar / Lamar Sekarang.
2. Alur tombol Simpan / Tersimpan.
3. Halaman Lowongan Tersimpan.
4. Halaman Lamaran Saya.
5. Koneksi kandidat yang melamar ke role recruiter.
6. Filter lokasi untuk data dummy testing Pulau Jawa.

## 1. Perbaiki Alur Lamar

Pada halaman berikut:

* Dashboard Kandidat
* Rekomendasi Pekerjaan
* Detail Pekerjaan
* Lowongan Tersimpan
* Detail Peluang Lintas Wilayah

Aktifkan tombol:

* “Lamar”
* “Lamar Sekarang”
* “Kirim Lamaran”

Alur wajib:

Klik “Lamar” atau “Lamar Sekarang”
→ tampil Modal Konfirmasi Lamaran
→ klik “Kirim Lamaran”
→ tampil Modal Lamaran Berhasil
→ klik “Lihat Lamaran Saya”
→ masuk ke halaman Lamaran Saya

Jangan langsung menutup modal setelah klik “Kirim Lamaran”. Harus tampilkan modal sukses terlebih dahulu.

Modal Konfirmasi Lamaran:

Judul:
“Kirim Lamaran?”

Isi:
“Profil dan CV Anda akan dikirim ke perusahaan sesuai consent yang Anda berikan.”

Tombol:

* Batal
* Kirim Lamaran

Modal Lamaran Berhasil:

Judul:
“Lamaran Berhasil Dikirim”

Isi:
“Anda dapat memantau status lamaran melalui menu Lamaran Saya.”

Tombol:
“Lihat Lamaran Saya”

## 2. Hubungkan Lamaran ke Lamaran Saya

Setelah kandidat berhasil melamar, data harus muncul di halaman Lamaran Saya.

Contoh data lamaran:

* Nama kandidat: Budi Santoso
* Posisi: Senior UX Designer
* Perusahaan: Tokopedia
* Lokasi kerja: Jakarta
* Domisili kandidat: Yogyakarta
* Match Score: 94%
* Status: Dikirim
* Tanggal melamar: hari ini

Pada halaman Lamaran Saya, tampilkan:

* Nama posisi
* Perusahaan
* Lokasi
* Tanggal melamar
* Status terbaru
* Match score
* Tombol “Lihat Status”

Aktifkan tombol:

* “Lihat Status” → Detail Status Lamaran

Pada Detail Status Lamaran, tampilkan:

* Timeline lamaran
* Status saat ini
* Catatan recruiter jika ada
* Jadwal interview jika ada

## 3. Hubungkan Kandidat ke Recruiter

Setelah kandidat berhasil melamar, data kandidat juga harus muncul di role Perusahaan / Recruiter.

Tampilkan kandidat sebagai pelamar baru di:

* Dashboard Recruiter
* Lowongan Aktif
* Lihat Pelamar
* Pipeline Rekrutmen kolom Applied

Data pelamar:

* Nama: Budi Santoso
* Posisi dilamar: Senior UX Designer
* Lokasi kandidat: Yogyakarta
* Lokasi pekerjaan: Jakarta
* Match Score: 94%
* Status: Pelamar Baru
* Skill cocok: Figma, UI Design, User Research
* Skill gap: Design System Advanced
* Consent: sudah diberikan

Aktifkan tombol pada recruiter:

* Klik nama kandidat → Profil Kandidat
* Klik card kandidat → Profil Kandidat
* “Lihat Profil” → Profil Kandidat
* “Masukkan ke Pipeline” → Pipeline Rekrutmen
* “Jadwalkan Interview” → Modal Jadwal Interview

## 4. Hubungkan Perubahan Status Recruiter ke Kandidat

Pada Pipeline Rekrutmen recruiter, aktifkan perubahan status:

* Applied
* Screening
* Interview
* Offer
* Hired
* Rejected

Jika recruiter mengubah status kandidat:

* Screening → status di Lamaran Saya kandidat menjadi Screening
* Interview → status di Lamaran Saya kandidat menjadi Interview
* Offer → status di Lamaran Saya kandidat menjadi Offer
* Hired → status di Lamaran Saya kandidat menjadi Diterima
* Rejected → status di Lamaran Saya kandidat menjadi Ditolak

Status tersebut juga harus tampil di Detail Status Lamaran kandidat.

## 5. Perbaiki Tombol Simpan dan Lowongan Tersimpan

Pada Rekomendasi Pekerjaan dan Detail Pekerjaan:

* Klik “Simpan” → Toast “Lowongan berhasil disimpan”
* Setelah klik “Simpan”, tombol berubah menjadi “Tersimpan”
* Klik “Tersimpan” → Halaman Lowongan Tersimpan

Pada halaman Lowongan Tersimpan:

* “Lihat Detail” → Detail Pekerjaan
* “Lamar Sekarang” → Modal Konfirmasi Lamaran
* “Hapus dari Tersimpan” → Toast “Lowongan dihapus dari daftar tersimpan”

Jika tidak ada data, tampilkan empty state:
“Belum ada lowongan yang disimpan.”

## 6. Perbaiki Filter Lokasi untuk Testing Pulau Jawa

Jangan mengubah teks branding utama Ravira menjadi khusus Pulau Jawa.

Pulau Jawa hanya digunakan untuk data dummy dan filter testing.

Pada dropdown lokasi, gunakan pilihan:

* Semua Lokasi
* Jakarta
* Jakarta Selatan
* Bandung
* Semarang
* Yogyakarta
* Surabaya
* Malang
* Bekasi
* Tangerang
* Depok
* Solo

Pada dropdown provinsi, gunakan:

* DKI Jakarta
* Banten
* Jawa Barat
* Jawa Tengah
* DI Yogyakarta
* Jawa Timur

Jangan mengganti teks besar atau branding utama. Cukup sesuaikan data dummy dan filter wilayah.

## 7. Jangan Ubah Desain

Jangan mengubah:

* Sidebar yang sudah tampil
* Layout dashboard
* Warna
* Font
* Card
* Navbar
* Landing page
* Komponen visual yang sudah benar

Hanya aktifkan:

* Tombol
* Link
* Modal
* Toast
* State
* Data dummy filter wilayah
* Hubungan kandidat ke recruiter

## 8. Setelah Selesai, Wajib Buat Laporan

Setelah menjalankan revisi ini, buat list:

1. Tombol apa saja yang sudah diaktifkan.
2. Modal dan toast apa saja yang sudah dibuat.
3. Alur Kandidat → Recruiter apa saja yang sudah terhubung.
4. Alur Recruiter → Kandidat apa saja yang sudah terhubung.
5. Filter wilayah Pulau Jawa apa saja yang sudah disesuaikan.
6. Route atau halaman apa saja yang sudah dicek.
7. Masalah apa saja yang masih tersisa jika ada.
