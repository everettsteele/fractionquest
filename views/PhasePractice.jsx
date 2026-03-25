import { useState, useEffect, useCallback } from 'react'
import NumberLine from '../components/NumberLine.jsx'
import Fraction from '../components/Fraction.jsx'
import { detectMisconception } from '../lib/misconception.js'
import { selectNextItem, getNextTier, getPracticeTarget } from '../lib/adaptive.js'
import { recordPracticeResponse } from '../lib/storage.js'

const ANSWER_OPTIONS = [
  { value: 'A > B', label: null, ariaLabel: 'A is greater than B' },
  { value: 'A = B', label: null, ariaLabel: 'A equals B' },
  { value: 'A < B', label: null, ariaLabel: 'A is less than B' },
]

export default function PhasePractice({ student, sessionNumber, onComplete, onUpdateStudent, onExit }) {
  const session = student.sessionHistory.find(s => s.sessionNumber === sessionNumber)
  const answeredIds = session?.practiceResponses?.map(r => r.itemId) || []

  const [currentTier, setCurrentTier] = useState(student.currentDifficultyTier || 1)
  const [currentItem, setCurrentItem] = useState(null)
  const [selectedAnswer, setSelectedAnswer] = useState(null)
  const [submitted, setSubmitted] = useState(false)
  const [isCorrect, setIsCorrect] = useState(null)
  const [misconception, setMisconception] = useState(null)
  const [practiceCount, setPracticeCount] = useState(session?.practiceResponses?.length || 0)
  const [localStudent, setLocalStudent] = useState(student)

  const targetCount = getPracticeTarget(sessionNumber, currentTier)

  const loadNextItem = useCallback(() => {
    const item = selectNextItem({
      currentTier,
      misconceptionProfile: localStudent.misconceptionProfile,
      answeredIds: [...answeredIds],
      sessionNumber,
    })
    setCurrentItem(item)
    setSelectedAnswer(null)
    setSubmitted(false)
    setIsCorrect(null)
    setMisconception(null)
  }, [currentTier, localStudent.misconceptionProfile, sessionNumber])

  useEffect(() => {
    loadNextItem()
  }, [])

  function handleAnswer(answer) {
    if (submitted) return
    setSelectedAnswer(answer)
  }

  function handleSubmit() {
    if (!selectedAnswer || !currentItem) return
    setSubmitted(true)

    const correct = selectedAnswer === currentItem.correctAnswer
    setIsCorrect(correct)

    let detected = null
    if (!correct) {
      detected = detectMisconception(currentItem, selectedAnswer)
      setMisconception(detected)
    }

    const response = {
      itemId: currentItem.id,
      studentAnswer: selectedAnswer,
      isCorrect: correct,
      detectedMisconception: detected,
      responseTimeMs: 0,
      difficultyTier: currentTier,
      timestamp: new Date().toISOString(),
    }

    const updated = recordPracticeResponse(localStudent, sessionNumber, response)
    setLocalStudent(updated)
    onUpdateStudent(updated)

    // Adjust difficulty based on rolling window
    const allResponses = [
      ...(updated.sessionHistory.find(s => s.sessionNumber === sessionNumber)?.practiceResponses || [])
    ]
    const newTier = getNextTier(allResponses, currentTier)
    setCurrentTier(newTier)
    setPracticeCount(allResponses.length)
  }

  function handleNext() {
    if (practiceCount >= targetCount) {
      onComplete()
    } else {
      loadNextItem()
    }
  }

  const canProceed = practiceCount >= targetCount && submitted
  const progressPct = Math.min((practiceCount / targetCount) * 100, 100)

  if (!currentItem) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <p style={{ color: 'var(--color-text-3)' }}>Loading...</p>
      </div>
    )
  }

  const { fractionA, fractionB, feedbackTemplates } = currentItem
  const feedbackText = misconception
    ? feedbackTemplates[misconception] || feedbackTemplates['generic']
    : feedbackTemplates['generic']

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
            Session {sessionNumber} · Practice
          </span>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <span style={{
              fontFamily: 'var(--font-display)',
              fontWeight: '700',
              fontSize: '0.85rem',
              color: 'var(--color-text-3)',
            }}>
              {practiceCount}/{targetCount} problems
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
          <div className="progress-fill" style={{ width: `${progressPct}%` }} />
        </div>
      </div>

      <div
        className="container-narrow animate-fade-in"
        style={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          gap: '24px',
          paddingTop: '32px',
          paddingBottom: '40px',
        }}
        key={currentItem.id}
      >
        {/* Question prompt */}
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
            Compare these fractions
          </p>

          {/* Fraction display */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '28px',
          }}>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
              <Fraction
                numerator={fractionA.numerator}
                denominator={fractionA.denominator}
                variant="a"
                size="xl"
              />
              <span style={{
                fontFamily: 'var(--font-display)',
                fontWeight: '800',
                fontSize: '0.85rem',
                color: 'var(--color-fraction-a)',
                padding: '3px 10px',
                background: 'var(--color-fraction-a-light)',
                borderRadius: '100px',
              }}>A</span>
            </div>

            <span style={{
              color: 'var(--color-text-3)',
              fontFamily: 'var(--font-display)',
              fontWeight: '700',
              fontSize: '1.5rem',
            }}>vs</span>

            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
              <Fraction
                numerator={fractionB.numerator}
                denominator={fractionB.denominator}
                variant="b"
                size="xl"
              />
              <span style={{
                fontFamily: 'var(--font-display)',
                fontWeight: '800',
                fontSize: '0.85rem',
                color: 'var(--color-fraction-b)',
                padding: '3px 10px',
                background: 'var(--color-fraction-b-light)',
                borderRadius: '100px',
              }}>B</span>
            </div>
          </div>
        </div>

        {/* Number line (always visible) */}
        <div className="card" style={{ padding: '20px' }}>
          <NumberLine
            fractionA={fractionA}
            fractionB={fractionB}
            showBoth={submitted}
            animate={submitted}
          />
        </div>

        {/* Answer buttons */}
        {!submitted && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <p style={{
              fontFamily: 'var(--font-display)',
              fontWeight: '700',
              color: 'var(--color-text-2)',
              textAlign: 'center',
              marginBottom: '4px',
            }}>
              Which is true?
            </p>
            {[
              { value: 'A > B', display: 'A > B', sub: 'A is bigger' },
              { value: 'A = B', display: 'A = B', sub: 'They\'re equal' },
              { value: 'A < B', display: 'A < B', sub: 'B is bigger' },
            ].map(opt => (
              <button
                key={opt.value}
                className={`answer-btn ${selectedAnswer === opt.value ? 'selected' : ''}`}
                onClick={() => handleAnswer(opt.value)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  borderColor: selectedAnswer === opt.value ? 'var(--color-primary)' : undefined,
                  background: selectedAnswer === opt.value ? 'var(--color-primary-light)' : undefined,
                  color: selectedAnswer === opt.value ? 'var(--color-primary)' : undefined,
                }}
                aria-label={opt.value === 'A > B' ? 'A is greater than B' : opt.value === 'A = B' ? 'A equals B' : 'A is less than B'}
              >
                <span style={{ fontSize: '1.3rem', fontFamily: 'var(--font-display)', fontWeight: '900' }}>
                  {opt.display}
                </span>
                <span style={{ fontSize: '0.9rem', opacity: 0.7, fontWeight: '600' }}>
                  {opt.sub}
                </span>
              </button>
            ))}
          </div>
        )}

        {/* Submit button */}
        {!submitted && selectedAnswer && (
          <button
            className="btn btn-primary btn-large animate-pop-in"
            onClick={handleSubmit}
            style={{ width: '100%' }}
          >
            Check my answer
          </button>
        )}

        {/* Feedback */}
        {submitted && (
          <div className={`feedback-box ${isCorrect ? 'success' : 'try-again'} animate-fade-in`}>
            <div style={{
              fontFamily: 'var(--font-display)',
              fontWeight: '800',
              fontSize: '1.05rem',
              marginBottom: '8px',
            }}>
              {isCorrect
                ? '✓ That\'s right!'
                : 'Almost! Let\'s look at this together.'}
            </div>
            {!isCorrect && (
              <p style={{ lineHeight: '1.6' }}>{feedbackText}</p>
            )}
            {isCorrect && (
              <p>
                {currentItem.correctAnswer === 'A > B'
                  ? `${fractionA.numerator}/${fractionA.denominator} > ${fractionB.numerator}/${fractionB.denominator}`
                  : currentItem.correctAnswer === 'A < B'
                    ? `${fractionA.numerator}/${fractionA.denominator} < ${fractionB.numerator}/${fractionB.denominator}`
                    : `${fractionA.numerator}/${fractionA.denominator} = ${fractionB.numerator}/${fractionB.denominator}`
                }
              </p>
            )}
          </div>
        )}

        {/* Next / Finish button */}
        {submitted && (
          <button
            className="btn btn-primary btn-large animate-pop-in"
            onClick={handleNext}
            style={{ width: '100%' }}
            autoFocus
          >
            {canProceed
              ? (sessionNumber >= 3 ? 'Start the Check →' : 'Finish practice →')
              : 'Next problem →'}
          </button>
        )}
      </div>
    </div>
  )
}
