import { useState } from "react";
import { useNavigate } from "react-router";
import { ArrowLeft, ArrowRight, CheckCircle2 } from "lucide-react";
import { RaviraOwlIcon } from "../components/RaviraLogo";

const steps = ["Profil Perusahaan", "Kebutuhan Rekrutmen", "Integrasi & Preferensi"];

const lokasiOptions = ["Jakarta", "Surabaya", "Bandung", "Medan", "Makassar", "Semarang", "Yogyakarta", "Bali", "Balikpapan", "Lainnya"];
const posisiOptions = ["Software Engineer", "Product Manager", "UI/UX Designer", "Data Analyst", "Marketing Specialist", "Business Development", "Finance & Accounting", "Human Resources", "Sales Executive", "Operations"];

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

export default function OnboardingCompanyPage() {
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [selectedPositions, setSelectedPositions] = useState<string[]>([]);
  const [selectedLocations, setSelectedLocations] = useState<string[]>([]);
  const [workType, setWorkType] = useState<string>("hybrid");
  const [urgency, setUrgency] = useState<string>("normal");

  const togglePosition = (pos: string) => setSelectedPositions((p) => p.includes(pos) ? p.filter((x) => x !== pos) : [...p, pos]);
  const toggleLocation = (loc: string) => setSelectedLocations((l) => l.includes(loc) ? l.filter((x) => x !== loc) : [...l, loc]);

  const handleNext = () => {
    if (step < steps.length - 1) setStep(step + 1);
    else navigate("/dashboard/perusahaan");
  };

  const progress = ((step + 1) / steps.length) * 100;

  return (
    <div style={{ minHeight: "100vh", background: "#f0f7ff", fontFamily: "'Inter', sans-serif" }}>
      <div style={{ background: "#071228", padding: "0 24px", height: 64, display: "flex", alignItems: "center", gap: 16 }}>
        {step > 0 && (
          <button onClick={() => setStep(step - 1)} style={{ background: "none", border: "none", cursor: "pointer", color: "#5a7aaa", display: "flex", alignItems: "center", gap: 6, fontFamily: "'Inter', sans-serif", fontSize: 13 }}>
            <ArrowLeft size={15} /> Kembali
          </button>
        )}
        <RaviraOwlIcon size={28} />
        <span style={{ fontFamily: "'Poppins', sans-serif", fontSize: 16, fontWeight: 700, color: "#fff" }}>Ravira</span>
        <div style={{ flex: 1 }} />
        <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 12, color: "#4DB8FF" }}>
          {step + 1}/{steps.length}
        </span>
      </div>

      {/* Progress bar */}
      <div style={{ height: 3, background: "rgba(22,119,255,0.1)" }}>
        <div style={{ height: "100%", width: `${progress}%`, background: "linear-gradient(90deg, #1677FF, #4DB8FF)", transition: "width 0.4s ease" }} />
      </div>

      <div style={{ maxWidth: 720, margin: "0 auto", padding: "36px 24px" }}>
        {/* Step indicators */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 0, marginBottom: 36 }}>
          {steps.map((s, i) => (
            <div key={s} style={{ display: "flex", alignItems: "center" }}>
              <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 6 }}>
                <div style={{
                  width: 36, height: 36, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center",
                  background: i < step ? "#10d98e" : i === step ? "#1677FF" : "rgba(22,119,255,0.1)",
                  border: `2px solid ${i < step ? "#10d98e" : i === step ? "#1677FF" : "rgba(22,119,255,0.2)"}`,
                  transition: "all 0.3s",
                }}>
                  {i < step ? <CheckCircle2 size={16} color="#fff" /> : <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 13, fontWeight: 700, color: i === step ? "#fff" : "#6a88b8" }}>{i + 1}</span>}
                </div>
                <span style={{ fontFamily: "'Inter', sans-serif", fontSize: 11, color: i === step ? "#1677FF" : "#6a88b8", fontWeight: i === step ? 600 : 400, whiteSpace: "nowrap" }}>{s}</span>
              </div>
              {i < steps.length - 1 && (
                <div style={{ width: 80, height: 2, background: i < step ? "#10d98e" : "rgba(22,119,255,0.15)", margin: "0 8px", marginBottom: 22, transition: "background 0.3s" }} />
              )}
            </div>
          ))}
        </div>

        <div style={{ background: "#fff", borderRadius: 20, border: "1px solid rgba(22,119,255,0.1)", boxShadow: "0 2px 16px rgba(10,27,61,0.06)", padding: "32px" }}>

          {/* Step 1: Profil Perusahaan */}
          {step === 0 && (
            <div>
              <h2 style={{ fontFamily: "'Poppins', sans-serif", fontSize: 20, fontWeight: 800, color: "#0A1B3D", marginBottom: 6 }}>Lengkapi Profil Perusahaan</h2>
              <p style={{ fontFamily: "'Inter', sans-serif", fontSize: 14, color: "#6a88b8", marginBottom: 24 }}>Informasi ini akan ditampilkan kepada kandidat yang melamar.</p>

              <div style={{ marginBottom: 16 }}>
                <label style={labelStyle}>Lokasi Kantor Utama *</label>
                <input style={inputStyle} placeholder="Jl. Sudirman No. 100, Jakarta Selatan" />
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 16 }}>
                <div>
                  <label style={labelStyle}>Tahun Berdiri</label>
                  <input style={inputStyle} placeholder="2015" type="number" />
                </div>
                <div>
                  <label style={labelStyle}>Total Karyawan Saat Ini</label>
                  <input style={inputStyle} placeholder="250" type="number" />
                </div>
              </div>
              <div style={{ marginBottom: 16 }}>
                <label style={labelStyle}>Nilai & Budaya Kerja</label>
                <textarea style={{ ...inputStyle, minHeight: 80, resize: "vertical" }} placeholder="Kolaboratif, inovatif, growth mindset..." />
              </div>
              <div style={{ marginBottom: 0 }}>
                <label style={labelStyle}>Link LinkedIn Perusahaan</label>
                <input style={inputStyle} placeholder="https://linkedin.com/company/..." />
              </div>
            </div>
          )}

          {/* Step 2: Kebutuhan Rekrutmen */}
          {step === 1 && (
            <div>
              <h2 style={{ fontFamily: "'Poppins', sans-serif", fontSize: 20, fontWeight: 800, color: "#0A1B3D", marginBottom: 6 }}>Kebutuhan Rekrutmen</h2>
              <p style={{ fontFamily: "'Inter', sans-serif", fontSize: 14, color: "#6a88b8", marginBottom: 24 }}>Bantu AI Ravira memahami kebutuhan talent perusahaan Anda.</p>

              <div style={{ marginBottom: 20 }}>
                <label style={labelStyle}>Posisi yang Sering Dibutuhkan</label>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                  {posisiOptions.map((pos) => (
                    <button
                      key={pos} type="button"
                      onClick={() => togglePosition(pos)}
                      style={{
                        padding: "6px 14px", borderRadius: 8, cursor: "pointer",
                        fontFamily: "'Inter', sans-serif", fontSize: 13,
                        background: selectedPositions.includes(pos) ? "rgba(22,119,255,0.1)" : "#f8fbff",
                        border: `1px solid ${selectedPositions.includes(pos) ? "#1677FF" : "rgba(22,119,255,0.2)"}`,
                        color: selectedPositions.includes(pos) ? "#1677FF" : "#4a6a9a",
                        fontWeight: selectedPositions.includes(pos) ? 600 : 400,
                        transition: "all 0.15s",
                      }}
                    >{pos}</button>
                  ))}
                </div>
              </div>

              <div style={{ marginBottom: 20 }}>
                <label style={labelStyle}>Preferensi Lokasi Kandidat</label>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                  {lokasiOptions.map((loc) => (
                    <button
                      key={loc} type="button"
                      onClick={() => toggleLocation(loc)}
                      style={{
                        padding: "6px 14px", borderRadius: 8, cursor: "pointer",
                        fontFamily: "'Inter', sans-serif", fontSize: 13,
                        background: selectedLocations.includes(loc) ? "rgba(22,119,255,0.1)" : "#f8fbff",
                        border: `1px solid ${selectedLocations.includes(loc) ? "#1677FF" : "rgba(22,119,255,0.2)"}`,
                        color: selectedLocations.includes(loc) ? "#1677FF" : "#4a6a9a",
                        fontWeight: selectedLocations.includes(loc) ? 600 : 400,
                        transition: "all 0.15s",
                      }}
                    >{loc}</button>
                  ))}
                </div>
              </div>

              <div style={{ marginBottom: 20 }}>
                <label style={labelStyle}>Tipe Kerja yang Ditawarkan</label>
                <div style={{ display: "flex", gap: 8 }}>
                  {[{ val: "onsite", label: "On-site" }, { val: "hybrid", label: "Hybrid" }, { val: "remote", label: "Remote" }].map((w) => (
                    <button key={w.val} type="button" onClick={() => setWorkType(w.val)}
                      style={{
                        flex: 1, padding: "10px", borderRadius: 10, cursor: "pointer",
                        fontFamily: "'Inter', sans-serif", fontSize: 13,
                        background: workType === w.val ? "rgba(22,119,255,0.1)" : "#f8fbff",
                        border: `1px solid ${workType === w.val ? "#1677FF" : "rgba(22,119,255,0.2)"}`,
                        color: workType === w.val ? "#1677FF" : "#4a6a9a",
                        fontWeight: workType === w.val ? 600 : 400,
                      }}
                    >{w.label}</button>
                  ))}
                </div>
              </div>

              <div>
                <label style={labelStyle}>Urgensi Rekrutmen</label>
                <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                  {[
                    { val: "urgent", label: "Segera (< 2 minggu)", desc: "Rekrut kandidat paling cocok secepatnya" },
                    { val: "normal", label: "Normal (1–2 bulan)", desc: "Proses seleksi standar dengan waktu yang cukup" },
                    { val: "planned", label: "Terencana (> 2 bulan)", desc: "Perencanaan jangka panjang untuk pipeline talent" },
                  ].map((u) => (
                    <div key={u.val} onClick={() => setUrgency(u.val)}
                      style={{
                        padding: "12px 16px", borderRadius: 10, cursor: "pointer",
                        border: `1px solid ${urgency === u.val ? "#1677FF" : "rgba(22,119,255,0.15)"}`,
                        background: urgency === u.val ? "rgba(22,119,255,0.06)" : "#f8fbff",
                        display: "flex", alignItems: "center", gap: 12,
                      }}
                    >
                      <div style={{ width: 18, height: 18, borderRadius: "50%", border: `2px solid ${urgency === u.val ? "#1677FF" : "#c0d0e8"}`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                        {urgency === u.val && <div style={{ width: 8, height: 8, borderRadius: "50%", background: "#1677FF" }} />}
                      </div>
                      <div>
                        <div style={{ fontFamily: "'Inter', sans-serif", fontSize: 13, fontWeight: 600, color: "#0A1B3D" }}>{u.label}</div>
                        <div style={{ fontFamily: "'Inter', sans-serif", fontSize: 12, color: "#6a88b8" }}>{u.desc}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Step 3: Integrasi & Preferensi */}
          {step === 2 && (
            <div>
              <h2 style={{ fontFamily: "'Poppins', sans-serif", fontSize: 20, fontWeight: 800, color: "#0A1B3D", marginBottom: 6 }}>Integrasi & Preferensi Notifikasi</h2>
              <p style={{ fontFamily: "'Inter', sans-serif", fontSize: 14, color: "#6a88b8", marginBottom: 24 }}>Sesuaikan cara Ravira bekerja untuk tim rekrutmen Anda.</p>

              <div style={{ marginBottom: 24 }}>
                <label style={{ ...labelStyle, marginBottom: 12 }}>Integrasi ATS/HRIS (Opsional)</label>
                <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                  {["SAP SuccessFactors", "Workday", "BambooHR", "Talenta.co", "Catapa", "Tidak menggunakan ATS"].map((ats) => (
                    <label key={ats} style={{ display: "flex", alignItems: "center", gap: 10, padding: "11px 14px", borderRadius: 10, border: "1px solid rgba(22,119,255,0.15)", background: "#f8fbff", cursor: "pointer" }}>
                      <input type="radio" name="ats" value={ats} style={{ accentColor: "#1677FF" }} />
                      <span style={{ fontFamily: "'Inter', sans-serif", fontSize: 13, color: "#0A1B3D" }}>{ats}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div style={{ marginBottom: 24 }}>
                <label style={{ ...labelStyle, marginBottom: 12 }}>Notifikasi Kandidat Baru</label>
                <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                  {[
                    { id: "email_notif", label: "Email notifikasi setiap kandidat baru masuk" },
                    { id: "daily_digest", label: "Ringkasan harian shortlist kandidat" },
                    { id: "whatsapp_notif", label: "Notifikasi WhatsApp untuk kandidat dengan match > 85%" },
                  ].map((n) => (
                    <label key={n.id} style={{ display: "flex", alignItems: "center", gap: 10, cursor: "pointer" }}>
                      <input type="checkbox" id={n.id} defaultChecked style={{ accentColor: "#1677FF", width: 16, height: 16 }} />
                      <span style={{ fontFamily: "'Inter', sans-serif", fontSize: 13, color: "#4a6a9a" }}>{n.label}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div style={{ background: "linear-gradient(135deg, rgba(22,119,255,0.06), rgba(77,184,255,0.06))", border: "1px solid rgba(22,119,255,0.15)", borderRadius: 12, padding: "16px 20px" }}>
                <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11, color: "#1677FF", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 8 }}>Akun Anda Siap!</div>
                <p style={{ fontFamily: "'Inter', sans-serif", fontSize: 13, color: "#4a6a9a", lineHeight: 1.6 }}>
                  Setelah setup selesai, Ravira AI akan mulai mencocokkan profil kandidat yang relevan dengan kebutuhan rekrutmen Anda secara otomatis.
                </p>
              </div>
            </div>
          )}

          {/* Navigation */}
          <div style={{ display: "flex", justifyContent: "space-between", marginTop: 28, paddingTop: 20, borderTop: "1px solid rgba(22,119,255,0.1)" }}>
            <button
              onClick={() => step > 0 ? setStep(step - 1) : navigate("/daftar/perusahaan")}
              style={{ padding: "10px 20px", borderRadius: 10, border: "1px solid rgba(22,119,255,0.2)", background: "#f0f7ff", fontFamily: "'Inter', sans-serif", fontSize: 14, color: "#6a88b8", cursor: "pointer" }}
            >
              {step > 0 ? "Kembali" : "Batal"}
            </button>
            <button
              onClick={handleNext}
              style={{ padding: "10px 24px", borderRadius: 10, border: "none", background: "linear-gradient(135deg, #1677FF, #0D47A1)", fontFamily: "'Poppins', sans-serif", fontSize: 14, fontWeight: 700, color: "#fff", cursor: "pointer", display: "flex", alignItems: "center", gap: 8, boxShadow: "0 4px 14px rgba(22,119,255,0.4)" }}
            >
              {step === steps.length - 1 ? "Masuk ke Dashboard" : "Lanjutkan"} <ArrowRight size={15} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
