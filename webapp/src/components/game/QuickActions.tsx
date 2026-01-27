'use client';

import { useMemo, forwardRef, useImperativeHandle } from 'react';
import { GameState } from '@/lib/types';

interface QuickAction {
  label: string;
  action: string;
  icon: string;
  category: 'explore' | 'combat' | 'social' | 'survival' | 'stealth' | 'special';
  condition?: (state: GameState) => boolean;
  priority: number; // Higher = shown first
}

// All possible quick actions with conditions
const ALL_QUICK_ACTIONS: QuickAction[] = [
  // Exploration
  { 
    label: 'Search area', 
    action: 'I carefully search the area for supplies or anything useful', 
    icon: '🔍', 
    category: 'explore',
    condition: (s) => !s.location.searched,
    priority: 10
  },
  { 
    label: 'Look around', 
    action: 'I stop and carefully observe my surroundings', 
    icon: '👁️', 
    category: 'explore',
    priority: 5
  },
  { 
    label: 'Listen', 
    action: 'I stay still and listen carefully for any sounds', 
    icon: '👂', 
    category: 'explore',
    priority: 4
  },
  { 
    label: 'Move deeper', 
    action: 'I cautiously move deeper into the area', 
    icon: '🚶', 
    category: 'explore',
    priority: 3
  },
  { 
    label: 'Find exit', 
    action: 'I look for possible exits or escape routes', 
    icon: '🚪', 
    category: 'explore',
    priority: 2
  },
  
  // Combat-related
  { 
    label: 'Ready weapon', 
    action: 'I ready my weapon and prepare for a fight', 
    icon: '⚔️', 
    category: 'combat',
    condition: (s) => s.threat >= 5 && s.character.weapons.length > 0,
    priority: 15
  },
  { 
    label: 'Attack!', 
    action: 'I attack the nearest threat', 
    icon: '💥', 
    category: 'combat',
    condition: (s) => s.threatState === 'encounter' || s.threatState === 'swarm',
    priority: 20
  },
  { 
    label: 'Defend', 
    action: 'I take a defensive stance and prepare to block or dodge', 
    icon: '🛡️', 
    category: 'combat',
    condition: (s) => s.threatState === 'encounter' || s.threatState === 'swarm',
    priority: 18
  },
  { 
    label: 'Flee!', 
    action: 'I try to escape and run away from the danger', 
    icon: '🏃', 
    category: 'combat',
    condition: (s) => s.threatState === 'encounter' || s.threatState === 'swarm' || s.threat >= 7,
    priority: 16
  },
  
  // Stealth
  { 
    label: 'Hide', 
    action: 'I look for cover and try to hide', 
    icon: '🙈', 
    category: 'stealth',
    condition: (s) => s.threat >= 3 && s.threatState !== 'encounter' && s.threatState !== 'swarm',
    priority: 12
  },
  { 
    label: 'Sneak', 
    action: 'I move as quietly as possible, staying in shadows', 
    icon: '🤫', 
    category: 'stealth',
    condition: (s) => s.location.lightLevel !== 'bright',
    priority: 8
  },
  { 
    label: 'Distraction', 
    action: 'I throw something to create a distraction', 
    icon: '🎯', 
    category: 'stealth',
    condition: (s) => s.threat >= 4 && s.threatState === 'investigating',
    priority: 11
  },
  
  // Survival
  { 
    label: 'Rest', 
    action: 'I try to find a safe spot to rest and recover', 
    icon: '💤', 
    category: 'survival',
    condition: (s) => s.threat < 4 && (s.character.stress > 3 || s.character.wounds.bruised > 0),
    priority: 7
  },
  { 
    label: 'Eat/Drink', 
    action: 'I eat some food and drink water', 
    icon: '🍖', 
    category: 'survival',
    condition: (s) => s.character.food > 0 && s.character.water > 0 && s.threat < 5,
    priority: 3
  },
  { 
    label: 'First aid', 
    action: 'I try to treat my wounds with what I have', 
    icon: '🩹', 
    category: 'survival',
    condition: (s) => 
      (s.character.wounds.bleeding > 0 || s.character.wounds.bruised > 1) &&
      s.character.inventory.some(i => 
        i.name.toLowerCase().includes('medical') || 
        i.name.toLowerCase().includes('bandage') ||
        i.name.toLowerCase().includes('first aid')
      ),
    priority: 14
  },
  { 
    label: 'Barricade', 
    action: 'I try to barricade the entrance to make this place safer', 
    icon: '🪵', 
    category: 'survival',
    condition: (s) => s.threat < 6 && s.time === 'night',
    priority: 9
  },
  { 
    label: 'Craft', 
    action: 'I try to craft something useful from what I have', 
    icon: '🔧', 
    category: 'survival',
    condition: (s) => s.character.skills.craft >= 1 && s.threat < 5,
    priority: 4
  },
  
  // Social
  { 
    label: 'Call out', 
    action: 'I call out to see if anyone friendly is nearby', 
    icon: '📢', 
    category: 'social',
    condition: (s) => s.threat < 4,
    priority: 2
  },
  { 
    label: 'Talk', 
    action: 'I try to talk and negotiate', 
    icon: '💬', 
    category: 'social',
    condition: (s) => s.threatState === 'noticed' || s.threatState === 'investigating',
    priority: 10
  },
  
  // Special / Situational
  { 
    label: 'Wait quietly', 
    action: 'I stay still and wait, watching what happens', 
    icon: '⏳', 
    category: 'special',
    condition: (s) => s.threatState === 'investigating' || s.threatState === 'noticed',
    priority: 6
  },
  { 
    label: 'Check vehicle', 
    action: 'I check if any nearby vehicles are usable', 
    icon: '🚗', 
    category: 'special',
    condition: (s) => 
      s.location.name.toLowerCase().includes('parking') || 
      s.location.name.toLowerCase().includes('garage') ||
      s.location.name.toLowerCase().includes('street'),
    priority: 5
  },
  { 
    label: 'Turn on lights', 
    action: 'I try to turn on lights to see better', 
    icon: '💡', 
    category: 'special',
    condition: (s) => s.location.lightLevel === 'dark' || s.location.lightLevel === 'dim',
    priority: 6
  },
  { 
    label: 'Use Guts', 
    action: 'I dig deep and push through the fear (spend a Guts point)', 
    icon: '🔥', 
    category: 'special',
    condition: (s) => s.character.guts > 0 && (s.character.stress > 5 || s.threatState === 'encounter' || s.threatState === 'swarm'),
    priority: 17
  },
];

