import { useState } from "react";
import { useNavigate } from "react-router";
import { Home, Briefcase, Bookmark, BarChart2, BookOpen, FileText, Globe, User, Settings, Search, MapPin, ChevronDown, BookmarkX } from "lucide-react";
import { toast } from "sonner";
import { DashboardLayout, SidebarItem } from "../components/DashboardLayout";
import { ApplicationConfirmModal, ApplicationSuccessModal } from "../components/Modals";
import { useAppContext, SavedJob } from "../contexts/AppContext";

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

const locationOptions = ["Semua Lokasi", "Jakarta", "Jakarta Pusat", "Jakarta Selatan", "Jakarta Barat", "Jakarta Timur", "Jakarta Utara", "Bogor", "Depok", "Tangerang", "Bekasi", "Bandung", "Cimahi", "Semarang", "Solo", "Yogyakarta", "Surabaya", "Malang", "Sidoarjo"];
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
          padding: "8px 36px 8px 14px",
          borderRadius: 10,
          border: "1.5px solid rgba(22,119,255,0.18)",
          background: "#fff",
          fontFamily: "'Inter', sans-serif",
          fontSize: 13,
          color: "#0A1B3D",
          cursor: "pointer",
          outline: "none",
          minWidth: 150,
        }}
      >
        {options.map((o) => (
          <option key={o} value={o}>{o}</option>
        ))}
      </select>
      <ChevronDown size={14} style={{ position: "absolute", right: 10, color: "#6a88b8", pointerEvents: "none" }} />
    </div>
  );
}

function SkillTag({ label }: { label: string }) {
  return (
    <span
      style={{
        background: "rgba(16,185,129,0.1)",
        color: "#059669",
        border: "1px solid rgba(16,185,129,0.25)",
        padding: "3px 10px",
        borderRadius: 999,
        fontFamily: "'Inter', sans-serif",
        fontSize: 11,
        fontWeight: 500,
      }}
    >
      {label}
    </span>
  );
}

