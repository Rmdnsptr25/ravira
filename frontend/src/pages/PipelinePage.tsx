import { useState } from "react";
import { useNavigate } from "react-router";
import { LayoutDashboard, GitBranch, Briefcase, Plus, BookmarkCheck, BarChart2, Plug, Building2, Settings, ChevronRight } from "lucide-react";
import { toast } from "sonner";
import { DashboardLayout, SidebarItem } from "../components/DashboardLayout";
import { useAppContext, AppStatus } from "../contexts/AppContext";

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

type Candidate = { name: string; role: string; match: number; location?: string; isNew?: boolean };
type Column = {
  id: string;
  label: string;
  color: string;
  count: number;
  candidates: Candidate[];
};

const initialColumns: Column[] = [
  {
    id: "applied", label: "Applied", color: "#6a88b8", count: 9,
    candidates: [
      { name: "Budi Santoso", role: "Senior UX Designer", match: 94, location: "Yogyakarta", isNew: true },
      { name: "Dewi Lestari", role: "Product Manager", match: 76, location: "Bandung" },
      { name: "Eka Putra", role: "Data Analyst", match: 88 },
      { name: "Fajar Nugroho", role: "Backend Engineer", match: 71 },
      { name: "Gita Permata", role: "DevOps Specialist", match: 79 },
      { name: "Hendra Wijaya", role: "Senior UX Designer", match: 85 },
      { name: "Indah Sari", role: "Product Manager", match: 68 },
      { name: "Joko Susilo", role: "Data Analyst", match: 90 },
    ],
  },
  {
    id: "screening", label: "Screening", color: "#4DB8FF", count: 4,
    candidates: [
      { name: "Kartika Dewi", role: "Backend Engineer", match: 83 },
      { name: "Lina Marlina", role: "Senior UX Designer", match: 91 },
      { name: "Miko Pratama", role: "Data Analyst", match: 77 },
      { name: "Nina Kusuma", role: "Product Manager", match: 86 },
    ],
  },
  {
    id: "interview", label: "Interview", color: "#f59e0b", count: 3,
    candidates: [
      { name: "Oki Rahmad", role: "Backend Engineer", match: 89 },
      { name: "Putri Andini", role: "Senior UX Designer", match: 94 },
      { name: "Rizky Fauzan", role: "DevOps Specialist", match: 80 },
    ],
  },
  {
    id: "offer", label: "Offer", color: "#10d98e", count: 2,
    candidates: [
      { name: "Sari Utami", role: "Product Manager", match: 92 },
      { name: "Tono Hidayat", role: "Data Analyst", match: 88 },
    ],
  },
  {
    id: "hired", label: "Hired", color: "#1677FF", count: 1,
    candidates: [
      { name: "Ulfa Hasanah", role: "Senior UX Designer", match: 96 },
    ],
  },
];

function matchColor(score: number): string {
  if (score >= 85) return "#10d98e";
  if (score >= 70) return "#f59e0b";
  return "#ff6b6b";
}

const stageOrder = ["applied", "screening", "interview", "offer", "hired"];
const stageLabels: Record<string, string> = { applied: "Applied", screening: "Screening", interview: "Interview", offer: "Offer", hired: "Hired" };

const stageToStatus: Record<string, AppStatus> = {
  applied: "Dikirim",
  screening: "Screening",
  interview: "Interview",
  offer: "Offer",
  hired: "Diterima",
};

