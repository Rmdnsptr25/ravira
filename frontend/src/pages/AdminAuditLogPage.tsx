import { useState } from "react";
import { LayoutDashboard, Building2, Shield, AlertTriangle, Activity, ClipboardList, Cpu, Users, Settings, Search, ChevronLeft, ChevronRight } from "lucide-react";
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

const logs = [
  { id: 1, timestamp: "2026-05-30 14:32:11", user: "admin@ravira.id", action: "APPROVE", resource: "Perusahaan: PT Gojek Indonesia", ip: "192.168.1.100", detail: "Verifikasi perusahaan disetujui" },
  { id: 2, timestamp: "2026-05-30 14:15:42", user: "admin2@ravira.id", action: "DELETE", resource: "Lowongan ID: #4892", ip: "192.168.1.102", detail: "Lowongan dihapus karena melanggar ToS" },
  { id: 3, timestamp: "2026-05-30 13:58:09", user: "superadmin@ravira.id", action: "UPDATE", resource: "Pengaturan: rate_limit_api", ip: "10.0.0.1", detail: "Rate limit diubah dari 100 ke 200 req/min" },
  { id: 4, timestamp: "2026-05-30 13:44:33", user: "admin@ravira.id", action: "LOGIN", resource: "Auth System", ip: "192.168.1.100", detail: "Login berhasil via 2FA" },
  { id: 5, timestamp: "2026-05-30 13:21:17", user: "admin3@ravira.id", action: "CREATE", resource: "User ID: #98712", ip: "192.168.1.105", detail: "Akun admin baru dibuat" },
  { id: 6, timestamp: "2026-05-30 12:55:04", user: "admin2@ravira.id", action: "UPDATE", resource: "User ID: #45231", ip: "192.168.1.102", detail: "Status user diubah ke Suspended" },
  { id: 7, timestamp: "2026-05-30 12:33:48", user: "superadmin@ravira.id", action: "DELETE", resource: "Report ID: #2341", ip: "10.0.0.1", detail: "Laporan abuse ditutup dan dihapus" },
  { id: 8, timestamp: "2026-05-30 11:47:22", user: "admin@ravira.id", action: "APPROVE", resource: "Lowongan ID: #7823", ip: "192.168.1.100", detail: "Lowongan disetujui setelah review" },
  { id: 9, timestamp: "2026-05-30 11:20:09", user: "admin3@ravira.id", action: "LOGIN", resource: "Auth System", ip: "192.168.1.105", detail: "Login berhasil via SSO" },
  { id: 10, timestamp: "2026-05-30 10:58:37", user: "admin@ravira.id", action: "UPDATE", resource: "AI Config: threshold", ip: "192.168.1.100", detail: "Ambang batas matching diubah ke 0.85" },
  { id: 11, timestamp: "2026-05-30 10:32:14", user: "superadmin@ravira.id", action: "CREATE", resource: "Backup: ravira_db_20260530", ip: "10.0.0.1", detail: "Backup manual database berhasil" },
  { id: 12, timestamp: "2026-05-30 09:45:58", user: "admin2@ravira.id", action: "DELETE", resource: "Perusahaan ID: #1123", ip: "192.168.1.102", detail: "Perusahaan palsu dihapus dari sistem" },
  { id: 13, timestamp: "2026-05-30 09:22:41", user: "admin@ravira.id", action: "UPDATE", resource: "SMTP Config", ip: "192.168.1.100", detail: "Konfigurasi email server diperbarui" },
  { id: 14, timestamp: "2026-05-30 08:55:03", user: "superadmin@ravira.id", action: "APPROVE", resource: "Perusahaan: Kemenaker RI", ip: "10.0.0.1", detail: "Lembaga pemerintah berhasil diverifikasi" },
  { id: 15, timestamp: "2026-05-30 08:30:17", user: "admin3@ravira.id", action: "CREATE", resource: "Report: #3412", ip: "192.168.1.105", detail: "Laporan abuse baru dibuat oleh admin" },
];

const actionColor: Record<string, string> = {
  LOGIN: "#10d98e",
  CREATE: "#1677FF",
  UPDATE: "#f59e0b",
  DELETE: "#ff6b6b",
  APPROVE: "#8b5cf6",
};

const actionBg: Record<string, string> = {
  LOGIN: "rgba(16,217,142,0.1)",
  CREATE: "rgba(22,119,255,0.1)",
  UPDATE: "rgba(245,158,11,0.1)",
  DELETE: "rgba(255,107,107,0.1)",
  APPROVE: "rgba(139,92,246,0.1)",
};

