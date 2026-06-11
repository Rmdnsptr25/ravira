import { useState } from "react";
import { useNavigate } from "react-router";
import { ArrowLeft, ArrowRight, Landmark, Shield, Upload, FileCheck } from "lucide-react";
import { RaviraOwlIcon } from "../components/RaviraLogo";

const jenisLembagaOptions = ["Kementerian", "Dinas Tenaga Kerja", "BPJS Ketenagakerjaan", "Badan Nasional Sertifikasi Profesi (BNSP)", "Lembaga Pendidikan & Pelatihan", "Pemerintah Daerah (Pemda)", "BUMN", "Lembaga Riset", "Lainnya"];
const wilayahOptions = ["DKI Jakarta", "Jawa Barat", "Jawa Tengah", "Jawa Timur", "Sumatera Utara", "Sulawesi Selatan", "Kalimantan Timur", "Bali", "Nasional (seluruh Indonesia)", "Lainnya"];

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

export default function RegisterGovernmentPage() {
  const navigate = useNavigate();
  const [suratFile, setSuratFile] = useState<string | null>(null);
  const [consent1, setConsent1] = useState(false);
  const [consent2, setConsent2] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    navigate("/daftar/pemerintah/verifikasi");
  };

  return (
    <div style={{ minHeight: "100vh", background: "#f0f7ff", fontFamily: "'Inter', sans-serif" }}>
      <div style={{ background: "#071228", padding: "0 24px", height: 64, display: "flex", alignItems: "center", gap: 16 }}>
        <button onClick={() => navigate("/daftar")} style={{ background: "none", border: "none", cursor: "pointer", color: "#5a7aaa", display: "flex", alignItems: "center", gap: 6, fontFamily: "'Inter', sans-serif", fontSize: 13 }}>
          <ArrowLeft size={15} /> Kembali
        </button>
        <RaviraOwlIcon size={28} />
        <span style={{ fontFamily: "'Poppins', sans-serif", fontSize: 16, fontWeight: 700, color: "#fff" }}>Ravira</span>
      </div>

      <div style={{ maxWidth: 720, margin: "0 auto", padding: "40px 24px" }}>
        <div style={{ textAlign: "center", marginBottom: 36 }}>
          <div style={{ width: 52, height: 52, borderRadius: 16, background: "rgba(77,184,255,0.1)", border: "1px solid rgba(77,184,255,0.3)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 16px" }}>
            <Landmark size={24} color="#4DB8FF" />
          </div>
          <span style={{ display: "inline-block", fontFamily: "'JetBrains Mono', monospace", fontSize: 11, color: "#4DB8FF", letterSpacing: "0.12em", textTransform: "uppercase", padding: "4px 14px", border: "1px solid rgba(77,184,255,0.25)", borderRadius: 100, background: "rgba(77,184,255,0.06)", marginBottom: 14 }}>
            Registrasi Institusi
          </span>
          <h1 style={{ fontFamily: "'Poppins', sans-serif", fontSize: 28, fontWeight: 800, color: "#0A1B3D", letterSpacing: "-0.6px", marginBottom: 8 }}>
            Daftar sebagai Lembaga Pemerintah
          </h1>
          <p style={{ fontFamily: "'Inter', sans-serif", fontSize: 14, color: "#6a88b8" }}>
            Akses data analitik workforce regional dan nasional untuk pengambilan kebijakan berbasis data.
          </p>
        </div>

        {/* Info card */}
        <div style={{ background: "linear-gradient(135deg, rgba(77,184,255,0.06), rgba(22,119,255,0.04))", border: "1px solid rgba(77,184,255,0.2)", borderRadius: 16, padding: "16px 20px", marginBottom: 24, display: "flex", gap: 12 }}>
          <FileCheck size={18} color="#4DB8FF" style={{ flexShrink: 0, marginTop: 2 }} />
          <div>
            <div style={{ fontFamily: "'Poppins', sans-serif", fontSize: 13, fontWeight: 700, color: "#0A1B3D", marginBottom: 4 }}>Verifikasi Diperlukan</div>
            <p style={{ fontFamily: "'Inter', sans-serif", fontSize: 13, color: "#6a88b8", lineHeight: 1.6 }}>
              Akun lembaga pemerintah memerlukan verifikasi dokumen resmi. Tim Ravira akan memproses permohonan Anda dalam 3–5 hari kerja.
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          <div style={{ background: "#fff", borderRadius: 20, border: "1px solid rgba(22,119,255,0.1)", boxShadow: "0 2px 16px rgba(10,27,61,0.06)", padding: "32px" }}>

            <h3 style={{ fontFamily: "'Poppins', sans-serif", fontSize: 14, fontWeight: 700, color: "#0A1B3D", marginBottom: 16, paddingBottom: 10, borderBottom: "1px solid rgba(22,119,255,0.1)" }}>Identitas Lembaga</h3>

            <div style={{ marginBottom: 16 }}>
              <label style={labelStyle}>Nama Lembaga/Instansi *</label>
              <input style={inputStyle} placeholder="Dinas Tenaga Kerja Provinsi DKI Jakarta" required
                onFocus={(e) => (e.target.style.borderColor = "#4DB8FF")}
                onBlur={(e) => (e.target.style.borderColor = "rgba(22,119,255,0.2)")} />
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 16 }}>
              <div>
                <label style={labelStyle}>Jenis Lembaga *</label>
                <select style={{ ...inputStyle, cursor: "pointer" }} required>
                  <option value="">Pilih jenis lembaga</option>
                  {jenisLembagaOptions.map((j) => <option key={j} value={j}>{j}</option>)}
                </select>
              </div>
              <div>
                <label style={labelStyle}>Cakupan Wilayah *</label>
                <select style={{ ...inputStyle, cursor: "pointer" }} required>
                  <option value="">Pilih wilayah</option>
                  {wilayahOptions.map((w) => <option key={w} value={w}>{w}</option>)}
                </select>
              </div>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 16 }}>
              <div>
                <label style={labelStyle}>Website Resmi</label>
                <input style={inputStyle} placeholder="https://disnaker.jakarta.go.id"
                  onFocus={(e) => (e.target.style.borderColor = "#4DB8FF")}
                  onBlur={(e) => (e.target.style.borderColor = "rgba(22,119,255,0.2)")} />
              </div>
              <div>
                <label style={labelStyle}>NPWP Lembaga *</label>
                <input style={inputStyle} placeholder="00.000.000.0-000.000" required
                  onFocus={(e) => (e.target.style.borderColor = "#4DB8FF")}
                  onBlur={(e) => (e.target.style.borderColor = "rgba(22,119,255,0.2)")} />
              </div>
            </div>

            <h3 style={{ fontFamily: "'Poppins', sans-serif", fontSize: 14, fontWeight: 700, color: "#0A1B3D", marginBottom: 16, paddingBottom: 10, borderBottom: "1px solid rgba(22,119,255,0.1)" }}>Data PIC</h3>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 16 }}>
              <div>
                <label style={labelStyle}>Nama PIC *</label>
                <input style={inputStyle} placeholder="Dr. Bambang Prasetyo" required
                  onFocus={(e) => (e.target.style.borderColor = "#4DB8FF")}
                  onBlur={(e) => (e.target.style.borderColor = "rgba(22,119,255,0.2)")} />
              </div>
              <div>
                <label style={labelStyle}>Jabatan/NIP *</label>
                <input style={inputStyle} placeholder="Kepala Bidang / NIP" required
                  onFocus={(e) => (e.target.style.borderColor = "#4DB8FF")}
                  onBlur={(e) => (e.target.style.borderColor = "rgba(22,119,255,0.2)")} />
              </div>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 24 }}>
              <div>
                <label style={labelStyle}>Email Dinas *</label>
                <input type="email" style={inputStyle} placeholder="pic@instansi.go.id" required
                  onFocus={(e) => (e.target.style.borderColor = "#4DB8FF")}
                  onBlur={(e) => (e.target.style.borderColor = "rgba(22,119,255,0.2)")} />
              </div>
              <div>
                <label style={labelStyle}>Nomor Telepon Kantor</label>
                <input style={inputStyle} placeholder="021-xxxxxxxx"
                  onFocus={(e) => (e.target.style.borderColor = "#4DB8FF")}
                  onBlur={(e) => (e.target.style.borderColor = "rgba(22,119,255,0.2)")} />
              </div>
            </div>

            {/* Document upload */}
            <div style={{ marginBottom: 24 }}>
              <label style={labelStyle}>Surat Resmi/SK Lembaga *</label>
              <div
                onClick={() => setSuratFile("surat_resmi_lembaga.pdf")}
                style={{
                  border: "2px dashed rgba(77,184,255,0.3)", borderRadius: 12,
                  padding: "28px 20px", textAlign: "center", cursor: "pointer",
                  background: suratFile ? "rgba(77,184,255,0.04)" : "#f8fbff",
                }}
                onMouseEnter={(e) => { e.currentTarget.style.borderColor = "#4DB8FF"; }}
                onMouseLeave={(e) => { e.currentTarget.style.borderColor = "rgba(77,184,255,0.3)"; }}
              >
                {suratFile ? (
                  <div style={{ fontFamily: "'Inter', sans-serif", fontSize: 14, fontWeight: 600, color: "#4DB8FF" }}>✓ {suratFile}</div>
                ) : (
                  <div>
                    <Upload size={26} color="#4DB8FF" style={{ margin: "0 auto 8px" }} />
                    <div style={{ fontFamily: "'Poppins', sans-serif", fontSize: 14, fontWeight: 600, color: "#0A1B3D", marginBottom: 4 }}>Upload Dokumen Resmi</div>
                    <div style={{ fontFamily: "'Inter', sans-serif", fontSize: 12, color: "#6a88b8" }}>SK, Surat Tugas, atau dokumen pengesahan • PDF • Maks. 10MB</div>
                  </div>
                )}
              </div>
            </div>

            {/* Consent */}
            <div style={{ background: "#f0f7ff", borderRadius: 12, padding: "16px 20px", marginBottom: 24 }}>
              <div style={{ display: "flex", alignItems: "flex-start", gap: 8, marginBottom: 10 }}>
                <input type="checkbox" id="gc1" checked={consent1} onChange={(e) => setConsent1(e.target.checked)}
                  style={{ accentColor: "#4DB8FF", width: 16, height: 16, marginTop: 2, flexShrink: 0 }} />
                <label htmlFor="gc1" style={{ fontFamily: "'Inter', sans-serif", fontSize: 13, color: "#4a6a9a", cursor: "pointer", lineHeight: 1.5 }}>
                  Saya menyatakan bahwa informasi yang diberikan adalah <span style={{ color: "#0A1B3D", fontWeight: 600 }}>benar dan sah</span> atas nama lembaga yang berwenang.
                </label>
              </div>
              <div style={{ display: "flex", alignItems: "flex-start", gap: 8 }}>
                <input type="checkbox" id="gc2" checked={consent2} onChange={(e) => setConsent2(e.target.checked)}
                  style={{ accentColor: "#4DB8FF", width: 16, height: 16, marginTop: 2, flexShrink: 0 }} />
                <label htmlFor="gc2" style={{ fontFamily: "'Inter', sans-serif", fontSize: 13, color: "#4a6a9a", cursor: "pointer", lineHeight: 1.5 }}>
                  Saya menyetujui <span style={{ color: "#4DB8FF", fontWeight: 500 }}>kebijakan akses data</span> Ravira untuk lembaga pemerintah dan penggunaan analitik workforce.
                </label>
              </div>
            </div>

            <button type="submit" disabled={!consent1 || !consent2 || !suratFile}
              style={{
                width: "100%", padding: "13px", borderRadius: 12, border: "none",
                background: consent1 && consent2 && suratFile ? "linear-gradient(135deg, #4DB8FF, #1677FF)" : "rgba(77,184,255,0.3)",
                fontFamily: "'Poppins', sans-serif", fontSize: 15, fontWeight: 700, color: "#fff",
                cursor: consent1 && consent2 && suratFile ? "pointer" : "not-allowed",
                display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
                boxShadow: consent1 && consent2 && suratFile ? "0 6px 20px rgba(22,119,255,0.3)" : "none",
              }}>
              Kirim Permohonan Verifikasi <ArrowRight size={16} />
            </button>
          </div>
        </form>

        <div style={{ display: "flex", alignItems: "center", gap: 8, justifyContent: "center", marginTop: 20 }}>
          <Shield size={14} color="#10d98e" />
          <span style={{ fontFamily: "'Inter', sans-serif", fontSize: 12, color: "#6a88b8" }}>
            Data lembaga diproses dengan standar keamanan tingkat pemerintah.
          </span>
        </div>
      </div>
    </div>
  );
}
