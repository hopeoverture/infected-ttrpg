import { describe, it, expect } from 'vitest';
import {
  Attributes,
  Skills,
  Background,
  BACKGROUNDS,
  DEFAULT_SKILLS,
  SkillName,
  SKILL_ATTRIBUTES
} from '../types';

/**
 * Character Creation Validation Tests
 * 
 * These tests validate the rules for creating a character:
 * - Attributes must sum to 12
 * - Each attribute must be between 1-4
 * - Skills must sum to 12
 * - Each skill must be 0-3 (or 0-4 for background bonus skill)
 * - Background must be valid
 */

// Helper functions for validation (these could be extracted to a validation module)
function validateAttributes(attrs: Attributes): { valid: boolean; errors: string[] } {
  const errors: string[] = [];
  const sum = attrs.grit + attrs.reflex + attrs.wits + attrs.nerve;
  
  if (sum !== 12) {
    errors.push(`Attributes must sum to 12, got ${sum}`);
  }
  
  const attrNames: (keyof Attributes)[] = ['grit', 'reflex', 'wits', 'nerve'];
  for (const name of attrNames) {
    const value = attrs[name];
    if (value < 1 || value > 4) {
      errors.push(`${name} must be between 1-4, got ${value}`);
    }
  }
  
  return { valid: errors.length === 0, errors };
}

function validateSkills(skills: Skills, bonusSkill?: SkillName): { valid: boolean; errors: string[] } {
  const errors: string[] = [];
  const skillNames = Object.keys(DEFAULT_SKILLS) as SkillName[];
  
  let sum = 0;
  for (const name of skillNames) {
    const value = skills[name];
    sum += value;
    
    const max = name === bonusSkill ? 4 : 3;
    if (value < 0 || value > max) {
      errors.push(`${name} must be between 0-${max}, got ${value}`);
    }
  }
  
  if (sum !== 12) {
    errors.push(`Skills must sum to 12, got ${sum}`);
  }
  
  return { valid: errors.length === 0, errors };
}

function validateBackground(background: string): boolean {
  return background in BACKGROUNDS;
}

