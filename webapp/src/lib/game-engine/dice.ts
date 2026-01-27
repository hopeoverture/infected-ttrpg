// INFECTED - Dice Rolling Engine

import { DieResult, RollResult } from '../types';

/**
 * Roll a single d6
 */
export function rollD6(): number {
  return Math.floor(Math.random() * 6) + 1;
}

/**
 * Check if a die result is a hit (5 or 6)
 */
export function isHit(value: number): boolean {
  return value >= 5;
}

/**
 * Roll a dice pool and return detailed results
 * @param poolSize Number of dice to roll
 * @param isPush Whether this is a pushed roll (1s cause stress)
 */
export function rollDicePool(poolSize: number, isPush: boolean = false): RollResult {
  const dice: DieResult[] = [];
  const bonusDice: DieResult[] = [];
  let explosionCount = 0;
  const maxExplosions = 3;

  // Roll initial dice
  for (let i = 0; i < poolSize; i++) {
    const value = rollD6();
    dice.push({
      value,
      isHit: isHit(value),
      isExplosion: false,
      isCriticalOne: isPush && value === 1
    });

    // Track explosions (6s)
    if (value === 6 && explosionCount < maxExplosions) {
      explosionCount++;
    }
  }

  // Roll bonus dice from explosions
  for (let i = 0; i < explosionCount; i++) {
    const value = rollD6();
    bonusDice.push({
      value,
      isHit: isHit(value),
      isExplosion: true,
      isCriticalOne: false // Bonus dice don't cause stress
    });

    // Bonus dice can also explode (up to the max)
    if (value === 6 && bonusDice.length + explosionCount < maxExplosions) {
      explosionCount++;
    }
  }

  // Count total hits
  const totalHits = 
    dice.filter(d => d.isHit).length + 
    bonusDice.filter(d => d.isHit).length;

  // Check for critical failure (more than half 1s AND no hits)
  // Only on initial rolls, not pushed rolls or bonus dice
  const onesCount = dice.filter(d => d.value === 1).length;
  const isCriticalFailure = !isPush && totalHits === 0 && onesCount > poolSize / 2;

  // Generate description
  let description = '';
  if (isCriticalFailure) {
    description = 'CRITICAL FAILURE';
  } else if (totalHits === 0) {
    description = 'Failure';
  } else if (totalHits === 1) {
    description = 'Partial Success';
  } else if (totalHits === 2) {
    description = 'Success';
  } else {
    description = 'Strong Success';
  }

  return {
    dice,
    bonusDice,
    totalHits,
    isCriticalFailure,
    description
  };
}

/**
 * Calculate damage based on hits
 * @param baseDamage Weapon's base damage
 * @param hits Number of hits scored
 */
export function calculateDamage(baseDamage: number, hits: number): number {
  if (hits === 0) return 0;
  if (hits === 1) return baseDamage;
  if (hits === 2) return baseDamage + 1;
  if (hits === 3) return baseDamage + 2;
  return baseDamage + 3; // 4+ hits
}

/**
 * Determine wound severity from damage amount
 */
export function getWoundSeverity(damage: number): 'bruised' | 'bleeding' | 'broken' | 'critical' {
  if (damage <= 2) return 'bruised';
  if (damage <= 4) return 'bleeding';
  if (damage <= 6) return 'broken';
  return 'critical';
}

/**
 * Roll an opposed check
 * @param attackerPool Attacker's dice pool
 * @param defenderPool Defender's dice pool
 */
export function rollOpposed(attackerPool: number, defenderPool: number): {
  attackerResult: RollResult;
  defenderResult: RollResult;
  winner: 'attacker' | 'defender' | 'tie';
  margin: number;
} {
  const attackerResult = rollDicePool(attackerPool);
  const defenderResult = rollDicePool(defenderPool);
  
  const margin = attackerResult.totalHits - defenderResult.totalHits;
  
  let winner: 'attacker' | 'defender' | 'tie';
  if (attackerResult.totalHits === 0) {
    // Attacker with 0 hits always loses
    winner = 'defender';
  } else if (margin > 0) {
    winner = 'attacker';
  } else if (margin < 0) {
    winner = 'defender';
  } else {
    winner = 'tie'; // Ties go to defender/status quo
  }

  return {
    attackerResult,
    defenderResult,
    winner,
    margin
  };
}

/**
 * Roll for infection check
 * @param grit Character's GRIT attribute
 * @param endure Character's Endure skill
 */
export function rollInfectionCheck(grit: number, endure: number): {
  result: RollResult;
  outcome: 'infected' | 'fighting' | 'clear';
  symptomsIn: number; // minutes
  turnedIn?: number; // minutes (only if infected)
} {
  const result = rollDicePool(grit + endure);
  
  let outcome: 'infected' | 'fighting' | 'clear';
  let symptomsIn: number;
  let turnedIn: number | undefined;

  if (result.totalHits === 0) {
    outcome = 'infected';
    symptomsIn = rollD6(); // 1d6 minutes
    turnedIn = rollD6() + rollD6(); // 2d6 minutes
  } else if (result.totalHits === 1) {
    outcome = 'fighting';
    symptomsIn = rollD6() * 10; // 1d6 × 10 minutes
  } else {
    outcome = 'clear';
    symptomsIn = 0;
  }

  return {
    result,
    outcome,
    symptomsIn,
    turnedIn
  };
}

/**
 * Roll for breaking point (stress)
 * @param nerve Character's NERVE attribute
 * @param resolve Character's Resolve skill
 */
export function rollBreakingPoint(nerve: number, resolve: number): {
  result: RollResult;
  outcome: 'hold' | 'panic' | 'breakdown';
  stressCleared: number;
} {
  const result = rollDicePool(nerve + resolve);
  
  let outcome: 'hold' | 'panic' | 'breakdown';
  let stressCleared: number;

  if (result.totalHits >= 2) {
    outcome = 'hold';
    stressCleared = 1;
  } else if (result.totalHits === 1) {
    outcome = 'panic';
    stressCleared = 2;
  } else {
    outcome = 'breakdown';
    stressCleared = Infinity; // Clear all
  }

  return {
    result,
    outcome,
    stressCleared
  };
}

/**
 * Format a roll result for display
 */
export function formatRollResult(result: RollResult): string {
  const diceStr = result.dice.map(d => 
    d.isHit ? `[${d.value}]✓` : `[${d.value}]`
  ).join(' ');
  
  const bonusStr = result.bonusDice.length > 0 
    ? ' → ' + result.bonusDice.map(d => 
        d.isHit ? `[${d.value}]✓` : `[${d.value}]`
      ).join(' ')
    : '';

  return `${diceStr}${bonusStr} = ${result.totalHits} hits (${result.description})`;
}
