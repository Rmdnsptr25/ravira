import type { StatTone } from '../components/StatCard'

type DashboardStat = {
  label: string
  value: string
  detail: string
  tone: StatTone
}

export const candidateDashboard = {
  stats: [
    {
      label: 'Best AI Match Score',
      value: '87/100',
      detail: '3 alasan rekomendasi tersedia',
      tone: 'teal',
    },
    {
      label: 'Lamaran aktif',
      value: '4',
      detail: '2 masuk tahap screening',
      tone: 'ink',
    },
    {
      label: 'Skill gap prioritas',
      value: '3',
      detail: 'Rekomendasi training tersedia',
      tone: 'amber',
    },
  ] satisfies DashboardStat[],
  recommendedJobs: [
    {
      title: 'Junior Data Analyst',
      company: 'Verified Partner A',
      location: 'Remote Indonesia',
      matchScore: 87,
      reasons: ['SQL kuat', 'Python dasar cocok', 'Preferensi remote sesuai'],
    },
    {
      title: 'Operations Analyst',
      company: 'Verified Partner B',
      location: 'Jakarta Hybrid',
      matchScore: 81,
      reasons: ['Excel analytics', 'Pengalaman magang relevan', 'Salary range cocok'],
    },
  ],
  applications: [
    { role: 'Junior Data Analyst', status: 'Screening', updatedAt: 'Hari ini' },
    { role: 'Business Support Intern', status: 'Applied', updatedAt: 'Kemarin' },
    {
      role: 'Data Entry Quality Officer',
      status: 'Need Verification',
      updatedAt: '2 hari lalu',
    },
  ],
  skillGaps: [
    { skill: 'Dashboard storytelling', priority: 'High' },
    { skill: 'Basic statistics', priority: 'Medium' },
    { skill: 'SQL window function', priority: 'Medium' },
  ],
}

export const recruiterDashboard = {
  stats: [
    {
      label: 'Open jobs',
      value: '6',
      detail: '4 lowongan aktif',
      tone: 'ink',
    },
    {
      label: 'Shortlist baru',
      value: '28',
      detail: 'Consent-gated',
      tone: 'teal',
    },
    {
      label: 'Manual review',
      value: '2',
      detail: 'Tidak diproses final otomatis',
      tone: 'amber',
    },
  ] satisfies DashboardStat[],
  shortlist: [
    {
      name: 'A. Pratama',
      role: 'Junior Data Analyst',
      matchScore: 87,
      candidateScore: 91,
      stage: 'Screening',
      risk: 'Low',
      explanation: 'Profil lengkap, skill match tinggi, tidak ada flag high risk.',
    },
    {
      name: 'M. Lestari',
      role: 'Operations Analyst',
      matchScore: 82,
      candidateScore: 84,
      stage: 'Seleksi Tahap 1',
      risk: 'Low',
      explanation: 'Pengalaman operasional relevan dan salary expectation sesuai.',
    },
    {
      name: 'R. Naufal',
      role: 'Support Analyst',
      matchScore: 78,
      candidateScore: 72,
      stage: 'Need Verification',
      risk: 'Medium',
      explanation: 'Perlu validasi ulang sebelum perpindahan tahap berikutnya.',
    },
  ],
  pipeline: [
    { stage: 'Applied', count: 42 },
    { stage: 'Screening', count: 18 },
    { stage: 'Seleksi Tahap 1', count: 9 },
    { stage: 'Interview', count: 4 },
  ],
}

export const adminDashboard = {
  stats: [
    {
      label: 'Company verification',
      value: '7',
      detail: 'Menunggu review',
      tone: 'amber',
    },
    {
      label: 'Job moderation',
      value: '3',
      detail: 'Laporan abuse aktif',
      tone: 'ink',
    },
    {
      label: 'Audit events',
      value: '126',
      detail: 'Hari ini',
      tone: 'teal',
    },
  ] satisfies DashboardStat[],
  reviewQueue: [
    {
      type: 'Company verification',
      item: 'PT Data Nusantara',
      status: 'Pending',
    },
    {
      type: 'Job moderation',
      item: 'Field Sales Associate',
      status: 'Needs admin review',
    },
    {
      type: 'Fraud review',
      item: 'Candidate profile cluster',
      status: 'Evidence masked',
    },
  ],
  auditLog: [
    {
      actor: 'Recruiter',
      action: 'Stage updated',
      entity: 'Application',
      reason: 'Screening completed',
    },
    {
      actor: 'Admin',
      action: 'Company approved',
      entity: 'Company',
      reason: 'Document verified',
    },
    {
      actor: 'Security',
      action: 'Fraud case reviewed',
      entity: 'FraudCase',
      reason: 'False positive marked',
    },
  ],
}

export const homeRoles = [
  {
    title: 'Candidate workspace',
    path: '/candidate/dashboard',
    summary: 'Job feed, match score, skill gap, training, dan status lamaran.',
  },
  {
    title: 'Recruiter workspace',
    path: '/recruiter/dashboard',
    summary: 'Shortlist, candidate score, stage control, dan pipeline.',
  },
  {
    title: 'Admin workspace',
    path: '/admin/dashboard',
    summary: 'Company verification, job moderation, audit, dan manual review.',
  },
]
