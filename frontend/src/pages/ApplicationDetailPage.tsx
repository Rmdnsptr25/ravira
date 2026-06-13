import { useState } from "react";
import { useParams, useNavigate } from "react-router";
import {
  Home, Briefcase, Bookmark, BarChart2, BookOpen,
  FileText, Globe, User, Settings,
  ArrowLeft, CheckCircle, Clock, Calendar, Video,
  ExternalLink, AlertTriangle, X,
} from "lucide-react";
import { DashboardLayout } from "../components/DashboardLayout";
import type { SidebarItem } from "../components/DashboardLayout";
import { ContactRecruiterModal } from "../components/Modals";
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

type AppStatus = "Dikirim" | "Screening" | "Interview" | "Offer" | "Diterima" | "Ditolak";

interface TimelineStep {
  label: string;
  description: string;
  date: string | null;
}

interface AppData {
  id: string;
  posisi: string;
  perusahaan: string;
  lokasi: string;
  tanggal: string;
  status: AppStatus;
  match: number;
  timeline: TimelineStep[];
  interview?: {
    tanggal: string;
    jam: string;
    metode: string;
    link: string;
    catatan: string;
  };
}

const mockApplications: Record<string, AppData> = {
  "1": {
    id: "1",
    posisi: "Senior UX Designer",
    perusahaan: "Tokopedia",
    lokasi: "Jakarta",
    tanggal: "28 Mei 2026",
    status: "Interview",
    match: 94,
    timeline: [
      {
        label: "Lamaran Dikirim",
        description: "Lamaran Anda telah berhasil dikirimkan ke tim rekrutmen Tokopedia.",
        date: "28 Mei 2026",
      },
      {
        label: "Screening",
        description: "Tim HR sedang melakukan screening awal terhadap CV dan portofolio Anda.",
        date: "2 Juni 2026",
      },
      {
        label: "Interview",
        description: "Anda dijadwalkan untuk sesi wawancara bersama tim hiring Tokopedia.",
        date: "10 Juni 2026",
      },
      {
        label: "Offer",
        description: "Menunggu keputusan akhir dari tim rekrutmen.",
        date: null,
      },
      {
        label: "Diterima",
        description: "Selamat! Anda resmi bergabung dengan tim.",
        date: null,
      },
    ],
    interview: {
      tanggal: "10 Juni 2026",
      jam: "10:00 WIB",
      metode: "Online (Google Meet)",
      link: "meet.google.com/xyz-abc-def",
      catatan: "Silakan siapkan portfolio terbaru Anda.",
    },
  },
};

const statusOrder: Record<AppStatus, number> = {
  Dikirim: 0,
  Screening: 1,
  Interview: 2,
  Offer: 3,
  Diterima: 4,
  Ditolak: -1,
};

function getStatusStyle(status: AppStatus) {
  switch (status) {
    case "Dikirim":
      return { background: "rgba(22,119,255,0.1)", color: "#1677FF", border: "1px solid rgba(22,119,255,0.25)" };
    case "Screening":
      return { background: "rgba(255,154,60,0.12)", color: "#ff9a3c", border: "1px solid rgba(255,154,60,0.3)" };
    case "Interview":
      return { background: "rgba(124,58,237,0.1)", color: "#7c3aed", border: "1px solid rgba(124,58,237,0.25)" };
    case "Offer":
      return { background: "rgba(16,217,142,0.1)", color: "#10d98e", border: "1px solid rgba(16,217,142,0.3)" };
    case "Ditolak":
      return { background: "rgba(255,107,107,0.1)", color: "#ff6b6b", border: "1px solid rgba(255,107,107,0.25)" };
  }
}

