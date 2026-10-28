import { useState, useRef, useEffect, useCallback, useMemo } from "react";
import {
  Home, Briefcase, Bookmark, BarChart2, BookOpen, FileText, Globe, User, Settings,
  MapPin, Mail, Phone, Calendar, Download, Edit2, CheckCircle,
  GraduationCap, Star, FolderOpen, UploadCloud, Trash2, Plus, Loader2, AlertCircle,
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
    <div style={{
      background: "#fff", borderRadius: 16, padding: "22px 24px",
      boxShadow: "0 2px 12px rgba(10,27,61,0.07)", border: "1px solid rgba(22,119,255,0.08)",
      marginBottom: 20, position: "relative",
    }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 18 }}>
        <div style={{ fontFamily: "'Poppins', sans-serif", fontSize: 15, fontWeight: 700, color: "#0A1B3D" }}>{title}</div>
        {isEditing ? (
          <div style={{ display: "flex", gap: 8 }}>
            <button
              onClick={() => onEditStart("")}
              disabled={isSaving}
              style={{
                fontFamily: "'Inter', sans-serif", fontSize: 12, fontWeight: 500,
                padding: "6px 12px", borderRadius: 8, border: "1px solid rgba(106,136,184,0.3)",
                background: "#f8fbff", color: "#6a88b8", cursor: "pointer",
              }}
            >
              Batal
            </button>
            <button
              onClick={onEditSave}
              disabled={isSaving}
              style={{
                display: "flex", alignItems: "center", gap: 5,
                fontFamily: "'Inter', sans-serif", fontSize: 12, fontWeight: 600,
                padding: "6px 14px", borderRadius: 8, border: "none",
                background: "linear-gradient(135deg, #1677FF, #4DB8FF)",
                color: "#fff", cursor: isSaving ? "not-allowed" : "pointer",
                opacity: isSaving ? 0.7 : 1,
              }}
            >
              {isSaving ? <Loader2 size={13} className="animate-spin" /> : null}
              {isSaving ? "Menyimpan..." : "Simpan Perubahan"}
            </button>
          </div>
        ) : (
          <button
            onClick={() => onEditStart(sectionKey)}
            style={{
              display: "flex", alignItems: "center", gap: 5,
              fontFamily: "'Inter', sans-serif", fontSize: 12, fontWeight: 600,
              padding: "6px 12px", borderRadius: 8,
              border: "1.5px solid rgba(22,119,255,0.2)",
              background: "#fff", color: "#1677FF", cursor: "pointer",
            }}
          >
            <Edit2 size={12} /> Edit
          </button>
        )}
      </div>
      {isEditing && (
        <div style={{
          marginBottom: 16, padding: "14px 16px", borderRadius: 10,
          background: "#f0f7ff", border: "1px dashed rgba(22,119,255,0.3)",
          fontFamily: "'Inter', sans-serif", fontSize: 13, color: "#6a88b8",
        }}>
          Mode edit aktif — ubah informasi di bawah ini lalu klik "Simpan Perubahan".
        </div>
      )}
      {children}
    </div>
  );
}

function InfoRow({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 12, paddingBottom: 14, borderBottom: "1px solid #f0f7ff" }}>
      <div style={{ width: 32, height: 32, borderRadius: 8, background: "#f0f7ff", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
        {icon}
      </div>
      <div>
        <div style={{ fontFamily: "'Inter', sans-serif", fontSize: 11, color: "#6a88b8" }}>{label}</div>
        <div style={{ fontFamily: "'Inter', sans-serif", fontSize: 13, fontWeight: 600, color: "#0A1B3D", marginTop: 1 }}>{value}</div>
      </div>
    </div>
  );
}

const inputStyle: React.CSSProperties = {
  width: "100%", padding: "10px 14px", borderRadius: 10,
  border: "1px solid rgba(22,119,255,0.2)", outline: "none",
  fontFamily: "'Inter', sans-serif", fontSize: 13, color: "#0A1B3D",
  background: "#f8fbff", boxSizing: "border-box", marginBottom: 12,
};

