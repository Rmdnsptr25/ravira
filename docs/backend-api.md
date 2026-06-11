# Ravira Backend API

Dokumen ini adalah handoff API backend MVP Ravira untuk frontend developer.

Base URL lokal default:

```text
http://localhost:4000
```

Semua response memakai format konsisten:

```json
{
  "success": true,
  "message": "...",
  "data": {}
}
```

Error response:

```json
{
  "success": false,
  "message": "...",
  "data": null
}
```

Endpoint yang membutuhkan login memakai header:

```text
Authorization: Bearer <token>
```

## Security Contract

- Response API tidak mengembalikan `passwordHash`.
- Candidate tidak pernah menerima `CandidateScore`.
- Candidate hanya melihat AI Match Score, status lamaran, data profil sendiri, CV sendiri, appeal sendiri, notification sendiri, skill gap sendiri, dan training progress sendiri.
- Recruiter hanya bisa mengelola company/job/application/score dari company miliknya sendiri.
- Admin endpoint hanya untuk `ADMIN` dan `SUPER_ADMIN`.
- CV file path internal dan raw fraud evidence tidak diekspos ke frontend.
- Anti-fraud tidak melakukan auto rejection final. Case berisiko perlu manual review.
- Audit log menyimpan metadata aman, bukan isi CV mentah atau data sensitif yang tidak perlu.

## Access Matrix

| Area | Public | CANDIDATE | RECRUITER | ADMIN/SUPER_ADMIN |
|---|---:|---:|---:|---:|
| Health | Yes | Yes | Yes | Yes |
| Auth register/login | Yes | Yes | Yes | Yes |
| Candidate profile/skills/CV | No | Own data only | No | No |
| Skill gap/training | No | Own data only | No | No |
| Published jobs | Yes | Yes | Yes | Yes |
| Apply job | No | Yes | No | No |
| Application detail/history | No | Own applications | Company applications | All |
| Candidate Score | No | No | Company applications | All |
| Recruiter jobs | No | No | Own company only | No |
| Notifications | No | Own notifications | Own notifications | Own notifications |
| Appeals | No | Own appeals | No | All via admin endpoints |
| Fraud cases | No | No | No | All via admin endpoints |
| Company verification | No | No | No | Yes |

## Health

| Method | Endpoint | Access |
|---|---|---|
| GET | `/health` | Public |

Response:

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

## Auth

| Method | Endpoint | Access |
|---|---|---|
| POST | `/api/v1/auth/register/candidate` | Public |
| POST | `/api/v1/auth/register/recruiter` | Public |
| POST | `/api/v1/auth/login` | Public |
| GET | `/api/v1/auth/me` | Authenticated |

Register candidate request:

```json
{
  "name": "Candidate Name",
  "email": "candidate@example.com",
  "password": "Password123!",
  "phone": "+62000000000",
  "location": "Jakarta",
  "consentAccepted": true
}
```

Register recruiter request:

```json
{
  "name": "Recruiter Name",
  "email": "recruiter@example.com",
  "password": "Password123!",
  "phone": "+62000000000",
  "companyName": "Company Name",
  "industry": "Technology",
  "location": "Jakarta",
  "position": "Talent Partner"
}
```

Login request:

```json
{
  "email": "candidate@example.com",
  "password": "Password123!"
}
```

Auth response:

```json
{
  "token": "jwt-token",
  "user": {
    "id": "...",
    "email": "candidate@example.com",
    "fullName": "Candidate Name",
    "phone": "+62000000000",
    "role": "CANDIDATE",
    "isActive": true,
    "candidate": {
      "id": "...",
      "location": "Jakarta",
      "profileVisibility": "PRIVATE"
    }
  }
}
```

Audit:

- `AUTH_REGISTER_CANDIDATE`
- `AUTH_REGISTER_RECRUITER`
- `AUTH_LOGIN`

## Candidate Profile

Semua endpoint candidate memakai role `CANDIDATE` dan hanya mengakses data milik user login.

| Method | Endpoint |
|---|---|
| GET | `/api/v1/candidates/me` |
| PATCH | `/api/v1/candidates/me` |