export default function ApplicationDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { applications } = useAppContext();
  const [showConfirm, setShowConfirm] = useState(false);
  const [withdrawn, setWithdrawn] = useState(false);
  const [showContactModal, setShowContactModal] = useState(false);

  const ctxApp = id ? applications.find(a => a.id === id) : undefined;
  const mockApp = id ? mockApplications[id] : undefined;
  const app = ctxApp
    ? { ...mockApp, id: ctxApp.id, posisi: ctxApp.posisi, perusahaan: ctxApp.perusahaan, lokasi: ctxApp.lokasi, tanggal: ctxApp.tanggal, status: ctxApp.status as AppStatus, match: ctxApp.match, timeline: mockApp?.timeline ?? [{ label: "Lamaran Dikirim", description: "Lamaran Anda telah dikirim ke recruiter", date: ctxApp.tanggal }], interview: mockApp?.interview }
    : mockApp;

  if (!app) {
    return (
      <DashboardLayout
        sidebarItems={sidebarItems}
        userName="Budi Santoso"
        userRole="Kandidat"
        userInitial="B"
      >
        <div style={{
          background: "#fff",
          borderRadius: 16,
          border: "1px solid rgba(22,119,255,0.1)",
          padding: "64px 24px",
          textAlign: "center",
        }}>
          <FileText size={48} color="#c5d3f0" style={{ marginBottom: 16 }} />
          <p style={{ fontFamily: "'Inter', sans-serif", fontSize: 15, color: "#9ab4cc", marginBottom: 20 }}>
            Lamaran tidak ditemukan.
          </p>
          <button
            onClick={() => navigate("/dashboard/kandidat/lamaran")}
            style={{
              padding: "10px 24px",
              borderRadius: 10,
              border: "none",
              background: "linear-gradient(135deg, #1677FF, #0D47A1)",
              fontFamily: "'Inter', sans-serif",
              fontSize: 14,
              fontWeight: 600,
              color: "#fff",
              cursor: "pointer",
            }}
          >
            Kembali ke Lamaran Saya
          </button>
        </div>
      </DashboardLayout>
    );
  }

  const badge = getStatusStyle(app.status);
  const currentStep = statusOrder[app.status];
  const showInterview = ["Interview", "Offer"].includes(app.status);

  const handleWithdraw = () => {
    setWithdrawn(true);
    setShowConfirm(false);
    setTimeout(() => navigate("/dashboard/kandidat/lamaran"), 1500);
  };

  return (
    <DashboardLayout
      sidebarItems={sidebarItems}
      userName="Budi Santoso"
      userRole="Kandidat"
      userInitial="B"
    >
      {/* Confirm modal overlay */}
      {showConfirm && (
        <div style={{
          position: "fixed",
          inset: 0,
          background: "rgba(10,27,61,0.45)",
          zIndex: 100,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: 24,
        }}>
          <div style={{
            background: "#fff",
            borderRadius: 20,
            boxShadow: "0 20px 60px rgba(10,27,61,0.2)",
            padding: "32px",
            maxWidth: 420,
            width: "100%",
            position: "relative",
          }}>
            <button
              onClick={() => setShowConfirm(false)}
              style={{
                position: "absolute",
                top: 16,
                right: 16,
                background: "none",
                border: "none",
                cursor: "pointer",
                color: "#9ab4cc",
              }}
            >
              <X size={18} />
            </button>

            <div style={{
              width: 52,
              height: 52,
              borderRadius: 16,
              background: "rgba(255,107,107,0.1)",
              border: "1px solid rgba(255,107,107,0.2)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              marginBottom: 20,
            }}>
              <AlertTriangle size={24} color="#ff6b6b" />
            </div>

            <h3 style={{
              fontFamily: "'Poppins', sans-serif",
              fontSize: 18,
              fontWeight: 700,
              color: "#0A1B3D",
              marginBottom: 10,
            }}>
              Tarik Lamaran?
            </h3>
            <p style={{
              fontFamily: "'Inter', sans-serif",
              fontSize: 14,
              color: "#6a88b8",
              lineHeight: 1.6,
              marginBottom: 24,
            }}>
              Anda yakin ingin menarik lamaran untuk posisi{" "}
              <strong style={{ color: "#0A1B3D" }}>{app.posisi}</strong> di{" "}
              <strong style={{ color: "#0A1B3D" }}>{app.perusahaan}</strong>?
              Tindakan ini tidak dapat dibatalkan.
            </p>

            <div style={{ display: "flex", gap: 10 }}>
              <button
                onClick={() => setShowConfirm(false)}
                style={{
                  flex: 1,
                  padding: "11px",
                  borderRadius: 10,
                  border: "1px solid rgba(22,119,255,0.2)",
                  background: "#f0f7ff",
                  fontFamily: "'Inter', sans-serif",
                  fontSize: 14,
                  fontWeight: 600,
                  color: "#1677FF",
                  cursor: "pointer",
                }}
              >
                Batal
              </button>
              <button
                onClick={handleWithdraw}
                style={{
                  flex: 1,
                  padding: "11px",
                  borderRadius: 10,
                  border: "none",
                  background: "linear-gradient(135deg, #ff6b6b, #e53e3e)",
                  fontFamily: "'Inter', sans-serif",
                  fontSize: 14,
                  fontWeight: 600,
                  color: "#fff",
                  cursor: "pointer",
                  boxShadow: "0 2px 8px rgba(255,107,107,0.4)",
                }}
              >
                Ya, Tarik Lamaran
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Withdrawn success toast */}
      {withdrawn && (
        <div style={{
          position: "fixed",
          top: 80,
          right: 28,
          zIndex: 200,
          background: "#fff",
          borderRadius: 12,
          boxShadow: "0 8px 32px rgba(10,27,61,0.15)",
          border: "1px solid rgba(16,217,142,0.3)",
          padding: "14px 20px",
          display: "flex",
          alignItems: "center",
          gap: 10,
        }}>
          <CheckCircle size={18} color="#10d98e" />
          <span style={{ fontFamily: "'Inter', sans-serif", fontSize: 13, color: "#0A1B3D", fontWeight: 500 }}>
            Lamaran berhasil ditarik. Mengalihkan...
          </span>
        </div>
      )}

      {/* Back button */}
      <button
        onClick={() => navigate("/dashboard/kandidat/lamaran")}
        style={{
          display: "inline-flex",
          alignItems: "center",
          gap: 8,
          padding: "8px 16px",
          borderRadius: 10,
          border: "1px solid rgba(22,119,255,0.15)",
          background: "#fff",
          fontFamily: "'Inter', sans-serif",
          fontSize: 13,
          fontWeight: 500,
          color: "#1677FF",
          cursor: "pointer",
          marginBottom: 24,
        }}
      >
        <ArrowLeft size={14} /> Kembali ke Lamaran Saya
      </button>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 320px", gap: 20, alignItems: "start" }}>
        {/* Left column */}
        <div>
          {/* Header card */}
          <div style={{
            background: "#fff",
            borderRadius: 18,
            border: "1px solid rgba(22,119,255,0.1)",
            boxShadow: "0 2px 12px rgba(10,27,61,0.05)",
            padding: "28px",
            marginBottom: 20,
          }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: 16 }}>
              <div>
                <h1 style={{
                  fontFamily: "'Poppins', sans-serif",
                  fontSize: 22,
                  fontWeight: 800,
                  color: "#0A1B3D",
                  marginBottom: 6,
                  letterSpacing: "-0.4px",
                }}>
                  {app.posisi}
                </h1>
                <p style={{ fontFamily: "'Inter', sans-serif", fontSize: 15, color: "#6a88b8", marginBottom: 14 }}>
                  {app.perusahaan} · {app.lokasi}
                </p>
                <div style={{ display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap" }}>
                  <span style={{
                    padding: "5px 14px",
                    borderRadius: 20,
                    fontFamily: "'Inter', sans-serif",
                    fontSize: 13,
                    fontWeight: 700,
                    ...badge,
                  }}>
                    {app.status}
                  </span>
                  <span style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 4,
                    fontFamily: "'Inter', sans-serif",
                    fontSize: 13,
                    color: "#9ab4cc",
                  }}>
                    <Calendar size={13} /> Dikirim {app.tanggal}
                  </span>
                </div>
              </div>
              <div style={{ textAlign: "right" }}>
                <div style={{
                  fontFamily: "'JetBrains Mono', monospace",
                  fontSize: 36,
                  fontWeight: 800,
                  color: "#1677FF",
                  lineHeight: 1,
                }}>
                  {app.match}%
                </div>
                <div style={{ fontFamily: "'Inter', sans-serif", fontSize: 11, color: "#9ab4cc" }}>match score</div>
              </div>
            </div>
          </div>

          {/* Full vertical timeline */}
          <div style={{
            background: "#fff",
            borderRadius: 18,
            border: "1px solid rgba(22,119,255,0.1)",
            boxShadow: "0 2px 12px rgba(10,27,61,0.05)",
            padding: "28px",
            marginBottom: 20,
          }}>
            <h2 style={{
              fontFamily: "'Poppins', sans-serif",
              fontSize: 16,
              fontWeight: 700,
              color: "#0A1B3D",
              marginBottom: 24,
            }}>
              Status Lamaran
            </h2>

            <div style={{ position: "relative" }}>
              {app.timeline.map((step, idx) => {
                const isDone = currentStep >= idx && app.status !== "Ditolak";
                const isCurrent = currentStep === idx && app.status !== "Ditolak";
                const isFuture = !isDone && !isCurrent;
                const isLast = idx === app.timeline.length - 1;

                const nodeColor = isDone || isCurrent ? "#1677FF" : "#d1ddf0";
                const textColor = isCurrent ? "#0A1B3D" : isDone ? "#4a6a9a" : "#9ab4cc";

                return (
                  <div key={step.label} style={{ display: "flex", gap: 20, position: "relative" }}>
                    {/* Node column */}
                    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", flexShrink: 0, width: 28 }}>
                      <div style={{
                        width: 28,
                        height: 28,
                        borderRadius: "50%",
                        background: isDone || isCurrent ? "#1677FF" : "#f0f7ff",
                        border: `2px solid ${nodeColor}`,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        boxShadow: isCurrent ? "0 0 0 4px rgba(22,119,255,0.15)" : "none",
                        zIndex: 1,
                        flexShrink: 0,
                      }}>
                        {isDone && <CheckCircle size={14} color="#fff" strokeWidth={2.5} />}
                        {isCurrent && <Clock size={13} color="#fff" strokeWidth={2.5} />}
                        {isFuture && (
                          <div style={{ width: 8, height: 8, borderRadius: "50%", background: "#d1ddf0" }} />
                        )}
                      </div>
                      {/* Vertical connector */}
                      {!isLast && (
                        <div style={{
                          width: 2,
                          flex: 1,
                          minHeight: 40,
                          background: isDone ? "linear-gradient(180deg, #1677FF, rgba(22,119,255,0.3))" : "rgba(22,119,255,0.1)",
                          margin: "4px 0",
                          borderRadius: 1,
                        }} />
                      )}
                    </div>

                    {/* Content */}
                    <div style={{ paddingBottom: isLast ? 0 : 32, flex: 1 }}>
                      <div style={{
                        fontFamily: "'Poppins', sans-serif",
                        fontSize: 14,
                        fontWeight: isCurrent ? 700 : 600,
                        color: isCurrent ? "#1677FF" : textColor,
                        marginBottom: 4,
                      }}>
                        {step.label}
                        {isCurrent && (
                          <span style={{
                            marginLeft: 8,
                            padding: "2px 8px",
                            borderRadius: 6,
                            fontFamily: "'Inter', sans-serif",
                            fontSize: 10,
                            fontWeight: 600,
                            background: "rgba(22,119,255,0.1)",
                            color: "#1677FF",
                          }}>
                            Saat Ini
                          </span>
                        )}
                      </div>
                      <div style={{
                        fontFamily: "'Inter', sans-serif",
                        fontSize: 13,
                        color: isFuture ? "#b0c0d8" : "#6a88b8",
                        lineHeight: 1.6,
                        marginBottom: 4,
                      }}>
                        {step.description}
                      </div>
                      {step.date && (
                        <div style={{
                          fontFamily: "'JetBrains Mono', monospace",
                          fontSize: 11,
                          color: isDone || isCurrent ? "#4DB8FF" : "#c5d3f0",
                          display: "flex",
                          alignItems: "center",
                          gap: 4,
                        }}>
                          <Calendar size={10} /> {step.date}
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Interview schedule */}
          {showInterview && app.interview && (
            <div style={{
              background: "#fff",
              borderRadius: 18,
              border: "1px solid rgba(124,58,237,0.15)",
              boxShadow: "0 2px 12px rgba(10,27,61,0.05)",
              padding: "28px",
              marginBottom: 20,
            }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 20 }}>
                <div style={{
                  width: 38,
                  height: 38,
                  borderRadius: 12,
                  background: "rgba(124,58,237,0.08)",
                  border: "1px solid rgba(124,58,237,0.15)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}>
                  <Video size={18} color="#7c3aed" />
                </div>
                <h2 style={{
                  fontFamily: "'Poppins', sans-serif",
                  fontSize: 16,
                  fontWeight: 700,
                  color: "#0A1B3D",
                }}>
                  Jadwal Interview
                </h2>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 20 }}>
                {[
                  { label: "Tanggal", value: app.interview.tanggal, icon: <Calendar size={13} color="#7c3aed" /> },
                  { label: "Jam", value: app.interview.jam, icon: <Clock size={13} color="#7c3aed" /> },
                  { label: "Metode", value: app.interview.metode, icon: <Video size={13} color="#7c3aed" /> },
                ].map((item) => (
                  <div key={item.label} style={{
                    background: "rgba(124,58,237,0.04)",
                    borderRadius: 12,
                    border: "1px solid rgba(124,58,237,0.1)",
                    padding: "14px 16px",
                  }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 6 }}>
                      {item.icon}
                      <span style={{ fontFamily: "'Inter', sans-serif", fontSize: 11, color: "#9ab4cc", fontWeight: 500 }}>
                        {item.label}
                      </span>
                    </div>
                    <div style={{ fontFamily: "'Inter', sans-serif", fontSize: 14, fontWeight: 600, color: "#0A1B3D" }}>
                      {item.value}
                    </div>
                  </div>
                ))}

                {/* Link */}
                <div style={{
                  background: "rgba(22,119,255,0.04)",
                  borderRadius: 12,
                  border: "1px solid rgba(22,119,255,0.12)",
                  padding: "14px 16px",
                }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 6 }}>
                    <ExternalLink size={13} color="#1677FF" />
                    <span style={{ fontFamily: "'Inter', sans-serif", fontSize: 11, color: "#9ab4cc", fontWeight: 500 }}>
                      Link Meeting
                    </span>
                  </div>
                  <a
                    href={`https://${app.interview.link}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      fontFamily: "'JetBrains Mono', monospace",
                      fontSize: 12,
                      fontWeight: 600,
                      color: "#1677FF",
                      textDecoration: "none",
                      wordBreak: "break-all",
                    }}
                  >
                    {app.interview.link}
                  </a>
                </div>
              </div>

              {/* Catatan recruiter */}
              <div style={{
                background: "rgba(255,154,60,0.06)",
                borderRadius: 12,
                border: "1px solid rgba(255,154,60,0.2)",
                padding: "16px",
              }}>
                <div style={{
                  fontFamily: "'Inter', sans-serif",
                  fontSize: 11,
                  fontWeight: 600,
                  color: "#ff9a3c",
                  textTransform: "uppercase",
                  letterSpacing: "0.05em",
                  marginBottom: 8,
                }}>
                  Catatan Recruiter
                </div>
                <p style={{
                  fontFamily: "'Inter', sans-serif",
                  fontSize: 14,
                  color: "#4a6a9a",
                  lineHeight: 1.6,
                  margin: 0,
                }}>
                  {app.interview.catatan}
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Right column — Actions */}
        <div>
          <div style={{
            background: "#fff",
            borderRadius: 18,
            border: "1px solid rgba(22,119,255,0.1)",
            boxShadow: "0 2px 12px rgba(10,27,61,0.05)",
            padding: "24px",
            position: "sticky",
            top: 80,
          }}>
            <h3 style={{
              fontFamily: "'Poppins', sans-serif",
              fontSize: 15,
              fontWeight: 700,
              color: "#0A1B3D",
              marginBottom: 16,
            }}>
              Aksi
            </h3>

            <button
              onClick={() => navigate("/dashboard/kandidat/lamaran")}
              style={{
                width: "100%",
                padding: "11px",
                borderRadius: 10,
                border: "1px solid rgba(22,119,255,0.2)",
                background: "#f0f7ff",
                fontFamily: "'Inter', sans-serif",
                fontSize: 14,
                fontWeight: 600,
                color: "#1677FF",
                cursor: "pointer",
                marginBottom: 10,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 8,
              }}
            >
              <ArrowLeft size={14} /> Kembali ke Lamaran Saya
            </button>

            {app.status !== "Ditolak" && (
              <button
                onClick={() => setShowConfirm(true)}
                style={{
                  width: "100%",
                  padding: "11px",
                  borderRadius: 10,
                  border: "1px solid rgba(255,107,107,0.3)",
                  background: "rgba(255,107,107,0.06)",
                  fontFamily: "'Inter', sans-serif",
                  fontSize: 14,
                  fontWeight: 600,
                  color: "#ff6b6b",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 8,
                  transition: "background 0.15s",
                  marginBottom: 10,
                }}
                onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(255,107,107,0.12)")}
                onMouseLeave={(e) => (e.currentTarget.style.background = "rgba(255,107,107,0.06)")}
              >
                <X size={14} /> Tarik Lamaran
              </button>
            )}

            <button
              onClick={() => setShowContactModal(true)}
              style={{
                width: "100%",
                padding: "11px",
                borderRadius: 10,
                border: "1.5px solid rgba(22,119,255,0.3)",
                background: "#fff",
                fontFamily: "'Inter', sans-serif",
                fontSize: 14,
                fontWeight: 600,
                color: "#1677FF",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 8,
              }}
            >
              Hubungi Recruiter
            </button>

            {/* Summary info */}
            <div style={{
              marginTop: 24,
              paddingTop: 20,
              borderTop: "1px solid rgba(22,119,255,0.08)",
            }}>
              <div style={{ marginBottom: 12 }}>
                <div style={{ fontFamily: "'Inter', sans-serif", fontSize: 11, color: "#9ab4cc", marginBottom: 3 }}>Posisi</div>
                <div style={{ fontFamily: "'Poppins', sans-serif", fontSize: 13, fontWeight: 600, color: "#0A1B3D" }}>{app.posisi}</div>
              </div>
              <div style={{ marginBottom: 12 }}>
                <div style={{ fontFamily: "'Inter', sans-serif", fontSize: 11, color: "#9ab4cc", marginBottom: 3 }}>Perusahaan</div>
                <div style={{ fontFamily: "'Poppins', sans-serif", fontSize: 13, fontWeight: 600, color: "#0A1B3D" }}>{app.perusahaan}</div>
              </div>
              <div style={{ marginBottom: 12 }}>
                <div style={{ fontFamily: "'Inter', sans-serif", fontSize: 11, color: "#9ab4cc", marginBottom: 3 }}>Tanggal Melamar</div>
                <div style={{ fontFamily: "'Inter', sans-serif", fontSize: 13, color: "#4a6a9a" }}>{app.tanggal}</div>
              </div>
              <div>
                <div style={{ fontFamily: "'Inter', sans-serif", fontSize: 11, color: "#9ab4cc", marginBottom: 3 }}>Match Score</div>
                <div style={{
                  fontFamily: "'JetBrains Mono', monospace",
                  fontSize: 24,
                  fontWeight: 800,
                  color: "#1677FF",
                  lineHeight: 1,
                }}>
                  {app.match}%
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {showContactModal && <ContactRecruiterModal onClose={() => setShowContactModal(false)} />}
    </DashboardLayout>
  );
}
