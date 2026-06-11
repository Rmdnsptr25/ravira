import { api, clearAuthToken, getAuthToken, setAuthToken } from './api'

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

export async function login(email: string, password: string) {
  const result = await api.post<AuthResult>('/auth/login', { email, password })
  setAuthToken(result.token)
  return result
}

export async function registerCandidate(input: {
  name: string
  email: string
  password: string
  phone?: string
  location?: string
}) {
  const result = await api.post<AuthResult>('/auth/register/candidate', {
    ...input,
    consentAccepted: true,
  })
  setAuthToken(result.token)
  return result
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
}) {
  const result = await api.post<AuthResult>('/auth/register/recruiter', input)
  setAuthToken(result.token)
  return result
}

export async function getCurrentUser() {
  return api.get<RaviraUser>('/auth/me')
}

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
