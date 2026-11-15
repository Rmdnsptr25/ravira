import { useState } from "react";
import { useNavigate } from "react-router";
import { Upload, Shield, ArrowLeft } from "lucide-react";
import { toast } from "sonner";
import { RaviraOwlIcon } from "../components/RaviraLogo";
import { useAppContext } from "../contexts/AppContext";

const bidangOptions = [
  "Teknologi Informasi",
  "Desain & Kreatif",
  "Marketing & Sales",
  "Keuangan & Akuntansi",
  "Hukum",
  "Kesehatan",
  "Pendidikan",
  "Manufaktur",
  "Logistik",
  "Lainnya",
];
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

  return (
    <main className="ravira-auth-shell">
      <div className="ravira-auth-split">
        <aside className="ravira-auth-aside" aria-label="Informasi pendaftaran kandidat">
          <div className="ravira-auth-aside-top">
            <button
              type="button"
              onClick={() => navigate("/untuk-kandidat")}
              className="ravira-auth-back-btn"
            >
              <ArrowLeft size={16} aria-hidden="true" />
              <span>Kembali</span>
            </button>
            <button
              type="button"
              onClick={() => navigate("/")}
              className="ravira-auth-brand-btn"
            >
              <RaviraOwlIcon size={24} />
              <span>Ravira</span>
            </button>
          </div>

          <div className="ravira-auth-aside-body">
            <h1 className="ravira-auth-title">Buat Akun Kandidat</h1>
            <p className="ravira-auth-lead">
              Lengkapi data berikut untuk memulai perjalanan karier Anda bersama Ravira.
            </p>

            <div className="ravira-auth-steps">
              <div className="ravira-auth-step-card ravira-auth-step-card-dark">
                <span className="ravira-auth-step-num">01</span>
                <div>
                  <div className="ravira-auth-step-heading">Profil &amp; Domisili</div>
                  <div className="ravira-auth-step-desc">
                    Digunakan untuk mencocokkan lowongan lokal maupun peluang lintas wilayah.
                  </div>
                </div>
              </div>
              <div className="ravira-auth-step-card ravira-auth-step-card-light">
                <span className="ravira-auth-step-num ravira-auth-step-num-blue">02</span>
                <div>
                  <div className="ravira-auth-step-heading ravira-auth-step-heading-dark">
                    Analisis Kompetensi &amp; CV
                  </div>
                  <div className="ravira-auth-step-desc ravira-auth-step-desc-dark">
                    Memetakan skill yang sudah dimiliki dan celah kompetensi yang perlu ditingkatkan.
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="ravira-auth-trust">
            <Shield size={16} aria-hidden="true" />
            <span>Data Anda aman. Profil tidak akan dibagikan ke perusahaan tanpa izin Anda.</span>
          </div>
        </aside>

        <section className="ravira-auth-form-pane" aria-label="Formulir registrasi kandidat">
          <div className="ravira-auth-form-card">
            <div className="ravira-auth-form-header">
              <div>
                <h2 className="ravira-auth-form-heading">Data Diri &amp; Preferensi Karier</h2>
                <p className="ravira-auth-form-sub">
                  Kolom bertanda bintang (*) wajib diisi sebelum membuat akun.
                </p>
              </div>
              <p className="ravira-auth-switch-link">
                Sudah punya akun?{" "}
                <button
                  type="button"
                  onClick={() => navigate("/masuk/kandidat")}
                  className="ravira-inline-link"
                >
                  Masuk Kandidat
                </button>
              </p>
            </div>

            <form onSubmit={handleSubmit}>
              <div className="ravira-form-grid-2">
                <div className="ravira-field">
                  <label htmlFor="cand-name" className="ravira-label">
                    Nama Lengkap *
                  </label>
                  <input
                    id="cand-name"
                    name="name"
                    className="ravira-input"
                    placeholder="Masukkan nama lengkap sesuai identitas"
                    required
                  />
                </div>
                <div className="ravira-field">
                  <label htmlFor="cand-phone" className="ravira-label">
                    Nomor WhatsApp *
                  </label>
                  <input
                    id="cand-phone"
                    name="phone"
                    type="tel"
                    className="ravira-input"
                    placeholder="Contoh: 0812xxxxxxxx"
                    required
                  />
                </div>
              </div>

              <div className="ravira-form-grid-2">
                <div className="ravira-field">
                  <label htmlFor="cand-email" className="ravira-label">
                    Email *
                  </label>
                  <input
                    id="cand-email"
                    name="email"
                    type="email"
                    className="ravira-input"
                    placeholder="nama@email.com"
                    required
                  />
                </div>
                <div className="ravira-field">
                  <label htmlFor="cand-password" className="ravira-label">
                    Password *
                  </label>
                  <input
                    id="cand-password"
                    name="password"
                    type="password"
                    minLength={8}
                    className="ravira-input"
                    placeholder="Minimal 8 karakter"
                    required
                  />
                </div>
              </div>

              <div className="ravira-form-grid-2">
                <div className="ravira-field">
                  <label htmlFor="cand-location" className="ravira-label">
                    Domisili *
                  </label>
                  <input
                    id="cand-location"
                    name="location"
                    className="ravira-input"
                    placeholder="Masukkan kota atau kabupaten domisili"
                    required
                  />
                </div>
                <div className="ravira-field">
                  <label htmlFor="cand-education" className="ravira-label">
                    Pendidikan Terakhir *
                  </label>
                  <select id="cand-education" className="ravira-input" required>
                    <option value="">Pilih pendidikan</option>
                    {pendidikanOptions.map((p) => (
                      <option key={p} value={p}>
                        {p}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="ravira-field" style={{ marginBottom: 20 }}>
                <label htmlFor="cand-interest" className="ravira-label">
                  Bidang Minat Karier *
                </label>
                <select id="cand-interest" className="ravira-input" required>
                  <option value="">Pilih bidang</option>
                  {bidangOptions.map((b) => (
                    <option key={b} value={b}>
                      {b}
                    </option>
                  ))}
                </select>
              </div>

              <div className="ravira-field" style={{ marginBottom: 22 }}>
                <label htmlFor="cand-cv-trigger" className="ravira-label">
                  Upload CV (PDF, DOC, DOCX)
                </label>
                <button
                  id="cand-cv-trigger"
                  type="button"
                  onClick={() => setCvFile("cv_kandidat.pdf")}
                  className={`ravira-upload-btn ${cvFile ? "ravira-upload-btn-active" : ""}`}
                >
                  <span className="ravira-upload-icon" aria-hidden="true">
                    <Upload size={18} />
                  </span>
                  {cvFile ? (
                    <span className="ravira-upload-text">
                      <strong>Berkas dipilih: {cvFile}</strong>
                      <span>Klik untuk mengganti file</span>
                    </span>
                  ) : (
                    <span className="ravira-upload-text">
                      <strong>Klik atau seret CV Anda ke sini</strong>
                      <span>PDF, DOC, atau DOCX • Maks. 5MB</span>
                    </span>
                  )}
                </button>
              </div>

              <div className="ravira-consent-box">
                <label htmlFor="c1" className="ravira-consent-row">
                  <input
                    type="checkbox"
                    id="c1"
                    checked={consent1}
                    onChange={(e) => setConsent1(e.target.checked)}
                  />
                  <span>
                    Saya menyetujui <strong>kebijakan penggunaan data</strong> Ravira dan memberikan
                    izin untuk menyimpan informasi profil saya.
                  </span>
                </label>
                <label htmlFor="c2" className="ravira-consent-row">
                  <input
                    type="checkbox"
                    id="c2"
                    checked={consent2}
                    onChange={(e) => setConsent2(e.target.checked)}
                  />
                  <span>
                    Saya mengizinkan CV dan profil saya dianalisis oleh sistem AI Ravira untuk
                    keperluan pencocokan pekerjaan.
                  </span>
                </label>
              </div>

              <button
                type="submit"
                disabled={!consent1 || !consent2 || isSubmitting}
                className="ravira-submit-btn"
              >
                {isSubmitting ? "Memproses..." : "Buat Akun Kandidat"}
              </button>
            </form>
          </div>
        </section>
      </div>

      <style>{`
        .ravira-auth-shell {
          min-height: 100dvh;
          background: #FFFFFF;
          padding: 16px;
          box-sizing: border-box;
          font-family: 'Inter', sans-serif;
          display: flex;
          align-items: stretch;
        }
        .ravira-auth-split {
          display: grid;
          grid-template-columns: minmax(320px, 420px) 1fr;
          gap: 16px;
          width: 100%;
          max-width: 1360px;
          margin: 0 auto;
        }
        .ravira-auth-aside {
          border-radius: 28px;
          background: linear-gradient(180deg, #0849A8 0%, #0E67CC 54%, #2B8CFF 100%);
          color: #FFFFFF;
          padding: 32px;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          gap: 28px;
        }
        .ravira-auth-aside-top {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 12px;
        }
        .ravira-auth-back-btn {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          min-height: 44px;
          padding: 0 16px;
          border-radius: 999px;
          border: 1px solid rgba(255, 255, 255, 0.35);
          background: rgba(13, 17, 23, 0.28);
          color: #FFFFFF;
          font-family: 'Inter', sans-serif;
          font-size: 13px;
          font-weight: 600;
          cursor: pointer;
          transition: background 0.15s ease;
        }
        .ravira-auth-back-btn:hover {
          background: rgba(13, 17, 23, 0.48);
        }
        .ravira-auth-brand-btn {
          display: inline-flex;
          align-items: center;
          gap: 10px;
          min-height: 44px;
          padding: 0 18px;
          border-radius: 999px;
          border: none;
          background: #0D1117;
          color: #FFFFFF;
          font-family: 'Poppins', sans-serif;
          font-size: 15px;
          font-weight: 700;
          cursor: pointer;
        }
        .ravira-auth-aside-body {
          display: flex;
          flex-direction: column;
          gap: 16px;
        }
        .ravira-auth-title {
          font-family: 'Poppins', sans-serif;
          font-size: clamp(28px, 3.2vw, 38px);
          font-weight: 600;
          letter-spacing: -1px;
          line-height: 1.12;
          margin: 0;
          color: #FFFFFF;
        }
        .ravira-auth-lead {
          font-size: 15px;
          line-height: 1.65;
          color: #FFFFFF;
          margin: 0;
        }
        .ravira-auth-steps {
          display: flex;
          flex-direction: column;
          gap: 12px;
          margin-top: 12px;
        }
        .ravira-auth-step-card {
          border-radius: 18px;
          padding: 18px;
          display: flex;
          align-items: flex-start;
          gap: 14px;
        }
        .ravira-auth-step-card-dark {
          background: #0D1117;
          color: #FFFFFF;
        }
        .ravira-auth-step-card-light {
          background: #FFFFFF;
          color: #0D1117;
        }
        .ravira-auth-step-num {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          min-width: 32px;
          height: 32px;
          border-radius: 8px;
          background: #D4FF59;
          color: #0D1117;
          font-family: 'JetBrains Mono', monospace;
          font-size: 12px;
          font-weight: 700;
          flex-shrink: 0;
        }
        .ravira-auth-step-num-blue {
          background: #0E67CC;
          color: #FFFFFF;
        }
        .ravira-auth-step-heading {
          font-family: 'Poppins', sans-serif;
          font-size: 14px;
          font-weight: 600;
          color: #FFFFFF;
          margin-bottom: 4px;
        }
        .ravira-auth-step-heading-dark {
          color: #0D1117;
        }
        .ravira-auth-step-desc {
          font-size: 13px;
          line-height: 1.55;
          color: #D1D5DB;
        }
        .ravira-auth-step-desc-dark {
          color: #334155;
        }
        .ravira-auth-trust {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 14px 16px;
          border-radius: 14px;
          background: rgba(13, 17, 23, 0.35);
          font-size: 12.5px;
          line-height: 1.5;
          color: #FFFFFF;
        }
        .ravira-auth-form-pane {
          background: #F4F5F7;
          border-radius: 28px;
          padding: 28px;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .ravira-auth-form-card {
          width: 100%;
          max-width: 720px;
          background: #FFFFFF;
          border-radius: 20px;
          border: 1px solid #E2E8F0;
          padding: 36px;
        }
        .ravira-auth-form-header {
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
          flex-wrap: wrap;
          gap: 12px;
          margin-bottom: 28px;
          padding-bottom: 20px;
          border-bottom: 1px solid #E2E8F0;
        }
        .ravira-auth-form-heading {
          font-family: 'Poppins', sans-serif;
          font-size: 22px;
          font-weight: 600;
          letter-spacing: -0.5px;
          color: #0D1117;
          margin: 0 0 4px;
        }
        .ravira-auth-form-sub {
          font-size: 13.5px;
          color: #475569;
          margin: 0;
        }
        .ravira-auth-switch-link {
          font-size: 13.5px;
          color: #475569;
          margin: 0;
        }
        .ravira-inline-link {
          background: none;
          border: none;
          padding: 4px 2px;
          color: #0849A8;
          font-weight: 700;
          font-size: 13.5px;
          cursor: pointer;
          text-decoration: underline;
          text-underline-offset: 3px;
        }
        .ravira-form-grid-2 {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 16px;
          margin-bottom: 16px;
        }
        .ravira-field {
          display: flex;
          flex-direction: column;
        }
        .ravira-label {
          font-size: 13px;
          font-weight: 600;
          color: #0D1117;
          margin-bottom: 6px;
        }
        .ravira-input {
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
          transition: border-color 0.15s ease, box-shadow 0.15s ease;
        }
        .ravira-input::placeholder {
          color: #64748B;
        }
        .ravira-input:hover {
          border-color: #475569;
        }
        .ravira-input:focus-visible,
        .ravira-auth-back-btn:focus-visible,
        .ravira-auth-brand-btn:focus-visible,
        .ravira-inline-link:focus-visible,
        .ravira-upload-btn:focus-visible,
        .ravira-submit-btn:focus-visible {
          outline: 3px solid #0849A8;
          outline-offset: 2px;
        }
        .ravira-upload-btn {
          width: 100%;
          min-height: 84px;
          padding: 18px 20px;
          border-radius: 12px;
          border: 1.5px dashed #64748B;
          background: #F8FAFC;
          display: flex;
          align-items: center;
          gap: 16px;
          text-align: left;
          cursor: pointer;
          transition: border-color 0.15s ease, background 0.15s ease;
        }
        .ravira-upload-btn:hover,
        .ravira-upload-btn-active {
          border-color: #0849A8;
          background: #F0F7FF;
        }
        .ravira-upload-icon {
          width: 42px;
          height: 42px;
          border-radius: 10px;
          background: #0D1117;
          color: #D4FF59;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }
        .ravira-upload-text {
          display: flex;
          flex-direction: column;
          gap: 2px;
          font-family: 'Inter', sans-serif;
        }
        .ravira-upload-text strong {
          font-family: 'Poppins', sans-serif;
          font-size: 14px;
          font-weight: 600;
          color: #0D1117;
        }
        .ravira-upload-text span {
          font-size: 12.5px;
          color: #475569;
        }
        .ravira-consent-box {
          background: #F4F5F7;
          border-radius: 12px;
          border: 1px solid #CBD5E1;
          padding: 16px 18px;
          margin-bottom: 24px;
          display: flex;
          flex-direction: column;
          gap: 12px;
        }
        .ravira-consent-row {
          display: flex;
          align-items: flex-start;
          gap: 10px;
          font-size: 13px;
          line-height: 1.55;
          color: #1E293B;
          cursor: pointer;
        }
        .ravira-consent-row input[type="checkbox"] {
          width: 18px;
          height: 18px;
          margin-top: 2px;
          accent-color: #0849A8;
          flex-shrink: 0;
          cursor: pointer;
        }
        .ravira-submit-btn {
          width: 100%;
          min-height: 48px;
          padding: 12px 24px;
          border-radius: 999px;
          border: 2px solid #0D1117;
          background: #D4FF59;
          color: #0D1117;
          font-family: 'Poppins', sans-serif;
          font-size: 15px;
          font-weight: 700;
          cursor: pointer;
          transition: transform 0.15s ease, background 0.15s ease;
        }
        .ravira-submit-btn:hover:not(:disabled) {
          background: #c8f542;
          transform: translateY(-1px);
        }
        .ravira-submit-btn:active:not(:disabled) {
          transform: translateY(0);
        }
        .ravira-submit-btn:disabled {
          background: #E2E8F0;
          border-color: #94A3B8;
          color: #475569;
          cursor: not-allowed;
        }
        @media (max-width: 960px) {
          .ravira-auth-split {
            grid-template-columns: 1fr;
          }
          .ravira-auth-aside {
            padding: 24px;
          }
          .ravira-auth-form-pane {
            padding: 16px;
          }
          .ravira-auth-form-card {
            padding: 24px 20px;
          }
        }
        @media (max-width: 640px) {
          .ravira-auth-shell {
            padding: 10px;
          }
          .ravira-form-grid-2 {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </main>
  );
}
