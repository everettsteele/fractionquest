import { useState, useCallback } from 'react'
import { loadStudent } from './lib/storage.js'
import { advancePhase } from './lib/storage.js'

import Welcome from './views/Welcome.jsx'
import SessionMap from './views/SessionMap.jsx'
import PhaseLearn from './views/PhaseLearn.jsx'
import PhasePractice from './views/PhasePractice.jsx'
import PhaseCheck from './views/PhaseCheck.jsx'
import ParentDashboard from './views/ParentDashboard.jsx'
import MasteryComplete from './views/MasteryComplete.jsx'

// Top-level routing states
// welcome → map → session(learn|practice|check) → map | mastery

export default function App() {
  const [student, setStudent] = useState(() => loadStudent())
  const [view, setView] = useState(() => {
    const s = loadStudent()
    if (!s) return 'welcome'
    return 'map'
  })
  const [activeSession, setActiveSession] = useState(null)
  const [activePhase, setActivePhase] = useState(null) // 'learn' | 'practice' | 'check'
  const [showParent, setShowParent] = useState(false)

  const updateStudent = useCallback((updated) => {
    setStudent(updated)
  }, [])

  // Welcome → Map (or Parent)
  function handleWelcomeStart(newStudent, goToParent = false) {
    if (goToParent && student) {
      setShowParent(true)
      setView('map')
      return
    }
    setStudent(newStudent)
    setView('map')
  }

  // Map → Continue (go to current session, current phase)
  function handleContinue() {
    const s = student
    const sessionNum = s.currentSession
    const sessionData = s.sessionHistory.find(h => h.sessionNumber === sessionNum)
    const phase = sessionData?.currentPhase || 'learn'

    setActiveSession(sessionNum)
    setActivePhase(phase === 'done' ? 'learn' : phase)
    setView('session')
  }

  // Map → Specific session
  function handleGoToSession(sessionNum) {
    const sessionData = student.sessionHistory.find(h => h.sessionNumber === sessionNum)
    const phase = sessionData?.currentPhase || 'learn'

    setActiveSession(sessionNum)
    setActivePhase(phase === 'done' ? 'learn' : phase)
    setView('session')
  }

  // Learn phase complete → Practice
  function handleLearnComplete() {
    const updated = advancePhase(student, activeSession, 'practice')
    setStudent(updated)
    setActivePhase('practice')
  }

  // Practice complete → Check (sessions 3-5) or back to map (sessions 1-2)
  function handlePracticeComplete() {
    if (activeSession >= 3) {
      const updated = advancePhase(student, activeSession, 'check')
      setStudent(updated)
      setActivePhase('check')
    } else {
      // Sessions 1-2: practice → done, back to map
      const updated = advancePhase(student, activeSession, 'done')
      // Mark session complete
      const sessions = [...updated.sessionHistory]
      const idx = sessions.findIndex(s => s.sessionNumber === activeSession)
      if (idx !== -1) {
        sessions[idx] = { ...sessions[idx], completedAt: new Date().toISOString(), currentPhase: 'done' }
      }
      const final = { ...updated, sessionHistory: sessions }
      setStudent(final)
      setView('map')
      setActiveSession(null)
      setActivePhase(null)
    }
  }

  // Check complete → Map or Mastery
  function handleCheckComplete(score) {
    // Student state already updated by PhaseCheck via completeCheck()
    // Just reload from state
    const latest = student

    if (latest.masteryStatus === 'achieved') {
      setView('mastery')
    } else {
      setView('map')
    }
    setActiveSession(null)
    setActivePhase(null)
  }

  // Back to map from anywhere in a session
  function handleBackToMap() {
    setView('map')
    setActiveSession(null)
    setActivePhase(null)
  }

  // Reset (from parent dashboard)
  function handleReset() {
    setStudent(null)
    setView('welcome')
    setShowParent(false)
    setActiveSession(null)
    setActivePhase(null)
  }

  // --- Render ---

  if (!student && view === 'welcome') {
    return <Welcome onStart={handleWelcomeStart} />
  }

  if (view === 'mastery') {
    return <MasteryComplete student={student} onBack={() => setView('map')} />
  }

  if (showParent && view === 'map') {
    return (
      <ParentDashboard
        student={student}
        onBack={() => setShowParent(false)}
        onReset={handleReset}
      />
    )
  }

  if (view === 'map') {
    return (
      <SessionMap
        student={student}
        onContinue={handleContinue}
        onGoToSession={handleGoToSession}
        onParentDashboard={() => setShowParent(true)}
      />
    )
  }

  if (view === 'session' && activeSession) {
    return (
      <div style={{ position: 'relative' }}>
        {/* Back button overlay */}
        <button
          onClick={handleBackToMap}
          style={{
            position: 'fixed',
            top: 14,
            right: 20,
            zIndex: 200,
            background: 'white',
            border: '2px solid var(--color-border)',
            borderRadius: 'var(--radius-sm)',
            padding: '6px 12px',
            cursor: 'pointer',
            fontFamily: 'var(--font-display)',
            fontWeight: '700',
            fontSize: '0.82rem',
            color: 'var(--color-text-2)',
            boxShadow: 'var(--shadow-sm)',
          }}
          aria-label="Save and return to session map"
        >
          Save & exit
        </button>

        {activePhase === 'learn' && (
          <PhaseLearn
            sessionNumber={activeSession}
            onComplete={handleLearnComplete}
          />
        )}

        {activePhase === 'practice' && (
          <PhasePractice
            student={student}
            sessionNumber={activeSession}
            onComplete={handlePracticeComplete}
            onUpdateStudent={updateStudent}
          />
        )}

        {activePhase === 'check' && (
          <PhaseCheck
            student={student}
            sessionNumber={activeSession}
            onComplete={handleCheckComplete}
            onUpdateStudent={updateStudent}
          />
        )}
      </div>
    )
  }

  // Fallback — shouldn't hit this
  return <Welcome onStart={handleWelcomeStart} />
}
