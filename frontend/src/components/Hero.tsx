import { ArrowUpRight, Play, Brain, BarChart3, GraduationCap, Globe } from "lucide-react";
import { useNavigate } from "react-router";
import cityImage from "../../imports/WhatsApp_Image_2026-05-28_at_19.43.24-2.jpeg";
import { RaviraOwlIcon } from "./RaviraLogo";

const badges = [
  { icon: Brain, label: "AI-Powered Matching" },
  { icon: BarChart3, label: "Skill Gap Analysis" },
  { icon: GraduationCap, label: "Personalized Training" },
  { icon: Globe, label: "Cross-Region" },
];

export function Hero() {
  const navigate = useNavigate();
  return (
    <section
      id="beranda"
      style={{
        background: "#ffffff",
        padding: "14px 14px 8px",
      }}
    >
      <style>{`
        @keyframes heroFloatOuterLeft {
          0%, 100% { transform: rotateY(22deg) rotateZ(-3deg) translateY(10px); }
          50% { transform: rotateY(20deg) rotateZ(-2deg) translateY(-2px); }
        }
        @keyframes heroFloatMidLeft {
          0%, 100% { transform: rotateY(14deg) rotateZ(-1.5deg) translateY(4px); }
          50% { transform: rotateY(12deg) rotateZ(-0.8deg) translateY(-8px); }
        }
        @keyframes heroFloatInnerLeft {
          0%, 100% { transform: rotateY(6deg) rotateZ(-0.5deg) translateY(0px); }
          50% { transform: rotateY(4deg) rotateZ(0deg) translateY(-10px); }
        }
        @keyframes heroFloatInnerRight {
          0%, 100% { transform: rotateY(-4deg) rotateZ(0.5deg) translateY(0px); }
          50% { transform: rotateY(-2deg) rotateZ(0deg) translateY(-12px); }
        }
        @keyframes heroFloatMidRight {
          0%, 100% { transform: rotateY(-12deg) rotateZ(1.5deg) translateY(4px); }
          50% { transform: rotateY(-10deg) rotateZ(0.8deg) translateY(-8px); }
        }
        @keyframes heroFloatOuterRight {
          0%, 100% { transform: rotateY(-20deg) rotateZ(2.5deg) translateY(10px); }
          50% { transform: rotateY(-18deg) rotateZ(1.5deg) translateY(-2px); }
        }
        @keyframes heroBarPulse {
          0%, 100% { transform: scaleY(1); }
          50% { transform: scaleY(0.84); }
        }
        @keyframes heroStarSpin {
          0%, 100% { transform: scale(1) rotate(0deg); }
          50% { transform: scale(1.15) rotate(18deg); }
        }
        .hero-fan-card {
          transition: transform 0.35s cubic-bezier(0.22, 1, 0.36, 1), box-shadow 0.35s ease !important;
          will-change: transform;
        }
        .hero-fan-card:hover {
          animation-play-state: paused !important;
          transform: rotateY(0deg) rotateZ(0deg) translateY(-14px) scale(1.05) !important;
          box-shadow: 0 24px 48px rgba(7, 28, 68, 0.28) !important;
          z-index: 20;
        }
        .hero-fan-1 { animation: heroFloatOuterLeft 4.6s ease-in-out infinite; }
        .hero-fan-2 { animation: heroFloatMidLeft 4.6s ease-in-out 0.45s infinite; }
        .hero-fan-3 { animation: heroFloatInnerLeft 4.6s ease-in-out 0.9s infinite; }
        .hero-fan-4 { animation: heroFloatInnerRight 4.6s ease-in-out 1.35s infinite; }
        .hero-fan-5 { animation: heroFloatMidRight 4.6s ease-in-out 1.8s infinite; }
        .hero-fan-6 { animation: heroFloatOuterRight 4.6s ease-in-out 2.25s infinite; }
      `}</style>
      <div
        style={{
          position: "relative",
          borderRadius: 28,
          overflow: "hidden",
          background: "linear-gradient(180deg, #0849A8 0%, #0E67CC 42%, #1E82EB 74%, #4EA6FF 100%)",
          minHeight: 740,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "space-between",
          boxShadow: "0 18px 48px rgba(8, 73, 168, 0.14)",
        }}
      >
        {/* Subtle cityscape texture blended into the sky horizon */}
        <img
          src={cityImage}
          alt=""
          aria-hidden="true"
          width={1600}
          height={900}
          fetchPriority="high"
          style={{
            position: "absolute",
            inset: 0,
            width: "100%",
            height: "100%",
            objectFit: "cover",
            objectPosition: "center bottom",
            opacity: 0.14,
            mixBlendMode: "luminosity",
            zIndex: 0,
          }}
        />

        {/* Sky & Cloud atmospheric layers */}
        <div
          aria-hidden="true"
          style={{
            position: "absolute",
            inset: 0,
            zIndex: 1,
            background:
              "radial-gradient(ellipse 85% 42% at 50% 98%, rgba(255,255,255,0.92) 0%, rgba(226,242,255,0.62) 38%, rgba(30,130,235,0) 74%), radial-gradient(circle at 14% 78%, rgba(255,255,255,0.75) 0%, rgba(255,255,255,0.28) 22%, transparent 48%), radial-gradient(circle at 86% 80%, rgba(255,255,255,0.78) 0%, rgba(255,255,255,0.26) 24%, transparent 50%), radial-gradient(circle at 28% 88%, rgba(255,255,255,0.85) 0%, transparent 38%), radial-gradient(circle at 72% 88%, rgba(255,255,255,0.85) 0%, transparent 38%)",
            pointerEvents: "none",
          }}
        />

        {/* Top readability scrim behind headline */}
        <div
          aria-hidden="true"
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            height: "62%",
            zIndex: 1,
            background: "linear-gradient(180deg, rgba(6, 48, 112, 0.72) 0%, rgba(10, 74, 160, 0.45) 68%, transparent 100%)",
            pointerEvents: "none",
          }}
        />

        {/* ── HERO COPY & CTAs ── */}
        <div
          style={{
            position: "relative",
            zIndex: 10,
            maxWidth: 840,
            width: "100%",
            padding: "118px 24px 28px",
            textAlign: "center",
          }}
        >
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
            Temukan Pekerjaan, Raih Masa Depan
          </p>

          <h1
            style={{
              fontFamily: "'Poppins', sans-serif",
              fontSize: "clamp(36px, 5.4vw, 66px)",
              fontWeight: 600,
              lineHeight: 1.08,
              letterSpacing: "-0.03em",
              color: "#ffffff",
              marginBottom: 18,
            }}
          >
            You relax,{" "}
            <span style={{ color: "#ffffff", fontWeight: 700 }}>
              AI will find you a Job
            </span>
          </h1>

          <p
            style={{
              fontFamily: "'Inter', sans-serif",
              fontSize: 15.5,
              color: "#ffffff",
              lineHeight: 1.7,
              maxWidth: 560,
              margin: "0 auto 30px",
              opacity: 0.94,
            }}
          >
            Ravira menghubungkan talenta dengan peluang kerja paling relevan menggunakan kecerdasan buatan, dari analisis skill gap hingga rekomendasi pelatihan personal di seluruh Indonesia.
          </p>

          {/* Dual Pill CTAs (Aeline reference layout) */}
          <div style={{ display: "flex", gap: 12, flexWrap: "wrap", justifyContent: "center", alignItems: "center" }}>
            <button
              type="button"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 8,
                fontFamily: "'Inter', sans-serif",
                fontSize: 12,
                fontWeight: 600,
                letterSpacing: "0.08em",
                textTransform: "uppercase",
                color: "#ffffff",
                padding: "13px 26px",
                minHeight: 48,
                borderRadius: 999,
                border: "1px solid rgba(255, 255, 255, 0.28)",
                background: "rgba(6, 42, 96, 0.58)",
                cursor: "pointer",
                transition: "background 0.2s, border-color 0.2s",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = "rgba(6, 42, 96, 0.8)";
                e.currentTarget.style.borderColor = "rgba(255, 255, 255, 0.55)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = "rgba(6, 42, 96, 0.58)";
                e.currentTarget.style.borderColor = "rgba(255, 255, 255, 0.28)";
              }}
              onClick={() => document.getElementById("preview")?.scrollIntoView({ behavior: "smooth" })}
            >
              <Play size={13} fill="currentColor" aria-hidden="true" /> Lihat Demo
            </button>

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
                padding: "7px 8px 7px 24px",
                minHeight: 48,
                borderRadius: 999,
                border: "none",
                background: "#D4FF59",
                cursor: "pointer",
                boxShadow: "0 8px 24px rgba(10, 28, 64, 0.22)",
                transition: "transform 0.2s, background 0.2s",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "translateY(-1px)";
                e.currentTarget.style.background = "#e0ff80";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.background = "#D4FF59";
              }}
              onClick={() => navigate("/daftar/kandidat")}
            >
              <span>Cari Pekerjaan Sekarang</span>
              <span
                aria-hidden="true"
                style={{
                  width: 34,
                  height: 34,
                  borderRadius: "50%",
                  background: "#0D1117",
                  color: "#D4FF59",
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <ArrowUpRight size={16} />
              </span>
            </button>
          </div>
        </div>

        {/* ── 3D CURVED CARD FAN IN THE CLOUDS (ANIMATED) ── */}
        <div
          style={{
            position: "relative",
            zIndex: 10,
            width: "100%",
            maxWidth: 1200,
            padding: "16px 20px 44px",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <div
            className="hero-card-fan"
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 14,
              width: "100%",
              perspective: 1200,
              padding: "14px 4px 26px",
              flexWrap: "wrap",
            }}
          >
            {/* Card 1: Match Score 94% */}
            <div
              className="hero-fan-card hero-fan-1"
              style={{
                width: 148,
                minHeight: 162,
                background: "#ffffff",
                borderRadius: 18,
                padding: "16px 14px",
                boxShadow: "0 14px 32px rgba(7, 42, 96, 0.16)",
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
                border: "1px solid rgba(13, 17, 23, 0.06)",
              }}
            >
              <div style={{ fontFamily: "'Inter', sans-serif", fontSize: 11, fontWeight: 600, color: "#4A5568" }}>
                Match Score
              </div>
              <div style={{ display: "flex", alignItems: "flex-end", gap: 5, height: 52, padding: "4px 0" }}>
                {[38, 56, 48, 76, 94].map((h, i) => (
                  <div
                    key={i}
                    style={{
                      flex: 1,
                      height: `${h}%`,
                      borderRadius: 4,
                      background: i === 4 ? "#0E67CC" : "#D6E8FF",
                      transformOrigin: "bottom",
                      animation: `heroBarPulse 2.4s ease-in-out ${i * 0.25}s infinite`,
                    }}
                  />
                ))}
              </div>
              <div style={{ fontFamily: "'Poppins', sans-serif", fontSize: 24, fontWeight: 800, color: "#0D1117", lineHeight: 1 }}>
                94%
              </div>
            </div>

            {/* Card 2: AI-Powered Matching & Lowongan Cocok */}
            <div
              className="hero-fan-card hero-fan-2"
              style={{
                width: 162,
                minHeight: 168,
                background: "#ffffff",
                borderRadius: 18,
                padding: "16px 15px",
                boxShadow: "0 14px 32px rgba(7, 42, 96, 0.16)",
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
                border: "1px solid rgba(13, 17, 23, 0.06)",
              }}
            >
              <div>
                <div style={{ fontFamily: "'Inter', sans-serif", fontSize: 10, fontWeight: 600, color: "#4A5568", marginBottom: 2 }}>
                  Lowongan Cocok
                </div>
                <div style={{ fontFamily: "'Poppins', sans-serif", fontSize: 22, fontWeight: 800, color: "#0D1117" }}>
                  127
                </div>
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                {badges.slice(0, 2).map((b) => (
                  <div
                    key={b.label}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 6,
                      padding: "6px 8px",
                      borderRadius: 8,
                      background: "#F4F5F7",
                      fontFamily: "'Inter', sans-serif",
                      fontSize: 10.5,
                      fontWeight: 600,
                      color: "#0D1117",
                    }}
                  >
                    <b.icon size={12} color="#0E67CC" aria-hidden="true" />
                    <span>{b.label}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Card 3: Center-Left Feature Highlight Card */}
            <div
              className="hero-fan-card hero-fan-3"
              style={{
                width: 172,
                minHeight: 172,
                background: "#ffffff",
                borderRadius: 18,
                padding: "16px",
                boxShadow: "0 16px 36px rgba(7, 42, 96, 0.18)",
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
                border: "1px solid rgba(13, 17, 23, 0.06)",
              }}
            >
              <div style={{ fontFamily: "'Poppins', sans-serif", fontSize: 12.5, fontWeight: 700, color: "#0D1117", lineHeight: 1.3 }}>
                Skill Gap Analysis
              </div>
              <div
                style={{
                  height: 62,
                  borderRadius: 10,
                  background: "linear-gradient(180deg, rgba(14,103,204,0.18) 0%, rgba(14,103,204,0.03) 100%)",
                  borderBottom: "2px solid #0E67CC",
                  display: "flex",
                  alignItems: "flex-end",
                  padding: "8px 10px",
                }}
              >
                <span style={{ fontFamily: "'Inter', sans-serif", fontSize: 10.5, fontWeight: 600, color: "#0849A8" }}>
                  Skill Gap · 3 Skills
                </span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span style={{ fontFamily: "'Inter', sans-serif", fontSize: 11, fontWeight: 600, color: "#4A5568" }}>
                  Skill Gap
                </span>
                <span style={{ fontFamily: "'Poppins', sans-serif", fontSize: 14, fontWeight: 800, color: "#0D1117" }}>
                  3 Skills
                </span>
              </div>
            </div>

            {/* Card 4: Center Dark Obsidian Card (Signature Aeline Centerpiece) */}
            <div
              className="hero-fan-card hero-fan-4"
              style={{
                width: 184,
                minHeight: 176,
                background: "#0D1117",
                borderRadius: 18,
                padding: "18px 16px",
                boxShadow: "0 18px 40px rgba(7, 22, 54, 0.32)",
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
                border: "2px solid rgba(255, 255, 255, 0.85)",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <RaviraOwlIcon size={22} />
                <span
                  style={{
                    width: 18,
                    height: 18,
                    borderRadius: "50%",
                    background: "#D4FF59",
                    color: "#0D1117",
                    display: "inline-flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: 10,
                    fontWeight: 800,
                    animation: "heroStarSpin 3s ease-in-out infinite",
                  }}
                >
                  ✦
                </span>
              </div>
              <div style={{ fontFamily: "'Poppins', sans-serif", fontSize: 13, fontWeight: 600, color: "#ffffff", lineHeight: 1.38 }}>
                DS RECRUITMENT{" "}
                <span style={{ color: "#D4FF59" }}>ECOSYSTEM</span> · AI
              </div>
              <div style={{ fontFamily: "'Inter', sans-serif", fontSize: 10.5, color: "#CBD5E1" }}>
                AI-Powered Matching
              </div>
            </div>

            {/* Card 5: Translucent Sky Blue Training Card */}
            <div
              className="hero-fan-card hero-fan-5"
              style={{
                width: 166,
                minHeight: 170,
                background: "rgba(18, 128, 240, 0.78)",
                borderRadius: 18,
                padding: "18px 14px",
                boxShadow: "0 14px 32px rgba(7, 42, 96, 0.16)",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                textAlign: "center",
                gap: 10,
                border: "1px solid rgba(255, 255, 255, 0.38)",
              }}
            >
              <div
                style={{
                  width: 34,
                  height: 34,
                  borderRadius: "50%",
                  background: "#ffffff",
                  color: "#0849A8",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <GraduationCap size={17} aria-hidden="true" />
              </div>
              <div style={{ fontFamily: "'Poppins', sans-serif", fontSize: 13, fontWeight: 700, color: "#ffffff", lineHeight: 1.3 }}>
                Personalized Training
              </div>
              <div style={{ fontFamily: "'Inter', sans-serif", fontSize: 10.5, color: "#ffffff", opacity: 0.9 }}>
                Skill Gap Analysis
              </div>
            </div>

            {/* Card 6: Cross-Region Pill Tags Card */}
            <div
              className="hero-fan-card hero-fan-6"
              style={{
                width: 154,
                minHeight: 162,
                background: "#ffffff",
                borderRadius: 18,
                padding: "16px 14px",
                boxShadow: "0 14px 32px rgba(7, 42, 96, 0.16)",
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
                border: "1px solid rgba(13, 17, 23, 0.06)",
              }}
            >
              <div style={{ display: "flex", flexWrap: "wrap", gap: 5 }}>
                {badges.map((b) => (
                  <span
                    key={b.label}
                    style={{
                      fontFamily: "'Inter', sans-serif",
                      fontSize: 9.5,
                      fontWeight: 600,
                      color: "#0D1117",
                      background: "#F4F5F7",
                      padding: "4px 8px",
                      borderRadius: 999,
                    }}
                  >
                    {b.label}
                  </span>
                ))}
              </div>
              <div>
                <div style={{ fontFamily: "'Inter', sans-serif", fontSize: 10, color: "#4A5568" }}>
                  Cross-Region
                </div>
                <div style={{ fontFamily: "'Poppins', sans-serif", fontSize: 20, fontWeight: 800, color: "#0D1117" }}>
                  Indonesia
                </div>
              </div>
            </div>
          </div>

          {/* Bottom note inside hero */}
          <div style={{ textAlign: "center", marginTop: 8 }}>
            <p
              style={{
                fontFamily: "'Inter', sans-serif",
                fontSize: 12.5,
                fontWeight: 600,
                color: "#062A60",
                background: "rgba(255, 255, 255, 0.78)",
                padding: "6px 16px",
                borderRadius: 999,
                display: "inline-block",
              }}
            >
              Gratis · Tanpa kartu kredit · Daftar kurang dari 2 menit
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
