import { useState, useRef, useEffect, useCallback, useMemo } from "react";
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
  MapPin,
  Mail,
  Phone,
  Calendar,
  Download,
  Edit2,
  CheckCircle,
  GraduationCap,
  Star,
  FolderOpen,
  UploadCloud,
  Trash2,
  Plus,
  Loader2,
  AlertCircle,
  FileCheck2,
} from "lucide-react";
import { DashboardLayout } from "../components/DashboardLayout";
import type { SidebarItem } from "../components/DashboardLayout";
import { toast } from "sonner";
import { useAppContext } from "../contexts/AppContext";
import {
  getCandidateProfile,
  updateCandidateProfile,
  listCandidateSkills,
  createCandidateSkill,
  deleteCandidateSkill,
  uploadCandidateCv,
  listCandidateCvs,
  deleteCandidateCv,
  type CandidateProfile,
  type CandidateSkill,
  type CandidateDocument,
  type UpdateCandidateProfileInput,
  type ProfileVisibilityStatus,
} from "../services/raviraApi";
import { ApiError } from "../services/api";

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

const tabs = [
  { key: "profil", label: "Profil", icon: <User size={14} /> },
  { key: "pengalaman", label: "Pengalaman", icon: <Briefcase size={14} /> },
  { key: "pendidikan", label: "Pendidikan", icon: <GraduationCap size={14} /> },
  { key: "skill", label: "Skill", icon: <Star size={14} /> },
  { key: "portfolio", label: "Portfolio", icon: <FolderOpen size={14} /> },
];

function SectionCard({
  title,
  sectionKey,
  editingSection,
  onEditStart,
  onEditSave,
  isSaving,
  children,
}: {
  title: string;
  sectionKey: string;
  editingSection: string | null;
  onEditStart: (key: string) => void;
  onEditSave: () => void;
  isSaving?: boolean;
  children: React.ReactNode;
}) {
  const isEditing = editingSection === sectionKey;

  return (
    <div
      style={{
        background: "#F4F5F7",
        borderRadius: 24,
        padding: "24px",
        border: "1px solid #E2E8F0",
        marginBottom: 20,
        position: "relative",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: 18,
          gap: 12,
        }}
      >
        <div
          style={{
            fontFamily: "'Poppins', sans-serif",
            fontSize: 16,
            fontWeight: 600,
            color: "#0D1117",
          }}
        >
          {title}
        </div>
        {isEditing ? (
          <div style={{ display: "flex", gap: 8 }}>
            <button
              type="button"
              onClick={() => onEditStart("")}
              disabled={isSaving}
              style={{
                fontFamily: "'Inter', sans-serif",
                fontSize: 12.5,
                fontWeight: 600,
                padding: "7px 14px",
                borderRadius: 999,
                border: "1px solid #CBD5E1",
                background: "#FFFFFF",
                color: "#0D1117",
                cursor: "pointer",
              }}
            >
              Batal
            </button>
            <button
              type="button"
              onClick={onEditSave}
              disabled={isSaving}
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 6,
                fontFamily: "'Inter', sans-serif",
                fontSize: 12.5,
                fontWeight: 700,
                padding: "7px 16px",
                borderRadius: 999,
                border: "none",
                background: "#0D1117",
                color: "#D4FF59",
                cursor: isSaving ? "not-allowed" : "pointer",
                opacity: isSaving ? 0.7 : 1,
              }}
            >
              {isSaving ? <Loader2 size={13} className="animate-spin" /> : null}
              {isSaving ? "Menyimpan..." : "Simpan Perubahan"}
            </button>
          </div>
        ) : (
          <button
            type="button"
            onClick={() => onEditStart(sectionKey)}
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 6,
              fontFamily: "'Inter', sans-serif",
              fontSize: 12.5,
              fontWeight: 600,
              padding: "7px 14px",
              borderRadius: 999,
              border: "1px solid #CBD5E1",
              background: "#FFFFFF",
              color: "#0D1117",
              cursor: "pointer",
            }}
          >
            <Edit2 size={12} /> Edit
          </button>
        )}
      </div>
      {isEditing && (
        <div
          style={{
            marginBottom: 16,
            padding: "12px 16px",
            borderRadius: 14,
            background: "#FFFFFF",
            border: "1px solid #E2E8F0",
            fontFamily: "'Inter', sans-serif",
            fontSize: 13,
            color: "#4A5568",
          }}
        >
          Mode edit aktif — ubah informasi di bawah ini lalu klik &ldquo;Simpan Perubahan&rdquo;.
        </div>
      )}
      {children}
    </div>
  );
}

function InfoRow({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 12,
        padding: "12px 14px",
        borderRadius: 14,
        background: "#FFFFFF",
        border: "1px solid #E2E8F0",
      }}
    >
      <div
        aria-hidden="true"
        style={{
          width: 34,
          height: 34,
          borderRadius: 10,
          background: "#0D1117",
          color: "#D4FF59",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexShrink: 0,
        }}
      >
        {icon}
      </div>
      <div>
        <div style={{ fontFamily: "'Inter', sans-serif", fontSize: 11.5, color: "#4A5568" }}>
          {label}
        </div>
        <div
          style={{
            fontFamily: "'Inter', sans-serif",
            fontSize: 13.5,
            fontWeight: 600,
            color: "#0D1117",
            marginTop: 1,
          }}
        >
          {value}
        </div>
      </div>
    </div>
  );
}

const inputStyle: React.CSSProperties = {
  width: "100%",
  padding: "11px 14px",
  borderRadius: 12,
  border: "1px solid #CBD5E1",
  outline: "none",
  fontFamily: "'Inter', sans-serif",
  fontSize: 13.5,
  color: "#0D1117",
  background: "#FFFFFF",
  boxSizing: "border-box",
  marginBottom: 12,
};

