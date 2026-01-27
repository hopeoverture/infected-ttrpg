'use client';

import { useState, useEffect, useRef, use, useCallback } from 'react';
import Link from 'next/link';
// import { useRouter } from 'next/navigation';
import { 
  GameState, 
  Message, 
  RollResult,
  ThreatState,
  TimeOfDay,
  LightLevel,
  Scarcity
} from '@/lib/types';
import { getGame, updateGame, addMessage } from '@/lib/supabase/games';

// Components
import CharacterPanel from '@/components/game/CharacterPanel';
import GameStatePanel from '@/components/game/GameStatePanel';
import DiceRoll from '@/components/game/DiceRoll';
import SceneImage from '@/components/game/SceneImage';
import AudioNarration, { MuteToggle } from '@/components/game/AudioNarration';
import { GameErrorBoundary } from '@/components/ErrorBoundary';
import QuickActions from '@/components/game/QuickActions';
import CombatTracker from '@/components/game/CombatTracker';
import MobileNav, { CharacterMiniStatus, MobileTab } from '@/components/game/MobileNav';

// Hooks
import { useAudioNarration } from '@/hooks/useAudioNarration';

// Types for GM API responses
interface GMStateChanges {
  threat?: number | null;
  threatState?: ThreatState | null;
  stress?: number | null;
  wounds?: { type: 'bruised' | 'bleeding' | 'broken' | 'critical'; change: number } | null;
  guts?: number | null;
  location?: {
    name: string;
    description: string;
    lightLevel: LightLevel;
    scarcity: Scarcity;
    ambientThreat: number;
  } | null;
  time?: TimeOfDay | null;
  day?: number | null;
  inventory?: { add?: string[]; remove?: string[] } | null;
  objectives?: { add?: string[]; complete?: string[] } | null;
}

interface GMApiResponse {
  narrative: string;
  stateChanges: GMStateChanges;
  roll: {
    type: string;
    attribute: string;
    skill: string;
    modifier?: number;
    reason?: string;
    result?: RollResult;
    description?: string;
  } | null;
  combatStarted?: boolean;
  infectionCheck?: boolean;
  breakingPoint?: boolean;
  sceneChanged?: boolean;
  sceneDescription?: string | null;
  error?: string;
  details?: string;
}

