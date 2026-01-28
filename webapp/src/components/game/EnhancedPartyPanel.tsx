'use client';

import { useState } from 'react';
import { NPC, isFullNPC, PartyMember } from '@/lib/types';
import { FullNPC, getAttitudeColor } from '@/lib/types/full-npc';

interface EnhancedPartyPanelProps {
  party: PartyMember[];
  onNPCClick?: (npc: PartyMember) => void;
}

function AttitudeIndicator({ attitude }: { attitude: FullNPC['attitude'] }) {
  const colorClass = getAttitudeColor(attitude.level);
  const percentage = ((attitude.score + 100) / 200) * 100;

  return (
    <div className="mt-1">
      <div className="flex items-center gap-2">
        <div className="flex-1 h-1.5 bg-surface rounded-full overflow-hidden">
          <div
            className={`h-full transition-all ${colorClass.replace('text-', 'bg-')}`}
            style={{ width: `${percentage}%` }}
          />
        </div>
        <span className={`text-xs capitalize ${colorClass}`}>
          {attitude.level}
        </span>
      </div>
      {attitude.reasons.length > 0 && (
        <div className="text-xs text-muted mt-0.5 italic">
          {attitude.reasons[attitude.reasons.length - 1]}
        </div>
      )}
    </div>
  );
}

function NPCStats({ npc }: { npc: FullNPC }) {
  const woundTotal = npc.wounds.bruised + npc.wounds.bleeding + npc.wounds.broken;
  const hasWounds = woundTotal > 0 || npc.wounds.critical;

  return (
    <div className="grid grid-cols-2 gap-2 text-xs">
      {/* Attributes */}
      <div>
        <div className="text-muted uppercase tracking-wider text-[10px] mb-1">Attributes</div>
        <div className="grid grid-cols-2 gap-x-3 gap-y-0.5">
          <div>GRIT: <span className="text-primary">{npc.attributes.grit}</span></div>
          <div>REF: <span className="text-primary">{npc.attributes.reflex}</span></div>
          <div>WITS: <span className="text-primary">{npc.attributes.wits}</span></div>
          <div>NERVE: <span className="text-primary">{npc.attributes.nerve}</span></div>
        </div>
      </div>

      {/* Status */}
      <div>
        <div className="text-muted uppercase tracking-wider text-[10px] mb-1">Status</div>
        <div className="space-y-0.5">
          <div>
            Stress: <span className="text-primary">{npc.stress}/{npc.maxStress}</span>
          </div>
          {hasWounds && (
            <div className="text-danger">
              Wounds: {npc.wounds.critical ? 'CRITICAL' : `${woundTotal}`}
            </div>
          )}
          <div className="capitalize">{npc.status}</div>
        </div>
      </div>
    </div>
  );
}

function NPCEquipment({ npc }: { npc: FullNPC }) {
  if (npc.weapons.length === 0 && !npc.armor && npc.inventory.length === 0) {
    return null;
  }

  return (
    <div className="text-xs">
      <div className="text-muted uppercase tracking-wider text-[10px] mb-1">Equipment</div>
      {npc.weapons.length > 0 && (
        <div className="mb-1">
          <span className="text-muted">Weapons: </span>
          {npc.weapons.map(w => w.name).join(', ')}
        </div>
      )}
      {npc.armor && (
        <div className="mb-1">
          <span className="text-muted">Armor: </span>
          {npc.armor.name}
        </div>
      )}
      {npc.inventory.length > 0 && (
        <div>
          <span className="text-muted">Items: </span>
          {npc.inventory.slice(0, 3).map(i => i.name).join(', ')}
          {npc.inventory.length > 3 && ` +${npc.inventory.length - 3} more`}
        </div>
      )}
    </div>
  );
}

function NPCPersonalityPreview({ npc }: { npc: FullNPC }) {
  return (
    <div className="text-xs">
      <div className="text-muted uppercase tracking-wider text-[10px] mb-1">Personality</div>
      <div className="flex flex-wrap gap-1">
        {npc.personality.traits.slice(0, 3).map((trait, i) => (
          <span key={i} className="px-1.5 py-0.5 bg-surface rounded text-muted">
            {trait}
          </span>
        ))}
      </div>
      {npc.currentGoals.length > 0 && (
        <div className="mt-1">
          <span className="text-muted">Goal: </span>
          {npc.currentGoals[0]}
        </div>
      )}
    </div>
  );
}

