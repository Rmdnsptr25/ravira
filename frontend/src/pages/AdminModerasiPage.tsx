import { useState } from "react";
import { LayoutDashboard, Building2, Shield, AlertTriangle, Activity, ClipboardList, Cpu, Users, Settings, CheckCircle2, XCircle, Eye, Flag } from "lucide-react";
import { toast } from "sonner";
import { DashboardLayout, SidebarItem } from "../components/DashboardLayout";
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

const jobPosts = [
  { id: 1, judul: "Senior Software Engineer", perusahaan: "PT Tokopedia", tanggal: "2026-05-30", kategori: "Teknologi", status: "Menunggu", flag: "Gaji tidak wajar" },
  { id: 2, judul: "Digital Marketing Manager", perusahaan: "CV Kreatif Nusantara", tanggal: "2026-05-29", kategori: "Marketing", status: "Menunggu", flag: "Persyaratan mencurigakan" },
  { id: 3, judul: "Warehouse Supervisor", perusahaan: "PT JNE Express", tanggal: "2026-05-28", kategori: "Logistik", status: "Disetujui", flag: "-" },
  { id: 4, judul: "Data Scientist", perusahaan: "PT Gojek Indonesia", tanggal: "2026-05-27", kategori: "Teknologi", status: "Menunggu", flag: "Konten tidak jelas" },
  { id: 5, judul: "Finance Manager", perusahaan: "PT Bank BRI Tbk", tanggal: "2026-05-26", kategori: "Keuangan", status: "Ditolak", flag: "Duplikat postingan" },
  { id: 6, judul: "UI/UX Designer", perusahaan: "PT Bukalapak", tanggal: "2026-05-25", kategori: "Desain", status: "Disetujui", flag: "-" },
  { id: 7, judul: "HR Business Partner", perusahaan: "PT Astra International", tanggal: "2026-05-24", kategori: "HR", status: "Menunggu", flag: "Alamat tidak valid" },
  { id: 8, judul: "Sales Executive", perusahaan: "CV Maju Jaya", tanggal: "2026-05-23", kategori: "Penjualan", status: "Menunggu", flag: "Konten berpotensi penipuan" },
];

const statusColor: Record<string, string> = {
  Menunggu: "#f59e0b",
  Disetujui: "#10d98e",
  Ditolak: "#ff6b6b",
};
const statusBg: Record<string, string> = {
  Menunggu: "rgba(245,158,11,0.1)",
  Disetujui: "rgba(16,217,142,0.1)",
  Ditolak: "rgba(255,107,107,0.1)",
};

