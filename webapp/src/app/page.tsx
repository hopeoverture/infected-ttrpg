'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { GameSummary, BACKGROUNDS } from '@/lib/types';
import { createClient } from '@/lib/supabase/client';
import { getGames } from '@/lib/supabase/games';

// Mock data for when Supabase isn't configured
const mockGames: GameSummary[] = [
  {
    id: 'demo-1',
    title: 'The Long Road',
    characterName: 'Marcus Chen',
    background: 'soldier',
    day: 14,
    threat: 7,
    updatedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
    isGameOver: false
  },
  {
    id: 'demo-2',
    title: 'Hospital Run',
    characterName: 'Sarah Webb',
    background: 'medic',
    day: 3,
    threat: 3,
    updatedAt: new Date(),
    isGameOver: false
  }
];

function ThreatBar({ threat }: { threat: number }) {
  const percentage = (threat / 10) * 100;
  let colorClass = 'threat-low';
  if (threat >= 7) colorClass = 'threat-critical';
  else if (threat >= 5) colorClass = 'threat-high';
  else if (threat >= 3) colorClass = 'threat-medium';

  return (
    <div className="threat-meter">
      <div 
        className={`threat-fill ${colorClass}`} 
        style={{ width: `${percentage}%` }}
      />
    </div>
  );
}

function GameCard({ game }: { game: GameSummary }) {
  const background = BACKGROUNDS[game.background];
  const timeAgo = getTimeAgo(game.updatedAt);

  return (
    <Link href={game.isGameOver ? '#' : `/game/${game.id}`}>
      <div className={`game-card ${game.isGameOver ? 'opacity-60' : ''}`}>
        {/* Cover Image Area */}
        <div className="h-32 bg-gradient-to-br from-gray-800 to-gray-900 flex items-center justify-center">
          {game.isGameOver ? (
            <div className="text-center">
              <div className="text-4xl mb-1">☠️</div>
              <div className="text-xs text-danger uppercase tracking-wider">Game Over</div>
            </div>
          ) : (
            <div className="text-5xl opacity-20">🏚️</div>
          )}
        </div>
        
        {/* Info Area */}
        <div className="p-4">
          <h3 className="font-semibold text-lg mb-1">{game.title}</h3>
          
          <div className="text-secondary text-sm mb-3">
            {game.isGameOver ? (
              <span className="text-danger">☠ {game.characterName}</span>
            ) : (
              <span>{game.characterName}</span>
            )}
            <span className="mx-2">·</span>
            <span>{background.name}</span>
            <span className="mx-2">·</span>
            <span>{game.isGameOver ? `Died Day ${game.deathDay}` : `Day ${game.day}`}</span>
          </div>

          <div className="text-muted text-xs mb-3">
            Last played: {timeAgo}
          </div>

          {!game.isGameOver && (
            <div className="flex items-center gap-2">
              <ThreatBar threat={game.threat} />
              <span className="text-xs text-muted">Threat {game.threat}</span>
            </div>
          )}

          {game.isGameOver && (
            <div className="flex gap-2 mt-2">
              <button className="text-xs text-secondary hover:text-primary transition-colors">
                View Story
              </button>
              <span className="text-muted">·</span>
              <button className="text-xs text-secondary hover:text-danger transition-colors">
                Archive
              </button>
            </div>
          )}
        </div>
      </div>
    </Link>
  );
}

function NewGameCard() {
  return (
    <Link href="/new">
      <div className="game-card h-full min-h-[240px] flex items-center justify-center border-dashed border-2 hover:border-solid">
        <div className="text-center p-4">
          <div className="text-4xl mb-3 text-muted">+ + +</div>
          <div className="text-lg font-medium">New Game</div>
          <div className="text-sm text-muted mt-1">Start a new survival story</div>
        </div>
      </div>
    </Link>
  );
}

function getTimeAgo(date: Date): string {
  const now = new Date();
  const diff = now.getTime() - date.getTime();
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor(diff / (1000 * 60 * 60));
  const minutes = Math.floor(diff / (1000 * 60));

  if (days > 0) return `${days} day${days > 1 ? 's' : ''} ago`;
  if (hours > 0) return `${hours} hour${hours > 1 ? 's' : ''} ago`;
  if (minutes > 5) return `${minutes} minutes ago`;
  return 'Just now';
}

