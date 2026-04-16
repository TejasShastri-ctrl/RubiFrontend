export function StatusPill({ status }) {
  // Defensive extraction: handle string, nested state, or object-fallback
  const rawStatus = typeof status === 'object' ? status?.state : status;
  const s = (rawStatus || 'pending').toString().toLowerCase();
  
  const tone = {
    approved: 'green',
    pending: 'amber',
    rejected: 'red',
    completed: 'blue',
    under_review: 'purple',
    locked: 'slate'
  }[s] ?? 'slate'

  const label = s.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase());

  return <span className={`status-pill status-pill--${tone}`}>{label}</span>
}