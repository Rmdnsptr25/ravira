import { useState } from "react";
import { useNavigate } from "react-router";
import { LayoutDashboard, Building2, Shield, AlertTriangle, Activity, ClipboardList, Cpu, Users, Settings, CheckCircle2, XCircle, Eye, FileText } from "lucide-react";
import { toast } from "sonner";
import { DashboardLayout } from "../components/DashboardLayout";
import type { SidebarItem } from "../components/DashboardLayout";
import { RejectionReasonModal } from "../components/Modals";

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

const companies = [
  { id: 1, nama: "PT Sinar Mas Digital", industri: "Teknologi", tanggal: "2026-05-28", dokumen: "KTP, SIUP, NPWP", status: "Menunggu" },
  { id: 2, nama: "CV Maju Bersama", industri: "Perdagangan", tanggal: "2026-05-27", dokumen: "KTP, SIUP", status: "Menunggu" },
  { id: 3, nama: "PT Nusantara Logistik", industri: "Logistik", tanggal: "2026-05-26", dokumen: "SIUP, NPWP, TDP", status: "Diverifikasi" },
  { id: 4, nama: "Disnaker Kaltim", industri: "Pemerintah", tanggal: "2026-05-25", dokumen: "SK Instansi", status: "Menunggu" },
  { id: 5, nama: "PT Garuda Teknindo", industri: "Manufaktur", tanggal: "2026-05-24", dokumen: "KTP, SIUP, NPWP", status: "Ditolak" },
  { id: 6, nama: "PT Bukalapak Commerce", industri: "E-Commerce", tanggal: "2026-05-23", dokumen: "SIUP, NPWP", status: "Diverifikasi" },
  { id: 7, nama: "Kemenaker RI Cabang Jatim", industri: "Pemerintah", tanggal: "2026-05-22", dokumen: "SK Instansi, NPWP", status: "Menunggu" },
  { id: 8, nama: "PT Pelindo Digital", industri: "Maritim", tanggal: "2026-05-21", dokumen: "KTP, SIUP, NPWP, TDP", status: "Menunggu" },
];

const statusColor: Record<string, string> = {
  Menunggu: "#f59e0b",
  Diverifikasi: "#10d98e",
  Ditolak: "#ff6b6b",
};

const statusBg: Record<string, string> = {
  Menunggu: "rgba(245,158,11,0.1)",
  Diverifikasi: "rgba(16,217,142,0.1)",
  Ditolak: "rgba(255,107,107,0.1)",
};

