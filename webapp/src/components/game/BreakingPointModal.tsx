'use client';

import { useState, useEffect } from 'react';
import { RollResult } from '@/lib/types';

interface BreakingPointModalProps {
  isOpen: boolean;
  onClose: () => void;
  stressLevel: number;
  maxStress: number;
  rollResult?: RollResult | null;
  onSpendGuts?: () => void;
  canSpendGuts?: boolean;
}

const SNAP_CONSEQUENCES = [
  "Fight - Lash out violently at the nearest person or object",
  "Flight - Run blindly, abandoning everything",
  "Freeze - Unable to act for a critical moment", 
  "Fawn - Desperately try to appease any threat",
  "Flashback - Relive a traumatic memory, losing touch with reality",
  "Rage - See red, attacking without regard for safety"
];

export default function BreakingPointModal({
  isOpen,
  onClose,
  stressLevel,
  maxStress,
  rollResult,
  onSpendGuts,
  canSpendGuts = false
}: BreakingPointModalProps) {
  const [phase, setPhase] = useState<'intro' | 'rolling' | 'result'>('intro');
  const [showResult, setShowResult] = useState(false);
  const [consequence, setConsequence] = useState('');

  useEffect(() => {
    if (isOpen) {
      setPhase('intro');
      setShowResult(false);
      // Random consequence for if they fail
      const randomIndex = Math.floor(Math.random() * SNAP_CONSEQUENCES.length);
      setConsequence(SNAP_CONSEQUENCES[randomIndex] ?? SNAP_CONSEQUENCES[0]!);
    }
  }, [isOpen]);

  useEffect(() => {
    if (rollResult && phase === 'rolling') {
      const timer = setTimeout(() => {
        setPhase('result');
        setTimeout(() => setShowResult(true), 500);
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, [rollResult, phase]);

  if (!isOpen) return null;

  const snapped = rollResult && rollResult.totalHits === 0;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop with heartbeat effect */}
      <div className="absolute inset-0 bg-black/90 backdrop-blur-sm animate-fade-in">
        <div className="absolute inset-0 bg-danger/10 animate-pulse" />
      </div>
      
      {/* Modal */}
      <div className="relative z-10 w-full max-w-lg mx-4 animate-fade-in">
        {/* Stress glow */}
        <div className="absolute inset-0 bg-info/30 blur-3xl rounded-full animate-pulse" />
        
        <div className="relative bg-bg-surface border-2 border-info rounded-lg p-8 text-center">
          {/* Header */}
          <div className="mb-6">
            <div className="text-5xl mb-4">💔</div>
            <h2 className="text-2xl font-bold text-info tracking-widest">
              BREAKING POINT
            </h2>
          </div>

          {/* Stress bar */}
          <div className="mb-6">
            <div className="flex justify-center gap-1 mb-2">
              {Array.from({ length: maxStress }).map((_, i) => (
                <div
                  key={i}
                  className={`stress-slot ${i < stressLevel ? 'stress-slot-filled animate-pulse' : ''}`}
                />
              ))}
            </div>
            <p className="text-sm text-muted">Stress: {stressLevel}/{maxStress} - FULL</p>
          </div>

          {/* Context */}
          <p className="text-secondary mb-6 italic">
            Your mind fractures under the weight of horror...
          </p>

          {/* Roll prompt */}
          {phase === 'intro' && (
            <div className="animate-fade-in">
              <p className="text-lg mb-6">
                Roll <span className="text-gold font-bold">NERVE + Resolve</span>
              </p>
              <p className="text-sm text-muted mb-6">
                Hold yourself together or suffer a breakdown
              </p>
              <button
                onClick={() => setPhase('rolling')}
                className="btn btn-primary text-lg px-8 py-3"
              >
                🎲 ROLL DICE
              </button>
            </div>
          )}

          {/* Rolling animation */}
          {phase === 'rolling' && !rollResult && (
            <div className="animate-fade-in">
              <div className="flex justify-center gap-3 mb-6">
                {[1, 2, 3, 4].map((i) => (
                  <div
                    key={i}
                    className="die animate-dice-roll"
                    style={{ animationDelay: `${i * 100}ms` }}
                  >
                    ?
                  </div>
                ))}
              </div>
              <p className="text-muted animate-pulse">The pressure builds...</p>
            </div>
          )}

          {/* Result */}
          {phase === 'result' && rollResult && (
            <div className="animate-fade-in">
              {/* Dice display */}
              <div className="flex justify-center gap-2 mb-6">
                {rollResult.dice.map((die, i) => (
                  <div
                    key={i}
                    className={`die ${
                      die.isExplosion ? 'die-explode' :
                      die.isHit ? 'die-hit' :
                      die.isCriticalOne ? 'die-one' : ''
                    }`}
                  >
                    {die.value}
                  </div>
                ))}
              </div>

              {/* Result text */}
              {showResult && (
                <div className={`animate-fade-in ${snapped ? 'text-danger' : 'text-success'}`}>
                  <div className={`text-3xl font-bold mb-4 ${snapped ? 'glow-danger' : 'glow-success'}`}>
                    {snapped ? '😱 SNAP!' : '😤 HOLD IT TOGETHER'}
                  </div>
                  
                  {snapped ? (
                    <div className="bg-danger/20 border border-danger rounded-lg p-4 mb-6">
                      <p className="text-sm text-danger font-medium mb-2">Breakdown Effect:</p>
                      <p className="text-secondary">{consequence}</p>
                    </div>
                  ) : (
                    <p className="text-lg mb-6">
                      You steel yourself. The nightmare continues, but you&apos;re still in control.
                    </p>
                  )}

                  {/* Clear stress on success */}
                  {!snapped && (
                    <p className="text-sm text-info mb-4">
                      Stress reduced by half (round down)
                    </p>
                  )}

                  {/* Actions */}
                  <div className="flex justify-center gap-4">
                    {snapped && canSpendGuts && onSpendGuts && (
                      <button
                        onClick={onSpendGuts}
                        className="btn btn-primary"
                      >
                        🔥 Spend Guts to Reroll
                      </button>
                    )}
                    <button
                      onClick={onClose}
                      className="btn"
                    >
                      Continue
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
