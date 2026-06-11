import { CheckCircle2, ArrowRight } from "lucide-react";
import { useNavigate } from "react-router";

const candidateBenefits = [
  "Rekomendasi pekerjaan sesuai profil",
  "Match score dan alasan rekomendasi yang transparan",
  "Skill gap report personal",
  "Rekomendasi kursus dan pelatihan",
  "Peluang kerja lokal, remote, hybrid, dan lintas wilayah",
  "Application tracker terintegrasi",
];

const companyBenefits = [
  "Shortlist kandidat berbasis AI",
  "Match score dan analisis skill kandidat",
  "Pipeline rekrutmen yang terstruktur",
  "Potensi reduksi time-to-hire hingga 40%",
  "Integrasi dengan ATS dan HRIS",
  "Dashboard rekrutmen real-time",
];

export function AudienceSection() {
  return (
    <section style={{ background: "#ffffff", overflow: "hidden" }}>
      <AudienceBlock
        id="kandidat"
        tag="Untuk Kandidat"
        tagColor="#1677FF"
        title="Bangun Karier dengan Rekomendasi yang"
        titleHighlight="Lebih Personal"
        desc="Ravira membantu kandidat memahami peluang terbaik berdasarkan profil, skill, pengalaman, dan preferensi karier. Setiap rekomendasi pekerjaan dilengkapi match score dan alasan yang transparan."
        benefits={candidateBenefits}
        ctaLabel="Pelajari Fitur Kandidat"
        ctaColor="#1677FF"
        ctaPath="/untuk-kandidat"
        reverse={false}
        mockupData={[
          { label: "Senior UX Designer", match: 94, company: "Tokopedia" },
          { label: "Product Designer", match: 88, company: "Gojek" },
          { label: "UI/UX Lead", match: 82, company: "Traveloka" },
        ]}
        bgColor="#ffffff"
      />

      <AudienceBlock
        id="perusahaan"
        tag="Untuk Perusahaan"
        tagColor="#0D47A1"
        title="Temukan Kandidat Tepat"
        titleHighlight="Lebih Cepat"
        desc="Ravira membantu perusahaan mengurangi waktu seleksi awal dengan shortlist kandidat berbasis AI yang mempertimbangkan skill, pengalaman, dan kecocokan terhadap kebutuhan posisi."
        benefits={companyBenefits}
        ctaLabel="Daftarkan Perusahaan"
        ctaColor="#0D47A1"
        ctaPath="/daftar/perusahaan"
        reverse={true}
        mockupData={[
          { label: "Budi Santoso", match: 96, company: "Frontend Engineer" },
          { label: "Dewi Rahayu", match: 91, company: "Data Analyst" },
          { label: "Ahmad Farhan", match: 87, company: "Backend Dev" },
        ]}
        bgColor="#f0f7ff"
      />
    </section>
  );
}

