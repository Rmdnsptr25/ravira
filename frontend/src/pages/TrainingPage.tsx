import { useState } from "react";
import { useNavigate } from "react-router";
import { Home, Briefcase, Bookmark, BarChart2, BookOpen, FileText, Globe, User, Settings, Award, Clock, ChevronRight, Play } from "lucide-react";
import { DashboardLayout } from "../components/DashboardLayout";
import type { SidebarItem } from "../components/DashboardLayout";

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

type TrainingStatus = "Sedang Berjalan" | "Belum Dimulai" | "Selesai";

interface Training {
  id: number;
  title: string;
  platform: string;
  duration: string;
  level: "Beginner" | "Intermediate" | "Advanced";
  progress: number;
  status: TrainingStatus;
  skills: string[];
  color: string;
}

const trainings: Training[] = [
  {
    id: 1,
    title: "UX Research Fundamentals",
    platform: "Coursera",
    duration: "4 minggu",
    level: "Intermediate",
    progress: 72,
    status: "Sedang Berjalan",
    skills: ["User Research", "Usability Testing", "Qualitative Analysis"],
    color: "#1677FF",
  },
  {
    id: 2,
    title: "Advanced Figma Prototyping",
    platform: "Udemy",
    duration: "3 minggu",
    level: "Advanced",
    progress: 45,
    status: "Sedang Berjalan",
    skills: ["Figma Advanced", "Prototyping", "Animation"],
    color: "#4DB8FF",
  },
  {
    id: 3,
    title: "Design System Mastery",
    platform: "Google",
    duration: "2 minggu",
    level: "Advanced",
    progress: 20,
    status: "Sedang Berjalan",
    skills: ["Design Systems", "Component Library", "Tokens"],
    color: "#ff9a3c",
  },
  {
    id: 4,
    title: "Usability Testing Methods",
    platform: "Nielsen Norman",
    duration: "2 minggu",
    level: "Intermediate",
    progress: 0,
    status: "Belum Dimulai",
    skills: ["Usability Testing", "User Research", "Testing Protocol"],
    color: "#1677FF",
  },
  {
    id: 5,
    title: "React for Designers",
    platform: "Udemy",
    duration: "6 minggu",
    level: "Intermediate",
    progress: 0,
    status: "Belum Dimulai",
    skills: ["React / Next.js", "Component Design", "CSS-in-JS"],
    color: "#4DB8FF",
  },
  {
    id: 6,
    title: "Accessibility in Design",
    platform: "edX",
    duration: "3 minggu",
    level: "Beginner",
    progress: 100,
    status: "Selesai",
    skills: ["Accessibility", "WCAG", "Inclusive Design"],
    color: "#10d98e",
  },
];

const tabs: Array<{ key: string; label: string }> = [
  { key: "Semua", label: "Semua" },
  { key: "Sedang Berjalan", label: "Sedang Berjalan" },
  { key: "Belum Dimulai", label: "Belum Dimulai" },
  { key: "Selesai", label: "Selesai" },
];

const levelColor: Record<string, string> = {
  Beginner: "#10d98e",
  Intermediate: "#1677FF",
  Advanced: "#ff9a3c",
};

const statusBadge: Record<TrainingStatus, { bg: string; color: string }> = {
  "Sedang Berjalan": { bg: "rgba(22,119,255,0.1)", color: "#1677FF" },
  "Belum Dimulai": { bg: "rgba(106,136,184,0.12)", color: "#6a88b8" },
  "Selesai": { bg: "rgba(16,217,142,0.12)", color: "#10d98e" },
};

