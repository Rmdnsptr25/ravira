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
        setError(err instanceof Error ? err.message : "Gagal memuat analisis skill gap dari server.");
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

  const card: React.CSSProperties = {
    background: "#fff",
    borderRadius: 16,
    padding: "24px",
    boxShadow: "0 2px 12px rgba(10,27,61,0.07)",
    border: "1px solid rgba(22,119,255,0.08)",
  };

  // Calculations based on real API data
  const matchedList = report?.matchedSkills ?? [];
  const missingList = report?.missingSkills ?? [];
  const priorityList = report?.prioritySkills ?? [];

  const matchedWeight = matchedList.reduce((sum, s) => sum + s.weight, 0);
  const missingWeight = missingList.reduce((sum, s) => sum + s.weight, 0);
  const totalWeight = matchedWeight + missingWeight;
  const overallMatchPct = totalWeight > 0 ? Math.round((matchedWeight / totalWeight) * 100) : (matchedList.length > 0 ? 100 : 0);

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
      const priorityInfo = priorityList.find((p) => p.skillName.toLowerCase() === m.skillName.toLowerCase());
      return {
        name: m.skillName,
        current: 0,
        target: 100,
        gap: 100,
        status: "Perlu Ditingkatkan" as const,
        required: m.required,
        reason: priorityInfo?.reason?.join(" ") || `Skill ini dibutuhkan pada pasar kerja ${m.marketDemandCount > 0 ? `(${m.marketDemandCount} lowongan)` : ""}.`,
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
      {/* Header */}
      <div style={{ marginBottom: 28 }}>
        <h1 style={{ fontFamily: "'Poppins', sans-serif", fontSize: 24, fontWeight: 700, color: "#0A1B3D", margin: 0 }}>
          Skill Gap Analysis
        </h1>
        <p style={{ fontFamily: "'Inter', sans-serif", fontSize: 14, color: "#6a88b8", marginTop: 6 }}>
          Identifikasi skill yang perlu ditingkatkan berdasarkan target karier nyata Anda.
        </p>
      </div>

      {loading && (
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "64px 24px", background: "#fff", borderRadius: 16, border: "1px solid rgba(22,119,255,0.1)", gap: 12, marginBottom: 24 }}>
          <Loader2 size={32} className="animate-spin" color="#1677FF" />
          <p style={{ fontFamily: "'Inter', sans-serif", fontSize: 14, color: "#6a88b8", margin: 0 }}>
            Menganalisis kesenjangan kompetensi profil Anda...
          </p>
        </div>
      )}

      {!loading && error && (
        <div style={{ ...card, textAlign: "center", padding: "48px 24px", borderColor: "rgba(239,68,68,0.2)", marginBottom: 28 }}>
          <AlertCircle size={40} color="#dc2626" style={{ margin: "0 auto 12px" }} />
          <p style={{ fontFamily: "'Inter', sans-serif", fontSize: 14, color: "#dc2626", marginBottom: 16 }}>{error}</p>
          <button
            onClick={() => void loadSkillGap(targetRole)}
            style={{ display: "inline-flex", alignItems: "center", gap: 6, padding: "8px 18px", borderRadius: 8, background: "#1677FF", color: "#fff", border: "none", cursor: "pointer", fontFamily: "'Inter', sans-serif", fontSize: 13, fontWeight: 600 }}
          >
            <RefreshCw size={14} /> Coba Lagi
          </button>
        </div>
      )}

      {!loading && !error && !hasOwnedSkills && (
        <div style={{ ...card, textAlign: "center", padding: "48px 24px", marginBottom: 28 }}>
          <AlertCircle size={40} color="#1677FF" style={{ margin: "0 auto 12px" }} />
          <h2 style={{ fontFamily: "'Poppins', sans-serif", fontSize: 17, fontWeight: 700, color: "#0A1B3D", marginBottom: 8 }}>
            Profil Keterampilan Belum Diisi
          </h2>
          <p style={{ fontFamily: "'Inter', sans-serif", fontSize: 14, color: "#6a88b8", maxWidth: 500, margin: "0 auto 20px" }}>
            Anda belum menambahkan keahlian atau mengunggah CV. Tambahkan keterampilan pada menu profil Anda untuk melihat analisis perbandingan skill yang akurat.
          </p>
          <button
            onClick={() => navigate("/dashboard/kandidat/profil")}
            style={{ padding: "9px 22px", borderRadius: 10, border: "none", background: "linear-gradient(135deg, #1677FF, #0D47A1)", color: "#fff", fontFamily: "'Inter', sans-serif", fontSize: 13, fontWeight: 600, cursor: "pointer" }}
          >
            Buka Profil Saya
          </button>
        </div>
      )}

      {!loading && !error && report && (
        <>
          {/* Overall match score + target posisi row */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20, marginBottom: 28 }}>
            {/* Match Score Card */}
            <div style={{ ...card, display: "flex", flexDirection: "column", gap: 16 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <div style={{ width: 36, height: 36, borderRadius: 10, background: "linear-gradient(135deg, #1677FF22, #4DB8FF22)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <TrendingUp size={18} color="#1677FF" />
                </div>
                <div>
                  <div style={{ fontFamily: "'Poppins', sans-serif", fontSize: 13, fontWeight: 600, color: "#0A1B3D" }}>Overall Match Score</div>
                  <div style={{ fontFamily: "'Inter', sans-serif", fontSize: 12, color: "#6a88b8" }}>Terhadap target posisi {report.targetRole || targetRole}</div>
                </div>
              </div>
              <div style={{ display: "flex", alignItems: "flex-end", gap: 8 }}>
                <span style={{ fontFamily: "'Poppins', sans-serif", fontSize: 48, fontWeight: 800, color: "#1677FF", lineHeight: 1 }}>{overallMatchPct}</span>
                <span style={{ fontFamily: "'Poppins', sans-serif", fontSize: 24, fontWeight: 700, color: "#4DB8FF", marginBottom: 4 }}>%</span>
                <span style={{ fontFamily: "'Inter', sans-serif", fontSize: 13, color: "#6a88b8", marginBottom: 6, marginLeft: 4 }}>/ 100%</span>
              </div>
              <div style={{ position: "relative", height: 10, background: "#eef4ff", borderRadius: 99 }}>
                <div style={{ position: "absolute", left: 0, top: 0, height: "100%", width: `${overallMatchPct}%`, borderRadius: 99, background: "linear-gradient(90deg, #1677FF, #4DB8FF)" }} />
              </div>
              <div style={{ fontFamily: "'Inter', sans-serif", fontSize: 12, color: missingList.length > 0 ? "#ff9a3c" : "#10d98e" }}>
                {missingList.length > 0
                  ? `Tingkatkan ${missingList.length} skill untuk mencapai 100% match`
                  : "Selamat! Semua skill utama target posisi telah Anda kuasai."}
              </div>
            </div>

            {/* Target Posisi Card */}
            <div style={{ ...card, display: "flex", flexDirection: "column", gap: 12 }}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <div style={{ fontFamily: "'Poppins', sans-serif", fontSize: 14, fontWeight: 600, color: "#0A1B3D" }}>Target Posisi</div>
                <button
                  onClick={() => setShowCareerModal(true)}
                  style={{
                    fontFamily: "'Inter', sans-serif", fontSize: 12, fontWeight: 600,
                    padding: "6px 14px", borderRadius: 8, border: "1.5px solid #1677FF",
                    background: "transparent", color: "#1677FF", cursor: "pointer",
                  }}
                >
                  Ubah Target Karier
                </button>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
                <div style={{ width: 52, height: 52, borderRadius: 14, background: "linear-gradient(135deg, #0A1B3D, #1677FF)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                  <Briefcase size={24} color="#fff" />
                </div>
                <div>
                  <div style={{ fontFamily: "'Poppins', sans-serif", fontSize: 18, fontWeight: 700, color: "#0A1B3D" }}>{report.targetRole || targetRole}</div>
                  <div style={{ fontFamily: "'Inter', sans-serif", fontSize: 13, color: "#6a88b8", marginTop: 2 }}>
                    Kategori: Rekayasa Perangkat Lunak & Teknologi
                  </div>
                </div>
              </div>
              <div style={{ display: "flex", gap: 8, marginTop: 4, flexWrap: "wrap" }}>
                {matchedList.slice(0, 4).map((m) => (
                  <span key={m.skillName} style={{ fontFamily: "'Inter', sans-serif", fontSize: 11, padding: "3px 10px", borderRadius: 99, background: "#f0f7ff", color: "#1677FF", border: "1px solid rgba(22,119,255,0.18)" }}>
                    {m.skillName}
                  </span>
                ))}
              </div>
              <div style={{ marginTop: "auto", padding: "10px 14px", borderRadius: 10, background: "#f0f7ff", fontFamily: "'Inter', sans-serif", fontSize: 12, color: "#3a5480" }}>
                <span style={{ fontWeight: 600, color: "#0A1B3D" }}>{missingList.length} skill</span> perlu ditingkatkan · <span style={{ fontWeight: 600, color: "#0A1B3D" }}>{matchedList.length} skill</span> sudah memenuhi target
              </div>
            </div>
          </div>

          {/* Skill Items Grid */}
          <div style={{ ...card, marginBottom: 28 }}>
            <div style={{ fontFamily: "'Poppins', sans-serif", fontSize: 16, fontWeight: 700, color: "#0A1B3D", marginBottom: 20 }}>
              Detail Skill Gap
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))", gap: 16 }}>
              {allSkillsForDisplay.map((skill) => {
                const isBad = skill.status === "Perlu Ditingkatkan";
                const barColor = skill.current >= 80 ? "#10d98e" : "#ff9a3c";
                const isExpanded = expandedSkill === skill.name;
                return (
                  <div
                    key={skill.name}
                    onClick={() => setExpandedSkill(isExpanded ? null : skill.name)}
                    style={{
                      padding: "16px 18px",
                      borderRadius: 12,
                      border: `1px solid ${isExpanded ? "rgba(22,119,255,0.35)" : isBad ? "rgba(255,154,60,0.18)" : "rgba(16,217,142,0.18)"}`,
                      background: isExpanded ? "rgba(22,119,255,0.04)" : isBad ? "rgba(255,154,60,0.03)" : "rgba(16,217,142,0.03)",
                      cursor: "pointer",
                      transition: "border-color 0.15s, background 0.15s",
                    }}
                  >
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
                      <span style={{ fontFamily: "'Poppins', sans-serif", fontSize: 13, fontWeight: 600, color: "#0A1B3D" }}>{skill.name}</span>
                      <span style={{
                        display: "flex", alignItems: "center", gap: 4,
                        fontFamily: "'Inter', sans-serif", fontSize: 11, fontWeight: 600,
                        padding: "3px 10px", borderRadius: 99,
                        background: isBad ? "rgba(255,154,60,0.12)" : "rgba(16,217,142,0.12)",
                        color: isBad ? "#ff9a3c" : "#10d98e",
                      }}>
                        {isBad ? <AlertCircle size={11} /> : <CheckCircle size={11} />}
                        {skill.status}
                      </span>
                    </div>

                    {/* Bar */}
                    <div style={{ position: "relative", height: 8, background: "#eef4ff", borderRadius: 99, marginBottom: 8 }}>
                      <div style={{ position: "absolute", left: 0, top: 0, height: "100%", width: `${skill.current}%`, borderRadius: 99, background: `linear-gradient(90deg, ${barColor}aa, ${barColor})` }} />
                    </div>

                    <div style={{ display: "flex", justifyContent: "space-between", fontFamily: "'JetBrains Mono', monospace", fontSize: 11 }}>
                      <span style={{ color: barColor, fontWeight: 700 }}>Level saat ini: {skill.current}%</span>
                      <span style={{ color: "#6a88b8" }}>Target: {skill.target}%</span>
                    </div>

                    {isBad && (
                      <div style={{ marginTop: 8, fontFamily: "'Inter', sans-serif", fontSize: 11, color: "#ff6b6b", display: "flex", alignItems: "center", gap: 4 }}>
                        <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#ff6b6b", display: "inline-block", flexShrink: 0 }} />
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
                          borderRadius: 10,
                          background: "#f0f7ff",
                          border: "1px solid rgba(22,119,255,0.15)",
                        }}
                      >
                        <div style={{ fontFamily: "'Inter', sans-serif", fontSize: 11, color: "#6a88b8", marginBottom: 10 }}>
                          {skill.reason}
                        </div>
                        {isBad && (
                          <button
                            onClick={() => navigate("/dashboard/kandidat/pelatihan")}
                            style={{
                              fontFamily: "'Inter', sans-serif", fontSize: 12, fontWeight: 600,
                              padding: "7px 14px", borderRadius: 8, border: "none",
                              background: "linear-gradient(135deg, #1677FF, #4DB8FF)", color: "#fff", cursor: "pointer",
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
            <div style={{ ...card }}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20 }}>
                <div>
                  <div style={{ fontFamily: "'Poppins', sans-serif", fontSize: 16, fontWeight: 700, color: "#0A1B3D" }}>Rekomendasi Pelatihan</div>
                  <div style={{ fontFamily: "'Inter', sans-serif", fontSize: 13, color: "#6a88b8", marginTop: 2 }}>Dipilih AI berdasarkan skill gap prioritas Anda</div>
                </div>
                <button
                  onClick={() => navigate("/dashboard/kandidat/pelatihan")}
                  style={{
                    fontFamily: "'Inter', sans-serif", fontSize: 13, fontWeight: 600,
                    padding: "8px 18px", borderRadius: 10, border: "1.5px solid #1677FF",
                    background: "transparent", color: "#1677FF", cursor: "pointer",
                  }}
                >
                  Lihat Semua
                </button>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: 16 }}>
                {recommendedCourses.map((rec) => (
                  <div
                    key={rec.id}
                    style={{ padding: "18px", borderRadius: 14, border: "1px solid rgba(22,119,255,0.1)", background: "#f8fbff" }}
                  >
                    <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12 }}>
                      <div style={{ width: 40, height: 40, borderRadius: 10, background: "#1677FF18", display: "flex", alignItems: "center", justifyContent: "center" }}>
                        <BookOpen size={18} color="#1677FF" />
                      </div>
                      <div>
                        <div style={{ fontFamily: "'Poppins', sans-serif", fontSize: 13, fontWeight: 700, color: "#0A1B3D" }}>{rec.title}</div>
                        <div style={{ fontFamily: "'Inter', sans-serif", fontSize: 11, color: "#6a88b8" }}>{rec.provider}</div>
                      </div>
                    </div>

                    <div style={{ display: "flex", gap: 8, marginBottom: 12 }}>
                      <span style={{ fontFamily: "'Inter', sans-serif", fontSize: 11, padding: "3px 9px", borderRadius: 99, background: "#eef4ff", color: "#1677FF" }}>{rec.duration}</span>
                      <span style={{ fontFamily: "'Inter', sans-serif", fontSize: 11, padding: "3px 9px", borderRadius: 99, background: "#eef4ff", color: "#1677FF" }}>{rec.difficulty}</span>
                    </div>

                    <div style={{ fontFamily: "'Inter', sans-serif", fontSize: 11, color: "#6a88b8", marginBottom: 14 }}>
                      Target: <span style={{ fontWeight: 600, color: "#0A1B3D" }}>{rec.skillTargets.join(", ")}</span>
                    </div>

                    <button
                      onClick={() => navigate("/dashboard/kandidat/pelatihan")}
                      style={{
                        width: "100%", fontFamily: "'Inter', sans-serif", fontSize: 13, fontWeight: 600,
                        padding: "9px", borderRadius: 10, border: "none",
                        background: "linear-gradient(135deg, #1677FF, #4DB8FF)", color: "#fff", cursor: "pointer",
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
