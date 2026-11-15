import { useState } from "react";
import { useNavigate } from "react-router";
import { ArrowLeft, CheckCircle2 } from "lucide-react";
import { RaviraOwlIcon } from "../components/RaviraLogo";

const steps = ["Profil Perusahaan", "Kebutuhan Rekrutmen", "Integrasi & Preferensi"];

const lokasiOptions = [
  "Jakarta",
  "Surabaya",
  "Bandung",
  "Medan",
  "Makassar",
  "Semarang",
  "Yogyakarta",
  "Bali",
  "Balikpapan",
  "Lainnya",
];
const posisiOptions = [
  "Software Engineer",
  "Product Manager",
  "UI/UX Designer",
  "Data Analyst",
  "Marketing Specialist",
  "Business Development",
  "Finance & Accounting",
  "Human Resources",
  "Sales Executive",
  "Operations",
];

export default function OnboardingCompanyPage() {
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [selectedPositions, setSelectedPositions] = useState<string[]>([]);
  const [selectedLocations, setSelectedLocations] = useState<string[]>([]);
  const [workType, setWorkType] = useState<string>("hybrid");
  const [urgency, setUrgency] = useState<string>("normal");

  const togglePosition = (pos: string) =>
    setSelectedPositions((p) => (p.includes(pos) ? p.filter((x) => x !== pos) : [...p, pos]));
  const toggleLocation = (loc: string) =>
    setSelectedLocations((l) => (l.includes(loc) ? l.filter((x) => x !== loc) : [...l, loc]));

  const handleNext = () => {
    if (step < steps.length - 1) setStep(step + 1);
    else navigate("/dashboard/perusahaan");
  };

  const progress = ((step + 1) / steps.length) * 100;

  return (
    <main className="ravira-onb-shell">
      <div className="ravira-onb-split">
        <aside className="ravira-onb-aside" aria-label="Tahapan onboarding perusahaan">
          <div>
            <div className="ravira-onb-top">
              {step > 0 && (
                <button
                  type="button"
                  onClick={() => setStep(step - 1)}
                  className="ravira-onb-back-btn"
                >
                  <ArrowLeft size={16} aria-hidden="true" />
                  <span>Kembali</span>
                </button>
              )}
              <div className="ravira-onb-brand">
                <RaviraOwlIcon size={22} />
                <span>Ravira</span>
              </div>
              <span className="ravira-onb-counter">
                {step + 1}/{steps.length}
              </span>
            </div>

            <div className="ravira-onb-progress-track" aria-hidden="true">
              <div className="ravira-onb-progress-fill" style={{ width: `${progress}%` }} />
            </div>

            <ol className="ravira-onb-steplist">
              {steps.map((s, i) => {
                const isDone = i < step;
                const isCurrent = i === step;
                return (
                  <li
                    key={s}
                    className={`ravira-onb-step-item ${
                      isCurrent ? "ravira-onb-step-current" : isDone ? "ravira-onb-step-done" : ""
                    }`}
                  >
                    <span className="ravira-onb-step-badge" aria-hidden="true">
                      {isDone ? <CheckCircle2 size={16} /> : i + 1}
                    </span>
                    <span>{s}</span>
                  </li>
                );
              })}
            </ol>
          </div>
        </aside>

        <section className="ravira-onb-pane" aria-label="Formulir onboarding perusahaan">
          <div className="ravira-onb-card">
            {step === 0 && (
              <div>
                <h1 className="ravira-onb-heading">Lengkapi Profil Perusahaan</h1>
                <p className="ravira-onb-sub">
                  Informasi ini akan ditampilkan kepada kandidat yang melamar.
                </p>

                <div className="ravira-onb-field">
                  <label htmlFor="onb-address" className="ravira-onb-label">
                    Lokasi Kantor Utama *
                  </label>
                  <input
                    id="onb-address"
                    className="ravira-onb-input"
                    placeholder="Masukkan alamat lengkap kantor utama"
                  />
                </div>
                <div className="ravira-onb-grid-2">
                  <div className="ravira-onb-field">
                    <label htmlFor="onb-year" className="ravira-onb-label">
                      Tahun Berdiri
                    </label>
                    <input
                      id="onb-year"
                      type="number"
                      className="ravira-onb-input"
                      placeholder="Contoh: 2015"
                    />
                  </div>
                  <div className="ravira-onb-field">
                    <label htmlFor="onb-emp" className="ravira-onb-label">
                      Total Karyawan Saat Ini
                    </label>
                    <input
                      id="onb-emp"
                      type="number"
                      className="ravira-onb-input"
                      placeholder="Masukkan jumlah karyawan"
                    />
                  </div>
                </div>
                <div className="ravira-onb-field">
                  <label htmlFor="onb-culture" className="ravira-onb-label">
                    Nilai &amp; Budaya Kerja
                  </label>
                  <textarea
                    id="onb-culture"
                    className="ravira-onb-input"
                    style={{ minHeight: 84, resize: "vertical" }}
                    placeholder="Deskripsikan nilai dan budaya kerja tim Anda..."
                  />
                </div>
                <div className="ravira-onb-field" style={{ marginBottom: 0 }}>
                  <label htmlFor="onb-linkedin" className="ravira-onb-label">
                    Link LinkedIn Perusahaan
                  </label>
                  <input
                    id="onb-linkedin"
                    type="url"
                    className="ravira-onb-input"
                    placeholder="https://linkedin.com/company/..."
                  />
                </div>
              </div>
            )}

            {step === 1 && (
              <div>
                <h1 className="ravira-onb-heading">Kebutuhan Rekrutmen</h1>
                <p className="ravira-onb-sub">
                  Bantu AI Ravira memahami kebutuhan talent perusahaan Anda.
                </p>

                <div className="ravira-onb-field">
                  <label className="ravira-onb-label">Posisi yang Sering Dibutuhkan</label>
                  <div className="ravira-onb-chip-wrap">
                    {posisiOptions.map((pos) => {
                      const active = selectedPositions.includes(pos);
                      return (
                        <button
                          key={pos}
                          type="button"
                          aria-pressed={active}
                          onClick={() => togglePosition(pos)}
                          className={`ravira-onb-chip ${active ? "ravira-onb-chip-active" : ""}`}
                        >
                          {pos}
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div className="ravira-onb-field">
                  <label className="ravira-onb-label">Preferensi Lokasi Kandidat</label>
                  <div className="ravira-onb-chip-wrap">
                    {lokasiOptions.map((loc) => {
                      const active = selectedLocations.includes(loc);
                      return (
                        <button
                          key={loc}
                          type="button"
                          aria-pressed={active}
                          onClick={() => toggleLocation(loc)}
                          className={`ravira-onb-chip ${active ? "ravira-onb-chip-active" : ""}`}
                        >
                          {loc}
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div className="ravira-onb-field">
                  <label className="ravira-onb-label">Tipe Kerja yang Ditawarkan</label>
                  <div className="ravira-onb-worktype-row">
                    {[
                      { val: "onsite", label: "On-site" },
                      { val: "hybrid", label: "Hybrid" },
                      { val: "remote", label: "Remote" },
                    ].map((w) => (
                      <button
                        key={w.val}
                        type="button"
                        aria-pressed={workType === w.val}
                        onClick={() => setWorkType(w.val)}
                        className={`ravira-onb-worktype-btn ${
                          workType === w.val ? "ravira-onb-worktype-active" : ""
                        }`}
                      >
                        {w.label}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="ravira-onb-field" style={{ marginBottom: 0 }}>
                  <label className="ravira-onb-label">Urgensi Rekrutmen</label>
                  <div className="ravira-onb-urgency-stack">
                    {[
                      {
                        val: "urgent",
                        label: "Segera (< 2 minggu)",
                        desc: "Rekrut kandidat paling cocok secepatnya",
                      },
                      {
                        val: "normal",
                        label: "Normal (1–2 bulan)",
                        desc: "Proses seleksi standar dengan waktu yang cukup",
                      },
                      {
                        val: "planned",
                        label: "Terencana (> 2 bulan)",
                        desc: "Perencanaan jangka panjang untuk pipeline talent",
                      },
                    ].map((u) => (
                      <button
                        key={u.val}
                        type="button"
                        aria-pressed={urgency === u.val}
                        onClick={() => setUrgency(u.val)}
                        className={`ravira-onb-urgency-btn ${
                          urgency === u.val ? "ravira-onb-urgency-active" : ""
                        }`}
                      >
                        <span className="ravira-onb-radio-dot" aria-hidden="true" />
                        <span>
                          <strong>{u.label}</strong>
                          <span>{u.desc}</span>
                        </span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {step === 2 && (
              <div>
                <h1 className="ravira-onb-heading">Integrasi &amp; Preferensi Notifikasi</h1>
                <p className="ravira-onb-sub">
                  Sesuaikan cara Ravira bekerja untuk tim rekrutmen Anda.
                </p>

                <div className="ravira-onb-field">
                  <label className="ravira-onb-label">Integrasi ATS/HRIS (Opsional)</label>
                  <div className="ravira-onb-urgency-stack">
                    {[
                      "SAP SuccessFactors",
                      "Workday",
                      "BambooHR",
                      "Talenta.co",
                      "Catapa",
                      "Tidak menggunakan ATS",
                    ].map((ats) => (
                      <label key={ats} className="ravira-onb-ats-row">
                        <input type="radio" name="ats" value={ats} />
                        <span>{ats}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <div className="ravira-onb-field">
                  <label className="ravira-onb-label">Notifikasi Kandidat Baru</label>
                  <div className="ravira-onb-urgency-stack">
                    {[
                      { id: "email_notif", label: "Email notifikasi setiap kandidat baru masuk" },
                      { id: "daily_digest", label: "Ringkasan harian shortlist kandidat" },
                      {
                        id: "whatsapp_notif",
                        label: "Notifikasi WhatsApp untuk kandidat dengan match > 85%",
                      },
                    ].map((n) => (
                      <label key={n.id} htmlFor={n.id} className="ravira-onb-ats-row">
                        <input type="checkbox" id={n.id} defaultChecked />
                        <span>{n.label}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <div className="ravira-onb-ready-box">
                  <strong>Akun Anda Siap!</strong>
                  <p>
                    Setelah setup selesai, Ravira AI akan mulai mencocokkan profil kandidat yang
                    relevan dengan kebutuhan rekrutmen Anda secara otomatis.
                  </p>
                </div>
              </div>
            )}

            <div className="ravira-onb-footer">
              <button
                type="button"
                onClick={() => (step > 0 ? setStep(step - 1) : navigate("/daftar/perusahaan"))}
                className="ravira-onb-secondary-btn"
              >
                {step > 0 ? "Kembali" : "Batal"}
              </button>
              <button type="button" onClick={handleNext} className="ravira-onb-primary-btn">
                {step === steps.length - 1 ? "Masuk ke Dashboard" : "Lanjutkan"}
              </button>
            </div>
          </div>
        </section>
      </div>

      <style>{`
        .ravira-onb-shell {
          min-height: 100dvh;
          background: #FFFFFF;
          padding: 16px;
          box-sizing: border-box;
          font-family: 'Inter', sans-serif;
          display: flex;
          align-items: stretch;
        }
        .ravira-onb-split {
          display: grid;
          grid-template-columns: minmax(280px, 380px) 1fr;
          gap: 16px;
          width: 100%;
          max-width: 1320px;
          margin: 0 auto;
        }
        .ravira-onb-aside {
          border-radius: 28px;
          background: linear-gradient(180deg, #0849A8 0%, #0E67CC 54%, #2B8CFF 100%);
          color: #FFFFFF;
          padding: 32px;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
        }
        .ravira-onb-top {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 8px;
          margin-bottom: 24px;
        }
        .ravira-onb-back-btn {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          min-height: 44px;
          padding: 0 14px;
          border-radius: 999px;
          border: 1px solid rgba(255, 255, 255, 0.35);
          background: rgba(13, 17, 23, 0.28);
          color: #FFFFFF;
          font-size: 13px;
          font-weight: 600;
          cursor: pointer;
        }
        .ravira-onb-brand {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          min-height: 44px;
          padding: 0 16px;
          border-radius: 999px;
          background: #0D1117;
          color: #FFFFFF;
          font-family: 'Poppins', sans-serif;
          font-size: 15px;
          font-weight: 700;
        }
        .ravira-onb-counter {
          font-family: 'JetBrains Mono', monospace;
          font-size: 12px;
          font-weight: 700;
          padding: 6px 12px;
          border-radius: 8px;
          background: #D4FF59;
          color: #0D1117;
        }
        .ravira-onb-progress-track {
          height: 6px;
          border-radius: 999px;
          background: rgba(255, 255, 255, 0.24);
          overflow: hidden;
          margin-bottom: 28px;
        }
        .ravira-onb-progress-fill {
          height: 100%;
          background: #D4FF59;
          transition: width 0.3s ease;
        }
        .ravira-onb-steplist {
          list-style: none;
          padding: 0;
          margin: 0;
          display: flex;
          flex-direction: column;
          gap: 12px;
        }
        .ravira-onb-step-item {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 14px 16px;
          border-radius: 14px;
          background: rgba(13, 17, 23, 0.25);
          color: rgba(255, 255, 255, 0.85);
          font-size: 14px;
          font-weight: 500;
        }
        .ravira-onb-step-current {
          background: #0D1117;
          color: #FFFFFF;
          font-weight: 700;
        }
        .ravira-onb-step-done {
          background: rgba(255, 255, 255, 0.92);
          color: #0D1117;
          font-weight: 600;
        }
        .ravira-onb-step-badge {
          width: 28px;
          height: 28px;
          border-radius: 8px;
          background: #D4FF59;
          color: #0D1117;
          font-family: 'JetBrains Mono', monospace;
          font-size: 12px;
          font-weight: 700;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }
        .ravira-onb-pane {
          background: #F4F5F7;
          border-radius: 28px;
          padding: 28px;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .ravira-onb-card {
          width: 100%;
          max-width: 720px;
          background: #FFFFFF;
          border-radius: 20px;
          border: 1px solid #E2E8F0;
          padding: 36px;
        }
        .ravira-onb-heading {
          font-family: 'Poppins', sans-serif;
          font-size: 24px;
          font-weight: 600;
          color: #0D1117;
          margin: 0 0 6px;
        }
        .ravira-onb-sub {
          font-size: 14px;
          color: #475569;
          margin: 0 0 24px;
        }
        .ravira-onb-field {
          display: flex;
          flex-direction: column;
          margin-bottom: 18px;
        }
        .ravira-onb-grid-2 {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 16px;
        }
        .ravira-onb-label {
          font-size: 13px;
          font-weight: 600;
          color: #0D1117;
          margin-bottom: 8px;
        }
        .ravira-onb-input {
          width: 100%;
          min-height: 46px;
          padding: 11px 14px;
          border-radius: 10px;
          border: 1.5px solid #94A3B8;
          background: #FFFFFF;
          color: #0D1117;
          font-family: 'Inter', sans-serif;
          font-size: 14px;
          box-sizing: border-box;
        }
        .ravira-onb-input::placeholder {
          color: #64748B;
        }
        .ravira-onb-chip-wrap {
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
        }
        .ravira-onb-chip {
          min-height: 44px;
          padding: 8px 16px;
          border-radius: 10px;
          border: 1px solid #CBD5E1;
          background: #F8FAFC;
          color: #0D1117;
          font-size: 13px;
          font-weight: 500;
          cursor: pointer;
        }
        .ravira-onb-chip-active {
          background: #0D1117;
          border-color: #0D1117;
          color: #D4FF59;
          font-weight: 700;
        }
        .ravira-onb-worktype-row {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 10px;
        }
        .ravira-onb-worktype-btn {
          min-height: 44px;
          border-radius: 10px;
          border: 1px solid #CBD5E1;
          background: #F8FAFC;
          color: #0D1117;
          font-size: 13.5px;
          font-weight: 600;
          cursor: pointer;
        }
        .ravira-onb-worktype-active {
          background: #0D1117;
          border-color: #0D1117;
          color: #D4FF59;
        }
        .ravira-onb-urgency-stack {
          display: flex;
          flex-direction: column;
          gap: 10px;
        }
        .ravira-onb-urgency-btn {
          width: 100%;
          min-height: 56px;
          padding: 14px 16px;
          border-radius: 12px;
          border: 1.5px solid #CBD5E1;
          background: #F8FAFC;
          display: flex;
          align-items: center;
          gap: 12px;
          text-align: left;
          cursor: pointer;
        }
        .ravira-onb-urgency-active {
          border-color: #0849A8;
          background: #F0F7FF;
        }
        .ravira-onb-radio-dot {
          width: 18px;
          height: 18px;
          border-radius: 50%;
          border: 2px solid #475569;
          flex-shrink: 0;
        }
        .ravira-onb-urgency-active .ravira-onb-radio-dot {
          border-color: #0849A8;
          background: #0849A8;
        }
        .ravira-onb-urgency-btn strong {
          display: block;
          font-size: 13.5px;
          color: #0D1117;
          margin-bottom: 2px;
        }
        .ravira-onb-urgency-btn span span {
          font-size: 12.5px;
          color: #475569;
        }
        .ravira-onb-ats-row {
          display: flex;
          align-items: center;
          gap: 10px;
          min-height: 44px;
          padding: 8px 14px;
          border-radius: 10px;
          border: 1px solid #CBD5E1;
          background: #F8FAFC;
          font-size: 13.5px;
          color: #0D1117;
          cursor: pointer;
        }
        .ravira-onb-ready-box {
          background: #0D1117;
          color: #FFFFFF;
          border-radius: 16px;
          padding: 18px 20px;
        }
        .ravira-onb-ready-box strong {
          display: inline-block;
          font-size: 12px;
          text-transform: uppercase;
          letter-spacing: 0.08em;
          color: #D4FF59;
          margin-bottom: 6px;
        }
        .ravira-onb-ready-box p {
          margin: 0;
          font-size: 13.5px;
          line-height: 1.55;
          color: #D1D5DB;
        }
        .ravira-onb-footer {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 12px;
          margin-top: 28px;
          padding-top: 20px;
          border-top: 1px solid #E2E8F0;
        }
        .ravira-onb-secondary-btn {
          min-height: 46px;
          padding: 0 22px;
          border-radius: 10px;
          border: 1px solid #CBD5E1;
          background: #F8FAFC;
          color: #0D1117;
          font-size: 14px;
          font-weight: 600;
          cursor: pointer;
        }
        .ravira-onb-primary-btn {
          min-height: 48px;
          padding: 0 28px;
          border-radius: 999px;
          border: 2px solid #0D1117;
          background: #D4FF59;
          color: #0D1117;
          font-family: 'Poppins', sans-serif;
          font-size: 14px;
          font-weight: 700;
          cursor: pointer;
        }
        .ravira-onb-input:focus-visible,
        .ravira-onb-back-btn:focus-visible,
        .ravira-onb-chip:focus-visible,
        .ravira-onb-worktype-btn:focus-visible,
        .ravira-onb-urgency-btn:focus-visible,
        .ravira-onb-secondary-btn:focus-visible,
        .ravira-onb-primary-btn:focus-visible {
          outline: 3px solid #0849A8;
          outline-offset: 2px;
        }
        @media (max-width: 900px) {
          .ravira-onb-split {
            grid-template-columns: 1fr;
          }
          .ravira-onb-pane {
            padding: 16px;
          }
          .ravira-onb-card {
            padding: 24px 20px;
          }
        }
        @media (max-width: 600px) {
          .ravira-onb-grid-2,
          .ravira-onb-worktype-row {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </main>
  );
}
