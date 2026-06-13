Buat sesuai perintah di bawah ini, jangan merubah desain yang lain yang tidak disuruh.

Perbaiki masalah sidebar pada seluruh role di website Ravira. Sidebar sudah ada di canvas desain Figma, tetapi tidak selalu muncul di live preview atau route halaman. Jangan membuat ulang desain dari awal. Jangan mengubah warna, font, card, dashboard, isi halaman, atau style visual yang sudah benar. Fokus hanya pada menerapkan sidebar sebagai layout utama untuk semua role, memastikan sidebar muncul di live preview, dan memastikan semua menu sidebar bisa diklik.

Gunakan Bahasa Indonesia untuk semua teks UI.

## Masalah Utama

Sidebar pada beberapa role tidak muncul di live preview, walaupun sudah terlihat di canvas desain. Ini berarti sidebar belum diterapkan sebagai layout utama pada route halaman.

Perbaiki agar sidebar tidak hanya menjadi objek visual, tetapi benar-benar menjadi bagian dari layout setiap dashboard role.

## Buat Layout untuk Setiap Role

Buat dan terapkan 4 layout utama:

1. `CandidateDashboardLayout`
2. `RecruiterDashboardLayout`
3. `AnalyticsDashboardLayout`
4. `AdminDashboardLayout`

Setiap layout harus berisi:

* Sidebar permanen di sisi kiri pada desktop
* Header user di kanan atas
* Main content di kanan sidebar
* Menu sidebar sesuai role
* Active state pada menu yang sedang dibuka
* Route navigation untuk setiap menu
* Mobile drawer untuk tampilan mobile

## Aturan Umum Sidebar Semua Role

Terapkan aturan ini ke semua sidebar:

* Sidebar harus benar-benar muncul di live preview.
* Sidebar berada permanen di kiri pada desktop.
* Sidebar memiliki lebar sekitar 250–280px.
* Sidebar tinggi penuh layar.
* Gunakan background dark navy sesuai style Ravira.
* Gunakan icon modern yang konsisten.
* Jangan tampilkan nama icon sebagai teks.
* Tampilkan hanya icon visual dan label menu.
* Menu aktif diberi highlight cyan atau electric blue.
* Konten utama harus bergeser ke kanan agar tidak tertutup sidebar.
* Tambahkan user profile kecil di bagian bawah sidebar.
* Tambahkan tombol Logout di bagian bawah.
* Pada mobile, sidebar berubah menjadi drawer dengan hamburger button.
* Jangan hanya membuat sidebar di canvas desain. Terapkan sidebar ke route live preview.

## 1. Sidebar Kandidat

Terapkan `CandidateDashboardLayout` ke semua route kandidat:

* `/dashboard/kandidat`
* `/dashboard/kandidat/rekomendasi`
* `/dashboard/kandidat/tersimpan`
* `/dashboard/kandidat/skill-gap`
* `/dashboard/kandidat/pelatihan`
* `/dashboard/kandidat/lamaran`
* `/dashboard/kandidat/cross-region`
* `/dashboard/kandidat/profil`
* `/dashboard/kandidat/privasi`
* `/dashboard/kandidat/detail-pekerjaan`
* `/dashboard/kandidat/detail-kursus`
* `/dashboard/kandidat/detail-lamaran`

Menu sidebar kandidat:

1. Beranda
2. Rekomendasi Pekerjaan
3. Lowongan Tersimpan
4. Skill Gap
5. Pelatihan
6. Lamaran Saya
7. Peluang Lintas Wilayah
8. Profil Saya
9. Pengaturan Privasi
10. Logout

Link menu kandidat:

* Beranda → `/dashboard/kandidat`
* Rekomendasi Pekerjaan → `/dashboard/kandidat/rekomendasi`
* Lowongan Tersimpan → `/dashboard/kandidat/tersimpan`
* Skill Gap → `/dashboard/kandidat/skill-gap`
* Pelatihan → `/dashboard/kandidat/pelatihan`
* Lamaran Saya → `/dashboard/kandidat/lamaran`
* Peluang Lintas Wilayah → `/dashboard/kandidat/cross-region`
* Profil Saya → `/dashboard/kandidat/profil`
* Pengaturan Privasi → `/dashboard/kandidat/privasi`
* Logout → `/masuk`

