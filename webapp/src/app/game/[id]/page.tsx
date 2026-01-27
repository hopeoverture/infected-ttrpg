'use client';

import { useState, useEffect, useRef, use, useCallback } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Message, RollResult } from '@/lib/types';

// Components
import CharacterPanel from '@/components/game/CharacterPanel';
import GameStatePanel from '@/components/game/GameStatePanel';
import DiceRoll from '@/components/game/DiceRoll';
import SceneImage from '@/components/game/SceneImage';
import AudioNarration, { MuteToggle } from '@/components/game/AudioNarration';
import { GameErrorBoundary } from '@/components/ErrorBoundary';
import QuickActions, { QuickActionsRef } from '@/components/game/QuickActions';
import CombatTracker from '@/components/game/CombatTracker';
import MobileNav, { CharacterMiniStatus, MobileTab } from '@/components/game/MobileNav';
import SettingsPanel, { GameSettings, DEFAULT_SETTINGS } from '@/components/game/SettingsPanel';
import SaveIndicator from '@/components/game/SaveIndicator';
import KeyboardHelpOverlay from '@/components/game/KeyboardHelpOverlay';
import BreakingPointModal from '@/components/game/BreakingPointModal';
import InfectionCheckModal from '@/components/game/InfectionCheckModal';
import DeathSceneModal from '@/components/game/DeathSceneModal';

// Hooks
import { useGameSession, GMApiResponse } from '@/hooks/useGameSession';
import { useAudioNarration } from '@/hooks/useAudioNarration';
import { useKeyboardShortcuts } from '@/hooks/useKeyboardShortcuts';
import { useSaveStatus } from '@/hooks/useSaveStatus';

// Game engine
import { rollBreakingPoint, rollInfectionCheck } from '@/lib/game-engine/dice';

// Types
type GutsUse = 'reroll' | 'damage' | 'find' | 'enough' | 'stand' | 'flashback';
type ModalRollType = 'breaking' | 'infection' | null;

