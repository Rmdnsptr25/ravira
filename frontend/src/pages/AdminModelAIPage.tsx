import { LayoutDashboard, Building2, Shield, AlertTriangle, Activity, ClipboardList, Cpu, Users, Settings, Play, Calendar } from "lucide-react";
import { toast } from "sonner";
import { DashboardLayout, SidebarItem } from "../components/DashboardLayout";

const sidebarItems: SidebarItem[] = [
  { key: "overview", label: "Overview", icon: <LayoutDashboard size={16} />, path: "/dashboard/admin" },
  { key: "verifikasi", label: "Verifikasi Perusahaan", icon: <Building2 size={16} />, path: "/dashboard/admin/verifikasi-perusahaan" },
  { key: "moderasi", label: "Moderasi Lowongan", icon: <Shield size={16} />, path: "/dashboard/admin/moderasi-lowongan" },
  { key: "laporan", label: "Laporan Abuse", icon: <AlertTriangle size={16} />, path: "/dashboard/admin/laporan-abuse" },
  { key: "monitoring", label: "Monitoring Integrasi", icon: <Activity size={16} />, path: "/dashboard/admin/monitoring-integrasi" },
  { key: "audit", label: "Audit Log", icon: <ClipboardList size={16} />, path: "/dashboard/admin/audit-log" },
  { key: "ai", label: "AI Performance", icon: <Cpu size={16} />, path: "/dashboard/admin/model-ai" },
  { key: "users", label: "Manajemen User", icon: <Users size={16} />, path: "/dashboard/admin/user-management" },
  { key: "pengaturan", label: "Pengaturan Sistem", icon: <Settings size={16} />, path: "/dashboard/admin/pengaturan" },
];

const kpis = [
  { label: "Accuracy", value: "94.2%", sub: "+0.8% dari bulan lalu", color: "#10d98e" },
  { label: "F1 Score", value: "0.92", sub: "Precision 0.94 · Recall 0.90", color: "#1677FF" },
  { label: "Avg Inference Time", value: "120ms", sub: "P95: 340ms · P99: 680ms", color: "#f59e0b" },
  { label: "Daily Predictions", value: "48.2K", sub: "+12% dari minggu lalu", color: "#8b5cf6" },
];

const models = [
  { version: "v2.4.1", status: "Current", deployed: "2026-05-01", accuracy: "94.2%", f1: "0.92", size: "1.2 GB" },
  { version: "v2.3.8", status: "Previous", deployed: "2026-03-15", accuracy: "92.7%", f1: "0.90", size: "1.1 GB" },
  { version: "v2.5.0-beta", status: "Staging", deployed: "—", accuracy: "95.1%", f1: "0.93", size: "1.4 GB" },
];

const barData = [82, 76, 88, 91, 85, 93, 89, 94, 91, 87, 95, 92];
const months = ["Jun", "Jul", "Ags", "Sep", "Okt", "Nov", "Des", "Jan", "Feb", "Mar", "Apr", "Mei"];

const statusColor: Record<string, string> = { Current: "#10d98e", Previous: "#6a88b8", Staging: "#f59e0b" };
const statusBg: Record<string, string> = { Current: "rgba(16,217,142,0.1)", Previous: "rgba(106,136,184,0.1)", Staging: "rgba(245,158,11,0.1)" };

