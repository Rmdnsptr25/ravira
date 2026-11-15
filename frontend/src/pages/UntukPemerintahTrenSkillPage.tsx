import { useNavigate } from "react-router";
import { PemerintahNavbar } from "../components/PemerintahNavbar";
import { Footer } from "../components/Footer";
import { TrendingUp, AlertTriangle, BookOpen, ArrowUpRight } from "lucide-react";

const trendingSkills = [
  { skill: "Machine Learning & AI", demand: 94, growth: "+42%", sektor: "Teknologi" },
  { skill: "Cloud Computing (AWS/GCP)", demand: 88, growth: "+38%", sektor: "Teknologi" },
  { skill: "Data Engineering", demand: 85, growth: "+35%", sektor: "Teknologi" },
  { skill: "Keperawatan Kritis", demand: 82, growth: "+29%", sektor: "Kesehatan" },
  { skill: "Cybersecurity", demand: 79, growth: "+27%", sektor: "Teknologi" },
  { skill: "Supply Chain Management", demand: 74, growth: "+21%", sektor: "Logistik" },
];

const skillGaps = [
  { skill: "Machine Learning", shortage: 18200, persen: 76 },
  { skill: "Keperawatan ICU/CCU", shortage: 14500, persen: 68 },
  { skill: "Cloud Architecture", shortage: 11300, persen: 60 },
  { skill: "Data Science", shortage: 9800, persen: 54 },
  { skill: "Cybersecurity Analyst", shortage: 7200, persen: 44 },
];

const trainingRecs = [
  {
    icon: BookOpen,
    variant: "blue" as const,
    title: "Beasiswa Digital Talent Scholarship",
    desc: "Program pelatihan intensif untuk skill teknologi: AI/ML, Cloud, Data Engineering. Target 50.000 peserta/tahun dari seluruh Jawa.",
    sasaran: "Lulusan S1/D4 Teknik & Sains",
  },
  {
    icon: TrendingUp,
    variant: "lime" as const,
    title: "Pelatihan Tenaga Kesehatan Spesialis",
    desc: "Peningkatan kompetensi perawat dan tenaga medis untuk layanan kritis. Kerja sama dengan 12 rumah sakit pendidikan di Jawa.",
    sasaran: "Tenaga Kesehatan Aktif",
  },
  {
    icon: AlertTriangle,
    variant: "dark" as const,
    title: "Reskilling Tenaga Manufaktur",
    desc: "Program alih skill bagi tenaga manufaktur surplus ke sektor yang kekurangan (Kesehatan, Teknologi, Logistik).",
    sasaran: "Tenaga Manufaktur & Perdagangan",
  },
];

