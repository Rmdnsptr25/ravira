import { useState } from "react";
import { LayoutDashboard, GitBranch, Briefcase, Plus, BookmarkCheck, BarChart2, Plug, Building2, Settings, Bell, Shield, CreditCard, AlertTriangle } from "lucide-react";
import { toast } from "sonner";
import { DashboardLayout } from "../components/DashboardLayout";
import { useAppContext } from "../contexts/AppContext";
import type { SidebarItem } from "../components/DashboardLayout";

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

function Toggle({ checked, onChange }: { checked: boolean; onChange: () => void }) {
  return (
    <div
      onClick={onChange}
      style={{
        width: "44px",
        height: "24px",
        borderRadius: "12px",
        backgroundColor: checked ? "#1677FF" : "#d1d5db",
        cursor: "pointer",
        position: "relative",
        transition: "background 0.2s",
        flexShrink: 0,
      }}
    >
      <div
        style={{
          position: "absolute",
          top: "3px",
          left: checked ? "23px" : "3px",
          width: "18px",
          height: "18px",
          borderRadius: "50%",
          backgroundColor: "#fff",
          transition: "left 0.2s",
          boxShadow: "0 1px 3px rgba(0,0,0,0.2)",
        }}
      />
    </div>
  );
}

function SectionCard({ icon, title, children }: { icon: React.ReactNode; title: string; children: React.ReactNode }) {
  return (
    <div style={{ backgroundColor: "#fff", borderRadius: "14px", padding: "28px", boxShadow: "0 1px 4px rgba(0,0,0,0.08)", marginBottom: "20px" }}>
      <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "20px" }}>
        {icon}
        <h3 style={{ fontFamily: "Poppins, sans-serif", fontSize: "16px", fontWeight: 700, color: "#0A1B3D", margin: 0 }}>{title}</h3>
      </div>
      {children}
    </div>
  );
}

function ToggleRow({ label, desc, checked, onChange }: { label: string; desc: string; checked: boolean; onChange: () => void }) {
  return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "12px 0", borderBottom: "1px solid #f0f4fa" }}>
      <div>
        <div style={{ fontFamily: "Inter, sans-serif", fontSize: "14px", fontWeight: 600, color: "#0A1B3D" }}>{label}</div>
        <div style={{ fontFamily: "Inter, sans-serif", fontSize: "12px", color: "#9ca3af", marginTop: "2px" }}>{desc}</div>
      </div>
      <Toggle checked={checked} onChange={onChange} />
    </div>
  );
}