Update request:

```json
{
  "fullName": "Candidate Name",
  "phone": "+62000000000",
  "location": "Bandung",
  "education": "S1",
  "experienceSummary": "Backend developer",
  "salaryExpectation": 12000000,
  "mobilityPreference": "REMOTE",
  "visibilityStatus": "PUBLIC"
}
```

Response:

```json
{
  "id": "...",
  "userId": "...",
  "email": "candidate@example.com",
  "fullName": "Candidate Name",
  "phone": "+62000000000",
  "location": "Bandung",
  "education": "S1",
  "experienceSummary": "Backend developer",
  "salaryExpectation": 12000000,
  "mobilityPreference": "REMOTE",
  "visibilityStatus": "PUBLIC"
}
```

Fraud check basic berjalan saat profile update menyentuh `fullName`, `phone`, atau `location`.

## Candidate Skills

| Method | Endpoint |
|---|---|
| GET | `/api/v1/candidates/me/skills` |
| POST | `/api/v1/candidates/me/skills` |
| PATCH | `/api/v1/candidates/me/skills/:skillId` |
| DELETE | `/api/v1/candidates/me/skills/:skillId` |

Create request:

```json
{
  "skillName": "TypeScript",
  "level": "INTERMEDIATE",
  "source": "manual",
  "confidenceScore": 90
}
```

Response:

```json
{
  "id": "...",
  "skillName": "TypeScript",
  "level": "INTERMEDIATE",
  "source": "manual",
  "confidenceScore": 90,
  "createdAt": "2026-06-11T00:00:00.000Z",
  "updatedAt": "2026-06-11T00:00:00.000Z"
}
```

Catatan:

- Skill dari CV parser memakai `source: "CV_PARSER"`.
- Skill dari training completed memakai `source: "TRAINING"`.
- Candidate tetap bisa edit/delete skill lewat endpoint skill CRUD.

## Candidate CV

CV hanya bisa diakses candidate pemilik data. Response tidak mengembalikan raw file path atau public URL.

| Method | Endpoint | Audit |
|---|---|---|
| POST | `/api/v1/candidates/me/cv` | `CV_UPLOADED`, lalu `CV_PARSED` atau `CV_PARSE_FAILED` |
| GET | `/api/v1/candidates/me/cv` | No |
| GET | `/api/v1/candidates/me/cv/:cvId` | No |
| DELETE | `/api/v1/candidates/me/cv/:cvId` | `CV_DELETED` |

Upload request:

```text
Content-Type: multipart/form-data
field: cv
allowed: PDF, DOCX
max size: 5MB
```

Response:

```json
{
  "id": "...",
  "candidateId": "...",
  "fileName": "candidate-cv.pdf",
  "fileType": "application/pdf",
  "fileSize": 102400,
  "parsingStatus": "SUCCESS",
  "parsedText": "Backend developer with TypeScript and PostgreSQL experience.",
  "extractedSkills": [
    {
      "skillName": "TypeScript",
      "confidenceScore": 70,
      "source": "CV_PARSER"
    }
  ],
  "uploadedAt": "2026-06-11T00:00:00.000Z",
  "parsedAt": "2026-06-11T00:00:00.000Z"
}
```

Notification:

- Success title: `CV berhasil diproses`
- Failed/Need review title: `CV perlu ditinjau`

## Skill Gap

Skill Gap Advisor MVP masih rule-based. `GET` dan `POST` sama-sama generate report baru dan menyimpan `SkillGapReport`.

| Method | Endpoint | Audit |
|---|---|---|
| GET | `/api/v1/candidates/me/skill-gap` | `SKILL_GAP_GENERATED` |
| GET | `/api/v1/candidates/me/skill-gap?jobId=:jobId` | `SKILL_GAP_GENERATED` |
| POST | `/api/v1/candidates/me/skill-gap` | `SKILL_GAP_GENERATED` |

Query:

```text
jobId optional, must be PUBLISHED
targetRole optional
```

POST request:

```json
{
  "jobId": "...",
  "targetRole": "Backend Engineer"
}
```

Response:

```json
{
  "id": "...",
  "candidateId": "...",
  "jobId": "...",
  "targetRole": "Backend Engineer",
  "ownedSkills": [
    { "skillName": "TypeScript", "source": "manual" }
  ],
  "matchedSkills": [
    { "skillName": "TypeScript", "required": true, "weight": 1 }
  ],
  "missingSkills": [
    { "skillName": "Node.js", "required": true, "weight": 2, "marketDemandCount": 1 }
  ],
  "prioritySkills": [
    { "skillName": "Node.js", "priorityScore": 125 }
  ],
  "summary": "Ditemukan 1 skill cocok dan 2 skill gap untuk target Backend Engineer.",
  "recommendationReason": "Skill prioritas dihitung dari requirement, bobot skill, dan frekuensi skill pada lowongan published."
}
```

Notification:

- Title: `Skill gap berhasil dibuat`

## Training Recommendations

Course berasal dari seed katalog MVP. Tidak ada integrasi LMS eksternal.

| Method | Endpoint |
|---|---|
| GET | `/api/v1/candidates/me/training-recommendations` |
| GET | `/api/v1/candidates/me/training-recommendations?jobId=:jobId` |

Response:

```json
{
  "jobId": "...",
  "targetRole": "Backend Engineer",
  "summary": "Ditemukan 1 skill cocok dan 2 skill gap untuk target Backend Engineer.",
  "recommendations": [
    {
      "prioritySkill": "Node.js",
      "recommendedCourses": [
        {
          "id": "...",
          "title": "Node.js API Development",
          "provider": "Ravira Learning Partner",
          "skillTargets": ["Node.js", "JavaScript"],
          "duration": "14 jam",
          "price": 200000,
          "difficulty": "INTERMEDIATE",
          "language": "id",
          "url": "https://learning.ravira.local/courses/node-api"
        }
      ],
      "reason": "Course direkomendasikan karena skill target cocok dengan skill gap prioritas."
    }
  ]
}
```

Jika belum ada course cocok, `recommendedCourses` kosong dan `reason` berisi pesan aman.

## Training Progress

Candidate hanya bisa melihat dan mengelola progress miliknya sendiri.

| Method | Endpoint | Audit |
|---|---|---|
| GET | `/api/v1/candidates/me/training-progress` | No |
| POST | `/api/v1/candidates/me/training-progress` | `TRAINING_STARTED` |
| PATCH | `/api/v1/candidates/me/training-progress/:progressId` | `TRAINING_PROGRESS_UPDATED`, `TRAINING_COMPLETED` jika selesai |

Create request:

```json
{
  "courseId": "...",
  "status": "IN_PROGRESS",
  "progressPct": 0
}
```

Patch request:

```json
{
  "status": "COMPLETED"
}
```

Status:

```text
NOT_STARTED
IN_PROGRESS
COMPLETED
```

Response:

```json
{
  "id": "...",
  "candidateId": "...",
  "courseId": "...",
  "status": "COMPLETED",
  "progressPct": 100,
  "completedAt": "2026-06-11T00:00:00.000Z",
  "course": {
    "id": "...",
    "title": "Node.js API Development",
    "skillTargets": ["Node.js", "JavaScript"]
  }
}
```

Saat status menjadi `COMPLETED`:

- Skill target course ditambahkan ke CandidateSkill dengan `source: "TRAINING"` jika belum ada.
- Skill yang sudah ada tidak diduplikasi.
- Notification dibuat dengan title `Training selesai`.
- Audit `TRAINING_COMPLETED` tercatat.

## Published Jobs

Published job endpoints hanya mengembalikan job dengan status `PUBLISHED`.

| Method | Endpoint | Access |
|---|---|---|
| GET | `/api/v1/jobs` | Public |
| GET | `/api/v1/jobs/search` | Public |
| GET | `/api/v1/jobs/:jobId` | Public |
| GET | `/api/v1/jobs/:jobId/match-score` | CANDIDATE |
| POST | `/api/v1/jobs/:jobId/apply` | CANDIDATE |

