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
  TrendingUp,
  AlertCircle,
  CheckCircle,
  Loader2,
  RefreshCw,
} from "lucide-react";
import { DashboardLayout } from "../components/DashboardLayout";
import type { SidebarItem } from "../components/DashboardLayout";
import { ChangeCareerTargetModal } from "../components/Modals";
import { useAppContext } from "../contexts/AppContext";
import {
  getSkillGapReport,
  createSkillGapReport,
  getTrainingRecommendations,
  type SkillGapReport,
  type CourseItem,
} from "../services/raviraApi";
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

export default function SkillGapPage() {
  const navigate = useNavigate();
  const { user } = useAppContext();
  const displayName = user?.fullName || "Kandidat";
  const displayInitial = (displayName[0] || "K").toUpperCase();

  const [showCareerModal, setShowCareerModal] = useState(false);
  const [expandedSkill, setExpandedSkill] = useState<string | null>(null);

  const [targetRole, setTargetRole] = useState<string>("Backend Engineer");
  const [report, setReport] = useState<SkillGapReport | null>(null);
  const [recommendedCourses, setRecommendedCourses] = useState<CourseItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadSkillGap = useCallback(async (roleToLoad: string, signal?: AbortSignal) => {
    setLoading(true);
    setError(null);
    try {
      const reportData = await getSkillGapReport({ targetRole: roleToLoad }, signal);
      if (signal?.aborted) return;
      setReport(reportData);

      try {
        const trainingData = await getTrainingRecommendations({ targetRole: roleToLoad }, signal);
        if (!signal?.aborted && trainingData.recommendations?.length > 0) {
          const courses = trainingData.recommendations.flatMap((r) => r.recommendedCourses);
          setRecommendedCourses(courses.slice(0, 3));
        }
      } catch {
        // Training recommendations error ignored
      }
    } catch (err) {
      if (!signal?.aborted) {
        setError(
          err instanceof Error ? err.message : "Gagal memuat analisis skill gap dari server."
        );
      }
    } finally {
      if (!signal?.aborted) {
        setLoading(false);
      }
    }
  }, []);

  useEffect(() => {
    const controller = new AbortController();
    queueMicrotask(() => {
      if (!controller.signal.aborted) {
        void loadSkillGap(targetRole, controller.signal);
      }
    });
    return () => controller.abort();
  }, [loadSkillGap, targetRole]);

  const handleUpdateCareerTarget = async (newTarget: string) => {
    setTargetRole(newTarget);
    try {
      const updated = await createSkillGapReport({ targetRole: newTarget });
      setReport(updated);
      toast.success(`Target posisi diubah menjadi ${newTarget}`);
      void loadSkillGap(newTarget);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Gagal memperbarui target posisi.");
    }
  };

  const matchedList = report?.matchedSkills ?? [];
  const missingList = report?.missingSkills ?? [];
  const priorityList = report?.prioritySkills ?? [];

  const matchedWeight = matchedList.reduce((sum, s) => sum + s.weight, 0);
  const missingWeight = missingList.reduce((sum, s) => sum + s.weight, 0);
  const totalWeight = matchedWeight + missingWeight;
  const overallMatchPct =
    totalWeight > 0
      ? Math.round((matchedWeight / totalWeight) * 100)
      : matchedList.length > 0
        ? 100
        : 0;

  const allSkillsForDisplay = [
    ...matchedList.map((m) => ({
      name: m.skillName,
      current: 100,
      target: 100,
      gap: 0,
      status: "Sudah Baik" as const,
      required: m.required,
      reason: "Skill ini sudah Anda kuasai dan cocok dengan requirement target posisi.",
    })),
    ...missingList.map((m) => {
      const priorityInfo = priorityList.find(
        (p) => p.skillName.toLowerCase() === m.skillName.toLowerCase()
      );
      return {
        name: m.skillName,
        current: 0,
        target: 100,
        gap: 100,
        status: "Perlu Ditingkatkan" as const,
        required: m.required,
        reason:
          priorityInfo?.reason?.join(" ") ||
          `Skill ini dibutuhkan pada pasar kerja ${
            m.marketDemandCount > 0 ? `(${m.marketDemandCount} lowongan)` : ""
          }.`,
      };
    }),
  ];

  const hasOwnedSkills = (report?.ownedSkills?.length ?? 0) > 0;

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
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: 16,
          boxShadow: "0 16px 40px rgba(8, 73, 168, 0.12)",
        }}
      >
        <div>
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
            Analisis Kompetensi
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
            Skill Gap Analysis
          </h1>
          <p
            style={{
              fontFamily: "'Inter', sans-serif",
              fontSize: 14.5,
              color: "rgba(255, 255, 255, 0.9)",
              margin: 0,
            }}
          >
            Identifikasi skill yang perlu ditingkatkan berdasarkan target karier nyata Anda.
          </p>
        </div>
        <button
          type="button"
          onClick={() => setShowCareerModal(true)}
          style={{
            padding: "12px 24px",
            minHeight: 44,
            borderRadius: 999,
            border: "none",
            background: "#D4FF59",
            color: "#0D1117",
            fontFamily: "'Inter', sans-serif",
            fontSize: 12,
            fontWeight: 700,
            letterSpacing: "0.06em",
            textTransform: "uppercase",
            cursor: "pointer",
          }}
        >
          Ubah Target Karier
        </button>
      </section>

      {loading && (
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            padding: "64px 24px",
            background: "#F4F5F7",
            borderRadius: 24,
            border: "1px solid #E2E8F0",
            gap: 12,
            marginBottom: 24,
          }}
        >
          <Loader2 size={32} className="animate-spin" color="#0E67CC" />
          <p style={{ fontFamily: "'Inter', sans-serif", fontSize: 14, color: "#4A5568", margin: 0 }}>
            Menganalisis kesenjangan kompetensi profil Anda...
          </p>
        </div>
      )}

      {!loading && error && (
        <div
          style={{
            background: "#FEF2F2",
            borderRadius: 24,
            border: "1px solid #FECACA",
            textAlign: "center",
            padding: "48px 24px",
            marginBottom: 28,
          }}
        >
          <AlertCircle size={40} color="#B91C1C" style={{ margin: "0 auto 12px" }} />
          <p style={{ fontFamily: "'Inter', sans-serif", fontSize: 14, color: "#991B1B", marginBottom: 16 }}>
            {error}
          </p>
          <button
            type="button"
            onClick={() => void loadSkillGap(targetRole)}
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

      {!loading && !error && !hasOwnedSkills && (
        <div
          style={{
            background: "#F4F5F7",
            borderRadius: 24,
            border: "1px solid #E2E8F0",
            textAlign: "center",
            padding: "48px 24px",
            marginBottom: 28,
          }}
        >
          <AlertCircle size={40} color="#0E67CC" style={{ margin: "0 auto 12px" }} />
          <h2
            style={{
              fontFamily: "'Poppins', sans-serif",
              fontSize: 18,
              fontWeight: 600,
              color: "#0D1117",
              marginBottom: 8,
            }}
          >
            Profil Keterampilan Belum Diisi
          </h2>
          <p
            style={{
              fontFamily: "'Inter', sans-serif",
              fontSize: 14,
              color: "#4A5568",
              maxWidth: 520,
              margin: "0 auto 20px",
              lineHeight: 1.6,
            }}
          >
            Anda belum menambahkan keahlian atau mengunggah CV. Tambahkan keterampilan pada menu
            profil Anda untuk melihat analisis perbandingan skill yang akurat.
          </p>
          <button
            type="button"
            onClick={() => navigate("/dashboard/kandidat/profil")}
            style={{
              padding: "10px 24px",
              minHeight: 44,
              borderRadius: 999,
              border: "none",
              background: "#0D1117",
              color: "#D4FF59",
              fontFamily: "'Inter', sans-serif",
              fontSize: 13,
              fontWeight: 700,
              cursor: "pointer",
            }}
          >
            Buka Profil Saya
          </button>
        </div>
      )}

      {!loading && !error && report && (
        <>
          {/* Overall match score + target posisi row */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
              gap: 18,
              marginBottom: 24,
            }}
          >
            {/* Match Score Card (Dark Bento) */}
            <div
              style={{
                background: "#0D1117",
                borderRadius: 24,
                padding: "26px",
                display: "flex",
                flexDirection: "column",
                gap: 16,
                color: "#FFFFFF",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <div
                  aria-hidden="true"
                  style={{
                    width: 40,
                    height: 40,
                    borderRadius: 12,
                    background: "#D4FF59",
                    color: "#0D1117",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <TrendingUp size={18} />
                </div>
                <div>
                  <div
                    style={{
                      fontFamily: "'Poppins', sans-serif",
                      fontSize: 14,
                      fontWeight: 600,
                      color: "#FFFFFF",
                    }}
                  >
                    Overall Match Score
                  </div>
                  <div style={{ fontFamily: "'Inter', sans-serif", fontSize: 12.5, color: "#CBD5E1" }}>
                    Terhadap target posisi {report.targetRole || targetRole}
                  </div>
                </div>
              </div>
              <div style={{ display: "flex", alignItems: "flex-end", gap: 6 }}>
                <span
                  style={{
                    fontFamily: "'Poppins', sans-serif",
                    fontSize: 48,
                    fontWeight: 600,
                    color: "#D4FF59",
                    lineHeight: 1,
                    letterSpacing: "-0.03em",
                  }}
                >
                  {overallMatchPct}
                </span>
                <span
                  style={{
                    fontFamily: "'Poppins', sans-serif",
                    fontSize: 24,
                    fontWeight: 600,
                    color: "#D4FF59",
                    marginBottom: 4,
                  }}
                >
                  %
                </span>
                <span
                  style={{
                    fontFamily: "'Inter', sans-serif",
                    fontSize: 13,
                    color: "#CBD5E1",
                    marginBottom: 6,
                    marginLeft: 4,
                  }}
                >
                  / 100%
                </span>
              </div>
              <div
                style={{
                  position: "relative",
                  height: 8,
                  background: "rgba(255, 255, 255, 0.14)",
                  borderRadius: 999,
                  overflow: "hidden",
                }}
              >
                <div
                  style={{
                    height: "100%",
                    width: `${overallMatchPct}%`,
                    borderRadius: 999,
                    background: "#D4FF59",
                  }}
                />
              </div>
              <div style={{ fontFamily: "'Inter', sans-serif", fontSize: 13, color: "#CBD5E1" }}>
                {missingList.length > 0
                  ? `Tingkatkan ${missingList.length} skill untuk mencapai 100% match`
                  : "Semua skill utama target posisi telah Anda kuasai."}
              </div>
            </div>

            {/* Target Posisi Card (Light Bento) */}
            <div
              style={{
                background: "#F4F5F7",
                borderRadius: 24,
                border: "1px solid #E2E8F0",
                padding: "26px",
                display: "flex",
                flexDirection: "column",
                gap: 14,
              }}
            >
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <div
                  style={{
                    fontFamily: "'Poppins', sans-serif",
                    fontSize: 14,
                    fontWeight: 600,
                    color: "#0D1117",
                  }}
                >
                  Target Posisi
                </div>
                <button
                  type="button"
                  onClick={() => setShowCareerModal(true)}
                  style={{
                    fontFamily: "'Inter', sans-serif",
                    fontSize: 12,
                    fontWeight: 600,
                    padding: "7px 14px",
                    borderRadius: 999,
                    border: "1px solid #CBD5E1",
                    background: "#FFFFFF",
                    color: "#0D1117",
                    cursor: "pointer",
                  }}
                >
                  Ubah Target Karier
                </button>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
                <div
                  aria-hidden="true"
                  style={{
                    width: 48,
                    height: 48,
                    borderRadius: 14,
                    background: "#0E67CC",
                    color: "#FFFFFF",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexShrink: 0,
                  }}
                >
                  <Briefcase size={22} />
                </div>
                <div>
                  <div
                    style={{
                      fontFamily: "'Poppins', sans-serif",
                      fontSize: 18,
                      fontWeight: 600,
                      color: "#0D1117",
                    }}
                  >
                    {report.targetRole || targetRole}
                  </div>
                  <div
                    style={{
                      fontFamily: "'Inter', sans-serif",
                      fontSize: 13,
                      color: "#4A5568",
                      marginTop: 2,
                    }}
                  >
                    Kategori: Rekayasa Perangkat Lunak &amp; Teknologi
                  </div>
                </div>
              </div>
              <div style={{ display: "flex", gap: 8, marginTop: 4, flexWrap: "wrap" }}>
                {matchedList.slice(0, 4).map((m) => (
                  <span
                    key={m.skillName}
                    style={{
                      fontFamily: "'Inter', sans-serif",
                      fontSize: 11.5,
                      fontWeight: 500,
                      padding: "4px 12px",
                      borderRadius: 999,
                      background: "#FFFFFF",
                      color: "#0D1117",
                      border: "1px solid #E2E8F0",
                    }}
                  >
                    {m.skillName}
                  </span>
                ))}
              </div>
              <div
                style={{
                  marginTop: "auto",
                  padding: "12px 14px",
                  borderRadius: 14,
                  background: "#FFFFFF",
                  border: "1px solid #E2E8F0",
                  fontFamily: "'Inter', sans-serif",
                  fontSize: 12.5,
                  color: "#4A5568",
                }}
              >
                <strong style={{ color: "#0D1117" }}>{missingList.length} skill</strong> perlu
                ditingkatkan · <strong style={{ color: "#0D1117" }}>{matchedList.length} skill</strong>{" "}
                sudah memenuhi target
              </div>
            </div>
          </div>

          {/* Skill Items Grid */}
          <div
            style={{
              background: "#F4F5F7",
              borderRadius: 24,
              border: "1px solid #E2E8F0",
              padding: "24px",
              marginBottom: 24,
            }}
          >
            <div
              style={{
                fontFamily: "'Poppins', sans-serif",
                fontSize: 18,
                fontWeight: 600,
                color: "#0D1117",
                marginBottom: 18,
              }}
            >
              Detail Skill Gap
            </div>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
                gap: 14,
              }}
            >
              {allSkillsForDisplay.map((skill) => {
                const isBad = skill.status === "Perlu Ditingkatkan";
                const isExpanded = expandedSkill === skill.name;
                return (
                  <div
                    key={skill.name}
                    onClick={() => setExpandedSkill(isExpanded ? null : skill.name)}
                    style={{
                      padding: "18px",
                      borderRadius: 18,
                      border: `1px solid ${isExpanded ? "#0E67CC" : "#E2E8F0"}`,
                      background: "#FFFFFF",
                      cursor: "pointer",
                      transition: "border-color 0.15s ease",
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        marginBottom: 12,
                      }}
                    >
                      <span
                        style={{
                          fontFamily: "'Poppins', sans-serif",
                          fontSize: 14,
                          fontWeight: 600,
                          color: "#0D1117",
                        }}
                      >
                        {skill.name}
                      </span>
                      <span
                        style={{
                          display: "inline-flex",
                          alignItems: "center",
                          gap: 4,
                          fontFamily: "'Inter', sans-serif",
                          fontSize: 11,
                          fontWeight: 700,
                          padding: "4px 10px",
                          borderRadius: 999,
                          background: isBad ? "#FEF3C7" : "#D4FF59",
                          color: "#0D1117",
                        }}
                      >
                        {isBad ? <AlertCircle size={11} /> : <CheckCircle size={11} />}
                        {skill.status}
                      </span>
                    </div>

                    {/* Bar */}
                    <div
                      style={{
                        position: "relative",
                        height: 6,
                        background: "#E2E8F0",
                        borderRadius: 999,
                        marginBottom: 8,
                        overflow: "hidden",
                      }}
                    >
                      <div
                        style={{
                          height: "100%",
                          width: `${skill.current}%`,
                          borderRadius: 999,
                          background: "#0E67CC",
                        }}
                      />
                    </div>

                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        fontFamily: "'Inter', sans-serif",
                        fontSize: 11.5,
                      }}
                    >
                      <span style={{ color: "#0D1117", fontWeight: 600 }}>
                        Level saat ini: {skill.current}%
                      </span>
                      <span style={{ color: "#4A5568" }}>Target: {skill.target}%</span>
                    </div>

                    {isBad && (
                      <div
                        style={{
                          marginTop: 8,
                          fontFamily: "'Inter', sans-serif",
                          fontSize: 11.5,
                          color: "#B45309",
                          fontWeight: 600,
                        }}
                      >
                        Gap: 100% belum dimiliki
                      </div>
                    )}

                    {/* Expanded detail */}
                    {isExpanded && (
                      <div
                        onClick={(e) => e.stopPropagation()}
                        style={{
                          marginTop: 14,
                          padding: "14px 16px",
                          borderRadius: 14,
                          background: "#F4F5F7",
                          border: "1px solid #E2E8F0",
                        }}
                      >
                        <div
                          style={{
                            fontFamily: "'Inter', sans-serif",
                            fontSize: 12,
                            color: "#4A5568",
                            marginBottom: isBad ? 12 : 0,
                            lineHeight: 1.5,
                          }}
                        >
                          {skill.reason}
                        </div>
                        {isBad && (
                          <button
                            type="button"
                            onClick={() => navigate("/dashboard/kandidat/pelatihan")}
                            style={{
                              fontFamily: "'Inter', sans-serif",
                              fontSize: 12,
                              fontWeight: 700,
                              padding: "8px 16px",
                              borderRadius: 999,
                              border: "none",
                              background: "#0D1117",
                              color: "#D4FF59",
                              cursor: "pointer",
                            }}
                          >
                            Cari Pelatihan Terkait
                          </button>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Rekomendasi Pelatihan */}
          {recommendedCourses.length > 0 && (
            <div
              style={{
                background: "#F4F5F7",
                borderRadius: 24,
                border: "1px solid #E2E8F0",
                padding: "24px",
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  marginBottom: 18,
                  flexWrap: "wrap",
                  gap: 12,
                }}
              >
                <div>
                  <div
                    style={{
                      fontFamily: "'Poppins', sans-serif",
                      fontSize: 18,
                      fontWeight: 600,
                      color: "#0D1117",
                    }}
                  >
                    Rekomendasi Pelatihan
                  </div>
                  <div
                    style={{
                      fontFamily: "'Inter', sans-serif",
                      fontSize: 13,
                      color: "#4A5568",
                      marginTop: 2,
                    }}
                  >
                    Dipilih AI berdasarkan skill gap prioritas Anda
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => navigate("/dashboard/kandidat/pelatihan")}
                  style={{
                    fontFamily: "'Inter', sans-serif",
                    fontSize: 13,
                    fontWeight: 600,
                    padding: "8px 18px",
                    borderRadius: 999,
                    border: "1px solid #CBD5E1",
                    background: "#FFFFFF",
                    color: "#0D1117",
                    cursor: "pointer",
                  }}
                >
                  Lihat Semua
                </button>
              </div>

              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
                  gap: 16,
                }}
              >
                {recommendedCourses.map((rec) => (
                  <div
                    key={rec.id}
                    style={{
                      padding: "20px",
                      borderRadius: 18,
                      border: "1px solid #E2E8F0",
                      background: "#FFFFFF",
                      display: "flex",
                      flexDirection: "column",
                      justifyContent: "space-between",
                    }}
                  >
                    <div>
                      <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 12 }}>
                        <div
                          aria-hidden="true"
                          style={{
                            width: 40,
                            height: 40,
                            borderRadius: 12,
                            background: "#0D1117",
                            color: "#D4FF59",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            flexShrink: 0,
                          }}
                        >
                          <BookOpen size={18} />
                        </div>
                        <div>
                          <div
                            style={{
                              fontFamily: "'Poppins', sans-serif",
                              fontSize: 14,
                              fontWeight: 600,
                              color: "#0D1117",
                            }}
                          >
                            {rec.title}
                          </div>
                          <div
                            style={{
                              fontFamily: "'Inter', sans-serif",
                              fontSize: 12,
                              color: "#4A5568",
                            }}
                          >
                            {rec.provider}
                          </div>
                        </div>
                      </div>

                      <div style={{ display: "flex", gap: 8, marginBottom: 12, flexWrap: "wrap" }}>
                        <span
                          style={{
                            fontFamily: "'Inter', sans-serif",
                            fontSize: 11.5,
                            fontWeight: 500,
                            padding: "3px 10px",
                            borderRadius: 999,
                            background: "#F4F5F7",
                            color: "#0D1117",
                          }}
                        >
                          {rec.duration}
                        </span>
                        <span
                          style={{
                            fontFamily: "'Inter', sans-serif",
                            fontSize: 11.5,
                            fontWeight: 500,
                            padding: "3px 10px",
                            borderRadius: 999,
                            background: "#F4F5F7",
                            color: "#0D1117",
                          }}
                        >
                          {rec.difficulty}
                        </span>
                      </div>

                      <div
                        style={{
                          fontFamily: "'Inter', sans-serif",
                          fontSize: 12,
                          color: "#4A5568",
                          marginBottom: 16,
                        }}
                      >
                        Target:{" "}
                        <strong style={{ color: "#0D1117" }}>{rec.skillTargets.join(", ")}</strong>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => navigate("/dashboard/kandidat/pelatihan")}
                      style={{
                        width: "100%",
                        minHeight: 42,
                        fontFamily: "'Inter', sans-serif",
                        fontSize: 13,
                        fontWeight: 700,
                        padding: "9px",
                        borderRadius: 999,
                        border: "none",
                        background: "#0D1117",
                        color: "#D4FF59",
                        cursor: "pointer",
                      }}
                    >
                      Mulai Pelatihan
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </>
      )}

      {showCareerModal && (
        <ChangeCareerTargetModal
          currentTarget={report?.targetRole || targetRole}
          onSelectTarget={(newTarget) => void handleUpdateCareerTarget(newTarget)}
          onClose={() => setShowCareerModal(false)}
        />
      )}
    </DashboardLayout>
  );
}
