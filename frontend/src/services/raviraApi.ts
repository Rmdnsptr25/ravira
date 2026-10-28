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
  breakdown?: {
    skillMatch?: {
      weight: number
      score: number
      coverage: number
      matchedSkills: string[]
      missingRequiredSkills: string[]
    }
    locationMatch?: {
      weight: number
      score: number
      candidateLocation?: string | null
      jobLocation?: string | null
      matched: boolean
    }
    workTypeJobTypeMatch?: {
      weight: number
      score: number
      mobilityPreference?: string | null
      jobType?: string | null
      workType?: string | null
    }
    experienceRelevance?: {
      weight: number
      score: number
      matchedKeywords: string[]
    }
    [key: string]: unknown
  }
  ruleVersion: string
}

export type JobRecommendation = {
  job: {
    id: string
    title: string
    location: string | null
    jobType: string | null
    workType: string | null
  }
  company: {
    id: string
    name: string
    industry: string | null
    location: string | null
  }
  matchScore: number
  matchExplanation: string[]
  breakdown: {
    skillMatch?: {
      weight: number
      score: number
      coverage: number
      matchedSkills: string[]
      missingRequiredSkills: string[]
    }
    locationMatch?: {
      weight: number
      score: number
      candidateLocation?: string | null
      jobLocation?: string | null
      matched: boolean
    }
    workTypeJobTypeMatch?: {
      weight: number
      score: number
      mobilityPreference?: string | null
      jobType?: string | null
      workType?: string | null
    }
    experienceRelevance?: {
      weight: number
      score: number
      matchedKeywords: string[]
    }
    [key: string]: unknown
  }
  ruleVersion: string
}

export type SkillGapReport = {
  id: string
  candidateId: string
  jobId: string | null
  targetRole: string | null
  ownedSkills: Array<{
    skillName: string
    level?: string | null
    source?: string | null
    confidenceScore?: number | null
  }>
  missingSkills: Array<{
    skillName: string
    required: boolean
    weight: number
    marketDemandCount: number
  }>
  matchedSkills: Array<{
    skillName: string
    required: boolean
    weight: number
    matchedCandidateSkill: string
  }>
  prioritySkills: Array<{
    skillName: string
    required: boolean
    weight: number
    marketDemandCount: number
    priorityScore: number
    reason: string[]
  }>
  summary: string
  recommendationReason?: string
  createdAt: string
  updatedAt: string
}

export type CourseItem = {
  id: string
  title: string
  provider: string
  skillTargets: string[]
  duration: string
  price: number
  difficulty: string
  language: string
  url: string
  createdAt: string
  updatedAt: string
}

export type TrainingRecommendation = {
  prioritySkill: string
  recommendedCourses: CourseItem[]
  reason: string
}

export type TrainingRecommendationsResult = {
  jobId: string | null
  targetRole: string | null
  summary: string
  emptyStateMessage?: string
  recommendations: TrainingRecommendation[]
}

export type TrainingProgressItem = {
  id: string
  candidateId: string
  courseId: string
  status: 'NOT_STARTED' | 'IN_PROGRESS' | 'COMPLETED'
  progressPct: number
  completedAt: string | null
  course: CourseItem
  createdAt: string
  updatedAt: string
}

export type ApplicationDetail = CandidateApplication & {
  candidate: {
    id: string
    location: string | null
    education: string | null
    experienceSummary: string | null
    user: {
      id: string
      email: string
      fullName: string
      phone: string | null
    }
    skills?: Array<{
      id: string
      skillName: string
      level?: string | null
      source?: string
      confidenceScore?: number | null
    }>
  }
}

