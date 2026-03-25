// FractionQuest Storage Layer
// All persistence via localStorage with structured schema
// Designed to migrate to a backend DB in V2 without structural changes

const STORAGE_KEY = 'fractionquest_student'

const defaultMisconceptionProfile = () => ({
  'WNB-D': { totalOccurrences: 0, resolved: false, lastSeen: null },
  'WNB-N': { totalOccurrences: 0, resolved: false, lastSeen: null },
  'BENCH': { totalOccurrences: 0, resolved: false, lastSeen: null },
  'EQUIV': { totalOccurrences: 0, resolved: false, lastSeen: null },
  'PROC':  { totalOccurrences: 0, resolved: false, lastSeen: null },
})

const defaultSession = (sessionNumber) => ({
  sessionNumber,
  startedAt: null,
  completedAt: null,
  currentPhase: 'learn', // 'learn' | 'practice' | 'check'
  learnPhaseCompleted: false,
  practiceResponses: [],
  masteryCheckScore: null,
  masteryCheckResponses: [],
  phaseStartedAt: null,
})

export function loadStudent() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return null
    return JSON.parse(raw)
  } catch {
    return null
  }
}

export function createStudent(name) {
  const student = {
    studentId: `stu_${Date.now()}`,
    studentName: name,
    createdAt: new Date().toISOString(),
    currentSession: 1,
    currentPhase: 'learn',
    sessionHistory: [1, 2, 3, 4, 5].map(n => defaultSession(n)),
    misconceptionProfile: defaultMisconceptionProfile(),
    masteryStatus: 'not_started',
    currentDifficultyTier: 1,
    consecutiveCorrectByMisconception: {},
    _lastSaved: new Date().toISOString(),
  }
  saveStudent(student)
  return student
}

export function saveStudent(student) {
  try {
    const updated = { ...student, _lastSaved: new Date().toISOString() }
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated))
    return updated
  } catch {
    console.warn('FractionQuest: failed to save student data')
    return student
  }
}

export function clearStudent() {
  localStorage.removeItem(STORAGE_KEY)
}

/**
 * Record a practice response and persist immediately.
 * Called after every answer so tab-close doesn't lose progress.
 */
export function recordPracticeResponse(student, sessionNumber, response) {
  const sessions = [...student.sessionHistory]
  const idx = sessions.findIndex(s => s.sessionNumber === sessionNumber)
  if (idx === -1) return student

  const session = { ...sessions[idx] }
  session.practiceResponses = [...session.practiceResponses, response]
  sessions[idx] = session

  const updated = { ...student, sessionHistory: sessions }

  // Update misconception profile if there was an error
  if (!response.isCorrect && response.detectedMisconception && response.detectedMisconception !== 'generic') {
    const profile = { ...updated.misconceptionProfile }
    const key = response.detectedMisconception
    profile[key] = {
      ...profile[key],
      totalOccurrences: (profile[key].totalOccurrences || 0) + 1,
      lastSeen: response.timestamp,
    }
    updated.misconceptionProfile = profile
  }

  return saveStudent(updated)
}

/**
 * Record a mastery check response. Returns updated student.
 */
export function recordCheckResponse(student, sessionNumber, response) {
  const sessions = [...student.sessionHistory]
  const idx = sessions.findIndex(s => s.sessionNumber === sessionNumber)
  if (idx === -1) return student

  const session = { ...sessions[idx] }
  session.masteryCheckResponses = [...session.masteryCheckResponses, response]
  sessions[idx] = session

  return saveStudent({ ...student, sessionHistory: sessions })
}

/**
 * Complete the mastery check for a session. Scores it and updates masteryStatus.
 */
export function completeCheck(student, sessionNumber) {
  const sessions = [...student.sessionHistory]
  const idx = sessions.findIndex(s => s.sessionNumber === sessionNumber)
  if (idx === -1) return student

  const session = { ...sessions[idx] }
  const responses = session.masteryCheckResponses
  const correct = responses.filter(r => r.isCorrect).length
  const score = correct

  session.masteryCheckScore = score
  session.completedAt = new Date().toISOString()
  session.currentPhase = 'done'
  sessions[idx] = session

  // Check overall mastery: sessions 3,4,5 each need ≥9/10
  let masteryStatus = student.masteryStatus
  if (sessionNumber === 5) {
    const checkScores = sessions
      .filter(s => [3, 4, 5].includes(s.sessionNumber))
      .map(s => s.masteryCheckScore)

    const allPassed = checkScores.length === 3 && checkScores.every(s => s >= 9)
    masteryStatus = allPassed ? 'achieved' : 'not_achieved'
  } else if (masteryStatus === 'not_started') {
    masteryStatus = 'in_progress'
  }

  return saveStudent({
    ...student,
    sessionHistory: sessions,
    masteryStatus,
    currentSession: sessionNumber < 5 ? sessionNumber + 1 : sessionNumber,
  })
}

/**
 * Advance a session phase.
 */
export function advancePhase(student, sessionNumber, toPhase) {
  const sessions = [...student.sessionHistory]
  const idx = sessions.findIndex(s => s.sessionNumber === sessionNumber)
  if (idx === -1) return student

  const session = { ...sessions[idx] }
  session.currentPhase = toPhase
  session.phaseStartedAt = new Date().toISOString()

  if (toPhase === 'practice' || toPhase === 'check') {
    session.learnPhaseCompleted = true
  }

  if (!session.startedAt) {
    session.startedAt = new Date().toISOString()
  }

  sessions[idx] = session
  return saveStudent({ ...student, sessionHistory: sessions, currentSession: sessionNumber })
}

/**
 * Export all student data as a JSON string for parent backup.
 */
export function exportData(student) {
  const data = JSON.stringify(student, null, 2)
  const blob = new Blob([data], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `fractionquest-${student.studentName.replace(/\s+/g, '-')}-${new Date().toISOString().slice(0, 10)}.json`
  a.click()
  URL.revokeObjectURL(url)
}

/**
 * Import student data from a backup file.
 */
export function importData(jsonString) {
  try {
    const data = JSON.parse(jsonString)
    if (!data.studentId || !data.studentName) throw new Error('Invalid backup file')
    saveStudent(data)
    return data
  } catch {
    throw new Error('Could not read backup file. Please check that it is a valid FractionQuest backup.')
  }
}
