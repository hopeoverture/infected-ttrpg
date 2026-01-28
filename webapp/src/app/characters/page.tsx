'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { CharacterSummary, BACKGROUNDS } from '@/lib/types';
import { getCharacters, deleteCharacter } from '@/lib/supabase/characters';

export default function CharactersPage() {
  const [characters, setCharacters] = useState<CharacterSummary[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  useEffect(() => {
    loadCharacters();
  }, []);

  const loadCharacters = async () => {
    try {
      setIsLoading(true);
      const data = await getCharacters();
      setCharacters(data);
    } catch (err) {
      console.error('Failed to load characters:', err);
      setError('Failed to load characters');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Are you sure you want to delete ${name}? This cannot be undone.`)) {
      return;
    }

    try {
      setDeletingId(id);
      await deleteCharacter(id);
      setCharacters(prev => prev.filter(c => c.id !== id));
    } catch (err) {
      console.error('Failed to delete character:', err);
      setError('Failed to delete character');
    } finally {
      setDeletingId(null);
    }
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    }).format(date);
  };

  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="border-b border-subtle">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/" className="text-secondary hover:text-primary transition-colors">
            ← Back
          </Link>
          <h1 className="text-xl font-bold tracking-wider">MY CHARACTERS</h1>
          <Link
            href="/new"
            className="btn btn-primary text-sm"
          >
            + New Character
          </Link>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-6 py-8">
        {isLoading ? (
          <div className="text-center py-12">
            <div className="text-muted">Loading characters...</div>
          </div>
        ) : error ? (
          <div className="text-center py-12">
            <div className="text-danger mb-4">{error}</div>
            <button
              type="button"
              onClick={loadCharacters}
              className="btn"
            >
              Try Again
            </button>
          </div>
        ) : characters.length === 0 ? (
          <div className="text-center py-16">
            <div className="text-6xl mb-4">🧟</div>
            <h2 className="text-2xl font-bold mb-2">No Characters Yet</h2>
            <p className="text-secondary mb-6">
              Create your first survivor to face the apocalypse.
            </p>
            <Link href="/new" className="btn btn-primary">
              Create Character
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {characters.map((character) => (
              <div
                key={character.id}
                className="panel hover:border-medium transition-all group"
              >
                {/* Portrait */}
                <div className="flex items-start gap-4 mb-4">
                  <div className="w-20 h-20 rounded-lg bg-card border border-subtle overflow-hidden flex-shrink-0">
                    {character.portraitUrl ? (
                      <img
                        src={character.portraitUrl}
                        alt={character.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-3xl text-muted">
                        👤
                      </div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-bold text-lg truncate">
                      {character.name}
                      {character.nickname && (
                        <span className="text-muted font-normal text-sm ml-2">
                          &quot;{character.nickname}&quot;
                        </span>
                      )}
                    </h3>
                    <div className="text-gold text-sm">
                      {BACKGROUNDS[character.background]?.name || character.background}
                    </div>
                    <div className="text-xs text-muted mt-1">
                      Created {formatDate(character.createdAt)}
                    </div>
                  </div>
                </div>

                {/* Stats */}
                <div className="flex items-center gap-4 text-xs text-muted mb-4">
                  <div>
                    <span className="text-secondary">{character.timesUsed}</span> games played
                  </div>
                  <div>
                    <span className="text-secondary">{character.sessionsSurvived}</span> sessions survived
                  </div>
                </div>

                {/* Actions */}
                <div className="flex gap-2">
                  <Link
                    href={`/characters/${character.id}`}
                    className="btn flex-1 text-sm"
                  >
                    View
                  </Link>
                  <Link
                    href={`/new?character=${character.id}`}
                    className="btn btn-primary flex-1 text-sm"
                  >
                    Start Game
                  </Link>
                  <button
                    type="button"
                    onClick={() => handleDelete(character.id, character.name)}
                    disabled={deletingId === character.id}
                    className="btn text-danger hover:bg-danger/10 border-danger/50 text-sm px-3"
                    title="Delete character"
                  >
                    {deletingId === character.id ? '...' : '×'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
