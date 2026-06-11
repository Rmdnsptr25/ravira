import { useNavigate } from "react-router";
import { PerusahaanNavbar } from "../components/PerusahaanNavbar";
import { ArrowRight, CheckCircle } from "lucide-react";

export default function UntukPerusahaanPage() {
  const navigate = useNavigate();

  return (
    <div style={{ minHeight: "100vh", background: "#f4f8ff", fontFamily: "'Inter', sans-serif" }}>
      <PerusahaanNavbar />

      {/* Hero */}
      <div style={{ background: "linear-gradient(160deg, #0d0820 0%, #130e2e 55%, #1a0a3d 100%)", paddingTop: 120, paddingBottom: 80, position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", inset: 0, background: "radial-gradient(ellipse 60% 50% at 50% 40%, rgba(139,92,246,0.18) 0%, transparent 70%)", pointerEvents: "none" }} />
        <div style={{ position: "relative", zIndex: 1, maxWidth: 820, margin: "0 auto", padding: "0 24px", textAlign: "center" }}>
          <div style={{ display: "inline-block", fontFamily: "'Poppins', sans-serif", fontSize: 11, fontWeight: 600, color: "#c4b5fd", letterSpacing: "0.2em", textTransform: "uppercase", marginBottom: 16, background: "rgba(139,92,246,0.12)", border: "1px solid rgba(139,92,246,0.25)", borderRadius: 20, padding: "4px 14px" }}>
            Portal Perusahaan
          </div>
          <h1 style={{ fontFamily: "'Poppins', sans-serif", fontSize: 40, fontWeight: 800, color: "#fff", letterSpacing: "-1px", marginBottom: 16, lineHeight: 1.15 }}>
            Rekrut Kandidat Lebih Tepat dengan Ravira
          </h1>
          <p style={{ fontFamily: "'Inter', sans-serif", fontSize: 16, color: "#9a85c8", lineHeight: 1.8, marginBottom: 36 }}>
            Ravira membantu perusahaan menemukan kandidat yang relevan, mengelola lowongan, melihat match score, shortlist berbasis AI, dan pipeline rekrutmen dalam satu ekosistem terintegrasi.
          </p>
          <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
            <button onClick={() => navigate("/untuk-perusahaan/solusi-rekrutmen")} style={{ display: "flex", alignItems: "center", gap: 8, padding: "13px 28px", borderRadius: 12, border: "none", background: "linear-gradient(135deg, #8b5cf6, #6d28d9)", fontFamily: "'Poppins', sans-serif", fontSize: 15, fontWeight: 700, color: "#fff", cursor: "pointer", boxShadow: "0 6px 20px rgba(139,92,246,0.4)" }}>
              Lihat Solusi Rekrutmen <ArrowRight size={16} />
            </button>
            <button onClick={() => navigate("/untuk-perusahaan/insight-rekrutmen")} style={{ padding: "13px 28px", borderRadius: 12, border: "1px solid rgba(196,181,253,0.3)", background: "transparent", fontFamily: "'Poppins', sans-serif", fontSize: 15, fontWeight: 600, color: "#c4b5fd", cursor: "pointer" }}>
              Lihat Insight Rekrutmen
            </button>
          </div>
        </div>
      </div>

      {/* Quick Nav Cards */}
      <div style={{ maxWidth: 960, margin: "0 auto", padding: "60px 24px" }}>
        <div style={{ textAlign: "center", marginBottom: 40 }}>
          <h2 style={{ fontFamily: "'Poppins', sans-serif", fontSize: 26, fontWeight: 800, color: "#0A1B3D", marginBottom: 10 }}>
            Jelajahi Portal Perusahaan
          </h2>
          <p style={{ fontFamily: "'Inter', sans-serif", fontSize: 14, color: "#6a88b8" }}>
            Pelajari semua fitur rekrutmen yang tersedia untuk perusahaan Anda.
          </p>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))", gap: 20 }}>
          {[
            { title: "Kelola Lowongan", desc: "Buat dan kelola posisi rekrutmen yang sedang dibuka.", path: "/untuk-perusahaan/lowongan", color: "#8b5cf6", bg: "rgba(139,92,246,0.08)" },
            { title: "Fitur Produk", desc: "Shortlist AI, match score, dan profil berbasis consent.", path: "/untuk-perusahaan/produk", color: "#1677FF", bg: "rgba(22,119,255,0.08)" },
            { title: "Solusi Rekrutmen", desc: "Pipeline, jadwal interview, dan kolaborasi tim recruiter.", path: "/untuk-perusahaan/solusi-rekrutmen", color: "#10d98e", bg: "rgba(16,217,142,0.08)" },
            { title: "Insight Rekrutmen", desc: "Analitik performa rekrutmen dan konversi pipeline.", path: "/untuk-perusahaan/insight-rekrutmen", color: "#f59e0b", bg: "rgba(245,158,11,0.08)" },
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

        {/* Stats */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16, marginTop: 48 }}>
          {[
            { value: "2.800+", label: "Perusahaan Aktif", color: "#8b5cf6" },
            { value: "94%", label: "Akurasi Match Score", color: "#10d98e" },
            { value: "48K+", label: "Kandidat Tersedia", color: "#1677FF" },
          ].map((s) => (
            <div key={s.label} style={{ background: "#fff", borderRadius: 16, border: "1px solid rgba(22,119,255,0.08)", padding: "24px", textAlign: "center", boxShadow: "0 2px 10px rgba(10,27,61,0.04)" }}>
              <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 28, fontWeight: 800, color: s.color, marginBottom: 6 }}>{s.value}</div>
              <div style={{ fontFamily: "'Inter', sans-serif", fontSize: 12, color: "#6a88b8" }}>{s.label}</div>
            </div>
          ))}
        </div>

        {/* Feature bullets */}
        <div style={{ background: "linear-gradient(135deg, #0d0820, #1a0a3d)", borderRadius: 24, padding: "40px", marginTop: 40 }}>
          <h3 style={{ fontFamily: "'Poppins', sans-serif", fontSize: 20, fontWeight: 800, color: "#fff", marginBottom: 20 }}>Mengapa Ravira?</h3>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))", gap: 12 }}>
            {[
              "Matching AI berdasarkan skill & pengalaman",
              "Shortlist kandidat otomatis per lowongan",
              "Candidate consent untuk privasi data",
              "Pipeline rekrutmen visual & terstruktur",
              "Notifikasi real-time tiap tahap proses",
              "Integrasi ATS & HRIS perusahaan",
            ].map((item) => (
              <div key={item} style={{ display: "flex", alignItems: "flex-start", gap: 10 }}>
                <CheckCircle size={15} color="#8b5cf6" style={{ marginTop: 2, flexShrink: 0 }} />
                <span style={{ fontFamily: "'Inter', sans-serif", fontSize: 13, color: "#c4b5fd", lineHeight: 1.6 }}>{item}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
