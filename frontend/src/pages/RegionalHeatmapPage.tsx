import { useState } from "react";
import { useNavigate } from "react-router";
import { LayoutDashboard, Users, TrendingUp, MapPin, BarChart2, BookOpen, FileText, Settings, ChevronDown } from "lucide-react";
import { DashboardLayout, SidebarItem } from "../components/DashboardLayout";

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

const mapPoints = [
  { label: "Jakarta", top: "40%", left: "22%", color: "#ff6b6b" },
  { label: "Bandung", top: "48%", left: "27%", color: "#f59e0b" },
  { label: "Bekasi", top: "40%", left: "26%", color: "#f59e0b" },
  { label: "Tangerang", top: "38%", left: "21%", color: "#4DB8FF" },
  { label: "Semarang", top: "44%", left: "42%", color: "#1677FF" },
  { label: "Yogyakarta", top: "52%", left: "40%", color: "#10d98e" },
  { label: "Solo", top: "50%", left: "43%", color: "#10d98e" },
  { label: "Surabaya", top: "44%", left: "55%", color: "#1677FF" },
  { label: "Malang", top: "52%", left: "54%", color: "#8b5cf6" },
];

const allRegions = [
  { name: "DKI Jakarta", provinsi: "DKI Jakarta", angkatan: "4.2 Jt", lowongan: "284K", gap: "31.2%", status: "Kritis", insight: "Demand teknologi tinggi, supply lokal belum mencukupi" },
  { name: "Banten", provinsi: "Banten", angkatan: "5.8 Jt", lowongan: "214K", gap: "28.5%", status: "Tinggi", insight: "Demand industri dan digital operation meningkat" },
  { name: "Jawa Barat", provinsi: "Jawa Barat", angkatan: "22.4 Jt", lowongan: "412K", gap: "38.7%", status: "Tinggi", insight: "Supply talent tinggi — kandidat siap serap banyak" },
  { name: "Jawa Tengah", provinsi: "Jawa Tengah", angkatan: "17.6 Jt", lowongan: "198K", gap: "26.1%", status: "Sedang", insight: "Skill gap data analytics meningkat signifikan" },
  { name: "DI Yogyakarta", provinsi: "DI Yogyakarta", angkatan: "2.1 Jt", lowongan: "132K", gap: "22.4%", status: "Sedang", insight: "Kandidat teknologi berkembang pesat, mobilitas ke Jakarta tinggi" },
  { name: "Jawa Timur", provinsi: "Jawa Timur", angkatan: "19.8 Jt", lowongan: "356K", gap: "29.4%", status: "Sedang", insight: "Demand manufaktur dan teknologi meningkat" },
];

const provinsiOptions = ["Semua Provinsi", "DKI Jakarta", "Banten", "Jawa Barat", "Jawa Tengah", "DI Yogyakarta", "Jawa Timur"];
const kotaOptions = ["Semua Kota", "Jakarta", "Bandung", "Semarang", "Yogyakarta", "Surabaya", "Malang", "Bekasi", "Tangerang", "Depok", "Solo"];
const sektorOptions = ["Semua Sektor", "Teknologi", "Manufaktur", "Keuangan", "Pendidikan", "Kesehatan", "Digital", "Logistik"];
const periodeOptions = ["Mei 2026", "Apr 2026", "Mar 2026", "Feb 2026", "Jan 2026", "Q1 2026", "Q4 2025"];

const statusColor = (s: string) => {
  if (s === "Kritis") return "#ff6b6b";
  if (s === "Tinggi") return "#f59e0b";
  if (s === "Sedang") return "#1677FF";
  return "#10d98e";
};

