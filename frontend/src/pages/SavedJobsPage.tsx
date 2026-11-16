import { useState } from "react";
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
  BookmarkX,
} from "lucide-react";
import { toast } from "sonner";
import { DashboardLayout } from "../components/DashboardLayout";
import type { SidebarItem } from "../components/DashboardLayout";
import { ApplicationConfirmModal, ApplicationSuccessModal } from "../components/Modals";
import { useAppContext } from "../contexts/AppContext";
import type { SavedJob } from "../contexts/AppContext";

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
const matchOptions = ["Semua Match", ">= 90%", ">= 80%", ">= 70%"];

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
          minWidth: 150,
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

function SkillTag({ label }: { label: string }) {
  return (
    <span
      style={{
        background: "#D4FF59",
        color: "#0D1117",
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

export default function SavedJobsPage() {
  const navigate = useNavigate();
  const { savedJobs, unsaveJob, applyToJob, user } = useAppContext();
  const displayName = user?.fullName || "Kandidat";
  const displayInitial = (displayName[0] || "K").toUpperCase();

  const [search, setSearch] = useState("");
  const [locationFilter, setLocationFilter] = useState("Semua Lokasi");
  const [typeFilter, setTypeFilter] = useState("Semua Tipe");
  const [matchFilter, setMatchFilter] = useState("Semua Match");
  const [showModal, setShowModal] = useState<SavedJob | null>(null);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [appliedJob, setAppliedJob] = useState<SavedJob | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleRemove = (job: SavedJob) => {
    unsaveJob(job.id);
    toast.success("Lowongan dihapus dari daftar tersimpan");
  };

  const filtered = savedJobs.filter((job) => {
    const q = search.toLowerCase();
    if (q && !job.title.toLowerCase().includes(q) && !job.company.toLowerCase().includes(q))
      return false;
    if (locationFilter !== "Semua Lokasi" && job.location !== locationFilter) return false;
    if (typeFilter !== "Semua Tipe" && job.type !== typeFilter) return false;
    if (matchFilter === ">= 90%" && job.match < 90) return false;
    if (matchFilter === ">= 80%" && job.match < 80) return false;
    if (matchFilter === ">= 70%" && job.match < 70) return false;
    return true;
  });

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
          Daftar Tersimpan
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
          Lowongan Tersimpan
        </h1>
        <p
          style={{
            fontFamily: "'Inter', sans-serif",
            fontSize: 14.5,
            color: "rgba(255, 255, 255, 0.9)",
            margin: "0 0 20px",
          }}
        >
          Daftar pekerjaan yang sudah Anda simpan untuk dilamar nanti.
        </p>

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
      <div style={{ display: "flex", flexWrap: "wrap", gap: 10, marginBottom: 24 }}>
        <SelectDropdown value={locationFilter} onChange={setLocationFilter} options={locationOptions} />
        <SelectDropdown value={typeFilter} onChange={setTypeFilter} options={typeOptions} />
        <SelectDropdown value={matchFilter} onChange={setMatchFilter} options={matchOptions} />
      </div>

      {/* Empty state */}
      {savedJobs.length === 0 ? (
        <div
          style={{
            textAlign: "center",
            padding: "72px 24px",
            background: "#F4F5F7",
            borderRadius: 24,
            border: "1px solid #E2E8F0",
          }}
        >
          <BookmarkX size={44} color="#0E67CC" style={{ margin: "0 auto 16px" }} />
          <p
            style={{
              fontFamily: "'Poppins', sans-serif",
              fontSize: 17,
              fontWeight: 600,
              color: "#0D1117",
              margin: "0 0 8px",
            }}
          >
            Belum ada lowongan yang disimpan.
          </p>
          <p
            style={{
              fontFamily: "'Inter', sans-serif",
              fontSize: 13.5,
              color: "#4A5568",
              margin: "0 0 24px",
            }}
          >
            Jelajahi rekomendasi pekerjaan dan simpan yang menarik minat Anda.
          </p>
          <button
            type="button"
            onClick={() => navigate("/dashboard/kandidat/rekomendasi")}
            style={{
              padding: "11px 28px",
              minHeight: 44,
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
            Temukan Pekerjaan
          </button>
        </div>
      ) : (
        <>
          <p
            style={{
              fontFamily: "'Inter', sans-serif",
              fontSize: 13.5,
              color: "#4A5568",
              marginBottom: 16,
            }}
          >
            Menampilkan <strong style={{ color: "#0D1117" }}>{filtered.length}</strong> dari{" "}
            <strong style={{ color: "#0D1117" }}>{savedJobs.length}</strong> lowongan tersimpan
          </p>

          {filtered.length === 0 && (
            <div
              style={{
                textAlign: "center",
                padding: "48px 24px",
                color: "#4A5568",
                background: "#F4F5F7",
                borderRadius: 24,
                border: "1px solid #E2E8F0",
                fontFamily: "'Inter', sans-serif",
                fontSize: 14,
              }}
            >
              Tidak ada lowongan yang cocok dengan filter Anda.
            </div>
          )}

          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            {filtered.map((job) => (
              <div
                key={job.id}
                style={{
                  background: "#F4F5F7",
                  borderRadius: 24,
                  border: "1px solid #E2E8F0",
                  padding: 24,
                }}
              >
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

                {job.matchedSkills.length > 0 && (
                  <div style={{ marginBottom: 18 }}>
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
                        <SkillTag key={s} label={s} />
                      ))}
                    </div>
                  </div>
                )}

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
                    Lamar Sekarang
                  </button>
                  <button
                    type="button"
                    onClick={() => handleRemove(job)}
                    style={{
                      padding: "9px 20px",
                      minHeight: 42,
                      borderRadius: 999,
                      border: "1px solid #FECACA",
                      background: "#FEF2F2",
                      fontFamily: "'Inter', sans-serif",
                      fontSize: 13,
                      fontWeight: 600,
                      color: "#B91C1C",
                      cursor: "pointer",
                      marginLeft: "auto",
                    }}
                  >
                    Hapus dari Tersimpan
                  </button>
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      {showModal && (
        <ApplicationConfirmModal
          jobTitle={showModal.title}
          company={showModal.company}
          onConfirm={() => {
            if (isSubmitting) return;
            setIsSubmitting(true);
            applyToJob({
              jobId: showModal.id,
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
                toast.error(err instanceof Error ? err.message : "Lamaran gagal dikirim.");
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
