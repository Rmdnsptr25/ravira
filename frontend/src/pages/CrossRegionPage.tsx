import { useState } from "react";
import { useNavigate } from "react-router";
import { Home, Briefcase, Bookmark, BarChart2, BookOpen, FileText, Globe, User, Settings, MapPin, TrendingUp, Building2 } from "lucide-react";
import { DashboardLayout, SidebarItem } from "../components/DashboardLayout";
import { ApplicationConfirmModal } from "../components/Modals";
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

type WorkType = "Remote OK" | "Relokasi" | "Hybrid";

interface Opportunity {
  id: string;
  title: string;
  company: string;
  location: string;
  from: string;
  region: "DKI Jakarta" | "Jawa Barat" | "Jawa Tengah" | "DI Yogyakarta" | "Jawa Timur" | "Banten";
  type: WorkType;
  salary: string;
  match: number;
}

const opportunities: Opportunity[] = [
  { id: "opp-1", title: "Senior UX Designer", company: "Gojek", location: "Jakarta", from: "Yogyakarta", region: "DKI Jakarta", type: "Relokasi", salary: "15–22 jt", match: 91 },
  { id: "opp-2", title: "Product Designer", company: "Traveloka", location: "Jakarta", from: "Bandung", region: "DKI Jakarta", type: "Hybrid", salary: "13–19 jt", match: 85 },
  { id: "opp-3", title: "Data Analyst", company: "Tokopedia", location: "Surabaya", from: "Semarang", region: "Jawa Timur", type: "Relokasi", salary: "12–17 jt", match: 80 },
  { id: "opp-4", title: "Backend Engineer", company: "Shopee Indonesia", location: "Surabaya", from: "Malang", region: "Jawa Timur", type: "Hybrid", salary: "14–20 jt", match: 76 },
  { id: "opp-5", title: "DevOps Engineer", company: "PLN Digital", location: "Yogyakarta", from: "Solo", region: "DI Yogyakarta", type: "Relokasi", salary: "12–18 jt", match: 72 },
  { id: "opp-6", title: "UI/UX Designer", company: "BCA Digital", location: "Jakarta", from: "Bekasi", region: "DKI Jakarta", type: "Remote OK", salary: "10–16 jt", match: 68 },
];

const regionFilters = ["Semua Wilayah", "DKI Jakarta", "Jawa Barat", "Jawa Tengah", "DI Yogyakarta", "Jawa Timur", "Banten"] as const;

const workTypeBadge: Record<WorkType, { bg: string; color: string }> = {
  "Remote OK": { bg: "rgba(16,217,142,0.12)", color: "#10d98e" },
  "Relokasi": { bg: "rgba(255,154,60,0.12)", color: "#ff9a3c" },
  "Hybrid": { bg: "rgba(22,119,255,0.1)", color: "#1677FF" },
};

function MatchRing({ score }: { score: number }) {
  const color = score >= 80 ? "#10d98e" : score >= 70 ? "#1677FF" : "#ff9a3c";
  return (
    <div style={{
      width: 52, height: 52, borderRadius: "50%",
      background: `conic-gradient(${color} ${score * 3.6}deg, #eef4ff ${score * 3.6}deg)`,
      display: "flex", alignItems: "center", justifyContent: "center",
      flexShrink: 0,
    }}>
      <div style={{
        width: 38, height: 38, borderRadius: "50%", background: "#fff",
        display: "flex", alignItems: "center", justifyContent: "center",
        flexDirection: "column",
      }}>
        <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 13, fontWeight: 800, color, lineHeight: 1 }}>{score}</span>
        <span style={{ fontFamily: "'Inter', sans-serif", fontSize: 8, color: "#6a88b8", lineHeight: 1 }}>match</span>
      </div>
    </div>
  );
}

