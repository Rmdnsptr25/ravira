import { useState } from "react";
import { useNavigate } from "react-router";
import { Eye, EyeOff } from "lucide-react";
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
    <main className="ravira-login-shell">
      <div className="ravira-login-split">
        <aside className="ravira-login-aside" aria-label="Informasi analitik ketenagakerjaan">
          <div className="ravira-login-brand">
            <button
              type="button"
              onClick={() => navigate("/")}
              className="ravira-login-brand-btn"
            >
              <RaviraOwlIcon size={28} />
              <span>Ravira</span>
            </button>
          </div>

          <div className="ravira-login-aside-body">
            <h1 className="ravira-login-hero-title">
              Workforce Intelligence untuk Kebijakan Publik
            </h1>
            <p className="ravira-login-hero-desc">
              Data agregat dan anonim untuk mendukung kebijakan ketenagakerjaan berbasis bukti.
            </p>

            <div className="ravira-login-highlights">
              <div className="ravira-login-highlight-card ravira-login-highlight-dark">
                <span className="ravira-login-highlight-num">01</span>
                <div>
                  <div className="ravira-login-highlight-title">Data Agregat &amp; Anonim</div>
                  <div className="ravira-login-highlight-sub">
                    Privasi kandidat terlindungi sepenuhnya sesuai standar tata kelola data.
                  </div>
                </div>
              </div>
              <div className="ravira-login-highlight-card ravira-login-highlight-light">
                <span className="ravira-login-highlight-num ravira-login-highlight-num-blue">02</span>
                <div>
                  <div className="ravira-login-highlight-title ravira-login-highlight-title-dark">
                    Heatmap Workforce Regional
                  </div>
                  <div className="ravira-login-highlight-sub ravira-login-highlight-sub-dark">
                    Peta persebaran kompetensi dan kebutuhan tenaga kerja di berbagai wilayah.
                  </div>
                </div>
              </div>
            </div>
          </div>
        </aside>

        <section className="ravira-login-form-pane" aria-label="Formulir masuk pemerintah">
          <div className="ravira-login-form-card">
            <div className="ravira-login-nav-row">
              <button
                type="button"
                onClick={() => navigate("/untuk-pemerintah")}
                className="ravira-login-back-btn"
              >
                ← Kembali ke Untuk Pemerintah
              </button>
              <div className="ravira-login-portal-links">
                <button
                  type="button"
                  onClick={() => navigate("/untuk-kandidat")}
                  className="ravira-portal-link-btn"
                >
                  Untuk Kandidat
                </button>
                <span aria-hidden="true" style={{ color: "#64748B" }}>
                  /
                </span>
                <button
                  type="button"
                  onClick={() => navigate("/untuk-perusahaan")}
                  className="ravira-portal-link-btn"
                >
                  Untuk Perusahaan
                </button>
              </div>
            </div>

            <h2 className="ravira-login-heading">Masuk sebagai Pemerintah / Institusi</h2>
            <p className="ravira-login-sub">
              Akses data workforce analytics dan insight tenaga kerja secara agregat.
            </p>

            <form onSubmit={handleLogin}>
              <p role="status" className="ravira-login-status-box">
                Login pemerintah / institusi belum tersedia. Form ini dinonaktifkan dan tidak
                membuka sesi atau akses dashboard.
              </p>
              <fieldset disabled style={{ border: 0, margin: 0, padding: 0, minWidth: 0 }}>
                <div className="ravira-login-field">
                  <label htmlFor="login-gov-email" className="ravira-login-label">
                    Email Resmi
                  </label>
                  <input
                    id="login-gov-email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="nama@instansi.go.id"
                    required
                    className="ravira-login-input"
                  />
                </div>

                <div className="ravira-login-field" style={{ marginBottom: 14 }}>
                  <label htmlFor="login-gov-password" className="ravira-login-label">
                    Password
                  </label>
                  <div className="ravira-password-wrap">
                    <input
                      id="login-gov-password"
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Masukkan password akun instansi"
                      required
                      className="ravira-login-input ravira-login-input-pw"
                    />
                    <button
                      type="button"
                      aria-label={showPassword ? "Sembunyikan password" : "Tampilkan password"}
                      onClick={() => setShowPassword(!showPassword)}
                      className="ravira-pw-toggle"
                    >
                      {showPassword ? (
                        <EyeOff size={18} aria-hidden="true" />
                      ) : (
                        <Eye size={18} aria-hidden="true" />
                      )}
                    </button>
                  </div>
                </div>

                <div className="ravira-remember-row">
                  <label htmlFor="login-gov-remember" className="ravira-remember-label">
                    <input
                      id="login-gov-remember"
                      type="checkbox"
                      checked={remember}
                      onChange={(e) => setRemember(e.target.checked)}
                    />
                    <span>Ingat saya</span>
                  </label>
                </div>

                <button type="submit" disabled className="ravira-login-submit">
                  Login Belum Tersedia
                </button>
              </fieldset>
            </form>

            <p className="ravira-login-footer">
              Belum punya akses?{" "}
              <button
                type="button"
                onClick={() => navigate("/daftar/pemerintah")}
                className="ravira-portal-link-btn"
              >
                Ajukan Akses Analytics
              </button>
            </p>
          </div>
        </section>
      </div>

      <style>{`
        .ravira-login-shell {
          min-height: 100dvh;
          background: #FFFFFF;
          padding: 16px;
          box-sizing: border-box;
          font-family: 'Inter', sans-serif;
          display: flex;
          align-items: stretch;
        }
        .ravira-login-split {
          display: grid;
          grid-template-columns: minmax(320px, 460px) 1fr;
          gap: 16px;
          width: 100%;
          max-width: 1360px;
          margin: 0 auto;
        }
        .ravira-login-aside {
          border-radius: 28px;
          background: linear-gradient(180deg, #0849A8 0%, #0E67CC 54%, #2B8CFF 100%);
          color: #FFFFFF;
          padding: 36px;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          gap: 28px;
        }
        .ravira-login-brand-btn {
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
          font-size: 16px;
          font-weight: 700;
          cursor: pointer;
        }
        .ravira-login-aside-body {
          display: flex;
          flex-direction: column;
          gap: 16px;
        }
        .ravira-login-hero-title {
          font-family: 'Poppins', sans-serif;
          font-size: clamp(28px, 3vw, 36px);
          font-weight: 600;
          letter-spacing: -0.9px;
          line-height: 1.15;
          margin: 0;
          color: #FFFFFF;
        }
        .ravira-login-hero-desc {
          font-size: 15px;
          line-height: 1.65;
          color: #FFFFFF;
          margin: 0;
        }
        .ravira-login-highlights {
          display: flex;
          flex-direction: column;
          gap: 12px;
          margin-top: 12px;
        }
        .ravira-login-highlight-card {
          border-radius: 18px;
          padding: 18px;
          display: flex;
          align-items: flex-start;
          gap: 14px;
        }
        .ravira-login-highlight-dark {
          background: #0D1117;
          color: #FFFFFF;
        }
        .ravira-login-highlight-light {
          background: #FFFFFF;
          color: #0D1117;
        }
        .ravira-login-highlight-num {
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
        .ravira-login-highlight-num-blue {
          background: #0E67CC;
          color: #FFFFFF;
        }
        .ravira-login-highlight-title {
          font-family: 'Poppins', sans-serif;
          font-size: 14px;
          font-weight: 600;
          color: #FFFFFF;
          margin-bottom: 4px;
        }
        .ravira-login-highlight-title-dark {
          color: #0D1117;
        }
        .ravira-login-highlight-sub {
          font-size: 13px;
          line-height: 1.55;
          color: #D1D5DB;
        }
        .ravira-login-highlight-sub-dark {
          color: #334155;
        }
        .ravira-login-form-pane {
          background: #F4F5F7;
          border-radius: 28px;
          padding: 28px;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .ravira-login-form-card {
          width: 100%;
          max-width: 460px;
          background: #FFFFFF;
          border-radius: 20px;
          border: 1px solid #E2E8F0;
          padding: 36px 32px;
        }
        .ravira-login-nav-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
          flex-wrap: wrap;
          gap: 10px;
          margin-bottom: 24px;
        }
        .ravira-login-back-btn {
          min-height: 44px;
          padding: 0 14px;
          border-radius: 10px;
          border: 1px solid #CBD5E1;
          background: #F8FAFC;
          color: #0D1117;
          font-family: 'Inter', sans-serif;
          font-size: 12.5px;
          font-weight: 600;
          cursor: pointer;
        }
        .ravira-login-portal-links {
          display: flex;
          align-items: center;
          gap: 8px;
        }
        .ravira-portal-link-btn {
          min-height: 44px;
          padding: 0 6px;
          background: none;
          border: none;
          color: #0849A8;
          font-family: 'Inter', sans-serif;
          font-size: 13px;
          font-weight: 700;
          cursor: pointer;
          text-decoration: underline;
          text-underline-offset: 3px;
        }
        .ravira-login-heading {
          font-family: 'Poppins', sans-serif;
          font-size: 26px;
          font-weight: 600;
          letter-spacing: -0.7px;
          color: #0D1117;
          margin: 0 0 6px;
        }
        .ravira-login-sub {
          font-size: 14px;
          color: #475569;
          margin: 0 0 20px;
          line-height: 1.55;
        }
        .ravira-login-status-box {
          font-size: 13px;
          line-height: 1.55;
          color: #0D1117;
          background: #F4F5F7;
          border: 1px solid #CBD5E1;
          border-radius: 12px;
          padding: 14px 16px;
          margin: 0 0 20px;
        }
        .ravira-login-field {
          display: flex;
          flex-direction: column;
          margin-bottom: 16px;
        }
        .ravira-login-label {
          font-size: 13px;
          font-weight: 600;
          color: #0D1117;
          margin-bottom: 6px;
        }
        .ravira-login-input {
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
        .ravira-login-input-pw {
          padding-right: 48px;
        }
        .ravira-login-input::placeholder {
          color: #64748B;
        }
        .ravira-password-wrap {
          position: relative;
        }
        .ravira-pw-toggle {
          position: absolute;
          right: 4px;
          top: 50%;
          transform: translateY(-50%);
          width: 40px;
          height: 40px;
          border-radius: 8px;
          background: none;
          border: none;
          color: #475569;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          cursor: not-allowed;
        }
        .ravira-remember-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 22px;
        }
        .ravira-remember-label {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          min-height: 44px;
          font-size: 13.5px;
          color: #334155;
          cursor: not-allowed;
        }
        .ravira-remember-label input[type="checkbox"] {
          width: 18px;
          height: 18px;
        }
        .ravira-login-submit {
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
          margin-bottom: 18px;
        }
        .ravira-login-footer {
          text-align: center;
          font-size: 13.5px;
          color: #475569;
          margin: 0;
        }
        .ravira-login-brand-btn:focus-visible,
        .ravira-login-back-btn:focus-visible,
        .ravira-portal-link-btn:focus-visible {
          outline: 3px solid #0849A8;
          outline-offset: 2px;
        }
        @media (max-width: 900px) {
          .ravira-login-split {
            grid-template-columns: 1fr;
          }
          .ravira-login-aside {
            padding: 24px;
          }
          .ravira-login-form-pane {
            padding: 16px;
          }
          .ravira-login-form-card {
            padding: 24px 20px;
          }
        }
      `}</style>
    </main>
  );
}
