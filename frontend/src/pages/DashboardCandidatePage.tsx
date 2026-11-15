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

  // 1. Kelengkapan Profil (deterministic formula aligned with CandidateSelfProfilePage)
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

  // 3. Skill Gap Utama (honest binary coverage from backend report — no fabricated percentages)
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
      color: "#ff9a3c",
    }));
    const matched = matchedSkills.map((s) => ({
      skill: s.skillName,
      level: 100,
      gap: 0,
      color: "#10d98e",
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

  // 6. Peluang Lintas Wilayah (derived from real job recommendations)
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
      color: "#1677FF",
      icon: <User size={18} />,
      path: "/dashboard/kandidat/profil",
    },
    {
      label: "Rekomendasi Pekerjaan",
      value: String(jobRecs.length),
      sub: jobRecs.length > 0 ? `${highMatchCount} kecocokan tinggi` : "Belum ada rekomendasi",
      color: "#0D47A1",
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
      color: "#ff9a3c",
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
      color: "#10d98e",
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
      color: "#4DB8FF",
      icon: <FileText size={18} />,
      path: "/dashboard/kandidat/lamaran",
    },
  ];

  return (
    <DashboardLayout sidebarItems={sidebarItems} userName={displayName} userRole="Kandidat" userInitial={displayInitial}>
      <div style={{ marginBottom: 24 }}>
        <h1 style={{ fontFamily: "'Poppins', sans-serif", fontSize: 24, fontWeight: 800, color: "#0A1B3D", letterSpacing: "-0.5px", marginBottom: 4 }}>
          Halo, {displayName} 👋
        </h1>
        <p style={{ fontFamily: "'Inter', sans-serif", fontSize: 14, color: "#6a88b8" }}>
          Ini rekomendasi terbaik untuk Anda hari ini. AI kami terus bekerja di balik layar!
        </p>
      </div>

      {loading && (
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            padding: "56px 24px",
            background: "#fff",
            borderRadius: 18,
            border: "1px solid rgba(22,119,255,0.1)",
            boxShadow: "0 2px 12px rgba(10,27,61,0.05)",
            gap: 12,
            marginBottom: 24,
          }}
        >
          <Loader2 size={32} className="animate-spin" color="#1677FF" />
          <p style={{ fontFamily: "'Inter', sans-serif", fontSize: 14, color: "#6a88b8", margin: 0 }}>
            Memuat data dashboard kandidat...
          </p>
        </div>
      )}

      {!loading && error && (
        <div
          style={{
            background: "#fff",
            borderRadius: 18,
            border: "1px solid rgba(239,68,68,0.2)",
            boxShadow: "0 2px 12px rgba(10,27,61,0.05)",
            padding: "40px 24px",
            textAlign: "center",
            marginBottom: 24,
          }}
        >
          <AlertCircle size={36} color="#dc2626" style={{ margin: "0 auto 12px" }} />
          <p style={{ fontFamily: "'Inter', sans-serif", fontSize: 14, color: "#dc2626", marginBottom: 16 }}>
            {error}
          </p>
          <button
            onClick={() => void loadDashboardData()}
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 6,
              padding: "9px 18px",
              borderRadius: 10,
              background: "#1677FF",
              color: "#fff",
              border: "none",
              cursor: "pointer",
              fontFamily: "'Inter', sans-serif",
              fontSize: 13,
              fontWeight: 600,
            }}
          >
            <RefreshCw size={14} /> Coba Lagi
          </button>
        </div>
      )}

      {!loading && !error && (
        <>
          {/* Stats row */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: 16, marginBottom: 28 }}>
            {statsCards.map((s) => (
              <div
                key={s.label}
                onClick={() => navigate(s.path)}
                style={{
                  background: "#fff",
                  borderRadius: 14,
                  border: "1px solid rgba(22,119,255,0.1)",
                  boxShadow: "0 2px 12px rgba(10,27,61,0.05)",
                  padding: "18px 16px",
                  position: "relative",
                  overflow: "hidden",
                  transition: "transform 0.2s",
                  cursor: "pointer",
                }}
                onMouseEnter={(e) => (e.currentTarget.style.transform = "translateY(-3px)")}
                onMouseLeave={(e) => (e.currentTarget.style.transform = "translateY(0)")}
              >
                <div
                  style={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    right: 0,
                    height: 3,
                    background: `linear-gradient(90deg, ${s.color}, ${s.color}55)`,
                    borderRadius: "14px 14px 0 0",
                  }}
                />
                <div
                  style={{
                    width: 36,
                    height: 36,
                    borderRadius: 10,
                    background: `${s.color}12`,
                    border: `1px solid ${s.color}22`,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    marginBottom: 10,
                    color: s.color,
                  }}
                >
                  {s.icon}
                </div>
                <div style={{ fontFamily: "'Poppins', sans-serif", fontSize: 24, fontWeight: 800, color: s.color, lineHeight: 1, marginBottom: 4 }}>
                  {s.value}
                </div>
                <div style={{ fontFamily: "'Poppins', sans-serif", fontSize: 11, fontWeight: 600, color: "#0A1B3D", marginBottom: 2 }}>
                  {s.label}
                </div>
                <div style={{ fontFamily: "'Inter', sans-serif", fontSize: 11, color: "#9ab4cc" }}>{s.sub}</div>
              </div>
            ))}
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 340px", gap: 20, alignItems: "start" }}>
            <div>
              {/* Job Recommendations */}
              <div style={{ background: "#fff", borderRadius: 18, border: "1px solid rgba(22,119,255,0.1)", boxShadow: "0 2px 12px rgba(10,27,61,0.05)", padding: "24px", marginBottom: 20 }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
                  <h2 style={{ fontFamily: "'Poppins', sans-serif", fontSize: 17, fontWeight: 700, color: "#0A1B3D" }}>Rekomendasi Pekerjaan</h2>
                  <button
                    onClick={() => navigate("/dashboard/kandidat/rekomendasi")}
                    style={{ background: "none", border: "none", cursor: "pointer", fontFamily: "'Inter', sans-serif", fontSize: 13, color: "#1677FF", display: "flex", alignItems: "center", gap: 4 }}
                  >
                    Lihat Semua <ChevronRight size={14} />
                  </button>
                </div>

                {jobRecs.length === 0 ? (
                  <div style={{ padding: "24px 16px", textAlign: "center", borderRadius: 12, background: "#f8fbff", border: "1px solid rgba(22,119,255,0.1)" }}>
                    <p style={{ fontFamily: "'Inter', sans-serif", fontSize: 13, color: "#6a88b8", marginBottom: 12 }}>
                      Belum ada rekomendasi pekerjaan yang tersedia saat ini. Lengkapi profil dan keterampilan Anda untuk mendapatkan pencocokan AI.
                    </p>
                    <button
                      onClick={() => navigate("/dashboard/kandidat/profil")}
                      style={{
                        padding: "8px 16px",
                        borderRadius: 9,
                        border: "1px solid rgba(22,119,255,0.25)",
                        background: "#f0f7ff",
                        fontFamily: "'Inter', sans-serif",
                        fontSize: 12,
                        fontWeight: 600,
                        color: "#1677FF",
                        cursor: "pointer",
                      }}
                    >
                      Lengkapi Profil
                    </button>
                  </div>
                ) : (
                  <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                    {jobRecs.slice(0, 3).map((rec) => {
                      const jobTitle = rec.job.title;
                      const companyName = rec.company.name;
                      const jobLocation = rec.job.location || rec.company.location || "Indonesia";
                      const jobType = rec.job.workType || rec.job.jobType || "Full-time";
                      const reasonText =
                        rec.matchExplanation?.[0] || "Berdasarkan kesesuaian profil dan kompetensi Anda";

                      return (
                        <div
                          key={rec.job.id}
                          style={{
                            padding: "16px",
                            borderRadius: 12,
                            border: "1px solid rgba(22,119,255,0.1)",
                            background: "#f8fbff",
                            transition: "border-color 0.2s, box-shadow 0.2s",
                          }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.borderColor = "#1677FF30";
                            e.currentTarget.style.boxShadow = "0 4px 16px rgba(22,119,255,0.08)";
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.borderColor = "rgba(22,119,255,0.1)";
                            e.currentTarget.style.boxShadow = "none";
                          }}
                        >
                          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 8 }}>
                            <div>
                              <div style={{ fontFamily: "'Poppins', sans-serif", fontSize: 15, fontWeight: 700, color: "#0A1B3D", marginBottom: 3 }}>
                                {jobTitle}
                              </div>
                              <div style={{ fontFamily: "'Inter', sans-serif", fontSize: 13, color: "#6a88b8" }}>
                                {companyName}
                              </div>
                            </div>
                            <div style={{ textAlign: "right" }}>
                              <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 20, fontWeight: 800, color: "#1677FF", lineHeight: 1 }}>
                                {rec.matchScore}%
                              </div>
                              <div style={{ fontFamily: "'Inter', sans-serif", fontSize: 10, color: "#9ab4cc" }}>match score</div>
                            </div>
                          </div>
                          <div style={{ display: "flex", gap: 8, marginBottom: 10, flexWrap: "wrap" }}>
                            <span style={{ display: "flex", alignItems: "center", gap: 4, fontFamily: "'Inter', sans-serif", fontSize: 12, color: "#6a88b8" }}>
                              <MapPin size={11} /> {jobLocation}
                            </span>
                            <span style={{ display: "flex", alignItems: "center", gap: 4, fontFamily: "'Inter', sans-serif", fontSize: 12, color: "#6a88b8" }}>
                              <Clock size={11} /> {jobType}
                            </span>
                          </div>
                          <div style={{ fontFamily: "'Inter', sans-serif", fontSize: 12, color: "#4a6a9a", background: "rgba(22,119,255,0.05)", padding: "6px 10px", borderRadius: 8, marginBottom: 12 }}>
                            💡 {reasonText}
                          </div>
                          <div style={{ display: "flex", gap: 8 }}>
                            <button
                              onClick={() => navigate("/dashboard/kandidat/rekomendasi")}
                              style={{
                                flex: 1,
                                padding: "8px",
                                borderRadius: 9,
                                border: "1px solid rgba(22,119,255,0.25)",
                                background: "#f0f7ff",
                                fontFamily: "'Inter', sans-serif",
                                fontSize: 13,
                                fontWeight: 500,
                                color: "#1677FF",
                                cursor: "pointer",
                              }}
                            >
                              Lihat Rekomendasi
                            </button>
                            <button
                              onClick={() => navigate(`/dashboard/kandidat/pekerjaan/${rec.job.id}`)}
                              style={{
                                flex: 1,
                                padding: "8px",
                                borderRadius: 9,
                                border: "none",
                                background: "linear-gradient(135deg, #1677FF, #0D47A1)",
                                fontFamily: "'Inter', sans-serif",
                                fontSize: 13,
                                fontWeight: 600,
                                color: "#fff",
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
              <div style={{ background: "#fff", borderRadius: 18, border: "1px solid rgba(22,119,255,0.1)", boxShadow: "0 2px 12px rgba(10,27,61,0.05)", padding: "24px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
                  <h2 style={{ fontFamily: "'Poppins', sans-serif", fontSize: 17, fontWeight: 700, color: "#0A1B3D" }}>
                    Pelatihan yang Direkomendasikan
                  </h2>
                  <button
                    onClick={() => navigate("/dashboard/kandidat/pelatihan")}
                    style={{ background: "none", border: "none", cursor: "pointer", fontFamily: "'Inter', sans-serif", fontSize: 13, color: "#1677FF", display: "flex", alignItems: "center", gap: 4 }}
                  >
                    Lihat Semua <ChevronRight size={14} />
                  </button>
                </div>

                {displayedTrainings.length === 0 ? (
                  <div style={{ padding: "20px 16px", textAlign: "center", borderRadius: 12, background: "#f8fbff", border: "1px solid rgba(22,119,255,0.1)" }}>
                    <p style={{ fontFamily: "'Inter', sans-serif", fontSize: 13, color: "#6a88b8", margin: 0 }}>
                      Belum ada rekomendasi pelatihan saat ini. Periksa analisis Skill Gap Anda untuk mendapatkan rekomendasi kursus yang sesuai.
                    </p>
                  </div>
                ) : (
                  displayedTrainings.map((t) => (
                    <div
                      key={t.id}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 14,
                        padding: "14px 0",
                        borderBottom: "1px solid rgba(22,119,255,0.06)",
                      }}
                    >
                      <div
                        style={{
                          width: 42,
                          height: 42,
                          borderRadius: 12,
                          background: "linear-gradient(135deg, rgba(22,119,255,0.12), rgba(77,184,255,0.1))",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          flexShrink: 0,
                        }}
                      >
                        <BookOpen size={18} color="#1677FF" />
                      </div>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ fontFamily: "'Poppins', sans-serif", fontSize: 13, fontWeight: 600, color: "#0A1B3D", marginBottom: 2 }}>
                          {t.title}
                        </div>
                        <div style={{ fontFamily: "'Inter', sans-serif", fontSize: 11, color: "#6a88b8", marginBottom: 6 }}>
                          {t.platform} · {t.duration} · {t.level}
                        </div>
                        <div style={{ height: 4, borderRadius: 2, background: "#e8f0fe", overflow: "hidden" }}>
                          <div
                            style={{
                              height: "100%",
                              width: `${t.progress}%`,
                              background: "linear-gradient(90deg, #1677FF, #4DB8FF)",
                              borderRadius: 2,
                            }}
                          />
                        </div>
                        <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10, color: "#1677FF", marginTop: 3 }}>
                          {t.progress}% selesai
                        </div>
                      </div>
                      <button
                        onClick={() => navigate("/dashboard/kandidat/pelatihan")}
                        style={{
                          padding: "7px 14px",
                          borderRadius: 9,
                          border: "none",
                          background: "rgba(22,119,255,0.1)",
                          fontFamily: "'Inter', sans-serif",
                          fontSize: 12,
                          fontWeight: 600,
                          color: "#1677FF",
                          cursor: "pointer",
                          whiteSpace: "nowrap",
                        }}
                      >
                        Mulai Belajar
                      </button>
                    </div>
                  ))
                )}
              </div>
            </div>

            <div>
              {/* Skill Gap */}
              <div style={{ background: "#fff", borderRadius: 18, border: "1px solid rgba(22,119,255,0.1)", boxShadow: "0 2px 12px rgba(10,27,61,0.05)", padding: "24px", marginBottom: 20 }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
                  <h2 style={{ fontFamily: "'Poppins', sans-serif", fontSize: 17, fontWeight: 700, color: "#0A1B3D" }}>Skill Gap Report</h2>
                  <button
                    onClick={() => navigate("/dashboard/kandidat/skill-gap")}
                    style={{ background: "none", border: "none", cursor: "pointer", fontFamily: "'Inter', sans-serif", fontSize: 12, color: "#1677FF", display: "flex", alignItems: "center", gap: 3 }}
                  >
                    Detail <ChevronRight size={13} />
                  </button>
                </div>
                <p style={{ fontFamily: "'Inter', sans-serif", fontSize: 12, color: "#6a88b8", marginBottom: 18 }}>
                  Skill yang perlu ditingkatkan berdasarkan posisi target Anda.
                </p>

                {skillGapItems.length === 0 ? (
                  <p style={{ fontFamily: "'Inter', sans-serif", fontSize: 12, color: "#6a88b8", marginBottom: 16 }}>
                    Belum ada data analisis Skill Gap. Tambahkan keahlian pada profil Anda untuk melihat laporan.
                  </p>
                ) : (
                  skillGapItems.map((sg) => (
                    <div key={sg.skill} style={{ marginBottom: 16 }}>
                      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 5 }}>
                        <span style={{ fontFamily: "'Inter', sans-serif", fontSize: 13, fontWeight: 500, color: "#0A1B3D" }}>{sg.skill}</span>
                        <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11, color: sg.color, fontWeight: 700 }}>
                          Gap {sg.gap}%
                        </span>
                      </div>
                      <div style={{ height: 6, borderRadius: 3, background: "#e8f0fe", overflow: "hidden" }}>
                        <div
                          style={{
                            height: "100%",
                            width: `${sg.level}%`,
                            background: "linear-gradient(90deg, #1677FF, #4DB8FF)",
                            borderRadius: 3,
                          }}
                        />
                      </div>
                      <div style={{ display: "flex", justifyContent: "space-between", marginTop: 3 }}>
                        <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10, color: "#9ab4cc" }}>
                          Kamu: {sg.level}%
                        </span>
                        <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10, color: "#9ab4cc" }}>Target: 100%</span>
                      </div>
                    </div>
                  ))
                )}

                <button
                  onClick={() => navigate("/dashboard/kandidat/skill-gap")}
                  style={{
                    width: "100%",
                    marginTop: 4,
                    padding: "9px",
                    borderRadius: 10,
                    border: "1px solid rgba(22,119,255,0.2)",
                    background: "#f0f7ff",
                    fontFamily: "'Inter', sans-serif",
                    fontSize: 13,
                    fontWeight: 600,
                    color: "#1677FF",
                    cursor: "pointer",
                  }}
                >
                  Lihat Skill Gap Lengkap
                </button>
              </div>

              {/* Cross Region */}
              <div style={{ background: "#fff", borderRadius: 18, border: "1px solid rgba(22,119,255,0.1)", boxShadow: "0 2px 12px rgba(10,27,61,0.05)", padding: "24px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
                  <h2 style={{ fontFamily: "'Poppins', sans-serif", fontSize: 17, fontWeight: 700, color: "#0A1B3D" }}>Peluang Lintas Wilayah</h2>
                  <button
                    onClick={() => navigate("/dashboard/kandidat/cross-region")}
                    style={{ background: "none", border: "none", cursor: "pointer", fontFamily: "'Inter', sans-serif", fontSize: 12, color: "#1677FF", display: "flex", alignItems: "center", gap: 3 }}
                  >
                    Lihat Semua <ChevronRight size={13} />
                  </button>
                </div>
                <p style={{ fontFamily: "'Inter', sans-serif", fontSize: 12, color: "#6a88b8", marginBottom: 18 }}>
                  Peluang menarik di luar kota Anda.
                </p>

                {crossRegionItems.length === 0 ? (
                  <p style={{ fontFamily: "'Inter', sans-serif", fontSize: 12, color: "#6a88b8", margin: 0 }}>
                    Belum ada peluang lintas wilayah yang cocok saat ini.
                  </p>
                ) : (
                  crossRegionItems.map((cr) => (
                    <div
                      key={cr.id}
                      style={{
                        padding: "14px",
                        borderRadius: 12,
                        border: "1px solid rgba(77,184,255,0.15)",
                        background: "rgba(77,184,255,0.04)",
                        marginBottom: 10,
                      }}
                    >
                      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
                        <div style={{ fontFamily: "'Poppins', sans-serif", fontSize: 13, fontWeight: 700, color: "#0A1B3D" }}>{cr.title}</div>
                        <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 14, fontWeight: 700, color: "#4DB8FF" }}>
                          {cr.match}%
                        </div>
                      </div>
                      <div style={{ fontFamily: "'Inter', sans-serif", fontSize: 12, color: "#6a88b8", marginBottom: 4 }}>{cr.company}</div>
                      <div style={{ display: "flex", gap: 8, marginBottom: 10 }}>
                        <span style={{ fontFamily: "'Inter', sans-serif", fontSize: 11, color: "#6a88b8", display: "flex", alignItems: "center", gap: 3 }}>
                          <MapPin size={10} /> {cr.location}
                        </span>
                        <span style={{ padding: "2px 8px", borderRadius: 6, background: "rgba(77,184,255,0.1)", fontFamily: "'Inter', sans-serif", fontSize: 11, color: "#4DB8FF" }}>
                          {cr.type}
                        </span>
                      </div>
                      <button
                        onClick={() => navigate(`/dashboard/kandidat/pekerjaan/${cr.id}`)}
                        style={{
                          width: "100%",
                          padding: "7px",
                          borderRadius: 9,
                          border: "1px solid rgba(77,184,255,0.3)",
                          background: "transparent",
                          fontFamily: "'Inter', sans-serif",
                          fontSize: 12,
                          fontWeight: 600,
                          color: "#4DB8FF",
                          cursor: "pointer",
                        }}
                      >
                        Lihat Peluang
                      </button>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </>
      )}
    </DashboardLayout>
  );
}
