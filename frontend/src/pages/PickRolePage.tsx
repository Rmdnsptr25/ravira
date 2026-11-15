import { useNavigate } from "react-router";
import { User, Building2, Landmark } from "lucide-react";
import { RaviraOwlIcon } from "../components/RaviraLogo";

const candidateFeatures = [
  "Rekomendasi pekerjaan AI",
  "Skill Gap Report",
  "Pelatihan personal",
  "Peluang lintas wilayah",
];

const secondaryRoles = [
  {
    id: "perusahaan",
    icon: Building2,
    title: "Perusahaan / Recruiter",
    desc: "Temukan kandidat terbaik lebih cepat dengan shortlist berbasis AI.",
    features: [
      "Shortlist kandidat AI",
      "Pipeline rekrutmen",
      "Dashboard analitik",
      "Integrasi ATS/HRIS",
    ],
    cta: "Daftarkan Perusahaan",
    path: "/daftar/perusahaan",
  },
  {
    id: "pemerintah",
    icon: Landmark,
    title: "Pemerintah / Institusi",
    desc: "Pantau tren tenaga kerja, kebutuhan skill, dan data workforce regional.",
    features: [
      "Workforce heatmap",
      "Tren skill & demand",
      "Proyeksi kompetensi",
      "Laporan kebijakan",
    ],
    cta: "Daftar untuk Analytics",
    path: "/daftar/pemerintah",
  },
];