export default function RegionalHeatmapPage() {
  const navigate = useNavigate();
  const [provinsi, setProvinsi] = useState("Semua Provinsi");
  const [kota, setKota] = useState("Semua Kota");
  const [sektor, setSektor] = useState("Semua Sektor");
  const [periode, setPeriode] = useState("Mei 2026");

  const regions = provinsi === "Semua Provinsi" ? allRegions : allRegions.filter(r => r.provinsi === provinsi);

  const selectStyle: React.CSSProperties = {
    fontFamily: "'Inter', sans-serif", fontSize: 13, color: "#0A1B3D",
    border: "1px solid rgba(22,119,255,0.2)", borderRadius: 8, padding: "7px 12px",
    outline: "none", background: "#fff", cursor: "pointer",
  };

  return (
    <DashboardLayout sidebarItems={sidebarItems} userName="Dr. Bambang Prasetyo" userRole="Disnaker DKI Jakarta" userInitial="B">
      {/* Info Banner */}
      <div style={{ background: "rgba(22,119,255,0.06)", border: "1px solid rgba(22,119,255,0.2)", borderRadius: 10, padding: "10px 16px", marginBottom: 20, display: "flex", alignItems: "center", gap: 10 }}>
        <span style={{ color: "#1677FF", fontSize: 14 }}>ℹ</span>
        <span style={{ fontFamily: "'Inter', sans-serif", fontSize: 13, color: "#1677FF" }}>Data yang ditampilkan bersifat agregat dan anonim.</span>
      </div>

      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 20 }}>
        <div>
          <h1 style={{ fontFamily: "'Poppins', sans-serif", fontSize: 22, fontWeight: 800, color: "#0A1B3D", marginBottom: 4 }}>Heatmap Regional — Pulau Jawa</h1>
          <p style={{ fontFamily: "'Inter', sans-serif", fontSize: 14, color: "#6a88b8" }}>Distribusi ketenagakerjaan dan gap skill per wilayah</p>
        </div>
      </div>

      {/* Filter Bar */}
      <div style={{ display: "flex", gap: 10, marginBottom: 20, flexWrap: "wrap", alignItems: "center", background: "#fff", borderRadius: 14, border: "1px solid rgba(22,119,255,0.1)", padding: "14px 16px", boxShadow: "0 2px 8px rgba(10,27,61,0.04)" }}>
        <span style={{ fontFamily: "'Inter', sans-serif", fontSize: 12, fontWeight: 600, color: "#6a88b8", marginRight: 4 }}>Filter:</span>
        <select value={provinsi} onChange={e => setProvinsi(e.target.value)} style={selectStyle}>
          {provinsiOptions.map(p => <option key={p} value={p}>{p}</option>)}
        </select>
        <select value={kota} onChange={e => setKota(e.target.value)} style={selectStyle}>
          {kotaOptions.map(k => <option key={k} value={k}>{k}</option>)}
        </select>
        <select value={sektor} onChange={e => setSektor(e.target.value)} style={selectStyle}>
          {sektorOptions.map(s => <option key={s} value={s}>{s}</option>)}
        </select>
        <select value={periode} onChange={e => setPeriode(e.target.value)} style={selectStyle}>
          {periodeOptions.map(p => <option key={p} value={p}>{p}</option>)}
        </select>
      </div>

      {/* Map Area */}
      <div style={{ background: "#fff", borderRadius: 18, border: "1px solid rgba(22,119,255,0.1)", padding: "22px", boxShadow: "0 2px 10px rgba(10,27,61,0.04)", marginBottom: 24 }}>
        <div style={{ fontFamily: "'Poppins', sans-serif", fontSize: 15, fontWeight: 700, color: "#0A1B3D", marginBottom: 16 }}>Peta Distribusi Tenaga Kerja — Pulau Jawa</div>
        <div style={{
          position: "relative",
          height: 320,
          borderRadius: 12,
          background: "linear-gradient(135deg, #071228 0%, #0A1B3D 40%, #0d2a5c 70%, #071228 100%)",
          overflow: "hidden",
        }}>
          {/* Grid lines decoration */}
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} style={{ position: "absolute", left: `${i * 14}%`, top: 0, bottom: 0, width: 1, background: "rgba(22,119,255,0.06)" }} />
          ))}
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} style={{ position: "absolute", top: `${i * 18}%`, left: 0, right: 0, height: 1, background: "rgba(22,119,255,0.06)" }} />
          ))}

          {/* Map points */}
          {mapPoints.map((p) => (
            <div key={p.label} style={{ position: "absolute", top: p.top, left: p.left, transform: "translate(-50%, -50%)" }}>
              <div style={{
                width: 14,
                height: 14,
                borderRadius: "50%",
                background: p.color,
                boxShadow: `0 0 12px ${p.color}80`,
                marginBottom: 4,
                margin: "0 auto",
              }} />
              <div style={{
                fontFamily: "'Inter', sans-serif",
                fontSize: 10,
                fontWeight: 700,
                color: "#fff",
                background: "rgba(0,0,0,0.6)",
                padding: "2px 6px",
                borderRadius: 4,
                whiteSpace: "nowrap",
                marginTop: 4,
              }}>{p.label}</div>
            </div>
          ))}

          {/* Legend */}
          <div style={{ position: "absolute", bottom: 16, right: 16, display: "flex", flexDirection: "column", gap: 6 }}>
            {[{ label: "Gap Kritis", color: "#ff6b6b" }, { label: "Gap Tinggi", color: "#f59e0b" }, { label: "Gap Sedang", color: "#1677FF" }, { label: "Gap Rendah", color: "#10d98e" }].map((l) => (
              <div key={l.label} style={{ display: "flex", alignItems: "center", gap: 6 }}>
                <div style={{ width: 8, height: 8, borderRadius: "50%", background: l.color }} />
                <span style={{ fontFamily: "'Inter', sans-serif", fontSize: 10, color: "rgba(255,255,255,0.7)" }}>{l.label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Region Table */}
      <div style={{ background: "#fff", borderRadius: 18, border: "1px solid rgba(22,119,255,0.1)", padding: "22px", boxShadow: "0 2px 10px rgba(10,27,61,0.04)" }}>
        <div style={{ fontFamily: "'Poppins', sans-serif", fontSize: 15, fontWeight: 700, color: "#0A1B3D", marginBottom: 16 }}>Data per Wilayah</div>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr>
              {["Region", "Angkatan Kerja", "Lowongan", "Gap", "Status", "Aksi"].map((h) => (
                <th key={h} style={{ fontFamily: "'Inter', sans-serif", fontSize: 11, fontWeight: 600, color: "#9ab4cc", textAlign: "left", padding: "8px 12px", borderBottom: "1px solid rgba(22,119,255,0.08)", textTransform: "uppercase", letterSpacing: "0.05em" }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {regions.map((r) => (
              <tr key={r.name} style={{ borderBottom: "1px solid rgba(22,119,255,0.06)" }}>
                <td style={{ fontFamily: "'Inter', sans-serif", fontSize: 13, fontWeight: 600, color: "#0A1B3D", padding: "12px 12px" }}>{r.name}</td>
                <td style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 13, color: "#0A1B3D", padding: "12px 12px" }}>{r.angkatan}</td>
                <td style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 13, color: "#1677FF", padding: "12px 12px", fontWeight: 700 }}>{r.lowongan}</td>
                <td style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 13, color: statusColor(r.status), padding: "12px 12px", fontWeight: 700 }}>{r.gap}</td>
                <td style={{ padding: "12px 12px" }}>
                  <span style={{ fontFamily: "'Inter', sans-serif", fontSize: 11, fontWeight: 700, color: statusColor(r.status), background: `${statusColor(r.status)}18`, padding: "3px 10px", borderRadius: 20 }}>{r.status}</span>
                </td>
                <td style={{ padding: "12px 12px" }}>
                  <button
                    onClick={() => navigate("/dashboard/analytics/detail-wilayah")}
                    style={{ fontFamily: "'Inter', sans-serif", fontSize: 12, fontWeight: 600, color: "#1677FF", background: "rgba(22,119,255,0.08)", border: "none", padding: "6px 14px", borderRadius: 8, cursor: "pointer" }}
                  >
                    Detail Wilayah
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </DashboardLayout>
  );
}
