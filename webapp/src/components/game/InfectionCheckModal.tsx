'use client';

import { useState, useEffect } from 'react';
import { RollResult } from '@/lib/types';

interface InfectionCheckModalProps {
  isOpen: boolean;
  onClose: () => void;
  context: string;
  rollResult?: RollResult | null;
  onSpendGuts?: () => void;
  canSpendGuts?: boolean;
}

export default function InfectionCheckModal({
  isOpen,
  onClose,
  context,
  rollResult,
  onSpendGuts,
  canSpendGuts = false
}: InfectionCheckModalProps) {
  const [phase, setPhase] = useState<'intro' | 'rolling' | 'result'>('intro');
  const [showResult, setShowResult] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setPhase('intro');
      setShowResult(false);
    }
  }, [isOpen]);

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

  if (!isOpen) return null;

  const isInfected = rollResult && rollResult.totalHits === 0;
  const isCriticalFail = rollResult?.isCriticalFailure;

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
                You need at least 1 hit to fight off the infection
              </p>
              <button
                onClick={() => setPhase('rolling')}
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
              <p className="text-muted animate-pulse">Rolling...</p>
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
                <div className={`animate-fade-in ${isInfected ? 'text-danger' : 'text-success'}`}>
                  <div className={`text-4xl font-bold mb-4 ${isInfected ? 'glow-danger' : 'glow-success'}`}>
                    {isCriticalFail ? '💀 CRITICAL FAILURE' : 
                     isInfected ? '☣️ INFECTED' : '✓ CLEAN'}
                  </div>
                  
                  <p className="text-lg mb-6">
                    {isInfected 
                      ? "The virus takes hold. You can feel it spreading..."
                      : "Your body fights off the infection. This time."}
                  </p>

                  {/* Actions */}
                  <div className="flex justify-center gap-4">
                    {isInfected && canSpendGuts && onSpendGuts && (
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
