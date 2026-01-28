'use client';

import { useState, useEffect, use } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  CharacterTemplate,
  BACKGROUNDS,
  PERSONALITY_TRAITS,
  FEARS,
  COPING_MECHANISMS,
  MORAL_CODES,
  SURVIVAL_PHILOSOPHIES
} from '@/lib/types';
import { getCharacter, deleteCharacter } from '@/lib/supabase/characters';

export default function CharacterDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const [character, setCharacter] = useState<CharacterTemplate | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    loadCharacter();
  }, [id]);

  const loadCharacter = async () => {
    try {
      setIsLoading(true);
      const data = await getCharacter(id);
      if (!data) {
        setError('Character not found');
        return;
      }
      setCharacter(data);
    } catch (err) {
      console.error('Failed to load character:', err);
      setError('Failed to load character');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!character) return;
    if (!confirm(`Are you sure you want to delete ${character.name}? This cannot be undone.`)) {
      return;
    }

    try {
      setIsDeleting(true);
      await deleteCharacter(id);
      router.push('/characters');
    } catch (err) {
      console.error('Failed to delete character:', err);
      setError('Failed to delete character');
      setIsDeleting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-muted">Loading character...</div>
      </div>
    );
  }

  if (error || !character) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center">
        <div className="text-danger mb-4">{error || 'Character not found'}</div>
        <Link href="/characters" className="btn">
          Back to Characters
        </Link>
      </div>
    );
  }

  const background = BACKGROUNDS[character.background];

  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="border-b border-subtle">
        <div className="max-w-4xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/characters" className="text-secondary hover:text-primary transition-colors">
            ← Back to Characters
          </Link>
          <div className="flex gap-2">
            <Link
              href={`/new?character=${id}`}
              className="btn btn-primary text-sm"
            >
              Start Game
            </Link>
            <button
              type="button"
              onClick={handleDelete}
              disabled={isDeleting}
              className="btn text-danger hover:bg-danger/10 border-danger/50 text-sm"
            >
              {isDeleting ? 'Deleting...' : 'Delete'}
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-6 py-8">
        {/* Character Header */}
        <div className="flex items-start gap-6 mb-8">
          {/* Portrait */}
          <div className="w-32 h-32 rounded-xl bg-card border border-subtle overflow-hidden flex-shrink-0">
            {character.portraitUrl ? (
              <img
                src={character.portraitUrl}
                alt={character.name}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-5xl text-muted">
                👤
              </div>
            )}
          </div>

          <div className="flex-1">
            <h1 className="text-3xl font-bold">
              {character.name}
              {character.nickname && (
                <span className="text-muted font-normal text-xl ml-3">
                  &quot;{character.nickname}&quot;
                </span>
              )}
            </h1>
            <div className="text-gold text-lg mt-1">{background?.name}</div>
            <p className="text-secondary italic mt-2">&ldquo;{background?.description}&rdquo;</p>

            {/* Stats Summary */}
            <div className="flex gap-6 mt-4 text-sm">
              <div>
                <span className="text-muted">Games Played:</span>{' '}
                <span className="text-primary">{character.timesUsed}</span>
              </div>
              <div>
                <span className="text-muted">Sessions Survived:</span>{' '}
                <span className="text-primary">{character.sessionsSurvived}</span>
              </div>
              {character.scars.length > 0 && (
                <div>
                  <span className="text-muted">Scars:</span>{' '}
                  <span className="text-danger">{character.scars.length}</span>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Attributes */}
          <div className="panel">
            <h2 className="text-lg font-bold mb-4 text-gold">ATTRIBUTES</h2>
            <div className="grid grid-cols-2 gap-4">
              {(['grit', 'reflex', 'wits', 'nerve'] as const).map((attr) => (
                <div key={attr} className="text-center p-3 bg-card rounded-lg border border-subtle">
                  <div className="text-xs uppercase tracking-wider text-muted mb-1">{attr}</div>
                  <div className="text-2xl font-bold">{character.attributes[attr]}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Skills */}
          <div className="panel">
            <h2 className="text-lg font-bold mb-4 text-gold">SKILLS</h2>
            <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-sm">
              {Object.entries(character.skills)
                .filter(([, value]) => value > 0)
                .sort((a, b) => b[1] - a[1])
                .map(([skill, value]) => (
                  <div key={skill} className="flex justify-between">
                    <span className="capitalize">{skill}</span>
                    <span className="text-gold">{value}</span>
                  </div>
                ))}
            </div>
          </div>

          {/* Motivation */}
          <div className="panel">
            <h2 className="text-lg font-bold mb-4 text-gold">MOTIVATION</h2>
            <p className="text-secondary italic">&ldquo;{character.motivation}&rdquo;</p>

            {character.moralCode && (
              <div className="mt-4">
                <div className="text-xs uppercase tracking-wider text-muted mb-1">Moral Code</div>
                <div className="font-medium">{MORAL_CODES[character.moralCode]?.name}</div>
                <div className="text-sm text-secondary">{MORAL_CODES[character.moralCode]?.description}</div>
              </div>
            )}

            {character.survivalPhilosophy && (
              <div className="mt-4">
                <div className="text-xs uppercase tracking-wider text-muted mb-1">Survival Philosophy</div>
                <div className="font-medium">{SURVIVAL_PHILOSOPHIES[character.survivalPhilosophy]?.name}</div>
                <div className="text-sm text-secondary">{SURVIVAL_PHILOSOPHIES[character.survivalPhilosophy]?.description}</div>
              </div>
            )}
          </div>

          {/* Psychology */}
          {character.personality && (
            <div className="panel">
              <h2 className="text-lg font-bold mb-4 text-gold">PSYCHOLOGY</h2>

              <div className="space-y-3">
                <div>
                  <div className="text-xs uppercase tracking-wider text-muted mb-1">Primary Trait</div>
                  <div className="font-medium">{PERSONALITY_TRAITS[character.personality.primaryTrait]?.name}</div>
                </div>

                {character.personality.secondaryTrait && (
                  <div>
                    <div className="text-xs uppercase tracking-wider text-muted mb-1">Secondary Trait</div>
                    <div className="font-medium">{PERSONALITY_TRAITS[character.personality.secondaryTrait]?.name}</div>
                  </div>
                )}

                <div>
                  <div className="text-xs uppercase tracking-wider text-muted mb-1">Greatest Fear</div>
                  <div className="font-medium text-danger">{FEARS[character.personality.greatestFear]?.name}</div>
                </div>

                <div>
                  <div className="text-xs uppercase tracking-wider text-muted mb-1">Coping Mechanism</div>
                  <div className="font-medium">{COPING_MECHANISMS[character.personality.copingMechanism]?.name}</div>
                </div>

                {character.personality.darkSecret && (
                  <div>
                    <div className="text-xs uppercase tracking-wider text-muted mb-1">Dark Secret</div>
                    <div className="text-sm text-secondary italic">&ldquo;{character.personality.darkSecret}&rdquo;</div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Connections */}
          {character.connections && (
            <div className="panel md:col-span-2">
              <h2 className="text-lg font-bold mb-4 text-gold">CONNECTIONS</h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {character.connections.lostLovedOne && (
                  <div>
                    <div className="text-xs uppercase tracking-wider text-muted mb-1">Lost Loved One</div>
                    <div className="font-medium">{character.connections.lostLovedOne.name}</div>
                    <div className="text-sm text-secondary">
                      {character.connections.lostLovedOne.relationship} — {character.connections.lostLovedOne.fate}
                    </div>
                  </div>
                )}

                {character.connections.whoTheyProtect && (
                  <div>
                    <div className="text-xs uppercase tracking-wider text-muted mb-1">Someone to Protect</div>
                    <div className="font-medium">{character.connections.whoTheyProtect}</div>
                  </div>
                )}

                {character.connections.hauntingMemory && (
                  <div className="md:col-span-2">
                    <div className="text-xs uppercase tracking-wider text-muted mb-1">Haunting Memory</div>
                    <div className="text-sm text-secondary italic">&ldquo;{character.connections.hauntingMemory}&rdquo;</div>
                  </div>
                )}

                {character.connections.sentimentalItem && (
                  <div>
                    <div className="text-xs uppercase tracking-wider text-muted mb-1">Sentimental Item</div>
                    <div className="font-medium">{character.connections.sentimentalItem}</div>
                  </div>
                )}

                {character.connections.bonds && character.connections.bonds.length > 0 && (
                  <div className="md:col-span-2">
                    <div className="text-xs uppercase tracking-wider text-muted mb-2">NPC Bonds</div>
                    <div className="flex gap-4">
                      {character.connections.bonds.map((bond, i) => (
                        <div
                          key={i}
                          className={`p-3 rounded-lg border ${
                            bond.type === 'trust'
                              ? 'border-success/50 bg-success/10'
                              : 'border-warning/50 bg-warning/10'
                          }`}
                        >
                          <div className="font-medium">{bond.name}</div>
                          <div className={`text-xs ${bond.type === 'trust' ? 'text-success' : 'text-warning'}`}>
                            {bond.type === 'trust' ? 'Trusted' : 'Wary'}
                          </div>
                          {bond.description && (
                            <div className="text-xs text-secondary mt-1">{bond.description}</div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Scars */}
          {character.scars.length > 0 && (
            <div className="panel md:col-span-2">
              <h2 className="text-lg font-bold mb-4 text-danger">SCARS</h2>
              <div className="space-y-2">
                {character.scars.map((scar, i) => (
                  <div key={i} className="flex items-start gap-3 p-3 bg-card rounded-lg border border-subtle">
                    <span className="text-danger">⚔</span>
                    <div>
                      <div className="font-medium">{scar.description}</div>
                      <div className="text-xs text-muted">
                        From: {scar.source}
                        {scar.earnedDay && ` — Day ${scar.earnedDay}`}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Progression */}
          {(character.skillPointsAvailable > 0 || character.attributePointsAvailable > 0) && (
            <div className="panel md:col-span-2 bg-gold/10 border-gold">
              <h2 className="text-lg font-bold mb-4 text-gold">AVAILABLE UPGRADES</h2>
              <div className="flex gap-6">
                {character.skillPointsAvailable > 0 && (
                  <div>
                    <span className="text-2xl font-bold text-gold">{character.skillPointsAvailable}</span>
                    <span className="text-muted ml-2">Skill Points</span>
                  </div>
                )}
                {character.attributePointsAvailable > 0 && (
                  <div>
                    <span className="text-2xl font-bold text-gold">{character.attributePointsAvailable}</span>
                    <span className="text-muted ml-2">Attribute Points</span>
                  </div>
                )}
              </div>
              <p className="text-sm text-secondary mt-2">
                Start a new game to spend these points through gameplay.
              </p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
