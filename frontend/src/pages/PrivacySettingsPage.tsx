import { useState } from "react";
import { useNavigate } from "react-router";
import {
  Shield,
  Eye,
  Bell,
  Lock,
  Trash2,
  CheckCircle2,
  Home,
  Briefcase,
  BarChart2,
  BookOpen,
  FileText,
  Globe,
  User,
  Settings,
  Bookmark,
  ChevronRight,
} from "lucide-react";
import { DashboardLayout } from "../components/DashboardLayout";
import type { SidebarItem } from "../components/DashboardLayout";
import { RevokeConsentModal, DeleteAccountModal } from "../components/Modals";
import { useAppContext } from "../contexts/AppContext";
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

const Toggle = ({
  checked,
  onChange,
  label,
}: {
  checked: boolean;
  onChange: (v: boolean) => void;
  label?: string;
}) => (
  <button
    type="button"
    role="switch"
    aria-checked={checked}
    aria-label={label}
    onClick={() => onChange(!checked)}
    style={{
      width: 48,
      height: 26,
      borderRadius: 999,
      border: "none",
      cursor: "pointer",
      background: checked ? "#0E67CC" : "#CBD5E1",
      position: "relative",
      transition: "background 0.2s ease",
      flexShrink: 0,
      padding: 0,
    }}
  >
    <span
      style={{
        width: 20,
        height: 20,
        borderRadius: "50%",
        background: "#FFFFFF",
        position: "absolute",
        top: 3,
        left: checked ? 25 : 3,
        transition: "left 0.2s ease",
      }}
    />
  </button>
);

