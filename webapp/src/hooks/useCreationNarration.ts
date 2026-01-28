'use client';

import { useState, useCallback, useRef, useEffect } from 'react';

// Atmospheric narration lines for each creation step
export const CREATION_NARRATION = {
  intro: {
    text: "The world ended three weeks ago. The infected roam the streets. Most didn't make it. But you... you're still here. Before we begin, I need to know... who are you?",
    subtitle: "The world ended three weeks ago..."
  },
  background: {
    text: "Everyone had a life before. A job. A purpose. What were you, before everything fell apart? What skills did you carry into this nightmare?",
    subtitle: "What were you, before everything fell apart?"
  },
  appearance: {
    text: "I'm trying to picture you. Describe yourself. The face that stares back from broken windows. The body that carries you through this hell.",
    subtitle: "Describe yourself..."
  },
  attributes: {
    text: "Survival isn't just about strength. It's about knowing when to fight, when to run, when to think, and when to keep your nerve. Where do your strengths lie?",
    subtitle: "Where do your strengths lie?"
  },
  skills: {
    text: "What can you actually do? Everybody's got talents. Some shoot. Some heal. Some talk their way out of trouble. Choose wisely. Your life depends on it.",
    subtitle: "Choose wisely. Your life depends on it."
  },
  story: {
    text: "One last question. The most important one. When everything tells you to give up, when the infected are at the door and hope is running out... why do you keep going?",
    subtitle: "Why do you keep going?"
  },
  ready: {
    text: "I think I know you now. The person you were. The survivor you've become. Are you ready to see how long you can last?",
    subtitle: "Are you ready?"
  }
};

type NarrationKey = keyof typeof CREATION_NARRATION;

interface UseCreationNarrationOptions {
  enabled?: boolean;
  onNarrationStart?: () => void;
  onNarrationEnd?: () => void;
}

