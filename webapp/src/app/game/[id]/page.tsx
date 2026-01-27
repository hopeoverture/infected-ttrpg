'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { 
  GameState, 
  Message, 
  BACKGROUNDS,
  RollResult
} from '@/lib/types';
import { rollDicePool, formatRollResult } from '@/lib/game-engine/dice';

// Components
import CharacterPanel from '@/components/game/CharacterPanel';
import GameStatePanel from '@/components/game/GameStatePanel';
import DiceRoll from '@/components/game/DiceRoll';

// Mock initial game state - replace with actual loading
const createMockGameState = (): GameState => ({
  id: '1',
  title: 'The Long Road',
  createdAt: new Date(),
  updatedAt: new Date(),
  character: {
    id: 'char-1',
    name: 'Marcus Chen',
    background: 'soldier',
    motivation: 'Find my sister',
    attributes: { grit: 3, reflex: 3, wits: 3, nerve: 3 },
    skills: {
      brawl: 2, endure: 1, athletics: 1,
      shoot: 3, stealth: 1, drive: 0,
      notice: 1, craft: 0, tech: 0, medicine: 0, survival: 0, knowledge: 0,
      persuade: 1, deceive: 0, resolve: 1, intimidate: 0, animals: 0
    },
    wounds: { bruised: 0, bleeding: 1, broken: 0, critical: false },
    woundCapacity: { bruised: 5, bleeding: 3, broken: 2, critical: 1 },
    stress: 0,
    maxStress: 6,
    guts: 3,
    gutsEarnedThisSession: 0,
    inventory: [
      { id: '1', name: 'Med kit', quantity: 2, isSignificant: true },
      { id: '2', name: 'Radio', quantity: 1, isSignificant: true },
      { id: '3', name: 'Flashlight', quantity: 1, isSignificant: true },
    ],
    weapons: [
      { 
        id: 'w1', 
        name: 'Pistol', 
        damage: 3, 
        range: 'Close/Med', 
        noise: 5, 
        properties: ['One-Handed', 'Loud'],
        durability: 5,
        maxDurability: 5,
        ammo: 12,
        maxAmmo: 15
      },
      {
        id: 'w2',
        name: 'Combat Knife',
        damage: 2,
        range: 'Melee',
        noise: 1,
        properties: ['Fast', 'Quiet'],
        durability: 4,
        maxDurability: 4
      }
    ],
    armor: {
      name: 'Light Armor',
      reduction: 2,
      stealthPenalty: 1,
      durability: 4,
      maxDurability: 4
    },
    carryingCapacity: 7,
    food: 2,
    water: 1
  },
  day: 14,
  time: 'night',
  location: {
    name: 'Riverside Pharmacy',
    description: 'A ransacked drugstore on the outskirts of town',
    lightLevel: 'dim',
    scarcity: 'sparse',
    ambientThreat: 3,
    searched: false
  },
  threat: 7,
  threatState: 'investigating',
  party: [
    { id: 'npc1', name: 'Elena', relationship: 'trusted', status: 'Sick - needs antibiotics', isAlive: true }
  ],
  objectives: [
    { id: 'obj1', text: 'Find antibiotics for Elena', completed: false },
    { id: 'obj2', text: 'Return to the safehouse', completed: false },
    { id: 'obj3', text: 'Reach the pharmacy', completed: true }
  ],
  messages: [
    {
      id: 'msg1',
      role: 'gm',
      content: `The pharmacy's back door hangs open, creaking in the wind. Through the gap you can see overturned shelves and scattered pills. The smell hits you — antiseptic and something worse.

Elena grips your arm. "Medicine's in the back," she whispers. "But that smell..."

From somewhere inside, glass shatters.

**What do you do?**`,
      timestamp: new Date()
    }
  ],
  combatState: null,
  sessionStartTime: new Date(),
  rollCount: 0,
  killCount: 0
});

const QUICK_ACTIONS = [
  { icon: '🔍', label: 'Search', action: 'I want to search the area carefully.' },
  { icon: '👂', label: 'Listen', action: 'I stop and listen carefully for any sounds.' },
  { icon: '🤫', label: 'Sneak', action: 'I try to move quietly and stay hidden.' },
  { icon: '⚔️', label: 'Attack', action: 'I attack!' },
  { icon: '🗣️', label: 'Talk', action: 'I try to communicate.' },
  { icon: '🏃', label: 'Run', action: 'I run!' },
];

