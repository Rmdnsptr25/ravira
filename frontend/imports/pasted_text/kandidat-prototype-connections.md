Buat sesuai perintah di bawah ini, jangan merubah desain yang lain yang tidak disuruh.

Pada role Kandidat Ravira, halaman dan sidebar sudah cukup lengkap. Sekarang fokus hanya pada mengaktifkan semua tombol, link, card, dan menu yang belum bisa diklik agar prototype berjalan sesuai alur sistem.

Jangan membuat ulang halaman kandidat dari awal. Jangan mengubah warna, font, layout, card, sidebar, dashboard, atau desain utama yang sudah ada. Fokus hanya pada prototype connection, modal, toast, dan perpindahan halaman.

Gunakan Bahasa Indonesia untuk semua teks UI.

## Tujuan

Aktifkan seluruh tombol pada halaman kandidat agar saling terhubung:

Dashboard Kandidat → Rekomendasi Pekerjaan → Detail Pekerjaan → Lamar / Simpan → Lamaran Saya / Lowongan Tersimpan

## 1. Aktifkan Menu Sidebar Kandidat

Pastikan semua menu sidebar kandidat bisa diklik:

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

Jangan ubah tampilan sidebar. Hanya aktifkan link-nya.

## 2. Aktifkan Tombol di Dashboard Kandidat

Pada Dashboard Kandidat, aktifkan tombol berikut:

* “Lihat Semua” pada Rekomendasi Pekerjaan → `/dashboard/kandidat/rekomendasi`
* “Lihat Detail” pada job card → `/dashboard/kandidat/detail-pekerjaan`
* “Lamar” pada job card → Modal Konfirmasi Lamaran
* “Detail” pada Skill Gap Report → `/dashboard/kandidat/skill-gap`
* Card “Progress Pelatihan” → `/dashboard/kandidat/pelatihan`
* Card “Lamaran Aktif” → `/dashboard/kandidat/lamaran`
* Card “Rekomendasi Pekerjaan” → `/dashboard/kandidat/rekomendasi`
* Card “Skill Gap Utama” → `/dashboard/kandidat/skill-gap`

## 3. Aktifkan Tombol di Halaman Rekomendasi Pekerjaan

Pada halaman Rekomendasi Pekerjaan, aktifkan:

* Search bar → bisa digunakan untuk mencari posisi/perusahaan secara visual
* Filter lokasi → buka dropdown/filter state
* Filter tipe kerja → buka dropdown/filter state
* Filter range gaji → buka dropdown/filter state
* Filter industri → buka dropdown/filter state
* Sort by match score → buka dropdown/filter state
* “Lihat Detail” → `/dashboard/kandidat/detail-pekerjaan`
* “Simpan” → Toast “Lowongan berhasil disimpan”
* Setelah klik “Simpan”, tombol berubah menjadi “Tersimpan”
* “Tersimpan” → `/dashboard/kandidat/tersimpan`
* “Lamar” → Modal Konfirmasi Lamaran

## 4. Aktifkan Tombol di Detail Pekerjaan

Pada halaman Detail Pekerjaan, aktifkan:

* “Kembali ke Dashboard” → `/dashboard/kandidat`
* “Simpan” → Toast “Lowongan berhasil disimpan”
* Setelah klik “Simpan”, tombol berubah menjadi “Tersimpan”
* “Tersimpan” → `/dashboard/kandidat/tersimpan`
* “Lamar Sekarang” → Modal Konfirmasi Lamaran
* Card rekomendasi pelatihan → `/dashboard/kandidat/pelatihan`
* Skill yang masih kurang → `/dashboard/kandidat/skill-gap`

## 5. Buat dan Hubungkan Modal Lamaran

Ketika kandidat klik “Lamar” atau “Lamar Sekarang”, tampilkan modal:

Judul:
“Kirim Lamaran?”

Isi:
“Profil dan CV Anda akan dikirim ke perusahaan sesuai consent yang Anda berikan.”

Tombol:

* “Batal”
* “Kirim Lamaran”

Prototype:

* “Batal” → kembali ke halaman asal
* “Kirim Lamaran” → Modal Lamaran Berhasil

Modal sukses:

Judul:
“Lamaran Berhasil Dikirim”

Isi:
“Anda dapat memantau status lamaran melalui menu Lamaran Saya.”

Tombol:
“Lihat Lamaran Saya”

Prototype:

* “Lihat Lamaran Saya” → `/dashboard/kandidat/lamaran`

## 6. Aktifkan Tombol di Lowongan Tersimpan

Pada halaman Lowongan Tersimpan, aktifkan:

* “Lihat Detail” → `/dashboard/kandidat/detail-pekerjaan`
* “Lamar Sekarang” → Modal Konfirmasi Lamaran
* “Hapus dari Tersimpan” → Toast “Lowongan dihapus dari daftar tersimpan”
* Search dan filter → tampilkan state dropdown/filter

Jika daftar kosong, tampilkan empty state:
“Belum ada lowongan yang disimpan.”

## 7. Aktifkan Tombol di Skill Gap

Pada halaman Skill Gap, aktifkan:

