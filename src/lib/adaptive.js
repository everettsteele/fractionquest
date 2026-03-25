// Adaptive Difficulty Engine
// Maintains a rolling window of the last 10 practice responses
// Adjusts tier up/down based on success rate targets (80–85%)

import { PRACTICE_ITEMS, getItemsByTier, getItemsForMisconception } from '../data/items.js'
import { getPriorityMisconception } from './misconception.js'

/**
 * Evaluate the rolling window and return the new tier.
 * If last 10 responses: >85% correct → go up, <80% correct → go down.
 */
export function getNextTier(responses, currentTier) {
  const window = responses.slice(-10)
  if (window.length < 5) return currentTier // not enough data yet

  const successRate = window.filter(r => r.isCorrect).length / window.length

  if (successRate > 0.85 && currentTier < 5) return currentTier + 1
  if (successRate < 0.80 && currentTier > 1) return currentTier - 1
  return currentTier
}

/**
 * Select the next practice item.
 * Priority order:
 *   1. If student has an active unresolved misconception, pick an item targeting it
 *   2. Otherwise, pick from the current difficulty tier
 *   3. Shuffle within candidates to avoid repetition
 *   4. Exclude already-answered item IDs from this session
 */
export function selectNextItem(options) {
  const { currentTier, misconceptionProfile, answeredIds = [], sessionNumber } = options

  const priorityMisconception = getPriorityMisconception(misconceptionProfile)

  let candidates = []

  if (priorityMisconception) {
    // Get items that specifically target this misconception type
    candidates = getItemsForMisconception(priorityMisconception)
      .filter(i => !answeredIds.includes(i.id))
  }

  // Fall back to tier-based if no misconception candidates or they're exhausted
  if (candidates.length === 0) {
    candidates = getItemsByTier(currentTier).filter(i => !answeredIds.includes(i.id))
  }

  // If all tier items are exhausted, wrap around from lower tiers
  if (candidates.length === 0) {
    candidates = PRACTICE_ITEMS
      .filter(i => i.difficultyTier <= currentTier && !answeredIds.includes(i.id))
  }

  // Last resort: allow repeats
  if (candidates.length === 0) {
    candidates = getItemsByTier(currentTier)
  }

  // Shuffle for variety
  const shuffled = [...candidates].sort(() => Math.random() - 0.5)
  return shuffled[0] || null
}

/**
 * How many practice items does a session need before moving to the check?
 * Sessions 1-2: 12–18 items (no mastery check, longer practice)
 * Sessions 3-5: 10–15 items (mastery check follows)
 */
export function getPracticeTarget(sessionNumber, currentTier) {
  // Base count depends on session type
  const base = sessionNumber <= 2 ? 15 : 12
  // Add a few for lower tiers (students need more exposure when struggling)
  return currentTier <= 2 ? base + 2 : base
}
