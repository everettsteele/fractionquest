// SessionMap — shows the 5-session journey, progress, and "Continue" CTA
const SESSION_META = [
  {
    number: 1,
    title: 'Where Do Fractions Live?',
    preview: 'Place fractions on a number line. Discover the bigger-denominator secret.',
    icon: '📏',
  },
  {
    number: 2,
    title: 'The Benchmark Test',
    preview: 'Use ½ as your compass. Compare fractions without any math!',
    icon: '🧭',
  },
  {
    number: 3,
    title: 'Speaking the Same Language',
    preview: 'Find common denominators so fractions can finally talk to each other.',
    icon: '🗣️',
  },
  {
    number: 4,
    title: 'The Numerator Shortcut',
    preview: 'Discover a clever trick and learn to pick the right tool every time.',
    icon: '⚡',
  },
  {
    number: 5,
    title: 'Show What You Know',
    preview: 'Your final challenge. Prove you\'ve mastered fraction comparison!',
    icon: '🏆',
  },
]

export default function SessionMap({ student, onContinue, onGoToSession }) {
  const { sessionHistory, currentSession, masteryStatus } = student

  function getSessionStatus(n) {
    const session = sessionHistory.find(s => s.sessionNumber === n)
    if (!session) return 'locked'
    if (session.completedAt) return 'done'
    if (n === currentSession) return 'active'
    if (n < currentSession) return 'done'
    return 'locked'
  }

  function getScore(n) {
    const session = sessionHistory.find(s => s.sessionNumber === n)
    return session?.masteryCheckScore
  }

  const activeSession = SESSION_META.find(s => s.number === currentSession)

  return (
    <div style={{ minHeight: '100vh', background: 'var(--color-bg)' }}>
      {/* Header */}
      <div
        style={{
          background: 'white',
          borderBottom: '1.5px solid var(--color-border)',
          padding: '20px 24px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '12px',
        }}
      >
        <div>
          <p style={{ color: 'var(--color-text-3)', fontSize: '0.85rem', fontFamily: 'var(--font-display)', fontWeight: '700' }}>
            Welcome back,
          </p>
          <h2 style={{ color: 'var(--color-primary)', margin: 0 }}>{student.studentName}!</h2>
        </div>
        {masteryStatus === 'achieved' && (
          <div className="mastery-badge badge-achieved">
            ⭐ Mastery Achieved!
          </div>
        )}
        {masteryStatus === 'in_progress' && (
          <div className="mastery-badge badge-in-progress">
            Working toward mastery...
          </div>
        )}
      </div>

      <div className="container" style={{ paddingTop: '36px', paddingBottom: '60px' }}>

        {/* Continue button */}
        {masteryStatus !== 'achieved' && (
          <div
            style={{
              background: 'white',
              borderRadius: 'var(--radius-xl)',
              border: '2px solid var(--color-border)',
              padding: '28px 32px',
              marginBottom: '36px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: '20px',
              flexWrap: 'wrap',
              boxShadow: 'var(--shadow-md)',
            }}
          >
            <div>
              <p style={{ color: 'var(--color-text-3)', fontSize: '0.85rem', fontFamily: 'var(--font-display)', fontWeight: '700', marginBottom: '6px' }}>
                UP NEXT
              </p>
              <h3 style={{ margin: 0, marginBottom: '4px' }}>
                {activeSession?.icon} {activeSession?.title}
              </h3>
              <p style={{ color: 'var(--color-text-2)', fontSize: '0.95rem' }}>
                {activeSession?.preview}
              </p>
            </div>
            <button
              className="btn btn-primary btn-large"
              onClick={onContinue}
              style={{ flexShrink: 0, minWidth: '160px' }}
            >
              Continue →
            </button>
          </div>
        )}

        {/* Session cards */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          {SESSION_META.map(session => {
            const status = getSessionStatus(session.number)
            const score = getScore(session.number)
            const isCheck = session.number >= 3

            return (
              <div
                key={session.number}
                onClick={() => status !== 'locked' && onGoToSession(session.number)}
                style={{
                  background: status === 'active'
                    ? 'linear-gradient(135deg, #EEF2FF, #F5F3FF)'
                    : 'white',
                  borderRadius: 'var(--radius-lg)',
                  border: status === 'active'
                    ? '2.5px solid var(--color-primary)'
                    : '1.5px solid var(--color-border)',
                  padding: '20px 24px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '20px',
                  cursor: status === 'locked' ? 'not-allowed' : 'pointer',
                  opacity: status === 'locked' ? 0.5 : 1,
                  transition: 'transform 0.15s ease, box-shadow 0.15s ease',
                  boxShadow: status === 'active' ? 'var(--shadow-md)' : 'none',
                }}
                onMouseEnter={e => {
                  if (status !== 'locked') {
                    e.currentTarget.style.transform = 'translateY(-2px)'
                    e.currentTarget.style.boxShadow = 'var(--shadow-md)'
                  }
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.transform = ''
                  e.currentTarget.style.boxShadow = status === 'active' ? 'var(--shadow-md)' : 'none'
                }}
                role={status !== 'locked' ? 'button' : undefined}
                tabIndex={status !== 'locked' ? 0 : undefined}
                aria-label={`Session ${session.number}: ${session.title}`}
                onKeyDown={e => e.key === 'Enter' && status !== 'locked' && onGoToSession(session.number)}
              >
                {/* Session number dot */}
                <div
                  style={{
                    width: 52,
                    height: 52,
                    borderRadius: '50%',
                    background: status === 'done'
                      ? 'var(--color-primary)'
                      : status === 'active'
                        ? 'white'
                        : 'var(--color-surface-2)',
                    border: status === 'done'
                      ? '2px solid var(--color-primary)'
                      : status === 'active'
                        ? '3px solid var(--color-primary)'
                        : '2px solid var(--color-border)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: status === 'done' ? '1.2rem' : '1.1rem',
                    color: status === 'done'
                      ? 'white'
                      : status === 'active'
                        ? 'var(--color-primary)'
                        : 'var(--color-text-3)',
                    fontFamily: 'var(--font-display)',
                    fontWeight: '900',
                    flexShrink: 0,
                  }}
                >
                  {status === 'done' ? '✓' : session.number}
                </div>

                {/* Content */}
                <div style={{ flex: 1 }}>
                  <div style={{
                    fontFamily: 'var(--font-display)',
                    fontWeight: '800',
                    fontSize: '1rem',
                    color: status === 'locked' ? 'var(--color-text-3)' : 'var(--color-text-1)',
                    marginBottom: '3px',
                  }}>
                    {session.icon} {session.title}
                  </div>
                  <div style={{ fontSize: '0.9rem', color: 'var(--color-text-2)' }}>
                    {session.preview}
                  </div>
                </div>

                {/* Score pill (sessions 3-5) */}
                {isCheck && score !== null && score !== undefined && (
                  <div
                    className={`score-circle ${score >= 9 ? 'score-pass' : score >= 7 ? 'score-near' : 'score-low'}`}
                    style={{ width: 52, height: 52, fontSize: '1.1rem', flexShrink: 0 }}
                  >
                    {score}/10
                  </div>
                )}

                {status === 'locked' && (
                  <span style={{ color: 'var(--color-text-3)', fontSize: '1.2rem' }}>🔒</span>
                )}
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
