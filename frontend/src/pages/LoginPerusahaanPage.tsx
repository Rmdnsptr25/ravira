import { useState } from "react";
import { useNavigate } from "react-router";
import { Eye, EyeOff, ArrowRight } from "lucide-react";
import { RaviraOwlIcon } from "../components/RaviraLogo";
import { toast } from "sonner";
import { useAppContext } from "../contexts/AppContext";

export default function LoginPerusahaanPage() {
  const navigate = useNavigate();
  const { login } = useAppContext();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [remember, setRemember] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return;
    setIsSubmitting(true);
    try {
      await login(email, password, "RECRUITER");
      navigate("/dashboard/perusahaan", { replace: true });
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Login gagal.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div style={{ minHeight: "100vh", display: "flex", fontFamily: "'Inter', sans-serif" }}>
      {/* Left panel */}
      <div style={{
        width: "42%", background: "linear-gradient(160deg, #0d0820 0%, #130e2e 50%, #1a0a3d 100%)",
        display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center",
        padding: "60px 48px", position: "relative", overflow: "hidden",
      }} className="login-left-panel">
        <div style={{ position: "absolute", inset: 0, background: "radial-gradient(ellipse 70% 50% at 40% 40%, rgba(139,92,246,0.2) 0%, transparent 65%)", pointerEvents: "none" }} />
        <div style={{ position: "absolute", inset: 0, opacity: 0.03, backgroundImage: "radial-gradient(circle, #c4b5fd 1px, transparent 1px)", backgroundSize: "36px 36px", pointerEvents: "none" }} />
        <div style={{ position: "relative", zIndex: 10, textAlign: "center", maxWidth: 360 }}>
          <div style={{ display: "flex", justifyContent: "center", marginBottom: 20 }}>
            <RaviraOwlIcon size={72} />
          </div>
          <h1 style={{ fontFamily: "'Poppins', sans-serif", fontSize: 32, fontWeight: 800, color: "#fff", letterSpacing: "-1px", marginBottom: 10 }}>Ravira</h1>
          <p style={{ fontFamily: "'Poppins', sans-serif", fontSize: 10, fontWeight: 600, color: "#c4b5fd", letterSpacing: "0.22em", textTransform: "uppercase", marginBottom: 32 }}>
            Rekrut Talenta Terbaik Indonesia
          </p>
          <p style={{ fontFamily: "'Inter', sans-serif", fontSize: 15, color: "#9a85c8", lineHeight: 1.75, marginBottom: 40 }}>
            Temukan kandidat ideal dengan matching berbasis AI dan kelola pipeline rekrutmen secara efisien.
          </p>
          {[
            { label: "AI-Powered Matching", sub: "Kandidat terseleksi otomatis sesuai kebutuhan" },
            { label: "Pipeline Rekrutmen Visual", sub: "Kelola proses hiring dalam satu tampilan" },
            { label: "2.800+ Perusahaan Aktif", sub: "Bergabung dengan ekosistem rekrutmen Indonesia" },
          ].map((f) => (
            <div key={f.label} style={{ display: "flex", alignItems: "flex-start", gap: 12, marginBottom: 16, textAlign: "left" }}>
              <div style={{ width: 8, height: 8, borderRadius: "50%", background: "#8b5cf6", marginTop: 6, flexShrink: 0 }} />
              <div>
                <div style={{ fontFamily: "'Poppins', sans-serif", fontSize: 13, fontWeight: 600, color: "#d8c5f0" }}>{f.label}</div>
                <div style={{ fontFamily: "'Inter', sans-serif", fontSize: 12, color: "#7a5aaa" }}>{f.sub}</div>
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
            Masuk sebagai Perusahaan
          </h2>
          <p style={{ fontFamily: "'Inter', sans-serif", fontSize: 14, color: "#6a88b8", marginBottom: 28 }}>
            Kelola proses rekrutmen dan temukan kandidat terbaik dengan Ravira.
          </p>

          <form onSubmit={handleLogin}>
            <div style={{ marginBottom: 16 }}>
              <label style={{ display: "block", fontFamily: "'Inter', sans-serif", fontSize: 13, fontWeight: 500, color: "#0A1B3D", marginBottom: 6 }}>Email Perusahaan</label>
              <input
                type="email" value={email} onChange={(e) => setEmail(e.target.value)}
                placeholder="hr@perusahaan.com" required
                style={{ width: "100%", padding: "11px 14px", borderRadius: 10, border: "1px solid rgba(139,92,246,0.2)", outline: "none", fontFamily: "'Inter', sans-serif", fontSize: 14, color: "#0A1B3D", background: "#faf8ff", boxSizing: "border-box" }}
                onFocus={(e) => (e.target.style.borderColor = "#8b5cf6")}
                onBlur={(e) => (e.target.style.borderColor = "rgba(139,92,246,0.2)")}
              />
            </div>

            <div style={{ marginBottom: 8 }}>
              <label style={{ display: "block", fontFamily: "'Inter', sans-serif", fontSize: 13, fontWeight: 500, color: "#0A1B3D", marginBottom: 6 }}>Password</label>
              <div style={{ position: "relative" }}>
                <input
                  type={showPassword ? "text" : "password"} value={password} onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••" required
                  style={{ width: "100%", padding: "11px 40px 11px 14px", borderRadius: 10, border: "1px solid rgba(139,92,246,0.2)", outline: "none", fontFamily: "'Inter', sans-serif", fontSize: 14, color: "#0A1B3D", background: "#faf8ff", boxSizing: "border-box" }}
                  onFocus={(e) => (e.target.style.borderColor = "#8b5cf6")}
                  onBlur={(e) => (e.target.style.borderColor = "rgba(139,92,246,0.2)")}
                />
                <button type="button" onClick={() => setShowPassword(!showPassword)}
                  style={{ position: "absolute", right: 12, top: "50%", transform: "translateY(-50%)", background: "none", border: "none", cursor: "pointer", color: "#6a88b8" }}>
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 22 }}>
              <label style={{ display: "flex", alignItems: "center", gap: 7, cursor: "pointer" }}>
                <input type="checkbox" checked={remember} onChange={(e) => setRemember(e.target.checked)} style={{ accentColor: "#8b5cf6", width: 15, height: 15 }} />
                <span style={{ fontFamily: "'Inter', sans-serif", fontSize: 13, color: "#6a88b8" }}>Ingat saya</span>
              </label>
              <button type="button" style={{ background: "none", border: "none", cursor: "pointer", fontFamily: "'Inter', sans-serif", fontSize: 13, color: "#8b5cf6", padding: 0 }}>
                Lupa password?
              </button>
            </div>

            <button type="submit" disabled={isSubmitting} style={{ width: "100%", padding: "13px", borderRadius: 12, border: "none", background: "linear-gradient(135deg, #8b5cf6, #6d28d9)", fontFamily: "'Poppins', sans-serif", fontSize: 15, fontWeight: 700, color: "#fff", cursor: "pointer", boxShadow: "0 6px 20px rgba(139,92,246,0.4)", display: "flex", alignItems: "center", justifyContent: "center", gap: 8, marginBottom: 20, transition: "transform 0.2s" }}
              onMouseEnter={(e) => (e.currentTarget.style.transform = "translateY(-1px)")}
              onMouseLeave={(e) => (e.currentTarget.style.transform = "translateY(0)")}
            >
              {isSubmitting ? "Memproses..." : "Masuk Perusahaan"} <ArrowRight size={16} />
            </button>
          </form>

          <p style={{ textAlign: "center", fontFamily: "'Inter', sans-serif", fontSize: 13, color: "#6a88b8" }}>
            Belum punya akun perusahaan?{" "}
            <button onClick={() => navigate("/daftar/perusahaan")} style={{ background: "none", border: "none", cursor: "pointer", color: "#8b5cf6", fontWeight: 600, padding: 0, fontFamily: "'Inter', sans-serif", fontSize: 13 }}>
              Daftarkan Perusahaan
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
