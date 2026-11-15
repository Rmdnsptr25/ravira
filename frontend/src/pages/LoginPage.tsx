import { useNavigate } from "react-router";
import { User, Building2, Landmark, ArrowLeft } from "lucide-react";
import { RaviraOwlIcon } from "../components/RaviraLogo";

const secondaryRoles = [
  {
    id: "perusahaan",
    icon: Building2,
    title: "Masuk sebagai Perusahaan",
    desc: "Kelola lowongan, pelamar, shortlist kandidat, dan pipeline rekrutmen.",
    btnLabel: "Masuk Perusahaan",
    path: "/masuk/perusahaan",
  },
  {
    id: "pemerintah",
    icon: Landmark,
    title: "Masuk sebagai Pemerintah / Institusi",
    desc: "Akses workforce analytics, tren skill, heatmap wilayah, dan laporan agregat.",
    btnLabel: "Masuk Pemerintah",
    path: "/masuk/pemerintah",
  },
];

export default function LoginPage() {
  const navigate = useNavigate();

  return (
    <main className="ravira-role-shell">
      <header className="ravira-role-topbar">
        <button
          type="button"
          onClick={() => navigate("/")}
          className="ravira-role-back-btn"
        >
          <ArrowLeft size={16} aria-hidden="true" />
          <span>Kembali ke Beranda</span>
        </button>
        <button
          type="button"
          onClick={() => navigate("/")}
          className="ravira-role-brand-btn"
        >
          <RaviraOwlIcon size={24} />
          <span>Ravira</span>
        </button>
        <p className="ravira-role-switch">
          Belum punya akun?{" "}
          <button
            type="button"
            onClick={() => navigate("/daftar")}
            className="ravira-role-link"
          >
            Daftar sekarang
          </button>
        </p>
      </header>

      <section className="ravira-role-intro">
        <h1 className="ravira-role-title">Masuk ke Ravira</h1>
        <p className="ravira-role-sub">Pilih role Anda untuk melanjutkan</p>
      </section>

      <section className="ravira-role-layout" aria-label="Pilihan role masuk">
        {/* Flagship Primary Card: Kandidat */}
        <article className="ravira-role-flagship">
          <div className="ravira-role-flagship-top">
            <span className="ravira-role-icon-box" aria-hidden="true">
              <User size={24} />
            </span>
            <h2 className="ravira-role-flagship-title">Masuk sebagai Kandidat</h2>
            <p className="ravira-role-flagship-desc">
              Akses rekomendasi pekerjaan, skill gap, pelatihan, dan status lamaran Anda.
            </p>
          </div>
          <button
            type="button"
            onClick={() => navigate("/masuk/kandidat")}
            className="ravira-role-primary-cta"
          >
            Masuk Kandidat
          </button>
        </article>

        {/* Secondary Stacked Cards: Perusahaan & Pemerintah */}
        <div className="ravira-role-secondary-stack">
          {secondaryRoles.map((card, idx) => {
            const Icon = card.icon;
            const isDark = idx === 0;
            return (
              <article
                key={card.id}
                className={`ravira-role-secondary-card ${
                  isDark ? "ravira-role-card-dark" : "ravira-role-card-neutral"
                }`}
              >
                <div className="ravira-role-secondary-body">
                  <span
                    className={`ravira-role-icon-sm ${
                      isDark ? "ravira-role-icon-sm-dark" : "ravira-role-icon-sm-light"
                    }`}
                    aria-hidden="true"
                  >
                    <Icon size={20} />
                  </span>
                  <div>
                    <h2
                      className={`ravira-role-secondary-title ${
                        isDark ? "ravira-text-white" : "ravira-text-dark"
                      }`}
                    >
                      {card.title}
                    </h2>
                    <p
                      className={`ravira-role-secondary-desc ${
                        isDark ? "ravira-text-muted-light" : "ravira-text-muted-dark"
                      }`}
                    >
                      {card.desc}
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => navigate(card.path)}
                  className={`ravira-role-secondary-cta ${
                    isDark ? "ravira-cta-on-dark" : "ravira-cta-on-light"
                  }`}
                >
                  {card.btnLabel}
                </button>
              </article>
            );
          })}
        </div>
      </section>

      <style>{`
        .ravira-role-shell {
          min-height: 100dvh;
          background: #FFFFFF;
          padding: 24px;
          box-sizing: border-box;
          font-family: 'Inter', sans-serif;
          max-width: 1240px;
          margin: 0 auto;
          display: flex;
          flex-direction: column;
          justify-content: center;
        }
        .ravira-role-topbar {
          display: flex;
          align-items: center;
          justify-content: space-between;
          flex-wrap: wrap;
          gap: 12px;
          margin-bottom: 32px;
          padding-bottom: 18px;
          border-bottom: 1px solid #E2E8F0;
        }
        .ravira-role-back-btn {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          min-height: 44px;
          padding: 0 16px;
          border-radius: 10px;
          border: 1px solid #CBD5E1;
          background: #F8FAFC;
          color: #0D1117;
          font-family: 'Inter', sans-serif;
          font-size: 13px;
          font-weight: 600;
          cursor: pointer;
        }
        .ravira-role-brand-btn {
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
        .ravira-role-switch {
          font-size: 14px;
          color: #475569;
          margin: 0;
        }
        .ravira-role-link {
          background: none;
          border: none;
          padding: 6px 4px;
          min-height: 44px;
          color: #0849A8;
          font-weight: 700;
          font-size: 14px;
          cursor: pointer;
          text-decoration: underline;
          text-underline-offset: 3px;
        }
        .ravira-role-intro {
          margin-bottom: 28px;
        }
        .ravira-role-title {
          font-family: 'Poppins', sans-serif;
          font-size: clamp(28px, 3.8vw, 40px);
          font-weight: 600;
          letter-spacing: -1px;
          color: #0D1117;
          margin: 0 0 6px;
        }
        .ravira-role-sub {
          font-size: 15px;
          color: #475569;
          margin: 0;
        }
        .ravira-role-layout {
          display: grid;
          grid-template-columns: 1.15fr 1fr;
          gap: 20px;
          align-items: stretch;
        }
        .ravira-role-flagship {
          border-radius: 28px;
          background: linear-gradient(180deg, #0849A8 0%, #0E67CC 54%, #2B8CFF 100%);
          color: #FFFFFF;
          padding: 40px 36px;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          gap: 32px;
        }
        .ravira-role-flagship-top {
          display: flex;
          flex-direction: column;
          gap: 16px;
        }
        .ravira-role-icon-box {
          width: 52px;
          height: 52px;
          border-radius: 14px;
          background: #FFFFFF;
          color: #0849A8;
          display: inline-flex;
          align-items: center;
          justify-content: center;
        }
        .ravira-role-flagship-title {
          font-family: 'Poppins', sans-serif;
          font-size: clamp(24px, 2.8vw, 32px);
          font-weight: 600;
          letter-spacing: -0.8px;
          line-height: 1.18;
          margin: 0;
          color: #FFFFFF;
        }
        .ravira-role-flagship-desc {
          font-size: 15px;
          line-height: 1.65;
          color: #FFFFFF;
          margin: 0;
          max-width: 440px;
        }
        .ravira-role-primary-cta {
          width: 100%;
          min-height: 50px;
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
        .ravira-role-primary-cta:hover {
          background: #c8f542;
          transform: translateY(-1px);
        }
        .ravira-role-secondary-stack {
          display: flex;
          flex-direction: column;
          gap: 20px;
        }
        .ravira-role-secondary-card {
          border-radius: 24px;
          padding: 28px;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          gap: 20px;
          flex: 1;
        }
        .ravira-role-card-dark {
          background: #0D1117;
          color: #FFFFFF;
        }
        .ravira-role-card-neutral {
          background: #F4F5F7;
          border: 1px solid #CBD5E1;
          color: #0D1117;
        }
        .ravira-role-secondary-body {
          display: flex;
          align-items: flex-start;
          gap: 16px;
        }
        .ravira-role-icon-sm {
          width: 44px;
          height: 44px;
          border-radius: 12px;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }
        .ravira-role-icon-sm-dark {
          background: #1E293B;
          color: #D4FF59;
        }
        .ravira-role-icon-sm-light {
          background: #0D1117;
          color: #FFFFFF;
        }
        .ravira-role-secondary-title {
          font-family: 'Poppins', sans-serif;
          font-size: 19px;
          font-weight: 600;
          letter-spacing: -0.4px;
          margin: 0 0 6px;
        }
        .ravira-role-secondary-desc {
          font-size: 14px;
          line-height: 1.6;
          margin: 0;
        }
        .ravira-text-white {
          color: #FFFFFF;
        }
        .ravira-text-dark {
          color: #0D1117;
        }
        .ravira-text-muted-light {
          color: #D1D5DB;
        }
        .ravira-text-muted-dark {
          color: #334155;
        }
        .ravira-role-secondary-cta {
          width: 100%;
          min-height: 46px;
          padding: 10px 20px;
          border-radius: 12px;
          font-family: 'Poppins', sans-serif;
          font-size: 14px;
          font-weight: 600;
          cursor: pointer;
          transition: transform 0.15s ease;
        }
        .ravira-cta-on-dark {
          background: #FFFFFF;
          color: #0D1117;
          border: none;
        }
        .ravira-cta-on-light {
          background: #0D1117;
          color: #FFFFFF;
          border: none;
        }
        .ravira-role-secondary-cta:hover {
          transform: translateY(-1px);
        }
        .ravira-role-back-btn:focus-visible,
        .ravira-role-brand-btn:focus-visible,
        .ravira-role-link:focus-visible,
        .ravira-role-primary-cta:focus-visible,
        .ravira-role-secondary-cta:focus-visible {
          outline: 3px solid #0849A8;
          outline-offset: 2px;
        }
        @media (max-width: 900px) {
          .ravira-role-layout {
            grid-template-columns: 1fr;
          }
          .ravira-role-flagship {
            padding: 28px 24px;
          }
        }
        @media (max-width: 600px) {
          .ravira-role-shell {
            padding: 14px;
          }
          .ravira-role-secondary-body {
            flex-direction: column;
          }
        }
      `}</style>
    </main>
  );
}
