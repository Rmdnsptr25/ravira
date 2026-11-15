import { Upload, Brain, Briefcase, TrendingUp, BookOpen, Award } from "lucide-react";

const steps = [
  { icon: Upload, label: "Upload CV", desc: "Unggah CV atau lengkapi profil Anda" },
  { icon: Brain, label: "Analisis AI", desc: "AI menganalisis skill & pengalaman Anda" },
  { icon: Briefcase, label: "Job Matching", desc: "Cocok dengan lowongan paling relevan" },
  { icon: TrendingUp, label: "Skill Gap Report", desc: "Ketahui skill yang perlu dikembangkan" },
  { icon: BookOpen, label: "Training Rec.", desc: "Rekomendasi kursus dan jalur belajar" },
  { icon: Award, label: "Job Placement", desc: "Lamar dan raih pekerjaan impian Anda" },
];

export function SolutionSection() {
  return (
    <section style={{ padding: "14px 14px", background: "#ffffff" }}>
      <div
        style={{
          borderRadius: 28,
          background: "linear-gradient(180deg, #0849A8 0%, #0E67CC 55%, #2D90F5 100%)",
          padding: "76px 24px",
          position: "relative",
          overflow: "hidden",
        }}
      >
        <div style={{ maxWidth: 1200, margin: "0 auto", position: "relative", zIndex: 2 }}>
          <div style={{ textAlign: "center", marginBottom: 52 }}>
            <div
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 6,
                fontFamily: "'Inter', sans-serif",
                fontSize: 11.5,
                fontWeight: 700,
                color: "#D4FF59",
                letterSpacing: "0.14em",
                textTransform: "uppercase",
                marginBottom: 16,
              }}
            >
              <span style={{ width: 5, height: 5, borderRadius: "50%", background: "#D4FF59" }} />
              Solusi
            </div>

            <h2
              style={{
                fontFamily: "'Poppins', sans-serif",
                fontSize: "clamp(26px, 4vw, 44px)",
                fontWeight: 600,
                color: "#ffffff",
                lineHeight: 1.18,
                letterSpacing: "-0.03em",
                maxWidth: 680,
                margin: "0 auto 14px",
              }}
            >
              Ravira Menghubungkan{" "}
              <span style={{ color: "#D4FF59", fontWeight: 700 }}>
                Talenta, Skill, dan Peluang
              </span>{" "}
              Kerja
            </h2>

            <p style={{ fontFamily: "'Inter', sans-serif", fontSize: 15.5, color: "#ffffff", opacity: 0.92, maxWidth: 560, margin: "0 auto", lineHeight: 1.7 }}>
              Dengan AI, Ravira membaca profil kandidat, mencocokkan dengan pekerjaan relevan, menganalisis skill gap, dan merekomendasikan pelatihan.
            </p>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(175px, 1fr))", gap: 14 }}>
            {steps.map((step, i) => {
              const isHighlight = i === 1 || i === 4;
              return (
                <div
                  key={step.label}
                  style={{
                    padding: "24px 18px",
                    borderRadius: 20,
                    background: isHighlight ? "#0D1117" : "#ffffff",
                    position: "relative",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "space-between",
                    minHeight: 185,
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 18 }}>
                    <div
                      style={{
                        width: 40,
                        height: 40,
                        borderRadius: "50%",
                        background: isHighlight ? "#D4FF59" : "#F4F5F7",
                        color: "#0D1117",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      <step.icon size={18} aria-hidden="true" />
                    </div>
                    <span
                      style={{
                        fontFamily: "'Poppins', sans-serif",
                        fontSize: 12,
                        fontWeight: 700,
                        color: isHighlight ? "#D4FF59" : "#4A5568",
                      }}
                    >
                      0{i + 1}
                    </span>
                  </div>

                  <div>
                    <div
                      style={{
                        fontFamily: "'Poppins', sans-serif",
                        fontSize: 15,
                        fontWeight: 700,
                        color: isHighlight ? "#ffffff" : "#0D1117",
                        marginBottom: 6,
                        lineHeight: 1.3,
                      }}
                    >
                      {step.label}
                    </div>
                    <div
                      style={{
                        fontFamily: "'Inter', sans-serif",
                        fontSize: 12.5,
                        color: isHighlight ? "#CBD5E1" : "#4A5568",
                        lineHeight: 1.55,
                      }}
                    >
                      {step.desc}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
