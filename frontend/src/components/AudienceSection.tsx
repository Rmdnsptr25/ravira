import { CheckCircle2, ArrowUpRight } from "lucide-react";
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
        title="Bangun Karier dengan Rekomendasi yang"
        titleHighlight="Lebih Personal"
        desc="Ravira membantu kandidat memahami peluang terbaik berdasarkan profil, skill, pengalaman, dan preferensi karier. Setiap rekomendasi pekerjaan dilengkapi match score dan alasan yang transparan."
        benefits={candidateBenefits}
        ctaLabel="Pelajari Fitur Kandidat"
        ctaPath="/untuk-kandidat"
        reverse={false}
        cardTheme="blue"
        mockupData={[
          { label: "Senior UX Designer", match: 94, company: "Tokopedia" },
          { label: "Product Designer", match: 88, company: "Gojek" },
          { label: "UI/UX Lead", match: 82, company: "Traveloka" },
        ]}
      />

      <AudienceBlock
        id="perusahaan"
        tag="Untuk Perusahaan"
        title="Temukan Kandidat Tepat"
        titleHighlight="Lebih Cepat"
        desc="Ravira membantu perusahaan mengurangi waktu seleksi awal dengan shortlist kandidat berbasis AI yang mempertimbangkan skill, pengalaman, dan kecocokan terhadap kebutuhan posisi."
        benefits={companyBenefits}
        ctaLabel="Daftarkan Perusahaan"
        ctaPath="/daftar/perusahaan"
        reverse={true}
        cardTheme="dark"
        mockupData={[
          { label: "Budi Santoso", match: 96, company: "Frontend Engineer" },
          { label: "Dewi Rahayu", match: 91, company: "Data Analyst" },
          { label: "Ahmad Farhan", match: 87, company: "Backend Dev" },
        ]}
      />
    </section>
  );
}

