import { Cpu, TrendingUp, BookOpen, BarChart3, Globe } from "lucide-react";

const features = [
  { icon: Cpu, title: "Smart Job Matching", desc: "Pencocokan pekerjaan berbasis AI yang mempertimbangkan skill, pengalaman, lokasi, preferensi gaji, dan potensi karier.", color: "#1677FF", tag: "AI CORE" },
  { icon: TrendingUp, title: "Skill Gap Advisor", desc: "Analisis kesenjangan kompetensi kandidat dibanding kebutuhan industri aktual secara real-time.", color: "#0D47A1", tag: "ANALYTICS" },
  { icon: BookOpen, title: "Personalized Training", desc: "Rekomendasi jalur belajar dan kursus berdasarkan skill gap kandidat dari platform mitra terpercaya.", color: "#1677FF", tag: "LEARNING" },
  { icon: BarChart3, title: "Job-Workforce Analytics", desc: "Dashboard analitik komprehensif untuk perusahaan, pemerintah, dan institusi pendidikan.", color: "#0D47A1", tag: "DATA" },
  { icon: Globe, title: "Cross-Region Matching", desc: "Membuka peluang kerja lintas wilayah untuk talenta daerah di seluruh Indonesia.", color: "#1677FF", tag: "NETWORK" },
];

export function FeaturesSection() {
  return (
    <section id="fitur" style={{ padding: "96px 24px", background: "#f0f7ff", position: "relative" }}>
      <div style={{ position: "absolute", inset: 0, background: "radial-gradient(ellipse 60% 40% at 50% 0%, rgba(22,119,255,0.06) 0%, transparent 60%)", pointerEvents: "none" }} />

      <div style={{ maxWidth: 1280, margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: 60 }}>
          <span style={{
            display: "inline-block",
            fontFamily: "'JetBrains Mono', monospace", fontSize: 11, color: "#1677FF",
            letterSpacing: "0.12em", textTransform: "uppercase",
            padding: "4px 14px", border: "1px solid rgba(22,119,255,0.25)",
            borderRadius: 100, background: "rgba(22,119,255,0.07)", marginBottom: 16,
          }}>
            Core Features
          </span>
          <h2 style={{
            fontFamily: "'Poppins', sans-serif",
            fontSize: "clamp(24px, 3vw, 40px)", fontWeight: 800,
            color: "#0A1B3D", lineHeight: 1.2, letterSpacing: "-0.8px", marginBottom: 12,
          }}>
            Teknologi AI yang Bekerja untuk Anda
          </h2>
          <p style={{ fontFamily: "'Inter', sans-serif", fontSize: 16, color: "#6a88b8", maxWidth: 480, margin: "0 auto" }}>
            Lima pilar teknologi Ravira yang membentuk ekosistem rekrutmen terpadu.
          </p>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: 20 }}>
          {features.map(f => (
            <div
              key={f.title}
              style={{
                padding: "28px 24px", borderRadius: 16,
                background: "#ffffff",
                border: `1px solid ${f.color}14`,
                boxShadow: "0 2px 16px rgba(10,27,61,0.06)",
                position: "relative", overflow: "hidden",
                transition: "transform 0.2s, box-shadow 0.2s, border-color 0.2s",
              }}
              onMouseEnter={e => {
                e.currentTarget.style.transform = "translateY(-4px)";
                e.currentTarget.style.boxShadow = `0 12px 36px rgba(22,119,255,0.14)`;
                e.currentTarget.style.borderColor = `${f.color}40`;
              }}
              onMouseLeave={e => {
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.boxShadow = "0 2px 16px rgba(10,27,61,0.06)";
                e.currentTarget.style.borderColor = `${f.color}14`;
              }}
            >
              <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 3, background: `linear-gradient(90deg, ${f.color}, ${f.color}55)`, borderRadius: "16px 16px 0 0" }} />

              <div style={{
                display: "inline-block", fontFamily: "'JetBrains Mono', monospace", fontSize: 9,
                color: f.color, letterSpacing: "0.12em",
                padding: "3px 8px", border: `1px solid ${f.color}30`,
                borderRadius: 6, marginBottom: 16, background: `${f.color}08`,
              }}>
                {f.tag}
              </div>

              <div style={{
                width: 48, height: 48, borderRadius: 14,
                background: `${f.color}0e`, border: `1px solid ${f.color}20`,
                display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 16,
              }}>
                <f.icon size={22} color={f.color} />
              </div>

              <h3 style={{ fontFamily: "'Poppins', sans-serif", fontSize: 16, fontWeight: 700, color: "#0A1B3D", marginBottom: 8, lineHeight: 1.3 }}>
                {f.title}
              </h3>
              <p style={{ fontFamily: "'Inter', sans-serif", fontSize: 13, color: "#6a88b8", lineHeight: 1.7 }}>
                {f.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
