import { useState } from "react";
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

const years = ["2025", "2026", "2027", "2030"];

const sectorData: Record<string, { label: string; value: string; delta: string; positive: boolean; color: string; bar: number }[]> = {
  "2025": [
    { label: "Teknologi", value: "+380K", delta: "Kebutuhan meningkat", positive: true, color: "#1677FF", bar: 70 },
    { label: "Kesehatan", value: "+210K", delta: "Kebutuhan meningkat", positive: true, color: "#10d98e", bar: 50 },
    { label: "Manufaktur", value: "-80K", delta: "Otomasi berkurang", positive: false, color: "#ff6b6b", bar: 40 },
    { label: "Pertanian", value: "-140K", delta: "Mekanisasi", positive: false, color: "#f59e0b", bar: 35 },
    { label: "Jasa & Layanan", value: "+290K", delta: "Pertumbuhan tinggi", positive: true, color: "#8b5cf6", bar: 60 },
  ],
  "2026": [
    { label: "Teknologi", value: "+450K", delta: "Kebutuhan meningkat", positive: true, color: "#1677FF", bar: 80 },
    { label: "Kesehatan", value: "+280K", delta: "Kebutuhan meningkat", positive: true, color: "#10d98e", bar: 60 },
    { label: "Manufaktur", value: "-120K", delta: "Otomasi berkurang", positive: false, color: "#ff6b6b", bar: 45 },
    { label: "Pertanian", value: "-200K", delta: "Mekanisasi", positive: false, color: "#f59e0b", bar: 40 },
    { label: "Jasa & Layanan", value: "+380K", delta: "Pertumbuhan tinggi", positive: true, color: "#8b5cf6", bar: 68 },
  ],
  "2027": [
    { label: "Teknologi", value: "+580K", delta: "Kebutuhan meningkat", positive: true, color: "#1677FF", bar: 88 },
    { label: "Kesehatan", value: "+340K", delta: "Kebutuhan meningkat", positive: true, color: "#10d98e", bar: 68 },
    { label: "Manufaktur", value: "-160K", delta: "Otomasi berkurang", positive: false, color: "#ff6b6b", bar: 52 },
    { label: "Pertanian", value: "-260K", delta: "Mekanisasi", positive: false, color: "#f59e0b", bar: 46 },
    { label: "Jasa & Layanan", value: "+470K", delta: "Pertumbuhan tinggi", positive: true, color: "#8b5cf6", bar: 76 },
  ],
  "2030": [
    { label: "Teknologi", value: "+920K", delta: "Kebutuhan meningkat", positive: true, color: "#1677FF", bar: 98 },
    { label: "Kesehatan", value: "+620K", delta: "Kebutuhan meningkat", positive: true, color: "#10d98e", bar: 85 },
    { label: "Manufaktur", value: "-340K", delta: "Otomasi tinggi", positive: false, color: "#ff6b6b", bar: 72 },
    { label: "Pertanian", value: "-480K", delta: "Mekanisasi penuh", positive: false, color: "#f59e0b", bar: 68 },
    { label: "Jasa & Layanan", value: "+740K", delta: "Pertumbuhan tinggi", positive: true, color: "#8b5cf6", bar: 92 },
  ],
};

