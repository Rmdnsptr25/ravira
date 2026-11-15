import { ArrowUpRight, User, Building2, Landmark } from "lucide-react";
import { useNavigate } from "react-router";
import cityImage from "../../imports/WhatsApp_Image_2026-05-28_at_19.43.24-1.jpeg";
import { RaviraOwlIcon } from "./RaviraLogo";

const ekosistemCards = [
  {
    icon: User,
    variant: "white" as const,
    label: "Kandidat",
    desc: "Rekomendasi pekerjaan berbasis AI, analisis skill gap, dan peluang karier lintas wilayah.",
    cta: "Lihat Portal Kandidat",
    path: "/untuk-kandidat",
  },
  {
    icon: Building2,
    variant: "dark" as const,
    label: "Perusahaan",
    desc: "Shortlist kandidat berbasis AI, pipeline rekrutmen, dan insight rekrutmen berbasis data.",
    cta: "Lihat Solusi Perusahaan",
    path: "/untuk-perusahaan",
  },
  {
    icon: Landmark,
    variant: "lime" as const,
    label: "Pemerintah / Institusi",
    desc: "Workforce analytics agregat untuk mendukung kebijakan ketenagakerjaan berbasis data.",
    cta: "Lihat Analytics",
    path: "/untuk-pemerintah",
  },
];

export function CTASection() {
  const navigate = useNavigate();
  return (
    <section
      style={{
        padding: "24px 16px 64px",
        background: "#FFFFFF",
      }}
    >
      <div
        style={{
          maxWidth: 1360,
          margin: "0 auto",
          borderRadius: 28,
          background: "linear-gradient(180deg, #0849A8 0%, #0E67CC 48%, #389BFF 100%)",
          padding: "76px 28px",
          position: "relative",
          overflow: "hidden",
          boxShadow: "0 20px 60px rgba(8, 73, 168, 0.14)",
        }}
      >
        {/* Background image with overlay */}
        <div style={{ position: "absolute", inset: 0, overflow: "hidden", pointerEvents: "none" }}>
          <img
            src={cityImage}
            alt=""
            aria-hidden
            width={1600}
            height={900}
            style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "center", opacity: 0.12, mixBlendMode: "screen" }}
          />
          <div
            style={{
              position: "absolute",
              inset: 0,
              background:
                "linear-gradient(180deg, rgba(8,73,168,0.88) 0%, rgba(14,103,204,0.72) 55%, rgba(56,155,255,0.82) 100%)",
            }}
          />
        </div>

        <div style={{ maxWidth: 1080, margin: "0 auto", textAlign: "center", position: "relative", zIndex: 10 }}>
          <div style={{ display: "flex", justifyContent: "center", marginBottom: 18 }}>
            <RaviraOwlIcon size={52} />
          </div>

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
            Ekosistem Ravira
          </p>

          <h2
            style={{
              fontFamily: "'Poppins', sans-serif",
              fontSize: "clamp(28px, 4vw, 48px)",
              fontWeight: 600,
              color: "#FFFFFF",
              lineHeight: 1.12,
              letterSpacing: "-1.4px",
              marginBottom: 16,
            }}
          >
            Jelajahi Ekosistem Ravira
          </h2>

          <p
            style={{
              fontFamily: "'Inter', sans-serif",
              fontSize: 15,
              color: "rgba(255,255,255,0.92)",
              lineHeight: 1.7,
              maxWidth: 560,
              margin: "0 auto 48px",
            }}
          >
            Ravira hadir untuk tiga peran utama dalam ekosistem ketenagakerjaan Indonesia. Pilih portal yang sesuai untuk mengetahui lebih lanjut.
          </p>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 20, textAlign: "left" }}>
            {ekosistemCards.map((card) => {
              const Icon = card.icon;
              const isDark = card.variant === "dark";
              const isLime = card.variant === "lime";

              const cardBg = isDark ? "#0D1117" : isLime ? "#D4FF59" : "#FFFFFF";
              const labelColor = isDark ? "#FFFFFF" : "#0D1117";
              const descColor = isDark ? "#CBD5E1" : isLime ? "#1E293B" : "#4A5568";
              const iconBg = isDark ? "#D4FF59" : isLime ? "#0D1117" : "#F4F5F7";
              const iconColor = isLime ? "#D4FF59" : "#0D1117";

              const btnBg = isDark ? "#D4FF59" : "#0D1117";
              const btnColor = isDark ? "#0D1117" : "#FFFFFF";
              const arrowBg = isDark ? "#0D1117" : "#D4FF59";
              const arrowColor = isDark ? "#FFFFFF" : "#0D1117";

              return (
                <div
                  key={card.label}
                  style={{
                    background: cardBg,
                    borderRadius: 24,
                    padding: "28px 24px",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "space-between",
                    boxShadow: "0 18px 42px rgba(8, 28, 68, 0.18)",
                    transition: "transform 0.2s",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = "translateY(-4px)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = "translateY(0)";
                  }}
                >
                  <div>
                    <div
                      style={{
                        width: 46,
                        height: 46,
                        borderRadius: 14,
                        background: iconBg,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        marginBottom: 18,
                      }}
                    >
                      <Icon size={20} color={iconColor} />
                    </div>
                    <div
                      style={{
                        fontFamily: "'Poppins', sans-serif",
                        fontSize: 18,
                        fontWeight: 600,
                        color: labelColor,
                        marginBottom: 8,
                      }}
                    >
                      {card.label}
                    </div>
                    <p
                      style={{
                        fontFamily: "'Inter', sans-serif",
                        fontSize: 13,
                        color: descColor,
                        lineHeight: 1.65,
                        marginBottom: 24,
                      }}
                    >
                      {card.desc}
                    </p>
                  </div>

                  <div>
                    <button
                      onClick={() => navigate(card.path)}
                      style={{
                        display: "inline-flex",
                        alignItems: "center",
                        gap: 10,
                        fontFamily: "'Inter', sans-serif",
                        fontSize: 12,
                        fontWeight: 700,
                        letterSpacing: "0.06em",
                        textTransform: "uppercase",
                        color: btnColor,
                        background: btnBg,
                        border: "none",
                        borderRadius: 100,
                        padding: "6px 6px 6px 18px",
                        minHeight: 44,
                        cursor: "pointer",
                        transition: "transform 0.2s",
                      }}
                    >
                      <span>{card.cta}</span>
                      <span
                        style={{
                          width: 32,
                          height: 32,
                          borderRadius: "50%",
                          background: arrowBg,
                          color: arrowColor,
                          display: "inline-flex",
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                      >
                        <ArrowUpRight size={14} />
                      </span>
                    </button>
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
