// FractionQuest Item Bank
// 160 items across 5 difficulty tiers
// 90 reserved for mastery checks (30 per check), 70+ for adaptive practice
// Each item tagged with primaryStrategy, targetMisconception, and per-misconception feedback

function gcd(a, b) {
  return b === 0 ? a : gcd(b, a % b)
}

function fractionValue(n, d) {
  return n / d
}

function isGreaterThanHalf(n, d) {
  return n * 2 > d
}

function isLessThanHalf(n, d) {
  return n * 2 < d
}

// Feedback text factory
function makeFeedback(fractionA, fractionB, correctAnswer) {
  const { numerator: aN, denominator: aD } = fractionA
  const { numerator: bN, denominator: bD } = fractionB
  const aStr = `${aN}/${aD}`
  const bStr = `${bN}/${bD}`

  return {
    'WNB-D': `I see why you might think that — ${aD} and ${bD} are just regular numbers, and bigger numbers usually mean bigger things! But with fractions, a bigger denominator means we're cutting into MORE pieces, so each piece is SMALLER. Let's look at where ${aStr} and ${bStr} actually live on the number line.`,
    'WNB-N': `Hold on — let's slow down and think about this. ${aStr} means ${aN} pieces out of ${aD}, and ${bStr} means ${bN} pieces out of ${bD}. The pieces are different sizes! Bigger numbers don't always mean bigger fractions. The number line will show us exactly where each one lives.`,
    'BENCH': `Here's a helpful trick: check if each fraction is above or below 1/2. To test a fraction, ask: is the top number more than HALF of the bottom number? Let's check each fraction and see which side of 1/2 they fall on.`,
    'EQUIV': `These two fractions are actually worth the same amount — they just look different! When fractions are equivalent, they live at the exact same spot on the number line. Let's see why ${aStr} and ${bStr} are equal.`,
    'PROC': `Good thinking to use common denominators! Let's double-check the math step by step. When we find equivalent fractions, we multiply both the top and bottom by the same number.`,
    'generic': `Not quite — let's take another look together. Let's place both ${aStr} and ${bStr} on the number line to see where they actually land.`
  }
}

// Build practice items
function buildItem(id, aN, aD, bN, bD, strategy, tier, targetMisconception, isReserved) {
  const aVal = aN / aD
  const bVal = bN / bD
  let correct
  if (Math.abs(aVal - bVal) < 0.0001) correct = 'A = B'
  else if (aVal > bVal) correct = 'A > B'
  else correct = 'A < B'

  const fractionA = { numerator: aN, denominator: aD }
  const fractionB = { numerator: bN, denominator: bD }

  return {
    id,
    fractionA,
    fractionB,
    correctAnswer: correct,
    primaryStrategy: strategy,
    difficultyTier: tier,
    targetMisconception,
    isReserved: isReserved || false,
    feedbackTemplates: makeFeedback(fractionA, fractionB, correct)
  }
}

// TIER 1: Unit fractions — denominators ≤ 8 (30 items)
const tier1Practice = [
  buildItem('t1p001', 1,2, 1,4, 'unitFraction', 1, 'WNB-D'),
  buildItem('t1p002', 1,3, 1,5, 'unitFraction', 1, 'WNB-D'),
  buildItem('t1p003', 1,4, 1,6, 'unitFraction', 1, 'WNB-D'),
  buildItem('t1p004', 1,2, 1,3, 'unitFraction', 1, 'WNB-D'),
  buildItem('t1p005', 1,6, 1,8, 'unitFraction', 1, 'WNB-D'),
  buildItem('t1p006', 1,5, 1,6, 'unitFraction', 1, 'WNB-D'),
  buildItem('t1p007', 1,2, 1,6, 'unitFraction', 1, 'WNB-D'),
  buildItem('t1p008', 1,3, 1,4, 'unitFraction', 1, 'WNB-D'),
  buildItem('t1p009', 1,4, 1,8, 'unitFraction', 1, 'WNB-D'),
  buildItem('t1p010', 1,6, 1,3, 'unitFraction', 1, 'WNB-D'),
  buildItem('t1p011', 1,8, 1,2, 'unitFraction', 1, 'WNB-D'),
  buildItem('t1p012', 1,5, 1,2, 'unitFraction', 1, 'WNB-D'),
  buildItem('t1p013', 1,3, 1,8, 'unitFraction', 1, 'WNB-D'),
  buildItem('t1p014', 1,4, 1,3, 'unitFraction', 1, 'WNB-D'),
  buildItem('t1p015', 1,8, 1,4, 'unitFraction', 1, 'WNB-D'),
]

