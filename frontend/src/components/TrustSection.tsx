import { Shield, Lock, Key, FileText, Database, Eye } from "lucide-react";

const securityItems = [
  { icon: Shield, title: "Data Kandidat Terlindungi", desc: "Data pribadi kandidat tidak pernah dibagikan ke pihak ketiga tanpa izin eksplisit.", color: "#1677FF" },
  { icon: Lock, title: "Enkripsi End-to-End", desc: "Semua data dienkripsi baik saat disimpan maupun saat ditransmisikan.", color: "#0D47A1" },
  { icon: Key, title: "Role-Based Access Control", desc: "Akses data diatur ketat berdasarkan peran pengguna di dalam platform.", color: "#1677FF" },
  { icon: FileText, title: "Audit Log Lengkap", desc: "Setiap akses dan perubahan data dicatat secara transparan dan traceable.", color: "#0D47A1" },
  { icon: Database, title: "Data Pemerintah Anonim", desc: "Analytics untuk pemerintah dan institusi menggunakan data agregat dan anonim.", color: "#1677FF" },
  { icon: Eye, title: "AI yang Transparan", desc: "Setiap rekomendasi AI dapat dijelaskan secara transparan kepada pengguna.", color: "#0D47A1" },
];

export function TrustSection() {
  return (
    <section style={{ padding: "96px 24px", background: "#f0f7ff", position: "relative" }}>
      <div style={{ position: "absolute", inset: 0, background: "radial-gradient(ellipse 60% 40% at 50% 100%, rgba(22,119,255,0.05) 0%, transparent 70%)", pointerEvents: "none" }} />

      <div style={{ maxWidth: 1280, margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: 60 }}>
          <span style={{
            display: "inline-block", fontFamily: "'JetBrains Mono', monospace",
            fontSize: 11, color: "#10d98e", letterSpacing: "0.12em", textTransform: "uppercase",
            padding: "4px 14px", border: "1px solid rgba(16,217,142,0.3)",
            borderRadius: 100, background: "rgba(16,217,142,0.07)", marginBottom: 16,
          }}>
            Trust & Security
          </span>
          <h2 style={{
            fontFamily: "'Poppins', sans-serif",
            fontSize: "clamp(24px, 3vw, 40px)", fontWeight: 800,
            color: "#0A1B3D", lineHeight: 1.2, letterSpacing: "-0.8px", marginBottom: 12,
          }}>
            Aman, Transparan, dan{" "}
            <span style={{ color: "#1677FF" }}>Berbasis Consent</span>
          </h2>
          <p style={{ fontFamily: "'Inter', sans-serif", fontSize: 15, color: "#6a88b8", maxWidth: 480, margin: "0 auto" }}>
            Kepercayaan pengguna adalah fondasi Ravira. Kami berkomitmen terhadap keamanan data dan transparansi AI.
          </p>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))", gap: 20 }}>
          {securityItems.map(item => (
            <div
              key={item.title}
              style={{
                padding: "24px 20px", borderRadius: 16,
                background: "#ffffff",
                border: "1px solid rgba(22,119,255,0.1)",
                boxShadow: "0 2px 16px rgba(10,27,61,0.05)",
                transition: "transform 0.2s, box-shadow 0.2s, border-color 0.2s",
              }}
              onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-4px)"; e.currentTarget.style.boxShadow = "0 12px 32px rgba(22,119,255,0.1)"; e.currentTarget.style.borderColor = `${item.color}30`; }}
              onMouseLeave={e => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "0 2px 16px rgba(10,27,61,0.05)"; e.currentTarget.style.borderColor = "rgba(22,119,255,0.1)"; }}
            >
              <div style={{
                width: 44, height: 44, borderRadius: 12,
                background: `${item.color}0e`, border: `1px solid ${item.color}20`,
                display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 14,
              }}>
                <item.icon size={20} color={item.color} />
              </div>
              <h4 style={{ fontFamily: "'Poppins', sans-serif", fontSize: 14, fontWeight: 700, color: "#0A1B3D", marginBottom: 7 }}>
                {item.title}
              </h4>
              <p style={{ fontFamily: "'Inter', sans-serif", fontSize: 13, color: "#6a88b8", lineHeight: 1.6 }}>
                {item.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