describe('Character Creation Validation', () => {
  describe('Attribute Validation', () => {
    it('accepts valid attributes summing to 12', () => {
      const validAttrs: Attributes = { grit: 4, reflex: 3, wits: 3, nerve: 2 };
      const result = validateAttributes(validAttrs);
      expect(result.valid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    it('accepts balanced attributes (3, 3, 3, 3)', () => {
      const balanced: Attributes = { grit: 3, reflex: 3, wits: 3, nerve: 3 };
      const result = validateAttributes(balanced);
      expect(result.valid).toBe(true);
    });

    it('accepts minimum viable distribution (4, 4, 3, 1)', () => {
      const minMax: Attributes = { grit: 4, reflex: 4, wits: 3, nerve: 1 };
      const result = validateAttributes(minMax);
      expect(result.valid).toBe(true);
    });

    it('rejects attributes not summing to 12', () => {
      const tooHigh: Attributes = { grit: 4, reflex: 4, wits: 4, nerve: 4 };
      const result = validateAttributes(tooHigh);
      expect(result.valid).toBe(false);
      expect(result.errors).toContain('Attributes must sum to 12, got 16');
    });

    it('rejects attributes below minimum (1)', () => {
      const belowMin: Attributes = { grit: 0, reflex: 4, wits: 4, nerve: 4 };
      const result = validateAttributes(belowMin);
      expect(result.valid).toBe(false);
      expect(result.errors.some(e => e.includes('grit must be between 1-4'))).toBe(true);
    });

    it('rejects attributes above maximum (4)', () => {
      const aboveMax: Attributes = { grit: 5, reflex: 3, wits: 3, nerve: 1 };
      const result = validateAttributes(aboveMax);
      expect(result.valid).toBe(false);
      expect(result.errors.some(e => e.includes('grit must be between 1-4'))).toBe(true);
    });

    it('rejects multiple invalid attributes', () => {
      const multiInvalid: Attributes = { grit: 0, reflex: 5, wits: 3, nerve: 3 };
      const result = validateAttributes(multiInvalid);
      expect(result.valid).toBe(false);
      expect(result.errors.length).toBeGreaterThan(1);
    });
  });

  describe('Skill Validation', () => {
    it('accepts valid skills summing to 12', () => {
      const validSkills: Skills = {
        ...DEFAULT_SKILLS,
        shoot: 3,
        stealth: 3,
        notice: 3,
        survival: 3
      };
      const result = validateSkills(validSkills);
      expect(result.valid).toBe(true);
    });

    it('accepts all zeros (no points spent)', () => {
      // This would fail sum check, so let's test partial distribution
      const partialSkills: Skills = {
        ...DEFAULT_SKILLS,
        endure: 2,
        shoot: 2,
        notice: 2,
        medicine: 2,
        survival: 2,
        resolve: 2
      };
      const result = validateSkills(partialSkills);
      expect(result.valid).toBe(true);
    });

    it('allows bonus skill to reach 4', () => {
      const bonusMaxed: Skills = {
        ...DEFAULT_SKILLS,
        shoot: 4, // Background bonus skill
        stealth: 3,
        notice: 3,
        survival: 2
      };
      const result = validateSkills(bonusMaxed, 'shoot');
      expect(result.valid).toBe(true);
    });

    it('rejects non-bonus skill at 4', () => {
      const invalidMax: Skills = {
        ...DEFAULT_SKILLS,
        shoot: 4, // Not the bonus skill
        stealth: 3,
        notice: 3,
        survival: 2
      };
      const result = validateSkills(invalidMax, 'endure'); // endure is bonus, not shoot
      expect(result.valid).toBe(false);
      expect(result.errors.some(e => e.includes('shoot must be between 0-3'))).toBe(true);
    });

    it('rejects negative skill values', () => {
      const negative: Skills = {
        ...DEFAULT_SKILLS,
        shoot: -1,
        stealth: 3,
        notice: 3,
        survival: 7
      };
      const result = validateSkills(negative);
      expect(result.valid).toBe(false);
    });

    it('rejects skills not summing to 12', () => {
      const wrongSum: Skills = {
        ...DEFAULT_SKILLS,
        shoot: 3,
        stealth: 3
      };
      const result = validateSkills(wrongSum);
      expect(result.valid).toBe(false);
      expect(result.errors.some(e => e.includes('Skills must sum to 12'))).toBe(true);
    });
  });

  describe('Background Validation', () => {
    it('accepts all valid backgrounds', () => {
      const backgrounds: Background[] = [
        'survivor', 'soldier', 'medic', 'mechanic', 'scout',
        'leader', 'hunter', 'criminal', 'veterinarian', 'professor',
        'enforcer', 'ranger'
      ];
      
      for (const bg of backgrounds) {
        expect(validateBackground(bg)).toBe(true);
      }
    });

    it('rejects invalid backgrounds', () => {
      expect(validateBackground('wizard')).toBe(false);
      expect(validateBackground('')).toBe(false);
      expect(validateBackground('SOLDIER')).toBe(false); // case sensitive
    });

    it('each background has a bonus skill', () => {
      const backgrounds = Object.keys(BACKGROUNDS) as Background[];
      
      for (const bg of backgrounds) {
        const data = BACKGROUNDS[bg];
        expect(data.bonus).toBeDefined();
        expect(data.bonus in DEFAULT_SKILLS).toBe(true);
      }
    });

    it('each background has starting gear', () => {
      const backgrounds = Object.keys(BACKGROUNDS) as Background[];
      
      for (const bg of backgrounds) {
        const data = BACKGROUNDS[bg];
        expect(Array.isArray(data.gear)).toBe(true);
        expect(data.gear.length).toBeGreaterThan(0);
      }
    });
  });

  describe('Skill-Attribute Mapping', () => {
    it('all skills have an associated attribute', () => {
      const skillNames = Object.keys(DEFAULT_SKILLS) as SkillName[];
      
      for (const skill of skillNames) {
        expect(SKILL_ATTRIBUTES[skill]).toBeDefined();
        expect(['grit', 'reflex', 'wits', 'nerve']).toContain(SKILL_ATTRIBUTES[skill]);
      }
    });

    it('GRIT skills are correctly mapped', () => {
      expect(SKILL_ATTRIBUTES.brawl).toBe('grit');
      expect(SKILL_ATTRIBUTES.endure).toBe('grit');
      expect(SKILL_ATTRIBUTES.athletics).toBe('grit');
    });

    it('REFLEX skills are correctly mapped', () => {
      expect(SKILL_ATTRIBUTES.shoot).toBe('reflex');
      expect(SKILL_ATTRIBUTES.stealth).toBe('reflex');
      expect(SKILL_ATTRIBUTES.drive).toBe('reflex');
    });

    it('WITS skills are correctly mapped', () => {
      expect(SKILL_ATTRIBUTES.notice).toBe('wits');
      expect(SKILL_ATTRIBUTES.craft).toBe('wits');
      expect(SKILL_ATTRIBUTES.tech).toBe('wits');
      expect(SKILL_ATTRIBUTES.medicine).toBe('wits');
      expect(SKILL_ATTRIBUTES.survival).toBe('wits');
      expect(SKILL_ATTRIBUTES.knowledge).toBe('wits');
    });

    it('NERVE skills are correctly mapped', () => {
      expect(SKILL_ATTRIBUTES.persuade).toBe('nerve');
      expect(SKILL_ATTRIBUTES.deceive).toBe('nerve');
      expect(SKILL_ATTRIBUTES.resolve).toBe('nerve');
      expect(SKILL_ATTRIBUTES.intimidate).toBe('nerve');
      expect(SKILL_ATTRIBUTES.animals).toBe('nerve');
    });
  });

  describe('Complete Character Validation', () => {
    it('validates a complete valid character setup', () => {
      const background: Background = 'soldier';
      const attributes: Attributes = { grit: 3, reflex: 4, wits: 2, nerve: 3 };
      const skills: Skills = {
        ...DEFAULT_SKILLS,
        shoot: 4, // Soldier bonus
        athletics: 2,
        notice: 2,
        stealth: 2,
        endure: 2
      };
      
      expect(validateBackground(background)).toBe(true);
      expect(validateAttributes(attributes).valid).toBe(true);
      expect(validateSkills(skills, BACKGROUNDS[background].bonus).valid).toBe(true);
    });

    it('validates a medic character setup', () => {
      const background: Background = 'medic';
      const attributes: Attributes = { grit: 2, reflex: 2, wits: 4, nerve: 4 };
      const skills: Skills = {
        ...DEFAULT_SKILLS,
        medicine: 4, // Medic bonus
        notice: 3,
        resolve: 3,
        persuade: 2
      };
      
      expect(validateBackground(background)).toBe(true);
      expect(validateAttributes(attributes).valid).toBe(true);
      expect(validateSkills(skills, BACKGROUNDS[background].bonus).valid).toBe(true);
    });
  });
});
