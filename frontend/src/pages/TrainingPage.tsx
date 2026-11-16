import { useCallback, useEffect, useMemo, useState } from "react";
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
  Clock,
  Play,
  Loader2,
  AlertCircle,
  RefreshCw,
  ExternalLink,
} from "lucide-react";
import { toast } from "sonner";
import { DashboardLayout } from "../components/DashboardLayout";
import type { SidebarItem } from "../components/DashboardLayout";
import { useAppContext } from "../contexts/AppContext";
import {
  getTrainingRecommendations,
  listMyTrainingProgress,
  createTrainingProgress,
  updateTrainingProgress,
  type CourseItem,
  type TrainingProgressItem,
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

type TrainingStatus = "Sedang Berjalan" | "Belum Dimulai" | "Selesai";

interface TrainingItemForDisplay {
  id: string;
  courseId: string;
  progressId?: string;
  title: string;
  platform: string;
  duration: string;
  level: "Beginner" | "Intermediate" | "Advanced";
  progress: number;
  status: TrainingStatus;
  skills: string[];
  url?: string;
}

const tabs: Array<{ key: string; label: string }> = [
  { key: "Semua", label: "Semua" },
  { key: "Sedang Berjalan", label: "Sedang Berjalan" },
  { key: "Belum Dimulai", label: "Belum Dimulai" },
  { key: "Selesai", label: "Selesai" },
];

export default function TrainingPage() {
  const { user } = useAppContext();
  const displayName = user?.fullName || "Kandidat";
  const displayInitial = (displayName[0] || "K").toUpperCase();

  const [activeFilter, setActiveFilter] = useState<string>("Semua");
  const [courses, setCourses] = useState<CourseItem[]>([]);
  const [progressList, setProgressList] = useState<TrainingProgressItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [actingCourseId, setActingCourseId] = useState<string | null>(null);

  const loadTrainingData = useCallback(async (signal?: AbortSignal) => {
    setLoading(true);
    setError(null);
    try {
      const [recResult, progResult] = await Promise.allSettled([
        getTrainingRecommendations(undefined, signal),
        listMyTrainingProgress(signal),
      ]);

      if (signal?.aborted) return;

      const rawCourses: CourseItem[] = [];
      if (recResult.status === "fulfilled") {
        const found = recResult.value.recommendations?.flatMap((r) => r.recommendedCourses) ?? [];
        found.forEach((c) => {
          if (!rawCourses.some((item) => item.id === c.id)) rawCourses.push(c);
        });
      }

      const rawProgress = progResult.status === "fulfilled" ? progResult.value : [];
      rawProgress.forEach((p) => {
        if (p.course && !rawCourses.some((item) => item.id === p.course.id)) {
          rawCourses.push(p.course);
        }
      });

      setCourses(rawCourses);
      setProgressList(rawProgress);

      if (recResult.status === "rejected" && progResult.status === "rejected") {
        setError("Gagal memuat rekomendasi pelatihan dari server.");
      }
    } catch (err) {
      if (!signal?.aborted) {
        setError(err instanceof Error ? err.message : "Terjadi kesalahan saat memuat pelatihan.");
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
        void loadTrainingData(controller.signal);
      }
    });
    return () => controller.abort();
  }, [loadTrainingData]);

  const trainingList = useMemo<TrainingItemForDisplay[]>(() => {
    return courses.map((course) => {
      const prog = progressList.find((p) => p.courseId === course.id);
      let status: TrainingStatus = "Belum Dimulai";
      let progressPct = 0;

      if (prog) {
        if (prog.status === "COMPLETED" || prog.progressPct >= 100) {
          status = "Selesai";
          progressPct = 100;
        } else if (prog.status === "IN_PROGRESS" || prog.progressPct > 0) {
          status = "Sedang Berjalan";
          progressPct = prog.progressPct;
        }
      }

      const diff = (course.difficulty || "INTERMEDIATE").toUpperCase();
      const level: "Beginner" | "Intermediate" | "Advanced" =
        diff.includes("BEGINNER") || diff.includes("BASIC")
          ? "Beginner"
          : diff.includes("ADVANCED")
            ? "Advanced"
            : "Intermediate";

      return {
        id: course.id,
        courseId: course.id,
        progressId: prog?.id,
        title: course.title,
        platform: course.provider,
        duration: course.duration,
        level,
        progress: progressPct,
        status,
        skills: course.skillTargets ?? [],
        url: course.url,
      };
    });
  }, [courses, progressList]);

  const handleStartOrContinue = async (training: TrainingItemForDisplay) => {
    if (actingCourseId) return;
    setActingCourseId(training.courseId);

    try {
      if (training.status === "Belum Dimulai") {
        const created = await createTrainingProgress({
          courseId: training.courseId,
          status: "IN_PROGRESS",
          progressPct: 25,
        });
        setProgressList((prev) => [
          created,
          ...prev.filter((p) => p.courseId !== training.courseId),
        ]);
        toast.success(`Pelatihan "${training.title}" dimulai!`);
      } else if (training.status === "Sedang Berjalan" && training.progressId) {
        const nextPct = Math.min(100, training.progress + 25);
        const nextStatus = nextPct >= 100 ? "COMPLETED" : "IN_PROGRESS";
        const updated = await updateTrainingProgress(training.progressId, {
          progressPct: nextPct,
          status: nextStatus,
        });
        setProgressList((prev) => prev.map((p) => (p.id === updated.id ? updated : p)));
        toast.success(
          nextPct >= 100
            ? `Selamat! Kursus "${training.title}" telah selesai.`
            : `Progress bertambah menjadi ${nextPct}%`
        );
      } else if (training.url) {
        window.open(training.url, "_blank");
      }
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Gagal memperbarui pelatihan.");
    } finally {
      setActingCourseId(null);
    }
  };

  const filtered =
    activeFilter === "Semua"
      ? trainingList
      : trainingList.filter((t) => t.status === activeFilter);

  const counts = {
    Semua: trainingList.length,
    "Sedang Berjalan": trainingList.filter((t) => t.status === "Sedang Berjalan").length,
    "Belum Dimulai": trainingList.filter((t) => t.status === "Belum Dimulai").length,
    Selesai: trainingList.filter((t) => t.status === "Selesai").length,
  };

  const statItems = [
    { label: "Total Kursus", value: counts["Semua"], variant: "blue" as const },
    { label: "Sedang Berjalan", value: counts["Sedang Berjalan"], variant: "light" as const },
    { label: "Belum Dimulai", value: counts["Belum Dimulai"], variant: "lime" as const },
    { label: "Selesai", value: counts["Selesai"], variant: "dark" as const },
  ];

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
          Pengembangan Kompetensi
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
          Rekomendasi Pelatihan
        </h1>
        <p
          style={{
            fontFamily: "'Inter', sans-serif",
            fontSize: 14.5,
            color: "rgba(255, 255, 255, 0.9)",
            margin: 0,
          }}
        >
          Kursus yang dipilih AI berdasarkan skill gap dan kebutuhan industri nyata di Pulau Jawa.
        </p>
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
            Memuat data rekomendasi kursus dan progres pelatihan...
          </p>
        </div>
      )}

      {!loading && error && trainingList.length === 0 && (
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
            onClick={() => void loadTrainingData()}
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

      {/* Bento Stats row */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
          gap: 16,
          marginBottom: 24,
        }}
      >
        {statItems.map((stat) => {
          const isBlue = stat.variant === "blue";
          const isLime = stat.variant === "lime";
          const isDark = stat.variant === "dark";
          const bg = isBlue
            ? "linear-gradient(180deg, #0E67CC 0%, #2B8CFF 100%)"
            : isLime
              ? "#D4FF59"
              : isDark
                ? "#0D1117"
                : "#F4F5F7";
          const valColor = isBlue || isDark ? "#FFFFFF" : "#0D1117";
          const labelColor = isBlue
            ? "rgba(255, 255, 255, 0.9)"
            : isDark
              ? "#CBD5E1"
              : "#4A5568";

          return (
            <div
              key={stat.label}
              style={{
                background: bg,
                borderRadius: 22,
                border: stat.variant === "light" ? "1px solid #E2E8F0" : "none",
                padding: "20px 22px",
              }}
            >
              <div
                style={{
                  fontFamily: "'Poppins', sans-serif",
                  fontSize: 32,
                  fontWeight: 600,
                  color: valColor,
                  lineHeight: 1.05,
                  letterSpacing: "-0.03em",
                }}
              >
                {stat.value}
              </div>
              <div
                style={{
                  fontFamily: "'Inter', sans-serif",
                  fontSize: 12.5,
                  fontWeight: 500,
                  color: labelColor,
                  marginTop: 4,
                }}
              >
                {stat.label}
              </div>
            </div>
          );
        })}
      </div>

      {/* Filter tabs */}
      <div style={{ display: "flex", gap: 8, marginBottom: 24, flexWrap: "wrap" }}>
        {tabs.map((tab) => {
          const isActive = activeFilter === tab.key;
          return (
            <button
              key={tab.key}
              type="button"
              onClick={() => setActiveFilter(tab.key)}
              style={{
                fontFamily: "'Inter', sans-serif",
                fontSize: 13,
                fontWeight: 600,
                padding: "9px 18px",
                minHeight: 40,
                borderRadius: 999,
                border: isActive ? "none" : "1px solid #E2E8F0",
                background: isActive ? "#0D1117" : "#F4F5F7",
                color: isActive ? "#D4FF59" : "#0D1117",
                cursor: "pointer",
                transition: "all 0.15s ease",
              }}
            >
              {tab.label}
              <span
                style={{
                  marginLeft: 8,
                  fontFamily: "'Inter', sans-serif",
                  fontSize: 11,
                  fontWeight: 700,
                  padding: "2px 8px",
                  borderRadius: 999,
                  background: isActive ? "rgba(212, 255, 89, 0.2)" : "#FFFFFF",
                  color: isActive ? "#D4FF59" : "#0D1117",
                }}
              >
                {counts[tab.key as keyof typeof counts] ?? 0}
              </span>
            </button>
          );
        })}
      </div>

      {!loading && filtered.length === 0 && (
        <div
          style={{
            background: "#F4F5F7",
            borderRadius: 24,
            border: "1px solid #E2E8F0",
            textAlign: "center",
            padding: "64px 24px",
            color: "#4A5568",
            fontFamily: "'Inter', sans-serif",
            fontSize: 14,
          }}
        >
          Tidak ada kursus pelatihan yang sesuai dengan kategori ini.
        </div>
      )}

      {/* Training cards grid */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(340px, 1fr))",
          gap: 18,
        }}
      >
        {filtered.map((training) => {
          const isCompleted = training.status === "Selesai";
          const isNotStarted = training.status === "Belum Dimulai";
          const isActing = actingCourseId === training.courseId;

          return (
            <div
              key={training.id}
              style={{
                background: "#F4F5F7",
                borderRadius: 24,
                border: "1px solid #E2E8F0",
                padding: "22px",
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
              }}
            >
              <div>
                {/* Top row */}
                <div
                  style={{
                    display: "flex",
                    alignItems: "flex-start",
                    justifyContent: "space-between",
                    gap: 12,
                    marginBottom: 12,
                  }}
                >
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div
                      style={{
                        fontFamily: "'Poppins', sans-serif",
                        fontSize: 16,
                        fontWeight: 600,
                        color: "#0D1117",
                        marginBottom: 4,
                      }}
                    >
                      {training.title}
                    </div>
                    <div style={{ fontFamily: "'Inter', sans-serif", fontSize: 12.5, color: "#4A5568" }}>
                      {training.platform}
                    </div>
                  </div>
                  <span
                    style={{
                      fontFamily: "'Inter', sans-serif",
                      fontSize: 11,
                      fontWeight: 700,
                      padding: "4px 12px",
                      borderRadius: 999,
                      background: isCompleted ? "#D4FF59" : "#FFFFFF",
                      color: "#0D1117",
                      border: "1px solid #E2E8F0",
                      whiteSpace: "nowrap",
                      flexShrink: 0,
                    }}
                  >
                    {training.status}
                  </span>
                </div>

                {/* Meta info */}
                <div style={{ display: "flex", gap: 8, marginBottom: 14, flexWrap: "wrap" }}>
                  <span
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      gap: 4,
                      fontFamily: "'Inter', sans-serif",
                      fontSize: 12,
                      color: "#4A5568",
                    }}
                  >
                    <Clock size={12} /> {training.duration}
                  </span>
                  <span
                    style={{
                      fontFamily: "'Inter', sans-serif",
                      fontSize: 11,
                      fontWeight: 600,
                      padding: "2px 10px",
                      borderRadius: 999,
                      background: "#FFFFFF",
                      border: "1px solid #E2E8F0",
                      color: "#0D1117",
                    }}
                  >
                    {training.level}
                  </span>
                </div>

                {/* Progress bar */}
                <div
                  style={{
                    background: "#FFFFFF",
                    borderRadius: 14,
                    border: "1px solid #E2E8F0",
                    padding: "12px 14px",
                    marginBottom: 14,
                  }}
                >
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
                    <span style={{ fontFamily: "'Inter', sans-serif", fontSize: 12, color: "#4A5568" }}>
                      Progress
                    </span>
                    <span
                      style={{
                        fontFamily: "'Poppins', sans-serif",
                        fontSize: 12.5,
                        fontWeight: 700,
                        color: "#0E67CC",
                      }}
                    >
                      {training.progress}%
                    </span>
                  </div>
                  <div
                    style={{
                      height: 6,
                      background: "#E2E8F0",
                      borderRadius: 999,
                      overflow: "hidden",
                    }}
                  >
                    <div
                      style={{
                        height: "100%",
                        width: `${training.progress}%`,
                        borderRadius: 999,
                        background: "#0E67CC",
                      }}
                    />
                  </div>
                </div>

                {/* Skills covered */}
                <div style={{ marginBottom: 18 }}>
                  <div
                    style={{
                      fontFamily: "'Inter', sans-serif",
                      fontSize: 11.5,
                      color: "#4A5568",
                      marginBottom: 6,
                    }}
                  >
                    Skill yang dicakup:
                  </div>
                  <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                    {training.skills.map((s) => (
                      <span
                        key={s}
                        style={{
                          fontFamily: "'Inter', sans-serif",
                          fontSize: 11.5,
                          fontWeight: 500,
                          padding: "3px 10px",
                          borderRadius: 999,
                          background: "#FFFFFF",
                          color: "#0D1117",
                          border: "1px solid #E2E8F0",
                        }}
                      >
                        {s}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Buttons */}
              <div style={{ display: "flex", gap: 8 }}>
                <button
                  type="button"
                  disabled={isActing}
                  onClick={() => void handleStartOrContinue(training)}
                  style={{
                    flex: 1,
                    minHeight: 42,
                    display: "inline-flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: 6,
                    fontFamily: "'Inter', sans-serif",
                    fontSize: 13,
                    fontWeight: 700,
                    padding: "9px 14px",
                    borderRadius: 999,
                    border: "none",
                    cursor: isActing ? "wait" : "pointer",
                    background: "#0D1117",
                    color: "#D4FF59",
                  }}
                >
                  {isActing ? <Loader2 size={14} className="animate-spin" /> : <Play size={14} />}
                  {isCompleted
                    ? "Buka Materi"
                    : isNotStarted
                      ? "Mulai Belajar"
                      : "Tambah Progress (+25%)"}
                </button>
                {training.url && (
                  <button
                    type="button"
                    aria-label={`Buka tautan ${training.title}`}
                    onClick={() => window.open(training.url, "_blank")}
                    style={{
                      fontFamily: "'Inter', sans-serif",
                      fontSize: 13,
                      fontWeight: 600,
                      width: 42,
                      height: 42,
                      borderRadius: "50%",
                      border: "1px solid #CBD5E1",
                      background: "#FFFFFF",
                      color: "#0D1117",
                      cursor: "pointer",
                      display: "inline-flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <ExternalLink size={15} />
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </DashboardLayout>
  );
}
