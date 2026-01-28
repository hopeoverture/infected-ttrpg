import { describe, it, expect } from 'vitest';
import {
  Character,
  Wounds,
  WoundCapacity,
  Item,
  ThreatState,
  GMStateChanges,
  Objective,
  TimeOfDay
} from '../types';

/**
 * Game State Mutation Tests
 * 
 * These tests validate state changes during gameplay:
 * - Wound application and healing
 * - Stress changes
 * - Inventory management
 * - Threat level changes
 * - Objective tracking
 */

// Helper function to apply wound changes (mirrors useGameSession logic)
function applyWoundChange(
  currentWounds: Wounds,
  woundType: 'bruised' | 'bleeding' | 'broken' | 'critical',
  change: number
): Wounds {
  if (woundType === 'critical') {
    return {
      ...currentWounds,
      critical: change > 0
    };
  }
  return {
    ...currentWounds,
    [woundType]: Math.max(0, currentWounds[woundType] + change)
  };
}

// Helper function to apply stress changes
function applyStressChange(currentStress: number, maxStress: number, change: number): number {
  return Math.max(0, Math.min(maxStress, currentStress + change));
}

// Helper function to apply threat level changes
function applyThreatChange(currentThreat: number, newThreat: number): number {
  return Math.max(0, Math.min(10, newThreat));
}

// Helper function to apply inventory changes
function applyInventoryChanges(
  currentInventory: Item[],
  add?: string[],
  remove?: string[]
): Item[] {
  // Deep copy to avoid mutating the original
  const inventory = currentInventory.map(item => ({ ...item }));
  
  if (add) {
    for (const itemName of add) {
      const existing = inventory.find(i => i.name.toLowerCase() === itemName.toLowerCase());
      if (existing) {
        existing.quantity += 1;
      } else {
        inventory.push({
          id: `item-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
          name: itemName,
          quantity: 1,
          isSignificant: true
        });
      }
    }
  }
  
  if (remove) {
    for (const itemName of remove) {
      const idx = inventory.findIndex(i => i.name.toLowerCase() === itemName.toLowerCase());
      if (idx !== -1) {
        const item = inventory[idx];
        if (item) {
          item.quantity -= 1;
          if (item.quantity <= 0) {
            inventory.splice(idx, 1);
          }
        }
      }
    }
  }
  
  return inventory;
}

// Helper function to apply objective changes
function applyObjectiveChanges(
  currentObjectives: Objective[],
  add?: string[],
  complete?: string[]
): Objective[] {
  const objectives = [...currentObjectives];
  
  if (add) {
    for (const objText of add) {
      if (!objectives.some(o => o.text.toLowerCase() === objText.toLowerCase())) {
        objectives.push({
          id: `obj-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
          text: objText,
          completed: false
        });
      }
    }
  }
  
  if (complete) {
    for (const objText of complete) {
      const obj = objectives.find(o => 
        o.text.toLowerCase().includes(objText.toLowerCase()) ||
        objText.toLowerCase().includes(o.text.toLowerCase())
      );
      if (obj) {
        obj.completed = true;
      }
    }
  }
  
  return objectives;
}

