'use client';

import { useState, useRef, useCallback } from 'react';

interface VoicePreviewButtonProps {
  voiceId: string;
  text: string;
  size?: 'sm' | 'md';
  className?: string;
}

export default function VoicePreviewButton({
  voiceId,
  text,
  size = 'sm',
  className = ''
}: VoicePreviewButtonProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const abortControllerRef = useRef<AbortController | null>(null);

  const stopPlayback = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
      audioRef.current = null;
    }
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      abortControllerRef.current = null;
    }
    setIsPlaying(false);
    setIsLoading(false);
  }, []);

  const playPreview = useCallback(async () => {
    // If already playing, stop
    if (isPlaying || isLoading) {
      stopPlayback();
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      abortControllerRef.current = new AbortController();

      const response = await fetch('/api/tts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          text: text.slice(0, 200), // Limit preview length
          voiceId,
        }),
        signal: abortControllerRef.current.signal,
      });

      if (!response.ok) {
        throw new Error('Failed to generate preview');
      }

      const contentType = response.headers.get('Content-Type');

      // Check if we got a fallback response (JSON) or actual audio
      if (contentType?.includes('application/json')) {
        const data = await response.json();
        if (data.fallback) {
          // Use browser TTS as fallback
          playWithBrowserTTS(data.text);
          return;
        }
        throw new Error(data.error || 'Unknown error');
      }

      // Got audio data - play it
      const audioBlob = await response.blob();
      const audioUrl = URL.createObjectURL(audioBlob);

      audioRef.current = new Audio(audioUrl);
      audioRef.current.onended = () => {
        setIsPlaying(false);
        URL.revokeObjectURL(audioUrl);
      };
      audioRef.current.onerror = () => {
        setError('Playback failed');
        setIsPlaying(false);
        URL.revokeObjectURL(audioUrl);
      };

      setIsLoading(false);
      setIsPlaying(true);
      await audioRef.current.play();
    } catch (err) {
      if (err instanceof Error && err.name === 'AbortError') {
        // Request was cancelled, not an error
        return;
      }
      console.error('Voice preview error:', err);
      setError('Preview failed');
      setIsLoading(false);
    }
  }, [voiceId, text, isPlaying, isLoading, stopPlayback]);

  const playWithBrowserTTS = (fallbackText: string) => {
    if (!('speechSynthesis' in window)) {
      setError('TTS not available');
      setIsLoading(false);
      return;
    }

    const utterance = new SpeechSynthesisUtterance(fallbackText);
    utterance.rate = 0.9;
    utterance.pitch = 1;
    utterance.onend = () => setIsPlaying(false);
    utterance.onerror = () => {
      setError('Playback failed');
      setIsPlaying(false);
    };

    setIsLoading(false);
    setIsPlaying(true);
    window.speechSynthesis.speak(utterance);
  };

  const sizeClasses = {
    sm: 'px-2 py-1 text-xs gap-1',
    md: 'px-3 py-1.5 text-sm gap-2'
  };

  const iconSize = size === 'sm' ? 'w-3 h-3' : 'w-4 h-4';

  return (
    <button
      onClick={playPreview}
      disabled={!!error}
      className={`
        inline-flex items-center justify-center rounded
        transition-all duration-200
        ${sizeClasses[size]}
        ${error
          ? 'bg-danger/20 text-danger cursor-not-allowed'
          : isPlaying || isLoading
            ? 'bg-primary text-black'
            : 'bg-surface hover:bg-surface/80 text-muted hover:text-primary'
        }
        ${className}
      `}
      title={error || (isPlaying ? 'Stop preview' : 'Play voice preview')}
    >
      {isLoading ? (
        // Loading spinner
        <svg className={`${iconSize} animate-spin`} fill="none" viewBox="0 0 24 24">
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          />
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          />
        </svg>
      ) : isPlaying ? (
        // Stop icon
        <svg className={iconSize} fill="currentColor" viewBox="0 0 20 20">
          <rect x="6" y="6" width="8" height="8" rx="1" />
        </svg>
      ) : error ? (
        // Error icon
        <svg className={iconSize} fill="currentColor" viewBox="0 0 20 20">
          <path
            fillRule="evenodd"
            d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
            clipRule="evenodd"
          />
        </svg>
      ) : (
        // Play icon
        <svg className={iconSize} fill="currentColor" viewBox="0 0 20 20">
          <path
            fillRule="evenodd"
            d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z"
            clipRule="evenodd"
          />
        </svg>
      )}
      <span>
        {isLoading ? 'Loading...' : isPlaying ? 'Stop' : error || 'Preview'}
      </span>
    </button>
  );
}