function AudienceBlock({
  id, tag, tagColor, title, titleHighlight, desc, benefits, ctaLabel, ctaColor, ctaPath, reverse, mockupData, bgColor,
}: {
  id: string; tag: string; tagColor: string; title: string; titleHighlight: string;
  desc: string; benefits: string[]; ctaLabel: string; ctaColor: string; ctaPath: string; reverse: boolean;
  mockupData: { label: string; match: number; company: string }[]; bgColor: string;
}) {
  const navigate = useNavigate();
  return (
    <div id={id} style={{ padding: "96px 24px", background: bgColor }}>
      <div style={{ maxWidth: 1280, margin: "0 auto" }}>
        <div style={{
          display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
          gap: 60, alignItems: "center",
          direction: reverse ? "rtl" : "ltr",
        }}>
          <div style={{ direction: "ltr" }}>
            <span style={{
              display: "inline-block", fontFamily: "'JetBrains Mono', monospace",
              fontSize: 11, color: tagColor, letterSpacing: "0.12em", textTransform: "uppercase",
              padding: "4px 14px", border: `1px solid ${tagColor}30`,
              borderRadius: 100, background: `${tagColor}07`, marginBottom: 20,
            }}>
              {tag}
            </span>
            <h2 style={{
              fontFamily: "'Poppins', sans-serif",
              fontSize: "clamp(22px, 3vw, 36px)", fontWeight: 800,
              color: "#0A1B3D", lineHeight: 1.2, letterSpacing: "-0.7px", marginBottom: 14,
            }}>
              {title}{" "}
              <span style={{ color: tagColor }}>{titleHighlight}</span>
            </h2>
            <p style={{ fontFamily: "'Inter', sans-serif", fontSize: 15, color: "#4a6a9a", lineHeight: 1.8, marginBottom: 24 }}>
              {desc}
            </p>

            <div style={{ display: "flex", flexDirection: "column", gap: 9, marginBottom: 28 }}>
              {benefits.map(b => (
                <div key={b} style={{ display: "flex", alignItems: "flex-start", gap: 9 }}>
                  <CheckCircle2 size={15} color={tagColor} style={{ flexShrink: 0, marginTop: 2 }} />
                  <span style={{ fontFamily: "'Inter', sans-serif", fontSize: 14, color: "#4a6a9a" }}>{b}</span>
                </div>
              ))}
            </div>

            <button
              style={{
                display: "inline-flex", alignItems: "center", gap: 8,
                fontFamily: "'Poppins', sans-serif", fontSize: 14, fontWeight: 700, color: "#fff",
                padding: "12px 24px", borderRadius: 12, border: "none",
                background: `linear-gradient(135deg, ${tagColor}, ${tagColor}cc)`,
                cursor: "pointer", boxShadow: `0 6px 20px ${tagColor}28`,
                transition: "transform 0.2s",
              }}
              onMouseEnter={e => (e.currentTarget.style.transform = "translateY(-2px)")}
              onMouseLeave={e => (e.currentTarget.style.transform = "translateY(0)")}
              onClick={() => navigate(ctaPath)}
            >
              {ctaLabel} <ArrowRight size={14} />
            </button>
          </div>

          <div style={{ direction: "ltr" }}>
            <div style={{
              padding: "24px", borderRadius: 20,
              background: "#ffffff",
              border: `1px solid ${tagColor}14`,
              boxShadow: "0 12px 48px rgba(10,27,61,0.09)",
            }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 18, paddingBottom: 14, borderBottom: "1px solid rgba(22,119,255,0.08)" }}>
                <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10, color: tagColor, textTransform: "uppercase", letterSpacing: "0.08em" }}>
                  {tag} Dashboard
                </span>
                <div style={{ display: "flex", gap: 5 }}>
                  {["#ff5f57","#febc2e","#28c840"].map(c => <div key={c} style={{ width: 8, height: 8, borderRadius: "50%", background: c }} />)}
                </div>
              </div>

              {mockupData.map((item, idx) => (
                <div key={idx} style={{
                  display: "flex", alignItems: "center", justifyContent: "space-between",
                  padding: "11px 14px", borderRadius: 10, marginBottom: 8,
                  background: idx === 0 ? `${tagColor}07` : "#f8faff",
                  border: idx === 0 ? `1px solid ${tagColor}20` : "1px solid rgba(22,119,255,0.06)",
                }}>
                  <div>
                    <div style={{ fontFamily: "'Poppins', sans-serif", fontSize: 13, fontWeight: 600, color: "#0A1B3D", marginBottom: 1 }}>{item.label}</div>
                    <div style={{ fontFamily: "'Inter', sans-serif", fontSize: 11, color: "#6a88b8" }}>{item.company}</div>
                  </div>
                  <div style={{ textAlign: "right" }}>
                    <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 16, fontWeight: 700, color: tagColor, lineHeight: 1 }}>{item.match}%</div>
                    <div style={{ fontFamily: "'Inter', sans-serif", fontSize: 9, color: "#BDE1FF", marginTop: 2 }}>match</div>
                  </div>
                </div>
              ))}

              <div style={{ marginTop: 16, paddingTop: 14, borderTop: "1px solid rgba(22,119,255,0.06)" }}>
                {[{ label: "AI Match Rate", value: 94 }, { label: "Profil Kelengkapan", value: 82 }].map(bar => (
                  <div key={bar.label} style={{ marginBottom: 10 }}>
                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
                      <span style={{ fontFamily: "'Inter', sans-serif", fontSize: 11, color: "#6a88b8" }}>{bar.label}</span>
                      <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11, color: tagColor }}>{bar.value}%</span>
                    </div>
                    <div style={{ height: 5, borderRadius: 3, background: "rgba(22,119,255,0.08)", overflow: "hidden" }}>
                      <div style={{ height: "100%", width: `${bar.value}%`, borderRadius: 3, background: `linear-gradient(90deg, ${tagColor}, ${tagColor}88)` }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
