'use client';

import { useState, useEffect, useCallback } from 'react';

export interface GameSettings {
  aiProvider: 'anthropic' | 'openai' | 'google';
  ttsEnabled: boolean;
  ttsVoice: string;
  showSubtitles: boolean;
  subtitleStyle: 'cinematic' | 'minimal' | 'typewriter';
  autoGenerateImages: boolean;
  soundEffectsEnabled: boolean;
  soundVolume: number;
  difficultyModifier: number; // -1 to +1 dice
}

const DEFAULT_SETTINGS: GameSettings = {
  aiProvider: 'anthropic',
  ttsEnabled: false,
  ttsVoice: 'adam',
  showSubtitles: true,
  subtitleStyle: 'cinematic',
  autoGenerateImages: true,
  soundEffectsEnabled: true,
  soundVolume: 0.7,
  difficultyModifier: 0
};

const AI_PROVIDERS = [
  { id: 'anthropic', name: 'Claude (Anthropic)', description: 'Best narrative quality' },
  { id: 'openai', name: 'GPT-4 (OpenAI)', description: 'Fast and capable' },
  { id: 'google', name: 'Gemini (Google)', description: 'Good balance' }
] as const;

// ElevenLabs voices - grouped by style for the UI
const TTS_VOICES = {
  narrator: {
    label: '📖 Narrators',
    voices: [
      { id: 'adam', name: 'Adam', desc: 'Deep & clear', gender: 'male' },
      { id: 'daniel', name: 'Daniel', desc: 'Authoritative British', gender: 'male' },
      { id: 'elli', name: 'Elli', desc: 'Clear American', gender: 'female' },
      { id: 'charlotte', name: 'Charlotte', desc: 'Elegant British', gender: 'female' },
    ]
  },
  dramatic: {
    label: '🎭 Dramatic',
    voices: [
      { id: 'arnold', name: 'Arnold', desc: 'Gravelly & intense', gender: 'male' },
      { id: 'clyde', name: 'Clyde', desc: 'War-worn veteran', gender: 'male' },
      { id: 'domi', name: 'Domi', desc: 'Strong & intense', gender: 'female' },
      { id: 'bella', name: 'Bella', desc: 'Warm narrator', gender: 'female' },
    ]
  },
  mysterious: {
    label: '🌙 Mysterious',
    voices: [
      { id: 'marcus', name: 'Marcus', desc: 'Thoughtful & measured', gender: 'male' },
      { id: 'james', name: 'James', desc: 'Calm Australian', gender: 'male' },
      { id: 'rachel', name: 'Rachel', desc: 'Calm & composed', gender: 'female' },
      { id: 'sarah', name: 'Sarah', desc: 'Soft & intimate', gender: 'female' },
    ]
  },
  warm: {
    label: '☀️ Warm',
    voices: [
      { id: 'liam', name: 'Liam', desc: 'Young & earnest', gender: 'male' },
      { id: 'josh', name: 'Josh', desc: 'Deep American', gender: 'male' },
    ]
  },
  character: {
    label: '🎪 Character',
    voices: [
      { id: 'callum', name: 'Callum', desc: 'Intense Scottish', gender: 'male' },
      { id: 'charlie', name: 'Charlie', desc: 'Casual Australian', gender: 'male' },
      { id: 'matilda', name: 'Matilda', desc: 'Warm Australian', gender: 'female' },
      { id: 'fin', name: 'Fin', desc: 'Irish storyteller', gender: 'male' },
    ]
  }
};

// Flatten for easy lookup
const ALL_VOICES = Object.values(TTS_VOICES).flatMap(group => group.voices);

interface SettingsPanelProps {
  isOpen: boolean;
  onClose: () => void;
  settings: GameSettings;
  onSave: (settings: GameSettings) => void;
}