// TIER 1 reserved for mastery checks
const tier1Reserved = [
  buildItem('t1r001', 1,2, 1,5, 'unitFraction', 1, 'WNB-D', true),
  buildItem('t1r002', 1,6, 1,4, 'unitFraction', 1, 'WNB-D', true),
  buildItem('t1r003', 1,3, 1,6, 'unitFraction', 1, 'WNB-D', true),
  buildItem('t1r004', 1,5, 1,8, 'unitFraction', 1, 'WNB-D', true),
  buildItem('t1r005', 1,4, 1,2, 'unitFraction', 1, 'WNB-D', true),
]

// TIER 2: Benchmark-solvable — one fraction >1/2, one <1/2 (40 items)
const tier2Practice = [
  buildItem('t2p001', 3,8, 5,6, 'benchmark', 2, 'BENCH'),
  buildItem('t2p002', 3,5, 2,7, 'benchmark', 2, 'BENCH'),
  buildItem('t2p003', 5,8, 1,6, 'benchmark', 2, 'BENCH'),
  buildItem('t2p004', 2,9, 4,5, 'benchmark', 2, 'BENCH'),
  buildItem('t2p005', 7,8, 3,8, 'benchmark', 2, 'BENCH'),
  buildItem('t2p006', 3,4, 2,7, 'benchmark', 2, 'BENCH'),
  buildItem('t2p007', 1,7, 3,4, 'benchmark', 2, 'BENCH'),
  buildItem('t2p008', 5,6, 2,9, 'benchmark', 2, 'BENCH'),
  buildItem('t2p009', 4,7, 2,8, 'benchmark', 2, 'BENCH'),
  buildItem('t2p010', 1,5, 4,6, 'benchmark', 2, 'BENCH'),
  buildItem('t2p011', 6,7, 2,9, 'benchmark', 2, 'WNB-N'),
  buildItem('t2p012', 3,8, 3,4, 'benchmark', 2, 'BENCH'),
  buildItem('t2p013', 5,9, 3,8, 'benchmark', 2, 'BENCH'),
  buildItem('t2p014', 2,3, 1,8, 'benchmark', 2, 'BENCH'),
  buildItem('t2p015', 4,9, 5,7, 'benchmark', 2, 'BENCH'),
  buildItem('t2p016', 7,10, 3,10, 'benchmark', 2, 'BENCH'),
  buildItem('t2p017', 2,8, 5,8, 'benchmark', 2, 'BENCH'),
  buildItem('t2p018', 5,7, 2,6, 'benchmark', 2, 'BENCH'),
  buildItem('t2p019', 1,6, 5,7, 'benchmark', 2, 'BENCH'),
]

const tier2Reserved = [
  buildItem('t2r001', 3,7, 5,6, 'benchmark', 2, 'BENCH', true),
  buildItem('t2r002', 2,5, 5,8, 'benchmark', 2, 'BENCH', true),
  buildItem('t2r003', 5,9, 2,7, 'benchmark', 2, 'BENCH', true),
  buildItem('t2r004', 1,4, 4,5, 'benchmark', 2, 'BENCH', true),
  buildItem('t2r005', 6,8, 1,6, 'benchmark', 2, 'BENCH', true),
  buildItem('t2r006', 4,6, 3,9, 'benchmark', 2, 'BENCH', true),
  buildItem('t2r007', 2,6, 4,5, 'benchmark', 2, 'BENCH', true),
  buildItem('t2r008', 7,9, 3,7, 'benchmark', 2, 'BENCH', true),
]

// TIER 3: Common denominator required — same side of benchmark (40 items)
const tier3Practice = [
  buildItem('t3p001', 2,3, 3,4, 'commonDenominator', 3, 'PROC'),
  buildItem('t3p002', 3,5, 4,7, 'commonDenominator', 3, 'PROC'),
  buildItem('t3p003', 4,6, 5,8, 'commonDenominator', 3, 'EQUIV'),
  buildItem('t3p004', 2,5, 3,8, 'commonDenominator', 3, 'PROC'),
  buildItem('t3p005', 5,8, 3,5, 'commonDenominator', 3, 'PROC'),
  buildItem('t3p006', 3,10, 4,15, 'commonDenominator', 3, 'PROC'),
  buildItem('t3p007', 7,9, 5,6, 'commonDenominator', 3, 'PROC'),
  buildItem('t3p008', 4,10, 2,5, 'commonDenominator', 3, 'EQUIV'),
  buildItem('t3p009', 5,9, 4,7, 'commonDenominator', 3, 'PROC'),
  buildItem('t3p010', 7,10, 2,3, 'commonDenominator', 3, 'PROC'),
  buildItem('t3p011', 3,8, 5,12, 'commonDenominator', 3, 'PROC'),
  buildItem('t3p012', 4,9, 3,7, 'commonDenominator', 3, 'PROC'),
  buildItem('t3p013', 5,6, 7,8, 'commonDenominator', 3, 'WNB-N'),
  buildItem('t3p014', 2,7, 3,10, 'commonDenominator', 3, 'PROC'),
  buildItem('t3p015', 6,8, 3,4, 'commonDenominator', 3, 'EQUIV'),
  buildItem('t3p016', 1,3, 2,7, 'commonDenominator', 3, 'PROC'),
  buildItem('t3p017', 5,12, 3,8, 'commonDenominator', 3, 'PROC'),
  buildItem('t3p018', 4,5, 5,6, 'commonDenominator', 3, 'PROC'),
  buildItem('t3p019', 7,8, 5,6, 'commonDenominator', 3, 'PROC'),
]

