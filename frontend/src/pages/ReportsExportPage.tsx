import { useState } from "react";
import { LayoutDashboard, Users, TrendingUp, MapPin, BarChart2, BookOpen, FileText, Settings, Download, Eye, Clock } from "lucide-react";
import { DashboardLayout } from "../components/DashboardLayout";
import type { SidebarItem } from "../components/DashboardLayout";
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

const reports = [
  { name: "Laporan Workforce Bulanan", desc: "Data tenaga kerja nasional per bulan", lastGen: "2 Jun 2026, 08:14", icon: Users, color: "#1677FF" },
  { name: "Laporan Heatmap Regional", desc: "Distribusi & gap skill per wilayah", lastGen: "1 Jun 2026, 16:30", icon: MapPin, color: "#10d98e" },
  { name: "Laporan Tren Skill", desc: "Skill naik dan turun — YoY", lastGen: "31 Mei 2026, 09:00", icon: TrendingUp, color: "#8b5cf6" },
  { name: "Laporan Proyeksi Kompetensi", desc: "Prediksi kebutuhan tenaga kerja 2025–2030", lastGen: "28 Mei 2026, 14:22", icon: BarChart2, color: "#f59e0b" },
  { name: "Laporan Program Pelatihan", desc: "Status & dampak program pelatihan aktif", lastGen: "27 Mei 2026, 11:05", icon: BookOpen, color: "#ff6b6b" },
  { name: "Laporan Komparasi Wilayah", desc: "Perbandingan antar provinsi & kota", lastGen: "25 Mei 2026, 07:45", icon: FileText, color: "#4DB8FF" },
];

const scheduled = [
  { name: "Laporan Workforce Bulanan", freq: "Bulanan — setiap tgl 1", next: "1 Jul 2026" },
  { name: "Laporan Tren Skill", freq: "Mingguan — setiap Senin", next: "8 Jun 2026" },
  { name: "Laporan Heatmap Regional", freq: "Kuartalan — setiap Q", next: "1 Sep 2026" },
];

export default function ReportsExportPage() {
  const [exportTarget, setExportTarget] = useState<string | null>(null);

  return (
    <DashboardLayout sidebarItems={sidebarItems} userName="Dr. Bambang Prasetyo" userRole="Disnaker DKI Jakarta" userInitial="B">
      {exportTarget && <ExportReportModal reportName={exportTarget} onClose={() => setExportTarget(null)} />}
      {/* Info Banner */}
      <div style={{ background: "rgba(22,119,255,0.06)", border: "1px solid rgba(22,119,255,0.2)", borderRadius: 10, padding: "10px 16px", marginBottom: 20, display: "flex", alignItems: "center", gap: 10 }}>
        <span style={{ color: "#1677FF", fontSize: 14 }}>ℹ</span>
        <span style={{ fontFamily: "'Inter', sans-serif", fontSize: 13, color: "#1677FF" }}>Data yang ditampilkan bersifat agregat dan anonim.</span>
      </div>

      {/* Header */}
      <div style={{ marginBottom: 24 }}>
        <h1 style={{ fontFamily: "'Poppins', sans-serif", fontSize: 22, fontWeight: 800, color: "#0A1B3D", marginBottom: 4 }}>Laporan & Ekspor</h1>
        <p style={{ fontFamily: "'Inter', sans-serif", fontSize: 14, color: "#6a88b8" }}>Unduh dan ekspor laporan analitik dalam format PDF, Excel, atau CSV</p>
      </div>

      {/* Report Cards */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16, marginBottom: 32 }}>
        {reports.map((r) => (
          <div key={r.name} style={{ background: "#fff", borderRadius: 18, border: "1px solid rgba(22,119,255,0.1)", padding: "22px", boxShadow: "0 2px 10px rgba(10,27,61,0.04)" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 14 }}>
              <div style={{ width: 40, height: 40, borderRadius: 12, background: `${r.color}14`, display: "flex", alignItems: "center", justifyContent: "center" }}>
                <r.icon size={18} color={r.color} />
              </div>
              <div>
                <div style={{ fontFamily: "'Poppins', sans-serif", fontSize: 13, fontWeight: 700, color: "#0A1B3D", lineHeight: 1.3 }}>{r.name}</div>
              </div>
            </div>
            <div style={{ fontFamily: "'Inter', sans-serif", fontSize: 12, color: "#6a88b8", marginBottom: 10 }}>{r.desc}</div>
            <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 16 }}>
              <Clock size={12} color="#9ab4cc" />
              <span style={{ fontFamily: "'Inter', sans-serif", fontSize: 11, color: "#9ab4cc" }}>Terakhir dibuat: {r.lastGen}</span>
            </div>
            <div style={{ display: "flex", gap: 8 }}>
              <button style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", gap: 6, padding: "8px", borderRadius: 10, border: "1px solid rgba(22,119,255,0.2)", background: "#fff", fontFamily: "'Inter', sans-serif", fontSize: 12, fontWeight: 600, color: "#1677FF", cursor: "pointer" }}>
                <Eye size={13} /> Preview
              </button>
              <button
                onClick={() => setExportTarget(r.name)}
                style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", gap: 6, padding: "8px", borderRadius: 10, border: "none", background: "linear-gradient(135deg, #1677FF, #0D47A1)", fontFamily: "'Inter', sans-serif", fontSize: 12, fontWeight: 700, color: "#fff", cursor: "pointer" }}
              >
                <Download size={13} /> Ekspor
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Scheduled Reports */}
      <div style={{ background: "#fff", borderRadius: 18, border: "1px solid rgba(22,119,255,0.1)", padding: "22px", boxShadow: "0 2px 10px rgba(10,27,61,0.04)" }}>
        <div style={{ fontFamily: "'Poppins', sans-serif", fontSize: 15, fontWeight: 700, color: "#0A1B3D", marginBottom: 4 }}>Laporan Terjadwal</div>
        <div style={{ fontFamily: "'Inter', sans-serif", fontSize: 12, color: "#6a88b8", marginBottom: 18 }}>Laporan yang dikirim otomatis ke email Anda</div>
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {scheduled.map((s) => (
            <div key={s.name} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "14px 16px", borderRadius: 12, background: "rgba(22,119,255,0.02)", border: "1px solid rgba(22,119,255,0.08)" }}>
              <div>
                <div style={{ fontFamily: "'Inter', sans-serif", fontSize: 13, fontWeight: 600, color: "#0A1B3D", marginBottom: 3 }}>{s.name}</div>
                <div style={{ fontFamily: "'Inter', sans-serif", fontSize: 12, color: "#6a88b8" }}>{s.freq}</div>
              </div>
              <div style={{ textAlign: "right" }}>
                <div style={{ fontFamily: "'Inter', sans-serif", fontSize: 11, color: "#9ab4cc", marginBottom: 3 }}>Berikutnya</div>
                <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 12, fontWeight: 700, color: "#1677FF" }}>{s.next}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
}
