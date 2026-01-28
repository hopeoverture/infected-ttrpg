import { describe, it, expect } from 'vitest';
import { GMStateChanges, ThreatState, LightLevel, Scarcity, TimeOfDay } from '../types';

/**
 * AI Response Parsing Tests
 * 
 * These tests validate the parsing of GM AI responses:
 * - JSON extraction from various formats
 * - State change validation
 * - Dice roll request parsing
 * - Error handling for malformed responses
 */

// Parser function extracted from the GM route
function parseGMResponse(text: string): {
  narrative: string;
  stateChanges: GMStateChanges;
  roll: {
    type: 'skill' | 'opposed' | 'damage' | 'infection' | 'breaking';
    attribute: string;
    skill: string;
    modifier?: number;
    reason?: string;
    difficulty?: number;
    isPush?: boolean;
  } | null;
  combatStarted?: boolean;
  infectionCheck?: boolean;
  breakingPoint?: boolean;
  sceneChanged?: boolean;
  sceneDescription?: string | null;
  audio?: {
    music?: string | null;
    soundEffects?: string[];
  } | null;
} {
  let jsonText = text;
  
  // Handle markdown code blocks
  const jsonMatch = text.match(/```(?:json)?\s*([\s\S]*?)```/);
  if (jsonMatch?.[1]) {
    jsonText = jsonMatch[1].trim();
  }
  
  // Try to find JSON object in the text
  const objectMatch = jsonText.match(/\{[\s\S]*\}/);
  if (objectMatch?.[0]) {
    jsonText = objectMatch[0];
  }
  
  try {
    const parsed = JSON.parse(jsonText);
    return {
      narrative: parsed.narrative || 'The GM is silent...',
      stateChanges: parsed.stateChanges || {},
      roll: parsed.roll || null,
      combatStarted: parsed.combatStarted || false,
      infectionCheck: parsed.infectionCheck || false,
      breakingPoint: parsed.breakingPoint || false,
      sceneChanged: parsed.sceneChanged || false,
      sceneDescription: parsed.sceneDescription || null,
      audio: parsed.audio || null,
    };
  } catch {
    // Return the text as narrative if JSON parsing fails
    return {
      narrative: text,
      stateChanges: {},
      roll: null,
      audio: null,
    };
  }
}

// Validation helpers
function validateStateChanges(changes: GMStateChanges): { valid: boolean; errors: string[] } {
  const errors: string[] = [];
  
  if (changes.threat !== undefined && changes.threat !== null) {
    if (typeof changes.threat !== 'number' || changes.threat < 0 || changes.threat > 10) {
      errors.push('Threat must be a number between 0-10');
    }
  }
  
  if (changes.threatState !== undefined && changes.threatState !== null) {
    const validStates: ThreatState[] = ['safe', 'noticed', 'investigating', 'encounter', 'swarm'];
    if (!validStates.includes(changes.threatState)) {
      errors.push(`Invalid threatState: ${changes.threatState}`);
    }
  }
  
  if (changes.stress !== undefined && changes.stress !== null) {
    if (typeof changes.stress !== 'number' || changes.stress < 0) {
      errors.push('Stress must be a non-negative number');
    }
  }
  
  if (changes.wounds) {
    const validWoundTypes = ['bruised', 'bleeding', 'broken', 'critical'];
    if (!validWoundTypes.includes(changes.wounds.type)) {
      errors.push(`Invalid wound type: ${changes.wounds.type}`);
    }
    if (typeof changes.wounds.change !== 'number') {
      errors.push('Wound change must be a number');
    }
  }
  
  if (changes.location) {
    if (!changes.location.name) {
      errors.push('Location must have a name');
    }
    const validLightLevels: LightLevel[] = ['dark', 'dim', 'bright'];
    if (changes.location.lightLevel && !validLightLevels.includes(changes.location.lightLevel)) {
      errors.push(`Invalid light level: ${changes.location.lightLevel}`);
    }
    const validScarcity: Scarcity[] = ['pristine', 'untouched', 'moderate', 'sparse', 'picked-clean'];
    if (changes.location.scarcity && !validScarcity.includes(changes.location.scarcity)) {
      errors.push(`Invalid scarcity: ${changes.location.scarcity}`);
    }
  }
  
  if (changes.time) {
    const validTimes: TimeOfDay[] = ['night', 'dawn', 'day', 'dusk'];
    if (!validTimes.includes(changes.time)) {
      errors.push(`Invalid time: ${changes.time}`);
    }
  }
  
  return { valid: errors.length === 0, errors };
}

