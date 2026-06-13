Buat sesuai perintah di bawah ini, jangan merubah desain yang lain yang tidak disuruh.

Revisi project Ravira yang sudah ada. Jangan mengubah desain utama, layout, sidebar, warna, font, card, dashboard, landing page, teks branding, atau struktur sistem yang sudah dibuat.

Fokus hanya pada:

1. Mengaktifkan tombol yang memang harus bisa diklik.
2. Menghubungkan flow antar role Kandidat, Perusahaan/Recruiter, Pemerintah/Institusi, dan Admin.
3. Menyesuaikan data dummy dan filter wilayah untuk kebutuhan testing Pulau Jawa.
4. Membuat laporan/list apa saja yang sudah dikerjakan setelah selesai.

## Catatan Penting Tentang Pulau Jawa

Jangan mengganti teks branding atau copy utama menjadi “khusus Pulau Jawa”.

Ravira tetap ditampilkan sebagai platform rekrutmen seperti desain yang sudah ada.

Pulau Jawa hanya digunakan untuk:

* data dummy,
* filter wilayah,
* contoh kota,
* contoh provinsi,
* data analytics,
* heatmap,
* pilihan lokasi lowongan,
* contoh cross-region opportunity.

Gunakan data dummy wilayah berikut:

* DKI Jakarta
* Banten
* Jawa Barat
* Jawa Tengah
* DI Yogyakarta
* Jawa Timur

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

Jangan mengubah teks besar seperti “Ravira membantu talenta di Indonesia” kecuali benar-benar diperlukan di bagian data/filter/testing.

## Aktifkan Flow Kandidat

Aktifkan tombol pada role Kandidat:

* Dashboard Kandidat → Rekomendasi Pekerjaan
* Rekomendasi Pekerjaan → Detail Pekerjaan
* Detail Pekerjaan → Simpan
* Simpan → Toast “Lowongan berhasil disimpan”
* Setelah disimpan, tombol berubah menjadi “Tersimpan”
* Tersimpan → Lowongan Tersimpan
* Detail Pekerjaan → Lamar Sekarang
* Lamar Sekarang → Modal Konfirmasi Lamaran
* Kirim Lamaran → Modal Lamaran Berhasil
* Lamaran Berhasil → Lamaran Saya
* Lamaran Saya → Detail Status Lamaran
* Skill Gap → Pelatihan
* Pelatihan → Detail Kursus
* Peluang Lintas Wilayah → Detail Peluang Lintas Wilayah
* Profil Saya → Edit Profil
* Pengaturan Privasi → aktifkan toggle consent dan tombol aksi

Modal Konfirmasi Lamaran:
Judul: “Kirim Lamaran?”
Isi: “Profil dan CV Anda akan dikirim ke perusahaan sesuai consent yang Anda berikan.”
Tombol: “Batal” dan “Kirim Lamaran”

Modal Lamaran Berhasil:
Judul: “Lamaran Berhasil Dikirim”
Isi: “Anda dapat memantau status lamaran melalui menu Lamaran Saya.”
Tombol: “Lihat Lamaran Saya”

## Aktifkan Flow Perusahaan / Recruiter

Aktifkan tombol pada role Perusahaan/Recruiter:

* Dashboard Perusahaan → Lowongan Aktif
* Dashboard Perusahaan → Buat Lowongan
* Buat Lowongan → Publikasikan Lowongan
* Publikasikan Lowongan → Lowongan Aktif
* Lowongan Aktif → Lihat Pelamar
* Lihat Pelamar → Profil Kandidat
* Klik nama kandidat → Profil Kandidat
* Klik card kandidat → Profil Kandidat
* Profil Kandidat → Masukkan ke Pipeline
* Profil Kandidat → Jadwalkan Interview
* Jadwalkan Interview → Modal Jadwal Interview
* Pipeline Rekrutmen → ubah status kandidat

Jika kandidat melamar dari role Kandidat, data kandidat harus muncul di role Recruiter sebagai pelamar baru.

Contoh data pelamar:

* Nama: Budi Santoso
* Posisi: Senior UX Designer
* Lokasi: Yogyakarta
* Match Score: 94%
* Status: Pelamar Baru
* Skill cocok: Figma, UI Design, User Research
* Skill gap: Design System Advanced

