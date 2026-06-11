# Project Guidance for Codex

Project ini adalah RAVIRA, yaitu platform job matching dan recruitment ecosystem berbasis AI.

Sebelum membuat atau mengubah fitur, baca dokumen berikut:

* docs/PRD_LENTERA_v1.3.md

Gunakan istilah RAVIRA untuk nama produk.

Jangan menggunakan nama LENTERA pada UI, kode, komentar, database, atau dokumentasi baru.

## Fitur Utama

* Candidate onboarding
* Upload CV
* Skill extraction
* AI job matching
* Match score
* Skill gap advisor
* Training recommendation
* Application tracker
* Recruiter dashboard
* Candidate scoring
* Candidate leaderboard
* Stage selection
* Anti-fraud check
* Admin console

## Aturan Pengembangan

* Jangan membuat fitur di luar PRD tanpa konfirmasi.
* Ikuti struktur kebutuhan yang tertulis di PRD.
* Pisahkan fitur kandidat, HR/recruiter, dan admin.
* Pastikan fitur yang berkaitan dengan data kandidat mengikuti consent, privacy, dan audit log.
* Jangan menampilkan data sensitif kandidat tanpa izin yang sesuai.
* Jika membuat fitur AI scoring atau matching, tampilkan alasan rekomendasi secara jelas.
* Jika ada proses anti-fraud, kandidat tidak boleh ditolak otomatis tanpa manual review.
