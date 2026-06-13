import { useNavigate } from "react-router";
import { LayoutDashboard, Users, TrendingUp, MapPin, BarChart2, BookOpen, FileText, Settings, ArrowLeft } from "lucide-react";
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

const kpis = [
  { label: "Angkatan Kerja", value: "4.2 Jt", color: "#1677FF" },
  { label: "Tingkat Penyerapan", value: "71.3%", color: "#10d98e" },
  { label: "Lowongan Terbuka", value: "284K", color: "#f59e0b" },
  { label: "Skill Gap Rate", value: "31.2%", color: "#ff6b6b" },
];

const topSkills = [
  { name: "Software Development", demand: 94, color: "#1677FF" },
  { name: "Data Science & Analytics", demand: 88, color: "#8b5cf6" },
  { name: "Cloud Engineering", demand: 82, color: "#4DB8FF" },
  { name: "Cybersecurity", demand: 76, color: "#ff6b6b" },
  { name: "Digital Marketing", demand: 72, color: "#f59e0b" },
  { name: "UI/UX Design", demand: 68, color: "#10d98e" },
  { name: "Product Management", demand: 64, color: "#8b5cf6" },
];

const topIndustries = [
  { name: "Teknologi & Startup", count: "84.2K", growth: "+22%" },
  { name: "Perbankan & Fintech", count: "42.8K", growth: "+14%" },
  { name: "E-commerce & Retail", count: "38.6K", growth: "+31%" },
  { name: "Konsultan & Jasa Profesional", count: "28.4K", growth: "+9%" },
  { name: "Media & Kreatif", count: "22.1K", growth: "+17%" },
];

const trainingPrograms = [
  { name: "Bootcamp AI & ML — Jakarta", participants: 2400, status: "Aktif", progress: 72 },
  { name: "Sertifikasi Cloud Provider", participants: 860, status: "Aktif", progress: 45 },
  { name: "Digital Marketing Intensif", participants: 1200, status: "Selesai", progress: 100 },
];

