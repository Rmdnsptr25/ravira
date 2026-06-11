import { useState } from "react";
import { useNavigate } from "react-router";
import { LayoutDashboard, Users, TrendingUp, MapPin, BarChart2, BookOpen, FileText, Settings, Copy, Check, X } from "lucide-react";
import { DashboardLayout, SidebarItem } from "../components/DashboardLayout";

const sidebarItems: SidebarItem[] = [
  { key: "ringkasan", label: "Ringkasan", icon: <LayoutDashboard size={16} />, path: "/dashboard/analytics" },
  { key: "workforce", label: "Analitik Workforce", icon: <Users size={16} />, path: "/dashboard/analytics/workforce" },
  { key: "tren", label: "Tren Skill", icon: <TrendingUp size={16} />, path: "/dashboard/analytics/tren-skill" },
  { key: "heatmap", label: "Heatmap Regional", icon: <MapPin size={16} />, path: "/dashboard/analytics/heatmap" },
  { key: "proyeksi", label: "Proyeksi Kompetensi", icon: <BarChart2 size={16} />, path: "/dashboard/analytics/proyeksi" },
  { key: "program", label: "Rekomendasi Program Pelatihan", icon: <BookOpen size={16} />, path: "/dashboard/analytics/rekomendasi-program" },
  { key: "laporan", label: "Laporan & Ekspor", icon: <FileText size={16} />, path: "/dashboard/analytics/laporan" },
  { key: "pengaturan", label: "Pengaturan", icon: <Settings size={16} />, path: "/dashboard/analytics/pengaturan" },
];

const apiToken = "rvr_live_a8f4d2b1c9e3f7a0d5b8c2e6f1a4d7b0c3e8f2";

const institutions = [
  { name: "BPS Provinsi DKI Jakarta", access: "Baca Data", since: "Mar 2026" },
  { name: "Kemnaker RI — Pusdatinaker", access: "Baca & Ekspor", since: "Jan 2026" },
  { name: "Universitas Indonesia — FMIPA", access: "Baca Data", since: "Mei 2026" },
];

function Toggle({ value, onChange }: { value: boolean; onChange: (v: boolean) => void }) {
  return (
    <div
      onClick={() => onChange(!value)}
      style={{
        width: 44,
        height: 24,
        borderRadius: 12,
        background: value ? "#1677FF" : "rgba(22,119,255,0.15)",
        cursor: "pointer",
        position: "relative",
        transition: "background 0.2s",
        flexShrink: 0,
      }}
    >
      <div style={{
        width: 18,
        height: 18,
        borderRadius: "50%",
        background: "#fff",
        position: "absolute",
        top: 3,
        left: value ? 23 : 3,
        transition: "left 0.2s",
        boxShadow: "0 1px 4px rgba(0,0,0,0.15)",
      }} />
    </div>
  );
}