export default function CrossRegionPage() {
  const navigate = useNavigate();
  const [activeRegion, setActiveRegion] = useState<string>("Semua Wilayah");
  const [showModal, setShowModal] = useState<{ title: string; company: string } | null>(null);
  const [interestedIds, setInterestedIds] = useState<Set<string>>(new Set());

  const filtered = activeRegion === "Semua Wilayah"
    ? opportunities
    : opportunities.filter((o) => o.region === activeRegion);

  const toggleInterested = (id: string) => {
    setInterestedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
        toast.success("Peluang berhasil ditandai!");
      }
      return next;
    });
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
          Peluang Lintas Wilayah
        </h1>
        <p style={{ fontFamily: "'Inter', sans-serif", fontSize: 14, color: "#6a88b8", marginTop: 6 }}>
          Temukan peluang karier terbaik di seluruh Indonesia.
        </p>
      </div>

      {/* Stats row */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 16, marginBottom: 24 }}>
        {[
          { label: "Total Peluang", value: opportunities.length, icon: <Briefcase size={16} color="#1677FF" />, color: "#1677FF" },
          { label: "Remote OK", value: opportunities.filter((o) => o.type === "Remote OK").length, icon: <Globe size={16} color="#10d98e" />, color: "#10d98e" },
          { label: "Relokasi", value: opportunities.filter((o) => o.type === "Relokasi").length, icon: <MapPin size={16} color="#ff9a3c" />, color: "#ff9a3c" },
          { label: "Avg. Match", value: `${Math.round(opportunities.reduce((a, o) => a + o.match, 0) / opportunities.length)}%`, icon: <TrendingUp size={16} color="#4DB8FF" />, color: "#4DB8FF" },
        ].map((stat) => (
          <div key={stat.label} style={{ ...card, padding: "16px 20px", display: "flex", alignItems: "center", gap: 14 }}>
            <div style={{ width: 36, height: 36, borderRadius: 10, background: `${stat.color}18`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
              {stat.icon}
            </div>
            <div>
              <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 22, fontWeight: 800, color: stat.color }}>{stat.value}</div>
              <div style={{ fontFamily: "'Inter', sans-serif", fontSize: 11, color: "#6a88b8" }}>{stat.label}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Map placeholder */}
      <div style={{ marginBottom: 24 }}>
        <div style={{
          borderRadius: 16,
          overflow: "hidden",
          height: 200,
          background: "linear-gradient(135deg, #0A1B3D 0%, #0d2b5e 40%, #1677FF22 70%, #4DB8FF11 100%)",
          border: "1px solid rgba(22,119,255,0.2)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexDirection: "column",
          gap: 12,
          position: "relative",
        }}>
          {/* Decorative dots */}
          {[
            { top: "30%", left: "20%", size: 10 },
            { top: "55%", left: "45%", size: 14 },
            { top: "40%", left: "65%", size: 10 },
            { top: "60%", left: "75%", size: 12 },
            { top: "35%", left: "55%", size: 8 },
            { top: "65%", left: "30%", size: 10 },
          ].map((dot, i) => (
            <div key={i} style={{
              position: "absolute", top: dot.top, left: dot.left,
              width: dot.size, height: dot.size, borderRadius: "50%",
              background: "#4DB8FF",
              boxShadow: `0 0 ${dot.size * 2}px #4DB8FF88`,
              animation: "pulse 2s infinite",
            }} />
          ))}
          {/* Grid lines */}
          <div style={{
            position: "absolute", inset: 0, opacity: 0.08,
            backgroundImage: "linear-gradient(rgba(77,184,255,1) 1px, transparent 1px), linear-gradient(90deg, rgba(77,184,255,1) 1px, transparent 1px)",
            backgroundSize: "40px 40px",
          }} />
          <Globe size={32} color="#4DB8FF" style={{ position: "relative", zIndex: 1 }} />
          <div style={{ position: "relative", zIndex: 1, textAlign: "center" }}>
            <div style={{ fontFamily: "'Poppins', sans-serif", fontSize: 16, fontWeight: 700, color: "#fff" }}>Peta Persebaran Lowongan</div>
            <div style={{ fontFamily: "'Inter', sans-serif", fontSize: 13, color: "rgba(77,184,255,0.7)", marginTop: 4 }}>
              {opportunities.length} lowongan tersebar di {new Set(opportunities.map((o) => o.region)).size} wilayah Indonesia
            </div>
          </div>
        </div>
      </div>

      {/* Region filter tabs */}
      <div style={{ display: "flex", gap: 8, marginBottom: 24, flexWrap: "wrap" }}>
        {regionFilters.map((region) => {
          const isActive = activeRegion === region;
          const count = region === "Semua Wilayah" ? opportunities.length : opportunities.filter((o) => o.region === region).length;
          return (
            <button
              key={region}
              onClick={() => setActiveRegion(region)}
              style={{
                fontFamily: "'Inter', sans-serif",
                fontSize: 13,
                fontWeight: isActive ? 600 : 400,
                padding: "8px 16px",
                borderRadius: 10,
                border: isActive ? "1.5px solid #1677FF" : "1.5px solid rgba(22,119,255,0.15)",
                background: isActive ? "#1677FF" : "#fff",
                color: isActive ? "#fff" : "#6a88b8",
                cursor: "pointer",
                transition: "all 0.15s",
                display: "flex",
                alignItems: "center",
                gap: 6,
              }}
            >
              {region}
              {count > 0 && (
                <span style={{
                  fontFamily: "'JetBrains Mono', monospace", fontSize: 11,
                  padding: "1px 6px", borderRadius: 99,
                  background: isActive ? "rgba(255,255,255,0.2)" : "rgba(22,119,255,0.1)",
                  color: isActive ? "#fff" : "#1677FF",
                }}>
                  {count}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Opportunity cards grid */}
      {filtered.length === 0 ? (
        <div style={{ ...card, textAlign: "center", padding: "48px 24px", color: "#6a88b8" }}>
          <Globe size={40} color="#d0dff2" style={{ marginBottom: 12 }} />
          <div style={{ fontFamily: "'Poppins', sans-serif", fontSize: 16, fontWeight: 600, color: "#b0c4de" }}>Tidak ada peluang di wilayah ini</div>
        </div>
      ) : (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(340px, 1fr))", gap: 20 }}>
          {filtered.map((opp) => {
            const typeBadge = workTypeBadge[opp.type];
            const isInterested = interestedIds.has(opp.id);
            return (
              <div key={opp.id} style={{ ...card, display: "flex", flexDirection: "column", gap: 14 }}>
                {/* Top */}
                <div style={{ display: "flex", alignItems: "flex-start", gap: 14 }}>
                  <div style={{ width: 46, height: 46, borderRadius: 12, background: "linear-gradient(135deg, #eef4ff, #dbeeff)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                    <Building2 size={20} color="#1677FF" />
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontFamily: "'Poppins', sans-serif", fontSize: 15, fontWeight: 700, color: "#0A1B3D" }}>{opp.title}</div>
                    <div style={{ fontFamily: "'Inter', sans-serif", fontSize: 12, color: "#6a88b8", marginTop: 2 }}>{opp.company}</div>
                    <div style={{ display: "flex", alignItems: "center", gap: 4, marginTop: 4, fontFamily: "'Inter', sans-serif", fontSize: 12, color: "#6a88b8" }}>
                      <MapPin size={11} /> {opp.location}
                    </div>
                  </div>
                  <MatchRing score={opp.match} />
                </div>

                {/* Badges */}
                <div style={{ display: "flex", gap: 8, alignItems: "center", flexWrap: "wrap" }}>
                  <span style={{
                    fontFamily: "'Inter', sans-serif", fontSize: 11, fontWeight: 600,
                    padding: "3px 10px", borderRadius: 99,
                    background: typeBadge.bg, color: typeBadge.color,
                  }}>
                    {opp.type}
                  </span>
                  <span style={{ fontFamily: "'Inter', sans-serif", fontSize: 11, padding: "3px 10px", borderRadius: 99, background: "#f0f7ff", color: "#1677FF", border: "1px solid rgba(22,119,255,0.15)" }}>
                    {opp.region}
                  </span>
                </div>

                {/* Salary */}
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "10px 14px", borderRadius: 10, background: "#f8fbff", border: "1px solid rgba(22,119,255,0.08)" }}>
                  <span style={{ fontFamily: "'Inter', sans-serif", fontSize: 12, color: "#6a88b8" }}>Estimasi Gaji</span>
                  <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 13, fontWeight: 700, color: "#0A1B3D" }}>Rp {opp.salary}</span>
                </div>

                {/* Tandai Tertarik */}
                <button
                  onClick={() => toggleInterested(opp.id)}
                  style={{
                    fontFamily: "'Inter', sans-serif", fontSize: 12, fontWeight: 600,
                    padding: "7px 14px", borderRadius: 10,
                    border: `1.5px solid ${isInterested ? "#10d98e" : "rgba(22,119,255,0.2)"}`,
                    background: isInterested ? "rgba(16,217,142,0.08)" : "#fff",
                    color: isInterested ? "#10d98e" : "#6a88b8",
                    cursor: "pointer", transition: "all 0.15s",
                    textAlign: "center",
                  }}
                >
                  {isInterested ? "Tertandai ✓" : "Tandai Tertarik"}
                </button>

                {/* Buttons */}
                <div style={{ display: "flex", gap: 8 }}>
                  <button
                    onClick={() => navigate("/dashboard/kandidat/detail-cross-region")}
                    style={{
                      flex: 1,
                      fontFamily: "'Inter', sans-serif", fontSize: 13, fontWeight: 600,
                      padding: "9px", borderRadius: 10,
                      border: "1.5px solid rgba(22,119,255,0.2)",
                      background: "#fff", color: "#1677FF", cursor: "pointer",
                    }}
                  >
                    Lihat Detail
                  </button>
                  <button
                    onClick={() => setShowModal({ title: opp.title, company: opp.company })}
                    style={{
                      flex: 1,
                      fontFamily: "'Inter', sans-serif", fontSize: 13, fontWeight: 600,
                      padding: "9px", borderRadius: 10, border: "none",
                      background: "linear-gradient(135deg, #1677FF, #4DB8FF)",
                      color: "#fff", cursor: "pointer",
                    }}
                  >
                    Lamar
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {showModal && (
        <ApplicationConfirmModal
          jobTitle={showModal.title}
          company={showModal.company}
          onConfirm={() => setShowModal(null)}
          onClose={() => setShowModal(null)}
        />
      )}
    </DashboardLayout>
  );
}