function AudienceBlock({
  id,
  tag,
  title,
  titleHighlight,
  desc,
  benefits,
  ctaLabel,
  ctaPath,
  reverse,
  cardTheme,
  mockupData,
}: {
  id: string;
  tag: string;
  title: string;
  titleHighlight: string;
  desc: string;
  benefits: string[];
  ctaLabel: string;
  ctaPath: string;
  reverse: boolean;
  cardTheme: "blue" | "dark";
  mockupData: { label: string; match: number; company: string }[];
}) {
  const navigate = useNavigate();
  const isBlue = cardTheme === "blue";

  return (
    <div id={id} style={{ padding: "76px 24px", background: "#ffffff" }}>
      <div style={{ maxWidth: 1200, margin: "0 auto" }}>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
            gap: 56,
            alignItems: "center",
            direction: reverse ? "rtl" : "ltr",
          }}
        >
          <div style={{ direction: "ltr" }}>
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
                marginBottom: 16,
              }}
            >
              <span style={{ width: 5, height: 5, borderRadius: "50%", background: "#0D1117" }} />
              {tag}
            </div>

            <h2
              style={{
                fontFamily: "'Poppins', sans-serif",
                fontSize: "clamp(24px, 3.4vw, 38px)",
                fontWeight: 600,
                color: "#0D1117",
                lineHeight: 1.2,
                letterSpacing: "-0.03em",
                marginBottom: 16,
              }}
            >
              {title}{" "}
              <span style={{ color: "#4A5568" }}>{titleHighlight}</span>
            </h2>

            <p style={{ fontFamily: "'Inter', sans-serif", fontSize: 15, color: "#4A5568", lineHeight: 1.75, marginBottom: 24 }}>
              {desc}
            </p>

            <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 28 }}>
              {benefits.map((b) => (
                <div key={b} style={{ display: "flex", alignItems: "flex-start", gap: 10 }}>
                  <CheckCircle2 size={16} color="#0E67CC" style={{ flexShrink: 0, marginTop: 2 }} aria-hidden="true" />
                  <span style={{ fontFamily: "'Inter', sans-serif", fontSize: 14, color: "#0D1117", fontWeight: 500 }}>{b}</span>
                </div>
              ))}
            </div>

            <button
              type="button"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 12,
                fontFamily: "'Inter', sans-serif",
                fontSize: 12,
                fontWeight: 700,
                letterSpacing: "0.08em",
                textTransform: "uppercase",
                color: "#0D1117",
                padding: "7px 8px 7px 22px",
                minHeight: 46,
                borderRadius: 999,
                border: "none",
                background: "#D4FF59",
                cursor: "pointer",
                transition: "transform 0.2s",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.transform = "translateY(-1px)")}
              onMouseLeave={(e) => (e.currentTarget.style.transform = "translateY(0)")}
              onClick={() => navigate(ctaPath)}
            >
              <span>{ctaLabel}</span>
              <span
                aria-hidden="true"
                style={{
                  width: 32,
                  height: 32,
                  borderRadius: "50%",
                  background: "#0D1117",
                  color: "#D4FF59",
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <ArrowUpRight size={15} />
              </span>
            </button>
          </div>

          <div style={{ direction: "ltr" }}>
            <div
              style={{
                padding: "26px",
                borderRadius: 24,
                background: isBlue ? "linear-gradient(180deg, #0E67CC 0%, #389BFF 100%)" : "#0D1117",
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 18 }}>
                <span
                  style={{
                    fontFamily: "'Inter', sans-serif",
                    fontSize: 11.5,
                    fontWeight: 700,
                    color: "#ffffff",
                    textTransform: "uppercase",
                    letterSpacing: "0.1em",
                  }}
                >
                  {tag} Dashboard
                </span>
                <span
                  style={{
                    padding: "4px 10px",
                    borderRadius: 999,
                    background: "#D4FF59",
                    color: "#0D1117",
                    fontFamily: "'Inter', sans-serif",
                    fontSize: 10.5,
                    fontWeight: 700,
                  }}
                >
                  AI Match
                </span>
              </div>

              <div
                style={{
                  background: "#ffffff",
                  borderRadius: 18,
                  padding: "18px",
                }}
              >
                {mockupData.map((item, idx) => (
                  <div
                    key={idx}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      padding: "11px 14px",
                      borderRadius: 12,
                      marginBottom: 8,
                      background: idx === 0 ? "#F4F5F7" : "#ffffff",
                      border: "1px solid rgba(13, 17, 23, 0.07)",
                    }}
                  >
                    <div>
                      <div style={{ fontFamily: "'Poppins', sans-serif", fontSize: 13.5, fontWeight: 700, color: "#0D1117", marginBottom: 1 }}>
                        {item.label}
                      </div>
                      <div style={{ fontFamily: "'Inter', sans-serif", fontSize: 11.5, color: "#4A5568" }}>{item.company}</div>
                    </div>
                    <div style={{ textAlign: "right" }}>
                      <div style={{ fontFamily: "'Poppins', sans-serif", fontSize: 17, fontWeight: 800, color: "#0D1117", lineHeight: 1 }}>
                        {item.match}%
                      </div>
                      <div style={{ fontFamily: "'Inter', sans-serif", fontSize: 10, color: "#4A5568", marginTop: 2 }}>match</div>
                    </div>
                  </div>
                ))}

                <div style={{ marginTop: 14, paddingTop: 12, borderTop: "1px solid rgba(13,17,23,0.08)" }}>
                  {[
                    { label: "AI Match Rate", value: 94 },
                    { label: "Profil Kelengkapan", value: 82 },
                  ].map((bar) => (
                    <div key={bar.label} style={{ marginBottom: 8 }}>
                      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
                        <span style={{ fontFamily: "'Inter', sans-serif", fontSize: 11.5, color: "#4A5568", fontWeight: 500 }}>{bar.label}</span>
                        <span style={{ fontFamily: "'Poppins', sans-serif", fontSize: 11.5, fontWeight: 700, color: "#0D1117" }}>{bar.value}%</span>
                      </div>
                      <div style={{ height: 6, borderRadius: 999, background: "#E2E8F0", overflow: "hidden" }}>
                        <div style={{ height: "100%", width: `${bar.value}%`, borderRadius: 999, background: "#0E67CC" }} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
