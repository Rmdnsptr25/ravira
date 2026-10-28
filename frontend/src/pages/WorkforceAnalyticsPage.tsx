import { LayoutDashboard, Users, TrendingUp, MapPin, BarChart2, BookOpen, FileText, Settings } from "lucide-react";
import { DashboardLayout } from "../components/DashboardLayout";
import type { SidebarItem } from "../components/DashboardLayout";

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

const stats = [
  { label: "Total Angkatan Kerja", value: "142.6 Jt", color: "#1677FF" },
  { label: "Tingkat Penyerapan", value: "68.2%", color: "#10d98e" },
  { label: "Lowongan Terbuka", value: "2.84 Jt", color: "#f59e0b" },
  { label: "Mismatch Skill", value: "34.2%", color: "#8b5cf6" },
];

const industries = [
  { rank: 1, name: "Teknologi Informasi", demand: 428000, growth: "+18.2%" },
  { rank: 2, name: "Manufaktur & Industri", demand: 386000, growth: "+5.4%" },
  { rank: 3, name: "Perdagangan & Retail", demand: 342000, growth: "+7.8%" },
  { rank: 4, name: "Kesehatan & Farmasi", demand: 298000, growth: "+22.1%" },
  { rank: 5, name: "Konstruksi & Properti", demand: 276000, growth: "+11.3%" },
  { rank: 6, name: "Keuangan & Perbankan", demand: 241000, growth: "+9.6%" },
  { rank: 7, name: "Pendidikan", demand: 218000, growth: "+4.2%" },
  { rank: 8, name: "Logistik & Transportasi", demand: 195000, growth: "+14.7%" },
  { rank: 9, name: "Pariwisata & Perhotelan", demand: 172000, growth: "+31.4%" },
  { rank: 10, name: "Pertanian & Agribisnis", demand: 148000, growth: "-2.1%" },
];

const barHeights = [55, 72, 68, 85, 90, 78, 62, 88, 76, 95, 82, 70];
const months = ["Jan", "Feb", "Mar", "Apr", "Mei", "Jun", "Jul", "Ags", "Sep", "Okt", "Nov", "Des"];

export default function WorkforceAnalyticsPage() {

  return (
    <DashboardLayout sidebarItems={sidebarItems} userName="Dr. Bambang Prasetyo" userRole="Disnaker DKI Jakarta" userInitial="B">
      {/* Info Banner */}
      <div style={{ background: "rgba(22,119,255,0.06)", border: "1px solid rgba(22,119,255,0.2)", borderRadius: 10, padding: "10px 16px", marginBottom: 20, display: "flex", alignItems: "center", gap: 10 }}>
        <span style={{ color: "#1677FF", fontSize: 14 }}>ℹ</span>
        <span style={{ fontFamily: "'Inter', sans-serif", fontSize: 13, color: "#1677FF" }}>Data yang ditampilkan bersifat agregat dan anonim.</span>
      </div>

      {/* Header */}
      <div style={{ marginBottom: 24 }}>
        <h1 style={{ fontFamily: "'Poppins', sans-serif", fontSize: 22, fontWeight: 800, color: "#0A1B3D", marginBottom: 4 }}>Analitik Workforce</h1>
        <p style={{ fontFamily: "'Inter', sans-serif", fontSize: 14, color: "#6a88b8" }}>Analisis mendalam tenaga kerja nasional · Data per Juni 2026</p>
      </div>

      {/* Stats */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 14, marginBottom: 24 }}>
        {stats.map((s) => (
          <div key={s.label} style={{ background: "#fff", borderRadius: 16, border: "1px solid rgba(22,119,255,0.1)", padding: "20px", boxShadow: "0 2px 10px rgba(10,27,61,0.04)" }}>
            <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 26, fontWeight: 800, color: s.color, lineHeight: 1, marginBottom: 6 }}>{s.value}</div>
            <div style={{ fontFamily: "'Inter', sans-serif", fontSize: 12, color: "#6a88b8" }}>{s.label}</div>
          </div>
        ))}
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20, marginBottom: 24 }}>
        {/* Industry Table */}
        <div style={{ background: "#fff", borderRadius: 18, border: "1px solid rgba(22,119,255,0.1)", padding: "22px", boxShadow: "0 2px 10px rgba(10,27,61,0.04)" }}>
          <div style={{ fontFamily: "'Poppins', sans-serif", fontSize: 15, fontWeight: 700, color: "#0A1B3D", marginBottom: 4 }}>Top 10 Industri berdasarkan Permintaan</div>
          <div style={{ fontFamily: "'Inter', sans-serif", fontSize: 12, color: "#6a88b8", marginBottom: 16 }}>Jumlah lowongan terbuka nasional</div>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr>
                {["#", "Industri", "Lowongan", "Pertumbuhan"].map((h) => (
                  <th key={h} style={{ fontFamily: "'Inter', sans-serif", fontSize: 11, fontWeight: 600, color: "#9ab4cc", textAlign: "left", padding: "8px 10px", borderBottom: "1px solid rgba(22,119,255,0.08)", textTransform: "uppercase", letterSpacing: "0.05em" }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {industries.map((ind) => (
                <tr key={ind.rank} style={{ borderBottom: "1px solid rgba(22,119,255,0.06)" }}>
                  <td style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 12, color: "#9ab4cc", padding: "10px 10px", fontWeight: 700 }}>{ind.rank}</td>
                  <td style={{ fontFamily: "'Inter', sans-serif", fontSize: 13, color: "#0A1B3D", padding: "10px 10px", fontWeight: 600 }}>{ind.name}</td>
                  <td style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 12, color: "#1677FF", padding: "10px 10px", fontWeight: 700 }}>{ind.demand.toLocaleString()}</td>
                  <td style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 12, color: ind.growth.startsWith("+") ? "#10d98e" : "#ff6b6b", padding: "10px 10px", fontWeight: 700 }}>{ind.growth}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Bar Chart Placeholder */}
        <div style={{ background: "#fff", borderRadius: 18, border: "1px solid rgba(22,119,255,0.1)", padding: "22px", boxShadow: "0 2px 10px rgba(10,27,61,0.04)" }}>
          <div style={{ fontFamily: "'Poppins', sans-serif", fontSize: 15, fontWeight: 700, color: "#0A1B3D", marginBottom: 4 }}>Penyerapan Tenaga Kerja Bulanan</div>
          <div style={{ fontFamily: "'Inter', sans-serif", fontSize: 12, color: "#6a88b8", marginBottom: 20 }}>dalam ribuan orang · Tahun 2026</div>
          <div style={{ display: "flex", alignItems: "flex-end", gap: 8, height: 200, padding: "0 8px" }}>
            {barHeights.map((h, i) => (
              <div key={i} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 6 }}>
                <div style={{
                  width: "100%",
                  height: `${h * 1.6}px`,
                  background: `linear-gradient(180deg, #4DB8FF, #1677FF)`,
                  borderRadius: "4px 4px 0 0",
                  opacity: 0.85,
                }} />
                <span style={{ fontFamily: "'Inter', sans-serif", fontSize: 9, color: "#9ab4cc" }}>{months[i]}</span>
              </div>
            ))}
          </div>
          <div style={{ display: "flex", justifyContent: "center", gap: 20, marginTop: 12 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
              <div style={{ width: 12, height: 12, borderRadius: 3, background: "linear-gradient(180deg, #4DB8FF, #1677FF)" }} />
              <span style={{ fontFamily: "'Inter', sans-serif", fontSize: 12, color: "#6a88b8" }}>Tenaga Kerja Terserap (rb)</span>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
