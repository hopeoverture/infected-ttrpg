'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { RollResult, DieResult } from '@/lib/types';

interface DiceRollDisplayProps {
  roll: RollResult;
  animate?: boolean;
  onAnimationComplete?: () => void;
}

export default function DiceRollDisplay({ 
  roll, 
  animate = true,
  onAnimationComplete
}: DiceRollDisplayProps) {
  // Initialize state based on animate prop
  const initialPhase = animate ? 'rolling' : 'complete';
  const initialDice: DieResult[] = animate ? [] : roll.dice;
  
  const [phase, setPhase] = useState<'rolling' | 'reveal' | 'complete'>(initialPhase);
  const [revealedDice, setRevealedDice] = useState<DieResult[]>(initialDice);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const hasAnimatedRef = useRef(false);
  
  // Animation runner - only runs once per roll
  const runAnimation = useCallback(() => {
    if (!animate || hasAnimatedRef.current) return;
    hasAnimatedRef.current = true;

    // After 500ms, start revealing dice one by one
    timeoutRef.current = setTimeout(() => {
      setPhase('reveal');
      let revealed: DieResult[] = [];
      
      roll.dice.forEach((die, i) => {
        setTimeout(() => {
          revealed = [...revealed, die];
          setRevealedDice([...revealed]);
          
          // On last die, mark complete
          if (i === roll.dice.length - 1) {
            setTimeout(() => {
              setPhase('complete');
              onAnimationComplete?.();
            }, 300);
          }
        }, i * 150);
      });
    }, 500);
  }, [animate, roll.dice, onAnimationComplete]);

  // Trigger animation on mount
  useEffect(() => {
    runAnimation();
    
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [runAnimation]);

  // Get roll outcome description
  const getOutcomeText = () => {
    const isCriticalSuccess = roll.dice.some(d => d.isExplosion);
    if (isCriticalSuccess && roll.totalHits >= 3) return 'CRITICAL SUCCESS!';
    if (roll.isCriticalFailure) return 'CRITICAL FAILURE!';
    if (roll.totalHits >= 1) return roll.totalHits >= 3 ? 'GREAT SUCCESS!' : 'SUCCESS';
    return 'FAILURE';
  };

  const getOutcomeColor = () => {
    const isCriticalSuccess = roll.dice.some(d => d.isExplosion);
    if (isCriticalSuccess && roll.totalHits >= 3) return 'text-gold glow-gold';
    if (roll.isCriticalFailure) return 'text-danger glow-danger';
    if (roll.totalHits >= 1) return 'text-success glow-success';
    return 'text-danger';
  };

  const explosionCount = roll.dice.filter(d => d.isExplosion).length;
  const onesCount = roll.dice.filter(d => d.isCriticalOne).length;
  const diceCount = roll.dice.length;

  return (
    <div className="bg-card/80 rounded-lg p-4 my-3 animate-fade-in">
      {/* Roll Header */}
      <div className="flex items-center justify-between mb-3">
        <div className="text-sm text-secondary">
          {roll.description || 'Roll'}
        </div>
        <div className="text-xs text-muted">
          {diceCount}d6
        </div>
      </div>

      {/* Dice Display */}
      <div className="flex flex-wrap gap-2 justify-center mb-3">
        {phase === 'rolling' ? (
          // Show placeholder dice during rolling
          Array.from({ length: diceCount }).map((_, i) => (
            <div
              key={i}
              className="die animate-dice-roll"
              style={{ animationDelay: `${i * 50}ms` }}
            >
              ?
            </div>
          ))
        ) : (
          // Show revealed dice
          <>
            {revealedDice.map((die, i) => (
              <div
                key={i}
                className={`die ${
                  die.isExplosion ? 'die-explode' :
                  die.isHit ? 'die-hit' :
                  die.isCriticalOne ? 'die-one' :
                  ''
                } animate-fade-in`}
                style={{ animationDelay: `${i * 50}ms` }}
              >
                {die.value}
              </div>
            ))}
            {/* Placeholder for unrevealed dice during reveal phase */}
            {phase === 'reveal' && Array.from({ length: diceCount - revealedDice.length }).map((_, i) => (
              <div
                key={`placeholder-${i}`}
                className="die animate-dice-roll"
              >
                ?
              </div>
            ))}
          </>
        )}
      </div>

      {/* Result Summary (only show when complete) */}
      {phase === 'complete' && (
        <div className="text-center animate-fade-in">
          {/* Outcome */}
          <div className={`text-xl font-bold mb-2 ${getOutcomeColor()}`}>
            {getOutcomeText()}
          </div>
          
          {/* Hit Count */}
          <div className="flex items-center justify-center gap-4 text-sm">
            <div className="flex items-center gap-1">
              <span className="text-success">✓</span>
              <span>{roll.totalHits} hit{roll.totalHits !== 1 ? 's' : ''}</span>
            </div>
            
            {explosionCount > 0 && (
              <div className="flex items-center gap-1 text-gold">
                <span>🔥</span>
                <span>{explosionCount} explode{explosionCount !== 1 ? 's' : ''}</span>
              </div>
            )}
            
            {onesCount > 0 && (
              <div className="flex items-center gap-1 text-danger">
                <span>💀</span>
                <span>{onesCount} complication{onesCount !== 1 ? 's' : ''}</span>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Legend */}
      <div className="flex justify-center gap-4 mt-3 pt-3 border-t border-subtle text-xs text-muted">
        <span><span className="text-success">●</span> Hit (5-6)</span>
        <span><span className="text-gold">●</span> Explode (6)</span>
        <span><span className="text-danger">●</span> Complication (1)</span>
      </div>
    </div>
  );
}

// Inline compact version for message history
export function DiceRollInline({ roll }: { roll: RollResult }) {
  const isSuccess = roll.totalHits >= 1;
  
  return (
    <div className="inline-flex items-center gap-2 bg-card/50 rounded px-2 py-1 text-sm">
      <span className="text-muted">🎲</span>
      <div className="flex gap-0.5">
        {roll.dice.map((die, i) => (
          <span
            key={i}
            className={`w-5 h-5 flex items-center justify-center rounded text-xs font-bold ${
              die.isExplosion ? 'bg-gold text-bg-primary' :
              die.isHit ? 'bg-success text-bg-primary' :
              die.isCriticalOne ? 'bg-danger text-primary' :
              'bg-muted/30'
            }`}
          >
            {die.value}
          </span>
        ))}
      </div>
      <span className={isSuccess ? 'text-success' : 'text-danger'}>
        → {roll.totalHits} hit{roll.totalHits !== 1 ? 's' : ''}
        {isSuccess ? ' ✓' : ' ✗'}
      </span>
    </div>
  );
}