export default function UntukPemerintahTrenSkillPage() {
  const navigate = useNavigate();

  return (
    <div style={{ minHeight: "100vh", background: "#FFFFFF", fontFamily: "'Inter', sans-serif" }}>
      <PemerintahNavbar />

      {/* Framed Aeline Hero */}
      <section style={{ padding: "14px 14px 8px", background: "#FFFFFF" }}>
        <div
          style={{
            position: "relative",
            borderRadius: 28,
            overflow: "hidden",
            background: "linear-gradient(180deg, #0849A8 0%, #0E67CC 45%, #389BFF 100%)",
            padding: "120px 24px 64px",
            textAlign: "center",
            boxShadow: "0 18px 48px rgba(8, 73, 168, 0.14)",
          }}
        >
          <div style={{ position: "relative", zIndex: 1, maxWidth: 740, margin: "0 auto" }}>
            <p
              style={{
                fontFamily: "'Poppins', sans-serif",
                fontSize: 11,
                fontWeight: 600,
                color: "#D4FF59",
                letterSpacing: "0.18em",
                textTransform: "uppercase",
                marginBottom: 14,
              }}
            >
              Tren Skill
            </p>
            <h1 style={{ fontFamily: "'Poppins', sans-serif", fontSize: "clamp(30px, 4.4vw, 48px)", fontWeight: 600, color: "#FFFFFF", letterSpacing: "-0.03em", marginBottom: 14, lineHeight: 1.14 }}>
              Tren & Gap Skill Tenaga Kerja
            </h1>
            <p style={{ fontFamily: "'Inter', sans-serif", fontSize: 15.5, color: "rgba(255,255,255,0.92)", lineHeight: 1.7 }}>
              Identifikasi skill yang berkembang, skill dengan demand tinggi, dan gap yang perlu intervensi kebijakan, berdasarkan data agregat platform Ravira.
            </p>
          </div>
        </div>
      </section>

      <div style={{ maxWidth: 1120, margin: "0 auto", padding: "64px 24px" }}>
        {/* Trending Skills */}
        <div style={{ marginBottom: 48 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 24 }}>
            <TrendingUp size={22} color="#0E67CC" />
            <h2 style={{ fontFamily: "'Poppins', sans-serif", fontSize: 22, fontWeight: 600, color: "#0D1117" }}>Skill dengan Demand Tertinggi</h2>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {trendingSkills.map((s, i) => (
              <div key={s.skill} style={{ background: "#F4F5F7", borderRadius: 20, padding: "20px 24px", display: "flex", alignItems: "center", gap: 20 }}>
                <div style={{ fontFamily: "'Poppins', sans-serif", fontSize: 14, fontWeight: 700, color: "#4A5568", width: 28 }}>#{i + 1}</div>
                <div style={{ flex: 1 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8 }}>
                    <span style={{ fontFamily: "'Poppins', sans-serif", fontSize: 15, fontWeight: 600, color: "#0D1117" }}>{s.skill}</span>
                    <span style={{ fontFamily: "'Inter', sans-serif", fontSize: 11, fontWeight: 600, color: "#0D1117", background: "#D4FF59", borderRadius: 99, padding: "3px 10px" }}>{s.sektor}</span>
                  </div>
                  <div style={{ height: 6, background: "#E2E8F0", borderRadius: 99, overflow: "hidden" }}>
                    <div style={{ height: "100%", width: `${s.demand}%`, background: "#0E67CC", borderRadius: 99 }} />
                  </div>
                </div>
                <div style={{ textAlign: "right", minWidth: 80 }}>
                  <div style={{ fontFamily: "'Poppins', sans-serif", fontSize: 18, fontWeight: 700, color: "#0D1117" }}>{s.demand}</div>
                  <div style={{ display: "flex", alignItems: "center", gap: 4, justifyContent: "flex-end" }}>
                    <ArrowUpRight size={12} color="#047857" />
                    <span style={{ fontFamily: "'Inter', sans-serif", fontSize: 11.5, color: "#047857", fontWeight: 700 }}>{s.growth}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Skill Gap */}
        <div style={{ background: "#0D1117", borderRadius: 28, padding: "36px", marginBottom: 44 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8 }}>
            <AlertTriangle size={20} color="#D4FF59" />
            <h2 style={{ fontFamily: "'Poppins', sans-serif", fontSize: 20, fontWeight: 600, color: "#FFFFFF" }}>Skill Gap yang Perlu Intervensi</h2>
          </div>
          <p style={{ fontFamily: "'Inter', sans-serif", fontSize: 13.5, color: "#CBD5E1", marginBottom: 24 }}>Estimasi kekurangan tenaga kerja berdasarkan data agregat per skill di wilayah Pulau Jawa.</p>
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            {skillGaps.map((g) => (
              <div key={g.skill}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
                  <span style={{ fontFamily: "'Poppins', sans-serif", fontSize: 14, fontWeight: 600, color: "#FFFFFF" }}>{g.skill}</span>
                  <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                    <span style={{ fontFamily: "'Inter', sans-serif", fontSize: 12, color: "#CBD5E1" }}>Kekurangan estimasi:</span>
                    <span style={{ fontFamily: "'Poppins', sans-serif", fontSize: 13.5, fontWeight: 700, color: "#D4FF59" }}>{g.shortage.toLocaleString("id-ID")} orang</span>
                  </div>
                </div>
                <div style={{ height: 8, background: "rgba(255,255,255,0.12)", borderRadius: 99, overflow: "hidden" }}>
                  <div style={{ height: "100%", width: `${g.persen}%`, background: "#D4FF59", borderRadius: 99 }} />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Training Recommendations (3 cards) */}
        <div style={{ marginBottom: 48 }}>
          <h2 style={{ fontFamily: "'Poppins', sans-serif", fontSize: 24, fontWeight: 600, color: "#0D1117", marginBottom: 8 }}>Rekomendasi Program Pelatihan</h2>
          <p style={{ fontFamily: "'Inter', sans-serif", fontSize: 14.5, color: "#4A5568", marginBottom: 24 }}>Intervensi yang direkomendasikan berdasarkan analisis gap skill dan tren permintaan industri.</p>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 18 }}>
            {trainingRecs.map((r) => {
              const Icon = r.icon;
              const isBlue = r.variant === "blue";
              const isLime = r.variant === "lime";
              const isDark = r.variant === "dark";

              const bg = isBlue ? "linear-gradient(180deg, #0E67CC 0%, #389BFF 100%)" : isLime ? "#D4FF59" : "#0D1117";
              const titleColor = isBlue || isDark ? "#FFFFFF" : "#0D1117";
              const descColor = isBlue ? "rgba(255,255,255,0.9)" : isDark ? "#CBD5E1" : "#1E293B";
              const iconBg = isBlue || isDark ? "#FFFFFF" : "#0D1117";
              const iconColor = isBlue || isDark ? "#0D1117" : "#D4FF59";
              const badgeBg = isBlue || isDark ? "rgba(255,255,255,0.16)" : "rgba(13,17,23,0.1)";
              const badgeText = isBlue || isDark ? "#FFFFFF" : "#0D1117";

              return (
                <div key={r.title} style={{ background: bg, borderRadius: 24, padding: "28px 24px", display: "flex", flexDirection: "column", justifyContent: "space-between", minHeight: 250 }}>
                  <div>
                    <div style={{ width: 46, height: 46, borderRadius: 14, background: iconBg, color: iconColor, display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 18 }}>
                      <Icon size={22} />
                    </div>
                    <div style={{ fontFamily: "'Poppins', sans-serif", fontSize: 17, fontWeight: 600, color: titleColor, marginBottom: 8 }}>{r.title}</div>
                    <p style={{ fontFamily: "'Inter', sans-serif", fontSize: 13.5, color: descColor, lineHeight: 1.65, marginBottom: 18 }}>{r.desc}</p>
                  </div>
                  <div>
                    <span style={{ display: "inline-block", fontFamily: "'Inter', sans-serif", fontSize: 11.5, color: badgeText, background: badgeBg, borderRadius: 999, padding: "5px 12px", fontWeight: 600 }}>
                      Sasaran: {r.sasaran}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div style={{ textAlign: "center" }}>
          <button
            onClick={() => navigate("/daftar/pemerintah")}
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 12,
              padding: "7px 8px 7px 26px",
              minHeight: 48,
              borderRadius: 999,
              border: "none",
              background: "#0D1117",
              fontFamily: "'Inter', sans-serif",
              fontSize: 12,
              fontWeight: 700,
              letterSpacing: "0.08em",
              textTransform: "uppercase",
              color: "#FFFFFF",
              cursor: "pointer",
            }}
          >
            <span>Akses Data Tren Skill Lengkap</span>
            <span style={{ width: 34, height: 34, borderRadius: "50%", background: "#D4FF59", color: "#0D1117", display: "inline-flex", alignItems: "center", justifyContent: "center" }}>
              <ArrowUpRight size={16} />
            </span>
          </button>
        </div>
      </div>

      <Footer />
    </div>
  );
}