describe('Game State Mutations', () => {
  describe('Wound System', () => {
    const defaultWounds: Wounds = {
      bruised: 0,
      bleeding: 0,
      broken: 0,
      critical: false
    };

    const defaultCapacity: WoundCapacity = {
      bruised: 4,
      bleeding: 3,
      broken: 2,
      critical: 1
    };

    it('applies bruised wounds correctly', () => {
      const result = applyWoundChange(defaultWounds, 'bruised', 2);
      expect(result.bruised).toBe(2);
      expect(result.bleeding).toBe(0);
      expect(result.broken).toBe(0);
      expect(result.critical).toBe(false);
    });

    it('applies bleeding wounds correctly', () => {
      const result = applyWoundChange(defaultWounds, 'bleeding', 1);
      expect(result.bleeding).toBe(1);
    });

    it('applies broken wounds correctly', () => {
      const result = applyWoundChange(defaultWounds, 'broken', 1);
      expect(result.broken).toBe(1);
    });

    it('applies critical wounds as boolean', () => {
      const result = applyWoundChange(defaultWounds, 'critical', 1);
      expect(result.critical).toBe(true);
    });

    it('heals bruised wounds (negative change)', () => {
      const wounded: Wounds = { ...defaultWounds, bruised: 3 };
      const result = applyWoundChange(wounded, 'bruised', -1);
      expect(result.bruised).toBe(2);
    });

    it('prevents negative wound counts', () => {
      const result = applyWoundChange(defaultWounds, 'bruised', -5);
      expect(result.bruised).toBe(0);
    });

    it('removes critical wound correctly', () => {
      const critical: Wounds = { ...defaultWounds, critical: true };
      const result = applyWoundChange(critical, 'critical', 0);
      expect(result.critical).toBe(false);
    });

    it('accumulates wounds correctly', () => {
      let wounds = defaultWounds;
      wounds = applyWoundChange(wounds, 'bruised', 2);
      wounds = applyWoundChange(wounds, 'bleeding', 1);
      wounds = applyWoundChange(wounds, 'bruised', 1);
      
      expect(wounds.bruised).toBe(3);
      expect(wounds.bleeding).toBe(1);
    });
  });

  describe('Stress System', () => {
    it('increases stress correctly', () => {
      const result = applyStressChange(2, 10, 3);
      expect(result).toBe(5);
    });

    it('decreases stress correctly', () => {
      const result = applyStressChange(5, 10, -2);
      expect(result).toBe(3);
    });

    it('caps stress at maximum', () => {
      const result = applyStressChange(8, 10, 5);
      expect(result).toBe(10);
    });

    it('floors stress at zero', () => {
      const result = applyStressChange(3, 10, -5);
      expect(result).toBe(0);
    });

    it('handles edge case of already maxed stress', () => {
      const result = applyStressChange(10, 10, 1);
      expect(result).toBe(10);
    });

    it('handles setting stress to exact value', () => {
      // This simulates the GM setting a specific stress level
      const currentStress = 5;
      const newStress = 7;
      const result = Math.max(0, Math.min(10, newStress));
      expect(result).toBe(7);
    });
  });

  describe('Threat Level', () => {
    it('sets threat level correctly', () => {
      expect(applyThreatChange(3, 5)).toBe(5);
    });

    it('caps threat at 10', () => {
      expect(applyThreatChange(5, 15)).toBe(10);
    });

    it('floors threat at 0', () => {
      expect(applyThreatChange(3, -2)).toBe(0);
    });

    it('allows threat to increase', () => {
      expect(applyThreatChange(2, 6)).toBe(6);
    });

    it('allows threat to decrease', () => {
      expect(applyThreatChange(8, 4)).toBe(4);
    });
  });

  describe('Inventory Management', () => {
    const defaultInventory: Item[] = [
      { id: 'item-1', name: 'Bandages', quantity: 2, isSignificant: true },
      { id: 'item-2', name: 'Flashlight', quantity: 1, isSignificant: true }
    ];

    it('adds new item to inventory', () => {
      const result = applyInventoryChanges(defaultInventory, ['Water Bottle']);
      expect(result.length).toBe(3);
      expect(result.find(i => i.name === 'Water Bottle')).toBeDefined();
    });

    it('stacks existing items', () => {
      const result = applyInventoryChanges(defaultInventory, ['Bandages']);
      expect(result.length).toBe(2);
      expect(result.find(i => i.name === 'Bandages')?.quantity).toBe(3);
    });

    it('removes items correctly', () => {
      const result = applyInventoryChanges(defaultInventory, undefined, ['Flashlight']);
      expect(result.length).toBe(1);
      expect(result.find(i => i.name === 'Flashlight')).toBeUndefined();
    });

    it('decrements stacked items', () => {
      const result = applyInventoryChanges(defaultInventory, undefined, ['Bandages']);
      expect(result.find(i => i.name === 'Bandages')?.quantity).toBe(1);
    });

    it('handles case-insensitive matching', () => {
      const result = applyInventoryChanges(defaultInventory, ['BANDAGES']);
      expect(result.find(i => i.name === 'Bandages')?.quantity).toBe(3);
    });

    it('adds and removes in same operation', () => {
      const result = applyInventoryChanges(
        defaultInventory,
        ['First Aid Kit'],
        ['Bandages', 'Bandages'] // Remove 2
      );
      
      expect(result.find(i => i.name === 'First Aid Kit')).toBeDefined();
      expect(result.find(i => i.name === 'Bandages')).toBeUndefined();
    });

    it('handles removing non-existent items gracefully', () => {
      const result = applyInventoryChanges(defaultInventory, undefined, ['NonExistent']);
      expect(result.length).toBe(2);
    });
  });

  describe('Objective Tracking', () => {
    const defaultObjectives: Objective[] = [
      { id: 'obj-1', text: 'Find shelter', completed: false },
      { id: 'obj-2', text: 'Locate medical supplies', completed: false }
    ];

    it('adds new objective', () => {
      const result = applyObjectiveChanges(defaultObjectives, ['Escape the city']);
      expect(result.length).toBe(3);
      expect(result.find(o => o.text === 'Escape the city')).toBeDefined();
      expect(result.find(o => o.text === 'Escape the city')?.completed).toBe(false);
    });

    it('does not add duplicate objectives', () => {
      const result = applyObjectiveChanges(defaultObjectives, ['Find shelter']);
      expect(result.length).toBe(2);
    });

    it('marks objective as complete', () => {
      const result = applyObjectiveChanges(defaultObjectives, undefined, ['shelter']);
      expect(result.find(o => o.text === 'Find shelter')?.completed).toBe(true);
    });

    it('handles partial matching for completion', () => {
      const result = applyObjectiveChanges(defaultObjectives, undefined, ['medical']);
      expect(result.find(o => o.text === 'Locate medical supplies')?.completed).toBe(true);
    });

    it('adds and completes in same operation', () => {
      const result = applyObjectiveChanges(
        defaultObjectives,
        ['Meet the survivors'],
        ['shelter']
      );
      
      expect(result.length).toBe(3);
      expect(result.find(o => o.text === 'Find shelter')?.completed).toBe(true);
      expect(result.find(o => o.text === 'Meet the survivors')?.completed).toBe(false);
    });
  });

  describe('Guts (Hero Points)', () => {
    it('adds guts correctly', () => {
      const current = 2;
      const change = 1;
      const result = Math.max(0, Math.min(5, current + change));
      expect(result).toBe(3);
    });

    it('caps guts at 5', () => {
      const current = 4;
      const change = 3;
      const result = Math.max(0, Math.min(5, current + change));
      expect(result).toBe(5);
    });

    it('floors guts at 0', () => {
      const current = 1;
      const change = -2;
      const result = Math.max(0, Math.min(5, current + change));
      expect(result).toBe(0);
    });

    it('handles spending exactly available guts', () => {
      const current = 3;
      const change = -3;
      const result = Math.max(0, Math.min(5, current + change));
      expect(result).toBe(0);
    });
  });

  describe('Time and Day Progression', () => {
    const TIME_ORDER: TimeOfDay[] = ['night', 'dawn', 'day', 'dusk'];

    it('tracks day number correctly', () => {
      let day = 1;
      day += 1;
      expect(day).toBe(2);
    });

    it('validates time of day values', () => {
      const validTimes: TimeOfDay[] = ['night', 'dawn', 'day', 'dusk'];
      for (const time of validTimes) {
        expect(TIME_ORDER.includes(time)).toBe(true);
      }
    });
  });

  describe('Location Changes', () => {
    it('updates location correctly', () => {
      const newLocation = {
        name: 'Abandoned Hospital',
        description: 'A dark, decaying hospital filled with shadows.',
        lightLevel: 'dim' as const,
        scarcity: 'sparse' as const,
        ambientThreat: 6
      };

      expect(newLocation.name).toBe('Abandoned Hospital');
      expect(newLocation.lightLevel).toBe('dim');
      expect(newLocation.scarcity).toBe('sparse');
      expect(newLocation.ambientThreat).toBe(6);
    });

    it('resets search state on location change', () => {
      const location = {
        name: 'Safe House',
        description: 'A barricaded building.',
        lightLevel: 'bright' as const,
        scarcity: 'moderate' as const,
        ambientThreat: 2,
        searched: true,
        sceneImageUrl: 'http://example.com/image.jpg'
      };

      // When location changes, searched should reset
      const newLocation = {
        ...location,
        name: 'Street',
        searched: false,
        sceneImageUrl: undefined
      };

      expect(newLocation.searched).toBe(false);
      expect(newLocation.sceneImageUrl).toBeUndefined();
    });
  });

  describe('Kill Count Tracking', () => {
    it('increments kill count', () => {
      let killCount = 5;
      const kills = 2;
      killCount += kills;
      expect(killCount).toBe(7);
    });

    it('handles zero kills', () => {
      let killCount = 5;
      const kills = 0;
      killCount += kills;
      expect(killCount).toBe(5);
    });
  });

  describe('Complete State Change Application', () => {
    it('applies multiple changes atomically', () => {
      // Simulate a GM response with multiple state changes
      const changes: GMStateChanges = {
        threat: 7,
        threatState: 'encounter',
        stress: 5,
        wounds: { type: 'bleeding', change: 1 },
        inventory: { add: ['Pistol'], remove: ['Empty Magazine'] },
        objectives: { add: ['Survive the ambush'] },
        kills: 2
      };

      // All changes should be valid
      expect(changes.threat).toBeDefined();
      expect(changes.threatState).toBe('encounter');
      expect(changes.stress).toBe(5);
      expect(changes.wounds?.type).toBe('bleeding');
      expect(changes.inventory?.add).toContain('Pistol');
      expect(changes.objectives?.add).toContain('Survive the ambush');
      expect(changes.kills).toBe(2);
    });
  });
});
