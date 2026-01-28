/**
 * useGameSession - Custom hook for managing game session state and actions
 * Extracted from the game page to improve code organization
 */

import { useState, useCallback, useRef, useEffect } from 'react';
import {
  GameState,
  Message,
  RollResult,
  GMStateChanges,
  isFullNPC
} from '@/lib/types';
import { FullNPC } from '@/lib/types/full-npc';
import { DialogSegment } from '@/lib/types/voice';
import { getGame, updateGame, addMessage } from '@/lib/supabase/games';

export type SaveStatus = 'idle' | 'saving' | 'saved' | 'error';

// Debounce delay for non-critical updates (ms)
const DEBOUNCE_DELAY = 500;

// Helper to determine attitude level from score
function getAttitudeLevel(score: number): 'hostile' | 'suspicious' | 'neutral' | 'friendly' | 'trusted' {
  if (score <= -60) return 'hostile';
  if (score <= -20) return 'suspicious';
  if (score <= 20) return 'neutral';
  if (score <= 60) return 'friendly';
  return 'trusted';
}

// Determine if state changes require immediate save
function requiresImmediateSave(changes: GMStateChanges): boolean {
  // Wounds, deaths, kills need immediate save
  if (changes.wounds) return true;
  if (changes.kills && changes.kills > 0) return true;

  // Check for critical party changes
  if (changes.party && Array.isArray(changes.party)) {
    for (const partyChange of changes.party) {
      if (partyChange.action === 'die' || partyChange.action === 'turn' ||
          partyChange.action === 'join' || partyChange.action === 'leave') {
        return true;
      }
      // Wound updates to NPCs
      if (partyChange.updates?.wounds) return true;
    }
  }

  return false;
}

export interface AudioCues {
  music?: string | null;
  soundEffects?: string[];
}

export interface SuggestedOption {
  text: string;
  type: 'exploration' | 'social' | 'combat' | 'stealth' | 'other';
}

export interface GMApiResponse {
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
  audio?: AudioCues | null;
  dialogSegments?: DialogSegment[];
  suggestedOptions?: SuggestedOption[];
  error?: string;
  details?: string;
}

interface UseGameSessionOptions {
  gameId: string;
  onGMResponse?: (response: GMApiResponse) => void;
  onSceneChange?: (description: string) => void;
}

interface UseGameSessionReturn {
  gameState: GameState | null;
  isLoading: boolean;
  loadError: string | null;
  aiError: string | null;
  saveStatus: SaveStatus;
  setAiError: (error: string | null) => void;
  submitAction: (action: string) => Promise<void>;
  saveGameState: (updates: Partial<GameState>, immediate?: boolean) => Promise<void>;
  flushPendingSaves: () => Promise<void>;
  updateLocalState: (updates: Partial<GameState>) => void;
}