function LegacyNPCCard({ npc, onClick }: { npc: NPC; onClick?: () => void }) {
  return (
    <button
      onClick={onClick}
      className="w-full text-left p-3 bg-card rounded-lg border border-subtle hover:border-muted transition-all"
    >
      <div className="flex items-start gap-2">
        <span className={npc.isAlive ? '' : 'opacity-50'}>
          {npc.isAlive ? '👤' : '☠️'}
        </span>
        <div className="flex-1 min-w-0">
          <div className="font-medium text-sm flex items-center gap-2">
            {npc.name}
            {!npc.isAlive && <span className="text-danger text-xs">(Dead)</span>}
          </div>
          <div className="text-xs text-muted capitalize">{npc.relationship}</div>
          <div className="text-xs text-muted">{npc.status}</div>
        </div>
      </div>
    </button>
  );
}

function FullNPCCard({
  npc,
  isExpanded,
  onClick
}: {
  npc: FullNPC;
  isExpanded: boolean;
  onClick: () => void;
}) {
  const statusColor = {
    healthy: 'text-success',
    wounded: 'text-warning',
    critical: 'text-danger',
    infected: 'text-purple-400',
    turned: 'text-danger',
    dead: 'text-muted'
  };

  return (
    <div
      className={`bg-card rounded-lg border transition-all cursor-pointer overflow-hidden ${
        isExpanded ? 'border-primary ring-1 ring-primary/20' : 'border-subtle hover:border-muted'
      }`}
    >
      {/* Header - always visible */}
      <button
        onClick={onClick}
        className="w-full text-left p-3"
      >
        <div className="flex items-start gap-2">
          <span className={npc.isAlive ? '' : 'opacity-50'}>
            {npc.isAlive ? '👤' : '☠️'}
          </span>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <span className="font-medium text-sm">{npc.name}</span>
              {npc.nickname && (
                <span className="text-xs text-muted">&quot;{npc.nickname}&quot;</span>
              )}
              {!npc.isAlive && <span className="text-danger text-xs">(Dead)</span>}
            </div>
            <div className="text-xs text-muted">{npc.role}</div>
            <div className={`text-xs ${statusColor[npc.status]}`}>
              {npc.statusDetails || npc.status}
            </div>
            <AttitudeIndicator attitude={npc.attitude} />
          </div>
          <span className="text-muted text-lg">
            {isExpanded ? '▼' : '▶'}
          </span>
        </div>
      </button>

      {/* Expanded content */}
      {isExpanded && (
        <div className="border-t border-subtle p-3 space-y-3 bg-surface/50">
          <NPCStats npc={npc} />
          <NPCEquipment npc={npc} />
          <NPCPersonalityPreview npc={npc} />

          {/* First met */}
          <div className="text-xs text-muted pt-2 border-t border-subtle">
            Met on Day {npc.firstMet.day} at {npc.firstMet.location}
          </div>

          {/* Significant events */}
          {npc.significantEvents.length > 0 && (
            <div className="text-xs">
              <div className="text-muted uppercase tracking-wider text-[10px] mb-1">Recent Events</div>
              <ul className="space-y-0.5">
                {npc.significantEvents.slice(-2).map((event, i) => (
                  <li key={i} className="text-muted">
                    Day {event.day}: {event.description}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default function EnhancedPartyPanel({ party, onNPCClick }: EnhancedPartyPanelProps) {
  const [expandedId, setExpandedId] = useState<string | null>(null);

  if (party.length === 0) {
    return (
      <div className="text-center text-muted text-sm py-4">
        No party members yet
      </div>
    );
  }

  const aliveMembers = party.filter(npc => npc.isAlive);
  const deadMembers = party.filter(npc => !npc.isAlive);

  return (
    <div className="space-y-3">
      {/* Alive members */}
      {aliveMembers.map((npc) => {
        if (isFullNPC(npc)) {
          return (
            <FullNPCCard
              key={npc.id}
              npc={npc}
              isExpanded={expandedId === npc.id}
              onClick={() => {
                setExpandedId(expandedId === npc.id ? null : npc.id);
                onNPCClick?.(npc);
              }}
            />
          );
        }
        return (
          <LegacyNPCCard
            key={npc.id}
            npc={npc}
            onClick={() => onNPCClick?.(npc)}
          />
        );
      })}

      {/* Dead members (collapsed by default) */}
      {deadMembers.length > 0 && (
        <details className="mt-4">
          <summary className="text-xs text-muted cursor-pointer hover:text-secondary">
            Fallen ({deadMembers.length})
          </summary>
          <div className="mt-2 space-y-2 opacity-60">
            {deadMembers.map((npc) => {
              if (isFullNPC(npc)) {
                return (
                  <FullNPCCard
                    key={npc.id}
                    npc={npc}
                    isExpanded={expandedId === npc.id}
                    onClick={() => setExpandedId(expandedId === npc.id ? null : npc.id)}
                  />
                );
              }
              return <LegacyNPCCard key={npc.id} npc={npc} />;
            })}
          </div>
        </details>
      )}
    </div>
  );
}
