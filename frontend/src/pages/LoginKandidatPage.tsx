import { useState } from "react";
import { useNavigate } from "react-router";
import { Eye, EyeOff } from "lucide-react";
import { toast } from "sonner";
import { RaviraOwlIcon } from "../components/RaviraLogo";
import { useAppContext } from "../contexts/AppContext";

export default function LoginKandidatPage({ adminMode = false }: { adminMode?: boolean }) {
  const navigate = useNavigate();
  const { login } = useAppContext();
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [remember, setRemember] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return;
    setIsSubmitting(true);
    try {
      await login(email, password, adminMode ? ["ADMIN", "SUPER_ADMIN"] : "CANDIDATE");
      navigate(adminMode ? "/admin" : "/dashboard/kandidat", { replace: true });
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Login gagal.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="ravira-login-shell">
      <div className="ravira-login-split">
        <aside className="ravira-login-aside" aria-label="Informasi platform Ravira">
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
            <h1 className="ravira-login-hero-title">Temukan Pekerjaan, Raih Masa Depan</h1>
            <p className="ravira-login-hero-desc">
              Platform rekrutmen berbasis AI yang menghubungkan talenta dengan peluang terbaik di
              seluruh Indonesia.
            </p>

            <div className="ravira-login-highlights">
              <div className="ravira-login-highlight-card ravira-login-highlight-dark">
                <span className="ravira-login-highlight-num">01</span>
                <div>
                  <div className="ravira-login-highlight-title">Pencocokan Kompetensi Terukur</div>
                  <div className="ravira-login-highlight-sub">
                    Rekomendasi pekerjaan dihitung dari kecocokan skill, preferensi kerja, dan
                    lokasi.
                  </div>
                </div>
              </div>
              <div className="ravira-login-highlight-card ravira-login-highlight-light">
                <span className="ravira-login-highlight-num ravira-login-highlight-num-blue">02</span>
                <div>
                  <div className="ravira-login-highlight-title ravira-login-highlight-title-dark">
                    Skill Gap Report Personal
                  </div>
                  <div className="ravira-login-highlight-sub ravira-login-highlight-sub-dark">
                    Pahami celah kompetensi Anda dan dapatkan rekomendasi pelatihan yang relevan.
                  </div>
                </div>
              </div>
            </div>
          </div>
        </aside>

        <section className="ravira-login-form-pane" aria-label="Formulir masuk kandidat">
          <div className="ravira-login-form-card">
            <div className="ravira-login-nav-row">
              <button
                type="button"
                onClick={() => navigate(adminMode ? "/" : "/untuk-kandidat")}
                className="ravira-login-back-btn"
              >
                ← Kembali ke {adminMode ? "Beranda" : "Untuk Kandidat"}
              </button>
              {!adminMode && (
                <div className="ravira-login-portal-links">
                  <button
                    type="button"
                    onClick={() => navigate("/untuk-perusahaan")}
                    className="ravira-portal-link-btn"
                  >
                    Untuk Perusahaan
                  </button>
                  <span aria-hidden="true" style={{ color: "#64748B" }}>
                    /
                  </span>
                  <button
                    type="button"
                    onClick={() => navigate("/untuk-pemerintah")}
                    className="ravira-portal-link-btn"
                  >
                    Untuk Pemerintah
                  </button>
                </div>
              )}
            </div>

            <h2 className="ravira-login-heading">
              Masuk sebagai {adminMode ? "Admin" : "Kandidat"}
            </h2>
            <p className="ravira-login-sub">
              {adminMode
                ? "Akses konsol administrasi RAVIRA dengan akun admin Anda."
                : "Lanjutkan perjalanan karier Anda bersama Ravira."}
            </p>

            <form onSubmit={handleLogin}>
              <div className="ravira-login-field">
                <label htmlFor="login-kandidat-email" className="ravira-login-label">
                  Email
                </label>
                <input
                  id="login-kandidat-email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="nama@email.com"
                  required
                  className="ravira-login-input"
                />
              </div>

              <div className="ravira-login-field" style={{ marginBottom: 14 }}>
                <label htmlFor="login-kandidat-password" className="ravira-login-label">
                  Password
                </label>
                <div className="ravira-password-wrap">
                  <input
                    id="login-kandidat-password"
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Masukkan password akun Anda"
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
                <label htmlFor="login-kandidat-remember" className="ravira-remember-label">
                  <input
                    id="login-kandidat-remember"
                    type="checkbox"
                    checked={remember}
                    onChange={(e) => setRemember(e.target.checked)}
                  />
                  <span>Ingat saya</span>
                </label>
              </div>

              <button type="submit" disabled={isSubmitting} className="ravira-login-submit">
                {isSubmitting ? "Memproses..." : "Masuk"}
              </button>
            </form>

            {!adminMode && (
              <p className="ravira-login-footer">
                Belum punya akun?{" "}
                <button
                  type="button"
                  onClick={() => navigate("/daftar/kandidat")}
                  className="ravira-portal-link-btn"
                >
                  Daftar sebagai Kandidat
                </button>
              </p>
            )}
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
          margin: 0 0 24px;
          line-height: 1.55;
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
          background: #FFFFFF;
          color: #0D1117;
          font-family: 'Inter', sans-serif;
          font-size: 14px;
          box-sizing: border-box;
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
          cursor: pointer;
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
          cursor: pointer;
        }
        .ravira-remember-label input[type="checkbox"] {
          width: 18px;
          height: 18px;
          accent-color: #0849A8;
          cursor: pointer;
        }
        .ravira-login-submit {
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
          margin-bottom: 18px;
          transition: transform 0.15s ease, background 0.15s ease;
        }
        .ravira-login-submit:hover:not(:disabled) {
          background: #c8f542;
          transform: translateY(-1px);
        }
        .ravira-login-submit:disabled {
          background: #E2E8F0;
          border-color: #94A3B8;
          color: #475569;
          cursor: not-allowed;
        }
        .ravira-login-footer {
          text-align: center;
          font-size: 13.5px;
          color: #475569;
          margin: 0;
        }
        .ravira-login-input:focus-visible,
        .ravira-login-brand-btn:focus-visible,
        .ravira-login-back-btn:focus-visible,
        .ravira-portal-link-btn:focus-visible,
        .ravira-pw-toggle:focus-visible,
        .ravira-login-submit:focus-visible {
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
