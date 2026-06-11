import { useState } from "react";
import { useNavigate } from "react-router";
import { LayoutDashboard, GitBranch, Briefcase, Plus, BookmarkCheck, BarChart2, Plug, Building2, Settings, Search, Filter, Users, TrendingUp, Clock } from "lucide-react";
import { DashboardLayout, SidebarItem } from "../components/DashboardLayout";
import { useAppContext } from "../contexts/AppContext";

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

const allCandidates = [
  { name: "Aulia Rahman", role: "Senior UX Designer", match: 96, status: "Interview", skills: ["Figma", "Research", "Prototyping"], avatarColor: "#1677FF", isNew: true },
  { name: "Bayu Setiawan", role: "Product Manager", match: 91, status: "Shortlist", skills: ["Agile", "SQL", "Analytics"], avatarColor: "#10d98e", isNew: false },
  { name: "Citra Dewi", role: "Data Analyst", match: 88, status: "Applied", skills: ["Python", "Tableau", "SQL"], avatarColor: "#f59e0b", isNew: true },
  { name: "Dian Pratiwi", role: "Backend Engineer", match: 85, status: "Shortlist", skills: ["Node.js", "Docker", "Redis"], avatarColor: "#8b5cf6", isNew: false },
  { name: "Eko Wibowo", role: "DevOps Specialist", match: 84, status: "Applied", skills: ["Kubernetes", "AWS", "CI/CD"], avatarColor: "#ff9a3c", isNew: true },
  { name: "Fira Andriani", role: "Senior UX Designer", match: 82, status: "Applied", skills: ["Sketch", "InVision", "Figma"], avatarColor: "#4DB8FF", isNew: false },
];

function matchColor(score: number): string {
  if (score >= 90) return "#10d98e";
  if (score >= 80) return "#1677FF";
  return "#f59e0b";
}

function statusColor(s: string): { color: string; bg: string } {
  if (s === "Interview") return { color: "#1677FF", bg: "#e8f0fe" };
  if (s === "Shortlist") return { color: "#f59e0b", bg: "#fef3c7" };
  return { color: "#6b7280", bg: "#f3f4f6" };
}

