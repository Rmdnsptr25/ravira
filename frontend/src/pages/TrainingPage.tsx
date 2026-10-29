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
  color: string;
  url?: string;
}

const tabs: Array<{ key: string; label: string }> = [
  { key: "Semua", label: "Semua" },
  { key: "Sedang Berjalan", label: "Sedang Berjalan" },
  { key: "Belum Dimulai", label: "Belum Dimulai" },
  { key: "Selesai", label: "Selesai" },
];

const levelColor: Record<string, string> = {
  Beginner: "#10d98e",
  Intermediate: "#1677FF",
  Advanced: "#ff9a3c",
};

const statusBadge: Record<TrainingStatus, { bg: string; color: string }> = {
  "Sedang Berjalan": { bg: "rgba(22,119,255,0.1)", color: "#1677FF" },
  "Belum Dimulai": { bg: "rgba(106,136,184,0.12)", color: "#6a88b8" },
  "Selesai": { bg: "rgba(16,217,142,0.12)", color: "#10d98e" },
};

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

      const color = levelColor[level] || "#1677FF";

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
        color,
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
        setProgressList((prev) => [created, ...prev.filter((p) => p.courseId !== training.courseId)]);
        toast.success(`Pelatihan "${training.title}" dimulai!`);
      } else if (training.status === "Sedang Berjalan" && training.progressId) {
        const nextPct = Math.min(100, training.progress + 25);
        const nextStatus = nextPct >= 100 ? "COMPLETED" : "IN_PROGRESS";
        const updated = await updateTrainingProgress(training.progressId, {
          progressPct: nextPct,
          status: nextStatus,
        });
        setProgressList((prev) => prev.map((p) => (p.id === updated.id ? updated : p)));
        toast.success(nextPct >= 100 ? `Selamat! Kursus "${training.title}" telah selesai.` : `Progress bertambah menjadi ${nextPct}%`);
      } else if (training.url) {
        window.open(training.url, "_blank");
      }
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Gagal memperbarui pelatihan.");
    } finally {
      setActingCourseId(null);
    }
  };

  const filtered = activeFilter === "Semua" ? trainingList : trainingList.filter((t) => t.status === activeFilter);

  const card: React.CSSProperties = {
    background: "#fff",
    borderRadius: 16,
    padding: "24px",
    boxShadow: "0 2px 12px rgba(10,27,61,0.07)",
    border: "1px solid rgba(22,119,255,0.08)",
  };

  const counts = {
    "Semua": trainingList.length,
    "Sedang Berjalan": trainingList.filter((t) => t.status === "Sedang Berjalan").length,
    "Belum Dimulai": trainingList.filter((t) => t.status === "Belum Dimulai").length,
    "Selesai": trainingList.filter((t) => t.status === "Selesai").length,
  };

  return (
    <DashboardLayout
      sidebarItems={sidebarItems}
      userName={displayName}
      userRole="Kandidat"
      userInitial={displayInitial}
    >
      {/* Header */}
      <div style={{ marginBottom: 28 }}>
        <h1 style={{ fontFamily: "'Poppins', sans-serif", fontSize: 24, fontWeight: 700, color: "#0A1B3D", margin: 0 }}>
          Rekomendasi Pelatihan
        </h1>
        <p style={{ fontFamily: "'Inter', sans-serif", fontSize: 14, color: "#6a88b8", marginTop: 6 }}>
          Kursus yang dipilih AI berdasarkan skill gap dan kebutuhan industri nyata di Pulau Jawa.
        </p>
      </div>

      {loading && (
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "64px 24px", background: "#fff", borderRadius: 16, border: "1px solid rgba(22,119,255,0.1)", gap: 12, marginBottom: 24 }}>
          <Loader2 size={32} className="animate-spin" color="#1677FF" />
          <p style={{ fontFamily: "'Inter', sans-serif", fontSize: 14, color: "#6a88b8", margin: 0 }}>
            Memuat data rekomendasi kursus dan progres pelatihan...
          </p>
        </div>
      )}

      {!loading && error && trainingList.length === 0 && (
        <div style={{ ...card, textAlign: "center", padding: "48px 24px", borderColor: "rgba(239,68,68,0.2)", marginBottom: 28 }}>
          <AlertCircle size={40} color="#dc2626" style={{ margin: "0 auto 12px" }} />
          <p style={{ fontFamily: "'Inter', sans-serif", fontSize: 14, color: "#dc2626", marginBottom: 16 }}>{error}</p>
          <button
            onClick={() => void loadTrainingData()}
            style={{ display: "inline-flex", alignItems: "center", gap: 6, padding: "8px 18px", borderRadius: 8, background: "#1677FF", color: "#fff", border: "none", cursor: "pointer", fontFamily: "'Inter', sans-serif", fontSize: 13, fontWeight: 600 }}
          >
            <RefreshCw size={14} /> Coba Lagi
          </button>
        </div>
      )}

      {/* Stats row */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 16, marginBottom: 24 }}>
        {[
          { label: "Total Kursus", value: counts["Semua"], color: "#1677FF" },
          { label: "Sedang Berjalan", value: counts["Sedang Berjalan"], color: "#1677FF" },
          { label: "Belum Dimulai", value: counts["Belum Dimulai"], color: "#6a88b8" },
          { label: "Selesai", value: counts["Selesai"], color: "#10d98e" },
        ].map((stat) => (
          <div key={stat.label} style={{ ...card, padding: "16px 20px" }}>
            <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 28, fontWeight: 800, color: stat.color }}>{stat.value}</div>
            <div style={{ fontFamily: "'Inter', sans-serif", fontSize: 12, color: "#6a88b8", marginTop: 2 }}>{stat.label}</div>
          </div>
        ))}
      </div>

      {/* Filter tabs */}
      <div style={{ display: "flex", gap: 8, marginBottom: 24, flexWrap: "wrap" }}>
        {tabs.map((tab) => {
          const isActive = activeFilter === tab.key;
          return (
            <button
              key={tab.key}
              onClick={() => setActiveFilter(tab.key)}
              style={{
                fontFamily: "'Inter', sans-serif",
                fontSize: 13,
                fontWeight: isActive ? 600 : 400,
                padding: "8px 18px",
                borderRadius: 10,
                border: isActive ? "1.5px solid #1677FF" : "1.5px solid rgba(22,119,255,0.15)",
                background: isActive ? "#1677FF" : "#fff",
                color: isActive ? "#fff" : "#6a88b8",
                cursor: "pointer",
                transition: "all 0.15s",
              }}
            >
              {tab.label}
              <span style={{
                marginLeft: 6,
                fontFamily: "'JetBrains Mono', monospace",
                fontSize: 11,
                padding: "1px 6px",
                borderRadius: 99,
                background: isActive ? "rgba(255,255,255,0.2)" : "rgba(22,119,255,0.1)",
                color: isActive ? "#fff" : "#1677FF",
              }}>
                {counts[tab.key as keyof typeof counts] ?? 0}
              </span>
            </button>
          );
        })}
      </div>

      {!loading && filtered.length === 0 && (
        <div style={{ ...card, textAlign: "center", padding: "64px 24px", color: "#6a88b8", fontFamily: "'Inter', sans-serif", fontSize: 14 }}>
          Tidak ada kursus pelatihan yang sesuai dengan kategori ini.
        </div>
      )}

      {/* Training cards grid */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(340px, 1fr))", gap: 20 }}>
        {filtered.map((training) => {
          const badge = statusBadge[training.status];
          const isCompleted = training.status === "Selesai";
          const isNotStarted = training.status === "Belum Dimulai";
          const isActing = actingCourseId === training.courseId;

          return (
            <div
              key={training.id}
              style={{
                ...card,
                display: "flex",
                flexDirection: "column",
                gap: 0,
                padding: 0,
                overflow: "hidden",
              }}
            >
              {/* Color accent bar */}
              <div style={{ height: 4, background: `linear-gradient(90deg, ${training.color}, ${training.color}88)` }} />

              <div style={{ padding: "20px 20px 18px" }}>
                {/* Top row */}
                <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 12 }}>
                  <div style={{ flex: 1, minWidth: 0, paddingRight: 12 }}>
                    <div style={{ fontFamily: "'Poppins', sans-serif", fontSize: 15, fontWeight: 700, color: "#0A1B3D", marginBottom: 3 }}>
                      {training.title}
                    </div>
                    <div style={{ fontFamily: "'Inter', sans-serif", fontSize: 12, color: "#6a88b8" }}>
                      {training.platform}
                    </div>
                  </div>
                  <span style={{
                    fontFamily: "'Inter', sans-serif", fontSize: 11, fontWeight: 600,
                    padding: "4px 10px", borderRadius: 99,
                    background: badge.bg, color: badge.color,
                    whiteSpace: "nowrap", flexShrink: 0,
                  }}>
                    {training.status}
                  </span>
                </div>

                {/* Meta info */}
                <div style={{ display: "flex", gap: 8, marginBottom: 14, flexWrap: "wrap" }}>
                  <span style={{ display: "flex", alignItems: "center", gap: 4, fontFamily: "'Inter', sans-serif", fontSize: 11, color: "#6a88b8" }}>
                    <Clock size={11} /> {training.duration}
                  </span>
                  <span style={{
                    fontFamily: "'Inter', sans-serif", fontSize: 11, fontWeight: 600,
                    padding: "2px 8px", borderRadius: 99,
                    background: `${levelColor[training.level]}18`,
                    color: levelColor[training.level],
                  }}>
                    {training.level}
                  </span>
                </div>

                {/* Progress bar */}
                <div style={{ marginBottom: 6 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
                    <span style={{ fontFamily: "'Inter', sans-serif", fontSize: 12, color: "#6a88b8" }}>Progress</span>
                    <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 12, fontWeight: 700, color: isCompleted ? "#10d98e" : "#1677FF" }}>
                      {training.progress}%
                    </span>
                  </div>
                  <div style={{ position: "relative", height: 7, background: "#eef4ff", borderRadius: 99 }}>
                    <div style={{
                      position: "absolute", left: 0, top: 0, height: "100%",
                      width: `${training.progress}%`, borderRadius: 99,
                      background: isCompleted
                        ? "linear-gradient(90deg, #10d98e, #38f9b2)"
                        : `linear-gradient(90deg, ${training.color}, ${training.color}bb)`,
                    }} />
                  </div>
                </div>

                {/* Skills covered */}
                <div style={{ marginTop: 14, marginBottom: 16 }}>
                  <div style={{ fontFamily: "'Inter', sans-serif", fontSize: 11, color: "#6a88b8", marginBottom: 6 }}>Skill yang dicakup:</div>
                  <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                    {training.skills.map((s) => (
                      <span key={s} style={{
                        fontFamily: "'Inter', sans-serif", fontSize: 11,
                        padding: "2px 9px", borderRadius: 99,
                        background: "#f0f7ff", color: "#1677FF",
                        border: "1px solid rgba(22,119,255,0.15)",
                      }}>
                        {s}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Buttons */}
                <div style={{ display: "flex", gap: 8 }}>
                  <button
                    disabled={isActing}
                    onClick={() => void handleStartOrContinue(training)}
                    style={{
                      flex: 1,
                      display: "flex", alignItems: "center", justifyContent: "center", gap: 6,
                      fontFamily: "'Inter', sans-serif", fontSize: 13, fontWeight: 600,
                      padding: "9px 0", borderRadius: 10, border: "none", cursor: isActing ? "wait" : "pointer",
                      background: isCompleted
                        ? "linear-gradient(135deg, #10d98e, #38f9b2)"
                        : "linear-gradient(135deg, #1677FF, #4DB8FF)",
                      color: "#fff",
                    }}
                  >
                    {isActing ? (
                      <Loader2 size={14} className="animate-spin" />
                    ) : (
                      <Play size={14} />
                    )}
                    {isCompleted ? "Pelajari Lagi" : isNotStarted ? "Mulai Belajar" : "Tingkatkan Progress"}
                  </button>
                  {training.url && (
                    <button
                      onClick={() => window.open(training.url, "_blank")}
                      style={{
                        display: "flex", alignItems: "center", justifyContent: "center", gap: 4,
                        fontFamily: "'Inter', sans-serif", fontSize: 13, fontWeight: 600,
                        padding: "9px 14px", borderRadius: 10,
                        border: "1.5px solid rgba(22,119,255,0.2)",
                        background: "#fff", color: "#1677FF", cursor: "pointer",
                      }}
                    >
                      Buka <ExternalLink size={13} />
                    </button>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </DashboardLayout>
  );
}
