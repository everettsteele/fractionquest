import { useState } from 'react'
import NumberLine from '../components/NumberLine.jsx'
import Fraction from '../components/Fraction.jsx'
import { MASTERY_CHECK_POOLS } from '../data/items.js'
import { recordCheckResponse, completeCheck } from '../lib/storage.js'

export default function PhaseCheck({ student, sessionNumber, onComplete, onUpdateStudent, onExit }) {
  const items = MASTERY_CHECK_POOLS[sessionNumber] || []
  const [questionIndex, setQuestionIndex] = useState(0)
  const [selectedAnswer, setSelectedAnswer] = useState(null)
  const [submitted, setSubmitted] = useState(false)
  const [responses, setResponses] = useState([])
  const [localStudent, setLocalStudent] = useState(student)
  const [done, setDone] = useState(false)
  const [finalScore, setFinalScore] = useState(null)

  const currentItem = items[questionIndex]
  const totalQuestions = items.length
  const progress = ((questionIndex + (submitted ? 1 : 0)) / totalQuestions) * 100

  function handleAnswer(answer) {
    if (submitted) return
    setSelectedAnswer(answer)
  }

  function handleSubmit() {
    if (!selectedAnswer || !currentItem) return
    setSubmitted(true)

    const isCorrect = selectedAnswer === currentItem.correctAnswer

    const response = {
      itemId: currentItem.id,
      studentAnswer: selectedAnswer,
      isCorrect,
      detectedMisconception: null,
      responseTimeMs: 0,
      difficultyTier: currentItem.difficultyTier,
      timestamp: new Date().toISOString(),
    }

    const newResponses = [...responses, response]
    setResponses(newResponses)

    const updated = recordCheckResponse(localStudent, sessionNumber, response)
    setLocalStudent(updated)
    onUpdateStudent(updated)
  }

  function handleNext() {
    if (questionIndex < totalQuestions - 1) {
      setQuestionIndex(questionIndex + 1)
      setSelectedAnswer(null)
      setSubmitted(false)
    } else {
      // All done — score and save
      const correct = responses.filter(r => r.isCorrect).length
      setFinalScore(correct)
      setDone(true)
      const updated = completeCheck(localStudent, sessionNumber)
      setLocalStudent(updated)
      onUpdateStudent(updated)
    }
  }

  if (!currentItem && !done) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <p>Loading check...</p>
      </div>
    )
  }

  if (done) {
    const score = finalScore
    const passed = score >= 9
    const scoreClass = passed ? 'score-pass' : score >= 7 ? 'score-near' : 'score-low'

    return (
      <div
        style={{
          minHeight: '100vh',
          background: 'var(--color-bg)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '32px 24px',
          gap: '28px',
        }}
        className="animate-fade-in"
      >
        <div className={`score-circle ${scoreClass}`} style={{ width: 110, height: 110, fontSize: '2rem' }}>
          {score}/10
        </div>

        <div style={{ textAlign: 'center', maxWidth: 480 }}>
          <h2 style={{ marginBottom: '12px' }}>
            {passed
              ? 'Excellent work!'
              : score >= 7
                ? 'Good effort — you\'re getting there!'
                : 'Let\'s keep working on this together!'}
          </h2>
          <p style={{ color: 'var(--color-text-2)', fontSize: '1.05rem', lineHeight: '1.7' }}>
            {passed
              ? `You scored ${score} out of 10 on this check. You're on track for mastery!`
              : `You scored ${score} out of 10. The next session will focus on the areas where you can improve.`}
          </p>
        </div>

        {/* Breakdown by strategy type */}
        <div className="card" style={{ width: '100%', maxWidth: 480 }}>
          <p style={{
            fontFamily: 'var(--font-display)',
            fontWeight: '800',
            marginBottom: '16px',
            color: 'var(--color-text-1)',
          }}>
            How you did by strategy:
          </p>
          {[
            { label: 'Benchmark (½ test)', strategy: 'benchmark' },
            { label: 'Common denominators', strategy: 'commonDenominator' },
            { label: 'Common numerators', strategy: 'commonNumerator' },
            { label: 'Unit fractions', strategy: 'unitFraction' },
          ].map(({ label, strategy }) => {
            const strategyItems = items.filter(i => i.primaryStrategy === strategy)
            if (strategyItems.length === 0) return null
            const strategyResponses = responses.filter((r, i) => items[i]?.primaryStrategy === strategy)
            const correct = strategyResponses.filter(r => r.isCorrect).length
            const total = strategyResponses.length || strategyItems.length
            const pct = total > 0 ? Math.round((correct / total) * 100) : 0

            return (
              <div key={strategy} style={{ marginBottom: '12px' }}>
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  marginBottom: '4px',
                  fontSize: '0.9rem',
                }}>
                  <span style={{ fontFamily: 'var(--font-display)', fontWeight: '700' }}>{label}</span>
                  <span style={{ color: pct >= 80 ? 'var(--color-success)' : 'var(--color-warning)', fontWeight: '700' }}>
                    {correct}/{total}
                  </span>
                </div>
                <div className="progress-bar">
                  <div
                    className="progress-fill"
                    style={{
                      width: `${pct}%`,
                      background: pct >= 80
                        ? 'var(--color-success)'
                        : pct >= 60
                          ? 'var(--color-warning)'
                          : '#F43F5E',
                    }}
                  />
                </div>
              </div>
            )
          })}
        </div>

        <button
          className="btn btn-primary btn-large"
          onClick={() => onComplete(score)}
          style={{ width: '100%', maxWidth: 480 }}
          autoFocus
        >
          {sessionNumber < 5
            ? 'Continue to next session →'
            : score >= 9 ? 'See my results! →' : 'See my results →'}
        </button>
      </div>
    )
  }

  const { fractionA, fractionB } = currentItem

  return (
    <div style={{ minHeight: '100vh', background: 'var(--color-bg)', display: 'flex', flexDirection: 'column' }}>
      {/* Top bar */}
      <div style={{
        background: 'white',
        borderBottom: '1.5px solid var(--color-border)',
        padding: '14px 24px',
      }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: '8px',
        }}>
          <span style={{
            fontFamily: 'var(--font-display)',
            fontWeight: '700',
            fontSize: '0.85rem',
            color: 'var(--color-text-2)',
          }}>
            Session {sessionNumber} · Mastery Check
          </span>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <span style={{
              fontFamily: 'var(--font-display)',
              fontWeight: '800',
              fontSize: '0.9rem',
              color: 'var(--color-primary)',
            }}>
              Question {questionIndex + 1} of {totalQuestions}
            </span>
            {onExit && (
              <button
                onClick={onExit}
                style={{
                  background: 'none',
                  border: '2px solid var(--color-border)',
                  borderRadius: 'var(--radius-sm)',
                  padding: '4px 12px',
                  cursor: 'pointer',
                  fontFamily: 'var(--font-display)',
                  fontWeight: '700',
                  fontSize: '0.82rem',
                  color: 'var(--color-text-2)',
                }}
              >
                Save & exit
              </button>
            )}
          </div>
        </div>
        <div className="progress-bar">
          <div className="progress-fill" style={{ width: `${progress}%` }} />
        </div>
      </div>

      <div
        className="container-narrow animate-fade-in"
        style={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          gap: '20px',
          paddingTop: '28px',
          paddingBottom: '40px',
        }}
        key={questionIndex}
      >
        {/* Notice: no feedback during check */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          padding: '10px 16px',
          background: 'var(--color-primary-light)',
          borderRadius: 'var(--radius-md)',
          fontSize: '0.85rem',
          fontFamily: 'var(--font-display)',
          fontWeight: '700',
          color: 'var(--color-primary)',
        }}>
          ⭐ This is your mastery check — do your best! Feedback comes after all 10 questions.
        </div>

        {/* Question */}
        <div className="card" style={{ textAlign: 'center', padding: '32px 24px' }}>
          <p style={{
            fontFamily: 'var(--font-display)',
            fontWeight: '700',
            color: 'var(--color-text-3)',
            fontSize: '0.85rem',
            letterSpacing: '0.08em',
            textTransform: 'uppercase',
            marginBottom: '20px',
          }}>
            Which fraction is larger?
          </p>

          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '28px',
          }}>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
              <Fraction numerator={fractionA.numerator} denominator={fractionA.denominator} variant="a" size="xl" />
              <span style={{
                fontFamily: 'var(--font-display)', fontWeight: '800', fontSize: '0.85rem',
                color: 'var(--color-fraction-a)', padding: '3px 10px',
                background: 'var(--color-fraction-a-light)', borderRadius: '100px',
              }}>A</span>
            </div>
            <span style={{ color: 'var(--color-text-3)', fontFamily: 'var(--font-display)', fontWeight: '700', fontSize: '1.5rem' }}>vs</span>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
              <Fraction numerator={fractionB.numerator} denominator={fractionB.denominator} variant="b" size="xl" />
              <span style={{
                fontFamily: 'var(--font-display)', fontWeight: '800', fontSize: '0.85rem',
                color: 'var(--color-fraction-b)', padding: '3px 10px',
                background: 'var(--color-fraction-b-light)', borderRadius: '100px',
              }}>B</span>
            </div>
          </div>
        </div>

        {/* Number line — static during check (no reveal animation) */}
        <div className="card" style={{ padding: '20px' }}>
          <NumberLine
            fractionA={fractionA}
            fractionB={null}
            showBoth={false}
            animate={false}
          />
        </div>

        {/* Answers */}
        {!submitted && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {[
              { value: 'A > B', display: 'A > B', sub: 'A is bigger' },
              { value: 'A = B', display: 'A = B', sub: 'They\'re equal' },
              { value: 'A < B', display: 'A < B', sub: 'B is bigger' },
            ].map(opt => (
              <button
                key={opt.value}
                className="answer-btn"
                onClick={() => handleAnswer(opt.value)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  borderColor: selectedAnswer === opt.value ? 'var(--color-primary)' : undefined,
                  background: selectedAnswer === opt.value ? 'var(--color-primary-light)' : undefined,
                  color: selectedAnswer === opt.value ? 'var(--color-primary)' : undefined,
                }}
              >
                <span style={{ fontSize: '1.3rem', fontFamily: 'var(--font-display)', fontWeight: '900' }}>
                  {opt.display}
                </span>
                <span style={{ fontSize: '0.9rem', opacity: 0.7, fontWeight: '600' }}>{opt.sub}</span>
              </button>
            ))}
          </div>
        )}

        {!submitted && selectedAnswer && (
          <button
            className="btn btn-primary btn-large animate-pop-in"
            onClick={handleSubmit}
            style={{ width: '100%' }}
          >
            Submit answer
          </button>
        )}

        {submitted && (
          <>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '10px',
              padding: '16px',
              background: 'var(--color-surface-2)',
              borderRadius: 'var(--radius-md)',
              fontFamily: 'var(--font-display)',
              fontWeight: '700',
              color: 'var(--color-text-2)',
              fontSize: '0.95rem',
            }}>
              Answer recorded. Feedback comes after the check.
            </div>
            <button
              className="btn btn-primary btn-large animate-pop-in"
              onClick={handleNext}
              style={{ width: '100%' }}
              autoFocus
            >
              {questionIndex < totalQuestions - 1 ? `Question ${questionIndex + 2} →` : 'See my score →'}
            </button>
          </>
        )}
      </div>
    </div>
  )
}
