import { useState } from "react";
import { useNavigate } from "react-router";
import { toast } from "sonner";
import {
  Home, Briefcase, Bookmark, BarChart2, BookOpen, FileText, Globe, User, Settings,
  ArrowLeft, MapPin, DollarSign, Sparkles, CheckCircle2, Building2, TrendingUp,
} from "lucide-react";
import { DashboardLayout } from "../components/DashboardLayout";
import type { SidebarItem } from "../components/DashboardLayout";
import { ApplicationConfirmModal, ApplicationSuccessModal } from "../components/Modals";
import { useAppContext } from "../contexts/AppContext";

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

const matchingSkills = ["Figma", "UI Design", "User Research", "Prototyping"];
const gapSkills = ["Design System Advanced"];

const qualifications = [
  "Minimal 3 tahun pengalaman sebagai UX Designer",
  "Mahir menggunakan Figma dan tools desain modern",
  "Pengalaman dalam design system dan component library",
  "Kemampuan user research dan usability testing",
  "Portfolio dengan studi kasus e-commerce atau fintech",
  "Terbuka untuk relokasi ke Jakarta",
];

const relocationBenefits = [
  { title: "Dukungan Biaya Pindah", desc: "Perusahaan menanggung biaya transportasi dari Yogyakarta ke Jakarta hingga Rp 10 juta." },
  { title: "Housing Allowance 3 Bulan", desc: "Tunjangan tempat tinggal senilai Rp 5 juta/bulan selama 3 bulan pertama masa kerja di Jakarta." },
  { title: "Onboarding Kota Jakarta", desc: "Program orientasi untuk kandidat dari luar Jakarta: pengenalan komunitas, networking, dan mentor lokal." },
];

