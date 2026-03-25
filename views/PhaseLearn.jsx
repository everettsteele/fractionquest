import { useState } from 'react'
import NumberLine from '../components/NumberLine.jsx'
import Fraction from '../components/Fraction.jsx'

// Direct instruction content for each session
const SESSION_CONTENT = {
  1: {
    title: 'Where Do Fractions Live?',
    slides: [
      {
        text: 'A fraction is a point on a number line — not just a piece of a pie!',
        subtext: 'Every fraction lives somewhere between 0 and 1. Let\'s find out where.',
        showNumberLine: true,
        fractionA: null,
        fractionB: null,
        animate: false,
      },
      {
        text: 'Watch where 1/2 lands.',
        subtext: 'One-half is exactly in the middle. Half of the number line.',
        showNumberLine: true,
        fractionA: { numerator: 1, denominator: 2 },
        fractionB: null,
      },
      {
        text: 'Now watch where 1/4 lands.',
        subtext: 'One-fourth is closer to 0. We cut the line into 4 pieces — each piece is smaller.',
        showNumberLine: true,
        fractionA: { numerator: 1, denominator: 4 },
        fractionB: null,
      },
      {
        text: 'The secret: bigger denominator = smaller pieces.',
        subtext: 'When we cut something into MORE pieces, each piece gets SMALLER. So one-fourth is smaller than one-half — even though 4 is bigger than 2!',
        showNumberLine: true,
        fractionA: { numerator: 1, denominator: 2 },
        fractionB: { numerator: 1, denominator: 4 },
        highlight: true,
      },
      {
        text: 'Which is bigger — 1/3 or 1/6?',
        subtext: '1/3 cuts the line into 3 pieces. 1/6 cuts it into 6 smaller pieces. The bigger denominator means smaller fraction!',
        showNumberLine: true,
        fractionA: { numerator: 1, denominator: 3 },
        fractionB: { numerator: 1, denominator: 6 },
      },
    ],
    checkQuestion: {
      text: 'True or False: 1/8 is bigger than 1/3 because 8 > 3.',
      options: ['True', 'False'],
      correct: 1,
      explanation: 'False! A bigger denominator means SMALLER pieces. One-eighth is smaller than one-third because you\'re cutting into 8 tiny pieces instead of 3 bigger ones.',
    },
  },
  2: {
    title: 'The Benchmark Test',
    slides: [
      {
        text: '1/2 is your best friend.',
        subtext: 'Before comparing two fractions, ask: is each one above or below 1/2? That single question can solve tons of problems!',
        showNumberLine: true,
        fractionA: { numerator: 1, denominator: 2 },
        fractionB: null,
        showHalf: true,
      },
      {
        text: 'How to test any fraction against 1/2:',
        subtext: 'Ask: is the top number more than HALF of the bottom number? For 3/5: half of 5 is 2.5. Since 3 > 2.5, the fraction 3/5 is GREATER than 1/2.',
        showNumberLine: true,
        fractionA: { numerator: 3, denominator: 5 },
        fractionB: { numerator: 1, denominator: 2 },
        showHalf: true,
      },
      {
        text: 'Now let\'s compare 3/8 vs 5/6.',
        subtext: '3/8: half of 8 is 4. Since 3 < 4, the fraction 3/8 is LESS than 1/2. But 5/6: half of 6 is 3. Since 5 > 3, the fraction 5/6 is GREATER than 1/2.',
        showNumberLine: true,
        fractionA: { numerator: 3, denominator: 8 },
        fractionB: { numerator: 5, denominator: 6 },
        showHalf: true,
      },
      {
        text: 'They\'re on opposite sides — so we already know the answer!',
        subtext: '3/8 is below 1/2. 5/6 is above 1/2. That means 5/6 must be bigger. No math needed!',
        showNumberLine: true,
        fractionA: { numerator: 3, denominator: 8 },
        fractionB: { numerator: 5, denominator: 6 },
        showHalf: true,
        highlight: true,
      },
    ],
    checkQuestion: {
      text: 'Use the benchmark test: which is bigger, 2/9 or 3/4?',
      options: ['2/9', '3/4', 'They\'re equal'],
      correct: 1,
      explanation: 'Half of 9 is 4.5. Since 2 < 4.5, the fraction 2/9 is LESS than 1/2. Half of 4 is 2. Since 3 > 2, the fraction 3/4 is GREATER than 1/2. They\'re on opposite sides, so 3/4 wins!',
    },
  },
  3: {
    title: 'Speaking the Same Language',
    slides: [
      {
        text: 'What if both fractions are on the same side of 1/2?',
        subtext: 'The benchmark trick won\'t work! We need to get the fractions to use the same denominator first.',
        showNumberLine: true,
        fractionA: { numerator: 2, denominator: 3 },
        fractionB: { numerator: 3, denominator: 4 },
      },
      {
        text: 'Find a number both denominators divide into.',
        subtext: 'To compare 2/3 and 3/4, we find a common denominator. Both 3 and 4 divide into 12! So 12 is our common denominator.',
        showNumberLine: false,
      },
      {
        text: 'Create equivalent fractions.',
        subtext: '2/3 → multiply top and bottom by 4 → 8/12. 3/4 → multiply top and bottom by 3 → 9/12. Now they speak the same language!',
        showNumberLine: true,
        fractionA: { numerator: 8, denominator: 12 },
        fractionB: { numerator: 9, denominator: 12 },
        highlight: true,
      },
      {
        text: 'Now compare the numerators: 8 vs 9.',
        subtext: '9 > 8, so 9/12 > 8/12, which means 3/4 > 2/3. Same denominators = just compare the tops!',
        showNumberLine: true,
        fractionA: { numerator: 8, denominator: 12 },
        fractionB: { numerator: 9, denominator: 12 },
        labelA: '2/3 = 8/12',
        labelB: '3/4 = 9/12',
      },
    ],
    checkQuestion: {
      text: 'Which is bigger: 3/5 or 5/8?',
      options: ['3/5', '5/8', 'They\'re equal'],
      correct: 0,
      explanation: 'Common denominator of 5 and 8 is 40. 3/5 = 24/40. 5/8 = 25/40. Wait — 25 > 24, so 5/8 > 3/5! Let\'s double-check: 3×8=24 and 5×5=25. Yes, 5/8 is bigger.',
    },
  },
  4: {
    title: 'The Numerator Shortcut',
    slides: [
      {
        text: 'What if the TOP numbers are already the same?',
        subtext: 'When numerators match, bigger denominator = smaller fraction. Because more cuts = smaller pieces!',
        showNumberLine: true,
        fractionA: { numerator: 3, denominator: 5 },
        fractionB: { numerator: 3, denominator: 7 },
      },
      {
        text: '3/5 vs 3/7: same numerator (3), so compare denominators.',
        subtext: '5 < 7, so 1/5-sized pieces are bigger than 1/7-sized pieces. Three big pieces beat three small pieces. So 3/5 > 3/7!',
        showNumberLine: true,
        fractionA: { numerator: 3, denominator: 5 },
        fractionB: { numerator: 3, denominator: 7 },
        highlight: true,
      },
      {
        text: 'Your 3-tool toolkit is complete!',
        subtext: 'Now you have three strategies. The key is picking the right one.',
        showNumberLine: false,
      },
      {
        text: 'How to pick your strategy:',
        subtext: '1. Same numerator OR denominator? → Direct comparison. 2. One fraction > 1/2 and one < 1/2? → Benchmark. 3. Neither? → Common denominators.',
        showNumberLine: false,
        isStrategy: true,
      },
    ],
    checkQuestion: {
      text: 'Which strategy is fastest for 4/5 vs 4/9?',
      options: ['Benchmark test', 'Common denominators', 'Same numerator shortcut'],
      correct: 2,
      explanation: 'Both fractions have 4 on top — same numerator! So we use the shortcut: 5 < 9, so 1/5 pieces are bigger. 4/5 > 4/9!',
    },
  },
  5: {
    title: 'Show What You Know',
    slides: [
      {
        text: 'You\'ve learned THREE powerful strategies.',
        subtext: 'Today is about showing everything you know. Let\'s do a quick review!',
        showNumberLine: false,
        isReview: true,
      },
      {
        text: 'Strategy 1: Unit fractions & same numerator.',
        subtext: 'Bigger denominator = smaller fraction. Always.',
        showNumberLine: true,
        fractionA: { numerator: 1, denominator: 4 },
        fractionB: { numerator: 1, denominator: 6 },
      },
      {
        text: 'Strategy 2: Benchmark (1/2).',
        subtext: 'If they\'re on opposite sides of 1/2, the one above wins.',
        showNumberLine: true,
        fractionA: { numerator: 2, denominator: 7 },
        fractionB: { numerator: 5, denominator: 8 },
        showHalf: true,
      },
      {
        text: 'Strategy 3: Common denominators.',
        subtext: 'Make them speak the same language, then compare numerators.',
        showNumberLine: true,
        fractionA: { numerator: 2, denominator: 3 },
        fractionB: { numerator: 5, denominator: 8 },
      },
    ],
    checkQuestion: {
      text: 'You\'re ready! Are you set to take the Final Mastery Check?',
      options: ['Let\'s do it!', 'Review again'],
      correct: 0,
      explanation: 'Here we go! You\'ve got this.',
    },
  },
}

