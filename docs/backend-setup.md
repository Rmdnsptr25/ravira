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

## Seed

Seed membuat user dasar, approved company, published jobs, dummy courses, dan contoh low-risk fraud case.

```bash
npm run seed
```

Default seed login:

```text
seed-admin@ravira.local
seed-candidate@ravira.local
seed-recruiter@ravira.local
Password123!
```

## Cleanup Smoke

Cleanup smoke membersihkan data test dengan prefix `smoke-*`, termasuk user, candidate, application, CV/document smoke, skill gap report, training progress, appeal, fraud case/signal, notification, dan audit terkait.

```bash
npm run cleanup:smoke
```

## Build

```bash
npm run build
```

## Run Dev

```bash
npm run dev
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
