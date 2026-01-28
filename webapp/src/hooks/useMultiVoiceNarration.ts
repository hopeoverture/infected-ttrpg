'use client';

import { useState, useCallback, useRef, useEffect } from 'react';
import { DialogSegment } from '@/lib/types/voice';
import { getDialogSegments } from '@/lib/audio/dialog-processor';
import { buildNPCVoiceMap, getDefaultCharacterVoice } from '@/lib/audio/voice-assignment';
import { FullNPC } from '@/lib/types/full-npc';
import { NPC } from '@/lib/types';

interface MultiVoiceNarrationOptions {
  gmVoiceId: string;
  playerVoiceId?: string;
  playerGender?: 'male' | 'female' | 'androgynous';
  party?: (FullNPC | NPC)[];
  enabled?: boolean;
}

interface MultiVoiceNarrationState {
  isPlaying: boolean;
  isLoading: boolean;
  currentSegmentIndex: number;
  totalSegments: number;
  currentSpeaker: string | null;
  error: string | null;
}

interface UseMultiVoiceNarrationReturn {
  state: MultiVoiceNarrationState;
  playNarrative: (narrative: string, dialogSegments?: DialogSegment[]) => Promise<void>;
  stop: () => void;
  pause: () => void;
  resume: () => void;
  skipToNext: () => void;
}

