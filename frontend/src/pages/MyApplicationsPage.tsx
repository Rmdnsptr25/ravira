import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router";
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
  MapPin,
  Calendar,
  ChevronRight,
  CheckCircle,
  Circle,
  Loader2,
  RefreshCw,
} from "lucide-react";
import { DashboardLayout } from "../components/DashboardLayout";
import type { SidebarItem } from "../components/DashboardLayout";
import { useAppContext } from "../contexts/AppContext";
import type { AppStatus } from "../contexts/AppContext";

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

const tabs: Array<AppStatus | "Semua"> = [
  "Semua",
  "Dikirim",
  "Screening",
  "Interview",
  "Offer",
  "Diterima",
  "Ditolak",
];

const timelineSteps = ["Dikirim", "Screening", "Interview", "Offer", "Diterima"];

const statusOrder: Record<AppStatus, number> = {
  Dikirim: 0,
  Screening: 1,
  Interview: 2,
  Offer: 3,
  Diterima: 4,
  Ditolak: -1,
};

function getStatusStyle(status: AppStatus): { background: string; color: string; border: string } {
  switch (status) {
    case "Offer":
    case "Diterima":
      return { background: "#D4FF59", color: "#0D1117", border: "none" };
    case "Ditolak":
      return { background: "#FEF2F2", color: "#991B1B", border: "1px solid #FECACA" };
    default:
      return { background: "#FFFFFF", color: "#0D1117", border: "1px solid #CBD5E1" };
  }
}