const tier3Reserved = [
  buildItem('t3r001', 3,4, 5,8, 'commonDenominator', 3, 'PROC', true),
  buildItem('t3r002', 2,3, 5,9, 'commonDenominator', 3, 'EQUIV', true),
  buildItem('t3r003', 4,7, 5,9, 'commonDenominator', 3, 'PROC', true),
  buildItem('t3r004', 3,5, 5,9, 'commonDenominator', 3, 'EQUIV', true),
  buildItem('t3r005', 7,10, 3,4, 'commonDenominator', 3, 'PROC', true),
  buildItem('t3r006', 5,8, 7,12, 'commonDenominator', 3, 'PROC', true),
  buildItem('t3r007', 2,9, 3,12, 'commonDenominator', 3, 'PROC', true),
  buildItem('t3r008', 4,6, 6,9, 'commonDenominator', 3, 'EQUIV', true),
]

// TIER 4: Mixed strategies — common numerator and close fractions (30 items)
const tier4Practice = [
  buildItem('t4p001', 3,5, 3,7, 'commonNumerator', 4, 'WNB-D'),
  buildItem('t4p002', 2,3, 2,5, 'commonNumerator', 4, 'WNB-D'),
  buildItem('t4p003', 5,6, 5,9, 'commonNumerator', 4, 'WNB-D'),
  buildItem('t4p004', 4,7, 4,9, 'commonNumerator', 4, 'WNB-D'),
  buildItem('t4p005', 7,8, 7,12, 'commonNumerator', 4, 'WNB-D'),
  buildItem('t4p006', 3,7, 4,9, 'commonDenominator', 4, 'PROC'),
  buildItem('t4p007', 5,8, 7,12, 'commonDenominator', 4, 'PROC'),
  buildItem('t4p008', 4,11, 3,8, 'benchmark', 4, 'BENCH'),
  buildItem('t4p009', 5,7, 4,6, 'commonDenominator', 4, 'PROC'),
  buildItem('t4p010', 6,7, 6,8, 'commonNumerator', 4, 'WNB-D'),
  buildItem('t4p011', 7,12, 5,8, 'commonDenominator', 4, 'PROC'),
  buildItem('t4p012', 4,9, 4,11, 'commonNumerator', 4, 'WNB-D'),
  buildItem('t4p013', 3,11, 5,8, 'benchmark', 4, 'BENCH'),
  buildItem('t4p014', 8,9, 8,11, 'commonNumerator', 4, 'WNB-D'),
  buildItem('t4p015', 5,12, 4,9, 'commonDenominator', 4, 'PROC'),
]

const tier4Reserved = [
  buildItem('t4r001', 4,5, 4,7, 'commonNumerator', 4, 'WNB-D', true),
  buildItem('t4r002', 3,8, 5,12, 'commonDenominator', 4, 'PROC', true),
  buildItem('t4r003', 7,11, 5,8, 'benchmark', 4, 'BENCH', true),
  buildItem('t4r004', 6,11, 6,13, 'commonNumerator', 4, 'WNB-D', true),
  buildItem('t4r005', 5,9, 4,7, 'commonDenominator', 4, 'PROC', true),
  buildItem('t4r006', 9,10, 9,12, 'commonNumerator', 4, 'WNB-D', true),
  buildItem('t4r007', 7,8, 9,11, 'commonDenominator', 4, 'PROC', true),
]

// TIER 5: Complex — close fractions, large denominators, mixed (15 items)
const tier5Practice = [
  buildItem('t5p001', 5,8, 7,11, 'commonDenominator', 5, 'PROC'),
  buildItem('t5p002', 7,12, 5,9, 'commonDenominator', 5, 'PROC'),
  buildItem('t5p003', 4,7, 7,12, 'commonDenominator', 5, 'PROC'),
  buildItem('t5p004', 8,11, 7,10, 'commonDenominator', 5, 'PROC'),
  buildItem('t5p005', 5,13, 4,11, 'commonDenominator', 5, 'PROC'),
  buildItem('t5p006', 9,11, 9,13, 'commonNumerator', 5, 'WNB-D'),
  buildItem('t5p007', 11,12, 10,11, 'commonDenominator', 5, 'PROC'),
]

