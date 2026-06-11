export type StatusTone = 'success' | 'warning' | 'neutral' | 'danger'

type StatusPillProps = {
  children: string
  tone?: StatusTone
}

export function StatusPill({ children, tone = 'neutral' }: StatusPillProps) {
  return <span className={`status-pill status-${tone}`}>{children}</span>
}