export default function AdminAuditLogPage() {
  const [search, setSearch] = useState("");
  const [actionFilter, setActionFilter] = useState("Semua");
  const [dateFrom, setDateFrom] = useState("");

  const actions = ["Semua", "LOGIN", "CREATE", "UPDATE", "DELETE", "APPROVE"];

  const filtered = logs.filter((l) => {
    const matchSearch = search === "" || l.user.includes(search) || l.resource.toLowerCase().includes(search.toLowerCase()) || l.detail.toLowerCase().includes(search.toLowerCase());
    const matchAction = actionFilter === "Semua" || l.action === actionFilter;
    return matchSearch && matchAction;
  });

  return (
    <DashboardLayout sidebarItems={sidebarItems} userName="Admin Ravira" userRole="Super Admin" userInitial="A">
      <div style={{ marginBottom: 24 }}>
        <h1 style={{ fontFamily: "'Poppins', sans-serif", fontSize: 22, fontWeight: 800, color: "#0A1B3D", marginBottom: 4 }}>Audit Log</h1>
        <p style={{ fontFamily: "'Inter', sans-serif", fontSize: 14, color: "#6a88b8" }}>Rekam jejak semua aktivitas admin pada sistem Ravira</p>
      </div>

      {/* Filters */}
      <div style={{ display: "flex", gap: 12, marginBottom: 18, alignItems: "center" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8, background: "#fff", borderRadius: 10, border: "1px solid rgba(22,119,255,0.15)", padding: "8px 12px", flex: 1, maxWidth: 300 }}>
          <Search size={14} color="#6a88b8" />
          <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Cari user, resource, detail..." style={{ border: "none", outline: "none", fontFamily: "'Inter', sans-serif", fontSize: 13, color: "#0A1B3D", background: "transparent", width: "100%" }} />
        </div>
        <select value={actionFilter} onChange={(e) => setActionFilter(e.target.value)} style={{ fontFamily: "'Inter', sans-serif", fontSize: 13, color: "#0A1B3D", border: "1px solid rgba(22,119,255,0.2)", borderRadius: 8, padding: "8px 12px", outline: "none", background: "#fff" }}>
          {actions.map((a) => <option key={a} value={a}>{a}</option>)}
        </select>
        <input type="date" value={dateFrom} onChange={(e) => setDateFrom(e.target.value)} style={{ fontFamily: "'Inter', sans-serif", fontSize: 12, color: "#0A1B3D", border: "1px solid rgba(22,119,255,0.2)", borderRadius: 8, padding: "8px 10px", outline: "none" }} />
      </div>

      {/* Table */}
      <div style={{ background: "#fff", borderRadius: 18, border: "1px solid rgba(22,119,255,0.1)", overflow: "hidden", boxShadow: "0 2px 10px rgba(10,27,61,0.04)" }}>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ background: "rgba(22,119,255,0.04)", borderBottom: "1px solid rgba(22,119,255,0.1)" }}>
              {["Timestamp", "User", "Action", "Resource", "IP Address", "Detail", ""].map((h) => (
                <th key={h} style={{ fontFamily: "'Inter', sans-serif", fontSize: 12, fontWeight: 600, color: "#6a88b8", textAlign: "left", padding: "12px 16px" }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.map((log, i) => (
              <tr key={log.id} style={{ borderBottom: i < filtered.length - 1 ? "1px solid rgba(22,119,255,0.06)" : "none" }}>
                <td style={{ padding: "12px 16px", fontFamily: "'JetBrains Mono', monospace", fontSize: 11, color: "#6a88b8", whiteSpace: "nowrap" }}>{log.timestamp}</td>
                <td style={{ padding: "12px 16px", fontFamily: "'Inter', sans-serif", fontSize: 12, color: "#0A1B3D", fontWeight: 500 }}>{log.user}</td>
                <td style={{ padding: "12px 16px" }}>
                  <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 9, color: actionColor[log.action], background: actionBg[log.action], borderRadius: 5, padding: "3px 7px", border: `1px solid ${actionColor[log.action]}40` }}>{log.action}</span>
                </td>
                <td style={{ padding: "12px 16px", fontFamily: "'Inter', sans-serif", fontSize: 12, color: "#4a6080" }}>{log.resource}</td>
                <td style={{ padding: "12px 16px", fontFamily: "'JetBrains Mono', monospace", fontSize: 11, color: "#9ab4cc" }}>{log.ip}</td>
                <td style={{ padding: "12px 16px", fontFamily: "'Inter', sans-serif", fontSize: 12, color: "#6a88b8" }}>{log.detail}</td>
                <td style={{ padding: "12px 16px" }}>
                  <button onClick={() => toast.info(`Detail audit: ${log.action} — ${log.resource}`)} style={{ fontFamily: "'Inter', sans-serif", fontSize: 11, fontWeight: 600, color: "#1677FF", background: "rgba(22,119,255,0.08)", border: "1px solid rgba(22,119,255,0.2)", borderRadius: 7, padding: "5px 10px", cursor: "pointer" }}>
                    Lihat Detail
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Pagination */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "14px 20px", borderTop: "1px solid rgba(22,119,255,0.08)" }}>
          <span style={{ fontFamily: "'Inter', sans-serif", fontSize: 13, color: "#6a88b8" }}>Menampilkan {filtered.length} dari 360 log</span>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <span style={{ fontFamily: "'Inter', sans-serif", fontSize: 13, color: "#6a88b8" }}>Halaman 1 dari 24</span>
            <button style={{ padding: "6px", borderRadius: 7, border: "1px solid rgba(22,119,255,0.2)", background: "#f8fafb", cursor: "pointer", display: "flex", alignItems: "center" }}><ChevronLeft size={14} color="#6a88b8" /></button>
            <button style={{ padding: "6px", borderRadius: 7, border: "1px solid rgba(22,119,255,0.2)", background: "#f8fafb", cursor: "pointer", display: "flex", alignItems: "center" }}><ChevronRight size={14} color="#1677FF" /></button>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
