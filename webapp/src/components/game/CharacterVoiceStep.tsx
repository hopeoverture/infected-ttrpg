'use client';

import { VoiceGender, getVoiceById } from '@/lib/types/voice';
import VoiceSelector from './VoiceSelector';

interface CharacterVoiceStepProps {
  characterName: string;
  characterGender?: 'male' | 'female' | 'androgynous';
  selectedVoiceId: string | null;
  onVoiceSelect: (voiceId: string) => void;
}

export default function CharacterVoiceStep({
  characterName,
  characterGender,
  selectedVoiceId,
  onVoiceSelect
}: CharacterVoiceStepProps) {
  // Map character gender to voice gender filter
  const getVoiceGenderFilter = (): VoiceGender | null => {
    if (characterGender === 'male') return 'male';
    if (characterGender === 'female') return 'female';
    return null; // Show all voices for androgynous characters
  };

  const voiceGenderFilter = getVoiceGenderFilter();
  const selectedVoice = selectedVoiceId ? getVoiceById(selectedVoiceId) : null;

  // Sample dialog for the preview - uses character name
  const previewText = selectedVoice
    ? `I am ${characterName}. When the world ended, I knew I had to survive. No matter what it takes.`
    : `Hello, I am ${characterName}. This is how I will sound in the story.`;

  return (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-primary mb-2">CHARACTER VOICE</h2>
        <p className="text-secondary">
          Choose how {characterName} sounds when speaking in the story.
          {voiceGenderFilter && (
            <span className="text-muted block text-sm mt-1">
              Showing {voiceGenderFilter} voices based on your character&apos;s appearance.
            </span>
          )}
        </p>
      </div>

      {/* Explanation of when voice is used */}
      <div className="bg-surface/50 rounded-lg p-4 border border-subtle">
        <div className="flex items-start gap-3">
          <span className="text-2xl">🎭</span>
          <div>
            <div className="font-medium text-primary mb-1">When will this voice be used?</div>
            <ul className="text-sm text-secondary space-y-1">
              <li>• When you speak in quotes: <span className="text-muted italic">&quot;Hello there!&quot;</span></li>
              <li>• For your character&apos;s internal thoughts and dialog</li>
              <li>• Distinct from the Game Master&apos;s narrator voice</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Voice Selector */}
      <VoiceSelector
        selectedVoiceId={selectedVoiceId}
        onVoiceSelect={onVoiceSelect}
        filterGender={voiceGenderFilter}
        showPreview={true}
        previewText={previewText}
        label="Select Your Voice"
      />

      {/* Skip option */}
      {!selectedVoiceId && (
        <div className="text-center text-sm text-muted">
          <p>Voice selection is optional. The default voice will be used if none is selected.</p>
        </div>
      )}
    </div>
  );
}
