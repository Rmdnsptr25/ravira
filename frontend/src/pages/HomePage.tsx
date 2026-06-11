import { ArrowRight, CheckCircle2, LockKeyhole, Search } from 'lucide-react'
import { Link } from 'react-router-dom'
import {
  candidateFlow,
  candidateHeroStats,
  candidateHighlights,
  faqs,
  sampleJobs,
  timelineItems,
} from '../data/candidateLanding'

export function HomePage() {
  return (
    <div className="candidate-landing">
      <section className="landing-hero" id="top">
        <div className="landing-hero-bg" aria-hidden="true">
          <span className="skyline skyline-a" />
          <span className="skyline skyline-b" />
          <span className="skyline skyline-c" />
        </div>

        <div className="landing-container hero-content">
          <div className="hero-copy">
            <p className="landing-kicker">Candidate workspace</p>
            <h1>RAVIRA Candidate</h1>
            <p className="hero-subtitle">
              Temukan pekerjaan yang paling sesuai dengan skill, preferensi,
              dan tujuan kariermu melalui AI Match Score yang transparan.
            </p>
            <div className="hero-actions" aria-label="Aksi utama kandidat">
              <Link className="primary-button" to="/candidate/dashboard">
                <span>Mulai sebagai kandidat</span>
                <ArrowRight size={18} strokeWidth={2.5} />
              </Link>
              <a className="secondary-button" href="#how-it-works">
                <Search size={18} strokeWidth={2.4} />
                <span>Lihat cara kerja</span>
              </a>
            </div>
          </div>

          <div className="hero-product" aria-label="Preview dashboard kandidat RAVIRA">
            <CandidateProductMockup />
          </div>
        </div>

        <div className="landing-container hero-stat-strip" aria-label="Ringkasan manfaat">
          {candidateHeroStats.map((stat) => (
            <div className="hero-stat" key={stat.label}>
              <span>{stat.label}</span>
              <strong>{stat.value}</strong>
            </div>
          ))}
        </div>
      </section>

      <section className="landing-section compact-section" id="how-it-works">
        <div className="landing-container section-grid">
          <div className="section-copy">
            <p className="landing-kicker">Candidate onboarding</p>
            <h2>Apply for a job smarter and faster</h2>
            <p>
              RAVIRA memandu kandidat dari upload CV, validasi skill, sampai
              rekomendasi pekerjaan yang punya alasan jelas.
            </p>
          </div>

          <div className="flow-grid">
            {candidateFlow.map((item) => {
              const Icon = item.icon

              return (
                <article className="flow-card" key={item.title}>
                  <span className="feature-icon">
                    <Icon size={20} strokeWidth={2.4} />
                  </span>
                  <h3>{item.title}</h3>
                  <p>{item.detail}</p>
                </article>
              )
            })}
          </div>
        </div>
      </section>

      <section className="landing-section visual-band">
        <div className="landing-container visual-split">
          <div className="wide-product-shot">
            <CandidateJobFeedMockup />
          </div>
          <div className="section-copy">
            <p className="landing-kicker">AI job matching</p>
            <h2>Match score dengan alasan yang bisa dipahami</h2>
            <p>
              Kandidat melihat skor kecocokan dan faktor utama rekomendasi.
              Ranking internal recruiter tetap terlindungi.
            </p>
            <ul className="check-list">
              <li>
                <CheckCircle2 size={18} strokeWidth={2.4} />
                Minimal 3 alasan rekomendasi.
              </li>
              <li>
                <CheckCircle2 size={18} strokeWidth={2.4} />
                Feedback kandidat memperbaiki job feed berikutnya.
              </li>
              <li>
                <LockKeyhole size={18} strokeWidth={2.4} />
                Candidate Score internal tidak ditampilkan ke kandidat.
              </li>
            </ul>
          </div>
        </div>
      </section>

      <section className="landing-section">
        <div className="landing-container centered-section">
          <p className="landing-kicker">Personalized growth</p>
          <h2>Optimize your skill value</h2>
          <p>
            Skill Gap Advisor membantu kandidat memahami skill prioritas dan
            rekomendasi training yang relevan dengan target role.
          </p>
          <div className="growth-panel">
            <div className="skill-card">
              <span>Skill Gap</span>
              <strong>SQL window function</strong>
              <div className="progress-line">
                <span style={{ width: '68%' }} />
              </div>
              <p>Prioritas medium untuk Data Analyst.</p>
            </div>
            <div className="skill-card highlighted-skill">
              <span>Training Recommendation</span>
              <strong>3 course cocok</strong>
              <p>Micro-learning 15-30 menit dari katalog mitra.</p>
            </div>
            <div className="skill-card">
              <span>Career Roadmap</span>
              <strong>Dashboard storytelling</strong>
              <div className="progress-line">
                <span style={{ width: '48%' }} />
              </div>
              <p>Skill prioritas untuk presentasi insight.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="landing-section pale-section">
        <div className="landing-container centered-section">
          <p className="landing-kicker">Candidate transparency</p>
          <h2>Menanti pekerjaan sekarang tidak terasa gelap</h2>
          <p>
            Status lamaran ditampilkan dengan bahasa yang aman, tanpa membuka
            data sensitif perusahaan atau kandidat lain.
          </p>
          <div className="timeline-panel">
            {timelineItems.map((item, index) => (
              <article className="timeline-card" key={item.status}>
                <span>{String(index + 1).padStart(2, '0')}</span>
                <strong>{item.status}</strong>
                <p>{item.detail}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="landing-section">
        <div className="landing-container">
          <div className="section-copy narrow-copy">
            <p className="landing-kicker">MVP candidate features</p>
            <h2>Dibangun dari kebutuhan kandidat di PRD</h2>
          </div>

          <div className="feature-grid">
            {candidateHighlights.map((feature) => {
              const Icon = feature.icon

              return (
                <article className="feature-card" key={feature.title}>
                  <span className="feature-icon">
                    <Icon size={20} strokeWidth={2.4} />
                  </span>
                  <h3>{feature.title}</h3>
                  <p>{feature.detail}</p>
                </article>
              )
            })}
          </div>
        </div>
      </section>

      <section className="landing-section visual-band">
        <div className="landing-container centered-section">
          <p className="landing-kicker">Application tracker</p>
          <h2>Semua proses punya jejak yang jelas</h2>
          <p>
            Kandidat bisa melihat status aman, permintaan verifikasi, dan
            koreksi data bila parsing CV belum sesuai.
          </p>
          <div className="tracker-preview">
            <div className="tracker-score">
              <span>AI Match Score</span>
              <strong>87</strong>
              <small>3 alasan utama</small>
            </div>
            <div className="tracker-list">
              {timelineItems.slice(0, 3).map((item) => (
                <div className="tracker-row" key={item.status}>
                  <CheckCircle2 size={18} strokeWidth={2.4} />
                  <div>
                    <strong>{item.status}</strong>
                    <span>{item.detail}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="landing-section">
        <div className="landing-container faq-layout">
          <div className="section-copy">
            <p className="landing-kicker">FAQ kandidat</p>
            <h2>Yang sering ditanyakan sebelum mulai</h2>
          </div>
          <div className="faq-list">
            {faqs.map((faq) => (
              <details className="faq-item" key={faq.question}>
                <summary>{faq.question}</summary>
                <p>{faq.answer}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      <section className="landing-cta">
        <div className="landing-container cta-panel">
          <div>
            <p className="landing-kicker">Mulai dari kandidat</p>
            <h2>Bangun profil, lihat match, dan pantau lamaranmu.</h2>
          </div>
          <Link className="primary-button inverse-button" to="/candidate/dashboard">
            <span>Buka dashboard kandidat</span>
            <ArrowRight size={18} strokeWidth={2.5} />
          </Link>
        </div>
      </section>
    </div>
  )
}

function CandidateProductMockup() {
  return (
    <div className="candidate-mockup">
      <div className="mockup-topbar">
        <span />
        <span />
        <span />
      </div>
      <div className="mockup-grid">
        <aside className="mockup-sidebar">
          <strong>RAVIRA</strong>
          <span className="active-line" />
          <span />
          <span />
          <span />
        </aside>
        <div className="mockup-main">
          <div className="mockup-search">
            <Search size={16} strokeWidth={2.4} />
            <span>Data analyst remote</span>
          </div>
          {sampleJobs.slice(0, 2).map((job) => (
            <article className="mockup-job" key={job.title}>
              <div>
                <strong>{job.title}</strong>
                <span>{job.company}</span>
              </div>
              <div className="mini-score">{job.score}</div>
            </article>
          ))}
          <div className="mockup-note">
            <strong>Skill gap</strong>
            <span>Dashboard storytelling</span>
            <div className="progress-line">
              <span style={{ width: '58%' }} />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function CandidateJobFeedMockup() {
  return (
    <div className="feed-mockup">
      <div className="feed-header">
        <span>Recommended jobs</span>
        <strong>Fast shortlist view</strong>
      </div>
      <div className="feed-list">
        {sampleJobs.map((job) => (
          <article className="feed-card" key={job.title}>
            <div>
              <h3>{job.title}</h3>
              <p>
                {job.company} - {job.location}
              </p>
              <ul>
                {job.reasons.map((reason) => (
                  <li key={reason}>{reason}</li>
                ))}
              </ul>
            </div>
            <div className="feed-score">
              <strong>{job.score}</strong>
              <span>Match</span>
            </div>
          </article>
        ))}
      </div>
    </div>
  )
}
