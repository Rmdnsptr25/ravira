import { useState } from "react";
import { useNavigate } from "react-router";
import { toast } from "sonner";
import {
  Home, Briefcase, Bookmark, BarChart2, BookOpen, FileText, Globe, User, Settings,
  ArrowLeft, CheckCircle, Circle, Award, Clock, BookMarked, Play, Square,
} from "lucide-react";
import { DashboardLayout, SidebarItem } from "../components/DashboardLayout";

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

const modules = [
  { id: 1, title: "Pengantar UX Research", duration: "45 menit", done: true },
  { id: 2, title: "Metode Penelitian Kualitatif", duration: "60 menit", done: true },
  { id: 3, title: "Wawancara Pengguna", duration: "50 menit", done: true },
  { id: 4, title: "Usability Testing Dasar", duration: "55 menit", done: true },
  { id: 5, title: "Analisis & Sintesis Data", duration: "70 menit", done: true },
  { id: 6, title: "Affinity Mapping", duration: "40 menit", done: false },
  { id: 7, title: "Menyusun Laporan Riset", duration: "65 menit", done: false },
  { id: 8, title: "Presentasi Temuan Riset", duration: "45 menit", done: false },
];

const skills = [
  "User Research", "Usability Testing", "Qualitative Analysis",
  "Affinity Mapping", "Interview Techniques", "Data Synthesis",
];