export function useGameSession({
  gameId,
  onGMResponse,
  onSceneChange
}: UseGameSessionOptions): UseGameSessionReturn {
  const [gameState, setGameState] = useState<GameState | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [aiError, setAiError] = useState<string | null>(null);
  const [saveStatus, setSaveStatus] = useState<SaveStatus>('idle');
  const gameIdRef = useRef(gameId);

  // Debounced save refs
  const pendingUpdates = useRef<Partial<GameState>>({});
  const saveTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const saveStatusTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

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

    // Cleanup pending saves on unmount
    return () => {
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current);
      }
      if (saveStatusTimeoutRef.current) {
        clearTimeout(saveStatusTimeoutRef.current);
      }
    };
  }, []);

  // Flush pending saves immediately (can be called before navigation)
  const flushPendingSaves = useCallback(async () => {
    if (saveTimeoutRef.current) {
      clearTimeout(saveTimeoutRef.current);
      saveTimeoutRef.current = null;
    }

    if (Object.keys(pendingUpdates.current).length > 0) {
      const updates = { ...pendingUpdates.current };
      pendingUpdates.current = {};

      setSaveStatus('saving');
      try {
        await updateGame(gameIdRef.current, updates);
        setSaveStatus('saved');
      } catch (err) {
        console.error('Failed to flush pending saves:', err);
        setSaveStatus('error');
      }
    }
  }, []);

  // Save game state to Supabase with optional debouncing
  const saveGameState = useCallback(async (updates: Partial<GameState>, immediate = false) => {
    // Merge with pending updates
    pendingUpdates.current = { ...pendingUpdates.current, ...updates };

    // Clear existing debounce timeout
    if (saveTimeoutRef.current) {
      clearTimeout(saveTimeoutRef.current);
      saveTimeoutRef.current = null;
    }

    // Clear save status timeout
    if (saveStatusTimeoutRef.current) {
      clearTimeout(saveStatusTimeoutRef.current);
      saveStatusTimeoutRef.current = null;
    }

    const performSave = async () => {
      const toSave = { ...pendingUpdates.current };
      pendingUpdates.current = {};

      if (Object.keys(toSave).length === 0) return;

      setSaveStatus('saving');

      try {
        await updateGame(gameIdRef.current, toSave);
        setSaveStatus('saved');

        // Reset to idle after 2 seconds
        saveStatusTimeoutRef.current = setTimeout(() => {
          setSaveStatus('idle');
        }, 2000);
      } catch (err) {
        console.error('Failed to save game state:', err);
        setSaveStatus('error');
      }
    };

    if (immediate) {
      // Save immediately for critical updates
      await performSave();
    } else {
      // Debounce non-critical updates
      setSaveStatus('saving');
      saveTimeoutRef.current = setTimeout(performSave, DEBOUNCE_DELAY);
    }
  }, []);

  // Update local state without saving
  const updateLocalState = useCallback((updates: Partial<GameState>) => {
    setGameState(prev => prev ? { ...prev, ...updates } : null);
  }, []);

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
        sceneImageUrl: undefined
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

    // Handle kill count
    if (changes.kills !== null && changes.kills !== undefined && changes.kills > 0) {
      updates.killCount = currentState.killCount + changes.kills;
    }

    // Handle party member updates (enhanced NPC system)
    if (changes.party && Array.isArray(changes.party)) {
      const currentParty = [...currentState.party];

      for (const partyChange of changes.party) {
        const existingIndex = currentParty.findIndex(p => p.id === partyChange.id);

        if (partyChange.action === 'join' && partyChange.fullData) {
          // New NPC joining with full data
          if (existingIndex === -1) {
            currentParty.push(partyChange.fullData as FullNPC);
          }
        } else if (partyChange.action === 'leave' && existingIndex !== -1) {
          // NPC leaving party
          currentParty.splice(existingIndex, 1);
        } else if (partyChange.action === 'die' && existingIndex !== -1) {
          // NPC death
          const existing = currentParty[existingIndex];
          if (existing && isFullNPC(existing)) {
            currentParty[existingIndex] = {
              ...existing,
              isAlive: false,
              status: 'dead' as const
            };
          } else if (existing) {
            currentParty[existingIndex] = {
              ...existing,
              isAlive: false
            };
          }
        } else if (partyChange.action === 'turn' && existingIndex !== -1) {
          // NPC turned (infected)
          const existing = currentParty[existingIndex];
          if (existing && isFullNPC(existing)) {
            currentParty[existingIndex] = {
              ...existing,
              isAlive: false,
              status: 'turned' as const
            };
          }
        } else if (partyChange.updates && existingIndex !== -1) {
          // Update existing NPC
          const existing = currentParty[existingIndex];
          if (existing && isFullNPC(existing)) {
            const updated = { ...existing };

            // Apply attitude changes
            if (partyChange.updates.attitude) {
              const newScore = Math.max(-100, Math.min(100,
                updated.attitude.score + partyChange.updates.attitude.change
              ));
              const newLevel = getAttitudeLevel(newScore);
              updated.attitude = {
                level: newLevel,
                score: newScore,
                reasons: [...updated.attitude.reasons, partyChange.updates.attitude.reason].slice(-5)
              };
            }

            // Apply wound changes
            if (partyChange.updates.wounds) {
              const woundType = partyChange.updates.wounds.type as keyof typeof updated.wounds;
              if (woundType === 'critical') {
                updated.wounds = { ...updated.wounds, critical: partyChange.updates.wounds.change > 0 };
              } else {
                updated.wounds = {
                  ...updated.wounds,
                  [woundType]: Math.max(0, (updated.wounds[woundType] as number) + partyChange.updates.wounds.change)
                };
              }
            }

            // Apply status change
            if (partyChange.updates.status) {
              updated.status = partyChange.updates.status as FullNPC['status'];
            }

            // Apply inventory changes
            if (partyChange.updates.inventory) {
              const npcInventory = [...updated.inventory];
              if (partyChange.updates.inventory.add) {
                for (const itemName of partyChange.updates.inventory.add) {
                  npcInventory.push({
                    id: `item-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
                    name: itemName,
                    quantity: 1,
                    isSignificant: false
                  });
                }
              }
              if (partyChange.updates.inventory.remove) {
                for (const itemName of partyChange.updates.inventory.remove) {
                  const idx = npcInventory.findIndex(i => i.name.toLowerCase() === itemName.toLowerCase());
                  if (idx !== -1) {
                    npcInventory.splice(idx, 1);
                  }
                }
              }
              updated.inventory = npcInventory;
            }

            // Reveal secrets
            if (partyChange.updates.secrets?.reveal) {
              // Mark revealed secrets somehow (could add a revealed field)
            }

            currentParty[existingIndex] = updated;
          }
        }
      }

      updates.party = currentParty;
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

  // Submit player action
  const submitAction = useCallback(async (action: string) => {
    if (!action.trim() || !gameState || isLoading) return;

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
      const gmResponse = await callGM(action);

      if (gmResponse.error) {
        throw new Error(gmResponse.error);
      }

      // Handle callbacks
      if (onGMResponse) {
        onGMResponse(gmResponse);
      }

      if (gmResponse.sceneChanged && gmResponse.sceneDescription && onSceneChange) {
        onSceneChange(gmResponse.sceneDescription);
      }

      // Apply state changes
      const stateUpdates = applyStateChanges(gmResponse.stateChanges, gameState);

      // Create GM message
      const gmMessage: Message = {
        id: `msg-${Date.now() + 1}`,
        role: 'gm',
        content: gmResponse.narrative,
        timestamp: new Date(),
        roll: gmResponse.roll?.result
      };

      const newRollCount = gmResponse.roll?.result 
        ? gameState.rollCount + 1 
        : gameState.rollCount;
      
      const newKillCount = stateUpdates.killCount ?? gameState.killCount;

      // Update local state
      setGameState(prev => prev ? {
        ...prev,
        ...stateUpdates,
        messages: [...prev.messages, gmMessage],
        rollCount: newRollCount,
        killCount: newKillCount,
        character: stateUpdates.character || prev.character,
        objectives: stateUpdates.objectives || prev.objectives,
      } : null);

      // Save to database
      try {
        await addMessage(gameIdRef.current, 'gm', gmResponse.narrative, gmResponse.roll?.result);

        // Determine if this needs immediate save (wounds, deaths, combat, etc.)
        const immediate = requiresImmediateSave(gmResponse.stateChanges);
        await saveGameState({
          ...stateUpdates,
          rollCount: newRollCount,
          killCount: newKillCount
        }, immediate);
      } catch (err) {
        console.error('Failed to save GM response:', err);
      }

    } catch (err) {
      console.error('GM API error:', err);
      const errorMessage = err instanceof Error ? err.message : 'Failed to get GM response';
      setAiError(errorMessage);
      
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
  }, [gameState, isLoading, callGM, applyStateChanges, saveGameState, onGMResponse, onSceneChange]);

  return {
    gameState,
    isLoading,
    loadError,
    aiError,
    saveStatus,
    setAiError,
    submitAction,
    saveGameState,
    flushPendingSaves,
    updateLocalState
  };
}