export default function GameSession({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const [gameState, setGameState] = useState<GameState | null>(null);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [aiError, setAiError] = useState<string | null>(null);
  const [currentSceneDescription, setCurrentSceneDescription] = useState<string | null>(null);
  const [sceneImageUrl, setSceneImageUrl] = useState<string | null>(null);
  const [mobileTab, setMobileTab] = useState<MobileTab>('story');
  const [lastRoll, setLastRoll] = useState<RollResult | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const gameIdRef = useRef<string>(resolvedParams.id);
  const lastGMMessageIdRef = useRef<string | null>(null);
  
  // Audio narration hook
  const {
    isMuted,
    toggleMute,
    audioState,
    playAudio,
    stopAudio,
    togglePlayback,
  } = useAudioNarration();

  // Load game from Supabase
  useEffect(() => {
    async function loadGame() {
      try {
        const game = await getGame(gameIdRef.current);
        if (!game) {
          setLoadError('Game not found');
          return;
        }
        setGameState(game);
      } catch (err) {
        console.error('Failed to load game:', err);
        setLoadError(err instanceof Error ? err.message : 'Failed to load game');
      }
    }
    loadGame();
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [gameState?.messages]);

  // Auto-play new GM messages
  useEffect(() => {
    if (!gameState?.messages?.length || isMuted) return;
    
    const lastMessage = gameState.messages[gameState.messages.length - 1];
    
    // Only auto-play GM messages that we haven't played yet
    if (
      lastMessage &&
      lastMessage.role === 'gm' && 
      lastMessage.id !== lastGMMessageIdRef.current
    ) {
      lastGMMessageIdRef.current = lastMessage.id;
      playAudio(lastMessage.content, lastMessage.id);
    }
  }, [gameState?.messages, isMuted, playAudio]);

  // Save game state to Supabase
  const saveGameState = useCallback(async (updates: Partial<GameState>) => {
    try {
      await updateGame(gameIdRef.current, updates);
    } catch (err) {
      console.error('Failed to save game state:', err);
    }
  }, []);

  // Handle scene image generation completion
  const handleSceneImageGenerated = useCallback((url: string) => {
    setSceneImageUrl(url);
    // Cache the scene image URL in game state
    if (gameState) {
      const updatedLocation = {
        ...gameState.location,
        sceneImageUrl: url
      };
      setGameState(prev => prev ? {
        ...prev,
        location: updatedLocation
      } : null);
      saveGameState({ location: updatedLocation });
    }
  }, [gameState, saveGameState]);

  // Apply state changes from GM response
  const applyStateChanges = useCallback((changes: GMStateChanges, currentState: GameState): Partial<GameState> => {
    const updates: Partial<GameState> = {};

    if (changes.threat !== null && changes.threat !== undefined) {
      updates.threat = Math.max(0, Math.min(10, changes.threat));
    }

    if (changes.threatState) {
      updates.threatState = changes.threatState;
    }

    if (changes.stress !== null && changes.stress !== undefined) {
      updates.character = {
        ...currentState.character,
        stress: Math.max(0, Math.min(currentState.character.maxStress, changes.stress))
      };
    }

    if (changes.wounds) {
      const woundType = changes.wounds.type;
      const change = changes.wounds.change;
      updates.character = {
        ...(updates.character || currentState.character),
        wounds: {
          ...currentState.character.wounds,
          [woundType]: woundType === 'critical' 
            ? change > 0 
            : Math.max(0, currentState.character.wounds[woundType] + change)
        }
      };
    }

    if (changes.guts !== null && changes.guts !== undefined) {
      updates.character = {
        ...(updates.character || currentState.character),
        guts: Math.max(0, Math.min(5, currentState.character.guts + changes.guts))
      };
    }

    if (changes.location) {
      updates.location = {
        ...currentState.location,
        ...changes.location,
        searched: false,
        sceneImageUrl: undefined // Clear on location change
      };
    }

    if (changes.time) {
      updates.time = changes.time;
    }

    if (changes.day !== null && changes.day !== undefined) {
      updates.day = changes.day;
    }

    if (changes.inventory) {
      const currentInventory = [...currentState.character.inventory];
      
      // Add items
      if (changes.inventory.add) {
        for (const itemName of changes.inventory.add) {
          const existing = currentInventory.find(i => i.name.toLowerCase() === itemName.toLowerCase());
          if (existing) {
            existing.quantity += 1;
          } else {
            currentInventory.push({
              id: `item-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
              name: itemName,
              quantity: 1,
              isSignificant: true
            });
          }
        }
      }
      
      // Remove items
      if (changes.inventory.remove) {
        for (const itemName of changes.inventory.remove) {
          const idx = currentInventory.findIndex(i => i.name.toLowerCase() === itemName.toLowerCase());
          const item = currentInventory[idx];
          if (idx !== -1 && item) {
            item.quantity -= 1;
            if (item.quantity <= 0) {
              currentInventory.splice(idx, 1);
            }
          }
        }
      }

      updates.character = {
        ...(updates.character || currentState.character),
        inventory: currentInventory
      };
    }

    if (changes.objectives) {
      const currentObjectives = [...currentState.objectives];
      
      // Add objectives
      if (changes.objectives.add) {
        for (const objText of changes.objectives.add) {
          if (!currentObjectives.some(o => o.text.toLowerCase() === objText.toLowerCase())) {
            currentObjectives.push({
              id: `obj-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
              text: objText,
              completed: false
            });
          }
        }
      }
      
      // Complete objectives
      if (changes.objectives.complete) {
        for (const objText of changes.objectives.complete) {
          const obj = currentObjectives.find(o => 
            o.text.toLowerCase().includes(objText.toLowerCase()) ||
            objText.toLowerCase().includes(o.text.toLowerCase())
          );
          if (obj) {
            obj.completed = true;
          }
        }
      }

      updates.objectives = currentObjectives;
    }

    return updates;
  }, []);

  // Call the GM API
  const callGM = useCallback(async (action: string, rollResult?: RollResult): Promise<GMApiResponse> => {
    const response = await fetch('/api/gm', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        action,
        gameState,
        rollResult,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || `API error: ${response.status}`);
    }

    return response.json();
  }, [gameState]);

  const handleSubmit = async (action: string) => {
    if (!action.trim() || !gameState || isLoading) return;

    // Stop any current narration when player takes action
    stopAudio();
    
    setInput('');
    setIsLoading(true);
    setAiError(null);

    // Add player message optimistically
    const playerMessage: Message = {
      id: `msg-${Date.now()}`,
      role: 'player',
      content: action,
      timestamp: new Date()
    };

    setGameState(prev => prev ? {
      ...prev,
      messages: [...prev.messages, playerMessage]
    } : null);

    // Save player message to database
    try {
      await addMessage(gameIdRef.current, 'player', action);
    } catch (err) {
      console.error('Failed to save player message:', err);
    }

    try {
      // Call the AI GM
      const gmResponse = await callGM(action);

      if (gmResponse.error) {
        throw new Error(gmResponse.error);
      }

      // Apply state changes
      const stateUpdates = applyStateChanges(gmResponse.stateChanges, gameState);

      // Handle scene changes for image generation
      if (gmResponse.sceneChanged && gmResponse.sceneDescription) {
        setCurrentSceneDescription(gmResponse.sceneDescription);
        setSceneImageUrl(null); // Clear cached image to trigger regeneration
      }

      // Track last roll for combat tracker
      if (gmResponse.roll?.result) {
        setLastRoll(gmResponse.roll.result);
      }

      // Create GM message
      const gmMessage: Message = {
        id: `msg-${Date.now() + 1}`,
        role: 'gm',
        content: gmResponse.narrative,
        timestamp: new Date(),
        roll: gmResponse.roll?.result
      };

      // Calculate new roll count
      const newRollCount = gmResponse.roll?.result 
        ? gameState.rollCount + 1 
        : gameState.rollCount;

      // Update local state
      setGameState(prev => prev ? {
        ...prev,
        ...stateUpdates,
        messages: [...prev.messages, gmMessage],
        rollCount: newRollCount,
        character: stateUpdates.character || prev.character,
        objectives: stateUpdates.objectives || prev.objectives,
      } : null);

      // Save to database
      try {
        await addMessage(gameIdRef.current, 'gm', gmResponse.narrative, gmResponse.roll?.result);
        await saveGameState({
          ...stateUpdates,
          rollCount: newRollCount
        });
      } catch (err) {
        console.error('Failed to save GM response:', err);
      }

    } catch (err) {
      console.error('GM API error:', err);
      const errorMessage = err instanceof Error ? err.message : 'Failed to get GM response';
      setAiError(errorMessage);
      
      // Add error message to chat
      const errorMsg: Message = {
        id: `msg-${Date.now() + 1}`,
        role: 'system',
        content: `**Error:** ${errorMessage}\n\n*The GM is having trouble responding. Check that your API keys are configured in .env.local*`,
        timestamp: new Date()
      };

      setGameState(prev => prev ? {
        ...prev,
        messages: [...prev.messages, errorMsg]
      } : null);
    } finally {
      setIsLoading(false);
    }
  };

  // Loading state with skeleton
  if (!gameState && !loadError) {
    return (
      <div className="min-h-screen flex items-center justify-center" role="status" aria-live="polite">
        <div className="text-center">
          <div className="text-4xl mb-4 animate-pulse" aria-hidden="true">🏚️</div>
          <div className="text-muted">Loading game...</div>
          {/* Skeleton preview */}
          <div className="mt-8 w-80 space-y-3">
            <div className="h-4 bg-surface-elevated rounded animate-pulse" />
            <div className="h-4 bg-surface-elevated rounded animate-pulse w-3/4" />
            <div className="h-4 bg-surface-elevated rounded animate-pulse w-1/2" />
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (loadError) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center max-w-md">
          <div className="text-4xl mb-4">⚠️</div>
          <h2 className="text-xl font-semibold mb-2">Failed to Load Game</h2>
          <p className="text-muted mb-6">{loadError}</p>
          <Link href="/" className="btn btn-primary">
            Return to Dashboard
          </Link>
        </div>
      </div>
    );
  }

  if (!gameState) {
    return null;
  }

  return (
    <GameErrorBoundary>
    <div className="h-screen flex flex-col">
      {/* Header */}
      <header className="border-b border-subtle flex-shrink-0">
        <div className="px-4 py-3 flex items-center justify-between">
          <Link 
            href="/" 
            className="text-secondary hover:text-primary transition-colors"
            aria-label="Return to dashboard"
          >
            ← Dashboard
          </Link>
          <h1 className="font-semibold">
            {gameState.title} — Day {gameState.day}
          </h1>
          <div className="flex items-center gap-3">
            <MuteToggle isMuted={isMuted} onToggle={toggleMute} />
            <button 
              className="text-secondary hover:text-primary transition-colors text-sm"
              aria-label="Open game settings"
            >
              ⚙ Settings
            </button>
            <button 
              className="text-secondary hover:text-primary transition-colors text-sm"
              aria-label="View game rules"
            >
              📖 Rules
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Character Mini Status */}
      <CharacterMiniStatus character={gameState.character} threat={gameState.threat} />

      {/* AI Error Banner */}
      {aiError && (
        <div 
          className="bg-red-900/30 border-b border-red-700 px-4 py-2 text-sm text-red-200 flex items-center justify-between"
          role="alert"
          aria-live="assertive"
        >
          <span>⚠️ GM Error: {aiError}</span>
          <button 
            onClick={() => setAiError(null)}
            className="text-red-200 hover:text-white"
            aria-label="Dismiss error message"
          >
            ✕
          </button>
        </div>
      )}

      {/* Main Content - Three Column Layout */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Panel - Character Sheet */}
        <div className="w-64 border-r border-subtle overflow-y-auto flex-shrink-0 hidden lg:block">
          <CharacterPanel character={gameState.character} />
        </div>

        {/* Center Panel - Narrative */}
        <div className="flex-1 flex flex-col min-w-0">
          {/* Scene Image */}
          {gameState.location && (
            <div className="p-4 pb-0">
              <SceneImage
                sceneDescription={currentSceneDescription}
                locationName={gameState.location.name}
                timeOfDay={gameState.time}
                mood={gameState.threatState === 'safe' ? 'safe' : gameState.threatState === 'encounter' || gameState.threatState === 'swarm' ? 'dangerous' : 'tense'}
                cachedImageUrl={sceneImageUrl || gameState.location.sceneImageUrl}
                onImageGenerated={handleSceneImageGenerated}
                autoGenerate={!!currentSceneDescription}
              />
            </div>
          )}

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 md:pb-4 mobile-content-padding">
            {gameState.messages.map((message) => (
              <div key={message.id} className="animate-fade-in">
                <div className={`message ${
                  message.role === 'gm' ? 'message-gm' : 
                  message.role === 'player' ? 'message-player' : 
                  'message-system'
                }`}>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-medium uppercase tracking-wider text-muted">
                      {message.role === 'gm' ? 'Game Master' : message.role === 'player' ? 'You' : 'System'}
                    </span>
                    <span className="text-xs text-muted">
                      {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                  <div className="prose prose-invert prose-sm max-w-none whitespace-pre-wrap">
                    {message.content}
                  </div>
                  {message.roll && (
                    <div className="mt-3">
                      <DiceRoll result={message.roll} />
                    </div>
                  )}
                  
                  {/* Audio narration controls for GM messages */}
                  {message.role === 'gm' && (
                    <div className="mt-3 pt-2 border-t border-subtle">
                      <AudioNarration
                        messageId={message.id}
                        text={message.content}
                        isGM={true}
                        isMuted={isMuted}
                        isPlaying={audioState.isPlaying && audioState.currentMessageId === message.id}
                        isLoading={audioState.isLoading && audioState.currentMessageId === message.id}
                        isCurrentMessage={audioState.currentMessageId === message.id}
                        onTogglePlay={togglePlayback}
                      />
                    </div>
                  )}
                </div>
              </div>
            ))}
            
            {isLoading && (
              <div className="message message-gm animate-pulse">
                <div className="flex items-center gap-2 text-muted">
                  <span className="inline-block w-2 h-2 bg-accent rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></span>
                  <span className="inline-block w-2 h-2 bg-accent rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></span>
                  <span className="inline-block w-2 h-2 bg-accent rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></span>
                  <span className="ml-2">The GM is thinking...</span>
                </div>
              </div>
            )}
            
            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <div className="border-t border-subtle p-4 flex-shrink-0">
            <form onSubmit={(e) => { e.preventDefault(); handleSubmit(input); }}>
              <div className="flex gap-2 mb-3">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="What do you do?"
                  className="input flex-1"
                  disabled={isLoading}
                />
                <button 
                  type="submit" 
                  disabled={isLoading || !input.trim()}
                  className="btn btn-primary disabled:opacity-50"
                  aria-label="Submit action"
                >
                  ➤
                </button>
              </div>
            </form>

            {/* Combat Tracker (shows when in combat/encounter) */}
            {(gameState.threatState === 'encounter' || gameState.threatState === 'swarm') && (
              <div className="mb-3">
                <CombatTracker
                  isActive={true}
                  character={gameState.character}
                  threat={gameState.threat}
                  lastRoll={lastRoll}
                />
              </div>
            )}

            {/* Context-Aware Quick Actions */}
            <div className="hidden md:block" role="group" aria-label="Quick actions">
              <QuickActions
                gameState={gameState}
                onAction={handleSubmit}
                disabled={isLoading}
                maxActions={6}
              />
            </div>
            
            {/* Mobile Quick Actions (compact) */}
            <div className="md:hidden" role="group" aria-label="Quick actions">
              <QuickActions
                gameState={gameState}
                onAction={handleSubmit}
                disabled={isLoading}
                maxActions={4}
              />
            </div>
          </div>
        </div>

        {/* Right Panel - Game State */}
        <div className="w-64 border-l border-subtle overflow-y-auto flex-shrink-0 hidden md:block">
          <GameStatePanel 
            gameState={gameState}
            onSpendGuts={(use) => {
              console.log('Spending guts:', use);
              // TODO: Implement guts spending
            }}
          />
        </div>
      </div>
      
      {/* Mobile Navigation */}
      <MobileNav
        activeTab={mobileTab}
        onTabChange={setMobileTab}
        character={gameState.character}
        threat={gameState.threat}
      />
    </div>
    </GameErrorBoundary>
  );
}
