'use client';

import { useState, useCallback } from 'react';
import Image from 'next/image';
import { CharacterAppearance, ArtStyle, DEFAULT_APPEARANCE } from '@/lib/types';

interface CharacterPortraitProps {
  portraitUrl?: string | null;
  characterName: string;
  characterBackground: string;
  appearance?: CharacterAppearance;
  artStyle?: ArtStyle;
  size?: 'small' | 'medium' | 'large';
  editable?: boolean;
  onPortraitChange?: (url: string) => void;
}

const SIZE_CLASSES = {
  small: 'w-16 h-16',
  medium: 'w-24 h-24',
  large: 'w-40 h-40'
};

const SIZE_PIXELS = {
  small: 64,
  medium: 96,
  large: 160
};

// Build a detailed appearance prompt from the appearance options
function buildAppearancePrompt(appearance: CharacterAppearance): string {
  const parts: string[] = [];

  // Age and gender
  const ageMap: Record<string, string> = {
    'young': 'young adult in their early 20s',
    'adult': 'adult in their 30s',
    'middle-aged': 'middle-aged person in their 40s-50s',
    'older': 'older person in their 60s+'
  };
  parts.push(ageMap[appearance.age] || 'adult');

  // Gender presentation
  const genderMap: Record<string, string> = {
    'male': 'man',
    'female': 'woman',
    'androgynous': 'androgynous person'
  };
  parts.push(genderMap[appearance.gender] || 'person');

  // Build
  const buildMap: Record<string, string> = {
    'slight': 'slim and wiry build',
    'average': 'average build',
    'athletic': 'athletic muscular build',
    'heavy': 'large heavy build'
  };
  parts.push(buildMap[appearance.bodyType] || 'average build');

  // Skin tone
  parts.push(`${appearance.skinTone} skin tone`);

  // Hair
  if (appearance.hairStyle.toLowerCase() === 'bald') {
    parts.push('bald head');
  } else {
    parts.push(`${appearance.hairColor} ${appearance.hairStyle.toLowerCase()} hair`);
  }

  // Facial hair (if applicable)
  if (appearance.facialHair && appearance.facialHair !== 'None') {
    parts.push(`${appearance.facialHair.toLowerCase()}`);
  }

  // Distinguishing features
  if (appearance.distinguishingFeatures.length > 0) {
    parts.push(appearance.distinguishingFeatures.join(', ').toLowerCase());
  }

  return parts.join(', ');
}

export default function CharacterPortrait({
  portraitUrl,
  characterName,
  characterBackground,
  appearance = DEFAULT_APPEARANCE,
  artStyle = 'cinematic',
  size = 'medium',
  editable = false,
  onPortraitChange
}: CharacterPortraitProps) {
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [localPortraitUrl, setLocalPortraitUrl] = useState<string | null>(portraitUrl || null);

  const generatePortrait = useCallback(async () => {
    if (isGenerating) return;
    
    setIsGenerating(true);
    setError(null);

    try {
      // Build detailed appearance description
      const appearanceDescription = buildAppearancePrompt(appearance);
      
      const response = await fetch('/api/image', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'portrait',
          characterName,
          characterBackground,
          appearance: appearanceDescription,
          artStyle,
          prompt: 'determined expression, survivor of the apocalypse, intense gaze'
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || data.details || 'Failed to generate portrait');
      }

      setLocalPortraitUrl(data.imageUrl);
      onPortraitChange?.(data.imageUrl);
    } catch (err) {
      console.error('Portrait generation error:', err);
      setError(err instanceof Error ? err.message : 'Failed to generate portrait');
    } finally {
      setIsGenerating(false);
    }
  }, [characterName, characterBackground, appearance, artStyle, isGenerating, onPortraitChange]);

  // Sync with external portraitUrl prop
  const displayUrl = localPortraitUrl || portraitUrl;
  const sizeClass = SIZE_CLASSES[size];
  const sizePixels = SIZE_PIXELS[size];

  return (
    <div className="flex flex-col items-center gap-2">
      <div 
        className={`${sizeClass} relative rounded-full overflow-hidden border-2 border-subtle bg-card flex items-center justify-center`}
      >
        {isGenerating ? (
          <div className="flex flex-col items-center justify-center text-muted">
            <div className="animate-spin text-xl mb-1">⟳</div>
            <span className="text-xs">Generating...</span>
          </div>
        ) : displayUrl ? (
          <Image
            src={displayUrl}
            alt={`Portrait of ${characterName}`}
            width={sizePixels}
            height={sizePixels}
            className="object-cover w-full h-full"
            unoptimized // External URLs from DALL-E
          />
        ) : (
          <span className="text-2xl">👤</span>
        )}

        {/* Overlay for hover state on editable portraits */}
        {editable && !isGenerating && (
          <button
            onClick={generatePortrait}
            className="absolute inset-0 bg-black/60 opacity-0 hover:opacity-100 transition-opacity flex items-center justify-center text-white text-xs"
          >
            {displayUrl ? '🔄 Regenerate' : '✨ Generate'}
          </button>
        )}
      </div>

      {/* Generate button for when there's no portrait yet */}
      {editable && !displayUrl && !isGenerating && (
        <button
          onClick={generatePortrait}
          className="text-xs text-gold hover:text-gold/80 transition-colors"
        >
          Generate Portrait
        </button>
      )}

      {/* Error display */}
      {error && (
        <div className="text-xs text-danger max-w-32 text-center">
          {error}
        </div>
      )}
    </div>
  );
}