export default function GameSession({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const router = useRouter();
  
  // UI State
  const [input, setInput] = useState('');
  const [mobileTab, setMobileTab] = useState<MobileTab>('story');
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [settings, setSettings] = useState<GameSettings>(() => {
    if (typeof window === 'undefined') return DEFAULT_SETTINGS;
    try {
      const saved = localStorage.getItem('infected-settings');
      return saved ? JSON.parse(saved) : DEFAULT_SETTINGS;
    } catch {
      return DEFAULT_SETTINGS;
    }
  });
  const [currentSceneDescription, setCurrentSceneDescription] = useState<string | null>(null);
  const [sceneImageUrl, setSceneImageUrl] = useState<string | null>(null);
  const [lastRoll, setLastRoll] = useState<RollResult | null>(null);
  
  // Modal State
  const [breakingPointOpen, setBreakingPointOpen] = useState(false);
  const [infectionCheckOpen, setInfectionCheckOpen] = useState(false);
  const [infectionContext, setInfectionContext] = useState('');
  const [deathOpen, setDeathOpen] = useState(false);
  const [deathCause, setDeathCause] = useState('');
  
  // Modal dice rolling state
  const [modalRollResult, setModalRollResult] = useState<RollResult | null>(null);
  const [modalRollType, setModalRollType] = useState<ModalRollType>(null);
  const [infectionOutcome, setInfectionOutcome] = useState<{ outcome: string; symptomsIn: number; turnedIn?: number } | null>(null);
  const [breakingOutcome, setBreakingOutcome] = useState<{ outcome: string; stressCleared: number } | null>(null);
  
  // Refs
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const lastGMMessageIdRef = useRef<string | null>(null);
  const quickActionsRef = useRef<QuickActionsRef>(null);

  // Game Session Hook
  const {
    gameState,
    isLoading,
    loadError,
    aiError,
    setAiError,
    submitAction,
    saveGameState,
    updateLocalState
  } = useGameSession({
    gameId: resolvedParams.id,
    onGMResponse: handleGMResponse,
    onSceneChange: (description) => {
      setCurrentSceneDescription(description);
      setSceneImageUrl(null);
    }
  });

  // Audio Narration Hook
  const {
    isMuted,
    toggleMute,
    audioState,
    playAudio,
    stopAudio,
    togglePlayback,
  } = useAudioNarration();

  // Save Status Hook
  const {
    status: saveStatus,
    lastSaved,
    markDirty
  } = useSaveStatus({
    onSave: async () => {
      if (gameState) {
        await saveGameState(gameState);
      }
    },
    debounceMs: 3000
  });

  // Keyboard Shortcuts Hook
  const { showHelp, setShowHelp } = useKeyboardShortcuts({
    onSubmit: () => handleSubmit(input),
    onEscape: () => {
      if (settingsOpen) setSettingsOpen(false);
      else if (breakingPointOpen) setBreakingPointOpen(false);
      else if (infectionCheckOpen) setInfectionCheckOpen(false);
      else setInput('');
    },
    onQuickAction: (index) => quickActionsRef.current?.triggerAction(index),
    onToggleAudio: () => {
      // Toggle current playing audio or replay last GM message
      if (audioState.isPlaying) {
        stopAudio();
      } else if (gameState?.messages.length) {
        const lastGM = [...gameState.messages].reverse().find(m => m.role === 'gm');
        if (lastGM) {
          playAudio(lastGM.content, lastGM.id);
        }
      }
    },
    onToggleMute: toggleMute,
    enabled: !deathOpen
  });

  // Handle GM Response - check for special events
  function handleGMResponse(response: GMApiResponse) {
    // Track roll for combat
    if (response.roll?.result) {
      setLastRoll(response.roll.result);
    }

    // Check for breaking point
    if (response.breakingPoint) {
      setModalRollResult(null);
      setModalRollType('breaking');
      setBreakingOutcome(null);
      setBreakingPointOpen(true);
    }

    // Check for infection
    if (response.infectionCheck) {
      setModalRollResult(null);
      setModalRollType('infection');
      setInfectionOutcome(null);
      setInfectionContext(response.narrative);
      setInfectionCheckOpen(true);
    }

    // Check for death (critical wound when already at critical)
    if (gameState?.character.wounds.critical && response.stateChanges?.wounds?.type === 'critical') {
      setDeathCause(response.narrative);
      setDeathOpen(true);
    }
  }

  // Handle modal dice rolling
  const handleModalRoll = useCallback(() => {
    if (!gameState) return;

    if (modalRollType === 'breaking') {
      const result = rollBreakingPoint(
        gameState.character.attributes.nerve,
        gameState.character.skills.resolve
      );
      setModalRollResult(result.result);
      setBreakingOutcome({
        outcome: result.outcome,
        stressCleared: result.stressCleared
      });

      // Apply stress reduction after a delay for UI
      setTimeout(() => {
        const stressReduction = result.stressCleared === Infinity 
          ? gameState.character.stress 
          : result.stressCleared;
        const newStress = Math.max(0, gameState.character.stress - stressReduction);
        
        updateLocalState({
          character: {
            ...gameState.character,
            stress: newStress
          }
        });
        saveGameState({
          character: {
            ...gameState.character,
            stress: newStress
          }
        });
        markDirty();
      }, 2000);
    } else if (modalRollType === 'infection') {
      const result = rollInfectionCheck(
        gameState.character.attributes.grit,
        gameState.character.skills.endure
      );
      setModalRollResult(result.result);
      setInfectionOutcome({
        outcome: result.outcome,
        symptomsIn: result.symptomsIn,
        turnedIn: result.turnedIn
      });

      // If infected, add a system message and potentially trigger death
      if (result.outcome === 'infected') {
        setTimeout(() => {
          const infectionMsg: Message = {
            id: `msg-${Date.now()}`,
            role: 'system',
            content: `☣️ **INFECTED** — You can feel it spreading through your veins. Symptoms in ${result.symptomsIn} minutes. Turning in ${result.turnedIn} minutes. Find antibiotics or say goodbye.`,
            timestamp: new Date()
          };
          updateLocalState({
            messages: [...gameState.messages, infectionMsg]
          });
        }, 2500);
      } else if (result.outcome === 'fighting') {
        setTimeout(() => {
          const fightingMsg: Message = {
            id: `msg-${Date.now()}`,
            role: 'system',
            content: `⚠️ **FIGHTING IT** — Your body is fighting the infection. Symptoms will appear in ${result.symptomsIn} minutes. Antibiotics can still save you.`,
            timestamp: new Date()
          };
          updateLocalState({
            messages: [...gameState.messages, fightingMsg]
          });
        }, 2500);
      }
    }
  }, [gameState, modalRollType, updateLocalState, saveGameState, markDirty]);

  // Handle modal guts reroll
  const handleModalGutsReroll = useCallback(() => {
    if (!gameState || gameState.character.guts < 1) return;

    // Spend guts
    const updatedCharacter = {
      ...gameState.character,
      guts: gameState.character.guts - 1
    };
    updateLocalState({ character: updatedCharacter });
    saveGameState({ character: updatedCharacter });
    markDirty();

    // Clear current result and re-roll
    setModalRollResult(null);
    setBreakingOutcome(null);
    setInfectionOutcome(null);
    
    // Small delay then roll again
    setTimeout(() => {
      handleModalRoll();
    }, 500);
  }, [gameState, updateLocalState, saveGameState, markDirty, handleModalRoll]);

  // Handle closing modals
  const handleBreakingPointClose = useCallback(() => {
    setBreakingPointOpen(false);
    setModalRollResult(null);
    setModalRollType(null);
    setBreakingOutcome(null);
  }, []);

  const handleInfectionCheckClose = useCallback(() => {
    setInfectionCheckOpen(false);
    setModalRollResult(null);
    setModalRollType(null);
    setInfectionOutcome(null);
  }, []);

  // Scroll to bottom on new messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [gameState?.messages]);

  // Auto-play new GM messages
  useEffect(() => {
    if (!gameState?.messages?.length || isMuted) return;
    
    const lastMessage = gameState.messages[gameState.messages.length - 1];
    
    if (
      lastMessage &&
      lastMessage.role === 'gm' && 
      lastMessage.id !== lastGMMessageIdRef.current
    ) {
      lastGMMessageIdRef.current = lastMessage.id;
      playAudio(lastMessage.content, lastMessage.id);
    }
  }, [gameState?.messages, isMuted, playAudio]);

  // Handle scene image generation
  const handleSceneImageGenerated = useCallback((url: string) => {
    setSceneImageUrl(url);
    if (gameState) {
      const updatedLocation = {
        ...gameState.location,
        sceneImageUrl: url
      };
      updateLocalState({ location: updatedLocation });
      saveGameState({ location: updatedLocation });
      markDirty();
    }
  }, [gameState, updateLocalState, saveGameState, markDirty]);

  // Handle spending guts
  const handleSpendGuts = useCallback((use: GutsUse | string) => {
    if (!gameState || gameState.character.guts < 1) return;
    
    const gutsUse = use as GutsUse;
    
    const updatedCharacter = {
      ...gameState.character,
      guts: gameState.character.guts - 1
    };

    let effectMessage = '';
    let additionalPrompt = '';
    
    switch (gutsUse) {
      case 'reroll':
        effectMessage = '🎲 **Guts Spent: Reroll!** Your next failed roll can be rerolled.';
        break;
        
      case 'damage': {
        const wounds = { ...updatedCharacter.wounds };
        if (wounds.bleeding > 0) wounds.bleeding -= 1;
        else if (wounds.bruised > 0) wounds.bruised -= 1;
        updatedCharacter.wounds = wounds;
        effectMessage = '🛡️ **Guts Spent: Reduce Damage!** You shrug off some of the pain.';
        break;
      }
        
      case 'find':
        effectMessage = '🔍 **Guts Spent: Lucky Find!** Describe what you\'re looking for.';
        additionalPrompt = '[GUTS ACTIVE: Find Item] ';
        break;
        
      case 'enough':
        effectMessage = '🎯 **Guts Spent: Just Enough!** You have exactly what you need.';
        additionalPrompt = '[GUTS ACTIVE: Just Enough] ';
        break;
        
      case 'stand':
        effectMessage = '💀 **Guts Spent: Last Stand!** You push through the pain.';
        additionalPrompt = '[GUTS ACTIVE: Last Stand] ';
        break;
        
      case 'flashback':
        effectMessage = '💭 **Guts Spent: Flashback!** Describe a past preparation.';
        additionalPrompt = '[GUTS ACTIVE: Flashback] ';
        break;
        
      default:
        effectMessage = '🔥 **Guts Spent!**';
    }

    if (additionalPrompt) {
      setInput(additionalPrompt);
      inputRef.current?.focus();
    }

    const gutsMessage: Message = {
      id: `msg-${Date.now()}`,
      role: 'system',
      content: effectMessage,
      timestamp: new Date()
    };

    updateLocalState({
      character: updatedCharacter,
      messages: [...gameState.messages, gutsMessage]
    });

    saveGameState({ character: updatedCharacter });
    markDirty();
  }, [gameState, updateLocalState, saveGameState, markDirty]);

  // Handle submit action
  const handleSubmit = useCallback(async (action: string) => {
    if (!action.trim() || !gameState || isLoading) return;
    
    stopAudio();
    setInput('');
    await submitAction(action);
    markDirty();
  }, [gameState, isLoading, stopAudio, submitAction, markDirty]);

  // Handle quick action trigger
  const handleQuickAction = useCallback((action: string) => {
    handleSubmit(action);
  }, [handleSubmit]);

  // Loading state
  if (!gameState && !loadError) {
    return (
      <div className="min-h-screen flex items-center justify-center" role="status" aria-live="polite">
        <div className="text-center">
          <div className="text-4xl mb-4 animate-pulse" aria-hidden="true">🏚️</div>
          <div className="text-muted">Loading game...</div>
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

  if (!gameState) return null;

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
          <div className="flex items-center gap-2">
            <h1 className="font-semibold">
              {gameState.title} — Day {gameState.day}
            </h1>
            <SaveIndicator status={saveStatus} lastSaved={lastSaved} />
          </div>
          <div className="flex items-center gap-3">
            <MuteToggle isMuted={isMuted} onToggle={toggleMute} />
            <button 
              onClick={() => setSettingsOpen(true)}
              className="text-secondary hover:text-primary transition-colors text-sm"
              aria-label="Open game settings"
            >
              ⚙️
            </button>
            <button 
              onClick={() => setShowHelp(true)}
              className="text-secondary hover:text-primary transition-colors text-sm"
              aria-label="Keyboard shortcuts"
            >
              ⌨️
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
          <div className="flex gap-2">
            <button 
              onClick={() => handleSubmit(input || 'retry')}
              className="text-red-200 hover:text-white underline"
            >
              Retry
            </button>
            <button 
              onClick={() => setAiError(null)}
              className="text-red-200 hover:text-white"
              aria-label="Dismiss error message"
            >
              ✕
            </button>
          </div>
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
          {gameState.location && settings.autoGenerateImages && (
            <div className="p-4 pb-0">
              <SceneImage
                sceneDescription={currentSceneDescription}
                locationName={gameState.location.name}
                timeOfDay={gameState.time}
                mood={gameState.threatState === 'safe' ? 'safe' : gameState.threatState === 'encounter' || gameState.threatState === 'swarm' ? 'dangerous' : 'tense'}
                artStyle={gameState.character.artStyle}
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
                  ref={inputRef}
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

            {/* Combat Tracker */}
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

            {/* Quick Actions */}
            <div className="hidden md:block" role="group" aria-label="Quick actions">
              <QuickActions
                ref={quickActionsRef}
                gameState={gameState}
                onAction={handleQuickAction}
                disabled={isLoading}
                maxActions={6}
              />
            </div>
            
            <div className="md:hidden" role="group" aria-label="Quick actions">
              <QuickActions
                gameState={gameState}
                onAction={handleQuickAction}
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
            onSpendGuts={handleSpendGuts}
          />
        </div>
      </div>
      
      {/* Mobile Tab Content Overlays */}
      {mobileTab !== 'story' && (
        <div className="fixed inset-0 z-40 md:hidden">
          <div 
            className="absolute inset-0 bg-black/50"
            onClick={() => setMobileTab('story')}
          />
          <div className="absolute bottom-16 left-0 right-0 max-h-[70vh] bg-bg-surface border-t border-subtle overflow-y-auto animate-slide-up">
            {mobileTab === 'character' && (
              <CharacterPanel character={gameState.character} />
            )}
            {mobileTab === 'world' && (
              <GameStatePanel 
                gameState={gameState}
                onSpendGuts={handleSpendGuts}
              />
            )}
            {mobileTab === 'log' && (
              <div className="p-4">
                <h3 className="panel-label mb-3">Message Log</h3>
                <div className="space-y-2 max-h-96 overflow-y-auto">
                  {gameState.messages.slice(-20).reverse().map((msg) => (
                    <div key={msg.id} className="text-sm border-b border-subtle pb-2">
                      <div className="flex justify-between text-xs text-muted mb-1">
                        <span className="uppercase">{msg.role}</span>
                        <span>{msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                      </div>
                      <div className="text-secondary line-clamp-2">{msg.content}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
      
      {/* Mobile Navigation */}
      <MobileNav
        activeTab={mobileTab}
        onTabChange={setMobileTab}
        character={gameState.character}
        threat={gameState.threat}
      />
      
      {/* Modals */}
      <SettingsPanel
        isOpen={settingsOpen}
        onClose={() => setSettingsOpen(false)}
        settings={settings}
        onSave={(newSettings) => {
          setSettings(newSettings);
          localStorage.setItem('infected-settings', JSON.stringify(newSettings));
        }}
      />

      <KeyboardHelpOverlay
        isOpen={showHelp}
        onClose={() => setShowHelp(false)}
      />

      <BreakingPointModal
        isOpen={breakingPointOpen}
        onClose={handleBreakingPointClose}
        stressLevel={gameState.character.stress}
        maxStress={gameState.character.maxStress}
        rollResult={modalRollResult}
        onRollDice={handleModalRoll}
        onSpendGuts={handleModalGutsReroll}
        canSpendGuts={gameState.character.guts > 0}
        outcome={breakingOutcome}
      />

      <InfectionCheckModal
        isOpen={infectionCheckOpen}
        onClose={handleInfectionCheckClose}
        context={infectionContext}
        rollResult={modalRollResult}
        onRollDice={handleModalRoll}
        onSpendGuts={handleModalGutsReroll}
        canSpendGuts={gameState.character.guts > 0}
        outcome={infectionOutcome}
      />

      <DeathSceneModal
        isOpen={deathOpen}
        character={gameState.character}
        deathCause={deathCause}
        stats={{
          daysSurvived: gameState.day,
          killCount: gameState.killCount,
          rollCount: gameState.rollCount,
          gutsSpent: 5 - gameState.character.guts + gameState.character.gutsEarnedThisSession
        }}
        onViewStory={() => {
          router.push(`/game/${resolvedParams.id}/summary`);
        }}
        onReturn={() => router.push('/')}
      />
    </div>
    </GameErrorBoundary>
  );
}