export default function PhaseLearn({ sessionNumber, onComplete, onExit }) {
  const [slideIndex, setSlideIndex] = useState(0)
  const [checkAnswered, setCheckAnswered] = useState(false)
  const [selectedOption, setSelectedOption] = useState(null)

  const content = SESSION_CONTENT[sessionNumber]
  const slides = content?.slides || []
  const totalSteps = slides.length + 1 // +1 for check question
  const isOnCheck = slideIndex === slides.length

  const currentSlide = slides[slideIndex] || null

  function handleNext() {
    if (slideIndex < slides.length) {
      setSlideIndex(slideIndex + 1)
    }
  }

  function handleCheckAnswer(optionIdx) {
    setSelectedOption(optionIdx)
    setCheckAnswered(true)
  }

  function handleFinish() {
    onComplete()
  }

  const progress = ((slideIndex + (checkAnswered ? 1 : 0)) / totalSteps) * 100

  return (
    <div
      style={{
        minHeight: '100vh',
        background: 'var(--color-bg)',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      {/* Progress indicator */}
      <div
        style={{
          background: 'white',
          borderBottom: '1.5px solid var(--color-border)',
          padding: '14px 24px',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
          <span style={{
            fontFamily: 'var(--font-display)',
            fontWeight: '700',
            fontSize: '0.85rem',
            color: 'var(--color-text-2)',
          }}>
            Session {sessionNumber} · Learn
          </span>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <span style={{
              fontFamily: 'var(--font-display)',
              fontWeight: '700',
              fontSize: '0.85rem',
              color: 'var(--color-text-3)',
            }}>
              {Math.min(slideIndex + 1, totalSteps)}/{totalSteps}
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
                aria-label="Save and return to session map"
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

      {/* Content */}
      <div
        className="container-narrow"
        style={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          paddingTop: '36px',
          paddingBottom: '36px',
          gap: '28px',
        }}
        key={slideIndex}
      >
        {!isOnCheck && currentSlide && (
          <>
            {/* Main instruction */}
            <div className="card" style={{ textAlign: 'center', padding: '36px' }}>
              <h2 style={{ marginBottom: '12px', color: 'var(--color-text-1)' }}>
                {currentSlide.text}
              </h2>
              {currentSlide.subtext && (
                <p style={{ color: 'var(--color-text-2)', fontSize: '1.05rem', lineHeight: '1.7' }}>
                  {currentSlide.subtext}
                </p>
              )}

              {/* Strategy card */}
              {currentSlide.isStrategy && (
                <div style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '12px',
                  marginTop: '24px',
                  textAlign: 'left',
                }}>
                  {[
                    { num: '1', icon: '↔️', text: 'Same numerator or denominator? Compare directly.' },
                    { num: '2', icon: '🧭', text: 'One > ½ and one < ½? Use the benchmark.' },
                    { num: '3', icon: '🔢', text: 'Neither? Find a common denominator.' },
                  ].map(s => (
                    <div key={s.num} style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '14px',
                      padding: '14px 18px',
                      background: 'var(--color-primary-light)',
                      borderRadius: 'var(--radius-md)',
                      border: '2px solid var(--color-border)',
                    }}>
                      <span style={{
                        width: 32, height: 32,
                        borderRadius: '50%',
                        background: 'var(--color-primary)',
                        color: 'white',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        fontFamily: 'var(--font-display)',
                        fontWeight: '900',
                        fontSize: '1rem',
                        flexShrink: 0,
                      }}>{s.num}</span>
                      <span style={{
                        fontFamily: 'var(--font-display)',
                        fontWeight: '700',
                        color: 'var(--color-text-1)',
                        fontSize: '0.95rem',
                      }}>{s.icon} {s.text}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Number line */}
            {currentSlide.showNumberLine && (
              <div className="card" style={{ padding: '24px 20px' }}>
                <NumberLine
                  fractionA={currentSlide.fractionA}
                  fractionB={currentSlide.fractionB}
                  showBoth={!!(currentSlide.fractionA && currentSlide.fractionB)}
                  showHalf={currentSlide.showHalf}
                  animate={true}
                  labelA={currentSlide.labelA}
                  labelB={currentSlide.labelB}
                />
              </div>
            )}

            <button
              className="btn btn-primary btn-large"
              onClick={handleNext}
              style={{ width: '100%' }}
              autoFocus
            >
              {slideIndex < slides.length - 1 ? 'Next →' : 'Got it! Check my understanding'}
            </button>
          </>
        )}

        {/* Check question */}
        {isOnCheck && (
          <>
            <div className="card" style={{ textAlign: 'center', padding: '36px' }}>
              <p style={{
                fontFamily: 'var(--font-display)',
                fontWeight: '800',
                fontSize: '0.85rem',
                color: 'var(--color-primary)',
                letterSpacing: '0.08em',
                textTransform: 'uppercase',
                marginBottom: '12px',
              }}>
                Quick check
              </p>
              <h3 style={{ fontSize: '1.2rem' }}>{content.checkQuestion.text}</h3>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {content.checkQuestion.options.map((opt, i) => {
                let btnClass = 'answer-btn'
                let style = {}
                if (checkAnswered) {
                  if (i === content.checkQuestion.correct) {
                    btnClass += ' selected-correct'
                  } else if (i === selectedOption) {
                    btnClass += ' selected-wrong'
                  }
                }
                return (
                  <button
                    key={i}
                    className={btnClass}
                    onClick={() => !checkAnswered && handleCheckAnswer(i)}
                    disabled={checkAnswered}
                    style={{ justifyContent: 'flex-start', padding: '16px 24px' }}
                  >
                    <span style={{ marginRight: '12px', opacity: 0.5 }}>
                      {String.fromCharCode(65 + i)}.
                    </span>
                    {opt}
                  </button>
                )
              })}
            </div>

            {checkAnswered && (
              <div
                className={`feedback-box ${selectedOption === content.checkQuestion.correct ? 'success' : 'try-again'} animate-fade-in`}
              >
                {selectedOption === content.checkQuestion.correct
                  ? '✓ ' + content.checkQuestion.explanation
                  : 'Not quite — ' + content.checkQuestion.explanation
                }
              </div>
            )}

            {checkAnswered && (
              <button
                className="btn btn-primary btn-large animate-pop-in"
                onClick={handleFinish}
                style={{ width: '100%' }}
                autoFocus
              >
                {selectedOption === content.checkQuestion.correct
                  ? 'Ready to practice! →'
                  : 'Got it — let\'s practice! →'}
              </button>
            )}
          </>
        )}
      </div>
    </div>
  )
}
