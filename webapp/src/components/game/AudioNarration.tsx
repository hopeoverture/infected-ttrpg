'use client';

interface AudioNarrationProps {
  messageId: string;
  text: string;
  isGM: boolean;
  isMuted: boolean;
  isPlaying: boolean;
  isLoading: boolean;
  isCurrentMessage: boolean;
  onTogglePlay: (text: string, messageId: string) => void;
}

export default function AudioNarration({
  messageId,
  text,
  isGM,
  isMuted,
  isPlaying,
  isLoading,
  isCurrentMessage,
  onTogglePlay,
}: AudioNarrationProps) {
  // Only show controls for GM messages
  if (!isGM) return null;

  const isActive = isCurrentMessage && (isPlaying || isLoading);

  return (
    <button
      onClick={() => onTogglePlay(text, messageId)}
      disabled={isMuted}
      className={`
        inline-flex items-center gap-1.5 px-2 py-1 rounded text-xs
        transition-all duration-200
        ${isMuted 
          ? 'text-muted cursor-not-allowed opacity-50' 
          : isActive
            ? 'bg-accent/20 text-accent border border-accent/30'
            : 'text-secondary hover:text-primary hover:bg-surface-elevated'
        }
      `}
      title={isMuted ? 'Audio muted' : isActive ? 'Stop narration' : 'Play narration'}
      aria-label={isMuted ? 'Audio muted' : isActive ? 'Stop narration' : 'Play narration'}
      aria-pressed={isActive}
    >
      {isLoading ? (
        <>
          <LoadingWave />
          <span>Loading...</span>
        </>
      ) : isPlaying ? (
        <>
          <SoundWave />
          <span>Playing</span>
        </>
      ) : (
        <>
          <PlayIcon />
          <span>Listen</span>
        </>
      )}
    </button>
  );
}

// Animated sound wave for playing state
function SoundWave() {
  return (
    <div className="flex items-center gap-0.5 h-3">
      {[0, 1, 2, 3].map((i) => (
        <div
          key={i}
          className="w-0.5 bg-accent rounded-full animate-sound-wave"
          style={{
            animationDelay: `${i * 0.15}s`,
            height: '100%',
          }}
        />
      ))}
    </div>
  );
}

// Loading indicator
function LoadingWave() {
  return (
    <div className="flex items-center gap-0.5 h-3">
      {[0, 1, 2].map((i) => (
        <div
          key={i}
          className="w-1 h-1 bg-secondary rounded-full animate-bounce"
          style={{ animationDelay: `${i * 0.1}s` }}
        />
      ))}
    </div>
  );
}

// Play icon
function PlayIcon() {
  return (
    <svg className="w-3 h-3" viewBox="0 0 24 24" fill="currentColor">
      <path d="M8 5v14l11-7z" />
    </svg>
  );
}

// Global mute toggle component for header
interface MuteToggleProps {
  isMuted: boolean;
  onToggle: () => void;
  className?: string;
}

export function MuteToggle({ isMuted, onToggle, className = '' }: MuteToggleProps) {
  return (
    <button
      onClick={onToggle}
      className={`
        flex items-center gap-1.5 px-2 py-1 rounded text-sm
        transition-all duration-200
        ${isMuted 
          ? 'text-muted hover:text-secondary' 
          : 'text-accent hover:text-accent/80'
        }
        ${className}
      `}
      title={isMuted ? 'Unmute GM narration' : 'Mute GM narration'}
      aria-label={isMuted ? 'Unmute' : 'Mute'}
    >
      {isMuted ? (
        <SpeakerMutedIcon />
      ) : (
        <SpeakerIcon />
      )}
      <span className="hidden sm:inline">{isMuted ? 'Muted' : 'Audio'}</span>
    </button>
  );
}

function SpeakerIcon() {
  return (
    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M11 5L6 9H2v6h4l5 4V5z" />
      <path d="M15.54 8.46a5 5 0 0 1 0 7.07" />
      <path d="M19.07 4.93a10 10 0 0 1 0 14.14" />
    </svg>
  );
}

function SpeakerMutedIcon() {
  return (
    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M11 5L6 9H2v6h4l5 4V5z" />
      <line x1="23" y1="9" x2="17" y2="15" />
      <line x1="17" y1="9" x2="23" y2="15" />
    </svg>
  );
}

// CSS for sound wave animation (add to globals.css)
// @keyframes sound-wave {
//   0%, 100% { transform: scaleY(0.3); }
//   50% { transform: scaleY(1); }
// }
// .animate-sound-wave {
//   animation: sound-wave 0.8s ease-in-out infinite;
// }
