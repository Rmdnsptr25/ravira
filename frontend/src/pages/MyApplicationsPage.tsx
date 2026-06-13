import { useState } from "react";
import { useNavigate } from "react-router";
import {
  Home, Briefcase, Bookmark, BarChart2, BookOpen,
  FileText, Globe, User, Settings,
  MapPin, Calendar, ChevronRight, CheckCircle, Circle,
} from "lucide-react";
import { DashboardLayout } from "../components/DashboardLayout";
import type { SidebarItem } from "../components/DashboardLayout";
import { useAppContext } from "../contexts/AppContext";
import type { AppStatus } from "../contexts/AppContext";

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

const tabs: Array<AppStatus | "Semua"> = ["Semua", "Dikirim", "Screening", "Interview", "Offer", "Diterima", "Ditolak"];

const timelineSteps = ["Dikirim", "Screening", "Interview", "Offer", "Diterima"];

const statusOrder: Record<AppStatus, number> = {
  Dikirim: 0,
  Screening: 1,
  Interview: 2,
  Offer: 3,
  Diterima: 4,
  Ditolak: -1,
};

function getStatusStyle(status: AppStatus): { background: string; color: string; border: string } {
  switch (status) {
    case "Dikirim":
      return { background: "rgba(22,119,255,0.1)", color: "#1677FF", border: "1px solid rgba(22,119,255,0.25)" };
    case "Screening":
      return { background: "rgba(255,154,60,0.12)", color: "#ff9a3c", border: "1px solid rgba(255,154,60,0.3)" };
    case "Interview":
      return { background: "rgba(124,58,237,0.1)", color: "#7c3aed", border: "1px solid rgba(124,58,237,0.25)" };
    case "Offer":
      return { background: "rgba(16,217,142,0.1)", color: "#10d98e", border: "1px solid rgba(16,217,142,0.3)" };
    case "Diterima":
      return { background: "rgba(16,217,142,0.15)", color: "#059669", border: "1px solid rgba(16,217,142,0.4)" };
    case "Ditolak":
      return { background: "rgba(255,107,107,0.1)", color: "#ff6b6b", border: "1px solid rgba(255,107,107,0.25)" };
  }
}

