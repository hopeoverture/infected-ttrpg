'use client';

import { GameState, ThreatState } from '@/lib/types';

interface GameStatePanelProps {
  gameState: GameState;
  onSpendGuts: (use: string) => void;
}

function ThreatMeter({ threat, threatState }: { threat: number; threatState: ThreatState }) {
  const percentage = (threat / 10) * 100;
  let colorClass = 'threat-low';
  if (threat >= 7) colorClass = 'threat-critical';
  else if (threat >= 5) colorClass = 'threat-high';
  else if (threat >= 3) colorClass = 'threat-medium';

  const stateLabels: Record<ThreatState, string> = {
    safe: 'Safe',
    noticed: 'Distant Notice',
    investigating: '⚠ Investigation',
    encounter: '⚠ Encounter!',
    swarm: '☠ SWARM!'
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-2">
        <span className="panel-label mb-0">Threat</span>
        <span className="text-sm font-medium">{threat}/10</span>
      </div>
      <div className="threat-meter mb-2">
        <div 
          className={`threat-fill ${colorClass}`}
          style={{ width: `${percentage}%` }}
        />
      </div>
      <div className={`text-xs ${threat >= 7 ? 'text-danger' : threat >= 5 ? 'text-warning' : 'text-muted'}`}>
        {stateLabels[threatState]}
      </div>
    </div>
  );
}

function GutsMeter({ 
  guts, 
  earned, 
  onSpend 
}: { 
  guts: number; 
  earned: number;
  onSpend: (use: string) => void;
}) {
  const gutsUses = [
    { id: 'reroll', label: 'Reroll failed', desc: 'Reroll a 0-hit roll' },
    { id: 'damage', label: 'Reduce damage', desc: 'Take 2 less damage' },
    { id: 'find', label: 'Find item', desc: 'Discover something useful' },
    { id: 'enough', label: 'Just enough', desc: '1 ammo/dose/use left' },
    { id: 'stand', label: 'Last stand', desc: 'Ignore wound penalties' },
    { id: 'flashback', label: 'Flashback', desc: 'Past preparation' },
  ];

  return (
    <div>
      <div className="flex justify-between items-center mb-2">
        <span className="panel-label mb-0">Guts</span>
        <span className="text-sm font-medium">{guts}/5</span>
      </div>
      <div className="flex gap-1 mb-2">
        {[1, 2, 3, 4, 5].map(i => (
          <div 
            key={i}
            className={`guts-pip ${i <= guts ? 'guts-pip-filled' : ''}`}
          />
        ))}
      </div>
      <div className="text-xs text-muted mb-3">
        Earned: {earned}/2 this session
      </div>
      
      <details className="text-sm">
        <summary className="cursor-pointer text-gold hover:text-gold/80 transition-colors">
          Spend Guts ▼
        </summary>
        <div className="mt-2 space-y-1">
          {gutsUses.map(use => (
            <button
              key={use.id}
              onClick={() => onSpend(use.id)}
              disabled={guts < 1}
              className="w-full text-left p-2 rounded bg-card hover:bg-elevated transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <div className="text-xs font-medium">{use.label}</div>
              <div className="text-xs text-muted">{use.desc}</div>
            </button>
          ))}
        </div>
      </details>
    </div>
  );
}

function LocationInfo({ location, time, day }: { 
  location: GameState['location']; 
  time: GameState['time'];
  day: number;
}) {
  const timeEmoji = {
    night: '🌙',
    dawn: '🌅',
    day: '☀️',
    dusk: '🌆'
  };

  const lightModifiers = {
    dark: '-2/+2',
    dim: '-1/+1',
    bright: '—'
  };

  return (
    <div>
      <div className="panel-label">Location</div>
      <div className="flex items-start gap-2 mb-2">
        <span>📍</span>
        <div>
          <div className="font-medium text-sm">{location.name}</div>
          <div className="text-xs text-muted">{location.description}</div>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-2 text-xs">
        <div>
          <span className="text-muted">Light: </span>
          <span className="capitalize">{location.lightLevel}</span>
          <span className="text-muted"> ({lightModifiers[location.lightLevel]})</span>
        </div>
        <div>
          <span className="text-muted">Scarcity: </span>
          <span className="capitalize">{location.scarcity.replace('-', ' ')}</span>
        </div>
      </div>
      
      <div className="mt-3 pt-3 border-t border-subtle">
        <div className="panel-label">Time</div>
        <div className="flex items-center gap-2">
          <span>{timeEmoji[time]}</span>
          <div>
            <div className="text-sm capitalize">{time}</div>
            <div className="text-xs text-muted">Day {day}</div>
          </div>
        </div>
      </div>
    </div>
  );
}

function PartyList({ party }: { party: GameState['party'] }) {
  if (party.length === 0) return null;

  return (
    <div>
      <div className="panel-label">Party</div>
      <div className="space-y-2">
        {party.map(npc => (
          <div key={npc.id} className="flex items-start gap-2">
            <span className={npc.isAlive ? '' : 'opacity-50'}>
              {npc.isAlive ? '👤' : '☠️'}
            </span>
            <div>
              <div className="text-sm font-medium">
                {npc.name}
                {!npc.isAlive && <span className="text-danger ml-1">(Dead)</span>}
              </div>
              <div className="text-xs text-muted">{npc.status}</div>
              <div className="text-xs text-muted capitalize">
                {npc.relationship}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function ObjectivesList({ objectives }: { objectives: GameState['objectives'] }) {
  return (
    <div>
      <div className="panel-label">Objectives</div>
      <div className="space-y-2">
        {objectives.map(obj => (
          <div 
            key={obj.id} 
            className={`flex items-start gap-2 text-sm ${obj.completed ? 'text-muted line-through' : ''}`}
          >
            <span>{obj.completed ? '☑' : '☐'}</span>
            <span>{obj.text}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function SessionStats({ gameState }: { gameState: GameState }) {
  const sessionDuration = Math.floor((Date.now() - gameState.sessionStartTime.getTime()) / 1000 / 60);

  return (
    <div>
      <div className="panel-label">Session</div>
      <div className="grid grid-cols-2 gap-2 text-xs text-muted">
        <div>⏱ {sessionDuration} min</div>
        <div>🎲 {gameState.rollCount} rolls</div>
        <div>☠ {gameState.killCount} kills</div>
      </div>
    </div>
  );
}

export default function GameStatePanel({ gameState, onSpendGuts }: GameStatePanelProps) {
  return (
    <div className="p-4 space-y-6">
      <ThreatMeter threat={gameState.threat} threatState={gameState.threatState} />
      
      <div className="border-t border-subtle pt-4">
        <LocationInfo 
          location={gameState.location} 
          time={gameState.time}
          day={gameState.day}
        />
      </div>
      
      <div className="border-t border-subtle pt-4">
        <GutsMeter 
          guts={gameState.character.guts} 
          earned={gameState.character.gutsEarnedThisSession}
          onSpend={onSpendGuts}
        />
      </div>
      
      {gameState.party.length > 0 && (
        <div className="border-t border-subtle pt-4">
          <PartyList party={gameState.party} />
        </div>
      )}
      
      <div className="border-t border-subtle pt-4">
        <ObjectivesList objectives={gameState.objectives} />
      </div>
      
      <div className="border-t border-subtle pt-4">
        <SessionStats gameState={gameState} />
      </div>
    </div>
  );
}
