import { useState } from 'react'
import { createStudent } from '../lib/storage.js'

export default function Welcome({ onStart }) {
  const [name, setName] = useState('')
  const [submitting, setSubmitting] = useState(false)

  function handleStart() {
    if (!name.trim()) return
    setSubmitting(true)
    const student = createStudent(name.trim())
    setTimeout(() => onStart(student), 300)
  }

  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '32px 24px',
        background: 'linear-gradient(160deg, #F0EFFE 0%, #F5F4FF 50%, #EEF2FF 100%)',
      }}
      className="animate-fade-in"
    >
      {/* Logo mark */}
      <div
        style={{
          width: 80,
          height: 80,
          background: 'var(--color-primary)',
          borderRadius: '24px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '2.2rem',
          marginBottom: '20px',
          boxShadow: '0 8px 32px rgba(79,70,229,0.3)',
        }}
      >
        ÷
      </div>

      <h1
        style={{
          textAlign: 'center',
          marginBottom: '8px',
          fontSize: '2.8rem',
          color: 'var(--color-primary)',
        }}
      >
        FractionQuest
      </h1>

      <p
        style={{
          textAlign: 'center',
          color: 'var(--color-text-2)',
          fontSize: '1.15rem',
          maxWidth: '420px',
          lineHeight: '1.6',
          marginBottom: '40px',
        }}
      >
        Become a fraction comparison champion in just 5 sessions. You'll learn secret shortcuts that make hard fractions easy!
      </p>

      {/* Feature pills */}
      <div
        style={{
          display: 'flex',
          gap: '10px',
          flexWrap: 'wrap',
          justifyContent: 'center',
          marginBottom: '40px',
        }}
      >
        {[
          { icon: '📏', text: '5 sessions' },
          { icon: '🎯', text: 'Learn at your pace' },
          { icon: '⭐', text: 'Earn mastery' },
        ].map(f => (
          <span
            key={f.text}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              padding: '8px 16px',
              background: 'white',
              borderRadius: '100px',
              border: '2px solid var(--color-border)',
              fontSize: '0.9rem',
              fontFamily: 'var(--font-display)',
              fontWeight: '700',
              color: 'var(--color-text-2)',
            }}
          >
            {f.icon} {f.text}
          </span>
        ))}
      </div>

      {/* Name entry */}
      <div
        style={{
          background: 'white',
          borderRadius: 'var(--radius-xl)',
          border: '2px solid var(--color-border)',
          padding: '36px',
          width: '100%',
          maxWidth: '420px',
          boxShadow: 'var(--shadow-lg)',
        }}
      >
        <p
          style={{
            fontFamily: 'var(--font-display)',
            fontWeight: '800',
            fontSize: '1.2rem',
            marginBottom: '16px',
            color: 'var(--color-text-1)',
          }}
        >
          What's your name?
        </p>
        <input
          type="text"
          value={name}
          onChange={e => setName(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && handleStart()}
          placeholder="Type your name..."
          autoFocus
          style={{
            width: '100%',
            padding: '14px 18px',
            fontSize: '1.1rem',
            fontFamily: 'var(--font-display)',
            fontWeight: '700',
            border: '2.5px solid var(--color-border)',
            borderRadius: 'var(--radius-md)',
            outline: 'none',
            color: 'var(--color-text-1)',
            background: 'var(--color-bg)',
            transition: 'border-color 0.15s ease',
            boxSizing: 'border-box',
          }}
          onFocus={e => e.target.style.borderColor = 'var(--color-primary)'}
          onBlur={e => e.target.style.borderColor = 'var(--color-border)'}
          aria-label="Enter your name"
        />
        <button
          className="btn btn-primary btn-large"
          onClick={handleStart}
          disabled={!name.trim() || submitting}
          style={{ width: '100%', marginTop: '16px' }}
        >
          {submitting ? 'Starting...' : "Let's go!"}
        </button>
      </div>

      {/* Parent mode hint */}
      <p
        style={{
          marginTop: '24px',
          fontSize: '0.85rem',
          color: 'var(--color-text-3)',
          textAlign: 'center',
        }}
      >
        Parent? <button
          onClick={() => onStart(null, true)}
          style={{
            background: 'none',
            border: 'none',
            color: 'var(--color-primary)',
            cursor: 'pointer',
            fontFamily: 'var(--font-display)',
            fontWeight: '700',
            fontSize: '0.85rem',
            textDecoration: 'underline',
          }}
        >
          View progress dashboard
        </button>
      </p>
    </div>
  )
}
