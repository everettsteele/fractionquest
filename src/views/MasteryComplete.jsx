export default function MasteryComplete({ student, onBack }) {
  const checkSessions = student.sessionHistory.filter(s => [3, 4, 5].includes(s.sessionNumber))
  const allScores = checkSessions.map(s => s.masteryCheckScore)

  return (
    <div
      style={{
        minHeight: '100vh',
        background: 'linear-gradient(160deg, #EEF2FF 0%, #F0EFFE 50%, #ECFDF5 100%)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '40px 24px',
        textAlign: 'center',
      }}
      className="animate-fade-in"
    >
      {/* Trophy */}
      <div
        style={{
          fontSize: '5rem',
          marginBottom: '8px',
        }}
        className="animate-bounce"
        aria-hidden="true"
      >
        🏆
      </div>

      <div style={{ marginBottom: '8px', display: 'flex', gap: '8px', justifyContent: 'center' }}>
        {['⭐', '⭐', '⭐'].map((s, i) => (
          <span
            key={i}
            className="star animate-pop-in"
            style={{ animationDelay: `${i * 0.15}s`, animationFillMode: 'both' }}
          >
            {s}
          </span>
        ))}
      </div>

      <h1
        style={{
          color: 'var(--color-primary)',
          fontSize: '3rem',
          marginBottom: '12px',
        }}
      >
        Mastery Achieved!
      </h1>

      <p
        style={{
          fontSize: '1.2rem',
          color: 'var(--color-text-2)',
          maxWidth: '480px',
          lineHeight: '1.7',
          marginBottom: '36px',
        }}
      >
        {student.studentName}, you did it! You've proven you can compare fractions with unlike denominators using three powerful strategies.
      </p>

      {/* Score cards */}
      <div style={{ display: 'flex', gap: '16px', marginBottom: '40px', flexWrap: 'wrap', justifyContent: 'center' }}>
        {allScores.map((score, i) => (
          <div
            key={i}
            className="animate-pop-in"
            style={{
              animationDelay: `${i * 0.1 + 0.3}s`,
              animationFillMode: 'both',
            }}
          >
            <div
              className="score-circle score-pass"
              style={{ width: 80, height: 80, fontSize: '1.4rem' }}
            >
              {score}/10
            </div>
            <p style={{
              fontFamily: 'var(--font-display)',
              fontWeight: '700',
              fontSize: '0.8rem',
              color: 'var(--color-text-3)',
              marginTop: '6px',
            }}>
              Check {i + 1}
            </p>
          </div>
        ))}
      </div>

      {/* What they learned */}
      <div
        className="card"
        style={{
          maxWidth: 480,
          width: '100%',
          textAlign: 'left',
          marginBottom: '28px',
        }}
      >
        <p style={{
          fontFamily: 'var(--font-display)',
          fontWeight: '800',
          marginBottom: '14px',
          fontSize: '1rem',
        }}>
          You mastered 3 strategies:
        </p>
        {[
          { icon: '📏', text: 'Unit fractions: bigger denominator = smaller fraction' },
          { icon: '🧭', text: 'Benchmark test: use ½ to compare without computing' },
          { icon: '🔢', text: 'Common denominators: make fractions speak the same language' },
        ].map((item, i) => (
          <div key={i} style={{
            display: 'flex',
            gap: '12px',
            alignItems: 'flex-start',
            marginBottom: '10px',
          }}>
            <span style={{ fontSize: '1.1rem', marginTop: '1px' }}>{item.icon}</span>
            <span style={{
              fontFamily: 'var(--font-display)',
              fontWeight: '700',
              fontSize: '0.95rem',
              color: 'var(--color-text-1)',
            }}>
              {item.text}
            </span>
          </div>
        ))}
      </div>

      <button
        className="btn btn-primary btn-large"
        onClick={onBack}
        style={{ minWidth: 240 }}
      >
        Back to home
      </button>
    </div>
  )
}
