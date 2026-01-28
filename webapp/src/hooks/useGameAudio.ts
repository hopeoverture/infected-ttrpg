'use client';

import { useCallback, useEffect, useRef, useState } from 'react';

// Music mood configurations
const MUSIC_CONFIGS: Record<string, { tempo: string; mood: string; intensity: number }> = {
  'ambient-dread': { tempo: 'slow', mood: 'unsettling', intensity: 0.3 },
  'ambient-safe': { tempo: 'slow', mood: 'melancholic', intensity: 0.2 },
  'tension-building': { tempo: 'medium', mood: 'tense', intensity: 0.5 },
  'action-combat': { tempo: 'fast', mood: 'intense', intensity: 0.8 },
  'horror-sting': { tempo: 'sudden', mood: 'shock', intensity: 1.0 },
  'emotional': { tempo: 'slow', mood: 'somber', intensity: 0.4 },
  'exploration': { tempo: 'medium', mood: 'curious', intensity: 0.35 },
  'danger-imminent': { tempo: 'fast', mood: 'urgent', intensity: 0.7 },
};

// Sound effect descriptions for Web Audio synthesis
const SOUND_CONFIGS: Record<string, { type: string; duration: number; frequency?: number }> = {
  // Footsteps
  'footsteps-slow': { type: 'noise-burst', duration: 0.1 },
  'footsteps-running': { type: 'noise-burst', duration: 0.08 },
  'footsteps-infected': { type: 'noise-burst', duration: 0.15 },
  
  // Doors
  'door-creak': { type: 'sweep', duration: 0.8, frequency: 200 },
  'door-slam': { type: 'impact', duration: 0.3 },
  'door-break': { type: 'impact', duration: 0.5 },
  
  // Glass
  'glass-break': { type: 'noise-burst', duration: 0.4 },
  'glass-crunch': { type: 'noise-burst', duration: 0.15 },
  
  // Gunshots
  'gunshot-single': { type: 'impact', duration: 0.2, frequency: 100 },
  'gunshot-burst': { type: 'impact', duration: 0.5, frequency: 100 },
  'gunshot-distant': { type: 'impact', duration: 0.4, frequency: 80 },
  
  // Infected
  'infected-growl': { type: 'growl', duration: 1.2, frequency: 150 },
  'infected-scream': { type: 'scream', duration: 0.8, frequency: 400 },
  'infected-horde': { type: 'layered', duration: 2.0 },
  
  // Biological
  'heartbeat': { type: 'pulse', duration: 0.8, frequency: 60 },
  'breathing-heavy': { type: 'sweep', duration: 1.5, frequency: 100 },
  
  // Weather
  'wind-howl': { type: 'noise-sweep', duration: 3.0 },
  'rain-heavy': { type: 'noise-continuous', duration: 5.0 },
  'thunder': { type: 'impact', duration: 1.5, frequency: 50 },
  
  // Fire/explosion
  'fire-crackle': { type: 'noise-burst', duration: 2.0 },
  'explosion': { type: 'impact', duration: 1.0, frequency: 30 },
  
  // Metal/wood
  'metal-clang': { type: 'ring', duration: 0.5, frequency: 800 },
  'wood-crack': { type: 'impact', duration: 0.2 },
  
  // Electronic
  'radio-static': { type: 'noise-continuous', duration: 2.0 },
  'phone-buzz': { type: 'pulse', duration: 0.3, frequency: 200 },
  
  // Human
  'scream-human': { type: 'scream', duration: 1.0, frequency: 600 },
  'crying': { type: 'sweep', duration: 2.0, frequency: 300 },
  'whisper': { type: 'noise-burst', duration: 0.5 },
  
  // Special
  'silence': { type: 'none', duration: 0 },
};

export interface AudioCues {
  music?: string | null;
  soundEffects?: string[];
}

interface UseGameAudioOptions {
  enabled?: boolean;
  volume?: number;
  musicVolume?: number;
  sfxVolume?: number;
}