export default function PickRolePage() {
  const navigate = useNavigate();

  return (
    <main className="ravira-pick-shell">
      <header className="ravira-pick-topbar">
        <button
          type="button"
          onClick={() => navigate("/")}
          className="ravira-pick-back-btn"
        >
          <RaviraOwlIcon size={20} />
          <span>Kembali ke Beranda</span>
        </button>
        <p className="ravira-pick-switch">
          Sudah punya akun?{" "}
          <button
            type="button"
            onClick={() => navigate("/masuk")}
            className="ravira-pick-link"
          >
            Masuk di sini
          </button>
        </p>
      </header>

      <section className="ravira-pick-intro">
        <h1 className="ravira-pick-title">Mulai Perjalanan Anda Bersama Ravira</h1>
        <p className="ravira-pick-sub">
          Pilih jenis akun yang sesuai agar Ravira dapat memberikan pengalaman terbaik.
        </p>
      </section>

      <section className="ravira-pick-layout" aria-label="Pilihan jenis akun pendaftaran">
        {/* Flagship Card: Kandidat */}
        <article className="ravira-pick-flagship">
          <div>
            <div className="ravira-pick-icon-box" aria-hidden="true">
              <User size={24} />
            </div>
            <h2 className="ravira-pick-flagship-title">Kandidat</h2>
            <p className="ravira-pick-flagship-desc">
              Cari pekerjaan, analisis skill gap, dan dapatkan rekomendasi pelatihan personal.
            </p>
            <ul className="ravira-pick-feature-list">
              {candidateFeatures.map((f) => (
                <li key={f} className="ravira-pick-feature-item">
                  <span className="ravira-pick-check" aria-hidden="true">
                    ✓
                  </span>
                  <span>{f}</span>
                </li>
              ))}
            </ul>
          </div>

          <button
            type="button"
            onClick={() => navigate("/daftar/kandidat")}
            className="ravira-pick-primary-cta"
          >
            Daftar sebagai Kandidat
          </button>
        </article>

        {/* Secondary Cards: Perusahaan & Pemerintah */}
        <div className="ravira-pick-secondary-col">
          {secondaryRoles.map((r, idx) => {
            const isDark = idx === 0;
            return (
              <article
                key={r.id}
                className={`ravira-pick-secondary-card ${
                  isDark ? "ravira-pick-card-dark" : "ravira-pick-card-neutral"
                }`}
              >
                <div>
                  <div className="ravira-pick-sec-header">
                    <span
                      className={`ravira-pick-icon-sm ${
                        isDark ? "ravira-pick-icon-sm-dark" : "ravira-pick-icon-sm-light"
                      }`}
                      aria-hidden="true"
                    >
                      <r.icon size={20} />
                    </span>
                    <div>
                      <h2
                        className={`ravira-pick-sec-title ${
                          isDark ? "ravira-text-white" : "ravira-text-dark"
                        }`}
                      >
                        {r.title}
                      </h2>
                      <p
                        className={`ravira-pick-sec-desc ${
                          isDark ? "ravira-text-muted-light" : "ravira-text-muted-dark"
                        }`}
                      >
                        {r.desc}
                      </p>
                    </div>
                  </div>

                  <ul className="ravira-pick-sec-features">
                    {r.features.map((f) => (
                      <li
                        key={f}
                        className={`ravira-pick-sec-chip ${
                          isDark ? "ravira-chip-dark" : "ravira-chip-light"
                        }`}
                      >
                        {f}
                      </li>
                    ))}
                  </ul>
                </div>

                <button
                  type="button"
                  onClick={() => navigate(r.path)}
                  className={`ravira-pick-sec-cta ${
                    isDark ? "ravira-cta-on-dark" : "ravira-cta-on-light"
                  }`}
                >
                  {r.cta}
                </button>
              </article>
            );
          })}
        </div>
      </section>

      <style>{`
        .ravira-pick-shell {
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
        .ravira-pick-topbar {
          display: flex;
          align-items: center;
          justify-content: space-between;
          flex-wrap: wrap;
          gap: 12px;
          margin-bottom: 32px;
          padding-bottom: 18px;
          border-bottom: 1px solid #E2E8F0;
        }
        .ravira-pick-back-btn {
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
        .ravira-pick-switch {
          font-size: 14px;
          color: #475569;
          margin: 0;
        }
        .ravira-pick-link {
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
        .ravira-pick-intro {
          margin-bottom: 28px;
        }
        .ravira-pick-title {
          font-family: 'Poppins', sans-serif;
          font-size: clamp(28px, 3.8vw, 40px);
          font-weight: 600;
          letter-spacing: -1px;
          color: #0D1117;
          margin: 0 0 6px;
        }
        .ravira-pick-sub {
          font-size: 15px;
          color: #475569;
          margin: 0;
        }
        .ravira-pick-layout {
          display: grid;
          grid-template-columns: 1.08fr 1fr;
          gap: 20px;
          align-items: stretch;
        }
        .ravira-pick-flagship {
          border-radius: 28px;
          background: linear-gradient(180deg, #0849A8 0%, #0E67CC 54%, #2B8CFF 100%);
          color: #FFFFFF;
          padding: 40px 36px;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          gap: 28px;
        }
        .ravira-pick-icon-box {
          width: 52px;
          height: 52px;
          border-radius: 14px;
          background: #FFFFFF;
          color: #0849A8;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 18px;
        }
        .ravira-pick-flagship-title {
          font-family: 'Poppins', sans-serif;
          font-size: clamp(24px, 2.8vw, 32px);
          font-weight: 600;
          letter-spacing: -0.8px;
          margin: 0 0 10px;
          color: #FFFFFF;
        }
        .ravira-pick-flagship-desc {
          font-size: 15px;
          line-height: 1.65;
          color: #FFFFFF;
          margin: 0 0 24px;
        }
        .ravira-pick-feature-list {
          list-style: none;
          padding: 0;
          margin: 0;
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 12px;
        }
        .ravira-pick-feature-item {
          display: flex;
          align-items: center;
          gap: 10px;
          background: rgba(13, 17, 23, 0.3);
          border-radius: 12px;
          padding: 12px 14px;
          font-size: 13.5px;
          font-weight: 500;
          color: #FFFFFF;
        }
        .ravira-pick-check {
          font-weight: 800;
          color: #D4FF59;
        }
        .ravira-pick-primary-cta {
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
        .ravira-pick-primary-cta:hover {
          background: #c8f542;
          transform: translateY(-1px);
        }
        .ravira-pick-secondary-col {
          display: flex;
          flex-direction: column;
          gap: 20px;
        }
        .ravira-pick-secondary-card {
          border-radius: 24px;
          padding: 28px;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          gap: 20px;
          flex: 1;
        }
        .ravira-pick-card-dark {
          background: #0D1117;
          color: #FFFFFF;
        }
        .ravira-pick-card-neutral {
          background: #F4F5F7;
          border: 1px solid #CBD5E1;
          color: #0D1117;
        }
        .ravira-pick-sec-header {
          display: flex;
          align-items: flex-start;
          gap: 14px;
          margin-bottom: 16px;
        }
        .ravira-pick-icon-sm {
          width: 44px;
          height: 44px;
          border-radius: 12px;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }
        .ravira-pick-icon-sm-dark {
          background: #1E293B;
          color: #D4FF59;
        }
        .ravira-pick-icon-sm-light {
          background: #0D1117;
          color: #FFFFFF;
        }
        .ravira-pick-sec-title {
          font-family: 'Poppins', sans-serif;
          font-size: 19px;
          font-weight: 600;
          letter-spacing: -0.4px;
          margin: 0 0 4px;
        }
        .ravira-pick-sec-desc {
          font-size: 14px;
          line-height: 1.55;
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
        .ravira-pick-sec-features {
          list-style: none;
          padding: 0;
          margin: 0;
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
        }
        .ravira-pick-sec-chip {
          font-size: 12.5px;
          font-weight: 600;
          padding: 6px 12px;
          border-radius: 8px;
        }
        .ravira-chip-dark {
          background: #1E293B;
          color: #F8FAFC;
        }
        .ravira-chip-light {
          background: #FFFFFF;
          border: 1px solid #CBD5E1;
          color: #0D1117;
        }
        .ravira-pick-sec-cta {
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
        .ravira-pick-sec-cta:hover {
          transform: translateY(-1px);
        }
        .ravira-pick-back-btn:focus-visible,
        .ravira-pick-link:focus-visible,
        .ravira-pick-primary-cta:focus-visible,
        .ravira-pick-sec-cta:focus-visible {
          outline: 3px solid #0849A8;
          outline-offset: 2px;
        }
        @media (max-width: 900px) {
          .ravira-pick-layout {
            grid-template-columns: 1fr;
          }
          .ravira-pick-flagship {
            padding: 28px 24px;
          }
        }
        @media (max-width: 600px) {
          .ravira-pick-shell {
            padding: 14px;
          }
          .ravira-pick-feature-list {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </main>
  );
}
