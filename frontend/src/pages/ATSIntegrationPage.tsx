import { useState } from "react";
import { LayoutDashboard, GitBranch, Briefcase, Plus, BookmarkCheck, BarChart2, Plug, Building2, Settings, CheckCircle, Copy } from "lucide-react";
import { DashboardLayout, SidebarItem } from "../components/DashboardLayout";

const sidebarItems: SidebarItem[] = [
  { key: "beranda", label: "Dashboard", icon: <LayoutDashboard size={16} />, path: "/dashboard/perusahaan" },
  { key: "pipeline", label: "Kandidat Pipeline", icon: <GitBranch size={16} />, path: "/dashboard/perusahaan/pipeline" },
  { key: "lowongan", label: "Lowongan Aktif", icon: <Briefcase size={16} />, path: "/dashboard/perusahaan/lowongan" },
  { key: "buat", label: "Buat Lowongan", icon: <Plus size={16} />, path: "/dashboard/perusahaan/buat-lowongan" },
  { key: "shortlist", label: "Shortlist Kandidat", icon: <BookmarkCheck size={16} />, path: "/dashboard/perusahaan/shortlist" },
  { key: "analitik", label: "Analitik Rekrutmen", icon: <BarChart2 size={16} />, path: "/dashboard/perusahaan/analitik" },
  { key: "ats", label: "Integrasi ATS", icon: <Plug size={16} />, path: "/dashboard/perusahaan/integrasi-ats" },
  { key: "profil", label: "Profil Perusahaan", icon: <Building2 size={16} />, path: "/dashboard/perusahaan/profil" },
  { key: "pengaturan", label: "Pengaturan", icon: <Settings size={16} />, path: "/dashboard/perusahaan/pengaturan" },
];

const integrations = [
  { name: "Workday", initials: "WD", color: "#1677FF", connected: true, lastSync: "2 menit lalu" },
  { name: "BambooHR", initials: "BH", color: "#10d98e", connected: false, lastSync: "Belum pernah" },
  { name: "SAP SuccessFactors", initials: "SF", color: "#f59e0b", connected: false, lastSync: "Belum pernah" },
  { name: "Greenhouse", initials: "GH", color: "#8b5cf6", connected: true, lastSync: "1 jam lalu" },
];

const WEBHOOK_URL = "https://api.ravira.id/webhook/ats/tokopedia/abc123xyz";

export default function ATSIntegrationPage() {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(WEBHOOK_URL).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  return (
    <DashboardLayout
      sidebarItems={sidebarItems}
      activeKey="ats"
      userName="Siti Rahayu"
      userRole="HR Manager · Tokopedia"
      userInitial="S"
    >
      <div style={{ padding: "32px", minHeight: "100vh", backgroundColor: "#f0f7ff" }}>
        <div style={{ marginBottom: "28px" }}>
          <h1 style={{ fontFamily: "Poppins, sans-serif", fontSize: "24px", fontWeight: 700, color: "#0A1B3D", margin: 0 }}>
            Integrasi ATS
          </h1>
          <p style={{ fontFamily: "Inter, sans-serif", fontSize: "14px", color: "#6b7280", marginTop: "6px" }}>
            Hubungkan sistem rekrutmen Anda dengan platform ATS pilihan
          </p>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: "20px", marginBottom: "28px" }}>
          {integrations.map((ats) => (
            <div
              key={ats.name}
              style={{
                backgroundColor: "#fff",
                borderRadius: "14px",
                padding: "24px",
                boxShadow: "0 1px 4px rgba(0,0,0,0.08)",
                display: "flex",
                flexDirection: "column",
                gap: "16px",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
                <div
                  style={{
                    width: "48px",
                    height: "48px",
                    borderRadius: "12px",
                    backgroundColor: ats.color,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "#fff",
                    fontFamily: "Poppins, sans-serif",
                    fontSize: "14px",
                    fontWeight: 800,
                    flexShrink: 0,
                  }}
                >
                  {ats.initials}
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontFamily: "Poppins, sans-serif", fontSize: "15px", fontWeight: 700, color: "#0A1B3D" }}>
                    {ats.name}
                  </div>
                  <span
                    style={{
                      fontFamily: "Inter, sans-serif",
                      fontSize: "11px",
                      fontWeight: 600,
                      color: ats.connected ? "#10d98e" : "#9ca3af",
                      backgroundColor: ats.connected ? "#10d98e1a" : "#9ca3af1a",
                      borderRadius: "20px",
                      padding: "2px 10px",
                    }}
                  >
                    {ats.connected ? "Terhubung" : "Tidak Terhubung"}
                  </span>
                </div>
                {ats.connected && <CheckCircle size={20} color="#10d98e" />}
              </div>

              <div style={{ fontFamily: "Inter, sans-serif", fontSize: "12px", color: "#9ca3af" }}>
                Sinkronisasi terakhir: <span style={{ color: "#6b7280", fontWeight: 600 }}>{ats.lastSync}</span>
              </div>

              <button
                onClick={() => alert(ats.connected ? `Menyinkronkan ${ats.name}...` : `Menghubungkan ke ${ats.name}...`)}
                style={{
                  fontFamily: "Inter, sans-serif",
                  fontSize: "13px",
                  fontWeight: 600,
                  color: ats.connected ? "#1677FF" : "#fff",
                  backgroundColor: ats.connected ? "#e8f0fe" : "#1677FF",
                  border: "none",
                  borderRadius: "10px",
                  padding: "10px 0",
                  cursor: "pointer",
                  width: "100%",
                }}
              >
                {ats.connected ? "Sinkronisasi" : "Hubungkan"}
              </button>
            </div>
          ))}
        </div>

        {/* Webhook section */}
        <div style={{ backgroundColor: "#fff", borderRadius: "14px", padding: "28px", boxShadow: "0 1px 4px rgba(0,0,0,0.08)" }}>
          <h3 style={{ fontFamily: "Poppins, sans-serif", fontSize: "16px", fontWeight: 700, color: "#0A1B3D", margin: "0 0 8px" }}>
            Webhook URL
          </h3>
          <p style={{ fontFamily: "Inter, sans-serif", fontSize: "13px", color: "#6b7280", margin: "0 0 16px" }}>
            Gunakan URL ini untuk menerima event dari sistem ATS eksternal
          </p>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "12px",
              backgroundColor: "#071228",
              borderRadius: "10px",
              padding: "14px 18px",
            }}
          >
            <span
              style={{
                flex: 1,
                fontFamily: "JetBrains Mono, monospace",
                fontSize: "13px",
                color: "#4DB8FF",
                overflowX: "auto",
                whiteSpace: "nowrap",
              }}
            >
              {WEBHOOK_URL}
            </span>
            <button
              onClick={handleCopy}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "6px",
                fontFamily: "Inter, sans-serif",
                fontSize: "12px",
                fontWeight: 600,
                color: copied ? "#10d98e" : "#fff",
                backgroundColor: copied ? "#10d98e1a" : "#1677FF",
                border: "none",
                borderRadius: "8px",
                padding: "8px 14px",
                cursor: "pointer",
                flexShrink: 0,
                transition: "all 0.2s",
              }}
            >
              <Copy size={13} />
              {copied ? "Disalin!" : "Salin"}
            </button>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