export default function RegionalDetailPage() {
  const navigate = useNavigate();

  return (
    <DashboardLayout sidebarItems={sidebarItems} userName="Dr. Bambang Prasetyo" userRole="Disnaker DKI Jakarta" userInitial="B">
      {/* Info Banner */}
      <div style={{ background: "rgba(22,119,255,0.06)", border: "1px solid rgba(22,119,255,0.2)", borderRadius: 10, padding: "10px 16px", marginBottom: 20, display: "flex", alignItems: "center", gap: 10 }}>
        <span style={{ color: "#1677FF", fontSize: 14 }}>ℹ</span>
        <span style={{ fontFamily: "'Inter', sans-serif", fontSize: 13, color: "#1677FF" }}>Data yang ditampilkan bersifat agregat dan anonim.</span>
      </div>

      {/* Back + Header */}
      <div style={{ marginBottom: 24 }}>
        <button
          onClick={() => navigate("/dashboard/analytics/heatmap")}
          style={{ display: "flex", alignItems: "center", gap: 8, background: "none", border: "none", cursor: "pointer", fontFamily: "'Inter', sans-serif", fontSize: 13, color: "#1677FF", marginBottom: 14, padding: 0 }}
        >
          <ArrowLeft size={16} /> Kembali ke Heatmap Regional
        </button>
        <h1 style={{ fontFamily: "'Poppins', sans-serif", fontSize: 22, fontWeight: 800, color: "#0A1B3D", marginBottom: 4 }}>Detail Wilayah — DKI Jakarta</h1>
        <p style={{ fontFamily: "'Inter', sans-serif", fontSize: 14, color: "#6a88b8" }}>Analisis mendalam ketenagakerjaan dan gap skill · DKI Jakarta · Data per Juni 2026</p>
      </div>

      {/* KPI Cards */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 14, marginBottom: 24 }}>
        {kpis.map((k) => (
          <div key={k.label} style={{ background: "#fff", borderRadius: 16, border: "1px solid rgba(22,119,255,0.1)", padding: "20px", boxShadow: "0 2px 10px rgba(10,27,61,0.04)" }}>
            <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 26, fontWeight: 800, color: k.color, lineHeight: 1, marginBottom: 6 }}>{k.value}</div>
            <div style={{ fontFamily: "'Inter', sans-serif", fontSize: 12, color: "#6a88b8" }}>{k.label}</div>
          </div>
        ))}
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20, marginBottom: 20 }}>
        {/* Top Skills */}
        <div style={{ background: "#fff", borderRadius: 18, border: "1px solid rgba(22,119,255,0.1)", padding: "22px", boxShadow: "0 2px 10px rgba(10,27,61,0.04)" }}>
          <div style={{ fontFamily: "'Poppins', sans-serif", fontSize: 15, fontWeight: 700, color: "#0A1B3D", marginBottom: 4 }}>Top Skill yang Dicari</div>
          <div style={{ fontFamily: "'Inter', sans-serif", fontSize: 12, color: "#6a88b8", marginBottom: 18 }}>Indeks permintaan 0–100</div>
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {topSkills.map((s) => (
              <div key={s.name}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 5 }}>
                  <span style={{ fontFamily: "'Inter', sans-serif", fontSize: 13, fontWeight: 600, color: "#0A1B3D" }}>{s.name}</span>
                  <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 12, fontWeight: 700, color: s.color }}>{s.demand}</span>
                </div>
                <div style={{ height: 5, borderRadius: 3, background: "rgba(22,119,255,0.08)" }}>
                  <div style={{ height: "100%", width: `${s.demand}%`, borderRadius: 3, background: s.color }} />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Top Industries */}
        <div style={{ background: "#fff", borderRadius: 18, border: "1px solid rgba(22,119,255,0.1)", padding: "22px", boxShadow: "0 2px 10px rgba(10,27,61,0.04)" }}>
          <div style={{ fontFamily: "'Poppins', sans-serif", fontSize: 15, fontWeight: 700, color: "#0A1B3D", marginBottom: 4 }}>Top Industri Perekrut</div>
          <div style={{ fontFamily: "'Inter', sans-serif", fontSize: 12, color: "#6a88b8", marginBottom: 18 }}>Jumlah lowongan aktif per industri</div>
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {topIndustries.map((ind, i) => (
              <div key={ind.name} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "12px 14px", borderRadius: 12, background: "rgba(22,119,255,0.02)", border: "1px solid rgba(22,119,255,0.06)" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 12, fontWeight: 800, color: "#9ab4cc", minWidth: 18 }}>#{i + 1}</span>
                  <span style={{ fontFamily: "'Inter', sans-serif", fontSize: 13, fontWeight: 600, color: "#0A1B3D" }}>{ind.name}</span>
                </div>
                <div style={{ textAlign: "right" }}>
                  <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 13, fontWeight: 700, color: "#1677FF" }}>{ind.count}</div>
                  <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11, color: "#10d98e" }}>{ind.growth}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 320px", gap: 20 }}>
        {/* Training Programs */}
        <div style={{ background: "#fff", borderRadius: 18, border: "1px solid rgba(22,119,255,0.1)", padding: "22px", boxShadow: "0 2px 10px rgba(10,27,61,0.04)" }}>
          <div style={{ fontFamily: "'Poppins', sans-serif", fontSize: 15, fontWeight: 700, color: "#0A1B3D", marginBottom: 4 }}>Program Pelatihan di Wilayah Ini</div>
          <div style={{ fontFamily: "'Inter', sans-serif", fontSize: 12, color: "#6a88b8", marginBottom: 18 }}>Program aktif dan selesai di DKI Jakarta</div>
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {trainingPrograms.map((tp) => (
              <div key={tp.name} style={{ padding: "16px", borderRadius: 14, border: "1px solid rgba(22,119,255,0.08)", background: "rgba(22,119,255,0.01)" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
                  <span style={{ fontFamily: "'Inter', sans-serif", fontSize: 13, fontWeight: 600, color: "#0A1B3D" }}>{tp.name}</span>
                  <span style={{
                    fontFamily: "'Inter', sans-serif",
                    fontSize: 11,
                    fontWeight: 700,
                    color: tp.status === "Aktif" ? "#10d98e" : "#9ab4cc",
                    background: tp.status === "Aktif" ? "rgba(16,217,142,0.08)" : "rgba(22,119,255,0.06)",
                    padding: "2px 10px",
                    borderRadius: 20,
                  }}>{tp.status}</span>
                </div>
                <div style={{ fontFamily: "'Inter', sans-serif", fontSize: 12, color: "#6a88b8", marginBottom: 8 }}>
                  {tp.participants.toLocaleString()} peserta
                </div>
                <div style={{ height: 6, borderRadius: 3, background: "rgba(22,119,255,0.08)" }}>
                  <div style={{ height: "100%", width: `${tp.progress}%`, borderRadius: 3, background: tp.status === "Selesai" ? "#10d98e" : "linear-gradient(90deg, #1677FF, #4DB8FF)" }} />
                </div>
                <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11, color: "#9ab4cc", marginTop: 5 }}>{tp.progress}% selesai</div>
              </div>
            ))}
          </div>
        </div>

        {/* Recommendations */}
        <div style={{ background: "linear-gradient(160deg, #0A1B3D 0%, #0d2a5c 100%)", borderRadius: 18, padding: "22px" }}>
          <div style={{ fontFamily: "'Poppins', sans-serif", fontSize: 15, fontWeight: 700, color: "#fff", marginBottom: 4 }}>Rekomendasi Kebijakan</div>
          <div style={{ fontFamily: "'Inter', sans-serif", fontSize: 12, color: "rgba(255,255,255,0.6)", marginBottom: 18 }}>Berdasarkan analisis AI Ravira untuk DKI Jakarta</div>
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {[
              { rec: "Prioritaskan pelatihan AI/ML untuk 5.000 tenaga kerja sektor teknologi.", priority: "Tinggi" },
              { rec: "Buka kemitraan dengan 10 startup untuk program magang berbayar.", priority: "Sedang" },
              { rec: "Tingkatkan subsidi sertifikasi cloud untuk lulusan baru.", priority: "Tinggi" },
              { rec: "Koordinasikan dengan universitas untuk kurikulum digital terkini.", priority: "Sedang" },
            ].map((r, i) => (
              <div key={i} style={{ background: "rgba(77,184,255,0.08)", border: "1px solid rgba(77,184,255,0.15)", borderRadius: 12, padding: "12px 14px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
                  <span style={{
                    fontFamily: "'Inter', sans-serif",
                    fontSize: 10,
                    fontWeight: 700,
                    color: r.priority === "Tinggi" ? "#ff6b6b" : "#f59e0b",
                    background: r.priority === "Tinggi" ? "rgba(255,107,107,0.15)" : "rgba(245,158,11,0.15)",
                    padding: "1px 8px",
                    borderRadius: 10,
                  }}>{r.priority}</span>
                </div>
                <span style={{ fontFamily: "'Inter', sans-serif", fontSize: 12, color: "rgba(255,255,255,0.85)", lineHeight: 1.5 }}>{r.rec}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