Jika recruiter mengubah status:

* Screening → status di Lamaran Saya kandidat menjadi Screening
* Interview → status di Lamaran Saya kandidat menjadi Interview
* Offer → status di Lamaran Saya kandidat menjadi Offer
* Hired → status di Lamaran Saya kandidat menjadi Diterima
* Rejected → status di Lamaran Saya kandidat menjadi Ditolak

## Aktifkan Flow Pemerintah / Institusi

Aktifkan tombol pada role Pemerintah/Institusi:

* Dashboard Analytics → Heatmap
* Heatmap → Detail Wilayah
* Dashboard Analytics → Tren Skill
* Dashboard Analytics → Laporan & Ekspor
* Export Laporan → Modal Export
* Buat Rekomendasi Program Pelatihan → Form Rekomendasi Program
* Filter wilayah → dropdown provinsi Pulau Jawa
* Filter kota → dropdown kota Pulau Jawa
* Filter sektor → dropdown sektor industri
* Filter periode → dropdown periode

Data pemerintah hanya boleh agregat dan anonim.

Jangan tampilkan:

* nama kandidat,
* email kandidat,
* nomor telepon,
* CV,
* data pribadi individual.

Contoh insight agregat:
“Minat mobilitas talenta dari DI Yogyakarta ke DKI Jakarta meningkat pada sektor teknologi.”

## Aktifkan Flow Admin

Aktifkan tombol pada role Admin:

* Verifikasi Perusahaan → Review
* Review → Approve / Reject
* Approve → Toast “Data berhasil disetujui”
* Reject → Modal Alasan Penolakan
* Moderasi Lowongan → Detail Moderasi
* Approve Lowongan → Toast “Lowongan disetujui”
* Reject Lowongan → Modal Alasan Penolakan
* Monitoring Integrasi → Retry Sync
* Retry Sync → Toast “Sinkronisasi diulang”
* Audit Log → Detail Audit
* Model AI Performance → Detail Model
* User Management → Suspend User / Reset Password

## Data Dummy dan Filter Wilayah

Sesuaikan hanya data dummy dan filter wilayah agar memakai Pulau Jawa.

Gunakan contoh lokasi lowongan:

* Jakarta
* Bandung
* Yogyakarta
* Semarang
* Surabaya
* Malang
* Tangerang
* Bekasi

Gunakan contoh peluang lintas wilayah:

* Yogyakarta → Jakarta
* Bandung → Jakarta
* Semarang → Surabaya
* Malang → Surabaya
* Solo → Yogyakarta
* Bekasi → Jakarta

Gunakan contoh analytics:

* DKI Jakarta: demand tinggi
* Jawa Barat: supply talent tinggi
* DI Yogyakarta: kandidat teknologi berkembang
* Jawa Timur: demand manufaktur dan teknologi meningkat
* Jawa Tengah: skill gap data analytics meningkat
* Banten: demand industri dan digital operation meningkat

## Jangan Ubah

Jangan mengubah:

* desain landing page,
* teks branding utama,
* sidebar yang sudah aktif,
* layout dashboard,
* warna,
* font,
* card,
* komponen visual,
* struktur halaman yang sudah benar.

Hanya aktifkan:

* tombol,
* link,
* modal,
* toast,
* state,
* data dummy,
* filter wilayah,
* hubungan antar role.

## Setelah Selesai, Wajib Buat Laporan

Setelah menjalankan revisi ini, buat list:

1. Tombol apa saja yang sudah diaktifkan.
2. Flow Kandidat → Perusahaan apa saja yang sudah terhubung.
3. Flow Perusahaan → Kandidat apa saja yang sudah terhubung.
4. Flow Kandidat/Perusahaan → Pemerintah secara agregat apa saja yang sudah dibuat.
5. Flow Admin apa saja yang sudah aktif.
6. Data dummy dan filter Pulau Jawa apa saja yang sudah disesuaikan.
7. Route atau halaman apa saja yang sudah dicek.
8. Masalah apa saja yang masih tersisa jika ada.
