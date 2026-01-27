'use client';

interface CreationNarrationUIProps {
  isPlaying: boolean;
  isLoading: boolean;
  isMuted: boolean;
  subtitle: string | null;
  onToggleMute: () => void;
  onSkip: () => void;
}

export default function CreationNarrationUI({
  isPlaying,
  isLoading,
  isMuted,
  subtitle,
  onToggleMute,
  onSkip
}: CreationNarrationUIProps) {
  return (
    <>
      {/* Mute/Unmute button in corner */}
      <button
        onClick={onToggleMute}
        className="fixed top-4 right-4 z-50 flex items-center gap-2 px-3 py-2 rounded-lg bg-surface/80 backdrop-blur border border-subtle hover:border-gold transition-all"
        title={isMuted ? 'Enable narration' : 'Mute narration'}
      >
        {isMuted ? (
          <>
            <SpeakerMutedIcon />
            <span className="text-sm text-muted">Muted</span>
          </>
        ) : isPlaying ? (
          <>
            <SoundWave />
            <span className="text-sm text-gold">Playing</span>
          </>
        ) : isLoading ? (
          <>
            <LoadingDots />
            <span className="text-sm text-muted">Loading...</span>
          </>
        ) : (
          <>
            <SpeakerIcon />
            <span className="text-sm text-secondary">Narration</span>
          </>
        )}
      </button>

      {/* Skip button when playing */}
      {(isPlaying || isLoading) && !isMuted && (
        <button
          onClick={onSkip}
          className="fixed top-4 right-36 z-50 px-3 py-2 rounded-lg bg-surface/80 backdrop-blur border border-subtle hover:border-medium text-sm text-muted hover:text-primary transition-all"
        >
          Skip ⏭
        </button>
      )}

      {/* Subtitle display */}
      {subtitle && (isPlaying || isLoading) && !isMuted && (
        <div className="fixed bottom-8 left-0 right-0 z-50 flex justify-center px-4 pointer-events-none animate-fade-in">
          <div className="max-w-2xl bg-black/90 backdrop-blur border border-gold/30 rounded-lg px-6 py-4 shadow-2xl">
            <div className="absolute inset-0 bg-gradient-to-r from-gold/5 via-gold/10 to-gold/5 rounded-lg" />
            <p className="relative text-lg text-center text-white leading-relaxed italic">
              &ldquo;{subtitle}&rdquo;
            </p>
            {isLoading && (
              <div className="flex justify-center mt-2">
                <LoadingDots />
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}

// Sound wave animation
function SoundWave() {
  return (
    <div className="flex items-center gap-0.5 h-4">
      {[0, 1, 2, 3].map((i) => (
        <div
          key={i}
          className="w-0.5 bg-gold rounded-full animate-sound-wave"
          style={{
            animationDelay: `${i * 0.15}s`,
            height: '100%',
          }}
        />
      ))}
    </div>
  );
}

function LoadingDots() {
  return (
    <div className="flex items-center gap-1">
      {[0, 1, 2].map((i) => (
        <div
          key={i}
          className="w-1.5 h-1.5 bg-gold/60 rounded-full animate-bounce"
          style={{ animationDelay: `${i * 0.15}s` }}
        />
      ))}
    </div>
  );
}

function SpeakerIcon() {
  return (
    <svg className="w-5 h-5 text-secondary" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M11 5L6 9H2v6h4l5 4V5z" />
      <path d="M15.54 8.46a5 5 0 0 1 0 7.07" />
      <path d="M19.07 4.93a10 10 0 0 1 0 14.14" />
    </svg>
  );
}

function SpeakerMutedIcon() {
  return (
    <svg className="w-5 h-5 text-muted" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M11 5L6 9H2v6h4l5 4V5z" />
      <line x1="23" y1="9" x2="17" y2="15" />
      <line x1="17" y1="9" x2="23" y2="15" />
    </svg>
  );
}
