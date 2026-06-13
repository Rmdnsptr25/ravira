import { useState } from "react";
import { useNavigate } from "react-router";
import { Shield, Eye, Bell, Lock, Trash2, CheckCircle2, Home, Briefcase, BarChart2, BookOpen, FileText, Globe, User, Settings, Bookmark, ChevronRight } from "lucide-react";
import { DashboardLayout } from "../components/DashboardLayout";
import type { SidebarItem } from "../components/DashboardLayout";
import { RevokeConsentModal, DeleteAccountModal } from "../components/Modals";
import { toast } from "sonner";

const sidebarItems: SidebarItem[] = [
  { key: "beranda", label: "Beranda", icon: <Home size={16} />, path: "/dashboard/kandidat" },
  { key: "pekerjaan", label: "Rekomendasi Pekerjaan", icon: <Briefcase size={16} />, path: "/dashboard/kandidat/rekomendasi" },
  { key: "tersimpan", label: "Lowongan Tersimpan", icon: <Bookmark size={16} />, path: "/dashboard/kandidat/tersimpan" },
  { key: "skill", label: "Skill Gap", icon: <BarChart2 size={16} />, path: "/dashboard/kandidat/skill-gap" },
  { key: "pelatihan", label: "Pelatihan", icon: <BookOpen size={16} />, path: "/dashboard/kandidat/pelatihan" },
  { key: "lamaran", label: "Lamaran Saya", icon: <FileText size={16} />, path: "/dashboard/kandidat/lamaran" },
  { key: "lintas", label: "Peluang Lintas Wilayah", icon: <Globe size={16} />, path: "/dashboard/kandidat/cross-region" },
  { key: "profil", label: "Profil Saya", icon: <User size={16} />, path: "/dashboard/kandidat/profil" },
  { key: "pengaturan", label: "Pengaturan Privasi", icon: <Settings size={16} />, path: "/dashboard/kandidat/privasi" },
];

const Toggle = ({ checked, onChange }: { checked: boolean; onChange: (v: boolean) => void }) => (
  <div
    onClick={() => onChange(!checked)}
    style={{
      width: 46, height: 26, borderRadius: 13, cursor: "pointer",
      background: checked ? "linear-gradient(135deg, #1677FF, #0D47A1)" : "rgba(22,119,255,0.15)",
      position: "relative", transition: "background 0.2s", flexShrink: 0,
    }}
  >
    <div style={{
      width: 20, height: 20, borderRadius: "50%", background: "#fff",
      position: "absolute", top: 3, left: checked ? 23 : 3,
      transition: "left 0.2s", boxShadow: "0 1px 4px rgba(0,0,0,0.2)",
    }} />
  </div>
);

