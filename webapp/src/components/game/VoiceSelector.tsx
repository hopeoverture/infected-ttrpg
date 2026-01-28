'use client';

import { useState, useMemo } from 'react';
import {
  VoiceOption,
  VoiceGender,
  VoiceStyle,
  VOICE_OPTIONS,
  getVoiceById
} from '@/lib/types/voice';
import VoicePreviewButton from './VoicePreviewButton';

interface VoiceSelectorProps {
  selectedVoiceId: string | null;
  onVoiceSelect: (voiceId: string) => void;
  filterGender?: VoiceGender | null;
  showPreview?: boolean;
  previewText?: string;
  label?: string;
  className?: string;
}

const STYLE_LABELS: Record<VoiceStyle, string> = {
  narrator: 'Narrator',
  dramatic: 'Dramatic',
  mysterious: 'Mysterious',
  warm: 'Warm',
  character: 'Character'
};

const STYLE_ORDER: VoiceStyle[] = ['narrator', 'dramatic', 'mysterious', 'warm', 'character'];

export default function VoiceSelector({
  selectedVoiceId,
  onVoiceSelect,
  filterGender,
  showPreview = true,
  previewText,
  label,
  className = ''
}: VoiceSelectorProps) {
  const [activeStyle, setActiveStyle] = useState<VoiceStyle | 'all'>('all');

  // Filter voices by gender if specified
  const filteredVoices = useMemo(() => {
    let voices = VOICE_OPTIONS;
    if (filterGender) {
      voices = voices.filter(v => v.gender === filterGender);
    }
    return voices;
  }, [filterGender]);

  // Group voices by style
  const voicesByStyle = useMemo(() => {
    const grouped: Record<VoiceStyle, VoiceOption[]> = {
      narrator: [],
      dramatic: [],
      mysterious: [],
      warm: [],
      character: []
    };

    for (const voice of filteredVoices) {
      grouped[voice.style].push(voice);
    }

    return grouped;
  }, [filteredVoices]);

  // Get voices to display based on active style filter
  const displayVoices = useMemo(() => {
    if (activeStyle === 'all') {
      return filteredVoices;
    }
    return voicesByStyle[activeStyle] || [];
  }, [activeStyle, filteredVoices, voicesByStyle]);

  // Get available styles (only show styles that have voices after gender filter)
  const availableStyles = useMemo(() => {
    return STYLE_ORDER.filter(style => voicesByStyle[style].length > 0);
  }, [voicesByStyle]);

  const selectedVoice = selectedVoiceId ? getVoiceById(selectedVoiceId) : null;

  return (
    <div className={`space-y-4 ${className}`}>
      {label && (
        <div className="text-lg font-display font-bold text-primary">{label}</div>
      )}

      {/* Style filter tabs */}
      <div className="flex flex-wrap gap-2">
        <button
          onClick={() => setActiveStyle('all')}
          className={`px-3 py-1.5 text-sm rounded-lg transition-all ${
            activeStyle === 'all'
              ? 'bg-primary text-black font-medium'
              : 'bg-surface text-muted hover:text-primary hover:bg-surface/80'
          }`}
        >
          All Voices
        </button>
        {availableStyles.map(style => (
          <button
            key={style}
            onClick={() => setActiveStyle(style)}
            className={`px-3 py-1.5 text-sm rounded-lg transition-all ${
              activeStyle === style
                ? 'bg-primary text-black font-medium'
                : 'bg-surface text-muted hover:text-primary hover:bg-surface/80'
            }`}
          >
            {STYLE_LABELS[style]}
          </button>
        ))}
      </div>

      {/* Voice grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
        {displayVoices.map(voice => {
          const isSelected = selectedVoiceId === voice.id;

          return (
            <div
              key={voice.id}
              onClick={() => onVoiceSelect(voice.id)}
              className={`relative p-3 rounded-lg border-2 cursor-pointer transition-all ${
                isSelected
                  ? 'border-primary bg-primary/10 ring-1 ring-primary/30'
                  : 'border-subtle hover:border-muted bg-card'
              }`}
            >
              {/* Selection indicator */}
              {isSelected && (
                <div className="absolute top-2 right-2 w-5 h-5 bg-primary rounded-full flex items-center justify-center">
                  <svg className="w-3 h-3 text-black" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </div>
              )}

              {/* Voice info */}
              <div className="space-y-1">
                <div className="font-medium text-primary">{voice.name}</div>
                <div className="text-xs text-muted">{voice.description}</div>
                <div className="flex items-center gap-2 mt-2">
                  <span className={`text-[10px] px-1.5 py-0.5 rounded ${
                    voice.gender === 'male' ? 'bg-blue-500/20 text-blue-400' : 'bg-pink-500/20 text-pink-400'
                  }`}>
                    {voice.gender}
                  </span>
                  <span className="text-[10px] px-1.5 py-0.5 rounded bg-surface text-muted">
                    {STYLE_LABELS[voice.style]}
                  </span>
                </div>
              </div>

              {/* Preview button */}
              {showPreview && (
                <div className="mt-2" onClick={e => e.stopPropagation()}>
                  <VoicePreviewButton
                    voiceId={voice.id}
                    text={previewText || `Hello, I am ${voice.name}. I will be narrating your adventure.`}
                    size="sm"
                  />
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Selected voice summary */}
      {selectedVoice && (
        <div className="bg-surface/50 rounded-lg p-3 border border-subtle">
          <div className="flex items-center gap-3">
            <div className="flex-1">
              <div className="text-sm text-muted">Selected Voice</div>
              <div className="font-medium text-primary">{selectedVoice.name}</div>
              <div className="text-xs text-muted">{selectedVoice.description}</div>
            </div>
            {showPreview && (
              <VoicePreviewButton
                voiceId={selectedVoice.id}
                text={previewText || `Hello, I am ${selectedVoice.name}. I will be narrating your adventure.`}
                size="md"
              />
            )}
          </div>
        </div>
      )}

      {/* Empty state */}
      {displayVoices.length === 0 && (
        <div className="text-center py-8 text-muted">
          No voices available for the selected filters
        </div>
      )}
    </div>
  );
}
