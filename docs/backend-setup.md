# Ravira Backend Setup

Panduan ini untuk menjalankan backend MVP Ravira secara lokal dengan Node.js, Express, TypeScript, Prisma, dan PostgreSQL Supabase.

## Prasyarat

- Node.js 20 atau lebih baru.
- npm.
- Akses database PostgreSQL Supabase.
- File `.env` di root project.

## Install

Dari root project:

```bash
npm install
```

Di Windows PowerShell, jika `npm` terkena execution policy, gunakan:

```bash
npm.cmd install
```

## Environment

Buat file `.env` berdasarkan `.env.example`.

Minimal:

```env
DATABASE_URL="postgresql://postgres:<url-encoded-password>@<host>:5432/postgres?schema=public"
JWT_SECRET="replace-with-secure-secret"
JWT_EXPIRES_IN="7d"
BCRYPT_SALT_ROUNDS="10"
PORT="4000"
NODE_ENV="development"
CORS_ORIGIN="*"
```

Catatan:

- Jangan commit `.env`.
- Gunakan connection string Supabase PostgreSQL yang sesuai environment.
- Untuk Prisma 6, jangan tambahkan parameter `pgbouncer=true` ke `DATABASE_URL`.
- Jika password database berisi karakter khusus seperti `]`, `[`, `@`, `#`, `?`, `/`, atau spasi, encode password lebih dulu sebelum dimasukkan ke URL. Contoh: `]` menjadi `%5D`.
- `JWT_SECRET` wajib diisi sebelum server start.

## Prisma Validate

```bash
npx prisma validate
```

## Generate Prisma Client

```bash
npx prisma generate
```

## Migrate Supabase

Untuk menerapkan migration ke database Supabase:

```bash
npx prisma migrate deploy
```

Gunakan `migrate deploy` untuk environment shared/staging/production-like. Jangan memakai `migrate dev` ke database Supabase shared kecuali memang environment development pribadi.

## Seed (Khusus Environment Development)

Script `scripts/seed.js` dan `tests/e2e/seed-e2e.cjs` dilengkapi **Production Safety Guard (Fail-Closed)** yang wajib memverifikasi:
1. `NODE_ENV` berada pada `development`, `test`, atau `e2e` (menolak `production` / `staging`).
2. `DATABASE_URL` (dan `DIRECT_URL` bila ada) mengarah secara eksklusif ke project reference **Ravira-Development** (`rkftrtpcoymstbdtlfig`) serta menolak pola Production sebelum koneksi `PrismaClient` dibuat.
3. Kredensial default publik lama yang berisiko telah diblokir dan tidak pernah dicetak ke stdout.

```bash
npm run seed
```

Akun pengujian Development yang disinkronkan antara `npm run seed` dan `npm run seed:e2e`:

```text
seed-candidate@ravira.local   (Role: CANDIDATE)
seed-recruiter@ravira.local   (Role: RECRUITER - Company APPROVED)
seed-admin@ravira.local       (Role: ADMIN)
seed-superadmin@ravira.local  (Role: SUPER_ADMIN - khusus fixture Development)
```

Password akun Seed Development menggunakan nilai `SEED_PASSWORD` dari environment pengembangan Anda (atau password sintetis pengujian Development yang tersinkronisasi dengan `tests/e2e/seed-e2e.cjs`). Jangan pernah menggunakan password demo Production pada environment Development maupun Production.

## Cleanup Smoke

Cleanup smoke membersihkan data test dengan prefix `smoke-*` pada database Development (`rkftrtpcoymstbdtlfig`), dilindungi oleh safety gate fail-closed yang sama.

```bash
npm run cleanup:smoke
```

## Build

```bash
npm run build
```

## Run Dev & Isolated Development E2E Server

Untuk menjalankan server pengembangan biasa:

```bash
npm run dev
```

Untuk menjalankan backend yang terisolasi penuh pada `.env.e2e` (**Ravira-Development** `rkftrtpcoymstbdtlfig` + fail-closed port & runtime env check):

```bash
npm run build
npm run dev:e2e
```

Server default:

```text
http://localhost:4000
```

## Run Production Build Locally

```bash
npm run build
npm start
```

## Test Health Endpoint

Dengan curl:

```bash
curl http://localhost:4000/health
```

Expected response:

```json
{
  "success": true,
  "message": "Ravira backend is running.",
  "data": {
    "service": "ravira-backend",
    "environment": "development"
  }
}
```

## Recommended Handoff Verification

Jalankan urutan ini sebelum handoff:

```bash
npx prisma validate
npx prisma generate
npm run build
npx prisma migrate deploy
npm run cleanup:smoke
npm run seed
```

Lanjutkan dengan smoke test core flow:

- Register/login candidate.
- Register/login recruiter atau pakai seed recruiter.
- Candidate update profile dan skill.
- CV upload/parser.
- Generate skill gap dan training recommendation.
- Start/update/complete training progress.
- Candidate apply published job.
- Recruiter update application stage.
- Candidate dilarang mengakses Candidate Score.
- Recruiter hanya melihat Candidate Score application company sendiri.
- Notification center menampilkan pesan aman.
- Appeal create dan admin decision.
- Admin fraud case list/decision.

## Operational Notes

- Candidate Score hanya untuk recruiter/admin/super admin.
- Candidate response tidak boleh menampilkan Candidate Score.
- Recruiter data access wajib scoped ke company miliknya.
- Candidate data access wajib scoped ke user login.
- Admin endpoint wajib memakai role `ADMIN` atau `SUPER_ADMIN`.
- Jangan expose raw CV file path atau raw fraud evidence ke frontend.