export default function MyApplicationsPage() {
  const navigate = useNavigate();
  const { applications } = useAppContext();
  const [activeTab, setActiveTab] = useState<AppStatus | "Semua">("Semua");

  const filtered = activeTab === "Semua"
    ? applications
    : applications.filter((a) => a.status === activeTab);

  return (
    <DashboardLayout
      sidebarItems={sidebarItems}
      userName="Budi Santoso"
      userRole="Kandidat"
      userInitial="B"
    >
      {/* Header */}
      <div style={{ marginBottom: 24 }}>
        <h1 style={{
          fontFamily: "'Poppins', sans-serif",
          fontSize: 24,
          fontWeight: 800,
          color: "#0A1B3D",
          letterSpacing: "-0.5px",
          marginBottom: 6,
        }}>
          Lamaran Saya
        </h1>
        <p style={{ fontFamily: "'Inter', sans-serif", fontSize: 14, color: "#6a88b8" }}>
          Pantau status semua lamaran kerja Anda dalam satu tempat.
        </p>
      </div>

      {/* Tab bar */}
      <div style={{
        display: "flex",
        gap: 6,
        marginBottom: 24,
        background: "#fff",
        borderRadius: 14,
        padding: "6px",
        border: "1px solid rgba(22,119,255,0.1)",
        boxShadow: "0 2px 8px rgba(10,27,61,0.04)",
        flexWrap: "wrap",
      }}>
        {tabs.map((tab) => {
          const isActive = activeTab === tab;
          const count = tab === "Semua" ? applications.length : applications.filter((a) => a.status === tab).length;
          return (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              style={{
                padding: "8px 16px",
                borderRadius: 10,
                border: "none",
                cursor: "pointer",
                fontFamily: "'Inter', sans-serif",
                fontSize: 13,
                fontWeight: isActive ? 700 : 500,
                color: isActive ? "#fff" : "#6a88b8",
                background: isActive
                  ? "linear-gradient(135deg, #1677FF, #0D47A1)"
                  : "transparent",
                boxShadow: isActive ? "0 2px 8px rgba(22,119,255,0.3)" : "none",
                transition: "all 0.18s",
                display: "flex",
                alignItems: "center",
                gap: 6,
              }}
            >
              {tab}
              <span style={{
                fontFamily: "'JetBrains Mono', monospace",
                fontSize: 11,
                fontWeight: 700,
                padding: "1px 6px",
                borderRadius: 6,
                background: isActive ? "rgba(255,255,255,0.2)" : "rgba(22,119,255,0.08)",
                color: isActive ? "#fff" : "#1677FF",
              }}>
                {count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Application cards */}
      <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
        {filtered.length === 0 && (
          <div style={{
            background: "#fff",
            borderRadius: 16,
            border: "1px solid rgba(22,119,255,0.1)",
            padding: "48px 24px",
            textAlign: "center",
          }}>
            <FileText size={40} color="#c5d3f0" style={{ marginBottom: 12 }} />
            <p style={{ fontFamily: "'Inter', sans-serif", fontSize: 14, color: "#9ab4cc" }}>
              Tidak ada lamaran dengan status ini.
            </p>
          </div>
        )}

        {filtered.map((app) => {
          const badge = getStatusStyle(app.status);
          const currentStep = statusOrder[app.status];
          const isRejected = app.status === "Ditolak";

          return (
            <div
              key={app.id}
              style={{
                background: "#fff",
                borderRadius: 16,
                border: "1px solid rgba(22,119,255,0.1)",
                boxShadow: "0 2px 12px rgba(10,27,61,0.05)",
                padding: "22px 24px",
                transition: "box-shadow 0.2s, transform 0.2s",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.boxShadow = "0 6px 24px rgba(22,119,255,0.1)";
                e.currentTarget.style.transform = "translateY(-2px)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.boxShadow = "0 2px 12px rgba(10,27,61,0.05)";
                e.currentTarget.style.transform = "translateY(0)";
              }}
            >
              {/* Card top row */}
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 12 }}>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{
                    fontFamily: "'Poppins', sans-serif",
                    fontSize: 16,
                    fontWeight: 700,
                    color: "#0A1B3D",
                    marginBottom: 4,
                  }}>
                    {app.posisi}
                  </div>
                  <div style={{ fontFamily: "'Inter', sans-serif", fontSize: 13, color: "#6a88b8", marginBottom: 8 }}>
                    {app.perusahaan}
                  </div>
                  <div style={{ display: "flex", gap: 14, flexWrap: "wrap" }}>
                    <span style={{ display: "flex", alignItems: "center", gap: 4, fontFamily: "'Inter', sans-serif", fontSize: 12, color: "#9ab4cc" }}>
                      <MapPin size={11} /> {app.lokasi}
                    </span>
                    <span style={{ display: "flex", alignItems: "center", gap: 4, fontFamily: "'Inter', sans-serif", fontSize: 12, color: "#9ab4cc" }}>
                      <Calendar size={11} /> {app.tanggal}
                    </span>
                  </div>
                </div>

                <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 8, flexShrink: 0, marginLeft: 16 }}>
                  {/* Status badge */}
                  <span style={{
                    padding: "4px 12px",
                    borderRadius: 20,
                    fontFamily: "'Inter', sans-serif",
                    fontSize: 12,
                    fontWeight: 600,
                    ...badge,
                  }}>
                    {app.status}
                  </span>
                  {/* Match score */}
                  <div style={{ textAlign: "right" }}>
                    <div style={{
                      fontFamily: "'JetBrains Mono', monospace",
                      fontSize: 22,
                      fontWeight: 800,
                      color: "#1677FF",
                      lineHeight: 1,
                    }}>
                      {app.match}%
                    </div>
                    <div style={{ fontFamily: "'Inter', sans-serif", fontSize: 10, color: "#9ab4cc" }}>match score</div>
                  </div>
                </div>
              </div>

              {/* Mini horizontal timeline */}
              <div style={{
                background: "#f8fbff",
                borderRadius: 10,
                padding: "14px 16px",
                marginBottom: 16,
                border: "1px solid rgba(22,119,255,0.07)",
              }}>
                <div style={{ display: "flex", alignItems: "center" }}>
                  {timelineSteps.map((step, idx) => {
                    const isDone = !isRejected && currentStep >= idx;
                    const isCurrent = !isRejected && currentStep === idx;
                    const isLast = idx === timelineSteps.length - 1;

                    const nodeColor = isDone ? "#1677FF" : isRejected && step === "Diterima" ? "#ff6b6b" : "#d1ddf0";
                    const lineColor = (!isRejected && currentStep > idx) ? "#1677FF" : "rgba(22,119,255,0.12)";

                    return (
                      <div key={step} style={{ display: "flex", alignItems: "center", flex: isLast ? "0 0 auto" : 1 }}>
                        {/* Node */}
                        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 4 }}>
                          <div style={{
                            width: 22,
                            height: 22,
                            borderRadius: "50%",
                            background: isDone ? nodeColor : "transparent",
                            border: `2px solid ${nodeColor}`,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            boxShadow: isCurrent ? "0 0 0 3px rgba(22,119,255,0.15)" : "none",
                            flexShrink: 0,
                          }}>
                            {isDone && <CheckCircle size={12} color="#fff" strokeWidth={3} />}
                            {!isDone && <Circle size={8} color={nodeColor} strokeWidth={2.5} />}
                          </div>
                          <span style={{
                            fontFamily: "'Inter', sans-serif",
                            fontSize: 9,
                            fontWeight: isCurrent ? 700 : 500,
                            color: isCurrent ? "#1677FF" : isDone ? "#4a6a9a" : "#b0c0d8",
                            whiteSpace: "nowrap",
                          }}>
                            {step}
                          </span>
                        </div>
                        {/* Connector line */}
                        {!isLast && (
                          <div style={{
                            flex: 1,
                            height: 2,
                            background: lineColor,
                            marginBottom: 16,
                            marginLeft: 2,
                            marginRight: 2,
                            borderRadius: 1,
                          }} />
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Action button */}
              <div style={{ display: "flex", justifyContent: "flex-end" }}>
                <button
                  onClick={() => navigate(`/dashboard/kandidat/detail-lamaran`)}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 6,
                    padding: "9px 20px",
                    borderRadius: 10,
                    border: "none",
                    background: "linear-gradient(135deg, #1677FF, #0D47A1)",
                    fontFamily: "'Inter', sans-serif",
                    fontSize: 13,
                    fontWeight: 600,
                    color: "#fff",
                    cursor: "pointer",
                    boxShadow: "0 2px 8px rgba(22,119,255,0.3)",
                  }}
                >
                  Lihat Status <ChevronRight size={14} />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </DashboardLayout>
  );
}
