import { api, apiRequest, ApiError, clearAuthToken, getAuthToken, setAuthToken } from './api'

export { getAuthToken }

export type RaviraRole = 'CANDIDATE' | 'RECRUITER' | 'ADMIN' | 'SUPER_ADMIN'

export type RaviraUser = {
  id: string
  email: string
  fullName: string
  phone?: string | null
  role: RaviraRole
  isActive: boolean
  candidate?: {
    id: string
    headline?: string | null
    location?: string | null
    profileVisibility?: string
  } | null
  recruiter?: {
    id: string
    position?: string | null
    company?: {
      id: string
      name: string
      industry?: string | null
      location?: string | null
      verificationStatus?: string
    } | null
  } | null
}

export type AuthResult = {
  token: string
  user: RaviraUser
}

export type ProfileVisibilityStatus = 'PRIVATE' | 'LIMITED' | 'PUBLIC'

export type CandidateProfile = {
  id: string
  userId: string
  email: string
  fullName: string
  phone: string | null
  location: string | null
  education: string | null
  experienceSummary: string | null
  salaryExpectation: number | null
  mobilityPreference: string | null
  visibilityStatus: ProfileVisibilityStatus
  createdAt: string
  updatedAt: string
}

export type UpdateCandidateProfileInput = {
  fullName?: string
  phone?: string
  location?: string
  education?: string
  experienceSummary?: string
  salaryExpectation?: number
  mobilityPreference?: string
  visibilityStatus?: ProfileVisibilityStatus
}

export type CandidateSkill = {
  id: string
  skillName: string
  level: string | null
  source: string | null
  confidenceScore: number | null
  createdAt: string
  updatedAt: string
}

export type CreateCandidateSkillInput = {
  skillName: string
  level?: string
  source?: string
  confidenceScore?: number
}

export type CandidateDocument = {
  id: string
  candidateId: string
  fileName: string
  fileType: string
  fileSize: number
  parsingStatus: 'PENDING' | 'SUCCESS' | 'FAILED' | 'NEED_REVIEW'
  parsedText: string | null
  extractedSkills: Array<{
    skillName: string
    source?: string
    confidenceScore?: number
  }> | null
  extractedEducation: unknown | null
  extractedExperience: unknown | null
  uploadedAt: string
  parsedAt: string | null
  createdAt: string
  updatedAt: string
}

export type PublicJob = {
  id: string
  title: string
  description: string
  location: string | null
  jobType: string | null
  workType: string | null
  employmentType?: string | null
  salaryMin: number | null
  salaryMax: number | null
  status: string
  company: {
    id: string
    name: string
    industry: string | null
    location: string | null
  }
  skills: Array<{
    id: string
    skillName: string
    required: boolean
    weight: number
  }>
  createdAt: string
  updatedAt: string
}

export type JobMatchScore = {
  jobId: string
  matchScore: number
  matchExplanation: string[]
  ruleVersion: string
}

export type CandidateApplication = {
  id: string
  status: string
  coverLetter?: string | null
  createdAt: string
  updatedAt: string
  job: {
    id: string
    title: string
    location: string | null
    jobType: string | null
    workType: string | null
    company: {
      id: string
      name: string
      industry: string | null
    }
  }
}

function acceptSession(result: AuthResult, roles: readonly RaviraRole[], signal?: AbortSignal) {
  signal?.throwIfAborted()
  if (!result.user?.isActive || !roles.includes(result.user.role) || !result.token) {
    throw new ApiError('Akun ini tidak memiliki role yang sesuai untuk halaman masuk ini.', 403)
  }
  setAuthToken(result.token)
  return result
}

export async function login(email: string, password: string, expectedRole: RaviraRole | readonly RaviraRole[] = 'CANDIDATE', signal?: AbortSignal) {
  const result = await apiRequest<AuthResult>('/auth/login', { method: 'POST', body: { email, password }, auth: false, signal })
  return acceptSession(result, typeof expectedRole === 'string' ? [expectedRole] : expectedRole, signal)
}

export async function registerCandidate(input: {
  name: string
  email: string
  password: string
  phone?: string
  location?: string
}, signal?: AbortSignal) {
  const result = await apiRequest<AuthResult>('/auth/register/candidate', { method: 'POST', auth: false, signal, body: {
    ...input,
    consentAccepted: true,
  } })
  return acceptSession(result, ['CANDIDATE'], signal)
}

export async function registerRecruiter(input: {
  name: string
  email: string
  password: string
  phone?: string
  companyName: string
  industry?: string
  location?: string
  companyWebsite?: string
  position?: string
}, signal?: AbortSignal) {
  const result = await apiRequest<AuthResult>('/auth/register/recruiter', { method: 'POST', auth: false, body: input, signal })
  return acceptSession(result, ['RECRUITER'], signal)
}

export async function getCurrentUser() {
  return api.get<RaviraUser>('/auth/me')
}

// ── Candidate Profile & Skills APIs (Sprint 2A) ─────────────
export async function getCandidateProfile(signal?: AbortSignal) {
  return api.get<CandidateProfile>('/candidates/me', signal)
}

export async function updateCandidateProfile(input: UpdateCandidateProfileInput, signal?: AbortSignal) {
  return api.patch<CandidateProfile>('/candidates/me', input, signal)
}

export async function listCandidateSkills(signal?: AbortSignal) {
  return api.get<CandidateSkill[]>('/candidates/me/skills', signal)
}

export async function createCandidateSkill(input: CreateCandidateSkillInput, signal?: AbortSignal) {
  return api.post<CandidateSkill>('/candidates/me/skills', input, signal)
}

export async function deleteCandidateSkill(skillId: string, signal?: AbortSignal) {
  return api.delete<{ id: string }>(`/candidates/me/skills/${skillId}`, signal)
}

export async function uploadCandidateCv(file: File, signal?: AbortSignal) {
  const formData = new FormData()
  formData.append('cv', file)
  return api.post<CandidateDocument>('/candidates/me/cv', formData, signal)
}

export async function listCandidateCvs(signal?: AbortSignal) {
  return api.get<CandidateDocument[]>('/candidates/me/cv', signal)
}

export async function deleteCandidateCv(cvId: string, signal?: AbortSignal) {
  return api.delete<{ id: string }>(`/candidates/me/cv/${cvId}`, signal)
}

// ── Jobs & Applications APIs ────────────────────────────────
export async function listPublishedJobs(signal?: AbortSignal) {
  return api.get<PublicJob[]>('/jobs', signal)
}

export async function searchPublishedJobs(params: {
  keyword?: string
  location?: string
  jobType?: string
  workType?: string
  skill?: string
}) {
  const query = new URLSearchParams()
  Object.entries(params).forEach(([key, value]) => {
    if (value) query.set(key, value)
  })
  const suffix = query.size ? `?${query.toString()}` : ''
  return api.get<PublicJob[]>(`/jobs/search${suffix}`)
}

export async function getJobMatchScore(jobId: string) {
  return api.get<JobMatchScore>(`/jobs/${jobId}/match-score`)
}

export async function applyToJob(jobId: string, coverLetter?: string) {
  return api.post<CandidateApplication>(`/jobs/${jobId}/apply`, {
    coverLetter: coverLetter || 'Saya tertarik dengan posisi ini.',
  })
}

export async function listMyApplications(signal?: AbortSignal) {
  return api.get<CandidateApplication[]>('/candidates/me/applications', signal)
}

export function logout() {
  clearAuthToken()
}
