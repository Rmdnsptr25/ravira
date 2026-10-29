import { useState } from "react";
import { useNavigate } from "react-router";
import { LayoutDashboard, GitBranch, Briefcase, Plus, BookmarkCheck, BarChart2, Plug, Building2, Settings, X, Calendar } from "lucide-react";
import { toast } from "sonner";
import { DashboardLayout } from "../components/DashboardLayout";
import { useAppContext } from "../contexts/AppContext";
import type { SidebarItem } from "../components/DashboardLayout";

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

const candidates = [
  { name: "Aulia Rahman", role: "Senior UX Designer", match: 96, skills: ["Figma", "Research", "Prototyping", "UX Writing"], status: "Interview Dijadwalkan", avatarColor: "#1677FF" },
  { name: "Bayu Setiawan", role: "Product Manager", match: 91, skills: ["Agile", "Roadmapping", "SQL", "Analytics"], status: "Review Awal", avatarColor: "#10d98e" },
  { name: "Citra Dewi", role: "Data Analyst", match: 88, skills: ["Python", "Tableau", "SQL", "Statistics"], status: "Shortlist", avatarColor: "#f59e0b" },
  { name: "Dian Pratiwi", role: "Backend Engineer", match: 85, skills: ["Node.js", "PostgreSQL", "Docker", "Redis"], status: "Shortlist", avatarColor: "#8b5cf6" },
  { name: "Eko Wibowo", role: "DevOps Specialist", match: 84, skills: ["Kubernetes", "AWS", "Terraform", "CI/CD"], status: "Shortlist", avatarColor: "#ff9a3c" },
  { name: "Fira Andriani", role: "Senior UX Designer", match: 82, skills: ["Sketch", "InVision", "HTML/CSS", "Figma"], status: "Review Awal", avatarColor: "#4DB8FF" },
];

function matchColor(score: number): string {
  if (score >= 90) return "#10d98e";
  if (score >= 80) return "#1677FF";
  return "#f59e0b";
}

type InterviewTarget = { name: string; role: string } | null;