export default function SettingsPanel({
  isOpen,
  onClose,
  settings,
  onSave
}: SettingsPanelProps) {
  const [localSettings, setLocalSettings] = useState<GameSettings>(settings);
  const [hasChanges, setHasChanges] = useState(false);
  const [isPreviewPlaying, setIsPreviewPlaying] = useState(false);
  const [previewAudio, setPreviewAudio] = useState<HTMLAudioElement | null>(null);

  // Reset local state when modal opens
  useEffect(() => {
    if (isOpen) {
      setLocalSettings(settings);
      setHasChanges(false);
    }
    // Stop preview when closing
    return () => {
      if (previewAudio) {
        previewAudio.pause();
        previewAudio.src = '';
      }
    };
  }, [isOpen, settings, previewAudio]);

  const updateSetting = <K extends keyof GameSettings>(key: K, value: GameSettings[K]) => {
    setLocalSettings(prev => ({ ...prev, [key]: value }));
    setHasChanges(true);
  };

  const handleSave = () => {
    onSave(localSettings);
    onClose();
  };

  const handleReset = () => {
    setLocalSettings(DEFAULT_SETTINGS);
    setHasChanges(true);
  };

  // Preview voice
  const previewVoice = useCallback(async (voiceId: string) => {
    // Stop any current preview
    if (previewAudio) {
      previewAudio.pause();
      previewAudio.src = '';
    }

    setIsPreviewPlaying(true);

    try {
      const response = await fetch('/api/tts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          text: "The infected are at the door. You have seconds to decide. What do you do?",
          voiceId
        }),
      });

      if (!response.ok) {
        throw new Error('Preview failed');
      }

      const contentType = response.headers.get('Content-Type');
      if (contentType?.includes('application/json')) {
        // Fallback response, can't preview
        setIsPreviewPlaying(false);
        return;
      }

      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      const audio = new Audio(url);
      
      audio.onended = () => {
        URL.revokeObjectURL(url);
        setIsPreviewPlaying(false);
        setPreviewAudio(null);
      };
      
      audio.onerror = () => {
        URL.revokeObjectURL(url);
        setIsPreviewPlaying(false);
        setPreviewAudio(null);
      };

      setPreviewAudio(audio);
      await audio.play();
    } catch (error) {
      console.error('Voice preview error:', error);
      setIsPreviewPlaying(false);
    }
  }, [previewAudio]);

  const stopPreview = useCallback(() => {
    if (previewAudio) {
      previewAudio.pause();
      previewAudio.src = '';
      setPreviewAudio(null);
    }
    setIsPreviewPlaying(false);
  }, [previewAudio]);

  const currentVoice = ALL_VOICES.find(v => v.id === localSettings.ttsVoice);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/80 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Panel */}
      <div className="relative z-10 w-full max-w-lg mx-4 bg-surface border border-subtle rounded-lg shadow-xl max-h-[90vh] overflow-hidden flex flex-col animate-fade-in">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-subtle">
          <h2 className="text-xl font-bold">⚙️ Settings</h2>
          <button 
            onClick={onClose}
            className="text-muted hover:text-primary transition-colors"
            aria-label="Close settings"
          >
            ✕
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-4 space-y-6">
          {/* AI Provider */}
          <section>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-muted mb-3">
              AI Game Master
            </h3>
            <div className="space-y-2">
              {AI_PROVIDERS.map(provider => (
                <label
                  key={provider.id}
                  className={`flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-all ${
                    localSettings.aiProvider === provider.id
                      ? 'border-gold bg-gold/10'
                      : 'border-subtle hover:border-medium'
                  }`}
                >
                  <input
                    type="radio"
                    name="aiProvider"
                    value={provider.id}
                    checked={localSettings.aiProvider === provider.id}
                    onChange={() => updateSetting('aiProvider', provider.id)}
                    className="sr-only"
                  />
                  <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${
                    localSettings.aiProvider === provider.id ? 'border-gold' : 'border-muted'
                  }`}>
                    {localSettings.aiProvider === provider.id && (
                      <div className="w-2 h-2 rounded-full bg-gold" />
                    )}
                  </div>
                  <div>
                    <div className="font-medium">{provider.name}</div>
                    <div className="text-xs text-muted">{provider.description}</div>
                  </div>
                </label>
              ))}
            </div>
          </section>

          {/* Text-to-Speech */}
          <section>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-muted mb-3">
              Voice Narration
            </h3>
            <label className="flex items-center justify-between mb-3">
              <span>Enable TTS</span>
              <button
                onClick={() => updateSetting('ttsEnabled', !localSettings.ttsEnabled)}
                className={`w-12 h-6 rounded-full transition-colors ${
                  localSettings.ttsEnabled ? 'bg-gold' : 'bg-card'
                }`}
              >
                <div className={`w-5 h-5 rounded-full bg-white shadow transition-transform ${
                  localSettings.ttsEnabled ? 'translate-x-6' : 'translate-x-0.5'
                }`} />
              </button>
            </label>
            
            {localSettings.ttsEnabled && (
              <div className="space-y-3">
                {/* Current voice display */}
                <div className="flex items-center justify-between p-3 bg-card rounded-lg border border-subtle">
                  <div>
                    <div className="font-medium flex items-center gap-2">
                      {currentVoice?.name || 'Unknown'}
                      <span className="text-xs px-1.5 py-0.5 rounded bg-surface text-muted">
                        {currentVoice?.gender === 'male' ? '♂' : '♀'}
                      </span>
                    </div>
                    <div className="text-xs text-muted">{currentVoice?.desc}</div>
                  </div>
                  <button
                    onClick={() => isPreviewPlaying ? stopPreview() : previewVoice(localSettings.ttsVoice)}
                    disabled={isPreviewPlaying && !previewAudio}
                    className="btn text-sm"
                  >
                    {isPreviewPlaying ? '⏹ Stop' : '▶ Preview'}
                  </button>
                </div>

                {/* Voice selector by category */}
                <div className="space-y-3">
                  {Object.entries(TTS_VOICES).map(([styleKey, group]) => (
                    <div key={styleKey}>
                      <div className="text-xs font-medium text-muted mb-2">{group.label}</div>
                      <div className="grid grid-cols-2 gap-2">
                        {group.voices.map(voice => (
                          <button
                            key={voice.id}
                            onClick={() => updateSetting('ttsVoice', voice.id)}
                            className={`p-2 rounded-lg border text-left transition-all ${
                              localSettings.ttsVoice === voice.id
                                ? 'border-gold bg-gold/10'
                                : 'border-subtle hover:border-medium'
                            }`}
                          >
                            <div className="font-medium text-sm flex items-center gap-1">
                              {voice.name}
                              <span className="text-[10px] text-muted">
                                {voice.gender === 'male' ? '♂' : '♀'}
                              </span>
                            </div>
                            <div className="text-xs text-muted truncate">{voice.desc}</div>
                          </button>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Subtitles */}
            <div className="mt-4 pt-4 border-t border-subtle">
              <label className="flex items-center justify-between mb-3">
                <div>
                  <div>Show Subtitles</div>
                  <div className="text-xs text-muted">Display narration text on screen</div>
                </div>
                <button
                  onClick={() => updateSetting('showSubtitles', !localSettings.showSubtitles)}
                  className={`w-12 h-6 rounded-full transition-colors ${
                    localSettings.showSubtitles ? 'bg-gold' : 'bg-card'
                  }`}
                >
                  <div className={`w-5 h-5 rounded-full bg-white shadow transition-transform ${
                    localSettings.showSubtitles ? 'translate-x-6' : 'translate-x-0.5'
                  }`} />
                </button>
              </label>

              {localSettings.showSubtitles && (
                <div className="space-y-2">
                  <div className="text-sm text-muted mb-2">Subtitle Style</div>
                  {[
                    { id: 'cinematic', name: 'Cinematic', desc: 'Elegant with gold accents' },
                    { id: 'minimal', name: 'Minimal', desc: 'Simple dark background' },
                    { id: 'typewriter', name: 'Typewriter', desc: 'Text reveals progressively' }
                  ].map(style => (
                    <label
                      key={style.id}
                      className={`flex items-center gap-3 p-2 rounded-lg border cursor-pointer transition-all ${
                        localSettings.subtitleStyle === style.id
                          ? 'border-gold bg-gold/10'
                          : 'border-subtle hover:border-medium'
                      }`}
                    >
                      <input
                        type="radio"
                        name="subtitleStyle"
                        value={style.id}
                        checked={localSettings.subtitleStyle === style.id}
                        onChange={() => updateSetting('subtitleStyle', style.id as GameSettings['subtitleStyle'])}
                        className="sr-only"
                      />
                      <div className={`w-3 h-3 rounded-full border-2 ${
                        localSettings.subtitleStyle === style.id ? 'border-gold bg-gold' : 'border-muted'
                      }`} />
                      <div>
                        <div className="text-sm font-medium">{style.name}</div>
                        <div className="text-xs text-muted">{style.desc}</div>
                      </div>
                    </label>
                  ))}
                </div>
              )}
            </div>
          </section>

          {/* Images */}
          <section>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-muted mb-3">
              Scene Images
            </h3>
            <label className="flex items-center justify-between">
              <div>
                <div>Auto-generate images</div>
                <div className="text-xs text-muted">Creates AI images for new scenes</div>
              </div>
              <button
                onClick={() => updateSetting('autoGenerateImages', !localSettings.autoGenerateImages)}
                className={`w-12 h-6 rounded-full transition-colors ${
                  localSettings.autoGenerateImages ? 'bg-gold' : 'bg-card'
                }`}
              >
                <div className={`w-5 h-5 rounded-full bg-white shadow transition-transform ${
                  localSettings.autoGenerateImages ? 'translate-x-6' : 'translate-x-0.5'
                }`} />
              </button>
            </label>
          </section>

          {/* Sound */}
          <section>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-muted mb-3">
              Audio
            </h3>
            <label className="flex items-center justify-between mb-3">
              <span>Sound Effects</span>
              <button
                onClick={() => updateSetting('soundEffectsEnabled', !localSettings.soundEffectsEnabled)}
                className={`w-12 h-6 rounded-full transition-colors ${
                  localSettings.soundEffectsEnabled ? 'bg-gold' : 'bg-card'
                }`}
              >
                <div className={`w-5 h-5 rounded-full bg-white shadow transition-transform ${
                  localSettings.soundEffectsEnabled ? 'translate-x-6' : 'translate-x-0.5'
                }`} />
              </button>
            </label>
            
            <label className="block">
              <div className="flex justify-between mb-1">
                <span className="text-sm">Volume</span>
                <span className="text-sm text-muted">{Math.round(localSettings.soundVolume * 100)}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="1"
                step="0.1"
                value={localSettings.soundVolume}
                onChange={(e) => updateSetting('soundVolume', parseFloat(e.target.value))}
                className="w-full"
              />
            </label>
          </section>

          {/* Difficulty */}
          <section>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-muted mb-3">
              Difficulty
            </h3>
            <div className="flex items-center justify-between">
              <div>
                <div>Dice Modifier</div>
                <div className="text-xs text-muted">
                  {localSettings.difficultyModifier === 0 && 'Standard difficulty'}
                  {localSettings.difficultyModifier > 0 && `+${localSettings.difficultyModifier} bonus dice (easier)`}
                  {localSettings.difficultyModifier < 0 && `${localSettings.difficultyModifier} dice (harder)`}
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => updateSetting('difficultyModifier', Math.max(-2, localSettings.difficultyModifier - 1))}
                  disabled={localSettings.difficultyModifier <= -2}
                  className="w-8 h-8 rounded bg-card border border-subtle hover:border-medium disabled:opacity-30"
                >
                  -
                </button>
                <span className="w-8 text-center font-bold">
                  {localSettings.difficultyModifier > 0 ? '+' : ''}{localSettings.difficultyModifier}
                </span>
                <button
                  onClick={() => updateSetting('difficultyModifier', Math.min(2, localSettings.difficultyModifier + 1))}
                  disabled={localSettings.difficultyModifier >= 2}
                  className="w-8 h-8 rounded bg-card border border-subtle hover:border-medium disabled:opacity-30"
                >
                  +
                </button>
              </div>
            </div>
          </section>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between p-4 border-t border-subtle">
          <button
            onClick={handleReset}
            className="text-sm text-muted hover:text-primary transition-colors"
          >
            Reset to Defaults
          </button>
          <div className="flex gap-2">
            <button onClick={onClose} className="btn">
              Cancel
            </button>
            <button 
              onClick={handleSave} 
              className="btn btn-primary"
              disabled={!hasChanges}
            >
              Save Changes
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export { DEFAULT_SETTINGS, TTS_VOICES, ALL_VOICES };
