'use client';

import { RollResult, DieResult } from '@/lib/types';

interface DiceRollProps {
  result: RollResult;
  label?: string;
  showAnimation?: boolean;
}

function Die({ die, animated = false }: { die: DieResult; animated?: boolean }) {
  let className = 'die';
  
  if (die.value === 6) {
    className += ' die-explode';
  } else if (die.isHit) {
    className += ' die-hit';
  } else if (die.isCriticalOne) {
    className += ' die-one';
  }
  
  if (animated) {
    className += ' animate-dice-roll';
  }

  return (
    <div className={className}>
      {die.value}
    </div>
  );
}

export default function DiceRoll({ result, label, showAnimation = false }: DiceRollProps) {
  const hitCount = result.totalHits;
  
  let resultColor = 'text-danger';
  if (hitCount >= 3) {
    resultColor = 'text-success';
  } else if (hitCount >= 2) {
    resultColor = 'text-gold';
  } else if (hitCount >= 1) {
    resultColor = 'text-warning';
  }

  return (
    <div className="bg-card rounded-lg p-4 border border-subtle">
      {label && (
        <div className="text-xs text-muted uppercase tracking-wider mb-3">
          🎲 Roll: {label}
        </div>
      )}
      
      {/* Main Dice */}
      <div className="flex flex-wrap gap-2 mb-3">
        {result.dice.map((die, i) => (
          <div key={i} className="relative">
            <Die die={die} animated={showAnimation} />
            {die.isHit && (
              <span className="absolute -top-1 -right-1 text-success text-xs">✓</span>
            )}
          </div>
        ))}
      </div>

      {/* Bonus Dice from Explosions */}
      {result.bonusDice.length > 0 && (
        <div className="mb-3">
          <div className="text-xs text-muted mb-2">Bonus dice from 6s:</div>
          <div className="flex flex-wrap gap-2">
            {result.bonusDice.map((die, i) => (
              <div key={i} className="relative">
                <Die die={die} animated={showAnimation} />
                {die.isHit && (
                  <span className="absolute -top-1 -right-1 text-success text-xs">✓</span>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Result */}
      <div className="border-t border-subtle pt-3 mt-3">
        <div className={`text-lg font-bold ${resultColor}`}>
          {result.isCriticalFailure ? (
            <span className="text-danger">☠ CRITICAL FAILURE</span>
          ) : (
            <>
              {hitCount === 0 && '✗ '}
              {hitCount === 1 && '◐ '}
              {hitCount >= 2 && '✓ '}
              {hitCount >= 3 && '✓ '}
              {result.totalHits} Hit{result.totalHits !== 1 ? 's' : ''} — {result.description}
            </>
          )}
        </div>
      </div>

      {/* Legend */}
      <div className="flex gap-4 mt-3 text-xs text-muted">
        <div className="flex items-center gap-1">
          <div className="w-4 h-4 rounded bg-die-hit"></div>
          <span>Hit</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-4 h-4 rounded bg-die-explode"></div>
          <span>Explode</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-4 h-4 rounded bg-die-one"></div>
          <span>Stress</span>
        </div>
      </div>
    </div>
  );
}

// Compact version for inline display
export function DiceRollCompact({ result }: { result: RollResult }) {
  return (
    <div className="inline-flex items-center gap-2 bg-card rounded px-2 py-1">
      <span className="text-xs text-muted">🎲</span>
      <div className="flex gap-1">
        {result.dice.map((die, i) => (
          <span 
            key={i} 
            className={`text-sm font-mono ${
              die.isHit ? 'text-success font-bold' : 
              die.value === 6 ? 'text-gold font-bold' : 
              'text-muted'
            }`}
          >
            {die.value}
          </span>
        ))}
        {result.bonusDice.length > 0 && (
          <>
            <span className="text-gold">→</span>
            {result.bonusDice.map((die, i) => (
              <span 
                key={i} 
                className={`text-sm font-mono ${
                  die.isHit ? 'text-success font-bold' : 'text-muted'
                }`}
              >
                {die.value}
              </span>
            ))}
          </>
        )}
      </div>
      <span className={`text-sm font-medium ${
        result.totalHits >= 2 ? 'text-success' : 
        result.totalHits === 1 ? 'text-warning' : 
        'text-danger'
      }`}>
        = {result.totalHits}
      </span>
    </div>
  );
}
