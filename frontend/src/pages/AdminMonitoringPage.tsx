import { LayoutDashboard, Building2, Shield, AlertTriangle, Activity, ClipboardList, Cpu, Users, Settings, RefreshCw } from "lucide-react";
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

const integrations = [
  { id: 1, name: "BPS Open Data API", endpoint: "api.bps.go.id/v1/data", lastPing: "2 menit lalu", uptime: 99.8, latency: 134, status: "OK" },
  { id: 2, name: "Kemnaker Job Portal", endpoint: "portal.kemnaker.go.id/api", lastPing: "5 menit lalu", uptime: 98.7, latency: 210, status: "OK" },
  { id: 3, name: "BPJS Ketenagakerjaan", endpoint: "api.bpjsketenagakerjaan.go.id", lastPing: "12 menit lalu", uptime: 87.2, latency: 2450, status: "Error" },
  { id: 4, name: "LinkedIn Jobs API", endpoint: "api.linkedin.com/v2/jobs", lastPing: "1 menit lalu", uptime: 99.9, latency: 98, status: "OK" },
  { id: 5, name: "Google Jobs Indexing", endpoint: "indexing.googleapis.com", lastPing: "3 jam lalu", uptime: 72.4, latency: 5800, status: "Error" },
  { id: 6, name: "Dukcapil Verifikasi", endpoint: "api.dukcapil.kemendagri.go.id", lastPing: "8 menit lalu", uptime: 99.1, latency: 188, status: "OK" },
];

const globalStats = [
  { label: "Total APIs", value: "6", color: "#1677FF" },
  { label: "Status OK", value: "4", color: "#10d98e" },
  { label: "Error", value: "2", color: "#ff6b6b" },
  { label: "Avg Uptime", value: "99.2%", color: "#8b5cf6" },
];

export default function AdminMonitoringPage() {
  return (
    <DashboardLayout sidebarItems={sidebarItems} userName="Admin Ravira" userRole="Super Admin" userInitial="A">
      <div style={{ marginBottom: 24 }}>
        <h1 style={{ fontFamily: "'Poppins', sans-serif", fontSize: 22, fontWeight: 800, color: "#0A1B3D", marginBottom: 4 }}>Monitoring Integrasi API</h1>
        <p style={{ fontFamily: "'Inter', sans-serif", fontSize: 14, color: "#6a88b8" }}>Pantau status koneksi dan performa integrasi layanan eksternal</p>
      </div>

      {/* Global Stats */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 14, marginBottom: 28 }}>
        {globalStats.map((s) => (
          <div key={s.label} style={{ background: "#fff", borderRadius: 14, border: "1px solid rgba(22,119,255,0.1)", padding: "16px 20px", boxShadow: "0 2px 8px rgba(10,27,61,0.04)" }}>
            <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 28, fontWeight: 800, color: s.color }}>{s.value}</div>
            <div style={{ fontFamily: "'Inter', sans-serif", fontSize: 12, color: "#6a88b8", marginTop: 4 }}>{s.label}</div>
          </div>
        ))}
      </div>

      {/* Integration Cards */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 16 }}>
        {integrations.map((api) => {
          const isOk = api.status === "OK";
          return (
            <div key={api.id} style={{ background: "#fff", borderRadius: 18, border: `1px solid ${isOk ? "rgba(16,217,142,0.15)" : "rgba(255,107,107,0.2)"}`, padding: "20px 22px", boxShadow: "0 2px 10px rgba(10,27,61,0.04)" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 16 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <div style={{ width: 10, height: 10, borderRadius: "50%", background: isOk ? "#10d98e" : "#ff6b6b", boxShadow: `0 0 8px ${isOk ? "#10d98e" : "#ff6b6b"}80`, flexShrink: 0 }} />
                  <div>
                    <div style={{ fontFamily: "'Inter', sans-serif", fontSize: 14, fontWeight: 700, color: "#0A1B3D" }}>{api.name}</div>
                    <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10, color: "#9ab4cc", marginTop: 2 }}>{api.endpoint}</div>
                  </div>
                </div>
                <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 9, color: isOk ? "#10d98e" : "#ff6b6b", background: isOk ? "rgba(16,217,142,0.1)" : "rgba(255,107,107,0.1)", borderRadius: 6, padding: "3px 8px", border: `1px solid ${isOk ? "rgba(16,217,142,0.3)" : "rgba(255,107,107,0.3)"}` }}>{api.status}</span>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 12, marginBottom: 16 }}>
                <div>
                  <div style={{ fontFamily: "'Inter', sans-serif", fontSize: 11, color: "#9ab4cc", marginBottom: 2 }}>Last Ping</div>
                  <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 12, color: "#0A1B3D" }}>{api.lastPing}</div>
                </div>
                <div>
                  <div style={{ fontFamily: "'Inter', sans-serif", fontSize: 11, color: "#9ab4cc", marginBottom: 2 }}>Uptime</div>
                  <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 12, color: api.uptime >= 95 ? "#10d98e" : api.uptime >= 80 ? "#f59e0b" : "#ff6b6b", fontWeight: 700 }}>{api.uptime}%</div>
                </div>
                <div>
                  <div style={{ fontFamily: "'Inter', sans-serif", fontSize: 11, color: "#9ab4cc", marginBottom: 2 }}>Latency</div>
                  <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 12, color: api.latency < 500 ? "#10d98e" : api.latency < 2000 ? "#f59e0b" : "#ff6b6b", fontWeight: 700 }}>{api.latency}ms</div>
                </div>
              </div>

              <button onClick={() => toast.success("Sinkronisasi diulang")} style={{ fontFamily: "'Inter', sans-serif", fontSize: 12, fontWeight: 600, color: "#1677FF", background: "rgba(22,119,255,0.08)", border: "1px solid rgba(22,119,255,0.25)", borderRadius: 8, padding: "7px 14px", cursor: "pointer", display: "flex", alignItems: "center", gap: 6 }}>
                <RefreshCw size={12} /> Retry Sync
              </button>
            </div>
          );
        })}
      </div>
    </DashboardLayout>
  );
}
