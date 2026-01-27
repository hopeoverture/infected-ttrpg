'use client';

import { useState, useEffect } from 'react';
import { Character } from '@/lib/types';

interface DeathStats {
  daysSurvived: number;
  killCount: number;
  rollCount: number;
  gutsSpent: number;
}

interface DeathSceneModalProps {
  isOpen: boolean;
  character: Character;
  deathCause: string;
  stats: DeathStats;
  onViewStory: () => void;
  onReturn: () => void;
}

export default function DeathSceneModal({
  isOpen,
  character,
  deathCause,
  stats,
  onViewStory,
  onReturn
}: DeathSceneModalProps) {
  const [phase, setPhase] = useState<'fadeIn' | 'name' | 'cause' | 'stats' | 'actions'>('fadeIn');

  useEffect(() => {
    if (isOpen) {
      setPhase('fadeIn');
      // Cinematic sequence
      const timers = [
        setTimeout(() => setPhase('name'), 1500),
        setTimeout(() => setPhase('cause'), 3500),
        setTimeout(() => setPhase('stats'), 5500),
        setTimeout(() => setPhase('actions'), 7500),
      ];
      return () => timers.forEach(clearTimeout);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black">
      {/* Blood vignette effect */}
      <div 
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse at center, transparent 0%, rgba(139, 0, 0, 0.3) 100%)'
        }}
      />

      {/* Static noise overlay */}
      <div 
        className="absolute inset-0 opacity-5 pointer-events-none"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%' height='100%' filter='url(%23noise)'/%3E%3C/svg%3E")`,
        }}
      />

      {/* Content */}
      <div className="relative z-10 w-full max-w-2xl mx-4 text-center">
        {/* GAME OVER text */}
        <div className={`transition-all duration-1000 ${phase === 'fadeIn' ? 'opacity-0 scale-150' : 'opacity-100 scale-100'}`}>
          <h1 className="text-6xl md:text-8xl font-bold text-danger tracking-[0.3em] mb-8"
              style={{ textShadow: '0 0 30px rgba(179, 58, 58, 0.8)' }}>
            GAME OVER
          </h1>
        </div>

        {/* Character name */}
        <div className={`transition-all duration-1000 delay-500 ${
          ['name', 'cause', 'stats', 'actions'].includes(phase) ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
        }`}>
          <div className="mb-2">
            <span className="text-4xl">☠️</span>
          </div>
          <h2 className="text-3xl font-semibold text-primary mb-2">
            {character.name}
          </h2>
          <p className="text-secondary text-lg">
            {character.background.charAt(0).toUpperCase() + character.background.slice(1)}
          </p>
        </div>

        {/* Death cause */}
        <div className={`transition-all duration-1000 mt-8 ${
          ['cause', 'stats', 'actions'].includes(phase) ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
        }`}>
          <p className="text-xl text-secondary italic">
            &quot;{deathCause}&quot;
          </p>
        </div>

        {/* Stats */}
        <div className={`transition-all duration-1000 mt-12 ${
          ['stats', 'actions'].includes(phase) ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
        }`}>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="bg-bg-surface/50 rounded-lg p-4 border border-subtle">
              <div className="text-3xl font-bold text-gold">{stats.daysSurvived}</div>
              <div className="text-sm text-muted uppercase tracking-wider">Days Survived</div>
            </div>
            <div className="bg-bg-surface/50 rounded-lg p-4 border border-subtle">
              <div className="text-3xl font-bold text-danger">{stats.killCount}</div>
              <div className="text-sm text-muted uppercase tracking-wider">Kills</div>
            </div>
            <div className="bg-bg-surface/50 rounded-lg p-4 border border-subtle">
              <div className="text-3xl font-bold text-info">{stats.rollCount}</div>
              <div className="text-sm text-muted uppercase tracking-wider">Dice Rolled</div>
            </div>
            <div className="bg-bg-surface/50 rounded-lg p-4 border border-subtle">
              <div className="text-3xl font-bold text-warning">{stats.gutsSpent}</div>
              <div className="text-sm text-muted uppercase tracking-wider">Guts Spent</div>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className={`transition-all duration-1000 mt-12 ${
          phase === 'actions' ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
        }`}>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <button
              onClick={onViewStory}
              className="btn btn-primary text-lg px-8 py-3"
            >
              📖 View Full Story
            </button>
            <button
              onClick={onReturn}
              className="btn text-lg px-8 py-3"
            >
              🏚️ Return to Dashboard
            </button>
          </div>
          
          <p className="mt-8 text-sm text-muted">
            Your story has been saved. The nightmare lives on.
          </p>
        </div>
      </div>
    </div>
  );
}