export default function CompetensiProjectionPage() {
  const [selectedYear, setSelectedYear] = useState("2026");
  const data = sectorData[selectedYear];

  return (
    <DashboardLayout sidebarItems={sidebarItems} userName="Dr. Bambang Prasetyo" userRole="Disnaker DKI Jakarta" userInitial="B">
      {/* Info Banner */}
      <div style={{ background: "rgba(22,119,255,0.06)", border: "1px solid rgba(22,119,255,0.2)", borderRadius: 10, padding: "10px 16px", marginBottom: 20, display: "flex", alignItems: "center", gap: 10 }}>
        <span style={{ color: "#1677FF", fontSize: 14 }}>ℹ</span>
        <span style={{ fontFamily: "'Inter', sans-serif", fontSize: 13, color: "#1677FF" }}>Data yang ditampilkan bersifat agregat dan anonim.</span>
      </div>

      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
        <div>
          <h1 style={{ fontFamily: "'Poppins', sans-serif", fontSize: 22, fontWeight: 800, color: "#0A1B3D", marginBottom: 4 }}>Proyeksi Kompetensi</h1>
          <p style={{ fontFamily: "'Inter', sans-serif", fontSize: 14, color: "#6a88b8" }}>Prediksi kebutuhan tenaga kerja dan skill berbasis model AI Ravira</p>
        </div>

        {/* Year Selector */}
        <div style={{ display: "flex", gap: 8 }}>
          {years.map((y) => (
            <button
              key={y}
              onClick={() => setSelectedYear(y)}
              style={{
                fontFamily: "'JetBrains Mono', monospace",
                fontSize: 13,
                fontWeight: 700,
                padding: "8px 16px",
                borderRadius: 10,
                border: "none",
                cursor: "pointer",
                background: selectedYear === y ? "linear-gradient(135deg, #1677FF, #0D47A1)" : "rgba(22,119,255,0.08)",
                color: selectedYear === y ? "#fff" : "#1677FF",
                transition: "all 0.2s",
              }}
            >
              {y}
            </button>
          ))}
        </div>
      </div>

      {/* Sector Cards */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: 14, marginBottom: 24 }}>
        {data.map((s) => (
          <div key={s.label} style={{ background: "#fff", borderRadius: 16, border: "1px solid rgba(22,119,255,0.1)", padding: "20px", boxShadow: "0 2px 10px rgba(10,27,61,0.04)" }}>
            <div style={{ fontFamily: "'Inter', sans-serif", fontSize: 12, color: "#6a88b8", marginBottom: 6 }}>{s.label}</div>
            <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 24, fontWeight: 800, color: s.positive ? "#10d98e" : "#ff6b6b", lineHeight: 1, marginBottom: 8 }}>{s.value}</div>
            <div style={{ height: 4, borderRadius: 2, background: "rgba(22,119,255,0.08)", marginBottom: 8 }}>
              <div style={{ height: "100%", width: `${s.bar}%`, borderRadius: 2, background: s.color, transition: "width 0.4s" }} />
            </div>
            <div style={{ fontFamily: "'Inter', sans-serif", fontSize: 11, color: "#9ab4cc" }}>{s.delta}</div>
          </div>
        ))}
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 320px", gap: 20 }}>
        {/* Bar Chart Placeholder */}
        <div style={{ background: "#fff", borderRadius: 18, border: "1px solid rgba(22,119,255,0.1)", padding: "22px", boxShadow: "0 2px 10px rgba(10,27,61,0.04)" }}>
          <div style={{ fontFamily: "'Poppins', sans-serif", fontSize: 15, fontWeight: 700, color: "#0A1B3D", marginBottom: 4 }}>Proyeksi Tenaga Kerja per Sektor — {selectedYear}</div>
          <div style={{ fontFamily: "'Inter', sans-serif", fontSize: 12, color: "#6a88b8", marginBottom: 20 }}>Perubahan kebutuhan dalam ribuan orang</div>
          <div style={{ display: "flex", alignItems: "flex-end", gap: 24, height: 220, paddingBottom: 8 }}>
            {data.map((s) => (
              <div key={s.label} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 8 }}>
                <div style={{
                  width: "100%",
                  height: `${s.bar * 1.8}px`,
                  background: s.positive
                    ? `linear-gradient(180deg, ${s.color}88, ${s.color})`
                    : `linear-gradient(180deg, ${s.color}88, ${s.color})`,
                  borderRadius: "6px 6px 0 0",
                  border: `1px solid ${s.color}44`,
                }} />
                <span style={{ fontFamily: "'Inter', sans-serif", fontSize: 11, color: "#6a88b8", textAlign: "center" }}>{s.label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* AI Insights */}
        <div style={{ background: "linear-gradient(160deg, #0A1B3D 0%, #0d2a5c 100%)", borderRadius: 18, padding: "22px", boxShadow: "0 2px 10px rgba(10,27,61,0.1)" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 16 }}>
            <div style={{ width: 32, height: 32, borderRadius: 10, background: "rgba(77,184,255,0.15)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18 }}>🤖</div>
            <div style={{ fontFamily: "'Poppins', sans-serif", fontSize: 14, fontWeight: 700, color: "#fff" }}>AI Insights</div>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            {[
              "AI memprediksi kebutuhan skill digital meningkat 67% dalam 5 tahun ke depan.",
              "Sektor kesehatan akan mengalami kekurangan tenaga ahli terbesar di 2027–2030.",
              "Program reskilling manufaktur perlu diprioritaskan untuk mencegah pengangguran struktural.",
              "DKI Jakarta & Jawa Barat akan menjadi pusat permintaan skill teknologi tertinggi.",
            ].map((insight, i) => (
              <div key={i} style={{ background: "rgba(77,184,255,0.08)", border: "1px solid rgba(77,184,255,0.15)", borderRadius: 12, padding: "12px 14px" }}>
                <div style={{ display: "flex", gap: 8, alignItems: "flex-start" }}>
                  <span style={{ color: "#4DB8FF", fontSize: 14, flexShrink: 0, marginTop: 1 }}>→</span>
                  <span style={{ fontFamily: "'Inter', sans-serif", fontSize: 13, color: "rgba(255,255,255,0.85)", lineHeight: 1.5 }}>{insight}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