export function useMultiVoiceNarration(
  options: MultiVoiceNarrationOptions
): UseMultiVoiceNarrationReturn {
  const {
    gmVoiceId,
    playerVoiceId,
    playerGender,
    party = [],
    enabled = true
  } = options;

  const [state, setState] = useState<MultiVoiceNarrationState>({
    isPlaying: false,
    isLoading: false,
    currentSegmentIndex: 0,
    totalSegments: 0,
    currentSpeaker: null,
    error: null
  });

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const segmentsRef = useRef<DialogSegment[]>([]);
  const currentIndexRef = useRef(0);
  const isPlayingRef = useRef(false);
  const abortControllerRef = useRef<AbortController | null>(null);
  const npcVoiceMapRef = useRef<Map<string, string>>(new Map());

  // Update NPC voice map when party changes
  useEffect(() => {
    if (party.length > 0) {
      npcVoiceMapRef.current = buildNPCVoiceMap(party);
    }
  }, [party]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      stop();
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /**
   * Get the voice ID for a segment
   */
  const getVoiceIdForSegment = useCallback((segment: DialogSegment): string => {
    switch (segment.speaker) {
      case 'gm':
        return gmVoiceId;

      case 'player':
        return playerVoiceId || getDefaultCharacterVoice(playerGender);

      case 'npc':
        // Try to find voice by speaker ID or name
        if (segment.speakerId && npcVoiceMapRef.current.has(segment.speakerId)) {
          return npcVoiceMapRef.current.get(segment.speakerId)!;
        }
        if (segment.speakerName) {
          const lowercaseName = segment.speakerName.toLowerCase();
          if (npcVoiceMapRef.current.has(lowercaseName)) {
            return npcVoiceMapRef.current.get(lowercaseName)!;
          }
        }
        // Fallback to GM voice for unknown NPCs
        return gmVoiceId;

      default:
        return gmVoiceId;
    }
  }, [gmVoiceId, playerVoiceId, playerGender]);

  /**
   * Browser TTS fallback
   */
  const playWithBrowserTTS = useCallback((text: string): Promise<void> => {
    return new Promise((resolve, reject) => {
      if (!('speechSynthesis' in window)) {
        reject(new Error('Speech synthesis not available'));
        return;
      }

      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 0.9;
      utterance.onend = () => resolve();
      utterance.onerror = () => reject(new Error('Speech synthesis error'));

      window.speechSynthesis.speak(utterance);
    });
  }, []);

  /**
   * Fetch and play a single segment
   */
  const playSegment = useCallback(async (segment: DialogSegment): Promise<boolean> => {
    if (!enabled || !isPlayingRef.current) {
      return false;
    }

    const voiceId = getVoiceIdForSegment(segment);

    try {
      abortControllerRef.current = new AbortController();

      const response = await fetch('/api/tts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          text: segment.text,
          voiceId
        }),
        signal: abortControllerRef.current.signal
      });

      if (!response.ok) {
        throw new Error('Failed to generate speech');
      }

      const contentType = response.headers.get('Content-Type');

      // Check for fallback response
      if (contentType?.includes('application/json')) {
        const data = await response.json();
        if (data.fallback) {
          // Use browser TTS fallback
          await playWithBrowserTTS(data.text);
          return true;
        }
        throw new Error(data.error || 'Unknown error');
      }

      // Play audio
      const audioBlob = await response.blob();
      const audioUrl = URL.createObjectURL(audioBlob);

      return new Promise((resolve) => {
        audioRef.current = new Audio(audioUrl);

        audioRef.current.onended = () => {
          URL.revokeObjectURL(audioUrl);
          resolve(true);
        };

        audioRef.current.onerror = () => {
          URL.revokeObjectURL(audioUrl);
          resolve(false);
        };

        if (isPlayingRef.current) {
          audioRef.current.play().catch(() => resolve(false));
        } else {
          URL.revokeObjectURL(audioUrl);
          resolve(false);
        }
      });
    } catch (error) {
      if (error instanceof Error && error.name === 'AbortError') {
        return false;
      }
      console.error('Error playing segment:', error);
      return false;
    }
  }, [enabled, getVoiceIdForSegment, playWithBrowserTTS]);

  /**
   * Play all segments in sequence
   */
  const playAllSegments = useCallback(async () => {
    const segments = segmentsRef.current;

    while (currentIndexRef.current < segments.length && isPlayingRef.current) {
      const segment = segments[currentIndexRef.current];
      if (!segment) break;

      setState(prev => ({
        ...prev,
        currentSegmentIndex: currentIndexRef.current,
        currentSpeaker: segment.speakerName || segment.speaker
      }));

      const success = await playSegment(segment);

      if (!success && !isPlayingRef.current) {
        // Playback was stopped
        break;
      }

      currentIndexRef.current++;
    }

    // Playback complete
    if (isPlayingRef.current) {
      setState(prev => ({
        ...prev,
        isPlaying: false,
        isLoading: false,
        currentSpeaker: null
      }));
      isPlayingRef.current = false;
    }
  }, [playSegment]);

  /**
   * Stop playback
   */
  const stop = useCallback(() => {
    isPlayingRef.current = false;

    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      abortControllerRef.current = null;
    }

    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current = null;
    }

    // Stop browser TTS if active
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }

    setState({
      isPlaying: false,
      isLoading: false,
      currentSegmentIndex: 0,
      totalSegments: 0,
      currentSpeaker: null,
      error: null
    });
  }, []);

  /**
   * Start playing a narrative
   */
  const playNarrative = useCallback(async (
    narrative: string,
    dialogSegments?: DialogSegment[]
  ): Promise<void> => {
    if (!enabled) return;

    // Stop any current playback
    stop();

    // Build NPC name map for dialog parsing
    const npcNameMap = new Map<string, string>();
    for (const npc of party) {
      npcNameMap.set(npc.name, npc.id);
      if ('nickname' in npc && npc.nickname) {
        npcNameMap.set(npc.nickname, npc.id);
      }
    }

    // Parse or use provided segments
    const segments = getDialogSegments(narrative, dialogSegments, npcNameMap);

    if (segments.length === 0) {
      return;
    }

    // Set up state
    segmentsRef.current = segments;
    currentIndexRef.current = 0;
    isPlayingRef.current = true;

    setState({
      isPlaying: true,
      isLoading: true,
      currentSegmentIndex: 0,
      totalSegments: segments.length,
      currentSpeaker: null,
      error: null
    });

    // Start playback
    setState(prev => ({ ...prev, isLoading: false }));
    await playAllSegments();
  }, [enabled, party, playAllSegments, stop]);

  /**
   * Pause playback
   */
  const pause = useCallback(() => {
    if (audioRef.current && isPlayingRef.current) {
      audioRef.current.pause();
      isPlayingRef.current = false;
      setState(prev => ({ ...prev, isPlaying: false }));
    }
  }, []);

  /**
   * Resume playback
   */
  const resume = useCallback(() => {
    if (audioRef.current && !isPlayingRef.current) {
      isPlayingRef.current = true;
      setState(prev => ({ ...prev, isPlaying: true }));
      audioRef.current.play().catch(() => {
        // If resume fails, continue to next segment
        currentIndexRef.current++;
        playAllSegments();
      });
    }
  }, [playAllSegments]);

  /**
   * Skip to next segment
   */
  const skipToNext = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current = null;
    }

    // Let the playAllSegments loop handle moving to next
  }, []);

  return {
    state,
    playNarrative,
    stop,
    pause,
    resume,
    skipToNext
  };
}
