import { Upload, Brain, Briefcase, TrendingUp, BookOpen, Award } from "lucide-react";

const steps = [
  { icon: Upload, label: "Upload CV", desc: "Unggah CV atau lengkapi profil Anda", color: "#1677FF" },
  { icon: Brain, label: "Analisis AI", desc: "AI menganalisis skill & pengalaman Anda", color: "#4DB8FF" },
  { icon: Briefcase, label: "Job Matching", desc: "Cocok dengan lowongan paling relevan", color: "#1677FF" },
  { icon: TrendingUp, label: "Skill Gap Report", desc: "Ketahui skill yang perlu dikembangkan", color: "#4DB8FF" },
  { icon: BookOpen, label: "Training Rec.", desc: "Rekomendasi kursus dan jalur belajar", color: "#1677FF" },
  { icon: Award, label: "Job Placement", desc: "Lamar dan raih pekerjaan impian Anda", color: "#4DB8FF" },
];

export function SolutionSection() {
  return (
    <section style={{ padding: "96px 24px", background: "linear-gradient(135deg, #0a1b3d 0%, #071228 60%, #0d2050 100%)", position: "relative", overflow: "hidden" }}>
      {/* Grid pattern */}
      <div style={{
        position: "absolute", inset: 0, pointerEvents: "none", opacity: 0.03,
        backgroundImage: "radial-gradient(circle, #4DB8FF 1px, transparent 1px)",
        backgroundSize: "36px 36px",
      }} />
      <div style={{ position: "absolute", inset: 0, background: "radial-gradient(ellipse 60% 40% at 50% 50%, rgba(22,119,255,0.12) 0%, transparent 70%)", pointerEvents: "none" }} />

      <div style={{ maxWidth: 1280, margin: "0 auto", position: "relative", zIndex: 2 }}>
        <div style={{ textAlign: "center", marginBottom: 60 }}>
          <span style={{
            display: "inline-block", fontFamily: "'JetBrains Mono', monospace",
            fontSize: 11, color: "#4DB8FF", letterSpacing: "0.12em", textTransform: "uppercase",
            padding: "4px 14px", border: "1px solid rgba(77,184,255,0.28)",
            borderRadius: 100, background: "rgba(22,119,255,0.08)", marginBottom: 16,
          }}>
            Solusi
          </span>
          <h2 style={{
            fontFamily: "'Poppins', sans-serif",
            fontSize: "clamp(24px, 3.5vw, 42px)", fontWeight: 800,
            color: "#ffffff", lineHeight: 1.2, letterSpacing: "-0.8px",
            maxWidth: 680, margin: "0 auto 14px",
          }}>
            Ravira Menghubungkan{" "}
            <span style={{ background: "linear-gradient(90deg, #1677FF, #4DB8FF)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
              Talenta, Skill, dan Peluang
            </span>{" "}Kerja
          </h2>
          <p style={{ fontFamily: "'Inter', sans-serif", fontSize: 15, color: "#7a99c8", maxWidth: 560, margin: "0 auto", lineHeight: 1.7 }}>
            Dengan AI, Ravira membaca profil kandidat, mencocokkan dengan pekerjaan relevan, menganalisis skill gap, dan merekomendasikan pelatihan.
          </p>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(170px, 1fr))", gap: 16 }}>
          {steps.map((step, i) => (
            <div
              key={step.label}
              style={{
                padding: "24px 18px", borderRadius: 14, textAlign: "center",
                background: "rgba(255,255,255,0.04)",
                border: `1px solid ${step.color}22`,
                backdropFilter: "blur(8px)",
                position: "relative", transition: "transform 0.2s, border-color 0.2s",
              }}
              onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-6px)"; e.currentTarget.style.borderColor = `${step.color}55`; }}
              onMouseLeave={e => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.borderColor = `${step.color}22`; }}
            >
              <div style={{
                position: "absolute", top: 10, right: 12,
                fontFamily: "'JetBrains Mono', monospace", fontSize: 10, fontWeight: 700,
                color: `${step.color}55`,
              }}>
                0{i + 1}
              </div>
              <div style={{
                width: 50, height: 50, borderRadius: 14,
                background: `${step.color}14`, border: `1px solid ${step.color}28`,
                display: "flex", alignItems: "center", justifyContent: "center",
                margin: "0 auto 14px",
              }}>
                <step.icon size={22} color={step.color} />
              </div>
              <div style={{ fontFamily: "'Poppins', sans-serif", fontSize: 13, fontWeight: 700, color: "#ffffff", marginBottom: 5, lineHeight: 1.3 }}>
                {step.label}
              </div>
              <div style={{ fontFamily: "'Inter', sans-serif", fontSize: 11, color: "#5a7aaa", lineHeight: 1.5 }}>
                {step.desc}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