interface QuickActionsProps {
  gameState: GameState;
  onAction: (action: string) => void;
  disabled?: boolean;
  maxActions?: number;
}

export interface QuickActionsRef {
  triggerAction: (index: number) => void;
}

const QuickActions = forwardRef<QuickActionsRef, QuickActionsProps>(function QuickActions({ 
  gameState, 
  onAction, 
  disabled = false,
  maxActions = 6 
}, ref) {
  // Filter and sort actions based on current game state
  const availableActions = useMemo(() => {
    return ALL_QUICK_ACTIONS
      .filter(action => !action.condition || action.condition(gameState))
      .sort((a, b) => b.priority - a.priority)
      .slice(0, maxActions);
  }, [gameState, maxActions]);

  // Expose triggerAction method for keyboard shortcuts
  useImperativeHandle(ref, () => ({
    triggerAction: (index: number) => {
      const action = availableActions[index];
      if (action && !disabled) {
        onAction(action.action);
      }
    }
  }), [availableActions, disabled, onAction]);

  // Get contextual header based on situation
  const contextHeader = useMemo(() => {
    if (gameState.threatState === 'encounter' || gameState.threatState === 'swarm') {
      return { text: 'COMBAT', color: 'text-danger' };
    }
    if (gameState.threatState === 'investigating') {
      return { text: 'DANGER CLOSE', color: 'text-warning' };
    }
    if (gameState.threatState === 'noticed') {
      return { text: 'ALERT', color: 'text-gold' };
    }
    if (gameState.threat >= 7) {
      return { text: 'HIGH THREAT', color: 'text-warning' };
    }
    return { text: 'ACTIONS', color: 'text-muted' };
  }, [gameState.threatState, gameState.threat]);

  return (
    <div className="space-y-2">
      <div className={`text-xs uppercase tracking-wider ${contextHeader.color}`}>
        {contextHeader.text}
      </div>
      <div className="flex flex-wrap gap-2">
        {availableActions.map((action, i) => (
          <button
            key={`${action.label}-${i}`}
            onClick={() => onAction(action.action)}
            disabled={disabled}
            className={`quick-action ${
              action.category === 'combat' ? 'border-danger/50 hover:border-danger' :
              action.category === 'stealth' ? 'border-info/50 hover:border-info' :
              action.category === 'survival' ? 'border-success/50 hover:border-success' :
              action.category === 'social' ? 'border-gold/50 hover:border-gold' :
              ''
            } disabled:opacity-40`}
          >
            <span className="text-base">{action.icon}</span>
            <span>{action.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
});

export default QuickActions;

// Compact version for mobile
export function QuickActionsCompact({ 
  gameState, 
  onAction, 
  disabled = false 
}: Omit<QuickActionsProps, 'maxActions'>) {
  const topActions = useMemo(() => {
    return ALL_QUICK_ACTIONS
      .filter(action => !action.condition || action.condition(gameState))
      .sort((a, b) => b.priority - a.priority)
      .slice(0, 4);
  }, [gameState]);

  return (
    <div className="grid grid-cols-4 gap-1">
      {topActions.map((action, i) => (
        <button
          key={`${action.label}-${i}`}
          onClick={() => onAction(action.action)}
          disabled={disabled}
          className="flex flex-col items-center justify-center p-2 rounded-lg bg-card border border-subtle hover:border-gold-dim transition-colors disabled:opacity-40"
        >
          <span className="text-lg">{action.icon}</span>
          <span className="text-[10px] text-muted truncate w-full text-center">{action.label}</span>
        </button>
      ))}
    </div>
  );
}
