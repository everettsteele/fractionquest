// PhaseNav — shows Learn → Practice → Check breadcrumb
export default function PhaseNav({ sessionNumber, currentPhase, totalSessions = 5 }) {
  const phases = [
    { id: 'learn', label: 'Learn', icon: '📖' },
    { id: 'practice', label: 'Practice', icon: '✏️' },
    { id: sessionNumber >= 3 ? 'check' : 'review', label: sessionNumber >= 3 ? 'Check' : 'Review', icon: sessionNumber >= 3 ? '⭐' : '💡' },
  ]

  function phaseStatus(phaseId) {
    const order = ['learn', 'practice', 'check', 'review', 'done']
    const currentIdx = order.indexOf(currentPhase)
    const phaseIdx = order.indexOf(phaseId)
    if (currentPhase === 'done') return 'done'
    if (phaseIdx < currentIdx) return 'done'
    if (phaseIdx === currentIdx) return 'active'
    return 'upcoming'
  }

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '6px',
        padding: '8px 16px',
        background: 'var(--color-surface)',
        borderRadius: '100px',
        border: '1.5px solid var(--color-border)',
        fontSize: '0.82rem',
        fontFamily: 'var(--font-display)',
        fontWeight: '700',
      }}
    >
      <span style={{ color: 'var(--color-text-3)', marginRight: '4px', fontSize: '0.78rem' }}>
        Session {sessionNumber}/{totalSessions}
      </span>
      {phases.map((phase, i) => {
        const status = phaseStatus(phase.id)
        return (
          <span key={phase.id} style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
            {i > 0 && (
              <span style={{ color: 'var(--color-border)', fontSize: '1rem', margin: '0 1px' }}>
                →
              </span>
            )}
            <span
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '4px',
                padding: '4px 10px',
                borderRadius: '100px',
                color: status === 'done'
                  ? 'var(--color-success)'
                  : status === 'active'
                    ? 'var(--color-primary)'
                    : 'var(--color-text-3)',
                background: status === 'active' ? 'var(--color-primary-light)' : 'transparent',
              }}
            >
              {status === 'done' ? '✓' : phase.icon}
              {phase.label}
            </span>
          </span>
        )
      })}
    </div>
  )
}
