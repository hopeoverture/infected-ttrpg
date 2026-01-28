'use client';

import { useState, useEffect, useCallback } from 'react';
import { Character, GamePreferences } from '@/lib/types';
import { ScenarioOption, FullGeneratedScenario } from '@/lib/types/generated-scenario';

interface ScenarioSelectionStepProps {
  character: Character;
  preferences: GamePreferences;
  onScenarioSelected: (scenario: FullGeneratedScenario, generationId: string) => void;
}

type GenerationState = 'idle' | 'generating' | 'selecting' | 'finalizing' | 'error';

export default function ScenarioSelectionStep({
  character,
  preferences,
  onScenarioSelected
}: ScenarioSelectionStepProps) {
  const [state, setState] = useState<GenerationState>('idle');
  const [options, setOptions] = useState<ScenarioOption[]>([]);
  const [generationId, setGenerationId] = useState<string | null>(null);
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);

  const generateOptions = useCallback(async () => {
    setState('generating');
    setError(null);
    setOptions([]);
    setSelectedIndex(null);

    try {
      const response = await fetch('/api/scenarios/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ character, preferences })
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to generate scenarios');
      }

      const data = await response.json();
      setOptions(data.options);
      setGenerationId(data.generationId);
      setState('selecting');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to generate scenarios');
      setState('error');
    }
  }, [character, preferences]);

  // Auto-generate on mount
  useEffect(() => {
    if (state === 'idle') {
      generateOptions();
    }
  }, [state, generateOptions]);

  const selectScenario = async (index: number) => {
    if (!generationId) return;

    setSelectedIndex(index);
    setState('finalizing');
    setError(null);

    try {
      const response = await fetch('/api/scenarios/finalize', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          generationId,
          selectedIndex: index,
          character,
          preferences,
          selectedOption: options[index]
        })
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to finalize scenario');
      }

      const data = await response.json();
      onScenarioSelected(data.scenario, generationId);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to finalize scenario');
      setState('selecting');
      setSelectedIndex(null);
    }
  };

  if (state === 'generating') {
    return (
      <div className="flex flex-col items-center justify-center py-16 space-y-6">
        <div className="w-16 h-16 border-4 border-primary/30 border-t-primary rounded-full animate-spin" />
        <div className="text-center">
          <h3 className="text-xl font-display font-bold text-primary mb-2">
            Crafting Your Story
          </h3>
          <p className="text-muted max-w-md">
            The AI is generating three unique scenarios tailored to {character.name}&apos;s
            background and your preferences...
          </p>
        </div>
        <div className="flex gap-2">
          {[0, 1, 2].map(i => (
            <div
              key={i}
              className="w-3 h-3 bg-primary rounded-full animate-pulse"
              style={{ animationDelay: `${i * 0.2}s` }}
            />
          ))}
        </div>
      </div>
    );
  }

  if (state === 'error') {
    return (
      <div className="flex flex-col items-center justify-center py-16 space-y-4">
        <div className="text-4xl">⚠️</div>
        <h3 className="text-xl font-display font-bold text-danger">Generation Failed</h3>
        <p className="text-muted max-w-md text-center">{error}</p>
        <button onClick={() => setState('idle')} className="btn btn-primary">
          Try Again
        </button>
      </div>
    );
  }

  if (state === 'finalizing') {
    return (
      <div className="flex flex-col items-center justify-center py-16 space-y-6">
        <div className="w-16 h-16 border-4 border-primary/30 border-t-primary rounded-full animate-spin" />
        <div className="text-center">
          <h3 className="text-xl font-display font-bold text-primary mb-2">
            Building Your World
          </h3>
          <p className="text-muted max-w-md">
            Creating the full scenario, generating NPCs, and preparing the opening scene...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <div className="text-center mb-8">
        <h3 className="text-2xl font-display font-bold text-primary mb-2">
          Choose Your Scenario
        </h3>
        <p className="text-muted">
          Three unique stories have been crafted for {character.name}. Click to expand and see more details.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {options.map((option, index) => (
          <div
            key={option.id}
            className={`bg-card rounded-lg border-2 transition-all cursor-pointer overflow-hidden ${
              expandedIndex === index
                ? 'border-primary ring-2 ring-primary/20 lg:col-span-3'
                : selectedIndex === index
                  ? 'border-primary'
                  : 'border-subtle hover:border-muted'
            }`}
          >
            {/* Header - always visible */}
            <div
              onClick={() => setExpandedIndex(expandedIndex === index ? null : index)}
              className="p-4"
            >
              <div className="flex items-start justify-between gap-2">
                <div>
                  <h4 className="text-lg font-display font-bold text-primary">{option.title}</h4>
                  <p className="text-sm text-muted italic">{option.tagline}</p>
                </div>
                <div className="text-muted text-2xl">
                  {expandedIndex === index ? '▼' : '▶'}
                </div>
              </div>

              {/* Themes */}
              <div className="flex flex-wrap gap-1 mt-3">
                {option.themes.slice(0, 4).map((theme, i) => (
                  <span key={i} className="px-2 py-0.5 bg-primary/10 text-primary text-xs rounded">
                    {theme}
                  </span>
                ))}
              </div>

              {/* Initial NPCs preview */}
              {option.initialNPCs.length > 0 && (
                <div className="mt-3 text-xs text-muted">
                  <span className="font-medium">Key NPCs:</span>{' '}
                  {option.initialNPCs.map(npc => npc.name).join(', ')}
                </div>
              )}
            </div>

            {/* Expanded content */}
            {expandedIndex === index && (
              <div className="border-t border-subtle p-4 space-y-4 bg-surface/50">
                <div className="lg:grid lg:grid-cols-2 lg:gap-6">
                  {/* Description */}
                  <div>
                    <h5 className="font-bold text-primary mb-2">The Setup</h5>
                    <p className="text-sm text-muted whitespace-pre-wrap">
                      {option.description}
                    </p>
                  </div>

                  {/* Starting location */}
                  <div>
                    <h5 className="font-bold text-primary mb-2">Starting Location</h5>
                    <div className="bg-card p-3 rounded border border-subtle">
                      <div className="font-medium text-primary">{option.startingLocation.name}</div>
                      <p className="text-xs text-muted mt-1">{option.startingLocation.description}</p>
                      {option.startingLocation.dangers.length > 0 && (
                        <div className="mt-2">
                          <span className="text-xs text-danger font-medium">Dangers: </span>
                          <span className="text-xs text-muted">
                            {option.startingLocation.dangers.join(', ')}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* NPCs */}
                {option.initialNPCs.length > 0 && (
                  <div>
                    <h5 className="font-bold text-primary mb-2">Key Characters</h5>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
                      {option.initialNPCs.map((npc, i) => (
                        <div key={i} className="bg-card p-3 rounded border border-subtle">
                          <div className="font-medium text-primary">{npc.name}</div>
                          <div className="text-xs text-muted">{npc.role}</div>
                          <p className="text-xs text-muted mt-1 italic">{npc.firstImpression}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Hooks (ties to character) */}
                {option.hooks.length > 0 && (
                  <div>
                    <h5 className="font-bold text-primary mb-2">Personal Connections</h5>
                    <ul className="list-disc list-inside text-sm text-muted space-y-1">
                      {option.hooks.map((hook, i) => (
                        <li key={i}>{hook}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Select button */}
                <div className="pt-4 border-t border-subtle flex justify-center">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      selectScenario(index);
                    }}
                    className="btn btn-primary btn-lg"
                  >
                    Choose This Scenario
                  </button>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Regenerate button */}
      <div className="text-center pt-4">
        <button
          onClick={() => {
            setState('idle');
          }}
          className="btn btn-ghost text-muted"
        >
          Not what you&apos;re looking for? Generate new options
        </button>
      </div>
    </div>
  );
}
