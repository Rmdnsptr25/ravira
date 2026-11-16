import { useCallback, useEffect, useMemo, useState } from "react";
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
  Search,
  MapPin,
  ChevronDown,
  RefreshCw,
  AlertCircle,
  Loader2,
} from "lucide-react";
import { toast } from "sonner";
import { DashboardLayout, type SidebarItem } from "../components/DashboardLayout";
import { ApplicationConfirmModal, ApplicationSuccessModal } from "../components/Modals";
import { useAppContext } from "../contexts/AppContext";
import {
  getJobRecommendations,
  listPublishedJobs,
  type JobRecommendation,
  type PublicJob,
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

interface Job {
  id: string;
  jobId?: string;
  title: string;
  company: string;
  location: string;
  type: string;
  salary: string;
  match: number;
  aiReason: string;
  matchedSkills: string[];
  missingSkills: string[];
  industry: string;
  salaryMin: number;
}

function formatSalary(min: number | null, max: number | null): string {
  if (!min && !max) return "Gaji kompetitif";
  const formatter = new Intl.NumberFormat("id-ID", {
    notation: "compact",
    maximumFractionDigits: 1,
  });
  if (min && max) return `Rp ${formatter.format(min)}-${formatter.format(max)}`;
  return `Mulai Rp ${formatter.format(min ?? max ?? 0)}`;
}

const locationOptions = [
  "Semua Lokasi",
  "Jakarta",
  "Jakarta Pusat",
  "Jakarta Selatan",
  "Jakarta Barat",
  "Jakarta Timur",
  "Jakarta Utara",
  "Bogor",
  "Depok",
  "Tangerang",
  "Bekasi",
  "Bandung",
  "Cimahi",
  "Semarang",
  "Solo",
  "Yogyakarta",
  "Surabaya",
  "Malang",
  "Sidoarjo",
];
const typeOptions = ["Semua Tipe", "Full-time", "Hybrid", "Remote"];
const salaryOptions = ["Semua Gaji", "< 12 jt", "12–18 jt", "> 18 jt"];
const industryOptions = ["Semua Industri", "E-commerce", "Teknologi", "Travel", "EdTech"];
const sortOptions = ["Match Tertinggi", "Match Terendah", "Gaji Tertinggi"];

function SelectDropdown({
  value,
  onChange,
  options,
}: {
  value: string;
  onChange: (v: string) => void;
  options: string[];
}) {
  return (
    <div style={{ position: "relative", display: "inline-flex", alignItems: "center" }}>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        style={{
          appearance: "none",
          padding: "9px 36px 9px 16px",
          minHeight: 40,
          borderRadius: 999,
          border: "1px solid #E2E8F0",
          background: "#F4F5F7",
          fontFamily: "'Inter', sans-serif",
          fontSize: 13,
          fontWeight: 500,
          color: "#0D1117",
          cursor: "pointer",
          outline: "none",
          minWidth: 148,
        }}
      >
        {options.map((o) => (
          <option key={o} value={o}>
            {o}
          </option>
        ))}
      </select>
      <ChevronDown
        size={14}
        style={{ position: "absolute", right: 12, color: "#4A5568", pointerEvents: "none" }}
      />
    </div>
  );
}

function SkillTag({ label, color }: { label: string; color: "green" | "red" }) {
  const styles =
    color === "green"
      ? { background: "#D4FF59", color: "#0D1117", border: "none" }
      : { background: "#FFFFFF", color: "#4A5568", border: "1px solid #CBD5E1" };
  return (
    <span
      style={{
        ...styles,
        padding: "4px 10px",
        borderRadius: 999,
        fontFamily: "'Inter', sans-serif",
        fontSize: 11.5,
        fontWeight: 600,
      }}
    >
      {label}
    </span>
  );
}

export default function JobRecommendationsPage() {
  const navigate = useNavigate();
  const { applyToJob, saveJob, unsaveJob, isJobSaved, user } = useAppContext();
  const displayName = user?.fullName || "Kandidat";
  const displayInitial = (displayName[0] || "K").toUpperCase();

  const [search, setSearch] = useState("");
  const [locationFilter, setLocationFilter] = useState("Semua Lokasi");
  const [typeFilter, setTypeFilter] = useState("Semua Tipe");
  const [salaryFilter, setSalaryFilter] = useState("Semua Gaji");
  const [industryFilter, setIndustryFilter] = useState("Semua Industri");
  const [sortBy, setSortBy] = useState("Match Tertinggi");
  const [showModal, setShowModal] = useState<Job | null>(null);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [appliedJob, setAppliedJob] = useState<Job | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [rawRecommendations, setRawRecommendations] = useState<JobRecommendation[]>([]);
  const [publicJobs, setPublicJobs] = useState<PublicJob[]>([]);

  const loadJobsData = useCallback(async (signal?: AbortSignal) => {
    setLoading(true);
    setError(null);
    try {
      const [recsResult, jobsResult] = await Promise.allSettled([
        getJobRecommendations(signal),
        listPublishedJobs(signal),
      ]);

      if (signal?.aborted) return;

      const recs = recsResult.status === "fulfilled" ? recsResult.value : [];
      const pub = jobsResult.status === "fulfilled" ? jobsResult.value : [];

      setRawRecommendations(recs);
      setPublicJobs(pub);

      if (recsResult.status === "rejected" && jobsResult.status === "rejected") {
        setError("Gagal memuat rekomendasi pekerjaan dari server.");
      }
    } catch (err) {
      if (!signal?.aborted) {
        setError(err instanceof Error ? err.message : "Terjadi kesalahan saat memuat pekerjaan.");
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
        void loadJobsData(controller.signal);
      }
    });
    return () => controller.abort();
  }, [loadJobsData]);

  const sourceJobs = useMemo<Job[]>(() => {
    if (rawRecommendations.length > 0) {
      return rawRecommendations.map((rec) => {
        const matchingPub = publicJobs.find((p) => p.id === rec.job.id);
        const salaryMin = matchingPub?.salaryMin ?? null;
        const salaryMax = matchingPub?.salaryMax ?? null;
        const matchedSkills = rec.breakdown?.skillMatch?.matchedSkills ?? [];
        const missingSkills = rec.breakdown?.skillMatch?.missingRequiredSkills ?? [];
        const aiReason =
          rec.matchExplanation?.[0] ||
          "Dihitung berdasarkan relevansi profil dan kebutuhan lowongan.";

        return {
          id: rec.job.id,
          jobId: rec.job.id,
          title: rec.job.title,
          company: rec.company.name,
          location: rec.job.location ?? rec.company.location ?? "-",
          type: rec.job.workType ?? rec.job.jobType ?? "Full-time",
          salary: formatSalary(salaryMin, salaryMax),
          match: rec.matchScore,
          aiReason,
          matchedSkills,
          missingSkills,
          industry: rec.company.industry ?? "Lainnya",
          salaryMin: salaryMin ? Math.round(salaryMin / 1_000_000) : 0,
        };
      });
    }

    if (publicJobs.length > 0) {
      return publicJobs.map((job) => ({
        id: job.id,
        jobId: job.id,
        title: job.title,
        company: job.company.name,
        location: job.location ?? job.company.location ?? "-",
        type: job.workType ?? job.jobType ?? "Full-time",
        salary: formatSalary(job.salaryMin, job.salaryMax),
        match: 0,
        aiReason: "Lengkapi profil dan keahlian Anda untuk melihat AI Match Score personal.",
        matchedSkills: job.skills.map((s) => s.skillName),
        missingSkills: [],
        industry: job.company.industry ?? "Lainnya",
        salaryMin: job.salaryMin ? Math.round(job.salaryMin / 1_000_000) : 0,
      }));
    }

    return [];
  }, [rawRecommendations, publicJobs]);

  const filtered = sourceJobs
    .filter((job) => {
      const q = search.toLowerCase();
      if (q && !job.title.toLowerCase().includes(q) && !job.company.toLowerCase().includes(q))
        return false;
      if (locationFilter !== "Semua Lokasi" && job.location !== locationFilter) return false;
      if (typeFilter !== "Semua Tipe" && job.type !== typeFilter) return false;
      if (industryFilter !== "Semua Industri" && job.industry !== industryFilter) return false;
      if (salaryFilter === "< 12 jt" && job.salaryMin >= 12) return false;
      if (salaryFilter === "12–18 jt" && (job.salaryMin < 12 || job.salaryMin > 18)) return false;
      if (salaryFilter === "> 18 jt" && job.salaryMin <= 18) return false;
      return true;
    })
    .sort((a, b) => {
      if (sortBy === "Match Tertinggi") return b.match - a.match;
      if (sortBy === "Match Terendah") return a.match - b.match;
      if (sortBy === "Gaji Tertinggi") return b.salaryMin - a.salaryMin;
      return 0;
    });

  const handleSave = (job: Job) => {
    if (isJobSaved(job.id)) {
      unsaveJob(job.id);
      toast.success("Lowongan dihapus dari daftar tersimpan");
    } else {
      saveJob({
        id: job.id,
        title: job.title,
        company: job.company,
        location: job.location,
        type: job.type,
        salary: job.salary,
        match: job.match,
        matchedSkills: job.matchedSkills.slice(0, 3),
      });
      toast.success("Lowongan berhasil disimpan!");
    }
  };

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
          Pencocokan Pekerjaan AI
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
          Rekomendasi Pekerjaan
        </h1>
        <p
          style={{
            fontFamily: "'Inter', sans-serif",
            fontSize: 14.5,
            color: "rgba(255, 255, 255, 0.9)",
            margin: "0 0 20px",
          }}
        >
          Pekerjaan berikut dipilih berdasarkan skill, pengalaman, lokasi, dan preferensi karier
          Anda.
        </p>

        {/* Pill Search inside Hero */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 10,
            background: "#FFFFFF",
            borderRadius: 999,
            padding: "11px 20px",
            maxWidth: 640,
          }}
        >
          <Search size={16} color="#4A5568" />
          <input
            type="text"
            placeholder="Cari posisi atau perusahaan..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{
              flex: 1,
              border: "none",
              outline: "none",
              fontFamily: "'Inter', sans-serif",
              fontSize: 14,
              color: "#0D1117",
              background: "transparent",
            }}
          />
        </div>
      </section>

      {/* Filters */}
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          gap: 10,
          marginBottom: 20,
        }}
      >
        <SelectDropdown value={locationFilter} onChange={setLocationFilter} options={locationOptions} />
        <SelectDropdown value={typeFilter} onChange={setTypeFilter} options={typeOptions} />
        <SelectDropdown value={salaryFilter} onChange={setSalaryFilter} options={salaryOptions} />
        <SelectDropdown value={industryFilter} onChange={setIndustryFilter} options={industryOptions} />
        <div style={{ marginLeft: "auto" }}>
          <SelectDropdown value={sortBy} onChange={setSortBy} options={sortOptions} />
        </div>
      </div>

      {/* Result count */}
      <p
        style={{
          fontFamily: "'Inter', sans-serif",
          fontSize: 13.5,
          color: "#4A5568",
          marginBottom: 16,
        }}
      >
        Menampilkan <strong style={{ color: "#0D1117" }}>{filtered.length}</strong> pekerjaan
      </p>

      {/* Job cards */}
      <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
        {filtered.map((job) => {
          const isSaved = isJobSaved(job.id);
          return (
            <div
              key={job.id}
              style={{
                background: "#F4F5F7",
                borderRadius: 24,
                border: "1px solid #E2E8F0",
                padding: 24,
              }}
            >
              {/* Top row */}
              <div
                style={{
                  display: "flex",
                  alignItems: "flex-start",
                  justifyContent: "space-between",
                  gap: 16,
                  marginBottom: 14,
                  flexWrap: "wrap",
                }}
              >
                <div style={{ flex: 1, minWidth: 220 }}>
                  <h2
                    style={{
                      fontFamily: "'Poppins', sans-serif",
                      fontSize: 18,
                      fontWeight: 600,
                      color: "#0D1117",
                      margin: "0 0 4px",
                    }}
                  >
                    {job.title}
                  </h2>
                  <p
                    style={{
                      fontFamily: "'Inter', sans-serif",
                      fontSize: 14,
                      color: "#4A5568",
                      margin: "0 0 10px",
                    }}
                  >
                    {job.company}
                  </p>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: 10, alignItems: "center" }}>
                    <span
                      style={{
                        display: "inline-flex",
                        alignItems: "center",
                        gap: 4,
                        fontFamily: "'Inter', sans-serif",
                        fontSize: 13,
                        color: "#4A5568",
                      }}
                    >
                      <MapPin size={13} /> {job.location}
                    </span>
                    <span
                      style={{
                        background: "#FFFFFF",
                        color: "#0D1117",
                        border: "1px solid #E2E8F0",
                        borderRadius: 999,
                        padding: "3px 12px",
                        fontFamily: "'Inter', sans-serif",
                        fontSize: 12,
                        fontWeight: 600,
                      }}
                    >
                      {job.type}
                    </span>
                    <span
                      style={{
                        fontFamily: "'Poppins', sans-serif",
                        fontSize: 13.5,
                        color: "#0D1117",
                        fontWeight: 600,
                      }}
                    >
                      {job.salary}
                    </span>
                  </div>
                </div>

                {/* Match score */}
                <div
                  style={{
                    textAlign: "center",
                    background: "#0D1117",
                    borderRadius: 18,
                    padding: "12px 20px",
                    flexShrink: 0,
                  }}
                >
                  <div
                    style={{
                      fontFamily: "'Poppins', sans-serif",
                      fontSize: 26,
                      fontWeight: 700,
                      color: "#D4FF59",
                      lineHeight: 1,
                    }}
                  >
                    {job.match}%
                  </div>
                  <div
                    style={{
                      fontFamily: "'Inter', sans-serif",
                      fontSize: 11,
                      color: "#CBD5E1",
                      fontWeight: 500,
                      marginTop: 4,
                    }}
                  >
                    Match Score
                  </div>
                </div>
              </div>

              {/* AI reason */}
              <div
                style={{
                  background: "#FFFFFF",
                  border: "1px solid #E2E8F0",
                  borderRadius: 14,
                  padding: "12px 16px",
                  marginBottom: 16,
                }}
              >
                <p
                  style={{
                    fontFamily: "'Inter', sans-serif",
                    fontSize: 13,
                    color: "#334155",
                    margin: 0,
                    lineHeight: 1.5,
                  }}
                >
                  {job.aiReason}
                </p>
              </div>

              {/* Skills */}
              <div
                style={{
                  display: "flex",
                  flexWrap: "wrap",
                  gap: 20,
                  marginBottom: 18,
                  alignItems: "flex-start",
                }}
              >
                {job.matchedSkills.length > 0 && (
                  <div>
                    <p
                      style={{
                        fontFamily: "'Inter', sans-serif",
                        fontSize: 11,
                        color: "#4A5568",
                        fontWeight: 700,
                        textTransform: "uppercase",
                        letterSpacing: "0.06em",
                        margin: "0 0 6px",
                      }}
                    >
                      Skill Cocok
                    </p>
                    <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                      {job.matchedSkills.map((s) => (
                        <SkillTag key={s} label={s} color="green" />
                      ))}
                    </div>
                  </div>
                )}
                {job.missingSkills.length > 0 && (
                  <div>
                    <p
                      style={{
                        fontFamily: "'Inter', sans-serif",
                        fontSize: 11,
                        color: "#4A5568",
                        fontWeight: 700,
                        textTransform: "uppercase",
                        letterSpacing: "0.06em",
                        margin: "0 0 6px",
                      }}
                    >
                      Skill Kurang
                    </p>
                    <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                      {job.missingSkills.map((s) => (
                        <SkillTag key={s} label={s} color="red" />
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Actions */}
              <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
                <button
                  type="button"
                  onClick={() => navigate(`/dashboard/kandidat/pekerjaan/${job.id}`)}
                  style={{
                    padding: "9px 20px",
                    minHeight: 42,
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
                  Lihat Detail
                </button>
                <button
                  type="button"
                  onClick={() => {
                    if (isSaved) {
                      navigate("/dashboard/kandidat/tersimpan");
                    } else {
                      handleSave(job);
                    }
                  }}
                  style={{
                    padding: "9px 20px",
                    minHeight: 42,
                    borderRadius: 999,
                    border: isSaved ? "none" : "1px solid #CBD5E1",
                    background: isSaved ? "#D4FF59" : "#FFFFFF",
                    fontFamily: "'Inter', sans-serif",
                    fontSize: 13,
                    fontWeight: 700,
                    color: "#0D1117",
                    cursor: "pointer",
                  }}
                >
                  {isSaved ? "Tersimpan" : "Simpan"}
                </button>
                <button
                  type="button"
                  onClick={() => setShowModal(job)}
                  style={{
                    padding: "9px 24px",
                    minHeight: 42,
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
                  Lamar
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {loading && (
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            padding: "48px 24px",
            background: "#F4F5F7",
            borderRadius: 24,
            border: "1px solid #E2E8F0",
            gap: 12,
          }}
        >
          <Loader2 size={32} className="animate-spin" color="#0E67CC" />
          <p style={{ fontFamily: "'Inter', sans-serif", fontSize: 14, color: "#4A5568", margin: 0 }}>
            Memuat rekomendasi lowongan pekerjaan dari server...
          </p>
        </div>
      )}

      {!loading && error && sourceJobs.length === 0 && (
        <div
          style={{
            textAlign: "center",
            padding: "48px 24px",
            background: "#FEF2F2",
            borderRadius: 24,
            border: "1px solid #FECACA",
          }}
        >
          <AlertCircle size={36} color="#B91C1C" style={{ margin: "0 auto 12px" }} />
          <p style={{ fontFamily: "'Inter', sans-serif", fontSize: 14, color: "#991B1B", marginBottom: 16 }}>
            {error}
          </p>
          <button
            type="button"
            onClick={() => void loadJobsData()}
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
            textAlign: "center",
            padding: "64px 24px",
            color: "#4A5568",
            background: "#F4F5F7",
            borderRadius: 24,
            border: "1px solid #E2E8F0",
            fontFamily: "'Inter', sans-serif",
            fontSize: 14,
          }}
        >
          Tidak ada pekerjaan yang cocok dengan filter Anda.
        </div>
      )}

      {showModal && (
        <ApplicationConfirmModal
          jobTitle={showModal.title}
          company={showModal.company}
          onConfirm={() => {
            if (isSubmitting) return;
            setIsSubmitting(true);
            applyToJob({
              jobId: showModal.jobId,
              posisi: showModal.title,
              perusahaan: showModal.company,
              lokasi: showModal.location,
              match: showModal.match,
            })
              .then(() => {
                setAppliedJob(showModal);
                setShowModal(null);
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
          onClose={() => setShowModal(null)}
        />
      )}
      {showSuccessModal && appliedJob && (
        <ApplicationSuccessModal
          jobTitle={appliedJob.title}
          onClose={() => setShowSuccessModal(false)}
        />
      )}
    </DashboardLayout>
  );
}
