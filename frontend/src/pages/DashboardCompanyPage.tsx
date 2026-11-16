import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import {
  Search,
  Filter,
  Plus,
  Users,
  Briefcase,
  TrendingUp,
  Clock,
  ChevronRight,
  MapPin,
  LayoutDashboard,
  GitBranch,
  BarChart2,
  Plug,
  Building2,
  Settings,
  BookmarkCheck,
  Loader2,
  RefreshCw,
} from "lucide-react";
import { DashboardLayout } from "../components/DashboardLayout";
import type { SidebarItem } from "../components/DashboardLayout";
import { useAppContext } from "../contexts/AppContext";
import {
  listRecruiterJobs,
  listApplicationsForRecruiterJob,
  getRecruiterJobCandidateScores,
  type RecruiterJob,
  type RecruiterJobApplication,
  type RecruiterCandidateScore,
} from "../services/raviraApi";

const sidebarItems: SidebarItem[] = [
  { key: "beranda", label: "Dashboard", icon: <LayoutDashboard size={16} />, path: "/dashboard/perusahaan" },
  { key: "pipeline", label: "Kandidat Pipeline", icon: <GitBranch size={16} />, path: "/dashboard/perusahaan/pipeline" },
  { key: "lowongan", label: "Lowongan Aktif", icon: <Briefcase size={16} />, path: "/dashboard/perusahaan/lowongan" },
  { key: "buat", label: "Buat Lowongan", icon: <Plus size={16} />, path: "/dashboard/perusahaan/buat-lowongan" },
  { key: "shortlist", label: "Shortlist Kandidat", icon: <BookmarkCheck size={16} />, path: "/dashboard/perusahaan/shortlist" },
  { key: "analitik", label: "Analitik Rekrutmen", icon: <BarChart2 size={16} />, path: "/dashboard/perusahaan/analitik" },
  { key: "ats", label: "Integrasi ATS", icon: <Plug size={16} />, path: "/dashboard/perusahaan/ats" },
  { key: "profil", label: "Profil Perusahaan", icon: <Building2 size={16} />, path: "/dashboard/perusahaan/profil" },
  { key: "pengaturan", label: "Pengaturan", icon: <Settings size={16} />, path: "/dashboard/perusahaan/pengaturan" },
];

type Stage = "Baru" | "Diulas" | "Interview" | "Offer" | "Ditolak";

type EnrichedApplicant = {
  id: string;
  jobId: string;
  name: string;
  role: string;
  match: number;
  candidateScore?: number;
  location: string;
  exp: string;
  skills: string[];
  status: string;
  createdAt: string;
};

