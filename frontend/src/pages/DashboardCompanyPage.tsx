import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { Search, Filter, Plus, Users, Briefcase, TrendingUp, Clock, MoreHorizontal, ChevronRight, Star, MapPin, LayoutDashboard, GitBranch, BarChart2, Plug, Building2, Settings, BookmarkCheck, Loader2, RefreshCw } from "lucide-react";
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

      // Sort applicants by createdAt desc
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
    { label: "Total Kandidat", value: totalCandidates.toString(), change: `${totalCandidates} terdaftar`, color: "#1677FF", icon: Users, path: "/dashboard/perusahaan/pipeline" },
    { label: "Lowongan Aktif", value: activeJobsCount.toString(), change: `${activeJobsCount} posisi dibuka`, color: "#10d98e", icon: Briefcase, path: "/dashboard/perusahaan/lowongan" },
    { label: "Avg Match Score", value: avgMatchScore > 0 ? `${avgMatchScore}%` : "-", change: avgMatchScore > 0 ? "Rata-rata kecocokan" : "Belum ada pelamar", color: "#f59e0b", icon: TrendingUp, path: "/dashboard/perusahaan/analitik" },
    { label: "Waktu Rekrut", value: "-", change: "Dalam pencatatan", color: "#8b5cf6", icon: Clock, path: "/dashboard/perusahaan/analitik" },
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

  const pipelineColumns: { stage: Stage; color: string; candidates: EnrichedApplicant[] }[] = [
    { stage: "Baru", color: "#6a88b8", candidates: applicants.filter((a) => mapToStage(a.status) === "Baru") },
    { stage: "Diulas", color: "#1677FF", candidates: applicants.filter((a) => mapToStage(a.status) === "Diulas") },
    { stage: "Interview", color: "#f59e0b", candidates: applicants.filter((a) => mapToStage(a.status) === "Interview") },
    { stage: "Offer", color: "#10d98e", candidates: applicants.filter((a) => mapToStage(a.status) === "Offer") },
    { stage: "Ditolak", color: "#ff6b6b", candidates: applicants.filter((a) => mapToStage(a.status) === "Ditolak") },
  ];

  const filteredPipeline = pipelineColumns.map((col) => ({
    ...col,
    candidates: col.candidates.filter((c) =>
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
      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
        <div>
          <h1 style={{ fontFamily: "'Poppins', sans-serif", fontSize: 22, fontWeight: 800, color: "#0A1B3D", marginBottom: 4 }}>
            Dashboard Rekrutmen
          </h1>
          <p style={{ fontFamily: "'Inter', sans-serif", fontSize: 14, color: "#6a88b8" }}>
            Selamat datang, {user?.fullName || "Recruiter"}! {user?.recruiter?.company?.name ? `(${user.recruiter.company.name})` : ""}{" "}
            Ada {applicants.length} lamaran kandidat yang terhubung dengan lowongan Anda.
          </p>
        </div>
        <button onClick={() => navigate("/dashboard/perusahaan/buat-lowongan")} style={{ display: "flex", alignItems: "center", gap: 8, padding: "10px 18px", borderRadius: 12, border: "none", background: "linear-gradient(135deg, #1677FF, #0D47A1)", fontFamily: "'Poppins', sans-serif", fontSize: 13, fontWeight: 700, color: "#fff", cursor: "pointer", boxShadow: "0 4px 14px rgba(22,119,255,0.4)" }}>
          <Plus size={15} /> Buat Lowongan Baru
        </button>
      </div>

      {loading ? (
        <div style={{ background: "#fff", borderRadius: 18, padding: 60, textAlign: "center", border: "1px solid rgba(22,119,255,0.1)", marginBottom: 24 }}>
          <Loader2 size={32} className="animate-spin" color="#1677FF" style={{ margin: "0 auto 16px" }} />
          <p style={{ fontFamily: "'Inter', sans-serif", fontSize: 14, color: "#6a88b8" }}>Memuat ringkasan rekrutmen perusahaan...</p>
        </div>
      ) : error ? (
        <div style={{ background: "#fff", borderRadius: 18, padding: 32, textAlign: "center", border: "1px solid rgba(255,107,107,0.2)", marginBottom: 24 }}>
          <p style={{ fontFamily: "'Inter', sans-serif", fontSize: 14, color: "#ff6b6b", marginBottom: 16 }}>{error}</p>
          <button
            onClick={() => { void loadDashboardData(); }}
            style={{ display: "inline-flex", alignItems: "center", gap: 6, padding: "8px 16px", borderRadius: 8, border: "1px solid #1677FF", background: "#f0f7ff", color: "#1677FF", cursor: "pointer", fontFamily: "'Inter', sans-serif", fontSize: 13, fontWeight: 600 }}
          >
            <RefreshCw size={14} /> Muat Ulang
          </button>
        </div>
      ) : (
        <>
          {/* Stats */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 14, marginBottom: 24 }}>
            {stats.map((s) => (
              <div key={s.label} onClick={() => navigate(s.path)} style={{ background: "#fff", borderRadius: 16, border: "1px solid rgba(22,119,255,0.1)", boxShadow: "0 2px 10px rgba(10,27,61,0.04)", padding: "18px 20px", cursor: "pointer", transition: "transform 0.15s" }}
                onMouseEnter={(e) => (e.currentTarget.style.transform = "translateY(-2px)")}
                onMouseLeave={(e) => (e.currentTarget.style.transform = "translateY(0)")}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 10 }}>
                  <div style={{ width: 36, height: 36, borderRadius: 10, background: `${s.color}14`, display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <s.icon size={18} color={s.color} />
                  </div>
                </div>
                <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 26, fontWeight: 800, color: "#0A1B3D", lineHeight: 1 }}>{s.value}</div>
                <div style={{ fontFamily: "'Inter', sans-serif", fontSize: 12, color: "#6a88b8", marginTop: 4 }}>{s.label}</div>
                <div style={{ fontFamily: "'Inter', sans-serif", fontSize: 11, color: s.color, marginTop: 4, fontWeight: 500 }}>{s.change}</div>
              </div>
            ))}
          </div>

          {/* Pelamar Baru */}
          <div style={{ background: "#fff", borderRadius: 18, border: "1px solid rgba(22,119,255,0.1)", boxShadow: "0 2px 12px rgba(10,27,61,0.05)", padding: "24px", marginBottom: 20 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
              <h2 style={{ fontFamily: "'Poppins', sans-serif", fontSize: 17, fontWeight: 700, color: "#0A1B3D" }}>Pelamar Terbaru</h2>
              <span style={{ fontFamily: "'Inter', sans-serif", fontSize: 12, color: "#6a88b8" }}>
                {latestApplicant ? "Lamaran terakhir masuk" : "Belum ada pelamar"}
              </span>
            </div>

            {latestApplicant ? (
              <div style={{ padding: "16px", borderRadius: 14, border: "1px solid rgba(22,119,255,0.15)", background: "#f8fbff" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 12 }}>
                  <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
                    <div style={{ width: 44, height: 44, borderRadius: 14, background: "linear-gradient(135deg, #1677FF, #4DB8FF)", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "'Poppins', sans-serif", fontSize: 16, fontWeight: 700, color: "#fff", flexShrink: 0 }}>
                      {latestApplicant.name.charAt(0)}
                    </div>
                    <div>
                      <div style={{ fontFamily: "'Poppins', sans-serif", fontSize: 15, fontWeight: 700, color: "#0A1B3D" }}>{latestApplicant.name}</div>
                      <div style={{ fontFamily: "'Inter', sans-serif", fontSize: 13, color: "#6a88b8" }}>{latestApplicant.role} · {latestApplicant.location}</div>
                    </div>
                  </div>
                  <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                    <span style={{ padding: "4px 10px", borderRadius: 8, background: "rgba(22,119,255,0.08)", border: "1px solid rgba(22,119,255,0.2)", fontFamily: "'Inter', sans-serif", fontSize: 11, fontWeight: 600, color: "#1677FF" }}>
                      {latestApplicant.status}
                    </span>
                    <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 20, fontWeight: 800, color: "#1677FF" }}>{latestApplicant.match}%</div>
                  </div>
                </div>
                {latestApplicant.skills.length > 0 && (
                  <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginBottom: 14 }}>
                    {latestApplicant.skills.map((s) => (
                      <span key={s} style={{ padding: "3px 9px", borderRadius: 7, background: "rgba(16,217,142,0.08)", border: "1px solid rgba(16,217,142,0.25)", fontFamily: "'Inter', sans-serif", fontSize: 11, color: "#10d98e" }}>{s}</span>
                    ))}
                  </div>
                )}
                <div style={{ display: "flex", gap: 8 }}>
                  <button onClick={() => navigate(`/dashboard/perusahaan/kandidat/${latestApplicant.id}`)} style={{ flex: 1, padding: "8px", borderRadius: 10, border: "1px solid rgba(22,119,255,0.25)", background: "#f0f7ff", fontFamily: "'Inter', sans-serif", fontSize: 13, fontWeight: 500, color: "#1677FF", cursor: "pointer" }}>
                    Lihat Profil Pelamar
                  </button>
                  <button onClick={() => navigate(`/dashboard/perusahaan/kandidat/${latestApplicant.id}`)} style={{ flex: 1, padding: "8px", borderRadius: 10, border: "none", background: "linear-gradient(135deg, #1677FF, #0D47A1)", fontFamily: "'Inter', sans-serif", fontSize: 13, fontWeight: 600, color: "#fff", cursor: "pointer" }}>
                    Proses Seleksi
                  </button>
                </div>
              </div>
            ) : (
              <div style={{ padding: "24px", textAlign: "center", background: "#f8fbff", borderRadius: 14, border: "1px dashed rgba(22,119,255,0.2)" }}>
                <p style={{ fontFamily: "'Inter', sans-serif", fontSize: 13, color: "#6a88b8", margin: 0 }}>
                  Belum ada kandidat yang melamar ke lowongan perusahaan Anda.
                </p>
              </div>
            )}
          </div>

          {/* Tabs */}
          <div style={{ display: "flex", gap: 0, marginBottom: 20, background: "#fff", borderRadius: 12, padding: 4, border: "1px solid rgba(22,119,255,0.1)", width: "fit-content" }}>
            {[{ key: "pipeline", label: "Kandidat Pipeline" }, { key: "jobs", label: "Lowongan Perusahaan" }].map((t) => (
              <button
                key={t.key}
                onClick={() => setActiveTab(t.key as "pipeline" | "jobs")}
                style={{
                  padding: "8px 20px", borderRadius: 9, border: "none", cursor: "pointer",
                  fontFamily: "'Inter', sans-serif", fontSize: 13, fontWeight: 600,
                  background: activeTab === t.key ? "linear-gradient(135deg, #1677FF, #0D47A1)" : "transparent",
                  color: activeTab === t.key ? "#fff" : "#6a88b8",
                  transition: "all 0.2s",
                }}
              >{t.label}</button>
            ))}
          </div>

          {activeTab === "pipeline" && (
            <div>
              <div style={{ display: "flex", gap: 10, marginBottom: 18 }}>
                <div style={{ flex: 1, display: "flex", alignItems: "center", gap: 8, background: "#fff", borderRadius: 10, border: "1px solid rgba(22,119,255,0.15)", padding: "8px 14px" }}>
                  <Search size={15} color="#6a88b8" />
                  <input
                    value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Cari nama kandidat atau posisi..."
                    style={{ flex: 1, border: "none", outline: "none", fontFamily: "'Inter', sans-serif", fontSize: 14, color: "#0A1B3D", background: "transparent" }}
                  />
                </div>
                <button style={{ display: "flex", alignItems: "center", gap: 6, padding: "8px 14px", borderRadius: 10, border: "1px solid rgba(22,119,255,0.2)", background: "#fff", fontFamily: "'Inter', sans-serif", fontSize: 13, color: "#6a88b8", cursor: "pointer" }}>
                  <Filter size={14} /> Filter
                </button>
              </div>

              {/* Kanban board */}
              <div style={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: 12, overflowX: "auto" }}>
                {filteredPipeline.map((col) => (
                  <div key={col.stage} style={{ minWidth: 200 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12 }}>
                      <div style={{ width: 8, height: 8, borderRadius: "50%", background: col.color }} />
                      <span style={{ fontFamily: "'Poppins', sans-serif", fontSize: 13, fontWeight: 700, color: "#0A1B3D" }}>{col.stage}</span>
                      <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11, color: "#fff", background: col.color, borderRadius: 6, padding: "2px 7px" }}>{col.candidates.length}</span>
                    </div>
                    <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                      {col.candidates.map((c) => (
                        <div
                          key={c.id}
                          onClick={() => navigate(`/dashboard/perusahaan/kandidat/${c.id}`)}
                          style={{ background: "#fff", borderRadius: 14, border: "1px solid rgba(22,119,255,0.1)", padding: "14px", cursor: "pointer", transition: "all 0.15s", boxShadow: "0 1px 6px rgba(10,27,61,0.04)" }}
                          onMouseEnter={(e) => { e.currentTarget.style.boxShadow = "0 4px 16px rgba(22,119,255,0.12)"; e.currentTarget.style.borderColor = "rgba(22,119,255,0.25)"; }}
                          onMouseLeave={(e) => { e.currentTarget.style.boxShadow = "0 1px 6px rgba(10,27,61,0.04)"; e.currentTarget.style.borderColor = "rgba(22,119,255,0.1)"; }}
                        >
                          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 10 }}>
                            <div style={{ width: 34, height: 34, borderRadius: 10, background: `linear-gradient(135deg, ${col.color}22, ${col.color}44)`, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "'Poppins', sans-serif", fontSize: 14, fontWeight: 700, color: col.color }}>
                              {c.name.charAt(0)}
                            </div>
                            <button style={{ background: "none", border: "none", cursor: "pointer", color: "#9ab4cc", padding: 2 }}>
                              <MoreHorizontal size={14} />
                            </button>
                          </div>
                          <div style={{ fontFamily: "'Poppins', sans-serif", fontSize: 13, fontWeight: 700, color: "#0A1B3D", marginBottom: 2 }}>{c.name}</div>
                          <div style={{ fontFamily: "'Inter', sans-serif", fontSize: 11, color: "#6a88b8", marginBottom: 10 }}>{c.role}</div>
                          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                            <div style={{ display: "flex", alignItems: "center", gap: 3 }}>
                              <Star size={10} color="#f59e0b" fill="#f59e0b" />
                              <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11, fontWeight: 700, color: "#f59e0b" }}>{c.match}%</span>
                            </div>
                            <div style={{ display: "flex", alignItems: "center", gap: 3 }}>
                              <MapPin size={9} color="#9ab4cc" />
                              <span style={{ fontFamily: "'Inter', sans-serif", fontSize: 10, color: "#9ab4cc" }}>{c.location}</span>
                            </div>
                          </div>
                          <div style={{ marginTop: 8, height: 3, borderRadius: 2, background: "#e8f0fe", overflow: "hidden" }}>
                            <div style={{ height: "100%", width: `${c.match}%`, background: `linear-gradient(90deg, ${col.color}, ${col.color}aa)`, borderRadius: 2 }} />
                          </div>
                        </div>
                      ))}
                      {col.candidates.length === 0 && (
                        <div style={{ padding: "16px", borderRadius: 10, border: "1px dashed rgba(22,119,255,0.15)", textAlign: "center", color: "#6a88b8", fontFamily: "'Inter', sans-serif", fontSize: 11 }}>
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
                <div style={{ background: "#fff", borderRadius: 16, padding: "40px 20px", textAlign: "center", border: "1px solid rgba(22,119,255,0.1)" }}>
                  <p style={{ fontFamily: "'Inter', sans-serif", fontSize: 14, color: "#6a88b8", marginBottom: 14 }}>
                    Belum ada lowongan pekerjaan yang dibuat.
                  </p>
                  <button onClick={() => navigate("/dashboard/perusahaan/buat-lowongan")} style={{ padding: "10px 18px", borderRadius: 10, border: "none", background: "#1677FF", color: "#fff", fontFamily: "'Inter', sans-serif", fontSize: 13, fontWeight: 600, cursor: "pointer" }}>
                    Buat Lowongan Pertama
                  </button>
                </div>
              ) : (
                jobs.map((job) => (
                  <div key={job.id} style={{ background: "#fff", borderRadius: 16, border: "1px solid rgba(22,119,255,0.1)", padding: "20px 24px", display: "flex", alignItems: "center", gap: 20 }}>
                    <div style={{ flex: 1 }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 6 }}>
                        <span style={{ fontFamily: "'Poppins', sans-serif", fontSize: 15, fontWeight: 700, color: "#0A1B3D" }}>{job.title}</span>
                        <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10, color: job.status === "PUBLISHED" ? "#10d98e" : "#6a88b8", background: job.status === "PUBLISHED" ? "rgba(16,217,142,0.1)" : "#f0f4fa", border: `1px solid ${job.status === "PUBLISHED" ? "rgba(16,217,142,0.25)" : "#e5eaf3"}`, borderRadius: 6, padding: "2px 8px" }}>
                          {job.status}
                        </span>
                      </div>
                      <div style={{ display: "flex", gap: 20 }}>
                        <span style={{ fontFamily: "'Inter', sans-serif", fontSize: 13, color: "#6a88b8" }}>Lokasi: {job.location || "Remote / Onsite"}</span>
                        <span style={{ fontFamily: "'Inter', sans-serif", fontSize: 13, color: "#6a88b8" }}>Tipe: {job.jobType || "Full-time"}</span>
                      </div>
                    </div>
                    <button onClick={() => navigate(`/dashboard/perusahaan/pipeline?jobId=${job.id}`)} style={{ display: "flex", alignItems: "center", gap: 6, padding: "9px 16px", borderRadius: 10, border: "1px solid rgba(22,119,255,0.2)", background: "#f0f7ff", fontFamily: "'Inter', sans-serif", fontSize: 13, color: "#1677FF", cursor: "pointer" }}>
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