export default function CandidateSelfProfilePage() {
  const { user, retrySession } = useAppContext();
  const [activeTab, setActiveTab] = useState("profil");
  const [editingSection, setEditingSection] = useState<string | null>(null);
  const [showCvUpload, setShowCvUpload] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [profile, setProfile] = useState<CandidateProfile | null>(null);
  const [skills, setSkills] = useState<CandidateSkill[]>([]);
  const [cvDocuments, setCvDocuments] = useState<CandidateDocument[]>([]);

  const [formFullName, setFormFullName] = useState("");
  const [formPhone, setFormPhone] = useState("");
  const [formLocation, setFormLocation] = useState("");
  const [formEducation, setFormEducation] = useState("");
  const [formExperienceSummary, setFormExperienceSummary] = useState("");
  const [formSalaryExpectation, setFormSalaryExpectation] = useState<number | string>("");
  const [formMobilityPreference, setFormMobilityPreference] = useState("");
  const [formVisibilityStatus, setFormVisibilityStatus] =
    useState<ProfileVisibilityStatus>("PRIVATE");

  const [isSaving, setIsSaving] = useState(false);
  const [isUploadingCv, setIsUploadingCv] = useState(false);
  const [newSkillName, setNewSkillName] = useState("");
  const [newSkillLevel, setNewSkillLevel] = useState("Menengah");
  const [isAddingSkill, setIsAddingSkill] = useState(false);
  const [deletingSkillId, setDeletingSkillId] = useState<string | null>(null);
  const [deletingCvId, setDeletingCvId] = useState<string | null>(null);

  const loadData = useCallback(async (signal?: AbortSignal) => {
    setLoading(true);
    setError(null);
    try {
      const [profileData, skillsData, cvData] = await Promise.all([
        getCandidateProfile(signal),
        listCandidateSkills(signal),
        listCandidateCvs(signal),
      ]);
      setProfile(profileData);
      setSkills(skillsData);
      setCvDocuments(cvData);

      setFormFullName(profileData.fullName || "");
      setFormPhone(profileData.phone || "");
      setFormLocation(profileData.location || "");
      setFormEducation(profileData.education || "");
      setFormExperienceSummary(profileData.experienceSummary || "");
      setFormSalaryExpectation(profileData.salaryExpectation ?? "");
      setFormMobilityPreference(profileData.mobilityPreference || "");
      setFormVisibilityStatus(profileData.visibilityStatus || "PRIVATE");
    } catch (err) {
      if (err instanceof DOMException && err.name === "AbortError") return;
      const message = err instanceof ApiError ? err.message : "Gagal memuat profil kandidat.";
      setError(message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const controller = new AbortController();
    queueMicrotask(() => {
      if (!controller.signal.aborted) {
        void loadData(controller.signal);
      }
    });
    return () => controller.abort();
  }, [loadData]);

  const completionPercentage = useMemo(() => {
    let score = 0;
    if (profile?.fullName) score += 15;
    if (profile?.email) score += 10;
    if (profile?.phone) score += 10;
    if (profile?.location) score += 15;
    if (profile?.experienceSummary) score += 15;
    if (profile?.education) score += 15;
    if (profile?.mobilityPreference) score += 10;
    if (skills.length > 0) score += 10;
    return Math.min(score, 100);
  }, [profile, skills.length]);

  const handleEditSave = async () => {
    setIsSaving(true);
    try {
      const payload: UpdateCandidateProfileInput = {};

      if (editingSection === "informasi") {
        if (formFullName.trim()) payload.fullName = formFullName.trim();
        if (formPhone.trim()) payload.phone = formPhone.trim();
        if (formLocation.trim()) payload.location = formLocation.trim();
      } else if (editingSection === "ringkasan") {
        if (formExperienceSummary.trim())
          payload.experienceSummary = formExperienceSummary.trim();
      } else if (editingSection === "preferensi") {
        if (formLocation.trim()) payload.location = formLocation.trim();
        if (formSalaryExpectation !== "" && formSalaryExpectation !== null) {
          const num =
            typeof formSalaryExpectation === "number"
              ? formSalaryExpectation
              : parseInt(String(formSalaryExpectation).replace(/\D/g, ""), 10);
          if (!isNaN(num) && num >= 0) payload.salaryExpectation = num;
        }
        if (formMobilityPreference.trim())
          payload.mobilityPreference = formMobilityPreference.trim();
        if (formVisibilityStatus) payload.visibilityStatus = formVisibilityStatus;
      } else if (editingSection === "pendidikan") {
        if (formEducation.trim()) payload.education = formEducation.trim();
      }

      if (Object.keys(payload).length === 0) {
        toast.info("Tidak ada perubahan yang dikirim.");
        setEditingSection(null);
        return;
      }

      const updated = await updateCandidateProfile(payload);
      setProfile(updated);
      setEditingSection(null);
      void retrySession();
      toast.success("Profil berhasil diperbarui!");
    } catch (err) {
      const msg = err instanceof ApiError ? err.message : "Gagal memperbarui profil.";
      toast.error(msg);
    } finally {
      setIsSaving(false);
    }
  };

  const handleCvFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const extension = file.name.slice(file.name.lastIndexOf(".")).toLowerCase();
    if (extension !== ".pdf" && extension !== ".docx") {
      toast.error("Hanya file dokumen PDF atau DOCX yang diperbolehkan.");
      if (fileInputRef.current) fileInputRef.current.value = "";
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error("Ukuran file CV melebihi batas maksimal 5MB.");
      if (fileInputRef.current) fileInputRef.current.value = "";
      return;
    }

    setIsUploadingCv(true);
    try {
      const doc = await uploadCandidateCv(file);
      setCvDocuments((prev) => [doc, ...prev]);
      setShowCvUpload(false);
      toast.success(`CV "${doc.fileName}" berhasil diunggah!`);

      if (doc.extractedSkills && doc.extractedSkills.length > 0) {
        const refreshedSkills = await listCandidateSkills();
        setSkills(refreshedSkills);
        toast.info(`${doc.extractedSkills.length} keterampilan berhasil diekstrak dari CV.`);
      }
    } catch (err) {
      const msg = err instanceof ApiError ? err.message : "Gagal mengunggah CV.";
      toast.error(msg);
    } finally {
      setIsUploadingCv(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const handleDeleteCv = async (cvId: string) => {
    setDeletingCvId(cvId);
    try {
      await deleteCandidateCv(cvId);
      setCvDocuments((prev) => prev.filter((c) => c.id !== cvId));
      toast.success("Dokumen CV berhasil dihapus.");
    } catch (err) {
      const msg = err instanceof ApiError ? err.message : "Gagal menghapus CV.";
      toast.error(msg);
    } finally {
      setDeletingCvId(null);
    }
  };

  const handleAddSkill = async (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = newSkillName.trim();
    if (!trimmed) {
      toast.error("Nama skill wajib diisi.");
      return;
    }

    if (skills.some((s) => s.skillName.toLowerCase() === trimmed.toLowerCase())) {
      toast.error(`Skill "${trimmed}" sudah ada di profil Anda.`);
      return;
    }

    setIsAddingSkill(true);
    try {
      const created = await createCandidateSkill({
        skillName: trimmed,
        level: newSkillLevel,
        source: "CANDIDATE",
      });
      setSkills((prev) => [created, ...prev]);
      setNewSkillName("");
      toast.success(`Skill "${created.skillName}" berhasil ditambahkan!`);
    } catch (err) {
      const msg = err instanceof ApiError ? err.message : "Gagal menambahkan skill.";
      toast.error(msg);
    } finally {
      setIsAddingSkill(false);
    }
  };

  const handleDeleteSkill = async (skillId: string, skillName: string) => {
    setDeletingSkillId(skillId);
    try {
      await deleteCandidateSkill(skillId);
      setSkills((prev) => prev.filter((s) => s.id !== skillId));
      toast.success(`Skill "${skillName}" berhasil dihapus.`);
    } catch (err) {
      const msg = err instanceof ApiError ? err.message : "Gagal menghapus skill.";
      toast.error(msg);
    } finally {
      setDeletingSkillId(null);
    }
  };

  const displayName = profile?.fullName || user?.fullName || "Kandidat";
  const displayEmail = profile?.email || user?.email || "-";
  const displayInitial = (displayName[0] || "K").toUpperCase();

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
            Identitas &amp; Kompetensi
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
            Profil Saya
          </h1>
          <p
            style={{
              fontFamily: "'Inter', sans-serif",
              fontSize: 14.5,
              color: "rgba(255, 255, 255, 0.9)",
              margin: 0,
            }}
          >
            Kelola informasi profil, keahlian, dan dokumen resume Anda.
          </p>
        </div>
        <button
          type="button"
          onClick={() => {
            if (cvDocuments.length > 0) {
              toast.success(`CV aktif: ${cvDocuments[0].fileName}`);
            } else {
              toast.error("Belum ada CV yang diunggah. Silakan upload CV terlebih dahulu.");
            }
          }}
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 8,
            fontFamily: "'Inter', sans-serif",
            fontSize: 12,
            fontWeight: 700,
            letterSpacing: "0.06em",
            textTransform: "uppercase",
            padding: "12px 24px",
            minHeight: 44,
            borderRadius: 999,
            border: "none",
            background: "#D4FF59",
            color: "#0D1117",
            cursor: "pointer",
          }}
        >
          <Download size={14} /> Download CV
        </button>
      </section>

      {loading ? (
        <div
          style={{
            background: "#F4F5F7",
            borderRadius: 24,
            border: "1px solid #E2E8F0",
            textAlign: "center",
            padding: "48px 24px",
          }}
        >
          <Loader2 size={32} color="#0E67CC" className="animate-spin" style={{ margin: "0 auto 16px" }} />
          <div
            style={{
              fontFamily: "'Poppins', sans-serif",
              fontSize: 16,
              fontWeight: 600,
              color: "#0D1117",
            }}
          >
            Memuat Profil Kandidat...
          </div>
          <div style={{ fontFamily: "'Inter', sans-serif", fontSize: 13.5, color: "#4A5568", marginTop: 4 }}>
            Mengambil data profil, keterampilan, dan dokumen dari server.
          </div>
        </div>
      ) : error ? (
        <div
          style={{
            background: "#FEF2F2",
            borderRadius: 24,
            border: "1px solid #FECACA",
            textAlign: "center",
            padding: "36px 24px",
          }}
        >
          <AlertCircle size={36} color="#B91C1C" style={{ margin: "0 auto 12px" }} />
          <div
            style={{
              fontFamily: "'Poppins', sans-serif",
              fontSize: 16,
              fontWeight: 600,
              color: "#991B1B",
            }}
          >
            Gagal Memuat Profil
          </div>
          <p style={{ fontFamily: "'Inter', sans-serif", fontSize: 13.5, color: "#991B1B", marginTop: 6 }}>
            {error}
          </p>
          <button
            type="button"
            onClick={() => void loadData()}
            style={{
              marginTop: 14,
              padding: "10px 22px",
              minHeight: 42,
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
            Coba Lagi
          </button>
        </div>
      ) : (
        <>
          {/* Profile completion bar */}
          <div
            style={{
              background: "#0D1117",
              borderRadius: 24,
              marginBottom: 20,
              padding: "22px 24px",
              color: "#FFFFFF",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                marginBottom: 10,
                flexWrap: "wrap",
                gap: 8,
              }}
            >
              <div>
                <span
                  style={{
                    fontFamily: "'Poppins', sans-serif",
                    fontSize: 14,
                    fontWeight: 600,
                    color: "#FFFFFF",
                  }}
                >
                  Kelengkapan Profil{" "}
                </span>
                <span
                  style={{
                    fontFamily: "'Poppins', sans-serif",
                    fontSize: 16,
                    fontWeight: 700,
                    color: "#D4FF59",
                  }}
                >
                  {completionPercentage}%
                </span>
              </div>
              <span style={{ fontFamily: "'Inter', sans-serif", fontSize: 12.5, color: "#CBD5E1" }}>
                Lengkapi profil untuk meningkatkan akurasi matching AI
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
                  width: `${completionPercentage}%`,
                  borderRadius: 999,
                  background: "#D4FF59",
                  transition: "width 0.3s ease",
                }}
              />
            </div>
            <div style={{ display: "flex", gap: 16, marginTop: 14, flexWrap: "wrap" }}>
              {[
                {
                  label: "Data Diri",
                  done: Boolean(profile?.fullName && profile?.phone && profile?.location),
                },
                { label: "Pendidikan", done: Boolean(profile?.education) },
                { label: "Pengalaman", done: Boolean(profile?.experienceSummary) },
                { label: "Skill", done: skills.length > 0 },
                { label: "Resume / CV", done: cvDocuments.length > 0 },
              ].map((item) => (
                <div key={item.label} style={{ display: "inline-flex", alignItems: "center", gap: 6 }}>
                  <CheckCircle size={13} color={item.done ? "#D4FF59" : "#64748B"} />
                  <span
                    style={{
                      fontFamily: "'Inter', sans-serif",
                      fontSize: 12,
                      fontWeight: item.done ? 600 : 400,
                      color: item.done ? "#FFFFFF" : "#94A3B8",
                    }}
                  >
                    {item.label}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Profile header card */}
          <div
            style={{
              background: "#F4F5F7",
              borderRadius: 24,
              border: "1px solid #E2E8F0",
              padding: "24px",
              marginBottom: 20,
            }}
          >
            <div style={{ display: "flex", alignItems: "flex-start", gap: 20, flexWrap: "wrap" }}>
              <div
                aria-hidden="true"
                style={{
                  width: 76,
                  height: 76,
                  borderRadius: "50%",
                  background: "#0D1117",
                  color: "#D4FF59",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontFamily: "'Poppins', sans-serif",
                  fontSize: 30,
                  fontWeight: 700,
                  flexShrink: 0,
                }}
              >
                {displayInitial}
              </div>

              <div style={{ flex: 1, minWidth: 220 }}>
                <div
                  style={{
                    fontFamily: "'Poppins', sans-serif",
                    fontSize: 22,
                    fontWeight: 600,
                    color: "#0D1117",
                  }}
                >
                  {displayName}
                </div>
                <div
                  style={{
                    fontFamily: "'Inter', sans-serif",
                    fontSize: 14,
                    color: "#0E67CC",
                    fontWeight: 600,
                    marginTop: 2,
                  }}
                >
                  {profile?.education || "Pendidikan belum diisi"}
                </div>
                <div
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: 4,
                    marginTop: 6,
                    fontFamily: "'Inter', sans-serif",
                    fontSize: 13,
                    color: "#4A5568",
                  }}
                >
                  <MapPin size={13} /> {profile?.location || "Lokasi belum diisi (Pulau Jawa)"}
                </div>
                <div
                  style={{
                    marginTop: 10,
                    fontFamily: "'Inter', sans-serif",
                    fontSize: 13.5,
                    color: "#334155",
                    lineHeight: 1.65,
                    maxWidth: 640,
                  }}
                >
                  {profile?.experienceSummary ||
                    "Belum ada ringkasan profil. Klik edit pada bagian Ringkasan Profil untuk menambahkan bio diri Anda."}
                </div>
              </div>
            </div>

            {/* CV Section */}
            <div style={{ marginTop: 20, borderTop: "1px solid #E2E8F0", paddingTop: 18 }}>
              {cvDocuments.length > 0 && (
                <div style={{ marginBottom: 14 }}>
                  <div
                    style={{
                      fontFamily: "'Inter', sans-serif",
                      fontSize: 12.5,
                      fontWeight: 600,
                      color: "#0D1117",
                      marginBottom: 8,
                    }}
                  >
                    Dokumen CV Terunggah:
                  </div>
                  <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                    {cvDocuments.map((doc) => {
                      const isSuccess = doc.parsingStatus === "SUCCESS";
                      return (
                        <div
                          key={doc.id}
                          style={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "space-between",
                            padding: "12px 16px",
                            borderRadius: 14,
                            background: "#FFFFFF",
                            border: "1px solid #E2E8F0",
                          }}
                        >
                          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                            <FileCheck2 size={18} color="#0E67CC" />
                            <div>
                              <div
                                style={{
                                  fontFamily: "'Inter', sans-serif",
                                  fontSize: 13.5,
                                  fontWeight: 600,
                                  color: "#0D1117",
                                }}
                              >
                                {doc.fileName}
                              </div>
                              <div
                                style={{
                                  fontFamily: "'Inter', sans-serif",
                                  fontSize: 11.5,
                                  color: "#4A5568",
                                }}
                              >
                                {(doc.fileSize / 1024).toFixed(1)} KB · Diunggah{" "}
                                {new Date(doc.uploadedAt).toLocaleDateString("id-ID")}
                              </div>
                            </div>
                          </div>
                          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                            <span
                              style={{
                                fontFamily: "'Inter', sans-serif",
                                fontSize: 10.5,
                                fontWeight: 700,
                                color: "#0D1117",
                                background: isSuccess ? "#D4FF59" : "#F4F5F7",
                                padding: "3px 10px",
                                borderRadius: 999,
                              }}
                            >
                              {doc.parsingStatus}
                            </span>
                            <button
                              type="button"
                              onClick={() => void handleDeleteCv(doc.id)}
                              disabled={deletingCvId === doc.id}
                              style={{
                                background: "none",
                                border: "none",
                                cursor: "pointer",
                                color: "#B91C1C",
                                padding: 6,
                                display: "inline-flex",
                                alignItems: "center",
                              }}
                              title="Hapus CV"
                            >
                              {deletingCvId === doc.id ? (
                                <Loader2 size={14} className="animate-spin" />
                              ) : (
                                <Trash2 size={14} />
                              )}
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {!showCvUpload ? (
                <button
                  type="button"
                  onClick={() => setShowCvUpload(true)}
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: 8,
                    fontFamily: "'Inter', sans-serif",
                    fontSize: 13,
                    fontWeight: 700,
                    padding: "10px 20px",
                    minHeight: 42,
                    borderRadius: 999,
                    border: "none",
                    background: "#0D1117",
                    color: "#D4FF59",
                    cursor: "pointer",
                  }}
                >
                  <UploadCloud size={15} /> Upload CV Baru
                </button>
              ) : (
                <div
                  onClick={() => !isUploadingCv && fileInputRef.current?.click()}
                  style={{
                    border: "1.5px dashed #94A3B8",
                    borderRadius: 16,
                    padding: "24px",
                    textAlign: "center",
                    cursor: isUploadingCv ? "not-allowed" : "pointer",
                    background: "#FFFFFF",
                  }}
                >
                  {isUploadingCv ? (
                    <>
                      <Loader2
                        size={32}
                        color="#0E67CC"
                        className="animate-spin"
                        style={{ margin: "0 auto 8px" }}
                      />
                      <div
                        style={{
                          fontFamily: "'Inter', sans-serif",
                          fontSize: 13.5,
                          color: "#0E67CC",
                          fontWeight: 600,
                        }}
                      >
                        Mengunggah dan mengekstrak CV...
                      </div>
                    </>
                  ) : (
                    <>
                      <UploadCloud size={32} color="#0E67CC" style={{ margin: "0 auto 8px" }} />
                      <div
                        style={{
                          fontFamily: "'Inter', sans-serif",
                          fontSize: 13.5,
                          color: "#0D1117",
                          fontWeight: 600,
                        }}
                      >
                        Seret file ke sini atau klik untuk unggah
                      </div>
                      <div
                        style={{
                          fontFamily: "'Inter', sans-serif",
                          fontSize: 12,
                          color: "#4A5568",
                          marginTop: 4,
                        }}
                      >
                        PDF, DOCX maks. 5MB
                      </div>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setShowCvUpload(false);
                        }}
                        style={{
                          marginTop: 10,
                          background: "none",
                          border: "none",
                          fontFamily: "'Inter', sans-serif",
                          fontSize: 12,
                          fontWeight: 600,
                          color: "#4A5568",
                          cursor: "pointer",
                          textDecoration: "underline",
                        }}
                      >
                        Batal
                      </button>
                    </>
                  )}
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept=".pdf,.docx,application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                    style={{ display: "none" }}
                    disabled={isUploadingCv}
                    onChange={(e) => void handleCvFileChange(e)}
                  />
                </div>
              )}
            </div>
          </div>

          {/* Pill Tabs */}
          <div
            style={{
              display: "inline-flex",
              gap: 6,
              marginBottom: 20,
              background: "#F4F5F7",
              padding: "6px",
              borderRadius: 999,
              border: "1px solid #E2E8F0",
              flexWrap: "wrap",
            }}
          >
            {tabs.map((tab) => {
              const isActive = activeTab === tab.key;
              return (
                <button
                  key={tab.key}
                  type="button"
                  onClick={() => setActiveTab(tab.key)}
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: 6,
                    fontFamily: "'Inter', sans-serif",
                    fontSize: 13,
                    fontWeight: 600,
                    padding: "9px 18px",
                    minHeight: 38,
                    borderRadius: 999,
                    border: "none",
                    cursor: "pointer",
                    background: isActive ? "#0D1117" : "transparent",
                    color: isActive ? "#D4FF59" : "#4A5568",
                    transition: "all 0.15s ease",
                  }}
                >
                  {tab.icon} {tab.label}
                </button>
              );
            })}
          </div>

          {/* Tab Content */}
          {activeTab === "profil" && (
            <>
              <SectionCard
                title="Informasi Pribadi"
                sectionKey="informasi"
                editingSection={editingSection}
                onEditStart={setEditingSection}
                onEditSave={() => void handleEditSave()}
                isSaving={isSaving}
              >
                {editingSection === "informasi" ? (
                  <div style={{ display: "flex", flexDirection: "column" }}>
                    <label
                      style={{
                        fontFamily: "'Inter', sans-serif",
                        fontSize: 12.5,
                        fontWeight: 600,
                        color: "#0D1117",
                        marginBottom: 4,
                      }}
                    >
                      Nama Lengkap
                    </label>
                    <input
                      style={inputStyle}
                      value={formFullName}
                      onChange={(e) => setFormFullName(e.target.value)}
                      placeholder="Nama lengkap sesuai identitas"
                    />
                    <label
                      style={{
                        fontFamily: "'Inter', sans-serif",
                        fontSize: 12.5,
                        fontWeight: 600,
                        color: "#0D1117",
                        marginBottom: 4,
                      }}
                    >
                      Nomor Telepon
                    </label>
                    <input
                      style={inputStyle}
                      value={formPhone}
                      onChange={(e) => setFormPhone(e.target.value)}
                      placeholder="Contoh: 081234567890"
                    />
                    <label
                      style={{
                        fontFamily: "'Inter', sans-serif",
                        fontSize: 12.5,
                        fontWeight: 600,
                        color: "#0D1117",
                        marginBottom: 4,
                      }}
                    >
                      Lokasi Domisili (Pulau Jawa)
                    </label>
                    <input
                      style={inputStyle}
                      value={formLocation}
                      onChange={(e) => setFormLocation(e.target.value)}
                      placeholder="Contoh: Jakarta Selatan, DKI Jakarta"
                    />
                  </div>
                ) : (
                  <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                    <InfoRow icon={<User size={15} />} label="Nama Lengkap" value={displayName} />
                    <InfoRow icon={<Mail size={15} />} label="Email" value={displayEmail} />
                    <InfoRow
                      icon={<Phone size={15} />}
                      label="Telepon"
                      value={profile?.phone || "Belum diisi"}
                    />
                    <InfoRow
                      icon={<MapPin size={15} />}
                      label="Lokasi"
                      value={profile?.location || "Belum diisi"}
                    />
                    <InfoRow
                      icon={<Calendar size={15} />}
                      label="Terdaftar Sejak"
                      value={
                        profile?.createdAt
                          ? new Date(profile.createdAt).toLocaleDateString("id-ID")
                          : "-"
                      }
                    />
                  </div>
                )}
              </SectionCard>

              <SectionCard
                title="Ringkasan Profil"
                sectionKey="ringkasan"
                editingSection={editingSection}
                onEditStart={setEditingSection}
                onEditSave={() => void handleEditSave()}
                isSaving={isSaving}
              >
                {editingSection === "ringkasan" ? (
                  <div>
                    <label
                      style={{
                        fontFamily: "'Inter', sans-serif",
                        fontSize: 12.5,
                        fontWeight: 600,
                        color: "#0D1117",
                        marginBottom: 4,
                        display: "block",
                      }}
                    >
                      Ringkasan Pengalaman &amp; Latar Belakang
                    </label>
                    <textarea
                      rows={4}
                      style={{ ...inputStyle, resize: "vertical" }}
                      value={formExperienceSummary}
                      onChange={(e) => setFormExperienceSummary(e.target.value)}
                      placeholder="Tuliskan ringkasan keahlian, pengalaman, dan tujuan karier Anda..."
                    />
                  </div>
                ) : (
                  <div
                    style={{
                      fontFamily: "'Inter', sans-serif",
                      fontSize: 14,
                      color: "#334155",
                      lineHeight: 1.7,
                      padding: "16px",
                      borderRadius: 14,
                      background: "#FFFFFF",
                      border: "1px solid #E2E8F0",
                    }}
                  >
                    {profile?.experienceSummary || "Belum ada ringkasan profil."}
                  </div>
                )}
              </SectionCard>

              <SectionCard
                title="Preferensi Kerja & Mobilitas"
                sectionKey="preferensi"
                editingSection={editingSection}
                onEditStart={setEditingSection}
                onEditSave={() => void handleEditSave()}
                isSaving={isSaving}
              >
                {editingSection === "preferensi" ? (
                  <div
                    style={{
                      display: "grid",
                      gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
                      gap: 14,
                    }}
                  >
                    <div>
                      <label
                        style={{
                          fontFamily: "'Inter', sans-serif",
                          fontSize: 12.5,
                          fontWeight: 600,
                          color: "#0D1117",
                          marginBottom: 4,
                          display: "block",
                        }}
                      >
                        Lokasi Preferensi
                      </label>
                      <input
                        style={inputStyle}
                        value={formLocation}
                        onChange={(e) => setFormLocation(e.target.value)}
                        placeholder="Contoh: Jakarta / Remote"
                      />
                    </div>
                    <div>
                      <label
                        style={{
                          fontFamily: "'Inter', sans-serif",
                          fontSize: 12.5,
                          fontWeight: 600,
                          color: "#0D1117",
                          marginBottom: 4,
                          display: "block",
                        }}
                      >
                        Ekspektasi Gaji (Rp / bulan)
                      </label>
                      <input
                        type="number"
                        style={inputStyle}
                        value={formSalaryExpectation}
                        onChange={(e) => setFormSalaryExpectation(e.target.value)}
                        placeholder="Contoh: 15000000"
                      />
                    </div>
                    <div>
                      <label
                        style={{
                          fontFamily: "'Inter', sans-serif",
                          fontSize: 12.5,
                          fontWeight: 600,
                          color: "#0D1117",
                          marginBottom: 4,
                          display: "block",
                        }}
                      >
                        Preferensi Mobilitas / Relokasi
                      </label>
                      <input
                        style={inputStyle}
                        value={formMobilityPreference}
                        onChange={(e) => setFormMobilityPreference(e.target.value)}
                        placeholder="Contoh: Bersedia relokasi ke Jawa Barat"
                      />
                    </div>
                    <div>
                      <label
                        style={{
                          fontFamily: "'Inter', sans-serif",
                          fontSize: 12.5,
                          fontWeight: 600,
                          color: "#0D1117",
                          marginBottom: 4,
                          display: "block",
                        }}
                      >
                        Visibilitas Profil
                      </label>
                      <select
                        style={{ ...inputStyle, cursor: "pointer" }}
                        value={formVisibilityStatus}
                        onChange={(e) =>
                          setFormVisibilityStatus(e.target.value as ProfileVisibilityStatus)
                        }
                      >
                        <option value="PUBLIC">Publik (Terlihat oleh semua recruiter)</option>
                        <option value="LIMITED">Terbatas (Hanya recruiter tertentu)</option>
                        <option value="PRIVATE">Private (Hanya terlihat saat melamar)</option>
                      </select>
                    </div>
                  </div>
                ) : (
                  <div
                    style={{
                      display: "grid",
                      gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
                      gap: 14,
                    }}
                  >
                    <div
                      style={{
                        padding: "16px",
                        borderRadius: 14,
                        background: "#FFFFFF",
                        border: "1px solid #E2E8F0",
                      }}
                    >
                      <div
                        style={{
                          fontFamily: "'Inter', sans-serif",
                          fontSize: 11.5,
                          color: "#4A5568",
                          marginBottom: 4,
                        }}
                      >
                        Lokasi Preferensi
                      </div>
                      <div
                        style={{
                          fontFamily: "'Poppins', sans-serif",
                          fontSize: 14,
                          fontWeight: 600,
                          color: "#0D1117",
                        }}
                      >
                        {profile?.location || "Belum ditentukan"}
                      </div>
                    </div>
                    <div
                      style={{
                        padding: "16px",
                        borderRadius: 14,
                        background: "#FFFFFF",
                        border: "1px solid #E2E8F0",
                      }}
                    >
                      <div
                        style={{
                          fontFamily: "'Inter', sans-serif",
                          fontSize: 11.5,
                          color: "#4A5568",
                          marginBottom: 4,
                        }}
                      >
                        Ekspektasi Gaji
                      </div>
                      <div
                        style={{
                          fontFamily: "'Poppins', sans-serif",
                          fontSize: 14,
                          fontWeight: 600,
                          color: "#0D1117",
                        }}
                      >
                        {profile?.salaryExpectation
                          ? `Rp ${new Intl.NumberFormat("id-ID").format(profile.salaryExpectation)}`
                          : "Belum ditentukan"}
                      </div>
                    </div>
                    <div
                      style={{
                        padding: "16px",
                        borderRadius: 14,
                        background: "#FFFFFF",
                        border: "1px solid #E2E8F0",
                      }}
                    >
                      <div
                        style={{
                          fontFamily: "'Inter', sans-serif",
                          fontSize: 11.5,
                          color: "#4A5568",
                          marginBottom: 4,
                        }}
                      >
                        Status Relokasi
                      </div>
                      <div
                        style={{
                          fontFamily: "'Poppins', sans-serif",
                          fontSize: 14,
                          fontWeight: 600,
                          color: "#0D1117",
                        }}
                      >
                        {profile?.mobilityPreference || "Belum ditentukan"}
                      </div>
                    </div>
                    <div
                      style={{
                        padding: "16px",
                        borderRadius: 14,
                        background: "#FFFFFF",
                        border: "1px solid #E2E8F0",
                      }}
                    >
                      <div
                        style={{
                          fontFamily: "'Inter', sans-serif",
                          fontSize: 11.5,
                          color: "#4A5568",
                          marginBottom: 4,
                        }}
                      >
                        Visibilitas Profil
                      </div>
                      <div
                        style={{
                          fontFamily: "'Poppins', sans-serif",
                          fontSize: 14,
                          fontWeight: 600,
                          color: "#0E67CC",
                        }}
                      >
                        {profile?.visibilityStatus || "PRIVATE"}
                      </div>
                    </div>
                  </div>
                )}
              </SectionCard>
            </>
          )}

          {activeTab === "pengalaman" && (
            <SectionCard
              title="Pengalaman Kerja"
              sectionKey="pengalaman"
              editingSection={editingSection}
              onEditStart={setEditingSection}
              onEditSave={() => void handleEditSave()}
              isSaving={isSaving}
            >
              <div
                style={{
                  display: "flex",
                  gap: 16,
                  padding: 16,
                  background: "#FFFFFF",
                  borderRadius: 14,
                  border: "1px solid #E2E8F0",
                }}
              >
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
                  <Briefcase size={18} />
                </div>
                <div style={{ flex: 1 }}>
                  <div
                    style={{
                      fontFamily: "'Poppins', sans-serif",
                      fontSize: 14.5,
                      fontWeight: 600,
                      color: "#0D1117",
                    }}
                  >
                    Ringkasan Pengalaman
                  </div>
                  <div
                    style={{
                      fontFamily: "'Inter', sans-serif",
                      fontSize: 13.5,
                      color: "#4A5568",
                      marginTop: 6,
                      lineHeight: 1.6,
                    }}
                  >
                    {profile?.experienceSummary ||
                      "Belum ada catatan pengalaman kerja. Anda dapat menambahkan ringkasan di tab Profil atau mengunggah CV."}
                  </div>
                </div>
              </div>
            </SectionCard>
          )}

          {activeTab === "pendidikan" && (
            <SectionCard
              title="Pendidikan"
              sectionKey="pendidikan"
              editingSection={editingSection}
              onEditStart={setEditingSection}
              onEditSave={() => void handleEditSave()}
              isSaving={isSaving}
            >
              {editingSection === "pendidikan" ? (
                <div>
                  <label
                    style={{
                      fontFamily: "'Inter', sans-serif",
                      fontSize: 12.5,
                      fontWeight: 600,
                      color: "#0D1117",
                      marginBottom: 4,
                      display: "block",
                    }}
                  >
                    Riwayat Pendidikan
                  </label>
                  <textarea
                    rows={3}
                    style={{ ...inputStyle, resize: "vertical" }}
                    value={formEducation}
                    onChange={(e) => setFormEducation(e.target.value)}
                    placeholder="Contoh: S1 Desain Komunikasi Visual, Universitas Bina Nusantara (2016-2020)"
                  />
                </div>
              ) : (
                <div
                  style={{
                    display: "flex",
                    gap: 16,
                    padding: 16,
                    background: "#FFFFFF",
                    borderRadius: 14,
                    border: "1px solid #E2E8F0",
                  }}
                >
                  <div
                    aria-hidden="true"
                    style={{
                      width: 44,
                      height: 44,
                      borderRadius: 12,
                      background: "#0D1117",
                      color: "#D4FF59",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      flexShrink: 0,
                    }}
                  >
                    <GraduationCap size={20} />
                  </div>
                  <div>
                    <div
                      style={{
                        fontFamily: "'Poppins', sans-serif",
                        fontSize: 14.5,
                        fontWeight: 600,
                        color: "#0D1117",
                      }}
                    >
                      Riwayat Pendidikan
                    </div>
                    <div
                      style={{
                        fontFamily: "'Inter', sans-serif",
                        fontSize: 13.5,
                        color: "#4A5568",
                        fontWeight: 500,
                        marginTop: 4,
                      }}
                    >
                      {profile?.education || "Belum ada riwayat pendidikan."}
                    </div>
                  </div>
                </div>
              )}
            </SectionCard>
          )}

          {activeTab === "skill" && (
            <SectionCard
              title="Skill & Keahlian"
              sectionKey="skill"
              editingSection={editingSection}
              onEditStart={setEditingSection}
              onEditSave={() => void handleEditSave()}
              isSaving={isSaving}
            >
              <form
                onSubmit={(e) => void handleAddSkill(e)}
                style={{
                  marginBottom: 20,
                  padding: "18px",
                  borderRadius: 16,
                  background: "#FFFFFF",
                  border: "1px solid #E2E8F0",
                }}
              >
                <div
                  style={{
                    fontFamily: "'Poppins', sans-serif",
                    fontSize: 13.5,
                    fontWeight: 600,
                    color: "#0D1117",
                    marginBottom: 10,
                  }}
                >
                  Tambah Skill Baru
                </div>
                <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
                  <input
                    type="text"
                    style={{ ...inputStyle, flex: "1 1 200px", marginBottom: 0 }}
                    placeholder="Contoh: Figma, React, SQL, Python"
                    value={newSkillName}
                    onChange={(e) => setNewSkillName(e.target.value)}
                    disabled={isAddingSkill}
                  />
                  <select
                    style={{
                      ...inputStyle,
                      width: "auto",
                      minWidth: 130,
                      marginBottom: 0,
                      cursor: "pointer",
                    }}
                    value={newSkillLevel}
                    onChange={(e) => setNewSkillLevel(e.target.value)}
                    disabled={isAddingSkill}
                  >
                    <option value="Pemula">Pemula</option>
                    <option value="Menengah">Menengah</option>
                    <option value="Mahir">Mahir</option>
                    <option value="Ahli">Ahli</option>
                  </select>
                  <button
                    type="submit"
                    disabled={isAddingSkill}
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      gap: 6,
                      padding: "10px 20px",
                      minHeight: 42,
                      borderRadius: 999,
                      border: "none",
                      background: "#0D1117",
                      color: "#D4FF59",
                      fontFamily: "'Inter', sans-serif",
                      fontSize: 13,
                      fontWeight: 700,
                      cursor: isAddingSkill ? "not-allowed" : "pointer",
                      opacity: isAddingSkill ? 0.7 : 1,
                    }}
                  >
                    {isAddingSkill ? (
                      <Loader2 size={14} className="animate-spin" />
                    ) : (
                      <Plus size={14} />
                    )}
                    {isAddingSkill ? "Menambahkan..." : "Tambah Skill"}
                  </button>
                </div>
              </form>

              {skills.length === 0 ? (
                <div
                  style={{
                    textAlign: "center",
                    padding: "28px 16px",
                    color: "#4A5568",
                    fontFamily: "'Inter', sans-serif",
                    fontSize: 13.5,
                  }}
                >
                  Belum ada skill yang ditambahkan. Gunakan form di atas atau unggah CV Anda untuk
                  ekstraksi skill otomatis.
                </div>
              ) : (
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))",
                    gap: 14,
                  }}
                >
                  {skills.map((skill) => {
                    const isDeleting = deletingSkillId === skill.id;
                    const levelPercentage =
                      skill.level === "Ahli"
                        ? 95
                        : skill.level === "Mahir"
                          ? 85
                          : skill.level === "Pemula"
                            ? 40
                            : 65;

                    return (
                      <div
                        key={skill.id}
                        style={{
                          padding: "14px 16px",
                          borderRadius: 16,
                          background: "#FFFFFF",
                          border: "1px solid #E2E8F0",
                          display: "flex",
                          flexDirection: "column",
                          gap: 8,
                        }}
                      >
                        <div
                          style={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                          }}
                        >
                          <div>
                            <span
                              style={{
                                fontFamily: "'Poppins', sans-serif",
                                fontSize: 13.5,
                                fontWeight: 600,
                                color: "#0D1117",
                              }}
                            >
                              {skill.skillName}
                            </span>
                            {skill.source && (
                              <span
                                style={{
                                  marginLeft: 6,
                                  fontFamily: "'Inter', sans-serif",
                                  fontSize: 10,
                                  fontWeight: 600,
                                  padding: "2px 8px",
                                  borderRadius: 999,
                                  background: "#F4F5F7",
                                  color: "#4A5568",
                                }}
                              >
                                {skill.source}
                              </span>
                            )}
                          </div>
                          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                            <span
                              style={{
                                fontFamily: "'Inter', sans-serif",
                                fontSize: 11.5,
                                fontWeight: 700,
                                color: "#0E67CC",
                              }}
                            >
                              {skill.level || `${levelPercentage}%`}
                            </span>
                            <button
                              type="button"
                              onClick={() => void handleDeleteSkill(skill.id, skill.skillName)}
                              disabled={isDeleting}
                              style={{
                                background: "none",
                                border: "none",
                                cursor: isDeleting ? "not-allowed" : "pointer",
                                color: "#B91C1C",
                                padding: 4,
                                display: "inline-flex",
                                alignItems: "center",
                              }}
                              title={`Hapus skill ${skill.skillName}`}
                            >
                              {isDeleting ? (
                                <Loader2 size={13} className="animate-spin" />
                              ) : (
                                <Trash2 size={13} />
                              )}
                            </button>
                          </div>
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
                              width: `${levelPercentage}%`,
                              borderRadius: 999,
                              background: "#0E67CC",
                            }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </SectionCard>
          )}

          {activeTab === "portfolio" && (
            <SectionCard
              title="Portfolio & Proyek"
              sectionKey="portfolio"
              editingSection={editingSection}
              onEditStart={setEditingSection}
              onEditSave={() => void handleEditSave()}
              isSaving={isSaving}
            >
              <div
                style={{
                  textAlign: "center",
                  padding: "28px 16px",
                  color: "#4A5568",
                  background: "#FFFFFF",
                  borderRadius: 14,
                  border: "1px solid #E2E8F0",
                  fontFamily: "'Inter', sans-serif",
                  fontSize: 13.5,
                }}
              >
                Proyek dan tautan portofolio dapat ditambahkan pada pembaruan berikutnya atau
                dilampirkan dalam dokumen resume CV Anda.
              </div>
            </SectionCard>
          )}
        </>
      )}
    </DashboardLayout>
  );
}