export default function CandidatesListPage() {
  const navigate = useNavigate();
  const { applications } = useAppContext();
  const [search, setSearch] = useState("");
  const [filterMatch, setFilterMatch] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");

  const newFromContext = applications
    .filter(a => a.isNew && !allCandidates.some(c => c.name === "Budi Santoso"))
    .map(a => ({ name: "Budi Santoso", role: a.posisi, match: a.match, status: "Applied", skills: ["Figma", "UI Design", "Prototyping"], avatarColor: "#1677FF", isNew: true }));

  const candidates = [...newFromContext, ...allCandidates];

  const filtered = candidates.filter((c) => {
    const matchSearch = c.name.toLowerCase().includes(search.toLowerCase()) || c.role.toLowerCase().includes(search.toLowerCase());
    const matchScore = filterMatch === "all" || (filterMatch === "high" && c.match >= 90) || (filterMatch === "mid" && c.match >= 80 && c.match < 90);
    const matchStatus = filterStatus === "all" || c.status === filterStatus;
    return matchSearch && matchScore && matchStatus;
  });

  const avgMatch = Math.round(candidates.reduce((a, c) => a + c.match, 0) / candidates.length);
  const newThisWeek = candidates.filter((c) => c.isNew).length;

  return (
    <DashboardLayout
      sidebarItems={sidebarItems}
      activeKey=""
      userName="Siti Rahayu"
      userRole="HR Manager · Tokopedia"
      userInitial="S"
    >
      <div style={{ padding: "32px", minHeight: "100vh", backgroundColor: "#f0f7ff" }}>
        <div style={{ marginBottom: "28px" }}>
          <h1 style={{ fontFamily: "Poppins, sans-serif", fontSize: "24px", fontWeight: 700, color: "#0A1B3D", margin: 0 }}>
            Daftar Kandidat
          </h1>
          <p style={{ fontFamily: "Inter, sans-serif", fontSize: "14px", color: "#6b7280", marginTop: "6px" }}>
            Semua kandidat yang melamar ke posisi di Tokopedia
          </p>
        </div>

        {/* Stats row */}
        <div style={{ display: "flex", gap: "16px", marginBottom: "24px" }}>
          {[
            { label: "Total Kandidat", value: candidates.length.toString(), color: "#1677FF", icon: Users },
            { label: "Avg Match Score", value: `${avgMatch}%`, color: "#10d98e", icon: TrendingUp },
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
                  width: "40px",
                  height: "40px",
                  borderRadius: "10px",
                  backgroundColor: s.color + "1a",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <s.icon size={20} color={s.color} />
              </div>
              <div>
                <div style={{ fontFamily: "Inter, sans-serif", fontSize: "12px", color: "#9ca3af" }}>{s.label}</div>
                <div style={{ fontFamily: "JetBrains Mono, monospace", fontSize: "22px", fontWeight: 800, color: s.color }}>{s.value}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Search + filter */}
        <div style={{ display: "flex", gap: "12px", marginBottom: "20px" }}>
          <div style={{ flex: 1, position: "relative" }}>
            <Search size={16} color="#9ca3af" style={{ position: "absolute", left: "14px", top: "50%", transform: "translateY(-50%)" }} />
            <input
              style={{
                width: "100%",
                padding: "10px 14px 10px 40px",
                fontFamily: "Inter, sans-serif",
                fontSize: "14px",
                color: "#0A1B3D",
                backgroundColor: "#fff",
                border: "1px solid #e5eaf3",
                borderRadius: "10px",
                outline: "none",
                boxSizing: "border-box",
              }}
              placeholder="Cari kandidat..."
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
            <option value="Applied">Applied</option>
            <option value="Shortlist">Shortlist</option>
            <option value="Interview">Interview</option>
          </select>
        </div>

        {/* Candidate grid */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: "16px" }}>
          {filtered.map((c, i) => {
            const sc = statusColor(c.status);
            return (
              <div
                key={i}
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
                  <div style={{ flex: 1 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                      <span style={{ fontFamily: "Poppins, sans-serif", fontSize: "14px", fontWeight: 700, color: "#0A1B3D" }}>{c.name}</span>
                      {c.isNew && (
                        <span style={{ fontFamily: "Inter, sans-serif", fontSize: "10px", fontWeight: 700, color: "#10d98e", backgroundColor: "#10d98e1a", borderRadius: "20px", padding: "1px 8px" }}>Baru</span>
                      )}
                    </div>
                    <div style={{ fontFamily: "Inter, sans-serif", fontSize: "12px", color: "#6b7280", marginTop: "2px" }}>{c.role}</div>
                  </div>
                  <div style={{ fontFamily: "JetBrains Mono, monospace", fontSize: "20px", fontWeight: 800, color: matchColor(c.match) }}>
                    {c.match}%
                  </div>
                </div>

                <div style={{ display: "flex", flexWrap: "wrap", gap: "6px" }}>
                  {c.skills.map((s) => (
                    <span key={s} style={{ fontFamily: "Inter, sans-serif", fontSize: "11px", fontWeight: 600, color: "#1677FF", backgroundColor: "#e8f0fe", borderRadius: "20px", padding: "3px 10px" }}>
                      {s}
                    </span>
                  ))}
                </div>

                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                  <span style={{ fontFamily: "Inter, sans-serif", fontSize: "11px", fontWeight: 600, color: sc.color, backgroundColor: sc.bg, borderRadius: "20px", padding: "3px 12px" }}>
                    {c.status}
                  </span>
                  <button
                    onClick={() => navigate("/dashboard/perusahaan/kandidat/1")}
                    style={{
                      fontFamily: "Inter, sans-serif",
                      fontSize: "12px",
                      fontWeight: 600,
                      color: "#1677FF",
                      backgroundColor: "#e8f0fe",
                      border: "none",
                      borderRadius: "8px",
                      padding: "7px 16px",
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

        {filtered.length === 0 && (
          <div style={{ textAlign: "center", padding: "60px 0", fontFamily: "Inter, sans-serif", fontSize: "15px", color: "#9ca3af" }}>
            Tidak ada kandidat yang cocok dengan filter.
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
