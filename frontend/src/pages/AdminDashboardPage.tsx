import { PageHeader } from '../components/PageHeader'
import { StatCard } from '../components/StatCard'
import { StatusPill, type StatusTone } from '../components/StatusPill'
import { adminDashboard } from '../data/dummy'

function getReviewTone(status: string): StatusTone {
  if (status === 'Pending' || status === 'Needs admin review') {
    return 'warning'
  }

  return 'neutral'
}

export function AdminDashboardPage() {
  return (
    <div className="page-stack">
      <PageHeader
        eyebrow="Admin"
        title="Dashboard admin"
        description="Pantau company verification, job moderation, manual review, dan audit log tanpa membuka data sensitif."
      />

      <section className="stats-grid" aria-label="Ringkasan admin">
        {adminDashboard.stats.map((stat) => (
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
            <p className="eyebrow">Operations</p>
            <h2>Review queue</h2>
          </div>

          <div className="compact-list">
            {adminDashboard.reviewQueue.map((item) => (
              <article className="compact-item" key={`${item.type}-${item.item}`}>
                <div>
                  <strong>{item.type}</strong>
                  <span>{item.item}</span>
                </div>
                <StatusPill tone={getReviewTone(item.status)}>
                  {item.status}
                </StatusPill>
              </article>
            ))}
          </div>
        </div>

        <div className="workspace-section">
          <div className="section-heading">
            <p className="eyebrow">Audit</p>
            <h2>Aktivitas sensitif</h2>
          </div>

          <div className="compact-list">
            {adminDashboard.auditLog.map((event) => (
              <article
                className="compact-item audit-item"
                key={`${event.actor}-${event.action}-${event.entity}`}
              >
                <div>
                  <strong>{event.action}</strong>
                  <span>
                    {event.actor} - {event.entity}
                  </span>
                </div>
                <p>{event.reason}</p>
              </article>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