export default function Dashboard() {
  const router = useRouter();
  const [games, setGames] = useState<GameSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<{ email?: string } | null>(null);
  const [isConfigured, setIsConfigured] = useState(true);

  useEffect(() => {
    async function loadData() {
      // Check if Supabase is configured
      const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
      if (!supabaseUrl || supabaseUrl.includes('your-project')) {
        // Not configured, use mock data
        setIsConfigured(false);
        setGames(mockGames);
        setLoading(false);
        return;
      }

      const supabase = createClient();
      
      // Get user
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);

      if (user) {
        try {
          const games = await getGames();
          setGames(games);
        } catch (error) {
          console.error('Error loading games:', error);
          setGames([]);
        }
      }
      
      setLoading(false);
    }

    loadData();
  }, []);

  const handleLogout = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.refresh();
  };

  const activeGames = games.filter(g => !g.isGameOver);
  const completedGames = games.filter(g => g.isGameOver);

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="border-b border-subtle">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-2xl">▓▓</span>
            <h1 className="text-xl font-bold tracking-wider">INFECTED</h1>
          </div>
          <div className="flex items-center gap-4">
            {!isConfigured && (
              <span className="text-xs text-warning bg-warning/20 px-2 py-1 rounded">
                Demo Mode
              </span>
            )}
            {user ? (
              <>
                <span className="text-sm text-secondary">{user.email}</span>
                <button 
                  onClick={handleLogout}
                  className="text-secondary hover:text-primary transition-colors"
                >
                  Logout
                </button>
              </>
            ) : isConfigured ? (
              <Link href="/login" className="text-secondary hover:text-primary transition-colors">
                Sign In
              </Link>
            ) : null}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-7xl mx-auto px-6 py-8 w-full">
        {/* Title Row */}
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl font-semibold">Your Games</h2>
          <Link href="/new">
            <button className="btn btn-primary">
              + New Game
            </button>
          </Link>
        </div>

        {loading ? (
          <div className="py-8" role="status" aria-live="polite">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {/* Skeleton cards */}
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="game-card animate-pulse">
                  <div className="h-32 bg-surface-elevated" />
                  <div className="p-4 space-y-3">
                    <div className="h-5 bg-surface-elevated rounded w-3/4" />
                    <div className="h-4 bg-surface-elevated rounded w-1/2" />
                    <div className="h-3 bg-surface-elevated rounded w-1/3" />
                    <div className="h-2 bg-surface-elevated rounded" />
                  </div>
                </div>
              ))}
            </div>
            <p className="text-center text-muted mt-4">Loading your games...</p>
          </div>
        ) : (
          <>
            {/* Active Games */}
            {activeGames.length > 0 && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-12">
                {activeGames.map(game => (
                  <GameCard key={game.id} game={game} />
                ))}
                <NewGameCard />
              </div>
            )}

            {/* No Games State */}
            {activeGames.length === 0 && completedGames.length === 0 && (
              <div className="text-center py-16">
                <div className="text-6xl mb-4">🏚️</div>
                <h3 className="text-xl font-medium mb-2">No games yet</h3>
                <p className="text-secondary mb-6">Start your first survival story</p>
                <Link href="/new">
                  <button className="btn btn-primary">
                    Create Character
                  </button>
                </Link>
              </div>
            )}

            {/* Just the New Game card if no active games but have completed */}
            {activeGames.length === 0 && completedGames.length > 0 && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-12">
                <NewGameCard />
              </div>
            )}

            {/* Completed Games */}
            {completedGames.length > 0 && (
              <>
                <h3 className="text-lg font-medium text-secondary mb-4">Completed Stories</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {completedGames.map(game => (
                    <GameCard key={game.id} game={game} />
                  ))}
                </div>
              </>
            )}
          </>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-subtle mt-auto">
        <div className="max-w-7xl mx-auto px-6 py-4 text-center text-muted text-sm">
          INFECTED v1.1.0 — A survival horror TTRPG
          {!isConfigured && (
            <span className="ml-2">
              · <a href="https://github.com/hopeoverture/infected-ttrpg" className="text-gold hover:underline">GitHub</a>
            </span>
          )}
        </div>
      </footer>
    </div>
  );
}
