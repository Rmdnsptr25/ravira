import { useState } from "react";
import { useNavigate } from "react-router";
import { Home, Briefcase, Bookmark, BarChart2, BookOpen, FileText, Globe, User, Settings, TrendingUp, AlertCircle, CheckCircle } from "lucide-react";
import { DashboardLayout, SidebarItem } from "../components/DashboardLayout";
import { ChangeCareerTargetModal } from "../components/Modals";

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

const skills = [
  { name: "Figma Advanced", current: 70, target: 100, gap: 30, status: "Perlu Ditingkatkan" },
  { name: "React / Next.js", current: 45, target: 100, gap: 55, status: "Perlu Ditingkatkan" },
  { name: "Design Systems", current: 80, target: 100, gap: 20, status: "Perlu Ditingkatkan" },
  { name: "User Research", current: 65, target: 100, gap: 35, status: "Perlu Ditingkatkan" },
  { name: "Usability Testing", current: 55, target: 100, gap: 45, status: "Perlu Ditingkatkan" },
  { name: "Prototyping", current: 85, target: 100, gap: 15, status: "Sudah Baik" },
  { name: "Typography", current: 90, target: 100, gap: 10, status: "Sudah Baik" },
  { name: "Accessibility", current: 50, target: 100, gap: 50, status: "Perlu Ditingkatkan" },
];

const trainingRecs = [
  {
    title: "Advanced Figma Prototyping",
    platform: "Udemy",
    duration: "3 minggu",
    level: "Advanced",
    skill: "Figma Advanced",
    color: "#1677FF",
  },
  {
    title: "React for Designers",
    platform: "Udemy",
    duration: "6 minggu",
    level: "Intermediate",
    skill: "React / Next.js",
    color: "#4DB8FF",
  },
  {
    title: "Accessibility in Design",
    platform: "edX",
    duration: "3 minggu",
    level: "Beginner",
    skill: "Accessibility",
    color: "#10d98e",
  },
];

