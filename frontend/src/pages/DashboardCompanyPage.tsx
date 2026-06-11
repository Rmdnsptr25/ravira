import { useState } from "react";
import { useNavigate } from "react-router";
import { Search, Filter, Plus, Users, Briefcase, TrendingUp, Clock, MoreHorizontal, ChevronRight, Star, MapPin, LayoutDashboard, GitBranch, BarChart2, Plug, Building2, Settings, BookmarkCheck } from "lucide-react";
import { DashboardLayout, SidebarItem } from "../components/DashboardLayout";
import { useAppContext } from "../contexts/AppContext";

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

const stats = [
  { label: "Total Kandidat", value: "248", change: "+12 minggu ini", color: "#1677FF", icon: Users, path: "/dashboard/perusahaan/pipeline" },
  { label: "Lowongan Aktif", value: "8", change: "3 urgent", color: "#10d98e", icon: Briefcase, path: "/dashboard/perusahaan/lowongan" },
  { label: "Avg Match Score", value: "87%", change: "+3% vs bulan lalu", color: "#f59e0b", icon: TrendingUp, path: "/dashboard/perusahaan/analitik" },
  { label: "Waktu Rekrut", value: "18 hr", change: "↓ 4 hari lebih cepat", color: "#8b5cf6", icon: Clock, path: "/dashboard/perusahaan/analitik" },
];

type Stage = "Baru" | "Diulas" | "Interview" | "Offer" | "Ditolak";

const pipeline: { stage: Stage; color: string; candidates: { id: string; name: string; role: string; match: number; location: string; exp: string; }[] }[] = [
  {
    stage: "Baru", color: "#6a88b8",
    candidates: [
      { id: "c1", name: "Ahmad Fauzi", role: "Senior UX Designer", match: 94, location: "Jakarta", exp: "5 tahun" },
      { id: "c2", name: "Rina Septiani", role: "Senior UX Designer", match: 89, location: "Bandung", exp: "4 tahun" },
      { id: "c3", name: "Doni Pratama", role: "UX Designer", match: 82, location: "Surabaya", exp: "3 tahun" },
    ],
  },
  {
    stage: "Diulas", color: "#1677FF",
    candidates: [
      { id: "c4", name: "Mega Pertiwi", role: "Senior UX Designer", match: 91, location: "Jakarta", exp: "6 tahun" },
      { id: "c5", name: "Bima Ardiansyah", role: "UX Lead", match: 88, location: "Jakarta", exp: "7 tahun" },
    ],
  },
  {
    stage: "Interview", color: "#f59e0b",
    candidates: [
      { id: "c6", name: "Sari Wulandari", role: "Senior UX Designer", match: 96, location: "Jakarta", exp: "5 tahun" },
    ],
  },
  {
    stage: "Offer", color: "#10d98e",
    candidates: [
      { id: "c7", name: "Rizky Firmansyah", role: "UX Designer", match: 90, location: "Depok", exp: "4 tahun" },
    ],
  },
  {
    stage: "Ditolak", color: "#ff6b6b",
    candidates: [
      { id: "c8", name: "Hendra Wijaya", role: "UX Designer", match: 72, location: "Bekasi", exp: "2 tahun" },
    ],
  },
];

const activeJobs = [
  { title: "Senior UX Designer", dept: "Product", applied: 48, shortlisted: 12, posted: "3 hari lalu", urgent: true },
  { title: "Backend Engineer (Node.js)", dept: "Engineering", applied: 132, shortlisted: 24, posted: "1 minggu lalu", urgent: true },
  { title: "Product Manager", dept: "Product", applied: 67, shortlisted: 9, posted: "2 minggu lalu", urgent: false },
  { title: "Data Analyst", dept: "Data", applied: 55, shortlisted: 15, posted: "5 hari lalu", urgent: false },
];