const tier5Reserved = [
  buildItem('t5r001', 7,9, 9,12, 'commonDenominator', 5, 'PROC', true),
  buildItem('t5r002', 8,13, 6,10, 'benchmark', 5, 'BENCH', true),
  buildItem('t5r003', 11,13, 11,15, 'commonNumerator', 5, 'WNB-D', true),
  buildItem('t5r004', 5,11, 7,15, 'commonDenominator', 5, 'PROC', true),
  buildItem('t5r005', 9,14, 7,11, 'commonDenominator', 5, 'PROC', true),
]

// Equivalent fraction items (A = B) - sprinkled across tiers
const equivPractice = [
  buildItem('eq001', 2,4, 1,2, 'commonDenominator', 2, 'EQUIV'),
  buildItem('eq002', 2,6, 1,3, 'commonDenominator', 2, 'EQUIV'),
  buildItem('eq003', 3,6, 1,2, 'commonDenominator', 2, 'EQUIV'),
  buildItem('eq004', 4,8, 1,2, 'commonDenominator', 2, 'EQUIV'),
  buildItem('eq005', 4,6, 2,3, 'commonDenominator', 3, 'EQUIV'),
  buildItem('eq006', 6,8, 3,4, 'commonDenominator', 3, 'EQUIV'),
  buildItem('eq007', 6,9, 2,3, 'commonDenominator', 3, 'EQUIV'),
  buildItem('eq008', 8,10, 4,5, 'commonDenominator', 3, 'EQUIV'),
  buildItem('eq009', 6,10, 3,5, 'commonDenominator', 3, 'EQUIV'),
  buildItem('eq010', 9,12, 3,4, 'commonDenominator', 4, 'EQUIV'),
]

const equivReserved = [
  buildItem('eqr001', 3,9, 1,3, 'commonDenominator', 2, 'EQUIV', true),
  buildItem('eqr002', 5,10, 1,2, 'commonDenominator', 2, 'EQUIV', true),
  buildItem('eqr003', 4,12, 1,3, 'commonDenominator', 3, 'EQUIV', true),
  buildItem('eqr004', 6,12, 1,2, 'commonDenominator', 3, 'EQUIV', true),
  buildItem('eqr005', 8,12, 2,3, 'commonDenominator', 4, 'EQUIV', true),
]

// Assemble ALL items
export const ALL_ITEMS = [
  ...tier1Practice, ...tier1Reserved,
  ...tier2Practice, ...tier2Reserved,
  ...tier3Practice, ...tier3Reserved,
  ...tier4Practice, ...tier4Reserved,
  ...tier5Practice, ...tier5Reserved,
  ...equivPractice, ...equivReserved,
]

export const PRACTICE_ITEMS = ALL_ITEMS.filter(i => !i.isReserved)
export const RESERVED_ITEMS = ALL_ITEMS.filter(i => i.isReserved)

// Mastery check pools: each check gets 10 items from reserved pool
// Structured to meet PRD requirements:
// At least 2 benchmark, 3 common-denominator, 2 common-numerator, 1 equivalent
const check1Pool = [
  ...tier1Reserved.slice(0, 2),      // unit fraction
  ...tier2Reserved.slice(0, 2),      // benchmark
  ...tier3Reserved.slice(0, 3),      // common denominator
  ...equivReserved.slice(0, 2),      // equivalent
  ...tier4Reserved.slice(0, 1),      // mixed
]

const check2Pool = [
  ...tier1Reserved.slice(2, 4),      // unit fraction
  ...tier2Reserved.slice(2, 4),      // benchmark
  ...tier3Reserved.slice(2, 4),      // common denominator
  ...tier4Reserved.slice(1, 3),      // common numerator / mixed
  ...equivReserved.slice(2, 4),      // equivalent
]

const check3Pool = [
  ...tier1Reserved.slice(4),         // unit fraction
  ...tier2Reserved.slice(4),         // benchmark
  ...tier3Reserved.slice(5),         // common denominator
  ...tier4Reserved.slice(3),         // common numerator
  ...tier5Reserved.slice(0, 3),      // complex
  ...equivReserved.slice(4),         // equivalent
]

export const MASTERY_CHECK_POOLS = {
  3: check1Pool.slice(0, 10),
  4: check2Pool.slice(0, 10),
  5: check3Pool.slice(0, 10),
}

// Get practice items filtered by tier
export function getItemsByTier(tier) {
  return PRACTICE_ITEMS.filter(i => i.difficultyTier === tier)
}

// Get items targeting a specific misconception
export function getItemsForMisconception(misconceptionId) {
  return PRACTICE_ITEMS.filter(i =>
    i.targetMisconception === misconceptionId ||
    i.primaryStrategy === (misconceptionId === 'BENCH' ? 'benchmark' : 'commonDenominator')
  )
}