export default function CompanySettingsPage() {
  const { user } = useAppContext();
  const displayName = user?.fullName || "Recruiter";
  const displayCompany = user?.recruiter?.company?.name || "Perusahaan";
  const displayRole = `${user?.recruiter?.position || "HR Manager"} · ${displayCompany}`;
  const displayInitial = (displayName[0] || "R").toUpperCase();
  const [notif, setNotif] = useState({ email: true, whatsapp: false, newApps: true, matchThreshold: true });
  const [twoFA, setTwoFA] = useState(true);

  return (
    <DashboardLayout
      sidebarItems={sidebarItems}
      activeKey="pengaturan"
      userName={displayName}
      userRole={displayRole}
      userInitial={displayInitial}
    >
      <div style={{ padding: "32px", minHeight: "100vh", backgroundColor: "#f0f7ff" }}>
        <div style={{ marginBottom: "28px" }}>
          <h1 style={{ fontFamily: "Poppins, sans-serif", fontSize: "24px", fontWeight: 700, color: "#0A1B3D", margin: 0 }}>
            Pengaturan
          </h1>
          <p style={{ fontFamily: "Inter, sans-serif", fontSize: "14px", color: "#6b7280", marginTop: "6px" }}>
            Kelola preferensi akun dan keamanan
          </p>
        </div>

        {/* Notifications */}
        <SectionCard icon={<Bell size={20} color="#1677FF" />} title="Notifikasi">
          <ToggleRow label="Email" desc="Terima notifikasi via email" checked={notif.email} onChange={() => setNotif((p) => ({ ...p, email: !p.email }))} />
          <ToggleRow label="WhatsApp" desc="Terima notifikasi via WhatsApp" checked={notif.whatsapp} onChange={() => setNotif((p) => ({ ...p, whatsapp: !p.whatsapp }))} />
          <ToggleRow label="Pelamar Baru" desc="Notifikasi saat ada pelamar baru masuk" checked={notif.newApps} onChange={() => setNotif((p) => ({ ...p, newApps: !p.newApps }))} />
          <ToggleRow label="Ambang Batas Match" desc="Notifikasi jika kandidat mencapai match score >80%" checked={notif.matchThreshold} onChange={() => setNotif((p) => ({ ...p, matchThreshold: !p.matchThreshold }))} />
        </SectionCard>

        {/* Security */}
        <SectionCard icon={<Shield size={20} color="#10d98e" />} title="Privasi & Keamanan">
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "12px 0", borderBottom: "1px solid #f0f4fa" }}>
            <div>
              <div style={{ fontFamily: "Inter, sans-serif", fontSize: "14px", fontWeight: 600, color: "#0A1B3D" }}>Autentikasi Dua Faktor (2FA)</div>
              <div style={{ fontFamily: "Inter, sans-serif", fontSize: "12px", color: "#9ca3af", marginTop: "2px" }}>Tingkatkan keamanan akun Anda</div>
            </div>
            <Toggle checked={twoFA} onChange={() => setTwoFA((p) => !p)} />
          </div>
          <div style={{ paddingTop: "16px" }}>
            <button
              onClick={() => toast.info("Fitur ubah kata sandi akan segera tersedia di menu Profil Pengguna.")}
              style={{
                fontFamily: "Inter, sans-serif",
                fontSize: "13px",
                fontWeight: 600,
                color: "#0A1B3D",
                backgroundColor: "#f0f4fa",
                border: "1px solid #e5eaf3",
                borderRadius: "10px",
                padding: "10px 20px",
                cursor: "pointer",
              }}
            >
              Ubah Password
            </button>
          </div>
        </SectionCard>

        {/* Subscription */}
        <SectionCard icon={<CreditCard size={20} color="#f59e0b" />} title="Subscription">
          <div
            style={{
              backgroundColor: "#f8faff",
              borderRadius: "12px",
              padding: "20px",
              border: "1px solid #e5eaf3",
              marginBottom: "16px",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "12px" }}>
              <div>
                <span
                  style={{
                    fontFamily: "Poppins, sans-serif",
                    fontSize: "18px",
                    fontWeight: 800,
                    color: "#1677FF",
                  }}
                >
                  Pro Plan
                </span>
                <span
                  style={{
                    marginLeft: "10px",
                    fontFamily: "Inter, sans-serif",
                    fontSize: "12px",
                    fontWeight: 600,
                    color: "#10d98e",
                    backgroundColor: "#10d98e1a",
                    borderRadius: "20px",
                    padding: "2px 10px",
                  }}
                >
                  Aktif
                </span>
              </div>
              <button
                onClick={() => toast.info("Paket enterprise dan upgrade kuota sedang dalam persiapan.")}
                style={{
                  fontFamily: "Inter, sans-serif",
                  fontSize: "13px",
                  fontWeight: 600,
                  color: "#fff",
                  backgroundColor: "#1677FF",
                  border: "none",
                  borderRadius: "8px",
                  padding: "8px 18px",
                  cursor: "pointer",
                }}
              >
                Upgrade
              </button>
            </div>
            <div style={{ display: "flex", gap: "24px" }}>
              {[
                { label: "Recruiter Seats", value: "3" },
                { label: "Kadaluarsa", value: "31 Des 2026" },
              ].map((item) => (
                <div key={item.label}>
                  <div style={{ fontFamily: "Inter, sans-serif", fontSize: "11px", color: "#9ca3af" }}>{item.label}</div>
                  <div style={{ fontFamily: "JetBrains Mono, monospace", fontSize: "15px", fontWeight: 700, color: "#0A1B3D", marginTop: "2px" }}>{item.value}</div>
                </div>
              ))}
            </div>
          </div>
        </SectionCard>

        {/* Danger Zone */}
        <div style={{ backgroundColor: "#fff5f5", border: "1px solid #fecaca", borderRadius: "14px", padding: "28px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "12px" }}>
            <AlertTriangle size={20} color="#ff6b6b" />
            <h3 style={{ fontFamily: "Poppins, sans-serif", fontSize: "16px", fontWeight: 700, color: "#ff6b6b", margin: 0 }}>Danger Zone</h3>
          </div>
          <p style={{ fontFamily: "Inter, sans-serif", fontSize: "13px", color: "#9ca3af", margin: "0 0 16px" }}>
            Tindakan ini tidak dapat dibatalkan. Semua data perusahaan, lowongan, dan rekruter akan dihapus secara permanen.
          </p>
          <button
            onClick={() => {
              if (window.confirm("Apakah Anda yakin ingin menghapus akun perusahaan? Tindakan ini tidak dapat dibatalkan.")) {
                toast.info("Permintaan penghapusan akun telah dicatat. Administrator akan memverifikasi data.");
              }
            }}
            style={{
              fontFamily: "Inter, sans-serif",
              fontSize: "13px",
              fontWeight: 600,
              color: "#fff",
              backgroundColor: "#ff6b6b",
              border: "none",
              borderRadius: "10px",
              padding: "10px 22px",
              cursor: "pointer",
            }}
          >
            Hapus Akun Perusahaan
          </button>
        </div>
      </div>
    </DashboardLayout>
  );
}
