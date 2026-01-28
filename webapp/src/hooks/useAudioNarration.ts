'use client';

import { useState, useCallback, useRef, useEffect } from 'react';

interface AudioState {
  isPlaying: boolean;
  isLoading: boolean;
  currentMessageId: string | null;
  error: string | null;
}

interface UseAudioNarrationOptions {
  voiceId?: string;
  onPlayStart?: (messageId: string) => void;
  onPlayEnd?: (messageId: string) => void;
  onError?: (error: string) => void;
}

export function useAudioNarration(options: UseAudioNarrationOptions = {}) {
  const [isMuted, setIsMuted] = useState<boolean>(() => {
    if (typeof window === 'undefined') return false;
    return localStorage.getItem('gm-audio-muted') === 'true';
  });
  
  const [audioState, setAudioState] = useState<AudioState>({
    isPlaying: false,
    isLoading: false,
    currentMessageId: null,
    error: null,
  });

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const speechSynthRef = useRef<SpeechSynthesisUtterance | null>(null);
  const abortControllerRef = useRef<AbortController | null>(null);

  // Persist mute state
  useEffect(() => {
    localStorage.setItem('gm-audio-muted', String(isMuted));
  }, [isMuted]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      // Inline cleanup to avoid stale closure
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.src = '';
      }
      if (speechSynthRef.current) {
        window.speechSynthesis?.cancel();
      }
    };
  }, []);

  const stopAudio = useCallback(() => {
    // Stop fetch request
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      abortControllerRef.current = null;
    }

    // Stop HTML5 audio
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.src = '';
      audioRef.current = null;
    }

    // Stop Web Speech API
    if (speechSynthRef.current) {
      window.speechSynthesis?.cancel();
      speechSynthRef.current = null;
    }

    setAudioState({
      isPlaying: false,
      isLoading: false,
      currentMessageId: null,
      error: null,
    });
  }, []);

  const playWithWebSpeech = useCallback((text: string, messageId: string) => {
    if (!window.speechSynthesis) {
      setAudioState(prev => ({ ...prev, error: 'Speech synthesis not supported', isLoading: false }));
      options.onError?.('Speech synthesis not supported');
      return;
    }

    const utterance = new SpeechSynthesisUtterance(text);
    
    // Get voices and pick a deep male voice if available
    const voices = window.speechSynthesis.getVoices();
    const preferredVoice = voices.find(v => 
      v.name.toLowerCase().includes('male') || 
      v.name.toLowerCase().includes('daniel') ||
      v.name.toLowerCase().includes('alex')
    ) || voices.find(v => v.lang.startsWith('en')) || voices[0];
    
    if (preferredVoice) {
      utterance.voice = preferredVoice;
    }
    
    utterance.rate = 0.9;   // Slightly slower for horror atmosphere
    utterance.pitch = 0.9;  // Slightly deeper
    utterance.volume = 1;

    utterance.onstart = () => {
      setAudioState({
        isPlaying: true,
        isLoading: false,
        currentMessageId: messageId,
        error: null,
      });
      options.onPlayStart?.(messageId);
    };

    utterance.onend = () => {
      setAudioState({
        isPlaying: false,
        isLoading: false,
        currentMessageId: null,
        error: null,
      });
      options.onPlayEnd?.(messageId);
    };

    utterance.onerror = (event) => {
      if (event.error !== 'canceled') {
        setAudioState(prev => ({ 
          ...prev, 
          error: 'Speech synthesis error', 
          isPlaying: false, 
          isLoading: false 
        }));
        options.onError?.('Speech synthesis error');
      }
    };

    speechSynthRef.current = utterance;
    window.speechSynthesis.speak(utterance);
  }, [options]);

  const playAudio = useCallback(async (text: string, messageId: string) => {
    if (isMuted) return;

    // Stop any current audio
    stopAudio();

    setAudioState({
      isPlaying: false,
      isLoading: true,
      currentMessageId: messageId,
      error: null,
    });

    try {
      abortControllerRef.current = new AbortController();

      const response = await fetch('/api/tts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text, voiceId: options.voiceId }),
        signal: abortControllerRef.current.signal,
      });

      if (!response.ok) {
        throw new Error(`TTS API error: ${response.status}`);
      }

      const contentType = response.headers.get('Content-Type');

      // Check if fallback to Web Speech API
      if (contentType?.includes('application/json')) {
        const data = await response.json();
        if (data.fallback) {
          playWithWebSpeech(data.text || text, messageId);
          return;
        }
        throw new Error(data.error || 'Unknown error');
      }

      // Play ElevenLabs audio
      const audioBlob = await response.blob();
      const audioUrl = URL.createObjectURL(audioBlob);

      const audio = new Audio(audioUrl);
      audioRef.current = audio;

      audio.oncanplaythrough = () => {
        setAudioState(prev => ({ ...prev, isLoading: false, isPlaying: true }));
        options.onPlayStart?.(messageId);
      };

      audio.onended = () => {
        URL.revokeObjectURL(audioUrl);
        setAudioState({
          isPlaying: false,
          isLoading: false,
          currentMessageId: null,
          error: null,
        });
        options.onPlayEnd?.(messageId);
      };

      audio.onerror = () => {
        URL.revokeObjectURL(audioUrl);
        // Fallback to Web Speech on audio error
        playWithWebSpeech(text, messageId);
      };

      await audio.play();
    } catch (error) {
      if ((error as Error).name === 'AbortError') {
        return; // Intentional abort, not an error
      }
      
      console.error('Audio playback error:', error);
      // Fallback to Web Speech API
      playWithWebSpeech(text, messageId);
    }
  }, [isMuted, stopAudio, playWithWebSpeech, options]);

  const toggleMute = useCallback(() => {
    setIsMuted(prev => {
      const newMuted = !prev;
      if (newMuted) {
        stopAudio();
      }
      return newMuted;
    });
  }, [stopAudio]);

  const togglePlayback = useCallback((text: string, messageId: string) => {
    if (audioState.currentMessageId === messageId && (audioState.isPlaying || audioState.isLoading)) {
      stopAudio();
    } else {
      playAudio(text, messageId);
    }
  }, [audioState, playAudio, stopAudio]);

  return {
    isMuted,
    setIsMuted,
    toggleMute,
    audioState,
    playAudio,
    stopAudio,
    togglePlayback,
  };
}
