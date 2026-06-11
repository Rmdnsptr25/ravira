Buat sesuai perintah di bawah ini, jangan merubah desain yang lain yang tidak disuruh.

Perbaiki bagian sidebar kandidat dan alur kandidat pada desain UI/UX Ravira yang sudah ada. Jangan membuat ulang halaman dari awal. Jangan mengubah warna, font, card, layout utama, dashboard, navbar, dan style visual yang sudah ada. Fokus hanya pada menambahkan sidebar kandidat, menghubungkan tombol kandidat, membuat halaman tujuan yang belum ada, dan memastikan aksi kandidat terhubung ke role perusahaan/recruiter.

Gunakan Bahasa Indonesia untuk semua teks UI.

## 1. Tambahkan Sidebar Kandidat

Tambahkan sidebar permanen di sisi kiri untuk semua halaman kandidat pada versi desktop.

Sidebar kandidat harus berisi menu:

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

Aturan sidebar:

* Gunakan background dark navy sesuai style Ravira.
* Gunakan icon modern yang konsisten.
* Jangan tampilkan nama icon sebagai teks.
* Tampilkan hanya icon dan label menu.
* Menu aktif diberi highlight cyan atau electric blue.
* Tambahkan avatar kecil, nama “Budi Santoso”, dan role “Kandidat”.
* Tambahkan tombol Logout di bagian bawah sidebar.
* Geser konten utama ke kanan agar sidebar tidak menutupi dashboard.
* Untuk mobile, sidebar berubah menjadi drawer dengan tombol hamburger.

## 2. Hubungkan Menu Sidebar Kandidat

Buat semua menu sidebar bisa diklik:

* Beranda → Dashboard Kandidat
* Rekomendasi Pekerjaan → Halaman Rekomendasi Pekerjaan
* Lowongan Tersimpan → Halaman Lowongan Tersimpan
* Skill Gap → Halaman Skill Gap Report
* Pelatihan → Halaman Rekomendasi Pelatihan
* Lamaran Saya → Halaman Lamaran Saya
* Peluang Lintas Wilayah → Halaman Peluang Lintas Wilayah
* Profil Saya → Halaman Profil Saya
* Pengaturan Privasi → Halaman Pengaturan Privasi
* Logout → Halaman Login

Terapkan sidebar yang sama pada semua halaman kandidat:

1. Dashboard Kandidat
2. Detail Pekerjaan
3. Rekomendasi Pekerjaan
4. Lowongan Tersimpan
5. Skill Gap Report
6. Rekomendasi Pelatihan
7. Detail Kursus
8. Lamaran Saya
9. Detail Status Lamaran
10. Peluang Lintas Wilayah
11. Detail Peluang Lintas Wilayah
12. Profil Saya
13. Pengaturan Privasi

Jika halaman belum ada, buat frame sederhana dengan style Ravira yang sama.

## 3. Aktifkan Tombol pada Dashboard Kandidat

Pada Dashboard Kandidat, pastikan tombol berikut bisa diklik:

* “Lihat Semua” pada Rekomendasi Pekerjaan → Halaman Rekomendasi Pekerjaan
* “Lihat Detail” pada job card → Detail Pekerjaan
* “Lamar” pada job card → Modal Konfirmasi Lamaran
* “Detail” pada Skill Gap Report → Halaman Skill Gap Report
* Card Progress Pelatihan → Halaman Rekomendasi Pelatihan
* Card Lamaran Aktif → Halaman Lamaran Saya

## 4. Buat Halaman Rekomendasi Pekerjaan

Buat halaman “Rekomendasi Pekerjaan”.

Isi halaman:

* Sidebar kandidat yang sama.
* Header: “Rekomendasi Pekerjaan”
* Subjudul: “Pekerjaan berikut dipilih berdasarkan skill, pengalaman, lokasi, dan preferensi karier Anda.”
* Search bar.
* Filter lokasi.
* Filter tipe kerja.
* Filter range gaji.
* Filter industri.
* Sort by match score.

Job card berisi:

* Nama posisi
* Nama perusahaan
* Lokasi
* Tipe kerja
* Range gaji
* Match score
* Alasan rekomendasi AI
* Skill yang cocok
* Skill yang masih kurang
* Tombol “Lihat Detail”
* Tombol “Simpan”
* Tombol “Lamar”

Prototype:

* Lihat Detail → Detail Pekerjaan
* Simpan → Toast “Lowongan berhasil disimpan”
* Lamar → Modal Konfirmasi Lamaran

## 5. Buat Halaman Lowongan Tersimpan

Tambahkan halaman “Lowongan Tersimpan”.

Isi halaman:

* Sidebar kandidat yang sama.
* Header: “Lowongan Tersimpan”
* Subjudul: “Daftar pekerjaan yang sudah Anda simpan untuk dilamar nanti.”
* Search bar.
* Filter lokasi.
* Filter tipe kerja.
* Filter match score.

