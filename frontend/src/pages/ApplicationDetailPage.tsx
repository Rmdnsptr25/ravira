import { useCallback, useEffect, useState } from "react";
import { useParams, useNavigate, useSearchParams } from "react-router";
import {
  Home,
  Briefcase,
  Bookmark,
  BarChart2,
  BookOpen,
  FileText,
  Globe,
  User,
  Settings,
  ArrowLeft,
  CheckCircle,
  Clock,
  Calendar,
  Loader2,
  AlertCircle,
  Building2,
  MapPin,
} from "lucide-react";
import { DashboardLayout } from "../components/DashboardLayout";
import type { SidebarItem } from "../components/DashboardLayout";
import { useAppContext } from "../contexts/AppContext";
import {
  getApplicationById,
  getApplicationStatusHistory,
  getJobMatchScore,
  type ApplicationDetail,
  type ApplicationStatusHistoryItem,
} from "../services/raviraApi";

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

function mapBackendStatusToAppStatus(status: string): AppStatus {
  switch (status) {
    case "SCREENING":
    case "SELEKSI_TAHAP_1":
    case "SELEKSI_TAHAP_2":
    case "NEED_VERIFICATION":
      return "Screening";
    case "INTERVIEW":
      return "Interview";
    case "ACCEPTED":
      return "Diterima";
    case "REJECTED":
      return "Ditolak";
    default:
      return "Dikirim";
  }
}

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
    case "Diterima":
      return { background: "rgba(16,217,142,0.15)", color: "#059669", border: "1px solid rgba(16,217,142,0.4)" };
    case "Ditolak":
      return { background: "rgba(255,107,107,0.1)", color: "#ff6b6b", border: "1px solid rgba(255,107,107,0.25)" };
  }
}

function formatDate(dateStr: string): string {
  try {
    return new Intl.DateTimeFormat("id-ID", {
      day: "numeric",
      month: "long",
      year: "numeric",
    }).format(new Date(dateStr));
  } catch {
    return dateStr;
  }
}

