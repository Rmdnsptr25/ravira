import { useState } from "react";
import { useNavigate } from "react-router";
import { Users, TrendingUp, Briefcase, AlertCircle, BarChart2, Globe, LayoutDashboard, MapPin, BookOpen, FileText, Settings, Download } from "lucide-react";
import {
  AreaChart, Area, BarChart, Bar,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from "recharts";
import { DashboardLayout, SidebarItem } from "../components/DashboardLayout";
import { ExportReportModal } from "../components/Modals";

const sidebarItems: SidebarItem[] = [
  { key: "ringkasan", label: "Ringkasan", icon: <LayoutDashboard size={16} />, path: "/dashboard/analytics" },
  { key: "workforce", label: "Analitik Workforce", icon: <Users size={16} />, path: "/dashboard/analytics/workforce" },
  { key: "tren", label: "Tren Skill", icon: <TrendingUp size={16} />, path: "/dashboard/analytics/tren-skill" },
  { key: "heatmap", label: "Heatmap Regional", icon: <MapPin size={16} />, path: "/dashboard/analytics/heatmap" },
  { key: "proyeksi", label: "Proyeksi Kompetensi", icon: <BarChart2 size={16} />, path: "/dashboard/analytics/proyeksi" },
  { key: "program", label: "Rekomendasi Program Pelatihan", icon: <BookOpen size={16} />, path: "/dashboard/analytics/rekomendasi-program" },
  { key: "laporan", label: "Laporan & Ekspor", icon: <FileText size={16} />, path: "/dashboard/analytics/laporan" },
  { key: "pengaturan", label: "Pengaturan", icon: <Settings size={16} />, path: "/dashboard/analytics/pengaturan" },
];

const kpiData = [
  { label: "Total Angkatan Kerja", value: "142.6 Jt", change: "+2.3%", color: "#1677FF", icon: Users },
  { label: "Tingkat Pengangguran", value: "5.32%", change: "-0.4%", color: "#10d98e", icon: TrendingUp },
  { label: "Lowongan Terbuka", value: "2.84 Jt", change: "+8.1%", color: "#f59e0b", icon: Briefcase },
  { label: "Mismatch Skill", value: "34.2%", change: "-1.8%", color: "#8b5cf6", icon: AlertCircle },
];

const trendData = [
  { bulan: "Jan", tersedia: 2100, terserap: 1850 },
  { bulan: "Feb", tersedia: 2280, terserap: 1960 },
  { bulan: "Mar", tersedia: 2450, terserap: 2100 },
  { bulan: "Apr", tersedia: 2600, terserap: 2280 },
  { bulan: "Mei", tersedia: 2750, terserap: 2400 },
  { bulan: "Jun", tersedia: 2840, terserap: 2520 },
];

const skillDemandData = [
  { skill: "Software Dev", demand: 95, supply: 62 },
  { skill: "Data Science", demand: 88, supply: 45 },
  { skill: "Cloud/DevOps", demand: 82, supply: 38 },
  { skill: "Cybersecurity", demand: 78, supply: 32 },
  { skill: "UI/UX Design", demand: 74, supply: 58 },
  { skill: "Digital Mktg", demand: 70, supply: 65 },
];

const regionalData = [
  { wilayah: "DKI Jakarta", pengangguran: 6.8, lowongan: 285 },
  { wilayah: "Jawa Barat", pengangguran: 7.2, lowongan: 412 },
  { wilayah: "Jawa Tengah", pengangguran: 5.9, lowongan: 198 },
  { wilayah: "DI Yogyakarta", pengangguran: 4.1, lowongan: 132 },
  { wilayah: "Jawa Timur", pengangguran: 4.8, lowongan: 356 },
  { wilayah: "Banten", pengangguran: 6.2, lowongan: 214 },
];

const emergingSkills = [
  { name: "Generative AI", growth: "+340%", urgency: "high" },
  { name: "LLM Engineering", growth: "+280%", urgency: "high" },
  { name: "Cloud Architecture", growth: "+145%", urgency: "medium" },
  { name: "Data Engineering", growth: "+132%", urgency: "medium" },
  { name: "Blockchain Dev", growth: "+98%", urgency: "medium" },
  { name: "IoT Development", growth: "+76%", urgency: "low" },
];

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div style={{ background: "#071228", border: "1px solid rgba(22,119,255,0.2)", borderRadius: 10, padding: "10px 14px" }}>
        <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11, color: "#4DB8FF", marginBottom: 6 }}>{label}</div>
        {payload.map((p: any) => (
          <div key={p.name} style={{ fontFamily: "'Inter', sans-serif", fontSize: 12, color: p.color, marginBottom: 2 }}>
            {p.name}: <strong>{typeof p.value === "number" ? p.value.toLocaleString() : p.value}</strong>
          </div>
        ))}
      </div>
    );
  }
  return null;
};

