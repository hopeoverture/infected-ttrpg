'use client';

import { useState } from 'react';
import {
  GamePreferences,
  Difficulty,
  Theme,
  Tone,
  DIFFICULTIES,
  THEMES,
  TONES
} from '@/lib/types/game-preferences';

interface PreferencesStepProps {
  preferences: GamePreferences;
  onChange: (preferences: GamePreferences) => void;
}

export default function PreferencesStep({ preferences, onChange }: PreferencesStepProps) {
  const [localPreferences, setLocalPreferences] = useState<GamePreferences>(preferences);

  const updatePreferences = (updates: Partial<GamePreferences>) => {
    const newPrefs = { ...localPreferences, ...updates };
    setLocalPreferences(newPrefs);
    onChange(newPrefs);
  };

  const toggleTheme = (theme: Theme) => {
    const currentThemes = localPreferences.themes;
    let newThemes: Theme[];

    if (currentThemes.includes(theme)) {
      // Remove theme (but keep at least one)
      newThemes = currentThemes.filter(t => t !== theme);
      if (newThemes.length === 0) return;
    } else {
      // Add theme (max 5)
      if (currentThemes.length >= 5) return;
      newThemes = [...currentThemes, theme];
    }

    updatePreferences({ themes: newThemes });
  };

  const updatePlayStyle = (key: 'roleplay' | 'story' | 'combat', value: number) => {
    // Normalize to ensure they sum to 100
    const newPlayStyle = { ...localPreferences.playStyle };
    newPlayStyle[key] = value;

    // Adjust the others proportionally
    const total = newPlayStyle.roleplay + newPlayStyle.story + newPlayStyle.combat;
    if (total !== 100) {
      const scale = 100 / total;
      newPlayStyle.roleplay = Math.round(newPlayStyle.roleplay * scale);
      newPlayStyle.story = Math.round(newPlayStyle.story * scale);
      newPlayStyle.combat = Math.round(newPlayStyle.combat * scale);

      // Fix any rounding errors
      const diff = 100 - (newPlayStyle.roleplay + newPlayStyle.story + newPlayStyle.combat);
      if (diff !== 0) {
        newPlayStyle[key] += diff;
      }
    }

    updatePreferences({ playStyle: newPlayStyle });
  };

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      {/* Difficulty Selection */}
      <div>
        <h3 className="text-lg font-display font-bold text-primary mb-2">Difficulty</h3>
        <p className="text-sm text-muted mb-4">How punishing should the world be?</p>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {(Object.entries(DIFFICULTIES) as [Difficulty, { name: string; description: string }][]).map(([key, diff]) => (
            <button
              key={key}
              onClick={() => updatePreferences({ difficulty: key })}
              className={`p-4 rounded-lg border-2 text-left transition-all ${
                localPreferences.difficulty === key
                  ? 'border-primary bg-primary/10'
                  : 'border-subtle hover:border-muted'
              }`}
            >
              <div className="font-bold text-primary">{diff.name}</div>
              <div className="text-xs text-muted mt-1 line-clamp-2">{diff.description}</div>
            </button>
          ))}
        </div>
      </div>

      {/* Theme Selection */}
      <div>
        <h3 className="text-lg font-display font-bold text-primary mb-2">Themes</h3>
        <p className="text-sm text-muted mb-4">
          What elements should the story explore? Select up to 5.
          <span className="text-primary ml-2">({localPreferences.themes.length}/5 selected)</span>
        </p>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
          {(Object.entries(THEMES) as [Theme, { name: string; description: string }][]).map(([key, theme]) => (
            <button
              key={key}
              onClick={() => toggleTheme(key)}
              disabled={!localPreferences.themes.includes(key) && localPreferences.themes.length >= 5}
              className={`p-3 rounded-lg border text-left transition-all ${
                localPreferences.themes.includes(key)
                  ? 'border-primary bg-primary/10'
                  : localPreferences.themes.length >= 5
                    ? 'border-subtle opacity-50 cursor-not-allowed'
                    : 'border-subtle hover:border-muted'
              }`}
            >
              <div className="font-medium text-sm text-primary">{theme.name}</div>
              <div className="text-xs text-muted mt-0.5 line-clamp-1">{theme.description}</div>
            </button>
          ))}
        </div>
      </div>

      {/* Play Style Focus */}
      <div>
        <h3 className="text-lg font-display font-bold text-primary mb-2">Play Style Focus</h3>
        <p className="text-sm text-muted mb-4">How do you want to experience the game?</p>

        <div className="space-y-4">
          {(['roleplay', 'story', 'combat'] as const).map((focus) => {
            const labels = {
              roleplay: { name: 'Roleplay', desc: 'Character interactions, NPC relationships, dialogue' },
              story: { name: 'Story', desc: 'Narrative development, mystery, dramatic moments' },
              combat: { name: 'Combat', desc: 'Action encounters, tactical decisions, danger' }
            };
            const label = labels[focus];

            return (
              <div key={focus} className="flex items-center gap-4">
                <div className="w-24">
                  <div className="font-medium text-primary">{label.name}</div>
                  <div className="text-xs text-muted">{localPreferences.playStyle[focus]}%</div>
                </div>
                <input
                  type="range"
                  min={10}
                  max={80}
                  value={localPreferences.playStyle[focus]}
                  onChange={(e) => updatePlayStyle(focus, parseInt(e.target.value))}
                  className="flex-1 h-2 bg-surface rounded-lg appearance-none cursor-pointer accent-primary"
                />
                <div className="text-xs text-muted w-40 hidden md:block">{label.desc}</div>
              </div>
            );
          })}
        </div>

        <div className="mt-4 flex gap-2 justify-center">
          <button
            onClick={() => updatePreferences({ playStyle: { roleplay: 50, story: 30, combat: 20 } })}
            className="btn btn-ghost text-xs"
          >
            Roleplay Heavy
          </button>
          <button
            onClick={() => updatePreferences({ playStyle: { roleplay: 33, story: 34, combat: 33 } })}
            className="btn btn-ghost text-xs"
          >
            Balanced
          </button>
          <button
            onClick={() => updatePreferences({ playStyle: { roleplay: 20, story: 30, combat: 50 } })}
            className="btn btn-ghost text-xs"
          >
            Action Focused
          </button>
        </div>
      </div>

      {/* Tone Selection */}
      <div>
        <h3 className="text-lg font-display font-bold text-primary mb-2">Tone</h3>
        <p className="text-sm text-muted mb-4">How dark should the narrative be?</p>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {(Object.entries(TONES) as [Tone, { name: string; description: string }][]).map(([key, tone]) => (
            <button
              key={key}
              onClick={() => updatePreferences({ tone: key })}
              className={`p-4 rounded-lg border-2 text-left transition-all ${
                localPreferences.tone === key
                  ? 'border-primary bg-primary/10'
                  : 'border-subtle hover:border-muted'
              }`}
            >
              <div className="font-bold text-primary">{tone.name}</div>
              <div className="text-xs text-muted mt-1 line-clamp-2">{tone.description}</div>
            </button>
          ))}
        </div>
      </div>

      {/* Summary */}
      <div className="bg-surface/50 rounded-lg p-4 border border-subtle">
        <h4 className="font-bold text-primary mb-2">Your Game Settings</h4>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
          <div>
            <span className="text-muted">Difficulty:</span>
            <span className="ml-2 text-primary">{DIFFICULTIES[localPreferences.difficulty].name}</span>
          </div>
          <div>
            <span className="text-muted">Tone:</span>
            <span className="ml-2 text-primary">{TONES[localPreferences.tone].name}</span>
          </div>
          <div className="col-span-2">
            <span className="text-muted">Themes:</span>
            <span className="ml-2 text-primary">
              {localPreferences.themes.map(t => THEMES[t].name).join(', ')}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