export default function DashboardCompanyPage() {
  const navigate = useNavigate();
  const { user } = useAppContext();
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState<"pipeline" | "jobs">("pipeline");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [jobs, setJobs] = useState<RecruiterJob[]>([]);
  const [applicants, setApplicants] = useState<EnrichedApplicant[]>([]);

  const loadDashboardData = async () => {
    setLoading(true);
    setError(null);
    try {
      const jobList = await listRecruiterJobs();
      setJobs(jobList);

      const allApplicants: EnrichedApplicant[] = [];

      await Promise.all(
        jobList.map(async (j) => {
          try {
            const [rawApps, scores] = await Promise.all([
              listApplicationsForRecruiterJob(j.id).catch(() => [] as RecruiterJobApplication[]),
              getRecruiterJobCandidateScores(j.id).catch(() => [] as RecruiterCandidateScore[]),
            ]);

            const scoreMap = new Map<string, RecruiterCandidateScore>();
            scores.forEach((s) => scoreMap.set(s.applicationId, s));

            rawApps.forEach((app) => {
              const sc = scoreMap.get(app.id);
              allApplicants.push({
                id: app.id,
                jobId: j.id,
                name: app.candidate.user.fullName,
                role: j.title,
                match: sc ? sc.matchScore : 80,
                candidateScore: sc?.candidateScore,
                location: app.candidate.location || "Indonesia",
                exp: app.candidate.experienceSummary || "Pengalaman relevan",
                skills: app.candidate.skills.map((s) => s.skillName),
                status: app.status,
                createdAt: app.createdAt,
              });
            });
          } catch {
            // ignore failure for individual job
          }
        })
      );

      allApplicants.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
      setApplicants(allApplicants);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Gagal memuat data dashboard.";
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    queueMicrotask(() => {
      void loadDashboardData();
    });
  }, []);

  const totalCandidates = applicants.length;
  const activeJobsCount = jobs.filter((j) => j.status === "PUBLISHED").length;
  const avgMatchScore =
    applicants.length > 0
      ? Math.round(applicants.reduce((sum, a) => sum + a.match, 0) / applicants.length)
      : 0;

  const stats = [
    {
      label: "Total Kandidat",
      value: totalCandidates.toString(),
      change: `${totalCandidates} terdaftar`,
      variant: "blue" as const,
      icon: Users,
      path: "/dashboard/perusahaan/pipeline",
    },
    {
      label: "Lowongan Aktif",
      value: activeJobsCount.toString(),
      change: `${activeJobsCount} posisi dibuka`,
      variant: "light" as const,
      icon: Briefcase,
      path: "/dashboard/perusahaan/lowongan",
    },
    {
      label: "Avg Match Score",
      value: avgMatchScore > 0 ? `${avgMatchScore}%` : "-",
      change: avgMatchScore > 0 ? "Rata-rata kecocokan" : "Belum ada pelamar",
      variant: "lime" as const,
      icon: TrendingUp,
      path: "/dashboard/perusahaan/analitik",
    },
    {
      label: "Waktu Rekrut",
      value: "-",
      change: "Dalam pencatatan",
      variant: "dark" as const,
      icon: Clock,
      path: "/dashboard/perusahaan/analitik",
    },
  ];

  const mapToStage = (status: string): Stage => {
    switch (status) {
      case "APPLIED":
        return "Baru";
      case "SCREENING":
      case "SELEKSI_TAHAP_1":
      case "SELEKSI_TAHAP_2":
      case "NEED_VERIFICATION":
        return "Diulas";
      case "INTERVIEW":
        return "Interview";
      case "ACCEPTED":
        return "Offer";
      case "REJECTED":
        return "Ditolak";
      default:
        return "Baru";
    }
  };

  const pipelineColumns: { stage: Stage; candidates: EnrichedApplicant[] }[] = [
    { stage: "Baru", candidates: applicants.filter((a) => mapToStage(a.status) === "Baru") },
    { stage: "Diulas", candidates: applicants.filter((a) => mapToStage(a.status) === "Diulas") },
    { stage: "Interview", candidates: applicants.filter((a) => mapToStage(a.status) === "Interview") },
    { stage: "Offer", candidates: applicants.filter((a) => mapToStage(a.status) === "Offer") },
    { stage: "Ditolak", candidates: applicants.filter((a) => mapToStage(a.status) === "Ditolak") },
  ];

  const filteredPipeline = pipelineColumns.map((col) => ({
    ...col,
    candidates: col.candidates.filter(
      (c) =>
        c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.role.toLowerCase().includes(searchQuery.toLowerCase())
    ),
  }));

  const latestApplicant = applicants[0] || null;

  const userName = user?.fullName || "Recruiter";
  const userRole = `${user?.recruiter?.position || "HR Recruiter"} · ${user?.recruiter?.company?.name || "Perusahaan"}`;
  const userInitial = (user?.fullName || "R").charAt(0).toUpperCase();

  return (
    <DashboardLayout
      sidebarItems={sidebarItems}
      userName={userName}
      userRole={userRole}
      userInitial={userInitial}
    >
      {/* Framed Hero Banner matching Beranda */}
      <section
        style={{
          borderRadius: 26,
          background: "linear-gradient(180deg, #0849A8 0%, #0E67CC 52%, #2B8CFF 100%)",
          padding: "28px 30px",
          marginBottom: 24,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: 16,
          boxShadow: "0 16px 40px rgba(8, 73, 168, 0.12)",
        }}
      >
        <div>
          <p
            style={{
              fontFamily: "'Poppins', sans-serif",
              fontSize: 11,
              fontWeight: 600,
              color: "#D4FF59",
              letterSpacing: "0.18em",
              textTransform: "uppercase",
              margin: "0 0 8px",
            }}
          >
            Portal Perusahaan
          </p>
          <h1
            style={{
              fontFamily: "'Poppins', sans-serif",
              fontSize: "clamp(24px, 3vw, 32px)",
              fontWeight: 600,
              color: "#FFFFFF",
              letterSpacing: "-0.03em",
              margin: "0 0 6px",
              lineHeight: 1.15,
            }}
          >
            Dashboard Rekrutmen
          </h1>
          <p
            style={{
              fontFamily: "'Inter', sans-serif",
              fontSize: 14.5,
              color: "rgba(255, 255, 255, 0.9)",
              margin: 0,
            }}
          >
            Selamat datang, {user?.fullName || "Recruiter"}{" "}
            {user?.recruiter?.company?.name ? `(${user.recruiter.company.name})` : ""} — terdapat{" "}
            {applicants.length} lamaran kandidat yang terhubung dengan lowongan Anda.
          </p>
        </div>
        <button
          type="button"
          onClick={() => navigate("/dashboard/perusahaan/buat-lowongan")}
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 8,
            padding: "12px 24px",
            minHeight: 44,
            borderRadius: 999,
            border: "none",
            background: "#D4FF59",
            fontFamily: "'Inter', sans-serif",
            fontSize: 12,
            fontWeight: 700,
            letterSpacing: "0.06em",
            textTransform: "uppercase",
            color: "#0D1117",
            cursor: "pointer",
          }}
        >
          <Plus size={15} /> Buat Lowongan Baru
        </button>
      </section>

      {loading ? (
        <div
          style={{
            background: "#F4F5F7",
            borderRadius: 24,
            padding: 60,
            textAlign: "center",
            border: "1px solid #E2E8F0",
            marginBottom: 24,
          }}
        >
          <Loader2 size={32} className="animate-spin" color="#0E67CC" style={{ margin: "0 auto 16px" }} />
          <p style={{ fontFamily: "'Inter', sans-serif", fontSize: 14, color: "#4A5568" }}>
            Memuat ringkasan rekrutmen perusahaan...
          </p>
        </div>
      ) : error ? (
        <div
          style={{
            background: "#FEF2F2",
            borderRadius: 24,
            padding: 32,
            textAlign: "center",
            border: "1px solid #FECACA",
            marginBottom: 24,
          }}
        >
          <p style={{ fontFamily: "'Inter', sans-serif", fontSize: 14, color: "#991B1B", marginBottom: 16 }}>
            {error}
          </p>
          <button
            type="button"
            onClick={() => {
              void loadDashboardData();
            }}
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 6,
              padding: "10px 20px",
              minHeight: 42,
              borderRadius: 999,
              border: "none",
              background: "#0D1117",
              color: "#D4FF59",
              cursor: "pointer",
              fontFamily: "'Inter', sans-serif",
              fontSize: 13,
              fontWeight: 700,
            }}
          >
            <RefreshCw size={14} /> Muat Ulang
          </button>
        </div>
      ) : (
        <>
          {/* Bento Stats */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
              gap: 16,
              marginBottom: 24,
            }}
          >
            {stats.map((s) => {
              const Icon = s.icon;
              const isBlue = s.variant === "blue";
              const isLime = s.variant === "lime";
              const isDark = s.variant === "dark";

              const bg = isBlue
                ? "linear-gradient(180deg, #0E67CC 0%, #2B8CFF 100%)"
                : isLime
                  ? "#D4FF59"
                  : isDark
                    ? "#0D1117"
                    : "#F4F5F7";

              const valColor = isBlue || isDark ? "#FFFFFF" : "#0D1117";
              const subColor = isBlue
                ? "rgba(255, 255, 255, 0.88)"
                : isDark
                  ? "#CBD5E1"
                  : "#4A5568";
              const iconBg = isBlue || isDark ? "#FFFFFF" : "#0D1117";
              const iconColor = isBlue || isDark ? "#0D1117" : "#D4FF59";

              return (
                <button
                  key={s.label}
                  type="button"
                  onClick={() => navigate(s.path)}
                  style={{
                    background: bg,
                    borderRadius: 22,
                    border: s.variant === "light" ? "1px solid #E2E8F0" : "none",
                    padding: "20px",
                    textAlign: "left",
                    cursor: "pointer",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "space-between",
                    minHeight: 152,
                    transition: "transform 0.15s ease",
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.transform = "translateY(-3px)")}
                  onMouseLeave={(e) => (e.currentTarget.style.transform = "translateY(0)")}
                >
                  <div
                    aria-hidden="true"
                    style={{
                      width: 38,
                      height: 38,
                      borderRadius: 12,
                      background: iconBg,
                      color: iconColor,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      marginBottom: 14,
                    }}
                  >
                    <Icon size={18} />
                  </div>
                  <div>
                    <div
                      style={{
                        fontFamily: "'Poppins', sans-serif",
                        fontSize: 28,
                        fontWeight: 600,
                        color: valColor,
                        lineHeight: 1.05,
                        letterSpacing: "-0.03em",
                        marginBottom: 4,
                      }}
                    >
                      {s.value}
                    </div>
                    <div
                      style={{
                        fontFamily: "'Poppins', sans-serif",
                        fontSize: 13,
                        fontWeight: 600,
                        color: valColor,
                        marginBottom: 2,
                      }}
                    >
                      {s.label}
                    </div>
                    <div
                      style={{
                        fontFamily: "'Inter', sans-serif",
                        fontSize: 12,
                        color: subColor,
                      }}
                    >
                      {s.change}
                    </div>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Pelamar Terbaru */}
          <div
            style={{
              background: "#F4F5F7",
              borderRadius: 24,
              border: "1px solid #E2E8F0",
              padding: "24px",
              marginBottom: 24,
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: 18,
              }}
            >
              <h2
                style={{
                  fontFamily: "'Poppins', sans-serif",
                  fontSize: 18,
                  fontWeight: 600,
                  color: "#0D1117",
                  margin: 0,
                }}
              >
                Pelamar Terbaru
              </h2>
              <span style={{ fontFamily: "'Inter', sans-serif", fontSize: 12.5, color: "#4A5568" }}>
                {latestApplicant ? "Lamaran terakhir masuk" : "Belum ada pelamar"}
              </span>
            </div>

            {latestApplicant ? (
              <div
                style={{
                  padding: "20px",
                  borderRadius: 18,
                  border: "1px solid #E2E8F0",
                  background: "#FFFFFF",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "flex-start",
                    gap: 12,
                    marginBottom: 14,
                    flexWrap: "wrap",
                  }}
                >
                  <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
                    <div
                      aria-hidden="true"
                      style={{
                        width: 44,
                        height: 44,
                        borderRadius: "50%",
                        background: "#0D1117",
                        color: "#D4FF59",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontFamily: "'Poppins', sans-serif",
                        fontSize: 16,
                        fontWeight: 700,
                        flexShrink: 0,
                      }}
                    >
                      {latestApplicant.name.charAt(0)}
                    </div>
                    <div>
                      <div
                        style={{
                          fontFamily: "'Poppins', sans-serif",
                          fontSize: 15,
                          fontWeight: 600,
                          color: "#0D1117",
                        }}
                      >
                        {latestApplicant.name}
                      </div>
                      <div
                        style={{
                          fontFamily: "'Inter', sans-serif",
                          fontSize: 13,
                          color: "#4A5568",
                        }}
                      >
                        {latestApplicant.role} · {latestApplicant.location}
                      </div>
                    </div>
                  </div>
                  <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
                    <span
                      style={{
                        padding: "4px 12px",
                        borderRadius: 999,
                        background: "#F4F5F7",
                        border: "1px solid #E2E8F0",
                        fontFamily: "'Inter', sans-serif",
                        fontSize: 11.5,
                        fontWeight: 600,
                        color: "#0D1117",
                      }}
                    >
                      {latestApplicant.status}
                    </span>
                    <div
                      style={{
                        fontFamily: "'Poppins', sans-serif",
                        fontSize: 20,
                        fontWeight: 700,
                        color: "#0E67CC",
                      }}
                    >
                      {latestApplicant.match}%
                    </div>
                  </div>
                </div>
                {latestApplicant.skills.length > 0 && (
                  <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginBottom: 14 }}>
                    {latestApplicant.skills.map((s) => (
                      <span
                        key={s}
                        style={{
                          padding: "4px 10px",
                          borderRadius: 999,
                          background: "#F4F5F7",
                          border: "1px solid #E2E8F0",
                          fontFamily: "'Inter', sans-serif",
                          fontSize: 11.5,
                          fontWeight: 500,
                          color: "#0D1117",
                        }}
                      >
                        {s}
                      </span>
                    ))}
                  </div>
                )}
                <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
                  <button
                    type="button"
                    onClick={() => navigate(`/dashboard/perusahaan/kandidat/${latestApplicant.id}`)}
                    style={{
                      flex: 1,
                      minHeight: 42,
                      padding: "8px 16px",
                      borderRadius: 999,
                      border: "1px solid #CBD5E1",
                      background: "#FFFFFF",
                      fontFamily: "'Inter', sans-serif",
                      fontSize: 13,
                      fontWeight: 600,
                      color: "#0D1117",
                      cursor: "pointer",
                    }}
                  >
                    Lihat Profil Pelamar
                  </button>
                  <button
                    type="button"
                    onClick={() => navigate(`/dashboard/perusahaan/kandidat/${latestApplicant.id}`)}
                    style={{
                      flex: 1,
                      minHeight: 42,
                      padding: "8px 16px",
                      borderRadius: 999,
                      border: "none",
                      background: "#0D1117",
                      fontFamily: "'Inter', sans-serif",
                      fontSize: 13,
                      fontWeight: 700,
                      color: "#D4FF59",
                      cursor: "pointer",
                    }}
                  >
                    Proses Seleksi
                  </button>
                </div>
              </div>
            ) : (
              <div
                style={{
                  padding: "28px",
                  textAlign: "center",
                  background: "#FFFFFF",
                  borderRadius: 18,
                  border: "1px solid #E2E8F0",
                }}
              >
                <p style={{ fontFamily: "'Inter', sans-serif", fontSize: 13.5, color: "#4A5568", margin: 0 }}>
                  Belum ada kandidat yang melamar ke lowongan perusahaan Anda.
                </p>
              </div>
            )}
          </div>

          {/* Pill Tabs */}
          <div
            style={{
              display: "inline-flex",
              gap: 4,
              marginBottom: 20,
              background: "#F4F5F7",
              borderRadius: 999,
              padding: 4,
              border: "1px solid #E2E8F0",
            }}
          >
            {[
              { key: "pipeline", label: "Kandidat Pipeline" },
              { key: "jobs", label: "Lowongan Perusahaan" },
            ].map((t) => (
              <button
                key={t.key}
                type="button"
                onClick={() => setActiveTab(t.key as "pipeline" | "jobs")}
                style={{
                  padding: "9px 20px",
                  minHeight: 38,
                  borderRadius: 999,
                  border: "none",
                  cursor: "pointer",
                  fontFamily: "'Inter', sans-serif",
                  fontSize: 13,
                  fontWeight: 600,
                  background: activeTab === t.key ? "#0D1117" : "transparent",
                  color: activeTab === t.key ? "#D4FF59" : "#4A5568",
                  transition: "all 0.15s ease",
                }}
              >
                {t.label}
              </button>
            ))}
          </div>

          {activeTab === "pipeline" && (
            <div>
              <div style={{ display: "flex", gap: 10, marginBottom: 18, flexWrap: "wrap" }}>
                <div
                  style={{
                    flex: 1,
                    minWidth: 240,
                    display: "flex",
                    alignItems: "center",
                    gap: 8,
                    background: "#F4F5F7",
                    borderRadius: 999,
                    border: "1px solid #E2E8F0",
                    padding: "10px 18px",
                  }}
                >
                  <Search size={15} color="#4A5568" />
                  <input
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Cari nama kandidat atau posisi..."
                    style={{
                      flex: 1,
                      border: "none",
                      outline: "none",
                      fontFamily: "'Inter', sans-serif",
                      fontSize: 14,
                      color: "#0D1117",
                      background: "transparent",
                    }}
                  />
                </div>
                <button
                  type="button"
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: 6,
                    padding: "10px 18px",
                    minHeight: 42,
                    borderRadius: 999,
                    border: "1px solid #E2E8F0",
                    background: "#F4F5F7",
                    fontFamily: "'Inter', sans-serif",
                    fontSize: 13,
                    fontWeight: 600,
                    color: "#0D1117",
                    cursor: "pointer",
                  }}
                >
                  <Filter size={14} /> Filter
                </button>
              </div>

              {/* Kanban board */}
              <div
                className="ravira-no-scrollbar"
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(5, minmax(210px, 1fr))",
                  gap: 14,
                  overflowX: "auto",
                }}
              >
                {filteredPipeline.map((col) => (
                  <div
                    key={col.stage}
                    style={{
                      background: "#F4F5F7",
                      borderRadius: 20,
                      border: "1px solid #E2E8F0",
                      padding: 14,
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        marginBottom: 12,
                      }}
                    >
                      <span
                        style={{
                          fontFamily: "'Poppins', sans-serif",
                          fontSize: 13.5,
                          fontWeight: 600,
                          color: "#0D1117",
                        }}
                      >
                        {col.stage}
                      </span>
                      <span
                        style={{
                          fontFamily: "'Inter', sans-serif",
                          fontSize: 11.5,
                          fontWeight: 700,
                          color: "#0D1117",
                          background: "#D4FF59",
                          borderRadius: 999,
                          padding: "2px 9px",
                        }}
                      >
                        {col.candidates.length}
                      </span>
                    </div>
                    <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                      {col.candidates.map((c) => (
                        <div
                          key={c.id}
                          onClick={() => navigate(`/dashboard/perusahaan/kandidat/${c.id}`)}
                          style={{
                            background: "#FFFFFF",
                            borderRadius: 16,
                            border: "1px solid #E2E8F0",
                            padding: "14px",
                            cursor: "pointer",
                            transition: "transform 0.15s ease",
                          }}
                        >
                          <div
                            style={{
                              display: "flex",
                              justifyContent: "space-between",
                              alignItems: "center",
                              marginBottom: 10,
                            }}
                          >
                            <div
                              aria-hidden="true"
                              style={{
                                width: 32,
                                height: 32,
                                borderRadius: "50%",
                                background: "#0D1117",
                                color: "#D4FF59",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                fontFamily: "'Poppins', sans-serif",
                                fontSize: 13,
                                fontWeight: 700,
                              }}
                            >
                              {c.name.charAt(0)}
                            </div>
                            <span
                              style={{
                                fontFamily: "'Poppins', sans-serif",
                                fontSize: 12.5,
                                fontWeight: 700,
                                color: "#0E67CC",
                              }}
                            >
                              {c.match}%
                            </span>
                          </div>
                          <div
                            style={{
                              fontFamily: "'Poppins', sans-serif",
                              fontSize: 13.5,
                              fontWeight: 600,
                              color: "#0D1117",
                              marginBottom: 2,
                            }}
                          >
                            {c.name}
                          </div>
                          <div
                            style={{
                              fontFamily: "'Inter', sans-serif",
                              fontSize: 12,
                              color: "#4A5568",
                              marginBottom: 8,
                            }}
                          >
                            {c.role}
                          </div>
                          <div
                            style={{
                              display: "flex",
                              alignItems: "center",
                              gap: 4,
                              color: "#4A5568",
                              fontSize: 11.5,
                            }}
                          >
                            <MapPin size={11} />
                            <span>{c.location}</span>
                          </div>
                        </div>
                      ))}
                      {col.candidates.length === 0 && (
                        <div
                          style={{
                            padding: "18px 12px",
                            borderRadius: 14,
                            background: "#FFFFFF",
                            border: "1px dashed #CBD5E1",
                            textAlign: "center",
                            color: "#4A5568",
                            fontFamily: "'Inter', sans-serif",
                            fontSize: 12,
                          }}
                        >
                          Kosong
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === "jobs" && (
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              {jobs.length === 0 ? (
                <div
                  style={{
                    background: "#F4F5F7",
                    borderRadius: 22,
                    padding: "40px 20px",
                    textAlign: "center",
                    border: "1px solid #E2E8F0",
                  }}
                >
                  <p
                    style={{
                      fontFamily: "'Inter', sans-serif",
                      fontSize: 14,
                      color: "#4A5568",
                      marginBottom: 14,
                    }}
                  >
                    Belum ada lowongan pekerjaan yang dibuat.
                  </p>
                  <button
                    type="button"
                    onClick={() => navigate("/dashboard/perusahaan/buat-lowongan")}
                    style={{
                      padding: "10px 22px",
                      minHeight: 42,
                      borderRadius: 999,
                      border: "none",
                      background: "#0D1117",
                      color: "#D4FF59",
                      fontFamily: "'Inter', sans-serif",
                      fontSize: 13,
                      fontWeight: 700,
                      cursor: "pointer",
                    }}
                  >
                    Buat Lowongan Pertama
                  </button>
                </div>
              ) : (
                jobs.map((job) => (
                  <div
                    key={job.id}
                    style={{
                      background: "#F4F5F7",
                      borderRadius: 20,
                      border: "1px solid #E2E8F0",
                      padding: "20px 24px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      flexWrap: "wrap",
                      gap: 16,
                    }}
                  >
                    <div style={{ flex: 1, minWidth: 200 }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 6 }}>
                        <span
                          style={{
                            fontFamily: "'Poppins', sans-serif",
                            fontSize: 15,
                            fontWeight: 600,
                            color: "#0D1117",
                          }}
                        >
                          {job.title}
                        </span>
                        <span
                          style={{
                            fontFamily: "'Inter', sans-serif",
                            fontSize: 11,
                            fontWeight: 700,
                            color: job.status === "PUBLISHED" ? "#0D1117" : "#4A5568",
                            background: job.status === "PUBLISHED" ? "#D4FF59" : "#FFFFFF",
                            border: "1px solid #E2E8F0",
                            borderRadius: 999,
                            padding: "2px 10px",
                          }}
                        >
                          {job.status}
                        </span>
                      </div>
                      <div style={{ display: "flex", gap: 20, flexWrap: "wrap" }}>
                        <span style={{ fontFamily: "'Inter', sans-serif", fontSize: 13, color: "#4A5568" }}>
                          Lokasi: {job.location || "Remote / Onsite"}
                        </span>
                        <span style={{ fontFamily: "'Inter', sans-serif", fontSize: 13, color: "#4A5568" }}>
                          Tipe: {job.jobType || "Full-time"}
                        </span>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => navigate(`/dashboard/perusahaan/pipeline?jobId=${job.id}`)}
                      style={{
                        display: "inline-flex",
                        alignItems: "center",
                        gap: 6,
                        padding: "10px 18px",
                        minHeight: 40,
                        borderRadius: 999,
                        border: "none",
                        background: "#0D1117",
                        fontFamily: "'Inter', sans-serif",
                        fontSize: 12.5,
                        fontWeight: 700,
                        color: "#D4FF59",
                        cursor: "pointer",
                      }}
                    >
                      Lihat Pipeline <ChevronRight size={13} />
                    </button>
                  </div>
                ))
              )}
            </div>
          )}
        </>
      )}
    </DashboardLayout>
  );
}