export function useGameAudio(options: UseGameAudioOptions = {}) {
  const {
    enabled = true,
    volume = 0.7,
    musicVolume = 0.4,
    sfxVolume = 0.6
  } = options;

  const [currentMusic, setCurrentMusic] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(() => {
    if (typeof window === 'undefined') return false;
    return localStorage.getItem('game-audio-muted') === 'true';
  });

  const audioContextRef = useRef<AudioContext | null>(null);
  const musicGainRef = useRef<GainNode | null>(null);
  const sfxGainRef = useRef<GainNode | null>(null);
  const musicOscillatorsRef = useRef<OscillatorNode[]>([]);
  const musicNodesRef = useRef<AudioScheduledSourceNode[]>([]);

  // Initialize audio context on first interaction
  const initAudio = useCallback(() => {
    if (audioContextRef.current) return;
    
    try {
      audioContextRef.current = new AudioContext();
      
      // Create gain nodes for volume control
      musicGainRef.current = audioContextRef.current.createGain();
      musicGainRef.current.gain.value = isMuted ? 0 : musicVolume * volume;
      musicGainRef.current.connect(audioContextRef.current.destination);
      
      sfxGainRef.current = audioContextRef.current.createGain();
      sfxGainRef.current.gain.value = isMuted ? 0 : sfxVolume * volume;
      sfxGainRef.current.connect(audioContextRef.current.destination);
    } catch (e) {
      console.warn('Web Audio API not available:', e);
    }
  }, [isMuted, musicVolume, sfxVolume, volume]);

  // Persist mute state
  useEffect(() => {
    localStorage.setItem('game-audio-muted', String(isMuted));
    if (musicGainRef.current) {
      musicGainRef.current.gain.value = isMuted ? 0 : musicVolume * volume;
    }
    if (sfxGainRef.current) {
      sfxGainRef.current.gain.value = isMuted ? 0 : sfxVolume * volume;
    }
  }, [isMuted, musicVolume, sfxVolume, volume]);

  // Stop all music
  const stopMusic = useCallback(() => {
    musicOscillatorsRef.current.forEach(osc => {
      try { osc.stop(); } catch { /* already stopped */ }
    });
    musicNodesRef.current.forEach(node => {
      try { node.stop(); } catch { /* already stopped */ }
    });
    musicOscillatorsRef.current = [];
    musicNodesRef.current = [];
    setIsPlaying(false);
  }, []);

  // Generate ambient drone based on mood
  const playAmbientDrone = useCallback((mood: string, intensity: number) => {
    if (!audioContextRef.current || !musicGainRef.current) return;
    
    const ctx = audioContextRef.current;
    const now = ctx.currentTime;
    
    // Create layered oscillators for ambient sound
    const baseFreq = mood === 'unsettling' ? 55 : mood === 'tense' ? 65 : 50;
    
    // Low drone
    const drone = ctx.createOscillator();
    drone.type = 'sine';
    drone.frequency.setValueAtTime(baseFreq, now);
    
    const droneGain = ctx.createGain();
    droneGain.gain.setValueAtTime(0, now);
    droneGain.gain.linearRampToValueAtTime(0.15 * intensity, now + 2);
    
    drone.connect(droneGain);
    droneGain.connect(musicGainRef.current);
    
    drone.start(now);
    musicOscillatorsRef.current.push(drone);
    
    // Add subtle movement
    const lfo = ctx.createOscillator();
    lfo.type = 'sine';
    lfo.frequency.setValueAtTime(0.1, now);
    
    const lfoGain = ctx.createGain();
    lfoGain.gain.setValueAtTime(3, now);
    
    lfo.connect(lfoGain);
    lfoGain.connect(drone.frequency);
    
    lfo.start(now);
    musicOscillatorsRef.current.push(lfo);
    
    setIsPlaying(true);
  }, []);

  // Play music mood
  const playMusic = useCallback((musicType: string | null) => {
    if (!enabled || isMuted || !musicType) {
      stopMusic();
      setCurrentMusic(null);
      return;
    }
    
    initAudio();
    
    if (musicType === currentMusic) return;
    
    stopMusic();
    setCurrentMusic(musicType);
    
    const config = MUSIC_CONFIGS[musicType];
    if (!config) return;
    
    playAmbientDrone(config.mood, config.intensity);
  }, [enabled, isMuted, currentMusic, stopMusic, initAudio, playAmbientDrone]);

  // Play a sound effect
  const playSoundEffect = useCallback((effectName: string) => {
    if (!enabled || isMuted) return;
    
    initAudio();
    
    if (!audioContextRef.current || !sfxGainRef.current) return;
    
    const config = SOUND_CONFIGS[effectName];
    if (!config || config.type === 'none') return;
    
    const ctx = audioContextRef.current;
    const now = ctx.currentTime;
    
    switch (config.type) {
      case 'impact': {
        // Short percussive sound
        const osc = ctx.createOscillator();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(config.frequency || 100, now);
        osc.frequency.exponentialRampToValueAtTime(20, now + config.duration);
        
        const gain = ctx.createGain();
        gain.gain.setValueAtTime(0.5, now);
        gain.gain.exponentialRampToValueAtTime(0.01, now + config.duration);
        
        osc.connect(gain);
        gain.connect(sfxGainRef.current);
        
        osc.start(now);
        osc.stop(now + config.duration);
        break;
      }
      
      case 'noise-burst': {
        // White noise burst
        const bufferSize = ctx.sampleRate * config.duration;
        const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
        const data = buffer.getChannelData(0);
        
        for (let i = 0; i < bufferSize; i++) {
          data[i] = Math.random() * 2 - 1;
        }
        
        const source = ctx.createBufferSource();
        source.buffer = buffer;
        
        const gain = ctx.createGain();
        gain.gain.setValueAtTime(0.3, now);
        gain.gain.exponentialRampToValueAtTime(0.01, now + config.duration);
        
        source.connect(gain);
        gain.connect(sfxGainRef.current);
        
        source.start(now);
        break;
      }
      
      case 'sweep': {
        // Frequency sweep
        const osc = ctx.createOscillator();
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(config.frequency || 200, now);
        osc.frequency.exponentialRampToValueAtTime((config.frequency || 200) * 0.5, now + config.duration);
        
        const gain = ctx.createGain();
        gain.gain.setValueAtTime(0.2, now);
        gain.gain.exponentialRampToValueAtTime(0.01, now + config.duration);
        
        osc.connect(gain);
        gain.connect(sfxGainRef.current);
        
        osc.start(now);
        osc.stop(now + config.duration);
        break;
      }
      
      case 'pulse': {
        // Heartbeat-like pulse
        const osc = ctx.createOscillator();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(config.frequency || 60, now);
        
        const gain = ctx.createGain();
        gain.gain.setValueAtTime(0, now);
        gain.gain.linearRampToValueAtTime(0.4, now + 0.1);
        gain.gain.linearRampToValueAtTime(0, now + 0.3);
        gain.gain.linearRampToValueAtTime(0.3, now + 0.4);
        gain.gain.linearRampToValueAtTime(0, now + config.duration);
        
        osc.connect(gain);
        gain.connect(sfxGainRef.current);
        
        osc.start(now);
        osc.stop(now + config.duration);
        break;
      }
      
      case 'growl':
      case 'scream': {
        // Modulated oscillator for creature sounds
        const osc = ctx.createOscillator();
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(config.frequency || 200, now);
        
        // Add vibrato for eerie effect
        const lfo = ctx.createOscillator();
        lfo.type = 'sine';
        lfo.frequency.setValueAtTime(8, now);
        
        const lfoGain = ctx.createGain();
        lfoGain.gain.setValueAtTime(50, now);
        
        lfo.connect(lfoGain);
        lfoGain.connect(osc.frequency);
        
        const gain = ctx.createGain();
        gain.gain.setValueAtTime(0.25, now);
        gain.gain.exponentialRampToValueAtTime(0.01, now + config.duration);
        
        osc.connect(gain);
        gain.connect(sfxGainRef.current);
        
        osc.start(now);
        lfo.start(now);
        osc.stop(now + config.duration);
        lfo.stop(now + config.duration);
        break;
      }
      
      case 'ring': {
        // Metallic ring
        const osc = ctx.createOscillator();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(config.frequency || 800, now);
        
        const gain = ctx.createGain();
        gain.gain.setValueAtTime(0.3, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + config.duration);
        
        osc.connect(gain);
        gain.connect(sfxGainRef.current);
        
        osc.start(now);
        osc.stop(now + config.duration);
        break;
      }
    }
  }, [enabled, isMuted, initAudio]);

  // Process audio cues from GM response
  const processAudioCues = useCallback((cues: AudioCues | null | undefined) => {
    if (!cues) return;
    
    // Handle music change
    if (cues.music !== undefined) {
      playMusic(cues.music);
    }
    
    // Play sound effects with slight delays between them
    if (cues.soundEffects && cues.soundEffects.length > 0) {
      cues.soundEffects.forEach((effect, index) => {
        setTimeout(() => {
          playSoundEffect(effect);
        }, index * 200); // 200ms between effects
      });
    }
  }, [playMusic, playSoundEffect]);

  const toggleMute = useCallback(() => {
    setIsMuted(prev => !prev);
  }, []);

  // Cleanup on unmount - inline cleanup to avoid stale closure references
  useEffect(() => {
    return () => {
      // Stop all oscillators directly (avoid using stopMusic which may have stale refs)
      musicOscillatorsRef.current.forEach(osc => {
        try { osc.stop(); } catch { /* already stopped */ }
      });
      musicNodesRef.current.forEach(node => {
        try { node.stop(); } catch { /* already stopped */ }
      });
      musicOscillatorsRef.current = [];
      musicNodesRef.current = [];

      // Close audio context
      if (audioContextRef.current) {
        audioContextRef.current.close().catch(() => {
          // Ignore errors on close
        });
      }
    };
  }, []); // Empty deps - cleanup logic uses refs directly

  return {
    currentMusic,
    isPlaying,
    isMuted,
    playMusic,
    playSoundEffect,
    processAudioCues,
    stopMusic,
    toggleMute,
    initAudio, // Call this on first user interaction
  };
}

// Audio synthesis helpers can be added here as needed
