'use client';

import { useState, useEffect } from 'react';

type ThinkingStage = 'thinking' | 'rolling' | 'narrating';

interface GMThinkingIndicatorProps {
  stage?: ThinkingStage;
}

const STAGE_CONFIG = {
  thinking: {
    icon: '🧠',
    text: 'The GM is thinking...',
    subtext: 'Analyzing the situation'
  },
  rolling: {
    icon: '🎲',
    text: 'Rolling dice...',
    subtext: 'Determining outcome'
  },
  narrating: {
    icon: '✍️',
    text: 'Writing response...',
    subtext: 'Crafting the narrative'
  }
};

export default function GMThinkingIndicator({ stage = 'thinking' }: GMThinkingIndicatorProps) {
  const [dots, setDots] = useState('');
  const config = STAGE_CONFIG[stage];

  // Animated dots
  useEffect(() => {
    const interval = setInterval(() => {
      setDots(prev => prev.length >= 3 ? '' : prev + '.');
    }, 400);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="message message-gm animate-fade-in">
      <div className="flex items-center gap-4">
        {/* Animated icon */}
        <div className="relative">
          <span className="text-3xl animate-pulse">{config.icon}</span>
          {stage === 'rolling' && (
            <div className="absolute inset-0 animate-dice-roll opacity-50">
              🎲
            </div>
          )}
        </div>

        {/* Text */}
        <div>
          <div className="flex items-center gap-1">
            <span className="text-secondary">{config.text}</span>
            <span className="text-muted w-6">{dots}</span>
          </div>
          <div className="text-xs text-muted">{config.subtext}</div>
        </div>
      </div>

      {/* Animated bar */}
      <div className="mt-3 h-1 bg-card rounded-full overflow-hidden">
        <div 
          className="h-full bg-gold rounded-full animate-pulse"
          style={{
            width: '60%',
            animation: 'thinking-progress 2s ease-in-out infinite'
          }}
        />
      </div>

      <style jsx>{`
        @keyframes thinking-progress {
          0%, 100% { width: 20%; margin-left: 0; }
          50% { width: 60%; margin-left: 40%; }
        }
      `}</style>
    </div>
  );
}
