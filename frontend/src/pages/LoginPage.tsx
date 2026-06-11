import { useNavigate } from "react-router";
import { User, Building2, Landmark, ArrowRight } from "lucide-react";
import { RaviraOwlIcon } from "../components/RaviraLogo";

const roleCards = [
  {
    id: "kandidat",
    icon: User,
    title: "Masuk sebagai Kandidat",
    desc: "Akses rekomendasi pekerjaan, skill gap, pelatihan, dan status lamaran Anda.",
    btnLabel: "Masuk Kandidat",
    path: "/masuk/kandidat",
    color: "#1677FF",
    bg: "rgba(22,119,255,0.06)",
    border: "rgba(22,119,255,0.18)",
  },
  {
    id: "perusahaan",
    icon: Building2,
    title: "Masuk sebagai Perusahaan",
    desc: "Kelola lowongan, pelamar, shortlist kandidat, dan pipeline rekrutmen.",
    btnLabel: "Masuk Perusahaan",
    path: "/masuk/perusahaan",
    color: "#8b5cf6",
    bg: "rgba(139,92,246,0.06)",
    border: "rgba(139,92,246,0.18)",
  },
  {
    id: "pemerintah",
    icon: Landmark,
    title: "Masuk sebagai Pemerintah / Institusi",
    desc: "Akses workforce analytics, tren skill, heatmap wilayah, dan laporan agregat.",
    btnLabel: "Masuk Pemerintah",
    path: "/masuk/pemerintah",
    color: "#4DB8FF",
    bg: "rgba(77,184,255,0.06)",
    border: "rgba(77,184,255,0.18)",
  },
];

export default function LoginPage() {
  const navigate = useNavigate();

  return (
    <div style={{ minHeight: "100vh", background: "linear-gradient(160deg, #f0f7ff 0%, #fff 60%)", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "40px 20px", fontFamily: "'Inter', sans-serif" }}>
      {/* Logo */}
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", marginBottom: 40 }}>
        <div style={{ cursor: "pointer" }} onClick={() => navigate("/")}>
          <RaviraOwlIcon size={52} />
        </div>
        <h1 style={{ fontFamily: "'Poppins', sans-serif", fontSize: 26, fontWeight: 800, color: "#0A1B3D", letterSpacing: "-0.5px", marginTop: 10, marginBottom: 4 }}>
          Masuk ke Ravira
        </h1>
        <p style={{ fontFamily: "'Inter', sans-serif", fontSize: 14, color: "#6a88b8" }}>
          Pilih role Anda untuk melanjutkan
        </p>
      </div>

      {/* Role Cards */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 20, maxWidth: 880, width: "100%" }}>
        {roleCards.map((card) => {
          const Icon = card.icon;
          return (
            <div
              key={card.id}
              style={{
                background: "#fff",
                borderRadius: 20,
                border: `1px solid ${card.border}`,
                padding: "32px 28px",
                boxShadow: "0 4px 20px rgba(10,27,61,0.06)",
                display: "flex",
                flexDirection: "column",
                alignItems: "flex-start",
                gap: 16,
                transition: "box-shadow 0.2s",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.boxShadow = `0 8px 32px rgba(10,27,61,0.12)`)}
              onMouseLeave={(e) => (e.currentTarget.style.boxShadow = "0 4px 20px rgba(10,27,61,0.06)")}
            >
              <div style={{ width: 48, height: 48, borderRadius: 14, background: card.bg, display: "flex", alignItems: "center", justifyContent: "center" }}>
                <Icon size={22} color={card.color} />
              </div>
              <div>
                <div style={{ fontFamily: "'Poppins', sans-serif", fontSize: 15, fontWeight: 700, color: "#0A1B3D", marginBottom: 8, lineHeight: 1.3 }}>
                  {card.title}
                </div>
                <p style={{ fontFamily: "'Inter', sans-serif", fontSize: 13, color: "#6a88b8", lineHeight: 1.6, margin: 0 }}>
                  {card.desc}
                </p>
              </div>
              <button
                onClick={() => navigate(card.path)}
                style={{
                  width: "100%",
                  padding: "11px 16px",
                  borderRadius: 12,
                  border: "none",
                  background: card.color,
                  fontFamily: "'Poppins', sans-serif",
                  fontSize: 13,
                  fontWeight: 700,
                  color: "#fff",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 6,
                  marginTop: "auto",
                  boxShadow: `0 4px 14px ${card.color}40`,
                  transition: "transform 0.15s",
                }}
                onMouseEnter={(e) => (e.currentTarget.style.transform = "translateY(-1px)")}
                onMouseLeave={(e) => (e.currentTarget.style.transform = "translateY(0)")}
              >
                {card.btnLabel} <ArrowRight size={14} />
              </button>
            </div>
          );
        })}
      </div>

      <p style={{ fontFamily: "'Inter', sans-serif", fontSize: 13, color: "#9ab4cc", marginTop: 32 }}>
        Belum punya akun?{" "}
        <button onClick={() => navigate("/daftar")} style={{ background: "none", border: "none", cursor: "pointer", color: "#1677FF", fontWeight: 600, padding: 0, fontFamily: "'Inter', sans-serif", fontSize: 13 }}>
          Daftar sekarang
        </button>
      </p>

      <style>{`
        @media (max-width: 768px) {
          .login-role-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  );
}