Profil sidebar kandidat:

* Nama: Budi Santoso
* Role: Kandidat

## 2. Sidebar Perusahaan / Recruiter

Terapkan `RecruiterDashboardLayout` ke semua route recruiter:

* `/dashboard/perusahaan`
* `/dashboard/perusahaan/pipeline`
* `/dashboard/perusahaan/lowongan`
* `/dashboard/perusahaan/buat-lowongan`
* `/dashboard/perusahaan/shortlist`
* `/dashboard/perusahaan/analitik`
* `/dashboard/perusahaan/integrasi-ats`
* `/dashboard/perusahaan/profil`
* `/dashboard/perusahaan/pengaturan`
* `/dashboard/perusahaan/kandidat`
* `/dashboard/perusahaan/detail-kandidat`

Menu sidebar recruiter:

1. Dashboard
2. Kandidat Pipeline
3. Lowongan Aktif
4. Buat Lowongan
5. Shortlist Kandidat
6. Analitik Rekrutmen
7. Integrasi ATS
8. Profil Perusahaan
9. Pengaturan
10. Logout

Link menu recruiter:

* Dashboard → `/dashboard/perusahaan`
* Kandidat Pipeline → `/dashboard/perusahaan/pipeline`
* Lowongan Aktif → `/dashboard/perusahaan/lowongan`
* Buat Lowongan → `/dashboard/perusahaan/buat-lowongan`
* Shortlist Kandidat → `/dashboard/perusahaan/shortlist`
* Analitik Rekrutmen → `/dashboard/perusahaan/analitik`
* Integrasi ATS → `/dashboard/perusahaan/integrasi-ats`
* Profil Perusahaan → `/dashboard/perusahaan/profil`
* Pengaturan → `/dashboard/perusahaan/pengaturan`
* Logout → `/masuk`

Profil sidebar recruiter:

* Nama: HR Tokopedia
* Role: Recruiter

Pastikan tombol berikut juga aktif:

* Klik card kandidat → `/dashboard/perusahaan/detail-kandidat`
* Klik nama kandidat → `/dashboard/perusahaan/detail-kandidat`
* Klik “Lihat Profil” → `/dashboard/perusahaan/detail-kandidat`
* Klik “Masukkan Pipeline” → `/dashboard/perusahaan/pipeline`
* Klik “Jadwalkan Interview” → Modal Jadwal Interview

## 3. Sidebar Pemerintah / Institusi

Terapkan `AnalyticsDashboardLayout` ke semua route pemerintah / institusi:

* `/dashboard/analytics`
* `/dashboard/analytics/workforce`
* `/dashboard/analytics/heatmap`
* `/dashboard/analytics/tren-skill`
* `/dashboard/analytics/proyeksi`
* `/dashboard/analytics/rekomendasi-program`
* `/dashboard/analytics/laporan`
* `/dashboard/analytics/pengaturan`
* `/dashboard/analytics/detail-wilayah`

Menu sidebar pemerintah / institusi:

1. Ringkasan
2. Analitik Workforce
3. Heatmap Regional
4. Tren Skill
5. Proyeksi Kompetensi
6. Rekomendasi Program Pelatihan
7. Laporan & Ekspor
8. Pengaturan
9. Logout

Link menu pemerintah / institusi:

* Ringkasan → `/dashboard/analytics`
* Analitik Workforce → `/dashboard/analytics/workforce`
* Heatmap Regional → `/dashboard/analytics/heatmap`
* Tren Skill → `/dashboard/analytics/tren-skill`
* Proyeksi Kompetensi → `/dashboard/analytics/proyeksi`
* Rekomendasi Program Pelatihan → `/dashboard/analytics/rekomendasi-program`
* Laporan & Ekspor → `/dashboard/analytics/laporan`
* Pengaturan → `/dashboard/analytics/pengaturan`
* Logout → `/masuk`

Profil sidebar pemerintah / institusi:

* Nama: Dinas Tenaga Kerja
* Role: Pemerintah / Institusi

Tambahkan catatan pada halaman analytics:

“Data yang ditampilkan bersifat agregat dan anonim.”

Pastikan tombol berikut aktif:

* Export Laporan → Modal Export Laporan
* Buat Rekomendasi Program Pelatihan → `/dashboard/analytics/rekomendasi-program`
* Klik wilayah pada heatmap → `/dashboard/analytics/detail-wilayah`

## 4. Sidebar Admin Internal Ravira

Terapkan `AdminDashboardLayout` ke semua route admin:

* `/dashboard/admin`
* `/dashboard/admin/verifikasi-perusahaan`
* `/dashboard/admin/moderasi-lowongan`
* `/dashboard/admin/laporan-abuse`
* `/dashboard/admin/monitoring-integrasi`
* `/dashboard/admin/audit-log`
* `/dashboard/admin/model-ai`
* `/dashboard/admin/user-management`
* `/dashboard/admin/pengaturan`

Menu sidebar admin:

1. Overview
2. Verifikasi Perusahaan
3. Moderasi Lowongan
4. Laporan Abuse
5. Monitoring Integrasi
6. Audit Log
7. Model AI Performance
8. User Management
9. Pengaturan Sistem
10. Logout

Link menu admin:

* Overview → `/dashboard/admin`
* Verifikasi Perusahaan → `/dashboard/admin/verifikasi-perusahaan`
* Moderasi Lowongan → `/dashboard/admin/moderasi-lowongan`
* Laporan Abuse → `/dashboard/admin/laporan-abuse`
* Monitoring Integrasi → `/dashboard/admin/monitoring-integrasi`
* Audit Log → `/dashboard/admin/audit-log`
* Model AI Performance → `/dashboard/admin/model-ai`
* User Management → `/dashboard/admin/user-management`
* Pengaturan Sistem → `/dashboard/admin/pengaturan`
* Logout → `/masuk`

Profil sidebar admin:

* Nama: Admin Ravira
* Role: Admin Internal

Pastikan tombol berikut aktif:

* Approve → Toast “Data berhasil disetujui”
* Reject → Modal alasan penolakan
* Review → Detail data
* Retry Sync → Toast “Sinkronisasi diulang”
* Suspend User → Modal konfirmasi suspend

## Header untuk Semua Dashboard

Pada semua dashboard role, header kanan atas harus tetap ada:

* Icon notifikasi
* Avatar user
* Nama user
* Role user
* Dropdown akun

Header tidak boleh menutupi sidebar.

## Mobile Behavior untuk Semua Role

Pada mobile:

* Sidebar berubah menjadi drawer.
* Tambahkan hamburger button di header.
* Klik hamburger membuka sidebar.
* Tambahkan tombol close.
* Menu tetap sama sesuai role.
* Konten utama menjadi satu kolom.
* Sidebar tidak boleh menutupi konten secara permanen.

## Perbaiki Layout Main Content

Untuk semua role:

* Konten utama harus memiliki margin-left sesuai lebar sidebar pada desktop.
* Jangan ada area kosong aneh di kiri.
* Jangan sampai sidebar menimpa card dashboard.
* Jangan sampai header menimpa sidebar.
* Pastikan live preview memperlihatkan sidebar di semua route dashboard.

## Jika Halaman Route Belum Ada

Jika ada route menu sidebar yang belum memiliki halaman, buat halaman sederhana dengan:

* Layout sesuai role
* Sidebar sesuai role
* Header halaman
* Card placeholder
* Teks “Halaman ini akan menampilkan data [nama fitur]”
* Tombol kembali ke dashboard role

Jangan membuat halaman kosong tanpa sidebar.

## Catatan Penting

* Jangan membuat ulang landing page.
* Jangan membuat ulang dashboard yang sudah benar.
* Jangan mengubah warna, font, card, atau komponen visual utama.
* Jangan menghapus frame existing.
* Fokus hanya pada sidebar layout semua role dan navigasi route.
* Sidebar harus muncul di live preview, bukan hanya di canvas desain.
* Semua menu sidebar harus bisa diklik.
* Semua role harus punya sidebar masing-masing.
* Terapkan layout ke actual app routes, bukan hanya design frame.