export default function AdminVerifikasiPage() {
  const navigate = useNavigate();
  const [filter, setFilter] = useState("Semua");
  const [rejectTarget, setRejectTarget] = useState<string | null>(null);

  const tabs = ["Semua", "Menunggu", "Diverifikasi", "Ditolak"];
  const filtered = filter === "Semua" ? companies : companies.filter((c) => c.status === filter);

  const stats = [
    { label: "Total Perusahaan", value: companies.length, color: "#1677FF" },
    { label: "Menunggu", value: companies.filter((c) => c.status === "Menunggu").length, color: "#f59e0b" },
    { label: "Diverifikasi", value: companies.filter((c) => c.status === "Diverifikasi").length, color: "#10d98e" },
    { label: "Ditolak", value: companies.filter((c) => c.status === "Ditolak").length, color: "#ff6b6b" },
  ];

  return (
    <DashboardLayout sidebarItems={sidebarItems} userName="Admin Ravira" userRole="Super Admin" userInitial="A">
      <div style={{ marginBottom: 24 }}>
        <h1 style={{ fontFamily: "'Poppins', sans-serif", fontSize: 22, fontWeight: 800, color: "#0A1B3D", marginBottom: 4 }}>Verifikasi Perusahaan</h1>
        <p style={{ fontFamily: "'Inter', sans-serif", fontSize: 14, color: "#6a88b8" }}>Kelola pengajuan verifikasi perusahaan dan lembaga pemerintah</p>
      </div>

      {/* Stats Row */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 14, marginBottom: 24 }}>
        {stats.map((s) => (
          <div key={s.label} style={{ background: "#fff", borderRadius: 14, border: "1px solid rgba(22,119,255,0.1)", padding: "16px 20px", boxShadow: "0 2px 8px rgba(10,27,61,0.04)" }}>
            <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 28, fontWeight: 800, color: s.color }}>{s.value}</div>
            <div style={{ fontFamily: "'Inter', sans-serif", fontSize: 12, color: "#6a88b8", marginTop: 4 }}>{s.label}</div>
          </div>
        ))}
      </div>

      {/* Filter Tabs */}
      <div style={{ display: "flex", gap: 8, marginBottom: 18 }}>
        {tabs.map((t) => (
          <button key={t} onClick={() => setFilter(t)} style={{ fontFamily: "'Inter', sans-serif", fontSize: 13, fontWeight: filter === t ? 600 : 400, color: filter === t ? "#1677FF" : "#6a88b8", background: filter === t ? "rgba(22,119,255,0.08)" : "transparent", border: filter === t ? "1px solid rgba(22,119,255,0.25)" : "1px solid transparent", borderRadius: 8, padding: "6px 16px", cursor: "pointer" }}>
            {t}
          </button>
        ))}
      </div>

      {/* Table */}
      <div style={{ background: "#fff", borderRadius: 18, border: "1px solid rgba(22,119,255,0.1)", overflow: "hidden", boxShadow: "0 2px 10px rgba(10,27,61,0.04)" }}>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ background: "rgba(22,119,255,0.04)", borderBottom: "1px solid rgba(22,119,255,0.1)" }}>
              {["Nama Perusahaan", "Industri", "Tanggal Daftar", "Dokumen", "Status", "Aksi"].map((h) => (
                <th key={h} style={{ fontFamily: "'Inter', sans-serif", fontSize: 12, fontWeight: 600, color: "#6a88b8", textAlign: "left", padding: "12px 16px" }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.map((c, i) => (
              <tr key={c.id} style={{ borderBottom: i < filtered.length - 1 ? "1px solid rgba(22,119,255,0.06)" : "none" }}>
                <td style={{ padding: "14px 16px" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                    <div style={{ width: 34, height: 34, borderRadius: 10, background: "rgba(22,119,255,0.08)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                      <Building2 size={15} color="#1677FF" />
                    </div>
                    <span style={{ fontFamily: "'Inter', sans-serif", fontSize: 13, fontWeight: 600, color: "#0A1B3D" }}>{c.nama}</span>
                  </div>
                </td>
                <td style={{ padding: "14px 16px", fontFamily: "'Inter', sans-serif", fontSize: 13, color: "#6a88b8" }}>{c.industri}</td>
                <td style={{ padding: "14px 16px", fontFamily: "'JetBrains Mono', monospace", fontSize: 12, color: "#6a88b8" }}>{c.tanggal}</td>
                <td style={{ padding: "14px 16px", fontFamily: "'Inter', sans-serif", fontSize: 12, color: "#6a88b8" }}>{c.dokumen}</td>
                <td style={{ padding: "14px 16px" }}>
                  <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10, color: statusColor[c.status], background: statusBg[c.status], borderRadius: 6, padding: "3px 8px", border: `1px solid ${statusColor[c.status]}40` }}>{c.status.toUpperCase()}</span>
                </td>
                <td style={{ padding: "14px 16px" }}>
                  <div style={{ display: "flex", gap: 6 }}>
                    <button onClick={() => toast.success("Data berhasil disetujui")} style={{ fontFamily: "'Inter', sans-serif", fontSize: 11, fontWeight: 600, color: "#10d98e", background: "rgba(16,217,142,0.08)", border: "1px solid rgba(16,217,142,0.25)", borderRadius: 7, padding: "5px 10px", cursor: "pointer", display: "flex", alignItems: "center", gap: 4 }}>
                      <CheckCircle2 size={12} /> Approve
                    </button>
                    <button onClick={() => setRejectTarget(c.nama)} style={{ fontFamily: "'Inter', sans-serif", fontSize: 11, fontWeight: 600, color: "#ff6b6b", background: "rgba(255,107,107,0.08)", border: "1px solid rgba(255,107,107,0.25)", borderRadius: 7, padding: "5px 10px", cursor: "pointer", display: "flex", alignItems: "center", gap: 4 }}>
                      <XCircle size={12} /> Reject
                    </button>
                    <button onClick={() => navigate(`/dashboard/admin/verifikasi-perusahaan/${c.id}`)} style={{ fontFamily: "'Inter', sans-serif", fontSize: 11, fontWeight: 600, color: "#1677FF", background: "rgba(22,119,255,0.08)", border: "1px solid rgba(22,119,255,0.25)", borderRadius: 7, padding: "5px 10px", cursor: "pointer", display: "flex", alignItems: "center", gap: 4 }}>
                      <FileText size={12} /> Review Dokumen
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {rejectTarget && (
        <RejectionReasonModal
          title={rejectTarget}
          onConfirm={() => { toast.error("Perusahaan ditolak"); setRejectTarget(null); }}
          onClose={() => setRejectTarget(null)}
        />
      )}
    </DashboardLayout>
  );
}
