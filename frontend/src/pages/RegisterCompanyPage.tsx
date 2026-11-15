import { useState } from "react";
import { useNavigate } from "react-router";
import { ArrowLeft, Building2, Shield, Upload } from "lucide-react";
import { RaviraOwlIcon } from "../components/RaviraLogo";
import { toast } from "sonner";
import { useAppContext } from "../contexts/AppContext";

const industriOptions = [
  "Teknologi & Software",
  "E-Commerce & Retail",
  "Perbankan & Keuangan",
  "Manufaktur",
  "Kesehatan",
  "Pendidikan",
  "Telekomunikasi",
  "Media & Hiburan",
  "Logistik & Transportasi",
  "FMCG",
  "Konsultan",
  "Lainnya",
];
const ukuranOptions = [
  "1–10 karyawan",
  "11–50 karyawan",
  "51–200 karyawan",
  "201–500 karyawan",
  "501–1000 karyawan",
  "> 1000 karyawan",
];

export default function RegisterCompanyPage() {
  const navigate = useNavigate();
  const { registerRecruiter } = useAppContext();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [consent1, setConsent1] = useState(false);
  const [consent2, setConsent2] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (isSubmitting || !consent1 || !consent2) return;
    const data = new FormData(e.currentTarget);
    const text = (name: string) => {
      const value = data.get(name);
      return typeof value === "string" ? value : "";
    };
    setIsSubmitting(true);
    try {
      await registerRecruiter({
        name: text("name").trim(),
        email: text("email").trim(),
        password: text("password"),
        companyName: text("companyName").trim(),
        industry: text("industry"),
        position: text("position").trim(),
        ...(text("companyWebsite").trim() ? { companyWebsite: text("companyWebsite").trim() } : {}),
      });
      navigate("/daftar/perusahaan/onboarding", { replace: true });
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Registrasi perusahaan gagal.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="ravira-auth-shell">
      <div className="ravira-auth-split">
        <aside className="ravira-auth-aside" aria-label="Informasi registrasi perusahaan">
          <div className="ravira-auth-aside-top">
            <button
              type="button"
              onClick={() => navigate("/untuk-perusahaan")}
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
            <div className="ravira-auth-role-icon" aria-hidden="true">
              <Building2 size={22} />
            </div>
            <h1 className="ravira-auth-title">Daftarkan Perusahaan Anda</h1>
            <p className="ravira-auth-lead">
              Temukan kandidat terbaik lebih cepat dengan shortlist AI yang cerdas.
            </p>

            <div className="ravira-auth-steps">
              <div className="ravira-auth-step-card ravira-auth-step-card-dark">
                <span className="ravira-auth-step-num">01</span>
                <div>
                  <div className="ravira-auth-step-heading">Identitas Perusahaan &amp; PIC</div>
                  <div className="ravira-auth-step-desc">
                    Lengkapi profil organisasi serta penanggung jawab rekrutmen (HR/Recruiter).
                  </div>
                </div>
              </div>
              <div className="ravira-auth-step-card ravira-auth-step-card-light">
                <span className="ravira-auth-step-num ravira-auth-step-num-blue">02</span>
                <div>
                  <div className="ravira-auth-step-heading ravira-auth-step-heading-dark">
                    Verifikasi &amp; Publikasi Lowongan
                  </div>
                  <div className="ravira-auth-step-desc ravira-auth-step-desc-dark">
                    Setelah akun disetujui admin, Anda dapat membuka lowongan dan mengelola kandidat.
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="ravira-auth-trust">
            <Shield size={16} aria-hidden="true" />
            <span>Akses rekrutmen tersedia setelah perusahaan disetujui admin.</span>
          </div>
        </aside>

        <section className="ravira-auth-form-pane" aria-label="Formulir registrasi perusahaan">
          <div className="ravira-auth-form-card">
            <div className="ravira-auth-form-header">
              <div>
                <h2 className="ravira-auth-form-heading">Informasi Perusahaan</h2>
                <p className="ravira-auth-form-sub">
                  Pastikan email bisnis dan data perusahaan sesuai dengan dokumen resmi.
                </p>
              </div>
              <p className="ravira-auth-switch-link">
                Sudah punya akun?{" "}
                <button
                  type="button"
                  onClick={() => navigate("/masuk/perusahaan")}
                  className="ravira-inline-link"
                >
                  Masuk Perusahaan
                </button>
              </p>
            </div>

            <form onSubmit={handleSubmit}>
              <div className="ravira-form-grid-2">
                <div className="ravira-field">
                  <label htmlFor="comp-name" className="ravira-label">
                    Nama Perusahaan *
                  </label>
                  <input
                    id="comp-name"
                    name="companyName"
                    className="ravira-input"
                    placeholder="Masukkan nama resmi perusahaan (PT / CV)"
                    required
                  />
                </div>
                <div className="ravira-field">
                  <label htmlFor="comp-website" className="ravira-label">
                    Website Perusahaan
                  </label>
                  <input
                    id="comp-website"
                    name="companyWebsite"
                    type="url"
                    className="ravira-input"
                    placeholder="https://perusahaan.com"
                  />
                </div>
              </div>

              <div className="ravira-form-grid-2">
                <div className="ravira-field">
                  <label htmlFor="comp-industry" className="ravira-label">
                    Industri *
                  </label>
                  <select id="comp-industry" name="industry" className="ravira-input" required>
                    <option value="">Pilih industri</option>
                    {industriOptions.map((i) => (
                      <option key={i} value={i}>
                        {i}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="ravira-field">
                  <label htmlFor="comp-size" className="ravira-label">
                    Ukuran Perusahaan *
                  </label>
                  <select
                    id="comp-size"
                    name="companySize"
                    className="ravira-input"
                    aria-describedby="company-registration-notice"
                  >
                    <option value="">Pilih ukuran</option>
                    {ukuranOptions.map((u) => (
                      <option key={u} value={u}>
                        {u}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="ravira-field" style={{ marginBottom: 16 }}>
                <label htmlFor="comp-desc" className="ravira-label">
                  Deskripsi Singkat Perusahaan
                </label>
                <textarea
                  id="comp-desc"
                  name="description"
                  aria-describedby="company-registration-notice"
                  className="ravira-input"
                  style={{ resize: "vertical", minHeight: 88 }}
                  placeholder="Ceritakan visi, misi, dan budaya kerja perusahaan Anda..."
                />
              </div>

              <div className="ravira-field" style={{ marginBottom: 20 }}>
                <label className="ravira-label">Logo Perusahaan</label>
                <div
                  aria-disabled="true"
                  aria-describedby="company-registration-notice"
                  className="ravira-upload-disabled"
                >
                  <span className="ravira-upload-disabled-icon" aria-hidden="true">
                    <Upload size={18} />
                  </span>
                  <div className="ravira-upload-text">
                    <strong>Upload Logo Belum Tersedia</strong>
                    <span>PNG, SVG, atau JPG • Maks. 2MB</span>
                  </div>
                </div>
              </div>

              <p
                id="company-registration-notice"
                role="status"
                className="ravira-status-notice"
              >
                Registrasi menyimpan nama perusahaan, website, industri, nama PIC, jabatan, email,
                dan password. Ukuran, deskripsi, logo, serta pencatatan persetujuan belum didukung
                layanan registrasi dan tidak disimpan. Unggah logo belum tersedia.
              </p>

              <h3 className="ravira-section-subheading">Informasi PIC (Person in Charge)</h3>

              <div className="ravira-form-grid-2">
                <div className="ravira-field">
                  <label htmlFor="pic-name" className="ravira-label">
                    Nama PIC *
                  </label>
                  <input
                    id="pic-name"
                    name="name"
                    className="ravira-input"
                    placeholder="Masukkan nama lengkap penanggung jawab"
                    required
                  />
                </div>
                <div className="ravira-field">
                  <label htmlFor="pic-position" className="ravira-label">
                    Jabatan *
                  </label>
                  <input
                    id="pic-position"
                    name="position"
                    className="ravira-input"
                    placeholder="Contoh: HR Manager / Talent Acquisition"
                    required
                  />
                </div>
              </div>

              <div className="ravira-form-grid-2" style={{ marginBottom: 22 }}>
                <div className="ravira-field">
                  <label htmlFor="pic-email" className="ravira-label">
                    Email Bisnis *
                  </label>
                  <input
                    id="pic-email"
                    name="email"
                    type="email"
                    className="ravira-input"
                    placeholder="hr@perusahaan.com"
                    required
                  />
                </div>
                <div className="ravira-field">
                  <label htmlFor="pic-password" className="ravira-label">
                    Password *
                  </label>
                  <input
                    id="pic-password"
                    name="password"
                    type="password"
                    minLength={8}
                    autoComplete="new-password"
                    className="ravira-input"
                    placeholder="Minimal 8 karakter"
                    required
                  />
                </div>
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
                    Saya menyetujui <strong>syarat dan ketentuan layanan</strong> Ravira untuk
                    perusahaan.
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
                    Saya mengizinkan Ravira menggunakan data perusahaan untuk kebutuhan pencocokan
                    kandidat.
                  </span>
                </label>
              </div>

              <button
                type="submit"
                disabled={isSubmitting || !consent1 || !consent2}
                className="ravira-submit-btn"
              >
                {isSubmitting ? "Memproses..." : "Daftarkan Perusahaan"}
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
        .ravira-auth-role-icon {
          width: 48px;
          height: 48px;
          border-radius: 14px;
          background: #0D1117;
          color: #D4FF59;
          display: inline-flex;
          align-items: center;
          justify-content: center;
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
          max-width: 760px;
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
          margin-bottom: 24px;
          padding-bottom: 18px;
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
        .ravira-section-subheading {
          font-family: 'Poppins', sans-serif;
          font-size: 16px;
          font-weight: 600;
          color: #0D1117;
          margin: 0 0 16px;
          padding-bottom: 10px;
          border-bottom: 1px solid #E2E8F0;
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
        }
        .ravira-input::placeholder {
          color: #64748B;
        }
        .ravira-input:focus-visible,
        .ravira-auth-back-btn:focus-visible,
        .ravira-auth-brand-btn:focus-visible,
        .ravira-inline-link:focus-visible,
        .ravira-submit-btn:focus-visible {
          outline: 3px solid #0849A8;
          outline-offset: 2px;
        }
        .ravira-upload-disabled {
          width: 100%;
          min-height: 76px;
          padding: 16px 20px;
          border-radius: 12px;
          border: 1.5px dashed #94A3B8;
          background: #F8FAFC;
          display: flex;
          align-items: center;
          gap: 16px;
          cursor: not-allowed;
        }
        .ravira-upload-disabled-icon {
          width: 40px;
          height: 40px;
          border-radius: 10px;
          background: #E2E8F0;
          color: #475569;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }
        .ravira-upload-text {
          display: flex;
          flex-direction: column;
          gap: 2px;
        }
        .ravira-upload-text strong {
          font-family: 'Poppins', sans-serif;
          font-size: 13.5px;
          font-weight: 600;
          color: #0D1117;
        }
        .ravira-upload-text span {
          font-size: 12px;
          color: #475569;
        }
        .ravira-status-notice {
          font-size: 13px;
          line-height: 1.6;
          color: #0D1117;
          background: #F4F5F7;
          border: 1px solid #CBD5E1;
          border-radius: 12px;
          padding: 14px 16px;
          margin: 0 0 24px;
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
