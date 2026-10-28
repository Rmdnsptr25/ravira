import { useState, useRef } from "react";
import {
  Home, Briefcase, Bookmark, BarChart2, BookOpen, FileText, Globe, User, Settings,
  MapPin, Mail, Phone, Calendar, Download, Edit2, CheckCircle,
  GraduationCap, Star, FolderOpen, UploadCloud,
} from "lucide-react";
import { DashboardLayout } from "../components/DashboardLayout";
import type { SidebarItem } from "../components/DashboardLayout";
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

const tabs = [
  { key: "profil", label: "Profil", icon: <User size={14} /> },
  { key: "pengalaman", label: "Pengalaman", icon: <Briefcase size={14} /> },
  { key: "pendidikan", label: "Pendidikan", icon: <GraduationCap size={14} /> },
  { key: "skill", label: "Skill", icon: <Star size={14} /> },
  { key: "portfolio", label: "Portfolio", icon: <FolderOpen size={14} /> },
];

const candidate = {
  name: "Budi Santoso",
  title: "UI Designer",
  experience: "3 tahun pengalaman",
  location: "Jakarta, Indonesia",
  email: "budi.santoso@email.com",
  phone: "+62 812 3456 7890",
  birthdate: "15 Maret 1994",
  bio: "UI Designer berpengalaman dengan spesialisasi dalam desain produk digital dan pengalaman pengguna. Passionate dalam menciptakan antarmuka yang intuitif dan estetis. Berpengalaman bekerja dengan tim lintas fungsi dan metodologi Agile.",
  workType: "Hybrid",
  preferredLocation: "Jakarta / Remote",
  salaryRange: "12–20 jt",
  relocation: "Bersedia relokasi ke Jawa & Bali",
  completion: 78,
};

const experiences = [
  { role: "UI Designer", company: "PT Teknologi Nusantara", period: "2022 – Sekarang", desc: "Merancang antarmuka untuk aplikasi mobile dan web. Bekerja erat dengan tim produk dan engineering." },
  { role: "Junior UI/UX Designer", company: "Startup Kreatif", period: "2021 – 2022", desc: "Membuat wireframe, prototype, dan desain visual untuk berbagai produk digital." },
];

const educations = [
  { degree: "S1 Desain Komunikasi Visual", institution: "Universitas Bina Nusantara", year: "2016 – 2020", gpa: "3.72" },
];

const skills = [
  { name: "Figma", level: 70 },
  { name: "Adobe XD", level: 80 },
  { name: "Prototyping", level: 85 },
  { name: "Design Systems", level: 80 },
  { name: "User Research", level: 65 },
  { name: "Typography", level: 90 },
  { name: "React / Next.js", level: 45 },
  { name: "Accessibility", level: 50 },
];

const portfolio = [
  { title: "Redesign Aplikasi Mobile Banking", type: "UI Design", year: "2023", color: "#1677FF" },
  { title: "Design System untuk Fintech", type: "Design System", year: "2022", color: "#4DB8FF" },
  { title: "Landing Page E-Commerce", type: "Web Design", year: "2022", color: "#10d98e" },
];