export default function PrivacySettingsPage() {
  const navigate = useNavigate();

  const [visibility, setVisibility] = useState("tertentu");
  const [aiConsent, setAiConsent] = useState(true);
  const [anonMode, setAnonMode] = useState(false);
  const [emailNotif, setEmailNotif] = useState(true);
  const [waNotif, setWaNotif] = useState(false);
  const [jobAlert, setJobAlert] = useState(true);
  const [trainingAlert, setTrainingAlert] = useState(true);
  const [marketingEmail, setMarketingEmail] = useState(false);
  const [twoFA, setTwoFA] = useState(false);
  const [activityLog, setActivityLog] = useState(true);

  const [saved, setSaved] = useState(false);
  const [revokeTarget, setRevokeTarget] = useState<string | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  const sectionStyle: React.CSSProperties = {
    background: "#fff", borderRadius: 18, border: "1px solid rgba(22,119,255,0.1)",
    boxShadow: "0 2px 10px rgba(10,27,61,0.04)", padding: "24px 28px", marginBottom: 18,
  };

  const rowStyle: React.CSSProperties = {
    display: "flex", justifyContent: "space-between", alignItems: "center",
    padding: "14px 0", borderBottom: "1px solid rgba(22,119,255,0.07)",
  };

  return (
    <DashboardLayout sidebarItems={sidebarItems} userName="Budi Santoso" userRole="Kandidat · UI Designer" userInitial="B">
      <div style={{ maxWidth: 720 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 24 }}>
          <div style={{ width: 44, height: 44, borderRadius: 14, background: "rgba(22,119,255,0.08)", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <Shield size={20} color="#1677FF" />
          </div>
          <div>
            <h1 style={{ fontFamily: "'Poppins', sans-serif", fontSize: 20, fontWeight: 800, color: "#0A1B3D" }}>Pengaturan Privasi & Keamanan</h1>
            <p style={{ fontFamily: "'Inter', sans-serif", fontSize: 13, color: "#6a88b8" }}>Kendalikan data dan visibilitas profil Anda di Ravira</p>
          </div>
        </div>

        {/* Visibility */}
        <div style={sectionStyle}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 16 }}>
            <Eye size={16} color="#1677FF" />
            <h2 style={{ fontFamily: "'Poppins', sans-serif", fontSize: 14, fontWeight: 700, color: "#0A1B3D" }}>Visibilitas Profil</h2>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 8, marginBottom: 16 }}>
            {[
              { val: "publik", label: "Publik", desc: "Semua recruiter dapat menemukan dan melihat profil Anda" },
              { val: "tertentu", label: "Hanya Perusahaan Tertentu", desc: "Hanya perusahaan yang Anda setujui yang bisa melihat profil" },
              { val: "private", label: "Privat", desc: "Profil disembunyikan dari semua recruiter" },
            ].map((opt) => (
              <div key={opt.val} onClick={() => setVisibility(opt.val)}
                style={{
                  padding: "12px 16px", borderRadius: 12, cursor: "pointer",
                  border: `1px solid ${visibility === opt.val ? "#1677FF" : "rgba(22,119,255,0.15)"}`,
                  background: visibility === opt.val ? "rgba(22,119,255,0.06)" : "#f8fbff",
                  display: "flex", alignItems: "center", gap: 12,
                }}
              >
                <div style={{ width: 18, height: 18, borderRadius: "50%", border: `2px solid ${visibility === opt.val ? "#1677FF" : "#c0d0e8"}`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                  {visibility === opt.val && <div style={{ width: 8, height: 8, borderRadius: "50%", background: "#1677FF" }} />}
                </div>
                <div>
                  <div style={{ fontFamily: "'Inter', sans-serif", fontSize: 13, fontWeight: 600, color: "#0A1B3D" }}>{opt.label}</div>
                  <div style={{ fontFamily: "'Inter', sans-serif", fontSize: 12, color: "#6a88b8" }}>{opt.desc}</div>
                </div>
              </div>
            ))}
          </div>

          <div style={{ ...rowStyle, borderBottom: "none" }}>
            <div>
              <div style={{ fontFamily: "'Inter', sans-serif", fontSize: 13, fontWeight: 600, color: "#0A1B3D" }}>Mode Anonim</div>
              <div style={{ fontFamily: "'Inter', sans-serif", fontSize: 12, color: "#6a88b8" }}>Sembunyikan nama dan foto; recruiter hanya melihat keahlian & match score</div>
            </div>
            <Toggle checked={anonMode} onChange={setAnonMode} />
          </div>
        </div>

        {/* Consent & Izin */}
        <div style={sectionStyle}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 16 }}>
            <Shield size={16} color="#1677FF" />
            <h2 style={{ fontFamily: "'Poppins', sans-serif", fontSize: 14, fontWeight: 700, color: "#0A1B3D" }}>Consent & Izin Akses Data</h2>
          </div>
          <p style={{ fontFamily: "'Inter', sans-serif", fontSize: 13, color: "#6a88b8", marginBottom: 16, padding: "12px 16px", borderRadius: 10, background: "rgba(22,119,255,0.04)", border: "1px solid rgba(22,119,255,0.1)" }}>
            Profil Anda tidak akan dibagikan ke perusahaan tanpa izin eksplisit dari Anda.
          </p>

          {[
            { label: "Consent Rekomendasi AI", desc: "Izinkan AI Ravira menganalisis profil untuk rekomendasi pekerjaan dan pelatihan" },
            { label: "Consent Analisis CV", desc: "Izinkan sistem membaca dan mengekstrak data dari CV yang Anda unggah" },
            { label: "Consent Analytics Agregat Anonim", desc: "Izinkan data anonim Anda digunakan untuk analitik ketenagakerjaan nasional" },
          ].map((c, i) => (
            <div key={c.label} style={{ ...rowStyle, ...(i === 2 ? { borderBottom: "none", paddingBottom: 0 } : {}) }}>
              <div>
                <div style={{ fontFamily: "'Inter', sans-serif", fontSize: 13, fontWeight: 600, color: "#0A1B3D" }}>{c.label}</div>
                <div style={{ fontFamily: "'Inter', sans-serif", fontSize: 12, color: "#6a88b8" }}>{c.desc}</div>
              </div>
              <Toggle checked={true} onChange={() => {}} />
            </div>
          ))}
        </div>

        {/* AI & Data */}
        <div style={sectionStyle}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 16 }}>
            <Lock size={16} color="#1677FF" />
            <h2 style={{ fontFamily: "'Poppins', sans-serif", fontSize: 14, fontWeight: 700, color: "#0A1B3D" }}>Data & Penggunaan AI</h2>
          </div>

          <div style={rowStyle}>
            <div>
              <div style={{ fontFamily: "'Inter', sans-serif", fontSize: 13, fontWeight: 600, color: "#0A1B3D" }}>Analisis AI untuk Rekomendasi</div>
              <div style={{ fontFamily: "'Inter', sans-serif", fontSize: 12, color: "#6a88b8" }}>Izinkan AI Ravira menganalisis profil untuk rekomendasi pekerjaan dan pelatihan</div>
            </div>
            <Toggle checked={aiConsent} onChange={setAiConsent} />
          </div>

          <div style={{ ...rowStyle, borderBottom: "none", paddingBottom: 0 }}>
            <div>
              <div style={{ fontFamily: "'Inter', sans-serif", fontSize: 13, fontWeight: 600, color: "#0A1B3D" }}>Log Aktivitas</div>
              <div style={{ fontFamily: "'Inter', sans-serif", fontSize: 12, color: "#6a88b8" }}>Simpan riwayat pencarian dan aktivitas untuk personalisasi</div>
            </div>
            <Toggle checked={activityLog} onChange={setActivityLog} />
          </div>
        </div>

        {/* Notifications */}
        <div style={sectionStyle}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 16 }}>
            <Bell size={16} color="#1677FF" />
            <h2 style={{ fontFamily: "'Poppins', sans-serif", fontSize: 14, fontWeight: 700, color: "#0A1B3D" }}>Notifikasi</h2>
          </div>

          {[
            { label: "Notifikasi Email", desc: "Terima email untuk aktivitas penting akun", val: emailNotif, set: setEmailNotif },
            { label: "Notifikasi WhatsApp", desc: "Kirim pesan WhatsApp untuk lowongan cocok baru", val: waNotif, set: setWaNotif },
            { label: "Rekomendasi Pekerjaan", desc: "Alert saat ada pekerjaan baru dengan match >80%", val: jobAlert, set: setJobAlert },
            { label: "Rekomendasi Pelatihan", desc: "Notifikasi kursus baru yang relevan dengan skill gap Anda", val: trainingAlert, set: setTrainingAlert },
            { label: "Newsletter & Promosi", desc: "Email promosi dan konten karier dari Ravira", val: marketingEmail, set: setMarketingEmail },
          ].map((n, i) => (
            <div key={n.label} style={{ ...rowStyle, ...(i === 4 ? { borderBottom: "none", paddingBottom: 0 } : {}) }}>
              <div>
                <div style={{ fontFamily: "'Inter', sans-serif", fontSize: 13, fontWeight: 600, color: "#0A1B3D" }}>{n.label}</div>
                <div style={{ fontFamily: "'Inter', sans-serif", fontSize: 12, color: "#6a88b8" }}>{n.desc}</div>
              </div>
              <Toggle checked={n.val} onChange={n.set} />
            </div>
          ))}
        </div>

        {/* Security */}
        <div style={sectionStyle}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 16 }}>
            <Lock size={16} color="#1677FF" />
            <h2 style={{ fontFamily: "'Poppins', sans-serif", fontSize: 14, fontWeight: 700, color: "#0A1B3D" }}>Keamanan Akun</h2>
          </div>

          <div style={rowStyle}>
            <div>
              <div style={{ fontFamily: "'Inter', sans-serif", fontSize: 13, fontWeight: 600, color: "#0A1B3D" }}>Autentikasi Dua Faktor (2FA)</div>
              <div style={{ fontFamily: "'Inter', sans-serif", fontSize: 12, color: "#6a88b8" }}>Tambahkan lapisan keamanan dengan OTP via WhatsApp atau aplikasi</div>
            </div>
            <Toggle checked={twoFA} onChange={setTwoFA} />
          </div>

          <div style={{ ...rowStyle, borderBottom: "none" }}>
            <div>
              <div style={{ fontFamily: "'Inter', sans-serif", fontSize: 13, fontWeight: 600, color: "#0A1B3D" }}>Ganti Password</div>
              <div style={{ fontFamily: "'Inter', sans-serif", fontSize: 12, color: "#6a88b8" }}>Terakhir diubah 3 bulan lalu</div>
            </div>
            <button style={{ display: "flex", alignItems: "center", gap: 6, padding: "8px 14px", borderRadius: 10, border: "1px solid rgba(22,119,255,0.2)", background: "#f0f7ff", fontFamily: "'Inter', sans-serif", fontSize: 12, color: "#1677FF", cursor: "pointer" }}>
              Ubah <ChevronRight size={13} />
            </button>
          </div>
        </div>

        {/* Danger zone */}
        <div style={{ ...sectionStyle, border: "1px solid rgba(255,107,107,0.2)", background: "#fff" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12 }}>
            <Trash2 size={16} color="#ff6b6b" />
            <h2 style={{ fontFamily: "'Poppins', sans-serif", fontSize: 14, fontWeight: 700, color: "#ff6b6b" }}>Zona Berbahaya</h2>
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div>
              <div style={{ fontFamily: "'Inter', sans-serif", fontSize: 13, fontWeight: 600, color: "#0A1B3D" }}>Hapus Akun Saya</div>
              <div style={{ fontFamily: "'Inter', sans-serif", fontSize: 12, color: "#6a88b8" }}>Tindakan ini tidak dapat dibatalkan. Semua data akan dihapus permanen.</div>
            </div>
            <button
              onClick={() => setShowDeleteModal(true)}
              style={{ padding: "8px 16px", borderRadius: 10, border: "1px solid rgba(255,107,107,0.3)", background: "rgba(255,107,107,0.06)", fontFamily: "'Inter', sans-serif", fontSize: 12, color: "#ff6b6b", cursor: "pointer" }}
            >
              Hapus Akun
            </button>
          </div>
        </div>

        {/* Perusahaan yang dapat melihat profil */}
        <div style={sectionStyle}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 16 }}>
            <Eye size={16} color="#1677FF" />
            <h2 style={{ fontFamily: "'Poppins', sans-serif", fontSize: 14, fontWeight: 700, color: "#0A1B3D" }}>Perusahaan yang Dapat Melihat Profil</h2>
          </div>
          {[
            { company: "Tokopedia", role: "Senior UX Designer", since: "28 Mei 2026" },
            { company: "Gojek", role: "Product Designer", since: "20 Mei 2026" },
          ].map((c) => (
            <div key={c.company} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "12px 0", borderBottom: "1px solid rgba(22,119,255,0.07)" }}>
              <div>
                <div style={{ fontFamily: "'Inter', sans-serif", fontSize: 13, fontWeight: 600, color: "#0A1B3D" }}>{c.company}</div>
                <div style={{ fontFamily: "'Inter', sans-serif", fontSize: 12, color: "#6a88b8" }}>{c.role} · Sejak {c.since}</div>
              </div>
              <button
                onClick={() => setRevokeTarget(c.company)}
                style={{ padding: "6px 14px", borderRadius: 9, border: "1px solid rgba(255,107,107,0.3)", background: "rgba(255,107,107,0.06)", fontFamily: "'Inter', sans-serif", fontSize: 12, color: "#ff6b6b", cursor: "pointer" }}
              >
                Cabut Izin
              </button>
            </div>
          ))}
          <div style={{ marginTop: 14 }}>
            <button
              onClick={() => toast.success("Data Anda sedang disiapkan. Akan dikirim ke email Anda.")}
              style={{ display: "flex", alignItems: "center", gap: 6, padding: "9px 16px", borderRadius: 10, border: "1px solid rgba(22,119,255,0.2)", background: "#f0f7ff", fontFamily: "'Inter', sans-serif", fontSize: 13, color: "#1677FF", cursor: "pointer" }}
            >
              Download Data Saya
            </button>
          </div>
        </div>

        {/* Save */}
        <div style={{ display: "flex", gap: 12, justifyContent: "flex-end" }}>
          <button onClick={() => navigate("/dashboard/kandidat")} style={{ padding: "12px 24px", borderRadius: 12, border: "1px solid rgba(22,119,255,0.2)", background: "#f0f7ff", fontFamily: "'Inter', sans-serif", fontSize: 14, color: "#6a88b8", cursor: "pointer" }}>
            Batal
          </button>
          <button onClick={handleSave}
            style={{
              padding: "12px 28px", borderRadius: 12, border: "none",
              background: saved ? "linear-gradient(135deg, #10d98e, #0bba78)" : "linear-gradient(135deg, #1677FF, #0D47A1)",
              fontFamily: "'Poppins', sans-serif", fontSize: 14, fontWeight: 700, color: "#fff",
              cursor: "pointer", display: "flex", alignItems: "center", gap: 8,
              boxShadow: "0 4px 14px rgba(22,119,255,0.4)", transition: "all 0.3s",
            }}>
            {saved ? <><CheckCircle2 size={16} /> Tersimpan!</> : "Simpan Pengaturan"}
          </button>
        </div>
      </div>

      {revokeTarget && (
        <RevokeConsentModal companyName={revokeTarget} onClose={() => setRevokeTarget(null)} />
      )}

      {showDeleteModal && (
        <DeleteAccountModal onClose={() => setShowDeleteModal(false)} />
      )}
    </DashboardLayout>
  );
}