export default function CrossRegionDetailPage() {
  const navigate = useNavigate();
  const { addApplication } = useAppContext();
  const [interested, setInterested] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  const handleTertarik = () => {
    if (!interested) {
      toast.success("Peluang berhasil ditandai!");
      setInterested(true);
    }
  };

  const handleConfirmApply = () => {
    addApplication({ posisi: "Senior UX Designer", perusahaan: "Gojek", lokasi: "Jakarta Selatan", match: 91 });
    setShowModal(false);
    setShowSuccessModal(true);
  };

  return (
    <DashboardLayout
      sidebarItems={sidebarItems}
      userName="Budi Santoso"
      userRole="Kandidat · UI Designer"
      userInitial="B"
    >
      <div style={{ padding: "28px 32px", maxWidth: 1100, margin: "0 auto" }}>
        {/* Back button */}
        <button
          onClick={() => navigate("/dashboard/kandidat/cross-region")}
          style={{
            display: "inline-flex", alignItems: "center", gap: 6, marginBottom: 24,
            background: "none", border: "none", cursor: "pointer",
            fontFamily: "'Inter', sans-serif", fontSize: 13, fontWeight: 500,
            color: "#1677FF", padding: 0,
          }}
        >
          <ArrowLeft size={15} /> Kembali ke Peluang Lintas Wilayah
        </button>

        {/* Job header card */}
        <div style={{
          background: "#fff", borderRadius: 16, border: "1px solid rgba(22,119,255,0.1)",
          padding: "28px 32px", marginBottom: 20,
          boxShadow: "0 2px 16px rgba(10,27,61,0.06)",
        }}>
          <div style={{ display: "flex", alignItems: "flex-start", gap: 20 }}>
            <div style={{
              width: 64, height: 64, borderRadius: 16, flexShrink: 0,
              background: "linear-gradient(135deg, #0A1B3D, #1a3060)",
              display: "flex", alignItems: "center", justifyContent: "center",
            }}>
              <Building2 size={28} color="#4DB8FF" />
            </div>

            <div style={{ flex: 1 }}>
              <div style={{ marginBottom: 6 }}>
                <h1 style={{
                  fontFamily: "'Poppins', sans-serif", fontSize: 22, fontWeight: 700,
                  color: "#0A1B3D", margin: "0 0 4px",
                }}>
                  Senior UX Designer
                </h1>
                <div style={{ fontFamily: "'Inter', sans-serif", fontSize: 14, fontWeight: 600, color: "#4a6490" }}>
                  Gojek
                </div>
              </div>

              <div style={{ display: "flex", alignItems: "center", flexWrap: "wrap", gap: 12, marginBottom: 14 }}>
                <span style={{
                  display: "flex", alignItems: "center", gap: 4,
                  fontFamily: "'Inter', sans-serif", fontSize: 13, color: "#6a88b8",
                }}>
                  <MapPin size={14} color="#6a88b8" /> Jakarta Selatan
                </span>
                <span style={{
                  fontFamily: "'Inter', sans-serif", fontSize: 12, fontWeight: 600,
                  background: "rgba(16,217,142,0.1)", color: "#10d98e",
                  padding: "3px 12px", borderRadius: 20, border: "1px solid rgba(16,217,142,0.2)",
                }}>
                  Remote OK
                </span>
                <span style={{
                  display: "flex", alignItems: "center", gap: 4,
                  fontFamily: "'JetBrains Mono', monospace", fontSize: 13, fontWeight: 600, color: "#0A1B3D",
                }}>
                  <DollarSign size={14} color="#10d98e" /> 15–22 jt/bulan
                </span>
              </div>
            </div>

            {/* Match score */}
            <div style={{
              flexShrink: 0, textAlign: "center",
              background: "linear-gradient(135deg, #0A1B3D, #1a3060)",
              borderRadius: 14, padding: "16px 22px",
            }}>
              <div style={{
                fontFamily: "'JetBrains Mono', monospace", fontSize: 36, fontWeight: 700,
                color: "#10d98e", lineHeight: 1,
              }}>
                87%
              </div>
              <div style={{ fontFamily: "'Inter', sans-serif", fontSize: 11, color: "#4DB8FF", marginTop: 4 }}>
                KECOCOKAN
              </div>
            </div>
          </div>

          {/* Action buttons */}
          <div style={{ display: "flex", gap: 12, marginTop: 20 }}>
            <button
              onClick={handleTertarik}
              style={{
                padding: "11px 22px", borderRadius: 10, cursor: interested ? "default" : "pointer",
                border: "1.5px solid",
                borderColor: interested ? "rgba(16,217,142,0.4)" : "rgba(22,119,255,0.3)",
                background: interested ? "rgba(16,217,142,0.06)" : "transparent",
                fontFamily: "'Poppins', sans-serif", fontSize: 13, fontWeight: 600,
                color: interested ? "#10d98e" : "#1677FF",
                display: "flex", alignItems: "center", gap: 6,
                transition: "all 0.25s ease",
              }}
            >
              {interested ? <><CheckCircle2 size={15} /> Tertandai ✓</> : "Tandai Tertarik"}
            </button>
            <button
              onClick={() => setShowModal(true)}
              style={{
                padding: "11px 28px", borderRadius: 10, cursor: "pointer", border: "none",
                background: "linear-gradient(135deg, #1677FF, #4DB8FF)",
                fontFamily: "'Poppins', sans-serif", fontSize: 13, fontWeight: 700, color: "#fff",
                boxShadow: "0 4px 14px rgba(22,119,255,0.3)",
              }}
            >
              Lamar Sekarang
            </button>
          </div>
        </div>

        {/* Main content */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 320px", gap: 20, alignItems: "start" }}>
          {/* Left */}
          <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
            {/* Tentang Pekerjaan */}
            <div style={{
              background: "#fff", borderRadius: 16, border: "1px solid rgba(22,119,255,0.1)",
              padding: "24px 28px", boxShadow: "0 2px 12px rgba(10,27,61,0.04)",
            }}>
              <h2 style={{ fontFamily: "'Poppins', sans-serif", fontSize: 15, fontWeight: 700, color: "#0A1B3D", margin: "0 0 12px" }}>
                Tentang Pekerjaan
              </h2>
              <p style={{ fontFamily: "'Inter', sans-serif", fontSize: 13, color: "#4a6490", lineHeight: 1.75, margin: 0 }}>
                Kami mencari Senior UX Designer berpengalaman untuk bergabung dengan tim produk Gojek di Jakarta Selatan. Anda akan berperan dalam mendefinisikan strategi desain pengalaman pengguna, berkolaborasi dengan tim engineering dan product manager, serta memimpin proyek desain end-to-end. Posisi ini terbuka untuk kandidat dari Pulau Jawa dengan dukungan relokasi penuh dari perusahaan.
              </p>
            </div>

            {/* Kualifikasi */}
            <div style={{
              background: "#fff", borderRadius: 16, border: "1px solid rgba(22,119,255,0.1)",
              padding: "24px 28px", boxShadow: "0 2px 12px rgba(10,27,61,0.04)",
            }}>
              <h2 style={{ fontFamily: "'Poppins', sans-serif", fontSize: 15, fontWeight: 700, color: "#0A1B3D", margin: "0 0 14px" }}>
                Kualifikasi Dibutuhkan
              </h2>
              <ul style={{ margin: 0, padding: 0, listStyle: "none", display: "flex", flexDirection: "column", gap: 10 }}>
                {qualifications.map((q, i) => (
                  <li key={i} style={{ display: "flex", alignItems: "flex-start", gap: 10 }}>
                    <span style={{
                      width: 20, height: 20, borderRadius: "50%", flexShrink: 0,
                      background: "rgba(22,119,255,0.08)", border: "1.5px solid rgba(22,119,255,0.2)",
                      display: "flex", alignItems: "center", justifyContent: "center",
                      fontFamily: "'JetBrains Mono', monospace", fontSize: 10, fontWeight: 700, color: "#1677FF",
                      marginTop: 1,
                    }}>
                      {i + 1}
                    </span>
                    <span style={{ fontFamily: "'Inter', sans-serif", fontSize: 13, color: "#4a6490", lineHeight: 1.6 }}>
                      {q}
                    </span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Keuntungan Relokasi */}
            <div style={{
              background: "#fff", borderRadius: 16, border: "1px solid rgba(22,119,255,0.1)",
              padding: "24px 28px", boxShadow: "0 2px 12px rgba(10,27,61,0.04)",
            }}>
              <h2 style={{ fontFamily: "'Poppins', sans-serif", fontSize: 15, fontWeight: 700, color: "#0A1B3D", margin: "0 0 16px" }}>
                Keuntungan Relokasi
              </h2>
              <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                {relocationBenefits.map((b, i) => (
                  <div
                    key={i}
                    style={{
                      borderRadius: 12, padding: "14px 18px",
                      background: "rgba(77,184,255,0.05)", border: "1px solid rgba(77,184,255,0.15)",
                    }}
                  >
                    <div style={{ fontFamily: "'Poppins', sans-serif", fontSize: 13, fontWeight: 700, color: "#0A1B3D", marginBottom: 4 }}>
                      {b.title}
                    </div>
                    <div style={{ fontFamily: "'Inter', sans-serif", fontSize: 12, color: "#6a88b8", lineHeight: 1.6 }}>
                      {b.desc}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Tentang Perusahaan */}
            <div style={{
              background: "#fff", borderRadius: 16, border: "1px solid rgba(22,119,255,0.1)",
              padding: "24px 28px", boxShadow: "0 2px 12px rgba(10,27,61,0.04)",
            }}>
              <h2 style={{ fontFamily: "'Poppins', sans-serif", fontSize: 15, fontWeight: 700, color: "#0A1B3D", margin: "0 0 12px" }}>
                Tentang Perusahaan
              </h2>
              <p style={{ fontFamily: "'Inter', sans-serif", fontSize: 13, color: "#4a6490", lineHeight: 1.75, margin: 0 }}>
                Gojek adalah platform teknologi super app terkemuka di Indonesia yang melayani jutaan pengguna aktif setiap harinya. Tim Product Design kami berkedudukan di Jakarta dan bekerja sama dengan insinyur, product manager, dan data scientist untuk menciptakan pengalaman pengguna terbaik di Asia Tenggara. Kami sangat terbuka untuk kandidat berbakat dari berbagai kota di Pulau Jawa.
              </p>
            </div>
          </div>

          {/* Right sidebar */}
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            {/* Match score detail */}
            <div style={{
              background: "linear-gradient(135deg, #0A1B3D, #1a3060)",
              borderRadius: 16, padding: "22px 20px", color: "#fff",
              boxShadow: "0 4px 20px rgba(10,27,61,0.2)",
            }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12 }}>
                <TrendingUp size={16} color="#4DB8FF" />
                <span style={{ fontFamily: "'Poppins', sans-serif", fontSize: 13, fontWeight: 700, color: "#4DB8FF" }}>
                  Skor Kecocokan
                </span>
              </div>
              <div style={{
                fontFamily: "'JetBrains Mono', monospace", fontSize: 48, fontWeight: 700,
                color: "#10d98e", lineHeight: 1, marginBottom: 8,
              }}>
                87%
              </div>
              <div style={{ height: 6, borderRadius: 4, background: "rgba(255,255,255,0.1)", marginBottom: 10 }}>
                <div style={{ height: "100%", width: "87%", borderRadius: 4, background: "linear-gradient(90deg, #10d98e, #4DB8FF)" }} />
              </div>
              <div style={{ fontFamily: "'Inter', sans-serif", fontSize: 12, color: "#8aa4c8" }}>
                Profil Anda sangat sesuai dengan kebutuhan posisi ini.
              </div>
            </div>

            {/* Matching skills */}
            <div style={{
              background: "#fff", borderRadius: 14, border: "1px solid rgba(22,119,255,0.1)",
              padding: "18px 20px", boxShadow: "0 2px 10px rgba(10,27,61,0.04)",
            }}>
              <h3 style={{ fontFamily: "'Poppins', sans-serif", fontSize: 13, fontWeight: 700, color: "#0A1B3D", margin: "0 0 12px" }}>
                Skill yang Cocok
              </h3>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 7 }}>
                {matchingSkills.map((s) => (
                  <span key={s} style={{
                    fontFamily: "'Inter', sans-serif", fontSize: 11, fontWeight: 600,
                    color: "#10d98e", background: "rgba(16,217,142,0.08)",
                    padding: "4px 12px", borderRadius: 20, border: "1px solid rgba(16,217,142,0.2)",
                  }}>
                    ✓ {s}
                  </span>
                ))}
              </div>
            </div>

            {/* Gap skills */}
            <div style={{
              background: "#fff", borderRadius: 14, border: "1px solid rgba(22,119,255,0.1)",
              padding: "18px 20px", boxShadow: "0 2px 10px rgba(10,27,61,0.04)",
            }}>
              <h3 style={{ fontFamily: "'Poppins', sans-serif", fontSize: 13, fontWeight: 700, color: "#0A1B3D", margin: "0 0 12px" }}>
                Skill yang Perlu Ditingkatkan
              </h3>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 7 }}>
                {gapSkills.map((s) => (
                  <span key={s} style={{
                    fontFamily: "'Inter', sans-serif", fontSize: 11, fontWeight: 600,
                    color: "#ff9a3c", background: "rgba(255,154,60,0.08)",
                    padding: "4px 12px", borderRadius: 20, border: "1px solid rgba(255,154,60,0.2)",
                  }}>
                    ↑ {s}
                  </span>
                ))}
              </div>
            </div>

            {/* AI Insight */}
            <div style={{
              borderRadius: 14, padding: "16px 18px",
              background: "rgba(22,119,255,0.04)", border: "1px solid rgba(22,119,255,0.15)",
            }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
                <Sparkles size={15} color="#1677FF" />
                <span style={{ fontFamily: "'Poppins', sans-serif", fontSize: 12, fontWeight: 700, color: "#1677FF" }}>
                  AI Insight Ravira
                </span>
              </div>
              <p style={{ fontFamily: "'Inter', sans-serif", fontSize: 12, color: "#4a6490", lineHeight: 1.65, margin: 0 }}>
                AI Ravira mendeteksi bahwa keterampilan React Anda sudah cukup kuat untuk posisi ini, dengan 2 skill yang perlu ditingkatkan dalam 3 bulan.
              </p>
            </div>

            {/* CTA buttons (sidebar repeat) */}
            <button
              onClick={() => setShowModal(true)}
              style={{
                width: "100%", padding: "13px 0", borderRadius: 12, cursor: "pointer", border: "none",
                background: "linear-gradient(135deg, #1677FF, #4DB8FF)",
                fontFamily: "'Poppins', sans-serif", fontSize: 13, fontWeight: 700, color: "#fff",
                boxShadow: "0 4px 14px rgba(22,119,255,0.3)",
              }}
            >
              Lamar Sekarang
            </button>

            <button
              onClick={handleTertarik}
              style={{
                width: "100%", padding: "12px 0", borderRadius: 12,
                cursor: interested ? "default" : "pointer",
                border: "1.5px solid",
                borderColor: interested ? "rgba(16,217,142,0.4)" : "rgba(22,119,255,0.25)",
                background: interested ? "rgba(16,217,142,0.05)" : "transparent",
                fontFamily: "'Poppins', sans-serif", fontSize: 13, fontWeight: 600,
                color: interested ? "#10d98e" : "#1677FF",
                transition: "all 0.25s ease",
              }}
            >
              {interested ? "Tertandai ✓" : "Tandai Tertarik"}
            </button>
          </div>
        </div>
      </div>

      {showModal && (
        <ApplicationConfirmModal
          jobTitle="Senior UX Designer"
          company="Gojek"
          onConfirm={handleConfirmApply}
          onClose={() => setShowModal(false)}
        />
      )}
      {showSuccessModal && (
        <ApplicationSuccessModal
          jobTitle="Senior UX Designer"
          onClose={() => setShowSuccessModal(false)}
        />
      )}
    </DashboardLayout>
  );
}
