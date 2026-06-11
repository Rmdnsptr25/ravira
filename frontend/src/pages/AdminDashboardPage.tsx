import { useState } from "react";
import { useNavigate } from "react-router";
import { Users, Building2, Landmark, AlertTriangle, CheckCircle2, Clock, TrendingUp, Shield, Search, MoreHorizontal, Eye, LayoutDashboard, ClipboardList, Cpu, Settings, Activity } from "lucide-react";
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
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
  { label: "Total User", value: "48,924", change: "+1.2k bulan ini", color: "#1677FF", icon: Users, path: "/dashboard/admin/user-management" },
  { label: "Perusahaan Aktif", value: "1,284", change: "+87 baru", color: "#0D47A1", icon: Building2, path: "/dashboard/admin/verifikasi-perusahaan" },
  { label: "Lembaga Pemerintah", value: "63", change: "5 pending verif.", color: "#4DB8FF", icon: Landmark, path: "/dashboard/admin/verifikasi-perusahaan" },
  { label: "Pending Verifikasi", value: "23", change: "Butuh tindakan", color: "#f59e0b", icon: Clock, path: "/dashboard/admin/verifikasi-perusahaan" },
];

const growthData = [
  { bulan: "Jan", kandidat: 32000, perusahaan: 850 },
  { bulan: "Feb", kandidat: 35000, perusahaan: 940 },
  { bulan: "Mar", kandidat: 38500, perusahaan: 1020 },
  { bulan: "Apr", kandidat: 42000, perusahaan: 1120 },
  { bulan: "Mei", kandidat: 48924, perusahaan: 1284 },
];

const matchData = [
  { bulan: "Jan", avgMatch: 78, lamaran: 8200 },
  { bulan: "Feb", avgMatch: 80, lamaran: 9100 },
  { bulan: "Mar", avgMatch: 82, lamaran: 10400 },
  { bulan: "Apr", avgMatch: 84, lamaran: 12800 },
  { bulan: "Mei", avgMatch: 87, lamaran: 15600 },
];

const pendingVerifications = [
  { name: "Disnaker Kalimantan Timur", type: "Pemerintah", submitted: "2 jam lalu", status: "pending" },
  { name: "PT Sinar Mas Digital", type: "Perusahaan", submitted: "5 jam lalu", status: "pending" },
  { name: "BPJS Ketenagakerjaan Sulsel", type: "Pemerintah", submitted: "1 hari lalu", status: "pending" },
  { name: "PT Tokopedia Logistics", type: "Perusahaan", submitted: "1 hari lalu", status: "review" },
  { name: "Kemenaker RI", type: "Pemerintah", submitted: "2 hari lalu", status: "review" },
];

const recentActivity = [
  { action: "User baru mendaftar", detail: "423 kandidat bergabung hari ini", time: "Baru saja", type: "user" },
  { action: "Laporan konten", detail: "Lowongan mencurigakan di-flag oleh 3 user", time: "15 menit lalu", type: "warning" },
  { action: "Verifikasi selesai", detail: "PT Gojek Indonesia berhasil diverifikasi", time: "1 jam lalu", type: "success" },
  { action: "AI Model Update", detail: "Model rekomendasi v2.4.1 berhasil dideploy", time: "3 jam lalu", type: "system" },
  { action: "Sinkronisasi Data", detail: "Data BPS direferensikan ke sistem analytics", time: "6 jam lalu", type: "system" },
];

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div style={{ background: "#071228", border: "1px solid rgba(22,119,255,0.2)", borderRadius: 10, padding: "10px 14px" }}>
        <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11, color: "#4DB8FF", marginBottom: 6 }}>{label}</div>
        {payload.map((p: any) => (
          <div key={p.name} style={{ fontFamily: "'Inter', sans-serif", fontSize: 12, color: p.color, marginBottom: 2 }}>
            {p.name}: <strong>{p.value.toLocaleString()}</strong>
          </div>
        ))}
      </div>
    );
  }
  return null;
};

