import { useState } from "react";
import { LayoutDashboard, Building2, Shield, AlertTriangle, Activity, ClipboardList, Cpu, Users, Settings, Save, Database, Mail, Sliders, Zap, ToggleLeft, ToggleRight } from "lucide-react";
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

const inputStyle = {
  fontFamily: "'Inter', sans-serif",
  fontSize: 13,
  color: "#0A1B3D",
  border: "1px solid rgba(22,119,255,0.2)",
  borderRadius: 8,
  padding: "8px 12px",
  outline: "none",
  width: "100%",
  background: "#fafbff",
};

const labelStyle = {
  fontFamily: "'Inter', sans-serif",
  fontSize: 12,
  fontWeight: 600,
  color: "#6a88b8",
  marginBottom: 6,
  display: "block" as const,
};

const sectionTitleStyle = {
  fontFamily: "'Poppins', sans-serif",
  fontSize: 15,
  fontWeight: 700,
  color: "#0A1B3D",
  marginBottom: 16,
  display: "flex",
  alignItems: "center",
  gap: 8,
};

export default function AdminSettingsPage() {
  const [appName, setAppName] = useState("Ravira Platform");
  const [maintenance, setMaintenance] = useState(false);
  const [maxUpload, setMaxUpload] = useState("10");
  const [smtpHost, setSmtpHost] = useState("smtp.ravira.id");
  const [smtpPort, setSmtpPort] = useState("587");
  const [smtpUser, setSmtpUser] = useState("noreply@ravira.id");
  const [modelVersion, setModelVersion] = useState("v2.4.1");
  const [threshold, setThreshold] = useState(85);
  const [confidence, setConfidence] = useState(72);
  const [rateLimitApi, setRateLimitApi] = useState("200");
  const [systemLogs, setSystemLogs] = useState(true);

  return (
    <DashboardLayout sidebarItems={sidebarItems} userName="Admin Ravira" userRole="Super Admin" userInitial="A">
      <div style={{ marginBottom: 24 }}>
        <h1 style={{ fontFamily: "'Poppins', sans-serif", fontSize: 22, fontWeight: 800, color: "#0A1B3D", marginBottom: 4 }}>Pengaturan Sistem</h1>
        <p style={{ fontFamily: "'Inter', sans-serif", fontSize: 14, color: "#6a88b8" }}>Konfigurasi platform, integrasi, dan performa sistem Ravira</p>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>

        {/* General */}
        <div style={{ background: "#fff", borderRadius: 18, border: "1px solid rgba(22,119,255,0.1)", padding: "22px 24px", boxShadow: "0 2px 8px rgba(10,27,61,0.04)" }}>
          <div style={sectionTitleStyle}><Settings size={16} color="#1677FF" /> General</div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 16 }}>
            <div>
              <label style={labelStyle}>Nama Aplikasi</label>
              <input value={appName} onChange={(e) => setAppName(e.target.value)} style={inputStyle} />
            </div>
            <div>
              <label style={labelStyle}>Max File Upload (MB)</label>
              <input type="number" value={maxUpload} onChange={(e) => setMaxUpload(e.target.value)} style={inputStyle} />
            </div>
            <div>
              <label style={labelStyle}>Maintenance Mode</label>
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginTop: 4 }}>
                <button onClick={() => setMaintenance(!maintenance)} style={{ background: "none", border: "none", cursor: "pointer", padding: 0, display: "flex", alignItems: "center" }}>
                  {maintenance ? <ToggleRight size={32} color="#1677FF" /> : <ToggleLeft size={32} color="#9ab4cc" />}
                </button>
                <span style={{ fontFamily: "'Inter', sans-serif", fontSize: 13, color: maintenance ? "#1677FF" : "#9ab4cc", fontWeight: 600 }}>{maintenance ? "ON" : "OFF"}</span>
              </div>
            </div>
          </div>
        </div>

        {/* SMTP */}
        <div style={{ background: "#fff", borderRadius: 18, border: "1px solid rgba(22,119,255,0.1)", padding: "22px 24px", boxShadow: "0 2px 8px rgba(10,27,61,0.04)" }}>
          <div style={sectionTitleStyle}><Mail size={16} color="#1677FF" /> Email SMTP Config</div>
          <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr 1fr 1fr", gap: 16 }}>
            <div>
              <label style={labelStyle}>SMTP Host</label>
              <input value={smtpHost} onChange={(e) => setSmtpHost(e.target.value)} style={inputStyle} />
            </div>
            <div>
              <label style={labelStyle}>Port</label>
              <input value={smtpPort} onChange={(e) => setSmtpPort(e.target.value)} style={inputStyle} />
            </div>
            <div>
              <label style={labelStyle}>Username</label>
              <input value={smtpUser} onChange={(e) => setSmtpUser(e.target.value)} style={inputStyle} />
            </div>
            <div>
              <label style={labelStyle}>Password</label>
              <input type="password" defaultValue="ravira_smtp_2026" style={inputStyle} />
            </div>
          </div>
        </div>

        {/* AI Config */}
        <div style={{ background: "#fff", borderRadius: 18, border: "1px solid rgba(22,119,255,0.1)", padding: "22px 24px", boxShadow: "0 2px 8px rgba(10,27,61,0.04)" }}>
          <div style={sectionTitleStyle}><Cpu size={16} color="#1677FF" /> AI Config</div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 20 }}>
            <div>
              <label style={labelStyle}>Model Version</label>
              <select value={modelVersion} onChange={(e) => setModelVersion(e.target.value)} style={{ ...inputStyle, cursor: "pointer" }}>
                <option value="v2.5.0-beta">v2.5.0-beta (Staging)</option>
                <option value="v2.4.1">v2.4.1 (Current)</option>
                <option value="v2.3.8">v2.3.8 (Previous)</option>
              </select>
            </div>
            <div>
              <label style={labelStyle}>Matching Threshold: <strong style={{ color: "#1677FF" }}>{threshold}%</strong></label>
              <input type="range" min={50} max={99} value={threshold} onChange={(e) => setThreshold(Number(e.target.value))} style={{ width: "100%", accentColor: "#1677FF", marginTop: 8 }} />
              <div style={{ display: "flex", justifyContent: "space-between", fontFamily: "'JetBrains Mono', monospace", fontSize: 10, color: "#9ab4cc", marginTop: 4 }}>
                <span>50%</span><span>99%</span>
              </div>
            </div>
            <div>
              <label style={labelStyle}>Confidence Score Min: <strong style={{ color: "#8b5cf6" }}>{confidence}%</strong></label>
              <input type="range" min={40} max={95} value={confidence} onChange={(e) => setConfidence(Number(e.target.value))} style={{ width: "100%", accentColor: "#8b5cf6", marginTop: 8 }} />
              <div style={{ display: "flex", justifyContent: "space-between", fontFamily: "'JetBrains Mono', monospace", fontSize: 10, color: "#9ab4cc", marginTop: 4 }}>
                <span>40%</span><span>95%</span>
              </div>
            </div>
          </div>
        </div>

        {/* Rate Limiting */}
        <div style={{ background: "#fff", borderRadius: 18, border: "1px solid rgba(22,119,255,0.1)", padding: "22px 24px", boxShadow: "0 2px 8px rgba(10,27,61,0.04)" }}>
          <div style={sectionTitleStyle}><Zap size={16} color="#1677FF" /> Rate Limiting</div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 16 }}>
            <div>
              <label style={labelStyle}>API Calls per Minute (Global)</label>
              <input type="number" value={rateLimitApi} onChange={(e) => setRateLimitApi(e.target.value)} style={inputStyle} />
            </div>
            <div>
              <label style={labelStyle}>Calls per User per Minute</label>
              <input type="number" defaultValue="30" style={inputStyle} />
            </div>
            <div>
              <label style={labelStyle}>Calls per IP per Hour</label>
              <input type="number" defaultValue="500" style={inputStyle} />
            </div>
          </div>
        </div>

        {/* Backup & Restore */}
        <div style={{ background: "#fff", borderRadius: 18, border: "1px solid rgba(22,119,255,0.1)", padding: "22px 24px", boxShadow: "0 2px 8px rgba(10,27,61,0.04)" }}>
          <div style={sectionTitleStyle}><Database size={16} color="#1677FF" /> Backup & Restore</div>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div>
              <div style={{ fontFamily: "'Inter', sans-serif", fontSize: 13, color: "#0A1B3D", marginBottom: 4 }}>Backup Terakhir</div>
              <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 12, color: "#10d98e" }}>2026-05-30 02:00:00 · 2.4 GB</div>
              <div style={{ fontFamily: "'Inter', sans-serif", fontSize: 12, color: "#9ab4cc", marginTop: 4 }}>Backup otomatis setiap hari pukul 02:00 WIB</div>
            </div>
            <button onClick={() => toast.success("Backup dimulai")} style={{ fontFamily: "'Inter', sans-serif", fontSize: 13, fontWeight: 700, color: "#fff", background: "#10d98e", border: "none", borderRadius: 10, padding: "10px 20px", cursor: "pointer", display: "flex", alignItems: "center", gap: 6 }}>
              <Database size={14} /> Backup Sekarang
            </button>
          </div>
        </div>

        {/* System Logs */}
        <div style={{ background: "#fff", borderRadius: 18, border: "1px solid rgba(22,119,255,0.1)", padding: "22px 24px", boxShadow: "0 2px 8px rgba(10,27,61,0.04)" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <Sliders size={16} color="#1677FF" />
              <div>
                <div style={{ fontFamily: "'Poppins', sans-serif", fontSize: 15, fontWeight: 700, color: "#0A1B3D" }}>System Logs</div>
                <div style={{ fontFamily: "'Inter', sans-serif", fontSize: 12, color: "#6a88b8" }}>Rekam semua aktivitas sistem ke file log</div>
              </div>
            </div>
            <button onClick={() => setSystemLogs(!systemLogs)} style={{ background: "none", border: "none", cursor: "pointer", display: "flex", alignItems: "center", gap: 8 }}>
              {systemLogs ? <ToggleRight size={34} color="#1677FF" /> : <ToggleLeft size={34} color="#9ab4cc" />}
              <span style={{ fontFamily: "'Inter', sans-serif", fontSize: 13, color: systemLogs ? "#1677FF" : "#9ab4cc", fontWeight: 600 }}>{systemLogs ? "Enabled" : "Disabled"}</span>
            </button>
          </div>
        </div>

        {/* Save Button */}
        <div style={{ display: "flex", justifyContent: "flex-end", paddingBottom: 8 }}>
          <button onClick={() => toast.success("Pengaturan berhasil disimpan")} style={{ fontFamily: "'Inter', sans-serif", fontSize: 14, fontWeight: 700, color: "#fff", background: "#1677FF", border: "none", borderRadius: 12, padding: "12px 32px", cursor: "pointer", display: "flex", alignItems: "center", gap: 8, boxShadow: "0 4px 14px rgba(22,119,255,0.35)" }}>
            <Save size={16} /> Simpan Pengaturan
          </button>
        </div>
      </div>
    </DashboardLayout>
  );
}
