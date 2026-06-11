import { useNavigate } from "react-router";
import { User, Building2, Landmark, ArrowRight } from "lucide-react";
import { RaviraOwlIcon } from "../components/RaviraLogo";

const roles = [
  {
    id: "kandidat",
    icon: User,
    color: "#1677FF",
    title: "Kandidat",
    desc: "Cari pekerjaan, analisis skill gap, dan dapatkan rekomendasi pelatihan personal.",
    features: ["Rekomendasi pekerjaan AI", "Skill Gap Report", "Pelatihan personal", "Peluang lintas wilayah"],
    cta: "Daftar sebagai Kandidat",
    path: "/daftar/kandidat",
  },
  {
    id: "perusahaan",
    icon: Building2,
    color: "#0D47A1",
    title: "Perusahaan / Recruiter",
    desc: "Temukan kandidat terbaik lebih cepat dengan shortlist berbasis AI.",
    features: ["Shortlist kandidat AI", "Pipeline rekrutmen", "Dashboard analitik", "Integrasi ATS/HRIS"],
    cta: "Daftarkan Perusahaan",
    path: "/daftar/perusahaan",
  },
  {
    id: "pemerintah",
    icon: Landmark,
    color: "#4DB8FF",
    title: "Pemerintah / Institusi",
    desc: "Pantau tren tenaga kerja, kebutuhan skill, dan data workforce regional.",
    features: ["Workforce heatmap", "Tren skill & demand", "Proyeksi kompetensi", "Laporan kebijakan"],
    cta: "Daftar untuk Analytics",
    path: "/daftar/pemerintah",
  },
];

export default function PickRolePage() {
  const navigate = useNavigate();

  return (
    <div style={{ minHeight: "100vh", background: "linear-gradient(160deg, #020a1c 0%, #071228 50%, #0a1b3d 100%)", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "60px 24px", fontFamily: "'Inter', sans-serif" }}>
      <div style={{ position: "fixed", inset: 0, opacity: 0.04, backgroundImage: "radial-gradient(circle, #4DB8FF 1px, transparent 1px)", backgroundSize: "40px 40px", pointerEvents: "none" }} />
      <div style={{ position: "fixed", top: "20%", left: "50%", transform: "translateX(-50%)", width: 800, height: 400, background: "radial-gradient(ellipse, rgba(22,119,255,0.15) 0%, transparent 70%)", pointerEvents: "none" }} />

      <div style={{ position: "relative", zIndex: 10, textAlign: "center", marginBottom: 48 }}>
        <button onClick={() => navigate("/")} style={{ display: "flex", alignItems: "center", gap: 8, background: "none", border: "none", cursor: "pointer", color: "#4a6a9a", fontFamily: "'Inter', sans-serif", fontSize: 13, margin: "0 auto 28px", padding: 0 }}>
          <RaviraOwlIcon size={22} /> Kembali ke Beranda
        </button>
        <span style={{ display: "inline-block", fontFamily: "'JetBrains Mono', monospace", fontSize: 11, color: "#4DB8FF", letterSpacing: "0.12em", textTransform: "uppercase", padding: "4px 14px", border: "1px solid rgba(77,184,255,0.25)", borderRadius: 100, background: "rgba(77,184,255,0.06)", marginBottom: 20 }}>
          Mulai Perjalanan Anda
        </span>
        <h1 style={{ fontFamily: "'Poppins', sans-serif", fontSize: "clamp(26px, 4vw, 42px)", fontWeight: 800, color: "#ffffff", letterSpacing: "-1px", lineHeight: 1.15, marginBottom: 14 }}>
          Mulai Perjalanan Anda Bersama Ravira
        </h1>
        <p style={{ fontFamily: "'Inter', sans-serif", fontSize: 16, color: "#7a99c8", maxWidth: 480, margin: "0 auto" }}>
          Pilih jenis akun yang sesuai agar Ravira dapat memberikan pengalaman terbaik.
        </p>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 20, maxWidth: 1000, width: "100%", position: "relative", zIndex: 10 }}>
        {roles.map((r) => (
          <div
            key={r.id}
            style={{
              background: "rgba(13,31,63,0.7)", backdropFilter: "blur(16px)",
              border: `1px solid ${r.color}22`, borderRadius: 20,
              padding: "32px 28px", display: "flex", flexDirection: "column",
              transition: "transform 0.2s, border-color 0.2s, box-shadow 0.2s",
            }}
            onMouseEnter={(e) => { e.currentTarget.style.transform = "translateY(-6px)"; e.currentTarget.style.borderColor = `${r.color}55`; e.currentTarget.style.boxShadow = `0 20px 50px rgba(0,0,0,0.4), 0 0 30px ${r.color}18`; }}
            onMouseLeave={(e) => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.borderColor = `${r.color}22`; e.currentTarget.style.boxShadow = "none"; }}
          >
            <div style={{ width: 52, height: 52, borderRadius: 16, background: `${r.color}14`, border: `1px solid ${r.color}30`, display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 20 }}>
              <r.icon size={24} color={r.color} />
            </div>

            <h3 style={{ fontFamily: "'Poppins', sans-serif", fontSize: 20, fontWeight: 700, color: "#ffffff", marginBottom: 10 }}>{r.title}</h3>
            <p style={{ fontFamily: "'Inter', sans-serif", fontSize: 14, color: "#7a99c8", lineHeight: 1.6, marginBottom: 20 }}>{r.desc}</p>

            <ul style={{ listStyle: "none", padding: 0, marginBottom: 28, flex: 1 }}>
              {r.features.map((f) => (
                <li key={f} style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
                  <div style={{ width: 6, height: 6, borderRadius: "50%", background: r.color, flexShrink: 0 }} />
                  <span style={{ fontFamily: "'Inter', sans-serif", fontSize: 13, color: "#8899bb" }}>{f}</span>
                </li>
              ))}
            </ul>

            <button
              onClick={() => navigate(r.path)}
              style={{
                display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
                padding: "13px 20px", borderRadius: 12, border: "none",
                background: `linear-gradient(135deg, ${r.color}, ${r.color}cc)`,
                fontFamily: "'Poppins', sans-serif", fontSize: 14, fontWeight: 700, color: "#fff",
                cursor: "pointer", boxShadow: `0 6px 20px ${r.color}30`,
                transition: "transform 0.2s",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.transform = "translateY(-2px)")}
              onMouseLeave={(e) => (e.currentTarget.style.transform = "translateY(0)")}
            >
              {r.cta} <ArrowRight size={15} />
            </button>
          </div>
        ))}
      </div>

      <p style={{ position: "relative", zIndex: 10, fontFamily: "'Inter', sans-serif", fontSize: 13, color: "#3a5480", marginTop: 36 }}>
        Sudah punya akun?{" "}
        <button onClick={() => navigate("/masuk")} style={{ background: "none", border: "none", cursor: "pointer", color: "#4DB8FF", fontWeight: 600, padding: 0, fontFamily: "'Inter', sans-serif", fontSize: 13 }}>
          Masuk di sini
        </button>
      </p>
    </div>
  );
}