export default function ShortlistPage() {
  const { user } = useAppContext();
  const displayName = user?.fullName || "Recruiter";
  const displayCompany = user?.recruiter?.company?.name || "Perusahaan";
  const displayRole = `${user?.recruiter?.position || "HR Manager"} · ${displayCompany}`;
  const displayInitial = (displayName[0] || "R").toUpperCase();
  const navigate = useNavigate();
  const [interviewTarget, setInterviewTarget] = useState<InterviewTarget>(null);
  const [interviewDate, setInterviewDate] = useState("");
  const [interviewTime, setInterviewTime] = useState("");
  const [interviewType, setInterviewType] = useState("Online");

  const handleConfirmInterview = () => {
    if (!interviewTarget) return;
    toast.success(`Interview dengan ${interviewTarget.name} berhasil dijadwalkan`);
    setInterviewTarget(null);
    setInterviewDate("");
    setInterviewTime("");
    setInterviewType("Online");
  };

  return (
    <DashboardLayout
      sidebarItems={sidebarItems}
      activeKey="shortlist"
      userName={displayName}
      userRole={displayRole}
      userInitial={displayInitial}
    >
      {interviewTarget && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(10,27,61,0.45)", zIndex: 1000, display: "flex", alignItems: "center", justifyContent: "center" }}>
          <div style={{ background: "#fff", borderRadius: 18, padding: 32, maxWidth: 420, width: "90%", boxShadow: "0 8px 40px rgba(10,27,61,0.18)" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <Calendar size={18} color="#1677FF" />
                <span style={{ fontFamily: "'Poppins', sans-serif", fontSize: 17, fontWeight: 700, color: "#0A1B3D" }}>Jadwalkan Interview</span>
              </div>
              <button onClick={() => setInterviewTarget(null)} style={{ background: "none", border: "none", cursor: "pointer", color: "#6a88b8" }}><X size={20} /></button>
            </div>
            <div style={{ background: "rgba(22,119,255,0.04)", border: "1px solid rgba(22,119,255,0.12)", borderRadius: 10, padding: "12px 16px", marginBottom: 20 }}>
              <div style={{ fontFamily: "'Poppins', sans-serif", fontSize: 14, fontWeight: 700, color: "#0A1B3D" }}>{interviewTarget.name}</div>
              <div style={{ fontFamily: "'Inter', sans-serif", fontSize: 12, color: "#6a88b8" }}>{interviewTarget.role}</div>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 14, marginBottom: 22 }}>
              <div>
                <label style={{ fontFamily: "'Inter', sans-serif", fontSize: 12, fontWeight: 600, color: "#6a88b8", display: "block", marginBottom: 6 }}>Tanggal Interview</label>
                <input type="date" value={interviewDate} onChange={(e) => setInterviewDate(e.target.value)} style={{ width: "100%", fontFamily: "'Inter', sans-serif", fontSize: 13, color: "#0A1B3D", border: "1px solid rgba(22,119,255,0.2)", borderRadius: 8, padding: "9px 12px", outline: "none", boxSizing: "border-box" }} />
              </div>
              <div>
                <label style={{ fontFamily: "'Inter', sans-serif", fontSize: 12, fontWeight: 600, color: "#6a88b8", display: "block", marginBottom: 6 }}>Waktu</label>
                <input type="time" value={interviewTime} onChange={(e) => setInterviewTime(e.target.value)} style={{ width: "100%", fontFamily: "'Inter', sans-serif", fontSize: 13, color: "#0A1B3D", border: "1px solid rgba(22,119,255,0.2)", borderRadius: 8, padding: "9px 12px", outline: "none", boxSizing: "border-box" }} />
              </div>
              <div>
                <label style={{ fontFamily: "'Inter', sans-serif", fontSize: 12, fontWeight: 600, color: "#6a88b8", display: "block", marginBottom: 6 }}>Tipe Interview</label>
                <select value={interviewType} onChange={(e) => setInterviewType(e.target.value)} style={{ width: "100%", fontFamily: "'Inter', sans-serif", fontSize: 13, color: "#0A1B3D", border: "1px solid rgba(22,119,255,0.2)", borderRadius: 8, padding: "9px 12px", outline: "none", background: "#fff" }}>
                  <option>Online</option>
                  <option>Offline</option>
                  <option>Hybrid</option>
                </select>
              </div>
            </div>
            <div style={{ display: "flex", gap: 10 }}>
              <button onClick={() => setInterviewTarget(null)} style={{ flex: 1, padding: "11px", borderRadius: 10, border: "1px solid rgba(22,119,255,0.2)", background: "#f0f7ff", fontFamily: "'Inter', sans-serif", fontSize: 13, color: "#6a88b8", cursor: "pointer" }}>Batal</button>
              <button onClick={handleConfirmInterview} style={{ flex: 2, padding: "11px", borderRadius: 10, border: "none", background: "linear-gradient(135deg, #1677FF, #0D47A1)", fontFamily: "'Poppins', sans-serif", fontSize: 13, fontWeight: 700, color: "#fff", cursor: "pointer" }}>Konfirmasi Jadwal</button>
            </div>
          </div>
        </div>
      )}
      <div style={{ padding: "32px", minHeight: "100vh", backgroundColor: "#f0f7ff" }}>
        <div style={{ marginBottom: "28px" }}>
          <h1 style={{ fontFamily: "Poppins, sans-serif", fontSize: "24px", fontWeight: 700, color: "#0A1B3D", margin: 0 }}>
            Shortlist Kandidat
          </h1>
          <p style={{ fontFamily: "Inter, sans-serif", fontSize: "14px", color: "#6b7280", marginTop: "6px" }}>
            {candidates.length} kandidat terpilih untuk proses lanjut
          </p>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: "20px" }}>
          {candidates.map((c, i) => (
            <div
              key={i}
              style={{
                backgroundColor: "#fff",
                borderRadius: "14px",
                padding: "24px",
                boxShadow: "0 1px 4px rgba(0,0,0,0.08)",
                display: "flex",
                flexDirection: "column",
                gap: "16px",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
                <div
                  style={{
                    width: "52px",
                    height: "52px",
                    borderRadius: "50%",
                    backgroundColor: c.avatarColor,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "#fff",
                    fontFamily: "Poppins, sans-serif",
                    fontSize: "18px",
                    fontWeight: 700,
                    flexShrink: 0,
                  }}
                >
                  {c.name.charAt(0)}
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontFamily: "Poppins, sans-serif", fontSize: "15px", fontWeight: 700, color: "#0A1B3D" }}>
                    {c.name}
                  </div>
                  <div style={{ fontFamily: "Inter, sans-serif", fontSize: "13px", color: "#6b7280", marginTop: "2px" }}>
                    {c.role}
                  </div>
                </div>
                <div
                  style={{
                    fontFamily: "JetBrains Mono, monospace",
                    fontSize: "22px",
                    fontWeight: 800,
                    color: matchColor(c.match),
                  }}
                >
                  {c.match}%
                </div>
              </div>

              <div style={{ display: "flex", flexWrap: "wrap", gap: "6px" }}>
                {c.skills.map((s) => (
                  <span
                    key={s}
                    style={{
                      fontFamily: "Inter, sans-serif",
                      fontSize: "11px",
                      fontWeight: 600,
                      color: "#1677FF",
                      backgroundColor: "#e8f0fe",
                      borderRadius: "20px",
                      padding: "3px 10px",
                    }}
                  >
                    {s}
                  </span>
                ))}
              </div>

              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <span
                  style={{
                    fontFamily: "Inter, sans-serif",
                    fontSize: "11px",
                    fontWeight: 600,
                    color: c.status === "Interview Dijadwalkan" ? "#10d98e" : "#f59e0b",
                    backgroundColor: c.status === "Interview Dijadwalkan" ? "#10d98e1a" : "#f59e0b1a",
                    borderRadius: "20px",
                    padding: "3px 12px",
                  }}
                >
                  {c.status}
                </span>
              </div>

              <div style={{ display: "flex", gap: "10px" }}>
                <button
                  onClick={() => navigate("/dashboard/perusahaan/kandidat/1")}
                  style={{
                    flex: 1,
                    fontFamily: "Inter, sans-serif",
                    fontSize: "13px",
                    fontWeight: 600,
                    color: "#1677FF",
                    backgroundColor: "#e8f0fe",
                    border: "none",
                    borderRadius: "8px",
                    padding: "9px 0",
                    cursor: "pointer",
                  }}
                >
                  Lihat Profil
                </button>
                <button
                  onClick={() => setInterviewTarget({ name: c.name, role: c.role })}
                  style={{
                    flex: 1,
                    fontFamily: "Inter, sans-serif",
                    fontSize: "13px",
                    fontWeight: 600,
                    color: "#fff",
                    backgroundColor: "#1677FF",
                    border: "none",
                    borderRadius: "8px",
                    padding: "9px 0",
                    cursor: "pointer",
                  }}
                >
                  Jadwalkan Interview
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
}