export default function GameSession({ params }: { params: Promise<{ id: string }> }) {
  const [gameState, setGameState] = useState<GameState | null>(null);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [currentRoll, setCurrentRoll] = useState<RollResult | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // TODO: Load actual game state
    setGameState(createMockGameState());
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [gameState?.messages]);

  const handleSubmit = async (action: string) => {
    if (!action.trim() || !gameState || isLoading) return;

    // Add player message
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

    setInput('');
    setIsLoading(true);

    // Simulate AI response (replace with actual AI call)
    setTimeout(() => {
      // Example: If action mentions sneaking, do a stealth roll
      if (action.toLowerCase().includes('sneak') || action.toLowerCase().includes('quiet')) {
        const rollResult = rollDicePool(gameState.character.attributes.reflex + gameState.character.skills.stealth + 1); // +1 for dim light
        setCurrentRoll(rollResult);

        const gmResponse: Message = {
          id: `msg-${Date.now() + 1}`,
          role: 'gm',
          content: rollResult.totalHits >= 2 
            ? `You press yourself against the wall and edge toward the back of the pharmacy. Your footsteps are silent on the debris-covered floor.

Through the shadows, you spot it — a single infected, hunched over something near the pharmacy counter. It hasn't noticed you.

The controlled substances cabinet is just past it. So are the antibiotics Elena needs.

**The infected is 10 feet away. Unaware. What's your move?**`
            : `You try to move quietly, but your boot crunches on broken glass. The sound seems impossibly loud in the silence.

From the back of the pharmacy, you hear movement. Something is coming to investigate.

**+2 Threat. You have seconds to decide — hide, run, or prepare to fight.**`,
          timestamp: new Date(),
          roll: rollResult
        };

        setGameState(prev => prev ? {
          ...prev,
          messages: [...prev.messages, gmResponse],
          threat: rollResult.totalHits >= 2 ? prev.threat : Math.min(10, prev.threat + 2),
          rollCount: prev.rollCount + 1
        } : null);
      } else {
        // Generic response
        const gmResponse: Message = {
          id: `msg-${Date.now() + 1}`,
          role: 'gm',
          content: `*The AI GM would respond here based on your action.*

For now, this is a placeholder. The full implementation would:
1. Parse your action
2. Determine if a roll is needed
3. Apply game rules
4. Generate atmospheric narrative
5. Update game state

**What do you do next?**`,
          timestamp: new Date()
        };

        setGameState(prev => prev ? {
          ...prev,
          messages: [...prev.messages, gmResponse]
        } : null);
      }

      setIsLoading(false);
    }, 1500);
  };

  if (!gameState) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-muted">Loading...</div>
      </div>
    );
  }

  return (
    <div className="h-screen flex flex-col">
      {/* Header */}
      <header className="border-b border-subtle flex-shrink-0">
        <div className="px-4 py-3 flex items-center justify-between">
          <Link href="/" className="text-secondary hover:text-primary transition-colors">
            ← Dashboard
          </Link>
          <h1 className="font-semibold">
            {gameState.title} — Day {gameState.day}
          </h1>
          <div className="flex items-center gap-3">
            <button className="text-secondary hover:text-primary transition-colors text-sm">
              ⚙ Settings
            </button>
            <button className="text-secondary hover:text-primary transition-colors text-sm">
              📖 Rules
            </button>
          </div>
        </div>
      </header>

      {/* Main Content - Three Column Layout */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Panel - Character Sheet */}
        <div className="w-64 border-r border-subtle overflow-y-auto flex-shrink-0 hidden lg:block">
          <CharacterPanel character={gameState.character} />
        </div>

        {/* Center Panel - Narrative */}
        <div className="flex-1 flex flex-col min-w-0">
          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
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
                </div>
              </div>
            ))}
            
            {isLoading && (
              <div className="message message-gm animate-pulse">
                <div className="text-muted">The GM is thinking...</div>
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
                >
                  ➤
                </button>
              </div>
            </form>

            {/* Quick Actions */}
            <div className="flex flex-wrap gap-2">
              {QUICK_ACTIONS.map((qa) => (
                <button
                  key={qa.label}
                  onClick={() => handleSubmit(qa.action)}
                  disabled={isLoading}
                  className="quick-action disabled:opacity-50"
                >
                  <span>{qa.icon}</span>
                  <span>{qa.label}</span>
                </button>
              ))}
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
    </div>
  );
}
