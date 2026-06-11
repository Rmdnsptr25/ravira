import { ArrowRight, User, Building2, Landmark } from "lucide-react";
import { useNavigate } from "react-router";
import cityImage from "../../imports/WhatsApp_Image_2026-05-28_at_19.43.24-1.jpeg";
import { RaviraOwlIcon } from "./RaviraLogo";

const ekosistemCards = [
  {
    icon: User,
    color: "#1677FF",
    bg: "rgba(22,119,255,0.1)",
    border: "rgba(22,119,255,0.2)",
    label: "Kandidat",
    desc: "Rekomendasi pekerjaan berbasis AI, analisis skill gap, dan peluang karier lintas wilayah.",
    cta: "Lihat Portal Kandidat",
    path: "/untuk-kandidat",
  },
  {
    icon: Building2,
    color: "#8b5cf6",
    bg: "rgba(139,92,246,0.1)",
    border: "rgba(139,92,246,0.2)",
    label: "Perusahaan",
    desc: "Shortlist kandidat berbasis AI, pipeline rekrutmen, dan insight rekrutmen berbasis data.",
    cta: "Lihat Solusi Perusahaan",
    path: "/untuk-perusahaan",
  },
  {
    icon: Landmark,
    color: "#4DB8FF",
    bg: "rgba(77,184,255,0.1)",
    border: "rgba(77,184,255,0.2)",
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
        padding: "100px 24px",
        background: "#071228",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Background image with overlay */}
      <div style={{ position: "absolute", inset: 0, overflow: "hidden" }}>
        <img
          src={cityImage}
          alt=""
          aria-hidden
          style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "center", opacity: 0.07 }}
        />
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(135deg, rgba(7,18,40,0.97) 0%, rgba(10,27,61,0.9) 50%, rgba(7,18,40,0.97) 100%)" }} />
      </div>

      <div style={{ position: "absolute", inset: 0, background: "radial-gradient(ellipse 60% 40% at 50% 50%, rgba(30,107,255,0.12) 0%, transparent 70%)", pointerEvents: "none" }} />

      <div style={{ maxWidth: 960, margin: "0 auto", textAlign: "center", position: "relative", zIndex: 10 }}>
        <div style={{ display: "flex", justifyContent: "center", marginBottom: 20 }}>
          <RaviraOwlIcon size={56} />
        </div>

        <span style={{
          display: "inline-block",
          fontFamily: "'JetBrains Mono', monospace",
          fontSize: 11, color: "#4DB8FF", letterSpacing: "0.12em", textTransform: "uppercase",
          padding: "4px 12px", border: "1px solid rgba(77,184,255,0.25)",
          borderRadius: 100, background: "rgba(22,119,255,0.07)", marginBottom: 24,
        }}>
          Ekosistem Ravira
        </span>

        <h2 style={{
          fontFamily: "'Poppins', sans-serif",
          fontSize: "clamp(26px, 4vw, 48px)",
          fontWeight: 800, color: "#ffffff", lineHeight: 1.1,
          letterSpacing: "-1.5px", marginBottom: 16,
        }}>
          Jelajahi Ekosistem Ravira
        </h2>

        <p style={{
          fontFamily: "'Inter', sans-serif", fontSize: 16, color: "#4a6a9a",
          lineHeight: 1.7, marginBottom: 52, maxWidth: 560, margin: "0 auto 52px",
        }}>
          Ravira hadir untuk tiga peran utama dalam ekosistem ketenagakerjaan Indonesia. Pilih portal yang sesuai untuk mengetahui lebih lanjut.
        </p>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: 20, textAlign: "left" }}>
          {ekosistemCards.map((card) => {
            const Icon = card.icon;
            return (
              <div
                key={card.label}
                style={{
                  background: "rgba(255,255,255,0.04)",
                  border: `1px solid ${card.border}`,
                  borderRadius: 20,
                  padding: "28px 24px",
                  backdropFilter: "blur(10px)",
                  transition: "transform 0.2s, border-color 0.2s",
                }}
                onMouseEnter={(e) => { e.currentTarget.style.transform = "translateY(-4px)"; e.currentTarget.style.borderColor = card.color + "50"; }}
                onMouseLeave={(e) => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.borderColor = card.border; }}
              >
                <div style={{ width: 48, height: 48, borderRadius: 14, background: card.bg, display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 16 }}>
                  <Icon size={22} color={card.color} />
                </div>
                <div style={{ fontFamily: "'Poppins', sans-serif", fontSize: 16, fontWeight: 700, color: "#fff", marginBottom: 8 }}>{card.label}</div>
                <p style={{ fontFamily: "'Inter', sans-serif", fontSize: 13, color: "#6a88b8", lineHeight: 1.7, marginBottom: 20 }}>{card.desc}</p>
                <button
                  onClick={() => navigate(card.path)}
                  style={{
                    display: "inline-flex", alignItems: "center", gap: 6,
                    fontFamily: "'Inter', sans-serif", fontSize: 13, fontWeight: 600,
                    color: card.color, background: "none", border: `1px solid ${card.border}`,
                    borderRadius: 8, padding: "8px 16px", cursor: "pointer",
                    transition: "background 0.2s",
                  }}
                  onMouseEnter={(e) => { e.currentTarget.style.background = card.bg; }}
                  onMouseLeave={(e) => { e.currentTarget.style.background = "none"; }}
                >
                  {card.cta} <ArrowRight size={13} />
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
