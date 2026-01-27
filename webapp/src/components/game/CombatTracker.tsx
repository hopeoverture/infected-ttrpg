'use client';

import { useMemo } from 'react';
import { Character, RollResult } from '@/lib/types';

interface CombatTrackerProps {
  isActive: boolean;
  character: Character;
  threat: number;
  lastRoll?: RollResult | null;
}

export default function CombatTracker({
  isActive,
  character,
  threat,
  lastRoll,
}: CombatTrackerProps) {
  // Combat round tracking - for now just show round 1
  // In a full implementation, this would be tracked in game state
  const round = 1;
  const playerActions = 2;

  // Memoize derived values
  const { threatLevel, estimatedEnemies } = useMemo(() => ({
    threatLevel: threat < 4 ? 'low' : threat < 7 ? 'medium' : 'high',
    estimatedEnemies: Math.ceil(threat / 3)
  }), [threat]);

  if (!isActive) {
    return null;
  }

  return (
    <div className="panel bg-danger/10 border-danger/50 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <span className="text-xl">⚔️</span>
          <h3 className="font-bold text-danger uppercase tracking-wider">COMBAT</h3>
        </div>
        <div className="text-sm text-secondary">
          Round {round}
        </div>
      </div>

      {/* Combat Status */}
      <div className="grid grid-cols-2 gap-3 mb-3">
        {/* Player Status */}
        <div className="bg-card/50 rounded-lg p-3">
          <div className="text-xs text-muted uppercase mb-1">You</div>
          <div className="font-medium">{character.name}</div>
          <div className="flex items-center gap-2 mt-1">
            <div className="text-xs text-secondary">
              {character.wounds.critical ? (
                <span className="text-danger">💀 Critical!</span>
              ) : character.wounds.broken > 0 ? (
                <span className="text-danger">🦴 Broken</span>
              ) : character.wounds.bleeding > 0 ? (
                <span className="text-warning">🩸 Bleeding</span>
              ) : character.wounds.bruised > 0 ? (
                <span className="text-muted">😰 Bruised</span>
              ) : (
                <span className="text-success">✓ OK</span>
              )}
            </div>
          </div>
          {/* Action Economy */}
          <div className="mt-2 flex items-center gap-1">
            <span className="text-xs text-muted">Actions:</span>
            {[1, 2].map(i => (
              <div 
                key={i}
                className={`w-3 h-3 rounded-full ${
                  i <= playerActions ? 'bg-gold' : 'bg-border-medium'
                }`}
              />
            ))}
          </div>
        </div>

        {/* Enemy Status */}
        <div className="bg-card/50 rounded-lg p-3">
          <div className="text-xs text-muted uppercase mb-1">Threats</div>
          <div className="font-medium text-danger">
            ~{estimatedEnemies} {estimatedEnemies === 1 ? 'enemy' : 'enemies'}
          </div>
          <div className={`text-xs mt-1 ${
            threatLevel === 'low' ? 'text-success' :
            threatLevel === 'medium' ? 'text-warning' :
            'text-danger'
          }`}>
            {threatLevel === 'low' && '⚠️ Manageable'}
            {threatLevel === 'medium' && '⚠️⚠️ Dangerous'}
            {threatLevel === 'high' && '⚠️⚠️⚠️ DEADLY'}
          </div>
        </div>
      </div>

      {/* Last Roll Result */}
      {lastRoll && (
        <div className="bg-card/50 rounded-lg p-3 mb-3">
          <div className="text-xs text-muted uppercase mb-1">Last Roll</div>
          <div className="flex items-center justify-between">
            <span className="text-sm">{lastRoll.description || 'Roll'}</span>
            <span className={`font-bold ${
              lastRoll.totalHits >= 1 ? 'text-success' : 'text-danger'
            }`}>
              {lastRoll.totalHits} hit{lastRoll.totalHits !== 1 ? 's' : ''} 
              {lastRoll.dice.some(d => d.isExplosion) && ` (+🔥)`}
            </span>
          </div>
          <div className="flex gap-1 mt-2">
            {lastRoll.dice.map((die, i) => (
              <div
                key={i}
                className={`die ${
                  die.isExplosion ? 'die-explode' :
                  die.isHit ? 'die-hit' :
                  die.isCriticalOne ? 'die-one' :
                  ''
                }`}
                style={{ width: '24px', height: '24px', fontSize: '0.75rem' }}
              >
                {die.value}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Combat Tips (Collapsible) */}
      <details className="text-xs text-secondary">
        <summary className="cursor-pointer hover:text-primary">
          Combat Tips ▼
        </summary>
        <ul className="mt-2 space-y-1 list-disc list-inside text-muted">
          <li>You get 2 actions per round (attack, move, item, etc.)</li>
          <li>6s explode (reroll and add to hits)</li>
          <li>1s can be spent by GM to make things worse</li>
          <li>Fleeing requires an Athletics roll</li>
          <li>Wounds apply penalties after combat</li>
        </ul>
      </details>

      {/* Combat Actions Reminder */}
      <div className="mt-3 pt-3 border-t border-danger/30">
        <div className="text-xs text-muted text-center">
          Type your action or use quick actions above
        </div>
      </div>
    </div>
  );
}
