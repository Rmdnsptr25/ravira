import { Users, Building2, Landmark, GraduationCap, ArrowRight } from "lucide-react";

const highlights = [
  { icon: Users, title: "Untuk Kandidat", desc: "Temukan pekerjaan sesuai skill, minat, lokasi, dan potensi karier.", color: "#1677FF" },
  { icon: Building2, title: "Untuk Perusahaan", desc: "Dapatkan shortlist kandidat yang lebih relevan dan tervalidasi.", color: "#0D47A1" },
  { icon: Landmark, title: "Untuk Pemerintah & Institusi", desc: "Pantau tren skill, supply-demand tenaga kerja, dan kebutuhan pelatihan daerah.", color: "#1677FF" },
];

const ecosystemSteps = [
  { label: "Kandidat", color: "#1677FF" },
  { label: "AI Matching", color: "#1677FF" },
  { label: "Skill Gap", color: "#0D47A1" },
  { label: "Training", color: "#0D47A1" },
  { label: "Job Placement", color: "#1677FF" },
  { label: "Analytics", color: "#1677FF" },
];

export function AboutSection() {
  return (
    <section id="tentang" style={{ padding: "96px 24px", background: "#ffffff", position: "relative", overflow: "hidden" }}>
      <div style={{ maxWidth: 1280, margin: "0 auto" }}>
        <div style={{ display: "flex", justifyContent: "center", marginBottom: 16 }}>
          <span style={{
            fontFamily: "'JetBrains Mono', monospace", fontSize: 11, color: "#1677FF",
            letterSpacing: "0.12em", textTransform: "uppercase",
            padding: "4px 14px", border: "1px solid rgba(22,119,255,0.25)",
            borderRadius: 100, background: "rgba(22,119,255,0.06)",
          }}>
            Tentang Platform
          </span>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: 64, alignItems: "center" }}>
          <div>
            <h2 style={{
              fontFamily: "'Poppins', sans-serif",
              fontSize: "clamp(26px, 3.5vw, 42px)", fontWeight: 800,
              color: "#0A1B3D", lineHeight: 1.15, letterSpacing: "-0.8px", marginBottom: 20,
            }}>
              Apa Itu{" "}
              <span style={{ background: "linear-gradient(90deg, #1677FF, #4DB8FF)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
                Ravira?
              </span>
            </h2>
            <p style={{ fontFamily: "'Inter', sans-serif", fontSize: 15, lineHeight: 1.8, color: "#4a6a9a", marginBottom: 32 }}>
              Ravira adalah platform rekrutmen cerdas yang dirancang untuk menjawab masalah ketidaksesuaian antara kompetensi pencari kerja dan kebutuhan industri. Dengan AI dan data analytics, Ravira membantu kandidat membangun karier yang lebih terarah, perusahaan menemukan talenta yang tepat, serta pemerintah memahami tren kebutuhan tenaga kerja.
            </p>

            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {highlights.map(h => (
                <div
                  key={h.title}
                  style={{
                    display: "flex", alignItems: "flex-start", gap: 14,
                    padding: "14px 18px", borderRadius: 12,
                    background: "#f0f7ff",
                    border: `1px solid ${h.color}16`,
                    transition: "border-color 0.2s, transform 0.2s, box-shadow 0.2s",
                  }}
                  onMouseEnter={e => { e.currentTarget.style.borderColor = `${h.color}40`; e.currentTarget.style.transform = "translateX(4px)"; e.currentTarget.style.boxShadow = "0 4px 16px rgba(22,119,255,0.1)"; }}
                  onMouseLeave={e => { e.currentTarget.style.borderColor = `${h.color}16`; e.currentTarget.style.transform = "translateX(0)"; e.currentTarget.style.boxShadow = "none"; }}
                >
                  <div style={{ width: 34, height: 34, borderRadius: 10, background: `${h.color}0e`, border: `1px solid ${h.color}22`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                    <h.icon size={16} color={h.color} />
                  </div>
                  <div>
                    <div style={{ fontFamily: "'Poppins', sans-serif", fontSize: 14, fontWeight: 700, color: "#0A1B3D", marginBottom: 2 }}>{h.title}</div>
                    <div style={{ fontFamily: "'Inter', sans-serif", fontSize: 12, color: "#6a88b8" }}>{h.desc}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div>
            <div style={{
              padding: "32px", borderRadius: 20,
              background: "#f0f7ff",
              border: "1px solid rgba(22,119,255,0.12)",
              boxShadow: "0 8px 40px rgba(10,27,61,0.07)",
            }}>
              <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10, color: "#1677FF", textTransform: "uppercase", letterSpacing: "0.12em", marginBottom: 24 }}>
                AI Ecosystem Flow
              </div>

              <div style={{ display: "flex", flexDirection: "column" }}>
                {ecosystemSteps.map((step, i) => (
                  <div key={step.label} style={{ display: "flex", alignItems: "center" }}>
                    <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                      <div style={{
                        width: 38, height: 38, borderRadius: 10,
                        background: `${step.color}0e`, border: `1px solid ${step.color}30`,
                        display: "flex", alignItems: "center", justifyContent: "center",
                        fontFamily: "'JetBrains Mono', monospace", fontSize: 11, fontWeight: 700, color: step.color,
                      }}>
                        {i + 1}
                      </div>
                      {i < ecosystemSteps.length - 1 && (
                        <div style={{ width: 1, height: 20, background: `linear-gradient(180deg, ${step.color}44, ${ecosystemSteps[i + 1].color}22)` }} />
                      )}
                    </div>
                    <div style={{ marginLeft: 14, marginBottom: i < ecosystemSteps.length - 1 ? 20 : 0, display: "flex", alignItems: "center", gap: 8 }}>
                      <span style={{ fontFamily: "'Poppins', sans-serif", fontSize: 14, fontWeight: 600, color: "#0A1B3D" }}>{step.label}</span>
                      {i < ecosystemSteps.length - 1 && <ArrowRight size={11} color="#BDE1FF" />}
                    </div>
                  </div>
                ))}
              </div>

              <div style={{ marginTop: 28, paddingTop: 20, borderTop: "1px solid rgba(22,119,255,0.1)" }}>
                <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10, color: "#1677FF", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 12 }}>Untuk Siapa</div>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                  {[
                    { label: "Pencari Kerja", icon: Users },
                    { label: "Perusahaan", icon: Building2 },
                    { label: "Pemerintah", icon: Landmark },
                    { label: "Institusi Pendidikan", icon: GraduationCap },
                  ].map(a => (
                    <div key={a.label} style={{
                      display: "flex", alignItems: "center", gap: 5,
                      padding: "5px 10px", borderRadius: 7,
                      background: "rgba(22,119,255,0.07)", border: "1px solid rgba(22,119,255,0.18)",
                      fontFamily: "'Inter', sans-serif", fontSize: 12, fontWeight: 500, color: "#1677FF",
                    }}>
                      <a.icon size={11} color="#1677FF" /> {a.label}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
