import { useState } from "react";
import { LayoutDashboard, Building2, Shield, AlertTriangle, Activity, ClipboardList, Cpu, Users, Settings, Search, UserX, KeyRound } from "lucide-react";
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

const users = [
  { id: 1, nama: "Budi Santoso", email: "budi.santoso@gmail.com", role: "Kandidat", status: "Aktif", daftar: "2026-01-15", lastLogin: "2026-05-30" },
  { id: 2, nama: "PT Gojek Indonesia", email: "recruiter@gojek.com", role: "Recruiter", status: "Aktif", daftar: "2025-11-03", lastLogin: "2026-05-29" },
  { id: 3, nama: "Siti Aminah", email: "siti.aminah@yahoo.com", role: "Kandidat", status: "Suspended", daftar: "2026-02-20", lastLogin: "2026-05-10" },
  { id: 4, nama: "Disnaker Kaltim", email: "admin@disnakerkaltim.go.id", role: "Pemerintah", status: "Aktif", daftar: "2025-08-17", lastLogin: "2026-05-28" },
  { id: 5, nama: "Andi Prasetyo", email: "andi.p@hotmail.com", role: "Kandidat", status: "Aktif", daftar: "2026-03-05", lastLogin: "2026-05-30" },
  { id: 6, nama: "CV Maju Bersama", email: "hr@majubersama.co.id", role: "Recruiter", status: "Suspended", daftar: "2026-01-28", lastLogin: "2026-04-12" },
  { id: 7, nama: "Admin Pusat", email: "admin@ravira.id", role: "Admin", status: "Aktif", daftar: "2024-06-01", lastLogin: "2026-05-30" },
  { id: 8, nama: "Dewi Kurniawan", email: "dewi.k@gmail.com", role: "Kandidat", status: "Aktif", daftar: "2026-04-11", lastLogin: "2026-05-27" },
  { id: 9, nama: "PT Bank BRI Tbk", email: "rekrutmen@bri.co.id", role: "Recruiter", status: "Aktif", daftar: "2025-10-22", lastLogin: "2026-05-29" },
  { id: 10, nama: "Kemnaker RI", email: "info@kemnaker.go.id", role: "Pemerintah", status: "Aktif", daftar: "2025-07-09", lastLogin: "2026-05-25" },
];

const roleColor: Record<string, string> = {
  Kandidat: "#1677FF",
  Recruiter: "#8b5cf6",
  Pemerintah: "#4DB8FF",
  Admin: "#ff6b6b",
};
const roleBg: Record<string, string> = {
  Kandidat: "rgba(22,119,255,0.1)",
  Recruiter: "rgba(139,92,246,0.1)",
  Pemerintah: "rgba(77,184,255,0.1)",
  Admin: "rgba(255,107,107,0.1)",
};

const statCards = [
  { label: "Total User", value: "48,924", color: "#1677FF" },
  { label: "Kandidat", value: "45,231", color: "#1677FF" },
  { label: "Recruiter", value: "2,847", color: "#8b5cf6" },
  { label: "Pemerintah", value: "63", color: "#4DB8FF" },
  { label: "Admin", value: "3", color: "#ff6b6b" },
];

