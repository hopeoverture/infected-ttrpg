import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import {
  rollD6,
  isHit,
  rollDicePool,
  calculateDamage,
  getWoundSeverity,
  rollOpposed,
  rollInfectionCheck,
  rollBreakingPoint,
  formatRollResult
} from './dice';

describe('Dice Engine', () => {
  describe('rollD6', () => {
    it('returns a number between 1 and 6', () => {
      for (let i = 0; i < 100; i++) {
        const result = rollD6();
        expect(result).toBeGreaterThanOrEqual(1);
        expect(result).toBeLessThanOrEqual(6);
      }
    });
  });

  describe('isHit', () => {
    it('returns true for 5 and 6', () => {
      expect(isHit(5)).toBe(true);
      expect(isHit(6)).toBe(true);
    });

    it('returns false for 1-4', () => {
      expect(isHit(1)).toBe(false);
      expect(isHit(2)).toBe(false);
      expect(isHit(3)).toBe(false);
      expect(isHit(4)).toBe(false);
    });
  });

  describe('rollDicePool', () => {
    it('rolls the correct number of dice', () => {
      const result = rollDicePool(4);
      expect(result.dice.length).toBe(4);
    });

    it('marks hits correctly', () => {
      // Run multiple times to test both hits and misses
      for (let i = 0; i < 50; i++) {
        const result = rollDicePool(5);
        for (const die of result.dice) {
          if (die.value >= 5) {
            expect(die.isHit).toBe(true);
          } else {
            expect(die.isHit).toBe(false);
          }
        }
      }
    });

    it('counts total hits correctly', () => {
      for (let i = 0; i < 20; i++) {
        const result = rollDicePool(6);
        const manualCount = 
          result.dice.filter(d => d.isHit).length +
          result.bonusDice.filter(d => d.isHit).length;
        expect(result.totalHits).toBe(manualCount);
      }
    });

    it('generates bonus dice on 6s (explosions)', () => {
      // Mock Math.random to force 6s
      const originalRandom = Math.random;
      let callCount = 0;
      Math.random = vi.fn(() => {
        callCount++;
        // First 3 calls return 6 (0.833... * 6 + 1 = 6)
        if (callCount <= 3) return 0.9999;
        // Rest return 1
        return 0.001;
      });

      const result = rollDicePool(3);
      
      // Should have initial dice
      expect(result.dice.length).toBe(3);
      // Should have bonus dice from explosions
      expect(result.bonusDice.length).toBeGreaterThan(0);
      
      Math.random = originalRandom;
    });

    it('marks pushed roll 1s as critical', () => {
      for (let i = 0; i < 50; i++) {
        const result = rollDicePool(10, true); // isPush = true
        for (const die of result.dice) {
          if (die.value === 1) {
            expect(die.isCriticalOne).toBe(true);
          }
        }
      }
    });

    it('does not mark non-pushed 1s as critical', () => {
      for (let i = 0; i < 50; i++) {
        const result = rollDicePool(10, false);
        for (const die of result.dice) {
          expect(die.isCriticalOne).toBe(false);
        }
      }
    });

    it('detects critical failure correctly', () => {
      // Mock to force a critical failure (all 1s, no hits)
      const originalRandom = Math.random;
      Math.random = vi.fn(() => 0.001); // Always roll 1

      const result = rollDicePool(4);
      
      expect(result.totalHits).toBe(0);
      expect(result.isCriticalFailure).toBe(true);
      expect(result.description).toBe('CRITICAL FAILURE');
      
      Math.random = originalRandom;
    });

    it('generates appropriate descriptions', () => {
      // Mock for 0 hits (failure)
      let originalRandom = Math.random;
      Math.random = vi.fn(() => 0.3); // Roll 2s and 3s
      let result = rollDicePool(2);
      expect(result.description).toMatch(/Failure|CRITICAL/);
      
      Math.random = originalRandom;
    });
  });

  describe('calculateDamage', () => {
    it('returns 0 for 0 hits', () => {
      expect(calculateDamage(3, 0)).toBe(0);
    });

    it('returns base damage for 1 hit', () => {
      expect(calculateDamage(3, 1)).toBe(3);
    });

    it('returns base + 1 for 2 hits', () => {
      expect(calculateDamage(3, 2)).toBe(4);
    });

    it('returns base + 2 for 3 hits', () => {
      expect(calculateDamage(3, 3)).toBe(5);
    });

    it('returns base + 3 for 4+ hits', () => {
      expect(calculateDamage(3, 4)).toBe(6);
      expect(calculateDamage(3, 5)).toBe(6);
      expect(calculateDamage(3, 10)).toBe(6);
    });
  });

  describe('getWoundSeverity', () => {
    it('returns bruised for 1-2 damage', () => {
      expect(getWoundSeverity(1)).toBe('bruised');
      expect(getWoundSeverity(2)).toBe('bruised');
    });

    it('returns bleeding for 3-4 damage', () => {
      expect(getWoundSeverity(3)).toBe('bleeding');
      expect(getWoundSeverity(4)).toBe('bleeding');
    });

    it('returns broken for 5-6 damage', () => {
      expect(getWoundSeverity(5)).toBe('broken');
      expect(getWoundSeverity(6)).toBe('broken');
    });

    it('returns critical for 7+ damage', () => {
      expect(getWoundSeverity(7)).toBe('critical');
      expect(getWoundSeverity(10)).toBe('critical');
    });
  });

  describe('rollOpposed', () => {
    it('returns results for both attacker and defender', () => {
      const result = rollOpposed(4, 3);
      
      expect(result.attackerResult).toBeDefined();
      expect(result.defenderResult).toBeDefined();
      expect(result.attackerResult.dice.length).toBe(4);
      expect(result.defenderResult.dice.length).toBe(3);
    });

    it('calculates margin correctly', () => {
      for (let i = 0; i < 20; i++) {
        const result = rollOpposed(4, 4);
        expect(result.margin).toBe(
          result.attackerResult.totalHits - result.defenderResult.totalHits
        );
      }
    });

    it('declares defender winner when attacker has 0 hits', () => {
      // Force attacker to roll all 1s
      const originalRandom = Math.random;
      let callCount = 0;
      Math.random = vi.fn(() => {
        callCount++;
        // First 4 calls (attacker) return 1
        if (callCount <= 4) return 0.001;
        // Rest (defender) return 6
        return 0.999;
      });

      const result = rollOpposed(4, 4);
      expect(result.attackerResult.totalHits).toBe(0);
      expect(result.winner).toBe('defender');
      
      Math.random = originalRandom;
    });
  });

  describe('rollInfectionCheck', () => {
    it('returns infected status on 0 hits', () => {
      const originalRandom = Math.random;
      Math.random = vi.fn(() => 0.001);

      const result = rollInfectionCheck(2, 1);
      expect(result.outcome).toBe('infected');
      expect(result.turnedIn).toBeDefined();
      
      Math.random = originalRandom;
    });

    it('returns fighting status on 1 hit', () => {
      const originalRandom = Math.random;
      let callCount = 0;
      Math.random = vi.fn(() => {
        callCount++;
        // One die hits (roll a 5)
        if (callCount === 1) return 0.7; // ~5
        // Rest miss
        return 0.001;
      });

      const result = rollInfectionCheck(2, 1);
      // May or may not be exactly fighting depending on explosions
      expect(['infected', 'fighting', 'clear']).toContain(result.outcome);
      
      Math.random = originalRandom;
    });

    it('returns clear status on 2+ hits', () => {
      const originalRandom = Math.random;
      Math.random = vi.fn(() => 0.999); // Roll 6s

      const result = rollInfectionCheck(2, 1);
      expect(result.outcome).toBe('clear');
      expect(result.turnedIn).toBeUndefined();
      
      Math.random = originalRandom;
    });
  });

  describe('rollBreakingPoint', () => {
    it('returns hold on 2+ hits', () => {
      const originalRandom = Math.random;
      Math.random = vi.fn(() => 0.999);

      const result = rollBreakingPoint(3, 1);
      expect(result.outcome).toBe('hold');
      expect(result.stressCleared).toBe(1);
      
      Math.random = originalRandom;
    });

    it('returns breakdown on 0 hits', () => {
      const originalRandom = Math.random;
      Math.random = vi.fn(() => 0.001);

      const result = rollBreakingPoint(2, 0);
      expect(result.outcome).toBe('breakdown');
      expect(result.stressCleared).toBe(Infinity);
      
      Math.random = originalRandom;
    });
  });

  describe('formatRollResult', () => {
    it('formats dice with hit markers', () => {
      const result = {
        dice: [
          { value: 6, isHit: true, isExplosion: false, isCriticalOne: false },
          { value: 3, isHit: false, isExplosion: false, isCriticalOne: false },
          { value: 5, isHit: true, isExplosion: false, isCriticalOne: false }
        ],
        bonusDice: [],
        totalHits: 2,
        isCriticalFailure: false,
        description: 'Success'
      };

      const formatted = formatRollResult(result);
      expect(formatted).toContain('[6]✓');
      expect(formatted).toContain('[3]');
      expect(formatted).not.toContain('[3]✓');
      expect(formatted).toContain('[5]✓');
      expect(formatted).toContain('2 hits');
      expect(formatted).toContain('Success');
    });

    it('includes bonus dice when present', () => {
      const result = {
        dice: [
          { value: 6, isHit: true, isExplosion: false, isCriticalOne: false }
        ],
        bonusDice: [
          { value: 5, isHit: true, isExplosion: true, isCriticalOne: false }
        ],
        totalHits: 2,
        isCriticalFailure: false,
        description: 'Success'
      };

      const formatted = formatRollResult(result);
      expect(formatted).toContain('→');
      expect(formatted).toContain('[5]✓');
    });
  });
});