export default function MyApplicationsPage() {
  const navigate = useNavigate();
  const { applications, refreshApplications, user } = useAppContext();
  const displayName = user?.fullName || "Kandidat";
  const displayInitial = (displayName[0] || "K").toUpperCase();

  const [activeTab, setActiveTab] = useState<AppStatus | "Semua">("Semua");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      await refreshApplications();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Gagal memperbarui daftar lamaran.");
    } finally {
      setLoading(false);
    }
  }, [refreshApplications]);

  useEffect(() => {
    queueMicrotask(() => {
      void loadData();
    });
  }, [loadData]);

  const filtered =
    activeTab === "Semua" ? applications : applications.filter((a) => a.status === activeTab);

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
          Pelacakan Lamaran
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
          Lamaran Saya
        </h1>
        <p
          style={{
            fontFamily: "'Inter', sans-serif",
            fontSize: 14.5,
            color: "rgba(255, 255, 255, 0.9)",
            margin: 0,
          }}
        >
          Pantau status semua lamaran kerja Anda dalam satu tempat.
        </p>
      </section>

      {/* Pill Tab bar */}
      <div
        style={{
          display: "flex",
          gap: 8,
          marginBottom: 24,
          flexWrap: "wrap",
        }}
      >
        {tabs.map((tab) => {
          const isActive = activeTab === tab;
          const count =
            tab === "Semua"
              ? applications.length
              : applications.filter((a) => a.status === tab).length;
          return (
            <button
              key={tab}
              type="button"
              onClick={() => setActiveTab(tab)}
              style={{
                padding: "9px 18px",
                minHeight: 40,
                borderRadius: 999,
                border: isActive ? "none" : "1px solid #E2E8F0",
                cursor: "pointer",
                fontFamily: "'Inter', sans-serif",
                fontSize: 13,
                fontWeight: 600,
                color: isActive ? "#D4FF59" : "#0D1117",
                background: isActive ? "#0D1117" : "#F4F5F7",
                transition: "all 0.15s ease",
                display: "inline-flex",
                alignItems: "center",
                gap: 6,
              }}
            >
              {tab}
              <span
                style={{
                  fontFamily: "'Inter', sans-serif",
                  fontSize: 11,
                  fontWeight: 700,
                  padding: "2px 8px",
                  borderRadius: 999,
                  background: isActive ? "rgba(212, 255, 89, 0.2)" : "#FFFFFF",
                  color: isActive ? "#D4FF59" : "#0D1117",
                }}
              >
                {count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Application cards */}
      <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
        {loading && applications.length === 0 && (
          <div
            style={{
              background: "#F4F5F7",
              borderRadius: 24,
              border: "1px solid #E2E8F0",
              padding: "48px 24px",
              textAlign: "center",
            }}
          >
            <Loader2 size={36} className="animate-spin" color="#0E67CC" style={{ margin: "0 auto 12px" }} />
            <p style={{ fontFamily: "'Inter', sans-serif", fontSize: 14, color: "#4A5568", margin: 0 }}>
              Memuat data riwayat lamaran Anda...
            </p>
          </div>
        )}

        {!loading && error && applications.length === 0 && (
          <div
            style={{
              background: "#FEF2F2",
              borderRadius: 24,
              border: "1px solid #FECACA",
              padding: "48px 24px",
              textAlign: "center",
            }}
          >
            <p style={{ fontFamily: "'Inter', sans-serif", fontSize: 14, color: "#991B1B", marginBottom: 16 }}>
              {error}
            </p>
            <button
              type="button"
              onClick={() => void loadData()}
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 6,
                padding: "10px 22px",
                minHeight: 42,
                borderRadius: 999,
                background: "#0D1117",
                color: "#D4FF59",
                border: "none",
                cursor: "pointer",
                fontFamily: "'Inter', sans-serif",
                fontSize: 13,
                fontWeight: 700,
              }}
            >
              <RefreshCw size={14} /> Coba Lagi
            </button>
          </div>
        )}

        {!loading && !error && filtered.length === 0 && (
          <div
            style={{
              background: "#F4F5F7",
              borderRadius: 24,
              border: "1px solid #E2E8F0",
              padding: "56px 24px",
              textAlign: "center",
            }}
          >
            <FileText size={40} color="#0E67CC" style={{ margin: "0 auto 12px" }} />
            <p style={{ fontFamily: "'Inter', sans-serif", fontSize: 14, color: "#4A5568", margin: 0 }}>
              Tidak ada lamaran dengan status ini.
            </p>
          </div>
        )}

        {filtered.map((app) => {
          const badge = getStatusStyle(app.status);
          const currentStep = statusOrder[app.status];
          const isRejected = app.status === "Ditolak";

          return (
            <div
              key={app.id}
              style={{
                background: "#F4F5F7",
                borderRadius: 24,
                border: "1px solid #E2E8F0",
                padding: "24px",
              }}
            >
              {/* Card top row */}
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "flex-start",
                  gap: 16,
                  marginBottom: 16,
                  flexWrap: "wrap",
                }}
              >
                <div style={{ flex: 1, minWidth: 200 }}>
                  <div
                    style={{
                      fontFamily: "'Poppins', sans-serif",
                      fontSize: 17,
                      fontWeight: 600,
                      color: "#0D1117",
                      marginBottom: 4,
                    }}
                  >
                    {app.posisi}
                  </div>
                  <div
                    style={{
                      fontFamily: "'Inter', sans-serif",
                      fontSize: 13.5,
                      color: "#4A5568",
                      marginBottom: 8,
                    }}
                  >
                    {app.perusahaan}
                  </div>
                  <div style={{ display: "flex", gap: 16, flexWrap: "wrap" }}>
                    <span
                      style={{
                        display: "inline-flex",
                        alignItems: "center",
                        gap: 4,
                        fontFamily: "'Inter', sans-serif",
                        fontSize: 12.5,
                        color: "#4A5568",
                      }}
                    >
                      <MapPin size={12} /> {app.lokasi}
                    </span>
                    <span
                      style={{
                        display: "inline-flex",
                        alignItems: "center",
                        gap: 4,
                        fontFamily: "'Inter', sans-serif",
                        fontSize: 12.5,
                        color: "#4A5568",
                      }}
                    >
                      <Calendar size={12} /> {app.tanggal}
                    </span>
                  </div>
                </div>

                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 12,
                    flexShrink: 0,
                  }}
                >
                  <span
                    style={{
                      padding: "5px 14px",
                      borderRadius: 999,
                      fontFamily: "'Inter', sans-serif",
                      fontSize: 12,
                      fontWeight: 700,
                      ...badge,
                    }}
                  >
                    {app.status}
                  </span>
                  <div
                    style={{
                      textAlign: "right",
                      background: "#0D1117",
                      padding: "8px 14px",
                      borderRadius: 14,
                    }}
                  >
                    <div
                      style={{
                        fontFamily: "'Poppins', sans-serif",
                        fontSize: 18,
                        fontWeight: 700,
                        color: "#D4FF59",
                        lineHeight: 1,
                      }}
                    >
                      {app.match}%
                    </div>
                    <div style={{ fontFamily: "'Inter', sans-serif", fontSize: 10, color: "#CBD5E1" }}>
                      match score
                    </div>
                  </div>
                </div>
              </div>

              {/* Mini horizontal timeline */}
              <div
                style={{
                  background: "#FFFFFF",
                  borderRadius: 16,
                  padding: "16px 18px",
                  marginBottom: 16,
                  border: "1px solid #E2E8F0",
                }}
              >
                <div style={{ display: "flex", alignItems: "center" }}>
                  {timelineSteps.map((step, idx) => {
                    const isDone = !isRejected && currentStep >= idx;
                    const isCurrent = !isRejected && currentStep === idx;
                    const isLast = idx === timelineSteps.length - 1;

                    const nodeColor = isDone
                      ? "#0E67CC"
                      : isRejected && step === "Diterima"
                        ? "#B91C1C"
                        : "#CBD5E1";
                    const lineColor = !isRejected && currentStep > idx ? "#0E67CC" : "#E2E8F0";

                    return (
                      <div
                        key={step}
                        style={{ display: "flex", alignItems: "center", flex: isLast ? "0 0 auto" : 1 }}
                      >
                        <div
                          style={{
                            display: "flex",
                            flexDirection: "column",
                            alignItems: "center",
                            gap: 4,
                          }}
                        >
                          <div
                            style={{
                              width: 22,
                              height: 22,
                              borderRadius: "50%",
                              background: isDone ? nodeColor : "transparent",
                              border: `2px solid ${nodeColor}`,
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              flexShrink: 0,
                            }}
                          >
                            {isDone && <CheckCircle size={12} color="#FFFFFF" strokeWidth={3} />}
                            {!isDone && <Circle size={8} color={nodeColor} strokeWidth={2.5} />}
                          </div>
                          <span
                            style={{
                              fontFamily: "'Inter', sans-serif",
                              fontSize: 10.5,
                              fontWeight: isCurrent ? 700 : 500,
                              color: isCurrent ? "#0D1117" : isDone ? "#0D1117" : "#4A5568",
                              whiteSpace: "nowrap",
                            }}
                          >
                            {step}
                          </span>
                        </div>
                        {!isLast && (
                          <div
                            style={{
                              flex: 1,
                              height: 2,
                              background: lineColor,
                              marginBottom: 18,
                              marginLeft: 4,
                              marginRight: 4,
                              borderRadius: 1,
                            }}
                          />
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Action button */}
              <div style={{ display: "flex", justifyContent: "flex-end" }}>
                <button
                  type="button"
                  onClick={() => navigate(`/dashboard/kandidat/lamaran/${app.id}`)}
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: 6,
                    padding: "9px 22px",
                    minHeight: 40,
                    borderRadius: 999,
                    border: "none",
                    background: "#0D1117",
                    fontFamily: "'Inter', sans-serif",
                    fontSize: 13,
                    fontWeight: 700,
                    color: "#D4FF59",
                    cursor: "pointer",
                  }}
                >
                  Lihat Status <ChevronRight size={14} />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </DashboardLayout>
  );
}