export default function CourseDetailPage() {
  const navigate = useNavigate();
  const [sessionActive, setSessionActive] = useState(false);

  const handleLanjutkan = () => {
    if (!sessionActive) {
      toast.success("Progress belajar diperbarui!");
      setSessionActive(true);
    } else {
      toast.success("Sesi belajar selesai! Progress tersimpan.");
      setSessionActive(false);
    }
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
          onClick={() => navigate("/dashboard/kandidat/pelatihan")}
          style={{
            display: "inline-flex", alignItems: "center", gap: 6, marginBottom: 24,
            background: "none", border: "none", cursor: "pointer",
            fontFamily: "'Inter', sans-serif", fontSize: 13, fontWeight: 500,
            color: "#1677FF", padding: 0,
          }}
        >
          <ArrowLeft size={15} /> Kembali ke Pelatihan
        </button>

        {/* Course header */}
        <div style={{
          background: "#fff", borderRadius: 16, border: "1px solid rgba(22,119,255,0.1)",
          padding: "28px 32px", marginBottom: 20,
          boxShadow: "0 2px 16px rgba(10,27,61,0.06)",
        }}>
          <div style={{ display: "flex", alignItems: "flex-start", gap: 20 }}>
            <div style={{
              width: 64, height: 64, borderRadius: 16, flexShrink: 0,
              background: "linear-gradient(135deg, #1677FF, #4DB8FF)",
              display: "flex", alignItems: "center", justifyContent: "center",
            }}>
              <BookMarked size={28} color="#fff" />
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8 }}>
                <h1 style={{
                  fontFamily: "'Poppins', sans-serif", fontSize: 22, fontWeight: 700,
                  color: "#0A1B3D", margin: 0,
                }}>
                  UX Research Fundamentals
                </h1>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 14 }}>
                <span style={{
                  fontFamily: "'Inter', sans-serif", fontSize: 12, fontWeight: 600,
                  background: "rgba(22,119,255,0.08)", color: "#1677FF",
                  padding: "3px 10px", borderRadius: 20,
                }}>
                  Coursera
                </span>
                <span style={{
                  fontFamily: "'Inter', sans-serif", fontSize: 12, fontWeight: 600,
                  background: "rgba(245,158,11,0.1)", color: "#f59e0b",
                  padding: "3px 10px", borderRadius: 20,
                }}>
                  Intermediate
                </span>
                <span style={{
                  display: "flex", alignItems: "center", gap: 4,
                  fontFamily: "'Inter', sans-serif", fontSize: 12, color: "#6a88b8",
                }}>
                  <Clock size={13} /> 4 minggu
                </span>
              </div>

              {/* Progress bar */}
              <div>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
                  <span style={{ fontFamily: "'Inter', sans-serif", fontSize: 13, fontWeight: 600, color: "#0A1B3D" }}>
                    Progress Kursus
                  </span>
                  <span style={{
                    fontFamily: "'JetBrains Mono', monospace", fontSize: 14, fontWeight: 700, color: "#1677FF",
                  }}>
                    72% selesai
                  </span>
                </div>
                <div style={{
                  height: 12, borderRadius: 8, background: "rgba(22,119,255,0.1)", overflow: "hidden",
                }}>
                  <div style={{
                    height: "100%", width: "72%", borderRadius: 8,
                    background: "linear-gradient(90deg, #1677FF, #4DB8FF)",
                    transition: "width 0.6s ease",
                  }} />
                </div>
                <div style={{ fontFamily: "'Inter', sans-serif", fontSize: 11, color: "#6a88b8", marginTop: 4 }}>
                  5 dari 8 modul selesai
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Two-column layout */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 320px", gap: 20, alignItems: "start" }}>
          {/* Left column */}
          <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
            {/* About */}
            <div style={{
              background: "#fff", borderRadius: 16, border: "1px solid rgba(22,119,255,0.1)",
              padding: "24px 28px", boxShadow: "0 2px 12px rgba(10,27,61,0.04)",
            }}>
              <h2 style={{ fontFamily: "'Poppins', sans-serif", fontSize: 16, fontWeight: 700, color: "#0A1B3D", margin: "0 0 12px" }}>
                Tentang Kursus
              </h2>
              <p style={{ fontFamily: "'Inter', sans-serif", fontSize: 13, color: "#4a6490", lineHeight: 1.75, margin: 0 }}>
                Kursus ini dirancang untuk membantu Anda memahami dasar-dasar UX Research secara menyeluruh. Anda akan mempelajari cara merencanakan penelitian pengguna, melakukan wawancara mendalam, menjalankan usability testing, serta menganalisis dan mensintesis data kualitatif menjadi insight yang dapat ditindaklanjuti oleh tim desain dan produk. Cocok untuk desainer yang ingin memperkuat kemampuan riset berbasis data.
              </p>
            </div>

            {/* Module list */}
            <div style={{
              background: "#fff", borderRadius: 16, border: "1px solid rgba(22,119,255,0.1)",
              padding: "24px 28px", boxShadow: "0 2px 12px rgba(10,27,61,0.04)",
            }}>
              <h2 style={{ fontFamily: "'Poppins', sans-serif", fontSize: 16, fontWeight: 700, color: "#0A1B3D", margin: "0 0 16px" }}>
                Materi Kursus
              </h2>
              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                {modules.map((mod) => (
                  <div
                    key={mod.id}
                    style={{
                      display: "flex", alignItems: "center", gap: 14, padding: "12px 16px",
                      borderRadius: 10, border: "1px solid",
                      borderColor: mod.done ? "rgba(16,217,142,0.2)" : "rgba(22,119,255,0.08)",
                      background: mod.done ? "rgba(16,217,142,0.04)" : "rgba(22,119,255,0.02)",
                    }}
                  >
                    {mod.done
                      ? <CheckCircle size={18} color="#10d98e" />
                      : <Circle size={18} color="#c5d3f0" />}
                    <div style={{ flex: 1 }}>
                      <div style={{
                        fontFamily: "'Inter', sans-serif", fontSize: 13, fontWeight: mod.done ? 500 : 400,
                        color: mod.done ? "#0A1B3D" : "#6a88b8",
                        textDecoration: mod.done ? "none" : "none",
                      }}>
                        Modul {mod.id}: {mod.title}
                      </div>
                    </div>
                    <span style={{
                      fontFamily: "'JetBrains Mono', monospace", fontSize: 11, color: "#8aa4c8",
                    }}>
                      {mod.duration}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Skills */}
            <div style={{
              background: "#fff", borderRadius: 16, border: "1px solid rgba(22,119,255,0.1)",
              padding: "24px 28px", boxShadow: "0 2px 12px rgba(10,27,61,0.04)",
            }}>
              <h2 style={{ fontFamily: "'Poppins', sans-serif", fontSize: 16, fontWeight: 700, color: "#0A1B3D", margin: "0 0 14px" }}>
                Skill yang Akan Dikuasai
              </h2>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                {skills.map((skill) => (
                  <span
                    key={skill}
                    style={{
                      fontFamily: "'Inter', sans-serif", fontSize: 12, fontWeight: 500,
                      color: "#1677FF", background: "rgba(22,119,255,0.08)",
                      padding: "5px 14px", borderRadius: 20,
                      border: "1px solid rgba(22,119,255,0.15)",
                    }}
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>

            {/* Bottom back button */}
            <button
              onClick={() => navigate("/dashboard/kandidat/pelatihan")}
              style={{
                display: "inline-flex", alignItems: "center", justifyContent: "center", gap: 6,
                padding: "11px 24px", borderRadius: 10, cursor: "pointer",
                background: "none", border: "1.5px solid rgba(22,119,255,0.25)",
                fontFamily: "'Poppins', sans-serif", fontSize: 13, fontWeight: 600, color: "#1677FF",
                alignSelf: "flex-start",
              }}
            >
              <ArrowLeft size={15} /> Kembali ke Pelatihan
            </button>
          </div>

          {/* Right sidebar */}
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            {/* Progress card */}
            <div style={{
              background: "linear-gradient(135deg, #0A1B3D, #1a3060)",
              borderRadius: 16, padding: "24px 22px", color: "#fff",
              boxShadow: "0 4px 20px rgba(10,27,61,0.2)",
            }}>
              <div style={{ fontFamily: "'Inter', sans-serif", fontSize: 12, color: "#4DB8FF", marginBottom: 8, fontWeight: 600 }}>
                PROGRESS ANDA
              </div>
              <div style={{
                fontFamily: "'JetBrains Mono', monospace", fontSize: 42, fontWeight: 700,
                color: "#fff", lineHeight: 1, marginBottom: 4,
              }}>
                72%
              </div>
              <div style={{ fontFamily: "'Inter', sans-serif", fontSize: 12, color: "#8aa4c8", marginBottom: 16 }}>
                5 dari 8 modul selesai
              </div>
              <div style={{ height: 6, borderRadius: 4, background: "rgba(255,255,255,0.1)", marginBottom: 16 }}>
                <div style={{ height: "100%", width: "72%", borderRadius: 4, background: "linear-gradient(90deg, #1677FF, #4DB8FF)" }} />
              </div>
              <div style={{ fontFamily: "'Inter', sans-serif", fontSize: 11, color: "#6a88b8" }}>
                Estimasi selesai: 1 minggu lagi
              </div>
            </div>

            {/* Certificate info */}
            <div style={{
              background: "#fff", borderRadius: 14, border: "1px solid rgba(22,119,255,0.1)",
              padding: "18px 20px", boxShadow: "0 2px 10px rgba(10,27,61,0.04)",
            }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 10 }}>
                <Award size={18} color="#f59e0b" />
                <span style={{ fontFamily: "'Poppins', sans-serif", fontSize: 13, fontWeight: 700, color: "#0A1B3D" }}>
                  Sertifikat
                </span>
              </div>
              <p style={{ fontFamily: "'Inter', sans-serif", fontSize: 12, color: "#6a88b8", margin: 0, lineHeight: 1.6 }}>
                Sertifikat Coursera akan tersedia setelah Anda menyelesaikan semua 8 modul dan lulus kuis akhir.
              </p>
            </div>

            {/* Next milestone */}
            <div style={{
              background: "rgba(245,158,11,0.05)", borderRadius: 14,
              border: "1px solid rgba(245,158,11,0.2)", padding: "18px 20px",
            }}>
              <div style={{ fontFamily: "'Inter', sans-serif", fontSize: 11, fontWeight: 600, color: "#f59e0b", marginBottom: 6 }}>
                MILESTONE BERIKUTNYA
              </div>
              <div style={{ fontFamily: "'Poppins', sans-serif", fontSize: 13, fontWeight: 600, color: "#0A1B3D", marginBottom: 4 }}>
                Modul 6: Affinity Mapping
              </div>
              <div style={{ fontFamily: "'Inter', sans-serif", fontSize: 12, color: "#6a88b8" }}>
                40 menit · Tersedia sekarang
              </div>
            </div>

            {/* CTA button */}
            <button
              onClick={handleLanjutkan}
              style={{
                width: "100%", padding: "14px 0", borderRadius: 12, cursor: "pointer", border: "none",
                background: sessionActive
                  ? "linear-gradient(135deg, #10d98e, #0bbf7c)"
                  : "linear-gradient(135deg, #1677FF, #4DB8FF)",
                fontFamily: "'Poppins', sans-serif", fontSize: 14, fontWeight: 700, color: "#fff",
                display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
                boxShadow: sessionActive
                  ? "0 4px 16px rgba(16,217,142,0.3)"
                  : "0 4px 16px rgba(22,119,255,0.3)",
                transition: "all 0.3s ease",
              }}
            >
              {sessionActive ? <><Square size={15} /> Selesaikan Sesi</> : <><Play size={15} /> Lanjutkan Kursus</>}
            </button>

            {sessionActive && (
              <div style={{
                borderRadius: 12, padding: "12px 16px",
                background: "rgba(16,217,142,0.06)", border: "1px solid rgba(16,217,142,0.2)",
                textAlign: "center",
              }}>
                <div style={{
                  fontFamily: "'Poppins', sans-serif", fontSize: 12, fontWeight: 700,
                  color: "#10d98e", marginBottom: 2,
                }}>
                  Sesi Belajar Aktif
                </div>
                <div style={{ fontFamily: "'Inter', sans-serif", fontSize: 11, color: "#6a88b8" }}>
                  Modul 6: Affinity Mapping sedang berjalan
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
