import {
  BadgeCheck,
  Bell,
  ClipboardCheck,
  FileSearch,
  GraduationCap,
  MapPinned,
  ShieldCheck,
  Upload,
} from 'lucide-react'
import type { ComponentType } from 'react'

export type LandingIcon = ComponentType<{ size?: number; strokeWidth?: number }>

export const candidateHeroStats = [
  { label: 'Match score', value: '87/100' },
  { label: 'Skill gap', value: '3 prioritas' },
  { label: 'Status lamaran', value: 'Live tracker' },
]

export const candidateFlow = [
  {
    title: 'Upload CV',
    detail: 'PDF atau DOCX dengan fallback input manual.',
    icon: Upload,
  },
  {
    title: 'Validasi skill',
    detail: 'Kandidat mengoreksi hasil ekstraksi sebelum dipakai matching.',
    icon: ClipboardCheck,
  },
  {
    title: 'Dapat match',
    detail: 'Rekomendasi kerja menampilkan skor dan alasan yang mudah dipahami.',
    icon: FileSearch,
  },
]

export const candidateHighlights = [
  {
    title: 'AI Job Matching',
    detail: 'Job feed personal berdasarkan skill, pengalaman, lokasi, tipe kerja, dan preferensi.',
    icon: FileSearch,
  },
  {
    title: 'Skill Gap Advisor',
    detail: 'Prioritas skill yang perlu ditingkatkan untuk target role kandidat.',
    icon: GraduationCap,
  },
  {
    title: 'Application Tracker',
    detail: 'Status lamaran resmi seperti Applied, Screening, Interview, dan Need Verification.',
    icon: Bell,
  },
  {
    title: 'Consent & Privacy',
    detail: 'Visibilitas profil dikontrol kandidat dan data sensitif tidak ditampilkan sembarangan.',
    icon: ShieldCheck,
  },
  {
    title: 'Cross-Region Ready',
    detail: 'Preferensi remote, hybrid, dan relokasi disiapkan untuk fase matching lintas wilayah.',
    icon: MapPinned,
  },
  {
    title: 'Transparent Recommendation',
    detail: 'Setiap rekomendasi punya alasan, bukan angka tanpa konteks.',
    icon: BadgeCheck,
  },
]

export const sampleJobs = [
  {
    title: 'Junior Data Analyst',
    company: 'Verified Partner A',
    location: 'Remote Indonesia',
    score: 87,
    reasons: ['SQL cocok', 'Python dasar', 'Remote sesuai'],
  },
  {
    title: 'Operations Analyst',
    company: 'Verified Partner B',
    location: 'Jakarta Hybrid',
    score: 81,
    reasons: ['Excel analytics', 'Magang relevan', 'Gaji cocok'],
  },
  {
    title: 'Support Data Officer',
    company: 'Verified Partner C',
    location: 'Bandung',
    score: 76,
    reasons: ['Input data', 'Detail oriented', 'On-site sesuai'],
  },
]

export const timelineItems = [
  { status: 'Applied', detail: 'Lamaran diterima sistem' },
  { status: 'Screening', detail: 'Profil sedang ditinjau recruiter' },
  { status: 'Need Verification', detail: 'Kandidat diminta koreksi data bila perlu' },
  { status: 'Interview', detail: 'Undangan tahap lanjutan' },
]

export const faqs = [
  {
    question: 'Apakah kandidat melihat Candidate Score internal?',
    answer: 'Tidak. Kandidat hanya melihat AI Match Score, status lamaran, dan alasan umum yang aman.',
  },
  {
    question: 'Apakah hasil CV parsing bisa dikoreksi?',
    answer: 'Bisa. Kandidat dapat memvalidasi skill, profil, dan mengajukan koreksi bila data tidak sesuai.',
  },
  {
    question: 'Apakah anti-fraud menolak kandidat otomatis?',
    answer: 'Tidak. Kasus berisiko harus melalui manual review sesuai guardrail PRD.',
  },
  {
    question: 'Apakah halaman ini sudah terhubung Supabase?',
    answer: 'Belum. Landing page memakai data dummy dan belum mengaktifkan auth maupun koneksi backend.',
  },
]
