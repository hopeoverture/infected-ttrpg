'use client';

/* eslint-disable react-hooks/set-state-in-effect */
import { useState, useEffect } from 'react';
import { RollResult } from '@/lib/types';

interface BreakingPointModalProps {
  isOpen: boolean;
  onClose: () => void;
  stressLevel: number;
  maxStress: number;
  rollResult?: RollResult | null;
  onRollDice?: () => void;
  onSpendGuts?: () => void;
  canSpendGuts?: boolean;
  outcome?: { outcome: string; stressCleared: number } | null;
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
  onRollDice,
  onSpendGuts,
  canSpendGuts = false,
  outcome
}: BreakingPointModalProps) {
  const [phase, setPhase] = useState<'intro' | 'rolling' | 'result'>('intro');
  const [showResult, setShowResult] = useState(false);
  const [consequence, setConsequence] = useState('');

  // Reset state when modal opens - intentional pattern for modal initialization
  useEffect(() => {
    if (isOpen) {
      setPhase('intro');
      setShowResult(false);
      // Random consequence for if they fail
      const randomIndex = Math.floor(Math.random() * SNAP_CONSEQUENCES.length);
      setConsequence(SNAP_CONSEQUENCES[randomIndex] ?? SNAP_CONSEQUENCES[0]!);
    }
     
  }, [isOpen]);

  // Handle roll result coming in
  useEffect(() => {
    if (rollResult && phase === 'rolling') {
      const timer = setTimeout(() => {
        setPhase('result');
        setTimeout(() => setShowResult(true), 500);
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, [rollResult, phase]);

  // Handle clicking roll dice
  const handleRollClick = () => {
    setPhase('rolling');
    // Small delay before triggering roll for UX
    setTimeout(() => {
      onRollDice?.();
    }, 300);
  };

  if (!isOpen) return null;

  const snapped = outcome?.outcome === 'breakdown';
  const panicked = outcome?.outcome === 'panic';

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
                onClick={handleRollClick}
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
              <div className="flex justify-center gap-2 mb-6 flex-wrap">
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
                {rollResult.bonusDice.map((die, i) => (
                  <div
                    key={`bonus-${i}`}
                    className={`die ${die.isHit ? 'die-hit' : ''} die-explode`}
                  >
                    {die.value}
                  </div>
                ))}
              </div>
              
              <div className="text-sm text-muted mb-4">
                {rollResult.totalHits} hits — {rollResult.description}
              </div>

              {/* Result text */}
              {showResult && outcome && (
                <div className={`animate-fade-in ${snapped ? 'text-danger' : panicked ? 'text-warning' : 'text-success'}`}>
                  <div className={`text-3xl font-bold mb-4 ${snapped ? 'glow-danger' : panicked ? 'glow-warning' : 'glow-success'}`}>
                    {snapped ? '😱 BREAKDOWN!' : panicked ? '😰 PANIC!' : '😤 HOLD IT TOGETHER'}
                  </div>
                  
                  {snapped ? (
                    <div className="bg-danger/20 border border-danger rounded-lg p-4 mb-6">
                      <p className="text-sm text-danger font-medium mb-2">Breakdown Effect:</p>
                      <p className="text-secondary">{consequence}</p>
                      <p className="text-xs text-muted mt-2">All stress cleared. You gain a lasting trauma.</p>
                    </div>
                  ) : panicked ? (
                    <div className="bg-warning/20 border border-warning rounded-lg p-4 mb-6">
                      <p className="text-secondary">You panic momentarily, acting irrationally for one round.</p>
                      <p className="text-xs text-muted mt-2">2 stress cleared.</p>
                    </div>
                  ) : (
                    <div className="mb-6">
                      <p className="text-lg mb-2">
                        You steel yourself. The nightmare continues, but you&apos;re still in control.
                      </p>
                      <p className="text-sm text-info">1 stress cleared.</p>
                    </div>
                  )}

                  {/* Actions */}
                  <div className="flex justify-center gap-4">
                    {(snapped || panicked) && canSpendGuts && onSpendGuts && (
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