export default function AnalyticsSettingsPage() {
  const navigate = useNavigate();
  const [copied, setCopied] = useState(false);
  const [notifEmail, setNotifEmail] = useState(true);
  const [notifSystem, setNotifSystem] = useState(true);
  const [notifWeekly, setNotifWeekly] = useState(false);
  const [notifAlert, setNotifAlert] = useState(true);
  const [refreshFreq, setRefreshFreq] = useState("daily");
  const [defaultRegion, setDefaultRegion] = useState("DKI Jakarta");
  const [retention, setRetention] = useState("12");

  const handleCopy = () => {
    navigator.clipboard.writeText(apiToken);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <DashboardLayout sidebarItems={sidebarItems} userName="Dr. Bambang Prasetyo" userRole="Disnaker DKI Jakarta" userInitial="B">
      {/* Info Banner */}
      <div style={{ background: "rgba(22,119,255,0.06)", border: "1px solid rgba(22,119,255,0.2)", borderRadius: 10, padding: "10px 16px", marginBottom: 20, display: "flex", alignItems: "center", gap: 10 }}>
        <span style={{ color: "#1677FF", fontSize: 14 }}>ℹ</span>
        <span style={{ fontFamily: "'Inter', sans-serif", fontSize: 13, color: "#1677FF" }}>Data yang ditampilkan bersifat agregat dan anonim.</span>
      </div>

      {/* Header */}
      <div style={{ marginBottom: 24 }}>
        <h1 style={{ fontFamily: "'Poppins', sans-serif", fontSize: 22, fontWeight: 800, color: "#0A1B3D", marginBottom: 4 }}>Pengaturan</h1>
        <p style={{ fontFamily: "'Inter', sans-serif", fontSize: 14, color: "#6a88b8" }}>Konfigurasi preferensi dashboard dan akses data analitik</p>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
        {/* Data Settings */}
        <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
          <div style={{ background: "#fff", borderRadius: 18, border: "1px solid rgba(22,119,255,0.1)", padding: "22px", boxShadow: "0 2px 10px rgba(10,27,61,0.04)" }}>
            <div style={{ fontFamily: "'Poppins', sans-serif", fontSize: 15, fontWeight: 700, color: "#0A1B3D", marginBottom: 18 }}>Konfigurasi Data</div>
            <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
              <div>
                <label style={{ display: "block", fontFamily: "'Inter', sans-serif", fontSize: 12, fontWeight: 600, color: "#6a88b8", marginBottom: 8 }}>Frekuensi Pembaruan Data</label>
                <select
                  value={refreshFreq}
                  onChange={(e) => setRefreshFreq(e.target.value)}
                  style={{ width: "100%", fontFamily: "'Inter', sans-serif", fontSize: 13, color: "#0A1B3D", padding: "10px 14px", borderRadius: 10, border: "1px solid rgba(22,119,255,0.2)", background: "#fff", cursor: "pointer" }}
                >
                  <option value="realtime">Real-time (setiap 5 menit)</option>
                  <option value="hourly">Per Jam</option>
                  <option value="daily">Harian</option>
                  <option value="weekly">Mingguan</option>
                </select>
              </div>
              <div>
                <label style={{ display: "block", fontFamily: "'Inter', sans-serif", fontSize: 12, fontWeight: 600, color: "#6a88b8", marginBottom: 8 }}>Filter Wilayah Default</label>
                <select
                  value={defaultRegion}
                  onChange={(e) => setDefaultRegion(e.target.value)}
                  style={{ width: "100%", fontFamily: "'Inter', sans-serif", fontSize: 13, color: "#0A1B3D", padding: "10px 14px", borderRadius: 10, border: "1px solid rgba(22,119,255,0.2)", background: "#fff", cursor: "pointer" }}
                >
                  {["Semua Wilayah", "DKI Jakarta", "Jawa Barat", "Jawa Timur", "Jawa Tengah", "Sumatera Utara"].map((r) => (
                    <option key={r} value={r}>{r}</option>
                  ))}
                </select>
              </div>
              <div>
                <label style={{ display: "block", fontFamily: "'Inter', sans-serif", fontSize: 12, fontWeight: 600, color: "#6a88b8", marginBottom: 8 }}>Periode Retensi Data (bulan)</label>
                <select
                  value={retention}
                  onChange={(e) => setRetention(e.target.value)}
                  style={{ width: "100%", fontFamily: "'Inter', sans-serif", fontSize: 13, color: "#0A1B3D", padding: "10px 14px", borderRadius: 10, border: "1px solid rgba(22,119,255,0.2)", background: "#fff", cursor: "pointer" }}
                >
                  {["3", "6", "12", "24", "36"].map((m) => (
                    <option key={m} value={m}>{m} bulan</option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Notifications */}
          <div style={{ background: "#fff", borderRadius: 18, border: "1px solid rgba(22,119,255,0.1)", padding: "22px", boxShadow: "0 2px 10px rgba(10,27,61,0.04)" }}>
            <div style={{ fontFamily: "'Poppins', sans-serif", fontSize: 15, fontWeight: 700, color: "#0A1B3D", marginBottom: 18 }}>Preferensi Notifikasi</div>
            <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              {[
                { label: "Notifikasi via Email", sub: "Laporan & pembaruan data", value: notifEmail, set: setNotifEmail },
                { label: "Notifikasi Sistem", sub: "Alert dalam aplikasi", value: notifSystem, set: setNotifSystem },
                { label: "Ringkasan Mingguan", sub: "Digest otomatis setiap Senin", value: notifWeekly, set: setNotifWeekly },
                { label: "Alert Anomali Data", sub: "Peringatan jika ada lonjakan data", value: notifAlert, set: setNotifAlert },
              ].map((n) => (
                <div key={n.label} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "12px 0", borderBottom: "1px solid rgba(22,119,255,0.06)" }}>
                  <div>
                    <div style={{ fontFamily: "'Inter', sans-serif", fontSize: 13, fontWeight: 600, color: "#0A1B3D", marginBottom: 2 }}>{n.label}</div>
                    <div style={{ fontFamily: "'Inter', sans-serif", fontSize: 12, color: "#9ab4cc" }}>{n.sub}</div>
                  </div>
                  <Toggle value={n.value} onChange={n.set} />
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* API + Institutions */}
        <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
          {/* API Token */}
          <div style={{ background: "#fff", borderRadius: 18, border: "1px solid rgba(22,119,255,0.1)", padding: "22px", boxShadow: "0 2px 10px rgba(10,27,61,0.04)" }}>
            <div style={{ fontFamily: "'Poppins', sans-serif", fontSize: 15, fontWeight: 700, color: "#0A1B3D", marginBottom: 4 }}>Akses API</div>
            <div style={{ fontFamily: "'Inter', sans-serif", fontSize: 12, color: "#6a88b8", marginBottom: 18 }}>Gunakan token ini untuk mengakses Ravira Analytics API</div>
            <div style={{ background: "rgba(10,27,61,0.03)", borderRadius: 12, border: "1px solid rgba(22,119,255,0.1)", padding: "14px 16px", marginBottom: 14 }}>
              <div style={{ fontFamily: "'Inter', sans-serif", fontSize: 11, fontWeight: 600, color: "#9ab4cc", marginBottom: 8, textTransform: "uppercase", letterSpacing: "0.05em" }}>API Token</div>
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 12, color: "#0A1B3D", flex: 1, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{apiToken}</div>
                <button
                  onClick={handleCopy}
                  style={{ display: "flex", alignItems: "center", gap: 6, padding: "6px 12px", borderRadius: 8, border: "1px solid rgba(22,119,255,0.2)", background: copied ? "rgba(16,217,142,0.08)" : "rgba(22,119,255,0.06)", fontFamily: "'Inter', sans-serif", fontSize: 12, fontWeight: 600, color: copied ? "#10d98e" : "#1677FF", cursor: "pointer", flexShrink: 0 }}
                >
                  {copied ? <><Check size={12} /> Disalin</> : <><Copy size={12} /> Salin</>}
                </button>
              </div>
            </div>
            <div style={{ fontFamily: "'Inter', sans-serif", fontSize: 12, color: "#9ab4cc" }}>Token berlaku hingga: <strong style={{ color: "#f59e0b" }}>31 Des 2026</strong></div>
          </div>

          {/* Connected Institutions */}
          <div style={{ background: "#fff", borderRadius: 18, border: "1px solid rgba(22,119,255,0.1)", padding: "22px", boxShadow: "0 2px 10px rgba(10,27,61,0.04)" }}>
            <div style={{ fontFamily: "'Poppins', sans-serif", fontSize: 15, fontWeight: 700, color: "#0A1B3D", marginBottom: 4 }}>Institusi Terhubung</div>
            <div style={{ fontFamily: "'Inter', sans-serif", fontSize: 12, color: "#6a88b8", marginBottom: 18 }}>Institusi yang memiliki akses ke data analitik Anda</div>
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {institutions.map((inst) => (
                <div key={inst.name} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "14px 16px", borderRadius: 12, background: "rgba(22,119,255,0.02)", border: "1px solid rgba(22,119,255,0.08)" }}>
                  <div>
                    <div style={{ fontFamily: "'Inter', sans-serif", fontSize: 13, fontWeight: 600, color: "#0A1B3D", marginBottom: 3 }}>{inst.name}</div>
                    <div style={{ display: "flex", gap: 8 }}>
                      <span style={{ fontFamily: "'Inter', sans-serif", fontSize: 11, color: "#1677FF", background: "rgba(22,119,255,0.08)", padding: "1px 8px", borderRadius: 5 }}>{inst.access}</span>
                      <span style={{ fontFamily: "'Inter', sans-serif", fontSize: 11, color: "#9ab4cc" }}>Sejak {inst.since}</span>
                    </div>
                  </div>
                  <button style={{ display: "flex", alignItems: "center", gap: 5, padding: "6px 12px", borderRadius: 8, border: "1px solid rgba(255,107,107,0.2)", background: "rgba(255,107,107,0.06)", fontFamily: "'Inter', sans-serif", fontSize: 12, fontWeight: 600, color: "#ff6b6b", cursor: "pointer" }}>
                    <X size={12} /> Cabut Akses
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Save Button */}
          <button style={{ width: "100%", padding: "14px", borderRadius: 14, border: "none", background: "linear-gradient(135deg, #1677FF, #0D47A1)", fontFamily: "'Poppins', sans-serif", fontSize: 14, fontWeight: 700, color: "#fff", cursor: "pointer", boxShadow: "0 4px 16px rgba(22,119,255,0.3)" }}>
            Simpan Pengaturan
          </button>
        </div>
      </div>
    </DashboardLayout>
  );
}
