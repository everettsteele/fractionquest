// Misconception Detection Engine
// Infers what went wrong from the student's answer + item metadata
// No UI strategy selector — we read the answer pattern
//
// Taxonomy:
//   WNB-D  Whole Number Bias — Denominator: bigger denominator chosen as bigger fraction
//   WNB-N  Whole Number Bias — Numerator: picks fraction with larger N and larger D when it's actually smaller
//   BENCH  Benchmark Reasoning Failure: wrong cross-1/2 classification
//   EQUIV  Equivalent Fraction Error: treats equivalent fractions as unequal
//   PROC   Procedural Error: catches remaining wrong-answer patterns in common-denominator problems

/**
 * Detect which misconception pattern produced this wrong answer.
 * Called only when studentAnswer !== correctAnswer.
 *
 * @param {Object} item - The question item
 * @param {string} studentAnswer - 'A > B' | 'A < B' | 'A = B'
 * @returns {string|null} misconception ID or null
 */
export function detectMisconception(item, studentAnswer) {
  const { fractionA, fractionB, correctAnswer, primaryStrategy } = item
  const { numerator: aN, denominator: aD } = fractionA
  const { numerator: bN, denominator: bD } = fractionB

  // Student was correct — no misconception
  if (studentAnswer === correctAnswer) return null

  // EQUIV: Correct answer is A = B but student chose a side
  if (correctAnswer === 'A = B') {
    return 'EQUIV'
  }

  // WNB-D: Student chose the fraction with larger denominator as larger
  // Strongest signal: same numerators (unit fractions or same-numerator)
  if (aN === bN) {
    // Same numerator: correct rule is larger denominator → smaller fraction
    // Student said A > B when aD > bD (wrong — aD bigger means A is smaller)
    // or student said A < B when bD > aD (wrong — bD bigger means B is smaller, so A > B)
    const studentPickedLargerDenom =
      (studentAnswer === 'A > B' && aD > bD) ||
      (studentAnswer === 'A < B' && bD > aD)
    if (studentPickedLargerDenom) return 'WNB-D'
  }

  // WNB-D for unit fractions specifically (numerator=1)
  if (aN === 1 && bN === 1) {
    const studentPickedLargerDenom =
      (studentAnswer === 'A > B' && aD > bD) ||
      (studentAnswer === 'A < B' && bD > aD)
    if (studentPickedLargerDenom) return 'WNB-D'
  }

  // WNB-N: Student picked fraction with larger numerator AND larger denominator,
  // but that fraction is actually smaller
  const aVal = aN / aD
  const bVal = bN / bD

  if (studentAnswer === 'A > B' && correctAnswer === 'A < B') {
    // Student picked A as larger
    if (aN >= bN && aD >= bD) return 'WNB-N'
  }
  if (studentAnswer === 'A < B' && correctAnswer === 'A > B') {
    // Student picked B as larger
    if (bN >= aN && bD >= aD) return 'WNB-N'
  }

  // BENCH: Problem is benchmark-solvable, and student failed it
  // One fraction is clearly > 1/2, one is clearly < 1/2
  const aGTHalf = aN * 2 > aD
  const aLTHalf = aN * 2 < aD
  const bGTHalf = bN * 2 > bD
  const bLTHalf = bN * 2 < bD

  if ((aGTHalf && bLTHalf) || (aLTHalf && bGTHalf)) {
    // Benchmark applies here
    return 'BENCH'
  }

  // PROC: Remaining wrong answers on common-denominator type problems
  if (primaryStrategy === 'commonDenominator' || primaryStrategy === 'commonNumerator') {
    return 'PROC'
  }

  return 'generic'
}

/**
 * Mark a misconception as "resolved" if student correctly answers
 * 3 consecutive problems in a row that target that misconception.
 */
export function evaluateMisconceptionResolution(profile, misconceptionId, consecutiveCorrectCount) {
  if (consecutiveCorrectCount >= 3) {
    return { ...profile[misconceptionId], resolved: true }
  }
  return profile[misconceptionId]
}

/**
 * Get the most pressing unresolved misconception for targeted practice.
 * Returns null if all are resolved or none have occurred.
 */
export function getPriorityMisconception(profile) {
  const order = ['WNB-D', 'WNB-N', 'BENCH', 'EQUIV', 'PROC']
  return order.find(id =>
    profile[id] &&
    profile[id].totalOccurrences > 0 &&
    !profile[id].resolved
  ) || null
}
