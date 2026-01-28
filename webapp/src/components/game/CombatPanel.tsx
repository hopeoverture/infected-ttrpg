'use client';

import React from 'react';
import { Character, RollResult } from '@/lib/types';
import CombatTracker from './CombatTracker';

interface CombatPanelProps {
  character: Character;
  threat: number;
  threatState: 'safe' | 'noticed' | 'investigating' | 'encounter' | 'swarm';
  lastRoll: RollResult | null;
  className?: string;
}

/**
 * CombatPanel - Displays combat state and tracker
 * 
 * Shows the combat tracker when in combat (encounter or swarm threat state).
 * Provides quick access to combat-relevant character info.
 */
export function CombatPanel({
  character,
  threat,
  threatState,
  lastRoll,
  className = ''
}: CombatPanelProps): React.ReactElement | null {
  const isInCombat = threatState === 'encounter' || threatState === 'swarm';
  
  if (!isInCombat) {
    return null;
  }

  return (
    <div className={`combat-panel ${className}`}>
      <CombatTracker
        isActive={true}
        character={character}
        threat={threat}
        lastRoll={lastRoll}
      />
      
      {/* Combat Quick Info */}
      <div className="mt-2 text-xs text-muted">
        <div className="flex justify-between">
          <span>Threat Level:</span>
          <span className={getThreatColor(threat)}>{threat}/10</span>
        </div>
        <div className="flex justify-between">
          <span>State:</span>
          <span className={getStateColor(threatState)}>
            {threatState === 'swarm' ? '🧟 SWARM' : '⚔️ ENCOUNTER'}
          </span>
        </div>
      </div>
    </div>
  );
}

function getThreatColor(threat: number): string {
  if (threat <= 3) return 'text-success';
  if (threat <= 6) return 'text-warning';
  return 'text-danger';
}

function getStateColor(state: string): string {
  if (state === 'swarm') return 'text-danger font-bold';
  if (state === 'encounter') return 'text-warning';
  return 'text-muted';
}

export default CombatPanel;