export default function AdminModerasiPage() {
  const [filter, setFilter] = useState("Semua");
  const [dateFilter, setDateFilter] = useState("");
  const [rejectTarget, setRejectTarget] = useState<string | null>(null);

  const tabs = ["Semua", "Menunggu", "Disetujui", "Ditolak"];
  const filtered = filter === "Semua" ? jobPosts : jobPosts.filter((j) => j.status === filter);

  return (
    <DashboardLayout sidebarItems={sidebarItems} userName="Admin Ravira" userRole="Super Admin" userInitial="A">
      <div style={{ marginBottom: 24 }}>
        <h1 style={{ fontFamily: "'Poppins', sans-serif", fontSize: 22, fontWeight: 800, color: "#0A1B3D", marginBottom: 4 }}>Moderasi Lowongan</h1>
        <p style={{ fontFamily: "'Inter', sans-serif", fontSize: 14, color: "#6a88b8" }}>Tinjau dan moderasi postingan lowongan kerja</p>
      </div>

      {/* Filters */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 18 }}>
        <div style={{ display: "flex", gap: 8 }}>
          {tabs.map((t) => (
            <button key={t} onClick={() => setFilter(t)} style={{ fontFamily: "'Inter', sans-serif", fontSize: 13, fontWeight: filter === t ? 600 : 400, color: filter === t ? "#1677FF" : "#6a88b8", background: filter === t ? "rgba(22,119,255,0.08)" : "transparent", border: filter === t ? "1px solid rgba(22,119,255,0.25)" : "1px solid transparent", borderRadius: 8, padding: "6px 16px", cursor: "pointer" }}>
              {t}
            </button>
          ))}
        </div>
        <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
          <input type="date" value={dateFilter} onChange={(e) => setDateFilter(e.target.value)} style={{ fontFamily: "'Inter', sans-serif", fontSize: 12, color: "#0A1B3D", border: "1px solid rgba(22,119,255,0.2)", borderRadius: 8, padding: "6px 10px", outline: "none" }} />
        </div>
      </div>

      {/* Table */}
      <div style={{ background: "#fff", borderRadius: 18, border: "1px solid rgba(22,119,255,0.1)", overflow: "hidden", boxShadow: "0 2px 10px rgba(10,27,61,0.04)" }}>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ background: "rgba(22,119,255,0.04)", borderBottom: "1px solid rgba(22,119,255,0.1)" }}>
              {["Judul Posisi", "Perusahaan", "Tanggal Post", "Kategori", "Flag Reason", "Status", "Aksi"].map((h) => (
                <th key={h} style={{ fontFamily: "'Inter', sans-serif", fontSize: 12, fontWeight: 600, color: "#6a88b8", textAlign: "left", padding: "12px 16px" }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.map((j, i) => (
              <tr key={j.id} style={{ borderBottom: i < filtered.length - 1 ? "1px solid rgba(22,119,255,0.06)" : "none" }}>
                <td style={{ padding: "14px 16px", fontFamily: "'Inter', sans-serif", fontSize: 13, fontWeight: 600, color: "#0A1B3D" }}>{j.judul}</td>
                <td style={{ padding: "14px 16px", fontFamily: "'Inter', sans-serif", fontSize: 13, color: "#6a88b8" }}>{j.perusahaan}</td>
                <td style={{ padding: "14px 16px", fontFamily: "'JetBrains Mono', monospace", fontSize: 12, color: "#6a88b8" }}>{j.tanggal}</td>
                <td style={{ padding: "14px 16px" }}>
                  <span style={{ fontFamily: "'Inter', sans-serif", fontSize: 11, color: "#8b5cf6", background: "rgba(139,92,246,0.08)", borderRadius: 6, padding: "3px 8px", border: "1px solid rgba(139,92,246,0.2)" }}>{j.kategori}</span>
                </td>
                <td style={{ padding: "14px 16px" }}>
                  {j.flag !== "-" ? (
                    <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
                      <Flag size={12} color="#ff6b6b" />
                      <span style={{ fontFamily: "'Inter', sans-serif", fontSize: 11, color: "#ff6b6b" }}>{j.flag}</span>
                    </div>
                  ) : (
                    <span style={{ fontFamily: "'Inter', sans-serif", fontSize: 11, color: "#9ab4cc" }}>—</span>
                  )}
                </td>
                <td style={{ padding: "14px 16px" }}>
                  <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10, color: statusColor[j.status], background: statusBg[j.status], borderRadius: 6, padding: "3px 8px", border: `1px solid ${statusColor[j.status]}40` }}>{j.status.toUpperCase()}</span>
                </td>
                <td style={{ padding: "14px 16px" }}>
                  <div style={{ display: "flex", gap: 5 }}>
                    <button onClick={() => toast.success("Lowongan disetujui")} style={{ fontFamily: "'Inter', sans-serif", fontSize: 11, color: "#10d98e", background: "rgba(16,217,142,0.08)", border: "1px solid rgba(16,217,142,0.25)", borderRadius: 7, padding: "5px 8px", cursor: "pointer", display: "flex", alignItems: "center", gap: 3 }}>
                      <CheckCircle2 size={12} /> Approve
                    </button>
                    <button onClick={() => setRejectTarget(j.judul)} style={{ fontFamily: "'Inter', sans-serif", fontSize: 11, color: "#ff6b6b", background: "rgba(255,107,107,0.08)", border: "1px solid rgba(255,107,107,0.25)", borderRadius: 7, padding: "5px 8px", cursor: "pointer", display: "flex", alignItems: "center", gap: 3 }}>
                      <XCircle size={12} /> Reject
                    </button>
                    <button style={{ fontFamily: "'Inter', sans-serif", fontSize: 11, color: "#1677FF", background: "rgba(22,119,255,0.08)", border: "1px solid rgba(22,119,255,0.25)", borderRadius: 7, padding: "5px 8px", cursor: "pointer", display: "flex", alignItems: "center", gap: 3 }}>
                      <Eye size={12} /> Lihat Detail
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
          onConfirm={() => { toast.error("Lowongan ditolak"); setRejectTarget(null); }}
          onClose={() => setRejectTarget(null)}
        />
      )}
    </DashboardLayout>
  );
}
