import { useState } from "react";
import { useNavigate } from "react-router";
import { LayoutDashboard, Users, TrendingUp, MapPin, BarChart2, BookOpen, FileText, Settings, Plus } from "lucide-react";
import { toast } from "sonner";
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

const programs = [
  {
    name: "Bootcamp AI & Machine Learning",
    skill: "AI / ML Engineering",
    region: "DKI Jakarta",
    beneficiaries: "2.400 orang",
    budget: "Rp 4,8 M",
    priority: "Tinggi",
  },
  {
    name: "Sertifikasi Cloud AWS & Azure",
    skill: "Cloud Engineering",
    region: "Jawa Barat",
    beneficiaries: "1.800 orang",
    budget: "Rp 3,2 M",
    priority: "Tinggi",
  },
  {
    name: "Digital Marketing Intensif",
    skill: "Digital Marketing",
    region: "Jawa Timur",
    beneficiaries: "3.200 orang",
    budget: "Rp 2,6 M",
    priority: "Sedang",
  },
  {
    name: "Pelatihan Cybersecurity Dasar",
    skill: "Cybersecurity",
    region: "Sumatera Utara",
    beneficiaries: "980 orang",
    budget: "Rp 2,1 M",
    priority: "Tinggi",
  },
  {
    name: "Reskilling Operator Manufaktur",
    skill: "Teknik Otomasi Industri",
    region: "Jawa Tengah",
    beneficiaries: "5.600 orang",
    budget: "Rp 8,4 M",
    priority: "Sedang",
  },
  {
    name: "UX Design & Prototyping",
    skill: "UI/UX Design",
    region: "Bali",
    beneficiaries: "720 orang",
    budget: "Rp 1,4 M",
    priority: "Rendah",
  },
];

const priorityColor = (p: string) => {
  if (p === "Tinggi") return "#ff6b6b";
  if (p === "Sedang") return "#f59e0b";
  return "#10d98e";
};

const regions = ["Semua Wilayah", "DKI Jakarta", "Jawa Barat", "Jawa Timur", "Jawa Tengah", "Sumatera Utara", "Bali"];
const sectors = ["Semua Sektor", "Teknologi", "Manufaktur", "Pemasaran", "Desain", "Keamanan TI"];

export default function TrainingProgramRecommendationPage() {
  const navigate = useNavigate();
  const [region, setRegion] = useState("Semua Wilayah");
  const [sector, setSector] = useState("Semua Sektor");

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
          <h1 style={{ fontFamily: "'Poppins', sans-serif", fontSize: 22, fontWeight: 800, color: "#0A1B3D", marginBottom: 4 }}>Rekomendasi Program Pelatihan</h1>
          <p style={{ fontFamily: "'Inter', sans-serif", fontSize: 14, color: "#6a88b8" }}>Program pelatihan yang direkomendasikan berdasarkan analisis gap skill regional</p>
        </div>
        <button onClick={() => toast.success("Form rekomendasi program pelatihan dibuka.")} style={{ display: "flex", alignItems: "center", gap: 8, padding: "10px 18px", borderRadius: 12, border: "none", background: "linear-gradient(135deg, #1677FF, #0D47A1)", fontFamily: "'Poppins', sans-serif", fontSize: 13, fontWeight: 700, color: "#fff", cursor: "pointer" }}>
          <Plus size={15} /> Buat Rekomendasi Baru
        </button>
      </div>

      {/* Filters */}
      <div style={{ display: "flex", gap: 12, marginBottom: 24 }}>
        <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
          <label style={{ fontFamily: "'Inter', sans-serif", fontSize: 11, fontWeight: 600, color: "#9ab4cc", textTransform: "uppercase", letterSpacing: "0.05em" }}>Wilayah</label>
          <select
            value={region}
            onChange={(e) => setRegion(e.target.value)}
            style={{ fontFamily: "'Inter', sans-serif", fontSize: 13, color: "#0A1B3D", padding: "8px 14px", borderRadius: 10, border: "1px solid rgba(22,119,255,0.2)", background: "#fff", cursor: "pointer", minWidth: 180 }}
          >
            {regions.map((r) => <option key={r} value={r}>{r}</option>)}
          </select>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
          <label style={{ fontFamily: "'Inter', sans-serif", fontSize: 11, fontWeight: 600, color: "#9ab4cc", textTransform: "uppercase", letterSpacing: "0.05em" }}>Sektor</label>
          <select
            value={sector}
            onChange={(e) => setSector(e.target.value)}
            style={{ fontFamily: "'Inter', sans-serif", fontSize: 13, color: "#0A1B3D", padding: "8px 14px", borderRadius: 10, border: "1px solid rgba(22,119,255,0.2)", background: "#fff", cursor: "pointer", minWidth: 180 }}
          >
            {sectors.map((s) => <option key={s} value={s}>{s}</option>)}
          </select>
        </div>
      </div>

      {/* Program Cards */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16 }}>
        {programs.map((p) => (
          <div key={p.name} style={{ background: "#fff", borderRadius: 18, border: "1px solid rgba(22,119,255,0.1)", padding: "22px", boxShadow: "0 2px 10px rgba(10,27,61,0.04)", display: "flex", flexDirection: "column" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 12 }}>
              <div style={{ width: 40, height: 40, borderRadius: 12, background: "rgba(22,119,255,0.08)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <BookOpen size={18} color="#1677FF" />
              </div>
              <span style={{ fontFamily: "'Inter', sans-serif", fontSize: 11, fontWeight: 700, color: priorityColor(p.priority), background: `${priorityColor(p.priority)}18`, padding: "4px 10px", borderRadius: 20 }}>
                {p.priority}
              </span>
            </div>
            <div style={{ fontFamily: "'Poppins', sans-serif", fontSize: 14, fontWeight: 700, color: "#0A1B3D", marginBottom: 6, lineHeight: 1.3 }}>{p.name}</div>
            <div style={{ fontFamily: "'Inter', sans-serif", fontSize: 12, color: "#1677FF", marginBottom: 16 }}>{p.skill}</div>
            <div style={{ display: "flex", flexDirection: "column", gap: 8, marginBottom: 18, flex: 1 }}>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <span style={{ fontFamily: "'Inter', sans-serif", fontSize: 12, color: "#9ab4cc" }}>Wilayah</span>
                <span style={{ fontFamily: "'Inter', sans-serif", fontSize: 12, fontWeight: 600, color: "#0A1B3D" }}>{p.region}</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <span style={{ fontFamily: "'Inter', sans-serif", fontSize: 12, color: "#9ab4cc" }}>Estimasi Penerima</span>
                <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 12, fontWeight: 700, color: "#10d98e" }}>{p.beneficiaries}</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <span style={{ fontFamily: "'Inter', sans-serif", fontSize: 12, color: "#9ab4cc" }}>Estimasi Anggaran</span>
                <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 12, fontWeight: 700, color: "#f59e0b" }}>{p.budget}</span>
              </div>
            </div>
            <button style={{ width: "100%", padding: "10px", borderRadius: 10, border: "1px solid rgba(22,119,255,0.2)", background: "rgba(22,119,255,0.05)", fontFamily: "'Inter', sans-serif", fontSize: 13, fontWeight: 600, color: "#1677FF", cursor: "pointer" }}>
              Detail Program →
            </button>
          </div>
        ))}
      </div>
    </DashboardLayout>
  );
}
