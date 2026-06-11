import { useNavigate } from "react-router";
import { PerusahaanNavbar } from "../components/PerusahaanNavbar";
import { BarChart2, TrendingUp, Users, Clock, ArrowRight } from "lucide-react";

const metrics = [
  { label: "Rata-rata Match Score", value: "82%", color: "#10d98e", desc: "Rata-rata kesesuaian kandidat yang melamar terhadap lowongan yang dibuka" },
  { label: "Time-to-Hire", value: "12 hari", color: "#1677FF", desc: "Rata-rata waktu dari lowongan dibuka hingga kandidat di-hire" },
  { label: "Pipeline Conversion", value: "34%", color: "#8b5cf6", desc: "Persentase kandidat yang bergerak dari Applied ke Interview" },
  { label: "Offer Acceptance Rate", value: "78%", color: "#f59e0b", desc: "Persentase offer yang diterima oleh kandidat final" },
];

const insights = [
  {
    icon: TrendingUp,
    color: "#10d98e",
    bg: "rgba(16,217,142,0.08)",
    title: "Rata-rata Match Score",
    desc: "Lihat tren match score kandidat per lowongan dan per periode. Identifikasi lowongan dengan kualitas kandidat tertinggi dan terendah.",
  },
  {
    icon: BarChart2,
    color: "#1677FF",
    bg: "rgba(22,119,255,0.08)",
    title: "Skill yang Sering Cocok",
    desc: "Skill apa yang paling sering muncul di kandidat yang lolos ke tahap interview. Berguna untuk memperbarui kriteria lowongan.",
  },
  {
    icon: Users,
    color: "#8b5cf6",
    bg: "rgba(139,92,246,0.08)",
    title: "Skill Gap Kandidat",
    desc: "Skill apa yang paling sering kurang dari kandidat yang melamar. Bisa jadi sinyal bahwa deskripsi lowongan perlu disesuaikan.",
  },
  {
    icon: TrendingUp,
    color: "#f59e0b",
    bg: "rgba(245,158,11,0.08)",
    title: "Source Kandidat",
    desc: "Dari mana kandidat terbaik berasal — direct apply, referral, atau platform mana. Optimalkan anggaran rekrutmen berdasarkan data.",
  },
  {
    icon: Clock,
    color: "#ff6b6b",
    bg: "rgba(255,107,107,0.08)",
    title: "Time-to-Hire",
    desc: "Berapa lama proses rekrutmen rata-rata per posisi dan per tahap pipeline. Identifikasi bottleneck yang memperlambat proses.",
  },
  {
    icon: BarChart2,
    color: "#4DB8FF",
    bg: "rgba(77,184,255,0.08)",
    title: "Pipeline Conversion",
    desc: "Berapa persen kandidat yang bergerak dari satu tahap ke tahap berikutnya. Data conversion per stage membantu mengoptimalkan proses screening.",
  },
];

