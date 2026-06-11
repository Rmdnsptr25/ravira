import { useNavigate } from "react-router";
import { PemerintahNavbar } from "../components/PemerintahNavbar";
import { TrendingUp, AlertTriangle, BookOpen, ArrowRight, ArrowUpRight } from "lucide-react";

const trendingSkills = [
  { skill: "Machine Learning & AI", demand: 94, growth: "+42%", color: "#4DB8FF", sektor: "Teknologi" },
  { skill: "Cloud Computing (AWS/GCP)", demand: 88, growth: "+38%", color: "#10d98e", sektor: "Teknologi" },
  { skill: "Data Engineering", demand: 85, growth: "+35%", color: "#8b5cf6", sektor: "Teknologi" },
  { skill: "Keperawatan Kritis", demand: 82, growth: "+29%", color: "#ff6b6b", sektor: "Kesehatan" },
  { skill: "Cybersecurity", demand: 79, growth: "+27%", color: "#f59e0b", sektor: "Teknologi" },
  { skill: "Supply Chain Management", demand: 74, growth: "+21%", color: "#1677FF", sektor: "Logistik" },
];

const skillGaps = [
  { skill: "Machine Learning", shortage: 18200, persen: 76, color: "#ff6b6b" },
  { skill: "Keperawatan ICU/CCU", shortage: 14500, persen: 68, color: "#f59e0b" },
  { skill: "Cloud Architecture", shortage: 11300, persen: 60, color: "#4DB8FF" },
  { skill: "Data Science", shortage: 9800, persen: 54, color: "#8b5cf6" },
  { skill: "Cybersecurity Analyst", shortage: 7200, persen: 44, color: "#10d98e" },
];

const trainingRecs = [
  {
    icon: BookOpen,
    color: "#4DB8FF",
    bg: "rgba(77,184,255,0.08)",
    title: "Beasiswa Digital Talent Scholarship",
    desc: "Program pelatihan intensif untuk skill teknologi: AI/ML, Cloud, Data Engineering. Target 50.000 peserta/tahun dari seluruh Jawa.",
    sasaran: "Lulusan S1/D4 Teknik & Sains",
  },
  {
    icon: TrendingUp,
    color: "#10d98e",
    bg: "rgba(16,217,142,0.08)",
    title: "Pelatihan Tenaga Kesehatan Spesialis",
    desc: "Peningkatan kompetensi perawat dan tenaga medis untuk layanan kritis. Kerja sama dengan 12 rumah sakit pendidikan di Jawa.",
    sasaran: "Tenaga Kesehatan Aktif",
  },
  {
    icon: AlertTriangle,
    color: "#f59e0b",
    bg: "rgba(245,158,11,0.08)",
    title: "Reskilling Tenaga Manufaktur",
    desc: "Program alih skill bagi tenaga manufaktur surplus ke sektor yang kekurangan (Kesehatan, Teknologi, Logistik).",
    sasaran: "Tenaga Manufaktur & Perdagangan",
  },
];

