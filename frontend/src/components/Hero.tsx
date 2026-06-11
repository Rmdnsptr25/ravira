import { ArrowRight, Play, Brain, BarChart3, GraduationCap, Globe } from "lucide-react";
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
        position: "relative",
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        overflow: "hidden",
      }}
    >
      {/* Cityscape background image */}
      <img
        src={cityImage}
        alt=""
        aria-hidden="true"
        style={{
          position: "absolute",
          inset: 0,
          width: "100%",
          height: "100%",
          objectFit: "cover",
          objectPosition: "center bottom",
          zIndex: 0,
        }}
      />

      {/* Dark blue overlay for readability */}
      <div style={{
        position: "absolute", inset: 0, zIndex: 1,
        background: "linear-gradient(180deg, rgba(2,10,30,0.82) 0%, rgba(4,18,52,0.72) 40%, rgba(6,22,60,0.55) 75%, rgba(8,26,68,0.40) 100%)",
      }} />

      {/* Extra top gradient for navbar blend */}
      <div style={{
        position: "absolute", top: 0, left: 0, right: 0, height: 200, zIndex: 1,
        background: "linear-gradient(180deg, rgba(2,8,24,0.7) 0%, transparent 100%)",
        pointerEvents: "none",
      }} />

      {/* Grid dots */}
      <div style={{
        position: "absolute", inset: 0, zIndex: 1, pointerEvents: "none", opacity: 0.06,
        backgroundImage: "radial-gradient(circle, #ffffff 1px, transparent 1px)",
        backgroundSize: "44px 44px",
      }} />

      {/* Blue glow center */}
      <div style={{
        position: "absolute", top: "30%", left: "50%", transform: "translateX(-50%)",
        width: 700, height: 400, zIndex: 1, pointerEvents: "none",
        background: "radial-gradient(ellipse, rgba(22,119,255,0.18) 0%, transparent 70%)",
      }} />

      {/* ── CONTENT ── */}
      <div style={{
        position: "relative", zIndex: 10,
        maxWidth: 820, width: "100%",
        padding: "140px 24px 80px",
        textAlign: "center",
      }}>
        {/* Badge */}
        <div style={{
          display: "inline-flex", alignItems: "center", gap: 8,
          padding: "6px 18px", borderRadius: 100,
          border: "1px solid rgba(189,225,255,0.25)",
          background: "rgba(22,119,255,0.12)",
          backdropFilter: "blur(8px)",
          marginBottom: 28,
        }}>
          <RaviraOwlIcon size={18} />
          <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11, color: "#BDE1FF", letterSpacing: "0.1em" }}>
            DS RECRUITMENT ECOSYSTEM · AI
          </span>
        </div>

        <h1 style={{
          fontFamily: "'Poppins', sans-serif",
          fontSize: "clamp(38px, 6vw, 72px)",
          fontWeight: 800,
          lineHeight: 1.08,
          letterSpacing: "-2px",
          color: "#ffffff",
          marginBottom: 20,
          textShadow: "0 2px 24px rgba(0,0,0,0.4)",
        }}>
          You relax,{" "}
          <span style={{
            background: "linear-gradient(90deg, #60a5fa, #93c5fd, #bfdbfe)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
          }}>
            AI will find you a Job
          </span>
        </h1>

        <p style={{
          fontFamily: "'Poppins', sans-serif", fontSize: 11, fontWeight: 600,
          color: "#93c5fd", letterSpacing: "0.22em", textTransform: "uppercase", marginBottom: 18,
        }}>
          Temukan Pekerjaan, Raih Masa Depan
        </p>

        <p style={{
          fontFamily: "'Inter', sans-serif", fontSize: 17, color: "rgba(189,225,255,0.85)",
          lineHeight: 1.75, marginBottom: 36, maxWidth: 540, margin: "0 auto 36px",
          textShadow: "0 1px 8px rgba(0,0,0,0.3)",
        }}>
          Ravira menghubungkan talenta dengan peluang kerja paling relevan menggunakan kecerdasan buatan — dari analisis skill gap hingga rekomendasi pelatihan personal di seluruh Indonesia.
        </p>

        {/* CTAs */}
        <div style={{ display: "flex", gap: 12, flexWrap: "wrap", justifyContent: "center", marginBottom: 24 }}>
          <button style={{
            display: "flex", alignItems: "center", gap: 8,
            fontFamily: "'Poppins', sans-serif", fontSize: 15, fontWeight: 700, color: "#fff",
            padding: "14px 30px", borderRadius: 12, border: "none",
            background: "linear-gradient(135deg, #1d4ed8, #1677FF)",
            cursor: "pointer",
            boxShadow: "0 6px 28px rgba(29,78,216,0.55)",
            transition: "transform 0.2s, box-shadow 0.2s",
          }}
            onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-2px)"; e.currentTarget.style.boxShadow = "0 12px 36px rgba(29,78,216,0.7)"; }}
            onMouseLeave={e => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "0 6px 28px rgba(29,78,216,0.55)"; }}
            onClick={() => navigate("/daftar/kandidat")}
          >
            Cari Pekerjaan Sekarang <ArrowRight size={16} />
          </button>
          <button style={{
            display: "flex", alignItems: "center", gap: 8,
            fontFamily: "'Poppins', sans-serif", fontSize: 15, fontWeight: 600, color: "#bfdbfe",
            padding: "14px 26px", borderRadius: 12,
            border: "1px solid rgba(147,197,253,0.3)",
            background: "rgba(255,255,255,0.07)",
            backdropFilter: "blur(8px)",
            cursor: "pointer", transition: "all 0.2s",
          }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = "rgba(147,197,253,0.6)"; e.currentTarget.style.color = "#ffffff"; }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = "rgba(147,197,253,0.3)"; e.currentTarget.style.color = "#bfdbfe"; }}
            onClick={() => document.getElementById("preview")?.scrollIntoView({ behavior: "smooth" })}
          >
            <Play size={14} fill="currentColor" /> Lihat Demo
          </button>
        </div>

        <p style={{ fontFamily: "'Inter', sans-serif", fontSize: 12, color: "rgba(147,197,253,0.6)", marginBottom: 36 }}>
          Gratis · Tanpa kartu kredit · Daftar kurang dari 2 menit
        </p>

        {/* Mini badges */}
        <div style={{ display: "flex", flexWrap: "wrap", gap: 8, justifyContent: "center" }}>
          {badges.map(b => (
            <div key={b.label} style={{
              display: "flex", alignItems: "center", gap: 6,
              padding: "7px 14px", borderRadius: 8,
              border: "1px solid rgba(147,197,253,0.2)",
              background: "rgba(255,255,255,0.06)",
              backdropFilter: "blur(6px)",
              fontFamily: "'Inter', sans-serif", fontSize: 12, fontWeight: 500, color: "#93c5fd",
            }}>
              <b.icon size={13} color="#60a5fa" />
              {b.label}
            </div>
          ))}
        </div>
      </div>

      {/* Floating stats pinned at bottom */}
      <div style={{
        position: "relative", zIndex: 10,
        display: "flex", gap: 12, flexWrap: "wrap", justifyContent: "center",
        padding: "0 24px 60px",
      }}>
        {[
          { label: "Match Score", value: "94%", color: "#60a5fa" },
          { label: "Lowongan Cocok", value: "127", color: "#93c5fd" },
          { label: "Skill Gap", value: "3 Skills", color: "#34d399" },
        ].map(c => (
          <div key={c.label} style={{
            padding: "10px 18px", borderRadius: 12,
            background: "rgba(4,14,40,0.65)",
            backdropFilter: "blur(16px)",
            border: `1px solid ${c.color}30`,
            minWidth: 110, textAlign: "center",
          }}>
            <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 9, color: "rgba(147,197,253,0.6)", textTransform: "uppercase", letterSpacing: "0.07em", marginBottom: 2 }}>{c.label}</div>
            <div style={{ fontFamily: "'Poppins', sans-serif", fontSize: 20, fontWeight: 800, color: c.color, lineHeight: 1 }}>{c.value}</div>
          </div>
        ))}
      </div>

      {/* Bottom fade to white */}
      <div style={{
        position: "absolute", bottom: 0, left: 0, right: 0, height: 100, zIndex: 2,
        background: "linear-gradient(0deg, #ffffff 0%, transparent 100%)",
        pointerEvents: "none",
      }} />
    </section>
  );
}
