/**
 * useGameSession - Custom hook for managing game session state and actions
 * Extracted from the game page to improve code organization
 */

import { useState, useCallback, useRef, useEffect } from 'react';
import { 
  GameState, 
  Message, 
  RollResult,
  GMStateChanges
} from '@/lib/types';
import { getGame, updateGame, addMessage } from '@/lib/supabase/games';

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
  setAiError: (error: string | null) => void;
  submitAction: (action: string) => Promise<void>;
  saveGameState: (updates: Partial<GameState>) => Promise<void>;
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
  const gameIdRef = useRef(gameId);

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

  // Save game state to Supabase
  const saveGameState = useCallback(async (updates: Partial<GameState>) => {
    try {
      await updateGame(gameIdRef.current, updates);
    } catch (err) {
      console.error('Failed to save game state:', err);
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
    setAiError,
    submitAction,
    saveGameState,
    updateLocalState
  };
}
