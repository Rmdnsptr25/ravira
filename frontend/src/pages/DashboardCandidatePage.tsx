import { useCallback, useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router";
import {
  Home,
  Briefcase,
  BarChart2,
  BookOpen,
  FileText,
  Globe,
  User,
  Settings,
  MapPin,
  Clock,
  TrendingUp,
  ChevronRight,
  Bookmark,
  Loader2,
  AlertCircle,
  RefreshCw,
} from "lucide-react";
import { DashboardLayout } from "../components/DashboardLayout";
import type { SidebarItem } from "../components/DashboardLayout";
import { useAppContext } from "../contexts/AppContext";
import {
  getCandidateProfile,
  listCandidateSkills,
  getJobRecommendations,
  getSkillGapReport,
  getTrainingRecommendations,
  listMyTrainingProgress,
  listMyApplications,
  type CandidateProfile,
  type CandidateSkill,
  type JobRecommendation,
  type SkillGapReport,
  type CourseItem,
  type TrainingProgressItem,
  type CandidateApplication,
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

export default function DashboardCandidatePage() {
  const navigate = useNavigate();
  const { user, applications: contextApplications } = useAppContext();

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [profile, setProfile] = useState<CandidateProfile | null>(null);
  const [skills, setSkills] = useState<CandidateSkill[]>([]);
  const [jobRecs, setJobRecs] = useState<JobRecommendation[]>([]);
  const [skillGapReport, setSkillGapReport] = useState<SkillGapReport | null>(null);
  const [recommendedCourses, setRecommendedCourses] = useState<CourseItem[]>([]);
  const [trainingProgress, setTrainingProgress] = useState<TrainingProgressItem[]>([]);
  const [myApplications, setMyApplications] = useState<CandidateApplication[] | null>(null);

  const loadDashboardData = useCallback(async (signal?: AbortSignal) => {
    setLoading(true);
    setError(null);

    try {
      const [
        profileRes,
        skillsRes,
        jobRecsRes,
        skillGapRes,
        trainingRecRes,
        trainingProgRes,
        appsRes,
      ] = await Promise.allSettled([
        getCandidateProfile(signal),
        listCandidateSkills(signal),
        getJobRecommendations(signal),
        getSkillGapReport(undefined, signal),
        getTrainingRecommendations(undefined, signal),
        listMyTrainingProgress(signal),
        listMyApplications(signal),
      ]);

      if (signal?.aborted) return;

      const coreFailed =
        profileRes.status === "rejected" &&
        jobRecsRes.status === "rejected" &&
        skillGapRes.status === "rejected";

      if (coreFailed) {
        const reason =
          profileRes.reason instanceof Error
            ? profileRes.reason.message
            : "Gagal memuat data beranda kandidat dari server.";
        setError(reason);
        return;
      }

      if (profileRes.status === "fulfilled") {
        setProfile(profileRes.value);
      }
      if (skillsRes.status === "fulfilled") {
        setSkills(skillsRes.value);
      }
      if (jobRecsRes.status === "fulfilled") {
        setJobRecs(jobRecsRes.value);
      }
      if (skillGapRes.status === "fulfilled") {
        setSkillGapReport(skillGapRes.value);
      }
      if (trainingRecRes.status === "fulfilled") {
        const courses =
          trainingRecRes.value.recommendations?.flatMap((r) => r.recommendedCourses) ?? [];
        const uniqueCourses: CourseItem[] = [];
        for (const c of courses) {
          if (!uniqueCourses.some((existing) => existing.id === c.id)) {
            uniqueCourses.push(c);
          }
        }
        setRecommendedCourses(uniqueCourses);
      }
      if (trainingProgRes.status === "fulfilled") {
        setTrainingProgress(trainingProgRes.value);
      }
      if (appsRes.status === "fulfilled") {
        setMyApplications(appsRes.value);
      }
    } catch (err) {
      if (!signal?.aborted) {
        setError(
          err instanceof Error ? err.message : "Gagal memuat data beranda kandidat dari server."
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
        void loadDashboardData(controller.signal);
      }
    });
    return () => controller.abort();
  }, [loadDashboardData]);

  const displayName = profile?.fullName || user?.fullName || "Kandidat";
  const displayInitial = (displayName[0] || "K").toUpperCase();

  // 1. Kelengkapan Profil
  const completionPct = useMemo(() => {
    let score = 0;
    const effectiveName = profile?.fullName || user?.fullName;
    const effectiveEmail = profile?.email || user?.email;
    const effectivePhone = profile?.phone ?? user?.phone;
    const effectiveLocation = profile?.location ?? user?.candidate?.location;

    if (effectiveName) score += 15;
    if (effectiveEmail) score += 10;
    if (effectivePhone) score += 10;
    if (effectiveLocation) score += 15;
    if (profile?.experienceSummary) score += 15;
    if (profile?.education) score += 15;
    if (profile?.mobilityPreference) score += 10;
    if (skills.length > 0) score += 10;
    return Math.min(score, 100);
  }, [profile, skills.length, user]);

  const completionSub = useMemo(() => {
    if (completionPct >= 100) return "Profil sudah lengkap";
    if (!profile?.experienceSummary) return "Tambah pengalaman kerja";
    if (skills.length === 0) return "Tambahkan keahlian Anda";
    return "Lengkapi data profil Anda";
  }, [completionPct, profile?.experienceSummary, skills.length]);

  // 2. Rekomendasi Pekerjaan
  const highMatchCount = useMemo(
    () => jobRecs.filter((r) => r.matchScore >= 70).length,
    [jobRecs]
  );

  // 3. Skill Gap Utama
  const missingSkills = useMemo(
    () => skillGapReport?.missingSkills ?? [],
    [skillGapReport]
  );
  const matchedSkills = useMemo(
    () => skillGapReport?.matchedSkills ?? [],
    [skillGapReport]
  );

  const skillGapItems = useMemo(() => {
    const missing = missingSkills.map((s) => ({
      skill: s.skillName,
      level: 0,
      gap: 100,
    }));
    const matched = matchedSkills.map((s) => ({
      skill: s.skillName,
      level: 100,
      gap: 0,
    }));
    return [...missing, ...matched].slice(0, 3);
  }, [missingSkills, matchedSkills]);

  // 4. Pelatihan & Progress
  const displayedTrainings = useMemo(() => {
    const merged: Array<{
      id: string;
      title: string;
      platform: string;
      duration: string;
      level: string;
      progress: number;
    }> = [];

    for (const prog of trainingProgress) {
      if (prog.course) {
        merged.push({
          id: prog.course.id,
          title: prog.course.title,
          platform: prog.course.provider,
          duration: prog.course.duration,
          level: prog.course.difficulty,
          progress: prog.progressPct ?? 0,
        });
      }
    }

    for (const course of recommendedCourses) {
      if (!merged.some((item) => item.id === course.id)) {
        const existingProg = trainingProgress.find((p) => p.courseId === course.id);
        merged.push({
          id: course.id,
          title: course.title,
          platform: course.provider,
          duration: course.duration,
          level: course.difficulty,
          progress: existingProg?.progressPct ?? 0,
        });
      }
    }

    return merged.slice(0, 3);
  }, [recommendedCourses, trainingProgress]);

  const trainingAvgProgressPct = useMemo(() => {
    if (trainingProgress.length === 0) return 0;
    const sum = trainingProgress.reduce((acc, item) => acc + (item.progressPct || 0), 0);
    return Math.round(sum / trainingProgress.length);
  }, [trainingProgress]);

  const activeCoursesCount = useMemo(
    () =>
      trainingProgress.filter(
        (p) => p.status === "IN_PROGRESS" || (p.progressPct > 0 && p.progressPct < 100)
      ).length,
    [trainingProgress]
  );

  // 5. Lamaran Aktif
  const totalApplicationsCount = useMemo(() => {
    if (myApplications !== null) return myApplications.length;
    return contextApplications.length;
  }, [myApplications, contextApplications.length]);

  const pendingApplicationsCount = useMemo(() => {
    if (myApplications !== null) {
      return myApplications.filter(
        (a) => a.status !== "ACCEPTED" && a.status !== "REJECTED"
      ).length;
    }
    return contextApplications.filter(
      (a) => a.status !== "Diterima" && a.status !== "Ditolak"
    ).length;
  }, [myApplications, contextApplications]);

  // 6. Peluang Lintas Wilayah
  const crossRegionItems = useMemo(() => {
    const candLoc = (profile?.location || user?.candidate?.location || "").trim().toLowerCase();
    const filtered = jobRecs.filter((rec) => {
      const jobLoc = (rec.job.location || rec.company.location || "").trim().toLowerCase();
      const workType = (rec.job.workType || "").toUpperCase();
      if (candLoc && jobLoc && !jobLoc.includes(candLoc) && !candLoc.includes(jobLoc)) {
        return true;
      }
      return workType === "REMOTE" || workType === "HYBRID";
    });
    const source = filtered.length > 0 ? filtered : jobRecs;
    return source.slice(0, 2).map((rec) => ({
      id: rec.job.id,
      title: rec.job.title,
      company: rec.company.name,
      location: rec.job.location || rec.company.location || "Pulau Jawa",
      type: rec.job.workType || rec.job.jobType || "Full-time",
      match: rec.matchScore,
    }));
  }, [jobRecs, profile?.location, user?.candidate?.location]);

  const statsCards = [
    {
      label: "Kelengkapan Profil",
      value: `${completionPct}%`,
      sub: completionSub,
      variant: "blue" as const,
      icon: <User size={18} />,
      path: "/dashboard/kandidat/profil",
    },
    {
      label: "Rekomendasi Pekerjaan",
      value: String(jobRecs.length),
      sub: jobRecs.length > 0 ? `${highMatchCount} kecocokan tinggi` : "Belum ada rekomendasi",
      variant: "light" as const,
      icon: <Briefcase size={18} />,
      path: "/dashboard/kandidat/rekomendasi",
    },
    {
      label: "Skill Gap Utama",
      value: String(missingSkills.length),
      sub:
        missingSkills.length > 0
          ? skillGapReport?.targetRole
            ? `Target: ${skillGapReport.targetRole}`
            : "Perlu ditingkatkan"
          : matchedSkills.length > 0
            ? "Semua target terpenuhi"
            : "Analisis kompetensi",
      variant: "lime" as const,
      icon: <TrendingUp size={18} />,
      path: "/dashboard/kandidat/skill-gap",
    },
    {
      label: "Progress Pelatihan",
      value: `${trainingAvgProgressPct}%`,
      sub:
        trainingProgress.length > 0
          ? `${activeCoursesCount || trainingProgress.length} kursus aktif`
          : "Belum ada kursus aktif",
      variant: "dark" as const,
      icon: <BookOpen size={18} />,
      path: "/dashboard/kandidat/pelatihan",
    },
    {
      label: "Lamaran Aktif",
      value: String(totalApplicationsCount),
      sub:
        totalApplicationsCount > 0
          ? `${pendingApplicationsCount} menunggu respons`
          : "Belum ada lamaran",
      variant: "light" as const,
      icon: <FileText size={18} />,
      path: "/dashboard/kandidat/lamaran",
    },
  ];

  return (
    <DashboardLayout
      sidebarItems={sidebarItems}
      userName={displayName}
      userRole="Kandidat"
      userInitial={displayInitial}
    >
      {/* Framed Hero Banner matching Beranda */}
      <section
        style={{
          borderRadius: 26,
          background: "linear-gradient(180deg, #0849A8 0%, #0E67CC 52%, #2B8CFF 100%)",
          padding: "28px 30px",
          marginBottom: 24,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
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
            Beranda Kandidat
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
            Halo, {displayName}
          </h1>
          <p
            style={{
              fontFamily: "'Inter', sans-serif",
              fontSize: 14.5,
              color: "rgba(255, 255, 255, 0.9)",
              margin: 0,
            }}
          >
            Ini rekomendasi terbaik untuk Anda hari ini berdasarkan profil dan keahlian terkini.
          </p>
        </div>
        <button
          type="button"
          onClick={() => navigate("/dashboard/kandidat/rekomendasi")}
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
          Jelajahi Lowongan
        </button>
      </section>

      {loading && (
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            padding: "56px 24px",
            background: "#F4F5F7",
            borderRadius: 24,
            border: "1px solid #E2E8F0",
            gap: 12,
            marginBottom: 24,
          }}
        >
          <Loader2 size={32} className="animate-spin" color="#0E67CC" />
          <p style={{ fontFamily: "'Inter', sans-serif", fontSize: 14, color: "#4A5568", margin: 0 }}>
            Memuat data dashboard kandidat...
          </p>
        </div>
      )}

      {!loading && error && (
        <div
          style={{
            background: "#FEF2F2",
            borderRadius: 24,
            border: "1px solid #FECACA",
            padding: "40px 24px",
            textAlign: "center",
            marginBottom: 24,
          }}
        >
          <AlertCircle size={36} color="#B91C1C" style={{ margin: "0 auto 12px" }} />
          <p style={{ fontFamily: "'Inter', sans-serif", fontSize: 14, color: "#991B1B", marginBottom: 16 }}>
            {error}
          </p>
          <button
            type="button"
            onClick={() => void loadDashboardData()}
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 8,
              padding: "10px 22px",
              minHeight: 44,
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

      {!loading && !error && (
        <>
          {/* Bento Stats Row */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(190px, 1fr))",
              gap: 16,
              marginBottom: 24,
            }}
          >
            {statsCards.map((s) => {
              const isBlue = s.variant === "blue";
              const isLime = s.variant === "lime";
              const isDark = s.variant === "dark";

              const bg = isBlue
                ? "linear-gradient(180deg, #0E67CC 0%, #2B8CFF 100%)"
                : isLime
                  ? "#D4FF59"
                  : isDark
                    ? "#0D1117"
                    : "#F4F5F7";

              const valueColor = isBlue || isDark ? "#FFFFFF" : "#0D1117";
              const labelColor = isBlue || isDark ? "#FFFFFF" : "#0D1117";
              const subColor = isBlue
                ? "rgba(255, 255, 255, 0.88)"
                : isDark
                  ? "#CBD5E1"
                  : "#4A5568";
              const iconBg = isBlue || isDark ? "#FFFFFF" : "#0D1117";
              const iconColor = isBlue || isDark ? "#0D1117" : "#D4FF59";

              return (
                <button
                  key={s.label}
                  type="button"
                  onClick={() => navigate(s.path)}
                  style={{
                    background: bg,
                    borderRadius: 22,
                    border: s.variant === "light" ? "1px solid #E2E8F0" : "none",
                    padding: "20px 18px",
                    textAlign: "left",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "space-between",
                    minHeight: 156,
                    cursor: "pointer",
                    transition: "transform 0.18s ease",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = "translateY(-3px)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = "translateY(0)";
                  }}
                >
                  <div
                    aria-hidden="true"
                    style={{
                      width: 38,
                      height: 38,
                      borderRadius: 12,
                      background: iconBg,
                      color: iconColor,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      marginBottom: 14,
                    }}
                  >
                    {s.icon}
                  </div>
                  <div>
                    <div
                      style={{
                        fontFamily: "'Poppins', sans-serif",
                        fontSize: 28,
                        fontWeight: 600,
                        color: valueColor,
                        lineHeight: 1.05,
                        letterSpacing: "-0.03em",
                        marginBottom: 6,
                      }}
                    >
                      {s.value}
                    </div>
                    <div
                      style={{
                        fontFamily: "'Poppins', sans-serif",
                        fontSize: 12.5,
                        fontWeight: 600,
                        color: labelColor,
                        marginBottom: 2,
                      }}
                    >
                      {s.label}
                    </div>
                    <div
                      style={{
                        fontFamily: "'Inter', sans-serif",
                        fontSize: 12,
                        color: subColor,
                      }}
                    >
                      {s.sub}
                    </div>
                  </div>
                </button>
              );
            })}
          </div>

          <div
            className="ravira-cand-grid"
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 350px",
              gap: 20,
              alignItems: "start",
            }}
          >
            <div>
              {/* Job Recommendations */}
              <div
                style={{
                  background: "#F4F5F7",
                  borderRadius: 24,
                  border: "1px solid #E2E8F0",
                  padding: "24px",
                  marginBottom: 20,
                }}
              >
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    marginBottom: 18,
                  }}
                >
                  <h2
                    style={{
                      fontFamily: "'Poppins', sans-serif",
                      fontSize: 18,
                      fontWeight: 600,
                      color: "#0D1117",
                      margin: 0,
                    }}
                  >
                    Rekomendasi Pekerjaan
                  </h2>
                  <button
                    type="button"
                    onClick={() => navigate("/dashboard/kandidat/rekomendasi")}
                    style={{
                      background: "none",
                      border: "none",
                      cursor: "pointer",
                      fontFamily: "'Inter', sans-serif",
                      fontSize: 13,
                      fontWeight: 600,
                      color: "#0E67CC",
                      display: "inline-flex",
                      alignItems: "center",
                      gap: 4,
                    }}
                  >
                    Lihat Semua <ChevronRight size={14} />
                  </button>
                </div>

                {jobRecs.length === 0 ? (
                  <div
                    style={{
                      padding: "28px 20px",
                      textAlign: "center",
                      borderRadius: 18,
                      background: "#FFFFFF",
                      border: "1px solid #E2E8F0",
                    }}
                  >
                    <p
                      style={{
                        fontFamily: "'Inter', sans-serif",
                        fontSize: 13.5,
                        color: "#4A5568",
                        marginBottom: 14,
                        lineHeight: 1.6,
                      }}
                    >
                      Belum ada rekomendasi pekerjaan yang tersedia saat ini. Lengkapi profil dan
                      keterampilan Anda untuk mendapatkan pencocokan AI.
                    </p>
                    <button
                      type="button"
                      onClick={() => navigate("/dashboard/kandidat/profil")}
                      style={{
                        padding: "10px 20px",
                        minHeight: 42,
                        borderRadius: 999,
                        border: "none",
                        background: "#0D1117",
                        fontFamily: "'Inter', sans-serif",
                        fontSize: 12.5,
                        fontWeight: 700,
                        color: "#D4FF59",
                        cursor: "pointer",
                      }}
                    >
                      Lengkapi Profil
                    </button>
                  </div>
                ) : (
                  <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                    {jobRecs.slice(0, 3).map((rec) => {
                      const jobTitle = rec.job.title;
                      const companyName = rec.company.name;
                      const jobLocation = rec.job.location || rec.company.location || "Indonesia";
                      const jobType = rec.job.workType || rec.job.jobType || "Full-time";
                      const reasonText =
                        rec.matchExplanation?.[0] ||
                        "Berdasarkan kesesuaian profil dan kompetensi Anda";

                      return (
                        <div
                          key={rec.job.id}
                          style={{
                            padding: "20px",
                            borderRadius: 18,
                            border: "1px solid #E2E8F0",
                            background: "#FFFFFF",
                          }}
                        >
                          <div
                            style={{
                              display: "flex",
                              justifyContent: "space-between",
                              alignItems: "flex-start",
                              gap: 12,
                              marginBottom: 10,
                            }}
                          >
                            <div>
                              <div
                                style={{
                                  fontFamily: "'Poppins', sans-serif",
                                  fontSize: 16,
                                  fontWeight: 600,
                                  color: "#0D1117",
                                  marginBottom: 3,
                                }}
                              >
                                {jobTitle}
                              </div>
                              <div
                                style={{
                                  fontFamily: "'Inter', sans-serif",
                                  fontSize: 13.5,
                                  color: "#4A5568",
                                }}
                              >
                                {companyName}
                              </div>
                            </div>
                            <div
                              style={{
                                textAlign: "right",
                                background: "#F4F5F7",
                                padding: "6px 12px",
                                borderRadius: 12,
                                border: "1px solid #E2E8F0",
                              }}
                            >
                              <div
                                style={{
                                  fontFamily: "'Poppins', sans-serif",
                                  fontSize: 18,
                                  fontWeight: 700,
                                  color: "#0E67CC",
                                  lineHeight: 1.1,
                                }}
                              >
                                {rec.matchScore}%
                              </div>
                              <div
                                style={{
                                  fontFamily: "'Inter', sans-serif",
                                  fontSize: 10.5,
                                  color: "#4A5568",
                                }}
                              >
                                match score
                              </div>
                            </div>
                          </div>

                          <div
                            style={{
                              display: "flex",
                              gap: 12,
                              marginBottom: 12,
                              flexWrap: "wrap",
                            }}
                          >
                            <span
                              style={{
                                display: "inline-flex",
                                alignItems: "center",
                                gap: 5,
                                fontFamily: "'Inter', sans-serif",
                                fontSize: 12.5,
                                color: "#4A5568",
                              }}
                            >
                              <MapPin size={12} /> {jobLocation}
                            </span>
                            <span
                              style={{
                                display: "inline-flex",
                                alignItems: "center",
                                gap: 5,
                                fontFamily: "'Inter', sans-serif",
                                fontSize: 12.5,
                                color: "#4A5568",
                              }}
                            >
                              <Clock size={12} /> {jobType}
                            </span>
                          </div>

                          <div
                            style={{
                              fontFamily: "'Inter', sans-serif",
                              fontSize: 12.5,
                              color: "#334155",
                              background: "#F4F5F7",
                              border: "1px solid #E2E8F0",
                              padding: "8px 12px",
                              borderRadius: 10,
                              marginBottom: 14,
                            }}
                          >
                            {reasonText}
                          </div>

                          <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
                            <button
                              type="button"
                              onClick={() => navigate("/dashboard/kandidat/rekomendasi")}
                              style={{
                                flex: 1,
                                minHeight: 42,
                                padding: "8px 14px",
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
                              Lihat Rekomendasi
                            </button>
                            <button
                              type="button"
                              onClick={() => navigate(`/dashboard/kandidat/pekerjaan/${rec.job.id}`)}
                              style={{
                                flex: 1,
                                minHeight: 42,
                                padding: "8px 14px",
                                borderRadius: 999,
                                border: "none",
                                background: "#0D1117",
                                fontFamily: "'Inter', sans-serif",
                                fontSize: 12.5,
                                fontWeight: 700,
                                color: "#D4FF59",
                                cursor: "pointer",
                              }}
                            >
                              Buka Lowongan
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* Pelatihan */}
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
                    justifyContent: "space-between",
                    alignItems: "center",
                    marginBottom: 18,
                  }}
                >
                  <h2
                    style={{
                      fontFamily: "'Poppins', sans-serif",
                      fontSize: 18,
                      fontWeight: 600,
                      color: "#0D1117",
                      margin: 0,
                    }}
                  >
                    Pelatihan yang Direkomendasikan
                  </h2>
                  <button
                    type="button"
                    onClick={() => navigate("/dashboard/kandidat/pelatihan")}
                    style={{
                      background: "none",
                      border: "none",
                      cursor: "pointer",
                      fontFamily: "'Inter', sans-serif",
                      fontSize: 13,
                      fontWeight: 600,
                      color: "#0E67CC",
                      display: "inline-flex",
                      alignItems: "center",
                      gap: 4,
                    }}
                  >
                    Lihat Semua <ChevronRight size={14} />
                  </button>
                </div>

                {displayedTrainings.length === 0 ? (
                  <div
                    style={{
                      padding: "24px 16px",
                      textAlign: "center",
                      borderRadius: 18,
                      background: "#FFFFFF",
                      border: "1px solid #E2E8F0",
                    }}
                  >
                    <p
                      style={{
                        fontFamily: "'Inter', sans-serif",
                        fontSize: 13.5,
                        color: "#4A5568",
                        margin: 0,
                        lineHeight: 1.6,
                      }}
                    >
                      Belum ada rekomendasi pelatihan saat ini. Periksa analisis Skill Gap Anda
                      untuk mendapatkan rekomendasi kursus yang sesuai.
                    </p>
                  </div>
                ) : (
                  <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                    {displayedTrainings.map((t) => (
                      <div
                        key={t.id}
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: 14,
                          padding: "16px",
                          borderRadius: 18,
                          background: "#FFFFFF",
                          border: "1px solid #E2E8F0",
                        }}
                      >
                        <div
                          aria-hidden="true"
                          style={{
                            width: 42,
                            height: 42,
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
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div
                            style={{
                              fontFamily: "'Poppins', sans-serif",
                              fontSize: 14,
                              fontWeight: 600,
                              color: "#0D1117",
                              marginBottom: 2,
                            }}
                          >
                            {t.title}
                          </div>
                          <div
                            style={{
                              fontFamily: "'Inter', sans-serif",
                              fontSize: 12,
                              color: "#4A5568",
                              marginBottom: 8,
                            }}
                          >
                            {t.platform} · {t.duration} · {t.level}
                          </div>
                          <div
                            style={{
                              height: 6,
                              borderRadius: 999,
                              background: "#E2E8F0",
                              overflow: "hidden",
                            }}
                          >
                            <div
                              style={{
                                height: "100%",
                                width: `${t.progress}%`,
                                background: "#0E67CC",
                                borderRadius: 999,
                              }}
                            />
                          </div>
                          <div
                            style={{
                              fontFamily: "'Inter', sans-serif",
                              fontSize: 11,
                              fontWeight: 600,
                              color: "#0E67CC",
                              marginTop: 4,
                            }}
                          >
                            {t.progress}% selesai
                          </div>
                        </div>
                        <button
                          type="button"
                          onClick={() => navigate("/dashboard/kandidat/pelatihan")}
                          style={{
                            padding: "8px 16px",
                            minHeight: 40,
                            borderRadius: 999,
                            border: "none",
                            background: "#0D1117",
                            fontFamily: "'Inter', sans-serif",
                            fontSize: 12,
                            fontWeight: 700,
                            color: "#D4FF59",
                            cursor: "pointer",
                            whiteSpace: "nowrap",
                          }}
                        >
                          Mulai Belajar
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <div>
              {/* Skill Gap */}
              <div
                style={{
                  background: "#F4F5F7",
                  borderRadius: 24,
                  border: "1px solid #E2E8F0",
                  padding: "24px",
                  marginBottom: 20,
                }}
              >
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    marginBottom: 6,
                  }}
                >
                  <h2
                    style={{
                      fontFamily: "'Poppins', sans-serif",
                      fontSize: 18,
                      fontWeight: 600,
                      color: "#0D1117",
                      margin: 0,
                    }}
                  >
                    Skill Gap Report
                  </h2>
                  <button
                    type="button"
                    onClick={() => navigate("/dashboard/kandidat/skill-gap")}
                    style={{
                      background: "none",
                      border: "none",
                      cursor: "pointer",
                      fontFamily: "'Inter', sans-serif",
                      fontSize: 12.5,
                      fontWeight: 600,
                      color: "#0E67CC",
                      display: "inline-flex",
                      alignItems: "center",
                      gap: 3,
                    }}
                  >
                    Detail <ChevronRight size={13} />
                  </button>
                </div>
                <p
                  style={{
                    fontFamily: "'Inter', sans-serif",
                    fontSize: 12.5,
                    color: "#4A5568",
                    marginBottom: 18,
                  }}
                >
                  Skill yang perlu ditingkatkan berdasarkan posisi target Anda.
                </p>

                {skillGapItems.length === 0 ? (
                  <p
                    style={{
                      fontFamily: "'Inter', sans-serif",
                      fontSize: 13,
                      color: "#4A5568",
                      marginBottom: 16,
                      lineHeight: 1.6,
                    }}
                  >
                    Belum ada data analisis Skill Gap. Tambahkan keahlian pada profil Anda untuk
                    melihat laporan.
                  </p>
                ) : (
                  <div style={{ display: "flex", flexDirection: "column", gap: 12, marginBottom: 18 }}>
                    {skillGapItems.map((sg) => (
                      <div
                        key={sg.skill}
                        style={{
                          background: "#FFFFFF",
                          borderRadius: 14,
                          border: "1px solid #E2E8F0",
                          padding: "14px",
                        }}
                      >
                        <div
                          style={{
                            display: "flex",
                            justifyContent: "space-between",
                            marginBottom: 6,
                          }}
                        >
                          <span
                            style={{
                              fontFamily: "'Inter', sans-serif",
                              fontSize: 13.5,
                              fontWeight: 600,
                              color: "#0D1117",
                            }}
                          >
                            {sg.skill}
                          </span>
                          <span
                            style={{
                              fontFamily: "'Inter', sans-serif",
                              fontSize: 11.5,
                              color: sg.gap > 0 ? "#B45309" : "#047857",
                              fontWeight: 700,
                            }}
                          >
                            Gap {sg.gap}%
                          </span>
                        </div>
                        <div
                          style={{
                            height: 6,
                            borderRadius: 999,
                            background: "#E2E8F0",
                            overflow: "hidden",
                          }}
                        >
                          <div
                            style={{
                              height: "100%",
                              width: `${sg.level}%`,
                              background: "#0E67CC",
                              borderRadius: 999,
                            }}
                          />
                        </div>
                        <div
                          style={{
                            display: "flex",
                            justifyContent: "space-between",
                            marginTop: 6,
                          }}
                        >
                          <span
                            style={{
                              fontFamily: "'Inter', sans-serif",
                              fontSize: 11,
                              color: "#4A5568",
                            }}
                          >
                            Kamu: {sg.level}%
                          </span>
                          <span
                            style={{
                              fontFamily: "'Inter', sans-serif",
                              fontSize: 11,
                              color: "#4A5568",
                            }}
                          >
                            Target: 100%
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                <button
                  type="button"
                  onClick={() => navigate("/dashboard/kandidat/skill-gap")}
                  style={{
                    width: "100%",
                    minHeight: 42,
                    padding: "10px 16px",
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
                  Lihat Skill Gap Lengkap
                </button>
              </div>

              {/* Cross Region */}
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
                    justifyContent: "space-between",
                    alignItems: "center",
                    marginBottom: 6,
                  }}
                >
                  <h2
                    style={{
                      fontFamily: "'Poppins', sans-serif",
                      fontSize: 18,
                      fontWeight: 600,
                      color: "#0D1117",
                      margin: 0,
                    }}
                  >
                    Peluang Lintas Wilayah
                  </h2>
                  <button
                    type="button"
                    onClick={() => navigate("/dashboard/kandidat/cross-region")}
                    style={{
                      background: "none",
                      border: "none",
                      cursor: "pointer",
                      fontFamily: "'Inter', sans-serif",
                      fontSize: 12.5,
                      fontWeight: 600,
                      color: "#0E67CC",
                      display: "inline-flex",
                      alignItems: "center",
                      gap: 3,
                    }}
                  >
                    Lihat Semua <ChevronRight size={13} />
                  </button>
                </div>
                <p
                  style={{
                    fontFamily: "'Inter', sans-serif",
                    fontSize: 12.5,
                    color: "#4A5568",
                    marginBottom: 16,
                  }}
                >
                  Peluang menarik di luar kota Anda.
                </p>

                {crossRegionItems.length === 0 ? (
                  <p
                    style={{
                      fontFamily: "'Inter', sans-serif",
                      fontSize: 13,
                      color: "#4A5568",
                      margin: 0,
                    }}
                  >
                    Belum ada peluang lintas wilayah yang cocok saat ini.
                  </p>
                ) : (
                  <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                    {crossRegionItems.map((cr) => (
                      <div
                        key={cr.id}
                        style={{
                          padding: "16px",
                          borderRadius: 16,
                          border: "1px solid #E2E8F0",
                          background: "#FFFFFF",
                        }}
                      >
                        <div
                          style={{
                            display: "flex",
                            justifyContent: "space-between",
                            gap: 8,
                            marginBottom: 4,
                          }}
                        >
                          <div
                            style={{
                              fontFamily: "'Poppins', sans-serif",
                              fontSize: 13.5,
                              fontWeight: 600,
                              color: "#0D1117",
                            }}
                          >
                            {cr.title}
                          </div>
                          <div
                            style={{
                              fontFamily: "'Poppins', sans-serif",
                              fontSize: 13.5,
                              fontWeight: 700,
                              color: "#0E67CC",
                            }}
                          >
                            {cr.match}%
                          </div>
                        </div>
                        <div
                          style={{
                            fontFamily: "'Inter', sans-serif",
                            fontSize: 12.5,
                            color: "#4A5568",
                            marginBottom: 8,
                          }}
                        >
                          {cr.company}
                        </div>
                        <div style={{ display: "flex", gap: 8, marginBottom: 12, flexWrap: "wrap" }}>
                          <span
                            style={{
                              fontFamily: "'Inter', sans-serif",
                              fontSize: 11.5,
                              color: "#4A5568",
                              display: "inline-flex",
                              alignItems: "center",
                              gap: 4,
                            }}
                          >
                            <MapPin size={11} /> {cr.location}
                          </span>
                          <span
                            style={{
                              padding: "2px 8px",
                              borderRadius: 999,
                              background: "#F4F5F7",
                              border: "1px solid #E2E8F0",
                              fontFamily: "'Inter', sans-serif",
                              fontSize: 11,
                              fontWeight: 600,
                              color: "#0D1117",
                            }}
                          >
                            {cr.type}
                          </span>
                        </div>
                        <button
                          type="button"
                          onClick={() => navigate(`/dashboard/kandidat/pekerjaan/${cr.id}`)}
                          style={{
                            width: "100%",
                            minHeight: 38,
                            padding: "8px 12px",
                            borderRadius: 999,
                            border: "1px solid #CBD5E1",
                            background: "#FFFFFF",
                            fontFamily: "'Inter', sans-serif",
                            fontSize: 12,
                            fontWeight: 600,
                            color: "#0D1117",
                            cursor: "pointer",
                          }}
                        >
                          Lihat Peluang
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          <style>{`
            @media (max-width: 1024px) {
              .ravira-cand-grid {
                grid-template-columns: 1fr !important;
              }
            }
          `}</style>
        </>
      )}
    </DashboardLayout>
  );
}