export default function AdminUserManagementPage() {
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("Semua");
  const [statusFilter, setStatusFilter] = useState("Semua");
  const [suspendTarget, setSuspendTarget] = useState<string | null>(null);

  const roles = ["Semua", "Kandidat", "Recruiter", "Pemerintah", "Admin"];
  const statuses = ["Semua", "Aktif", "Suspended"];

  const filtered = users.filter((u) => {
    const matchSearch = search === "" || u.nama.toLowerCase().includes(search.toLowerCase()) || u.email.toLowerCase().includes(search.toLowerCase());
    const matchRole = roleFilter === "Semua" || u.role === roleFilter;
    const matchStatus = statusFilter === "Semua" || u.status === statusFilter;
    return matchSearch && matchRole && matchStatus;
  });

  return (
    <DashboardLayout sidebarItems={sidebarItems} userName="Admin Ravira" userRole="Super Admin" userInitial="A">
      {suspendTarget && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(10,27,61,0.45)", zIndex: 1000, display: "flex", alignItems: "center", justifyContent: "center" }}>
          <div style={{ background: "#fff", borderRadius: 18, padding: 32, maxWidth: 380, width: "90%", boxShadow: "0 8px 40px rgba(10,27,61,0.18)" }}>
            <div style={{ fontFamily: "'Poppins', sans-serif", fontSize: 17, fontWeight: 700, color: "#0A1B3D", marginBottom: 10 }}>Suspend User?</div>
            <p style={{ fontFamily: "'Inter', sans-serif", fontSize: 13, color: "#6a88b8", marginBottom: 20 }}>
              Akun <strong style={{ color: "#0A1B3D" }}>{suspendTarget}</strong> akan disuspend dan tidak dapat mengakses platform.
            </p>
            <div style={{ display: "flex", gap: 10 }}>
              <button onClick={() => setSuspendTarget(null)} style={{ flex: 1, padding: "10px", borderRadius: 10, border: "1px solid rgba(22,119,255,0.2)", background: "#f0f7ff", fontFamily: "'Inter', sans-serif", fontSize: 13, color: "#6a88b8", cursor: "pointer" }}>Batal</button>
              <button onClick={() => { toast.warning(`User ${suspendTarget} berhasil disuspend`); setSuspendTarget(null); }} style={{ flex: 2, padding: "10px", borderRadius: 10, border: "none", background: "linear-gradient(135deg, #f59e0b, #d97706)", fontFamily: "'Poppins', sans-serif", fontSize: 13, fontWeight: 700, color: "#fff", cursor: "pointer" }}>
                Ya, Suspend
              </button>
            </div>
          </div>
        </div>
      )}
      <div style={{ marginBottom: 24 }}>
        <h1 style={{ fontFamily: "'Poppins', sans-serif", fontSize: 22, fontWeight: 800, color: "#0A1B3D", marginBottom: 4 }}>Manajemen User</h1>
        <p style={{ fontFamily: "'Inter', sans-serif", fontSize: 14, color: "#6a88b8" }}>Kelola akun pengguna platform Ravira</p>
      </div>

      {/* Stats */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: 12, marginBottom: 24 }}>
        {statCards.map((s) => (
          <div key={s.label} style={{ background: "#fff", borderRadius: 14, border: "1px solid rgba(22,119,255,0.1)", padding: "14px 16px", boxShadow: "0 2px 8px rgba(10,27,61,0.04)" }}>
            <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 22, fontWeight: 800, color: s.color }}>{s.value}</div>
            <div style={{ fontFamily: "'Inter', sans-serif", fontSize: 11, color: "#6a88b8", marginTop: 4 }}>{s.label}</div>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div style={{ display: "flex", gap: 10, marginBottom: 18, alignItems: "center" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8, background: "#fff", borderRadius: 10, border: "1px solid rgba(22,119,255,0.15)", padding: "8px 12px", flex: 1, maxWidth: 280 }}>
          <Search size={14} color="#6a88b8" />
          <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Cari nama atau email..." style={{ border: "none", outline: "none", fontFamily: "'Inter', sans-serif", fontSize: 13, color: "#0A1B3D", background: "transparent", width: "100%" }} />
        </div>
        <select value={roleFilter} onChange={(e) => setRoleFilter(e.target.value)} style={{ fontFamily: "'Inter', sans-serif", fontSize: 13, color: "#0A1B3D", border: "1px solid rgba(22,119,255,0.2)", borderRadius: 8, padding: "8px 12px", outline: "none", background: "#fff" }}>
          {roles.map((r) => <option key={r} value={r}>{r === "Semua" ? "Semua Role" : r}</option>)}
        </select>
        <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} style={{ fontFamily: "'Inter', sans-serif", fontSize: 13, color: "#0A1B3D", border: "1px solid rgba(22,119,255,0.2)", borderRadius: 8, padding: "8px 12px", outline: "none", background: "#fff" }}>
          {statuses.map((s) => <option key={s} value={s}>{s === "Semua" ? "Semua Status" : s}</option>)}
        </select>
      </div>

      {/* Table */}
      <div style={{ background: "#fff", borderRadius: 18, border: "1px solid rgba(22,119,255,0.1)", overflow: "hidden", boxShadow: "0 2px 10px rgba(10,27,61,0.04)" }}>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ background: "rgba(22,119,255,0.04)", borderBottom: "1px solid rgba(22,119,255,0.1)" }}>
              {["Nama", "Email", "Role", "Status", "Tanggal Daftar", "Last Login", "Aksi"].map((h) => (
                <th key={h} style={{ fontFamily: "'Inter', sans-serif", fontSize: 12, fontWeight: 600, color: "#6a88b8", textAlign: "left", padding: "12px 16px" }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.map((u, i) => (
              <tr key={u.id} style={{ borderBottom: i < filtered.length - 1 ? "1px solid rgba(22,119,255,0.06)" : "none" }}>
                <td style={{ padding: "13px 16px", fontFamily: "'Inter', sans-serif", fontSize: 13, fontWeight: 600, color: "#0A1B3D" }}>{u.nama}</td>
                <td style={{ padding: "13px 16px", fontFamily: "'Inter', sans-serif", fontSize: 12, color: "#6a88b8" }}>{u.email}</td>
                <td style={{ padding: "13px 16px" }}>
                  <span style={{ fontFamily: "'Inter', sans-serif", fontSize: 11, fontWeight: 600, color: roleColor[u.role], background: roleBg[u.role], borderRadius: 6, padding: "3px 9px", border: `1px solid ${roleColor[u.role]}30` }}>{u.role}</span>
                </td>
                <td style={{ padding: "13px 16px" }}>
                  <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10, color: u.status === "Aktif" ? "#10d98e" : "#ff6b6b", background: u.status === "Aktif" ? "rgba(16,217,142,0.1)" : "rgba(255,107,107,0.1)", borderRadius: 5, padding: "3px 7px", border: `1px solid ${u.status === "Aktif" ? "rgba(16,217,142,0.3)" : "rgba(255,107,107,0.3)"}` }}>{u.status.toUpperCase()}</span>
                </td>
                <td style={{ padding: "13px 16px", fontFamily: "'JetBrains Mono', monospace", fontSize: 11, color: "#9ab4cc" }}>{u.daftar}</td>
                <td style={{ padding: "13px 16px", fontFamily: "'JetBrains Mono', monospace", fontSize: 11, color: "#9ab4cc" }}>{u.lastLogin}</td>
                <td style={{ padding: "13px 16px" }}>
                  <div style={{ display: "flex", gap: 6 }}>
                    <button onClick={() => setSuspendTarget(u.nama)} style={{ fontFamily: "'Inter', sans-serif", fontSize: 11, color: "#f59e0b", background: "rgba(245,158,11,0.08)", border: "1px solid rgba(245,158,11,0.25)", borderRadius: 7, padding: "5px 9px", cursor: "pointer", display: "flex", alignItems: "center", gap: 3 }}>
                      <UserX size={11} /> Suspend
                    </button>
                    <button onClick={() => toast.success("Email reset terkirim")} style={{ fontFamily: "'Inter', sans-serif", fontSize: 11, color: "#1677FF", background: "rgba(22,119,255,0.08)", border: "1px solid rgba(22,119,255,0.25)", borderRadius: 7, padding: "5px 9px", cursor: "pointer", display: "flex", alignItems: "center", gap: 3 }}>
                      <KeyRound size={11} /> Reset Password
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </DashboardLayout>
  );
}
