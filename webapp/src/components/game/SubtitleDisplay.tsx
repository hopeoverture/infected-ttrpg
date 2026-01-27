'use client';

import { useState, useEffect, useRef } from 'react';

interface SubtitleDisplayProps {
  text: string | null;
  isPlaying: boolean;
  isLoading: boolean;
  position?: 'bottom' | 'top';
  style?: 'cinematic' | 'minimal' | 'typewriter';
}

export default function SubtitleDisplay({
  text,
  isPlaying,
  isLoading,
  position = 'bottom',
  style = 'cinematic'
}: SubtitleDisplayProps) {
  const [displayedText, setDisplayedText] = useState('');
  const [isVisible, setIsVisible] = useState(false);
  const typewriterRef = useRef<NodeJS.Timeout | null>(null);

  // Show/hide based on playing state
  useEffect(() => {
    if (isPlaying && text) {
      setIsVisible(true);
      
      if (style === 'typewriter') {
        // Typewriter effect - reveal text progressively
        let charIndex = 0;
        setDisplayedText('');
        
        const typeSpeed = Math.max(30, Math.min(80, 3000 / text.length)); // Adaptive speed
        
        const typeNext = () => {
          if (charIndex < text.length) {
            charIndex++;
            setDisplayedText(text.slice(0, charIndex));
            typewriterRef.current = setTimeout(typeNext, typeSpeed);
          }
        };
        
        typewriterRef.current = setTimeout(typeNext, 100);
      } else {
        // Instant display
        setDisplayedText(text);
      }
    } else if (!isPlaying && !isLoading) {
      // Fade out then hide
      const fadeTimer = setTimeout(() => {
        setIsVisible(false);
        setDisplayedText('');
      }, 500);
      return () => clearTimeout(fadeTimer);
    }

    return () => {
      if (typewriterRef.current) {
        clearTimeout(typewriterRef.current);
      }
    };
  }, [text, isPlaying, isLoading, style]);

  // Loading state
  if (isLoading) {
    return (
      <div className={`subtitle-container ${position}`}>
        <div className="subtitle-box subtitle-loading">
          <span className="animate-pulse">Preparing narration...</span>
        </div>
      </div>
    );
  }

  // Not visible
  if (!isVisible || !displayedText) {
    return null;
  }

  // Clean up text for display - remove markdown and limit length
  const cleanText = displayedText
    .replace(/\*\*/g, '')
    .replace(/\*/g, '')
    .replace(/\n+/g, ' ')
    .trim();

  // For display, show a reasonable chunk (first ~150 chars to a sentence break)
  const displayChunk = getDisplayChunk(cleanText, 150);

  return (
    <div className={`subtitle-container ${position} ${isPlaying ? 'playing' : 'fading'}`}>
      <div className={`subtitle-box subtitle-${style}`}>
        {style === 'cinematic' && <div className="subtitle-glow" />}
        <p className="subtitle-text">
          {displayChunk}
        </p>
        {style === 'cinematic' && isPlaying && (
          <div className="subtitle-indicator">
            <SpeakingIndicator />
          </div>
        )}
      </div>
    </div>
  );
}

// Get a displayable chunk of text (break at sentence/clause if possible)
function getDisplayChunk(text: string, maxLength: number): string {
  if (text.length <= maxLength) {
    return text;
  }

  // Find a good break point
  let breakPoint = text.lastIndexOf('. ', maxLength);
  if (breakPoint === -1 || breakPoint < maxLength / 2) {
    breakPoint = text.lastIndexOf(', ', maxLength);
  }
  if (breakPoint === -1 || breakPoint < maxLength / 2) {
    breakPoint = text.lastIndexOf(' ', maxLength);
  }
  if (breakPoint === -1) {
    breakPoint = maxLength;
  }

  return text.slice(0, breakPoint + 1).trim() + '...';
}

// Speaking indicator animation
function SpeakingIndicator() {
  return (
    <div className="flex items-center gap-1">
      <div className="w-1.5 h-1.5 bg-gold rounded-full animate-pulse" />
      <div className="w-1.5 h-1.5 bg-gold rounded-full animate-pulse" style={{ animationDelay: '0.2s' }} />
      <div className="w-1.5 h-1.5 bg-gold rounded-full animate-pulse" style={{ animationDelay: '0.4s' }} />
    </div>
  );
}

// CSS styles (to be added to globals.css or inline)
// These are defined in the component for reference but should be in CSS

/*
.subtitle-container {
  position: fixed;
  left: 0;
  right: 0;
  z-index: 50;
  display: flex;
  justify-content: center;
  padding: 1rem;
  pointer-events: none;
  transition: opacity 0.5s ease-out;
}

.subtitle-container.bottom {
  bottom: 5rem; // Above mobile nav
}

.subtitle-container.top {
  top: 5rem;
}

.subtitle-container.fading {
  opacity: 0;
}

.subtitle-box {
  position: relative;
  max-width: 48rem;
  padding: 0.75rem 1.5rem;
  border-radius: 0.5rem;
  text-align: center;
}

.subtitle-cinematic {
  background: rgba(0, 0, 0, 0.85);
  border: 1px solid rgba(201, 162, 39, 0.3);
  box-shadow: 0 4px 30px rgba(0, 0, 0, 0.5);
}

.subtitle-minimal {
  background: rgba(0, 0, 0, 0.7);
}

.subtitle-typewriter {
  background: rgba(0, 0, 0, 0.85);
  border: 1px solid rgba(255, 255, 255, 0.1);
  font-family: monospace;
}

.subtitle-glow {
  position: absolute;
  inset: -1px;
  background: radial-gradient(ellipse at center, rgba(201, 162, 39, 0.1) 0%, transparent 70%);
  border-radius: 0.5rem;
  pointer-events: none;
}

.subtitle-text {
  position: relative;
  font-size: 1.125rem;
  line-height: 1.6;
  color: #f5f5f5;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.5);
}

.subtitle-indicator {
  position: absolute;
  right: 0.75rem;
  top: 50%;
  transform: translateY(-50%);
}

.subtitle-loading {
  background: rgba(0, 0, 0, 0.7);
  color: rgba(255, 255, 255, 0.6);
  font-size: 0.875rem;
}

@media (max-width: 768px) {
  .subtitle-text {
    font-size: 1rem;
  }
  .subtitle-container.bottom {
    bottom: 6rem;
  }
}
*/