export default function AdminModelAIPage() {
  return (
    <DashboardLayout sidebarItems={sidebarItems} userName="Admin Ravira" userRole="Super Admin" userInitial="A">
      <div style={{ marginBottom: 24 }}>
        <h1 style={{ fontFamily: "'Poppins', sans-serif", fontSize: 22, fontWeight: 800, color: "#0A1B3D", marginBottom: 4 }}>Model AI Performance</h1>
        <p style={{ fontFamily: "'Inter', sans-serif", fontSize: 14, color: "#6a88b8" }}>Monitor performa model rekomendasi kerja berbasis AI</p>
      </div>

      {/* KPIs */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 14, marginBottom: 24 }}>
        {kpis.map((k) => (
          <div key={k.label} style={{ background: "#fff", borderRadius: 16, border: "1px solid rgba(22,119,255,0.1)", padding: "18px 20px", boxShadow: "0 2px 8px rgba(10,27,61,0.04)" }}>
            <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 26, fontWeight: 800, color: k.color, marginBottom: 4 }}>{k.value}</div>
            <div style={{ fontFamily: "'Inter', sans-serif", fontSize: 13, fontWeight: 600, color: "#0A1B3D", marginBottom: 4 }}>{k.label}</div>
            <div style={{ fontFamily: "'Inter', sans-serif", fontSize: 11, color: "#9ab4cc" }}>{k.sub}</div>
          </div>
        ))}
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 320px", gap: 18, marginBottom: 18 }}>
        {/* Accuracy Bar Chart */}
        <div style={{ background: "#fff", borderRadius: 18, border: "1px solid rgba(22,119,255,0.1)", padding: "22px" }}>
          <div style={{ fontFamily: "'Poppins', sans-serif", fontSize: 14, fontWeight: 700, color: "#0A1B3D", marginBottom: 18 }}>Tren Akurasi Model (12 Bulan)</div>
          <div style={{ display: "flex", alignItems: "flex-end", gap: 8, height: 160 }}>
            {barData.map((v, i) => (
              <div key={i} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 4 }}>
                <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 9, color: "#9ab4cc" }}>{v}</span>
                <div style={{ width: "100%", height: `${(v / 100) * 140}px`, background: i === barData.length - 1 ? "#1677FF" : "rgba(22,119,255,0.25)", borderRadius: "4px 4px 0 0", transition: "height 0.3s" }} />
                <span style={{ fontFamily: "'Inter', sans-serif", fontSize: 9, color: "#9ab4cc" }}>{months[i]}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Retraining Schedule */}
        <div style={{ background: "#fff", borderRadius: 18, border: "1px solid rgba(22,119,255,0.1)", padding: "22px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 16 }}>
            <Calendar size={16} color="#1677FF" />
            <span style={{ fontFamily: "'Poppins', sans-serif", fontSize: 14, fontWeight: 700, color: "#0A1B3D" }}>Jadwal Retraining</span>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 12, marginBottom: 20 }}>
            {[
              { label: "Jadwal Berikutnya", value: "1 Juni 2026", color: "#1677FF" },
              { label: "Frekuensi", value: "Bulanan", color: "#0A1B3D" },
              { label: "Dataset Size", value: "2.4M records", color: "#0A1B3D" },
              { label: "Est. Duration", value: "4-6 jam", color: "#0A1B3D" },
              { label: "Last Training", value: "1 Mei 2026", color: "#10d98e" },
              { label: "Training Loss", value: "0.043", color: "#10d98e" },
            ].map((item) => (
              <div key={item.label} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", paddingBottom: 10, borderBottom: "1px solid rgba(22,119,255,0.06)" }}>
                <span style={{ fontFamily: "'Inter', sans-serif", fontSize: 12, color: "#6a88b8" }}>{item.label}</span>
                <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 12, color: item.color, fontWeight: 600 }}>{item.value}</span>
              </div>
            ))}
          </div>
          <button onClick={() => toast.info("Retraining dijadwalkan")} style={{ width: "100%", fontFamily: "'Inter', sans-serif", fontSize: 13, fontWeight: 700, color: "#fff", background: "#1677FF", border: "none", borderRadius: 10, padding: "10px", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 6 }}>
            <Play size={14} /> Trigger Retraining
          </button>
        </div>
      </div>

      {/* Model Versions Table */}
      <div style={{ background: "#fff", borderRadius: 18, border: "1px solid rgba(22,119,255,0.1)", overflow: "hidden", boxShadow: "0 2px 10px rgba(10,27,61,0.04)" }}>
        <div style={{ padding: "18px 22px", borderBottom: "1px solid rgba(22,119,255,0.08)" }}>
          <div style={{ fontFamily: "'Poppins', sans-serif", fontSize: 14, fontWeight: 700, color: "#0A1B3D" }}>Riwayat Versi Model</div>
        </div>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ background: "rgba(22,119,255,0.04)", borderBottom: "1px solid rgba(22,119,255,0.1)" }}>
              {["Versi", "Status", "Deploy Date", "Accuracy", "F1 Score", "Model Size", ""].map((h) => (
                <th key={h} style={{ fontFamily: "'Inter', sans-serif", fontSize: 12, fontWeight: 600, color: "#6a88b8", textAlign: "left", padding: "12px 20px" }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {models.map((m, i) => (
              <tr key={m.version} style={{ borderBottom: i < models.length - 1 ? "1px solid rgba(22,119,255,0.06)" : "none" }}>
                <td style={{ padding: "14px 20px", fontFamily: "'JetBrains Mono', monospace", fontSize: 13, fontWeight: 700, color: "#0A1B3D" }}>{m.version}</td>
                <td style={{ padding: "14px 20px" }}>
                  <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10, color: statusColor[m.status], background: statusBg[m.status], borderRadius: 6, padding: "3px 8px", border: `1px solid ${statusColor[m.status]}40` }}>{m.status.toUpperCase()}</span>
                </td>
                <td style={{ padding: "14px 20px", fontFamily: "'JetBrains Mono', monospace", fontSize: 12, color: "#6a88b8" }}>{m.deployed}</td>
                <td style={{ padding: "14px 20px", fontFamily: "'JetBrains Mono', monospace", fontSize: 13, color: "#10d98e", fontWeight: 700 }}>{m.accuracy}</td>
                <td style={{ padding: "14px 20px", fontFamily: "'JetBrains Mono', monospace", fontSize: 13, color: "#1677FF", fontWeight: 700 }}>{m.f1}</td>
                <td style={{ padding: "14px 20px", fontFamily: "'JetBrains Mono', monospace", fontSize: 12, color: "#6a88b8" }}>{m.size}</td>
                <td style={{ padding: "14px 20px" }}>
                  <button onClick={() => toast.info(`Detail model ${m.version}: Accuracy ${m.accuracy}, F1 ${m.f1}`)} style={{ fontFamily: "'Inter', sans-serif", fontSize: 11, fontWeight: 600, color: "#1677FF", background: "rgba(22,119,255,0.08)", border: "1px solid rgba(22,119,255,0.2)", borderRadius: 7, padding: "5px 10px", cursor: "pointer" }}>
                    Lihat Detail
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
