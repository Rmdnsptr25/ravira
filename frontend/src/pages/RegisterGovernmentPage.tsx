import { useState } from "react";
import { useNavigate } from "react-router";
import { ArrowLeft, Landmark, Shield, Upload, FileCheck } from "lucide-react";
import { RaviraOwlIcon } from "../components/RaviraLogo";

const jenisLembagaOptions = [
  "Kementerian",
  "Dinas Tenaga Kerja",
  "BPJS Ketenagakerjaan",
  "Badan Nasional Sertifikasi Profesi (BNSP)",
  "Lembaga Pendidikan & Pelatihan",
  "Pemerintah Daerah (Pemda)",
  "BUMN",
  "Lembaga Riset",
  "Lainnya",
];
const wilayahOptions = [
  "DKI Jakarta",
  "Jawa Barat",
  "Jawa Tengah",
  "Jawa Timur",
  "Sumatera Utara",
  "Sulawesi Selatan",
  "Kalimantan Timur",
  "Bali",
  "Nasional (seluruh Indonesia)",
  "Lainnya",
];

export default function RegisterGovernmentPage() {
  const navigate = useNavigate();
  const [consent1, setConsent1] = useState(false);
  const [consent2, setConsent2] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
  };

  return (
    <main className="ravira-auth-shell">
      <div className="ravira-auth-split">
        <aside className="ravira-auth-aside" aria-label="Informasi registrasi pemerintah">
          <div className="ravira-auth-aside-top">
            <button
              type="button"
              onClick={() => navigate("/untuk-pemerintah")}
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
              <Landmark size={22} />
            </div>
            <h1 className="ravira-auth-title">Daftar sebagai Lembaga Pemerintah</h1>
            <p className="ravira-auth-lead">
              Akses data analitik workforce regional dan nasional untuk pengambilan kebijakan berbasis
              data.
            </p>

            <div className="ravira-gov-notice-card">
              <div className="ravira-gov-notice-icon" aria-hidden="true">
                <FileCheck size={18} />
              </div>
              <div>
                <div className="ravira-gov-notice-title">Registrasi Belum Tersedia</div>
                <p role="status" className="ravira-gov-notice-text">
                  Pendaftaran pemerintah / institusi dan unggah dokumen belum tersedia. Form
                  dinonaktifkan; data tidak dikirim dan permohonan verifikasi tidak dibuat.
                </p>
              </div>
            </div>
          </div>

          <div className="ravira-auth-trust">
            <Shield size={16} aria-hidden="true" />
            <span>Belum ada data atau dokumen lembaga yang dikirim melalui form ini.</span>
          </div>
        </aside>

        <section className="ravira-auth-form-pane" aria-label="Formulir registrasi instansi">
          <div className="ravira-auth-form-card">
            <div className="ravira-auth-form-header">
              <div>
                <h2 className="ravira-auth-form-heading">Identitas Lembaga</h2>
                <p className="ravira-auth-form-sub">
                  Pratinjau formulir pengajuan akses analitik untuk instansi pemerintah.
                </p>
              </div>
              <p className="ravira-auth-switch-link">
                Sudah punya akses?{" "}
                <button
                  type="button"
                  onClick={() => navigate("/masuk/pemerintah")}
                  className="ravira-inline-link"
                >
                  Masuk Pemerintah
                </button>
              </p>
            </div>

            <form onSubmit={handleSubmit}>
              <fieldset disabled style={{ border: 0, margin: 0, padding: 0, minWidth: 0 }}>
                <div className="ravira-field" style={{ marginBottom: 16 }}>
                  <label htmlFor="gov-org" className="ravira-label">
                    Nama Lembaga/Instansi *
                  </label>
                  <input
                    id="gov-org"
                    className="ravira-input"
                    placeholder="Contoh: Dinas Tenaga Kerja Provinsi"
                    required
                  />
                </div>

                <div className="ravira-form-grid-2">
                  <div className="ravira-field">
                    <label htmlFor="gov-type" className="ravira-label">
                      Jenis Lembaga *
                    </label>
                    <select id="gov-type" className="ravira-input" required>
                      <option value="">Pilih jenis lembaga</option>
                      {jenisLembagaOptions.map((j) => (
                        <option key={j} value={j}>
                          {j}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="ravira-field">
                    <label htmlFor="gov-region" className="ravira-label">
                      Cakupan Wilayah *
                    </label>
                    <select id="gov-region" className="ravira-input" required>
                      <option value="">Pilih wilayah</option>
                      {wilayahOptions.map((w) => (
                        <option key={w} value={w}>
                          {w}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="ravira-form-grid-2">
                  <div className="ravira-field">
                    <label htmlFor="gov-web" className="ravira-label">
                      Website Resmi
                    </label>
                    <input
                      id="gov-web"
                      className="ravira-input"
                      placeholder="https://instansi.go.id"
                    />
                  </div>
                  <div className="ravira-field">
                    <label htmlFor="gov-npwp" className="ravira-label">
                      NPWP Lembaga *
                    </label>
                    <input
                      id="gov-npwp"
                      className="ravira-input"
                      placeholder="00.000.000.0-000.000"
                      required
                    />
                  </div>
                </div>

                <h3 className="ravira-section-subheading">Data PIC</h3>

                <div className="ravira-form-grid-2">
                  <div className="ravira-field">
                    <label htmlFor="gov-pic" className="ravira-label">
                      Nama PIC *
                    </label>
                    <input
                      id="gov-pic"
                      className="ravira-input"
                      placeholder="Masukkan nama lengkap pejabat/PIC"
                      required
                    />
                  </div>
                  <div className="ravira-field">
                    <label htmlFor="gov-nip" className="ravira-label">
                      Jabatan/NIP *
                    </label>
                    <input
                      id="gov-nip"
                      className="ravira-input"
                      placeholder="Masukkan jabatan dan NIP"
                      required
                    />
                  </div>
                </div>

                <div className="ravira-form-grid-2" style={{ marginBottom: 20 }}>
                  <div className="ravira-field">
                    <label htmlFor="gov-email" className="ravira-label">
                      Email Dinas *
                    </label>
                    <input
                      id="gov-email"
                      type="email"
                      className="ravira-input"
                      placeholder="pic@instansi.go.id"
                      required
                    />
                  </div>
                  <div className="ravira-field">
                    <label htmlFor="gov-phone" className="ravira-label">
                      Nomor Telepon Kantor
                    </label>
                    <input
                      id="gov-phone"
                      className="ravira-input"
                      placeholder="021-xxxxxxxx"
                    />
                  </div>
                </div>

                <div className="ravira-field" style={{ marginBottom: 22 }}>
                  <label className="ravira-label">Surat Resmi/SK Lembaga *</label>
                  <div aria-disabled="true" className="ravira-upload-disabled">
                    <span className="ravira-upload-disabled-icon" aria-hidden="true">
                      <Upload size={18} />
                    </span>
                    <div className="ravira-upload-text">
                      <strong>Upload Dokumen Belum Tersedia</strong>
                      <span>SK, Surat Tugas, atau dokumen pengesahan • PDF • Maks. 10MB</span>
                    </div>
                  </div>
                </div>

                <div className="ravira-consent-box">
                  <label htmlFor="gc1" className="ravira-consent-row">
                    <input
                      type="checkbox"
                      id="gc1"
                      checked={consent1}
                      onChange={(e) => setConsent1(e.target.checked)}
                    />
                    <span>
                      Saya menyatakan bahwa informasi yang diberikan adalah{" "}
                      <strong>benar dan sah</strong> atas nama lembaga yang berwenang.
                    </span>
                  </label>
                  <label htmlFor="gc2" className="ravira-consent-row">
                    <input
                      type="checkbox"
                      id="gc2"
                      checked={consent2}
                      onChange={(e) => setConsent2(e.target.checked)}
                    />
                    <span>
                      Saya menyetujui <strong>kebijakan akses data</strong> Ravira untuk lembaga
                      pemerintah dan penggunaan analitik workforce.
                    </span>
                  </label>
                </div>

                <button type="submit" disabled className="ravira-submit-btn">
                  Registrasi Belum Tersedia
                </button>
              </fieldset>
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
        .ravira-gov-notice-card {
          background: #0D1117;
          border-radius: 18px;
          padding: 18px;
          display: flex;
          align-items: flex-start;
          gap: 14px;
          margin-top: 8px;
        }
        .ravira-gov-notice-icon {
          width: 36px;
          height: 36px;
          border-radius: 10px;
          background: #D4FF59;
          color: #0D1117;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }
        .ravira-gov-notice-title {
          font-family: 'Poppins', sans-serif;
          font-size: 14px;
          font-weight: 600;
          color: #FFFFFF;
          margin-bottom: 4px;
        }
        .ravira-gov-notice-text {
          font-size: 13px;
          line-height: 1.55;
          color: #D1D5DB;
          margin: 0;
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
          background: #F8FAFC;
          color: #0D1117;
          font-family: 'Inter', sans-serif;
          font-size: 14px;
          box-sizing: border-box;
          cursor: not-allowed;
        }
        .ravira-input::placeholder {
          color: #64748B;
        }
        .ravira-auth-back-btn:focus-visible,
        .ravira-auth-brand-btn:focus-visible,
        .ravira-inline-link:focus-visible {
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
          cursor: not-allowed;
        }
        .ravira-consent-row input[type="checkbox"] {
          width: 18px;
          height: 18px;
          margin-top: 2px;
          flex-shrink: 0;
        }
        .ravira-submit-btn {
          width: 100%;
          min-height: 48px;
          padding: 12px 24px;
          border-radius: 999px;
          border: 1.5px solid #94A3B8;
          background: #E2E8F0;
          color: #475569;
          font-family: 'Poppins', sans-serif;
          font-size: 15px;
          font-weight: 700;
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
