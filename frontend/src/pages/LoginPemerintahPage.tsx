import { useState } from "react";
import { useNavigate } from "react-router";
import { Eye, EyeOff, ArrowRight } from "lucide-react";
import { RaviraOwlIcon } from "../components/RaviraLogo";

export default function LoginPemerintahPage() {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [remember, setRemember] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
  };

  return (
    <div style={{ minHeight: "100vh", display: "flex", fontFamily: "'Inter', sans-serif" }}>
      {/* Left panel */}
      <div style={{
        width: "42%", background: "linear-gradient(160deg, #021220 0%, #041c2e 50%, #062640 100%)",
        display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center",
        padding: "60px 48px", position: "relative", overflow: "hidden",
      }} className="login-left-panel">
        <div style={{ position: "absolute", inset: 0, background: "radial-gradient(ellipse 70% 50% at 40% 40%, rgba(77,184,255,0.15) 0%, transparent 65%)", pointerEvents: "none" }} />
        <div style={{ position: "absolute", inset: 0, opacity: 0.03, backgroundImage: "radial-gradient(circle, #4DB8FF 1px, transparent 1px)", backgroundSize: "36px 36px", pointerEvents: "none" }} />
        <div style={{ position: "relative", zIndex: 10, textAlign: "center", maxWidth: 360 }}>
          <div style={{ display: "flex", justifyContent: "center", marginBottom: 20 }}>
            <RaviraOwlIcon size={72} />
          </div>
          <h1 style={{ fontFamily: "'Poppins', sans-serif", fontSize: 32, fontWeight: 800, color: "#fff", letterSpacing: "-1px", marginBottom: 10 }}>Ravira</h1>
          <p style={{ fontFamily: "'Poppins', sans-serif", fontSize: 10, fontWeight: 600, color: "#4DB8FF", letterSpacing: "0.22em", textTransform: "uppercase", marginBottom: 32 }}>
            Workforce Intelligence untuk Kebijakan Publik
          </p>
          <p style={{ fontFamily: "'Inter', sans-serif", fontSize: 15, color: "#6a9ab8", lineHeight: 1.75, marginBottom: 40 }}>
            Data agregat dan anonim untuk mendukung kebijakan ketenagakerjaan berbasis bukti.
          </p>
          {[
            { label: "Data Agregat & Anonim", sub: "Privasi kandidat terlindungi sepenuhnya" },
            { label: "Heatmap Workforce Regional", sub: "Peta persebaran tenaga kerja seluruh Indonesia" },
            { label: "Proyeksi Kompetensi AI", sub: "Antisipasi kebutuhan skill masa depan" },
          ].map((f) => (
            <div key={f.label} style={{ display: "flex", alignItems: "flex-start", gap: 12, marginBottom: 16, textAlign: "left" }}>
              <div style={{ width: 8, height: 8, borderRadius: "50%", background: "#4DB8FF", marginTop: 6, flexShrink: 0 }} />
              <div>
                <div style={{ fontFamily: "'Poppins', sans-serif", fontSize: 13, fontWeight: 600, color: "#c5dff0" }}>{f.label}</div>
                <div style={{ fontFamily: "'Inter', sans-serif", fontSize: 12, color: "#4a7a9a" }}>{f.sub}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Right panel */}
      <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", padding: "40px 48px", background: "#ffffff" }}>
        <div style={{ width: "100%", maxWidth: 420 }}>
          <button onClick={() => navigate("/masuk")} style={{ background: "none", border: "none", cursor: "pointer", color: "#6a88b8", fontFamily: "'Inter', sans-serif", fontSize: 13, marginBottom: 32, display: "flex", alignItems: "center", gap: 6, padding: 0 }}>
            ← Kembali ke Pilihan Masuk
          </button>

          <h2 style={{ fontFamily: "'Poppins', sans-serif", fontSize: 26, fontWeight: 800, color: "#0A1B3D", letterSpacing: "-0.6px", marginBottom: 6 }}>
            Masuk sebagai Pemerintah / Institusi
          </h2>
          <p style={{ fontFamily: "'Inter', sans-serif", fontSize: 14, color: "#6a88b8", marginBottom: 28 }}>
            Akses data workforce analytics dan insight tenaga kerja secara agregat.
          </p>

          <form onSubmit={handleLogin}>
            <p role="status" style={{ fontFamily: "'Inter', sans-serif", fontSize: 13, color: "#6a88b8", lineHeight: 1.6, marginBottom: 20 }}>Login pemerintah / institusi belum tersedia. Form ini dinonaktifkan dan tidak membuka sesi atau akses dashboard.</p>
            <fieldset disabled style={{ border: 0, margin: 0, padding: 0, minWidth: 0 }}>
            <div style={{ marginBottom: 16 }}>
              <label style={{ display: "block", fontFamily: "'Inter', sans-serif", fontSize: 13, fontWeight: 500, color: "#0A1B3D", marginBottom: 6 }}>Email Resmi</label>
              <input
                type="email" value={email} onChange={(e) => setEmail(e.target.value)}
                placeholder="nama@instansi.go.id" required
                style={{ width: "100%", padding: "11px 14px", borderRadius: 10, border: "1px solid rgba(77,184,255,0.25)", outline: "none", fontFamily: "'Inter', sans-serif", fontSize: 14, color: "#0A1B3D", background: "#f5fbff", boxSizing: "border-box" }}
                onFocus={(e) => (e.target.style.borderColor = "#4DB8FF")}
                onBlur={(e) => (e.target.style.borderColor = "rgba(77,184,255,0.25)")}
              />
            </div>

            <div style={{ marginBottom: 8 }}>
              <label style={{ display: "block", fontFamily: "'Inter', sans-serif", fontSize: 13, fontWeight: 500, color: "#0A1B3D", marginBottom: 6 }}>Password</label>
              <div style={{ position: "relative" }}>
                <input
                  type={showPassword ? "text" : "password"} value={password} onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••" required
                  style={{ width: "100%", padding: "11px 40px 11px 14px", borderRadius: 10, border: "1px solid rgba(77,184,255,0.25)", outline: "none", fontFamily: "'Inter', sans-serif", fontSize: 14, color: "#0A1B3D", background: "#f5fbff", boxSizing: "border-box" }}
                  onFocus={(e) => (e.target.style.borderColor = "#4DB8FF")}
                  onBlur={(e) => (e.target.style.borderColor = "rgba(77,184,255,0.25)")}
                />
                <button type="button" onClick={() => setShowPassword(!showPassword)}
                  style={{ position: "absolute", right: 12, top: "50%", transform: "translateY(-50%)", background: "none", border: "none", cursor: "pointer", color: "#6a88b8" }}>
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 22 }}>
              <label style={{ display: "flex", alignItems: "center", gap: 7, cursor: "pointer" }}>
                <input type="checkbox" checked={remember} onChange={(e) => setRemember(e.target.checked)} style={{ accentColor: "#4DB8FF", width: 15, height: 15 }} />
                <span style={{ fontFamily: "'Inter', sans-serif", fontSize: 13, color: "#6a88b8" }}>Ingat saya</span>
              </label>
              <button type="button" style={{ background: "none", border: "none", cursor: "pointer", fontFamily: "'Inter', sans-serif", fontSize: 13, color: "#4DB8FF", padding: 0 }}>
                Lupa password?
              </button>
            </div>

            <button type="submit" style={{ width: "100%", padding: "13px", borderRadius: 12, border: "none", background: "linear-gradient(135deg, #4DB8FF, #0090d4)", fontFamily: "'Poppins', sans-serif", fontSize: 15, fontWeight: 700, color: "#fff", cursor: "pointer", boxShadow: "0 6px 20px rgba(77,184,255,0.4)", display: "flex", alignItems: "center", justifyContent: "center", gap: 8, marginBottom: 20, transition: "transform 0.2s" }}
              onMouseEnter={(e) => (e.currentTarget.style.transform = "translateY(-1px)")}
              onMouseLeave={(e) => (e.currentTarget.style.transform = "translateY(0)")}
            >
              Login Belum Tersedia <ArrowRight size={16} />
            </button>
            </fieldset>
          </form>

          <p style={{ textAlign: "center", fontFamily: "'Inter', sans-serif", fontSize: 13, color: "#6a88b8" }}>
            Belum punya akses?{" "}
            <button onClick={() => navigate("/daftar/pemerintah")} style={{ background: "none", border: "none", cursor: "pointer", color: "#4DB8FF", fontWeight: 600, padding: 0, fontFamily: "'Inter', sans-serif", fontSize: 13 }}>
              Ajukan Akses Analytics
            </button>
          </p>
        </div>
      </div>

      <style>{`
        @media (max-width: 768px) { .login-left-panel { display: none !important; } }
      `}</style>
    </div>
  );
}
