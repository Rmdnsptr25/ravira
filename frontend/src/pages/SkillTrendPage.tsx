import { useNavigate } from "react-router";
import { LayoutDashboard, Users, TrendingUp, TrendingDown, MapPin, BarChart2, BookOpen, FileText, Settings } from "lucide-react";
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

const risingSkills = [
  { name: "AI / Machine Learning", growth: "+42%", sector: "Teknologi", color: "#1677FF" },
  { name: "Cybersecurity", growth: "+38%", sector: "Keamanan TI", color: "#ff6b6b" },
  { name: "Cloud Engineering", growth: "+35%", sector: "Infrastruktur", color: "#4DB8FF" },
  { name: "Data Science", growth: "+31%", sector: "Analitik", color: "#8b5cf6" },
  { name: "DevOps", growth: "+29%", sector: "Rekayasa", color: "#1677FF" },
  { name: "Digital Marketing", growth: "+28%", sector: "Pemasaran", color: "#f59e0b" },
  { name: "React / Next.js", growth: "+25%", sector: "Frontend Dev", color: "#4DB8FF" },
  { name: "Product Management", growth: "+22%", sector: "Manajemen", color: "#8b5cf6" },
  { name: "Mobile Development", growth: "+20%", sector: "Mobile Dev", color: "#10d98e" },
  { name: "UI/UX Design", growth: "+18%", sector: "Desain", color: "#f59e0b" },
];

const decliningSkills = [
  { name: "Data Entry Manual", decline: "-28%", sector: "Administrasi", reason: "Otomasi AI" },
  { name: "Telemarketing Konvensional", decline: "-22%", sector: "Penjualan", reason: "Chatbot & CRM" },
  { name: "Desain Grafis Print", decline: "-18%", sector: "Desain", reason: "Digital-first shift" },
  { name: "Akunting Manual", decline: "-15%", sector: "Keuangan", reason: "Software ERP" },
  { name: "Operator Mesin Legacy", decline: "-12%", sector: "Manufaktur", reason: "Otomasi industri" },
];