export default function SkillGapPage() {
  const navigate = useNavigate();
  const [showCareerModal, setShowCareerModal] = useState(false);
  const [expandedSkill, setExpandedSkill] = useState<string | null>(null);

  const skillTrainingMap: Record<string, string> = {
    "Figma Advanced": "Advanced Figma Prototyping",
    "React / Next.js": "React for Designers",
    "Design Systems": "Design System Mastery",
    "User Research": "UX Research Fundamentals",
    "Usability Testing": "Usability Testing Methods",
    "Accessibility": "Accessibility in Design",
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
      <div style={{ marginBottom: 28 }}>
        <h1 style={{ fontFamily: "'Poppins', sans-serif", fontSize: 24, fontWeight: 700, color: "#0A1B3D", margin: 0 }}>
          Skill Gap Analysis
        </h1>
        <p style={{ fontFamily: "'Inter', sans-serif", fontSize: 14, color: "#6a88b8", marginTop: 6 }}>
          Identifikasi skill yang perlu ditingkatkan berdasarkan target karier Anda.
        </p>
      </div>

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
              <div style={{ fontFamily: "'Inter', sans-serif", fontSize: 12, color: "#6a88b8" }}>Terhadap target posisi</div>
            </div>
          </div>
          <div style={{ display: "flex", alignItems: "flex-end", gap: 8 }}>
            <span style={{ fontFamily: "'Poppins', sans-serif", fontSize: 48, fontWeight: 800, color: "#1677FF", lineHeight: 1 }}>78</span>
            <span style={{ fontFamily: "'Poppins', sans-serif", fontSize: 24, fontWeight: 700, color: "#4DB8FF", marginBottom: 4 }}>%</span>
            <span style={{ fontFamily: "'Inter', sans-serif", fontSize: 13, color: "#6a88b8", marginBottom: 6, marginLeft: 4 }}>/ 100%</span>
          </div>
          <div style={{ position: "relative", height: 10, background: "#eef4ff", borderRadius: 99 }}>
            <div style={{ position: "absolute", left: 0, top: 0, height: "100%", width: "78%", borderRadius: 99, background: "linear-gradient(90deg, #1677FF, #4DB8FF)" }} />
          </div>
          <div style={{ fontFamily: "'Inter', sans-serif", fontSize: 12, color: "#10d98e" }}>
            Tingkatkan 6 skill untuk mencapai 100% match
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
              <div style={{ fontFamily: "'Poppins', sans-serif", fontSize: 18, fontWeight: 700, color: "#0A1B3D" }}>Senior UX Designer</div>
              <div style={{ fontFamily: "'Inter', sans-serif", fontSize: 13, color: "#6a88b8", marginTop: 2 }}>Level: Senior · Industri: Tech / Product</div>
            </div>
          </div>
          <div style={{ display: "flex", gap: 8, marginTop: 4 }}>
            {["Figma", "UX Research", "Design System"].map((tag) => (
              <span key={tag} style={{ fontFamily: "'Inter', sans-serif", fontSize: 11, padding: "3px 10px", borderRadius: 99, background: "#f0f7ff", color: "#1677FF", border: "1px solid rgba(22,119,255,0.18)" }}>
                {tag}
              </span>
            ))}
          </div>
          <div style={{ marginTop: "auto", padding: "10px 14px", borderRadius: 10, background: "#f0f7ff", fontFamily: "'Inter', sans-serif", fontSize: 12, color: "#3a5480" }}>
            <span style={{ fontWeight: 600, color: "#0A1B3D" }}>6 skill</span> perlu ditingkatkan · <span style={{ fontWeight: 600, color: "#0A1B3D" }}>2 skill</span> sudah memenuhi target
          </div>
        </div>
      </div>

      {/* Skill Items Grid */}
      <div style={{ ...card, marginBottom: 28 }}>
        <div style={{ fontFamily: "'Poppins', sans-serif", fontSize: 16, fontWeight: 700, color: "#0A1B3D", marginBottom: 20 }}>
          Detail Skill Gap
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))", gap: 16 }}>
          {skills.map((skill) => {
            const isBad = skill.status === "Perlu Ditingkatkan";
            const barColor = skill.current >= 80 ? "#10d98e" : skill.current >= 60 ? "#1677FF" : "#ff9a3c";
            const isExpanded = expandedSkill === skill.name;
            const recommendedCourse = skillTrainingMap[skill.name];
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
                    Gap: {skill.gap}% perlu ditingkatkan
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
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 12 }}>
                      <div>
                        <div style={{ fontFamily: "'Inter', sans-serif", fontSize: 10, color: "#9ab4cc", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 3 }}>Level Saat Ini</div>
                        <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 14, fontWeight: 700, color: barColor }}>{skill.current}%</div>
                      </div>
                      <div>
                        <div style={{ fontFamily: "'Inter', sans-serif", fontSize: 10, color: "#9ab4cc", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 3 }}>Target Level</div>
                        <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 14, fontWeight: 700, color: "#1677FF" }}>{skill.target}%</div>
                      </div>
                    </div>
                    {recommendedCourse && (
                      <div>
                        <div style={{ fontFamily: "'Inter', sans-serif", fontSize: 10, color: "#9ab4cc", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 6 }}>Kursus Rekomendasi</div>
                        <div style={{ fontFamily: "'Inter', sans-serif", fontSize: 13, fontWeight: 600, color: "#0A1B3D", marginBottom: 8 }}>{recommendedCourse}</div>
                        <button
                          onClick={() => navigate("/dashboard/kandidat/pelatihan")}
                          style={{
                            fontFamily: "'Inter', sans-serif", fontSize: 12, fontWeight: 600,
                            padding: "7px 14px", borderRadius: 8, border: "none",
                            background: "linear-gradient(135deg, #1677FF, #4DB8FF)", color: "#fff", cursor: "pointer",
                          }}
                        >
                          Lihat Pelatihan
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Rekomendasi Pelatihan */}
      <div style={{ ...card }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20 }}>
          <div>
            <div style={{ fontFamily: "'Poppins', sans-serif", fontSize: 16, fontWeight: 700, color: "#0A1B3D" }}>Rekomendasi Pelatihan</div>
            <div style={{ fontFamily: "'Inter', sans-serif", fontSize: 13, color: "#6a88b8", marginTop: 2 }}>Dipilih AI berdasarkan skill gap Anda</div>
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
          {trainingRecs.map((rec) => (
            <div
              key={rec.title}
              style={{ padding: "18px", borderRadius: 14, border: "1px solid rgba(22,119,255,0.1)", background: "#f8fbff" }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12 }}>
                <div style={{ width: 40, height: 40, borderRadius: 10, background: `${rec.color}18`, display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <BookOpen size={18} color={rec.color} />
                </div>
                <div>
                  <div style={{ fontFamily: "'Poppins', sans-serif", fontSize: 13, fontWeight: 700, color: "#0A1B3D" }}>{rec.title}</div>
                  <div style={{ fontFamily: "'Inter', sans-serif", fontSize: 11, color: "#6a88b8" }}>{rec.platform}</div>
                </div>
              </div>

              <div style={{ display: "flex", gap: 8, marginBottom: 12 }}>
                <span style={{ fontFamily: "'Inter', sans-serif", fontSize: 11, padding: "3px 9px", borderRadius: 99, background: "#eef4ff", color: "#1677FF" }}>{rec.duration}</span>
                <span style={{ fontFamily: "'Inter', sans-serif", fontSize: 11, padding: "3px 9px", borderRadius: 99, background: "#eef4ff", color: "#1677FF" }}>{rec.level}</span>
              </div>

              <div style={{ fontFamily: "'Inter', sans-serif", fontSize: 11, color: "#6a88b8", marginBottom: 14 }}>
                Mengatasi gap: <span style={{ fontWeight: 600, color: "#0A1B3D" }}>{rec.skill}</span>
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
      {showCareerModal && <ChangeCareerTargetModal onClose={() => setShowCareerModal(false)} />}
    </DashboardLayout>
  );
}