export default function UntukPemerintahTrenSkillPage() {
  const navigate = useNavigate();

  return (
    <div style={{ minHeight: "100vh", background: "#f4f8ff", fontFamily: "'Inter', sans-serif" }}>
      <PemerintahNavbar />

      {/* Hero */}
      <div style={{ background: "linear-gradient(160deg, #021220 0%, #041c2e 55%, #062640 100%)", paddingTop: 120, paddingBottom: 60, position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", inset: 0, background: "radial-gradient(ellipse 60% 50% at 50% 40%, rgba(77,184,255,0.14) 0%, transparent 70%)", pointerEvents: "none" }} />
        <div style={{ position: "relative", zIndex: 1, maxWidth: 720, margin: "0 auto", padding: "0 24px", textAlign: "center" }}>
          <div style={{ display: "inline-block", fontFamily: "'Poppins', sans-serif", fontSize: 11, fontWeight: 600, color: "#4DB8FF", letterSpacing: "0.2em", textTransform: "uppercase", marginBottom: 16, background: "rgba(77,184,255,0.1)", border: "1px solid rgba(77,184,255,0.25)", borderRadius: 20, padding: "4px 14px" }}>
            Tren Skill
          </div>
          <h1 style={{ fontFamily: "'Poppins', sans-serif", fontSize: 36, fontWeight: 800, color: "#fff", letterSpacing: "-1px", marginBottom: 14, lineHeight: 1.15 }}>
            Tren & Gap Skill Tenaga Kerja
          </h1>
          <p style={{ fontFamily: "'Inter', sans-serif", fontSize: 15, color: "#6a9ab8", lineHeight: 1.7 }}>
            Identifikasi skill yang berkembang, skill dengan demand tinggi, dan gap yang perlu intervensi kebijakan — berdasarkan data agregat platform Ravira.
          </p>
        </div>
      </div>

      <div style={{ maxWidth: 960, margin: "0 auto", padding: "60px 24px" }}>

        {/* Trending Skills */}
        <div style={{ marginBottom: 48 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 24 }}>
            <TrendingUp size={22} color="#4DB8FF" />
            <h2 style={{ fontFamily: "'Poppins', sans-serif", fontSize: 22, fontWeight: 800, color: "#0A1B3D" }}>Skill dengan Demand Tertinggi</h2>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {trendingSkills.map((s, i) => (
              <div key={s.skill} style={{ background: "#fff", borderRadius: 16, border: "1px solid rgba(22,119,255,0.08)", padding: "18px 24px", boxShadow: "0 2px 10px rgba(10,27,61,0.04)", display: "flex", alignItems: "center", gap: 20 }}>
                <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 13, fontWeight: 700, color: "#c0cde0", width: 24 }}>#{i + 1}</div>
                <div style={{ flex: 1 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8 }}>
                    <span style={{ fontFamily: "'Poppins', sans-serif", fontSize: 14, fontWeight: 700, color: "#0A1B3D" }}>{s.skill}</span>
                    <span style={{ fontFamily: "'Inter', sans-serif", fontSize: 11, color: s.color, background: `${s.color}14`, border: `1px solid ${s.color}30`, borderRadius: 99, padding: "2px 8px" }}>{s.sektor}</span>
                  </div>
                  <div style={{ height: 6, background: "#eef4ff", borderRadius: 99, overflow: "hidden" }}>
                    <div style={{ height: "100%", width: `${s.demand}%`, background: s.color, borderRadius: 99, transition: "width 0.6s ease" }} />
                  </div>
                </div>
                <div style={{ textAlign: "right", minWidth: 80 }}>
                  <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 16, fontWeight: 800, color: s.color }}>{s.demand}</div>
                  <div style={{ display: "flex", alignItems: "center", gap: 4, justifyContent: "flex-end" }}>
                    <ArrowUpRight size={12} color="#10d98e" />
                    <span style={{ fontFamily: "'Inter', sans-serif", fontSize: 11, color: "#10d98e", fontWeight: 600 }}>{s.growth}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Skill Gap */}
        <div style={{ background: "#fff", borderRadius: 20, border: "1px solid rgba(22,119,255,0.08)", padding: "28px", boxShadow: "0 4px 18px rgba(10,27,61,0.05)", marginBottom: 40 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8 }}>
            <AlertTriangle size={20} color="#f59e0b" />
            <h2 style={{ fontFamily: "'Poppins', sans-serif", fontSize: 18, fontWeight: 700, color: "#0A1B3D" }}>Skill Gap yang Perlu Intervensi</h2>
          </div>
          <p style={{ fontFamily: "'Inter', sans-serif", fontSize: 13, color: "#6a88b8", marginBottom: 24 }}>Estimasi kekurangan tenaga kerja berdasarkan data agregat per skill di wilayah Pulau Jawa.</p>
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            {skillGaps.map((g) => (
              <div key={g.skill}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
                  <span style={{ fontFamily: "'Poppins', sans-serif", fontSize: 14, fontWeight: 600, color: "#0A1B3D" }}>{g.skill}</span>
                  <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                    <span style={{ fontFamily: "'Inter', sans-serif", fontSize: 12, color: "#6a88b8" }}>Kekurangan estimasi:</span>
                    <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 13, fontWeight: 700, color: g.color }}>{g.shortage.toLocaleString("id-ID")} orang</span>
                  </div>
                </div>
                <div style={{ height: 8, background: "#eef4ff", borderRadius: 99, overflow: "hidden" }}>
                  <div style={{ height: "100%", width: `${g.persen}%`, background: g.color, borderRadius: 99 }} />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Training Recommendations */}
        <div style={{ marginBottom: 48 }}>
          <h2 style={{ fontFamily: "'Poppins', sans-serif", fontSize: 22, fontWeight: 800, color: "#0A1B3D", marginBottom: 8 }}>Rekomendasi Program Pelatihan</h2>
          <p style={{ fontFamily: "'Inter', sans-serif", fontSize: 14, color: "#6a88b8", marginBottom: 24 }}>Intervensi yang direkomendasikan berdasarkan analisis gap skill dan tren permintaan industri.</p>
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            {trainingRecs.map((r) => {
              const Icon = r.icon;
              return (
                <div key={r.title} style={{ background: "#fff", borderRadius: 18, border: "1px solid rgba(22,119,255,0.08)", padding: "24px 28px", boxShadow: "0 4px 18px rgba(10,27,61,0.05)", display: "flex", gap: 20, alignItems: "flex-start" }}>
                  <div style={{ width: 48, height: 48, borderRadius: 14, background: r.bg, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                    <Icon size={22} color={r.color} />
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontFamily: "'Poppins', sans-serif", fontSize: 15, fontWeight: 700, color: "#0A1B3D", marginBottom: 6 }}>{r.title}</div>
                    <p style={{ fontFamily: "'Inter', sans-serif", fontSize: 13, color: "#6a88b8", lineHeight: 1.7, marginBottom: 10 }}>{r.desc}</p>
                    <div style={{ display: "inline-flex", alignItems: "center", gap: 6, background: `${r.color}10`, border: `1px solid ${r.color}30`, borderRadius: 99, padding: "4px 12px" }}>
                      <span style={{ fontFamily: "'Inter', sans-serif", fontSize: 11, color: r.color, fontWeight: 600 }}>Sasaran: {r.sasaran}</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div style={{ textAlign: "center" }}>
          <button onClick={() => navigate("/daftar/pemerintah")} style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "14px 32px", borderRadius: 12, border: "none", background: "linear-gradient(135deg, #4DB8FF, #0090d4)", fontFamily: "'Poppins', sans-serif", fontSize: 15, fontWeight: 700, color: "#fff", cursor: "pointer", boxShadow: "0 6px 20px rgba(77,184,255,0.4)" }}>
            Akses Data Tren Skill Lengkap <ArrowRight size={16} />
          </button>
        </div>
      </div>
    </div>
  );
}