export type ApplicationStatusHistoryItem = {
  id: string
  fromStatus: string | null
  toStatus: string
  reason: string | null
  changedBy: {
    id: string
    email: string
    fullName: string
    role: string
  }
  createdAt: string
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

export async function getJobById(jobId: string, signal?: AbortSignal) {
  return api.get<PublicJob>(`/jobs/${jobId}`, signal)
}

export async function searchPublishedJobs(params: {
  keyword?: string
  location?: string
  jobType?: string
  workType?: string
  skill?: string
}, signal?: AbortSignal) {
  const query = new URLSearchParams()
  Object.entries(params).forEach(([key, value]) => {
    if (value) query.set(key, value)
  })
  const suffix = query.size ? `?${query.toString()}` : ''
  return api.get<PublicJob[]>(`/jobs/search${suffix}`, signal)
}

export async function getJobRecommendations(signal?: AbortSignal) {
  return api.get<JobRecommendation[]>('/candidates/me/recommendations/jobs', signal)
}

export async function getJobMatchScore(jobId: string, signal?: AbortSignal) {
  return api.get<JobMatchScore>(`/jobs/${jobId}/match-score`, signal)
}

export async function applyToJob(jobId: string, coverLetter?: string, signal?: AbortSignal) {
  return api.post<CandidateApplication>(`/jobs/${jobId}/apply`, {
    coverLetter: coverLetter || 'Saya tertarik dengan posisi ini.',
  }, signal)
}

export async function listMyApplications(signal?: AbortSignal) {
  return api.get<CandidateApplication[]>('/candidates/me/applications', signal)
}

export async function getApplicationById(applicationId: string, signal?: AbortSignal) {
  return api.get<ApplicationDetail>(`/applications/${applicationId}`, signal)
}

export async function getApplicationStatusHistory(applicationId: string, signal?: AbortSignal) {
  return api.get<ApplicationStatusHistoryItem[]>(`/applications/${applicationId}/status-history`, signal)
}

// ── Skill Gap & Training APIs ───────────────────────────────
export async function getSkillGapReport(params?: { jobId?: string; targetRole?: string }, signal?: AbortSignal) {
  const query = new URLSearchParams()
  if (params?.jobId) query.set('jobId', params.jobId)
  if (params?.targetRole) query.set('targetRole', params.targetRole)
  const suffix = query.size ? `?${query.toString()}` : ''
  return api.get<SkillGapReport>(`/candidates/me/skill-gap${suffix}`, signal)
}

export async function createSkillGapReport(body: { jobId?: string; targetRole?: string }, signal?: AbortSignal) {
  return api.post<SkillGapReport>('/candidates/me/skill-gap', body, signal)
}

export async function getTrainingRecommendations(params?: { jobId?: string; targetRole?: string }, signal?: AbortSignal) {
  const query = new URLSearchParams()
  if (params?.jobId) query.set('jobId', params.jobId)
  if (params?.targetRole) query.set('targetRole', params.targetRole)
  const suffix = query.size ? `?${query.toString()}` : ''
  return api.get<TrainingRecommendationsResult>(`/candidates/me/training-recommendations${suffix}`, signal)
}

export async function listMyTrainingProgress(signal?: AbortSignal) {
  return api.get<TrainingProgressItem[]>('/candidates/me/training-progress', signal)
}

export async function createTrainingProgress(body: { courseId: string; status?: string; progressPct?: number }, signal?: AbortSignal) {
  return api.post<TrainingProgressItem>('/candidates/me/training-progress', body, signal)
}

export async function updateTrainingProgress(progressId: string, body: { status?: string; progressPct?: number }, signal?: AbortSignal) {
  return api.patch<TrainingProgressItem>(`/candidates/me/training-progress/${progressId}`, body, signal)
}

// ── Recruiter & Pipeline APIs (Sprint 2C) ─────────────────────
export type RecruiterJobStatus = 'DRAFT' | 'PUBLISHED' | 'CLOSED' | 'ARCHIVED'

export type ApplicationStageStatus =
  | 'APPLIED'
  | 'SCREENING'
  | 'SELEKSI_TAHAP_1'
  | 'SELEKSI_TAHAP_2'
  | 'INTERVIEW'
  | 'ACCEPTED'
  | 'REJECTED'
  | 'NEED_VERIFICATION'

export type RecruiterJobSkill = {
  id: string
  skillName: string
  required: boolean
  weight: number
}

export type RecruiterJobSkillInput = {
  skillName: string
  required?: boolean
  weight?: number
}

export type CreateRecruiterJobInput = {
  title: string
  description: string
  location?: string
  jobType?: string
  workType?: string
  employmentType?: string
  salaryMin?: number
  salaryMax?: number
  status?: RecruiterJobStatus
  jobSkills?: RecruiterJobSkillInput[]
}

export type UpdateRecruiterJobInput = Partial<CreateRecruiterJobInput>

export type RecruiterJob = {
  id: string
  title: string
  description: string
  location: string | null
  jobType: string | null
  workType: string | null
  employmentType: string | null
  salaryMin: number | null
  salaryMax: number | null
  status: RecruiterJobStatus
  companyId: string
  createdByRecruiterId: string
  skills: RecruiterJobSkill[]
  createdAt: string
  updatedAt: string
}

export type RecruiterJobApplication = {
  id: string
  status: ApplicationStageStatus
  coverLetter: string | null
  createdAt: string
  updatedAt: string
  candidate: {
    id: string
    location: string | null
    education: string | null
    experienceSummary: string | null
    user: {
      id: string
      email: string
      fullName: string
      phone: string | null
    }
    skills: Array<{
      id: string
      skillName: string
      level: string | null
      source: string
      confidenceScore: number | null
    }>
  }
}

export type RecruiterCandidateScore = {
  applicationId: string
  applicationStatus: ApplicationStageStatus
  candidate: {
    id: string
    fullName: string
    email: string
    phone: string | null
    location: string | null
    education: string | null
    experienceSummary: string | null
  }
  matchScore: number
  matchExplanation: string
  candidateScore: number
  candidateScoreBreakdown: {
    skillScore?: number
    experienceScore?: number
    educationScore?: number
    ruleVersion?: string
    notes?: string
    [key: string]: unknown
  } | null
  explanation: string
  ruleVersion: string
}

export type ApplicationCandidateScore = {
  applicationId: string
  applicationStatus: ApplicationStageStatus
  job: {
    id: string
    title: string
  }
  candidate: {
    id: string
    fullName: string
    email: string
    phone: string | null
    location: string | null
    education: string | null
    experienceSummary: string | null
  }
  matchScore: number
  matchExplanation: string
  candidateScore: number
  candidateScoreBreakdown: {
    skillScore?: number
    experienceScore?: number
    educationScore?: number
    ruleVersion?: string
    notes?: string
    [key: string]: unknown
  } | null
  explanation: string
  ruleVersion: string
}

export type UpdateApplicationStageInput = {
  newStatus: ApplicationStageStatus
  reason: string
}

export async function listRecruiterJobs(signal?: AbortSignal) {
  return api.get<RecruiterJob[]>('/recruiter/jobs', signal)
}

export async function getRecruiterJob(jobId: string, signal?: AbortSignal) {
  return api.get<RecruiterJob>(`/recruiter/jobs/${jobId}`, signal)
}

export async function createRecruiterJob(body: CreateRecruiterJobInput, signal?: AbortSignal) {
  return api.post<RecruiterJob>('/recruiter/jobs', body, signal)
}

export async function updateRecruiterJob(jobId: string, body: UpdateRecruiterJobInput, signal?: AbortSignal) {
  return api.patch<RecruiterJob>(`/recruiter/jobs/${jobId}`, body, signal)
}

export async function deleteRecruiterJob(jobId: string, signal?: AbortSignal) {
  return api.delete<RecruiterJob>(`/recruiter/jobs/${jobId}`, signal)
}

export async function listApplicationsForRecruiterJob(jobId: string, signal?: AbortSignal) {
  return api.get<RecruiterJobApplication[]>(`/recruiter/jobs/${jobId}/applications`, signal)
}

export async function getRecruiterJobCandidateScores(jobId: string, signal?: AbortSignal) {
  return api.get<RecruiterCandidateScore[]>(`/recruiter/jobs/${jobId}/candidate-scores`, signal)
}

export async function getApplicationCandidateScore(applicationId: string, signal?: AbortSignal) {
  return api.get<ApplicationCandidateScore>(`/applications/${applicationId}/score`, signal)
}

export async function updateApplicationStage(applicationId: string, body: UpdateApplicationStageInput, signal?: AbortSignal) {
  return api.post<ApplicationDetail>(`/applications/${applicationId}/stage`, body, signal)
}

export type AdminCompanyVerificationStatus = 'PENDING' | 'APPROVED' | 'REJECTED'

export type AdminPendingCompany = {
  id: string
  name: string
  industry: string | null
  location: string | null
  website: string | null
  verificationStatus: AdminCompanyVerificationStatus
  verifiedAt: string | null
  createdAt: string
  updatedAt: string
  recruiters: Array<{
    id: string
    user: {
      id: string
      email: string
      fullName: string
    }
  }>
}

export type RejectCompanyInput = {
  reason: string
}

export type FraudRiskLevel = 'LOW' | 'MEDIUM' | 'HIGH'

export type FraudReviewStatus =
  | 'OPEN'
  | 'IN_REVIEW'
  | 'NEED_VERIFICATION'
  | 'VALID'
  | 'FALSE_POSITIVE'
  | 'MERGED'
  | 'BLOCKED'
  | 'RESOLVED'

export type FraudSignal = {
  id: string
  candidateId: string
  caseId: string | null
  signalType: string
  riskLevel: FraudRiskLevel
  evidenceMasked: string
  status: string
  createdAt: string
  updatedAt: string
}

export type FraudCase = {
  id: string
  candidateId: string
  riskScore: number
  riskLevel: FraudRiskLevel
  reviewStatus: FraudReviewStatus
  reviewerId: string | null
  decision: string | null
  reason: string | null
  decidedAt: string | null
  candidate: {
    id: string
    userId: string
    fullName: string
    emailMasked: string
    phoneMasked: string | null
    location: string | null
    isActive: boolean
  }
  reviewer: {
    id: string
    fullName: string
    emailMasked: string
    role: string
  } | null
  signals: FraudSignal[]
  createdAt: string
  updatedAt: string
}

export type FraudCaseQuery = {
  riskLevel?: FraudRiskLevel
  reviewStatus?: FraudReviewStatus
  candidateId?: string
}

export type FraudCaseDecisionInput = {
  decision: 'VALID' | 'FALSE_POSITIVE' | 'NEED_VERIFICATION' | 'MERGED' | 'BLOCKED' | 'RESOLVED'
  reason: string
}

export type AppealStatus =
  | 'OPEN'
  | 'IN_REVIEW'
  | 'NEED_INFO'
  | 'APPROVED'
  | 'REJECTED'
  | 'RESOLVED'

export type AdminAppeal = {
  id: string
  candidateId: string
  relatedEntity: string
  relatedEntityId: string | null
  reason: string
  evidenceUrl: string | null
  status: AppealStatus
  reviewerId: string | null
  resolvedAt: string | null
  createdAt: string
  updatedAt: string
  candidate: {
    id: string
    user: {
      id: string
      email: string
      fullName: string
    }
  }
  reviewer: {
    id: string
    email: string
    fullName: string
    role: string
  } | null
}

export type AppealDecisionInput = {
  status: 'IN_REVIEW' | 'NEED_INFO' | 'APPROVED' | 'REJECTED' | 'RESOLVED'
  reason: string
}

export async function listPendingCompanies(signal?: AbortSignal) {
  return api.get<AdminPendingCompany[]>('/admin/companies/pending', signal)
}

export async function approveCompany(companyId: string, signal?: AbortSignal) {
  return api.post<AdminPendingCompany>(`/admin/companies/${companyId}/approve`, undefined, signal)
}

export async function rejectCompany(companyId: string, body: RejectCompanyInput, signal?: AbortSignal) {
  return api.post<AdminPendingCompany>(`/admin/companies/${companyId}/reject`, body, signal)
}

export async function listFraudCases(query?: FraudCaseQuery, signal?: AbortSignal) {
  const searchParams = new URLSearchParams()
  if (query?.riskLevel) searchParams.set('riskLevel', query.riskLevel)
  if (query?.reviewStatus) searchParams.set('reviewStatus', query.reviewStatus)
  if (query?.candidateId) searchParams.set('candidateId', query.candidateId)
  const queryString = searchParams.toString()
  const path = queryString ? `/admin/fraud-cases?${queryString}` : '/admin/fraud-cases'
  return api.get<FraudCase[]>(path, signal)
}

export async function getFraudCaseById(caseId: string, signal?: AbortSignal) {
  return api.get<FraudCase>(`/admin/fraud-cases/${caseId}`, signal)
}

export async function updateFraudCaseDecision(caseId: string, body: FraudCaseDecisionInput, signal?: AbortSignal) {
  return api.post<FraudCase>(`/admin/fraud-cases/${caseId}/decision`, body, signal)
}

export async function listAppealsForAdmin(signal?: AbortSignal) {
  return api.get<AdminAppeal[]>('/admin/appeals', signal)
}

export async function getAppealByIdForAdmin(appealId: string, signal?: AbortSignal) {
  return api.get<AdminAppeal>(`/admin/appeals/${appealId}`, signal)
}

export async function updateAppealDecision(appealId: string, body: AppealDecisionInput, signal?: AbortSignal) {
  return api.post<AdminAppeal>(`/admin/appeals/${appealId}/decision`, body, signal)
}

export function logout() {
  clearAuthToken()
}
