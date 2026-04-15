export function StatusPill({ status }) {
  const tone = {
    Approved: 'green',
    Pending: 'amber',
    Rejected: 'red',
    Completed: 'blue',
  }[status] ?? 'slate'

  return <span className={`status-pill status-pill--${tone}`}>{status}</span>
}