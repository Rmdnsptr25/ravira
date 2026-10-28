import { createBrowserRouter } from "react-router";
import LandingPage from "./pages/LandingPage";
import FiturPage from "./pages/FiturPage";
import UntukKandidatPage from "./pages/UntukKandidatPage";
import UntukPerusahaanPage from "./pages/UntukPerusahaanPage";
import UntukPemerintahPage from "./pages/UntukPemerintahPage";
import UntukPerusahaanLowonganPage from "./pages/UntukPerusahaanLowonganPage";
import UntukPerusahaanProdukPage from "./pages/UntukPerusahaanProdukPage";
import UntukPerusahaanSolusiRekrutmenPage from "./pages/UntukPerusahaanSolusiRekrutmenPage";
import UntukPerusahaanInsightRekrutmenPage from "./pages/UntukPerusahaanInsightRekrutmenPage";
import UntukPemerintahAnalyticsPage from "./pages/UntukPemerintahAnalyticsPage";
import UntukPemerintahTrenSkillPage from "./pages/UntukPemerintahTrenSkillPage";
import UntukPemerintahHeatmapPage from "./pages/UntukPemerintahHeatmapPage";
import UntukPemerintahLaporanPage from "./pages/UntukPemerintahLaporanPage";
import PublicAnalyticsPage from "./pages/PublicAnalyticsPage";
import TentangPage from "./pages/TentangPage";
import KontakPage from "./pages/KontakPage";
import { ProtectedRoute } from "./components/ProtectedRoute";
import LoginAdminPage from "./pages/LoginAdminPage";
import LoginKandidatPage from "./pages/LoginKandidatPage";
import LoginPerusahaanPage from "./pages/LoginPerusahaanPage";
import LoginPemerintahPage from "./pages/LoginPemerintahPage";


// Kandidat
import RegisterCandidatePage from "./pages/RegisterCandidatePage";
import OnboardingCandidatePage from "./pages/OnboardingCandidatePage";
import DashboardCandidatePage from "./pages/DashboardCandidatePage";
import JobRecommendationsPage from "./pages/JobRecommendationsPage";
import JobDetailPage from "./pages/JobDetailPage";
import SavedJobsPage from "./pages/SavedJobsPage";
import SkillGapPage from "./pages/SkillGapPage";
import TrainingPage from "./pages/TrainingPage";
import MyApplicationsPage from "./pages/MyApplicationsPage";
import ApplicationDetailPage from "./pages/ApplicationDetailPage";
import CrossRegionPage from "./pages/CrossRegionPage";
import CrossRegionDetailPage from "./pages/CrossRegionDetailPage";
import CourseDetailPage from "./pages/CourseDetailPage";
import CandidateSelfProfilePage from "./pages/CandidateSelfProfilePage";
import PrivacySettingsPage from "./pages/PrivacySettingsPage";

// Perusahaan / Recruiter
import RegisterCompanyPage from "./pages/RegisterCompanyPage";
import OnboardingCompanyPage from "./pages/OnboardingCompanyPage";
import DashboardCompanyPage from "./pages/DashboardCompanyPage";
import PipelinePage from "./pages/PipelinePage";
import ActiveJobsPage from "./pages/ActiveJobsPage";
import CreateJobPage from "./pages/CreateJobPage";
import ShortlistPage from "./pages/ShortlistPage";
import RecruitmentAnalyticsPage from "./pages/RecruitmentAnalyticsPage";
import ATSIntegrationPage from "./pages/ATSIntegrationPage";
import CompanyProfilePage from "./pages/CompanyProfilePage";
import CompanySettingsPage from "./pages/CompanySettingsPage";
import CandidatesListPage from "./pages/CandidatesListPage";
import CandidateProfilePage from "./pages/CandidateProfilePage";

// Pemerintah / Institusi (Analytics)
import RegisterGovernmentPage from "./pages/RegisterGovernmentPage";
import VerificationPendingPage from "./pages/VerificationPendingPage";
import DashboardAnalyticsPage from "./pages/DashboardAnalyticsPage";
import WorkforceAnalyticsPage from "./pages/WorkforceAnalyticsPage";
import RegionalHeatmapPage from "./pages/RegionalHeatmapPage";
import SkillTrendPage from "./pages/SkillTrendPage";
import CompetensiProjectionPage from "./pages/CompetensiProjectionPage";
import TrainingProgramRecommendationPage from "./pages/TrainingProgramRecommendationPage";
import ReportsExportPage from "./pages/ReportsExportPage";
import AnalyticsSettingsPage from "./pages/AnalyticsSettingsPage";
import RegionalDetailPage from "./pages/RegionalDetailPage";