export default function SkillTrendPage() {
  const navigate = useNavigate();

  return (
    <DashboardLayout sidebarItems={sidebarItems} userName="Dr. Bambang Prasetyo" userRole="Disnaker DKI Jakarta" userInitial="B">
      {/* Info Banner */}
      <div style={{ background: "rgba(22,119,255,0.06)", border: "1px solid rgba(22,119,255,0.2)", borderRadius: 10, padding: "10px 16px", marginBottom: 20, display: "flex", alignItems: "center", gap: 10 }}>
        <span style={{ color: "#1677FF", fontSize: 14 }}>ℹ</span>
        <span style={{ fontFamily: "'Inter', sans-serif", fontSize: 13, color: "#1677FF" }}>Data yang ditampilkan bersifat agregat dan anonim.</span>
      </div>

      {/* Header */}
      <div style={{ marginBottom: 24 }}>
        <h1 style={{ fontFamily: "'Poppins', sans-serif", fontSize: 22, fontWeight: 800, color: "#0A1B3D", marginBottom: 4 }}>Tren Skill</h1>
        <p style={{ fontFamily: "'Inter', sans-serif", fontSize: 14, color: "#6a88b8" }}>Skill yang paling dicari dan yang mulai ditinggalkan pasar kerja Indonesia</p>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
        {/* Rising Skills */}
        <div style={{ background: "#fff", borderRadius: 18, border: "1px solid rgba(22,119,255,0.1)", padding: "22px", boxShadow: "0 2px 10px rgba(10,27,61,0.04)" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 4 }}>
            <TrendingUp size={18} color="#10d98e" />
            <div style={{ fontFamily: "'Poppins', sans-serif", fontSize: 15, fontWeight: 700, color: "#0A1B3D" }}>Skill yang Naik Daun</div>
          </div>
          <div style={{ fontFamily: "'Inter', sans-serif", fontSize: 12, color: "#6a88b8", marginBottom: 18 }}>Pertumbuhan permintaan YoY · Top 10 skill</div>

          <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
            <div style={{ display: "grid", gridTemplateColumns: "1fr auto auto", gap: 8, padding: "6px 10px" }}>
              <span style={{ fontFamily: "'Inter', sans-serif", fontSize: 11, fontWeight: 600, color: "#9ab4cc", textTransform: "uppercase", letterSpacing: "0.05em" }}>Skill</span>
              <span style={{ fontFamily: "'Inter', sans-serif", fontSize: 11, fontWeight: 600, color: "#9ab4cc", textTransform: "uppercase", letterSpacing: "0.05em" }}>Sektor</span>
              <span style={{ fontFamily: "'Inter', sans-serif", fontSize: 11, fontWeight: 600, color: "#9ab4cc", textTransform: "uppercase", letterSpacing: "0.05em" }}>Growth</span>
            </div>
            {risingSkills.map((s) => (
              <div key={s.name} style={{ display: "grid", gridTemplateColumns: "1fr auto auto", gap: 8, padding: "10px 10px", borderRadius: 10, background: "rgba(22,119,255,0.02)", border: "1px solid rgba(22,119,255,0.06)", marginBottom: 4, alignItems: "center" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <TrendingUp size={12} color="#10d98e" />
                  <span style={{ fontFamily: "'Inter', sans-serif", fontSize: 13, fontWeight: 600, color: "#0A1B3D" }}>{s.name}</span>
                </div>
                <span style={{ fontFamily: "'Inter', sans-serif", fontSize: 11, color: "#6a88b8", background: "rgba(22,119,255,0.06)", padding: "2px 8px", borderRadius: 6, whiteSpace: "nowrap" }}>{s.sector}</span>
                <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 13, fontWeight: 800, color: "#10d98e", minWidth: 50, textAlign: "right" }}>{s.growth}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Declining Skills */}
        <div>
          <div style={{ background: "#fff", borderRadius: 18, border: "1px solid rgba(22,119,255,0.1)", padding: "22px", boxShadow: "0 2px 10px rgba(10,27,61,0.04)", marginBottom: 20 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 4 }}>
              <TrendingDown size={18} color="#ff6b6b" />
              <div style={{ fontFamily: "'Poppins', sans-serif", fontSize: 15, fontWeight: 700, color: "#0A1B3D" }}>Skill yang Menurun</div>
            </div>
            <div style={{ fontFamily: "'Inter', sans-serif", fontSize: 12, color: "#6a88b8", marginBottom: 18 }}>Permintaan turun akibat otomasi & perubahan tren</div>

            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {decliningSkills.map((s) => (
                <div key={s.name} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "12px 14px", borderRadius: 12, background: "rgba(255,107,107,0.04)", border: "1px solid rgba(255,107,107,0.12)" }}>
                  <div>
                    <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
                      <TrendingDown size={12} color="#ff6b6b" />
                      <span style={{ fontFamily: "'Inter', sans-serif", fontSize: 13, fontWeight: 600, color: "#0A1B3D" }}>{s.name}</span>
                    </div>
                    <div style={{ display: "flex", gap: 8 }}>
                      <span style={{ fontFamily: "'Inter', sans-serif", fontSize: 11, color: "#6a88b8", background: "rgba(22,119,255,0.06)", padding: "1px 7px", borderRadius: 5 }}>{s.sector}</span>
                      <span style={{ fontFamily: "'Inter', sans-serif", fontSize: 11, color: "#ff6b6b" }}>{s.reason}</span>
                    </div>
                  </div>
                  <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 16, fontWeight: 800, color: "#ff6b6b" }}>{s.decline}</span>
                </div>
              ))}
            </div>
          </div>

          {/* CTA */}
          <div style={{ background: "linear-gradient(135deg, #0A1B3D, #1677FF)", borderRadius: 18, padding: "22px" }}>
            <div style={{ fontFamily: "'Poppins', sans-serif", fontSize: 15, fontWeight: 700, color: "#fff", marginBottom: 8 }}>Lihat Proyeksi Skill 2030</div>
            <div style={{ fontFamily: "'Inter', sans-serif", fontSize: 13, color: "rgba(255,255,255,0.7)", marginBottom: 16 }}>Temukan skill apa yang akan paling dibutuhkan dalam 5 tahun ke depan berdasarkan model AI Ravira.</div>
            <button
              onClick={() => navigate("/dashboard/analytics/proyeksi")}
              style={{ fontFamily: "'Poppins', sans-serif", fontSize: 13, fontWeight: 700, color: "#0A1B3D", background: "#4DB8FF", border: "none", padding: "10px 20px", borderRadius: 10, cursor: "pointer" }}
            >
              Lihat Proyeksi →
            </button>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
