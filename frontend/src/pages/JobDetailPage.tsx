import { useCallback, useEffect, useState } from "react";
import { useParams, useNavigate, useSearchParams } from "react-router";
import {
  MapPin,
  Clock,
  DollarSign,
  Bookmark,
  CheckCircle2,
  XCircle,
  BookOpen,
  Building2,
  ChevronRight,
  Home,
  Briefcase,
  BarChart2,
  FileText,
  Globe,
  User,
  Settings,
  AlertCircle,
  Loader2,
  RefreshCw,
} from "lucide-react";
import { toast } from "sonner";
import { DashboardLayout } from "../components/DashboardLayout";
import type { SidebarItem } from "../components/DashboardLayout";
import { ApplicationConfirmModal, ApplicationSuccessModal } from "../components/Modals";
import { useAppContext } from "../contexts/AppContext";
import {
  getJobById,
  getJobMatchScore,
  getTrainingRecommendations,
  type PublicJob,
  type JobMatchScore,
  type CourseItem,
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

function formatSalary(min: number | null, max: number | null): string {
  if (!min && !max) return "Gaji kompetitif";
  const formatter = new Intl.NumberFormat("id-ID", { notation: "compact", maximumFractionDigits: 1 });
  if (min && max) return `Rp ${formatter.format(min)} – Rp ${formatter.format(max)}`;
  return `Mulai Rp ${formatter.format(min ?? max ?? 0)}`;
}

function formatDateAgo(dateStr: string): string {
  const diffDays = Math.floor((Date.now() - new Date(dateStr).getTime()) / (1000 * 60 * 60 * 24));
  if (diffDays <= 0) return "Hari ini";
  if (diffDays === 1) return "1 hari lalu";
  return `${diffDays} hari lalu`;
}

export default function JobDetailPage() {
  const { id: paramId } = useParams<{ id: string }>();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { applyToJob, isJobSaved, saveJob, unsaveJob, user, hasApplied } = useAppContext();

  const jobId = paramId || searchParams.get("id") || "";
  const saved = jobId ? isJobSaved(jobId) : false;

  const [job, setJob] = useState<PublicJob | null>(null);
  const [matchScoreData, setMatchScoreData] = useState<JobMatchScore | null>(null);
  const [recommendedCourses, setRecommendedCourses] = useState<CourseItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [showApplyModal, setShowApplyModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  const displayName = user?.fullName || "Kandidat";
  const displayInitial = (displayName[0] || "K").toUpperCase();

  const loadJobDetail = useCallback(async (signal?: AbortSignal) => {
    if (!jobId) {
      setError("ID lowongan tidak ditemukan pada tautan URL.");
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const jobData = await getJobById(jobId, signal);
      if (signal?.aborted) return;
      setJob(jobData);

      // Load match score if candidate is authenticated
      if (user?.role === "CANDIDATE") {
        try {
          const matchResult = await getJobMatchScore(jobId, signal);
          if (!signal?.aborted) {
            setMatchScoreData(matchResult);
          }
        } catch {
          // If match score calculation fails, keep matchScoreData null
        }

        try {
          const trainingResult = await getTrainingRecommendations({ jobId }, signal);
          if (!signal?.aborted && trainingResult.recommendations?.length > 0) {
            const courses = trainingResult.recommendations.flatMap((r) => r.recommendedCourses);
            setRecommendedCourses(courses.slice(0, 3));
          }
        } catch {
          // If training recommendations fail, ignore
        }
      }
    } catch (err) {
      if (!signal?.aborted) {
        setError(err instanceof Error ? err.message : "Lowongan tidak ditemukan atau tidak lagi dipublikasikan.");
      }
    } finally {
      if (!signal?.aborted) {
        setLoading(false);
      }
    }
  }, [jobId, user]);

  useEffect(() => {
    const controller = new AbortController();
    queueMicrotask(() => {
      if (!controller.signal.aborted) {
        void loadJobDetail(controller.signal);
      }
    });
    return () => controller.abort();
  }, [loadJobDetail]);

  const alreadyApplied = job ? hasApplied(job.title, job.company.name) : false;

  const matchedSkills = matchScoreData?.breakdown?.skillMatch?.matchedSkills ?? [];
  const missingSkills = matchScoreData?.breakdown?.skillMatch?.missingRequiredSkills ?? [];
  const matchPercentage = matchScoreData ? matchScoreData.matchScore : 0;
  const aiExplanation = matchScoreData?.matchExplanation?.[0] || "AI Match Score dihitung berdasarkan kecocokan skill, lokasi, dan preferensi profil Anda.";

  if (loading) {
    return (
      <DashboardLayout sidebarItems={sidebarItems} userName={displayName} userRole="Kandidat" userInitial={displayInitial}>
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "80px 24px", background: "#fff", borderRadius: 18, border: "1px solid rgba(22,119,255,0.1)", gap: 12 }}>
          <Loader2 size={36} className="animate-spin" color="#1677FF" />
          <p style={{ fontFamily: "'Inter', sans-serif", fontSize: 14, color: "#6a88b8", margin: 0 }}>
            Memuat rincian lowongan pekerjaan...
          </p>
        </div>
      </DashboardLayout>
    );
  }

  if (error || !job) {
    return (
      <DashboardLayout sidebarItems={sidebarItems} userName={displayName} userRole="Kandidat" userInitial={displayInitial}>
        <div style={{ background: "#fff", borderRadius: 18, border: "1px solid rgba(239,68,68,0.2)", padding: "48px 24px", textAlign: "center" }}>
          <AlertCircle size={44} color="#dc2626" style={{ margin: "0 auto 16px" }} />
          <h2 style={{ fontFamily: "'Poppins', sans-serif", fontSize: 18, fontWeight: 700, color: "#0A1B3D", marginBottom: 8 }}>
            Lowongan Tidak Ditemukan
          </h2>
          <p style={{ fontFamily: "'Inter', sans-serif", fontSize: 14, color: "#6a88b8", maxWidth: 440, margin: "0 auto 24px" }}>
            {error || "Lowongan yang Anda cari tidak tersedia, berstatus privat, atau telah ditutup."}
          </p>
          <div style={{ display: "flex", gap: 12, justifyContent: "center" }}>
            <button
              onClick={() => void loadJobDetail()}
              style={{ padding: "10px 20px", borderRadius: 10, border: "1.5px solid #1677FF", background: "#fff", color: "#1677FF", fontFamily: "'Inter', sans-serif", fontSize: 13, fontWeight: 600, cursor: "pointer", display: "inline-flex", alignItems: "center", gap: 6 }}
            >
              <RefreshCw size={14} /> Coba Lagi
            </button>
            <button
              onClick={() => navigate("/dashboard/kandidat/rekomendasi")}
              style={{ padding: "10px 20px", borderRadius: 10, border: "none", background: "linear-gradient(135deg, #1677FF, #0D47A1)", color: "#fff", fontFamily: "'Inter', sans-serif", fontSize: 13, fontWeight: 600, cursor: "pointer" }}
            >
              Kembali ke Rekomendasi
            </button>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  const jobSalaryStr = formatSalary(job.salaryMin, job.salaryMax);
  const jobTypeStr = job.workType ?? job.jobType ?? "Full-time";
  const postedDateStr = formatDateAgo(job.createdAt);

  return (
    <DashboardLayout sidebarItems={sidebarItems} userName={displayName} userRole="Kandidat" userInitial={displayInitial}>
      {/* Action bar */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
        <button onClick={() => navigate("/dashboard/kandidat/rekomendasi")} style={{ display: "flex", alignItems: "center", gap: 6, background: "none", border: "none", cursor: "pointer", color: "#6a88b8", fontFamily: "'Inter', sans-serif", fontSize: 13 }}>
          ← Kembali ke Rekomendasi Pekerjaan
        </button>
        <div style={{ display: "flex", gap: 10 }}>
          <button
            onClick={() => {
              if (saved) {
                unsaveJob(job.id);
                toast.success("Lowongan dihapus dari simpanan.");
              } else {
                saveJob({
                  id: job.id,
                  title: job.title,
                  company: job.company.name,
                  location: job.location ?? job.company.location ?? "-",
                  type: jobTypeStr,
                  salary: jobSalaryStr,
                  match: matchPercentage,
                  matchedSkills: matchedSkills.length > 0 ? matchedSkills : job.skills.map((s) => s.skillName).slice(0, 3),
                });
                toast.success("Lowongan berhasil disimpan!");
              }
            }}
            style={{
              padding: "8px 16px",
              borderRadius: 10,
              border: saved ? "1px solid rgba(16,217,142,0.4)" : "1px solid rgba(22,119,255,0.2)",
              background: saved ? "rgba(16,217,142,0.08)" : "#f0f7ff",
              fontFamily: "'Inter', sans-serif",
              fontSize: 13,
              color: saved ? "#10d98e" : "#1677FF",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              gap: 6,
            }}
          >
            <Bookmark size={14} /> {saved ? "Tersimpan" : "Simpan"}
          </button>
          <button
            disabled={alreadyApplied}
            onClick={() => setShowApplyModal(true)}
            style={{
              padding: "8px 20px",
              borderRadius: 10,
              border: "none",
              background: alreadyApplied ? "#9ab4cc" : "linear-gradient(135deg, #1677FF, #0D47A1)",
              fontFamily: "'Poppins', sans-serif",
              fontSize: 13,
              fontWeight: 700,
              color: "#fff",
              cursor: alreadyApplied ? "not-allowed" : "pointer",
              boxShadow: alreadyApplied ? "none" : "0 4px 14px rgba(22,119,255,0.4)",
            }}
          >
            {alreadyApplied ? "Sudah Dilamar" : "Lamar Sekarang"}
          </button>
        </div>
      </div>

      {/* Main grid */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 320px", gap: 20, alignItems: "start" }}>
        {/* Main */}
        <div>
          {/* Header card */}
          <div style={{ background: "#fff", borderRadius: 18, border: "1px solid rgba(22,119,255,0.1)", boxShadow: "0 2px 12px rgba(10,27,61,0.05)", padding: "28px", marginBottom: 18 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 20 }}>
              <div>
                <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
                  <div style={{ width: 44, height: 44, borderRadius: 12, background: "linear-gradient(135deg, #1677FF, #4DB8FF)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <Building2 size={20} color="#fff" />
                  </div>
                  <div>
                    <div style={{ fontFamily: "'Poppins', sans-serif", fontSize: 20, fontWeight: 800, color: "#0A1B3D" }}>{job.title}</div>
                    <div style={{ fontFamily: "'Inter', sans-serif", fontSize: 14, color: "#6a88b8" }}>{job.company.name}</div>
                  </div>
                </div>
                <div style={{ display: "flex", gap: 14, flexWrap: "wrap" }}>
                  {[
                    { icon: <MapPin size={12} />, val: job.location ?? job.company.location ?? "-" },
                    { icon: <Clock size={12} />, val: jobTypeStr },
                    { icon: <DollarSign size={12} />, val: jobSalaryStr },
                  ].map((m) => (
                    <span key={m.val} style={{ display: "flex", alignItems: "center", gap: 5, fontFamily: "'Inter', sans-serif", fontSize: 13, color: "#6a88b8" }}>
                      {m.icon} {m.val}
                    </span>
                  ))}
                </div>
              </div>

              <div style={{ textAlign: "right" }}>
                <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 36, fontWeight: 800, color: "#1677FF", lineHeight: 1 }}>{matchPercentage}%</div>
                <div style={{ fontFamily: "'Poppins', sans-serif", fontSize: 11, fontWeight: 600, color: "#6a88b8" }}>match score</div>
                <div style={{ fontFamily: "'Inter', sans-serif", fontSize: 11, color: "#9ab4cc", marginTop: 2 }}>Diposting {postedDateStr}</div>
              </div>
            </div>
            <div style={{ height: 8, borderRadius: 4, background: "#e8f0fe", overflow: "hidden" }}>
              <div style={{ height: "100%", width: `${matchPercentage}%`, background: "linear-gradient(90deg, #1677FF, #4DB8FF)", borderRadius: 4 }} />
            </div>
          </div>

          {/* Description */}
          <div style={{ background: "#fff", borderRadius: 18, border: "1px solid rgba(22,119,255,0.1)", boxShadow: "0 2px 12px rgba(10,27,61,0.05)", padding: "28px", marginBottom: 18 }}>
            <h3 style={{ fontFamily: "'Poppins', sans-serif", fontSize: 16, fontWeight: 700, color: "#0A1B3D", marginBottom: 14 }}>Deskripsi Pekerjaan</h3>
            <p style={{ fontFamily: "'Inter', sans-serif", fontSize: 14, color: "#4a6a9a", lineHeight: 1.8, marginBottom: 24, whiteSpace: "pre-line" }}>
              {job.description || "Tidak ada deskripsi pekerjaan tambahan."}
            </p>

            <h3 style={{ fontFamily: "'Poppins', sans-serif", fontSize: 16, fontWeight: 700, color: "#0A1B3D", marginBottom: 14 }}>Persyaratan Keterampilan</h3>
            <div style={{ display: "flex", flexDirection: "column", gap: 8, marginBottom: 24 }}>
              {job.skills.map((s) => (
                <div key={s.id} style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <CheckCircle2 size={15} color="#1677FF" style={{ flexShrink: 0 }} />
                  <span style={{ fontFamily: "'Inter', sans-serif", fontSize: 14, color: "#4a6a9a" }}>
                    {s.skillName} {s.required ? "(Wajib)" : "(Opsional / Nilai Tambah)"}
                  </span>
                </div>
              ))}
            </div>

            <h3 style={{ fontFamily: "'Poppins', sans-serif", fontSize: 16, fontWeight: 700, color: "#0A1B3D", marginBottom: 14 }}>Detail Lowongan</h3>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
              {[
                { label: "Industri Perusahaan", val: job.company.industry ?? "Umum" },
                { label: "Tipe Pekerjaan", val: job.jobType ?? job.employmentType ?? "Full-time" },
                { label: "Sistem Kerja", val: job.workType ?? "On-site" },
                { label: "Lokasi Kantor", val: job.location ?? job.company.location ?? "Jawa" },
              ].map((b) => (
                <div key={b.label} style={{ display: "flex", alignItems: "flex-start", gap: 8, padding: "10px 12px", borderRadius: 10, background: "#f0f7ff", border: "1px solid rgba(22,119,255,0.1)" }}>
                  <div style={{ width: 6, height: 6, borderRadius: "50%", background: "#10d98e", flexShrink: 0, marginTop: 5 }} />
                  <div>
                    <div style={{ fontFamily: "'Inter', sans-serif", fontSize: 11, color: "#6a88b8" }}>{b.label}</div>
                    <div style={{ fontFamily: "'Inter', sans-serif", fontSize: 13, fontWeight: 600, color: "#0A1B3D" }}>{b.val}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div>
          {/* AI Reasoning */}
          <div style={{ background: "linear-gradient(135deg, #071228, #0a1b3d)", borderRadius: 18, border: "1px solid rgba(22,119,255,0.2)", padding: "22px", marginBottom: 16 }}>
            <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10, color: "#4DB8FF", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 10 }}>Mengapa AI Merekomendasikan?</div>
            <p style={{ fontFamily: "'Inter', sans-serif", fontSize: 13, color: "#8899bb", lineHeight: 1.7, margin: 0 }}>
              {aiExplanation}
            </p>
          </div>

          {/* Skill Match */}
          <div style={{ background: "#fff", borderRadius: 18, border: "1px solid rgba(22,119,255,0.1)", boxShadow: "0 2px 12px rgba(10,27,61,0.05)", padding: "22px", marginBottom: 16 }}>
            <h3 style={{ fontFamily: "'Poppins', sans-serif", fontSize: 14, fontWeight: 700, color: "#0A1B3D", marginBottom: 14 }}>Skill yang Cocok</h3>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 7, marginBottom: 18 }}>
              {matchedSkills.length > 0 ? (
                matchedSkills.map((s) => (
                  <span key={s} style={{ display: "flex", alignItems: "center", gap: 4, padding: "4px 10px", borderRadius: 8, background: "rgba(16,217,142,0.08)", border: "1px solid rgba(16,217,142,0.3)", fontFamily: "'Inter', sans-serif", fontSize: 12, fontWeight: 500, color: "#10d98e" }}>
                    <CheckCircle2 size={10} /> {s}
                  </span>
                ))
              ) : (
                <span style={{ fontFamily: "'Inter', sans-serif", fontSize: 12, color: "#9ab4cc", fontStyle: "italic" }}>
                  Belum ada skill yang cocok dengan profil Anda.
                </span>
              )}
            </div>
            <h3 style={{ fontFamily: "'Poppins', sans-serif", fontSize: 14, fontWeight: 700, color: "#0A1B3D", marginBottom: 10 }}>Skill yang Masih Kurang</h3>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 7 }}>
              {missingSkills.length > 0 ? (
                missingSkills.map((s) => (
                  <span key={s} onClick={() => navigate("/dashboard/kandidat/skill-gap")} style={{ display: "flex", alignItems: "center", gap: 4, padding: "4px 10px", borderRadius: 8, background: "rgba(255,107,107,0.07)", border: "1px solid rgba(255,107,107,0.25)", fontFamily: "'Inter', sans-serif", fontSize: 12, fontWeight: 500, color: "#ff6b6b", cursor: "pointer" }}>
                    <XCircle size={10} /> {s}
                  </span>
                ))
              ) : (
                <span style={{ fontFamily: "'Inter', sans-serif", fontSize: 12, color: "#059669" }}>
                  Semua skill requirement telah terpenuhi.
                </span>
              )}
            </div>
          </div>

          {/* Training Panel */}
          {recommendedCourses.length > 0 && (
            <div style={{ background: "#f0f7ff", borderRadius: 18, border: "1px solid rgba(22,119,255,0.15)", padding: "22px" }}>
              <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10, color: "#1677FF", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 10 }}>Pelatihan Rekomendasi</div>
              <p style={{ fontFamily: "'Inter', sans-serif", fontSize: 12, color: "#6a88b8", marginBottom: 14 }}>Tingkatkan kecocokan Anda dengan kursus berikut:</p>
              {recommendedCourses.map((t) => (
                <div key={t.id} onClick={() => navigate("/dashboard/kandidat/pelatihan")} style={{ display: "flex", alignItems: "center", gap: 10, padding: "10px", borderRadius: 10, background: "#fff", border: "1px solid rgba(22,119,255,0.1)", marginBottom: 8, cursor: "pointer" }}>
                  <div style={{ width: 32, height: 32, borderRadius: 9, background: "rgba(22,119,255,0.1)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                    <BookOpen size={15} color="#1677FF" />
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontFamily: "'Poppins', sans-serif", fontSize: 12, fontWeight: 600, color: "#0A1B3D" }}>{t.title}</div>
                    <div style={{ fontFamily: "'Inter', sans-serif", fontSize: 11, color: "#6a88b8" }}>{t.provider} · {t.duration}</div>
                  </div>
                  <ChevronRight size={14} color="#1677FF" />
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {showApplyModal && (
        <ApplicationConfirmModal
          jobTitle={job.title}
          company={job.company.name}
          onConfirm={() => {
            if (isSubmitting) return;
            setIsSubmitting(true);
            applyToJob({
              jobId: job.id,
              posisi: job.title,
              perusahaan: job.company.name,
              lokasi: job.location ?? job.company.location ?? "-",
              match: matchPercentage,
            })
              .then(() => {
                setShowApplyModal(false);
                setShowSuccessModal(true);
              })
              .catch((err) => {
                const message = err instanceof Error ? err.message : "Lamaran gagal dikirim.";
                toast.error(message);
              })
              .finally(() => {
                setIsSubmitting(false);
              });
          }}
          onClose={() => setShowApplyModal(false)}
        />
      )}
      {showSuccessModal && (
        <ApplicationSuccessModal
          jobTitle={job.title}
          onClose={() => setShowSuccessModal(false)}
        />
      )}
    </DashboardLayout>
  );
}
