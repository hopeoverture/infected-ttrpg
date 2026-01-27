'use client';

import { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';
import { ArtStyle } from '@/lib/types';

interface SceneImageProps {
  sceneDescription: string | null;
  locationName: string;
  timeOfDay: string;
  mood?: string;
  artStyle?: ArtStyle;
  onImageGenerated?: (url: string) => void;
  cachedImageUrl?: string | null;
  autoGenerate?: boolean;
}

export default function SceneImage({
  sceneDescription,
  locationName,
  timeOfDay,
  mood = 'tense',
  artStyle = 'cinematic',
  onImageGenerated,
  cachedImageUrl,
  autoGenerate = true
}: SceneImageProps) {
  const [imageUrl, setImageUrl] = useState<string | null>(cachedImageUrl || null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [previousUrl, setPreviousUrl] = useState<string | null>(null);

  const generateImage = useCallback(async () => {
    if (!sceneDescription || isLoading) return;

    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/image', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'scene',
          locationName,
          sceneDescription,
          timeOfDay,
          mood,
          artStyle
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || data.details || 'Failed to generate scene');
      }

      // Smooth transition to new image
      if (imageUrl) {
        setPreviousUrl(imageUrl);
        setIsTransitioning(true);
      }

      setImageUrl(data.imageUrl);
      onImageGenerated?.(data.imageUrl);

      // End transition after animation
      setTimeout(() => {
        setIsTransitioning(false);
        setPreviousUrl(null);
      }, 500);
    } catch (err) {
      console.error('Scene generation error:', err);
      setError(err instanceof Error ? err.message : 'Failed to generate scene');
    } finally {
      setIsLoading(false);
    }
  }, [sceneDescription, locationName, timeOfDay, mood, artStyle, isLoading, imageUrl, onImageGenerated]);

  // Auto-generate when scene description changes
  useEffect(() => {
    if (autoGenerate && sceneDescription && !cachedImageUrl) {
      generateImage();
    }
  }, [sceneDescription, autoGenerate, cachedImageUrl, generateImage]);

  // Use cached URL if provided
  useEffect(() => {
    if (cachedImageUrl) {
      if (imageUrl && imageUrl !== cachedImageUrl) {
        setPreviousUrl(imageUrl);
        setIsTransitioning(true);
        setTimeout(() => {
          setIsTransitioning(false);
          setPreviousUrl(null);
        }, 500);
      }
      setImageUrl(cachedImageUrl);
    }
  }, [cachedImageUrl, imageUrl]);

  const displayUrl = imageUrl || cachedImageUrl;

  return (
    <div className="relative w-full aspect-video bg-card rounded-lg overflow-hidden border border-subtle">
      {/* Loading state */}
      {isLoading && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-surface/90 z-20">
          <div className="animate-pulse text-4xl mb-2">🎨</div>
          <div className="text-sm text-muted">Generating scene...</div>
          <div className="text-xs text-muted mt-1">{locationName}</div>
        </div>
      )}

      {/* Previous image (for transition) */}
      {isTransitioning && previousUrl && (
        <div className="absolute inset-0 z-10 animate-fade-out">
          <Image
            src={previousUrl}
            alt="Previous scene"
            fill
            className="object-cover"
            unoptimized
          />
        </div>
      )}

      {/* Current image */}
      {displayUrl ? (
        <div className={`relative w-full h-full ${isTransitioning ? 'animate-fade-in' : ''}`}>
          <Image
            src={displayUrl}
            alt={`Scene: ${locationName}`}
            fill
            className="object-cover"
            unoptimized
            priority
          />
          
          {/* Location overlay */}
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm font-semibold text-white">📍 {locationName}</div>
                <div className="text-xs text-white/70 capitalize">{timeOfDay}</div>
              </div>
              {!isLoading && (
                <button
                  onClick={generateImage}
                  className="text-xs text-white/60 hover:text-white transition-colors"
                  title="Regenerate scene image"
                >
                  🔄
                </button>
              )}
            </div>
          </div>
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center h-full text-muted">
          {error ? (
            <>
              <div className="text-2xl mb-2">⚠️</div>
              <div className="text-sm text-center px-4">{error}</div>
              <button
                onClick={generateImage}
                className="mt-2 text-xs text-gold hover:text-gold/80"
              >
                Try Again
              </button>
            </>
          ) : (
            <>
              <div className="text-2xl mb-2">🏚️</div>
              <div className="text-sm">📍 {locationName}</div>
              {sceneDescription && !autoGenerate && (
                <button
                  onClick={generateImage}
                  className="mt-2 text-xs text-gold hover:text-gold/80"
                >
                  Generate Scene Image
                </button>
              )}
            </>
          )}
        </div>
      )}
    </div>
  );
}
