import { LayoutDashboard, GitBranch, Briefcase, Plus, BookmarkCheck, BarChart2, Plug, Building2, Settings, Users, TrendingUp, CheckCircle, Activity } from "lucide-react";
import { DashboardLayout } from "../components/DashboardLayout";
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

const stats = [
  { label: "Total Pelamar", value: "248", color: "#1677FF", icon: Users },
  { label: "Avg Match Score", value: "78%", color: "#10d98e", icon: TrendingUp },
  { label: "Interview Rate", value: "31%", color: "#f59e0b", icon: Activity },
  { label: "Offer Rate", value: "12%", color: "#ff9a3c", icon: CheckCircle },
];

const monthlyData = [
  { month: "Jan", value: 32 },
  { month: "Feb", value: 45 },
  { month: "Mar", value: 28 },
  { month: "Apr", value: 61 },
  { month: "Mei", value: 48 },
  { month: "Jun", value: 72 },
];
const maxBar = Math.max(...monthlyData.map((d) => d.value));

const topPositions = [
  { position: "Backend Engineer", apps: 91, match: 76 },
  { position: "Data Analyst", apps: 67, match: 81 },
  { position: "Senior UX Designer", apps: 48, match: 78 },
  { position: "Product Manager", apps: 32, match: 72 },
  { position: "DevOps Specialist", apps: 23, match: 69 },
];

const funnel = [
  { label: "Applied", count: 248, color: "#1677FF" },
  { label: "Shortlist", count: 86, color: "#4DB8FF" },
  { label: "Interview", count: 42, color: "#f59e0b" },
  { label: "Offer", count: 18, color: "#ff9a3c" },
  { label: "Hired", count: 8, color: "#10d98e" },
];

export default function RecruitmentAnalyticsPage() {
  return (
    <DashboardLayout
      sidebarItems={sidebarItems}
      activeKey="analitik"
      userName="Siti Rahayu"
      userRole="HR Manager · Tokopedia"
      userInitial="S"
    >
      <div style={{ padding: "32px", minHeight: "100vh", backgroundColor: "#f0f7ff" }}>
        <div style={{ marginBottom: "28px" }}>
          <h1 style={{ fontFamily: "Poppins, sans-serif", fontSize: "24px", fontWeight: 700, color: "#0A1B3D", margin: 0 }}>
            Analitik Rekrutmen
          </h1>
          <p style={{ fontFamily: "Inter, sans-serif", fontSize: "14px", color: "#6b7280", marginTop: "6px" }}>
            Pantau performa proses rekrutmen Anda
          </p>
        </div>

        {/* Stats */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "16px", marginBottom: "24px" }}>
          {stats.map((s) => (
            <div
              key={s.label}
              style={{
                backgroundColor: "#fff",
                borderRadius: "14px",
                padding: "24px",
                boxShadow: "0 1px 4px rgba(0,0,0,0.08)",
                borderTop: `3px solid ${s.color}`,
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "12px" }}>
                <s.icon size={20} color={s.color} />
                <span style={{ fontFamily: "Inter, sans-serif", fontSize: "13px", color: "#6b7280" }}>{s.label}</span>
              </div>
              <div style={{ fontFamily: "JetBrains Mono, monospace", fontSize: "32px", fontWeight: 800, color: s.color }}>
                {s.value}
              </div>
            </div>
          ))}
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px", marginBottom: "24px" }}>
          {/* Bar Chart */}
          <div style={{ backgroundColor: "#fff", borderRadius: "14px", padding: "24px", boxShadow: "0 1px 4px rgba(0,0,0,0.08)" }}>
            <h3 style={{ fontFamily: "Poppins, sans-serif", fontSize: "15px", fontWeight: 700, color: "#0A1B3D", margin: "0 0 20px" }}>
              Pelamar Per Bulan
            </h3>
            <div style={{ display: "flex", alignItems: "flex-end", gap: "12px", height: "160px" }}>
              {monthlyData.map((d) => (
                <div key={d.month} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: "6px", height: "100%" }}>
                  <div style={{ flex: 1, display: "flex", alignItems: "flex-end", width: "100%" }}>
                    <div
                      style={{
                        width: "100%",
                        height: `${(d.value / maxBar) * 100}%`,
                        background: "linear-gradient(180deg, #1677FF, #4DB8FF)",
                        borderRadius: "6px 6px 0 0",
                        minHeight: "8px",
                      }}
                    />
                  </div>
                  <span style={{ fontFamily: "Inter, sans-serif", fontSize: "11px", color: "#6b7280" }}>{d.month}</span>
                  <span style={{ fontFamily: "JetBrains Mono, monospace", fontSize: "11px", fontWeight: 700, color: "#0A1B3D" }}>{d.value}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Funnel */}
          <div style={{ backgroundColor: "#fff", borderRadius: "14px", padding: "24px", boxShadow: "0 1px 4px rgba(0,0,0,0.08)" }}>
            <h3 style={{ fontFamily: "Poppins, sans-serif", fontSize: "15px", fontWeight: 700, color: "#0A1B3D", margin: "0 0 20px" }}>
              Conversion Funnel
            </h3>
            <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
              {funnel.map((f) => (
                <div key={f.label} style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                  <div style={{ width: "90px", fontFamily: "Inter, sans-serif", fontSize: "13px", color: "#374151", flexShrink: 0 }}>{f.label}</div>
                  <div style={{ flex: 1, height: "28px", backgroundColor: "#f0f4fa", borderRadius: "6px", overflow: "hidden" }}>
                    <div
                      style={{
                        width: `${(f.count / 248) * 100}%`,
                        height: "100%",
                        backgroundColor: f.color,
                        borderRadius: "6px",
                        transition: "width 0.4s",
                      }}
                    />
                  </div>
                  <span style={{ fontFamily: "JetBrains Mono, monospace", fontSize: "13px", fontWeight: 700, color: f.color, width: "36px", textAlign: "right" }}>
                    {f.count}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Top positions table */}
        <div style={{ backgroundColor: "#fff", borderRadius: "14px", padding: "24px", boxShadow: "0 1px 4px rgba(0,0,0,0.08)" }}>
          <h3 style={{ fontFamily: "Poppins, sans-serif", fontSize: "15px", fontWeight: 700, color: "#0A1B3D", margin: "0 0 20px" }}>
            Top 5 Posisi berdasarkan Pelamar
          </h3>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ borderBottom: "1px solid #e5eaf3" }}>
                {["Nama Posisi", "Jumlah Pelamar", "Avg Match Score"].map((h) => (
                  <th key={h} style={{ fontFamily: "Inter, sans-serif", fontSize: "12px", fontWeight: 600, color: "#6b7280", textAlign: "left", padding: "8px 12px", textTransform: "uppercase", letterSpacing: "0.04em" }}>
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {topPositions.map((p, i) => (
                <tr key={i} style={{ borderBottom: i < topPositions.length - 1 ? "1px solid #f0f4fa" : "none" }}>
                  <td style={{ padding: "14px 12px", fontFamily: "Inter, sans-serif", fontSize: "14px", fontWeight: 600, color: "#0A1B3D" }}>{p.position}</td>
                  <td style={{ padding: "14px 12px", fontFamily: "JetBrains Mono, monospace", fontSize: "14px", color: "#0A1B3D" }}>{p.apps}</td>
                  <td style={{ padding: "14px 12px" }}>
                    <span style={{ fontFamily: "JetBrains Mono, monospace", fontSize: "13px", fontWeight: 700, color: p.match >= 78 ? "#10d98e" : "#f59e0b" }}>
                      {p.match}%
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </DashboardLayout>
  );
}