// Admin Internal
import AdminDashboardPage from "./pages/AdminDashboardPage";
import AdminVerifikasiPage from "./pages/AdminVerifikasiPage";
import AdminModerasiPage from "./pages/AdminModerasiPage";
import AdminAbuseReportPage from "./pages/AdminAbuseReportPage";
import AdminMonitoringPage from "./pages/AdminMonitoringPage";
import AdminAuditLogPage from "./pages/AdminAuditLogPage";
import AdminModelAIPage from "./pages/AdminModelAIPage";
import AdminUserManagementPage from "./pages/AdminUserManagementPage";
import AdminSettingsPage from "./pages/AdminSettingsPage";

const routes = [
  { path: "/", Component: LandingPage },
  { path: "/fitur", Component: FiturPage },
  { path: "/untuk-kandidat", Component: UntukKandidatPage },
  { path: "/untuk-perusahaan", Component: UntukPerusahaanPage },
  { path: "/untuk-perusahaan/lowongan", Component: UntukPerusahaanLowonganPage },
  { path: "/untuk-perusahaan/produk", Component: UntukPerusahaanProdukPage },
  { path: "/untuk-perusahaan/solusi-rekrutmen", Component: UntukPerusahaanSolusiRekrutmenPage },
  { path: "/untuk-perusahaan/insight-rekrutmen", Component: UntukPerusahaanInsightRekrutmenPage },
  { path: "/untuk-pemerintah", Component: UntukPemerintahPage },
  { path: "/untuk-pemerintah/analytics", Component: UntukPemerintahAnalyticsPage },
  { path: "/untuk-pemerintah/tren-skill", Component: UntukPemerintahTrenSkillPage },
  { path: "/untuk-pemerintah/heatmap", Component: UntukPemerintahHeatmapPage },
  { path: "/untuk-pemerintah/laporan", Component: UntukPemerintahLaporanPage },
  { path: "/analytics", Component: PublicAnalyticsPage },
  { path: "/tentang", Component: TentangPage },
  { path: "/kontak", Component: KontakPage },
  { path: "/masuk/admin", Component: LoginAdminPage },
  { path: "/masuk", Component: LoginKandidatPage },
  { path: "/masuk/kandidat", Component: LoginKandidatPage },
  { path: "/masuk/perusahaan", Component: LoginPerusahaanPage },
  { path: "/masuk/pemerintah", Component: LoginPemerintahPage },
  { path: "/daftar", Component: RegisterCandidatePage },

  // ── Kandidat ──────────────────────────────────────────────
  { path: "/daftar/kandidat", Component: RegisterCandidatePage },
  { path: "/daftar/kandidat/onboarding", Component: OnboardingCandidatePage },
  { path: "/dashboard/kandidat", Component: DashboardCandidatePage },
  { path: "/dashboard/kandidat/pekerjaan", Component: JobRecommendationsPage },
  { path: "/dashboard/kandidat/rekomendasi", Component: JobRecommendationsPage },
  { path: "/dashboard/kandidat/pekerjaan/:id", Component: JobDetailPage },
  { path: "/dashboard/kandidat/detail-pekerjaan", Component: JobDetailPage },
  { path: "/dashboard/kandidat/tersimpan", Component: SavedJobsPage },
  { path: "/dashboard/kandidat/skill-gap", Component: SkillGapPage },
  { path: "/dashboard/kandidat/pelatihan", Component: TrainingPage },
  { path: "/dashboard/kandidat/detail-kursus", Component: CourseDetailPage },
  { path: "/dashboard/kandidat/lamaran", Component: MyApplicationsPage },
  { path: "/dashboard/kandidat/lamaran/:id", Component: ApplicationDetailPage },
  { path: "/dashboard/kandidat/detail-lamaran", Component: ApplicationDetailPage },
  { path: "/dashboard/kandidat/peluang", Component: CrossRegionPage },
  { path: "/dashboard/kandidat/cross-region", Component: CrossRegionPage },
  { path: "/dashboard/kandidat/detail-cross-region", Component: CrossRegionDetailPage },
  { path: "/dashboard/kandidat/profil", Component: CandidateSelfProfilePage },
  { path: "/dashboard/kandidat/pengaturan", Component: PrivacySettingsPage },
  { path: "/dashboard/kandidat/privasi", Component: PrivacySettingsPage },

  // ── Perusahaan / Recruiter ────────────────────────────────
  { path: "/daftar/perusahaan", Component: RegisterCompanyPage },
  { path: "/daftar/perusahaan/onboarding", Component: OnboardingCompanyPage },
  { path: "/dashboard/perusahaan", Component: DashboardCompanyPage },
  { path: "/dashboard/perusahaan/pipeline", Component: PipelinePage },
  { path: "/dashboard/perusahaan/lowongan", Component: ActiveJobsPage },
  { path: "/dashboard/perusahaan/buat-lowongan", Component: CreateJobPage },
  { path: "/dashboard/perusahaan/shortlist", Component: ShortlistPage },
  { path: "/dashboard/perusahaan/analitik", Component: RecruitmentAnalyticsPage },
  { path: "/dashboard/perusahaan/integrasi-ats", Component: ATSIntegrationPage },
  { path: "/dashboard/perusahaan/ats", Component: ATSIntegrationPage },
  { path: "/dashboard/perusahaan/profil", Component: CompanyProfilePage },
  { path: "/dashboard/perusahaan/pengaturan", Component: CompanySettingsPage },
  { path: "/dashboard/perusahaan/kandidat", Component: CandidatesListPage },
  { path: "/dashboard/perusahaan/kandidat/:id", Component: CandidateProfilePage },
  { path: "/dashboard/perusahaan/detail-kandidat", Component: CandidateProfilePage },

  // ── Pemerintah / Institusi (Analytics) ───────────────────
  { path: "/daftar/pemerintah", Component: RegisterGovernmentPage },
  { path: "/daftar/pemerintah/verifikasi", Component: VerificationPendingPage },
  { path: "/dashboard/analytics", Component: DashboardAnalyticsPage },
  { path: "/dashboard/analytics/workforce", Component: WorkforceAnalyticsPage },
  { path: "/dashboard/analytics/heatmap", Component: RegionalHeatmapPage },
  { path: "/dashboard/analytics/tren-skill", Component: SkillTrendPage },
  { path: "/dashboard/analytics/proyeksi", Component: CompetensiProjectionPage },
  { path: "/dashboard/analytics/rekomendasi-program", Component: TrainingProgramRecommendationPage },
  { path: "/dashboard/analytics/program-pelatihan", Component: TrainingProgramRecommendationPage },
  { path: "/dashboard/analytics/laporan", Component: ReportsExportPage },
  { path: "/dashboard/analytics/pengaturan", Component: AnalyticsSettingsPage },
  { path: "/dashboard/analytics/detail-wilayah", Component: RegionalDetailPage },

  // ── Admin Internal Ravira ──────────────────────────────────
  { path: "/admin", Component: AdminDashboardPage },
  { path: "/dashboard/admin", Component: AdminDashboardPage },
  { path: "/dashboard/admin/verifikasi-perusahaan", Component: AdminVerifikasiPage },
  { path: "/dashboard/admin/moderasi-lowongan", Component: AdminModerasiPage },
  { path: "/dashboard/admin/laporan-abuse", Component: AdminAbuseReportPage },
  { path: "/dashboard/admin/monitoring-integrasi", Component: AdminMonitoringPage },
  { path: "/dashboard/admin/audit-log", Component: AdminAuditLogPage },
  { path: "/dashboard/admin/model-ai", Component: AdminModelAIPage },
  { path: "/dashboard/admin/user-management", Component: AdminUserManagementPage },
  { path: "/dashboard/admin/pengaturan", Component: AdminSettingsPage },
];

export const router = createBrowserRouter([
  ...routes.filter(route => !isPrivate(route.path)),
  { Component: ProtectedRoute, children: routes.filter(route => isPrivate(route.path)) },
]);

function isPrivate(path: string) {
  return path === "/admin" || path.startsWith("/dashboard/") || path.endsWith("/onboarding");
}
