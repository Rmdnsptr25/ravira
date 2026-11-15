import { Users, Building2, Landmark, GraduationCap, ArrowRight, BarChart3, Lightbulb } from "lucide-react";

const highlights = [
  { icon: Users, title: "Untuk Kandidat", desc: "Temukan pekerjaan sesuai skill, minat, lokasi, dan potensi karier." },
  { icon: Building2, title: "Untuk Perusahaan", desc: "Dapatkan shortlist kandidat yang lebih relevan dan tervalidasi." },
  { icon: Landmark, title: "Untuk Pemerintah & Institusi", desc: "Pantau tren skill, supply-demand tenaga kerja, dan kebutuhan pelatihan daerah." },
];

const ecosystemSteps = [
  { label: "Kandidat" },
  { label: "AI Matching" },
  { label: "Skill Gap" },
  { label: "Training" },
  { label: "Job Placement" },
  { label: "Analytics" },
];

export function AboutSection() {
  return (
    <section id="tentang" style={{ padding: "88px 24px", background: "#ffffff", position: "relative" }}>
      <div style={{ maxWidth: 1200, margin: "0 auto" }}>
        {/* Editorial Center Header with Inline Icon Badges (Aeline Reference) */}
        <div style={{ textAlign: "center", maxWidth: 820, margin: "0 auto 56px" }}>
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 6,
              fontFamily: "'Inter', sans-serif",
              fontSize: 11.5,
              fontWeight: 700,
              color: "#0D1117",
              letterSpacing: "0.14em",
              textTransform: "uppercase",
              marginBottom: 18,
            }}
          >
            <span style={{ width: 5, height: 5, borderRadius: "50%", background: "#0D1117" }} />
            Tentang Platform
          </div>

          <h2
            style={{
              fontFamily: "'Poppins', sans-serif",
              fontSize: "clamp(28px, 4.2vw, 48px)",
              fontWeight: 600,
              color: "#0D1117",
              lineHeight: 1.18,
              letterSpacing: "-0.03em",
              marginBottom: 20,
            }}
          >
            Apa Itu{" "}
            <span
              aria-hidden="true"
              style={{
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                width: 42,
                height: 42,
                borderRadius: "50%",
                background: "#389BFF",
                color: "#ffffff",
                verticalAlign: "middle",
                margin: "0 4px",
              }}
            >
              <BarChart3 size={20} />
            </span>{" "}
            <span style={{ color: "#0D1117", fontWeight: 700 }}>Ravira?</span>{" "}
            <span
              aria-hidden="true"
              style={{
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                width: 42,
                height: 42,
                borderRadius: "50%",
                background: "#D4FF59",
                color: "#0D1117",
                verticalAlign: "middle",
                margin: "0 4px",
              }}
            >
              <Lightbulb size={20} />
            </span>
          </h2>

          <p
            style={{
              fontFamily: "'Inter', sans-serif",
              fontSize: 15.5,
              lineHeight: 1.75,
              color: "#4A5568",
              maxWidth: 720,
              margin: "0 auto",
            }}
          >
            Ravira adalah platform rekrutmen cerdas yang dirancang untuk menjawab masalah ketidaksesuaian antara kompetensi pencari kerja dan kebutuhan industri. Dengan AI dan data analytics, Ravira membantu kandidat membangun karier yang lebih terarah, perusahaan menemukan talenta yang tepat, serta pemerintah memahami tren kebutuhan tenaga kerja.
          </p>
        </div>

        {/* 3-Column Editorial Bento Composition matching the Reference Image */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(310px, 1fr))",
            gap: 20,
            alignItems: "stretch",
          }}
        >
          {/* Column 1: Sky-Blue Card with White Inset Card at Bottom */}
          <div
            style={{
              borderRadius: 24,
              background: "linear-gradient(180deg, #0E67CC 0%, #389BFF 100%)",
              padding: "24px",
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
              minHeight: 380,
              position: "relative",
              overflow: "hidden",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20 }}>
              <span
                style={{
                  fontFamily: "'Poppins', sans-serif",
                  fontSize: 16,
                  fontWeight: 800,
                  color: "#ffffff",
                  letterSpacing: "0.04em",
                }}
              >
                RAVIRA
              </span>
              <div
                style={{
                  width: 38,
                  height: 38,
                  borderRadius: 12,
                  background: "#ffffff",
                  color: "#0D1117",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <BarChart3 size={18} aria-hidden="true" />
              </div>
            </div>

            {/* White Inset Card */}
            <div
              style={{
                background: "#ffffff",
                borderRadius: 18,
                padding: "22px 20px",
                display: "flex",
                flexDirection: "column",
                gap: 14,
                boxShadow: "0 10px 28px rgba(8, 42, 96, 0.14)",
              }}
            >
              {highlights.map((h) => (
                <div key={h.title} style={{ display: "flex", alignItems: "flex-start", gap: 12 }}>
                  <div
                    style={{
                      width: 32,
                      height: 32,
                      borderRadius: 10,
                      background: "#F4F5F7",
                      color: "#0D1117",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      flexShrink: 0,
                    }}
                  >
                    <h.icon size={15} aria-hidden="true" />
                  </div>
                  <div>
                    <div style={{ fontFamily: "'Poppins', sans-serif", fontSize: 13.5, fontWeight: 700, color: "#0D1117", marginBottom: 2 }}>
                      {h.title}
                    </div>
                    <div style={{ fontFamily: "'Inter', sans-serif", fontSize: 12, color: "#4A5568", lineHeight: 1.5 }}>
                      {h.desc}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Column 2: Soft Alabaster Card (#F4F5F7) */}
          <div
            style={{
              borderRadius: 24,
              background: "#F4F5F7",
              padding: "28px 26px",
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
              minHeight: 380,
            }}
          >
            <div>
              <div
                style={{
                  fontFamily: "'Inter', sans-serif",
                  fontSize: 12,
                  fontWeight: 600,
                  color: "#4A5568",
                  marginBottom: 8,
                }}
              >
                AI Ecosystem Flow
              </div>
              <div
                style={{
                  fontFamily: "'Poppins', sans-serif",
                  fontSize: 38,
                  fontWeight: 700,
                  color: "#0D1117",
                  letterSpacing: "-0.03em",
                  lineHeight: 1.05,
                  marginBottom: 20,
                }}
              >
                6 Tahap
              </div>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {ecosystemSteps.map((step, i) => (
                <div
                  key={step.label}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    padding: "9px 14px",
                    borderRadius: 12,
                    background: "#ffffff",
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                    <span
                      style={{
                        width: 24,
                        height: 24,
                        borderRadius: "50%",
                        background: i % 2 === 0 ? "#0D1117" : "#D4FF59",
                        color: i % 2 === 0 ? "#ffffff" : "#0D1117",
                        fontFamily: "'Inter', sans-serif",
                        fontSize: 11,
                        fontWeight: 700,
                        display: "inline-flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      {i + 1}
                    </span>
                    <span style={{ fontFamily: "'Poppins', sans-serif", fontSize: 13.5, fontWeight: 600, color: "#0D1117" }}>
                      {step.label}
                    </span>
                  </div>
                  {i < ecosystemSteps.length - 1 && <ArrowRight size={13} color="#4A5568" aria-hidden="true" />}
                </div>
              ))}
            </div>
          </div>

          {/* Column 3: Stacked Lime-Chartreuse Card (#D4FF59) + Deep Obsidian Card (#0D1117) */}
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            <div
              style={{
                flex: 1,
                borderRadius: 24,
                background: "#D4FF59",
                padding: "28px 26px",
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
              }}
            >
              <div>
                <div
                  style={{
                    fontFamily: "'Inter', sans-serif",
                    fontSize: 12,
                    fontWeight: 600,
                    color: "#0D1117",
                    marginBottom: 8,
                  }}
                >
                  Untuk Siapa
                </div>
                <div
                  style={{
                    fontFamily: "'Poppins', sans-serif",
                    fontSize: 38,
                    fontWeight: 700,
                    color: "#0D1117",
                    letterSpacing: "-0.03em",
                    lineHeight: 1.05,
                    marginBottom: 18,
                  }}
                >
                  4 Peran
                </div>
              </div>

              <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                {[
                  { label: "Pencari Kerja", icon: Users },
                  { label: "Perusahaan", icon: Building2 },
                  { label: "Pemerintah", icon: Landmark },
                  { label: "Institusi Pendidikan", icon: GraduationCap },
                ].map((a) => (
                  <div
                    key={a.label}
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      gap: 6,
                      padding: "7px 12px",
                      borderRadius: 999,
                      background: "rgba(13, 17, 23, 0.08)",
                      fontFamily: "'Inter', sans-serif",
                      fontSize: 12.5,
                      fontWeight: 600,
                      color: "#0D1117",
                    }}
                  >
                    <a.icon size={13} color="#0D1117" aria-hidden="true" />
                    <span>{a.label}</span>
                  </div>
                ))}
              </div>
            </div>

            <div
              style={{
                borderRadius: 22,
                background: "#0D1117",
                padding: "22px 26px",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                gap: 12,
              }}
            >
              <span style={{ fontFamily: "'Inter', sans-serif", fontSize: 13, fontWeight: 500, color: "#CBD5E1" }}>
                AI Recruitment Ecosystem
              </span>
              <span style={{ fontFamily: "'Poppins', sans-serif", fontSize: 24, fontWeight: 700, color: "#ffffff" }}>
                Indonesia
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