export default function CandidateSelfProfilePage() {
  const { user, retrySession } = useAppContext();
  const [activeTab, setActiveTab] = useState("profil");
  const [editingSection, setEditingSection] = useState<string | null>(null);
  const [showCvUpload, setShowCvUpload] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // API State
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [profile, setProfile] = useState<CandidateProfile | null>(null);
  const [skills, setSkills] = useState<CandidateSkill[]>([]);
  const [cvDocuments, setCvDocuments] = useState<CandidateDocument[]>([]);

  // Form edit states
  const [formFullName, setFormFullName] = useState("");
  const [formPhone, setFormPhone] = useState("");
  const [formLocation, setFormLocation] = useState("");
  const [formEducation, setFormEducation] = useState("");
  const [formExperienceSummary, setFormExperienceSummary] = useState("");
  const [formSalaryExpectation, setFormSalaryExpectation] = useState<number | string>("");
  const [formMobilityPreference, setFormMobilityPreference] = useState("");
  const [formVisibilityStatus, setFormVisibilityStatus] = useState<ProfileVisibilityStatus>("PRIVATE");

  // Action states
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

      // Populate form states
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

  // Profile completion calculation
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
        if (formExperienceSummary.trim()) payload.experienceSummary = formExperienceSummary.trim();
      } else if (editingSection === "preferensi") {
        if (formLocation.trim()) payload.location = formLocation.trim();
        if (formSalaryExpectation !== "" && formSalaryExpectation !== null) {
          const num = typeof formSalaryExpectation === "number" ? formSalaryExpectation : parseInt(String(formSalaryExpectation).replace(/\D/g, ""), 10);
          if (!isNaN(num) && num >= 0) payload.salaryExpectation = num;
        }
        if (formMobilityPreference.trim()) payload.mobilityPreference = formMobilityPreference.trim();
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
      setCvDocuments(prev => [doc, ...prev]);
      setShowCvUpload(false);
      toast.success(`CV "${doc.fileName}" berhasil diunggah!`);

      // Refresh skills if new skills were extracted by backend parser
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
      setCvDocuments(prev => prev.filter(c => c.id !== cvId));
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

    // Check duplicate locally
    if (skills.some(s => s.skillName.toLowerCase() === trimmed.toLowerCase())) {
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
      setSkills(prev => [created, ...prev]);
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
      setSkills(prev => prev.filter(s => s.id !== skillId));
      toast.success(`Skill "${skillName}" berhasil dihapus.`);
    } catch (err) {
      const msg = err instanceof ApiError ? err.message : "Gagal menghapus skill.";
      toast.error(msg);
    } finally {
      setDeletingSkillId(null);
    }
  };

  const card: React.CSSProperties = {
    background: "#fff",
    borderRadius: 16,
    padding: "24px",
    boxShadow: "0 2px 12px rgba(10,27,61,0.07)",
    border: "1px solid rgba(22,119,255,0.08)",
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
      {/* Header */}
      <div style={{ marginBottom: 24, display: "flex", alignItems: "flex-start", justifyContent: "space-between" }}>
        <div>
          <h1 style={{ fontFamily: "'Poppins', sans-serif", fontSize: 24, fontWeight: 700, color: "#0A1B3D", margin: 0 }}>
            Profil Saya
          </h1>
          <p style={{ fontFamily: "'Inter', sans-serif", fontSize: 14, color: "#6a88b8", marginTop: 6 }}>
            Kelola informasi profil, keahlian, dan dokumen resume Anda.
          </p>
        </div>
        <button
          onClick={() => {
            if (cvDocuments.length > 0) {
              toast.success(`CV aktif: ${cvDocuments[0].fileName}`);
            } else {
              toast.error("Belum ada CV yang diunggah. Silakan upload CV terlebih dahulu.");
            }
          }}
          style={{
            display: "flex", alignItems: "center", gap: 7,
            fontFamily: "'Inter', sans-serif", fontSize: 13, fontWeight: 600,
            padding: "10px 20px", borderRadius: 10, border: "none",
            background: "linear-gradient(135deg, #0A1B3D, #1677FF)",
            color: "#fff", cursor: "pointer",
          }}
        >
          <Download size={14} /> Download CV
        </button>
      </div>

      {loading ? (
        <div style={{ ...card, textAlign: "center", padding: "48px 24px" }}>
          <Loader2 size={32} color="#1677FF" className="animate-spin" style={{ margin: "0 auto 16px" }} />
          <div style={{ fontFamily: "'Poppins', sans-serif", fontSize: 16, fontWeight: 600, color: "#0A1B3D" }}>
            Memuat Profil Kandidat...
          </div>
          <div style={{ fontFamily: "'Inter', sans-serif", fontSize: 13, color: "#6a88b8", marginTop: 4 }}>
            Mengambil data profil, keterampilan, dan dokumen dari server.
          </div>
        </div>
      ) : error ? (
        <div style={{ ...card, background: "#fff5f5", borderColor: "rgba(255,107,107,0.3)", textAlign: "center", padding: "36px 24px" }}>
          <AlertCircle size={36} color="#ff6b6b" style={{ margin: "0 auto 12px" }} />
          <div style={{ fontFamily: "'Poppins', sans-serif", fontSize: 16, fontWeight: 700, color: "#0A1B3D" }}>
            Gagal Memuat Profil
          </div>
          <p style={{ fontFamily: "'Inter', sans-serif", fontSize: 13, color: "#ff6b6b", marginTop: 6 }}>
            {error}
          </p>
          <button
            onClick={() => void loadData()}
            style={{
              marginTop: 14, padding: "8px 20px", borderRadius: 8, border: "none",
              background: "#1677FF", color: "#fff", fontFamily: "'Inter', sans-serif", fontSize: 13, fontWeight: 600, cursor: "pointer",
            }}
          >
            Coba Lagi
          </button>
        </div>
      ) : (
        <>
          {/* Profile completion bar */}
          <div style={{ ...card, marginBottom: 24, padding: "16px 22px" }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 10 }}>
              <div>
                <span style={{ fontFamily: "'Poppins', sans-serif", fontSize: 13, fontWeight: 700, color: "#0A1B3D" }}>Kelengkapan Profil </span>
                <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 13, fontWeight: 800, color: "#1677FF" }}>{completionPercentage}%</span>
              </div>
              <span style={{ fontFamily: "'Inter', sans-serif", fontSize: 12, color: "#6a88b8" }}>Lengkapi profil untuk meningkatkan akurasi matching AI</span>
            </div>
            <div style={{ position: "relative", height: 10, background: "#eef4ff", borderRadius: 99 }}>
              <div style={{
                position: "absolute", left: 0, top: 0, height: "100%",
                width: `${completionPercentage}%`, borderRadius: 99,
                background: "linear-gradient(90deg, #1677FF, #4DB8FF)",
                transition: "width 0.4s ease",
              }} />
            </div>
            <div style={{ display: "flex", gap: 16, marginTop: 12, flexWrap: "wrap" }}>
              {[
                { label: "Data Diri", done: Boolean(profile?.fullName && profile?.phone && profile?.location) },
                { label: "Pendidikan", done: Boolean(profile?.education) },
                { label: "Pengalaman", done: Boolean(profile?.experienceSummary) },
                { label: "Skill", done: skills.length > 0 },
                { label: "Resume / CV", done: cvDocuments.length > 0 },
              ].map((item) => (
                <div key={item.label} style={{ display: "flex", alignItems: "center", gap: 4 }}>
                  <CheckCircle size={12} color={item.done ? "#10d98e" : "#d0dff2"} />
                  <span style={{ fontFamily: "'Inter', sans-serif", fontSize: 11, color: item.done ? "#10d98e" : "#b0c4de" }}>{item.label}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Profile header card */}
          <div style={{ ...card, marginBottom: 24 }}>
            <div style={{ display: "flex", alignItems: "flex-start", gap: 20 }}>
              {/* Avatar */}
              <div style={{
                width: 80, height: 80, borderRadius: "50%",
                background: "linear-gradient(135deg, #1677FF, #4DB8FF)",
                display: "flex", alignItems: "center", justifyContent: "center",
                fontFamily: "'Poppins', sans-serif", fontSize: 32, fontWeight: 800, color: "#fff",
                flexShrink: 0, boxShadow: "0 4px 16px rgba(22,119,255,0.3)",
              }}>
                {displayInitial}
              </div>

              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontFamily: "'Poppins', sans-serif", fontSize: 22, fontWeight: 800, color: "#0A1B3D" }}>{displayName}</div>
                <div style={{ fontFamily: "'Inter', sans-serif", fontSize: 14, color: "#1677FF", fontWeight: 600, marginTop: 2 }}>
                  {profile?.education || "Pendidikan belum diisi"}
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 4, marginTop: 6, fontFamily: "'Inter', sans-serif", fontSize: 13, color: "#6a88b8" }}>
                  <MapPin size={13} /> {profile?.location || "Lokasi belum diisi (Pulau Jawa)"}
                </div>
                <div style={{ marginTop: 10, fontFamily: "'Inter', sans-serif", fontSize: 13, color: "#4a6080", lineHeight: 1.6, maxWidth: 600 }}>
                  {profile?.experienceSummary || "Belum ada ringkasan profil. Klik edit pada bagian Ringkasan Profil untuk menambahkan bio diri Anda."}
                </div>
              </div>
            </div>

            {/* CV Section */}
            <div style={{ marginTop: 20, borderTop: "1px solid #f0f7ff", paddingTop: 16 }}>
              {cvDocuments.length > 0 && (
                <div style={{ marginBottom: 14 }}>
                  <div style={{ fontFamily: "'Inter', sans-serif", fontSize: 12, fontWeight: 600, color: "#0A1B3D", marginBottom: 8 }}>
                    Dokumen CV Terunggah:
                  </div>
                  <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                    {cvDocuments.map((doc) => {
                      const isParsing = doc.parsingStatus === "PENDING";
                      const isSuccess = doc.parsingStatus === "SUCCESS";
                      const isFailed = doc.parsingStatus === "FAILED";
                      const statusColor = isSuccess ? "#10d98e" : isParsing ? "#1677FF" : isFailed ? "#ff6b6b" : "#f59e0b";
                      const statusBg = isSuccess ? "rgba(16,217,142,0.1)" : isParsing ? "rgba(22,119,255,0.1)" : isFailed ? "rgba(255,107,107,0.1)" : "rgba(245,158,11,0.1)";

                      return (
                        <div
                          key={doc.id}
                          style={{
                            display: "flex", alignItems: "center", justifyContent: "space-between",
                            padding: "10px 14px", borderRadius: 10, background: "#f8fbff",
                            border: "1px solid rgba(22,119,255,0.15)",
                          }}
                        >
                          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                            <FileCheck2 size={18} color="#1677FF" />
                            <div>
                              <div style={{ fontFamily: "'Inter', sans-serif", fontSize: 13, fontWeight: 600, color: "#0A1B3D" }}>
                                {doc.fileName}
                              </div>
                              <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11, color: "#6a88b8" }}>
                                {(doc.fileSize / 1024).toFixed(1)} KB · Diunggah {new Date(doc.uploadedAt).toLocaleDateString("id-ID")}
                              </div>
                            </div>
                          </div>
                          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                            <span style={{
                              fontFamily: "'JetBrains Mono', monospace", fontSize: 10, fontWeight: 700,
                              color: statusColor, background: statusBg, padding: "3px 8px", borderRadius: 6,
                            }}>
                              {doc.parsingStatus}
                            </span>
                            <button
                              onClick={() => void handleDeleteCv(doc.id)}
                              disabled={deletingCvId === doc.id}
                              style={{
                                background: "none", border: "none", cursor: "pointer", color: "#ff6b6b",
                                padding: 4, display: "flex", alignItems: "center",
                              }}
                              title="Hapus CV"
                            >
                              {deletingCvId === doc.id ? <Loader2 size={14} className="animate-spin" /> : <Trash2 size={14} />}
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
                  onClick={() => setShowCvUpload(true)}
                  style={{
                    display: "flex", alignItems: "center", gap: 7,
                    fontFamily: "'Inter', sans-serif", fontSize: 13, fontWeight: 600,
                    padding: "9px 18px", borderRadius: 10,
                    border: "1.5px solid rgba(22,119,255,0.25)",
                    background: "#f8fbff", color: "#1677FF", cursor: "pointer",
                  }}
                >
                  <UploadCloud size={15} /> Upload CV Baru
                </button>
              ) : (
                <div
                  onClick={() => !isUploadingCv && fileInputRef.current?.click()}
                  style={{
                    border: "2px dashed rgba(22,119,255,0.3)", borderRadius: 12,
                    padding: "24px", textAlign: "center", cursor: isUploadingCv ? "not-allowed" : "pointer",
                    background: "#f8fbff", transition: "background 0.15s",
                  }}
                >
                  {isUploadingCv ? (
                    <>
                      <Loader2 size={32} color="#1677FF" className="animate-spin" style={{ margin: "0 auto 8px" }} />
                      <div style={{ fontFamily: "'Inter', sans-serif", fontSize: 13, color: "#1677FF", fontWeight: 600 }}>
                        Mengunggah dan mengekstrak CV...
                      </div>
                    </>
                  ) : (
                    <>
                      <UploadCloud size={32} color="#1677FF" style={{ marginBottom: 8 }} />
                      <div style={{ fontFamily: "'Inter', sans-serif", fontSize: 13, color: "#0A1B3D", fontWeight: 600 }}>
                        Seret file ke sini atau klik untuk unggah
                      </div>
                      <div style={{ fontFamily: "'Inter', sans-serif", fontSize: 11, color: "#6a88b8", marginTop: 4 }}>
                        PDF, DOCX maks. 5MB
                      </div>
                      <button
                        type="button"
                        onClick={(e) => { e.stopPropagation(); setShowCvUpload(false); }}
                        style={{
                          marginTop: 10, background: "none", border: "none",
                          fontFamily: "'Inter', sans-serif", fontSize: 11, color: "#6a88b8", cursor: "pointer", textDecoration: "underline",
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

          {/* Tabs */}
          <div style={{ display: "flex", gap: 4, marginBottom: 20, background: "#fff", padding: "6px", borderRadius: 14, boxShadow: "0 2px 12px rgba(10,27,61,0.07)", border: "1px solid rgba(22,119,255,0.08)", width: "fit-content" }}>
            {tabs.map((tab) => {
              const isActive = activeTab === tab.key;
              return (
                <button
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key)}
                  style={{
                    display: "flex", alignItems: "center", gap: 6,
                    fontFamily: "'Inter', sans-serif", fontSize: 13, fontWeight: isActive ? 600 : 400,
                    padding: "8px 18px", borderRadius: 10, border: "none", cursor: "pointer",
                    background: isActive ? "#1677FF" : "transparent",
                    color: isActive ? "#fff" : "#6a88b8",
                    transition: "all 0.15s",
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
              {/* Informasi Pribadi */}
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
                    <label style={{ fontFamily: "'Inter', sans-serif", fontSize: 12, fontWeight: 600, color: "#0A1B3D", marginBottom: 4 }}>Nama Lengkap</label>
                    <input
                      style={inputStyle}
                      value={formFullName}
                      onChange={(e) => setFormFullName(e.target.value)}
                      placeholder="Nama lengkap sesuai identitas"
                    />
                    <label style={{ fontFamily: "'Inter', sans-serif", fontSize: 12, fontWeight: 600, color: "#0A1B3D", marginBottom: 4 }}>Nomor Telepon</label>
                    <input
                      style={inputStyle}
                      value={formPhone}
                      onChange={(e) => setFormPhone(e.target.value)}
                      placeholder="Contoh: 081234567890"
                    />
                    <label style={{ fontFamily: "'Inter', sans-serif", fontSize: 12, fontWeight: 600, color: "#0A1B3D", marginBottom: 4 }}>Lokasi Domisili (Pulau Jawa)</label>
                    <input
                      style={inputStyle}
                      value={formLocation}
                      onChange={(e) => setFormLocation(e.target.value)}
                      placeholder="Contoh: Jakarta Selatan, DKI Jakarta"
                    />
                  </div>
                ) : (
                  <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                    <InfoRow icon={<User size={14} color="#1677FF" />} label="Nama Lengkap" value={displayName} />
                    <InfoRow icon={<Mail size={14} color="#1677FF" />} label="Email" value={displayEmail} />
                    <InfoRow icon={<Phone size={14} color="#1677FF" />} label="Telepon" value={profile?.phone || "Belum diisi"} />
                    <InfoRow icon={<MapPin size={14} color="#1677FF" />} label="Lokasi" value={profile?.location || "Belum diisi"} />
                    <InfoRow icon={<Calendar size={14} color="#1677FF" />} label="Terdaftar Sejak" value={profile?.createdAt ? new Date(profile.createdAt).toLocaleDateString("id-ID") : "-"} />
                  </div>
                )}
              </SectionCard>

              {/* Ringkasan Profil */}
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
                    <label style={{ fontFamily: "'Inter', sans-serif", fontSize: 12, fontWeight: 600, color: "#0A1B3D", marginBottom: 4, display: "block" }}>
                      Ringkasan Pengalaman & Latar Belakang
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
                  <div style={{
                    fontFamily: "'Inter', sans-serif", fontSize: 14, color: "#4a6080", lineHeight: 1.7,
                    padding: "14px 16px", borderRadius: 10, background: "#f8fbff", border: "1px solid rgba(22,119,255,0.08)",
                  }}>
                    {profile?.experienceSummary || "Belum ada ringkasan profil."}
                  </div>
                )}
              </SectionCard>

              {/* Preferensi Kerja */}
              <SectionCard
                title="Preferensi Kerja & Mobilitas"
                sectionKey="preferensi"
                editingSection={editingSection}
                onEditStart={setEditingSection}
                onEditSave={() => void handleEditSave()}
                isSaving={isSaving}
              >
                {editingSection === "preferensi" ? (
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
                    <div>
                      <label style={{ fontFamily: "'Inter', sans-serif", fontSize: 12, fontWeight: 600, color: "#0A1B3D", marginBottom: 4, display: "block" }}>Lokasi Preferensi</label>
                      <input
                        style={inputStyle}
                        value={formLocation}
                        onChange={(e) => setFormLocation(e.target.value)}
                        placeholder="Contoh: Jakarta / Remote"
                      />
                    </div>
                    <div>
                      <label style={{ fontFamily: "'Inter', sans-serif", fontSize: 12, fontWeight: 600, color: "#0A1B3D", marginBottom: 4, display: "block" }}>Ekspektasi Gaji (Rp / bulan)</label>
                      <input
                        type="number"
                        style={inputStyle}
                        value={formSalaryExpectation}
                        onChange={(e) => setFormSalaryExpectation(e.target.value)}
                        placeholder="Contoh: 15000000"
                      />
                    </div>
                    <div>
                      <label style={{ fontFamily: "'Inter', sans-serif", fontSize: 12, fontWeight: 600, color: "#0A1B3D", marginBottom: 4, display: "block" }}>Preferensi Mobilitas / Relokasi</label>
                      <input
                        style={inputStyle}
                        value={formMobilityPreference}
                        onChange={(e) => setFormMobilityPreference(e.target.value)}
                        placeholder="Contoh: Bersedia relokasi ke Jawa Barat"
                      />
                    </div>
                    <div>
                      <label style={{ fontFamily: "'Inter', sans-serif", fontSize: 12, fontWeight: 600, color: "#0A1B3D", marginBottom: 4, display: "block" }}>Visibilitas Profil</label>
                      <select
                        style={{ ...inputStyle, cursor: "pointer" }}
                        value={formVisibilityStatus}
                        onChange={(e) => setFormVisibilityStatus(e.target.value as ProfileVisibilityStatus)}
                      >
                        <option value="PUBLIC">Publik (Terlihat oleh semua recruiter)</option>
                        <option value="LIMITED">Terbatas (Hanya recruiter tertentu)</option>
                        <option value="PRIVATE">Private (Hanya terlihat saat melamar)</option>
                      </select>
                    </div>
                  </div>
                ) : (
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
                    <div style={{ padding: "14px 16px", borderRadius: 12, background: "#f8fbff", border: "1px solid rgba(22,119,255,0.08)" }}>
                      <div style={{ fontFamily: "'Inter', sans-serif", fontSize: 11, color: "#6a88b8", marginBottom: 4 }}>Lokasi Preferensi</div>
                      <div style={{ fontFamily: "'Poppins', sans-serif", fontSize: 13, fontWeight: 700, color: "#1677FF" }}>{profile?.location || "Belum ditentukan"}</div>
                    </div>
                    <div style={{ padding: "14px 16px", borderRadius: 12, background: "#f8fbff", border: "1px solid rgba(22,119,255,0.08)" }}>
                      <div style={{ fontFamily: "'Inter', sans-serif", fontSize: 11, color: "#6a88b8", marginBottom: 4 }}>Ekspektasi Gaji</div>
                      <div style={{ fontFamily: "'Poppins', sans-serif", fontSize: 13, fontWeight: 700, color: "#10d98e" }}>
                        {profile?.salaryExpectation ? `Rp ${new Intl.NumberFormat("id-ID").format(profile.salaryExpectation)}` : "Belum ditentukan"}
                      </div>
                    </div>
                    <div style={{ padding: "14px 16px", borderRadius: 12, background: "#f8fbff", border: "1px solid rgba(22,119,255,0.08)" }}>
                      <div style={{ fontFamily: "'Inter', sans-serif", fontSize: 11, color: "#6a88b8", marginBottom: 4 }}>Status Relokasi</div>
                      <div style={{ fontFamily: "'Poppins', sans-serif", fontSize: 13, fontWeight: 700, color: "#ff9a3c" }}>{profile?.mobilityPreference || "Belum ditentukan"}</div>
                    </div>
                    <div style={{ padding: "14px 16px", borderRadius: 12, background: "#f8fbff", border: "1px solid rgba(22,119,255,0.08)" }}>
                      <div style={{ fontFamily: "'Inter', sans-serif", fontSize: 11, color: "#6a88b8", marginBottom: 4 }}>Visibilitas Profil</div>
                      <div style={{ fontFamily: "'Poppins', sans-serif", fontSize: 13, fontWeight: 700, color: "#4DB8FF" }}>{profile?.visibilityStatus || "PRIVATE"}</div>
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
              <div style={{ display: "flex", gap: 16 }}>
                <div style={{ width: 40, height: 40, borderRadius: 12, background: "linear-gradient(135deg, #eef4ff, #dbeeff)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                  <Briefcase size={18} color="#1677FF" />
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontFamily: "'Poppins', sans-serif", fontSize: 14, fontWeight: 700, color: "#0A1B3D" }}>
                    Ringkasan Pengalaman
                  </div>
                  <div style={{ fontFamily: "'Inter', sans-serif", fontSize: 13, color: "#4a6080", marginTop: 6, lineHeight: 1.6 }}>
                    {profile?.experienceSummary || "Belum ada catatan pengalaman kerja. Anda dapat menambahkan ringkasan di tab Profil atau mengunggah CV."}
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
                  <label style={{ fontFamily: "'Inter', sans-serif", fontSize: 12, fontWeight: 600, color: "#0A1B3D", marginBottom: 4, display: "block" }}>
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
                <div style={{ display: "flex", gap: 16 }}>
                  <div style={{ width: 44, height: 44, borderRadius: 12, background: "linear-gradient(135deg, #eef4ff, #dbeeff)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                    <GraduationCap size={20} color="#1677FF" />
                  </div>
                  <div>
                    <div style={{ fontFamily: "'Poppins', sans-serif", fontSize: 14, fontWeight: 700, color: "#0A1B3D" }}>
                      Riwayat Pendidikan
                    </div>
                    <div style={{ fontFamily: "'Inter', sans-serif", fontSize: 13, color: "#1677FF", fontWeight: 600, marginTop: 4 }}>
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
              {/* Form Tambah Skill */}
              <form onSubmit={(e) => void handleAddSkill(e)} style={{ marginBottom: 20, padding: "16px", borderRadius: 12, background: "#f8fbff", border: "1px solid rgba(22,119,255,0.12)" }}>
                <div style={{ fontFamily: "'Poppins', sans-serif", fontSize: 13, fontWeight: 700, color: "#0A1B3D", marginBottom: 10 }}>
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
                    style={{ ...inputStyle, width: "auto", minWidth: 130, marginBottom: 0, cursor: "pointer" }}
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
                      display: "flex", alignItems: "center", gap: 5,
                      padding: "10px 18px", borderRadius: 10, border: "none",
                      background: "linear-gradient(135deg, #1677FF, #4DB8FF)",
                      color: "#fff", fontFamily: "'Inter', sans-serif", fontSize: 13, fontWeight: 600,
                      cursor: isAddingSkill ? "not-allowed" : "pointer",
                      opacity: isAddingSkill ? 0.7 : 1,
                    }}
                  >
                    {isAddingSkill ? <Loader2 size={14} className="animate-spin" /> : <Plus size={14} />}
                    {isAddingSkill ? "Menambahkan..." : "Tambah Skill"}
                  </button>
                </div>
              </form>

              {/* Daftar Skill */}
              {skills.length === 0 ? (
                <div style={{ textAlign: "center", padding: "28px 16px", color: "#6a88b8", fontFamily: "'Inter', sans-serif", fontSize: 13 }}>
                  Belum ada skill yang ditambahkan. Gunakan form di atas atau unggah CV Anda untuk ekstraksi skill otomatis.
                </div>
              ) : (
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
                  {skills.map((skill) => {
                    const isDeleting = deletingSkillId === skill.id;
                    const levelPercentage = skill.level === "Ahli" ? 95 : skill.level === "Mahir" ? 85 : skill.level === "Pemula" ? 40 : 65;
                    const color = levelPercentage >= 80 ? "#10d98e" : levelPercentage >= 60 ? "#1677FF" : "#ff9a3c";

                    return (
                      <div
                        key={skill.id}
                        style={{
                          padding: "12px 14px", borderRadius: 12, background: "#f8fbff",
                          border: "1px solid rgba(22,119,255,0.1)", display: "flex", flexDirection: "column", gap: 6,
                        }}
                      >
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                          <div>
                            <span style={{ fontFamily: "'Inter', sans-serif", fontSize: 13, fontWeight: 700, color: "#0A1B3D" }}>
                              {skill.skillName}
                            </span>
                            {skill.source && (
                              <span style={{
                                marginLeft: 6, fontFamily: "'JetBrains Mono', monospace", fontSize: 9,
                                padding: "2px 6px", borderRadius: 4, background: "rgba(22,119,255,0.08)", color: "#1677FF",
                              }}>
                                {skill.source}
                              </span>
                            )}
                          </div>
                          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                            <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11, fontWeight: 700, color }}>
                              {skill.level || `${levelPercentage}%`}
                            </span>
                            <button
                              onClick={() => void handleDeleteSkill(skill.id, skill.skillName)}
                              disabled={isDeleting}
                              style={{
                                background: "none", border: "none", cursor: isDeleting ? "not-allowed" : "pointer",
                                color: "#ff6b6b", padding: 2, display: "flex", alignItems: "center",
                              }}
                              title={`Hapus skill ${skill.skillName}`}
                            >
                              {isDeleting ? <Loader2 size={13} className="animate-spin" /> : <Trash2 size={13} />}
                            </button>
                          </div>
                        </div>
                        <div style={{ position: "relative", height: 6, background: "#eef4ff", borderRadius: 99 }}>
                          <div style={{
                            position: "absolute", left: 0, top: 0, height: "100%",
                            width: `${levelPercentage}%`, borderRadius: 99,
                            background: `linear-gradient(90deg, ${color}88, ${color})`,
                          }} />
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
              <div style={{ textAlign: "center", padding: "28px 16px", color: "#6a88b8", fontFamily: "'Inter', sans-serif", fontSize: 13 }}>
                Proyek dan tautan portofolio dapat ditambahkan pada pembaruan berikutnya atau dilampirkan dalam dokumen resume CV Anda.
              </div>
            </SectionCard>
          )}
        </>
      )}
    </DashboardLayout>
  );
}
