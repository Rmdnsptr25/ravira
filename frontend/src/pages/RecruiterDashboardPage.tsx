import { PageHeader } from '../components/PageHeader'
import { StatCard } from '../components/StatCard'
import { StatusPill, type StatusTone } from '../components/StatusPill'
import { recruiterDashboard } from '../data/dummy'

function getRiskTone(risk: string): StatusTone {
  if (risk === 'Medium') {
    return 'warning'
  }

  if (risk === 'High') {
    return 'danger'
  }

  return 'success'
}

export function RecruiterDashboardPage() {
  return (
    <div className="page-stack">
      <PageHeader
        eyebrow="Recruiter"
        title="Dashboard recruiter"
        description="Kelola shortlist, Candidate Score, stage selection, dan pipeline kandidat sesuai consent."
      />

      <section className="stats-grid" aria-label="Ringkasan recruiter">
        {recruiterDashboard.stats.map((stat) => (
          <StatCard
            detail={stat.detail}
            key={stat.label}
            label={stat.label}
            tone={stat.tone}
            value={stat.value}
          />
        ))}
      </section>

      <section className="workspace-section">
        <div className="section-heading">
          <p className="eyebrow">Shortlist</p>
          <h2>Kandidat prioritas</h2>
        </div>

        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Kandidat</th>
                <th>Posisi</th>
                <th>Match</th>
                <th>Candidate</th>
                <th>Stage</th>
                <th>Risk</th>
                <th>Alasan utama</th>
              </tr>
            </thead>
            <tbody>
              {recruiterDashboard.shortlist.map((candidate) => (
                <tr key={candidate.name}>
                  <td>{candidate.name}</td>
                  <td>{candidate.role}</td>
                  <td>{candidate.matchScore}</td>
                  <td>{candidate.candidateScore}</td>
                  <td>{candidate.stage}</td>
                  <td>
                    <StatusPill tone={getRiskTone(candidate.risk)}>
                      {candidate.risk}
                    </StatusPill>
                  </td>
                  <td>{candidate.explanation}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="workspace-section">
        <div className="section-heading">
          <p className="eyebrow">Pipeline</p>
          <h2>Status seleksi</h2>
        </div>

        <div className="pipeline-grid">
          {recruiterDashboard.pipeline.map((stage) => (
            <article className="pipeline-column" key={stage.stage}>
              <span>{stage.stage}</span>
              <strong>{stage.count}</strong>
            </article>
          ))}
        </div>
      </section>
    </div>
  )
}