describe('AI Response Parsing', () => {
  describe('JSON Extraction', () => {
    it('parses clean JSON response', () => {
      const response = JSON.stringify({
        narrative: 'The door creaks open...',
        stateChanges: { threat: 5 },
        roll: null
      });
      
      const result = parseGMResponse(response);
      expect(result.narrative).toBe('The door creaks open...');
      expect(result.stateChanges.threat).toBe(5);
    });

    it('extracts JSON from markdown code block', () => {
      const response = `Here's my response:
\`\`\`json
{
  "narrative": "You hear footsteps.",
  "stateChanges": { "threatState": "noticed" },
  "roll": null
}
\`\`\``;
      
      const result = parseGMResponse(response);
      expect(result.narrative).toBe('You hear footsteps.');
      expect(result.stateChanges.threatState).toBe('noticed');
    });

    it('extracts JSON from code block without json tag', () => {
      const response = `\`\`\`
{
  "narrative": "The infected lunges!",
  "stateChanges": {},
  "combatStarted": true
}
\`\`\``;
      
      const result = parseGMResponse(response);
      expect(result.narrative).toBe('The infected lunges!');
      expect(result.combatStarted).toBe(true);
    });

    it('finds JSON embedded in text', () => {
      const response = `Thinking about this action...
{"narrative": "You duck behind cover.", "stateChanges": {}, "roll": null}
That was close!`;
      
      const result = parseGMResponse(response);
      expect(result.narrative).toBe('You duck behind cover.');
    });

    it('falls back to raw text on parse failure', () => {
      const response = 'The infected are everywhere! No escape...';
      
      const result = parseGMResponse(response);
      expect(result.narrative).toBe(response);
      expect(result.stateChanges).toEqual({});
      expect(result.roll).toBeNull();
    });

    it('handles empty narrative gracefully', () => {
      const response = JSON.stringify({
        stateChanges: { threat: 3 },
        roll: null
      });
      
      const result = parseGMResponse(response);
      expect(result.narrative).toBe('The GM is silent...');
    });
  });

  describe('State Change Parsing', () => {
    it('parses threat level changes', () => {
      const response = JSON.stringify({
        narrative: 'A noise in the distance...',
        stateChanges: { threat: 6 }
      });
      
      const result = parseGMResponse(response);
      expect(result.stateChanges.threat).toBe(6);
    });

    it('parses threat state changes', () => {
      const response = JSON.stringify({
        narrative: 'They spotted you!',
        stateChanges: { threatState: 'encounter' }
      });
      
      const result = parseGMResponse(response);
      expect(result.stateChanges.threatState).toBe('encounter');
    });

    it('parses wound changes', () => {
      const response = JSON.stringify({
        narrative: 'The claws rake across your arm.',
        stateChanges: {
          wounds: { type: 'bleeding', change: 1 }
        }
      });
      
      const result = parseGMResponse(response);
      expect(result.stateChanges.wounds?.type).toBe('bleeding');
      expect(result.stateChanges.wounds?.change).toBe(1);
    });

    it('parses inventory additions', () => {
      const response = JSON.stringify({
        narrative: 'You find a first aid kit!',
        stateChanges: {
          inventory: { add: ['First Aid Kit', 'Bandages'] }
        }
      });
      
      const result = parseGMResponse(response);
      expect(result.stateChanges.inventory?.add).toContain('First Aid Kit');
      expect(result.stateChanges.inventory?.add).toContain('Bandages');
    });

    it('parses inventory removals', () => {
      const response = JSON.stringify({
        narrative: 'You use the bandage on your wound.',
        stateChanges: {
          inventory: { remove: ['Bandages'] }
        }
      });
      
      const result = parseGMResponse(response);
      expect(result.stateChanges.inventory?.remove).toContain('Bandages');
    });

    it('parses objective changes', () => {
      const response = JSON.stringify({
        narrative: 'The shelter is secure.',
        stateChanges: {
          objectives: {
            add: ['Find food'],
            complete: ['Secure shelter']
          }
        }
      });
      
      const result = parseGMResponse(response);
      expect(result.stateChanges.objectives?.add).toContain('Find food');
      expect(result.stateChanges.objectives?.complete).toContain('Secure shelter');
    });

    it('parses location changes', () => {
      const response = JSON.stringify({
        narrative: 'You enter the hospital.',
        stateChanges: {
          location: {
            name: 'Memorial Hospital',
            description: 'A dark, abandoned hospital.',
            lightLevel: 'dim',
            scarcity: 'sparse',
            ambientThreat: 7
          }
        },
        sceneChanged: true,
        sceneDescription: 'A massive concrete building looms before you.'
      });
      
      const result = parseGMResponse(response);
      expect(result.stateChanges.location?.name).toBe('Memorial Hospital');
      expect(result.stateChanges.location?.lightLevel).toBe('dim');
      expect(result.sceneChanged).toBe(true);
      expect(result.sceneDescription).toBe('A massive concrete building looms before you.');
    });

    it('parses multiple state changes', () => {
      const response = JSON.stringify({
        narrative: 'Combat erupts!',
        stateChanges: {
          threat: 8,
          threatState: 'encounter',
          stress: 4,
          wounds: { type: 'bruised', change: 1 }
        },
        combatStarted: true
      });
      
      const result = parseGMResponse(response);
      expect(result.stateChanges.threat).toBe(8);
      expect(result.stateChanges.threatState).toBe('encounter');
      expect(result.stateChanges.stress).toBe(4);
      expect(result.stateChanges.wounds?.type).toBe('bruised');
      expect(result.combatStarted).toBe(true);
    });
  });

  describe('Dice Roll Request Parsing', () => {
    it('parses skill check request', () => {
      const response = JSON.stringify({
        narrative: 'You try to pick the lock...',
        stateChanges: {},
        roll: {
          type: 'skill',
          attribute: 'wits',
          skill: 'craft',
          reason: 'Lockpicking'
        }
      });
      
      const result = parseGMResponse(response);
      expect(result.roll).not.toBeNull();
      expect(result.roll?.type).toBe('skill');
      expect(result.roll?.attribute).toBe('wits');
      expect(result.roll?.skill).toBe('craft');
      expect(result.roll?.reason).toBe('Lockpicking');
    });

    it('parses opposed check request', () => {
      const response = JSON.stringify({
        narrative: 'The infected grabs at you!',
        stateChanges: {},
        roll: {
          type: 'opposed',
          attribute: 'reflex',
          skill: 'athletics',
          difficulty: 3,
          reason: 'Escape grab'
        }
      });
      
      const result = parseGMResponse(response);
      expect(result.roll?.type).toBe('opposed');
      expect(result.roll?.difficulty).toBe(3);
    });

    it('parses roll with modifier', () => {
      const response = JSON.stringify({
        narrative: 'Taking careful aim...',
        stateChanges: {},
        roll: {
          type: 'skill',
          attribute: 'reflex',
          skill: 'shoot',
          modifier: 1,
          reason: 'Aimed shot'
        }
      });
      
      const result = parseGMResponse(response);
      expect(result.roll?.modifier).toBe(1);
    });

    it('parses push roll request', () => {
      const response = JSON.stringify({
        narrative: 'You push yourself harder!',
        stateChanges: {},
        roll: {
          type: 'skill',
          attribute: 'grit',
          skill: 'athletics',
          isPush: true,
          reason: 'Push the limits'
        }
      });
      
      const result = parseGMResponse(response);
      expect(result.roll?.isPush).toBe(true);
    });
  });

  describe('Special Event Parsing', () => {
    it('parses infection check trigger', () => {
      const response = JSON.stringify({
        narrative: 'The bite breaks skin!',
        stateChanges: {},
        infectionCheck: true
      });
      
      const result = parseGMResponse(response);
      expect(result.infectionCheck).toBe(true);
    });

    it('parses breaking point trigger', () => {
      const response = JSON.stringify({
        narrative: 'The horror is too much...',
        stateChanges: { stress: 10 },
        breakingPoint: true
      });
      
      const result = parseGMResponse(response);
      expect(result.breakingPoint).toBe(true);
    });

    it('parses combat started trigger', () => {
      const response = JSON.stringify({
        narrative: 'Roll for initiative!',
        stateChanges: { threatState: 'encounter' },
        combatStarted: true
      });
      
      const result = parseGMResponse(response);
      expect(result.combatStarted).toBe(true);
    });
  });

  describe('Audio Cue Parsing', () => {
    it('parses music cue', () => {
      const response = JSON.stringify({
        narrative: 'An eerie silence falls...',
        stateChanges: {},
        audio: {
          music: 'tension'
        }
      });
      
      const result = parseGMResponse(response);
      expect(result.audio?.music).toBe('tension');
    });

    it('parses sound effects', () => {
      const response = JSON.stringify({
        narrative: 'CRASH! The window shatters!',
        stateChanges: {},
        audio: {
          soundEffects: ['glass_break', 'scream_distant']
        }
      });
      
      const result = parseGMResponse(response);
      expect(result.audio?.soundEffects).toContain('glass_break');
      expect(result.audio?.soundEffects).toContain('scream_distant');
    });

    it('parses combined audio cues', () => {
      const response = JSON.stringify({
        narrative: 'The horde approaches!',
        stateChanges: { threatState: 'swarm' },
        audio: {
          music: 'combat_intense',
          soundEffects: ['zombie_growl', 'footsteps_many']
        }
      });
      
      const result = parseGMResponse(response);
      expect(result.audio?.music).toBe('combat_intense');
      expect(result.audio?.soundEffects).toHaveLength(2);
    });
  });

  describe('State Change Validation', () => {
    it('validates correct state changes', () => {
      const changes: GMStateChanges = {
        threat: 5,
        threatState: 'noticed',
        stress: 3,
        wounds: { type: 'bleeding', change: 1 }
      };
      
      const result = validateStateChanges(changes);
      expect(result.valid).toBe(true);
    });

    it('rejects invalid threat level', () => {
      const changes: GMStateChanges = { threat: 15 };
      
      const result = validateStateChanges(changes);
      expect(result.valid).toBe(false);
      expect(result.errors).toContain('Threat must be a number between 0-10');
    });

    it('rejects negative threat level', () => {
      const changes: GMStateChanges = { threat: -3 };
      
      const result = validateStateChanges(changes);
      expect(result.valid).toBe(false);
    });

    it('rejects invalid threat state', () => {
      const changes = { threatState: 'invalid' as ThreatState };
      
      const result = validateStateChanges(changes);
      expect(result.valid).toBe(false);
    });

    it('rejects invalid wound type', () => {
      const changes = {
        wounds: { type: 'invalid' as 'bruised', change: 1 }
      };
      
      const result = validateStateChanges(changes);
      expect(result.valid).toBe(false);
    });

    it('validates location changes', () => {
      const changes: GMStateChanges = {
        location: {
          name: 'Test Location',
          description: 'A test place',
          lightLevel: 'dim',
          scarcity: 'moderate',
          ambientThreat: 5
        }
      };
      
      const result = validateStateChanges(changes);
      expect(result.valid).toBe(true);
    });

    it('rejects location without name', () => {
      const changes = {
        location: {
          name: '',
          description: 'No name',
          lightLevel: 'dim' as LightLevel,
          scarcity: 'moderate' as Scarcity,
          ambientThreat: 5
        }
      };
      
      const result = validateStateChanges(changes);
      expect(result.valid).toBe(false);
    });

    it('rejects invalid time of day', () => {
      const changes = { time: 'midnight' as TimeOfDay };
      
      const result = validateStateChanges(changes);
      expect(result.valid).toBe(false);
    });
  });

  describe('Edge Cases', () => {
    it('handles empty response', () => {
      const result = parseGMResponse('');
      expect(result.narrative).toBe('');
      expect(result.stateChanges).toEqual({});
    });

    it('handles null values in response', () => {
      const response = JSON.stringify({
        narrative: 'Nothing happens.',
        stateChanges: {
          threat: null,
          wounds: null
        },
        roll: null
      });
      
      const result = parseGMResponse(response);
      expect(result.stateChanges.threat).toBeNull();
      expect(result.stateChanges.wounds).toBeNull();
    });

    it('handles deeply nested JSON', () => {
      const response = JSON.stringify({
        narrative: 'Complex response.',
        stateChanges: {
          location: {
            name: 'Complex Area',
            description: 'With nested data',
            lightLevel: 'dark',
            scarcity: 'pristine',
            ambientThreat: 1
          },
          inventory: {
            add: ['Item 1', 'Item 2'],
            remove: ['Old Item']
          }
        }
      });
      
      const result = parseGMResponse(response);
      expect(result.stateChanges.location?.name).toBe('Complex Area');
      expect(result.stateChanges.inventory?.add).toHaveLength(2);
    });

    it('handles whitespace in JSON', () => {
      const response = `
      {
        "narrative": "Spaced out response.",
        "stateChanges": {
          "threat": 5
        }
      }
      `;
      
      const result = parseGMResponse(response);
      expect(result.narrative).toBe('Spaced out response.');
    });

    it('handles unicode in narrative', () => {
      const response = JSON.stringify({
        narrative: 'The infected groans... 💀 ☠️ ⚠️',
        stateChanges: {}
      });
      
      const result = parseGMResponse(response);
      expect(result.narrative).toContain('💀');
    });
  });
});