export default function DashboardCompanyPage() {
  const navigate = useNavigate();
  const { applications } = useAppContext();
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState<"pipeline" | "jobs">("pipeline");

  const newApplicants = applications.filter(a => a.isNew).map(a => ({
    id: a.id, name: "Budi Santoso", role: a.posisi, match: a.match, location: a.lokasi, exp: "3 tahun",
  }));

  const enrichedPipeline = pipeline.map(col => {
    if (col.stage === "Baru") {
      const hasBudi = col.candidates.some(c => c.name === "Budi Santoso");
      const newCandidates = newApplicants.filter(n => !col.candidates.some(c => c.id === n.id));
      return hasBudi ? col : { ...col, candidates: [...newCandidates, ...col.candidates] };
    }
    return col;
  });

  return (
    <DashboardLayout
      sidebarItems={sidebarItems}
      userName="Siti Rahayu"
      userRole="HR Manager · Tokopedia"
      userInitial="S"
    >
      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
        <div>
          <h1 style={{ fontFamily: "'Poppins', sans-serif", fontSize: 22, fontWeight: 800, color: "#0A1B3D", marginBottom: 4 }}>
            Dashboard Rekrutmen
          </h1>
          <p style={{ fontFamily: "'Inter', sans-serif", fontSize: 14, color: "#6a88b8" }}>
            Selamat pagi, Siti! Ada 12 kandidat baru yang menunggu ulasan Anda.
          </p>
        </div>
        <button onClick={() => navigate("/dashboard/perusahaan/buat-lowongan")} style={{ display: "flex", alignItems: "center", gap: 8, padding: "10px 18px", borderRadius: 12, border: "none", background: "linear-gradient(135deg, #1677FF, #0D47A1)", fontFamily: "'Poppins', sans-serif", fontSize: 13, fontWeight: 700, color: "#fff", cursor: "pointer", boxShadow: "0 4px 14px rgba(22,119,255,0.4)" }}>
          <Plus size={15} /> Buat Lowongan Baru
        </button>
      </div>

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
          <h2 style={{ fontFamily: "'Poppins', sans-serif", fontSize: 17, fontWeight: 700, color: "#0A1B3D" }}>Pelamar Baru</h2>
          <span style={{ fontFamily: "'Inter', sans-serif", fontSize: 12, color: "#6a88b8" }}>1 pelamar baru hari ini</span>
        </div>
        <div style={{ padding: "16px", borderRadius: 14, border: "1px solid rgba(22,119,255,0.15)", background: "#f8fbff" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 12 }}>
            <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
              <div style={{ width: 44, height: 44, borderRadius: 14, background: "linear-gradient(135deg, #1677FF, #4DB8FF)", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "'Poppins', sans-serif", fontSize: 16, fontWeight: 700, color: "#fff", flexShrink: 0 }}>B</div>
              <div>
                <div style={{ fontFamily: "'Poppins', sans-serif", fontSize: 15, fontWeight: 700, color: "#0A1B3D" }}>Budi Santoso</div>
                <div style={{ fontFamily: "'Inter', sans-serif", fontSize: 13, color: "#6a88b8" }}>Senior UX Designer · Tokopedia</div>
              </div>
            </div>
            <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
              <span style={{ padding: "4px 10px", borderRadius: 8, background: "rgba(22,119,255,0.08)", border: "1px solid rgba(22,119,255,0.2)", fontFamily: "'Inter', sans-serif", fontSize: 11, fontWeight: 600, color: "#1677FF" }}>Pelamar Baru</span>
              <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 20, fontWeight: 800, color: "#1677FF" }}>94%</div>
            </div>
          </div>
          <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginBottom: 14 }}>
            {["Figma", "User Research", "UI Design", "Prototyping"].map(s => (
              <span key={s} style={{ padding: "3px 9px", borderRadius: 7, background: "rgba(16,217,142,0.08)", border: "1px solid rgba(16,217,142,0.25)", fontFamily: "'Inter', sans-serif", fontSize: 11, color: "#10d98e" }}>{s}</span>
            ))}
            {["Design System Advanced", "Usability Testing Formal"].map(s => (
              <span key={s} style={{ padding: "3px 9px", borderRadius: 7, background: "rgba(255,107,107,0.07)", border: "1px solid rgba(255,107,107,0.2)", fontFamily: "'Inter', sans-serif", fontSize: 11, color: "#ff6b6b" }}>{s}</span>
            ))}
          </div>
          <div style={{ display: "flex", gap: 8 }}>
            <button onClick={() => navigate("/dashboard/perusahaan/kandidat/1")} style={{ flex: 1, padding: "8px", borderRadius: 10, border: "1px solid rgba(22,119,255,0.25)", background: "#f0f7ff", fontFamily: "'Inter', sans-serif", fontSize: 13, fontWeight: 500, color: "#1677FF", cursor: "pointer" }}>
              Lihat Profil
            </button>
            <button onClick={() => navigate("/dashboard/perusahaan/kandidat/1")} style={{ flex: 1, padding: "8px", borderRadius: 10, border: "none", background: "linear-gradient(135deg, #1677FF, #0D47A1)", fontFamily: "'Inter', sans-serif", fontSize: 13, fontWeight: 600, color: "#fff", cursor: "pointer" }}>
              Jadwalkan Interview
            </button>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div style={{ display: "flex", gap: 0, marginBottom: 20, background: "#fff", borderRadius: 12, padding: 4, border: "1px solid rgba(22,119,255,0.1)", width: "fit-content" }}>
        {[{ key: "pipeline", label: "Kandidat Pipeline" }, { key: "jobs", label: "Lowongan Aktif" }].map((t) => (
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
                placeholder="Cari nama kandidat..."
                style={{ flex: 1, border: "none", outline: "none", fontFamily: "'Inter', sans-serif", fontSize: 14, color: "#0A1B3D", background: "transparent" }}
              />
            </div>
            <button style={{ display: "flex", alignItems: "center", gap: 6, padding: "8px 14px", borderRadius: 10, border: "1px solid rgba(22,119,255,0.2)", background: "#fff", fontFamily: "'Inter', sans-serif", fontSize: 13, color: "#6a88b8", cursor: "pointer" }}>
              <Filter size={14} /> Filter
            </button>
          </div>

          {/* Kanban board */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: 12, overflowX: "auto" }}>
            {enrichedPipeline.map((col) => (
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
                  <button style={{ padding: "8px", borderRadius: 10, border: "1px dashed rgba(22,119,255,0.2)", background: "transparent", color: "#6a88b8", fontFamily: "'Inter', sans-serif", fontSize: 12, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 4 }}>
                    <Plus size={12} /> Tambah
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === "jobs" && (
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {activeJobs.map((job) => (
            <div key={job.title} style={{ background: "#fff", borderRadius: 16, border: "1px solid rgba(22,119,255,0.1)", padding: "20px 24px", display: "flex", alignItems: "center", gap: 20 }}>
              <div style={{ flex: 1 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 6 }}>
                  <span style={{ fontFamily: "'Poppins', sans-serif", fontSize: 15, fontWeight: 700, color: "#0A1B3D" }}>{job.title}</span>
                  {job.urgent && <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10, color: "#ff6b6b", background: "rgba(255,107,107,0.1)", border: "1px solid rgba(255,107,107,0.2)", borderRadius: 6, padding: "2px 8px" }}>URGENT</span>}
                </div>
                <div style={{ display: "flex", gap: 20 }}>
                  <span style={{ fontFamily: "'Inter', sans-serif", fontSize: 13, color: "#6a88b8" }}>Dept: {job.dept}</span>
                  <span style={{ fontFamily: "'Inter', sans-serif", fontSize: 13, color: "#6a88b8" }}>Diposting {job.posted}</span>
                </div>
              </div>
              <div style={{ display: "flex", gap: 24, textAlign: "center" }}>
                <div>
                  <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 22, fontWeight: 800, color: "#1677FF" }}>{job.applied}</div>
                  <div style={{ fontFamily: "'Inter', sans-serif", fontSize: 11, color: "#6a88b8" }}>Pelamar</div>
                </div>
                <div>
                  <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 22, fontWeight: 800, color: "#10d98e" }}>{job.shortlisted}</div>
                  <div style={{ fontFamily: "'Inter', sans-serif", fontSize: 11, color: "#6a88b8" }}>Shortlist</div>
                </div>
              </div>
              <button onClick={() => navigate("/dashboard/perusahaan/pipeline")} style={{ display: "flex", alignItems: "center", gap: 6, padding: "9px 16px", borderRadius: 10, border: "1px solid rgba(22,119,255,0.2)", background: "#f0f7ff", fontFamily: "'Inter', sans-serif", fontSize: 13, color: "#1677FF", cursor: "pointer" }}>
                Lihat Pipeline <ChevronRight size={13} />
              </button>
            </div>
          ))}
        </div>
      )}
    </DashboardLayout>
  );
}