export function useCreationNarration(options: UseCreationNarrationOptions = {}) {
  const { enabled = true, onNarrationStart, onNarrationEnd } = options;
  
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [currentText, setCurrentText] = useState<string | null>(null);
  const [currentSubtitle, setCurrentSubtitle] = useState<string | null>(null);
  const [hasPlayedIntro, setHasPlayedIntro] = useState(false);
  const [isMuted, setIsMuted] = useState(() => {
    if (typeof window === 'undefined') return false;
    return localStorage.getItem('creation-narration-muted') === 'true';
  });
  
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const abortRef = useRef<AbortController | null>(null);
  const playedStepsRef = useRef<Set<string>>(new Set());
  // Unique ID for current playback - used to detect stale async operations
  const currentPlayIdRef = useRef<number>(0);

  // Persist mute state
  useEffect(() => {
    localStorage.setItem('creation-narration-muted', String(isMuted));
  }, [isMuted]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      currentPlayIdRef.current = -1; // Invalidate all pending operations
      if (abortRef.current) abortRef.current.abort();
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.src = '';
      }
      window.speechSynthesis?.cancel();
    };
  }, []);

  const stopAll = useCallback(() => {
    // Increment play ID to invalidate any pending async operations
    currentPlayIdRef.current++;
    
    // Abort any pending fetch
    if (abortRef.current) {
      abortRef.current.abort();
      abortRef.current = null;
    }
    
    // Stop HTML5 audio
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.src = '';
      audioRef.current = null;
    }
    
    // Stop Web Speech
    window.speechSynthesis?.cancel();
    
    setIsPlaying(false);
    setIsLoading(false);
  }, []);

  const playWithWebSpeech = useCallback((text: string, playId: number) => {
    // Check if this playback is still valid
    if (playId !== currentPlayIdRef.current) return;
    
    if (!window.speechSynthesis) {
      console.warn('Web Speech API not available');
      return;
    }

    const utterance = new SpeechSynthesisUtterance(text);
    
    // Get a dramatic voice if available
    const voices = window.speechSynthesis.getVoices();
    const preferredVoice = voices.find(v => 
      v.name.toLowerCase().includes('daniel') ||
      v.name.toLowerCase().includes('alex') ||
      v.name.toLowerCase().includes('male')
    ) || voices.find(v => v.lang.startsWith('en')) || voices[0];
    
    if (preferredVoice) {
      utterance.voice = preferredVoice;
    }
    
    // Slower, deeper for atmosphere
    utterance.rate = 0.85;
    utterance.pitch = 0.85;
    utterance.volume = 1;

    utterance.onstart = () => {
      if (playId !== currentPlayIdRef.current) {
        window.speechSynthesis?.cancel();
        return;
      }
      setIsPlaying(true);
      setIsLoading(false);
      onNarrationStart?.();
    };

    utterance.onend = () => {
      if (playId === currentPlayIdRef.current) {
        setIsPlaying(false);
        setCurrentText(null);
        setCurrentSubtitle(null);
        onNarrationEnd?.();
      }
    };

    utterance.onerror = (e) => {
      if (e.error !== 'canceled' && e.error !== 'interrupted') {
        console.error('Speech error:', e);
      }
      if (playId === currentPlayIdRef.current) {
        setIsPlaying(false);
        setIsLoading(false);
      }
    };

    window.speechSynthesis.speak(utterance);
  }, [onNarrationStart, onNarrationEnd]);

  const play = useCallback(async (key: NarrationKey, force = false) => {
    if (!enabled || isMuted) return;
    
    // Don't replay the same step unless forced
    if (!force && playedStepsRef.current.has(key)) return;
    playedStepsRef.current.add(key);

    const narration = CREATION_NARRATION[key];
    if (!narration) return;

    // Stop any current playback and get a new play ID
    stopAll();
    const playId = currentPlayIdRef.current;

    setCurrentText(narration.text);
    setCurrentSubtitle(narration.subtitle);
    setIsLoading(true);

    try {
      abortRef.current = new AbortController();

      const response = await fetch('/api/tts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: narration.text }),
        signal: abortRef.current.signal,
      });

      // Check if this playback is still valid after fetch
      if (playId !== currentPlayIdRef.current) return;

      if (!response.ok) {
        throw new Error(`TTS error: ${response.status}`);
      }

      const contentType = response.headers.get('Content-Type');

      if (contentType?.includes('application/json')) {
        const data = await response.json();
        if (data.fallback) {
          playWithWebSpeech(narration.text, playId);
          return;
        }
        throw new Error(data.error);
      }

      const blob = await response.blob();
      
      // Check again after blob processing
      if (playId !== currentPlayIdRef.current) return;
      
      const url = URL.createObjectURL(blob);
      const audio = new Audio(url);
      audioRef.current = audio;

      audio.oncanplaythrough = () => {
        if (playId !== currentPlayIdRef.current) {
          URL.revokeObjectURL(url);
          return;
        }
        setIsLoading(false);
        setIsPlaying(true);
        onNarrationStart?.();
      };

      audio.onended = () => {
        URL.revokeObjectURL(url);
        if (playId === currentPlayIdRef.current) {
          setIsPlaying(false);
          setCurrentText(null);
          setCurrentSubtitle(null);
          onNarrationEnd?.();
        }
      };

      audio.onerror = () => {
        URL.revokeObjectURL(url);
        if (playId === currentPlayIdRef.current) {
          // Fallback to Web Speech
          playWithWebSpeech(narration.text, playId);
        }
      };

      // Only play if still valid
      if (playId === currentPlayIdRef.current) {
        await audio.play();
      }
    } catch (error) {
      // Ignore aborted requests and stale playbacks
      if ((error as Error).name === 'AbortError') return;
      if (playId !== currentPlayIdRef.current) return;
      
      console.error('Narration error:', error);
      playWithWebSpeech(narration.text, playId);
    }
  }, [enabled, isMuted, stopAll, playWithWebSpeech, onNarrationStart, onNarrationEnd]);

  const playIntro = useCallback(() => {
    if (!hasPlayedIntro) {
      setHasPlayedIntro(true);
      play('intro');
    }
  }, [hasPlayedIntro, play]);

  const playForStep = useCallback((step: string) => {
    const key = step as NarrationKey;
    if (CREATION_NARRATION[key]) {
      play(key);
    }
  }, [play]);

  const toggleMute = useCallback(() => {
    setIsMuted(prev => {
      if (!prev) stopAll();
      return !prev;
    });
  }, [stopAll]);

  const resetPlayed = useCallback(() => {
    playedStepsRef.current.clear();
    setHasPlayedIntro(false);
  }, []);

  return {
    isPlaying,
    isLoading,
    isMuted,
    currentText,
    currentSubtitle,
    play,
    playIntro,
    playForStep,
    stop: stopAll,
    toggleMute,
    resetPlayed,
    hasPlayedIntro
  };
}
