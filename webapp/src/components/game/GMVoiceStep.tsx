'use client';

import { getVoiceById, VOICE_OPTIONS } from '@/lib/types/voice';
import VoiceSelector from './VoiceSelector';

interface GMVoiceStepProps {
  selectedVoiceId: string | null;
  onVoiceSelect: (voiceId: string) => void;
  difficulty?: string;
  tone?: string;
}

// Sample GM narration based on tone
const getToneNarration = (tone?: string): string => {
  switch (tone) {
    case 'hopeful':
      return 'The sun breaks through the clouds. Despite everything, there is still beauty in this broken world. You press forward, knowing that hope remains.';
    case 'grim':
      return 'Shadows lengthen across the abandoned street. The wind carries whispers of those who came before. Every step forward is a step into darkness.';
    case 'nihilistic':
      return 'Nothing matters anymore. The world has ended, and what remains is merely an echo of what once was. You walk through the ruins, a ghost among ghosts.';
    default: // balanced
      return 'The world has changed, but you endure. Somewhere ahead lies uncertainty, danger, and perhaps a chance at something more. The choice is yours.';
  }
};

// Recommended voices for GM narration by style
const GM_RECOMMENDATIONS = [
  { id: 'adam', reason: 'Deep & authoritative - classic narrator' },
  { id: 'daniel', reason: 'British elegance - refined storytelling' },
  { id: 'marcus', reason: 'Thoughtful & mysterious - eerie tales' },
  { id: 'rachel', reason: 'Calm & composed - measured dread' },
];

export default function GMVoiceStep({
  selectedVoiceId,
  onVoiceSelect,
  tone
}: GMVoiceStepProps) {
  const selectedVoice = selectedVoiceId ? getVoiceById(selectedVoiceId) : null;
  const previewText = getToneNarration(tone);

  return (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-primary mb-2">GAME MASTER VOICE</h2>
        <p className="text-secondary">
          Choose the voice that will narrate your story.
        </p>
      </div>

      {/* Explanation */}
      <div className="bg-surface/50 rounded-lg p-4 border border-subtle">
        <div className="flex items-start gap-3">
          <span className="text-2xl">🎙️</span>
          <div>
            <div className="font-medium text-primary mb-1">The Game Master Voice</div>
            <ul className="text-sm text-secondary space-y-1">
              <li>• Narrates the story and describes scenes</li>
              <li>• Sets the atmosphere and tension</li>
              <li>• Different from character dialog voices</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Quick recommendations */}
      <div>
        <div className="text-sm font-medium text-primary mb-3">Recommended for Narration</div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {GM_RECOMMENDATIONS.map(rec => {
            const voice = VOICE_OPTIONS.find(v => v.id === rec.id);
            if (!voice) return null;
            const isSelected = selectedVoiceId === rec.id;
            return (
              <button
                key={rec.id}
                onClick={() => onVoiceSelect(rec.id)}
                className={`p-3 rounded-lg border-2 text-left transition-all ${
                  isSelected
                    ? 'border-primary bg-primary/10 ring-1 ring-primary/30'
                    : 'border-subtle hover:border-muted bg-card'
                }`}
              >
                <div className="font-medium text-primary text-sm">{voice.name}</div>
                <div className="text-xs text-muted mt-1">{rec.reason}</div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Full Voice Selector */}
      <VoiceSelector
        selectedVoiceId={selectedVoiceId}
        onVoiceSelect={onVoiceSelect}
        showPreview={true}
        previewText={previewText}
        label="All Available Voices"
      />

      {/* Selected voice summary with tone-specific preview */}
      {selectedVoice && (
        <div className="bg-surface/50 rounded-lg p-4 border border-primary/30">
          <div className="text-sm text-muted mb-2">Preview narration with {selectedVoice.name}:</div>
          <p className="text-secondary italic text-sm">&quot;{previewText}&quot;</p>
        </div>
      )}
    </div>
  );
}
