'use client';

/* eslint-disable react-hooks/set-state-in-effect */
import { useState, useEffect } from 'react';
import { RollResult } from '@/lib/types';

interface InfectionCheckModalProps {
  isOpen: boolean;
  onClose: () => void;
  context: string;
  rollResult?: RollResult | null;
  onRollDice?: () => void;
  onSpendGuts?: () => void;
  canSpendGuts?: boolean;
  outcome?: { outcome: string; symptomsIn: number; turnedIn?: number } | null;
}

export default function InfectionCheckModal({
  isOpen,
  onClose,
  context,
  rollResult,
  onRollDice,
  onSpendGuts,
  canSpendGuts = false,
  outcome
}: InfectionCheckModalProps) {
  const [phase, setPhase] = useState<'intro' | 'rolling' | 'result'>('intro');
  const [showResult, setShowResult] = useState(false);

  // Reset state when modal opens - intentional pattern for modal initialization
  useEffect(() => {
    if (isOpen) {
      setPhase('intro');
      setShowResult(false);
    }
  }, [isOpen]);

  // Handle roll result coming in
  useEffect(() => {
    if (rollResult && phase === 'rolling') {
      // Delay result reveal for drama
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

  const isInfected = outcome?.outcome === 'infected';
  const isFighting = outcome?.outcome === 'fighting';
  const isClear = outcome?.outcome === 'clear';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/90 backdrop-blur-sm animate-fade-in"
        onClick={phase === 'result' ? onClose : undefined}
      />
      
      {/* Modal */}
      <div className="relative z-10 w-full max-w-lg mx-4 animate-fade-in">
        {/* Biohazard glow effect */}
        <div className="absolute inset-0 bg-warning/20 blur-3xl rounded-full animate-pulse" />
        
        <div className="relative bg-bg-surface border-2 border-warning rounded-lg p-8 text-center">
          {/* Header */}
          <div className="mb-6">
            <div className="text-5xl mb-4 animate-pulse">☣️</div>
            <h2 className="text-2xl font-bold text-warning tracking-widest">
              INFECTION CHECK
            </h2>
          </div>

          {/* Context */}
          <p className="text-secondary mb-6 italic">
            {context || "The infected's teeth break your skin..."}
          </p>

          {/* Roll prompt */}
          {phase === 'intro' && (
            <div className="animate-fade-in">
              <p className="text-lg mb-6">
                Roll <span className="text-gold font-bold">GRIT + Endure</span>
              </p>
              <p className="text-sm text-muted mb-6">
                You need at least 2 hits to fight off the infection completely
              </p>
              <button
                onClick={handleRollClick}
                className="btn btn-primary text-lg px-8 py-3 glow-gold"
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
              <p className="text-muted animate-pulse">Your body fights the virus...</p>
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
                <div className={`animate-fade-in ${isInfected ? 'text-danger' : isFighting ? 'text-warning' : 'text-success'}`}>
                  <div className={`text-4xl font-bold mb-4 ${
                    isInfected ? 'glow-danger' : isFighting ? 'glow-warning' : 'glow-success'
                  }`}>
                    {rollResult.isCriticalFailure ? '💀 CRITICAL FAILURE' : 
                     isInfected ? '☣️ INFECTED' : 
                     isFighting ? '⚠️ FIGHTING IT' : '✓ CLEAR'}
                  </div>
                  
                  {isInfected && (
                    <div className="bg-danger/20 border border-danger rounded-lg p-4 mb-6">
                      <p className="text-lg mb-2">
                        The virus takes hold. You can feel it spreading...
                      </p>
                      <div className="text-sm text-secondary space-y-1">
                        <p>⏱️ Symptoms in <span className="text-danger font-bold">{outcome.symptomsIn}</span> minutes</p>
                        <p>💀 Turning in <span className="text-danger font-bold">{outcome.turnedIn}</span> minutes</p>
                      </div>
                      <p className="text-xs text-muted mt-3">
                        Find antibiotics immediately or this is the end.
                      </p>
                    </div>
                  )}

                  {isFighting && (
                    <div className="bg-warning/20 border border-warning rounded-lg p-4 mb-6">
                      <p className="text-lg mb-2">
                        Your body is fighting the infection...
                      </p>
                      <p className="text-sm text-secondary">
                        Symptoms in <span className="text-warning font-bold">{outcome.symptomsIn}</span> minutes
                      </p>
                      <p className="text-xs text-muted mt-3">
                        Antibiotics can still save you. Find them before symptoms appear.
                      </p>
                    </div>
                  )}

                  {isClear && (
                    <p className="text-lg mb-6">
                      Your body fights off the infection. This time you got lucky.
                    </p>
                  )}

                  {/* Actions */}
                  <div className="flex justify-center gap-4">
                    {(isInfected || isFighting) && canSpendGuts && onSpendGuts && (
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
