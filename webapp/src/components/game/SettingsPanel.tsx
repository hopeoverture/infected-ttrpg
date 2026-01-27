'use client';

import { useState, useEffect } from 'react';

export interface GameSettings {
  aiProvider: 'anthropic' | 'openai' | 'google';
  ttsEnabled: boolean;
  ttsVoice: string;
  autoGenerateImages: boolean;
  soundEffectsEnabled: boolean;
  soundVolume: number;
  difficultyModifier: number; // -1 to +1 dice
}

const DEFAULT_SETTINGS: GameSettings = {
  aiProvider: 'anthropic',
  ttsEnabled: false,
  ttsVoice: 'alloy',
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

const TTS_VOICES = [
  { id: 'alloy', name: 'Alloy', description: 'Neutral' },
  { id: 'echo', name: 'Echo', description: 'Warm' },
  { id: 'fable', name: 'Fable', description: 'Expressive' },
  { id: 'onyx', name: 'Onyx', description: 'Deep' },
  { id: 'nova', name: 'Nova', description: 'Friendly' },
  { id: 'shimmer', name: 'Shimmer', description: 'Clear' }
];

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

  useEffect(() => {
    if (isOpen) {
      setLocalSettings(settings);
      setHasChanges(false);
    }
  }, [isOpen, settings]);

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
              <select
                value={localSettings.ttsVoice}
                onChange={(e) => updateSetting('ttsVoice', e.target.value)}
                className="input"
              >
                {TTS_VOICES.map(voice => (
                  <option key={voice.id} value={voice.id}>
                    {voice.name} - {voice.description}
                  </option>
                ))}
              </select>
            )}
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

export { DEFAULT_SETTINGS };