export default function PipelinePage() {
  const navigate = useNavigate();
  const { updateApplicationStatus, applications } = useAppContext();

  const budiApp = applications.find(a => a.perusahaan === "Tokopedia" || a.posisi === "Senior UX Designer");

  const enrichedInitial = initialColumns.map(col => {
    if (col.id === "applied") {
      const hasBudi = col.candidates.some(c => c.name === "Budi Santoso");
      if (!hasBudi && budiApp) {
        return { ...col, candidates: [{ name: "Budi Santoso", role: budiApp.posisi, match: budiApp.match, location: budiApp.lokasi, isNew: true }, ...col.candidates], count: col.count + 1 };
      }
    }
    return col;
  });

  const [columns, setColumns] = useState(enrichedInitial);

  const moveCandidate = (candidateName: string, fromColId: string, toColId: string) => {
    setColumns(prev => {
      const newCols = prev.map(col => ({ ...col, candidates: [...col.candidates] }));
      const fromCol = newCols.find(c => c.id === fromColId)!;
      const toCol = newCols.find(c => c.id === toColId)!;
      const idx = fromCol.candidates.findIndex(c => c.name === candidateName);
      if (idx === -1) return prev;
      const [moved] = fromCol.candidates.splice(idx, 1);
      fromCol.count = Math.max(0, fromCol.count - 1);
      toCol.candidates.unshift(moved);
      toCol.count = toCol.count + 1;
      return newCols;
    });
    toast.success(`${candidateName} dipindahkan ke ${stageLabels[toColId]}`);
    if (candidateName === "Budi Santoso") {
      const budiId = applications.find(a => a.posisi === "Senior UX Designer" && a.perusahaan === "Tokopedia")?.id
        ?? applications[0]?.id;
      if (budiId) updateApplicationStatus(budiId, stageToStatus[toColId]);
    }
  };

  return (
    <DashboardLayout
      sidebarItems={sidebarItems}
      activeKey="pipeline"
      userName="Siti Rahayu"
      userRole="HR Manager · Tokopedia"
      userInitial="S"
    >
      <div style={{ padding: "32px", minHeight: "100vh", backgroundColor: "#f0f7ff" }}>
        <div style={{ marginBottom: "28px" }}>
          <h1 style={{ fontFamily: "Poppins, sans-serif", fontSize: "24px", fontWeight: 700, color: "#0A1B3D", margin: 0 }}>
            Kandidat Pipeline
          </h1>
          <p style={{ fontFamily: "Inter, sans-serif", fontSize: "14px", color: "#6b7280", marginTop: "6px" }}>
            Kelola kandidat di setiap tahapan rekrutmen
          </p>
        </div>

        <div style={{ display: "flex", gap: "16px", overflowX: "auto", paddingBottom: "16px" }}>
          {columns.map((col) => (
            <div
              key={col.id}
              style={{
                minWidth: "240px",
                flex: "0 0 240px",
                backgroundColor: "#fff",
                borderRadius: "12px",
                padding: "16px",
                boxShadow: "0 1px 4px rgba(0,0,0,0.08)",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "16px" }}>
                <span style={{ fontFamily: "Poppins, sans-serif", fontSize: "14px", fontWeight: 600, color: "#0A1B3D" }}>
                  {col.label}
                </span>
                <span
                  style={{
                    fontFamily: "JetBrains Mono, monospace",
                    fontSize: "12px",
                    fontWeight: 700,
                    color: col.color,
                    backgroundColor: col.color + "1a",
                    borderRadius: "12px",
                    padding: "2px 10px",
                  }}
                >
                  {col.count}
                </span>
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                {col.candidates.map((c, i) => {
                  const currentIdx = stageOrder.indexOf(col.id);
                  const nextStage = currentIdx < stageOrder.length - 1 ? stageOrder[currentIdx + 1] : null;
                  return (
                  <div
                    key={i}
                    style={{
                      backgroundColor: c.isNew ? "rgba(22,119,255,0.03)" : "#f9fbff",
                      border: c.isNew ? "1px solid rgba(22,119,255,0.25)" : "1px solid #e5eaf3",
                      borderRadius: "10px",
                      padding: "12px",
                    }}
                  >
                    <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "8px" }}>
                      <div
                        style={{
                          width: "34px",
                          height: "34px",
                          borderRadius: "50%",
                          backgroundColor: "#1677FF",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          color: "#fff",
                          fontFamily: "Poppins, sans-serif",
                          fontSize: "13px",
                          fontWeight: 700,
                          flexShrink: 0,
                        }}
                      >
                        {c.name.charAt(0)}
                      </div>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
                          <div style={{ fontFamily: "Inter, sans-serif", fontSize: "13px", fontWeight: 600, color: "#0A1B3D" }}>
                            {c.name}
                          </div>
                          {c.isNew && <span style={{ fontFamily: "Inter, sans-serif", fontSize: 9, fontWeight: 700, color: "#fff", background: "#1677FF", borderRadius: 4, padding: "1px 5px" }}>BARU</span>}
                        </div>
                        <div style={{ fontFamily: "Inter, sans-serif", fontSize: "11px", color: "#6b7280" }}>
                          {c.role}{c.location ? ` · ${c.location}` : ""}
                        </div>
                      </div>
                    </div>

                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: nextStage ? 8 : 0 }}>
                      <span
                        style={{
                          fontFamily: "JetBrains Mono, monospace",
                          fontSize: "12px",
                          fontWeight: 700,
                          color: matchColor(c.match),
                          backgroundColor: matchColor(c.match) + "1a",
                          borderRadius: "8px",
                          padding: "2px 8px",
                        }}
                      >
                        {c.match}% match
                      </span>
                      <button
                        onClick={() => navigate("/dashboard/perusahaan/kandidat/1")}
                        style={{
                          fontFamily: "Inter, sans-serif",
                          fontSize: "11px",
                          fontWeight: 600,
                          color: "#1677FF",
                          backgroundColor: "#e8f0fe",
                          border: "none",
                          borderRadius: "6px",
                          padding: "4px 10px",
                          cursor: "pointer",
                        }}
                      >
                        Profil
                      </button>
                    </div>
                    {nextStage && (
                      <button
                        onClick={() => moveCandidate(c.name, col.id, nextStage)}
                        style={{ width: "100%", fontFamily: "Inter, sans-serif", fontSize: "11px", fontWeight: 600, color: col.color, backgroundColor: col.color + "1a", border: `1px solid ${col.color}40`, borderRadius: "6px", padding: "4px 0", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 3 }}
                      >
                        Pindah ke {stageLabels[nextStage]} <ChevronRight size={11} />
                      </button>
                    )}
                  </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
}
