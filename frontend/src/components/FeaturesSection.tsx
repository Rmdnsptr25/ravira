import { useRef } from "react";
import { Cpu, TrendingUp, BookOpen, BarChart3, Globe, ChevronLeft, ChevronRight } from "lucide-react";

const features = [
  {
    icon: Cpu,
    title: "Smart Job Matching",
    desc: "Pencocokan pekerjaan berbasis AI yang mempertimbangkan skill, pengalaman, lokasi, preferensi gaji, dan potensi karier.",
    tag: "AI CORE",
    variant: "blue" as const,
  },
  {
    icon: TrendingUp,
    title: "Skill Gap Advisor",
    desc: "Analisis kesenjangan kompetensi kandidat dibanding kebutuhan industri aktual secara real-time.",
    tag: "ANALYTICS",
    variant: "light" as const,
  },
  {
    icon: BookOpen,
    title: "Personalized Training",
    desc: "Rekomendasi jalur belajar dan kursus berdasarkan skill gap kandidat dari platform mitra terpercaya.",
    tag: "LEARNING",
    variant: "lime" as const,
  },
  {
    icon: BarChart3,
    title: "Job-Workforce Analytics",
    desc: "Dashboard analitik komprehensif untuk perusahaan, pemerintah, dan institusi pendidikan.",
    tag: "DATA",
    variant: "dark" as const,
  },
  {
    icon: Globe,
    title: "Cross-Region Matching",
    desc: "Membuka peluang kerja lintas wilayah untuk talenta daerah di seluruh Indonesia.",
    tag: "NETWORK",
    variant: "light" as const,
  },
];

export function FeaturesSection() {
  const scrollRef = useRef<HTMLDivElement>(null);

  const scrollByAmount = (dir: "left" | "right") => {
    if (!scrollRef.current) return;
    scrollRef.current.scrollBy({
      left: dir === "left" ? -340 : 340,
      behavior: "smooth",
    });
  };

  return (
    <section id="fitur" style={{ padding: "84px 24px", background: "#ffffff", position: "relative" }}>
      <div style={{ maxWidth: 1280, margin: "0 auto" }}>
        <div style={{ display: "flex", flexWrap: "wrap", alignItems: "flex-end", justifyContent: "space-between", gap: 20, marginBottom: 40 }}>
          <div style={{ maxWidth: 740 }}>
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
              Core Features
            </div>

            <h2
              style={{
                fontFamily: "'Poppins', sans-serif",
                fontSize: "clamp(28px, 4vw, 44px)",
                fontWeight: 600,
                color: "#0D1117",
                lineHeight: 1.18,
                letterSpacing: "-0.03em",
                marginBottom: 12,
              }}
            >
              Teknologi AI{" "}
              <span
                aria-hidden="true"
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                  width: 38,
                  height: 38,
                  borderRadius: "50%",
                  background: "#389BFF",
                  color: "#ffffff",
                  verticalAlign: "middle",
                  margin: "0 4px",
                }}
              >
                <Cpu size={18} />
              </span>{" "}
              <span style={{ color: "#4A5568" }}>yang Bekerja untuk Anda</span>
            </h2>

            <p style={{ fontFamily: "'Inter', sans-serif", fontSize: 15.5, color: "#4A5568", lineHeight: 1.65 }}>
              Lima pilar teknologi Ravira yang membentuk ekosistem rekrutmen terpadu.
            </p>
          </div>

          {/* Horizontal Scroll Controls */}
          <div style={{ display: "flex", gap: 10 }}>
            <button
              type="button"
              aria-label="Geser fitur ke kiri"
              onClick={() => scrollByAmount("left")}
              style={{
                width: 44,
                height: 44,
                borderRadius: "50%",
                border: "1px solid #E2E8F0",
                background: "#F4F5F7",
                color: "#0D1117",
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                cursor: "pointer",
              }}
            >
              <ChevronLeft size={18} />
            </button>
            <button
              type="button"
              aria-label="Geser fitur ke kanan"
              onClick={() => scrollByAmount("right")}
              style={{
                width: 44,
                height: 44,
                borderRadius: "50%",
                border: "none",
                background: "#0D1117",
                color: "#D4FF59",
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                cursor: "pointer",
              }}
            >
              <ChevronRight size={18} />
            </button>
          </div>
        </div>

        <div
          ref={scrollRef}
          className="horizontal-card-track ravira-no-scrollbar"
          style={{
            display: "flex",
            gap: 18,
            overflowX: "auto",
            scrollSnapType: "x mandatory",
            paddingBottom: 4,
            scrollbarWidth: "none",
            msOverflowStyle: "none",
          }}
        >
          {features.map((f) => {
            const isBlue = f.variant === "blue";
            const isLime = f.variant === "lime";
            const isDark = f.variant === "dark";

            const cardBg = isBlue
              ? "linear-gradient(180deg, #0E67CC 0%, #389BFF 100%)"
              : isLime
                ? "#D4FF59"
                : isDark
                  ? "#0D1117"
                  : "#F4F5F7";

            const titleColor = isBlue || isDark ? "#ffffff" : "#0D1117";
            const descColor = isBlue ? "#EFF6FF" : isDark ? "#CBD5E1" : "#374151";
            const badgeBg = isBlue || isDark ? "rgba(255,255,255,0.16)" : "rgba(13,17,23,0.08)";
            const badgeText = isBlue || isDark ? "#ffffff" : "#0D1117";

            return (
              <div
                key={f.title}
                style={{
                  flex: "0 0 296px",
                  scrollSnapAlign: "start",
                  padding: "28px 24px",
                  borderRadius: 24,
                  background: cardBg,
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-between",
                  minHeight: 264,
                  transition: "transform 0.2s ease",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = "translateY(-4px)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = "translateY(0)";
                }}
              >
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 24 }}>
                  <span
                    style={{
                      fontFamily: "'Inter', sans-serif",
                      fontSize: 10.5,
                      fontWeight: 700,
                      color: badgeText,
                      letterSpacing: "0.1em",
                      padding: "5px 12px",
                      borderRadius: 999,
                      background: badgeBg,
                    }}
                  >
                    {f.tag}
                  </span>

                  <div
                    style={{
                      width: 40,
                      height: 40,
                      borderRadius: "50%",
                      background: isBlue || isDark ? "#ffffff" : "#0D1117",
                      color: isBlue || isDark ? "#0D1117" : "#D4FF59",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <f.icon size={18} aria-hidden="true" />
                  </div>
                </div>

                <div>
                  <h3
                    style={{
                      fontFamily: "'Poppins', sans-serif",
                      fontSize: 18,
                      fontWeight: 700,
                      color: titleColor,
                      marginBottom: 10,
                      lineHeight: 1.3,
                      letterSpacing: "-0.02em",
                    }}
                  >
                    {f.title}
                  </h3>
                  <p style={{ fontFamily: "'Inter', sans-serif", fontSize: 13.5, color: descColor, lineHeight: 1.65 }}>
                    {f.desc}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
