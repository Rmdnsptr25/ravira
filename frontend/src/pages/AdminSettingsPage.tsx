import { useState } from "react";
import { Cpu, Database, Mail, Save, Settings, Sliders, Zap } from "lucide-react";
import { toast } from "sonner";
import { DashboardLayout } from "../components/DashboardLayout";
import { adminSidebarItems } from "../constants/adminSidebar";

export default function AdminSettingsPage() {
  const [appName, setAppName] = useState("Ravira Platform");
  const [maintenance, setMaintenance] = useState(false);
  const [maxUpload, setMaxUpload] = useState("5");
  const [smtpHost, setSmtpHost] = useState("smtp.ravira.id");
  const [smtpPort, setSmtpPort] = useState("587");
  const [smtpUser, setSmtpUser] = useState("noreply@ravira.id");
  const [smtpPassword, setSmtpPassword] = useState("");
  const [modelVersion, setModelVersion] = useState("gemini-3.8-flash");
  const [threshold, setThreshold] = useState(85);
  const [confidence, setConfidence] = useState(72);
  const [rateLimitApi, setRateLimitApi] = useState("200");
  const [rateLimitUser, setRateLimitUser] = useState("30");
  const [rateLimitIp, setRateLimitIp] = useState("500");
  const [systemLogs, setSystemLogs] = useState(true);
  const [lastBackup, setLastBackup] = useState("2026-05-30 02:00:00 · 2.4 GB");

  const handleSave = () => {
    toast.success("Pengaturan admin berhasil disimpan.");
  };

  const handleBackupNow = () => {
    setLastBackup("Baru saja · 2.4 GB");
    toast.success("Cadangan database dijadwalkan.");
  };

  return (
    <DashboardLayout sidebarItems={adminSidebarItems}>
      <section className="admin-page" aria-labelledby="admin-settings-title">
        <header className="admin-page-header">
          <div>
            <p className="admin-page-context">Sistem</p>
            <h1 id="admin-settings-title">Pengaturan admin</h1>
            <p>
              Atur parameter platform, konfigurasi email SMTP, ambang batas pencocokan AI, dan batasan akses API.
            </p>
          </div>
          <button
            type="button"
            className="admin-button admin-button-primary"
            onClick={handleSave}
          >
            <Save size={16} aria-hidden="true" />
            Simpan pengaturan
          </button>
        </header>

        <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
          <div className="admin-work-panel">
            <div className="admin-work-panel-header">
              <div>
                <h2>Pengaturan umum</h2>
                <p>Identitas aplikasi, batas unggah dokumen CV, dan mode pemeliharaan.</p>
              </div>
              <Settings size={18} color="#0e67cc" aria-hidden="true" />
            </div>
            <div className="admin-panel-body">
              <div className="admin-form-grid">
                <div className="admin-field">
                  <label htmlFor="setting-app-name">Nama aplikasi</label>
                  <input
                    id="setting-app-name"
                    className="admin-input"
                    style={{ width: "100%" }}
                    value={appName}
                    onChange={(e) => setAppName(e.target.value)}
                  />
                </div>
                <div className="admin-field">
                  <label htmlFor="setting-max-upload">Maksimal unggah CV (MB)</label>
                  <input
                    id="setting-max-upload"
                    type="number"
                    min={1}
                    max={20}
                    className="admin-input"
                    style={{ width: "100%" }}
                    value={maxUpload}
                    onChange={(e) => setMaxUpload(e.target.value)}
                  />
                </div>
                <div className="admin-field">
                  <label id="maintenance-label">Mode pemeliharaan</label>
                  <button
                    type="button"
                    role="switch"
                    aria-checked={maintenance}
                    aria-labelledby="maintenance-label"
                    className="admin-switch"
                    onClick={() => setMaintenance((prev) => !prev)}
                  >
                    <span>{maintenance ? "Aktif" : "Nonaktif"}</span>
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div className="admin-work-panel">
            <div className="admin-work-panel-header">
              <div>
                <h2>Konfigurasi email SMTP</h2>
                <p>Server pengiriman email verifikasi akun, notifikasi lamaran, dan reset password.</p>
              </div>
              <Mail size={18} color="#0e67cc" aria-hidden="true" />
            </div>
            <div className="admin-panel-body">
              <div className="admin-grid-2">
                <div className="admin-field">
                  <label htmlFor="smtp-host">SMTP host</label>
                  <input
                    id="smtp-host"
                    className="admin-input"
                    style={{ width: "100%" }}
                    value={smtpHost}
                    onChange={(e) => setSmtpHost(e.target.value)}
                  />
                </div>
                <div className="admin-field">
                  <label htmlFor="smtp-port">Port</label>
                  <input
                    id="smtp-port"
                    className="admin-input"
                    style={{ width: "100%" }}
                    value={smtpPort}
                    onChange={(e) => setSmtpPort(e.target.value)}
                  />
                </div>
                <div className="admin-field">
                  <label htmlFor="smtp-user">Username</label>
                  <input
                    id="smtp-user"
                    className="admin-input"
                    style={{ width: "100%" }}
                    value={smtpUser}
                    onChange={(e) => setSmtpUser(e.target.value)}
                  />
                </div>
                <div className="admin-field">
                  <label htmlFor="smtp-password">Password SMTP</label>
                  <input
                    id="smtp-password"
                    type="password"
                    className="admin-input"
                    style={{ width: "100%" }}
                    value={smtpPassword}
                    onChange={(e) => setSmtpPassword(e.target.value)}
                    placeholder="Masukkan password SMTP baru jika ingin mengubah"
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="admin-work-panel">
            <div className="admin-work-panel-header">
              <div>
                <h2>Konfigurasi model AI</h2>
                <p>Pilih model aktif serta ambang batas skor kecocokan dan kepercayaan ekstraksi skill.</p>
              </div>
              <Cpu size={18} color="#0e67cc" aria-hidden="true" />
            </div>
            <div className="admin-panel-body">
              <div className="admin-form-grid">
                <div className="admin-field">
                  <label htmlFor="ai-model-version">Model aktif</label>
                  <select
                    id="ai-model-version"
                    className="admin-select"
                    style={{ width: "100%" }}
                    value={modelVersion}
                    onChange={(e) => setModelVersion(e.target.value)}
                  >
                    <option value="gemini-3.8-flash">gemini-3.8-flash (Aktif)</option>
                    <option value="mvp-rule-v1">mvp-rule-v1 (Rule-Based Fallback)</option>
                  </select>
                </div>
                <div className="admin-field">
                  <label htmlFor="ai-threshold">Ambang batas matching: {threshold}%</label>
                  <input
                    id="ai-threshold"
                    type="range"
                    min={50}
                    max={99}
                    value={threshold}
                    onChange={(e) => setThreshold(Number(e.target.value))}
                    style={{ width: "100%", accentColor: "#0d315d", marginTop: 8 }}
                  />
                  <div className="admin-field-hint">Rentang 50% – 99%</div>
                </div>
                <div className="admin-field">
                  <label htmlFor="ai-confidence">Minimal confidence skill: {confidence}%</label>
                  <input
                    id="ai-confidence"
                    type="range"
                    min={40}
                    max={95}
                    value={confidence}
                    onChange={(e) => setConfidence(Number(e.target.value))}
                    style={{ width: "100%", accentColor: "#0e67cc", marginTop: 8 }}
                  />
                  <div className="admin-field-hint">Rentang 40% – 95%</div>
                </div>
              </div>
            </div>
          </div>

          <div className="admin-work-panel">
            <div className="admin-work-panel-header">
              <div>
                <h2>Batas laju API (rate limiting)</h2>
                <p>Lindungi endpoint publik dan terautentikasi dari lonjakan permintaan berlebihan.</p>
              </div>
              <Zap size={18} color="#0e67cc" aria-hidden="true" />
            </div>
            <div className="admin-panel-body">
              <div className="admin-form-grid">
                <div className="admin-field">
                  <label htmlFor="rl-global">Permintaan/menit (global)</label>
                  <input
                    id="rl-global"
                    type="number"
                    className="admin-input"
                    style={{ width: "100%" }}
                    value={rateLimitApi}
                    onChange={(e) => setRateLimitApi(e.target.value)}
                  />
                </div>
                <div className="admin-field">
                  <label htmlFor="rl-user">Permintaan/menit per user</label>
                  <input
                    id="rl-user"
                    type="number"
                    className="admin-input"
                    style={{ width: "100%" }}
                    value={rateLimitUser}
                    onChange={(e) => setRateLimitUser(e.target.value)}
                  />
                </div>
                <div className="admin-field">
                  <label htmlFor="rl-ip">Permintaan/jam per IP</label>
                  <input
                    id="rl-ip"
                    type="number"
                    className="admin-input"
                    style={{ width: "100%" }}
                    value={rateLimitIp}
                    onChange={(e) => setRateLimitIp(e.target.value)}
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="admin-grid-2">
            <div className="admin-work-panel">
              <div className="admin-work-panel-header">
                <div>
                  <h2>Cadangan database</h2>
                  <p>Jadwal otomatis setiap hari pukul 02:00 WIB.</p>
                </div>
                <Database size={18} color="#0e67cc" aria-hidden="true" />
              </div>
              <div
                className="admin-panel-body"
                style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 16, flexWrap: "wrap" }}
              >
                <div>
                  <span className="admin-cell-title">Backup terakhir</span>
                  <span className="admin-cell-subtitle">{lastBackup}</span>
                </div>
                <button
                  type="button"
                  className="admin-button admin-button-secondary"
                  onClick={handleBackupNow}
                >
                  <Database size={14} aria-hidden="true" />
                  Cadangkan sekarang
                </button>
              </div>
            </div>

            <div className="admin-work-panel">
              <div className="admin-work-panel-header">
                <div>
                  <h2>Log aktivitas sistem</h2>
                  <p>Catat seluruh perubahan konfigurasi dan autentikasi ke log server.</p>
                </div>
                <Sliders size={18} color="#0e67cc" aria-hidden="true" />
              </div>
              <div
                className="admin-panel-body"
                style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 16, flexWrap: "wrap" }}
              >
                <div>
                  <span className="admin-cell-title" id="system-logs-label">Pencatatan audit sistem</span>
                  <span className="admin-cell-subtitle">
                    {systemLogs ? "Aktif merekam aktivitas operasional" : "Pencatatan dinonaktifkan"}
                  </span>
                </div>
                <button
                  type="button"
                  role="switch"
                  aria-checked={systemLogs}
                  aria-labelledby="system-logs-label"
                  className="admin-switch"
                  onClick={() => setSystemLogs((prev) => !prev)}
                >
                  <span>{systemLogs ? "Aktif" : "Nonaktif"}</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </DashboardLayout>
  );
}
