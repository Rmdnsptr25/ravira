export type StatTone = 'teal' | 'amber' | 'ink'

type StatCardProps = {
  label: string
  value: string
  detail: string
  tone?: StatTone
}

export function StatCard({
  label,
  value,
  detail,
  tone = 'ink',
}: StatCardProps) {
  return (
    <article className={`stat-card tone-${tone}`}>
      <p>{label}</p>
      <strong>{value}</strong>
      <span>{detail}</span>
    </article>
  )
}