function SectionCard({
  title,
  sectionKey,
  editingSection,
  onEditStart,
  onEditSave,
  children,
}: {
  title: string;
  sectionKey: string;
  editingSection: string | null;
  onEditStart: (key: string) => void;
  onEditSave: () => void;
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
          <button
            onClick={onEditSave}
            style={{
              display: "flex", alignItems: "center", gap: 5,
              fontFamily: "'Inter', sans-serif", fontSize: 12, fontWeight: 600,
              padding: "6px 14px", borderRadius: 8, border: "none",
              background: "linear-gradient(135deg, #1677FF, #4DB8FF)",
              color: "#fff", cursor: "pointer",
            }}
          >
            Simpan Perubahan
          </button>
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

export default function CandidateSelfProfilePage() {
  const [activeTab, setActiveTab] = useState("profil");
  const [editingSection, setEditingSection] = useState<string | null>(null);
  const [showCvUpload, setShowCvUpload] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleEditSave = () => {
    toast.success("Profil berhasil diperbarui!");
    setEditingSection(null);
  };

  const handleCvFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setTimeout(() => {
        toast.success("CV berhasil diunggah!");
        setShowCvUpload(false);
      }, 600);
    }
  };

  const card: React.CSSProperties = {
    background: "#fff",
    borderRadius: 16,
    padding: "24px",
    boxShadow: "0 2px 12px rgba(10,27,61,0.07)",
    border: "1px solid rgba(22,119,255,0.08)",
  };

  return (
    <DashboardLayout
      sidebarItems={sidebarItems}
      userName="Budi Santoso"
      userRole="Kandidat"
      userInitial="B"
    >
      {/* Header */}
      <div style={{ marginBottom: 24, display: "flex", alignItems: "flex-start", justifyContent: "space-between" }}>
        <div>
          <h1 style={{ fontFamily: "'Poppins', sans-serif", fontSize: 24, fontWeight: 700, color: "#0A1B3D", margin: 0 }}>
            Profil Saya
          </h1>
          <p style={{ fontFamily: "'Inter', sans-serif", fontSize: 14, color: "#6a88b8", marginTop: 6 }}>
            Kelola informasi profil dan resume Anda.
          </p>
        </div>
        <button
          onClick={() => toast.success("CV Anda sedang diunduh...")}
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

      {/* Profile completion bar */}
      <div style={{ ...card, marginBottom: 24, padding: "16px 22px" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 10 }}>
          <div>
            <span style={{ fontFamily: "'Poppins', sans-serif", fontSize: 13, fontWeight: 700, color: "#0A1B3D" }}>Kelengkapan Profil </span>
            <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 13, fontWeight: 800, color: "#1677FF" }}>{candidate.completion}%</span>
          </div>
          <span style={{ fontFamily: "'Inter', sans-serif", fontSize: 12, color: "#6a88b8" }}>Lengkapi profil untuk meningkatkan visibilitas</span>
        </div>
        <div style={{ position: "relative", height: 10, background: "#eef4ff", borderRadius: 99 }}>
          <div style={{
            position: "absolute", left: 0, top: 0, height: "100%",
            width: `${candidate.completion}%`, borderRadius: 99,
            background: "linear-gradient(90deg, #1677FF, #4DB8FF)",
          }} />
        </div>
        <div style={{ display: "flex", gap: 16, marginTop: 12 }}>
          {["Foto profil", "Pendidikan", "Pengalaman", "Skill", "Portfolio"].map((item, i) => {
            const done = i < 3;
            return (
              <div key={item} style={{ display: "flex", alignItems: "center", gap: 4 }}>
                <CheckCircle size={12} color={done ? "#10d98e" : "#d0dff2"} />
                <span style={{ fontFamily: "'Inter', sans-serif", fontSize: 11, color: done ? "#10d98e" : "#b0c4de" }}>{item}</span>
              </div>
            );
          })}
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
            B
          </div>

          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontFamily: "'Poppins', sans-serif", fontSize: 22, fontWeight: 800, color: "#0A1B3D" }}>{candidate.name}</div>
            <div style={{ fontFamily: "'Inter', sans-serif", fontSize: 14, color: "#1677FF", fontWeight: 600, marginTop: 2 }}>
              {candidate.title} · {candidate.experience}
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 4, marginTop: 6, fontFamily: "'Inter', sans-serif", fontSize: 13, color: "#6a88b8" }}>
              <MapPin size={13} /> {candidate.location}
            </div>
            <div style={{ marginTop: 10, fontFamily: "'Inter', sans-serif", fontSize: 13, color: "#4a6080", lineHeight: 1.6, maxWidth: 600 }}>
              {candidate.bio}
            </div>
          </div>
        </div>

        {/* Upload CV Baru */}
        <div style={{ marginTop: 20, borderTop: "1px solid #f0f7ff", paddingTop: 16 }}>
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
              onClick={() => fileInputRef.current?.click()}
              style={{
                border: "2px dashed rgba(22,119,255,0.3)", borderRadius: 12,
                padding: "24px", textAlign: "center", cursor: "pointer",
                background: "#f8fbff", transition: "background 0.15s",
              }}
            >
              <UploadCloud size={32} color="#1677FF" style={{ marginBottom: 8 }} />
              <div style={{ fontFamily: "'Inter', sans-serif", fontSize: 13, color: "#0A1B3D", fontWeight: 600 }}>
                Seret file ke sini atau klik untuk unggah
              </div>
              <div style={{ fontFamily: "'Inter', sans-serif", fontSize: 11, color: "#6a88b8", marginTop: 4 }}>
                PDF, DOC, DOCX maks. 5MB
              </div>
              <input
                ref={fileInputRef}
                type="file"
                accept=".pdf,.doc,.docx"
                style={{ display: "none" }}
                onChange={handleCvFileChange}
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

      {/* Tab content */}
      {activeTab === "profil" && (
        <>
          {/* Informasi Pribadi */}
          <SectionCard
            title="Informasi Pribadi"
            sectionKey="informasi"
            editingSection={editingSection}
            onEditStart={setEditingSection}
            onEditSave={handleEditSave}
          >
            <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              <InfoRow icon={<User size={14} color="#1677FF" />} label="Nama Lengkap" value={candidate.name} />
              <InfoRow icon={<Mail size={14} color="#1677FF" />} label="Email" value={candidate.email} />
              <InfoRow icon={<Phone size={14} color="#1677FF" />} label="Telepon" value={candidate.phone} />
              <InfoRow icon={<MapPin size={14} color="#1677FF" />} label="Lokasi" value={candidate.location} />
              <InfoRow icon={<Calendar size={14} color="#1677FF" />} label="Tanggal Lahir" value={candidate.birthdate} />
            </div>
          </SectionCard>

          {/* Ringkasan Profil */}
          <SectionCard
            title="Ringkasan Profil"
            sectionKey="ringkasan"
            editingSection={editingSection}
            onEditStart={setEditingSection}
            onEditSave={handleEditSave}
          >
            <div style={{
              fontFamily: "'Inter', sans-serif", fontSize: 14, color: "#4a6080", lineHeight: 1.7,
              padding: "14px 16px", borderRadius: 10, background: "#f8fbff", border: "1px solid rgba(22,119,255,0.08)",
            }}>
              {candidate.bio}
            </div>
          </SectionCard>

          {/* Preferensi Kerja */}
          <SectionCard
            title="Preferensi Kerja"
            sectionKey="preferensi"
            editingSection={editingSection}
            onEditStart={setEditingSection}
            onEditSave={handleEditSave}
          >
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
              {[
                { label: "Tipe Kerja", value: candidate.workType, color: "#1677FF" },
                { label: "Lokasi Preferensi", value: candidate.preferredLocation, color: "#4DB8FF" },
                { label: "Ekspektasi Gaji", value: `Rp ${candidate.salaryRange}`, color: "#10d98e" },
                { label: "Status Relokasi", value: candidate.relocation, color: "#ff9a3c" },
              ].map((pref) => (
                <div key={pref.label} style={{ padding: "14px 16px", borderRadius: 12, background: "#f8fbff", border: "1px solid rgba(22,119,255,0.08)" }}>
                  <div style={{ fontFamily: "'Inter', sans-serif", fontSize: 11, color: "#6a88b8", marginBottom: 4 }}>{pref.label}</div>
                  <div style={{ fontFamily: "'Poppins', sans-serif", fontSize: 13, fontWeight: 700, color: pref.color }}>{pref.value}</div>
                </div>
              ))}
            </div>
          </SectionCard>
        </>
      )}

      {activeTab === "pengalaman" && (
        <SectionCard
          title="Pengalaman Kerja"
          sectionKey="pengalaman"
          editingSection={editingSection}
          onEditStart={setEditingSection}
          onEditSave={handleEditSave}
        >
          <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>
            {experiences.map((exp, i) => (
              <div key={i} style={{ display: "flex", gap: 16, paddingBottom: 20, borderBottom: i < experiences.length - 1 ? "1px solid #f0f7ff" : "none", marginBottom: i < experiences.length - 1 ? 20 : 0 }}>
                <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 0 }}>
                  <div style={{ width: 40, height: 40, borderRadius: 12, background: "linear-gradient(135deg, #eef4ff, #dbeeff)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                    <Briefcase size={18} color="#1677FF" />
                  </div>
                  {i < experiences.length - 1 && <div style={{ flex: 1, width: 2, background: "#eef4ff", marginTop: 8 }} />}
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontFamily: "'Poppins', sans-serif", fontSize: 14, fontWeight: 700, color: "#0A1B3D" }}>{exp.role}</div>
                  <div style={{ fontFamily: "'Inter', sans-serif", fontSize: 13, color: "#1677FF", fontWeight: 600, marginTop: 2 }}>{exp.company}</div>
                  <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11, color: "#6a88b8", marginTop: 4 }}>{exp.period}</div>
                  <div style={{ fontFamily: "'Inter', sans-serif", fontSize: 13, color: "#4a6080", marginTop: 8, lineHeight: 1.6 }}>{exp.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </SectionCard>
      )}

      {activeTab === "pendidikan" && (
        <SectionCard
          title="Pendidikan"
          sectionKey="pendidikan"
          editingSection={editingSection}
          onEditStart={setEditingSection}
          onEditSave={handleEditSave}
        >
          {educations.map((edu, i) => (
            <div key={i} style={{ display: "flex", gap: 16 }}>
              <div style={{ width: 44, height: 44, borderRadius: 12, background: "linear-gradient(135deg, #eef4ff, #dbeeff)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                <GraduationCap size={20} color="#1677FF" />
              </div>
              <div>
                <div style={{ fontFamily: "'Poppins', sans-serif", fontSize: 14, fontWeight: 700, color: "#0A1B3D" }}>{edu.degree}</div>
                <div style={{ fontFamily: "'Inter', sans-serif", fontSize: 13, color: "#1677FF", fontWeight: 600, marginTop: 2 }}>{edu.institution}</div>
                <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11, color: "#6a88b8", marginTop: 4 }}>{edu.year}</div>
                <div style={{ fontFamily: "'Inter', sans-serif", fontSize: 12, color: "#10d98e", marginTop: 6, fontWeight: 600 }}>IPK: {edu.gpa}</div>
              </div>
            </div>
          ))}
        </SectionCard>
      )}

      {activeTab === "skill" && (
        <SectionCard
          title="Skill"
          sectionKey="skill"
          editingSection={editingSection}
          onEditStart={setEditingSection}
          onEditSave={handleEditSave}
        >
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
            {skills.map((skill) => {
              const color = skill.level >= 80 ? "#10d98e" : skill.level >= 60 ? "#1677FF" : "#ff9a3c";
              return (
                <div key={skill.name}>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
                    <span style={{ fontFamily: "'Inter', sans-serif", fontSize: 13, fontWeight: 600, color: "#0A1B3D" }}>{skill.name}</span>
                    <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 12, fontWeight: 700, color }}>{skill.level}%</span>
                  </div>
                  <div style={{ position: "relative", height: 7, background: "#eef4ff", borderRadius: 99 }}>
                    <div style={{ position: "absolute", left: 0, top: 0, height: "100%", width: `${skill.level}%`, borderRadius: 99, background: `linear-gradient(90deg, ${color}88, ${color})` }} />
                  </div>
                </div>
              );
            })}
          </div>
        </SectionCard>
      )}

      {activeTab === "portfolio" && (
        <SectionCard
          title="Portfolio"
          sectionKey="portfolio"
          editingSection={editingSection}
          onEditStart={setEditingSection}
          onEditSave={handleEditSave}
        >
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))", gap: 16 }}>
            {portfolio.map((item) => (
              <div key={item.title} style={{
                borderRadius: 14, overflow: "hidden",
                border: "1px solid rgba(22,119,255,0.1)",
              }}>
                <div style={{ height: 120, background: `linear-gradient(135deg, ${item.color}22, ${item.color}08)`, display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <FolderOpen size={36} color={item.color} />
                </div>
                <div style={{ padding: "14px 16px" }}>
                  <div style={{ fontFamily: "'Poppins', sans-serif", fontSize: 13, fontWeight: 700, color: "#0A1B3D", marginBottom: 4 }}>{item.title}</div>
                  <div style={{ display: "flex", justifyContent: "space-between" }}>
                    <span style={{ fontFamily: "'Inter', sans-serif", fontSize: 11, padding: "2px 8px", borderRadius: 99, background: `${item.color}18`, color: item.color }}>
                      {item.type}
                    </span>
                    <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11, color: "#6a88b8" }}>{item.year}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </SectionCard>
      )}
    </DashboardLayout>
  );
}
