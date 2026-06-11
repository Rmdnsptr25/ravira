import { useState } from "react";
import { useNavigate } from "react-router";
import { Upload, Shield, ArrowRight, ArrowLeft } from "lucide-react";
import { toast } from "sonner";
import { RaviraOwlIcon } from "../components/RaviraLogo";
import { useAppContext } from "../contexts/AppContext";

const bidangOptions = ["Teknologi Informasi", "Desain & Kreatif", "Marketing & Sales", "Keuangan & Akuntansi", "Hukum", "Kesehatan", "Pendidikan", "Manufaktur", "Logistik", "Lainnya"];
const pendidikanOptions = ["SMA/SMK", "D3", "S1", "S2", "S3"];

export default function RegisterCandidatePage() {
  const navigate = useNavigate();
  const { registerCandidate } = useAppContext();
  const [cvFile, setCvFile] = useState<string | null>(null);
  const [consent1, setConsent1] = useState(false);
  const [consent2, setConsent2] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    setIsSubmitting(true);
    try {
      await registerCandidate({
        name: String(form.get("name") ?? ""),
        phone: String(form.get("phone") ?? ""),
        email: String(form.get("email") ?? ""),
        password: String(form.get("password") ?? ""),
        location: String(form.get("location") ?? ""),
      });
      toast.success("Akun kandidat berhasil dibuat.");
      navigate("/dashboard/kandidat");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Registrasi gagal.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const inputStyle: React.CSSProperties = {
    width: "100%", padding: "11px 14px", borderRadius: 10,
    border: "1px solid rgba(22,119,255,0.2)", outline: "none",
    fontFamily: "'Inter', sans-serif", fontSize: 14, color: "#0A1B3D",
    background: "#f8fbff", boxSizing: "border-box",
  };

  const labelStyle: React.CSSProperties = {
    display: "block", fontFamily: "'Inter', sans-serif", fontSize: 13,
    fontWeight: 500, color: "#0A1B3D", marginBottom: 6,
  };

  return (
    <div style={{ minHeight: "100vh", background: "#f0f7ff", fontFamily: "'Inter', sans-serif" }}>
      {/* Header */}
      <div style={{ background: "#071228", padding: "0 24px", height: 64, display: "flex", alignItems: "center", gap: 16 }}>
        <button onClick={() => navigate("/daftar")} style={{ background: "none", border: "none", cursor: "pointer", color: "#5a7aaa", display: "flex", alignItems: "center", gap: 6, fontFamily: "'Inter', sans-serif", fontSize: 13 }}>
          <ArrowLeft size={15} /> Kembali
        </button>
        <RaviraOwlIcon size={28} />
        <span style={{ fontFamily: "'Poppins', sans-serif", fontSize: 16, fontWeight: 700, color: "#fff" }}>Ravira</span>
      </div>

      <div style={{ maxWidth: 680, margin: "0 auto", padding: "40px 24px" }}>
        <div style={{ textAlign: "center", marginBottom: 36 }}>
          <span style={{ display: "inline-block", fontFamily: "'JetBrains Mono', monospace", fontSize: 11, color: "#1677FF", letterSpacing: "0.12em", textTransform: "uppercase", padding: "4px 14px", border: "1px solid rgba(22,119,255,0.25)", borderRadius: 100, background: "rgba(22,119,255,0.06)", marginBottom: 14 }}>
            Registrasi Kandidat
          </span>
          <h1 style={{ fontFamily: "'Poppins', sans-serif", fontSize: 28, fontWeight: 800, color: "#0A1B3D", letterSpacing: "-0.6px", marginBottom: 8 }}>
            Buat Akun Kandidat
          </h1>
          <p style={{ fontFamily: "'Inter', sans-serif", fontSize: 14, color: "#6a88b8" }}>
            Lengkapi data berikut untuk memulai perjalanan karier Anda bersama Ravira.
          </p>
        </div>

        <form onSubmit={handleSubmit}>
          <div style={{ background: "#fff", borderRadius: 20, border: "1px solid rgba(22,119,255,0.1)", boxShadow: "0 2px 16px rgba(10,27,61,0.06)", padding: "32px" }}>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 16 }}>
              <div>
                <label style={labelStyle}>Nama Lengkap *</label>
                <input name="name" style={inputStyle} placeholder="Budi Santoso" required
                  onFocus={(e) => (e.target.style.borderColor = "#1677FF")}
                  onBlur={(e) => (e.target.style.borderColor = "rgba(22,119,255,0.2)")} />
              </div>
              <div>
                <label style={labelStyle}>Nomor WhatsApp *</label>
                <input name="phone" style={inputStyle} placeholder="08xxxxxxxxxx" required
                  onFocus={(e) => (e.target.style.borderColor = "#1677FF")}
                  onBlur={(e) => (e.target.style.borderColor = "rgba(22,119,255,0.2)")} />
              </div>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 16 }}>
              <div>
                <label style={labelStyle}>Email *</label>
                <input name="email" type="email" style={inputStyle} placeholder="nama@email.com" required
                  onFocus={(e) => (e.target.style.borderColor = "#1677FF")}
                  onBlur={(e) => (e.target.style.borderColor = "rgba(22,119,255,0.2)")} />
              </div>
              <div>
                <label style={labelStyle}>Password *</label>
                <input name="password" type="password" style={inputStyle} placeholder="Min. 8 karakter" required
                  onFocus={(e) => (e.target.style.borderColor = "#1677FF")}
                  onBlur={(e) => (e.target.style.borderColor = "rgba(22,119,255,0.2)")} />
              </div>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 16 }}>
              <div>
                <label style={labelStyle}>Domisili *</label>
                <input name="location" style={inputStyle} placeholder="Jakarta Selatan" required
                  onFocus={(e) => (e.target.style.borderColor = "#1677FF")}
                  onBlur={(e) => (e.target.style.borderColor = "rgba(22,119,255,0.2)")} />
              </div>
              <div>
                <label style={labelStyle}>Pendidikan Terakhir *</label>
                <select style={{ ...inputStyle, cursor: "pointer" }} required>
                  <option value="">Pilih pendidikan</option>
                  {pendidikanOptions.map((p) => <option key={p} value={p}>{p}</option>)}
                </select>
              </div>
            </div>

            <div style={{ marginBottom: 16 }}>
              <label style={labelStyle}>Bidang Minat Karier *</label>
              <select style={{ ...inputStyle, cursor: "pointer" }} required>
                <option value="">Pilih bidang</option>
                {bidangOptions.map((b) => <option key={b} value={b}>{b}</option>)}
              </select>
            </div>

            {/* CV Upload */}
            <div style={{ marginBottom: 24 }}>
              <label style={labelStyle}>Upload CV (PDF, DOC, DOCX)</label>
              <div
                onClick={() => setCvFile("cv_budi_santoso.pdf")}
                style={{
                  border: "2px dashed rgba(22,119,255,0.25)", borderRadius: 12,
                  padding: "28px 20px", textAlign: "center", cursor: "pointer",
                  background: cvFile ? "rgba(22,119,255,0.04)" : "#f8fbff",
                  transition: "all 0.2s",
                }}
                onMouseEnter={(e) => { e.currentTarget.style.borderColor = "#1677FF"; e.currentTarget.style.background = "rgba(22,119,255,0.04)"; }}
                onMouseLeave={(e) => { e.currentTarget.style.borderColor = "rgba(22,119,255,0.25)"; if (!cvFile) e.currentTarget.style.background = "#f8fbff"; }}
              >
                {cvFile ? (
                  <div>
                    <div style={{ fontFamily: "'Inter', sans-serif", fontSize: 14, fontWeight: 600, color: "#1677FF", marginBottom: 4 }}>✓ {cvFile}</div>
                    <div style={{ fontFamily: "'Inter', sans-serif", fontSize: 12, color: "#6a88b8" }}>Klik untuk mengganti file</div>
                  </div>
                ) : (
                  <div>
                    <Upload size={28} color="#1677FF" style={{ margin: "0 auto 8px" }} />
                    <div style={{ fontFamily: "'Poppins', sans-serif", fontSize: 14, fontWeight: 600, color: "#0A1B3D", marginBottom: 4 }}>Klik atau seret CV Anda ke sini</div>
                    <div style={{ fontFamily: "'Inter', sans-serif", fontSize: 12, color: "#6a88b8" }}>PDF, DOC, atau DOCX • Maks. 5MB</div>
                  </div>
                )}
              </div>
            </div>

            {/* Consent */}
            <div style={{ background: "#f0f7ff", borderRadius: 12, padding: "16px 20px", marginBottom: 24 }}>
              <div style={{ display: "flex", alignItems: "flex-start", gap: 8, marginBottom: 10 }}>
                <input type="checkbox" id="c1" checked={consent1} onChange={(e) => setConsent1(e.target.checked)}
                  style={{ accentColor: "#1677FF", width: 16, height: 16, marginTop: 2, flexShrink: 0 }} />
                <label htmlFor="c1" style={{ fontFamily: "'Inter', sans-serif", fontSize: 13, color: "#4a6a9a", cursor: "pointer", lineHeight: 1.5 }}>
                  Saya menyetujui <span style={{ color: "#1677FF", fontWeight: 500 }}>kebijakan penggunaan data</span> Ravira dan memberikan izin untuk menyimpan informasi profil saya.
                </label>
              </div>
              <div style={{ display: "flex", alignItems: "flex-start", gap: 8 }}>
                <input type="checkbox" id="c2" checked={consent2} onChange={(e) => setConsent2(e.target.checked)}
                  style={{ accentColor: "#1677FF", width: 16, height: 16, marginTop: 2, flexShrink: 0 }} />
                <label htmlFor="c2" style={{ fontFamily: "'Inter', sans-serif", fontSize: 13, color: "#4a6a9a", cursor: "pointer", lineHeight: 1.5 }}>
                  Saya mengizinkan CV dan profil saya dianalisis oleh sistem AI Ravira untuk keperluan pencocokan pekerjaan.
                </label>
              </div>
            </div>

            <button type="submit" disabled={!consent1 || !consent2 || isSubmitting}
              style={{
                width: "100%", padding: "13px", borderRadius: 12, border: "none",
                background: consent1 && consent2 && !isSubmitting ? "linear-gradient(135deg, #1677FF, #0D47A1)" : "rgba(22,119,255,0.3)",
                fontFamily: "'Poppins', sans-serif", fontSize: 15, fontWeight: 700, color: "#fff",
                cursor: consent1 && consent2 && !isSubmitting ? "pointer" : "not-allowed",
                display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
                transition: "transform 0.2s", boxShadow: consent1 && consent2 && !isSubmitting ? "0 6px 20px rgba(22,119,255,0.4)" : "none",
              }}>
              {isSubmitting ? "Memproses..." : "Buat Akun Kandidat"} <ArrowRight size={16} />
            </button>
          </div>
        </form>

        <div style={{ display: "flex", alignItems: "center", gap: 8, justifyContent: "center", marginTop: 20 }}>
          <Shield size={14} color="#10d98e" />
          <span style={{ fontFamily: "'Inter', sans-serif", fontSize: 12, color: "#6a88b8" }}>
            Data Anda aman. Profil tidak akan dibagikan ke perusahaan tanpa izin Anda.
          </span>
        </div>
      </div>
    </div>
  );
}
