import { useCallback, useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router";
import { LayoutDashboard, GitBranch, Briefcase, Plus, BookmarkCheck, BarChart2, Plug, Building2, Settings, Search, Users, TrendingUp, Clock, Loader2, RefreshCw } from "lucide-react";
import { DashboardLayout } from "../components/DashboardLayout";
import type { SidebarItem } from "../components/DashboardLayout";
import { useAppContext } from "../contexts/AppContext";
import {
  listRecruiterJobs,
  listApplicationsForRecruiterJob,
  getRecruiterJobCandidateScores,
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
  { key: "ats", label: "Integrasi ATS", icon: <Plug size={16} />, path: "/dashboard/perusahaan/integrasi-ats" },
  { key: "profil", label: "Profil Perusahaan", icon: <Building2 size={16} />, path: "/dashboard/perusahaan/profil" },
  { key: "pengaturan", label: "Pengaturan", icon: <Settings size={16} />, path: "/dashboard/perusahaan/pengaturan" },
];

type CandidateItem = {
  applicationId: string;
  name: string;
  role: string;
  jobId: string;
  match: number;
  candidateScore?: number;
  status: string;
  skills: string[];
  location: string;
  avatarColor: string;
  isNew: boolean;
  createdAt: string;
};

const avatarColors = ["#1677FF", "#10d98e", "#f59e0b", "#8b5cf6", "#ff9a3c", "#4DB8FF"];

function matchColor(score: number): string {
  if (score >= 90) return "#10d98e";
  if (score >= 80) return "#1677FF";
  return "#f59e0b";
}

function statusColor(s: string): { color: string; bg: string } {
  switch (s) {
    case "INTERVIEW":
      return { color: "#1677FF", bg: "#e8f0fe" };
    case "SCREENING":
    case "SELEKSI_TAHAP_1":
    case "SELEKSI_TAHAP_2":
      return { color: "#f59e0b", bg: "#fef3c7" };
    case "ACCEPTED":
      return { color: "#10d98e", bg: "#10d98e1a" };
    case "REJECTED":
      return { color: "#ff6b6b", bg: "rgba(255,107,107,0.1)" };
    default:
      return { color: "#6b7280", bg: "#f3f4f6" };
  }
}

export default function CandidatesListPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const filterJobId = searchParams.get("jobId");
  const { user } = useAppContext();

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [candidates, setCandidates] = useState<CandidateItem[]>([]);
  const [search, setSearch] = useState("");
  const [filterMatch, setFilterMatch] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");

  const loadCandidates = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const jobs = await listRecruiterJobs();
      const targetJobs = filterJobId ? jobs.filter((j) => j.id === filterJobId) : jobs;

      const items: CandidateItem[] = [];
      const oneWeekAgo = Date.now() - 7 * 24 * 60 * 60 * 1000;

      await Promise.all(
        targetJobs.map(async (j, idx) => {
          try {
            const [rawApps, scores] = await Promise.all([
              listApplicationsForRecruiterJob(j.id).catch(() => [] as RecruiterJobApplication[]),
              getRecruiterJobCandidateScores(j.id).catch(() => [] as RecruiterCandidateScore[]),
            ]);

            const scoreMap = new Map<string, RecruiterCandidateScore>();
            scores.forEach((s) => scoreMap.set(s.applicationId, s));

            rawApps.forEach((app, appIdx) => {
              const sc = scoreMap.get(app.id);
              const color = avatarColors[(idx + appIdx) % avatarColors.length];
              const createdTime = new Date(app.createdAt).getTime();

              items.push({
                applicationId: app.id,
                name: app.candidate.user.fullName,
                role: j.title,
                jobId: j.id,
                match: sc ? sc.matchScore : 80,
                candidateScore: sc?.candidateScore,
                status: app.status,
                skills: app.candidate.skills.map((s) => s.skillName),
                location: app.candidate.location || "Indonesia",
                avatarColor: color,
                isNew: createdTime > oneWeekAgo,
                createdAt: app.createdAt,
              });
            });
          } catch {
            // continue
          }
        })
      );

      items.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
      setCandidates(items);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Gagal memuat daftar pelamar.";
      setError(msg);
    } finally {
      setLoading(false);
    }
  }, [filterJobId]);

  useEffect(() => {
    queueMicrotask(() => {
      void loadCandidates();
    });
  }, [loadCandidates]);

  const filtered = candidates.filter((c) => {
    const matchSearch =
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.role.toLowerCase().includes(search.toLowerCase()) ||
      c.skills.some((s) => s.toLowerCase().includes(search.toLowerCase()));
    const matchScore =
      filterMatch === "all" ||
      (filterMatch === "high" && c.match >= 90) ||
      (filterMatch === "mid" && c.match >= 80 && c.match < 90);
    const matchStatus = filterStatus === "all" || c.status === filterStatus;
    return matchSearch && matchScore && matchStatus;
  });

  const avgMatch =
    candidates.length > 0
      ? Math.round(candidates.reduce((a, c) => a + c.match, 0) / candidates.length)
      : 0;
  const newThisWeek = candidates.filter((c) => c.isNew).length;

  const userName = user?.fullName || "Recruiter";
  const userRole = `${user?.recruiter?.position || "HR Recruiter"} · ${user?.recruiter?.company?.name || "Perusahaan"}`;
  const userInitial = (user?.fullName || "R").charAt(0).toUpperCase();

  return (
    <DashboardLayout
      sidebarItems={sidebarItems}
      activeKey=""
      userName={userName}
      userRole={userRole}
      userInitial={userInitial}
    >
      <div style={{ padding: "32px", minHeight: "100vh", backgroundColor: "#f0f7ff" }}>
        <div style={{ marginBottom: "28px" }}>
          <h1 style={{ fontFamily: "Poppins, sans-serif", fontSize: "24px", fontWeight: 700, color: "#0A1B3D", margin: 0 }}>
            Daftar Pelamar
          </h1>
          <p style={{ fontFamily: "Inter, sans-serif", fontSize: "14px", color: "#6b7280", marginTop: "6px" }}>
            Semua kandidat yang melamar ke lowongan di {user?.recruiter?.company?.name || "perusahaan Anda"}
          </p>
        </div>

        {/* Stats row */}
        <div style={{ display: "flex", gap: "16px", marginBottom: "24px" }}>
          {[
            { label: "Total Pelamar", value: candidates.length.toString(), color: "#1677FF", icon: Users },
            { label: "Avg Match Score", value: avgMatch > 0 ? `${avgMatch}%` : "-", color: "#10d98e", icon: TrendingUp },
            { label: "Baru Minggu Ini", value: newThisWeek.toString(), color: "#f59e0b", icon: Clock },
          ].map((s) => (
            <div
              key={s.label}
              style={{
                flex: 1,
                backgroundColor: "#fff",
                borderRadius: "12px",
                padding: "18px 20px",
                boxShadow: "0 1px 4px rgba(0,0,0,0.08)",
                display: "flex",
                alignItems: "center",
                gap: "14px",
              }}
            >
              <div
                style={{
                  width: "42px",
                  height: "42px",
                  borderRadius: "10px",
                  backgroundColor: `${s.color}14`,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: s.color,
                }}
              >
                <s.icon size={20} />
              </div>
              <div>
                <div style={{ fontFamily: "JetBrains Mono, monospace", fontSize: "22px", fontWeight: 800, color: "#0A1B3D" }}>
                  {s.value}
                </div>
                <div style={{ fontFamily: "Inter, sans-serif", fontSize: "12px", color: "#6b7280", marginTop: "2px" }}>
                  {s.label}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Filter bar */}
        <div style={{ display: "flex", gap: "12px", marginBottom: "20px", flexWrap: "wrap" }}>
          <div
            style={{
              flex: 1,
              minWidth: "240px",
              display: "flex",
              alignItems: "center",
              gap: "10px",
              backgroundColor: "#fff",
              borderRadius: "10px",
              padding: "10px 14px",
              border: "1px solid #e5eaf3",
            }}
          >
            <Search size={16} color="#9ca3af" />
            <input
              style={{
                border: "none",
                outline: "none",
                width: "100%",
                fontFamily: "Inter, sans-serif",
                fontSize: "14px",
                color: "#0A1B3D",
              }}
              placeholder="Cari kandidat, posisi, atau keahlian..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <select
            style={{
              padding: "10px 14px",
              fontFamily: "Inter, sans-serif",
              fontSize: "13px",
              color: "#374151",
              backgroundColor: "#fff",
              border: "1px solid #e5eaf3",
              borderRadius: "10px",
              cursor: "pointer",
              outline: "none",
            }}
            value={filterMatch}
            onChange={(e) => setFilterMatch(e.target.value)}
          >
            <option value="all">Semua Match Score</option>
            <option value="high">90%+ (Sangat Tinggi)</option>
            <option value="mid">80-89% (Tinggi)</option>
          </select>
          <select
            style={{
              padding: "10px 14px",
              fontFamily: "Inter, sans-serif",
              fontSize: "13px",
              color: "#374151",
              backgroundColor: "#fff",
              border: "1px solid #e5eaf3",
              borderRadius: "10px",
              cursor: "pointer",
              outline: "none",
            }}
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
          >
            <option value="all">Semua Status</option>
            <option value="APPLIED">Applied (Baru)</option>
            <option value="SCREENING">Screening</option>
            <option value="INTERVIEW">Interview</option>
            <option value="ACCEPTED">Offer / Accepted</option>
            <option value="REJECTED">Ditolak</option>
          </select>
        </div>

        {loading ? (
          <div style={{ backgroundColor: "#fff", borderRadius: "14px", padding: "60px", textAlign: "center", boxShadow: "0 1px 4px rgba(0,0,0,0.08)" }}>
            <Loader2 size={32} className="animate-spin" color="#1677FF" style={{ margin: "0 auto 16px" }} />
            <p style={{ fontFamily: "Inter, sans-serif", fontSize: "14px", color: "#6a88b8" }}>Memuat daftar pelamar...</p>
          </div>
        ) : error ? (
          <div style={{ backgroundColor: "#fff", borderRadius: "14px", padding: "40px", textAlign: "center", boxShadow: "0 1px 4px rgba(0,0,0,0.08)" }}>
            <p style={{ fontFamily: "Inter, sans-serif", fontSize: "14px", color: "#ff6b6b", marginBottom: 16 }}>{error}</p>
            <button
              onClick={() => { void loadCandidates(); }}
              style={{ display: "inline-flex", alignItems: "center", gap: 6, padding: "8px 16px", borderRadius: 8, border: "1px solid #1677FF", background: "#f0f7ff", color: "#1677FF", cursor: "pointer", fontFamily: "Inter, sans-serif", fontSize: 13, fontWeight: 600 }}
            >
              <RefreshCw size={14} /> Coba Lagi
            </button>
          </div>
        ) : filtered.length === 0 ? (
          <div style={{ backgroundColor: "#fff", borderRadius: "14px", padding: "60px 20px", textAlign: "center", boxShadow: "0 1px 4px rgba(0,0,0,0.08)" }}>
            <p style={{ fontFamily: "Inter, sans-serif", fontSize: "14px", color: "#6b7280" }}>
              Tidak ada pelamar yang sesuai dengan kriteria pencarian Anda.
            </p>
          </div>
        ) : (
          /* Candidate grid */
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: "16px" }}>
            {filtered.map((c) => {
              const sc = statusColor(c.status);
              return (
                <div
                  key={c.applicationId}
                  style={{
                    backgroundColor: "#fff",
                    borderRadius: "14px",
                    padding: "20px",
                    boxShadow: "0 1px 4px rgba(0,0,0,0.08)",
                    display: "flex",
                    flexDirection: "column",
                    gap: "14px",
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                    <div
                      style={{
                        width: "46px",
                        height: "46px",
                        borderRadius: "50%",
                        backgroundColor: c.avatarColor,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        color: "#fff",
                        fontFamily: "Poppins, sans-serif",
                        fontSize: "17px",
                        fontWeight: 700,
                        flexShrink: 0,
                      }}
                    >
                      {c.name.charAt(0)}
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                        <span style={{ fontFamily: "Poppins, sans-serif", fontSize: "14px", fontWeight: 700, color: "#0A1B3D", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{c.name}</span>
                        {c.isNew && (
                          <span style={{ fontFamily: "Inter, sans-serif", fontSize: "10px", fontWeight: 700, color: "#10d98e", backgroundColor: "#10d98e1a", borderRadius: "20px", padding: "1px 8px" }}>Baru</span>
                        )}
                      </div>
                      <div style={{ fontFamily: "Inter, sans-serif", fontSize: "12px", color: "#6b7280", marginTop: "2px", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{c.role}</div>
                    </div>
                    <div style={{ fontFamily: "JetBrains Mono, monospace", fontSize: "20px", fontWeight: 800, color: matchColor(c.match) }}>
                      {c.match}%
                    </div>
                  </div>

                  {c.skills.length > 0 && (
                    <div style={{ display: "flex", flexWrap: "wrap", gap: "6px" }}>
                      {c.skills.slice(0, 4).map((s) => (
                        <span key={s} style={{ fontFamily: "Inter, sans-serif", fontSize: "11px", fontWeight: 600, color: "#1677FF", backgroundColor: "#e8f0fe", borderRadius: "20px", padding: "3px 10px" }}>
                          {s}
                        </span>
                      ))}
                    </div>
                  )}

                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: "auto" }}>
                    <span style={{ fontFamily: "Inter, sans-serif", fontSize: "11px", fontWeight: 600, color: sc.color, backgroundColor: sc.bg, borderRadius: "20px", padding: "3px 12px" }}>
                      {c.status}
                    </span>
                    <button
                      onClick={() => navigate(`/dashboard/perusahaan/kandidat/${c.applicationId}`)}
                      style={{
                        fontFamily: "Inter, sans-serif",
                        fontSize: "12px",
                        fontWeight: 600,
                        color: "#1677FF",
                        backgroundColor: "#f0f7ff",
                        border: "1px solid rgba(22,119,255,0.25)",
                        borderRadius: "8px",
                        padding: "6px 14px",
                        cursor: "pointer",
                      }}
                    >
                      Lihat Profil
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