Job card berisi:

* Nama posisi
* Nama perusahaan
* Lokasi
* Tipe kerja
* Range gaji
* Match score
* Skill yang cocok
* Tombol “Lihat Detail”
* Tombol “Lamar Sekarang”
* Tombol “Hapus dari Tersimpan”

Prototype:

* Lihat Detail → Detail Pekerjaan
* Lamar Sekarang → Modal Konfirmasi Lamaran
* Hapus dari Tersimpan → Toast “Lowongan dihapus dari daftar tersimpan”

Jika belum ada data, tampilkan empty state:

“Belum ada lowongan yang disimpan.”

## 6. Aktifkan Tombol Simpan di Detail Pekerjaan

Pada halaman Detail Pekerjaan:

* Tombol “Simpan” → Toast “Lowongan berhasil disimpan”
* Setelah diklik, tombol berubah menjadi “Tersimpan”
* Tombol “Tersimpan” → Halaman Lowongan Tersimpan

Jangan ubah layout besar halaman detail pekerjaan. Cukup aktifkan tombol, tambahkan toast, dan hubungkan ke halaman Lowongan Tersimpan.

## 7. Aktifkan Tombol Lamar Sekarang

Pada halaman Detail Pekerjaan:

* Tombol “Lamar Sekarang” → Modal Konfirmasi Lamaran

Buat Modal Konfirmasi Lamaran:

Judul:
“Kirim Lamaran?”

Isi:
“Profil dan CV Anda akan dikirim ke perusahaan sesuai consent yang Anda berikan.”

Tombol:

* Batal
* Kirim Lamaran

Prototype:

* Batal → kembali ke Detail Pekerjaan
* Kirim Lamaran → Modal Lamaran Berhasil

Buat Modal Lamaran Berhasil:

Judul:
“Lamaran Berhasil Dikirim”

Isi:
“Anda dapat memantau status lamaran melalui menu Lamaran Saya.”

Tombol:
“Lihat Lamaran Saya”

Prototype:

* Lihat Lamaran Saya → Halaman Lamaran Saya

## 8. Buat Halaman Lamaran Saya

Buat halaman “Lamaran Saya”.

Isi halaman:

* Sidebar kandidat yang sama.
* Header: “Lamaran Saya”
* Subjudul: “Pantau status semua lamaran kerja Anda dalam satu tempat.”
* Tabs:

  * Semua
  * Dikirim
  * Screening
  * Interview
  * Offer
  * Ditolak

Application card berisi:

* Nama posisi
* Nama perusahaan
* Lokasi
* Tanggal melamar
* Status terbaru
* Match score
* Timeline status
* Tombol “Lihat Status”

Contoh data setelah kandidat melamar:

* Posisi: Senior UX Designer
* Perusahaan: Tokopedia
* Status: Dikirim
* Match Score: 94%

Prototype:

* Lihat Status → Halaman Detail Status Lamaran

## 9. Buat Detail Status Lamaran

Buat halaman “Detail Status Lamaran”.

Isi halaman:

* Sidebar kandidat yang sama.
* Nama posisi
* Nama perusahaan
* Status lamaran
* Tanggal melamar
* Timeline proses seleksi:

  * Lamaran Dikirim
  * Screening
  * Interview
  * Offer
  * Diterima / Ditolak
* Catatan recruiter jika ada
* Jadwal interview jika ada
* Tombol “Tarik Lamaran”
* Tombol “Kembali ke Lamaran Saya”

Prototype:

* Kembali ke Lamaran Saya → Halaman Lamaran Saya
* Tarik Lamaran → Modal Konfirmasi Tarik Lamaran

## 10. Hubungkan Aksi Kandidat ke Dashboard Recruiter

Pastikan aksi kandidat terhubung ke role perusahaan/recruiter.

Alur:

Kandidat klik “Lamar Sekarang”
→ Modal Konfirmasi Lamaran
→ Klik “Kirim Lamaran”
→ Lamaran masuk ke “Lamaran Saya” kandidat
→ Lamaran juga muncul di Dashboard Recruiter / Lowongan Aktif / Lihat Pelamar.

Pada Dashboard Recruiter atau halaman Lihat Pelamar, tambahkan card pelamar baru:

* Nama: Budi Santoso
* Posisi dilamar: Senior UX Designer
* Perusahaan: Tokopedia
* Match Score: 94%
* Status: Pelamar Baru
* Skill cocok: Figma, User Research, UI Design, Prototyping
* Skill kurang: Design System Advanced, Usability Testing Formal
* Tombol “Lihat Profil”
* Tombol “Masukkan ke Pipeline”
* Tombol “Jadwalkan Interview”

Prototype:

* Lihat Profil → Profil Kandidat untuk Recruiter
* Masukkan ke Pipeline → Pipeline Rekrutmen
* Jadwalkan Interview → Modal Jadwal Interview