export default function PrivacySettingsPage() {
  const navigate = useNavigate();
  const { user } = useAppContext();
  const displayName = user?.fullName || "Kandidat";
  const displayInitial = (displayName[0] || "K").toUpperCase();

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
    background: "#F4F5F7",
    borderRadius: 24,
    border: "1px solid #E2E8F0",
    padding: "24px 26px",
    marginBottom: 20,
  };

  const rowStyle: React.CSSProperties = {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    gap: 16,
    padding: "14px 0",
    borderBottom: "1px solid #E2E8F0",
  };

  return (
    <DashboardLayout
      sidebarItems={sidebarItems}
      userName={displayName}
      userRole="Kandidat"
      userInitial={displayInitial}
    >
      {/* Framed Hero Banner */}
      <section
        style={{
          borderRadius: 26,
          background: "linear-gradient(180deg, #0849A8 0%, #0E67CC 52%, #2B8CFF 100%)",
          padding: "28px 30px",
          marginBottom: 24,
          boxShadow: "0 16px 40px rgba(8, 73, 168, 0.12)",
        }}
      >
        <p
          style={{
            fontFamily: "'Poppins', sans-serif",
            fontSize: 11,
            fontWeight: 600,
            color: "#D4FF59",
            letterSpacing: "0.18em",
            textTransform: "uppercase",
            margin: "0 0 8px",
          }}
        >
          Kendali Privasi &amp; Consent
        </p>
        <h1
          style={{
            fontFamily: "'Poppins', sans-serif",
            fontSize: "clamp(24px, 3vw, 32px)",
            fontWeight: 600,
            color: "#FFFFFF",
            letterSpacing: "-0.03em",
            margin: "0 0 6px",
            lineHeight: 1.15,
          }}
        >
          Pengaturan Privasi &amp; Keamanan
        </h1>
        <p
          style={{
            fontFamily: "'Inter', sans-serif",
            fontSize: 14.5,
            color: "rgba(255, 255, 255, 0.9)",
            margin: 0,
          }}
        >
          Kendalikan data dan visibilitas profil Anda di Ravira.
        </p>
      </section>

      <div style={{ maxWidth: 840 }}>
        {/* Visibility */}
        <div style={sectionStyle}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16 }}>
            <div
              aria-hidden="true"
              style={{
                width: 34,
                height: 34,
                borderRadius: 10,
                background: "#0D1117",
                color: "#D4FF59",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Eye size={16} />
            </div>
            <h2
              style={{
                fontFamily: "'Poppins', sans-serif",
                fontSize: 16,
                fontWeight: 600,
                color: "#0D1117",
                margin: 0,
              }}
            >
              Visibilitas Profil
            </h2>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 16 }}>
            {[
              {
                val: "publik",
                label: "Publik",
                desc: "Semua recruiter dapat menemukan dan melihat profil Anda",
              },
              {
                val: "tertentu",
                label: "Hanya Perusahaan Tertentu",
                desc: "Hanya perusahaan yang Anda setujui yang bisa melihat profil",
              },
              {
                val: "private",
                label: "Privat",
                desc: "Profil disembunyikan dari semua recruiter",
              },
            ].map((opt) => {
              const isSelected = visibility === opt.val;
              return (
                <div
                  key={opt.val}
                  onClick={() => setVisibility(opt.val)}
                  style={{
                    padding: "14px 16px",
                    borderRadius: 16,
                    cursor: "pointer",
                    border: `1.5px solid ${isSelected ? "#0E67CC" : "#E2E8F0"}`,
                    background: "#FFFFFF",
                    display: "flex",
                    alignItems: "center",
                    gap: 12,
                  }}
                >
                  <div
                    style={{
                      width: 18,
                      height: 18,
                      borderRadius: "50%",
                      border: `2px solid ${isSelected ? "#0E67CC" : "#94A3B8"}`,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      flexShrink: 0,
                    }}
                  >
                    {isSelected && (
                      <div
                        style={{
                          width: 8,
                          height: 8,
                          borderRadius: "50%",
                          background: "#0E67CC",
                        }}
                      />
                    )}
                  </div>
                  <div>
                    <div
                      style={{
                        fontFamily: "'Poppins', sans-serif",
                        fontSize: 13.5,
                        fontWeight: 600,
                        color: "#0D1117",
                      }}
                    >
                      {opt.label}
                    </div>
                    <div style={{ fontFamily: "'Inter', sans-serif", fontSize: 12.5, color: "#4A5568" }}>
                      {opt.desc}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <div style={{ ...rowStyle, borderBottom: "none", paddingBottom: 0 }}>
            <div>
              <div
                style={{
                  fontFamily: "'Inter', sans-serif",
                  fontSize: 13.5,
                  fontWeight: 600,
                  color: "#0D1117",
                }}
              >
                Mode Anonim
              </div>
              <div style={{ fontFamily: "'Inter', sans-serif", fontSize: 12.5, color: "#4A5568" }}>
                Sembunyikan nama dan foto; recruiter hanya melihat keahlian &amp; match score
              </div>
            </div>
            <Toggle checked={anonMode} onChange={setAnonMode} label="Mode Anonim" />
          </div>
        </div>

        {/* Consent & Izin */}
        <div style={sectionStyle}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 14 }}>
            <div
              aria-hidden="true"
              style={{
                width: 34,
                height: 34,
                borderRadius: 10,
                background: "#0D1117",
                color: "#D4FF59",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Shield size={16} />
            </div>
            <h2
              style={{
                fontFamily: "'Poppins', sans-serif",
                fontSize: 16,
                fontWeight: 600,
                color: "#0D1117",
                margin: 0,
              }}
            >
              Consent &amp; Izin Akses Data
            </h2>
          </div>
          <p
            style={{
              fontFamily: "'Inter', sans-serif",
              fontSize: 13,
              color: "#334155",
              marginBottom: 16,
              padding: "12px 16px",
              borderRadius: 14,
              background: "#FFFFFF",
              border: "1px solid #E2E8F0",
            }}
          >
            Profil Anda tidak akan dibagikan ke perusahaan tanpa izin eksplisit dari Anda.
          </p>

          {[
            {
              label: "Consent Rekomendasi AI",
              desc: "Izinkan AI Ravira menganalisis profil untuk rekomendasi pekerjaan dan pelatihan",
            },
            {
              label: "Consent Analisis CV",
              desc: "Izinkan sistem membaca dan mengekstrak data dari CV yang Anda unggah",
            },
            {
              label: "Consent Analytics Agregat Anonim",
              desc: "Izinkan data anonim Anda digunakan untuk analitik ketenagakerjaan nasional",
            },
          ].map((c, i) => (
            <div
              key={c.label}
              style={{ ...rowStyle, ...(i === 2 ? { borderBottom: "none", paddingBottom: 0 } : {}) }}
            >
              <div>
                <div
                  style={{
                    fontFamily: "'Inter', sans-serif",
                    fontSize: 13.5,
                    fontWeight: 600,
                    color: "#0D1117",
                  }}
                >
                  {c.label}
                </div>
                <div style={{ fontFamily: "'Inter', sans-serif", fontSize: 12.5, color: "#4A5568" }}>
                  {c.desc}
                </div>
              </div>
              <Toggle checked={true} onChange={() => {}} label={c.label} />
            </div>
          ))}
        </div>

        {/* AI & Data */}
        <div style={sectionStyle}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16 }}>
            <div
              aria-hidden="true"
              style={{
                width: 34,
                height: 34,
                borderRadius: 10,
                background: "#0D1117",
                color: "#D4FF59",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Lock size={16} />
            </div>
            <h2
              style={{
                fontFamily: "'Poppins', sans-serif",
                fontSize: 16,
                fontWeight: 600,
                color: "#0D1117",
                margin: 0,
              }}
            >
              Data &amp; Penggunaan AI
            </h2>
          </div>

          <div style={rowStyle}>
            <div>
              <div
                style={{
                  fontFamily: "'Inter', sans-serif",
                  fontSize: 13.5,
                  fontWeight: 600,
                  color: "#0D1117",
                }}
              >
                Analisis AI untuk Rekomendasi
              </div>
              <div style={{ fontFamily: "'Inter', sans-serif", fontSize: 12.5, color: "#4A5568" }}>
                Izinkan AI Ravira menganalisis profil untuk rekomendasi pekerjaan dan pelatihan
              </div>
            </div>
            <Toggle checked={aiConsent} onChange={setAiConsent} label="Analisis AI untuk Rekomendasi" />
          </div>

          <div style={{ ...rowStyle, borderBottom: "none", paddingBottom: 0 }}>
            <div>
              <div
                style={{
                  fontFamily: "'Inter', sans-serif",
                  fontSize: 13.5,
                  fontWeight: 600,
                  color: "#0D1117",
                }}
              >
                Log Aktivitas
              </div>
              <div style={{ fontFamily: "'Inter', sans-serif", fontSize: 12.5, color: "#4A5568" }}>
                Simpan riwayat pencarian dan aktivitas untuk personalisasi
              </div>
            </div>
            <Toggle checked={activityLog} onChange={setActivityLog} label="Log Aktivitas" />
          </div>
        </div>

        {/* Notifications */}
        <div style={sectionStyle}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16 }}>
            <div
              aria-hidden="true"
              style={{
                width: 34,
                height: 34,
                borderRadius: 10,
                background: "#0D1117",
                color: "#D4FF59",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Bell size={16} />
            </div>
            <h2
              style={{
                fontFamily: "'Poppins', sans-serif",
                fontSize: 16,
                fontWeight: 600,
                color: "#0D1117",
                margin: 0,
              }}
            >
              Notifikasi
            </h2>
          </div>

          {[
            {
              label: "Notifikasi Email",
              desc: "Terima email untuk aktivitas penting akun",
              val: emailNotif,
              set: setEmailNotif,
            },
            {
              label: "Notifikasi WhatsApp",
              desc: "Kirim pesan WhatsApp untuk lowongan cocok baru",
              val: waNotif,
              set: setWaNotif,
            },
            {
              label: "Rekomendasi Pekerjaan",
              desc: "Alert saat ada pekerjaan baru dengan match >80%",
              val: jobAlert,
              set: setJobAlert,
            },
            {
              label: "Rekomendasi Pelatihan",
              desc: "Notifikasi kursus baru yang relevan dengan skill gap Anda",
              val: trainingAlert,
              set: setTrainingAlert,
            },
            {
              label: "Newsletter & Promosi",
              desc: "Email promosi dan konten karier dari Ravira",
              val: marketingEmail,
              set: setMarketingEmail,
            },
          ].map((n, i) => (
            <div
              key={n.label}
              style={{ ...rowStyle, ...(i === 4 ? { borderBottom: "none", paddingBottom: 0 } : {}) }}
            >
              <div>
                <div
                  style={{
                    fontFamily: "'Inter', sans-serif",
                    fontSize: 13.5,
                    fontWeight: 600,
                    color: "#0D1117",
                  }}
                >
                  {n.label}
                </div>
                <div style={{ fontFamily: "'Inter', sans-serif", fontSize: 12.5, color: "#4A5568" }}>
                  {n.desc}
                </div>
              </div>
              <Toggle checked={n.val} onChange={n.set} label={n.label} />
            </div>
          ))}
        </div>

        {/* Security */}
        <div style={sectionStyle}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16 }}>
            <div
              aria-hidden="true"
              style={{
                width: 34,
                height: 34,
                borderRadius: 10,
                background: "#0D1117",
                color: "#D4FF59",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Lock size={16} />
            </div>
            <h2
              style={{
                fontFamily: "'Poppins', sans-serif",
                fontSize: 16,
                fontWeight: 600,
                color: "#0D1117",
                margin: 0,
              }}
            >
              Keamanan Akun
            </h2>
          </div>

          <div style={rowStyle}>
            <div>
              <div
                style={{
                  fontFamily: "'Inter', sans-serif",
                  fontSize: 13.5,
                  fontWeight: 600,
                  color: "#0D1117",
                }}
              >
                Autentikasi Dua Faktor (2FA)
              </div>
              <div style={{ fontFamily: "'Inter', sans-serif", fontSize: 12.5, color: "#4A5568" }}>
                Tambahkan lapisan keamanan dengan OTP via WhatsApp atau aplikasi
              </div>
            </div>
            <Toggle checked={twoFA} onChange={setTwoFA} label="Autentikasi Dua Faktor" />
          </div>

          <div style={{ ...rowStyle, borderBottom: "none", paddingBottom: 0 }}>
            <div>
              <div
                style={{
                  fontFamily: "'Inter', sans-serif",
                  fontSize: 13.5,
                  fontWeight: 600,
                  color: "#0D1117",
                }}
              >
                Ganti Password
              </div>
              <div style={{ fontFamily: "'Inter', sans-serif", fontSize: 12.5, color: "#4A5568" }}>
                Terakhir diubah 3 bulan lalu
              </div>
            </div>
            <button
              type="button"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 6,
                padding: "8px 16px",
                minHeight: 38,
                borderRadius: 999,
                border: "1px solid #CBD5E1",
                background: "#FFFFFF",
                fontFamily: "'Inter', sans-serif",
                fontSize: 12.5,
                fontWeight: 600,
                color: "#0D1117",
                cursor: "pointer",
              }}
            >
              Ubah <ChevronRight size={13} />
            </button>
          </div>
        </div>

        {/* Perusahaan yang dapat melihat profil */}
        <div style={sectionStyle}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16 }}>
            <div
              aria-hidden="true"
              style={{
                width: 34,
                height: 34,
                borderRadius: 10,
                background: "#0D1117",
                color: "#D4FF59",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Eye size={16} />
            </div>
            <h2
              style={{
                fontFamily: "'Poppins', sans-serif",
                fontSize: 16,
                fontWeight: 600,
                color: "#0D1117",
                margin: 0,
              }}
            >
              Perusahaan yang Dapat Melihat Profil
            </h2>
          </div>
          {[
            { company: "Tokopedia", role: "Senior UX Designer", since: "28 Mei 2026" },
            { company: "Gojek", role: "Product Designer", since: "20 Mei 2026" },
          ].map((c) => (
            <div
              key={c.company}
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                padding: "12px 0",
                borderBottom: "1px solid #E2E8F0",
              }}
            >
              <div>
                <div
                  style={{
                    fontFamily: "'Inter', sans-serif",
                    fontSize: 13.5,
                    fontWeight: 600,
                    color: "#0D1117",
                  }}
                >
                  {c.company}
                </div>
                <div style={{ fontFamily: "'Inter', sans-serif", fontSize: 12, color: "#4A5568" }}>
                  {c.role} · Sejak {c.since}
                </div>
              </div>
              <button
                type="button"
                onClick={() => setRevokeTarget(c.company)}
                style={{
                  padding: "7px 14px",
                  borderRadius: 999,
                  border: "1px solid #FECACA",
                  background: "#FEF2F2",
                  fontFamily: "'Inter', sans-serif",
                  fontSize: 12,
                  fontWeight: 600,
                  color: "#B91C1C",
                  cursor: "pointer",
                }}
              >
                Cabut Izin
              </button>
            </div>
          ))}
          <div style={{ marginTop: 16 }}>
            <button
              type="button"
              onClick={() =>
                toast.success("Data Anda sedang disiapkan. Akan dikirim ke email Anda.")
              }
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 6,
                padding: "9px 18px",
                minHeight: 40,
                borderRadius: 999,
                border: "1px solid #CBD5E1",
                background: "#FFFFFF",
                fontFamily: "'Inter', sans-serif",
                fontSize: 13,
                fontWeight: 600,
                color: "#0D1117",
                cursor: "pointer",
              }}
            >
              Download Data Saya
            </button>
          </div>
        </div>

        {/* Danger zone */}
        <div
          style={{
            ...sectionStyle,
            border: "1px solid #FECACA",
            background: "#FEF2F2",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12 }}>
            <Trash2 size={16} color="#B91C1C" />
            <h2
              style={{
                fontFamily: "'Poppins', sans-serif",
                fontSize: 15,
                fontWeight: 600,
                color: "#991B1B",
                margin: 0,
              }}
            >
              Zona Berbahaya
            </h2>
          </div>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              flexWrap: "wrap",
              gap: 12,
            }}
          >
            <div>
              <div
                style={{
                  fontFamily: "'Inter', sans-serif",
                  fontSize: 13.5,
                  fontWeight: 600,
                  color: "#0D1117",
                }}
              >
                Hapus Akun Saya
              </div>
              <div style={{ fontFamily: "'Inter', sans-serif", fontSize: 12.5, color: "#4A5568" }}>
                Tindakan ini tidak dapat dibatalkan. Semua data akan dihapus permanen.
              </div>
            </div>
            <button
              type="button"
              onClick={() => setShowDeleteModal(true)}
              style={{
                padding: "9px 18px",
                minHeight: 40,
                borderRadius: 999,
                border: "1px solid #FCA5A5",
                background: "#FFFFFF",
                fontFamily: "'Inter', sans-serif",
                fontSize: 12.5,
                fontWeight: 600,
                color: "#B91C1C",
                cursor: "pointer",
              }}
            >
              Hapus Akun
            </button>
          </div>
        </div>

        {/* Save */}
        <div style={{ display: "flex", gap: 12, justifyContent: "flex-end", marginTop: 24 }}>
          <button
            type="button"
            onClick={() => navigate("/dashboard/kandidat")}
            style={{
              padding: "11px 24px",
              minHeight: 44,
              borderRadius: 999,
              border: "1px solid #CBD5E1",
              background: "#FFFFFF",
              fontFamily: "'Inter', sans-serif",
              fontSize: 13.5,
              fontWeight: 600,
              color: "#0D1117",
              cursor: "pointer",
            }}
          >
            Batal
          </button>
          <button
            type="button"
            onClick={handleSave}
            style={{
              padding: "11px 28px",
              minHeight: 44,
              borderRadius: 999,
              border: "none",
              background: "#0D1117",
              fontFamily: "'Inter', sans-serif",
              fontSize: 13.5,
              fontWeight: 700,
              color: "#D4FF59",
              cursor: "pointer",
              display: "inline-flex",
              alignItems: "center",
              gap: 8,
            }}
          >
            {saved ? (
              <>
                <CheckCircle2 size={16} /> Tersimpan!
              </>
            ) : (
              "Simpan Pengaturan"
            )}
          </button>
        </div>
      </div>

      {revokeTarget && (
        <RevokeConsentModal companyName={revokeTarget} onClose={() => setRevokeTarget(null)} />
      )}

      {showDeleteModal && <DeleteAccountModal onClose={() => setShowDeleteModal(false)} />}
    </DashboardLayout>
  );
}
