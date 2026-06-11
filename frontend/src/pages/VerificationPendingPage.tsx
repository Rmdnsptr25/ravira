import { useNavigate } from "react-router";
import { Clock, CheckCircle2, Mail, Phone, ArrowRight, FileCheck } from "lucide-react";
import { RaviraOwlIcon } from "../components/RaviraLogo";

const steps = [
  { label: "Formulir Diterima", desc: "Data dan dokumen Anda telah berhasil dikirim.", done: true },
  { label: "Verifikasi Dokumen", desc: "Tim Ravira sedang memeriksa kelengkapan dokumen resmi.", done: false, active: true },
  { label: "Review Internal", desc: "Proses persetujuan oleh tim keamanan dan legal.", done: false },
  { label: "Akun Aktif", desc: "Akun lembaga Anda siap digunakan untuk mengakses analytics.", done: false },
];

export default function VerificationPendingPage() {
  const navigate = useNavigate();

  return (
    <div style={{ minHeight: "100vh", background: "linear-gradient(160deg, #020a1c 0%, #071228 50%, #0a1b3d 100%)", fontFamily: "'Inter', sans-serif", display: "flex", flexDirection: "column" }}>
      <div style={{ position: "fixed", inset: 0, opacity: 0.03, backgroundImage: "radial-gradient(circle, #4DB8FF 1px, transparent 1px)", backgroundSize: "40px 40px", pointerEvents: "none" }} />

      {/* Header */}
      <div style={{ padding: "0 28px", height: 64, display: "flex", alignItems: "center", gap: 12, position: "relative", zIndex: 10, borderBottom: "1px solid rgba(77,184,255,0.1)" }}>
        <RaviraOwlIcon size={28} />
        <span style={{ fontFamily: "'Poppins', sans-serif", fontSize: 16, fontWeight: 700, color: "#fff" }}>Ravira</span>
      </div>

      <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "48px 24px", position: "relative", zIndex: 10 }}>

        {/* Main card */}
        <div style={{ maxWidth: 560, width: "100%", textAlign: "center", marginBottom: 32 }}>
          {/* Icon */}
          <div style={{ position: "relative", display: "inline-block", marginBottom: 28 }}>
            <div style={{ width: 88, height: 88, borderRadius: "50%", background: "rgba(77,184,255,0.1)", border: "1px solid rgba(77,184,255,0.3)", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <Clock size={40} color="#4DB8FF" />
            </div>
            <div style={{ position: "absolute", bottom: 2, right: 2, width: 24, height: 24, borderRadius: "50%", background: "#071228", border: "2px solid #071228" }}>
              <div style={{ width: "100%", height: "100%", borderRadius: "50%", background: "rgba(22,119,255,0.3)", display: "flex", alignItems: "center", justifyContent: "center", animation: "pulse 2s infinite" }}>
                <div style={{ width: 8, height: 8, borderRadius: "50%", background: "#4DB8FF" }} />
              </div>
            </div>
          </div>

          <span style={{ display: "inline-block", fontFamily: "'JetBrains Mono', monospace", fontSize: 11, color: "#4DB8FF", letterSpacing: "0.12em", textTransform: "uppercase", padding: "4px 14px", border: "1px solid rgba(77,184,255,0.25)", borderRadius: 100, background: "rgba(77,184,255,0.06)", marginBottom: 20 }}>
            Sedang Diproses
          </span>

          <h1 style={{ fontFamily: "'Poppins', sans-serif", fontSize: 32, fontWeight: 800, color: "#ffffff", letterSpacing: "-0.8px", marginBottom: 14, lineHeight: 1.2 }}>
            Permohonan Sedang Diverifikasi
          </h1>
          <p style={{ fontFamily: "'Inter', sans-serif", fontSize: 16, color: "#7a99c8", lineHeight: 1.7, marginBottom: 0 }}>
            Terima kasih! Dokumen Anda telah kami terima. Tim verifikasi Ravira akan memproses permohonan lembaga Anda dalam <strong style={{ color: "#4DB8FF" }}>3–5 hari kerja</strong>.
          </p>
        </div>

        {/* Progress steps */}
        <div style={{ maxWidth: 480, width: "100%", background: "rgba(13,31,63,0.6)", backdropFilter: "blur(16px)", borderRadius: 20, border: "1px solid rgba(77,184,255,0.15)", padding: "28px", marginBottom: 24 }}>
          <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11, color: "#4DB8FF", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 20 }}>Status Permohonan</div>
          <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>
            {steps.map((s, i) => (
              <div key={s.label} style={{ display: "flex", gap: 14 }}>
                <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                  <div style={{
                    width: 32, height: 32, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
                    background: s.done ? "#10d98e" : s.active ? "rgba(22,119,255,0.2)" : "rgba(255,255,255,0.05)",
                    border: `2px solid ${s.done ? "#10d98e" : s.active ? "#1677FF" : "rgba(255,255,255,0.1)"}`,
                  }}>
                    {s.done ? <CheckCircle2 size={16} color="#fff" /> : (
                      <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 12, fontWeight: 700, color: s.active ? "#4DB8FF" : "#3a5480" }}>{i + 1}</span>
                    )}
                  </div>
                  {i < steps.length - 1 && <div style={{ width: 1, flex: 1, background: s.done ? "#10d98e44" : "rgba(255,255,255,0.06)", minHeight: 24, margin: "4px 0" }} />}
                </div>
                <div style={{ paddingBottom: i < steps.length - 1 ? 20 : 0, paddingTop: 4 }}>
                  <div style={{ fontFamily: "'Poppins', sans-serif", fontSize: 13, fontWeight: 700, color: s.done ? "#10d98e" : s.active ? "#fff" : "#3a5480", marginBottom: 3 }}>
                    {s.label}
                    {s.active && <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10, color: "#4DB8FF", background: "rgba(77,184,255,0.1)", border: "1px solid rgba(77,184,255,0.2)", borderRadius: 6, padding: "1px 7px", marginLeft: 8 }}>PROSES</span>}
                  </div>
                  <div style={{ fontFamily: "'Inter', sans-serif", fontSize: 12, color: s.done ? "#5a8a6a" : s.active ? "#6a88b8" : "#2a3a5a", lineHeight: 1.5 }}>{s.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Contact info */}
        <div style={{ maxWidth: 480, width: "100%", background: "rgba(13,31,63,0.5)", backdropFilter: "blur(12px)", borderRadius: 16, border: "1px solid rgba(77,184,255,0.12)", padding: "20px 24px", marginBottom: 24 }}>
          <div style={{ fontFamily: "'Inter', sans-serif", fontSize: 13, color: "#6a88b8", marginBottom: 14 }}>Notifikasi akan dikirim ke email Anda. Pertanyaan? Hubungi kami:</div>
          <div style={{ display: "flex", gap: 12 }}>
            <div style={{ flex: 1, display: "flex", alignItems: "center", gap: 8, padding: "10px 14px", borderRadius: 10, background: "rgba(22,119,255,0.06)", border: "1px solid rgba(22,119,255,0.15)" }}>
              <Mail size={14} color="#4DB8FF" />
              <span style={{ fontFamily: "'Inter', sans-serif", fontSize: 12, color: "#7a99c8" }}>gov@ravira.id</span>
            </div>
            <div style={{ flex: 1, display: "flex", alignItems: "center", gap: 8, padding: "10px 14px", borderRadius: 10, background: "rgba(22,119,255,0.06)", border: "1px solid rgba(22,119,255,0.15)" }}>
              <Phone size={14} color="#4DB8FF" />
              <span style={{ fontFamily: "'Inter', sans-serif", fontSize: 12, color: "#7a99c8" }}>021-5000-RAVIRA</span>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div style={{ display: "flex", gap: 12, justifyContent: "center" }}>
          <button onClick={() => navigate("/")} style={{ display: "flex", alignItems: "center", gap: 8, padding: "12px 24px", borderRadius: 12, border: "1px solid rgba(77,184,255,0.2)", background: "rgba(77,184,255,0.06)", fontFamily: "'Inter', sans-serif", fontSize: 14, color: "#4DB8FF", cursor: "pointer" }}>
            Kembali ke Beranda
          </button>
          <button onClick={() => navigate("/dashboard/analytics")} style={{ display: "flex", alignItems: "center", gap: 8, padding: "12px 24px", borderRadius: 12, border: "none", background: "linear-gradient(135deg, #4DB8FF, #1677FF)", fontFamily: "'Poppins', sans-serif", fontSize: 14, fontWeight: 700, color: "#fff", cursor: "pointer", boxShadow: "0 4px 14px rgba(22,119,255,0.3)" }}>
            Preview Dashboard <ArrowRight size={15} />
          </button>
        </div>
      </div>
    </div>
  );
}
