import { useNavigate } from "react-router";
import { PemerintahNavbar } from "../components/PemerintahNavbar";
import { ArrowRight, Shield, CheckCircle } from "lucide-react";

export default function UntukPemerintahPage() {
  const navigate = useNavigate();

  return (
    <div style={{ minHeight: "100vh", background: "#f4f8ff", fontFamily: "'Inter', sans-serif" }}>
      <PemerintahNavbar />

      {/* Hero */}
      <div style={{ background: "linear-gradient(160deg, #021220 0%, #041c2e 55%, #062640 100%)", paddingTop: 120, paddingBottom: 72, position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", inset: 0, background: "radial-gradient(ellipse 60% 50% at 50% 40%, rgba(77,184,255,0.14) 0%, transparent 70%)", pointerEvents: "none" }} />
        <div style={{ position: "relative", zIndex: 1, maxWidth: 820, margin: "0 auto", padding: "0 24px", textAlign: "center" }}>
          <div style={{ display: "inline-block", fontFamily: "'Poppins', sans-serif", fontSize: 11, fontWeight: 600, color: "#4DB8FF", letterSpacing: "0.2em", textTransform: "uppercase", marginBottom: 16, background: "rgba(77,184,255,0.1)", border: "1px solid rgba(77,184,255,0.25)", borderRadius: 20, padding: "4px 14px" }}>
            Portal Pemerintah & Institusi
          </div>
          <h1 style={{ fontFamily: "'Poppins', sans-serif", fontSize: 40, fontWeight: 800, color: "#fff", letterSpacing: "-1px", marginBottom: 16, lineHeight: 1.15 }}>
            Workforce Analytics untuk Pemerintah dan Institusi
          </h1>
          <p style={{ fontFamily: "'Inter', sans-serif", fontSize: 16, color: "#6a9ab8", lineHeight: 1.8, marginBottom: 24 }}>
            Ravira membantu institusi melihat data tenaga kerja secara agregat dan anonim untuk memahami kebutuhan skill, tren pekerjaan, dan rekomendasi program pelatihan berbasis bukti.
          </p>
          <div style={{ display: "inline-flex", alignItems: "center", gap: 8, background: "rgba(16,217,142,0.08)", border: "1px solid rgba(16,217,142,0.2)", borderRadius: 10, padding: "8px 16px", marginBottom: 32 }}>
            <Shield size={14} color="#10d98e" />
            <span style={{ fontFamily: "'Inter', sans-serif", fontSize: 13, color: "#10d98e" }}>
              Data yang ditampilkan bersifat agregat dan anonim.
            </span>
          </div>
          <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
            <button onClick={() => navigate("/untuk-pemerintah/analytics")} style={{ display: "flex", alignItems: "center", gap: 8, padding: "12px 28px", borderRadius: 12, border: "none", background: "linear-gradient(135deg, #4DB8FF, #0090d4)", fontFamily: "'Poppins', sans-serif", fontSize: 14, fontWeight: 700, color: "#fff", cursor: "pointer", boxShadow: "0 6px 20px rgba(77,184,255,0.4)" }}>
              Lihat Analytics <ArrowRight size={15} />
            </button>
            <button onClick={() => navigate("/untuk-pemerintah/tren-skill")} style={{ padding: "12px 28px", borderRadius: 12, border: "1px solid rgba(77,184,255,0.3)", background: "transparent", fontFamily: "'Poppins', sans-serif", fontSize: 14, fontWeight: 600, color: "#4DB8FF", cursor: "pointer" }}>
              Lihat Tren Skill
            </button>
          </div>
        </div>
      </div>

      {/* Quick Nav Cards */}
      <div style={{ maxWidth: 960, margin: "0 auto", padding: "60px 24px" }}>
        <div style={{ textAlign: "center", marginBottom: 40 }}>
          <h2 style={{ fontFamily: "'Poppins', sans-serif", fontSize: 26, fontWeight: 800, color: "#0A1B3D", marginBottom: 10 }}>
            Fitur Workforce Analytics
          </h2>
          <p style={{ fontFamily: "'Inter', sans-serif", fontSize: 14, color: "#6a88b8" }}>
            Data tenaga kerja komprehensif untuk mendukung kebijakan berbasis bukti.
          </p>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))", gap: 20 }}>
          {[
            { title: "Supply-Demand Analytics", desc: "Data tenaga kerja nasional — supply, demand, dan gap per sektor.", path: "/untuk-pemerintah/analytics", color: "#4DB8FF", bg: "rgba(77,184,255,0.08)" },
            { title: "Tren Skill", desc: "Skill yang tumbuh, jenuh, dan perlu diintervensi oleh kebijakan.", path: "/untuk-pemerintah/tren-skill", color: "#10d98e", bg: "rgba(16,217,142,0.08)" },
            { title: "Heatmap Wilayah", desc: "Peta distribusi tenaga kerja dan kebutuhan per provinsi dan kota.", path: "/untuk-pemerintah/heatmap", color: "#1677FF", bg: "rgba(22,119,255,0.08)" },
            { title: "Laporan & Ekspor", desc: "Unduh laporan PDF, Excel, atau CSV untuk kebutuhan kebijakan.", path: "/untuk-pemerintah/laporan", color: "#f59e0b", bg: "rgba(245,158,11,0.08)" },
          ].map((item) => (
            <div
              key={item.title}
              onClick={() => navigate(item.path)}
              style={{ background: "#fff", borderRadius: 20, border: "1px solid rgba(22,119,255,0.08)", padding: "28px 24px", boxShadow: "0 4px 18px rgba(10,27,61,0.05)", cursor: "pointer", transition: "transform 0.2s, box-shadow 0.2s" }}
              onMouseEnter={(e) => { e.currentTarget.style.transform = "translateY(-3px)"; e.currentTarget.style.boxShadow = "0 8px 28px rgba(10,27,61,0.1)"; }}
              onMouseLeave={(e) => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "0 4px 18px rgba(10,27,61,0.05)"; }}
            >
              <div style={{ width: 48, height: 48, borderRadius: 14, background: item.bg, display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 16 }}>
                <ArrowRight size={22} color={item.color} />
              </div>
              <div style={{ fontFamily: "'Poppins', sans-serif", fontSize: 15, fontWeight: 700, color: "#0A1B3D", marginBottom: 8 }}>{item.title}</div>
              <p style={{ fontFamily: "'Inter', sans-serif", fontSize: 13, color: "#6a88b8", lineHeight: 1.6, margin: 0 }}>{item.desc}</p>
            </div>
          ))}
        </div>

        {/* Cocok untuk */}
        <div style={{ background: "#fff", borderRadius: 20, border: "1px solid rgba(22,119,255,0.08)", padding: "32px 36px", boxShadow: "0 4px 18px rgba(10,27,61,0.04)", marginTop: 40 }}>
          <h3 style={{ fontFamily: "'Poppins', sans-serif", fontSize: 17, fontWeight: 800, color: "#0A1B3D", marginBottom: 18 }}>Cocok untuk:</h3>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", gap: 12 }}>
            {["Kementerian Ketenagakerjaan", "Dinas Ketenagakerjaan (Disnaker)", "Badan Pusat Statistik (BPS)", "Kampus & Perguruan Tinggi", "Lembaga Pelatihan Kerja", "Institusi Riset & Think Tank"].map((item) => (
              <div key={item} style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <CheckCircle size={13} color="#4DB8FF" style={{ flexShrink: 0 }} />
                <span style={{ fontFamily: "'Inter', sans-serif", fontSize: 13, color: "#4a6080" }}>{item}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Privacy */}
        <div style={{ background: "rgba(16,217,142,0.04)", border: "1px solid rgba(16,217,142,0.15)", borderRadius: 16, padding: "24px 28px", display: "flex", alignItems: "flex-start", gap: 14, marginTop: 24 }}>
          <Shield size={20} color="#10d98e" style={{ flexShrink: 0, marginTop: 2 }} />
          <div>
            <div style={{ fontFamily: "'Poppins', sans-serif", fontSize: 14, fontWeight: 700, color: "#0A1B3D", marginBottom: 6 }}>Komitmen Privasi Data Kandidat</div>
            <p style={{ fontFamily: "'Inter', sans-serif", fontSize: 13, color: "#6a88b8", lineHeight: 1.7, margin: 0 }}>
              Seluruh data yang ditampilkan pada platform analytics Ravira bersifat agregat dan anonim. Tidak ada nama, email, nomor telepon, CV, atau identitas pribadi kandidat yang dapat diakses oleh lembaga pemerintah maupun institusi mitra.
            </p>
          </div>
        </div>

        {/* Info section */}
        <div style={{ background: "linear-gradient(135deg, #021220, #062640)", borderRadius: 24, padding: "48px 32px", textAlign: "center", marginTop: 40 }}>
          <h2 style={{ fontFamily: "'Poppins', sans-serif", fontSize: 26, fontWeight: 800, color: "#fff", marginBottom: 10 }}>Data Komprehensif untuk Kebijakan</h2>
          <p style={{ fontFamily: "'Inter', sans-serif", fontSize: 14, color: "#6a9ab8", marginBottom: 28, maxWidth: 520, margin: "0 auto 28px" }}>
            Tersedia untuk lembaga pemerintah, Disnaker, dan institusi mitra. Semua data bersifat agregat — tidak ada identitas kandidat yang terekspos.
          </p>
          <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
            <button onClick={() => navigate("/untuk-pemerintah/laporan")} style={{ display: "flex", alignItems: "center", gap: 8, padding: "12px 28px", borderRadius: 12, border: "none", background: "linear-gradient(135deg, #4DB8FF, #0090d4)", fontFamily: "'Poppins', sans-serif", fontSize: 14, fontWeight: 700, color: "#fff", cursor: "pointer", boxShadow: "0 6px 20px rgba(77,184,255,0.4)" }}>
              Lihat Laporan <ArrowRight size={15} />
            </button>
            <button onClick={() => navigate("/untuk-pemerintah/heatmap")} style={{ padding: "12px 28px", borderRadius: 12, border: "1px solid rgba(77,184,255,0.3)", background: "transparent", fontFamily: "'Poppins', sans-serif", fontSize: 14, fontWeight: 600, color: "#4DB8FF", cursor: "pointer" }}>
              Lihat Heatmap Wilayah
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