* “Lihat Rekomendasi Pelatihan” → `/dashboard/kandidat/pelatihan`
* “Ubah Target Karier” → Modal Ubah Target Karier
* Skill card yang diklik → tampilkan detail skill / rekomendasi belajar
* Roadmap karier item → tampilkan state detail milestone

## 8. Aktifkan Tombol di Pelatihan

Pada halaman Pelatihan, aktifkan:

* “Lihat Detail” pada course card → `/dashboard/kandidat/detail-kursus`
* “Mulai Belajar” → `/dashboard/kandidat/detail-kursus`
* Filter skill target → buka dropdown/filter state
* Filter platform → buka dropdown/filter state
* Filter gratis/berbayar → buka dropdown/filter state

Pada Detail Kursus, aktifkan:

* “Mulai Kursus” atau “Lanjutkan Kursus” → Toast “Progress belajar diperbarui”
* “Kembali ke Pelatihan” → `/dashboard/kandidat/pelatihan`
* Setelah kursus selesai, tampilkan state:
  “Kursus selesai. Skill profile Anda berhasil diperbarui.”

## 9. Aktifkan Tombol di Lamaran Saya

Pada halaman Lamaran Saya, aktifkan:

* Tab “Semua”
* Tab “Dikirim”
* Tab “Screening”
* Tab “Interview”
* Tab “Offer”
* Tab “Ditolak”
* “Lihat Status” → `/dashboard/kandidat/detail-lamaran`

Pada Detail Status Lamaran, aktifkan:

* “Kembali ke Lamaran Saya” → `/dashboard/kandidat/lamaran`
* “Tarik Lamaran” → Modal Konfirmasi Tarik Lamaran
* “Hubungi Recruiter” → Modal Hubungi Recruiter

## 10. Aktifkan Tombol di Peluang Lintas Wilayah

Pada halaman Peluang Lintas Wilayah, aktifkan:

* Filter kota tujuan → buka dropdown/filter state
* Filter provinsi → buka dropdown/filter state
* Filter tipe kerja → buka dropdown/filter state
* “Lihat Peluang” → `/dashboard/kandidat/detail-cross-region`
* “Tandai Tertarik” → Toast “Peluang berhasil ditandai”
* “Lamar Sekarang” → Modal Konfirmasi Lamaran

Pada Detail Peluang Lintas Wilayah, aktifkan:

* “Lamar Sekarang” → Modal Konfirmasi Lamaran
* “Tandai Tertarik” → Toast “Peluang berhasil ditandai”
* “Kembali” → `/dashboard/kandidat/cross-region`

## 11. Aktifkan Tombol di Profil Saya

Pada halaman Profil Saya, aktifkan:

* “Edit Profil” → mode edit profil / modal edit profil
* “Upload CV Baru” → state upload CV
* “Simpan Perubahan” → Toast “Profil berhasil diperbarui”
* “Batal” → kembali ke mode tampilan profil

## 12. Aktifkan Tombol di Pengaturan Privasi

Pada halaman Pengaturan Privasi, aktifkan:

* Toggle visibilitas profil
* Toggle consent rekomendasi AI
* Toggle consent analisis CV
* Toggle consent analytics agregat anonim
* “Cabut Izin” → Modal Konfirmasi Cabut Izin
* “Download Data Saya” → Toast “Data Anda sedang disiapkan”
* “Hapus Akun” → Modal Konfirmasi Hapus Akun

Tambahkan teks:
“Profil Anda tidak akan dibagikan ke perusahaan tanpa izin eksplisit dari Anda.”

## 13. Hubungkan Lamaran ke Recruiter

Setelah kandidat berhasil mengirim lamaran:

* Tambahkan kandidat “Budi Santoso” ke daftar pelamar pada role Recruiter.
* Di Dashboard Recruiter / Lihat Pelamar, card kandidat harus bisa dibuka.
* Klik “Lihat Profil” atau klik nama kandidat → Profil Kandidat untuk Recruiter.
* Status awal kandidat di recruiter: “Pelamar Baru”.
* Status awal di Lamaran Saya kandidat: “Dikirim”.

## 14. Catatan Penting

* Jangan membuat ulang halaman kandidat.
* Jangan mengubah desain utama.
* Jangan menghapus frame existing.
* Jangan mengganti warna, font, layout, sidebar, atau card.
* Fokus hanya pada tombol, link, modal, toast, state, dan prototype connection.
* Semua tombol yang terlihat harus memiliki tujuan klik.
* Semua alur kandidat harus bisa diuji dari dashboard sampai lamaran berhasil.
* Jika ada tombol yang belum punya halaman tujuan, arahkan ke halaman terdekat yang sesuai atau buat modal/placeholder kecil tanpa merombak desain.

## 15. Setelah Selesai, Jelaskan yang Sudah Dibuat

Setelah menjalankan perintah ini, berikan ringkasan:

1. Tombol apa saja yang sudah diaktifkan.
2. Halaman apa saja yang sudah dihubungkan.
3. Modal atau toast apa saja yang ditambahkan.
4. Alur kandidat mana saja yang sudah bisa diuji.
5. Jika ada tombol yang masih belum aktif, sebutkan alasannya.
