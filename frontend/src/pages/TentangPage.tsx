import { useNavigate } from "react-router";
import { Navbar } from "../components/Navbar";
import { Footer } from "../components/Footer";
import { ArrowUpRight, Shield, Users, TrendingUp, BookOpen, BarChart2 } from "lucide-react";
import { RaviraOwlIcon } from "../components/RaviraLogo";

const misi = [
  { icon: Users, variant: "blue" as const, text: "Menghubungkan kandidat dan perusahaan dengan matching berbasis AI yang relevan dan akurat." },
  { icon: TrendingUp, variant: "light" as const, text: "Membantu kandidat memahami skill gap dan mengambil langkah pengembangan diri yang terarah." },
  { icon: BookOpen, variant: "lime" as const, text: "Mendukung peningkatan kompetensi melalui rekomendasi pelatihan yang dipersonalisasi." },
  { icon: BarChart2, variant: "dark" as const, text: "Memberikan insight workforce berbasis data agregat untuk mendukung kebijakan ketenagakerjaan." },
];

export default function TentangPage() {
  const navigate = useNavigate();

  return (
    <div style={{ minHeight: "100vh", background: "#FFFFFF", fontFamily: "'Inter', sans-serif" }}>
      <Navbar />

      {/* Framed Aeline Hero */}
      <section style={{ padding: "14px 14px 8px", background: "#FFFFFF" }}>
        <div
          style={{
            position: "relative",
            borderRadius: 28,
            overflow: "hidden",
            background: "linear-gradient(180deg, #0849A8 0%, #0E67CC 45%, #389BFF 100%)",
            padding: "120px 24px 68px",
            textAlign: "center",
            boxShadow: "0 18px 48px rgba(8, 73, 168, 0.14)",
          }}
        >
          <div style={{ position: "relative", zIndex: 1, maxWidth: 740, margin: "0 auto" }}>
            <div style={{ display: "flex", justifyContent: "center", marginBottom: 20 }}>
              <RaviraOwlIcon size={64} />
            </div>
            <h1 style={{ fontFamily: "'Poppins', sans-serif", fontSize: "clamp(32px, 4.4vw, 50px)", fontWeight: 600, color: "#FFFFFF", letterSpacing: "-0.03em", marginBottom: 16 }}>
              Tentang Ravira
            </h1>
            <p style={{ fontFamily: "'Inter', sans-serif", fontSize: 16, color: "rgba(255,255,255,0.92)", lineHeight: 1.75 }}>
              Ravira adalah ekosistem rekrutmen berbasis AI yang dibangun untuk menghubungkan talenta Indonesia dengan peluang kerja yang benar-benar relevan, secara otomatis, adil, dan transparan.
            </p>
          </div>
        </div>
      </section>

      <div style={{ maxWidth: 1080, margin: "0 auto", padding: "64px 24px" }}>
        {/* Visi */}
        <div style={{ background: "#F4F5F7", borderRadius: 28, padding: "36px 40px", marginBottom: 28 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 14 }}>
            <span style={{ width: 8, height: 8, borderRadius: "50%", background: "#0E67CC" }} />
            <h2 style={{ fontFamily: "'Poppins', sans-serif", fontSize: 22, fontWeight: 600, color: "#0D1117", margin: 0 }}>Visi Kami</h2>
          </div>
          <p style={{ fontFamily: "'Inter', sans-serif", fontSize: 15.5, color: "#374151", lineHeight: 1.8, margin: 0 }}>
            Menjadi platform rekrutmen AI terpercaya di Indonesia yang membantu setiap talenta menemukan peluang karier yang paling relevan, sekaligus membantu perusahaan menemukan kandidat terbaik secara efisien, objektif, dan berbasis data.
          </p>
        </div>

        {/* Misi (4 cards) */}
        <div style={{ marginBottom: 28 }}>
          <h2 style={{ fontFamily: "'Poppins', sans-serif", fontSize: 22, fontWeight: 600, color: "#0D1117", marginBottom: 18 }}>Misi Kami</h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 18 }}>
            {misi.map((m, i) => {
              const Icon = m.icon;
              const isBlue = m.variant === "blue";
              const isLime = m.variant === "lime";
              const isDark = m.variant === "dark";
              const bg = isBlue ? "linear-gradient(180deg, #0E67CC 0%, #389BFF 100%)" : isLime ? "#D4FF59" : isDark ? "#0D1117" : "#F4F5F7";
              const textColor = isBlue || isDark ? "#FFFFFF" : "#0D1117";
              const iconBg = isBlue || isDark ? "#FFFFFF" : "#0D1117";
              const iconColor = isBlue || isDark ? "#0D1117" : "#D4FF59";

              return (
                <div key={i} style={{ background: bg, borderRadius: 24, padding: "26px 22px", display: "flex", flexDirection: "column", justifyContent: "space-between", minHeight: 200 }}>
                  <div style={{ width: 42, height: 42, borderRadius: 12, background: iconBg, color: iconColor, display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 16 }}>
                    <Icon size={19} />
                  </div>
                  <p style={{ fontFamily: "'Inter', sans-serif", fontSize: 13.5, fontWeight: 500, color: textColor, lineHeight: 1.65, margin: 0 }}>{m.text}</p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Keamanan Data */}
        <div style={{ background: "#D4FF59", borderRadius: 28, padding: "36px 40px", marginBottom: 40 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16 }}>
            <Shield size={22} color="#0D1117" />
            <h2 style={{ fontFamily: "'Poppins', sans-serif", fontSize: 22, fontWeight: 600, color: "#0D1117", margin: 0 }}>Keamanan Data & Consent Kandidat</h2>
          </div>
          <p style={{ fontFamily: "'Inter', sans-serif", fontSize: 14.5, color: "#1E293B", lineHeight: 1.75, marginBottom: 18 }}>
            Ravira berkomitmen penuh terhadap perlindungan data pribadi kandidat. Seluruh data yang diberikan kandidat hanya digunakan sesuai consent yang diberikan secara eksplisit.
          </p>
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {[
              "Data pribadi kandidat tidak pernah dijual atau dibagikan ke pihak ketiga tanpa izin.",
              "Lembaga pemerintah hanya mendapatkan akses data agregat dan anonim, tidak ada data individual.",
              "Kandidat dapat menarik consent dan meminta penghapusan data kapan saja.",
              "Seluruh data dienkripsi dan disimpan sesuai standar keamanan industri.",
            ].map((item, i) => (
              <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: 10 }}>
                <div style={{ width: 6, height: 6, borderRadius: "50%", background: "#0D1117", marginTop: 8, flexShrink: 0 }} />
                <p style={{ fontFamily: "'Inter', sans-serif", fontSize: 13.5, fontWeight: 500, color: "#0D1117", lineHeight: 1.6, margin: 0 }}>{item}</p>
              </div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div style={{ background: "#0D1117", borderRadius: 28, padding: "48px 32px", textAlign: "center" }}>
          <h2 style={{ fontFamily: "'Poppins', sans-serif", fontSize: 26, fontWeight: 600, color: "#FFFFFF", marginBottom: 10 }}>Bergabung dengan Ravira</h2>
          <p style={{ fontFamily: "'Inter', sans-serif", fontSize: 14.5, color: "#CBD5E1", marginBottom: 26 }}>Kandidat, perusahaan, dan lembaga pemerintah, semua punya tempat di ekosistem Ravira.</p>
          <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
            <button
              onClick={() => navigate("/daftar")}
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 12,
                padding: "7px 8px 7px 24px",
                minHeight: 48,
                borderRadius: 999,
                border: "none",
                background: "#D4FF59",
                fontFamily: "'Inter', sans-serif",
                fontSize: 12,
                fontWeight: 700,
                letterSpacing: "0.08em",
                textTransform: "uppercase",
                color: "#0D1117",
                cursor: "pointer",
              }}
            >
              <span>Daftar Sekarang</span>
              <span style={{ width: 34, height: 34, borderRadius: "50%", background: "#0D1117", color: "#D4FF59", display: "inline-flex", alignItems: "center", justifyContent: "center" }}>
                <ArrowUpRight size={16} />
              </span>
            </button>
            <button
              onClick={() => navigate("/kontak")}
              style={{
                padding: "12px 26px",
                minHeight: 48,
                borderRadius: 999,
                border: "1px solid rgba(255,255,255,0.28)",
                background: "transparent",
                fontFamily: "'Inter', sans-serif",
                fontSize: 12,
                fontWeight: 600,
                letterSpacing: "0.08em",
                textTransform: "uppercase",
                color: "#FFFFFF",
                cursor: "pointer",
              }}
            >
              Hubungi Kami
            </button>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