export default function AdminDashboardPage() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <DashboardLayout sidebarItems={sidebarItems} userName="Admin Ravira" userRole="Super Admin" userInitial="A">
      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 4 }}>
            <h1 style={{ fontFamily: "'Poppins', sans-serif", fontSize: 22, fontWeight: 800, color: "#0A1B3D" }}>Admin Dashboard</h1>
            <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10, color: "#ff6b6b", background: "rgba(255,107,107,0.1)", border: "1px solid rgba(255,107,107,0.2)", borderRadius: 6, padding: "2px 8px" }}>SUPER ADMIN</span>
          </div>
          <p style={{ fontFamily: "'Inter', sans-serif", fontSize: 14, color: "#6a88b8" }}>Platform overview · Ravira v2.4.1 · Mei 2026</p>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 8, background: "#fff", borderRadius: 10, border: "1px solid rgba(22,119,255,0.15)", padding: "8px 14px" }}>
          <Search size={14} color="#6a88b8" />
          <input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Cari user, perusahaan..."
            style={{ border: "none", outline: "none", fontFamily: "'Inter', sans-serif", fontSize: 13, color: "#0A1B3D", background: "transparent", width: 200 }}
          />
        </div>
      </div>

      {/* KPIs */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 14, marginBottom: 22 }}>
        {kpis.map((k) => (
          <div key={k.label} onClick={() => navigate(k.path)} style={{ background: "#fff", borderRadius: 16, border: "1px solid rgba(22,119,255,0.1)", padding: "18px 20px", boxShadow: "0 2px 10px rgba(10,27,61,0.04)", cursor: "pointer", transition: "transform 0.15s" }}
            onMouseEnter={(e) => (e.currentTarget.style.transform = "translateY(-2px)")}
            onMouseLeave={(e) => (e.currentTarget.style.transform = "translateY(0)")}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 12 }}>
              <div style={{ width: 36, height: 36, borderRadius: 10, background: `${k.color}14`, display: "flex", alignItems: "center", justifyContent: "center" }}>
                <k.icon size={18} color={k.color} />
              </div>
            </div>
            <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 24, fontWeight: 800, color: "#0A1B3D", lineHeight: 1 }}>{k.value}</div>
            <div style={{ fontFamily: "'Inter', sans-serif", fontSize: 12, color: "#6a88b8", marginTop: 4 }}>{k.label}</div>
            <div style={{ fontFamily: "'Inter', sans-serif", fontSize: 11, color: k.color, marginTop: 4, fontWeight: 500 }}>{k.change}</div>
          </div>
        ))}
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 18, marginBottom: 18 }}>
        {/* Growth chart */}
        <div style={{ background: "#fff", borderRadius: 18, border: "1px solid rgba(22,119,255,0.1)", padding: "22px" }}>
          <div style={{ fontFamily: "'Poppins', sans-serif", fontSize: 14, fontWeight: 700, color: "#0A1B3D", marginBottom: 16 }}>Pertumbuhan User Platform</div>
          <ResponsiveContainer width="100%" height={180}>
            <BarChart data={growthData} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(22,119,255,0.08)" vertical={false} />
              <XAxis dataKey="bulan" tick={{ fontFamily: "'Inter', sans-serif", fontSize: 11, fill: "#9ab4cc" }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10, fill: "#9ab4cc" }} axisLine={false} tickLine={false} />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="kandidat" name="Kandidat" fill="#1677FF" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Match quality */}
        <div style={{ background: "#fff", borderRadius: 18, border: "1px solid rgba(22,119,255,0.1)", padding: "22px" }}>
          <div style={{ fontFamily: "'Poppins', sans-serif", fontSize: 14, fontWeight: 700, color: "#0A1B3D", marginBottom: 16 }}>Kualitas Matching AI</div>
          <ResponsiveContainer width="100%" height={180}>
            <LineChart data={matchData} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(22,119,255,0.08)" />
              <XAxis dataKey="bulan" tick={{ fontFamily: "'Inter', sans-serif", fontSize: 11, fill: "#9ab4cc" }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10, fill: "#9ab4cc" }} axisLine={false} tickLine={false} />
              <Tooltip content={<CustomTooltip />} />
              <Line type="monotone" dataKey="avgMatch" name="Avg Match %" stroke="#10d98e" strokeWidth={2.5} dot={{ fill: "#10d98e", r: 4 }} />
              <Line type="monotone" dataKey="lamaran" name="Total Lamaran" stroke="#1677FF" strokeWidth={2} dot={false} strokeDasharray="4 2" />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 320px", gap: 18 }}>
        {/* Pending verifications */}
        <div style={{ background: "#fff", borderRadius: 18, border: "1px solid rgba(22,119,255,0.1)", padding: "22px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
            <div>
              <div style={{ fontFamily: "'Poppins', sans-serif", fontSize: 14, fontWeight: 700, color: "#0A1B3D" }}>Antrian Verifikasi</div>
              <div style={{ fontFamily: "'Inter', sans-serif", fontSize: 12, color: "#6a88b8" }}>{pendingVerifications.length} menunggu tindakan</div>
            </div>
            <button onClick={() => navigate("/dashboard/admin/verifikasi-perusahaan")} style={{ fontFamily: "'Inter', sans-serif", fontSize: 12, color: "#1677FF", background: "none", border: "none", cursor: "pointer", padding: 0 }}>
              Lihat Semua →
            </button>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>
            {pendingVerifications.map((v, i) => (
              <div key={v.name} style={{ display: "flex", alignItems: "center", gap: 14, padding: "12px 0", borderBottom: i < pendingVerifications.length - 1 ? "1px solid rgba(22,119,255,0.07)" : "none" }}>
                <div style={{ width: 38, height: 38, borderRadius: 12, background: v.type === "Pemerintah" ? "rgba(77,184,255,0.1)" : "rgba(22,119,255,0.1)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                  {v.type === "Pemerintah" ? <Landmark size={16} color="#4DB8FF" /> : <Building2 size={16} color="#1677FF" />}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontFamily: "'Inter', sans-serif", fontSize: 13, fontWeight: 600, color: "#0A1B3D", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{v.name}</div>
                  <div style={{ fontFamily: "'Inter', sans-serif", fontSize: 11, color: "#6a88b8" }}>{v.type} · {v.submitted}</div>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <span style={{
                    fontFamily: "'JetBrains Mono', monospace", fontSize: 9,
                    color: v.status === "pending" ? "#f59e0b" : "#1677FF",
                    background: v.status === "pending" ? "rgba(245,158,11,0.1)" : "rgba(22,119,255,0.08)",
                    border: `1px solid ${v.status === "pending" ? "rgba(245,158,11,0.25)" : "rgba(22,119,255,0.2)"}`,
                    borderRadius: 6, padding: "2px 7px", textTransform: "uppercase",
                  }}>{v.status === "pending" ? "BARU" : "REVIEW"}</span>
                  <button onClick={() => navigate("/dashboard/admin/verifikasi-perusahaan")} style={{ padding: "6px", borderRadius: 8, border: "1px solid rgba(22,119,255,0.2)", background: "#f0f7ff", cursor: "pointer", display: "flex", alignItems: "center" }}>
                    <Eye size={13} color="#1677FF" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Activity log */}
        <div style={{ background: "#fff", borderRadius: 18, border: "1px solid rgba(22,119,255,0.1)", padding: "22px" }}>
          <div style={{ fontFamily: "'Poppins', sans-serif", fontSize: 14, fontWeight: 700, color: "#0A1B3D", marginBottom: 16 }}>Log Aktivitas</div>
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {recentActivity.map((a) => {
              const colors: Record<string, string> = { user: "#1677FF", warning: "#f59e0b", success: "#10d98e", system: "#8b5cf6" };
              const icons: Record<string, React.ReactNode> = {
                user: <Users size={13} />,
                warning: <AlertTriangle size={13} />,
                success: <CheckCircle2 size={13} />,
                system: <Shield size={13} />,
              };
              return (
                <div key={a.action + a.time} style={{ display: "flex", gap: 10 }}>
                  <div style={{ width: 28, height: 28, borderRadius: 8, background: `${colors[a.type]}14`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, color: colors[a.type] }}>
                    {icons[a.type]}
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontFamily: "'Inter', sans-serif", fontSize: 12, fontWeight: 600, color: "#0A1B3D", marginBottom: 2 }}>{a.action}</div>
                    <div style={{ fontFamily: "'Inter', sans-serif", fontSize: 11, color: "#6a88b8", lineHeight: 1.4 }}>{a.detail}</div>
                    <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10, color: "#9ab4cc", marginTop: 3 }}>{a.time}</div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