Filter query:

```text
keyword
location
jobType
workType
skill
```

Apply request:

```json
{
  "coverLetter": "I am interested in this role."
}
```

AI Match Score response for candidate:

```json
{
  "jobId": "...",
  "matchScore": 85,
  "matchExplanation": [
    "Skill cocok: TypeScript.",
    "Lokasi kandidat relevan dengan lokasi lowongan."
  ],
  "ruleVersion": "mvp-rule-v1"
}
```

Audit:

- `APPLICATION_CREATED`
- `CANDIDATE_SCORE_GENERATED` is internal and not returned to candidate.

## Applications

| Method | Endpoint | Access |
|---|---|---|
| GET | `/api/v1/candidates/me/applications` | CANDIDATE own applications |
| GET | `/api/v1/applications/:applicationId` | CANDIDATE owner, RECRUITER company owner, ADMIN/SUPER_ADMIN |
| GET | `/api/v1/applications/:applicationId/status-history` | CANDIDATE owner, RECRUITER company owner, ADMIN/SUPER_ADMIN |
| POST | `/api/v1/applications/:applicationId/stage` | RECRUITER company owner |
| GET | `/api/v1/applications/:applicationId/score` | RECRUITER company owner, ADMIN/SUPER_ADMIN |

Update stage request:

```json
{
  "newStatus": "SCREENING",
  "reason": "Candidate meets minimum requirements."
}
```

Supported status:

```text
APPLIED
SCREENING
SELEKSI_TAHAP_1
SELEKSI_TAHAP_2
INTERVIEW
ACCEPTED
REJECTED
NEED_VERIFICATION
```

Candidate Score response for recruiter/admin only:

```json
{
  "applicationId": "...",
  "applicationStatus": "APPLIED",
  "matchScore": 85,
  "candidateScore": 82,
  "candidateScoreBreakdown": {},
  "explanation": [
    "AI Match Score berkontribusi 43 dari 50 poin.",
    "Kelengkapan profil mencapai 88%."
  ],
  "ruleVersion": "mvp-rule-v1"
}
```

Audit:

- `APPLICATION_STAGE_UPDATED`
- `CANDIDATE_SCORE_GENERATED`

## Recruiter Jobs

Semua endpoint di bagian ini hanya untuk role `RECRUITER`. Recruiter hanya bisa mengakses job dan application dari company miliknya. Create job hanya diizinkan jika company `verificationStatus` adalah `APPROVED`.

| Method | Endpoint | Audit |
|---|---|---|
| POST | `/api/v1/recruiter/jobs` | `JOB_CREATED` |
| GET | `/api/v1/recruiter/jobs` | No |
| GET | `/api/v1/recruiter/jobs/:jobId` | No |
| PATCH | `/api/v1/recruiter/jobs/:jobId` | `JOB_UPDATED` |
| DELETE | `/api/v1/recruiter/jobs/:jobId` | `JOB_DELETED` |
| GET | `/api/v1/recruiter/jobs/:jobId/applications` | No |
| GET | `/api/v1/recruiter/jobs/:jobId/candidate-scores` | `CANDIDATE_SCORE_GENERATED` when recalculated |

Create job request:

```json
{
  "title": "Backend Engineer",
  "description": "Build backend APIs for Ravira.",
  "location": "Jakarta",
  "jobType": "FULL_TIME",
  "workType": "REMOTE",
  "status": "PUBLISHED",
  "salaryMin": 10000000,
  "salaryMax": 18000000,
  "jobSkills": [
    { "skillName": "TypeScript", "required": true, "weight": 3 }
  ]
}
```

## Notifications

| Method | Endpoint | Access |
|---|---|---|
| GET | `/api/v1/notifications` | Authenticated own notifications |
| PATCH | `/api/v1/notifications/:notificationId/read` | Authenticated owner |

Response:

```json
{
  "id": "...",
  "userId": "...",
  "type": "APPLICATION_STATUS_UPDATED",
  "title": "Status lamaran diperbarui",
  "bodySafe": "Status lamaran Anda untuk posisi Backend Engineer berubah menjadi SCREENING.",
  "status": "UNREAD",
  "readAt": null,
  "createdAt": "2026-06-11T00:00:00.000Z"
}
```

Notification otomatis dibuat untuk:

- Apply job.
- Stage/status application berubah.
- CV parsing selesai atau perlu review.
- Skill gap report dibuat.
- Training completed.
- Appeal decision berubah.
- Verification/fraud action tertentu yang perlu diketahui candidate.

## Appeals

Candidate membuat dan melihat appeal miliknya sendiri. Admin/Super Admin melihat dan memutuskan semua appeal.

| Method | Endpoint | Access | Audit |
|---|---|---|---|
| POST | `/api/v1/appeals` | CANDIDATE | `APPEAL_CREATED` |
| GET | `/api/v1/candidates/me/appeals` | CANDIDATE owner | No |
| GET | `/api/v1/candidates/me/appeals/:appealId` | CANDIDATE owner | No |
| GET | `/api/v1/admin/appeals` | ADMIN/SUPER_ADMIN | No |
| GET | `/api/v1/admin/appeals/:appealId` | ADMIN/SUPER_ADMIN | No |
| POST | `/api/v1/admin/appeals/:appealId/decision` | ADMIN/SUPER_ADMIN | `APPEAL_DECISION_UPDATED` |

Create request:

```json
{
  "relatedEntity": "parsing_result",
  "relatedEntityId": "...",
  "reason": "Hasil parsing CV perlu ditinjau.",
  "evidenceUrl": "https://example.com/evidence.pdf"
}
```

Allowed `relatedEntity`:

```text
profile
skill
application_status
verification
parsing_result
```

Admin decision request:

```json
{
  "status": "IN_REVIEW",
  "reason": "Appeal sedang ditinjau oleh admin."
}
```

## Admin Company Verification

Hanya role `ADMIN` dan `SUPER_ADMIN`.

| Method | Endpoint | Audit |
|---|---|---|
| GET | `/api/v1/admin/companies/pending` | No |
| POST | `/api/v1/admin/companies/:companyId/approve` | `COMPANY_APPROVED` |
| POST | `/api/v1/admin/companies/:companyId/reject` | `COMPANY_REJECTED` |

Reject request:

```json
{
  "reason": "Company document is not valid."
}
```

## Admin Anti-Fraud

Hanya role `ADMIN` dan `SUPER_ADMIN`. Evidence yang dikembalikan sudah masked.

| Method | Endpoint | Audit |
|---|---|---|
| GET | `/api/v1/admin/fraud-cases` | No |
| GET | `/api/v1/admin/fraud-cases/:caseId` | No |
| POST | `/api/v1/admin/fraud-cases/:caseId/decision` | `FRAUD_CASE_DECISION_UPDATED` |

Optional query:

```text
riskLevel=LOW|MEDIUM|HIGH
reviewStatus=OPEN|IN_REVIEW|NEED_VERIFICATION|VALID|FALSE_POSITIVE|MERGED|BLOCKED|RESOLVED
candidateId=uuid
```

Decision request:

```json
{
  "decision": "NEED_VERIFICATION",
  "reason": "Perlu verifikasi ulang data kandidat."
}
```

Audit anti-fraud:

- `FRAUD_SIGNAL_DETECTED`
- `FRAUD_CASE_CREATED`
- `FRAUD_CASE_DECISION_UPDATED`
- `CANDIDATE_NEED_VERIFICATION_SET`

## Seeded Accounts

Default seed password:

```text
Password123!
```

Seed creates:

- `seed-admin@ravira.local`
- `seed-candidate@ravira.local`
- `seed-recruiter@ravira.local`
- 1 approved company
- 2 published jobs
- 10 dummy courses for training recommendation
- 1 low-risk fraud case example

## Smoke Cleanup

Smoke cleanup targets test data with prefixes such as `smoke-*` and `Smoke Company`. It also removes smoke CV files, skill gap reports, and training progress.