export default function TrainingPage() {
  const navigate = useNavigate();
  const [activeFilter, setActiveFilter] = useState<string>("Semua");

  const filtered = activeFilter === "Semua" ? trainings : trainings.filter((t) => t.status === activeFilter);

  const card: React.CSSProperties = {
    background: "#fff",
    borderRadius: 16,
    padding: "24px",
    boxShadow: "0 2px 12px rgba(10,27,61,0.07)",
    border: "1px solid rgba(22,119,255,0.08)",
  };

  const counts = {
    "Semua": trainings.length,
    "Sedang Berjalan": trainings.filter((t) => t.status === "Sedang Berjalan").length,
    "Belum Dimulai": trainings.filter((t) => t.status === "Belum Dimulai").length,
    "Selesai": trainings.filter((t) => t.status === "Selesai").length,
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
          Rekomendasi Pelatihan
        </h1>
        <p style={{ fontFamily: "'Inter', sans-serif", fontSize: 14, color: "#6a88b8", marginTop: 6 }}>
          Kursus yang dipilih AI berdasarkan skill gap dan target karier Anda.
        </p>
      </div>

      {/* Stats row */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 16, marginBottom: 24 }}>
        {[
          { label: "Total Kursus", value: trainings.length, color: "#1677FF" },
          { label: "Sedang Berjalan", value: counts["Sedang Berjalan"], color: "#1677FF" },
          { label: "Belum Dimulai", value: counts["Belum Dimulai"], color: "#6a88b8" },
          { label: "Selesai", value: counts["Selesai"], color: "#10d98e" },
        ].map((stat) => (
          <div key={stat.label} style={{ ...card, padding: "16px 20px" }}>
            <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 28, fontWeight: 800, color: stat.color }}>{stat.value}</div>
            <div style={{ fontFamily: "'Inter', sans-serif", fontSize: 12, color: "#6a88b8", marginTop: 2 }}>{stat.label}</div>
          </div>
        ))}
      </div>

      {/* Filter tabs */}
      <div style={{ display: "flex", gap: 8, marginBottom: 24 }}>
        {tabs.map((tab) => {
          const isActive = activeFilter === tab.key;
          return (
            <button
              key={tab.key}
              onClick={() => setActiveFilter(tab.key)}
              style={{
                fontFamily: "'Inter', sans-serif",
                fontSize: 13,
                fontWeight: isActive ? 600 : 400,
                padding: "8px 18px",
                borderRadius: 10,
                border: isActive ? "1.5px solid #1677FF" : "1.5px solid rgba(22,119,255,0.15)",
                background: isActive ? "#1677FF" : "#fff",
                color: isActive ? "#fff" : "#6a88b8",
                cursor: "pointer",
                transition: "all 0.15s",
              }}
            >
              {tab.label}
              <span style={{
                marginLeft: 6,
                fontFamily: "'JetBrains Mono', monospace",
                fontSize: 11,
                padding: "1px 6px",
                borderRadius: 99,
                background: isActive ? "rgba(255,255,255,0.2)" : "rgba(22,119,255,0.1)",
                color: isActive ? "#fff" : "#1677FF",
              }}>
                {counts[tab.key as keyof typeof counts] ?? trainings.length}
              </span>
            </button>
          );
        })}
      </div>

      {/* Training cards grid */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(340px, 1fr))", gap: 20 }}>
        {filtered.map((training) => {
          const badge = statusBadge[training.status];
          const isCompleted = training.status === "Selesai";
          const isNotStarted = training.status === "Belum Dimulai";

          return (
            <div
              key={training.id}
              style={{
                ...card,
                display: "flex",
                flexDirection: "column",
                gap: 0,
                padding: 0,
                overflow: "hidden",
              }}
            >
              {/* Color accent bar */}
              <div style={{ height: 4, background: `linear-gradient(90deg, ${training.color}, ${training.color}88)` }} />

              <div style={{ padding: "20px 20px 18px" }}>
                {/* Top row */}
                <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 12 }}>
                  <div style={{ flex: 1, minWidth: 0, paddingRight: 12 }}>
                    <div style={{ fontFamily: "'Poppins', sans-serif", fontSize: 15, fontWeight: 700, color: "#0A1B3D", marginBottom: 3 }}>
                      {training.title}
                    </div>
                    <div style={{ fontFamily: "'Inter', sans-serif", fontSize: 12, color: "#6a88b8" }}>
                      {training.platform}
                    </div>
                  </div>
                  <span style={{
                    fontFamily: "'Inter', sans-serif", fontSize: 11, fontWeight: 600,
                    padding: "4px 10px", borderRadius: 99,
                    background: badge.bg, color: badge.color,
                    whiteSpace: "nowrap", flexShrink: 0,
                  }}>
                    {training.status}
                  </span>
                </div>

                {/* Meta info */}
                <div style={{ display: "flex", gap: 8, marginBottom: 14, flexWrap: "wrap" }}>
                  <span style={{ display: "flex", alignItems: "center", gap: 4, fontFamily: "'Inter', sans-serif", fontSize: 11, color: "#6a88b8" }}>
                    <Clock size={11} /> {training.duration}
                  </span>
                  <span style={{
                    fontFamily: "'Inter', sans-serif", fontSize: 11, fontWeight: 600,
                    padding: "2px 8px", borderRadius: 99,
                    background: `${levelColor[training.level]}18`,
                    color: levelColor[training.level],
                  }}>
                    {training.level}
                  </span>
                </div>

                {/* Progress bar */}
                <div style={{ marginBottom: 6 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
                    <span style={{ fontFamily: "'Inter', sans-serif", fontSize: 12, color: "#6a88b8" }}>Progress</span>
                    <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 12, fontWeight: 700, color: isCompleted ? "#10d98e" : "#1677FF" }}>
                      {training.progress}%
                    </span>
                  </div>
                  <div style={{ position: "relative", height: 7, background: "#eef4ff", borderRadius: 99 }}>
                    <div style={{
                      position: "absolute", left: 0, top: 0, height: "100%",
                      width: `${training.progress}%`, borderRadius: 99,
                      background: isCompleted
                        ? "linear-gradient(90deg, #10d98e, #38f9b2)"
                        : `linear-gradient(90deg, ${training.color}, ${training.color}bb)`,
                    }} />
                  </div>
                </div>

                {/* Skills covered */}
                <div style={{ marginTop: 14, marginBottom: 16 }}>
                  <div style={{ fontFamily: "'Inter', sans-serif", fontSize: 11, color: "#6a88b8", marginBottom: 6 }}>Skill yang dicakup:</div>
                  <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                    {training.skills.map((s) => (
                      <span key={s} style={{
                        fontFamily: "'Inter', sans-serif", fontSize: 11,
                        padding: "2px 9px", borderRadius: 99,
                        background: "#f0f7ff", color: "#1677FF",
                        border: "1px solid rgba(22,119,255,0.15)",
                      }}>
                        {s}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Buttons */}
                <div style={{ display: "flex", gap: 8 }}>
                  <button
                    onClick={() => navigate("/dashboard/kandidat/detail-kursus")}
                    style={{
                      flex: 1,
                      display: "flex", alignItems: "center", justifyContent: "center", gap: 6,
                      fontFamily: "'Inter', sans-serif", fontSize: 13, fontWeight: 600,
                      padding: "9px 0", borderRadius: 10, border: "none", cursor: "pointer",
                      background: isCompleted
                        ? "linear-gradient(135deg, #10d98e, #38f9b2)"
                        : "linear-gradient(135deg, #1677FF, #4DB8FF)",
                      color: "#fff",
                    }}
                  >
                    {isCompleted ? <Award size={14} /> : <Play size={14} />}
                    {isCompleted ? "Lihat Sertifikat" : isNotStarted ? "Mulai Belajar" : "Lanjut Belajar"}
                  </button>
                  <button
                    onClick={() => navigate("/dashboard/kandidat/detail-kursus")}
                    style={{
                      display: "flex", alignItems: "center", justifyContent: "center", gap: 4,
                      fontFamily: "'Inter', sans-serif", fontSize: 13, fontWeight: 600,
                      padding: "9px 14px", borderRadius: 10,
                      border: "1.5px solid rgba(22,119,255,0.2)",
                      background: "#fff", color: "#1677FF", cursor: "pointer",
                    }}
                  >
                    Detail <ChevronRight size={13} />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </DashboardLayout>
  );
}