export default function SavedJobsPage() {
  const navigate = useNavigate();
  const { savedJobs, unsaveJob, addApplication } = useAppContext();
  const [search, setSearch] = useState("");
  const [locationFilter, setLocationFilter] = useState("Semua Lokasi");
  const [typeFilter, setTypeFilter] = useState("Semua Tipe");
  const [matchFilter, setMatchFilter] = useState("Semua Match");
  const [showModal, setShowModal] = useState<SavedJob | null>(null);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [appliedJob, setAppliedJob] = useState<SavedJob | null>(null);

  const handleRemove = (job: SavedJob) => {
    unsaveJob(job.id);
    toast.success("Lowongan dihapus dari daftar tersimpan");
  };

  const filtered = savedJobs.filter((job) => {
    const q = search.toLowerCase();
    if (q && !job.title.toLowerCase().includes(q) && !job.company.toLowerCase().includes(q)) return false;
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
      userName="Budi Santoso"
      userRole="Kandidat"
      userInitial="B"
    >
      <div style={{ maxWidth: 900, margin: "0 auto", padding: "32px 24px" }}>
        {/* Header */}
        <div style={{ marginBottom: 28 }}>
          <h1
            style={{
              fontFamily: "'Poppins', sans-serif",
              fontSize: 24,
              fontWeight: 700,
              color: "#0A1B3D",
              margin: 0,
              marginBottom: 6,
            }}
          >
            Lowongan Tersimpan
          </h1>
          <p
            style={{
              fontFamily: "'Inter', sans-serif",
              fontSize: 14,
              color: "#6a88b8",
              margin: 0,
            }}
          >
            Daftar pekerjaan yang sudah Anda simpan untuk dilamar nanti.
          </p>
        </div>

        {/* Search */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 10,
            background: "#fff",
            border: "1.5px solid rgba(22,119,255,0.18)",
            borderRadius: 12,
            padding: "10px 16px",
            marginBottom: 16,
          }}
        >
          <Search size={16} color="#6a88b8" />
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
              color: "#0A1B3D",
              background: "transparent",
            }}
          />
        </div>

        {/* Filters */}
        <div style={{ display: "flex", flexWrap: "wrap", gap: 10, marginBottom: 28 }}>
          <SelectDropdown value={locationFilter} onChange={setLocationFilter} options={locationOptions} />
          <SelectDropdown value={typeFilter} onChange={setTypeFilter} options={typeOptions} />
          <SelectDropdown value={matchFilter} onChange={setMatchFilter} options={matchOptions} />
        </div>

        {/* Empty state */}
        {savedJobs.length === 0 ? (
          <div
            style={{
              textAlign: "center",
              padding: "80px 24px",
              background: "#fff",
              borderRadius: 20,
              border: "1.5px solid rgba(22,119,255,0.1)",
            }}
          >
            <BookmarkX size={48} color="#4DB8FF" style={{ marginBottom: 16, opacity: 0.7 }} />
            <p
              style={{
                fontFamily: "'Poppins', sans-serif",
                fontSize: 16,
                fontWeight: 600,
                color: "#0A1B3D",
                margin: "0 0 8px",
              }}
            >
              Belum ada lowongan yang disimpan.
            </p>
            <p
              style={{
                fontFamily: "'Inter', sans-serif",
                fontSize: 13,
                color: "#6a88b8",
                margin: "0 0 24px",
              }}
            >
              Jelajahi rekomendasi pekerjaan dan simpan yang menarik minat Anda.
            </p>
            <button
              onClick={() => navigate("/dashboard/kandidat/rekomendasi")}
              style={{
                padding: "11px 28px",
                borderRadius: 12,
                border: "none",
                background: "linear-gradient(135deg, #1677FF, #0D47A1)",
                fontFamily: "'Poppins', sans-serif",
                fontSize: 14,
                fontWeight: 700,
                color: "#fff",
                cursor: "pointer",
              }}
            >
              Temukan Pekerjaan
            </button>
          </div>
        ) : (
          <>
            {/* Result count */}
            <p
              style={{
                fontFamily: "'Inter', sans-serif",
                fontSize: 13,
                color: "#6a88b8",
                marginBottom: 16,
              }}
            >
              Menampilkan <strong style={{ color: "#0A1B3D" }}>{filtered.length}</strong> dari{" "}
              <strong style={{ color: "#0A1B3D" }}>{savedJobs.length}</strong> lowongan tersimpan
            </p>

            {/* No filter match */}
            {filtered.length === 0 && (
              <div
                style={{
                  textAlign: "center",
                  padding: "48px 24px",
                  color: "#6a88b8",
                  fontFamily: "'Inter', sans-serif",
                  fontSize: 14,
                }}
              >
                Tidak ada lowongan yang cocok dengan filter Anda.
              </div>
            )}

            {/* Cards */}
            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              {filtered.map((job) => (
                <div
                  key={job.id}
                  style={{
                    background: "#fff",
                    borderRadius: 16,
                    border: "1.5px solid rgba(22,119,255,0.1)",
                    padding: 24,
                    boxShadow: "0 2px 12px rgba(10,27,61,0.05)",
                  }}
                >
                  {/* Top row */}
                  <div style={{ display: "flex", alignItems: "flex-start", gap: 16, marginBottom: 14 }}>
                    <div style={{ flex: 1 }}>
                      <h2
                        style={{
                          fontFamily: "'Poppins', sans-serif",
                          fontSize: 17,
                          fontWeight: 700,
                          color: "#0A1B3D",
                          margin: 0,
                          marginBottom: 4,
                        }}
                      >
                        {job.title}
                      </h2>
                      <p
                        style={{
                          fontFamily: "'Inter', sans-serif",
                          fontSize: 14,
                          color: "#6a88b8",
                          margin: 0,
                          marginBottom: 8,
                        }}
                      >
                        {job.company}
                      </p>
                      <div style={{ display: "flex", flexWrap: "wrap", gap: 12, alignItems: "center" }}>
                        <span
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: 4,
                            fontFamily: "'Inter', sans-serif",
                            fontSize: 13,
                            color: "#6a88b8",
                          }}
                        >
                          <MapPin size={13} /> {job.location}
                        </span>
                        <span
                          style={{
                            background: "rgba(22,119,255,0.08)",
                            color: "#1677FF",
                            border: "1px solid rgba(22,119,255,0.2)",
                            borderRadius: 999,
                            padding: "2px 10px",
                            fontFamily: "'Inter', sans-serif",
                            fontSize: 12,
                            fontWeight: 500,
                          }}
                        >
                          {job.type}
                        </span>
                        <span
                          style={{
                            fontFamily: "'JetBrains Mono', monospace",
                            fontSize: 13,
                            color: "#0A1B3D",
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
                        background: "linear-gradient(135deg, #e8f1ff, #f0f7ff)",
                        border: "1.5px solid rgba(22,119,255,0.2)",
                        borderRadius: 14,
                        padding: "12px 20px",
                        flexShrink: 0,
                      }}
                    >
                      <div
                        style={{
                          fontFamily: "'JetBrains Mono', monospace",
                          fontSize: 28,
                          fontWeight: 700,
                          color: "#1677FF",
                          lineHeight: 1,
                        }}
                      >
                        {job.match}%
                      </div>
                      <div
                        style={{
                          fontFamily: "'Inter', sans-serif",
                          fontSize: 11,
                          color: "#4DB8FF",
                          fontWeight: 500,
                          marginTop: 4,
                        }}
                      >
                        Match Score
                      </div>
                    </div>
                  </div>

                  {/* Skills matched */}
                  <div style={{ marginBottom: 18 }}>
                    <p
                      style={{
                        fontFamily: "'Inter', sans-serif",
                        fontSize: 11,
                        color: "#6a88b8",
                        fontWeight: 600,
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

                  {/* Actions */}
                  <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
                    <button
                      onClick={() => navigate(`/dashboard/kandidat/detail-pekerjaan`)}
                      style={{
                        padding: "9px 18px",
                        borderRadius: 10,
                        border: "1.5px solid rgba(22,119,255,0.3)",
                        background: "#f0f7ff",
                        fontFamily: "'Inter', sans-serif",
                        fontSize: 13,
                        fontWeight: 500,
                        color: "#1677FF",
                        cursor: "pointer",
                      }}
                    >
                      Lihat Detail
                    </button>
                    <button
                      onClick={() => setShowModal(job)}
                      style={{
                        padding: "9px 22px",
                        borderRadius: 10,
                        border: "none",
                        background: "linear-gradient(135deg, #1677FF, #0D47A1)",
                        fontFamily: "'Poppins', sans-serif",
                        fontSize: 13,
                        fontWeight: 700,
                        color: "#fff",
                        cursor: "pointer",
                      }}
                    >
                      Lamar Sekarang
                    </button>
                    <button
                      onClick={() => handleRemove(job)}
                      style={{
                        padding: "9px 18px",
                        borderRadius: 10,
                        border: "1.5px solid rgba(239,68,68,0.25)",
                        background: "rgba(239,68,68,0.05)",
                        fontFamily: "'Inter', sans-serif",
                        fontSize: 13,
                        fontWeight: 500,
                        color: "#dc2626",
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
      </div>

      {showModal && (
        <ApplicationConfirmModal
          jobTitle={showModal.title}
          company={showModal.company}
          onConfirm={() => { addApplication({ posisi: showModal.title, perusahaan: showModal.company, lokasi: showModal.location, match: showModal.match }); setAppliedJob(showModal); setShowModal(null); setShowSuccessModal(true); }}
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
