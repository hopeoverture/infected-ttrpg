'use client';

import { useState, useEffect, use } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { GameState, BACKGROUNDS } from '@/lib/types';
import { getGame, deleteGame } from '@/lib/supabase/games';

interface GameStats {
  daysSurvived: number;
  rollCount: number;
  killCount: number;
  messagesCount: number;
  woundsReceived: number;
  gutsSpent: number;
}

export default function GameSummary({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const router = useRouter();
  const [gameState, setGameState] = useState<GameState | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    async function loadGame() {
      try {
        const game = await getGame(resolvedParams.id);
        if (!game) {
          setError('Game not found');
          return;
        }
        setGameState(game);
      } catch (err) {
        console.error('Failed to load game:', err);
        setError(err instanceof Error ? err.message : 'Failed to load game');
      } finally {
        setLoading(false);
      }
    }
    loadGame();
  }, [resolvedParams.id]);

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this game? This cannot be undone.')) {
      return;
    }
    
    setIsDeleting(true);
    try {
      await deleteGame(resolvedParams.id);
      router.push('/');
    } catch (err) {
      console.error('Failed to delete game:', err);
      setIsDeleting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="text-4xl mb-4 animate-pulse">📜</div>
          <div className="text-muted">Loading story...</div>
        </div>
      </div>
    );
  }

  if (error || !gameState) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center max-w-md">
          <div className="text-4xl mb-4">⚠️</div>
          <h2 className="text-xl font-semibold mb-2">Story Not Found</h2>
          <p className="text-muted mb-6">{error || 'Game not found'}</p>
          <Link href="/" className="btn btn-primary">
            Return to Dashboard
          </Link>
        </div>
      </div>
    );
  }

  const { character } = gameState;
  const background = BACKGROUNDS[character.background];
  const isGameOver = character.wounds.critical;

  // Calculate stats
  const stats: GameStats = {
    daysSurvived: gameState.day,
    rollCount: gameState.rollCount,
    killCount: gameState.killCount,
    messagesCount: gameState.messages.filter(m => m.role === 'player').length,
    woundsReceived: character.wounds.bruised + character.wounds.bleeding + character.wounds.broken + (character.wounds.critical ? 1 : 0),
    gutsSpent: 5 - character.guts + character.gutsEarnedThisSession
  };

  // Get the last few GM messages for story recap
  const storyHighlights = gameState.messages
    .filter(m => m.role === 'gm')
    .slice(-5)
    .map(m => m.content);

  // Get death message if game over
  const deathMessage = isGameOver 
    ? gameState.messages.filter(m => m.role === 'gm').slice(-1)[0]?.content 
    : null;

  return (
    <div className="min-h-screen bg-gradient-to-b from-surface to-bg-surface">
      {/* Header */}
      <header className="border-b border-subtle">
        <div className="max-w-4xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/" className="text-secondary hover:text-primary transition-colors">
            ← Dashboard
          </Link>
          <h1 className="text-xl font-bold tracking-wider">STORY SUMMARY</h1>
          <div className="w-16" />
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-6 py-8">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <div className="text-6xl mb-4">
            {isGameOver ? '💀' : '📖'}
          </div>
          <h2 className="text-3xl font-bold mb-2">
            {isGameOver ? 'THE END' : 'Story So Far'}
          </h2>
          <p className="text-xl text-secondary">
            {gameState.title}
          </p>
        </div>

        {/* Character Card */}
        <div className="panel mb-8">
          <div className="flex items-center gap-6">
            {/* Portrait */}
            <div className="flex-shrink-0">
              {character.portraitUrl ? (
                <Image 
                  src={character.portraitUrl} 
                  alt={character.name}
                  width={96}
                  height={96}
                  className="w-24 h-24 rounded-lg object-cover border-2 border-subtle"
                  unoptimized
                />
              ) : (
                <div className="w-24 h-24 rounded-lg bg-card border-2 border-subtle flex items-center justify-center text-4xl">
                  {isGameOver ? '☠️' : '👤'}
                </div>
              )}
            </div>

            {/* Info */}
            <div className="flex-1">
              <h3 className="text-2xl font-bold mb-1">
                {character.name}
                {isGameOver && <span className="text-danger ml-2">☠️</span>}
              </h3>
              <p className="text-secondary mb-2">
                {background.name} · {isGameOver ? `Died Day ${gameState.day}` : `Day ${gameState.day}`}
              </p>
              <p className="text-muted italic">
                &ldquo;{character.motivation}&rdquo;
              </p>
            </div>
          </div>
        </div>

        {/* Death Message */}
        {isGameOver && deathMessage && (
          <div className="panel mb-8 border-danger/30 bg-danger/5">
            <h3 className="panel-label text-danger mb-3">Final Moments</h3>
            <p className="text-secondary whitespace-pre-wrap leading-relaxed">
              {deathMessage}
            </p>
          </div>
        )}

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-8">
          <div className="panel text-center">
            <div className="text-3xl font-bold text-gold">{stats.daysSurvived}</div>
            <div className="text-sm text-muted">Days Survived</div>
          </div>
          <div className="panel text-center">
            <div className="text-3xl font-bold text-danger">{stats.killCount}</div>
            <div className="text-sm text-muted">Infected Killed</div>
          </div>
          <div className="panel text-center">
            <div className="text-3xl font-bold text-info">{stats.rollCount}</div>
            <div className="text-sm text-muted">Dice Rolled</div>
          </div>
          <div className="panel text-center">
            <div className="text-3xl font-bold text-warning">{stats.messagesCount}</div>
            <div className="text-sm text-muted">Actions Taken</div>
          </div>
          <div className="panel text-center">
            <div className="text-3xl font-bold text-danger">{stats.woundsReceived}</div>
            <div className="text-sm text-muted">Wounds Received</div>
          </div>
          <div className="panel text-center">
            <div className="text-3xl font-bold text-success">{stats.gutsSpent}</div>
            <div className="text-sm text-muted">Guts Spent</div>
          </div>
        </div>

        {/* Story Highlights */}
        {storyHighlights.length > 0 && (
          <div className="panel mb-8">
            <h3 className="panel-label mb-4">Recent Story</h3>
            <div className="space-y-4">
              {storyHighlights.map((content, i) => (
                <div key={i} className="border-l-2 border-subtle pl-4">
                  <p className="text-secondary text-sm whitespace-pre-wrap line-clamp-4">
                    {content}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Final State */}
        <div className="panel mb-8">
          <h3 className="panel-label mb-4">Final Status</h3>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-muted">Location:</span>
              <span className="ml-2">{gameState.location.name}</span>
            </div>
            <div>
              <span className="text-muted">Threat:</span>
              <span className={`ml-2 ${gameState.threat >= 7 ? 'text-danger' : gameState.threat >= 4 ? 'text-warning' : 'text-success'}`}>
                {gameState.threat}/10
              </span>
            </div>
            <div>
              <span className="text-muted">Stress:</span>
              <span className="ml-2">{character.stress}/{character.maxStress}</span>
            </div>
            <div>
              <span className="text-muted">Guts:</span>
              <span className="ml-2">{character.guts}/5</span>
            </div>
          </div>
        </div>

        {/* Inventory */}
        {character.inventory.length > 0 && (
          <div className="panel mb-8">
            <h3 className="panel-label mb-4">Final Inventory</h3>
            <div className="flex flex-wrap gap-2">
              {character.inventory.map((item) => (
                <span key={item.id} className="px-3 py-1 bg-card rounded-full text-sm">
                  {item.name} {item.quantity > 1 && `(${item.quantity})`}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          {!isGameOver && (
            <Link 
              href={`/game/${resolvedParams.id}`}
              className="btn btn-primary text-center"
            >
              📖 Continue Story
            </Link>
          )}
          <Link 
            href="/new"
            className="btn btn-primary text-center"
          >
            🆕 New Game
          </Link>
          <Link 
            href="/"
            className="btn text-center"
          >
            🏠 Dashboard
          </Link>
          <button
            onClick={handleDelete}
            disabled={isDeleting}
            className="btn text-danger hover:bg-danger/10 disabled:opacity-50"
          >
            {isDeleting ? '🗑️ Deleting...' : '🗑️ Delete Game'}
          </button>
        </div>
      </main>
    </div>
  );
}