export default function DashboardAnalyticsPage() {
  const navigate = useNavigate();
  const [activeRegion, setActiveRegion] = useState<string | null>(null);
  const [showExport, setShowExport] = useState(false);

  return (
    <DashboardLayout sidebarItems={sidebarItems} userName="Dr. Bambang Prasetyo" userRole="Disnaker DKI Jakarta" userInitial="B">
      {showExport && <ExportReportModal reportName="Laporan Workforce Nasional" onClose={() => setShowExport(false)} />}

      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
        <div>
          <h1 style={{ fontFamily: "'Poppins', sans-serif", fontSize: 22, fontWeight: 800, color: "#0A1B3D", marginBottom: 4 }}>
            Workforce Analytics Dashboard
          </h1>
          <p style={{ fontFamily: "'Inter', sans-serif", fontSize: 14, color: "#6a88b8" }}>
            Data nasional per Mei 2026 · Diperbarui setiap hari
          </p>
        </div>
        <div style={{ display: "flex", gap: 8 }}>
          <button onClick={() => navigate("/dashboard/analytics/heatmap")}
            style={{ display: "flex", alignItems: "center", gap: 6, padding: "9px 14px", borderRadius: 10, border: "1px solid rgba(22,119,255,0.2)", background: "#fff", fontFamily: "'Inter', sans-serif", fontSize: 13, color: "#1677FF", cursor: "pointer" }}>
            <Globe size={14} /> Semua Wilayah
          </button>
          <button onClick={() => setShowExport(true)}
            style={{ display: "flex", alignItems: "center", gap: 6, padding: "9px 14px", borderRadius: 10, border: "none", background: "linear-gradient(135deg, #1677FF, #0D47A1)", fontFamily: "'Poppins', sans-serif", fontSize: 13, fontWeight: 700, color: "#fff", cursor: "pointer" }}>
            <Download size={14} /> Ekspor Laporan
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 14, marginBottom: 22 }}>
        {kpiData.map((k) => (
          <div key={k.label} style={{ background: "#fff", borderRadius: 16, border: "1px solid rgba(22,119,255,0.1)", padding: "18px 20px", boxShadow: "0 2px 10px rgba(10,27,61,0.04)" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
              <div style={{ width: 36, height: 36, borderRadius: 10, background: `${k.color}14`, display: "flex", alignItems: "center", justifyContent: "center" }}>
                <k.icon size={18} color={k.color} />
              </div>
              <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11, color: "#10d98e", background: "rgba(16,217,142,0.08)", padding: "2px 8px", borderRadius: 6 }}>{k.change}</span>
            </div>
            <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 24, fontWeight: 800, color: "#0A1B3D", lineHeight: 1 }}>{k.value}</div>
            <div style={{ fontFamily: "'Inter', sans-serif", fontSize: 12, color: "#6a88b8", marginTop: 4 }}>{k.label}</div>
          </div>
        ))}
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 18, marginBottom: 18 }}>
        {/* Trend Chart */}
        <div style={{ background: "#fff", borderRadius: 18, border: "1px solid rgba(22,119,255,0.1)", padding: "22px", boxShadow: "0 2px 10px rgba(10,27,61,0.04)" }}>
          <div style={{ fontFamily: "'Poppins', sans-serif", fontSize: 14, fontWeight: 700, color: "#0A1B3D", marginBottom: 4 }}>Tren Penyerapan Tenaga Kerja</div>
          <div style={{ fontFamily: "'Inter', sans-serif", fontSize: 12, color: "#6a88b8", marginBottom: 16 }}>dalam ribuan orang · Jan–Jun 2026</div>
          <ResponsiveContainer width="100%" height={200}>
            <AreaChart data={trendData} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="gradA" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#1677FF" stopOpacity={0.2} />
                  <stop offset="95%" stopColor="#1677FF" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="gradB" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10d98e" stopOpacity={0.2} />
                  <stop offset="95%" stopColor="#10d98e" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(22,119,255,0.08)" />
              <XAxis dataKey="bulan" tick={{ fontFamily: "'Inter', sans-serif", fontSize: 11, fill: "#9ab4cc" }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10, fill: "#9ab4cc" }} axisLine={false} tickLine={false} />
              <Tooltip content={<CustomTooltip />} />
              <Area type="monotone" dataKey="tersedia" name="Lowongan Tersedia" stroke="#1677FF" fill="url(#gradA)" strokeWidth={2} dot={false} />
              <Area type="monotone" dataKey="terserap" name="Tenaga Terserap" stroke="#10d98e" fill="url(#gradB)" strokeWidth={2} dot={false} />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Skill Demand vs Supply */}
        <div style={{ background: "#fff", borderRadius: 18, border: "1px solid rgba(22,119,255,0.1)", padding: "22px", boxShadow: "0 2px 10px rgba(10,27,61,0.04)" }}>
          <div style={{ fontFamily: "'Poppins', sans-serif", fontSize: 14, fontWeight: 700, color: "#0A1B3D", marginBottom: 4 }}>Demand vs Supply Skill</div>
          <div style={{ fontFamily: "'Inter', sans-serif", fontSize: 12, color: "#6a88b8", marginBottom: 16 }}>Skor 0–100 · Gap = mismatch skill</div>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={skillDemandData} layout="vertical" margin={{ top: 0, right: 0, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(22,119,255,0.08)" horizontal={false} />
              <XAxis type="number" domain={[0, 100]} tick={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10, fill: "#9ab4cc" }} axisLine={false} tickLine={false} />
              <YAxis type="category" dataKey="skill" tick={{ fontFamily: "'Inter', sans-serif", fontSize: 10, fill: "#6a88b8" }} axisLine={false} tickLine={false} width={72} />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="demand" name="Demand" fill="#1677FF" radius={[0, 4, 4, 0]} barSize={8} />
              <Bar dataKey="supply" name="Supply" fill="#4DB8FF" radius={[0, 4, 4, 0]} barSize={8} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 280px", gap: 18 }}>
        {/* Regional Table */}
        <div style={{ background: "#fff", borderRadius: 18, border: "1px solid rgba(22,119,255,0.1)", padding: "22px", boxShadow: "0 2px 10px rgba(10,27,61,0.04)" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
            <div>
              <div style={{ fontFamily: "'Poppins', sans-serif", fontSize: 14, fontWeight: 700, color: "#0A1B3D" }}>Data Workforce per Provinsi</div>
              <div style={{ fontFamily: "'Inter', sans-serif", fontSize: 12, color: "#6a88b8" }}>
                Klik baris untuk detail ·{" "}
                <button onClick={() => navigate("/dashboard/analytics/heatmap")} style={{ background: "none", border: "none", cursor: "pointer", color: "#1677FF", fontFamily: "'Inter', sans-serif", fontSize: 12, padding: 0 }}>
                  Lihat Heatmap
                </button>
              </div>
            </div>
            <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11, color: "#1677FF", background: "rgba(22,119,255,0.08)", padding: "4px 10px", borderRadius: 8 }}>Top 6 Provinsi</span>
          </div>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr>
                {["Provinsi", "Pengangguran (%)", "Lowongan (rb)"].map((h) => (
                  <th key={h} style={{ fontFamily: "'Inter', sans-serif", fontSize: 11, fontWeight: 600, color: "#9ab4cc", textAlign: "left", padding: "8px 12px", borderBottom: "1px solid rgba(22,119,255,0.08)", textTransform: "uppercase", letterSpacing: "0.05em" }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {regionalData.map((r) => (
                <tr
                  key={r.wilayah}
                  onClick={() => setActiveRegion(r.wilayah === activeRegion ? null : r.wilayah)}
                  style={{ cursor: "pointer", background: activeRegion === r.wilayah ? "rgba(22,119,255,0.04)" : "transparent", transition: "background 0.15s" }}
                  onMouseEnter={(e) => { if (activeRegion !== r.wilayah) e.currentTarget.style.background = "rgba(22,119,255,0.02)"; }}
                  onMouseLeave={(e) => { if (activeRegion !== r.wilayah) e.currentTarget.style.background = "transparent"; }}
                >
                  <td style={{ fontFamily: "'Inter', sans-serif", fontSize: 13, fontWeight: 600, color: "#0A1B3D", padding: "12px 12px", borderBottom: "1px solid rgba(22,119,255,0.06)" }}>
                    {activeRegion === r.wilayah && <span style={{ color: "#1677FF", marginRight: 6 }}>▶</span>}
                    {r.wilayah}
                  </td>
                  <td style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 13, color: r.pengangguran > 6 ? "#ff6b6b" : "#10d98e", padding: "12px 12px", borderBottom: "1px solid rgba(22,119,255,0.06)", fontWeight: 700 }}>{r.pengangguran}%</td>
                  <td style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 13, color: "#1677FF", padding: "12px 12px", borderBottom: "1px solid rgba(22,119,255,0.06)", fontWeight: 700 }}>{r.lowongan}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Emerging Skills */}
        <div style={{ background: "#fff", borderRadius: 18, border: "1px solid rgba(22,119,255,0.1)", padding: "22px", boxShadow: "0 2px 10px rgba(10,27,61,0.04)" }}>
          <div style={{ fontFamily: "'Poppins', sans-serif", fontSize: 14, fontWeight: 700, color: "#0A1B3D", marginBottom: 4 }}>Emerging Skills</div>
          <div style={{ fontFamily: "'Inter', sans-serif", fontSize: 12, color: "#6a88b8", marginBottom: 16 }}>Pertumbuhan permintaan YoY</div>
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {emergingSkills.map((s) => (
              <div key={s.name} style={{
                display: "flex", justifyContent: "space-between", alignItems: "center",
                padding: "10px 12px", borderRadius: 10,
                background: s.urgency === "high" ? "rgba(255,107,107,0.04)" : s.urgency === "medium" ? "rgba(245,158,11,0.04)" : "rgba(22,119,255,0.04)",
                border: `1px solid ${s.urgency === "high" ? "rgba(255,107,107,0.15)" : s.urgency === "medium" ? "rgba(245,158,11,0.15)" : "rgba(22,119,255,0.12)"}`,
              }}>
                <div>
                  <div style={{ fontFamily: "'Inter', sans-serif", fontSize: 13, fontWeight: 600, color: "#0A1B3D", marginBottom: 2 }}>{s.name}</div>
                  <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10, color: s.urgency === "high" ? "#ff6b6b" : s.urgency === "medium" ? "#f59e0b" : "#1677FF" }}>
                    {s.urgency === "high" ? "KRITIS" : s.urgency === "medium" ? "TINGGI" : "MODERAT"}
                  </div>
                </div>
                <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 14, fontWeight: 800, color: "#10d98e" }}>{s.growth}</span>
              </div>
            ))}
          </div>
          <button onClick={() => navigate("/dashboard/analytics/tren-skill")}
            style={{ width: "100%", marginTop: 16, padding: "9px", borderRadius: 10, border: "1px solid rgba(22,119,255,0.2)", background: "#f0f7ff", fontFamily: "'Inter', sans-serif", fontSize: 13, fontWeight: 600, color: "#1677FF", cursor: "pointer" }}>
            Lihat Tren Skill Lengkap →
          </button>
        </div>
      </div>
    </DashboardLayout>
  );
}