export default function ApplicationDetailPage() {
  const { id: paramId } = useParams<{ id: string }>();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { user } = useAppContext();

  const applicationId = paramId || searchParams.get("id") || "";

  const [application, setApplication] = useState<ApplicationDetail | null>(null);
  const [statusHistory, setStatusHistory] = useState<ApplicationStatusHistoryItem[]>([]);
  const [matchScore, setMatchScore] = useState<number>(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const displayName = user?.fullName || "Kandidat";
  const displayInitial = (displayName[0] || "K").toUpperCase();

  const loadApplication = useCallback(async (signal?: AbortSignal) => {
    if (!applicationId) {
      setError("ID lamaran tidak ditemukan pada parameter URL.");
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const [appData, historyData] = await Promise.all([
        getApplicationById(applicationId, signal),
        getApplicationStatusHistory(applicationId, signal).catch(() => [] as ApplicationStatusHistoryItem[]),
      ]);

      if (signal?.aborted) return;
      setApplication(appData);
      setStatusHistory(historyData);

      if (appData?.job?.id) {
        try {
          const matchResult = await getJobMatchScore(appData.job.id, signal);
          if (!signal?.aborted) {
            setMatchScore(matchResult.matchScore);
          }
        } catch {
          // If match score calculation not available, fallback to 0
        }
      }
    } catch (err) {
      if (!signal?.aborted) {
        setError(err instanceof Error ? err.message : "Lamaran tidak ditemukan atau Anda tidak memiliki akses ke lamaran ini.");
      }
    } finally {
      if (!signal?.aborted) {
        setLoading(false);
      }
    }
  }, [applicationId]);

  useEffect(() => {
    const controller = new AbortController();
    queueMicrotask(() => {
      if (!controller.signal.aborted) {
        void loadApplication(controller.signal);
      }
    });
    return () => controller.abort();
  }, [loadApplication]);

  if (loading) {
    return (
      <DashboardLayout sidebarItems={sidebarItems} userName={displayName} userRole="Kandidat" userInitial={displayInitial}>
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "80px 24px", background: "#fff", borderRadius: 18, border: "1px solid rgba(22,119,255,0.1)", gap: 12 }}>
          <Loader2 size={36} className="animate-spin" color="#1677FF" />
          <p style={{ fontFamily: "'Inter', sans-serif", fontSize: 14, color: "#6a88b8", margin: 0 }}>
            Memuat detail status lamaran...
          </p>
        </div>
      </DashboardLayout>
    );
  }

  if (error || !application) {
    return (
      <DashboardLayout sidebarItems={sidebarItems} userName={displayName} userRole="Kandidat" userInitial={displayInitial}>
        <div style={{ background: "#fff", borderRadius: 16, border: "1px solid rgba(239,68,68,0.2)", padding: "64px 24px", textAlign: "center" }}>
          <AlertCircle size={48} color="#dc2626" style={{ margin: "0 auto 16px" }} />
          <h2 style={{ fontFamily: "'Poppins', sans-serif", fontSize: 18, fontWeight: 700, color: "#0A1B3D", marginBottom: 8 }}>
            Lamaran Tidak Ditemukan
          </h2>
          <p style={{ fontFamily: "'Inter', sans-serif", fontSize: 14, color: "#6a88b8", maxWidth: 460, margin: "0 auto 24px" }}>
            {error || "Data lamaran tidak ditemukan atau Anda tidak memiliki izin untuk melihat lamaran ini."}
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

  const appStatus = mapBackendStatusToAppStatus(application.status);
  const badge = getStatusStyle(appStatus);
  const currentStep = statusOrder[appStatus];

  // Build standard timeline steps
  const standardSteps = [
    { label: "Lamaran Dikirim", description: "Lamaran Anda telah berhasil dikirimkan ke perusahaan.", stage: "APPLIED" },
    { label: "Screening", description: "CV dan profil Anda sedang ditinjau oleh tim rekrutmen.", stage: "SCREENING" },
    { label: "Interview", description: "Wawancara dengan tim hiring atau technical team.", stage: "INTERVIEW" },
    { label: "Offer / Keputusan", description: "Tahap evaluasi penawaran atau keputusan seleksi.", stage: "ACCEPTED" },
  ];

  return (
    <DashboardLayout
      sidebarItems={sidebarItems}
      userName={displayName}
      userRole="Kandidat"
      userInitial={displayInitial}
    >
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
                  {application.job.title}
                </h1>
                <p style={{ fontFamily: "'Inter', sans-serif", fontSize: 15, color: "#6a88b8", marginBottom: 14 }}>
                  {application.job.company.name} · {application.job.location ?? "-"}
                </p>
                <div style={{ display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap" }}>
                  <span style={{
                    padding: "5px 14px",
                    borderRadius: 20,
                    fontFamily: "'Inter', sans-serif",
                    fontSize: 12,
                    fontWeight: 600,
                    ...badge,
                  }}>
                    {appStatus}
                  </span>
                  <span style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 5,
                    fontFamily: "'Inter', sans-serif",
                    fontSize: 13,
                    color: "#6a88b8",
                  }}>
                    <Calendar size={13} /> Dikirim {formatDate(application.createdAt)}
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
                  {matchScore}%
                </div>
                <div style={{ fontFamily: "'Inter', sans-serif", fontSize: 11, color: "#9ab4cc" }}>AI Match Score</div>
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
              Tahap Seleksi Lamaran
            </h2>

            <div style={{ position: "relative" }}>
              {standardSteps.map((step, idx) => {
                const isDone = currentStep >= idx && appStatus !== "Ditolak";
                const isCurrent = currentStep === idx && appStatus !== "Ditolak";
                const isFuture = !isDone && !isCurrent;
                const isLast = idx === standardSteps.length - 1;

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
                            Saat ini
                          </span>
                        )}
                      </div>
                      <p style={{
                        fontFamily: "'Inter', sans-serif",
                        fontSize: 13,
                        color: textColor,
                        lineHeight: 1.5,
                        margin: 0,
                      }}>
                        {step.description}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Status Change Log Audit Trail */}
          {statusHistory.length > 0 && (
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
                marginBottom: 16,
              }}>
                Riwayat Transisi Status (Audit Trail)
              </h2>
              <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                {statusHistory.map((h) => (
                  <div key={h.id} style={{ padding: "12px 16px", borderRadius: 10, background: "#f8fbff", border: "1px solid rgba(22,119,255,0.1)" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 4 }}>
                      <span style={{ fontFamily: "'Inter', sans-serif", fontSize: 13, fontWeight: 600, color: "#0A1B3D" }}>
                        Status: {h.toStatus}
                      </span>
                      <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11, color: "#6a88b8" }}>
                        {formatDate(h.createdAt)}
                      </span>
                    </div>
                    {h.reason && (
                      <p style={{ fontFamily: "'Inter', sans-serif", fontSize: 12, color: "#4a6a9a", margin: 0 }}>
                        Catatan: {h.reason}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Cover Letter Section */}
          <div style={{
            background: "#fff",
            borderRadius: 18,
            border: "1px solid rgba(22,119,255,0.1)",
            boxShadow: "0 2px 12px rgba(10,27,61,0.05)",
            padding: "28px",
          }}>
            <h2 style={{
              fontFamily: "'Poppins', sans-serif",
              fontSize: 16,
              fontWeight: 700,
              color: "#0A1B3D",
              marginBottom: 14,
            }}>
              Cover Letter yang Dikirim
            </h2>
            <div style={{
              padding: "16px 20px",
              borderRadius: 12,
              background: "#f8fbff",
              border: "1px solid rgba(22,119,255,0.12)",
              fontFamily: "'Inter', sans-serif",
              fontSize: 14,
              color: "#3a5480",
              lineHeight: 1.7,
              whiteSpace: "pre-line",
            }}>
              {application.coverLetter || "Tidak ada cover letter khusus yang disertakan pada lamaran ini."}
            </div>
          </div>
        </div>

        {/* Right column */}
        <div>
          {/* Company details */}
          <div style={{
            background: "#fff",
            borderRadius: 18,
            border: "1px solid rgba(22,119,255,0.1)",
            boxShadow: "0 2px 12px rgba(10,27,61,0.05)",
            padding: "24px",
            marginBottom: 20,
          }}>
            <h3 style={{
              fontFamily: "'Poppins', sans-serif",
              fontSize: 15,
              fontWeight: 700,
              color: "#0A1B3D",
              marginBottom: 14,
            }}>
              Informasi Perusahaan
            </h3>
            <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 14 }}>
              <div style={{
                width: 44,
                height: 44,
                borderRadius: 12,
                background: "linear-gradient(135deg, #1677FF, #4DB8FF)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "#fff",
              }}>
                <Building2 size={20} />
              </div>
              <div>
                <div style={{ fontFamily: "'Poppins', sans-serif", fontSize: 14, fontWeight: 700, color: "#0A1B3D" }}>
                  {application.job.company.name}
                </div>
                <div style={{ fontFamily: "'Inter', sans-serif", fontSize: 12, color: "#6a88b8" }}>
                  {application.job.company.industry || "Industri Teknologi"}
                </div>
              </div>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 6, fontFamily: "'Inter', sans-serif", fontSize: 12, color: "#6a88b8" }}>
              <MapPin size={13} /> {application.job.location || "Wilayah Jawa"}
            </div>
          </div>

          {/* Quick link to job */}
          <div style={{
            background: "#f0f7ff",
            borderRadius: 18,
            border: "1px solid rgba(22,119,255,0.15)",
            padding: "24px",
          }}>
            <h3 style={{
              fontFamily: "'Poppins', sans-serif",
              fontSize: 14,
              fontWeight: 700,
              color: "#0A1B3D",
              marginBottom: 10,
            }}>
              Rincian Lowongan Asli
            </h3>
            <p style={{
              fontFamily: "'Inter', sans-serif",
              fontSize: 13,
              color: "#6a88b8",
              lineHeight: 1.5,
              marginBottom: 16,
            }}>
              Ingin meninjau kembali deskripsi lengkap atau persyaratan posisi ini?
            </p>
            <button
              onClick={() => navigate(`/dashboard/kandidat/pekerjaan/${application.job.id}`)}
              style={{
                width: "100%",
                padding: "10px",
                borderRadius: 10,
                border: "none",
                background: "linear-gradient(135deg, #1677FF, #0D47A1)",
                color: "#fff",
                fontFamily: "'Inter', sans-serif",
                fontSize: 13,
                fontWeight: 600,
                cursor: "pointer",
              }}
            >
              Lihat Detail Lowongan
            </button>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