export default function UntukPerusahaanInsightRekrutmenPage() {
  const navigate = useNavigate();

  return (
    <div style={{ minHeight: "100vh", background: "#f4f8ff", fontFamily: "'Inter', sans-serif" }}>
      <PerusahaanNavbar />

      {/* Hero */}
      <div style={{ background: "linear-gradient(160deg, #0d0820 0%, #130e2e 55%, #1a0a3d 100%)", paddingTop: 120, paddingBottom: 60, position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", inset: 0, background: "radial-gradient(ellipse 60% 50% at 50% 40%, rgba(139,92,246,0.15) 0%, transparent 70%)", pointerEvents: "none" }} />
        <div style={{ position: "relative", zIndex: 1, maxWidth: 700, margin: "0 auto", padding: "0 24px", textAlign: "center" }}>
          <div style={{ display: "inline-block", fontFamily: "'Poppins', sans-serif", fontSize: 11, fontWeight: 600, color: "#c4b5fd", letterSpacing: "0.2em", textTransform: "uppercase", marginBottom: 16, background: "rgba(139,92,246,0.12)", border: "1px solid rgba(139,92,246,0.25)", borderRadius: 20, padding: "4px 14px" }}>
            Insight Rekrutmen
          </div>
          <h1 style={{ fontFamily: "'Poppins', sans-serif", fontSize: 36, fontWeight: 800, color: "#fff", letterSpacing: "-1px", marginBottom: 14, lineHeight: 1.15 }}>
            Analitik Rekrutmen Berbasis Data
          </h1>
          <p style={{ fontFamily: "'Inter', sans-serif", fontSize: 15, color: "#9a85c8", lineHeight: 1.7 }}>
            Pantau performa rekrutmen Anda secara menyeluruh. Buat keputusan hiring yang lebih cerdas berdasarkan data nyata.
          </p>
        </div>
      </div>

      {/* Key Metrics */}
      <div style={{ maxWidth: 960, margin: "0 auto", padding: "60px 24px 0" }}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 16, marginBottom: 48 }}>
          {metrics.map((m) => (
            <div key={m.label} style={{ background: "#fff", borderRadius: 18, border: "1px solid rgba(22,119,255,0.08)", padding: "24px", textAlign: "center", boxShadow: "0 4px 18px rgba(10,27,61,0.05)" }}>
              <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 28, fontWeight: 800, color: m.color, marginBottom: 6 }}>{m.value}</div>
              <div style={{ fontFamily: "'Poppins', sans-serif", fontSize: 12, fontWeight: 700, color: "#0A1B3D", marginBottom: 8 }}>{m.label}</div>
              <p style={{ fontFamily: "'Inter', sans-serif", fontSize: 11, color: "#6a88b8", lineHeight: 1.5, margin: 0 }}>{m.desc}</p>
            </div>
          ))}
        </div>

        {/* Insight Cards */}
        <div style={{ textAlign: "center", marginBottom: 32 }}>
          <h2 style={{ fontFamily: "'Poppins', sans-serif", fontSize: 24, fontWeight: 800, color: "#0A1B3D", marginBottom: 10 }}>
            Data Insight yang Tersedia
          </h2>
          <p style={{ fontFamily: "'Inter', sans-serif", fontSize: 14, color: "#6a88b8" }}>
            Semua metrik penting rekrutmen dalam satu dashboard terpadu.
          </p>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: 20, marginBottom: 48 }}>
          {insights.map((ins) => {
            const Icon = ins.icon;
            return (
              <div key={ins.title} style={{ background: "#fff", borderRadius: 18, border: "1px solid rgba(22,119,255,0.08)", padding: "24px", boxShadow: "0 4px 18px rgba(10,27,61,0.05)" }}>
                <div style={{ width: 46, height: 46, borderRadius: 13, background: ins.bg, display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 14 }}>
                  <Icon size={20} color={ins.color} />
                </div>
                <div style={{ fontFamily: "'Poppins', sans-serif", fontSize: 14, fontWeight: 700, color: "#0A1B3D", marginBottom: 8 }}>{ins.title}</div>
                <p style={{ fontFamily: "'Inter', sans-serif", fontSize: 13, color: "#6a88b8", lineHeight: 1.7, margin: 0 }}>{ins.desc}</p>
              </div>
            );
          })}
        </div>

        <div style={{ textAlign: "center", paddingBottom: 60 }}>
          <button onClick={() => navigate("/daftar/perusahaan")} style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "14px 32px", borderRadius: 12, border: "none", background: "linear-gradient(135deg, #8b5cf6, #6d28d9)", fontFamily: "'Poppins', sans-serif", fontSize: 15, fontWeight: 700, color: "#fff", cursor: "pointer", boxShadow: "0 6px 20px rgba(139,92,246,0.4)" }}>
            Akses Dashboard Insight <ArrowRight size={16} />
          </button>
        </div>
      </div>
    </div>
  );
}
