import { useState } from "react";
import { useNavigate } from "react-router";
import { ArrowRight, ArrowLeft, Check, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { RaviraOwlIcon } from "../components/RaviraLogo";
import { useAppContext } from "../contexts/AppContext";
import {
  updateCandidateProfile,
  createCandidateSkill,
  type UpdateCandidateProfileInput,
  type ProfileVisibilityStatus,
} from "../services/raviraApi";
import { ApiError } from "../services/api";

const steps = ["Lengkapi Profil", "Preferensi Karier", "Preferensi Mobilitas", "Visibilitas & Consent"];

const skillOptions = ["JavaScript", "React", "Python", "Figma", "SQL", "Excel", "Digital Marketing", "Project Management", "UI/UX Design", "Data Analysis", "Machine Learning", "Node.js"];
const industryOptions = ["Teknologi", "E-Commerce", "Perbankan & Keuangan", "Healthcare", "Pendidikan", "Media & Kreatif", "Konsultan", "Manufaktur", "FMCG"];
const workTypes = ["Full-time", "Part-time", "Internship", "Remote", "Hybrid"];
const relocationOptions = ["Ya, bersedia relokasi", "Tidak, tetap di domisili", "Tergantung kondisi"];

export default function OnboardingCandidatePage() {
  const navigate = useNavigate();
  const { user, retrySession } = useAppContext();
  const [step, setStep] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Step 0: Profil
  const [bio, setBio] = useState("");
  const [pengalaman, setPengalaman] = useState("");
  const [pendidikan, setPendidikan] = useState("");
  const [selectedSkills, setSelectedSkills] = useState<string[]>([]);

  // Step 1: Preferensi Karier
  const [posisiDicari, setPosisiDicari] = useState("");
  const [selectedIndustries, setSelectedIndustries] = useState<string[]>([]);
  const [selectedWorkTypes, setSelectedWorkTypes] = useState<string[]>([]);
  const [gaji, setGaji] = useState("");
  const [lokasi, setLokasi] = useState("");

  // Step 2: Preferensi Mobilitas
  const [relocation, setRelocation] = useState("");
  const [targetCities, setTargetCities] = useState("");
  const [availability, setAvailability] = useState("Segera (≤ 1 bulan)");

  // Step 3: Visibilitas & Consent
  const [visibility, setVisibility] = useState("publik");
  const [consentAI, setConsentAI] = useState(true);
  const [consentAnon, setConsentAnon] = useState(true);

  const toggleSkill = (s: string) => setSelectedSkills(prev => prev.includes(s) ? prev.filter(x => x !== s) : [...prev, s]);
  const toggleWorkType = (t: string) => setSelectedWorkTypes(prev => prev.includes(t) ? prev.filter(x => x !== t) : [...prev, t]);
  const toggleIndustry = (ind: string) => setSelectedIndustries(prev => prev.includes(ind) ? prev.filter(x => x !== ind) : [...prev, ind]);

  const handleCompleteOnboarding = async () => {
    setIsSubmitting(true);
    try {
      const payload: UpdateCandidateProfileInput = {};

      const summaryParts = [
        bio.trim(),
        pengalaman.trim() ? `Pengalaman: ${pengalaman.trim()}` : "",
        posisiDicari.trim() ? `Minat Posisi: ${posisiDicari.trim()}` : "",
      ].filter(Boolean);

      if (summaryParts.length > 0) {
        payload.experienceSummary = summaryParts.join(" | ");
      }
      if (pendidikan.trim()) {
        payload.education = pendidikan.trim();
      }
      if (lokasi.trim()) {
        payload.location = lokasi.trim();
      }
      if (gaji.trim()) {
        const numGaji = parseInt(gaji.replace(/\D/g, ""), 10);
        if (!isNaN(numGaji) && numGaji > 0) {
          payload.salaryExpectation = numGaji;
        }
      }
      if (relocation.trim()) {
        payload.mobilityPreference = relocation.trim();
      }

      const visMap: Record<string, ProfileVisibilityStatus> = {
        publik: "PUBLIC",
        tertentu: "LIMITED",
        private: "PRIVATE",
      };
      if (visibility) {
        payload.visibilityStatus = visMap[visibility] || "PUBLIC";
      }

      if (Object.keys(payload).length > 0) {
        await updateCandidateProfile(payload);
      }

      // Add selected skills to candidate profile
      if (selectedSkills.length > 0) {
        for (const skill of selectedSkills) {
          try {
            await createCandidateSkill({
              skillName: skill,
              level: "Menengah",
              source: "ONBOARDING",
            });
          } catch {
            // Ignore duplicate skill conflicts safely
          }
        }
      }

      void retrySession();
      toast.success("Profil onboarding berhasil disimpan!");
      navigate("/dashboard/kandidat");
    } catch (err) {
      const msg = err instanceof ApiError ? err.message : "Gagal menyimpan data onboarding.";
      toast.error(msg);
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

  const userInitial = (user?.fullName?.[0] || "K").toUpperCase();

  return (
    <div style={{ minHeight: "100vh", background: "#f0f7ff", fontFamily: "'Inter', sans-serif" }}>
      <div style={{ background: "#071228", padding: "0 24px", height: 64, display: "flex", alignItems: "center", gap: 12 }}>
        <RaviraOwlIcon size={28} />
        <span style={{ fontFamily: "'Poppins', sans-serif", fontSize: 16, fontWeight: 700, color: "#fff" }}>Ravira</span>
        <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10, color: "#3a5480", marginLeft: 8, textTransform: "uppercase", letterSpacing: "0.1em" }}>Setup Profil</span>
      </div>

      {/* Progress bar */}
      <div style={{ background: "#fff", borderBottom: "1px solid rgba(22,119,255,0.1)", padding: "16px 24px" }}>
        <div style={{ maxWidth: 680, margin: "0 auto" }}>
          <div style={{ display: "flex", gap: 8, marginBottom: 10 }}>
            {steps.map((s, i) => (
              <div key={s} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 6 }}>
                <div style={{
                  width: 28, height: 28, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center",
                  background: i < step ? "#10d98e" : i === step ? "#1677FF" : "#e8f0fe",
                  fontFamily: "'JetBrains Mono', monospace", fontSize: 12, fontWeight: 700,
                  color: i <= step ? "#fff" : "#6a88b8",
                }}>
                  {i < step ? <Check size={14} /> : i + 1}
                </div>
                <span style={{ fontFamily: "'Inter', sans-serif", fontSize: 11, color: i === step ? "#1677FF" : "#9ab4cc", fontWeight: i === step ? 600 : 400, textAlign: "center" }}>{s}</span>
              </div>
            ))}
          </div>
          <div style={{ height: 4, background: "#e8f0fe", borderRadius: 2, overflow: "hidden" }}>
            <div style={{ height: "100%", width: `${((step + 1) / steps.length) * 100}%`, background: "linear-gradient(90deg, #1677FF, #4DB8FF)", borderRadius: 2, transition: "width 0.4s ease" }} />
          </div>
        </div>
      </div>

      <div style={{ maxWidth: 680, margin: "0 auto", padding: "36px 24px" }}>
        <div style={{ background: "#fff", borderRadius: 20, border: "1px solid rgba(22,119,255,0.1)", boxShadow: "0 2px 16px rgba(10,27,61,0.06)", padding: "36px 32px", marginBottom: 20 }}>

          {/* Step 1: Lengkapi Profil */}
          {step === 0 && (
            <div>
              <h2 style={{ fontFamily: "'Poppins', sans-serif", fontSize: 22, fontWeight: 800, color: "#0A1B3D", marginBottom: 6 }}>Lengkapi Profil Anda</h2>
              <p style={{ fontFamily: "'Inter', sans-serif", fontSize: 14, color: "#6a88b8", marginBottom: 28 }}>Profil lengkap meningkatkan peluang ditemukan oleh rekruter yang tepat.</p>

              <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 24 }}>
                <div style={{ width: 72, height: 72, borderRadius: "50%", background: "linear-gradient(135deg, #1677FF, #4DB8FF)", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", flexShrink: 0 }}>
                  <span style={{ fontFamily: "'Poppins', sans-serif", fontSize: 24, fontWeight: 800, color: "#fff" }}>{userInitial}</span>
                </div>
                <div>
                  <div style={{ fontFamily: "'Poppins', sans-serif", fontSize: 14, fontWeight: 600, color: "#0A1B3D", marginBottom: 4 }}>
                    {user?.fullName || "Kandidat"}
                  </div>
                  <div style={{ fontFamily: "'Inter', sans-serif", fontSize: 12, color: "#6a88b8" }}>
                    {user?.email || ""}
                  </div>
                </div>
              </div>

              <div style={{ marginBottom: 16 }}>
                <label style={{ display: "block", fontFamily: "'Inter', sans-serif", fontSize: 13, fontWeight: 500, color: "#0A1B3D", marginBottom: 6 }}>Ringkasan Diri</label>
                <textarea
                  rows={3}
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  placeholder="Ceritakan tentang diri Anda, pengalaman, dan tujuan karier..."
                  style={{ ...inputStyle, resize: "vertical" }}
                  onFocus={(e) => (e.target.style.borderColor = "#1677FF")}
                  onBlur={(e) => (e.target.style.borderColor = "rgba(22,119,255,0.2)")}
                />
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 16 }}>
                <div>
                  <label style={{ display: "block", fontFamily: "'Inter', sans-serif", fontSize: 13, fontWeight: 500, color: "#0A1B3D", marginBottom: 6 }}>Pengalaman Kerja</label>
                  <input
                    style={inputStyle}
                    value={pengalaman}
                    onChange={(e) => setPengalaman(e.target.value)}
                    placeholder="Contoh: 2 tahun sebagai UI Designer"
                    onFocus={(e) => (e.target.style.borderColor = "#1677FF")}
                    onBlur={(e) => (e.target.style.borderColor = "rgba(22,119,255,0.2)")}
                  />
                </div>
                <div>
                  <label style={{ display: "block", fontFamily: "'Inter', sans-serif", fontSize: 13, fontWeight: 500, color: "#0A1B3D", marginBottom: 6 }}>Pendidikan Terakhir</label>
                  <input
                    style={inputStyle}
                    value={pendidikan}
                    onChange={(e) => setPendidikan(e.target.value)}
                    placeholder="Contoh: S1 Teknik Informatika, UI"
                    onFocus={(e) => (e.target.style.borderColor = "#1677FF")}
                    onBlur={(e) => (e.target.style.borderColor = "rgba(22,119,255,0.2)")}
                  />
                </div>
              </div>

              <div>
                <label style={{ display: "block", fontFamily: "'Inter', sans-serif", fontSize: 13, fontWeight: 500, color: "#0A1B3D", marginBottom: 10 }}>Skill Utama (pilih yang relevan)</label>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                  {skillOptions.map((s) => (
                    <button key={s} type="button" onClick={() => toggleSkill(s)}
                      style={{
                        padding: "6px 12px", borderRadius: 8,
                        border: selectedSkills.includes(s) ? "1px solid #1677FF" : "1px solid rgba(22,119,255,0.2)",
                        background: selectedSkills.includes(s) ? "rgba(22,119,255,0.1)" : "#f8fbff",
                        fontFamily: "'Inter', sans-serif", fontSize: 13,
                        color: selectedSkills.includes(s) ? "#1677FF" : "#6a88b8",
                        cursor: "pointer", fontWeight: selectedSkills.includes(s) ? 600 : 400,
                        transition: "all 0.15s",
                      }}>
                      {s}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Step 2: Preferensi Karier */}
          {step === 1 && (
            <div>
              <h2 style={{ fontFamily: "'Poppins', sans-serif", fontSize: 22, fontWeight: 800, color: "#0A1B3D", marginBottom: 6 }}>Preferensi Karier</h2>
              <p style={{ fontFamily: "'Inter', sans-serif", fontSize: 14, color: "#6a88b8", marginBottom: 28 }}>Informasi ini membantu AI Ravira menemukan peluang yang paling sesuai.</p>

              <div style={{ marginBottom: 16 }}>
                <label style={{ display: "block", fontFamily: "'Inter', sans-serif", fontSize: 13, fontWeight: 500, color: "#0A1B3D", marginBottom: 6 }}>Posisi yang Dicari</label>
                <input
                  style={inputStyle}
                  value={posisiDicari}
                  onChange={(e) => setPosisiDicari(e.target.value)}
                  placeholder="Contoh: UI/UX Designer, Product Manager"
                  onFocus={(e) => (e.target.style.borderColor = "#1677FF")}
                  onBlur={(e) => (e.target.style.borderColor = "rgba(22,119,255,0.2)")}
                />
              </div>

              <div style={{ marginBottom: 16 }}>
                <label style={{ display: "block", fontFamily: "'Inter', sans-serif", fontSize: 13, fontWeight: 500, color: "#0A1B3D", marginBottom: 10 }}>Industri yang Diminati</label>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                  {industryOptions.map((ind) => {
                    const isSelected = selectedIndustries.includes(ind);
                    return (
                      <button
                        key={ind}
                        type="button"
                        onClick={() => toggleIndustry(ind)}
                        style={{
                          padding: "6px 12px", borderRadius: 8,
                          border: isSelected ? "1px solid #1677FF" : "1px solid rgba(22,119,255,0.2)",
                          background: isSelected ? "rgba(22,119,255,0.1)" : "#f8fbff",
                          fontFamily: "'Inter', sans-serif", fontSize: 13,
                          color: isSelected ? "#1677FF" : "#6a88b8",
                          cursor: "pointer", fontWeight: isSelected ? 600 : 400,
                        }}
                      >
                        {ind}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div style={{ marginBottom: 16 }}>
                <label style={{ display: "block", fontFamily: "'Inter', sans-serif", fontSize: 13, fontWeight: 500, color: "#0A1B3D", marginBottom: 10 }}>Tipe Kerja</label>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                  {workTypes.map((t) => (
                    <button key={t} type="button" onClick={() => toggleWorkType(t)}
                      style={{
                        padding: "8px 16px", borderRadius: 8,
                        border: selectedWorkTypes.includes(t) ? "1px solid #1677FF" : "1px solid rgba(22,119,255,0.2)",
                        background: selectedWorkTypes.includes(t) ? "rgba(22,119,255,0.1)" : "#f8fbff",
                        fontFamily: "'Inter', sans-serif", fontSize: 13,
                        color: selectedWorkTypes.includes(t) ? "#1677FF" : "#6a88b8",
                        cursor: "pointer", fontWeight: selectedWorkTypes.includes(t) ? 600 : 400, transition: "all 0.15s",
                      }}>
                      {t}
                    </button>
                  ))}
                </div>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
                <div>
                  <label style={{ display: "block", fontFamily: "'Inter', sans-serif", fontSize: 13, fontWeight: 500, color: "#0A1B3D", marginBottom: 6 }}>Ekspektasi Gaji (per bulan)</label>
                  <input
                    style={inputStyle}
                    value={gaji}
                    onChange={(e) => setGaji(e.target.value)}
                    placeholder="Contoh: Rp 8.000.000"
                    onFocus={(e) => (e.target.style.borderColor = "#1677FF")}
                    onBlur={(e) => (e.target.style.borderColor = "rgba(22,119,255,0.2)")}
                  />
                </div>
                <div>
                  <label style={{ display: "block", fontFamily: "'Inter', sans-serif", fontSize: 13, fontWeight: 500, color: "#0A1B3D", marginBottom: 6 }}>Lokasi Kerja yang Diinginkan (Pulau Jawa)</label>
                  <input
                    style={inputStyle}
                    value={lokasi}
                    onChange={(e) => setLokasi(e.target.value)}
                    placeholder="Contoh: Jakarta, Bandung, Surabaya"
                    onFocus={(e) => (e.target.style.borderColor = "#1677FF")}
                    onBlur={(e) => (e.target.style.borderColor = "rgba(22,119,255,0.2)")}
                  />
                </div>
              </div>
            </div>
          )}

          {/* Step 3: Preferensi Mobilitas */}
          {step === 2 && (
            <div>
              <h2 style={{ fontFamily: "'Poppins', sans-serif", fontSize: 22, fontWeight: 800, color: "#0A1B3D", marginBottom: 6 }}>Preferensi Mobilitas</h2>
              <p style={{ fontFamily: "'Inter', sans-serif", fontSize: 14, color: "#6a88b8", marginBottom: 28 }}>Informasi ini memungkinkan Ravira menawarkan peluang kerja lintas wilayah yang sesuai.</p>

              <div style={{ marginBottom: 20 }}>
                <label style={{ display: "block", fontFamily: "'Inter', sans-serif", fontSize: 13, fontWeight: 500, color: "#0A1B3D", marginBottom: 10 }}>Bersedia Relokasi?</label>
                <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                  {relocationOptions.map((opt) => (
                    <label key={opt} style={{ display: "flex", alignItems: "center", gap: 10, cursor: "pointer", padding: "10px 14px", borderRadius: 10, border: `1px solid ${relocation === opt ? "#1677FF" : "rgba(22,119,255,0.15)"}`, background: relocation === opt ? "rgba(22,119,255,0.06)" : "#f8fbff", transition: "all 0.15s" }}>
                      <input type="radio" name="relocation" value={opt} checked={relocation === opt} onChange={() => setRelocation(opt)} style={{ accentColor: "#1677FF" }} />
                      <span style={{ fontFamily: "'Inter', sans-serif", fontSize: 14, color: relocation === opt ? "#1677FF" : "#4a6a9a", fontWeight: relocation === opt ? 600 : 400 }}>{opt}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
                <div>
                  <label style={{ display: "block", fontFamily: "'Inter', sans-serif", fontSize: 13, fontWeight: 500, color: "#0A1B3D", marginBottom: 6 }}>Kota Tujuan yang Diminati (Pulau Jawa)</label>
                  <input
                    style={inputStyle}
                    value={targetCities}
                    onChange={(e) => setTargetCities(e.target.value)}
                    placeholder="Contoh: Bandung, Surabaya, Yogyakarta"
                    onFocus={(e) => (e.target.style.borderColor = "#1677FF")}
                    onBlur={(e) => (e.target.style.borderColor = "rgba(22,119,255,0.2)")}
                  />
                </div>
                <div>
                  <label style={{ display: "block", fontFamily: "'Inter', sans-serif", fontSize: 13, fontWeight: 500, color: "#0A1B3D", marginBottom: 6 }}>Ketersediaan Mulai Kerja</label>
                  <select
                    style={{ ...inputStyle, cursor: "pointer" }}
                    value={availability}
                    onChange={(e) => setAvailability(e.target.value)}
                  >
                    <option>Segera (≤ 1 bulan)</option>
                    <option>1–3 bulan</option>
                    <option>3–6 bulan</option>
                    <option>Lebih dari 6 bulan</option>
                  </select>
                </div>
              </div>
            </div>
          )}

          {/* Step 4: Visibilitas */}
          {step === 3 && (
            <div>
              <h2 style={{ fontFamily: "'Poppins', sans-serif", fontSize: 22, fontWeight: 800, color: "#0A1B3D", marginBottom: 6 }}>Visibilitas & Consent</h2>
              <p style={{ fontFamily: "'Inter', sans-serif", fontSize: 14, color: "#6a88b8", marginBottom: 28 }}>Anda memiliki kontrol penuh atas data dan visibilitas profil Anda.</p>

              <div style={{ marginBottom: 24 }}>
                <label style={{ display: "block", fontFamily: "'Inter', sans-serif", fontSize: 13, fontWeight: 500, color: "#0A1B3D", marginBottom: 10 }}>Visibilitas Profil</label>
                {[
                  { val: "publik", label: "Profil Publik", desc: "Semua rekruter yang terdaftar di Ravira dapat melihat profil Anda." },
                  { val: "tertentu", label: "Hanya Rekruter Tertentu", desc: "Hanya rekruter yang Anda setujui yang dapat melihat profil Anda." },
                  { val: "private", label: "Profil Private", desc: "Profil tidak terlihat oleh rekruter. Anda masih bisa melamar pekerjaan." },
                ].map((v) => (
                  <label key={v.val} onClick={() => setVisibility(v.val)} style={{ display: "flex", alignItems: "flex-start", gap: 10, cursor: "pointer", padding: "12px 14px", borderRadius: 10, border: `1px solid ${visibility === v.val ? "#1677FF" : "rgba(22,119,255,0.15)"}`, background: visibility === v.val ? "rgba(22,119,255,0.06)" : "#f8fbff", marginBottom: 8, transition: "all 0.15s" }}>
                    <input type="radio" name="visibility" value={v.val} checked={visibility === v.val} onChange={() => setVisibility(v.val)} style={{ accentColor: "#1677FF", marginTop: 2 }} />
                    <div>
                      <div style={{ fontFamily: "'Poppins', sans-serif", fontSize: 13, fontWeight: 600, color: visibility === v.val ? "#1677FF" : "#0A1B3D" }}>{v.label}</div>
                      <div style={{ fontFamily: "'Inter', sans-serif", fontSize: 12, color: "#6a88b8", marginTop: 2 }}>{v.desc}</div>
                    </div>
                  </label>
                ))}
              </div>

              <div style={{ background: "#f0f7ff", borderRadius: 12, padding: "16px 20px" }}>
                {[
                  { val: consentAI, set: setConsentAI, label: "Izin Rekomendasi AI", desc: "Profil dan preferensi saya dapat diproses oleh AI Ravira untuk keperluan pencocokan pekerjaan." },
                  { val: consentAnon, set: setConsentAnon, label: "Izin Data Agregat Anonim", desc: "Data saya dapat digunakan secara anonim dan teragregasi untuk laporan workforce analytics." },
                ].map((c, i) => (
                  <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: 10, marginBottom: i === 0 ? 14 : 0 }}>
                    <input type="checkbox" checked={c.val} onChange={(e) => c.set(e.target.checked)} style={{ accentColor: "#1677FF", width: 16, height: 16, marginTop: 2, flexShrink: 0 }} />
                    <div>
                      <div style={{ fontFamily: "'Inter', sans-serif", fontSize: 13, fontWeight: 500, color: "#0A1B3D" }}>{c.label}</div>
                      <div style={{ fontFamily: "'Inter', sans-serif", fontSize: 12, color: "#6a88b8", marginTop: 2 }}>{c.desc}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Navigation */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <button
            type="button"
            disabled={isSubmitting}
            onClick={() => step > 0 ? setStep(step - 1) : navigate("/daftar/kandidat")}
            style={{ display: "flex", alignItems: "center", gap: 6, padding: "11px 20px", borderRadius: 10, border: "1px solid rgba(22,119,255,0.2)", background: "#fff", fontFamily: "'Inter', sans-serif", fontSize: 14, color: "#6a88b8", cursor: isSubmitting ? "not-allowed" : "pointer" }}>
            <ArrowLeft size={15} /> {step === 0 ? "Kembali" : "Sebelumnya"}
          </button>
          <button
            type="button"
            disabled={isSubmitting}
            onClick={() => {
              if (step < steps.length - 1) {
                setStep(step + 1);
              } else {
                void handleCompleteOnboarding();
              }
            }}
            style={{
              display: "flex", alignItems: "center", gap: 8, padding: "11px 24px", borderRadius: 10, border: "none",
              background: "linear-gradient(135deg, #1677FF, #0D47A1)", fontFamily: "'Poppins', sans-serif", fontSize: 14, fontWeight: 700,
              color: "#fff", cursor: isSubmitting ? "not-allowed" : "pointer", boxShadow: "0 4px 16px rgba(22,119,255,0.35)",
              opacity: isSubmitting ? 0.7 : 1,
            }}>
            {isSubmitting ? (
              <>
                <Loader2 size={16} className="animate-spin" /> Menyimpan Profil...
              </>
            ) : step === steps.length - 1 ? (
              <>
                Selesai dan Lihat Rekomendasi <ArrowRight size={15} />
              </>
            ) : (
              <>
                Lanjut <ArrowRight size={15} />
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
