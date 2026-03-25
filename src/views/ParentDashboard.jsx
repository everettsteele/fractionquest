import { exportData, clearStudent } from '../lib/storage.js'

const SESSION_TITLES = {
  1: 'Where Do Fractions Live?',
  2: 'The Benchmark Test',
  3: 'Speaking the Same Language',
  4: 'The Numerator Shortcut',
  5: 'Show What You Know',
}

const MISCONCEPTION_LABELS = {
  'WNB-D': { label: 'Bigger denominator = bigger fraction', short: 'Denominator confusion' },
  'WNB-N': { label: 'Bigger numbers = bigger fraction', short: 'Whole-number thinking' },
  'BENCH': { label: 'Benchmark (½) reasoning', short: 'Benchmark errors' },
  'EQUIV': { label: 'Equivalent fractions', short: 'Equivalent fractions' },
  'PROC': { label: 'Finding common denominators', short: 'Procedure errors' },
}

export default function ParentDashboard({ student, onBack, onReset }) {
  const { studentName, sessionHistory, misconceptionProfile, masteryStatus, currentSession } = student

  const completedSessions = sessionHistory.filter(s => s.completedAt)
  const checkSessions = sessionHistory.filter(s => [3, 4, 5].includes(s.sessionNumber))

  const totalPractice = sessionHistory.reduce((n, s) => n + (s.practiceResponses?.length || 0), 0)
  const totalCorrect = sessionHistory.reduce((n, s) =>
    n + (s.practiceResponses?.filter(r => r.isCorrect).length || 0), 0)
  const accuracy = totalPractice > 0 ? Math.round((totalCorrect / totalPractice) * 100) : null

  const activeErrors = Object.entries(misconceptionProfile)
    .filter(([, v]) => v.totalOccurrences > 0 && !v.resolved)
    .sort((a, b) => b[1].totalOccurrences - a[1].totalOccurrences)

  const resolvedErrors = Object.entries(misconceptionProfile)
    .filter(([, v]) => v.resolved)

  function handleExport() {
    exportData(student)
  }

  function handleReset() {
    if (window.confirm(`This will erase all of ${studentName}'s progress. Are you sure?`)) {
      clearStudent()
      onReset()
    }
  }

  return (
    <div style={{ minHeight: '100vh', background: 'var(--color-bg)' }}>
      {/* Header */}
      <div style={{
        background: 'white',
        borderBottom: '1.5px solid var(--color-border)',
        padding: '18px 24px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '12px',
      }}>
        <div>
          <button
            onClick={onBack}
            style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              color: 'var(--color-primary)',
              fontFamily: 'var(--font-display)',
              fontWeight: '700',
              fontSize: '0.9rem',
              padding: 0,
              marginBottom: '4px',
              display: 'block',
            }}
          >
            ← Back
          </button>
          <h2 style={{ margin: 0, color: 'var(--color-text-1)' }}>
            {studentName}'s Progress
          </h2>
        </div>
        <div style={{ display: 'flex', gap: '10px' }}>
          <button className="btn btn-ghost" onClick={handleExport} style={{ fontSize: '0.9rem', padding: '10px 18px' }}>
            Export backup
          </button>
        </div>
      </div>

      <div className="container" style={{ paddingTop: '32px', paddingBottom: '60px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px', marginBottom: '28px' }}>

          {/* Mastery status */}
          <div className="card">
            <p style={{ color: 'var(--color-text-3)', fontSize: '0.8rem', fontFamily: 'var(--font-display)', fontWeight: '700', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: '8px' }}>
              Mastery Status
            </p>
            <div className={`mastery-badge ${masteryStatus === 'achieved' ? 'badge-achieved' : masteryStatus === 'in_progress' ? 'badge-in-progress' : 'badge-not-started'}`}
              style={{ fontSize: '1rem', padding: '8px 16px', marginBottom: '10px' }}>
              {masteryStatus === 'achieved' ? '⭐ Mastery Achieved!' : masteryStatus === 'in_progress' ? 'In Progress' : 'Not Started'}
            </div>
            <p style={{ fontSize: '0.9rem', color: 'var(--color-text-2)' }}>
              {masteryStatus === 'achieved'
                ? `${studentName} scored ≥90% on all 3 mastery checks. Goal complete.`
                : masteryStatus === 'in_progress'
                  ? `On Session ${currentSession} of 5. Mastery requires ≥90% on checks in Sessions 3, 4, and 5.`
                  : 'No sessions started yet.'}
            </p>
          </div>

          {/* Overall accuracy */}
          <div className="card">
            <p style={{ color: 'var(--color-text-3)', fontSize: '0.8rem', fontFamily: 'var(--font-display)', fontWeight: '700', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: '8px' }}>
              Practice Accuracy
            </p>
            <p style={{ fontFamily: 'var(--font-display)', fontWeight: '900', fontSize: '2.5rem', color: 'var(--color-primary)', lineHeight: 1 }}>
              {accuracy !== null ? `${accuracy}%` : '—'}
            </p>
            <p style={{ fontSize: '0.9rem', color: 'var(--color-text-2)', marginTop: '6px' }}>
              {totalCorrect} correct out of {totalPractice} practice problems
            </p>
          </div>
        </div>

        {/* Session scores */}
        <div className="card" style={{ marginBottom: '20px' }}>
          <p style={{
            fontFamily: 'var(--font-display)',
            fontWeight: '800',
            fontSize: '1rem',
            marginBottom: '16px',
          }}>
            Session Scores
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {sessionHistory.map(session => {
              const isCheck = session.sessionNumber >= 3
              const score = session.masteryCheckScore
              const done = !!session.completedAt
              const active = session.sessionNumber === currentSession && !done

              return (
                <div key={session.sessionNumber} style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '16px',
                  padding: '14px 18px',
                  background: active ? 'var(--color-primary-light)' : 'var(--color-surface-2)',
                  borderRadius: 'var(--radius-md)',
                  border: active ? '2px solid var(--color-border)' : '1.5px solid var(--color-border)',
                }}>
                  <div style={{
                    width: 36, height: 36, borderRadius: '50%',
                    background: done ? 'var(--color-primary)' : 'var(--color-surface)',
                    border: `2px solid ${done ? 'var(--color-primary)' : 'var(--color-border)'}`,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontFamily: 'var(--font-display)', fontWeight: '900',
                    color: done ? 'white' : 'var(--color-text-3)',
                    fontSize: '0.9rem',
                    flexShrink: 0,
                  }}>
                    {done ? '✓' : session.sessionNumber}
                  </div>
                  <div style={{ flex: 1 }}>
                    <p style={{ fontFamily: 'var(--font-display)', fontWeight: '700', fontSize: '0.9rem', margin: 0 }}>
                      Session {session.sessionNumber}: {SESSION_TITLES[session.sessionNumber]}
                    </p>
                    <p style={{ fontSize: '0.82rem', color: 'var(--color-text-3)', margin: 0 }}>
                      {done
                        ? `${session.practiceResponses?.length || 0} practice problems`
                        : active ? 'In progress' : 'Not started'}
                    </p>
                  </div>
                  {isCheck && score !== null && (
                    <div className={`score-circle ${score >= 9 ? 'score-pass' : score >= 7 ? 'score-near' : 'score-low'}`}
                      style={{ width: 48, height: 48, fontSize: '1rem', flexShrink: 0 }}>
                      {score}/10
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        </div>

        {/* Misconception profile */}
        <div className="card" style={{ marginBottom: '20px' }}>
          <p style={{ fontFamily: 'var(--font-display)', fontWeight: '800', fontSize: '1rem', marginBottom: '4px' }}>
            Learning Patterns
          </p>
          <p style={{ fontSize: '0.9rem', color: 'var(--color-text-2)', marginBottom: '16px' }}>
            The system automatically adjusts practice to work on these areas.
          </p>

          {activeErrors.length === 0 && resolvedErrors.length === 0 && (
            <p style={{ color: 'var(--color-text-3)', fontSize: '0.9rem' }}>
              No errors recorded yet.
            </p>
          )}

          {activeErrors.map(([id, data]) => (
            <div key={id} style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              padding: '12px 16px',
              background: 'var(--color-warning-light)',
              borderRadius: 'var(--radius-md)',
              border: '2px solid #FDE68A',
              marginBottom: '8px',
            }}>
              <span style={{ fontSize: '1.2rem' }}>⚠️</span>
              <div style={{ flex: 1 }}>
                <p style={{ fontFamily: 'var(--font-display)', fontWeight: '700', fontSize: '0.9rem', margin: 0 }}>
                  {MISCONCEPTION_LABELS[id]?.label || id}
                </p>
                <p style={{ fontSize: '0.82rem', color: 'var(--color-text-3)', margin: 0 }}>
                  Seen {data.totalOccurrences} time{data.totalOccurrences !== 1 ? 's' : ''} — still working on it
                </p>
              </div>
            </div>
          ))}

          {resolvedErrors.map(([id]) => (
            <div key={id} style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              padding: '12px 16px',
              background: 'var(--color-success-light)',
              borderRadius: 'var(--radius-md)',
              border: '2px solid #86EFAC',
              marginBottom: '8px',
            }}>
              <span style={{ fontSize: '1.2rem' }}>✓</span>
              <p style={{ fontFamily: 'var(--font-display)', fontWeight: '700', fontSize: '0.9rem', margin: 0, color: 'var(--color-success)' }}>
                {MISCONCEPTION_LABELS[id]?.label || id} — resolved!
              </p>
            </div>
          ))}
        </div>

        {/* Danger zone */}
        <div className="card" style={{ borderColor: '#FECACA' }}>
          <p style={{ fontFamily: 'var(--font-display)', fontWeight: '800', fontSize: '0.9rem', color: '#DC2626', marginBottom: '8px' }}>
            Reset Progress
          </p>
          <p style={{ fontSize: '0.85rem', color: 'var(--color-text-2)', marginBottom: '12px' }}>
            This erases all of {studentName}'s progress and starts over. Export a backup first.
          </p>
          <button
            onClick={handleReset}
            style={{
              background: 'none',
              border: '2px solid #FECACA',
              borderRadius: 'var(--radius-sm)',
              padding: '8px 16px',
              cursor: 'pointer',
              color: '#DC2626',
              fontFamily: 'var(--font-display)',
              fontWeight: '700',
              fontSize: '0.85rem',
            }}
          >
            Reset all progress
          </button>
        </div>
      </div>
    </div>
  )
}