## 11. Perbaiki Profil Kandidat untuk Recruiter

Profil kandidat / pelamar harus bisa dibuka dari role recruiter.

Pada Dashboard Recruiter, Lowongan Aktif, Lihat Pelamar, dan Pipeline:

* Klik card kandidat → Profil Kandidat untuk Recruiter
* Klik nama kandidat → Profil Kandidat untuk Recruiter
* Klik “Lihat Profil” → Profil Kandidat untuk Recruiter

Jika halaman profil sudah ada, jangan buat ulang. Cukup hubungkan tombolnya.

Jika belum ada, buat halaman “Profil Kandidat untuk Recruiter”.

Isi halaman:

* Sidebar recruiter.
* Nama kandidat.
* Lokasi.
* Ringkasan profil.
* Pendidikan.
* Pengalaman kerja.
* Skill utama.
* Portfolio / LinkedIn.
* CV.
* Match score terhadap posisi.
* Skill yang cocok.
* Skill gap.
* Riwayat pelatihan.
* Preferensi kerja.
* Status relokasi.
* Label consent:
  “Profil ini dapat dilihat karena kandidat memberikan izin.”
* Tombol “Hubungi Kandidat”
* Tombol “Masukkan ke Pipeline”
* Tombol “Jadwalkan Interview”

Prototype:

* Masukkan ke Pipeline → Pipeline Rekrutmen
* Jadwalkan Interview → Modal Jadwal Interview
* Hubungi Kandidat → Modal Hubungi Kandidat

## 12. Hubungkan Update Pipeline ke Lamaran Kandidat

Pada Pipeline Rekrutmen recruiter, buat kolom:

* Applied
* Screening
* Interview
* Offer
* Hired
* Rejected

Jika recruiter memindahkan kandidat ke:

* Screening → status di Lamaran Saya kandidat menjadi “Screening”
* Interview → status di Lamaran Saya kandidat menjadi “Interview”
* Offer → status di Lamaran Saya kandidat menjadi “Offer”
* Hired → status di Lamaran Saya kandidat menjadi “Diterima”
* Rejected → status di Lamaran Saya kandidat menjadi “Ditolak”

Tambahkan di halaman Detail Status Lamaran kandidat:

* Status terbaru
* Update terakhir
* Catatan recruiter jika ada
* Jadwal interview jika ada

## 13. Hubungkan Jadwal Interview

Pada recruiter:

* Tombol “Jadwalkan Interview” → Modal Jadwal Interview

Isi modal:

* Nama kandidat
* Posisi
* Tanggal interview
* Jam interview
* Metode: Online / Offline
* Link meeting
* Catatan recruiter
* Tombol “Simpan Jadwal”

Prototype:

* Simpan Jadwal → Toast “Jadwal interview berhasil dibuat”
* Status kandidat berubah menjadi “Interview”
* Jadwal interview muncul di halaman Detail Status Lamaran kandidat

Pada kandidat, halaman Detail Status Lamaran harus menampilkan:

* Jadwal interview
* Tanggal
* Jam
* Metode
* Link meeting
* Catatan recruiter

## 14. Pengaturan Privasi dan Consent Kandidat

Pastikan halaman Pengaturan Privasi memiliki isi:

* Status visibilitas profil
* Consent rekomendasi AI
* Consent analisis CV
* Consent analytics agregat anonim
* Daftar perusahaan yang dapat melihat profil
* Tombol “Cabut Izin”
* Tombol “Download Data Saya”
* Tombol “Hapus Akun”

Tambahkan teks:

“Profil Anda tidak akan dibagikan ke perusahaan tanpa izin eksplisit dari Anda.”

Jika recruiter mencoba membuka profil tanpa izin kandidat, tampilkan state:

Judul:
“Akses Profil Dibatasi”

Isi:
“Kandidat belum memberikan consent untuk membuka profil lengkap.”

Tombol:
“Minta Akses Profil”

## 15. Catatan Penting

* Jangan membuat ulang landing page.
* Jangan membuat ulang dashboard yang sudah ada.
* Jangan mengubah desain utama.
* Jangan menghapus frame existing.
* Jangan mengganti warna, font, card, atau layout.
* Fokus hanya pada sidebar kandidat, tombol Simpan, tombol Lamar, Lowongan Tersimpan, Lamaran Saya, Detail Status Lamaran, Profil Pelamar, dan alur kandidat yang terhubung ke recruiter.
* Semua tombol yang terlihat harus memiliki tujuan prototype.
* Semua halaman kandidat harus memakai sidebar kandidat.
* Semua halaman recruiter tetap memakai sidebar recruiter.
* Gunakan style visual yang sama dengan desain Ravira yang sudah ada.
* Pastikan hasilnya simple, rapi, dan langsung bisa dipakai sebagai prototype.
