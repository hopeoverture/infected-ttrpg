'use client';

import React from 'react';
import SubtitleDisplay from './SubtitleDisplay';

interface AudioState {
  isPlaying: boolean;
  isLoading: boolean;
  currentMessageId: string | null;
  error: string | null;
}

interface AudioPlayerProps {
  /** Current audio playback state */
  audioState: AudioState;
  /** Text currently being narrated */
  narrationText: string | null;
  /** Whether subtitles should be shown */
  showSubtitles: boolean;
  /** Subtitle display style */
  subtitleStyle?: 'cinematic' | 'minimal' | 'typewriter';
  /** Whether audio is muted */
  isMuted: boolean;
  /** Callback to toggle mute */
  onToggleMute: () => void;
  /** Callback to toggle playback */
  onTogglePlayback: () => void;
  /** Callback to stop audio */
  onStopAudio: () => void;
  className?: string;
}

/**
 * AudioPlayer - TTS playback controls and subtitle display
 * 
 * Provides:
 * - Playback controls (play/pause/stop)
 * - Mute toggle
 * - Loading indicator
 * - Subtitle display integration
 */
export function AudioPlayer({
  audioState,
  narrationText,
  showSubtitles,
  subtitleStyle = 'cinematic',
  isMuted,
  onToggleMute,
  onTogglePlayback,
  onStopAudio,
  className = ''
}: AudioPlayerProps): React.ReactElement {
  const { isPlaying, isLoading, error } = audioState;

  return (
    <div className={`audio-player ${className}`}>
      {/* Playback Controls */}
      <div className="flex items-center gap-2">
        {/* Mute Toggle */}
        <MuteButton isMuted={isMuted} onToggle={onToggleMute} />
        
        {/* Play/Pause Toggle */}
        {narrationText && (
          <button
            onClick={onTogglePlayback}
            disabled={isLoading}
            className="p-2 rounded-lg bg-card border border-subtle hover:border-medium transition-colors disabled:opacity-50"
            aria-label={isPlaying ? 'Pause narration' : 'Play narration'}
          >
            {isLoading ? (
              <LoadingSpinner />
            ) : isPlaying ? (
              <span className="text-lg">⏸️</span>
            ) : (
              <span className="text-lg">▶️</span>
            )}
          </button>
        )}
        
        {/* Stop Button */}
        {isPlaying && (
          <button
            onClick={onStopAudio}
            className="p-2 rounded-lg bg-card border border-subtle hover:border-medium transition-colors"
            aria-label="Stop narration"
          >
            <span className="text-lg">⏹️</span>
          </button>
        )}
      </div>
      
      {/* Error Display */}
      {error && (
        <div className="mt-2 text-xs text-danger">
          Audio Error: {error}
        </div>
      )}
      
      {/* Subtitles */}
      {showSubtitles && (
        <SubtitleDisplay
          text={narrationText}
          isPlaying={isPlaying}
          isLoading={isLoading}
          position="bottom"
          style={subtitleStyle}
        />
      )}
    </div>
  );
}

interface MuteButtonProps {
  isMuted: boolean;
  onToggle: () => void;
}

/**
 * MuteButton - Standalone mute toggle
 * Can be used independently from the full AudioPlayer
 */
export function MuteButton({ isMuted, onToggle }: MuteButtonProps): React.ReactElement {
  return (
    <button
      onClick={onToggle}
      className="p-2 rounded-lg bg-card border border-subtle hover:border-medium transition-colors"
      aria-label={isMuted ? 'Unmute audio' : 'Mute audio'}
      title={isMuted ? 'Audio muted - click to unmute' : 'Audio enabled - click to mute'}
    >
      <span className="text-lg">{isMuted ? '🔇' : '🔊'}</span>
    </button>
  );
}

function LoadingSpinner(): React.ReactElement {
  return (
    <span className="inline-block w-4 h-4 border-2 border-muted border-t-primary rounded-full animate-spin" />
  );
}

export default AudioPlayer;
