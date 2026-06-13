import { LayoutDashboard, Building2, Shield, AlertTriangle, Activity, ClipboardList, Cpu, Users, Settings, Search } from "lucide-react";
import { toast } from "sonner";
import { DashboardLayout } from "../components/DashboardLayout";
import type { SidebarItem } from "../components/DashboardLayout";

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

const reports = [
  { id: 1, reporter: "Budi Santoso", entity: "PT Cepat Kaya Indonesia", type: "Penipuan", date: "2026-05-30", severity: "Tinggi", desc: "Perusahaan meminta biaya registrasi sebesar Rp500.000 kepada pelamar kerja." },
  { id: 2, reporter: "Siti Aminah", entity: "Lowongan: Admin Officer", type: "Konten Tidak Pantas", date: "2026-05-29", severity: "Sedang", desc: "Deskripsi pekerjaan mengandung konten yang tidak sesuai standar platform." },
  { id: 3, reporter: "Andi Prasetyo", entity: "CV Maju Pesat", type: "Spam", date: "2026-05-28", severity: "Rendah", desc: "Perusahaan memposting lebih dari 50 lowongan identik dalam 1 hari." },
  { id: 4, reporter: "Dewi Kurniawan", entity: "PT Rekrut Cepat", type: "Penipuan", date: "2026-05-27", severity: "Tinggi", desc: "Modus wawancara palsu dengan permintaan data pribadi berlebihan." },
  { id: 5, reporter: "Reza Firmansyah", entity: "Lowongan: Marketing Online", type: "Lainnya", date: "2026-05-26", severity: "Sedang", desc: "Informasi kontak tidak valid dan alamat perusahaan tidak dapat diverifikasi." },
  { id: 6, reporter: "Maya Putri", entity: "PT Janji Palsu Group", type: "Penipuan", date: "2026-05-25", severity: "Tinggi", desc: "Pelamar diminta transfer uang untuk proses seleksi lanjutan." },
  { id: 7, reporter: "Hendra Wijaya", entity: "Lowongan: Sales Freelance", type: "Spam", date: "2026-05-24", severity: "Rendah", desc: "Konten lowongan tidak informatif dan hanya berisi kata kunci umum." },
  { id: 8, reporter: "Lina Rahayu", entity: "CV Sukses Bersama", type: "Konten Tidak Pantas", date: "2026-05-23", severity: "Sedang", desc: "Foto profil perusahaan tidak sesuai dan deskripsi mengandung diskriminasi." },
];

const severityColor: Record<string, string> = { Tinggi: "#ff6b6b", Sedang: "#f59e0b", Rendah: "#10d98e" };
const severityBg: Record<string, string> = { Tinggi: "rgba(255,107,107,0.1)", Sedang: "rgba(245,158,11,0.1)", Rendah: "rgba(16,217,142,0.1)" };

const stats = [
  { label: "Total Laporan", value: 34, color: "#1677FF" },
  { label: "Tinggi", value: 8, color: "#ff6b6b" },
  { label: "Sedang", value: 16, color: "#f59e0b" },
  { label: "Rendah", value: 10, color: "#10d98e" },
];

export default function AdminAbuseReportPage() {
  return (
    <DashboardLayout sidebarItems={sidebarItems} userName="Admin Ravira" userRole="Super Admin" userInitial="A">
      <div style={{ marginBottom: 24 }}>
        <h1 style={{ fontFamily: "'Poppins', sans-serif", fontSize: 22, fontWeight: 800, color: "#0A1B3D", marginBottom: 4 }}>Laporan Abuse & Pelanggaran</h1>
        <p style={{ fontFamily: "'Inter', sans-serif", fontSize: 14, color: "#6a88b8" }}>Investigasi dan tangani laporan pelanggaran dari pengguna platform</p>
      </div>

      {/* Stats */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 14, marginBottom: 24 }}>
        {stats.map((s) => (
          <div key={s.label} style={{ background: "#fff", borderRadius: 14, border: "1px solid rgba(22,119,255,0.1)", padding: "16px 20px", boxShadow: "0 2px 8px rgba(10,27,61,0.04)" }}>
            <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 28, fontWeight: 800, color: s.color }}>{s.value}</div>
            <div style={{ fontFamily: "'Inter', sans-serif", fontSize: 12, color: "#6a88b8", marginTop: 4 }}>{s.label}</div>
          </div>
        ))}
      </div>

      {/* Report Cards */}
      <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
        {reports.map((r) => (
          <div key={r.id} style={{ background: "#fff", borderRadius: 16, border: `1px solid ${severityColor[r.severity]}30`, padding: "18px 20px", boxShadow: "0 2px 8px rgba(10,27,61,0.04)" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 12 }}>
              <div style={{ display: "flex", align: "center", gap: 12 }}>
                <div>
                  <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 4 }}>
                    <span style={{ fontFamily: "'Inter', sans-serif", fontSize: 14, fontWeight: 700, color: "#0A1B3D" }}>{r.entity}</span>
                    <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 9, color: severityColor[r.severity], background: severityBg[r.severity], borderRadius: 6, padding: "2px 7px", border: `1px solid ${severityColor[r.severity]}40` }}>{r.severity.toUpperCase()}</span>
                    <span style={{ fontFamily: "'Inter', sans-serif", fontSize: 11, color: "#8b5cf6", background: "rgba(139,92,246,0.08)", borderRadius: 6, padding: "2px 8px", border: "1px solid rgba(139,92,246,0.2)" }}>{r.type}</span>
                  </div>
                  <div style={{ fontFamily: "'Inter', sans-serif", fontSize: 12, color: "#6a88b8" }}>
                    Dilaporkan oleh <strong style={{ color: "#0A1B3D" }}>{r.reporter}</strong> · {r.date}
                  </div>
                </div>
              </div>
              <div style={{ display: "flex", gap: 8 }}>
                <button onClick={() => toast.info("Investigasi dimulai")} style={{ fontFamily: "'Inter', sans-serif", fontSize: 12, fontWeight: 600, color: "#1677FF", background: "rgba(22,119,255,0.08)", border: "1px solid rgba(22,119,255,0.25)", borderRadius: 8, padding: "6px 14px", cursor: "pointer" }}>
                  Investigasi
                </button>
                <button onClick={() => toast.success("Laporan ditutup")} style={{ fontFamily: "'Inter', sans-serif", fontSize: 12, fontWeight: 600, color: "#6a88b8", background: "rgba(106,136,184,0.08)", border: "1px solid rgba(106,136,184,0.2)", borderRadius: 8, padding: "6px 14px", cursor: "pointer" }}>
                  Dismiss
                </button>
              </div>
            </div>
            <p style={{ fontFamily: "'Inter', sans-serif", fontSize: 13, color: "#4a6080", lineHeight: 1.6, margin: 0 }}>{r.desc}</p>
          </div>
        ))}
      </div>
    </DashboardLayout>
  );
}
