import { PageHeader } from '../components/PageHeader'
import { StatCard } from '../components/StatCard'
import { StatusPill, type StatusTone } from '../components/StatusPill'
import { candidateDashboard } from '../data/dummy'

function getApplicationTone(status: string): StatusTone {
  if (status === 'Need Verification') {
    return 'warning'
  }

  if (status === 'Screening') {
    return 'success'
  }

  return 'neutral'
}

export function CandidateDashboardPage() {
  return (
    <div className="page-stack">
      <PageHeader
        eyebrow="Candidate"
        title="Dashboard kandidat"
        description="Pantau rekomendasi pekerjaan, alasan match, skill gap, dan status lamaran yang aman ditampilkan."
      />

      <section className="stats-grid" aria-label="Ringkasan kandidat">
        {candidateDashboard.stats.map((stat) => (
          <StatCard
            detail={stat.detail}
            key={stat.label}
            label={stat.label}
            tone={stat.tone}
            value={stat.value}
          />
        ))}
      </section>

      <section className="content-grid two-columns">
        <div className="workspace-section">
          <div className="section-heading">
            <p className="eyebrow">Job feed</p>
            <h2>Rekomendasi pekerjaan</h2>
          </div>

          <div className="item-list">
            {candidateDashboard.recommendedJobs.map((job) => (
              <article className="job-item" key={job.title}>
                <div>
                  <h3>{job.title}</h3>
                  <p>{job.company}</p>
                  <span>{job.location}</span>
                </div>
                <div className="score-box">
                  <strong>{job.matchScore}</strong>
                  <span>Match Score</span>
                </div>
                <ul className="reason-list">
                  {job.reasons.map((reason) => (
                    <li key={reason}>{reason}</li>
                  ))}
                </ul>
              </article>
            ))}
          </div>
        </div>

        <div className="workspace-section">
          <div className="section-heading">
            <p className="eyebrow">Application tracker</p>
            <h2>Status lamaran</h2>
          </div>

          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>Posisi</th>
                  <th>Status</th>
                  <th>Update</th>
                </tr>
              </thead>
              <tbody>
                {candidateDashboard.applications.map((application) => (
                  <tr key={application.role}>
                    <td>{application.role}</td>
                    <td>
                      <StatusPill tone={getApplicationTone(application.status)}>
                        {application.status}
                      </StatusPill>
                    </td>
                    <td>{application.updatedAt}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      <section className="workspace-section">
        <div className="section-heading">
          <p className="eyebrow">Skill gap advisor</p>
          <h2>Prioritas pengembangan</h2>
        </div>
        <div className="compact-list">
          {candidateDashboard.skillGaps.map((gap) => (
            <article className="compact-item" key={gap.skill}>
              <strong>{gap.skill}</strong>
              <StatusPill tone={gap.priority === 'High' ? 'warning' : 'neutral'}>
                {gap.priority}
              </StatusPill>
            </article>
          ))}
        </div>
      </section>
    </div>
  )
}
